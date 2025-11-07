// Aspect Ratio Resolver for TPV Studio Inspiration Mode
// Finds nearest model size for target aspect ratio

/**
 * Calculate target pixel dimensions from meters
 * @param {number} width_m - Width in meters
 * @param {number} height_m - Height in meters
 * @param {number} ppi - Pixels per meter (default: 200)
 * @returns {Object} {w, h, ppi}
 */
export function metersToPixels(width_m, height_m, ppi = 200) {
  const w = Math.round(width_m * ppi);
  const h = Math.round(height_m * ppi);

  console.log(`[AR] Surface: ${width_m}×${height_m}m @ ${ppi}px/m → Target: ${w}×${h}px`);

  return { w, h, ppi };
}

/**
 * Pick nearest supported model size for target aspect ratio
 * @param {Object} params - Target dimensions
 * @param {number} params.targetW - Target width in pixels
 * @param {number} params.targetH - Target height in pixels
 * @param {number} params.longSide - Max long side (default: 1024)
 * @returns {Object} Nearest size {w, h, ar, diff, label}
 */
export function pickNearestSize({ targetW, targetH, longSide = 1024 }) {
  const targetAR = targetW / targetH;

  // Supported SDXL aspect ratios (expanded list for better matches)
  const candidates = [
    { w: 1024, h: 1024, label: '1:1 (square)' },      // 1.000
    { w: 1152, h: 768, label: '3:2 (landscape)' },    // 1.500
    { w: 768, h: 1152, label: '2:3 (portrait)' },     // 0.667
    { w: 1344, h: 768, label: '7:4 (wide)' },         // 1.750
    { w: 768, h: 1344, label: '4:7 (tall)' },         // 0.571
    { w: 1024, h: 576, label: '16:9 (cinema)' },      // 1.778
    { w: 576, h: 1024, label: '9:16 (mobile)' }       // 0.563
  ];

  let best = candidates[0];
  let bestDiff = Infinity;

  for (const candidate of candidates) {
    const candidateAR = candidate.w / candidate.h;
    const diff = Math.abs(candidateAR - targetAR);

    if (diff < bestDiff) {
      best = candidate;
      bestDiff = diff;
    }
  }

  console.log(
    `[AR] Target: ${targetW}×${targetH}px (AR: ${targetAR.toFixed(3)}) → ` +
    `Nearest: ${best.w}×${best.h} ${best.label} (AR: ${(best.w / best.h).toFixed(3)}, diff: ${bestDiff.toFixed(3)})`
  );

  return {
    w: best.w,
    h: best.h,
    ar: best.w / best.h,
    diff: bestDiff,
    label: best.label
  };
}

/**
 * Legacy function: Select the closest model aspect ratio for target dimensions
 * @deprecated Use metersToPixels + pickNearestSize instead
 * @param {number} targetWidth - Target width in meters
 * @param {number} targetHeight - Target height in meters
 * @returns {Object} {ratio, width, height, targetAspect}
 */
export function selectModelAspect(targetWidth, targetHeight) {
  const { w: targetW, h: targetH } = metersToPixels(targetWidth, targetHeight);
  const nearest = pickNearestSize({ targetW, targetH });

  return {
    ratio: nearest.label,
    width: nearest.w,
    height: nearest.h,
    targetAspect: targetW / targetH,
    modelAspect: nearest.ar,
    aspectDiff: nearest.diff
  };
}



