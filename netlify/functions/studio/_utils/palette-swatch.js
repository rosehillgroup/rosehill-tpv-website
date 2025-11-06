// Palette swatch generation for IP-Adapter conditioning
// Creates SVG swatches from TPV color hex codes (serverless-friendly)

import { uploadToStorage } from './exports.js';

/**
 * Generate a palette swatch as SVG buffer from color hex codes
 * Creates a grid of equal-sized color blocks
 * @param {Array} colors - Array of {code, hex, name}
 * @returns {Promise<Buffer>} SVG buffer (can be saved as PNG)
 */
export async function buildPaletteSwatch(colors) {
  if (!colors || colors.length === 0) {
    throw new Error('No colors provided for swatch');
  }

  const colorCount = colors.length;
  const blockSize = 128; // pixels per color block

  // Arrange in rows (max 4 colors per row)
  const cols = Math.min(colorCount, 4);
  const rows = Math.ceil(colorCount / cols);

  const width = cols * blockSize;
  const height = rows * blockSize;

  console.log(`[SWATCH] Creating ${width}×${height} SVG swatch for ${colorCount} colors`);

  // Build SVG string
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

  // Draw color blocks
  colors.forEach((color, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * blockSize;
    const y = row * blockSize;

    svg += `<rect x="${x}" y="${y}" width="${blockSize}" height="${blockSize}" fill="${color.hex}"/>`;

    console.log(`[SWATCH] Block ${i}: ${color.code} (${color.hex}) at (${x}, ${y})`);
  });

  svg += '</svg>';

  return Buffer.from(svg, 'utf8');
}

/**
 * Create and upload palette swatch to Supabase
 * Returns a signed URL for use in IP-Adapter
 * @param {Array} colors - Array of {code, hex, name}
 * @param {string} bucket - Supabase bucket name (default: 'tpv-studio')
 * @returns {Promise<string>} Public URL to swatch SVG
 */
export async function createPaletteSwatch(colors, bucket = 'tpv-studio') {
  const swatchBuffer = await buildPaletteSwatch(colors);

  // Create unique filename from color codes
  const colorCodes = colors.map(c => c.code).join('-');
  const filename = `palette_swatch_${colorCodes}_${Date.now()}.svg`;

  console.log(`[SWATCH] Uploading to ${bucket}/${filename}`);

  const url = await uploadToStorage(swatchBuffer, filename, bucket);

  console.log(`[SWATCH] Uploaded swatch: ${url}`);

  return url;
}

/**
 * Create a simple averaged color for single-color conditioning
 * When using models that prefer single color input
 * @param {Array} colors - Array of {code, hex, name}
 * @returns {string} Averaged hex color
 */
export function averagePaletteColor(colors) {
  if (colors.length === 1) {
    return colors[0].hex;
  }

  // Convert hex to RGB
  const rgbs = colors.map(c => {
    const hex = c.hex.replace('#', '');
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16)
    };
  });

  // Average RGB values
  const avgR = Math.round(rgbs.reduce((sum, c) => sum + c.r, 0) / rgbs.length);
  const avgG = Math.round(rgbs.reduce((sum, c) => sum + c.g, 0) / rgbs.length);
  const avgB = Math.round(rgbs.reduce((sum, c) => sum + c.b, 0) / rgbs.length);

  // Convert back to hex
  const toHex = (n) => n.toString(16).padStart(2, '0');
  const avgHex = `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`;

  console.log(`[SWATCH] Averaged ${colors.length} colors to ${avgHex}`);

  return avgHex;
}
