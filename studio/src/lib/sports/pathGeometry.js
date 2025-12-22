// TPV Studio - Path Geometry Utilities
// Functions for generating and manipulating user-drawn path shapes

/**
 * Generate SVG path from control points
 * Supports both smooth (bezier) and straight line modes
 * @param {Array} controlPoints - Array of control points [{x, y, handleIn?, handleOut?}, ...]
 * @param {number} width - Shape width in mm
 * @param {number} height - Shape height in mm
 * @param {boolean} closed - Whether path should close back to start
 * @param {boolean} smooth - Whether to use bezier curves (requires handles)
 * @returns {string} SVG path data
 */
export function controlPointsToSVGPath(controlPoints, width, height, closed = true, smooth = false) {
  if (!controlPoints || controlPoints.length < 2) {
    return '';
  }

  const pathParts = [];
  const n = controlPoints.length;

  for (let i = 0; i < n; i++) {
    const curr = controlPoints[i];
    const isLast = i === n - 1;

    // For closed paths, connect last point to first
    // For open paths, stop at last point
    const next = closed ? controlPoints[(i + 1) % n] : (isLast ? null : controlPoints[i + 1]);

    // Scale normalized coordinates to actual size
    const currX = curr.x * width;
    const currY = curr.y * height;

    if (i === 0) {
      pathParts.push(`M ${currX.toFixed(2)},${currY.toFixed(2)}`);
    }

    // Skip the last segment for open paths
    if (!next) continue;

    const nextX = next.x * width;
    const nextY = next.y * height;

    if (smooth && curr.handleOut && next.handleIn) {
      // Cubic bezier curve using handles
      const cp1x = currX + curr.handleOut.x * width;
      const cp1y = currY + curr.handleOut.y * height;
      const cp2x = nextX + next.handleIn.x * width;
      const cp2y = nextY + next.handleIn.y * height;
      pathParts.push(`C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${nextX.toFixed(2)},${nextY.toFixed(2)}`);
    } else {
      // Straight line segment
      pathParts.push(`L ${nextX.toFixed(2)},${nextY.toFixed(2)}`);
    }
  }

  if (closed) {
    pathParts.push('Z');
  }

  return pathParts.join(' ');
}

/**
 * Calculate smooth bezier handles for a set of points
 * Uses Catmull-Rom to bezier conversion for smooth curves
 * @param {Array} points - Array of points [{x, y}, ...]
 * @param {boolean} closed - Whether path is closed
 * @param {number} tension - Curve tension (0 = straight, 1 = very curved), default 0.3
 * @returns {Array} Points with handleIn and handleOut added
 */
export function calculateBezierHandles(points, closed = true, tension = 0.3) {
  if (!points || points.length < 2) return points;

  const n = points.length;
  const result = points.map(p => ({ ...p, handleIn: { x: 0, y: 0 }, handleOut: { x: 0, y: 0 } }));

  for (let i = 0; i < n; i++) {
    const prev = closed ? points[(i - 1 + n) % n] : (i > 0 ? points[i - 1] : points[i]);
    const curr = points[i];
    const next = closed ? points[(i + 1) % n] : (i < n - 1 ? points[i + 1] : points[i]);

    // Calculate tangent direction
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;

    // Handle length proportional to distance and tension
    const handleLength = tension * 0.5;

    // For open paths, first and last points have zero-length handles on the outer side
    if (!closed && i === 0) {
      result[i].handleIn = { x: 0, y: 0 };
      result[i].handleOut = { x: dx * handleLength, y: dy * handleLength };
    } else if (!closed && i === n - 1) {
      result[i].handleIn = { x: -dx * handleLength, y: -dy * handleLength };
      result[i].handleOut = { x: 0, y: 0 };
    } else {
      result[i].handleIn = { x: -dx * handleLength, y: -dy * handleLength };
      result[i].handleOut = { x: dx * handleLength, y: dy * handleLength };
    }
  }

  return result;
}

/**
 * Convert simple points to control point format (without handles)
 * @param {Array} points - Array of {x, y} points (normalized 0-1)
 * @returns {Array} Control points with zero handles
 */
export function pointsToControlPoints(points) {
  return points.map(p => ({
    x: p.x,
    y: p.y,
    handleIn: { x: 0, y: 0 },
    handleOut: { x: 0, y: 0 }
  }));
}

/**
 * Insert a new point at a specific index
 * @param {Array} controlPoints - Existing control points
 * @param {number} index - Index to insert at (point will be inserted before this index)
 * @param {number} x - X coordinate (normalized 0-1)
 * @param {number} y - Y coordinate (normalized 0-1)
 * @returns {Array} New array with point inserted
 */
export function insertPoint(controlPoints, index, x, y) {
  const newPoint = {
    x,
    y,
    handleIn: { x: 0, y: 0 },
    handleOut: { x: 0, y: 0 }
  };

  const result = [...controlPoints];
  result.splice(index, 0, newPoint);
  return result;
}

/**
 * Remove a point at a specific index
 * @param {Array} controlPoints - Existing control points
 * @param {number} index - Index to remove
 * @param {number} minPoints - Minimum points required (default 3 for closed, 2 for open)
 * @returns {Array|null} New array with point removed, or null if would go below minimum
 */
export function removePoint(controlPoints, index, minPoints = 3) {
  if (controlPoints.length <= minPoints) {
    return null; // Can't remove, would go below minimum
  }

  const result = [...controlPoints];
  result.splice(index, 1);
  return result;
}

/**
 * Calculate bounding box of path points
 * @param {Array} controlPoints - Array of control points
 * @returns {Object} { minX, minY, maxX, maxY, width, height }
 */
export function getPathBounds(controlPoints) {
  if (!controlPoints || controlPoints.length === 0) {
    return { minX: 0, minY: 0, maxX: 1, maxY: 1, width: 1, height: 1 };
  }

  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  for (const point of controlPoints) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Normalize points to fit within 0-1 bounds with padding
 * @param {Array} points - Array of points with x, y coordinates
 * @param {number} padding - Padding ratio (0-0.5), default 0.1
 * @returns {Array} Normalized points
 */
export function normalizePoints(points, padding = 0.1) {
  if (!points || points.length === 0) return points;

  const bounds = getPathBounds(points);
  const { minX, minY, width, height } = bounds;

  // Avoid division by zero
  const scaleX = width > 0 ? (1 - 2 * padding) / width : 1;
  const scaleY = height > 0 ? (1 - 2 * padding) / height : 1;
  const scale = Math.min(scaleX, scaleY);

  return points.map(p => ({
    ...p,
    x: padding + (p.x - minX) * scale,
    y: padding + (p.y - minY) * scale,
    // Scale handles too
    handleIn: p.handleIn ? {
      x: p.handleIn.x * scale,
      y: p.handleIn.y * scale
    } : { x: 0, y: 0 },
    handleOut: p.handleOut ? {
      x: p.handleOut.x * scale,
      y: p.handleOut.y * scale
    } : { x: 0, y: 0 }
  }));
}

/**
 * Find the closest point on a path segment to a given position
 * Used for inserting points on an existing path
 * @param {Object} p1 - Start point of segment
 * @param {Object} p2 - End point of segment
 * @param {number} x - Target x coordinate
 * @param {number} y - Target y coordinate
 * @returns {Object} { t: parameter 0-1, x, y, distance }
 */
export function closestPointOnSegment(p1, p2, x, y) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    return { t: 0, x: p1.x, y: p1.y, distance: Math.hypot(x - p1.x, y - p1.y) };
  }

  // Calculate parameter t for closest point on line
  let t = ((x - p1.x) * dx + (y - p1.y) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));

  const closestX = p1.x + t * dx;
  const closestY = p1.y + t * dy;
  const distance = Math.hypot(x - closestX, y - closestY);

  return { t, x: closestX, y: closestY, distance };
}

/**
 * Find which segment of the path is closest to a given point
 * @param {Array} controlPoints - Path control points
 * @param {number} x - Target x coordinate (normalized)
 * @param {number} y - Target y coordinate (normalized)
 * @param {boolean} closed - Whether path is closed
 * @returns {Object} { segmentIndex, t, x, y, distance }
 */
export function findClosestSegment(controlPoints, x, y, closed = true) {
  if (!controlPoints || controlPoints.length < 2) {
    return null;
  }

  let closest = null;
  const n = controlPoints.length;
  const numSegments = closed ? n : n - 1;

  for (let i = 0; i < numSegments; i++) {
    const p1 = controlPoints[i];
    const p2 = controlPoints[(i + 1) % n];
    const result = closestPointOnSegment(p1, p2, x, y);

    if (!closest || result.distance < closest.distance) {
      closest = { segmentIndex: i, ...result };
    }
  }

  return closest;
}
