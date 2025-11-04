// /.netlify/functions/_utils/color-science.js
// TPV Color Science Functions - Node.js Compatible
// Exported from tpv-palette.ts for use in serverless functions

// Full 21-color Rosehill TPV palette
const PALETTE = [
  { code: 'RH30', name: 'Beige', hex: '#E4C4AA' },
  { code: 'RH31', name: 'Cream', hex: '#E8E3D8' },
  { code: 'RH41', name: 'Bright Yellow', hex: '#FFD833' },
  { code: 'RH40', name: 'Mustard', hex: '#E5A144' },
  { code: 'RH50', name: 'Orange', hex: '#F15B32' },
  { code: 'RH01', name: 'Standard Red', hex: '#A5362F' },
  { code: 'RH02', name: 'Bright Red', hex: '#E21F2F' },
  { code: 'RH90', name: 'Funky Pink', hex: '#E8457E' },
  { code: 'RH21', name: 'Purple', hex: '#493D8C' },
  { code: 'RH20', name: 'Standard Blue', hex: '#0075BC' },
  { code: 'RH22', name: 'Light Blue', hex: '#47AFE3' },
  { code: 'RH23', name: 'Azure', hex: '#039DC4' },
  { code: 'RH26', name: 'Turquoise', hex: '#00A6A3' },
  { code: 'RH12', name: 'Dark Green', hex: '#006C55' },
  { code: 'RH10', name: 'Standard Green', hex: '#609B63' },
  { code: 'RH11', name: 'Bright Green', hex: '#3BB44A' },
  { code: 'RH32', name: 'Brown', hex: '#8B5F3C' },
  { code: 'RH65', name: 'Pale Grey', hex: '#D9D9D6' },
  { code: 'RH61', name: 'Light Grey', hex: '#939598' },
  { code: 'RH60', name: 'Dark Grey', hex: '#59595B' },
  { code: 'RH70', name: 'Black', hex: '#231F20' },
];

// ============================================================================
// COLOR SPACE CONVERSIONS
// ============================================================================

/**
 * Convert sRGB (0-255) to linear RGB (0-1)
 */
function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear RGB (0-1) to sRGB (0-255)
 */
function linearToSrgb(v) {
  const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(255, c * 255)));
}

/**
 * Convert sRGB to OKLab color space
 * OKLab provides perceptually uniform color distances
 */
function rgbToOklab(rgb) {
  // Step 1: sRGB to linear RGB
  const lr = srgbToLinear(rgb.r);
  const lg = srgbToLinear(rgb.g);
  const lb = srgbToLinear(rgb.b);

  // Step 2: Linear RGB to LMS (cone response)
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  // Step 3: LMS to OKLab
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
}

/**
 * Convert OKLab to sRGB
 */
function oklabToRgb(lab) {
  // Step 1: OKLab to LMS
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const s_ = lab.L - 0.0894841775 * lab.a - 1.2914855480 * lab.b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // Step 2: LMS to linear RGB
  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Step 3: Linear RGB to sRGB
  return {
    r: linearToSrgb(lr),
    g: linearToSrgb(lg),
    b: linearToSrgb(lb),
  };
}

/**
 * Compute ΔE (perceptual color difference) in OKLab space
 * Lower values = more similar colors
 */
function deltaE(lab1, lab2) {
  const dL = lab1.L - lab2.L;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

// ============================================================================
// PALETTE OPERATIONS
// ============================================================================

/**
 * Find the nearest TPV color by ΔE
 */
function nearestColor(rgb, palette = PALETTE) {
  const targetLab = rgbToOklab(rgb);
  let bestColor = palette[0];
  let bestDeltaE = Infinity;

  for (const col of palette) {
    const colRgb = hexToRgb(col.hex);
    const colLab = rgbToOklab(colRgb);
    const dE = deltaE(targetLab, colLab);
    if (dE < bestDeltaE) {
      bestDeltaE = dE;
      bestColor = col;
    }
  }

  return { color: bestColor, deltaE: bestDeltaE };
}

/**
 * Weighted RGB average for blend calculation
 * Used by Color Mixer to compute average color
 */
function computeAverageBlend(parts) {
  let r = 0, g = 0, b = 0, sum = 0;
  for (const [code, w] of Object.entries(parts)) {
    const col = PALETTE.find(c => c.code === code);
    if (!col || w <= 0) continue;
    const rgb = hexToRgb(col.hex);
    r += rgb.r * w;
    g += rgb.g * w;
    b += rgb.b * w;
    sum += w;
  }
  if (sum === 0) return '#000000';
  r = Math.round(r / sum);
  g = Math.round(g / sum);
  b = Math.round(b / sum);
  return rgbToHex(r, g, b);
}

/**
 * Decode Color Mixer share code
 * Extracts color parts from compressed base36-encoded share code
 * Format: pairs of base36 characters, each pair = [colorIndex, count]
 * Example: "0A1B" = color 0 (RH30) × 10 parts, color 1 (RH31) × 11 parts
 */
function decodeMix(code) {
  if (!code) return {};

  const parts = {};

  // Helper function: decode base36 character
  const decodeBase36 = (str) => parseInt(str, 36);

  // Parse pairs of base36 characters
  for (let i = 0; i < code.length; i += 2) {
    if (i + 1 < code.length) {
      const colourIndex = decodeBase36(code[i]);
      const count = decodeBase36(code[i + 1]);

      // Validate indices
      if (!isNaN(colourIndex) && !isNaN(count) && colourIndex >= 0 && colourIndex < PALETTE.length) {
        const colorCode = PALETTE[colourIndex].code;
        parts[colorCode] = count;
      }
    }
  }

  return parts;
}

/**
 * Convert share code to array of colors with proportions
 * Returns: [{ code, name, hex, proportion }, ...]
 */
function shareCodeToColors(shareCode) {
  const parts = decodeMix(shareCode);
  const colors = [];

  // Calculate total
  const total = Object.values(parts).reduce((sum, count) => sum + count, 0);

  if (total === 0) return [];

  // Convert to color objects with proportions
  for (const [code, count] of Object.entries(parts)) {
    const color = PALETTE.find(c => c.code === code);
    if (color) {
      colors.push({
        ...color,
        proportion: (count / total) * 100
      });
    }
  }

  return colors;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  PALETTE,
  rgbToOklab,
  oklabToRgb,
  deltaE,
  nearestColor,
  computeAverageBlend,
  decodeMix,
  shareCodeToColors,
  hexToRgb,
  rgbToHex,
  srgbToLinear,
  linearToSrgb
};
