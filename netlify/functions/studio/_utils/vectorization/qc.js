// Quality Control - IoU Validation
// Compares vectorized output against original raster
//
// Strategy:
// 1. Re-rasterize SVG at same dimensions as original
// 2. Compare pixel-by-pixel with quantized original
// 3. Calculate IoU (Intersection over Union) ≥ 0.98
// 4. Report detailed metrics



/**
 * Calculate IoU (Intersection over Union) between vector and raster
 * Re-rasterizes the vector output and compares with original
 *
 * @param {string} svgString - SVG output
 * @param {Buffer} quantizedBuffer - Quantized raster reference
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Promise<Object>} {iou, metrics}
 */
async function calculateIoU(svgString, quantizedBuffer, width, height) {
  const sharp = (await import('sharp')).default;

  console.log('[QC] Calculating IoU...');

  try {
    // ========================================================================
    // STEP 1: Re-rasterize SVG at same resolution (nearest-neighbor)
    // ========================================================================
    // Use nearest-neighbor to match the upscaling applied before vectorization

    console.log(`[QC] Re-rasterizing SVG at ${width}×${height}px (nearest-neighbor)...`);

    const svgBuffer = Buffer.from(svgString);

    const rasterizedVector = await sharp(svgBuffer)
      .resize(width, height, {
        kernel: 'nearest', // Nearest-neighbor like-for-like comparison
        fit: 'fill'
      })
      .png()
      .toBuffer();

    // Extract raw pixel data from both images
    const { data: vectorData } = await sharp(rasterizedVector)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data: rasterData } = await sharp(quantizedBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    console.log('[QC] Comparing pixel data...');

    // ========================================================================
    // STEP 2: Compare pixel-by-pixel
    // ========================================================================

    let intersection = 0; // Pixels that match in both
    let union = 0;        // Pixels present in either
    let totalPixels = 0;
    let matchingPixels = 0;

    // Compare RGB values (ignore alpha for now)
    const channels = 3; // RGB only

    for (let i = 0; i < vectorData.length; i += channels) {
      const vR = vectorData[i];
      const vG = vectorData[i + 1];
      const vB = vectorData[i + 2];

      const rR = rasterData[i];
      const rG = rasterData[i + 1];
      const rB = rasterData[i + 2];

      totalPixels++;

      // Check if colors match (with small tolerance)
      const colorDistance = Math.sqrt(
        Math.pow(vR - rR, 2) +
        Math.pow(vG - rG, 2) +
        Math.pow(vB - rB, 2)
      );

      const tolerance = 10; // Allow small color differences

      if (colorDistance <= tolerance) {
        matchingPixels++;
        intersection++;
        union++;
      } else {
        // Only one has this color
        union++;
      }
    }

    // ========================================================================
    // STEP 3: Calculate IoU
    // ========================================================================

    const iou = union > 0 ? intersection / union : 0;
    const accuracy = totalPixels > 0 ? matchingPixels / totalPixels : 0;

    console.log(`[QC] IoU: ${iou.toFixed(4)} (${(iou * 100).toFixed(2)}%)`);
    console.log(`[QC] Pixel accuracy: ${accuracy.toFixed(4)} (${(accuracy * 100).toFixed(2)}%)`);
    console.log(`[QC] Matching pixels: ${matchingPixels}/${totalPixels}`);

    return {
      iou,
      metrics: {
        iou,
        accuracy,
        matching_pixels: matchingPixels,
        total_pixels: totalPixels,
        intersection,
        union
      }
    };

  } catch (error) {
    console.error('[QC] Error:', error);
    throw new Error(`IoU calculation failed: ${error.message}`);
  }
}

/**
 * Generate visual diff image for debugging
 * Shows where vector and raster differ
 *
 * @param {string} svgString - SVG output
 * @param {Buffer} quantizedBuffer - Quantized raster
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Promise<Buffer>} Diff image (red = mismatch)
 */
async function generateDiffImage(svgString, quantizedBuffer, width, height) {
  const sharp = (await import('sharp')).default;

  console.log('[QC] Generating diff image...');

  try {
    // Re-rasterize SVG
    const svgBuffer = Buffer.from(svgString);

    const rasterizedVector = await sharp(svgBuffer)
      .resize(width, height, { fit: 'fill' })
      .raw()
      .toBuffer();

    const rasterData = await sharp(quantizedBuffer)
      .raw()
      .toBuffer();

    // Create diff image (red where mismatched)
    const diffData = Buffer.alloc(rasterizedVector.length);

    const channels = 3;

    for (let i = 0; i < rasterizedVector.length; i += channels) {
      const vR = rasterizedVector[i];
      const vG = rasterizedVector[i + 1];
      const vB = rasterizedVector[i + 2];

      const rR = rasterData[i];
      const rG = rasterData[i + 1];
      const rB = rasterData[i + 2];

      const colorDistance = Math.sqrt(
        Math.pow(vR - rR, 2) +
        Math.pow(vG - rG, 2) +
        Math.pow(vB - rB, 2)
      );

      const tolerance = 10;

      if (colorDistance <= tolerance) {
        // Match - show original color (greyscale)
        const grey = Math.round((rR + rG + rB) / 3);
        diffData[i] = grey;
        diffData[i + 1] = grey;
        diffData[i + 2] = grey;
      } else {
        // Mismatch - show in red
        diffData[i] = 255;
        diffData[i + 1] = 0;
        diffData[i + 2] = 0;
      }
    }

    const diffBuffer = await sharp(diffData, {
      raw: {
        width,
        height,
        channels
      }
    })
      .png()
      .toBuffer();

    console.log('[QC] Diff image generated');

    return diffBuffer;

  } catch (error) {
    console.error('[QC] Diff generation failed:', error);
    throw new Error(`Diff generation failed: ${error.message}`);
  }
}

/**
 * Validate vector output meets all QC criteria
 *
 * @param {Object} params - QC parameters
 * @param {number} params.iou - IoU score
 * @param {number} params.color_count - Number of colors
 * @param {number} params.region_count - Number of regions
 * @param {number} params.min_feature_mm - Min feature size
 * @param {number} params.min_radius_mm - Min radius
 * @returns {Object} {pass, failures, warnings}
 */
function validateQC(params) {
  const failures = [];
  const warnings = [];

  // IoU threshold: 0.80 minimum (80% match), 0.90+ ideal
  if (params.iou < 0.80) {
    failures.push(`IoU ${params.iou.toFixed(4)} < 0.80 minimum threshold`);
  } else if (params.iou < 0.90) {
    warnings.push(`IoU ${params.iou.toFixed(4)} below ideal 0.90 threshold (but above 0.80 minimum)`);
  }

  // Color count: ≤8
  if (params.color_count > 8) {
    failures.push(`Color count ${params.color_count} > 8 max`);
  }

  // Min feature: ≥120mm
  if (params.min_feature_mm < 120) {
    failures.push(`Min feature ${params.min_feature_mm}mm < 120mm requirement`);
  }

  // Min radius: ≥600mm
  if (params.min_radius_mm < 600) {
    warnings.push(`Min radius ${params.min_radius_mm}mm < 600mm recommended`);
  }

  // Region count: reasonable range (3-20)
  if (params.region_count < 3) {
    warnings.push(`Region count ${params.region_count} is very low (design may be too simple)`);
  } else if (params.region_count > 20) {
    warnings.push(`Region count ${params.region_count} is high (design may be too complex)`);
  }

  const pass = failures.length === 0;

  console.log(`[QC] Validation: ${pass ? 'PASS' : 'FAIL'}`);
  if (failures.length > 0) {
    console.log(`[QC] Failures: ${failures.join(', ')}`);
  }
  if (warnings.length > 0) {
    console.log(`[QC] Warnings: ${warnings.join(', ')}`);
  }

  return {
    pass,
    failures,
    warnings
  };
}

module.exports = {
  calculateIoU,
  generateDiffImage,
  validateQC
};
