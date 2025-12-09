/**
 * SVG Coverage Analyzer
 * Analyzes SVG content to calculate accurate coverage percentages per color
 * using pixel analysis (renders to canvas and counts pixels)
 */

/**
 * Convert RGB values to hex string
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color string (e.g., "#FF0000")
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * Analyze SVG content and calculate coverage percentage per color
 * @param {string} svgContent - SVG string content
 * @param {Object} options - Options
 * @param {number} options.canvasSize - Size for analysis canvas (default 500, higher = more accurate but slower)
 * @param {boolean} options.ignoreWhite - Whether to ignore white/near-white pixels (default true)
 * @param {boolean} options.ignoreTransparent - Whether to ignore transparent pixels (default true)
 * @returns {Promise<Map<string, {coverage: number, pixelCount: number}>>} Map of hex → coverage data
 */
export async function analyzeSvgCoverage(svgContent, options = {}) {
  const {
    canvasSize = 500,
    ignoreWhite = true,
    ignoreTransparent = true
  } = options;

  return new Promise((resolve, reject) => {
    // Create offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Create image from SVG
    const img = new Image();

    // Create blob URL from SVG content
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      try {
        // Clear canvas with transparent background
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Draw SVG scaled to fit canvas while maintaining aspect ratio
        const scale = Math.min(canvasSize / img.width, canvasSize / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (canvasSize - scaledWidth) / 2;
        const offsetY = (canvasSize - scaledHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        // Get pixel data
        const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
        const pixels = imageData.data;

        // Count pixels per color
        const colorCounts = new Map();
        let totalCountedPixels = 0;

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // Skip transparent pixels if requested
          if (ignoreTransparent && a < 128) {
            continue;
          }

          // Skip white/near-white pixels if requested (background)
          if (ignoreWhite && r > 250 && g > 250 && b > 250) {
            continue;
          }

          // Convert to hex
          const hex = rgbToHex(r, g, b);

          // Increment count
          const current = colorCounts.get(hex) || 0;
          colorCounts.set(hex, current + 1);
          totalCountedPixels++;
        }

        // Convert counts to coverage percentages
        const coverageMap = new Map();
        for (const [hex, count] of colorCounts) {
          coverageMap.set(hex, {
            coverage: totalCountedPixels > 0 ? (count / totalCountedPixels) * 100 : 0,
            pixelCount: count
          });
        }

        // Clean up
        URL.revokeObjectURL(url);

        resolve(coverageMap);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG for coverage analysis'));
    };

    img.src = url;
  });
}

/**
 * Normalize a hex color to uppercase 6-digit format
 * @param {string} hex - Hex color (with or without #, 3 or 6 digits)
 * @returns {string} Normalized hex (e.g., "#FF0000")
 */
export function normalizeHex(hex) {
  if (!hex) return null;

  // Remove # if present
  let h = hex.replace('#', '').toUpperCase();

  // Expand 3-digit hex to 6-digit
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('');
  }

  return '#' + h;
}

/**
 * Group similar colors together (within a tolerance)
 * Useful when SVG has anti-aliasing that creates slight color variations
 * @param {Map<string, {coverage: number, pixelCount: number}>} coverageMap - Raw coverage data
 * @param {number} tolerance - Color distance tolerance (0-255 per channel, default 10)
 * @returns {Map<string, {coverage: number, pixelCount: number}>} Grouped coverage data
 */
export function groupSimilarColors(coverageMap, tolerance = 10) {
  const entries = Array.from(coverageMap.entries());
  const grouped = new Map();
  const processed = new Set();

  for (const [hex1, data1] of entries) {
    if (processed.has(hex1)) continue;

    let totalCoverage = data1.coverage;
    let totalPixels = data1.pixelCount;
    const rgb1 = hexToRgb(hex1);

    // Find similar colors
    for (const [hex2, data2] of entries) {
      if (hex1 === hex2 || processed.has(hex2)) continue;

      const rgb2 = hexToRgb(hex2);
      const distance = Math.max(
        Math.abs(rgb1.r - rgb2.r),
        Math.abs(rgb1.g - rgb2.g),
        Math.abs(rgb1.b - rgb2.b)
      );

      if (distance <= tolerance) {
        totalCoverage += data2.coverage;
        totalPixels += data2.pixelCount;
        processed.add(hex2);
      }
    }

    processed.add(hex1);
    grouped.set(hex1, {
      coverage: totalCoverage,
      pixelCount: totalPixels
    });
  }

  return grouped;
}

/**
 * Convert hex to RGB object
 * @param {string} hex - Hex color string
 * @returns {{r: number, g: number, b: number}} RGB values
 */
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16)
  };
}

/**
 * Analyze SVG from a blob URL
 * @param {string} blobUrl - Blob URL pointing to SVG content
 * @param {Object} options - Same options as analyzeSvgCoverage
 * @returns {Promise<Map<string, {coverage: number, pixelCount: number}>>}
 */
export async function analyzeSvgCoverageFromUrl(blobUrl, options = {}) {
  try {
    const response = await fetch(blobUrl);
    const svgContent = await response.text();
    return analyzeSvgCoverage(svgContent, options);
  } catch (err) {
    console.error('[CoverageAnalyzer] Failed to fetch SVG from URL:', err);
    throw err;
  }
}

/**
 * Match analyzed colors to TPV color palette
 * @param {Map<string, {coverage: number, pixelCount: number}>} coverageMap - Coverage data
 * @param {Array} tpvColors - Array of TPV colors with {hex, code, name}
 * @param {number} tolerance - Matching tolerance (default 30)
 * @returns {Array<{hex: string, tpvCode: string, tpvName: string, coverage: number, isExactMatch: boolean}>}
 */
export function matchToTpvColors(coverageMap, tpvColors, tolerance = 30) {
  const results = [];

  for (const [hex, data] of coverageMap) {
    const rgb = hexToRgb(hex);
    let bestMatch = null;
    let bestDistance = Infinity;

    // Find closest TPV color
    for (const tpv of tpvColors) {
      const tpvRgb = hexToRgb(tpv.hex);
      const distance = Math.sqrt(
        Math.pow(rgb.r - tpvRgb.r, 2) +
        Math.pow(rgb.g - tpvRgb.g, 2) +
        Math.pow(rgb.b - tpvRgb.b, 2)
      );

      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = tpv;
      }
    }

    results.push({
      hex: hex,
      tpvCode: bestMatch?.code || null,
      tpvName: bestMatch?.name || null,
      tpvHex: bestMatch?.hex || null,
      coverage: data.coverage,
      pixelCount: data.pixelCount,
      isExactMatch: bestDistance < 5,
      colorDistance: bestDistance
    });
  }

  // Sort by coverage descending
  results.sort((a, b) => b.coverage - a.coverage);

  return results;
}
