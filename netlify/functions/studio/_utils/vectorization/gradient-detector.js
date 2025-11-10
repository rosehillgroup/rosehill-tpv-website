// Gradient & Soft Shadow Detector
// Detects photorealistic lighting effects that would fail QC
//
// Strategy:
// 1. Convert to greyscale and analyze local contrast
// 2. Use Sobel edge detection to find gradient regions
// 3. Calculate color variance in local neighborhoods
// 4. Flag as gradient if soft transitions exceed threshold

import sharp from 'sharp';

/**
 * Detect gradients and soft shadows in raster image
 * Used as QC gate to reject photorealistic outputs
 *
 * @param {Buffer} imageBuffer - PNG/JPEG buffer
 * @returns {Promise<Object>} {hasGradients, confidence, metrics}
 */
export async function detectGradients(imageBuffer) {
  console.log('[GRADIENT-DETECTOR] Analyzing image for soft shadows...');

  try {
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;

    console.log(`[GRADIENT-DETECTOR] Image: ${width}×${height}px`);

    // Convert to greyscale and extract raw pixel data
    const { data, info } = await sharp(imageBuffer)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // ========================================================================
    // METHOD 1: Local contrast analysis
    // ========================================================================

    // Sample grid of 10×10 regions and calculate variance within each
    const gridSize = 10;
    const regionWidth = Math.floor(width / gridSize);
    const regionHeight = Math.floor(height / gridSize);

    let gradientRegionCount = 0;
    let totalRegions = gridSize * gridSize;

    for (let gy = 0; gy < gridSize; gy++) {
      for (let gx = 0; gx < gridSize; gx++) {
        const x0 = gx * regionWidth;
        const y0 = gy * regionHeight;
        const x1 = Math.min(x0 + regionWidth, width);
        const y1 = Math.min(y0 + regionHeight, height);

        // Calculate variance in this region
        const variance = calculateRegionVariance(data, width, x0, y0, x1, y1);

        // If variance is moderate (not flat, not high-contrast edge),
        // it suggests a gradient/soft shadow
        // Flat regions: variance < 100
        // Hard edges: variance > 2000
        // Gradients: 100-2000 (smooth transitions)
        if (variance > 100 && variance < 2000) {
          gradientRegionCount++;
        }
      }
    }

    const gradientRatio = gradientRegionCount / totalRegions;

    console.log(`[GRADIENT-DETECTOR] Gradient regions: ${gradientRegionCount}/${totalRegions} (${(gradientRatio * 100).toFixed(1)}%)`);

    // ========================================================================
    // METHOD 2: Edge softness analysis
    // ========================================================================

    // Apply Sobel edge detection
    const edges = applySobelEdgeDetection(data, width, height);

    // Count soft edges (low gradient magnitude)
    let softEdgeCount = 0;
    let totalEdgePixels = 0;
    const softEdgeThreshold = 50; // Low gradient = soft edge

    for (let i = 0; i < edges.length; i++) {
      if (edges[i] > 10) { // Any edge
        totalEdgePixels++;
        if (edges[i] < softEdgeThreshold) {
          softEdgeCount++;
        }
      }
    }

    const softEdgeRatio = totalEdgePixels > 0 ? softEdgeCount / totalEdgePixels : 0;

    console.log(`[GRADIENT-DETECTOR] Soft edges: ${softEdgeCount}/${totalEdgePixels} (${(softEdgeRatio * 100).toFixed(1)}%)`);

    // ========================================================================
    // DECISION: Flag as gradient if either method exceeds threshold
    // ========================================================================

    const hasGradients = gradientRatio > 0.20 || softEdgeRatio > 0.30;
    const confidence = Math.max(gradientRatio, softEdgeRatio);

    console.log(`[GRADIENT-DETECTOR] Result: ${hasGradients ? 'GRADIENTS DETECTED' : 'CLEAN'} (confidence: ${(confidence * 100).toFixed(1)}%)`);

    return {
      hasGradients,
      confidence,
      metrics: {
        gradient_region_ratio: gradientRatio,
        soft_edge_ratio: softEdgeRatio,
        gradient_regions: gradientRegionCount,
        total_regions: totalRegions,
        soft_edges: softEdgeCount,
        total_edge_pixels: totalEdgePixels
      }
    };

  } catch (error) {
    console.error('[GRADIENT-DETECTOR] Error:', error);
    throw new Error(`Gradient detection failed: ${error.message}`);
  }
}

/**
 * Calculate variance in a region (measure of contrast/gradient)
 * @param {Buffer} data - Greyscale pixel data
 * @param {number} width - Image width
 * @param {number} x0 - Region start x
 * @param {number} y0 - Region start y
 * @param {number} x1 - Region end x
 * @param {number} y1 - Region end y
 * @returns {number} Variance
 */
function calculateRegionVariance(data, width, x0, y0, x1, y1) {
  const values = [];

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const idx = y * width + x;
      values.push(data[idx]);
    }
  }

  // Calculate mean
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;

  // Calculate variance
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;

  return variance;
}

/**
 * Apply Sobel edge detection to find gradients
 * Returns gradient magnitude for each pixel
 *
 * @param {Buffer} data - Greyscale pixel data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Float32Array} Gradient magnitudes
 */
function applySobelEdgeDetection(data, width, height) {
  const gradients = new Float32Array(width * height);

  // Sobel kernels
  const sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];

  const sobelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ];

  // Apply Sobel operator (skip borders)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0;
      let gy = 0;

      // Convolve with Sobel kernels
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixelIdx = (y + ky) * width + (x + kx);
          const pixelValue = data[pixelIdx];

          gx += pixelValue * sobelX[ky + 1][kx + 1];
          gy += pixelValue * sobelY[ky + 1][kx + 1];
        }
      }

      // Gradient magnitude
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      gradients[y * width + x] = magnitude;
    }
  }

  return gradients;
}
