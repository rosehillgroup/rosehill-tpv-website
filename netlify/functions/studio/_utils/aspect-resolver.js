// Aspect ratio resolver for SDXL generation
// Maps arbitrary surface dimensions to nearest supported model aspect ratio

/**
 * Supported SDXL aspect ratios with their dimensions
 */
const ASPECT_RATIOS = [
  { ratio: '1:1', width: 1024, height: 1024, decimal: 1.0 },
  { ratio: '3:2', width: 1152, height: 768, decimal: 1.5 },
  { ratio: '2:3', width: 768, height: 1152, decimal: 0.6667 },
  { ratio: '4:3', width: 1024, height: 768, decimal: 1.3333 },
  { ratio: '3:4', width: 768, height: 1024, decimal: 0.75 },
  { ratio: '16:9', width: 1152, height: 648, decimal: 1.7778 },
  { ratio: '9:16', width: 648, height: 1152, decimal: 0.5625 }
];

/**
 * Select the closest model aspect ratio for target dimensions
 * @param {number} targetWidth - Target width in meters
 * @param {number} targetHeight - Target height in meters
 * @returns {Object} {ratio, width, height, targetAspect}
 */
function selectModelAspect(targetWidth, targetHeight) {
  const targetAspect = targetWidth / targetHeight;

  console.log(`[ASPECT] Target dimensions: ${targetWidth}m × ${targetHeight}m (${targetAspect.toFixed(3)})`);

  // Find closest aspect ratio
  let closest = ASPECT_RATIOS[0];
  let minDiff = Math.abs(targetAspect - closest.decimal);

  for (const aspectRatio of ASPECT_RATIOS) {
    const diff = Math.abs(targetAspect - aspectRatio.decimal);
    if (diff < minDiff) {
      minDiff = diff;
      closest = aspectRatio;
    }
  }

  console.log(`[ASPECT] Selected model aspect: ${closest.ratio} (${closest.width}×${closest.height})`);
  console.log(`[ASPECT] Aspect difference: ${(minDiff * 100).toFixed(1)}%`);

  return {
    ratio: closest.ratio,
    width: closest.width,
    height: closest.height,
    targetAspect: targetAspect,
    modelAspect: closest.decimal,
    aspectDiff: minDiff
  };
}

/**
 * Check if target aspect closely matches a model aspect (within 5%)
 * @param {number} targetWidth
 * @param {number} targetHeight
 * @returns {boolean}
 */
function isCloseMatch(targetWidth, targetHeight) {
  const result = selectModelAspect(targetWidth, targetHeight);
  return result.aspectDiff < 0.05; // 5% tolerance
}

/**
 * Get all supported aspect ratios
 * @returns {Array} List of supported aspects
 */
function getSupportedAspects() {
  return ASPECT_RATIOS.map(a => ({
    ratio: a.ratio,
    width: a.width,
    height: a.height
  }));
}


module.exports = {
  selectModelAspect,
  isCloseMatch,
  getSupportedAspects,
  ASPECT_RATIOS
};
