// Export Utilities for TPV Studio
// SVG, PNG, DXF, and PDF exports

import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
// RH Palette - inline to avoid file loading issues in serverless
export const RH_PALETTE_DATA = [
  { code: "RH30", name: "Beige", hex: "#E4C4AA" },
  { code: "RH31", name: "Cream", hex: "#E8E3D8" },
  { code: "RH41", name: "Bright Yellow", hex: "#FFD833" },
  { code: "RH40", name: "Mustard", hex: "#E5A144" },
  { code: "RH50", name: "Orange", hex: "#F15B32" },
  { code: "RH01", name: "Standard Red", hex: "#A5362F" },
  { code: "RH02", name: "Bright Red", hex: "#E21F2F" },
  { code: "RH90", name: "Funky Pink", hex: "#E8457E" },
  { code: "RH21", name: "Purple", hex: "#493D8C" },
  { code: "RH20", name: "Standard Blue", hex: "#0075BC" },
  { code: "RH22", name: "Light Blue", hex: "#47AFE3" },
  { code: "RH23", name: "Azure", hex: "#039DC4" },
  { code: "RH26", name: "Turquoise", hex: "#00A6A3" },
  { code: "RH12", name: "Dark Green", hex: "#006C55" },
  { code: "RH10", name: "Standard Green", hex: "#609B63" },
  { code: "RH11", name: "Bright Green", hex: "#3BB44A" },
  { code: "RH32", name: "Brown", hex: "#8B5F3C" },
  { code: "RH65", name: "Pale Grey", hex: "#D9D9D6" },
  { code: "RH61", name: "Light Grey", hex: "#939598" },
  { code: "RH60", name: "Dark Grey", hex: "#59595B" },
  { code: "RH70", name: "Black", hex: "#231F20" }
];

// Create palette Map<'RH50', '#F15B32'>
export const RH_PALETTE = new Map();
for (const color of RH_PALETTE_DATA) {
  RH_PALETTE.set(color.code, color.hex);
}

export function loadPalette() {
  return RH_PALETTE;
}

/**
 * Convert polygon points to SVG path string
 */
export function pointsToPath(points) {
  if (!points || points.length === 0) return '';

  const pathParts = points.map((p, i) => {
    const command = i === 0 ? 'M' : 'L';
    return `${command} ${p.x.toFixed(3)},${p.y.toFixed(3)}`;
  });

  pathParts.push('Z'); // Close path

  return pathParts.join(' ');
}

/**
 * Export design to SVG
 * @param {Array} regions - Generated regions with points and colors
 * @param {Object} surface - Surface dimensions
 * @param {Object} metadata - Design metadata
 * @param {Array} palette - Palette from LayoutSpec (with code, role, target_ratio)
 */
export function exportSVG(regions, surface, metadata = {}, palette = null) {
  const { width_m, height_m } = surface;
  const paletteMap = loadPalette();

  // Log palette being used
  if (palette && palette.length > 0) {
    const paletteInfo = palette.map(p => {
      const hex = paletteMap.get(p.code);
      return `${p.code}=${hex} (${p.role})`;
    }).join(', ');
    console.log('[SVG EXPORT] Rendering with palette:', paletteInfo);
  }

  // Get base color for background (first palette entry with role='base')
  let baseColor = null;
  if (palette && palette.length > 0) {
    const baseEntry = palette.find(p => p.role === 'base') || palette[0];
    baseColor = baseEntry.code;

    // Strict RH code resolution - throw error if not found
    if (!paletteMap.has(baseColor)) {
      throw new Error(`Unknown RH code: ${baseColor}. Available codes: ${Array.from(paletteMap.keys()).join(', ')}`);
    }

    const baseHex = paletteMap.get(baseColor);
    console.log(`[SVG EXPORT] Painted base layer with ${baseColor} (${baseHex})`);
  }

  // Group regions by color
  const layersByColor = {};
  for (const region of regions) {
    const color = region.color;

    // Strict RH code resolution - throw error if not found
    if (!color) {
      throw new Error('Region missing color property');
    }
    if (!paletteMap.has(color)) {
      throw new Error(`Unknown RH code: ${color}. Available codes: ${Array.from(paletteMap.keys()).join(', ')}`);
    }

    if (!layersByColor[color]) {
      layersByColor[color] = [];
    }
    layersByColor[color].push(region);
  }

  // Build SVG with layers
  const layers = [];

  // ALWAYS paint base layer first as full-surface rectangle
  if (baseColor) {
    const baseHex = paletteMap.get(baseColor);
    layers.push(
      `  <g id="layer-base" data-color="${baseColor}" data-role="base">\n    <rect x="0" y="0" width="${width_m}" height="${height_m}" fill="${baseHex}" />\n  </g>`
    );
  }

  // Add shape layers on top of base
  for (const [color, colorRegions] of Object.entries(layersByColor)) {
    const hexColor = paletteMap.get(color);
    const role = palette?.find(p => p.code === color)?.role || 'unknown';

    const paths = colorRegions.map(region =>
      `    <path d="${pointsToPath(region.points)}" fill="${hexColor}" />`
    ).join('\n');

    layers.push(
      `  <g id="layer-${color}" data-color="${color}" data-role="${role}">\n${paths}\n  </g>`
    );
  }

  // Build complete SVG
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${width_m}m"
     height="${height_m}m"
     viewBox="0 0 ${width_m} ${height_m}"
     data-tpv-studio="1.0"
     data-title="${metadata.title || 'TPV Design'}"
     data-variant="${metadata.variant || 1}">
  <title>${metadata.title || 'TPV Design'}</title>
  <desc>Generated by TPV Studio - Rosehill Group</desc>

  ${layers.join('\n\n')}
</svg>`;

  return svg;
}

/**
 * Export SVG as PNG using sharp
 */
export async function exportPNG(svgContent, width = 1200) {
  try {
    const pngBuffer = await sharp(Buffer.from(svgContent))
      .resize(width, null, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toBuffer();

    return pngBuffer;
  } catch (error) {
    console.error('[EXPORT PNG] Error:', error);
    throw new Error(`PNG export failed: ${error.message}`);
  }
}

/**
 * DXF Export Stub
 * Returns basic DXF header for now
 */
export function exportDXF(regions, surface) {
  // Week 1 MVP: Basic stub
  // Full implementation would use dxf-writer or similar
  const { width_m, height_m } = surface;

  const dxf = `0
SECTION
2
HEADER
9
$INSUNITS
70
4
0
ENDSEC
0
SECTION
2
ENTITIES
999
TPV Studio Export - R2013 Format
999
Surface: ${width_m}m x ${height_m}m
999
Regions: ${regions.length}
0
ENDSEC
0
EOF`;

  return dxf;
}

/**
 * PDF Export Stub
 * Returns basic PDF metadata for now
 */
export function exportPDF(regions, surface, bom) {
  // Week 1 MVP: Basic stub
  // Full implementation would use pdfkit
  return {
    format: 'pdf',
    surface: `${surface.width_m}m x ${surface.height_m}m`,
    regions: regions.length,
    bom: bom,
    note: 'Full PDF export with installation plan coming in Week 2'
  };
}

/**
 * Generate storage path with lifecycle awareness
 * @param {string} filename - File name
 * @param {string} lifecycle - 'draft' | 'temp' | 'final'
 * @param {string} jobId - Job ID for organizing related files
 * @returns {string} Storage path
 */
export function generateStoragePath(filename, lifecycle = 'final', jobId = null) {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');

  if (lifecycle === 'draft' || lifecycle === 'temp') {
    // Temp files: studio/temp/YYYYMMDD/job_id/filename
    const jobPath = jobId ? `${jobId}/` : '';
    return `studio/temp/${date}/${jobPath}${filename}`;
  } else {
    // Final files: studio/finals/YYYYMMDD/filename
    return `studio/finals/${date}/${filename}`;
  }
}

/**
 * Get cache control headers for lifecycle
 * @param {string} lifecycle - 'draft' | 'temp' | 'final'
 * @returns {string} Cache control header
 */
export function getCacheControl(lifecycle) {
  if (lifecycle === 'draft' || lifecycle === 'temp') {
    // Temp files: 24h max-age, allow revalidation
    return 'public, max-age=86400, must-revalidate';
  } else {
    // Final files: Immutable, 1 year cache
    return 'public, max-age=31536000, immutable';
  }
}

/**
 * Upload file to Supabase Storage with lifecycle management
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - File name
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} { publicUrl, path, lifecycle }
 */
export async function uploadToStorage(buffer, filename, options = {}) {
  const {
    bucketName = 'tpv-studio',
    lifecycle = 'final', // 'draft' | 'temp' | 'final'
    jobId = null,
    contentType = null
  } = options;

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY
  );

  try {
    // Generate lifecycle-aware path
    const path = generateStoragePath(filename, lifecycle, jobId);

    console.log(`[UPLOAD] Uploading to ${bucketName}/${path} (lifecycle: ${lifecycle})`);

    // Prepare upload options
    const uploadOptions = {
      contentType: contentType || getContentType(filename),
      cacheControl: getCacheControl(lifecycle),
      upsert: true
    };

    // Add custom metadata for temp files (helps cleanup job)
    if (lifecycle === 'draft' || lifecycle === 'temp') {
      uploadOptions.metadata = {
        lifecycle,
        uploaded_at: new Date().toISOString(),
        ttl_hours: '24'
      };
    }

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, buffer, uploadOptions);

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);

    console.log(`[UPLOAD] Success: ${publicUrl}`);

    return {
      publicUrl,
      path,
      lifecycle
    };
  } catch (error) {
    console.error('[UPLOAD] Error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

/**
 * Upload with automatic lifecycle detection
 * Draft/stencil images are temp, final renders are final
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - File name
 * @param {string} stage - 'stencil' | 'draft' | 'region' | 'final'
 * @param {string} jobId - Job ID
 * @returns {Promise<Object>} Upload result
 */
export async function uploadByStage(buffer, filename, stage, jobId) {
  const lifecycle = (stage === 'stencil' || stage === 'draft' || stage === 'region')
    ? 'temp'
    : 'final';

  return uploadToStorage(buffer, filename, {
    lifecycle,
    jobId
  });
}

/**
 * Get content type from filename
 */
export function getContentType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    'svg': 'image/svg+xml',
    'png': 'image/png',
    'dxf': 'application/dxf',
    'pdf': 'application/pdf',
    'json': 'application/json'
  };
  return types[ext] || 'application/octet-stream';
}

/**
 * Generate all exports for a variant
 * Returns URLs for each format
 * @param {Array} regions - Generated regions with points and colors
 * @param {Object} surface - Surface dimensions
 * @param {Object} metadata - Design metadata (title, variant, etc.)
 * @param {Object} bom - Bill of materials
 * @param {Array} palette - Palette from LayoutSpec (required)
 * @param {Object} options - Export options
 */
export async function generateAllExports(regions, surface, metadata, bom, palette, options = {}) {
  const {
    lifecycle = 'final', // 'draft' | 'temp' | 'final'
    jobId = null
  } = options;

  const variantId = `v${metadata.variant}_${Date.now()}`;

  try {
    // Generate SVG with palette
    const svg = exportSVG(regions, surface, metadata, palette);
    const svgResult = await uploadToStorage(
      Buffer.from(svg, 'utf8'),
      `${variantId}.svg`,
      { lifecycle, jobId }
    );

    // Generate PNG from SVG
    const pngBuffer = await exportPNG(svg, 1200);
    const pngResult = await uploadToStorage(
      pngBuffer,
      `${variantId}.png`,
      { lifecycle, jobId }
    );

    // Generate DXF stub
    const dxf = exportDXF(regions, surface);
    const dxfResult = await uploadToStorage(
      Buffer.from(dxf, 'utf8'),
      `${variantId}.dxf`,
      { lifecycle, jobId }
    );

    // Generate PDF stub (just metadata for now)
    const pdfData = exportPDF(regions, surface, bom);
    const pdfResult = await uploadToStorage(
      Buffer.from(JSON.stringify(pdfData, null, 2), 'utf8'),
      `${variantId}.pdf.json`,
      { lifecycle, jobId }
    );

    return {
      svgUrl: svgResult.publicUrl,
      pngUrl: pngResult.publicUrl,
      dxfUrl: dxfResult.publicUrl,
      pdfUrl: pdfResult.publicUrl,
      paths: {
        svg: svgResult.path,
        png: pngResult.path,
        dxf: dxfResult.path,
        pdf: pdfResult.path
      },
      lifecycle
    };
  } catch (error) {
    console.error('[EXPORTS] Error generating exports:', error);
    throw error;
  }
}



