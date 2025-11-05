// Constraint Checking and Scoring for TPV Studio
// Simplified implementation for Week 1 MVP

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
 * Check if polygon is too small (area constraint)
 */
function checkMinArea(region, rules) {
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
function checkMinWidth(region, rules) {
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
 * Assign colors to regions based on palette and target ratios
 * Simplified algorithm for MVP
 */
export function assignColors(regions, palette) {
  if (regions.length === 0 || palette.length === 0) {
    return regions;
  }

  // Sort palette by target ratio (descending)
  const sortedPalette = [...palette].sort((a, b) =>
    (b.target_ratio || 0) - (a.target_ratio || 0)
  );

  // Distribute colors based on target ratios
  const coloredRegions = [];
  let currentColorIndex = 0;
  const regionsPerColor = Math.ceil(regions.length / palette.length);

  for (let i = 0; i < regions.length; i++) {
    // Move to next color based on target ratios
    if (i > 0 && i % regionsPerColor === 0 && currentColorIndex < palette.length - 1) {
      currentColorIndex++;
    }

    const color = sortedPalette[currentColorIndex];
    coloredRegions.push({
      ...regions[i],
      color: color.code,
      colorRole: color.role
    });
  }

  return coloredRegions;
}
