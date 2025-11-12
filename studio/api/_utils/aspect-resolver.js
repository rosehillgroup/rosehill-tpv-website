// Aspect Ratio Resolver for TPV Studio (Flux Dev)
// Resolves aspect ratios for Flux Dev generation

/**
 * Calculate target pixel dimensions from meters
 * @param {number} width_m - Width in meters
 * @param {number} height_m - Height in meters
 * @param {number} ppi - Pixels per meter (default: 200)
 * @returns {Object} {w, h, ppi}
 */
function metersToPixels(width_m, height_m, ppi = 200) {
  const w = Math.round(width_m * ppi);
  const h = Math.round(height_m * ppi);

  console.log(`[AR] Surface: ${width_m}×${height_m}m @ ${ppi}px/m → Target: ${w}×${h}px`);

  return { w, h, ppi };
}

/**
 * Resolve aspect ratio string for Flux Dev from pixel dimensions
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels
 * @returns {string} Aspect ratio string (e.g., "1:1", "16:9", "4:3")
 */
function resolveAspectRatio(width, height) {
  const ratio = width / height;

  // Flux Dev supported aspect ratios
  const aspectRatios = [
    { value: '1:1', ratio: 1.0, label: 'Square' },
    { value: '16:9', ratio: 16/9, label: 'Landscape' },
    { value: '9:16', ratio: 9/16, label: 'Portrait' },
    { value: '4:3', ratio: 4/3, label: 'Standard Landscape' },
    { value: '3:4', ratio: 3/4, label: 'Standard Portrait' },
    { value: '21:9', ratio: 21/9, label: 'Ultrawide' },
    { value: '9:21', ratio: 9/21, label: 'Ultratall' }
  ];

  // Find nearest aspect ratio
  let nearest = aspectRatios[0];
  let minDiff = Math.abs(ratio - nearest.ratio);

  for (const ar of aspectRatios) {
    const diff = Math.abs(ratio - ar.ratio);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = ar;
    }
  }

  console.log(`[AR] ${width}×${height}px (${ratio.toFixed(3)}) → ${nearest.value} ${nearest.label}`);

  return nearest.value;
}

/**
 * Pick nearest supported model size for target aspect ratio
 * @param {Object} params - Target dimensions
 * @param {number} params.targetW - Target width in pixels
 * @param {number} params.targetH - Target height in pixels
 * @param {number} params.longSide - Max long side (default: 1024)
 * @returns {Object} Nearest size {w, h, ar, diff, label}
 */
function pickNearestSize({ targetW, targetH, longSide = 1024 }) {
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
function selectModelAspect(targetWidth, targetHeight) {
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

// CommonJS exports
export {
  metersToPixels,
  resolveAspectRatio,
  pickNearestSize,
  selectModelAspect
};

