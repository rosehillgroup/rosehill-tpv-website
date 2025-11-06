// Constraint Checking and Scoring for TPV Studio
// Simplified implementation for Week 1 MVP

/**
 * Calculate polygon area using shoelace formula
 */
export function polygonArea(points) {
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
export function polygonPerimeter(points) {
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
 * Check if polygon is too small (area constraint)
 */
export function checkMinArea(region, rules) {
  const area = polygonArea(region.points);
  const minArea = rules.min_island_area_m2 || 0.3;

  return {
    pass: area >= minArea,
    type: 'min_area',
    severity: area < minArea * 0.5 ? 'high' : 'medium',
    actual: area,
    expected: minArea,
    location: [region.points[0].x, region.points[0].y]
  };
}

/**
 * Estimate minimum feature width (simplified)
 * Compares area to perimeter to detect thin features
 */
export function checkMinWidth(region, rules) {
  const area = polygonArea(region.points);
  const perimeter = polygonPerimeter(region.points);

  // Approximate width = area / (perimeter / 2)
  const approxWidth = (2 * area) / perimeter;
  const minWidth = (rules.min_feature_mm || 120) / 1000; // Convert mm to m

  return {
    pass: approxWidth >= minWidth,
    type: 'min_width',
    severity: approxWidth < minWidth * 0.5 ? 'high' : 'medium',
    actual: approxWidth * 1000, // Convert to mm for reporting
    expected: minWidth * 1000,
    location: [region.points[0].x, region.points[0].y]
  };
}

/**
 * Check constraints for a single region
 */
export function checkRegionConstraints(region, rules) {
  const violations = [];

  // Check minimum area
  const areaCheck = checkMinArea(region, rules);
  if (!areaCheck.pass) {
    violations.push(areaCheck);
  }

  // Check approximate minimum width
  const widthCheck = checkMinWidth(region, rules);
  if (!widthCheck.pass) {
    violations.push(widthCheck);
  }

  return violations;
}

/**
 * Calculate installer score (0-100)
 * Based on RULES.md scoring system
 */
export function calculateInstallerScore(allViolations) {
  let score = 100;

  // Count violations by type
  const violationCounts = {
    min_width: 0,
    min_radius: 0,
    min_gap: 0,
    min_area: 0,
    piece_count: 0,
    acute_angle: 0
  };

  for (const violation of allViolations) {
    if (violation.type in violationCounts) {
      violationCounts[violation.type]++;
    }
  }

  // Apply deductions with caps (from RULES.md)
  score -= Math.min(violationCounts.min_width * 15, 30);
  score -= Math.min(violationCounts.min_radius * 10, 20);
  score -= Math.min(violationCounts.min_gap * 10, 20);
  score -= Math.min(violationCounts.min_area * 10, 20);
  score -= Math.min(violationCounts.piece_count * 5, 20);
  score -= Math.min(violationCounts.acute_angle * 5, 15);

  // Hard cap at 70 if any blocking violations remain
  const hasBlockingViolations = allViolations.some(v => v.severity === 'high');
  if (hasBlockingViolations && score > 70) {
    score = 70;
  }

  return Math.max(0, Math.round(score));
}

/**
 * Calculate Bill of Materials (BoM)
 * Returns color areas and percentages
 */
export function calculateBOM(regions, palette) {
  const colourAreas = {};
  let totalArea = 0;

  // Calculate area for each color
  for (const region of regions) {
    if (!region.color) continue;

    const area = polygonArea(region.points);
    totalArea += area;

    if (!colourAreas[region.color]) {
      colourAreas[region.color] = 0;
    }
    colourAreas[region.color] += area;
  }

  return {
    colourAreas_m2: colourAreas,
    totalArea_m2: totalArea
  };
}

/**
 * Assign colors to regions with area balancing and piece caps
 * Implements piece limits: base ≤12, accent ≤30, highlight ≤40
 */
export function assignColors(regions, palette) {
  if (regions.length === 0 || palette.length === 0) {
    return regions;
  }

  // Define piece caps per role - expanded for 6-color system
  const PIECE_CAPS = {
    base: 12,
    accent: 30,      // Legacy 3-color role
    accent1: 25,
    accent2: 30,
    accent3: 35,
    highlight: 40,    // Legacy 3-color role
    highlight1: 35,
    highlight2: 40
  };

  // Calculate total area
  const regionsWithArea = regions.map(r => ({
    region: r,
    area: polygonArea(r.points)
  }));

  const totalArea = regionsWithArea.reduce((sum, r) => sum + r.area, 0);

  // Sort regions by area (descending) - assign largest to base first
  regionsWithArea.sort((a, b) => b.area - a.area);

  // Initialize color buckets with caps
  const colorBuckets = palette.map(p => ({
    code: p.code,
    role: p.role,
    target_ratio: p.target_ratio || 0,
    target_area: totalArea * (p.target_ratio || 0),
    cap: PIECE_CAPS[p.role] || 50,
    assigned_area: 0,
    assigned_count: 0,
    regions: []
  }));

  // Sort buckets by target ratio (descending) - fill base first
  colorBuckets.sort((a, b) => b.target_ratio - a.target_ratio);

  // Assign regions to colors using greedy area-matching with caps
  for (const { region, area } of regionsWithArea) {
    // Find best color: maximize area coverage without exceeding cap
    let bestBucket = null;
    let bestScore = -Infinity;

    for (const bucket of colorBuckets) {
      // Skip if cap reached
      if (bucket.assigned_count >= bucket.cap) {
        continue;
      }

      // Score = how much this helps reach target (negative if over)
      const areaDeficit = bucket.target_area - bucket.assigned_area;
      const score = areaDeficit / bucket.target_area; // Normalized deficit

      if (score > bestScore) {
        bestScore = score;
        bestBucket = bucket;
      }
    }

    // Fallback: assign to first available bucket if all targets met
    if (!bestBucket) {
      bestBucket = colorBuckets.find(b => b.assigned_count < b.cap);
    }

    // Assign to chosen bucket
    if (bestBucket) {
      bestBucket.regions.push(region);
      bestBucket.assigned_area += area;
      bestBucket.assigned_count++;
    } else {
      // Emergency fallback: assign to base (should never happen)
      console.warn('[COLOR ASSIGN] All caps reached, assigning to base');
      colorBuckets[0].regions.push(region);
      colorBuckets[0].assigned_count++;
    }
  }

  // Log assignment summary
  for (const bucket of colorBuckets) {
    const areaPercent = ((bucket.assigned_area / totalArea) * 100).toFixed(1);
    const targetPercent = (bucket.target_ratio * 100).toFixed(1);
    const capStatus = bucket.assigned_count > bucket.cap ? '⚠️  EXCEEDED' : '✓';

    console.log(
      `[COLOR ASSIGN] ${bucket.code} (${bucket.role}): ` +
      `${bucket.assigned_count}/${bucket.cap} pieces ${capStatus}, ` +
      `${areaPercent}% area (target ${targetPercent}%)`
    );
  }

  // Flatten back to colored regions
  const coloredRegions = [];
  for (const bucket of colorBuckets) {
    for (const region of bucket.regions) {
      coloredRegions.push({
        ...region,
        color: bucket.code,
        colorRole: bucket.role
      });
    }
  }

  return coloredRegions;
}



