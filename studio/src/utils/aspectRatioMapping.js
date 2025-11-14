/**
 * Aspect Ratio Mapping for Recraft Generation
 * Maps arbitrary playground dimensions to canonical Recraft aspect ratios
 */

// Canonical aspect ratios supported by Recraft (best generation quality)
const CANONICAL_ASPECT_RATIOS = {
  landscape: [
    { name: '1:1', ratio: 1.0, width: 1024, height: 1024 },
    { name: '4:3', ratio: 4/3, width: 1024, height: 768 },
    { name: '3:2', ratio: 3/2, width: 1024, height: 683 },
    { name: '16:9', ratio: 16/9, width: 1024, height: 576 },
    { name: '2:1', ratio: 2.0, width: 1024, height: 512 },
    { name: '3:1', ratio: 3.0, width: 1024, height: 341 }
  ],
  portrait: [
    { name: '1:1', ratio: 1.0, width: 1024, height: 1024 },
    { name: '3:4', ratio: 3/4, width: 768, height: 1024 },
    { name: '2:3', ratio: 2/3, width: 683, height: 1024 },
    { name: '9:16', ratio: 9/16, width: 576, height: 1024 },
    { name: '1:2', ratio: 1/2, width: 512, height: 1024 },
    { name: '1:3', ratio: 1/3, width: 341, height: 1024 }
  ]
};

// Thresholds for layout strategies
const LAYOUT_THRESHOLDS = {
  // AR difference threshold for "safe" full-surface generation
  safeDifference: 0.3,
  // AR threshold for switching to tiling mode (very extreme ratios)
  tilingThreshold: 3.5,
  // AR threshold for showing framing warning
  framingThreshold: 2.5
};

/**
 * Calculate aspect ratio from dimensions
 */
function calculateAspectRatio(width, height) {
  return width / height;
}

/**
 * Determine orientation from aspect ratio
 */
function getOrientation(aspectRatio) {
  if (aspectRatio >= 0.95 && aspectRatio <= 1.05) {
    return 'square';
  }
  return aspectRatio > 1 ? 'landscape' : 'portrait';
}

/**
 * Find the closest canonical aspect ratio
 */
function findClosestCanonicalAR(targetRatio, orientation) {
  const candidates = orientation === 'portrait'
    ? CANONICAL_ASPECT_RATIOS.portrait
    : CANONICAL_ASPECT_RATIOS.landscape;

  let closest = candidates[0];
  let minDiff = Math.abs(targetRatio - closest.ratio);

  for (const candidate of candidates) {
    const diff = Math.abs(targetRatio - candidate.ratio);
    if (diff < minDiff) {
      minDiff = diff;
      closest = candidate;
    }
  }

  return { ...closest, difference: minDiff };
}

/**
 * Determine the best layout strategy for given dimensions
 */
function determineLayoutStrategy(userRatio, canonicalRatio, difference) {
  // Very extreme aspect ratios -> tiling
  if (userRatio >= LAYOUT_THRESHOLDS.tilingThreshold ||
      userRatio <= 1/LAYOUT_THRESHOLDS.tilingThreshold) {
    return {
      mode: 'tiling',
      reason: 'Extreme aspect ratio - design will repeat along length',
      warning: true
    };
  }

  // Moderate mismatch -> framing
  if (difference >= LAYOUT_THRESHOLDS.safeDifference ||
      userRatio >= LAYOUT_THRESHOLDS.framingThreshold ||
      userRatio <= 1/LAYOUT_THRESHOLDS.framingThreshold) {
    return {
      mode: 'framing',
      reason: 'Design panel centered with base color surround',
      warning: false
    };
  }

  // Close match -> full surface
  return {
    mode: 'full',
    reason: 'Design fills entire surface',
    warning: false
  };
}

/**
 * Map user dimensions to Recraft generation parameters
 *
 * @param {number} widthMM - User's requested width in mm
 * @param {number} heightMM - User's requested height in mm
 * @returns {Object} Mapping result with generation params and layout strategy
 */
export function mapDimensionsToRecraft(widthMM, heightMM) {
  const userRatio = calculateAspectRatio(widthMM, heightMM);
  const orientation = getOrientation(userRatio);
  const canonical = findClosestCanonicalAR(userRatio, orientation);
  const strategy = determineLayoutStrategy(userRatio, canonical.ratio, canonical.difference);

  return {
    // Original user dimensions
    user: {
      widthMM,
      heightMM,
      aspectRatio: userRatio,
      orientation,
      formatted: `${(widthMM/1000).toFixed(1)}m × ${(heightMM/1000).toFixed(1)}m`
    },

    // Canonical AR to use for Recraft generation
    canonical: {
      name: canonical.name,
      ratio: canonical.ratio,
      width: canonical.width,
      height: canonical.height,
      difference: canonical.difference
    },

    // Layout strategy
    layout: strategy,

    // Recraft API params
    recraft: {
      width: canonical.width,
      height: canonical.height,
      // Keep user dimensions in metadata for later framing/tiling
      metadata: {
        targetWidthMM: widthMM,
        targetHeightMM: heightMM,
        layoutMode: strategy.mode
      }
    }
  };
}

/**
 * Get a human-readable description of the layout strategy
 */
export function getLayoutDescription(mapping) {
  const { user, canonical, layout } = mapping;

  let description = `Generating ${canonical.name} design panel`;

  if (layout.mode === 'full') {
    description += ` (fills ${user.formatted} surface)`;
  } else if (layout.mode === 'framing') {
    description += ` (centered in ${user.formatted} surface with base color surround)`;
  } else if (layout.mode === 'tiling') {
    description += ` (will repeat along ${user.formatted} surface)`;
  }

  return description;
}

/**
 * Check if dimensions need a layout warning
 */
export function needsLayoutWarning(mapping) {
  return mapping.layout.warning || mapping.layout.mode !== 'full';
}
