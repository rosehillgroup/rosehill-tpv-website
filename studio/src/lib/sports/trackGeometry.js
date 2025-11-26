// TPV Studio - Running Track Geometry Calculations
// Flexible rounded rectangle model with per-corner radius support

/**
 * Calculate complete track geometry for all lanes
 * @param {object} params - Track parameters
 * @param {number} params.width_mm - Track width in mm
 * @param {number} params.height_mm - Track height in mm
 * @param {number} params.numLanes - Number of lanes
 * @param {number} params.laneWidth_mm - Fixed lane width in mm
 * @param {object} params.cornerRadius - Corner radii {topLeft, topRight, bottomLeft, bottomRight}
 * @param {number} params.lineWidth_mm - Line width for rendering (default 50)
 * @returns {object} Track geometry with lane paths
 */
export function calculateTrackGeometry(params) {
  const {
    width_mm,
    height_mm,
    numLanes,
    laneWidth_mm,
    cornerRadius = { topLeft: 3000, topRight: 3000, bottomLeft: 3000, bottomRight: 3000 },
    lineWidth_mm = 50
  } = params;

  const lanes = [];

  // Detect if this is a straight track (all corner radii = 0)
  const isStraightTrack =
    cornerRadius.topLeft === 0 &&
    cornerRadius.topRight === 0 &&
    cornerRadius.bottomLeft === 0 &&
    cornerRadius.bottomRight === 0;

  if (isStraightTrack) {
    // Parallel lane rendering for straight tracks
    for (let i = 0; i < numLanes; i++) {
      const laneX = i * laneWidth_mm;

      lanes.push({
        laneNumber: i + 1,
        innerPath: null,  // Not used for parallel lanes
        outerPath: generateParallelLanePath(laneWidth_mm, height_mm, i),
        perimeter: (2 * height_mm) / 1000,  // Convert to meters (length * 2)
        // Additional metadata for rendering
        isParallel: true,
        laneX: laneX,
        laneWidth: laneWidth_mm
      });
    }
  } else {
    // Concentric lane rendering for curved tracks
    // Calculate each lane's inner and outer paths
    for (let i = 0; i < numLanes; i++) {
    const laneOffset = i * laneWidth_mm;
    const nextLaneOffset = (i + 1) * laneWidth_mm;

    // Calculate dimensions for this lane (inset from outer edge)
    const innerWidth = Math.max(0, width_mm - (nextLaneOffset * 2));
    const innerHeight = Math.max(0, height_mm - (nextLaneOffset * 2));
    const outerWidth = Math.max(0, width_mm - (laneOffset * 2));
    const outerHeight = Math.max(0, height_mm - (laneOffset * 2));

    // Calculate corner radii for this lane (reduced by lane offset, clamped to 0)
    const innerCorners = {
      topLeft: Math.max(0, cornerRadius.topLeft - nextLaneOffset),
      topRight: Math.max(0, cornerRadius.topRight - nextLaneOffset),
      bottomLeft: Math.max(0, cornerRadius.bottomLeft - nextLaneOffset),
      bottomRight: Math.max(0, cornerRadius.bottomRight - nextLaneOffset)
    };

    const outerCorners = {
      topLeft: Math.max(0, cornerRadius.topLeft - laneOffset),
      topRight: Math.max(0, cornerRadius.topRight - laneOffset),
      bottomLeft: Math.max(0, cornerRadius.bottomLeft - laneOffset),
      bottomRight: Math.max(0, cornerRadius.bottomRight - laneOffset)
    };

      lanes.push({
        laneNumber: i + 1,
        innerPath: generateRoundedRectPath(innerWidth, innerHeight, innerCorners, nextLaneOffset),
        outerPath: generateRoundedRectPath(outerWidth, outerHeight, outerCorners, laneOffset),
        perimeter: calculateRoundedRectPerimeter(outerWidth, outerHeight, outerCorners),
        isParallel: false
      });
    }
  }

  return {
    lanes,
    totalWidth: width_mm,
    totalLength: height_mm,
    usableWidth: width_mm - (numLanes * laneWidth_mm * 2),
    usableHeight: height_mm - (numLanes * laneWidth_mm * 2)
  };
}

/**
 * Generate SVG path for a rounded rectangle with per-corner radius
 * @param {number} width - Rectangle width in mm
 * @param {number} height - Rectangle height in mm
 * @param {object} corners - Corner radii {topLeft, topRight, bottomLeft, bottomRight}
 * @param {number} offset - Offset from outer edge (for positioning)
 * @returns {string} SVG path d attribute
 */
function generateRoundedRectPath(width, height, corners, offset = 0) {
  // Handle edge cases
  if (width <= 0 || height <= 0) {
    return `M ${offset} ${offset} L ${offset} ${offset}`;
  }

  // Clamp corner radii to valid values (max half of smallest dimension)
  const maxRadius = Math.min(width / 2, height / 2);
  const tl = Math.min(corners.topLeft, maxRadius);
  const tr = Math.min(corners.topRight, maxRadius);
  const br = Math.min(corners.bottomRight, maxRadius);
  const bl = Math.min(corners.bottomLeft, maxRadius);

  // Calculate positions relative to offset
  const left = offset;
  const right = offset + width;
  const top = offset;
  const bottom = offset + height;

  // Build path: Start top-left, go clockwise
  const path = `
    M ${left + tl} ${top}
    L ${right - tr} ${top}
    ${tr > 0 ? `A ${tr} ${tr} 0 0 1 ${right} ${top + tr}` : ''}
    L ${right} ${bottom - br}
    ${br > 0 ? `A ${br} ${br} 0 0 1 ${right - br} ${bottom}` : ''}
    L ${left + bl} ${bottom}
    ${bl > 0 ? `A ${bl} ${bl} 0 0 1 ${left} ${bottom - bl}` : ''}
    L ${left} ${top + tl}
    ${tl > 0 ? `A ${tl} ${tl} 0 0 1 ${left + tl} ${top}` : ''}
    Z
  `.trim().replace(/\s+/g, ' ');

  return path;
}

/**
 * Generate SVG path for a parallel lane strip (vertical rectangle)
 * Used for straight tracks to create parallel lanes instead of concentric
 *
 * @param {number} laneWidth - Lane width in mm
 * @param {number} trackHeight - Full track height/length in mm
 * @param {number} laneIndex - Lane index (0-based)
 * @returns {string} SVG path d attribute for lane rectangle
 */
function generateParallelLanePath(laneWidth, trackHeight, laneIndex) {
  const x = laneIndex * laneWidth;
  return `M ${x} 0 L ${x + laneWidth} 0 L ${x + laneWidth} ${trackHeight} L ${x} ${trackHeight} Z`;
}

/**
 * Calculate perimeter of rounded rectangle
 * @param {number} width - Rectangle width in mm
 * @param {number} height - Rectangle height in mm
 * @param {object} corners - Corner radii
 * @returns {number} Perimeter in meters
 */
function calculateRoundedRectPerimeter(width, height, corners) {
  if (width <= 0 || height <= 0) return 0;

  // Clamp corner radii
  const maxRadius = Math.min(width / 2, height / 2);
  const tl = Math.min(corners.topLeft, maxRadius);
  const tr = Math.min(corners.topRight, maxRadius);
  const br = Math.min(corners.bottomRight, maxRadius);
  const bl = Math.min(corners.bottomLeft, maxRadius);

  // Calculate straight sections
  const topStraight = width - tl - tr;
  const rightStraight = height - tr - br;
  const bottomStraight = width - br - bl;
  const leftStraight = height - bl - tl;

  // Calculate curved sections (quarter circles)
  const topLeftArc = (Math.PI * tl) / 2;
  const topRightArc = (Math.PI * tr) / 2;
  const bottomRightArc = (Math.PI * br) / 2;
  const bottomLeftArc = (Math.PI * bl) / 2;

  const totalMm = topStraight + rightStraight + bottomStraight + leftStraight +
    topLeftArc + topRightArc + bottomRightArc + bottomLeftArc;

  return totalMm / 1000; // Convert to meters
}

/**
 * Get bounding box for track
 * @param {object} params - Track parameters
 * @returns {object} Bounding box {width_mm, height_mm}
 */
export function getTrackBoundingBox(params) {
  return {
    width_mm: params.width_mm,
    height_mm: params.height_mm
  };
}

/**
 * Calculate usable infield dimensions (space inside all lanes)
 * @param {object} params - Track parameters
 * @returns {object} Infield dimensions
 */
export function calculateInfieldDimensions(params) {
  const { width_mm, height_mm, numLanes, laneWidth_mm } = params;

  const totalLaneWidth = numLanes * laneWidth_mm * 2; // Both sides

  return {
    width_mm: Math.max(0, width_mm - totalLaneWidth),
    height_mm: Math.max(0, height_mm - totalLaneWidth)
  };
}

/**
 * Validate corner radii don't exceed track dimensions
 * @param {number} width_mm - Track width
 * @param {number} height_mm - Track height
 * @param {object} cornerRadius - Corner radii object
 * @returns {object} Validated corner radii
 */
export function validateCornerRadii(width_mm, height_mm, cornerRadius) {
  const maxRadius = Math.min(width_mm / 2, height_mm / 2);

  return {
    topLeft: Math.min(cornerRadius.topLeft, maxRadius),
    topRight: Math.min(cornerRadius.topRight, maxRadius),
    bottomLeft: Math.min(cornerRadius.bottomLeft, maxRadius),
    bottomRight: Math.min(cornerRadius.bottomRight, maxRadius)
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
  const lengthFits = courtDimensions.length_mm <= infield.height_mm;

  // Try rotated orientation
  const widthFitsRotated = courtDimensions.length_mm <= infield.width_mm;
  const lengthFitsRotated = courtDimensions.width_mm <= infield.height_mm;

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

/**
 * Calculate staggered start positions for curved tracks
 * Outer lanes have longer perimeters, so runners start ahead to equalize distance
 *
 * @param {object} geometry - Track geometry from calculateTrackGeometry()
 * @returns {array} Array of stagger offsets in mm [0, 7660, 15330, ...] for each lane
 */
export function calculateStaggeredStarts(geometry) {
  if (!geometry || !geometry.lanes || geometry.lanes.length === 0) {
    return [];
  }

  // Lane 1 (innermost/first lane) is the reference - starts at position 0
  const lane1Perimeter = geometry.lanes[0].perimeter;

  // Calculate offset for each lane based on perimeter difference
  return geometry.lanes.map((lane, index) => {
    if (index === 0) return 0; // Lane 1 starts at 0

    const lanePerimeter = lane.perimeter;
    const perimeterDifference = lanePerimeter - lane1Perimeter;

    // Stagger offset is the perimeter difference (in mm)
    // Outer lanes start further ahead by this amount
    return perimeterDifference;
  });
}
