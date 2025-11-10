// Brief-Based Stencil Generator for IMG2IMG Mode
// Creates simple black/white layout guides from design briefs
// Optimized for FLUX img2img with denoise_strength

import sharp from 'sharp';

/**
 * Generate a simple stencil from a design brief with composition guidance
 * Creates flat composition: 2-4 broad colored regions + up to 2 large motif blobs
 * @param {Object} brief - Design brief {title, mood, composition, motifs, arrangement_notes}
 * @param {Object} dimensions - {width, height} in pixels
 * @param {Object} options - {seed}
 * @returns {Promise<Buffer>} PNG buffer of stencil
 */
export async function generateBriefStencil(brief, dimensions, options = {}) {
  const { width, height } = dimensions;
  const { seed = Date.now() } = options;

  // Extract composition parameters
  const composition = brief.composition || {
    target_region_count: 3,
    min_feature_mm: 120,
    min_radius_mm: 600
  };

  console.log(`[BRIEF-STENCIL] Generating ${width}×${height} stencil for "${brief.title || 'untitled'}"`);
  console.log(`[BRIEF-STENCIL] Target regions: ${composition.target_region_count}`);
  console.log(`[BRIEF-STENCIL] Motifs: ${brief.motifs?.length || 0}`);

  // Create an SVG layout guide using composition parameters
  const svg = generateLayoutSVG(brief, width, height, seed, composition);

  // Rasterize to PNG using sharp
  const buffer = await sharp(Buffer.from(svg))
    .resize(width, height)
    .png()
    .toBuffer();

  console.log(`[BRIEF-STENCIL] Generated ${buffer.length} byte PNG stencil`);
  return buffer;
}

/**
 * Generate SVG layout guide from brief using composition parameters
 * @param {Object} brief - Design brief
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} seed - Random seed
 * @param {Object} composition - Composition parameters
 * @returns {string} SVG markup
 */
function generateLayoutSVG(brief, width, height, seed, composition) {
  const motifs = brief.motifs || [];
  const targetRegions = composition.target_region_count || 3;

  // Simple seeded random
  let rngState = seed;
  const random = () => {
    rngState = (rngState * 1664525 + 1013904223) >>> 0;
    return (rngState / 0x100000000);
  };

  // Start SVG with white background
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${width}" height="${height}" fill="white"/>`;

  // Generate broad colored regions (2-4 regions as background)
  svg += generateBroadRegions(width, height, targetRegions, random);

  // Add up to 2 large motif blobs on top (limit to keep it simple)
  const maxMotifBlobs = Math.min(2, motifs.length);
  if (maxMotifBlobs > 0) {
    svg += generateMotifBlobs(motifs.slice(0, maxMotifBlobs), width, height, random, composition);
  }

  svg += '</svg>';
  return svg;
}

/**
 * Generate broad colored regions (background bands)
 * Creates 2-4 large regions with generous spacing
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} targetRegions - Number of regions to create (2-4)
 * @param {Function} random - Random function
 * @returns {string} SVG path markup
 */
function generateBroadRegions(width, height, targetRegions, random) {
  let svg = '';

  // Create flowing horizontal bands (2-4 regions)
  const numRegions = Math.max(2, Math.min(4, targetRegions));
  const regionHeight = height / numRegions;

  for (let i = 0; i < numRegions; i++) {
    const y = regionHeight * i;
    const amplitude = regionHeight * 0.15;  // Gentle waves
    const wavelength = width / (1 + random());

    // Create wavy path for top edge
    let path = `M 0,${y}`;
    for (let x = 0; x <= width; x += wavelength / 8) {
      const wave = Math.sin((x / wavelength) * Math.PI * 2) * amplitude;
      path += ` L ${x},${y + wave}`;
    }

    // Go down to bottom edge
    path += ` L ${width},${y + regionHeight}`;
    path += ` L 0,${y + regionHeight}`;
    path += ' Z';

    // Use varying opacity to create visual distinction between regions
    const opacity = 0.15 + (i % 2) * 0.1;
    svg += `<path d="${path}" fill="black" opacity="${opacity}"/>`;
  }

  return svg;
}

/**
 * Generate large motif blobs (limit to 2 for simplicity)
 * Creates simple geometric shapes representing key motifs
 * @param {Array} motifs - Array of {name, count, size_m} (max 2)
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {Function} random - Random function
 * @param {Object} composition - Composition parameters for sizing
 * @returns {string} SVG shapes markup
 */
function generateMotifBlobs(motifs, width, height, random, composition) {
  let svg = '';

  // Only place up to 2 large motif blobs (spec requirement)
  const maxBlobs = Math.min(2, motifs.length);

  for (let i = 0; i < maxBlobs; i++) {
    const motif = motifs[i];

    // Position blobs with generous spacing
    const x = width * (0.25 + i * 0.5);  // 25% and 75% positions
    const y = height * (0.3 + random() * 0.4);  // 30-70% vertical

    // Calculate size from motif size_m if available, otherwise use composition min_feature_mm
    let sizePixels;
    if (motif.size_m && Array.isArray(motif.size_m)) {
      // Convert meters to pixels (assuming 200 PPI as default)
      const avgSizeM = (motif.size_m[0] + motif.size_m[1]) / 2;
      const ppi = parseInt(process.env.IMG_PPI || '200');
      sizePixels = (avgSizeM * 39.37 * ppi);  // m → inches → pixels
    } else {
      // Use min_feature_mm as fallback
      const minFeatureMM = composition.min_feature_mm || 120;
      const ppi = parseInt(process.env.IMG_PPI || '200');
      sizePixels = (minFeatureMM / 25.4 * ppi);  // mm → inches → pixels
    }

    // Ensure size is reasonable relative to canvas
    sizePixels = Math.min(sizePixels, Math.min(width, height) * 0.4);
    sizePixels = Math.max(sizePixels, Math.min(width, height) * 0.15);

    // Create large rounded shape (circle or rounded square)
    const shapeType = Math.floor(random() * 2);

    if (shapeType === 0) {
      // Large circle blob
      svg += `<circle cx="${x}" cy="${y}" r="${sizePixels/2}" fill="black" opacity="0.35"/>`;
    } else {
      // Large rounded square blob
      const rx = sizePixels * 0.25;  // 25% radius for smooth corners
      svg += `<rect x="${x-sizePixels/2}" y="${y-sizePixels/2}" width="${sizePixels}" height="${sizePixels}" rx="${rx}" fill="black" opacity="0.35"/>`;
    }
  }

  return svg;
}

/**
 * Check if brief-based stencil mode is enabled
 * @returns {boolean} True if enabled
 */
export function isBriefStencilEnabled() {
  return process.env.INSPIRE_GUIDED_MODE === 'true';
}
