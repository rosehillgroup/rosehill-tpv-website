// Auto-Repair Utilities for TPV Studio
// Automatically fixes constraint violations in vectorized designs

const { checkRegionConstraints } = require('./constraints.js');
/**
 * Default TPV installation rules
 */
const DEFAULT_RULES = {
  min_island_area_m2: 0.3,      // 300cm² minimum region size
  min_feature_mm: 120,          // 120mm minimum feature width
  min_gap_mm: 80,               // 80mm minimum gap between features
  min_radius_mm: 50             // 50mm minimum corner radius
};

/**
 * Calculate polygon area using shoelace formula
 */
function polygonArea(points) {
  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }

  return Math.abs(area) / 2;
}

/**
 * Calculate perimeter of polygon
 */
function polygonPerimeter(points) {
  let perimeter = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const dx = points[j].x - points[i].x;
    const dy = points[j].y - points[i].y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }

  return perimeter;
}

/**
 * Check if region is too small and should be removed
 * @param {Object} region - Region with points array
 * @param {Object} rules - Constraint rules
 * @returns {boolean} True if region should be removed
 */
function shouldRemoveRegion(region, rules) {
  const area = polygonArea(region.points);
  const minArea = rules.min_island_area_m2 || 0.3;

  // Remove if area is less than 50% of minimum
  return area < minArea * 0.5;
}

/**
 * Check if region is too thin (high perimeter to area ratio)
 * @param {Object} region - Region with points array
 * @param {Object} rules - Constraint rules
 * @returns {boolean} True if region is too thin
 */
function isTooThin(region, rules) {
  const area = polygonArea(region.points);
  const perimeter = polygonPerimeter(region.points);
  const approxWidth = (2 * area) / perimeter;
  const minWidth = (rules.min_feature_mm || 120) / 1000; // Convert mm to m

  return approxWidth < minWidth;
}

/**
 * Simplify region by reducing point count
 * Uses Douglas-Peucker simplification (basic implementation)
 * @param {Array} points - Array of {x, y} points
 * @param {number} tolerance - Simplification tolerance in meters
 * @returns {Array} Simplified points
 */
function simplifyPoints(points, tolerance = 0.01) {
  if (points.length < 3) {
    return points;
  }

  // Basic implementation: remove collinear points
  const simplified = [points[0]];

  for (let i = 1; i < points.length - 1; i++) {
    const prev = simplified[simplified.length - 1];
    const curr = points[i];
    const next = points[i + 1];

    // Calculate perpendicular distance from curr to line (prev, next)
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const norm = Math.sqrt(dx * dx + dy * dy);

    if (norm < 0.001) continue; // Skip if prev and next are too close

    const dist = Math.abs((curr.x - prev.x) * dy - (curr.y - prev.y) * dx) / norm;

    // Keep point if it's far enough from the line
    if (dist > tolerance) {
      simplified.push(curr);
    }
  }

  simplified.push(points[points.length - 1]); // Always keep last point

  return simplified;
}

/**
 * Apply morphological dilation to region
 * Expands region boundaries to meet minimum width requirements
 * @param {Object} region - Region with points array
 * @param {number} bufferAmount - Buffer distance in meters
 * @returns {Object} Buffered region
 */
function bufferRegion(region, bufferAmount = 0.05) {
  // Simplified buffer: offset each point outward from centroid
  const centroid = {
    x: region.points.reduce((sum, p) => sum + p.x, 0) / region.points.length,
    y: region.points.reduce((sum, p) => sum + p.y, 0) / region.points.length
  };

  const bufferedPoints = region.points.map(p => {
    const dx = p.x - centroid.x;
    const dy = p.y - centroid.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 0.001) return p; // Skip if point is at centroid

    // Move point outward
    const scale = (dist + bufferAmount) / dist;
    return {
      x: centroid.x + dx * scale,
      y: centroid.y + dy * scale
    };
  });

  return {
    ...region,
    points: bufferedPoints
  };
}

/**
 * Remove very small regions that violate min area constraint
 * @param {Array} regions - Array of regions
 * @param {Object} rules - Constraint rules
 * @returns {Object} {repaired, removed}
 */
function removeSmallRegions(regions, rules = DEFAULT_RULES) {
  console.log(`[AUTO-REPAIR] Checking ${regions.length} regions for size violations...`);

  const kept = [];
  const removed = [];

  for (const region of regions) {
    if (shouldRemoveRegion(region, rules)) {
      const area = polygonArea(region.points);
      console.log(`[AUTO-REPAIR] Removing ${region.color}: area ${(area * 10000).toFixed(1)}cm² < min ${(rules.min_island_area_m2 * 10000 * 0.5).toFixed(1)}cm²`);
      removed.push(region);
    } else {
      kept.push(region);
    }
  }

  console.log(`[AUTO-REPAIR] Kept ${kept.length}, removed ${removed.length} small regions`);

  return {
    repaired: kept,
    removed
  };
}

/**
 * Simplify region geometry to reduce complexity
 * @param {Array} regions - Array of regions
 * @param {number} tolerance - Simplification tolerance (0.01 = 10mm)
 * @returns {Array} Simplified regions
 */
function simplifyRegions(regions, tolerance = 0.01) {
  console.log(`[AUTO-REPAIR] Simplifying ${regions.length} regions (tolerance: ${tolerance * 1000}mm)...`);

  let totalPointsBefore = 0;
  let totalPointsAfter = 0;

  const simplified = regions.map(region => {
    const pointsBefore = region.points.length;
    totalPointsBefore += pointsBefore;

    const simplifiedPoints = simplifyPoints(region.points, tolerance);
    totalPointsAfter += simplifiedPoints.length;

    return {
      ...region,
      points: simplifiedPoints
    };
  });

  const reduction = ((totalPointsBefore - totalPointsAfter) / totalPointsBefore * 100).toFixed(1);
  console.log(`[AUTO-REPAIR] Reduced points from ${totalPointsBefore} to ${totalPointsAfter} (${reduction}% reduction)`);

  return simplified;
}

/**
 * Expand thin regions to meet minimum width requirements
 * @param {Array} regions - Array of regions
 * @param {Object} rules - Constraint rules
 * @returns {Array} Buffered regions
 */
function expandThinRegions(regions, rules = DEFAULT_RULES) {
  console.log(`[AUTO-REPAIR] Checking ${regions.length} regions for width violations...`);

  const minWidth = (rules.min_feature_mm || 120) / 1000; // Convert mm to m
  const bufferAmount = minWidth * 0.3; // Expand by 30% of min width
  let expandedCount = 0;

  const expanded = regions.map(region => {
    if (isTooThin(region, rules)) {
      expandedCount++;
      const area = polygonArea(region.points);
      const perimeter = polygonPerimeter(region.points);
      const approxWidth = (2 * area) / perimeter;

      console.log(`[AUTO-REPAIR] Expanding ${region.color}: width ${(approxWidth * 1000).toFixed(1)}mm < min ${rules.min_feature_mm}mm`);

      return bufferRegion(region, bufferAmount);
    }
    return region;
  });

  console.log(`[AUTO-REPAIR] Expanded ${expandedCount} thin regions`);
  return expanded;
}

/**
 * Auto-repair pipeline: applies all fixes in sequence
 * @param {Array} regions - Array of regions to repair
 * @param {Object} options - Repair options
 * @returns {Object} {repaired, violations, summary}
 */
function autoRepair(regions, options = {}) {
  const {
    rules = DEFAULT_RULES,
    removeSmall = true,
    expandThin = true,
    simplify = true,
    simplifyTolerance = 0.01
  } = options;

  console.log(`[AUTO-REPAIR] Starting auto-repair on ${regions.length} regions...`);
  console.log('[AUTO-REPAIR] Rules:', rules);

  let repaired = [...regions];
  const removedRegions = [];

  // Step 1: Remove very small regions
  if (removeSmall) {
    const result = removeSmallRegions(repaired, rules);
    repaired = result.repaired;
    removedRegions.push(...result.removed);
  }

  // Step 2: Expand thin regions
  if (expandThin) {
    repaired = expandThinRegions(repaired, rules);
  }

  // Step 3: Simplify geometry
  if (simplify) {
    repaired = simplifyRegions(repaired, simplifyTolerance);
  }

  // Step 4: Final validation
  const violations = [];
  for (const region of repaired) {
    const regionViolations = checkRegionConstraints(region, rules);
    if (regionViolations.length > 0) {
      violations.push({
        region: region.color,
        violations: regionViolations
      });
    }
  }

  const summary = {
    originalCount: regions.length,
    repairedCount: repaired.length,
    removedCount: removedRegions.length,
    violationsRemaining: violations.length,
    repairSuccess: violations.length === 0
  };

  console.log('[AUTO-REPAIR] Summary:', summary);

  return {
    repaired,
    removed: removedRegions,
    violations,
    summary
  };
}

/**
 * Generate repair report for UI display
 * @param {Object} repairResult - Result from autoRepair()
 * @returns {string} Human-readable repair summary
 */
function generateRepairReport(repairResult) {
  const { summary, removed, violations } = repairResult;

  const lines = [
    `Auto-repair complete: ${summary.originalCount} → ${summary.repairedCount} regions`
  ];

  if (summary.removedCount > 0) {
    lines.push(`Removed ${summary.removedCount} regions that were too small to install`);
  }

  if (violations.length > 0) {
    lines.push(`Warning: ${violations.length} regions still have violations`);
    for (const v of violations.slice(0, 3)) {
      lines.push(`  - ${v.region}: ${v.violations.map(vv => vv.type).join(', ')}`);
    }
  } else {
    lines.push('All regions now meet installation constraints!');
  }

  return lines.join('\n');
}


module.exports = {
  polygonArea,
  polygonPerimeter,
  shouldRemoveRegion,
  isTooThin,
  simplifyPoints,
  bufferRegion,
  removeSmallRegions,
  simplifyRegions,
  expandThinRegions,
  autoRepair,
  generateRepairReport,
  DEFAULT_RULES
};
