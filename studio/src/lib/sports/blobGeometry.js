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
