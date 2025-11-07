// Vectorization Utilities for TPV Studio
// Converts raster images (PNG) to vector paths (SVG) using potrace

import potrace from 'potrace';
import sharp from 'sharp';
/**
 * Vectorization parameters
 * These control the quality vs complexity tradeoff
 */
export const VECTORIZE_PRESETS = {
  draft: {
    threshold: 128,
    turdSize: 100,     // Suppress speckles (higher = cleaner)
    alphaMax: 1.0,     // Corner threshold (higher = smoother corners)
    optCurve: true,
    optTolerance: 0.5  // Curve optimization (higher = simpler paths)
  },
  balanced: {
    threshold: 128,
    turdSize: 50,
    alphaMax: 0.8,
    optCurve: true,
    optTolerance: 0.3
  },
  precise: {
    threshold: 128,
    turdSize: 20,
    alphaMax: 0.5,
    optCurve: true,
    optTolerance: 0.1
  }
};

/**
 * Extract single-color layer from quantized image
 * @param {Buffer} imageBuffer - Quantized PNG with discrete colors
 * @param {string} targetHex - Hex color to extract (e.g., '#FF5733')
 * @returns {Promise<Buffer>} Binary mask (white = target color, black = other)
 */
async function extractColorLayer(imageBuffer, targetHex) {
  // Convert hex to RGB
  const hex = targetHex.replace('#', '');
  const targetR = parseInt(hex.substring(0, 2), 16);
  const targetG = parseInt(hex.substring(2, 4), 16);
  const targetB = parseInt(hex.substring(4, 6), 16);

  // Load image and get raw pixel data
  const { data, info } = await sharp(imageBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Create binary mask
  const maskData = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Check if pixel matches target color (with small tolerance)
    const tolerance = 5;
    const matches = (
      Math.abs(r - targetR) <= tolerance &&
      Math.abs(g - targetG) <= tolerance &&
      Math.abs(b - targetB) <= tolerance &&
      a > 128 // Not transparent
    );

    // Set mask to white (255) if matches, black (0) if not
    const value = matches ? 255 : 0;
    maskData[i] = value;
    maskData[i + 1] = value;
    maskData[i + 2] = value;
    maskData[i + 3] = 255; // Opaque
  }

  // Convert to PNG
  const maskBuffer = await sharp(maskData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .png()
  .toBuffer();

  return maskBuffer;
}

/**
 * Trace bitmap to SVG paths using potrace
 * @param {Buffer} bitmapBuffer - Binary image (black/white)
 * @param {Object} options - Potrace parameters
 * @returns {Promise<string>} SVG path data (d attribute)
 */
export function traceImage(bitmapBuffer, options = {}) {
  return new Promise((resolve, reject) => {
    potrace.trace(bitmapBuffer, options, (error, svg) => {
      if (error) {
        reject(error);
      } else {
        resolve(svg);
      }
    });
  });
}

/**
 * Extract SVG path data from potrace output
 * Potrace returns a full SVG, we just want the path data
 * @param {string} svgContent - Full SVG from potrace
 * @returns {Array<string>} Array of path d attributes
 */
export function extractPathData(svgContent) {
  const pathRegex = /<path[^>]*d="([^"]+)"[^>]*\/>/g;
  const paths = [];
  let match;

  while ((match = pathRegex.exec(svgContent)) !== null) {
    paths.push(match[1]);
  }

  return paths;
}

/**
 * Vectorize quantized image to SVG regions
 * Extracts each color as a separate layer and traces to vector paths
 * @param {Buffer} imageBuffer - Quantized PNG
 * @param {Array} paletteColors - Colors used in the image [{code, hex, name}]
 * @param {string} preset - Quality preset (draft/balanced/precise)
 * @returns {Promise<Array>} Array of regions {color, paths, pathCount}
 */
export async function vectorizeImage(imageBuffer, paletteColors, preset = 'balanced') {
  console.log(`[VECTORIZE] Starting with ${paletteColors.length} colors (${preset} quality)`);

  const options = VECTORIZE_PRESETS[preset] || VECTORIZE_PRESETS.balanced;
  const regions = [];

  // Get image dimensions
  const metadata = await sharp(imageBuffer).metadata();
  const { width, height } = metadata;

  console.log(`[VECTORIZE] Image size: ${width}x${height}`);

  // Process each color separately
  for (const color of paletteColors) {
    try {
      console.log(`[VECTORIZE] Processing ${color.code} (${color.hex})...`);

      // Step 1: Extract binary mask for this color
      const maskBuffer = await extractColorLayer(imageBuffer, color.hex);

      // Step 2: Trace mask to SVG paths
      const svgOutput = await traceImage(maskBuffer, options);

      // Step 3: Extract path data
      const pathData = extractPathData(svgOutput);

      if (pathData.length > 0) {
        regions.push({
          color: color.code,
          hex: color.hex,
          name: color.name,
          paths: pathData,
          pathCount: pathData.length
        });

        console.log(`[VECTORIZE] ${color.code}: ${pathData.length} paths extracted`);
      } else {
        console.log(`[VECTORIZE] ${color.code}: No paths found (color not present)`);
      }

    } catch (error) {
      console.error(`[VECTORIZE] Failed to process ${color.code}:`, error.message);
      // Continue with other colors
    }
  }

  console.log(`[VECTORIZE] Complete! Generated ${regions.length} color layers`);
  return regions;
}

/**
 * Convert vectorized regions to TPV design format
 * Transforms SVG paths into TPV's polygon point format for constraint checking
 * @param {Array} regions - Vectorized regions from vectorizeImage()
 * @param {Object} surface - Surface dimensions {width_m, height_m}
 * @returns {Array} TPV regions [{color, points: [{x, y}]}]
 */
export function convertToTPVFormat(regions, surface) {
  console.log('[VECTORIZE] Converting to TPV polygon format...');

  // For now, return regions as-is with SVG paths
  // Full implementation would parse SVG paths into point arrays
  // This is a complex transformation that requires path parsing

  const tpvRegions = regions.map(region => ({
    color: region.color,
    paths: region.paths, // SVG path strings
    // TODO: Parse paths to points for constraint checking
    // points: parseSVGPath(region.paths[0])
  }));

  console.log(`[VECTORIZE] Converted ${tpvRegions.length} regions to TPV format`);
  return tpvRegions;
}

/**
 * Simplify vector paths to reduce complexity
 * Useful for meeting TPV constraints (min width, min gap, etc.)
 * @param {Array} regions - Vectorized regions
 * @param {number} simplifyFactor - Tolerance for simplification (0.1-2.0)
 * @returns {Promise<Array>} Simplified regions
 */
export async function simplifyPaths(regions, simplifyFactor = 0.5) {
  console.log(`[VECTORIZE] Simplifying paths (factor: ${simplifyFactor})...`);

  // Simplification would use a library like simplify-js
  // For now, return regions unchanged
  // Full implementation would apply Douglas-Peucker algorithm

  console.log('[VECTORIZE] Path simplification not yet implemented');
  return regions;
}

/**
 * Estimate vectorization quality metrics
 * @param {Array} regions - Vectorized regions
 * @returns {Object} {pathCount, avgPathsPerColor, complexity}
 */
export function estimateQuality(regions) {
  const totalPaths = regions.reduce((sum, r) => sum + r.pathCount, 0);
  const avgPaths = totalPaths / regions.length;
  const complexity = totalPaths < 50 ? 'simple' : totalPaths < 200 ? 'moderate' : 'complex';

  return {
    pathCount: totalPaths,
    avgPathsPerColor: Math.round(avgPaths * 10) / 10,
    complexity,
    colorLayers: regions.length
  };
}



