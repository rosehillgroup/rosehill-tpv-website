// K-means Color Quantization
// Reduces image to ≤8 colors while preserving visual appearance
//
// Strategy:
// 1. Sample pixel colors from image
// 2. K-means clustering in RGB space
// 3. Map each pixel to nearest cluster centroid
// 4. Return quantized image buffer and palette



/**
 * Quantize image colors using K-means clustering
 *
 * @param {Buffer} imageBuffer - Input image buffer
 * @param {number} maxColors - Maximum colors (1-8)
 * @returns {Promise<Object>} {buffer, palette, metadata}
 */
async function quantizeColors(imageBuffer, maxColors = 6) {
  const sharp = (await import('sharp')).default;

  console.log(`[QUANTIZER] Reducing to ${maxColors} colors using K-means...`);

  try {
    // Get image data
    const { data, info } = await sharp(imageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const pixelCount = width * height;

    console.log(`[QUANTIZER] Image: ${width}×${height}px, ${channels} channels`);

    // ========================================================================
    // STEP 1: Sample pixels for K-means (use all pixels for accuracy)
    // ========================================================================

    const pixels = [];
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = channels === 4 ? data[i + 3] : 255;

      // Skip fully transparent pixels
      if (a < 128) continue;

      pixels.push({ r, g, b });
    }

    console.log(`[QUANTIZER] Sampled ${pixels.length} opaque pixels`);

    // ========================================================================
    // STEP 2: K-means clustering
    // ========================================================================

    const palette = kMeansClustering(pixels, maxColors);

    console.log(`[QUANTIZER] Generated palette with ${palette.length} colors:`);
    palette.forEach((color, i) => {
      console.log(`  Color ${i + 1}: rgb(${color.r}, ${color.g}, ${color.b})`);
    });

    // ========================================================================
    // STEP 3: Map pixels to nearest palette color
    // ========================================================================

    const quantizedData = Buffer.alloc(data.length);

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = channels === 4 ? data[i + 3] : 255;

      // Skip fully transparent pixels
      if (a < 128) {
        quantizedData[i] = 0;
        quantizedData[i + 1] = 0;
        quantizedData[i + 2] = 0;
        if (channels === 4) quantizedData[i + 3] = 0;
        continue;
      }

      // Find nearest palette color
      const nearest = findNearestColor({ r, g, b }, palette);

      quantizedData[i] = nearest.r;
      quantizedData[i + 1] = nearest.g;
      quantizedData[i + 2] = nearest.b;
      if (channels === 4) quantizedData[i + 3] = a;
    }

    // ========================================================================
    // STEP 4: Create quantized image buffer
    // ========================================================================

    const quantizedBuffer = await sharp(quantizedData, {
      raw: {
        width,
        height,
        channels
      }
    })
      .png()
      .toBuffer();

    console.log(`[QUANTIZER] Quantization complete: ${palette.length} colors`);

    return {
      buffer: quantizedBuffer,
      palette,
      metadata: {
        original_pixel_count: pixelCount,
        opaque_pixel_count: pixels.length,
        color_count: palette.length,
        width,
        height
      }
    };

  } catch (error) {
    console.error('[QUANTIZER] Error:', error);
    throw new Error(`Color quantization failed: ${error.message}`);
  }
}

/**
 * K-means clustering in RGB space
 * @param {Array<Object>} pixels - Array of {r, g, b} objects
 * @param {number} k - Number of clusters
 * @returns {Array<Object>} Cluster centroids (palette)
 */
function kMeansClustering(pixels, k) {
  const maxIterations = 20;
  const convergenceThreshold = 1; // Stop if centroids move less than 1 unit

  // Initialize centroids using k-means++ for better initial distribution
  let centroids = initializeCentroidsKMeansPlusPlus(pixels, k);

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign pixels to nearest centroid
    const clusters = Array.from({ length: k }, () => []);

    for (const pixel of pixels) {
      const nearestIdx = findNearestCentroidIndex(pixel, centroids);
      clusters[nearestIdx].push(pixel);
    }

    // Calculate new centroids
    const newCentroids = clusters.map(cluster => {
      if (cluster.length === 0) {
        // Keep old centroid if cluster is empty
        return centroids[clusters.indexOf(cluster)];
      }

      const sum = cluster.reduce(
        (acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }),
        { r: 0, g: 0, b: 0 }
      );

      return {
        r: Math.round(sum.r / cluster.length),
        g: Math.round(sum.g / cluster.length),
        b: Math.round(sum.b / cluster.length)
      };
    });

    // Check convergence
    const maxMovement = Math.max(
      ...centroids.map((c, i) => colorDistance(c, newCentroids[i]))
    );

    centroids = newCentroids;

    if (maxMovement < convergenceThreshold) {
      console.log(`[QUANTIZER] Converged after ${iter + 1} iterations`);
      break;
    }
  }

  return centroids;
}

/**
 * Initialize centroids using k-means++ algorithm
 * Ensures better initial distribution than random selection
 *
 * @param {Array<Object>} pixels - Pixel array
 * @param {number} k - Number of centroids
 * @returns {Array<Object>} Initial centroids
 */
function initializeCentroidsKMeansPlusPlus(pixels, k) {
  const centroids = [];

  // Choose first centroid randomly
  centroids.push({ ...pixels[Math.floor(Math.random() * pixels.length)] });

  // Choose remaining centroids with probability proportional to distance squared
  for (let i = 1; i < k; i++) {
    const distances = pixels.map(pixel => {
      const minDist = Math.min(...centroids.map(c => colorDistance(pixel, c)));
      return minDist * minDist;
    });

    const totalDist = distances.reduce((sum, d) => sum + d, 0);
    let random = Math.random() * totalDist;

    for (let j = 0; j < pixels.length; j++) {
      random -= distances[j];
      if (random <= 0) {
        centroids.push({ ...pixels[j] });
        break;
      }
    }
  }

  return centroids;
}

/**
 * Find nearest color in palette
 * @param {Object} color - {r, g, b}
 * @param {Array<Object>} palette - Array of colors
 * @returns {Object} Nearest color
 */
function findNearestColor(color, palette) {
  let minDist = Infinity;
  let nearest = palette[0];

  for (const paletteColor of palette) {
    const dist = colorDistance(color, paletteColor);
    if (dist < minDist) {
      minDist = dist;
      nearest = paletteColor;
    }
  }

  return nearest;
}

/**
 * Find nearest centroid index
 * @param {Object} pixel - {r, g, b}
 * @param {Array<Object>} centroids - Array of centroids
 * @returns {number} Index of nearest centroid
 */
function findNearestCentroidIndex(pixel, centroids) {
  let minDist = Infinity;
  let nearestIdx = 0;

  for (let i = 0; i < centroids.length; i++) {
    const dist = colorDistance(pixel, centroids[i]);
    if (dist < minDist) {
      minDist = dist;
      nearestIdx = i;
    }
  }

  return nearestIdx;
}

/**
 * Euclidean distance in RGB space
 * @param {Object} c1 - {r, g, b}
 * @param {Object} c2 - {r, g, b}
 * @returns {number} Distance
 */
function colorDistance(c1, c2) {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

module.exports = {
  quantizeColors
};
