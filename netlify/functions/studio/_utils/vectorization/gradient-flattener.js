// Gradient Flattening Pre-Processor
// Converts soft gradients to flat posterized regions before vectorization
//
// Pipeline:
// 1. Bilateral filter (edge-preserving denoise)
// 2. K-means Lab palette clamp (hard posterization)
// 3. Speckle cleanup (mode filter)
// 4. Edge hardening
// 5. Re-check gradients

/**
 * Flatten gradients in raster image to prepare for vectorization
 *
 * @param {Buffer} imageBuffer - Input image buffer
 * @param {Object} options - Flattening options
 * @param {Object} options.bilateral - Bilateral filter params {d, sigmaC, sigmaS}
 * @param {number} options.k - Number of colors for posterization
 * @returns {Promise<Object>} {buffer, metrics}
 */
async function flattenGradients(imageBuffer, options = {}) {
  const sharp = (await import('sharp')).default;

  const {
    bilateral = { d: 5, sigmaC: 45, sigmaS: 9 },
    k = 6
  } = options;

  console.log(`[FLATTEN] Starting gradient flattening (k=${k})...`);

  try {
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;

    console.log(`[FLATTEN] Image: ${width}×${height}px`);

    // ========================================================================
    // STEP 1: Edge-preserving smoothing
    // ========================================================================
    // Sharp's median filter provides edge-preserving smoothing
    // Bilateral filter would be ideal but Sharp doesn't have it built-in
    // Median filter is a good practical alternative

    console.log('[FLATTEN] Step 1/5: Edge-preserving smoothing...');

    const smoothed = await sharp(imageBuffer)
      .median(bilateral.d)  // Use median filter for edge-preserving smoothing
      .toBuffer();

    // ========================================================================
    // STEP 2: Hard posterization via k-means in Lab color space
    // ========================================================================

    console.log('[FLATTEN] Step 2/5: Hard posterization (k-means Lab)...');

    // Get raw pixel data
    const { data: rawData, info } = await sharp(smoothed)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const channels = info.channels;

    // Convert RGB to Lab and perform k-means
    const { posterized, palette } = await posterizeLabKMeans(rawData, width, height, channels, k);

    console.log(`[FLATTEN] Posterized to ${palette.length} colors`);

    // ========================================================================
    // STEP 3: Speckle cleanup (mode/majority filter)
    // ========================================================================

    console.log('[FLATTEN] Step 3/5: Speckle cleanup...');

    const cleaned = applyModeFilter(posterized, width, height, channels, 3);

    // ========================================================================
    // STEP 4: Edge hardening
    // ========================================================================

    console.log('[FLATTEN] Step 4/5: Edge hardening...');

    // Apply sharpening to crisp up edges
    const hardenedRaw = await sharp(cleaned, {
      raw: { width, height, channels }
    })
      .sharpen({ sigma: 1.0, m1: 1.0, m2: 0.5 })
      .raw()
      .toBuffer();

    // Snap pixels back to exact palette colors (filtering may have created interpolated values)
    console.log('[FLATTEN] Snapping to exact palette colors...');
    const snapped = Buffer.alloc(hardenedRaw.length);

    for (let i = 0; i < hardenedRaw.length; i += channels) {
      const r = hardenedRaw[i];
      const g = hardenedRaw[i + 1];
      const b = hardenedRaw[i + 2];
      const a = channels === 4 ? hardenedRaw[i + 3] : 255;

      // Find nearest palette color (Euclidean distance in RGB)
      let minDist = Infinity;
      let nearestColor = palette[0];

      for (const paletteColor of palette) {
        const dist = Math.sqrt(
          Math.pow(r - paletteColor.r, 2) +
          Math.pow(g - paletteColor.g, 2) +
          Math.pow(b - paletteColor.b, 2)
        );

        if (dist < minDist) {
          minDist = dist;
          nearestColor = paletteColor;
        }
      }

      snapped[i] = nearestColor.r;
      snapped[i + 1] = nearestColor.g;
      snapped[i + 2] = nearestColor.b;
      if (channels === 4) snapped[i + 3] = a;
    }

    // Convert back to PNG
    const hardened = await sharp(snapped, {
      raw: { width, height, channels }
    })
      .png()
      .toBuffer();

    console.log(`[FLATTEN] Snapped to exact ${palette.length} palette colors`);

    // ========================================================================
    // STEP 5: Re-check gradients
    // ========================================================================

    console.log('[FLATTEN] Step 5/5: Re-checking gradients...');

    const { detectGradients } = require('./gradient-detector.js');
    const postMetrics = await detectGradients(hardened);

    console.log(`[FLATTEN] Post-flatten: gradient_ratio=${(postMetrics.metrics.gradient_region_ratio * 100).toFixed(1)}%, soft_edge_ratio=${(postMetrics.metrics.soft_edge_ratio * 100).toFixed(1)}%`);

    console.log('[FLATTEN] Flattening complete');

    return {
      buffer: hardened,
      metrics: {
        k_used: k,
        palette_colors: palette.length,
        post_flatten_gradient_ratio: postMetrics.metrics.gradient_region_ratio,
        post_flatten_soft_edge_ratio: postMetrics.metrics.soft_edge_ratio,
        gradient_still_detected: postMetrics.hasGradients
      }
    };

  } catch (error) {
    console.error('[FLATTEN] Error:', error);
    throw new Error(`Gradient flattening failed: ${error.message}`);
  }
}

/**
 * Posterize image using k-means clustering in Lab color space
 * @param {Buffer} data - Raw RGBA pixel data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} channels - Number of channels
 * @param {number} k - Number of colors
 * @returns {Object} {posterized, palette}
 */
async function posterizeLabKMeans(data, width, height, channels, k) {
  // Extract RGB pixels (skip alpha for clustering)
  const pixels = [];
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    pixels.push({ r, g, b });
  }

  // Convert RGB to Lab
  const labPixels = pixels.map(rgbToLab);

  // K-means clustering in Lab space
  const labCentroids = kMeansClustering(labPixels, k, 20);

  // Convert centroids back to RGB
  const rgbPalette = labCentroids.map(labToRgb);

  console.log(`[FLATTEN] K-means converged: ${rgbPalette.length} colors`);

  // Map each pixel to nearest centroid
  const posterized = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = channels === 4 ? data[i + 3] : 255;

    const lab = rgbToLab({ r, g, b });
    const nearestIdx = findNearestCentroidIndex(lab, labCentroids);
    const nearestRgb = rgbPalette[nearestIdx];

    posterized[i] = nearestRgb.r;
    posterized[i + 1] = nearestRgb.g;
    posterized[i + 2] = nearestRgb.b;
    if (channels === 4) posterized[i + 3] = a;
  }

  return { posterized, palette: rgbPalette };
}

/**
 * Apply mode (majority) filter to remove speckles
 * @param {Buffer} data - Raw pixel data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} channels - Number of channels
 * @param {number} size - Filter kernel size
 * @returns {Buffer} Filtered data
 */
function applyModeFilter(data, width, height, channels, size) {
  const output = Buffer.alloc(data.length);
  const half = Math.floor(size / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const colorCounts = new Map();

      // Collect colors in neighborhood
      for (let dy = -half; dy <= half; dy++) {
        for (let dx = -half; dx <= half; dx++) {
          const nx = Math.max(0, Math.min(width - 1, x + dx));
          const ny = Math.max(0, Math.min(height - 1, y + dy));
          const idx = (ny * width + nx) * channels;

          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const colorKey = `${r},${g},${b}`;

          colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1);
        }
      }

      // Find most common color (mode)
      let maxCount = 0;
      let modeColor = null;

      for (const [colorKey, count] of colorCounts.entries()) {
        if (count > maxCount) {
          maxCount = count;
          modeColor = colorKey;
        }
      }

      // Set output pixel to mode color
      const idx = (y * width + x) * channels;
      const [r, g, b] = modeColor.split(',').map(Number);

      output[idx] = r;
      output[idx + 1] = g;
      output[idx + 2] = b;
      if (channels === 4) output[idx + 3] = data[idx + 3]; // Preserve alpha
    }
  }

  return output;
}

/**
 * K-means clustering
 * @param {Array} points - Array of {L, a, b} Lab color points
 * @param {number} k - Number of clusters
 * @param {number} maxIter - Maximum iterations
 * @returns {Array} Cluster centroids
 */
function kMeansClustering(points, k, maxIter = 20) {
  // Initialize centroids using k-means++
  const centroids = [];
  centroids.push({ ...points[Math.floor(Math.random() * points.length)] });

  for (let i = 1; i < k; i++) {
    const distances = points.map(p => {
      const minDist = Math.min(...centroids.map(c => labDistance(p, c)));
      return minDist * minDist;
    });

    const totalDist = distances.reduce((sum, d) => sum + d, 0);
    let random = Math.random() * totalDist;

    for (let j = 0; j < points.length; j++) {
      random -= distances[j];
      if (random <= 0) {
        centroids.push({ ...points[j] });
        break;
      }
    }
  }

  // Iterate k-means
  for (let iter = 0; iter < maxIter; iter++) {
    const clusters = Array.from({ length: k }, () => []);

    // Assign points to nearest centroid
    for (const point of points) {
      const nearestIdx = findNearestCentroidIndex(point, centroids);
      clusters[nearestIdx].push(point);
    }

    // Update centroids
    const newCentroids = clusters.map((cluster, i) => {
      if (cluster.length === 0) return centroids[i];

      const sum = cluster.reduce(
        (acc, p) => ({ L: acc.L + p.L, a: acc.a + p.a, b: acc.b + p.b }),
        { L: 0, a: 0, b: 0 }
      );

      return {
        L: sum.L / cluster.length,
        a: sum.a / cluster.length,
        b: sum.b / cluster.length
      };
    });

    // Check convergence
    const maxMovement = Math.max(
      ...centroids.map((c, i) => labDistance(c, newCentroids[i]))
    );

    centroids.splice(0, centroids.length, ...newCentroids);

    if (maxMovement < 0.1) {
      console.log(`[FLATTEN] K-means converged after ${iter + 1} iterations`);
      break;
    }
  }

  return centroids;
}

/**
 * Find nearest centroid index
 * @param {Object} point - Lab color point
 * @param {Array} centroids - Array of centroids
 * @returns {number} Index of nearest centroid
 */
function findNearestCentroidIndex(point, centroids) {
  let minDist = Infinity;
  let nearestIdx = 0;

  for (let i = 0; i < centroids.length; i++) {
    const dist = labDistance(point, centroids[i]);
    if (dist < minDist) {
      minDist = dist;
      nearestIdx = i;
    }
  }

  return nearestIdx;
}

/**
 * Convert RGB to Lab color space
 * @param {Object} rgb - {r, g, b}
 * @returns {Object} {L, a, b}
 */
function rgbToLab({ r, g, b }) {
  // RGB to XYZ
  let rNorm = r / 255;
  let gNorm = g / 255;
  let bNorm = b / 255;

  rNorm = rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92;
  gNorm = gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92;
  bNorm = bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92;

  const x = (rNorm * 0.4124 + gNorm * 0.3576 + bNorm * 0.1805) * 100;
  const y = (rNorm * 0.2126 + gNorm * 0.7152 + bNorm * 0.0722) * 100;
  const z = (rNorm * 0.0193 + gNorm * 0.1192 + bNorm * 0.9505) * 100;

  // XYZ to Lab
  const xn = 95.047;
  const yn = 100.000;
  const zn = 108.883;

  const fx = x / xn > 0.008856 ? Math.pow(x / xn, 1 / 3) : (7.787 * x / xn) + (16 / 116);
  const fy = y / yn > 0.008856 ? Math.pow(y / yn, 1 / 3) : (7.787 * y / yn) + (16 / 116);
  const fz = z / zn > 0.008856 ? Math.pow(z / zn, 1 / 3) : (7.787 * z / zn) + (16 / 116);

  const L = (116 * fy) - 16;
  const a = 500 * (fx - fy);
  const bLab = 200 * (fy - fz);

  return { L, a, b: bLab };
}

/**
 * Convert Lab to RGB color space
 * @param {Object} lab - {L, a, b}
 * @returns {Object} {r, g, b}
 */
function labToRgb({ L, a, b }) {
  // Lab to XYZ
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const xn = 95.047;
  const yn = 100.000;
  const zn = 108.883;

  const x = fx * fx * fx > 0.008856 ? fx * fx * fx * xn : ((fx - 16 / 116) / 7.787) * xn;
  const y = fy * fy * fy > 0.008856 ? fy * fy * fy * yn : ((fy - 16 / 116) / 7.787) * yn;
  const z = fz * fz * fz > 0.008856 ? fz * fz * fz * zn : ((fz - 16 / 116) / 7.787) * zn;

  // XYZ to RGB (sRGB D65)
  let r = (x * 3.2406 + y * -1.5372 + z * -0.4986) / 100;
  let g = (x * -0.9689 + y * 1.8758 + z * 0.0415) / 100;
  let bRgb = (x * 0.0557 + y * -0.2040 + z * 1.0570) / 100;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  bRgb = bRgb > 0.0031308 ? 1.055 * Math.pow(bRgb, 1 / 2.4) - 0.055 : 12.92 * bRgb;

  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(bRgb * 255)))
  };
}

/**
 * Calculate distance in Lab color space
 * @param {Object} c1 - Lab color
 * @param {Object} c2 - Lab color
 * @returns {number} Distance
 */
function labDistance(c1, c2) {
  const dL = c1.L - c2.L;
  const da = c1.a - c2.a;
  const db = c1.b - c2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

module.exports = {
  flattenGradients
};
