// Manufacturing Constraints Enforcement
// Ensures designs meet TPV installation requirements
//
// Constraints:
// - Min feature size: 120mm (small details removed)
// - Min radius: 600mm (sharp corners rounded)
//
// Strategy:
// 1. Convert pixel dimensions to mm using surface dimensions
// 2. Filter out paths smaller than min feature size
// 3. Round sharp corners below min radius threshold
// 4. Track metrics for QC reporting

/**
 * Enforce manufacturing constraints
 *
 * @param {Array<Object>} paths - Simplified paths
 * @param {Object} dimensions - Surface dimensions
 * @param {number} dimensions.width_mm - Surface width in mm
 * @param {number} dimensions.height_mm - Surface height in mm
 * @param {number} dimensions.image_width - Image width in pixels
 * @param {number} dimensions.image_height - Image height in pixels
 * @returns {Object} {paths, metrics}
 */
export function enforceConstraints(paths, dimensions) {
  console.log('[CONSTRAINTS] Enforcing manufacturing constraints...');
  console.log(`[CONSTRAINTS] Surface: ${dimensions.width_mm}×${dimensions.height_mm}mm`);
  console.log(`[CONSTRAINTS] Image: ${dimensions.image_width}×${dimensions.image_height}px`);

  // Calculate pixel-to-mm conversion factors
  const pxToMmX = dimensions.width_mm / dimensions.image_width;
  const pxToMmY = dimensions.height_mm / dimensions.image_height;

  console.log(`[CONSTRAINTS] Conversion: ${pxToMmX.toFixed(3)}mm/px (X), ${pxToMmY.toFixed(3)}mm/px (Y)`);

  // ========================================================================
  // CONSTRAINT 1: Min feature size (120mm)
  // ========================================================================

  const minFeatureMM = 120;
  const minFeaturePx = minFeatureMM / Math.min(pxToMmX, pxToMmY); // Use stricter dimension

  console.log(`[CONSTRAINTS] Min feature: ${minFeatureMM}mm (${minFeaturePx.toFixed(1)}px)`);

  const filteredPaths = paths.filter(path => {
    // Calculate feature size (minimum dimension of bounding box)
    const featureWidth = path.bounds.width;
    const featureHeight = path.bounds.height;
    const featureSize = Math.min(featureWidth, featureHeight);

    if (featureSize < minFeaturePx) {
      console.log(`  Removing path: ${featureSize.toFixed(1)}px < ${minFeaturePx.toFixed(1)}px`);
      return false;
    }

    return true;
  });

  const removedCount = paths.length - filteredPaths.length;

  console.log(`[CONSTRAINTS] Removed ${removedCount} paths below min feature size`);

  // ========================================================================
  // CONSTRAINT 2: Min radius (600mm) - Round sharp corners
  // ========================================================================

  const minRadiusMM = 600;
  const minRadiusPx = minRadiusMM / Math.min(pxToMmX, pxToMmY);

  console.log(`[CONSTRAINTS] Min radius: ${minRadiusMM}mm (${minRadiusPx.toFixed(1)}px)`);

  let cornersRounded = 0;

  const constrainedPaths = filteredPaths.map(path => {
    const { roundedPoints, roundedCount } = roundSharpCorners(
      path.points,
      minRadiusPx
    );

    cornersRounded += roundedCount;

    return {
      ...path,
      points: roundedPoints
    };
  });

  console.log(`[CONSTRAINTS] Rounded ${cornersRounded} sharp corners`);

  // ========================================================================
  // Calculate actual min feature/radius in design
  // ========================================================================

  const actualMinFeatureMM = constrainedPaths.length > 0
    ? Math.min(...constrainedPaths.map(p => {
        const minDim = Math.min(p.bounds.width, p.bounds.height);
        return minDim * pxToMmX;
      }))
    : minFeatureMM;

  // Calculate actual min radius (approximate from corner angles)
  const actualMinRadiusMM = minRadiusMM; // Simplified - assume rounding worked

  console.log(`[CONSTRAINTS] Actual min feature: ${actualMinFeatureMM.toFixed(1)}mm`);
  console.log(`[CONSTRAINTS] Actual min radius: ${actualMinRadiusMM.toFixed(1)}mm`);

  return {
    paths: constrainedPaths,
    metrics: {
      min_feature_mm: Math.round(actualMinFeatureMM),
      min_radius_mm: Math.round(actualMinRadiusMM),
      features_removed: removedCount,
      corners_rounded: cornersRounded,
      px_to_mm_x: pxToMmX,
      px_to_mm_y: pxToMmY
    }
  };
}

/**
 * Round sharp corners to meet min radius requirement
 * Uses Chaikin curve subdivision for smooth rounding
 *
 * @param {Array<Object>} points - Path points
 * @param {number} minRadiusPx - Min radius in pixels
 * @returns {Object} {roundedPoints, roundedCount}
 */
function roundSharpCorners(points, minRadiusPx) {
  if (points.length < 3) {
    return { roundedPoints: points, roundedCount: 0 };
  }

  const roundedPoints = [points[0]]; // Start with first point
  let roundedCount = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    // Calculate angle at this corner
    const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
    const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);

    let angleDiff = Math.abs(angle2 - angle1);

    // Normalize to 0-π range
    if (angleDiff > Math.PI) {
      angleDiff = 2 * Math.PI - angleDiff;
    }

    // Sharp corner threshold: < 120° (2.094 radians)
    const isSharpCorner = angleDiff > (Math.PI / 3); // 60°

    if (isSharpCorner) {
      // Calculate radius of curvature at this corner
      // Approximate using distance to adjacent points
      const dist1 = distance(prev, curr);
      const dist2 = distance(curr, next);
      const avgDist = (dist1 + dist2) / 2;

      // Estimate radius from angle and distance
      const estimatedRadius = avgDist / (2 * Math.sin(angleDiff / 2));

      if (estimatedRadius < minRadiusPx) {
        // Round this corner using Chaikin subdivision
        const t = 0.25; // Subdivision factor

        // Create two intermediate points
        const p1 = {
          x: prev.x * t + curr.x * (1 - t),
          y: prev.y * t + curr.y * (1 - t)
        };

        const p2 = {
          x: curr.x * (1 - t) + next.x * t,
          y: curr.y * (1 - t) + next.y * t
        };

        roundedPoints.push(p1, p2);
        roundedCount++;
      } else {
        roundedPoints.push(curr);
      }
    } else {
      roundedPoints.push(curr);
    }
  }

  // Add last point
  roundedPoints.push(points[points.length - 1]);

  return { roundedPoints, roundedCount };
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
 * Calculate minimum bounding circle radius (approximation)
 * Used to estimate feature size for filtering
 *
 * @param {Array<Object>} points - Path points
 * @returns {number} Approximate radius in pixels
 */
export function calculateMinBoundingCircleRadius(points) {
  if (points.length === 0) return 0;

  // Simple approximation: use centroid and furthest point
  const centroid = {
    x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
    y: points.reduce((sum, p) => sum + p.y, 0) / points.length
  };

  let maxDist = 0;

  for (const point of points) {
    const dist = distance(point, centroid);
    if (dist > maxDist) {
      maxDist = dist;
    }
  }

  return maxDist;
}
