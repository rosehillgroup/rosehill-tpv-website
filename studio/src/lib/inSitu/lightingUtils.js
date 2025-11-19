// TPV Studio - Lighting Utilities
// Sample floor region and compute brightness/contrast adjustment factors

/**
 * Check if a point is inside a polygon using ray casting
 * @param {number} x - Point x coordinate
 * @param {number} y - Point y coordinate
 * @param {Array<{x: number, y: number}>} polygon - Array of polygon vertices
 * @returns {boolean}
 */
function isPointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {{h: number, s: number, l: number}} HSL values (0-1)
 */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return { h, s, l };
}

/**
 * Sample pixels from the floor region of the photo and compute a lighting profile
 * @param {CanvasRenderingContext2D} photoCtx - Canvas context with photo drawn
 * @param {Array<{x: number, y: number}>} quad - Four corner points of floor region
 * @param {number} sampleCount - Number of samples to take
 * @returns {{avgLightness: number, avgContrastProxy: number}}
 */
export function sampleFloorLighting(photoCtx, quad, sampleCount = 2000) {
  if (!photoCtx || !quad || quad.length < 3) {
    return { avgLightness: 0.5, avgContrastProxy: 0.5 };
  }

  // Calculate bounding box
  const minX = Math.floor(Math.min(...quad.map(p => p.x)));
  const maxX = Math.ceil(Math.max(...quad.map(p => p.x)));
  const minY = Math.floor(Math.min(...quad.map(p => p.y)));
  const maxY = Math.ceil(Math.max(...quad.map(p => p.y)));

  const width = maxX - minX;
  const height = maxY - minY;

  if (width <= 0 || height <= 0) {
    return { avgLightness: 0.5, avgContrastProxy: 0.5 };
  }

  // Get image data for the bounding box region
  let imageData;
  try {
    imageData = photoCtx.getImageData(minX, minY, width, height);
  } catch (e) {
    console.warn('[LIGHTING] Failed to get image data:', e);
    return { avgLightness: 0.5, avgContrastProxy: 0.5 };
  }

  const data = imageData.data;
  const lightnesses = [];

  // Random sampling with rejection
  let attempts = 0;
  const maxAttempts = sampleCount * 5;

  while (lightnesses.length < sampleCount && attempts < maxAttempts) {
    attempts++;

    // Random point in bounding box
    const x = minX + Math.random() * width;
    const y = minY + Math.random() * height;

    // Check if inside quad
    if (!isPointInPolygon(x, y, quad)) continue;

    // Get pixel from image data
    const px = Math.floor(x - minX);
    const py = Math.floor(y - minY);
    const idx = (py * width + px) * 4;

    if (idx < 0 || idx >= data.length - 3) continue;

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Convert to HSL and get lightness
    const { l } = rgbToHsl(r, g, b);
    lightnesses.push(l);
  }

  if (lightnesses.length === 0) {
    return { avgLightness: 0.5, avgContrastProxy: 0.5 };
  }

  // Calculate average lightness
  const avgLightness = lightnesses.reduce((sum, l) => sum + l, 0) / lightnesses.length;

  // Calculate contrast proxy (standard deviation of lightness)
  const variance = lightnesses.reduce((sum, l) => sum + Math.pow(l - avgLightness, 2), 0) / lightnesses.length;
  const stdDev = Math.sqrt(variance);

  // Normalize contrast proxy to 0-1 range (typical stddev is 0.05-0.25)
  const avgContrastProxy = Math.min(1, stdDev / 0.25);

  return { avgLightness, avgContrastProxy };
}

/**
 * Derive brightness and contrast factors from lighting profile
 * @param {{avgLightness: number, avgContrastProxy: number}} profile
 * @returns {{brightness: number, contrast: number}}
 */
export function deriveLightingFactors(profile) {
  let brightness = 1.0;
  let contrast = 1.0;

  // Target average lightness around 0.5 (neutral)
  // If floor is dark, we darken the design. If bright, we brighten it.
  const targetL = 0.5;
  const delta = profile.avgLightness - targetL;

  // Apply correction - if floor is dark (low L), reduce brightness
  brightness += delta * 0.6;

  // Use contrast proxy to adjust contrast
  // Low contrast floor = reduce design contrast, high = increase
  contrast += (profile.avgContrastProxy - 0.5) * 0.4;

  // Clamp to reasonable range
  brightness = Math.max(0.7, Math.min(1.3, brightness));
  contrast = Math.max(0.8, Math.min(1.25, contrast));

  return { brightness, contrast };
}
