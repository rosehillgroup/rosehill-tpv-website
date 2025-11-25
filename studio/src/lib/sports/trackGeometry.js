// TPV Studio - Running Track Geometry Calculations

/**
 * Calculate complete track geometry for all lanes
 * @param {object} params - Track parameters
 * @returns {object} Track geometry with lane paths
 */
export function calculateTrackGeometry(params) {
  const {
    numLanes,
    laneWidth_mm,
    straightLength_mm,
    cornerRadius_mm,
    cornerRoundness = 1.0,
    lineWidth_mm = 50
  } = params;

  const lanes = [];

  // Calculate each lane's inner and outer paths
  for (let i = 0; i < numLanes; i++) {
    const innerRadius = cornerRadius_mm + (i * laneWidth_mm);
    const outerRadius = cornerRadius_mm + ((i + 1) * laneWidth_mm);

    lanes.push({
      laneNumber: i + 1,
      innerRadius,
      outerRadius,
      innerPath: generateLanePath(innerRadius, straightLength_mm, cornerRoundness),
      outerPath: generateLanePath(outerRadius, straightLength_mm, cornerRoundness),
      length: calculateTrackLength(innerRadius, straightLength_mm)
    });
  }

  const totalWidth = (numLanes * laneWidth_mm) + (cornerRadius_mm * 2);
  const totalLength = straightLength_mm + (cornerRadius_mm * 2) + ((numLanes * laneWidth_mm) * 2);

  return {
    lanes,
    totalWidth,
    totalLength,
    infieldWidth: cornerRadius_mm * 2,
    infieldLength: straightLength_mm
  };
}

/**
 * Generate SVG path for a single lane boundary
 * Supports adjustable corner roundness from rounded rectangle to full oval
 * @param {number} radius - Radius for this lane
 * @param {number} straightLength - Length of straight sections in mm
 * @param {number} roundness - Corner roundness (0 = rounded rect, 1 = full semicircle)
 * @returns {string} SVG path d attribute
 */
export function generateLanePath(radius, straightLength, roundness = 1.0) {
  // Clamp roundness between 0 and 1
  roundness = Math.max(0, Math.min(1, roundness));

  const halfStraight = straightLength / 2;

  if (roundness === 1.0) {
    // Full track shape with semicircular ends
    return generateFullTrackPath(radius, straightLength);
  } else if (roundness === 0) {
    // Rounded rectangle with minimal corner radius
    const cornerRadius = Math.min(radius * 0.1, 1000); // Max 1m corner radius
    return generateRoundedRectPath(straightLength, radius * 2, cornerRadius);
  } else {
    // Interpolate between rounded rectangle and full track
    return generateInterpolatedPath(radius, straightLength, roundness);
  }
}

/**
 * Generate path for full track shape (standard athletics track)
 * Two straights connected by two semicircles
 */
function generateFullTrackPath(radius, straightLength) {
  const halfStraight = straightLength / 2;

  // Start at bottom-left of straight section
  const startX = 0;
  const startY = radius;

  // Path: straight up → semicircle right → straight down → semicircle left → close
  return `
    M ${startX} ${startY}
    L ${startX} ${halfStraight + radius}
    A ${radius} ${radius} 0 0 0 ${radius * 2} ${halfStraight + radius}
    L ${radius * 2} ${radius}
    A ${radius} ${radius} 0 0 0 ${startX} ${startY}
    Z
  `.trim().replace(/\s+/g, ' ');
}

/**
 * Generate path for rounded rectangle
 */
function generateRoundedRectPath(length, width, cornerRadius) {
  const halfLength = length / 2;
  const halfWidth = width / 2;

  return `
    M ${cornerRadius} 0
    L ${halfLength - cornerRadius} 0
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${halfLength} ${cornerRadius}
    L ${halfLength} ${halfWidth - cornerRadius}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${halfLength - cornerRadius} ${halfWidth}
    L ${-halfLength + cornerRadius} ${halfWidth}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${-halfLength} ${halfWidth - cornerRadius}
    L ${-halfLength} ${cornerRadius}
    A ${cornerRadius} ${cornerRadius} 0 0 1 ${-halfLength + cornerRadius} 0
    L ${cornerRadius} 0
  `.trim().replace(/\s+/g, ' ');
}

/**
 * Generate interpolated path between rounded rectangle and full track
 * @param {number} radius - Lane radius
 * @param {number} straightLength - Length of straights
 * @param {number} roundness - Interpolation factor (0-1)
 */
function generateInterpolatedPath(radius, straightLength, roundness) {
  const halfStraight = straightLength / 2;

  // Calculate effective corner radius based on roundness
  // At roundness=0: use small corner radius
  // At roundness=1: use full radius for semicircle
  const minCornerRadius = Math.min(radius * 0.1, 1000);
  const effectiveRadius = minCornerRadius + (radius - minCornerRadius) * roundness;

  // Calculate arc sweep angle (90° at roundness=0, 180° at roundness=1)
  const sweepAngle = 90 + (90 * roundness);
  const largeArcFlag = sweepAngle > 90 ? 1 : 0;

  // Start position
  const startX = 0;
  const startY = effectiveRadius;

  // Calculate end points of curves based on roundness
  const curveEndX = effectiveRadius * Math.sin((sweepAngle * Math.PI) / 180);
  const curveEndY = effectiveRadius - effectiveRadius * Math.cos((sweepAngle * Math.PI) / 180);

  return `
    M ${startX} ${startY}
    L ${startX} ${halfStraight + startY}
    A ${effectiveRadius} ${effectiveRadius} 0 ${largeArcFlag} 0 ${effectiveRadius + curveEndX} ${halfStraight + startY + curveEndY}
    L ${effectiveRadius + curveEndX} ${startY + curveEndY}
    A ${effectiveRadius} ${effectiveRadius} 0 ${largeArcFlag} 0 ${startX} ${startY}
    Z
  `.trim().replace(/\s+/g, ' ');
}

/**
 * Calculate track length for a given lane
 * Formula: 2 × straightLength + 2 × π × radius
 * @param {number} radius - Lane radius in mm
 * @param {number} straightLength - Straight section length in mm
 * @returns {number} Track length in meters
 */
export function calculateTrackLength(radius, straightLength) {
  const circumference = 2 * Math.PI * radius;
  const totalLength = (2 * straightLength) + circumference;
  return totalLength / 1000; // Convert mm to meters
}

/**
 * Calculate infield dimensions (space inside the track)
 * @param {object} params - Track parameters
 * @returns {object} Infield dimensions
 */
export function calculateInfieldDimensions(params) {
  const { cornerRadius_mm, straightLength_mm } = params;

  return {
    width_mm: cornerRadius_mm * 2,
    length_mm: straightLength_mm
  };
}

/**
 * Calculate stagger distances for lane starts
 * Used for staggered starts in races
 * @param {number} innerRadius - Inside radius of lane 1 in mm
 * @param {number} laneRadius - Radius of the specific lane in mm
 * @returns {number} Stagger distance in meters
 */
export function calculateLaneStagger(innerRadius, laneRadius) {
  const staggerMm = 2 * Math.PI * (laneRadius - innerRadius);
  return staggerMm / 1000; // Convert to meters
}

/**
 * Get bounding box for track
 * @param {object} params - Track parameters
 * @returns {object} Bounding box { width, height }
 */
export function getTrackBoundingBox(params) {
  const { numLanes, laneWidth_mm, cornerRadius_mm, straightLength_mm } = params;

  const totalRadius = cornerRadius_mm + (numLanes * laneWidth_mm);

  return {
    width_mm: totalRadius * 2,
    length_mm: straightLength_mm + (totalRadius * 2)
  };
}

/**
 * Check if a court fits inside the track infield
 * @param {object} trackParams - Track parameters
 * @param {object} courtDimensions - Court dimensions { width_mm, length_mm }
 * @returns {object} Compatibility info
 */
export function checkCourtFitsInInfield(trackParams, courtDimensions) {
  const infield = calculateInfieldDimensions(trackParams);

  const widthFits = courtDimensions.width_mm <= infield.width_mm;
  const lengthFits = courtDimensions.length_mm <= infield.length_mm;

  // Try rotated orientation
  const widthFitsRotated = courtDimensions.length_mm <= infield.width_mm;
  const lengthFitsRotated = courtDimensions.width_mm <= infield.length_mm;

  const fitsNormal = widthFits && lengthFits;
  const fitsRotated = widthFitsRotated && lengthFitsRotated;

  return {
    fits: fitsNormal || fitsRotated,
    fitsNormal,
    fitsRotated,
    recommendRotation: fitsRotated && !fitsNormal,
    infieldDimensions: infield
  };
}
