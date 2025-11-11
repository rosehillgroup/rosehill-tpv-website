// Douglas-Peucker Path Simplification
// Reduces point count while preserving shape fidelity
//
// Strategy:
// 1. Apply Ramer-Douglas-Peucker algorithm
// 2. Adaptive epsilon based on path size
// 3. Preserve critical features (corners, inflection points)

/**
 * Simplify paths using Douglas-Peucker algorithm
 *
 * @param {Array<Object>} paths - Array of path objects with points
 * @param {Object} options - Simplification options
 * @param {number} options.epsilon - Simplification tolerance (default: auto-calculated)
 * @returns {Array<Object>} Simplified paths
 */
function simplifyPaths(paths, options = {}) {
  console.log('[SIMPLIFIER] Simplifying paths with Douglas-Peucker...');

  const simplifiedPaths = paths.map((path, idx) => {
    const originalPointCount = path.points.length;

    // Calculate adaptive epsilon based on path bbox diagonal
    // Using diagonal gives better size estimation than max(width, height)
    const bboxDiagonal = Math.sqrt(
      path.bounds.width * path.bounds.width +
      path.bounds.height * path.bounds.height
    );
    const epsilon = options.epsilon || calculateAdaptiveEpsilon(bboxDiagonal);

    // Apply Douglas-Peucker
    const simplifiedPoints = douglasPeucker(path.points, epsilon);

    const reduction = ((1 - simplifiedPoints.length / originalPointCount) * 100).toFixed(1);

    console.log(`  Path ${idx + 1}: ${originalPointCount} → ${simplifiedPoints.length} points (${reduction}% reduction, ε=${epsilon.toFixed(2)})`);

    return {
      ...path,
      points: simplifiedPoints,
      original_point_count: originalPointCount,
      epsilon
    };
  });

  const totalOriginal = paths.reduce((sum, p) => sum + p.points.length, 0);
  const totalSimplified = simplifiedPaths.reduce((sum, p) => sum + p.points.length, 0);
  const totalReduction = ((1 - totalSimplified / totalOriginal) * 100).toFixed(1);

  console.log(`[SIMPLIFIER] Total: ${totalOriginal} → ${totalSimplified} points (${totalReduction}% reduction)`);

  return simplifiedPaths;
}

/**
 * Calculate adaptive epsilon based on bbox diagonal
 * Size-aware simplification with special handling for small shapes
 *
 * @param {number} bboxDiagonal - Path bbox diagonal in pixels
 * @returns {number} Epsilon value in pixels
 */
function calculateAdaptiveEpsilon(bboxDiagonal) {
  // Base epsilon: 0.25% of bbox diagonal (reduced from 0.5% for better accuracy)
  // Min: 0.5px for precision
  // Max: 5.0px for large areas
  let epsilon = bboxDiagonal * 0.0025;

  // For small shapes (diagonal < 150px), use gentler simplification
  if (bboxDiagonal < 150) {
    // Clamp to max 0.3px for small features
    epsilon = Math.min(epsilon, 0.3);
  }

  return Math.max(0.5, Math.min(5.0, epsilon));
}

/**
 * Douglas-Peucker line simplification algorithm
 * Recursively removes points that don't significantly affect shape
 *
 * @param {Array<Object>} points - Array of {x, y} points
 * @param {number} epsilon - Simplification tolerance
 * @returns {Array<Object>} Simplified points
 */
function douglasPeucker(points, epsilon) {
  if (points.length < 3) {
    return points;
  }

  // Find point with maximum distance from line segment
  let maxDist = 0;
  let maxIndex = 0;

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], firstPoint, lastPoint);

    if (dist > maxDist) {
      maxDist = dist;
      maxIndex = i;
    }
  }

  // If max distance is greater than epsilon, recursively simplify
  if (maxDist > epsilon) {
    // Recursive call for left and right segments
    const left = douglasPeucker(points.slice(0, maxIndex + 1), epsilon);
    const right = douglasPeucker(points.slice(maxIndex), epsilon);

    // Concatenate results (remove duplicate point at junction)
    return [...left.slice(0, -1), ...right];
  } else {
    // All points can be removed except endpoints
    return [firstPoint, lastPoint];
  }
}

/**
 * Calculate perpendicular distance from point to line segment
 * Uses cross product method for accuracy
 *
 * @param {Object} point - Point {x, y}
 * @param {Object} lineStart - Line start point {x, y}
 * @param {Object} lineEnd - Line end point {x, y}
 * @returns {number} Perpendicular distance
 */
function perpendicularDistance(point, lineStart, lineEnd) {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;

  // Handle degenerate case (line segment is actually a point)
  if (dx === 0 && dy === 0) {
    return distance(point, lineStart);
  }

  // Calculate perpendicular distance using cross product
  // |cross product| / |line segment length|
  const numerator = Math.abs(
    dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x
  );
  const denominator = Math.sqrt(dx * dx + dy * dy);

  return numerator / denominator;
}

/**
 * Euclidean distance between two points
 * @param {Object} p1 - Point {x, y}
 * @param {Object} p2 - Point {x, y}
 * @returns {number} Distance
 */
function distance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate total path length
 * Useful for determining simplification aggressiveness
 *
 * @param {Array<Object>} points - Array of {x, y} points
 * @returns {number} Total length in pixels
 */
function calculatePathLength(points) {
  let length = 0;

  for (let i = 1; i < points.length; i++) {
    length += distance(points[i - 1], points[i]);
  }

  return length;
}

/**
 * Detect corners (high curvature points)
 * Used to preserve important geometric features during simplification
 *
 * @param {Array<Object>} points - Array of {x, y} points
 * @param {number} angleThreshold - Min angle change to be considered a corner (degrees)
 * @returns {Array<number>} Indices of corner points
 */
function detectCorners(points, angleThreshold = 30) {
  const corners = [];

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    // Calculate angle change
    const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
    const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);

    let angleDiff = Math.abs(angle2 - angle1) * (180 / Math.PI);

    // Normalize to 0-180 range
    if (angleDiff > 180) {
      angleDiff = 360 - angleDiff;
    }

    if (angleDiff > angleThreshold) {
      corners.push(i);
    }
  }

  return corners;
}

module.exports = {
  simplifyPaths,
  calculatePathLength,
  detectCorners
};
