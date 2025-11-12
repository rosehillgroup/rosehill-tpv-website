// Color quantization and palette mapping for TPV Studio
// Maps AI-generated images to nearest TPV palette colors using ΔE2000

import sharp from 'sharp';
import { diff as deltaE } from 'color-diff';
/**
 * Convert hex color to Lab color space for ΔE2000 calculation
 * @param {string} hex - Hex color (e.g., '#FF5733')
 * @returns {Object} Lab color {L, a, b}
 */
export function hexToLab(hex) {
  // Remove # if present
  hex = hex.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // RGB to XYZ (D65 illuminant)
  let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  // XYZ to Lab
  const xn = 0.95047, yn = 1.00000, zn = 1.08883; // D65 white point
  x = x / xn;
  y = y / yn;
  z = z / zn;

  const f = (t) => t > 0.008856 ? Math.pow(t, 1/3) : (7.787 * t) + (16/116);

  const L = (116 * f(y)) - 16;
  const a = 500 * (f(x) - f(y));
  const bVal = 200 * (f(y) - f(z));

  return { L, a, b: bVal };
}

/**
 * Find nearest TPV color using ΔE2000 color distance
 * @param {Object} rgb - RGB color {r, g, b} (0-255)
 * @param {Array} palette - TPV palette [{code, hex, name}]
 * @returns {Object} Nearest palette color
 */
export function findNearestColor(rgb, palette) {
  // Convert RGB to hex
  const hex = `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;

  // Convert to Lab
  const targetLab = hexToLab(hex);

  // Find nearest color in palette
  let minDistance = Infinity;
  let nearestColor = palette[0];

  for (const paletteColor of palette) {
    const paletteLab = hexToLab(paletteColor.hex);
    const distance = deltaE(targetLab, paletteLab);

    if (distance < minDistance) {
      minDistance = distance;
      nearestColor = paletteColor;
    }
  }

  return {
    ...nearestColor,
    distance: minDistance
  };
}

/**
 * Quantize image to TPV palette
 * Maps every pixel to nearest palette color
 * @param {Buffer} imageBuffer - Input image
 * @param {Array} palette - TPV palette colors
 * @returns {Promise<Buffer>} Quantized image buffer (PNG)
 */
export async function quantizeImageToPalette(imageBuffer, palette) {
  console.log(`[COLOR QUANTIZE] Processing image with ${palette.length} colors`);

  try {
    // Load image and get raw pixel data
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    console.log(`[COLOR QUANTIZE] Image size: ${width}x${height}`);

    // Get raw RGB pixel data
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Create new buffer for quantized image
    const quantized = Buffer.alloc(data.length);

    // Create palette lookup for faster processing
    const paletteLookup = palette.map(c => ({
      ...c,
      lab: hexToLab(c.hex),
      rgb: hexToRgb(c.hex)
    }));

    let pixelCount = 0;
    const colorUsage = {};

    // Process each pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Skip fully transparent pixels
      if (a < 128) {
        quantized[i] = r;
        quantized[i + 1] = g;
        quantized[i + 2] = b;
        quantized[i + 3] = a;
        continue;
      }

      // Find nearest palette color
      const nearest = findNearestColor({ r, g, b }, palette);
      const nearestRgb = hexToRgb(nearest.hex);

      // Set pixel to nearest color
      quantized[i] = nearestRgb.r;
      quantized[i + 1] = nearestRgb.g;
      quantized[i + 2] = nearestRgb.b;
      quantized[i + 3] = a;

      // Track color usage
      colorUsage[nearest.code] = (colorUsage[nearest.code] || 0) + 1;
      pixelCount++;
    }

    console.log('[COLOR QUANTIZE] Color usage:', colorUsage);
    console.log(`[COLOR QUANTIZE] Processed ${pixelCount} pixels`);

    // Create new image from quantized data
    const quantizedImage = await sharp(quantized, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toBuffer();

    return quantizedImage;

  } catch (error) {
    console.error('[COLOR QUANTIZE] Error:', error);
    throw new Error(`Color quantization failed: ${error.message}`);
  }
}

/**
 * Extract dominant colors from image
 * Useful for auto-detecting which palette colors to use
 * @param {Buffer} imageBuffer - Input image
 * @param {number} maxColors - Maximum colors to extract
 * @returns {Promise<Array>} Dominant colors as hex values
 */
export async function extractDominantColors(imageBuffer, maxColors = 10) {
  try {
    const image = sharp(imageBuffer);

    // Resize to small size for faster processing
    const { data } = await image
      .resize(100, 100, { fit: 'inside' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Count color frequencies
    const colorCounts = {};
    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      colorCounts[hex] = (colorCounts[hex] || 0) + 1;
    }

    // Sort by frequency
    const sorted = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxColors)
      .map(([hex]) => hex);

    return sorted;

  } catch (error) {
    console.error('[COLOR QUANTIZE] Extract dominant colors failed:', error);
    return [];
  }
}

/**
 * Analyze color distribution in quantized image
 * @param {Buffer} imageBuffer - Quantized image
 * @param {Array} palette - TPV palette
 * @returns {Promise<Object>} Color distribution stats
 */
export async function analyzeColorDistribution(imageBuffer, palette) {
  try {
    const { data } = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const colorCounts = {};
    let totalPixels = 0;

    // Count each palette color
    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const nearest = findNearestColor({ r, g, b }, palette);
      colorCounts[nearest.code] = (colorCounts[nearest.code] || 0) + 1;
      totalPixels++;
    }

    // Calculate percentages
    const distribution = {};
    for (const [code, count] of Object.entries(colorCounts)) {
      distribution[code] = {
        count,
        percentage: (count / totalPixels) * 100
      };
    }

    return distribution;

  } catch (error) {
    console.error('[COLOR QUANTIZE] Analyze distribution failed:', error);
    return {};
  }
}

/**
 * Helper: Convert hex to RGB object
 */
export function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };
}

/**
 * Posterize image to reduce colors before quantization
 * Helps create cleaner vector conversions
 * @param {Buffer} imageBuffer - Input image
 * @param {number} levels - Color levels per channel (2-8)
 * @returns {Promise<Buffer>} Posterized image
 */
export async function posterizeImage(imageBuffer, levels = 4) {
  try {
    console.log(`[COLOR QUANTIZE] Posterizing to ${levels} levels`);

    const { data, info } = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const step = 256 / levels;

    // Posterize each pixel
    for (let i = 0; i < data.length; i++) {
      if (i % 4 === 3) continue; // Skip alpha channel
      const level = Math.floor(data[i] / step);
      data[i] = Math.min(255, level * step);
    }

    return await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels
      }
    })
    .png()
    .toBuffer();

  } catch (error) {
    console.error('[COLOR QUANTIZE] Posterize failed:', error);
    throw error;
  }
}



