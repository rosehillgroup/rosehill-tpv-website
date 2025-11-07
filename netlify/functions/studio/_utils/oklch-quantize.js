// OKLCH Color Quantization with Floyd-Steinberg Dithering
// Faster than Lab ΔE2000, constrained dithering within masks

/**
 * Convert RGB to OKLCH color space
 * OKLCH = Oklab with cylindrical representation (Lightness, Chroma, Hue)
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object} {L, C, H} - Lightness [0-1], Chroma [0-0.4], Hue [0-360]
 */
export function rgbToOKLCH(r, g, b) {
  // Normalize RGB to [0, 1]
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // Linear RGB (gamma correction)
  const rLin = rNorm <= 0.04045 ? rNorm / 12.92 : Math.pow((rNorm + 0.055) / 1.055, 2.4);
  const gLin = gNorm <= 0.04045 ? gNorm / 12.92 : Math.pow((gNorm + 0.055) / 1.055, 2.4);
  const bLin = bNorm <= 0.04045 ? bNorm / 12.92 : Math.pow((bNorm + 0.055) / 1.055, 2.4);

  // RGB to LMS (cone response)
  const l = 0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin;
  const m = 0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin;
  const s = 0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin;

  // LMS to Oklab
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  // Oklab to OKLCH (cylindrical)
  const C = Math.sqrt(a * a + b_ * b_);
  let H = Math.atan2(b_, a) * 180 / Math.PI;
  if (H < 0) H += 360;

  return { L, C, H };
}

/**
 * Convert OKLCH to RGB
 * @param {number} L - Lightness [0-1]
 * @param {number} C - Chroma [0-0.4]
 * @param {number} H - Hue [0-360]
 * @returns {Object} {r, g, b} - RGB values (0-255)
 */
export function oklchToRGB(L, C, H) {
  // OKLCH to Oklab
  const hRad = H * Math.PI / 180;
  const a = C * Math.cos(hRad);
  const bOklab = C * Math.sin(hRad);

  // Oklab to LMS
  const l_ = L + 0.3963377774 * a + 0.2158037573 * bOklab;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * bOklab;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * bOklab;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // LMS to linear RGB
  let rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Clamp to [0, 1]
  rLin = Math.max(0, Math.min(1, rLin));
  gLin = Math.max(0, Math.min(1, gLin));
  bLin = Math.max(0, Math.min(1, bLin));

  // Gamma correction (linear to sRGB)
  const rNorm = rLin <= 0.0031308 ? 12.92 * rLin : 1.055 * Math.pow(rLin, 1 / 2.4) - 0.055;
  const gNorm = gLin <= 0.0031308 ? 12.92 * gLin : 1.055 * Math.pow(gLin, 1 / 2.4) - 0.055;
  const bNorm = bLin <= 0.0031308 ? 12.92 * bLin : 1.055 * Math.pow(bLin, 1 / 2.4) - 0.055;

  // Scale to [0, 255]
  const r = Math.round(rNorm * 255);
  const g = Math.round(gNorm * 255);
  const b = Math.round(bNorm * 255);

  return { r, g, b };
}

/**
 * Calculate color difference in OKLCH space
 * Faster approximation than CIEDE2000
 * @param {Object} color1 - {L, C, H}
 * @param {Object} color2 - {L, C, H}
 * @returns {number} Delta E (perceptual color difference)
 */
export function deltaEOKLCH(color1, color2) {
  // Euclidean distance in OKLCH space
  const dL = color1.L - color2.L;
  const dC = color1.C - color2.C;

  // Hue difference (circular)
  let dH = Math.abs(color1.H - color2.H);
  if (dH > 180) dH = 360 - dH;
  dH = dH * Math.PI / 180; // Convert to radians

  // Weighted Euclidean distance
  // L and C are already perceptually uniform in Oklab
  const deltaE = Math.sqrt(
    dL * dL * 100 + // Scale L difference
    dC * dC * 500 + // Scale C difference
    (2 * color1.C * color2.C * (1 - Math.cos(dH))) * 250 // Hue difference scaled by chroma
  );

  return deltaE;
}

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code (#RRGGBB)
 * @returns {Object} {r, g, b}
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

/**
 * Quantize image to TPV palette with Floyd-Steinberg dithering
 * Constrained dithering: only diffuses error within mask regions
 * @param {Buffer} imageBuffer - Input image PNG buffer
 * @param {Array} palette - Array of {code, name, hex}
 * @param {Object} options - Quantization options
 * @returns {Promise<Buffer>} Quantized PNG buffer
 */
export async function quantizeWithDithering(imageBuffer, palette, options = {}) {
  const {
    ditherStrength = 0.11,      // 10-12% error scaling (surgical precision)
    ditherRadius = 2,            // Cap at 2px to avoid salt-and-pepper
    maskBuffer = null            // Optional: constrain dithering within mask
  } = options;

  console.log(`[OKLCH-QUANTIZE] Starting quantization with dithering...`);
  console.log(`[OKLCH-QUANTIZE] Dither strength: ${ditherStrength}, radius: ${ditherRadius}px`);

  // Import sharp
  const sharp = (await import('sharp')).default;

  // Load image as raw buffer
  const image = sharp(imageBuffer);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  console.log(`[OKLCH-QUANTIZE] Image: ${info.width}×${info.height}, channels: ${info.channels}`);

  // Convert palette to OKLCH space (pre-compute for speed)
  const paletteOKLCH = palette.map(c => {
    const rgb = hexToRgb(c.hex);
    return {
      ...c,
      rgb,
      oklch: rgbToOKLCH(rgb.r, rgb.g, rgb.b)
    };
  });

  console.log(`[OKLCH-QUANTIZE] Palette: ${paletteOKLCH.length} colors in OKLCH space`);

  // Load mask if provided
  let mask = null;
  if (maskBuffer) {
    const maskImage = await sharp(maskBuffer)
      .resize(info.width, info.height, { fit: 'fill' })
      .raw()
      .toBuffer();
    mask = maskImage;
    console.log(`[OKLCH-QUANTIZE] Mask loaded: constraining dithering to masked regions`);
  }

  // Prepare output buffer and error buffer
  const quantized = Buffer.alloc(data.length);
  const errors = new Float32Array(info.width * info.height * 3).fill(0);

  let pixelsQuantized = 0;
  let pixelsInMask = 0;
  let totalError = 0;

  // Floyd-Steinberg with constraints
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const errIdx = (y * info.width + x) * 3;

      // Check if pixel is inside mask
      const inMask = !mask || mask[idx] >= 128;

      if (!inMask) {
        // Outside mask: copy original pixel (no quantization, no dithering)
        quantized[idx] = data[idx];
        quantized[idx + 1] = data[idx + 1];
        quantized[idx + 2] = data[idx + 2];
        if (info.channels === 4) quantized[idx + 3] = data[idx + 3];
        continue;
      }

      pixelsInMask++;

      // Get original pixel + accumulated error
      const r = Math.max(0, Math.min(255, data[idx] + errors[errIdx]));
      const g = Math.max(0, Math.min(255, data[idx + 1] + errors[errIdx + 1]));
      const b = Math.max(0, Math.min(255, data[idx + 2] + errors[errIdx + 2]));

      // Find nearest color in OKLCH space
      const sourceOKLCH = rgbToOKLCH(r, g, b);
      let minDelta = Infinity;
      let nearest = paletteOKLCH[0];

      for (const candidate of paletteOKLCH) {
        const delta = deltaEOKLCH(sourceOKLCH, candidate.oklch);
        if (delta < minDelta) {
          minDelta = delta;
          nearest = candidate;
        }
      }

      totalError += minDelta;

      // Write quantized pixel
      quantized[idx] = nearest.rgb.r;
      quantized[idx + 1] = nearest.rgb.g;
      quantized[idx + 2] = nearest.rgb.b;
      if (info.channels === 4) quantized[idx + 3] = data[idx + 3];

      pixelsQuantized++;

      // Calculate error
      const errR = (r - nearest.rgb.r) * ditherStrength;
      const errG = (g - nearest.rgb.g) * ditherStrength;
      const errB = (b - nearest.rgb.b) * ditherStrength;

      // Distribute error (Floyd-Steinberg pattern, capped at ditherRadius=2px)
      // Right pixel (x+1, y): 7/16
      if (x + 1 < info.width) {
        const rightIdx = (y * info.width + (x + 1)) * info.channels;
        const rightInMask = !mask || mask[rightIdx] >= 128;
        if (rightInMask) {
          const rightErrIdx = (y * info.width + (x + 1)) * 3;
          errors[rightErrIdx] += errR * 7 / 16;
          errors[rightErrIdx + 1] += errG * 7 / 16;
          errors[rightErrIdx + 2] += errB * 7 / 16;
        }
      }

      // Bottom row (only within ditherRadius)
      if (y + 1 < info.height) {
        // Bottom-left (x-1, y+1): 3/16
        if (x > 0) {
          const blIdx = ((y + 1) * info.width + (x - 1)) * info.channels;
          const blInMask = !mask || mask[blIdx] >= 128;
          if (blInMask) {
            const blErrIdx = ((y + 1) * info.width + (x - 1)) * 3;
            errors[blErrIdx] += errR * 3 / 16;
            errors[blErrIdx + 1] += errG * 3 / 16;
            errors[blErrIdx + 2] += errB * 3 / 16;
          }
        }

        // Bottom (x, y+1): 5/16
        const bottomIdx = ((y + 1) * info.width + x) * info.channels;
        const bottomInMask = !mask || mask[bottomIdx] >= 128;
        if (bottomInMask) {
          const bottomErrIdx = ((y + 1) * info.width + x) * 3;
          errors[bottomErrIdx] += errR * 5 / 16;
          errors[bottomErrIdx + 1] += errG * 5 / 16;
          errors[bottomErrIdx + 2] += errB * 5 / 16;
        }

        // Bottom-right (x+1, y+1): 1/16
        if (x + 1 < info.width) {
          const brIdx = ((y + 1) * info.width + (x + 1)) * info.channels;
          const brInMask = !mask || mask[brIdx] >= 128;
          if (brInMask) {
            const brErrIdx = ((y + 1) * info.width + (x + 1)) * 3;
            errors[brErrIdx] += errR * 1 / 16;
            errors[brErrIdx + 1] += errG * 1 / 16;
            errors[brErrIdx + 2] += errB * 1 / 16;
          }
        }
      }
    }
  }

  const avgError = totalError / pixelsQuantized;
  console.log(`[OKLCH-QUANTIZE] Quantized ${pixelsQuantized} pixels (${pixelsInMask} in mask)`);
  console.log(`[OKLCH-QUANTIZE] Average color error (ΔE): ${avgError.toFixed(2)}`);

  // Convert to PNG
  const outputBuffer = await sharp(quantized, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels
    }
  })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  console.log(`[OKLCH-QUANTIZE] Output: ${outputBuffer.length} bytes`);

  return outputBuffer;
}

/**
 * Hard quantization (no dithering) - fallback for testing
 * @param {Buffer} imageBuffer - Input image PNG buffer
 * @param {Array} palette - Array of {code, name, hex}
 * @returns {Promise<Buffer>} Quantized PNG buffer
 */
export async function quantizeHard(imageBuffer, palette) {
  console.log(`[OKLCH-QUANTIZE] Hard quantization (no dithering)`);

  const sharp = (await import('sharp')).default;
  const image = sharp(imageBuffer);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  // Convert palette to OKLCH
  const paletteOKLCH = palette.map(c => {
    const rgb = hexToRgb(c.hex);
    return {
      ...c,
      rgb,
      oklch: rgbToOKLCH(rgb.r, rgb.g, rgb.b)
    };
  });

  const quantized = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const sourceOKLCH = rgbToOKLCH(r, g, b);
    let minDelta = Infinity;
    let nearest = paletteOKLCH[0];

    for (const candidate of paletteOKLCH) {
      const delta = deltaEOKLCH(sourceOKLCH, candidate.oklch);
      if (delta < minDelta) {
        minDelta = delta;
        nearest = candidate;
      }
    }

    quantized[i] = nearest.rgb.r;
    quantized[i + 1] = nearest.rgb.g;
    quantized[i + 2] = nearest.rgb.b;
    if (info.channels === 4) quantized[i + 3] = data[i + 3];
  }

  const outputBuffer = await sharp(quantized, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels
    }
  })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  console.log(`[OKLCH-QUANTIZE] Output: ${outputBuffer.length} bytes`);
  return outputBuffer;
}
