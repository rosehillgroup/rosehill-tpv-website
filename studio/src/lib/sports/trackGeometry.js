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
 * Note: In the geometry, index 0 = outermost lane, last index = innermost lane
 * For staggered starts, innermost lane is the reference (stagger = 0)
 * Outer lanes start further along the track (positive stagger)
 *
 * @param {object} geometry - Track geometry from calculateTrackGeometry()
 * @returns {array} Array of stagger offsets in meters [large, medium, small, 0] for each lane
 */
export function calculateStaggeredStarts(geometry) {
  if (!geometry || !geometry.lanes || geometry.lanes.length === 0) {
    return [];
  }

  // Innermost lane (last index) is the reference - shortest perimeter, starts at position 0
  const innermostIndex = geometry.lanes.length - 1;
  const innermostPerimeter = geometry.lanes[innermostIndex].perimeter;

  // Calculate offset for each lane based on perimeter difference from innermost lane
  return geometry.lanes.map((lane, index) => {
    const lanePerimeter = lane.perimeter;
    const perimeterDifference = lanePerimeter - innermostPerimeter;

    // Stagger offset is the perimeter difference (in meters)
    // Outer lanes (larger perimeter) get positive offsets (start further along)
    return perimeterDifference;
  });
}

/**
 * Get a point at a specific distance along a lane's outer path
 * Traverses the rounded rectangle clockwise starting from the bottom-left curve
 *
 * Path order (clockwise from bottom-left):
 * 1. Bottom-left curve (90° arc)
 * 2. Left straight (going up)
 * 3. Top-left curve (90° arc)
 * 4. Top straight (going right)
 * 5. Top-right curve (90° arc)
 * 6. Right straight (going down)
 * 7. Bottom-right curve (90° arc)
 * 8. Bottom straight (going left)
 *
 * @param {number} laneIndex - Lane index (0-based, 0 = outermost lane)
 * @param {number} distance_mm - Distance along the path in mm (0 = start of bottom-left curve)
 * @param {object} params - Track parameters
 * @returns {object} {x, y, angle} - Position and tangent angle (radians, 0 = right, PI/2 = down)
 */
export function getPointOnLanePath(laneIndex, distance_mm, params) {
  const {
    width_mm,
    height_mm,
    laneWidth_mm,
    cornerRadius = { topLeft: 3000, topRight: 3000, bottomLeft: 3000, bottomRight: 3000 }
  } = params;

  // Calculate this lane's offset from outer edge
  const laneOffset = laneIndex * laneWidth_mm;

  // Calculate dimensions for this lane's outer edge
  const laneWidth = Math.max(0, width_mm - (laneOffset * 2));
  const laneHeight = Math.max(0, height_mm - (laneOffset * 2));

  // Calculate corner radii for this lane (reduced by lane offset)
  const maxRadius = Math.min(laneWidth / 2, laneHeight / 2);
  const tl = Math.min(Math.max(0, cornerRadius.topLeft - laneOffset), maxRadius);
  const tr = Math.min(Math.max(0, cornerRadius.topRight - laneOffset), maxRadius);
  const br = Math.min(Math.max(0, cornerRadius.bottomRight - laneOffset), maxRadius);
  const bl = Math.min(Math.max(0, cornerRadius.bottomLeft - laneOffset), maxRadius);

  // Calculate positions relative to lane offset
  const left = laneOffset;
  const right = laneOffset + laneWidth;
  const top = laneOffset;
  const bottom = laneOffset + laneHeight;

  // Calculate segment lengths
  const segments = [
    { type: 'arc', length: (Math.PI * bl) / 2, radius: bl, corner: 'bottomLeft' },     // Bottom-left curve
    { type: 'straight', length: laneHeight - bl - tl, dir: 'up' },                      // Left straight
    { type: 'arc', length: (Math.PI * tl) / 2, radius: tl, corner: 'topLeft' },        // Top-left curve
    { type: 'straight', length: laneWidth - tl - tr, dir: 'right' },                    // Top straight
    { type: 'arc', length: (Math.PI * tr) / 2, radius: tr, corner: 'topRight' },       // Top-right curve
    { type: 'straight', length: laneHeight - tr - br, dir: 'down' },                    // Right straight
    { type: 'arc', length: (Math.PI * br) / 2, radius: br, corner: 'bottomRight' },    // Bottom-right curve
    { type: 'straight', length: laneWidth - br - bl, dir: 'left' },                     // Bottom straight
  ];

  // Handle negative or zero distances
  let d = distance_mm;
  const totalPerimeter = segments.reduce((sum, s) => sum + s.length, 0);

  // Wrap distance to be within perimeter
  while (d < 0) d += totalPerimeter;
  while (d >= totalPerimeter) d -= totalPerimeter;

  // Find which segment the distance falls on
  let accumulated = 0;
  for (const segment of segments) {
    if (d <= accumulated + segment.length) {
      const segmentDistance = d - accumulated;
      const t = segment.length > 0 ? segmentDistance / segment.length : 0;

      if (segment.type === 'arc') {
        return calculateArcPoint(segment, t, { left, right, top, bottom, tl, tr, br, bl });
      } else {
        return calculateStraightPoint(segment, t, { left, right, top, bottom, tl, tr, br, bl });
      }
    }
    accumulated += segment.length;
  }

  // Fallback (shouldn't reach here)
  return { x: left, y: bottom - bl, angle: -Math.PI / 2 };
}

/**
 * Calculate point on an arc segment
 */
function calculateArcPoint(segment, t, bounds) {
  const { left, right, top, bottom, tl, tr, br, bl } = bounds;

  // Arc angle: t goes from 0 to 1 over 90 degrees (PI/2)
  const arcAngle = t * (Math.PI / 2);

  switch (segment.corner) {
    case 'bottomLeft': {
      // Center at (left + bl, bottom - bl), arc from 90° to 180° (bottom to left)
      const cx = left + bl;
      const cy = bottom - bl;
      const startAngle = Math.PI / 2; // 90° (pointing down)
      const angle = startAngle + arcAngle; // Goes toward 180° (pointing left)
      return {
        x: cx + bl * Math.cos(angle),
        y: cy + bl * Math.sin(angle),
        angle: angle + Math.PI / 2 // Tangent is perpendicular to radius (pointing along track)
      };
    }
    case 'topLeft': {
      // Center at (left + tl, top + tl), arc from 180° to 270° (left to top)
      const cx = left + tl;
      const cy = top + tl;
      const startAngle = Math.PI; // 180° (pointing left)
      const angle = startAngle + arcAngle;
      return {
        x: cx + tl * Math.cos(angle),
        y: cy + tl * Math.sin(angle),
        angle: angle + Math.PI / 2
      };
    }
    case 'topRight': {
      // Center at (right - tr, top + tr), arc from 270° to 360° (top to right)
      const cx = right - tr;
      const cy = top + tr;
      const startAngle = -Math.PI / 2; // 270° (pointing up)
      const angle = startAngle + arcAngle;
      return {
        x: cx + tr * Math.cos(angle),
        y: cy + tr * Math.sin(angle),
        angle: angle + Math.PI / 2
      };
    }
    case 'bottomRight': {
      // Center at (right - br, bottom - br), arc from 0° to 90° (right to bottom)
      const cx = right - br;
      const cy = bottom - br;
      const startAngle = 0; // 0° (pointing right)
      const angle = startAngle + arcAngle;
      return {
        x: cx + br * Math.cos(angle),
        y: cy + br * Math.sin(angle),
        angle: angle + Math.PI / 2
      };
    }
    default:
      return { x: left, y: top, angle: 0 };
  }
}

/**
 * Calculate point on a straight segment
 */
function calculateStraightPoint(segment, t, bounds) {
  const { left, right, top, bottom, tl, tr, br, bl } = bounds;

  switch (segment.dir) {
    case 'up': {
      // Left edge, going from bottom-bl to top+tl
      const startY = bottom - bl;
      const endY = top + tl;
      return {
        x: left,
        y: startY + t * (endY - startY),
        angle: -Math.PI / 2 // Pointing up (tangent direction)
      };
    }
    case 'right': {
      // Top edge, going from left+tl to right-tr
      const startX = left + tl;
      const endX = right - tr;
      return {
        x: startX + t * (endX - startX),
        y: top,
        angle: 0 // Pointing right
      };
    }
    case 'down': {
      // Right edge, going from top+tr to bottom-br
      const startY = top + tr;
      const endY = bottom - br;
      return {
        x: right,
        y: startY + t * (endY - startY),
        angle: Math.PI / 2 // Pointing down
      };
    }
    case 'left': {
      // Bottom edge, going from right-br to left+bl
      const startX = right - br;
      const endX = left + bl;
      return {
        x: startX + t * (endX - startX),
        y: bottom,
        angle: Math.PI // Pointing left
      };
    }
    default:
      return { x: left, y: top, angle: 0 };
  }
}

/**
 * Get the center point of a lane at a specific distance along the path
 * Returns the midpoint between inner and outer edges
 *
 * @param {number} laneIndex - Lane index (0-based)
 * @param {number} distance_mm - Distance along the path in mm
 * @param {object} params - Track parameters
 * @returns {object} {x, y, angle, innerX, innerY, outerX, outerY}
 */
export function getLaneCenterAtDistance(laneIndex, distance_mm, params) {
  // Get point on outer edge
  const outerPoint = getPointOnLanePath(laneIndex, distance_mm, params);

  // Get point on inner edge (next lane's outer edge)
  const innerPoint = getPointOnLanePath(laneIndex + 1, distance_mm, params);

  // Calculate center point
  return {
    x: (outerPoint.x + innerPoint.x) / 2,
    y: (outerPoint.y + innerPoint.y) / 2,
    angle: outerPoint.angle,
    innerX: innerPoint.x,
    innerY: innerPoint.y,
    outerX: outerPoint.x,
    outerY: outerPoint.y
  };
}
