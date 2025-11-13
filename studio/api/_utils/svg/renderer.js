// SVG to PNG Renderer using Resvg
// Converts SVG strings to PNG buffers at specified sizes

import { Resvg } from '@resvg/resvg-js';

/**
 * Convert SVG string to PNG buffer
 * @param {string} svgString - SVG content as string
 * @param {number} sizePx - Target size in pixels (width, height will maintain aspect ratio)
 * @param {object} options - Rendering options
 * @param {string} options.background - Background color (default: transparent)
 * @param {boolean} options.fitWidth - If true, scale to width; if false, scale to height
 * @returns {Promise<Buffer>} PNG image buffer
 */
export async function svgToPngBuffer(svgString, sizePx, options = {}) {
  const {
    background = 'transparent',
    fitWidth = true
  } = options;

  try {
    // Parse SVG to extract viewBox or dimensions
    const viewBoxMatch = svgString.match(/viewBox=["']([^"']+)["']/);
    const widthMatch = svgString.match(/width=["'](\d+(?:\.\d+)?)[^"']*["']/);
    const heightMatch = svgString.match(/height=["'](\d+(?:\.\d+)?)[^"']*["']/);

    let targetWidth = sizePx;
    let targetHeight = sizePx;

    if (viewBoxMatch) {
      // Use viewBox for aspect ratio
      const [, , , vbWidth, vbHeight] = viewBoxMatch[1].split(/\s+/).map(Number);
      const aspectRatio = vbWidth / vbHeight;

      if (fitWidth) {
        targetWidth = sizePx;
        targetHeight = Math.round(sizePx / aspectRatio);
      } else {
        targetHeight = sizePx;
        targetWidth = Math.round(sizePx * aspectRatio);
      }
    } else if (widthMatch && heightMatch) {
      // Use explicit width/height
      const svgWidth = parseFloat(widthMatch[1]);
      const svgHeight = parseFloat(heightMatch[1]);
      const aspectRatio = svgWidth / svgHeight;

      if (fitWidth) {
        targetWidth = sizePx;
        targetHeight = Math.round(sizePx / aspectRatio);
      } else {
        targetHeight = sizePx;
        targetWidth = Math.round(sizePx * aspectRatio);
      }
    }

    // Render SVG to PNG using Resvg
    const resvg = new Resvg(svgString, {
      background,
      fitTo: {
        mode: fitWidth ? 'width' : 'height',
        value: sizePx
      }
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    console.log(`[SVG-RENDERER] Rendered ${targetWidth}x${targetHeight}px PNG from SVG`);

    return pngBuffer;
  } catch (error) {
    console.error('[SVG-RENDERER] Failed to render SVG:', error.message);
    throw new Error(`SVG rendering failed: ${error.message}`);
  }
}

/**
 * Generate a complete preview set: full-size preview + thumbnail
 * @param {string} svgString - SVG content
 * @param {number} fullSizePx - Full preview size (default: from env RECRAFT_CANVAS_PX)
 * @param {number} thumbSizePx - Thumbnail size (default: from env RECRAFT_THUMB_PX)
 * @returns {Promise<object>} { preview: Buffer, thumbnail: Buffer }
 */
export async function generatePreviewSet(svgString, fullSizePx = null, thumbSizePx = null) {
  const canvasPx = fullSizePx || parseInt(process.env.RECRAFT_CANVAS_PX || '2048', 10);
  const thumbPx = thumbSizePx || parseInt(process.env.RECRAFT_THUMB_PX || '512', 10);

  console.log(`[SVG-RENDERER] Generating preview set: ${canvasPx}px + ${thumbPx}px thumbnail`);

  try {
    // Generate full-size preview
    const preview = await svgToPngBuffer(svgString, canvasPx, {
      background: '#ffffff', // White background for previews
      fitWidth: true
    });

    // Generate thumbnail
    const thumbnail = await svgToPngBuffer(svgString, thumbPx, {
      background: '#ffffff',
      fitWidth: true
    });

    return { preview, thumbnail };
  } catch (error) {
    console.error('[SVG-RENDERER] Failed to generate preview set:', error.message);
    throw error;
  }
}

/**
 * Validate SVG structure (basic checks)
 * @param {string} svgString - SVG content
 * @returns {object} { valid: boolean, warnings: string[] }
 */
export function validateSvgStructure(svgString) {
  const warnings = [];

  // Check if string contains SVG tag
  if (!svgString.includes('<svg')) {
    return { valid: false, warnings: ['Missing <svg> root element'] };
  }

  // Check for viewBox or dimensions
  const hasViewBox = /viewBox=/.test(svgString);
  const hasWidth = /width=/.test(svgString);
  const hasHeight = /height=/.test(svgString);

  if (!hasViewBox && (!hasWidth || !hasHeight)) {
    warnings.push('SVG has no viewBox or explicit dimensions - rendering may be unpredictable');
  }

  // Check for empty SVG
  if (svgString.length < 100) {
    warnings.push('SVG content suspiciously short, may be empty or invalid');
  }

  // Check for common issues
  if (svgString.includes('xmlns:xlink') && !svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
    warnings.push('SVG uses xlink but missing proper xmlns declaration');
  }

  return {
    valid: warnings.length === 0 || warnings.every(w => w.includes('unpredictable')),
    warnings
  };
}

/**
 * Extract SVG metadata (dimensions, colors, complexity estimate)
 * @param {string} svgString - SVG content
 * @returns {object} Metadata about the SVG
 */
export function extractSvgMetadata(svgString) {
  const metadata = {
    hasViewBox: false,
    dimensions: null,
    estimatedColors: 0,
    pathCount: 0,
    hasGradients: false,
    hasStrokes: false,
    hasFilters: false
  };

  try {
    // Extract viewBox
    const viewBoxMatch = svgString.match(/viewBox=["']([^"']+)["']/);
    if (viewBoxMatch) {
      metadata.hasViewBox = true;
      const [x, y, w, h] = viewBoxMatch[1].split(/\s+/).map(Number);
      metadata.dimensions = { x, y, width: w, height: h };
    }

    // Count paths
    metadata.pathCount = (svgString.match(/<path/g) || []).length;

    // Detect gradients
    metadata.hasGradients = /<(?:linear|radial)Gradient/i.test(svgString);

    // Detect strokes
    metadata.hasStrokes = /stroke=["'][^"']*["']/i.test(svgString) &&
                         !/stroke=["']none["']/i.test(svgString);

    // Detect filters
    metadata.hasFilters = /<filter/i.test(svgString);

    // Estimate color count (rough)
    const fillMatches = svgString.match(/fill=["']#[0-9a-f]{6}["']/gi) || [];
    const uniqueColors = new Set(fillMatches.map(m => m.match(/#[0-9a-f]{6}/i)[0].toLowerCase()));
    metadata.estimatedColors = uniqueColors.size;

    return metadata;
  } catch (error) {
    console.error('[SVG-RENDERER] Failed to extract metadata:', error.message);
    return metadata;
  }
}
