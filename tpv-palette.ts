// @rosehill/tpv-palette
// Version: 2.0
// Complete colour management for Rosehill TPV® products
// Includes OKLab color space, soft quantisation, and ΔE calculation

export type TPVColour = { code: string; name: string; hex: string };

// Full 21-colour Rosehill TPV® palette (from mixer.html)
export const PALETTE: TPVColour[] = [
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

// OKLab color space representation
export interface OKLab {
  L: number;  // Lightness (0-1)
  a: number;  // Green-red axis
  b: number;  // Blue-yellow axis
}

// RGB representation (0-255)
export interface RGB {
  r: number;
  g: number;
  b: number;
}

// ============================================================================
// COLOR SPACE CONVERSIONS
// ============================================================================

/**
 * Convert sRGB (0-255) to linear RGB (0-1)
 */
function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear RGB (0-1) to sRGB (0-255)
 */
function linearToSrgb(v: number): number {
  const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(255, c * 255)));
}

/**
 * Convert sRGB to OKLab color space
 * OKLab provides perceptually uniform color distances
 */
export function rgbToOklab(rgb: RGB): OKLab {
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
export function oklabToRgb(lab: OKLab): RGB {
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
export function deltaE(lab1: OKLab, lab2: OKLab): number {
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
export function nearestColor(rgb: RGB, palette: TPVColour[] = PALETTE): { color: TPVColour; deltaE: number } {
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
export function computeAverageBlend(parts: Record<string, number>): string {
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
export function decodeMix(code: string): Record<string, number> {
  if (!code) return {};

  const parts: Record<string, number> = {};

  // Helper function: decode base36 character
  const decodeBase36 = (str: string): number => parseInt(str, 36);

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

// ============================================================================
// SOFT QUANTISATION (Palette-Aware)
// ============================================================================

export interface QuantisationOptions {
  mode?: 'soft' | 'hard';
  edgeGuardBand?: number; // px width of edge guard band (default 8)
  mask?: ImageData;        // Binary mask (alpha channel indicates in-mask pixels)
  dither?: boolean;        // Apply dithering (default true)
}

/**
 * Quantise an image to the TPV palette with soft snapping for photorealism
 *
 * Tiered snapping algorithm:
 * - ΔE ≤ 2: Full snap to nearest color
 * - 2 < ΔE ≤ 6: Soft blend (α = 0.3 → 0.85)
 * - 6 < ΔE ≤ 10: Minimal correction (edge tolerance)
 * - ΔE > 10: Flag as out-of-gamut, apply strongest correction
 */
export function quantiseToPalette(
  image: ImageData,
  palette: TPVColour[] = PALETTE,
  options: QuantisationOptions = {}
): {
  output: ImageData;
  metrics: { deltaEmean: number; deltaEmax: number; outOfGamutPx: number };
} {
  const { mode = 'soft', edgeGuardBand = 8, mask, dither = true } = options;
  const out = new ImageData(image.width, image.height);

  let sumDeltaE = 0;
  let maxDeltaE = 0;
  let outOfGamutCount = 0;
  let processedPx = 0;

  // Build edge guard band map if mask provided
  const inEdgeBand = mask ? buildEdgeBandMap(mask, edgeGuardBand) : null;

  for (let i = 0; i < image.data.length; i += 4) {
    const r = image.data[i];
    const g = image.data[i + 1];
    const b = image.data[i + 2];
    const a = image.data[i + 3];

    // Skip transparent pixels or pixels outside mask
    if (a === 0 || (mask && mask.data[i + 3] === 0)) {
      out.data.set([r, g, b, a], i);
      continue;
    }

    // Check if pixel is in edge guard band
    const px = (i / 4) % image.width;
    const py = Math.floor((i / 4) / image.width);
    const isEdge = inEdgeBand ? inEdgeBand.get(px, py) : false;

    const { color, deltaE: dE } = nearestColor({ r, g, b }, palette);
    const targetRgb = hexToRgb(color.hex);

    sumDeltaE += dE;
    maxDeltaE = Math.max(maxDeltaE, dE);
    processedPx++;

    if (dE > 10) outOfGamutCount++;

    let finalR: number, finalG: number, finalB: number;

    if (mode === 'hard' || dE <= 2) {
      // Full snap
      finalR = targetRgb.r;
      finalG = targetRgb.g;
      finalB = targetRgb.b;
    } else if (isEdge) {
      // In edge guard band: minimal correction, preserve photo texture
      const alpha = Math.min(0.3, dE / 20); // Very subtle correction
      finalR = Math.round(r * (1 - alpha) + targetRgb.r * alpha);
      finalG = Math.round(g * (1 - alpha) + targetRgb.g * alpha);
      finalB = Math.round(b * (1 - alpha) + targetRgb.b * alpha);
    } else if (dE <= 6) {
      // Soft blend: 2 < ΔE ≤ 6
      const alpha = 0.3 + ((dE - 2) / 4) * 0.55; // Scale from 0.3 to 0.85
      finalR = Math.round(r * (1 - alpha) + targetRgb.r * alpha);
      finalG = Math.round(g * (1 - alpha) + targetRgb.g * alpha);
      finalB = Math.round(b * (1 - alpha) + targetRgb.b * alpha);
    } else {
      // Minimal correction: 6 < ΔE ≤ 10 (or >10)
      const alpha = dE > 10 ? 0.9 : 0.5;
      finalR = Math.round(r * (1 - alpha) + targetRgb.r * alpha);
      finalG = Math.round(g * (1 - alpha) + targetRgb.g * alpha);
      finalB = Math.round(b * (1 - alpha) + targetRgb.b * alpha);
    }

    // Apply dithering if enabled
    if (dither && i < image.data.length - 4) {
      const errR = r - finalR;
      const errG = g - finalG;
      const errB = b - finalB;
      // Simple error diffusion (Floyd-Steinberg pattern)
      if (i + 4 < image.data.length) {
        image.data[i + 4] += errR * 7 / 16;
        image.data[i + 5] += errG * 7 / 16;
        image.data[i + 6] += errB * 7 / 16;
      }
    }

    out.data.set([finalR, finalG, finalB, a], i);
  }

  return {
    output: out,
    metrics: {
      deltaEmean: processedPx > 0 ? sumDeltaE / processedPx : 0,
      deltaEmax: maxDeltaE,
      outOfGamutPx: outOfGamutCount / Math.max(1, processedPx),
    },
  };
}

/**
 * Build edge guard band map from binary mask
 * Returns a 2D map indicating which pixels are within edgeWidth of mask boundary
 */
function buildEdgeBandMap(mask: ImageData, edgeWidth: number): { get: (x: number, y: number) => boolean } {
  const w = mask.width;
  const h = mask.height;
  const edgeMap = new Uint8Array(w * h);

  // Simple edge detection: find pixels adjacent to transparent areas
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      if (mask.data[idx + 3] > 0) {
        // Check if any neighbor is transparent
        let isEdge = false;
        for (let dy = -edgeWidth; dy <= edgeWidth && !isEdge; dy++) {
          for (let dx = -edgeWidth; dx <= edgeWidth && !isEdge; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const nidx = (ny * w + nx) * 4;
              if (mask.data[nidx + 3] === 0) {
                isEdge = true;
              }
            }
          }
        }
        if (isEdge) edgeMap[y * w + x] = 1;
      }
    }
  }

  return {
    get: (x: number, y: number) => edgeMap[y * w + x] === 1,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function hexToRgb(hex: string): RGB {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
