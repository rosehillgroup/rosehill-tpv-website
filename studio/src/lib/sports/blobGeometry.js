// TPV Studio - Blob Geometry Utilities
// Functions for generating organic blob shapes with bezier curves

/**
 * Seeded random number generator for reproducible blob shapes
 * Uses a simple LCG (Linear Congruential Generator)
 * @param {number} seed - Integer seed value
 * @returns {function} Function that returns random numbers 0-1
 */
export function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Generate control points for an organic blob shape
 * @param {number} numPoints - Number of control points (4-16)
 * @param {number} blobiness - Irregularity factor (0-1)
 * @param {number} seed - Random seed for reproducibility
 * @returns {Array} Array of control points with bezier handles (normalized 0-1)
 */
export function generateBlobControlPoints(numPoints, blobiness, seed) {
  const rng = seededRandom(seed);
  const points = [];

  // Base radius is 0.5 (half of normalized 0-1 space)
  const baseRadius = 0.4; // Leave some margin
  const centerX = 0.5;
  const centerY = 0.5;

  for (let i = 0; i < numPoints; i++) {
    // Base angle for this point
    const baseAngle = (i / numPoints) * Math.PI * 2 - Math.PI / 2; // Start from top

    // Add angle variation based on blobiness
    const angleVariation = (rng() - 0.5) * 0.4 * blobiness; // ±20% of segment
    const angle = baseAngle + angleVariation;

    // Perturb radius based on blobiness
    const radiusVariation = 1 + (rng() - 0.5) * blobiness * 0.8; // ±40% variation at max blobiness
    const radius = baseRadius * radiusVariation;

    // Calculate point position (normalized 0-1)
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // Calculate bezier handle length based on distance between points
    // Handles are perpendicular to the radius direction
    const handleLength = (0.35 / numPoints) * (1 + blobiness * (rng() - 0.5));

    // Handle directions are tangent to the curve (perpendicular to radius)
    const tangentAngle = angle + Math.PI / 2;

    // Add some handle angle variation for more organic curves
    const handleAngleVariation = (rng() - 0.5) * 0.3 * blobiness;
    const inHandleAngle = tangentAngle + Math.PI + handleAngleVariation;
    const outHandleAngle = tangentAngle + handleAngleVariation;

    points.push({
      x,
      y,
      handleIn: {
        x: Math.cos(inHandleAngle) * handleLength,
        y: Math.sin(inHandleAngle) * handleLength
      },
      handleOut: {
        x: Math.cos(outHandleAngle) * handleLength,
        y: Math.sin(outHandleAngle) * handleLength
      }
    });
  }

  return points;
}

/**
 * Convert normalized control points to SVG path
 * @param {Array} controlPoints - Array of control points with bezier handles
 * @param {number} width - Shape width in mm
 * @param {number} height - Shape height in mm
 * @returns {string} SVG path data
 */
export function controlPointsToSVGPath(controlPoints, width, height) {
  if (!controlPoints || controlPoints.length < 3) {
    // Fallback to simple ellipse
    return generateBlobEllipsePath(width, height);
  }

  const pathParts = [];
  const n = controlPoints.length;

  for (let i = 0; i < n; i++) {
    const curr = controlPoints[i];
    const next = controlPoints[(i + 1) % n];

    // Scale normalized coordinates to actual size
    const currX = curr.x * width;
    const currY = curr.y * height;
    const nextX = next.x * width;
    const nextY = next.y * height;

    // Scale handles (they're offsets, so use respective dimensions)
    const cp1x = currX + curr.handleOut.x * width;
    const cp1y = currY + curr.handleOut.y * height;
    const cp2x = nextX + next.handleIn.x * width;
    const cp2y = nextY + next.handleIn.y * height;

    if (i === 0) {
      pathParts.push(`M ${currX.toFixed(2)},${currY.toFixed(2)}`);
    }

    // Cubic bezier curve to next point
    pathParts.push(`C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${nextX.toFixed(2)},${nextY.toFixed(2)}`);
  }

  pathParts.push('Z');
  return pathParts.join(' ');
}

/**
 * Generate SVG path directly from blob parameters (convenience function)
 * @param {number} numPoints - Number of control points (4-16)
 * @param {number} width - Width in mm
 * @param {number} height - Height in mm
 * @param {number} blobiness - Irregularity factor (0-1)
 * @param {number} seed - Random seed for reproducibility
 * @returns {string} SVG path data
 */
export function generateBlobPath(numPoints, width, height, blobiness, seed) {
  const controlPoints = generateBlobControlPoints(numPoints, blobiness, seed);
  return controlPointsToSVGPath(controlPoints, width, height);
}

/**
 * Generate a simple ellipse path (for reset functionality)
 * @param {number} width - Ellipse width
 * @param {number} height - Ellipse height
 * @returns {string} SVG path data
 */
export function generateBlobEllipsePath(width, height) {
  const rx = width / 2;
  const ry = height / 2;
  const cx = rx;
  const cy = ry;

  // Use two arc commands to draw a complete ellipse
  return `M ${cx - rx},${cy} ` +
         `A ${rx},${ry} 0 1,1 ${cx + rx},${cy} ` +
         `A ${rx},${ry} 0 1,1 ${cx - rx},${cy} Z`;
}

/**
 * Generate control points for a perfect ellipse (for reset functionality)
 * Uses 8 points with calculated bezier handles for smooth circle approximation
 * @returns {Array} Array of control points
 */
export function generateEllipseControlPoints() {
  // Magic number for bezier circle approximation
  // For a circle, handle length should be (4/3)*tan(π/(2n)) where n is num points
  const numPoints = 8;
  const k = 0.5522847498; // Bezier handle factor for circle with 4 points per quarter
  const handleFactor = 0.2; // Adjusted for 8 points

  const points = [];
  const centerX = 0.5;
  const centerY = 0.5;
  const radius = 0.4;

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // Tangent direction
    const tangentAngle = angle + Math.PI / 2;

    points.push({
      x,
      y,
      handleIn: {
        x: Math.cos(tangentAngle + Math.PI) * handleFactor,
        y: Math.sin(tangentAngle + Math.PI) * handleFactor
      },
      handleOut: {
        x: Math.cos(tangentAngle) * handleFactor,
        y: Math.sin(tangentAngle) * handleFactor
      }
    });
  }

  return points;
}

/**
 * Update a single control point position
 * @param {Array} controlPoints - Current control points array
 * @param {number} index - Index of point to update
 * @param {number} newX - New X position (normalized 0-1)
 * @param {number} newY - New Y position (normalized 0-1)
 * @returns {Array} New control points array with updated point
 */
export function updateControlPointPosition(controlPoints, index, newX, newY) {
  return controlPoints.map((point, i) => {
    if (i !== index) return point;
    return {
      ...point,
      x: Math.max(0, Math.min(1, newX)),
      y: Math.max(0, Math.min(1, newY))
    };
  });
}

/**
 * Update a bezier handle position
 * @param {Array} controlPoints - Current control points array
 * @param {number} index - Index of point whose handle to update
 * @param {string} handle - 'handleIn' or 'handleOut'
 * @param {number} offsetX - Handle X offset (normalized)
 * @param {number} offsetY - Handle Y offset (normalized)
 * @returns {Array} New control points array with updated handle
 */
export function updateHandlePosition(controlPoints, index, handle, offsetX, offsetY) {
  return controlPoints.map((point, i) => {
    if (i !== index) return point;
    return {
      ...point,
      [handle]: {
        x: offsetX,
        y: offsetY
      }
    };
  });
}

/**
 * Calculate the bounding box of a blob from its control points
 * Useful for accurate sizing calculations
 * @param {Array} controlPoints - Control points array
 * @param {number} width - Shape width
 * @param {number} height - Shape height
 * @returns {{minX: number, minY: number, maxX: number, maxY: number}}
 */
export function getBlobBounds(controlPoints, width, height) {
  if (!controlPoints || controlPoints.length === 0) {
    return { minX: 0, minY: 0, maxX: width, maxY: height };
  }

  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  controlPoints.forEach(point => {
    const x = point.x * width;
    const y = point.y * height;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });

  return { minX, minY, maxX, maxY };
}

// ====== Blob Presets ======

/**
 * Predefined blob shape configurations with hand-crafted control points
 * Each preset has distinct visual characteristics
 */
export const BLOB_PRESETS = {
  splat: {
    name: 'Splat',
    icon: '💦',
    description: 'Irregular splatter with spiky protrusions',
    // 10 points with spiky protrusions alternating inward/outward
    controlPoints: [
      { x: 0.5, y: 0.08, handleIn: { x: -0.06, y: 0 }, handleOut: { x: 0.06, y: 0 } },
      { x: 0.72, y: 0.18, handleIn: { x: -0.04, y: -0.06 }, handleOut: { x: 0.04, y: 0.06 } },
      { x: 0.65, y: 0.38, handleIn: { x: 0.06, y: -0.04 }, handleOut: { x: -0.06, y: 0.04 } },
      { x: 0.92, y: 0.5, handleIn: { x: 0, y: -0.06 }, handleOut: { x: 0, y: 0.06 } },
      { x: 0.68, y: 0.65, handleIn: { x: 0.06, y: 0 }, handleOut: { x: -0.06, y: 0 } },
      { x: 0.75, y: 0.88, handleIn: { x: 0.04, y: -0.05 }, handleOut: { x: -0.04, y: 0.05 } },
      { x: 0.5, y: 0.75, handleIn: { x: 0.06, y: 0.02 }, handleOut: { x: -0.06, y: 0.02 } },
      { x: 0.25, y: 0.88, handleIn: { x: 0.04, y: 0.05 }, handleOut: { x: -0.04, y: -0.05 } },
      { x: 0.32, y: 0.65, handleIn: { x: -0.06, y: 0 }, handleOut: { x: 0.06, y: 0 } },
      { x: 0.08, y: 0.5, handleIn: { x: 0, y: 0.06 }, handleOut: { x: 0, y: -0.06 } },
      { x: 0.35, y: 0.38, handleIn: { x: -0.06, y: 0.04 }, handleOut: { x: 0.06, y: -0.04 } },
      { x: 0.28, y: 0.18, handleIn: { x: 0.04, y: 0.06 }, handleOut: { x: -0.04, y: -0.06 } }
    ]
  },
  cloud: {
    name: 'Cloud',
    icon: '☁',
    description: 'Soft, fluffy cloud with bumpy top edge',
    // 12 points with bumpy top edge, smoother bottom
    controlPoints: [
      { x: 0.12, y: 0.6, handleIn: { x: -0.04, y: -0.08 }, handleOut: { x: 0.04, y: 0.08 } },
      { x: 0.1, y: 0.42, handleIn: { x: 0, y: 0.08 }, handleOut: { x: 0, y: -0.08 } },
      { x: 0.22, y: 0.28, handleIn: { x: -0.06, y: 0.02 }, handleOut: { x: 0.06, y: -0.02 } },
      { x: 0.35, y: 0.18, handleIn: { x: -0.04, y: 0.04 }, handleOut: { x: 0.04, y: -0.04 } },
      { x: 0.48, y: 0.25, handleIn: { x: -0.04, y: -0.04 }, handleOut: { x: 0.04, y: 0.04 } },
      { x: 0.55, y: 0.12, handleIn: { x: -0.04, y: 0.04 }, handleOut: { x: 0.04, y: -0.04 } },
      { x: 0.68, y: 0.2, handleIn: { x: -0.04, y: -0.04 }, handleOut: { x: 0.04, y: 0.04 } },
      { x: 0.8, y: 0.28, handleIn: { x: -0.04, y: -0.02 }, handleOut: { x: 0.06, y: 0.02 } },
      { x: 0.92, y: 0.45, handleIn: { x: 0, y: -0.08 }, handleOut: { x: 0, y: 0.08 } },
      { x: 0.88, y: 0.62, handleIn: { x: 0.04, y: -0.06 }, handleOut: { x: -0.06, y: 0.06 } },
      { x: 0.65, y: 0.72, handleIn: { x: 0.1, y: 0 }, handleOut: { x: -0.1, y: 0 } },
      { x: 0.35, y: 0.72, handleIn: { x: 0.1, y: 0 }, handleOut: { x: -0.1, y: 0 } }
    ]
  },
  puddle: {
    name: 'Puddle',
    icon: '💧',
    description: 'Flat, watery organic puddle shape',
    // 8 points, wide and flat elliptical with organic edges
    controlPoints: [
      { x: 0.5, y: 0.32, handleIn: { x: -0.12, y: -0.02 }, handleOut: { x: 0.12, y: -0.02 } },
      { x: 0.78, y: 0.38, handleIn: { x: -0.06, y: -0.04 }, handleOut: { x: 0.06, y: 0.04 } },
      { x: 0.94, y: 0.52, handleIn: { x: 0.02, y: -0.1 }, handleOut: { x: -0.02, y: 0.1 } },
      { x: 0.82, y: 0.68, handleIn: { x: 0.06, y: -0.02 }, handleOut: { x: -0.08, y: 0.02 } },
      { x: 0.5, y: 0.72, handleIn: { x: 0.14, y: 0.02 }, handleOut: { x: -0.14, y: 0.02 } },
      { x: 0.18, y: 0.68, handleIn: { x: 0.08, y: 0.02 }, handleOut: { x: -0.06, y: -0.02 } },
      { x: 0.06, y: 0.52, handleIn: { x: 0.02, y: 0.1 }, handleOut: { x: -0.02, y: -0.1 } },
      { x: 0.22, y: 0.38, handleIn: { x: -0.06, y: 0.04 }, handleOut: { x: 0.06, y: -0.04 } }
    ]
  }
};

// ====== Symmetry Functions ======

/**
 * Calculate the mirrored position for a point
 * @param {number} x - Original x position (normalized 0-1)
 * @param {number} y - Original y position (normalized 0-1)
 * @param {boolean} mirrorX - Whether to mirror across Y axis (flip left/right)
 * @param {boolean} mirrorY - Whether to mirror across X axis (flip top/bottom)
 * @returns {{x: number, y: number}}
 */
export function getMirroredPosition(x, y, mirrorX, mirrorY) {
  const centerX = 0.5;
  const centerY = 0.5;

  return {
    x: mirrorX ? centerX - (x - centerX) : x,
    y: mirrorY ? centerY - (y - centerY) : y
  };
}

/**
 * Calculate mirrored bezier handle offsets
 * @param {number} handleX - Handle X offset
 * @param {number} handleY - Handle Y offset
 * @param {boolean} mirrorX - Whether to mirror across Y axis
 * @param {boolean} mirrorY - Whether to mirror across X axis
 * @returns {{x: number, y: number}}
 */
export function getMirroredHandle(handleX, handleY, mirrorX, mirrorY) {
  return {
    x: mirrorX ? -handleX : handleX,
    y: mirrorY ? -handleY : handleY
  };
}

/**
 * Get indices of symmetric points for a given point based on symmetry mode
 * Returns the original point plus all its symmetric counterparts
 * @param {number} index - Index of the point being edited
 * @param {number} numPoints - Total number of control points
 * @param {string} mode - 'none' | 'horizontal' | 'vertical' | 'radial'
 * @param {number} radialCount - Number of radial repetitions (for radial mode)
 * @returns {Array<{index: number, mirrorX: boolean, mirrorY: boolean, rotationAngle: number}>}
 */
export function getSymmetricPointIndices(index, numPoints, mode, radialCount = 4) {
  // Always include the original point
  const result = [{ index, mirrorX: false, mirrorY: false, rotationAngle: 0 }];

  if (mode === 'none' || !mode) {
    return result;
  }

  if (mode === 'horizontal') {
    // Mirror across vertical centerline (left ↔ right)
    // Find the point on the opposite side
    // Points are arranged radially, so the opposite point is at (numPoints - index) % numPoints
    // But we need to account for the starting angle offset
    const oppositeIndex = (numPoints - index) % numPoints;
    if (oppositeIndex !== index) {
      result.push({ index: oppositeIndex, mirrorX: true, mirrorY: false, rotationAngle: 0 });
    }
    return result;
  }

  if (mode === 'vertical') {
    // Mirror across horizontal centerline (top ↔ bottom)
    // Points start at top (-π/2) and go clockwise
    // For vertical mirror, point at angle θ mirrors to -θ
    // Formula: mirrorIndex = (numPoints/2 - index + numPoints) % numPoints
    const mirrorIndex = (Math.floor(numPoints / 2) - index + numPoints) % numPoints;
    if (mirrorIndex !== index) {
      result.push({ index: mirrorIndex, mirrorX: false, mirrorY: true, rotationAngle: 0 });
    }
    return result;
  }

  if (mode === 'radial') {
    // Radial symmetry: points repeat around center at equal angular intervals
    // For each symmetric position, find the point at that rotated position
    for (let i = 1; i < radialCount; i++) {
      // Simple formula: add i * (numPoints / radialCount) to get the rotated index
      const rotatedIndex = Math.round(index + (i * numPoints / radialCount)) % numPoints;
      if (rotatedIndex !== index) {
        const rotationAngle = (i * 2 * Math.PI) / radialCount;
        result.push({
          index: rotatedIndex,
          mirrorX: false,
          mirrorY: false,
          rotationAngle
        });
      }
    }
    return result;
  }

  return result;
}

/**
 * Apply symmetry to control points when one point is edited
 * @param {Array} controlPoints - Current control points array
 * @param {number} editIndex - Index of the point being edited
 * @param {number} newX - New X position for the edited point
 * @param {number} newY - New Y position for the edited point
 * @param {string} mode - Symmetry mode
 * @param {number} radialCount - Radial symmetry count
 * @returns {Array} Updated control points with symmetry applied
 */
export function applySymmetryToPoint(controlPoints, editIndex, newX, newY, mode, radialCount = 4) {
  if (mode === 'none' || !mode) {
    // Just update the single point
    return controlPoints.map((point, i) => {
      if (i !== editIndex) return point;
      return { ...point, x: newX, y: newY };
    });
  }

  const symmetricIndices = getSymmetricPointIndices(editIndex, controlPoints.length, mode, radialCount);

  return controlPoints.map((point, i) => {
    const symmetricInfo = symmetricIndices.find(s => s.index === i);
    if (!symmetricInfo) return point;

    if (symmetricInfo.rotationAngle !== 0) {
      // For radial symmetry, rotate the point position around center
      const centerX = 0.5;
      const centerY = 0.5;
      const dx = newX - centerX;
      const dy = newY - centerY;
      const cos = Math.cos(symmetricInfo.rotationAngle);
      const sin = Math.sin(symmetricInfo.rotationAngle);
      return {
        ...point,
        x: centerX + dx * cos - dy * sin,
        y: centerY + dx * sin + dy * cos
      };
    }

    // For horizontal/vertical symmetry, mirror the position
    const mirrored = getMirroredPosition(newX, newY, symmetricInfo.mirrorX, symmetricInfo.mirrorY);
    return { ...point, x: mirrored.x, y: mirrored.y };
  });
}

/**
 * Apply symmetry to bezier handles when one handle is edited
 * @param {Array} controlPoints - Current control points array
 * @param {number} editIndex - Index of the point whose handle is being edited
 * @param {string} handleType - 'handleIn' or 'handleOut'
 * @param {number} newOffsetX - New handle X offset
 * @param {number} newOffsetY - New handle Y offset
 * @param {string} mode - Symmetry mode
 * @param {number} radialCount - Radial symmetry count
 * @returns {Array} Updated control points with symmetry applied
 */
export function applySymmetryToHandle(controlPoints, editIndex, handleType, newOffsetX, newOffsetY, mode, radialCount = 4) {
  if (mode === 'none' || !mode) {
    // Just update the single handle
    return controlPoints.map((point, i) => {
      if (i !== editIndex) return point;
      return { ...point, [handleType]: { x: newOffsetX, y: newOffsetY } };
    });
  }

  const symmetricIndices = getSymmetricPointIndices(editIndex, controlPoints.length, mode, radialCount);

  return controlPoints.map((point, i) => {
    const symmetricInfo = symmetricIndices.find(s => s.index === i);
    if (!symmetricInfo) return point;

    // Determine which handle to update on symmetric point
    // For mirrored points, handleIn and handleOut may need to swap
    let targetHandle = handleType;
    let offsetX = newOffsetX;
    let offsetY = newOffsetY;

    if (symmetricInfo.rotationAngle !== 0) {
      // Rotate the handle offset for radial symmetry
      const cos = Math.cos(symmetricInfo.rotationAngle);
      const sin = Math.sin(symmetricInfo.rotationAngle);
      offsetX = newOffsetX * cos - newOffsetY * sin;
      offsetY = newOffsetX * sin + newOffsetY * cos;
    } else {
      // Mirror the handle for horizontal/vertical symmetry
      const mirrored = getMirroredHandle(newOffsetX, newOffsetY, symmetricInfo.mirrorX, symmetricInfo.mirrorY);
      offsetX = mirrored.x;
      offsetY = mirrored.y;
    }

    return { ...point, [targetHandle]: { x: offsetX, y: offsetY } };
  });
}
