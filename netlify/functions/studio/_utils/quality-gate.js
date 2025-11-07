// Quality Gate for TPV Studio Multi-Pass Pipeline
// Implements sharp quality criteria with auto-retry logic
// Coverage, edge health, palette purity, motif legibility

/**
 * Analyze region coverage distribution
 * @param {Array} regions - Array of region objects with colorRole
 * @param {Object} surface - {width_m, height_m}
 * @returns {Object} Coverage analysis with pass/fail
 */
export function analyzeCoverage(regions, surface) {
  console.log(`[QUALITY] Analyzing coverage for ${regions.length} regions`);

  const totalArea = surface.width_m * surface.height_m;

  // Calculate area for each region using shoelace formula
  const calculateArea = (points) => {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area) / 2;
  };

  // Group by role and sum areas
  const roleAreas = {
    base: 0,
    accent: 0,
    highlight: 0
  };

  for (const region of regions) {
    const area = calculateArea(region.points);
    const role = region.colorRole || 'base';
    roleAreas[role] += area;
  }

  // Calculate percentages
  const coverage = {
    base: (roleAreas.base / totalArea) * 100,
    accent: (roleAreas.accent / totalArea) * 100,
    highlight: (roleAreas.highlight / totalArea) * 100
  };

  console.log(`[QUALITY] Coverage: base=${coverage.base.toFixed(1)}%, accent=${coverage.accent.toFixed(1)}%, highlight=${coverage.highlight.toFixed(1)}%`);

  // Check against criteria (±3% tolerance)
  const checks = {
    base: coverage.base >= 47 && coverage.base <= 100, // ≥50% ±3%
    accent: coverage.accent >= 22 && coverage.accent <= 38, // 25-35% ±3%
    highlight: coverage.highlight >= 7 && coverage.highlight <= 23 // 10-20% ±3%
  };

  const passed = checks.base && checks.accent && checks.highlight;

  return {
    coverage,
    checks,
    passed,
    score: passed ? 1.0 : 0.5,
    message: passed ? 'Coverage distribution healthy' : `Coverage out of range: base=${coverage.base.toFixed(1)}%, accent=${coverage.accent.toFixed(1)}%, highlight=${coverage.highlight.toFixed(1)}%`
  };
}

/**
 * Analyze edge health (corridors and radii)
 * @param {Array} regions - Array of region objects with points
 * @param {number} minCorridorWidth_mm - Minimum corridor width (default 120mm)
 * @param {number} warnRadiusThreshold_mm - Warn if radius below this (default 600mm)
 * @returns {Object} Edge health analysis
 */
export function analyzeEdgeHealth(regions, minCorridorWidth_mm = 120, warnRadiusThreshold_mm = 600) {
  console.log(`[QUALITY] Analyzing edge health for ${regions.length} regions`);

  // Convert mm to meters
  const minCorridorWidth_m = minCorridorWidth_mm / 1000;
  const warnRadiusThreshold_m = warnRadiusThreshold_mm / 1000;

  let narrowCorridors = 0;
  let sharpCorners = 0;
  const issues = [];

  // Check each region for edge issues
  for (let i = 0; i < regions.length; i++) {
    const region = regions[i];
    const points = region.points;

    // Check for tight corners (estimate curvature)
    for (let j = 0; j < points.length; j++) {
      const prev = points[(j - 1 + points.length) % points.length];
      const curr = points[j];
      const next = points[(j + 1) % points.length];

      // Calculate vectors
      const v1x = curr.x - prev.x;
      const v1y = curr.y - prev.y;
      const v2x = next.x - curr.x;
      const v2y = next.y - curr.y;

      // Calculate angle between vectors
      const dot = v1x * v2x + v1y * v2y;
      const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
      const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);

      if (mag1 > 0.001 && mag2 > 0.001) {
        const cosAngle = dot / (mag1 * mag2);
        const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
        const angleDeg = (angle * 180) / Math.PI;

        // If angle is sharp (<90°), estimate radius
        if (angleDeg < 90) {
          // Rough radius estimation: r ≈ edge_length / (2 * sin(angle/2))
          const edgeLength = (mag1 + mag2) / 2;
          const estimatedRadius = edgeLength / (2 * Math.sin(angle / 2));

          if (estimatedRadius < warnRadiusThreshold_m) {
            sharpCorners++;
            issues.push({
              region: i,
              point: j,
              type: 'sharp_corner',
              radius_m: estimatedRadius,
              angle_deg: angleDeg
            });
          }
        }
      }
    }

    // Check for narrow corridors (distance to nearest neighbor region)
    for (let k = i + 1; k < regions.length; k++) {
      const otherRegion = regions[k];
      const minDist = calculateMinDistance(region.points, otherRegion.points);

      if (minDist < minCorridorWidth_m) {
        narrowCorridors++;
        issues.push({
          region1: i,
          region2: k,
          type: 'narrow_corridor',
          width_m: minDist
        });
      }
    }
  }

  console.log(`[QUALITY] Edge health: ${narrowCorridors} narrow corridors, ${sharpCorners} sharp corners`);

  // Criteria: 0 counts of corridors <120mm (hard fail)
  const passed = narrowCorridors === 0;
  const hasWarnings = sharpCorners > 0;

  return {
    narrowCorridors,
    sharpCorners,
    issues,
    passed,
    hasWarnings,
    score: passed ? (hasWarnings ? 0.85 : 1.0) : 0.0,
    message: passed
      ? (hasWarnings ? `${sharpCorners} corners < 600mm radius (warning only)` : 'Edge health excellent')
      : `FAIL: ${narrowCorridors} corridors < 120mm (installer unfriendly)`
  };
}

/**
 * Calculate minimum distance between two polygons
 * @param {Array} points1 - First polygon points
 * @param {Array} points2 - Second polygon points
 * @returns {number} Minimum distance in meters
 */
function calculateMinDistance(points1, points2) {
  let minDist = Infinity;

  // Check all edge-to-edge distances
  for (let i = 0; i < points1.length; i++) {
    const p1 = points1[i];
    const p2 = points1[(i + 1) % points1.length];

    for (let j = 0; j < points2.length; j++) {
      const q1 = points2[j];
      const q2 = points2[(j + 1) % points2.length];

      // Distance from p1 to line segment q1-q2
      const dist1 = pointToSegmentDistance(p1, q1, q2);
      // Distance from q1 to line segment p1-p2
      const dist2 = pointToSegmentDistance(q1, p1, p2);

      minDist = Math.min(minDist, dist1, dist2);
    }
  }

  return minDist;
}

/**
 * Calculate distance from point to line segment
 */
function pointToSegmentDistance(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    // Segment is a point
    const pdx = p.x - a.x;
    const pdy = p.y - a.y;
    return Math.sqrt(pdx * pdx + pdy * pdy);
  }

  // Project point onto line
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq));
  const projX = a.x + t * dx;
  const projY = a.y + t * dy;

  const pdx = p.x - projX;
  const pdy = p.y - projY;
  return Math.sqrt(pdx * pdx + pdy * pdy);
}

/**
 * Analyze palette purity (exact color match percentage)
 * @param {Buffer} imageBuffer - PNG image buffer
 * @param {Array} palette - Array of {code, hex, rgb: {r, g, b}}
 * @param {boolean} afterDithering - Whether this is after dithering
 * @returns {Promise<Object>} Purity analysis
 */
export async function analyzePalettePurity(imageBuffer, palette, afterDithering = false) {
  console.log(`[QUALITY] Analyzing palette purity (${afterDithering ? 'after' : 'before'} dithering)`);

  // Import sharp dynamically
  const sharp = (await import('sharp')).default;

  // Extract raw pixel data
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const totalPixels = width * height;

  // Build palette lookup for exact matches
  const paletteSet = new Set();
  for (const color of palette) {
    const key = `${color.rgb.r},${color.rgb.g},${color.rgb.b}`;
    paletteSet.add(key);
  }

  let exactMatches = 0;

  // Count exact palette matches
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${r},${g},${b}`;

    if (paletteSet.has(key)) {
      exactMatches++;
    }
  }

  const purity = (exactMatches / totalPixels) * 100;

  console.log(`[QUALITY] Palette purity: ${purity.toFixed(2)}% (${exactMatches}/${totalPixels} exact matches)`);

  // Criteria: ≥92% before dithering, ≥99% after
  const threshold = afterDithering ? 99.0 : 92.0;
  const passed = purity >= threshold;

  return {
    purity,
    exactMatches,
    totalPixels,
    threshold,
    passed,
    score: passed ? 1.0 : (purity / threshold),
    message: passed
      ? `Palette purity ${purity.toFixed(1)}% (≥${threshold}% required)`
      : `FAIL: Palette purity ${purity.toFixed(1)}% (< ${threshold}% required)`
  };
}

/**
 * Analyze motif legibility (silhouette solidity)
 * @param {Array} regions - Array of region objects
 * @returns {Object} Motif legibility analysis
 */
export function analyzeMotifLegibility(regions) {
  console.log(`[QUALITY] Analyzing motif legibility for ${regions.length} regions`);

  // Filter for highlight regions (motifs)
  const motifRegions = regions.filter(r => r.colorRole === 'highlight');

  if (motifRegions.length === 0) {
    console.log(`[QUALITY] No motif regions to analyze`);
    return {
      solidities: [],
      minSolidity: 1.0,
      avgSolidity: 1.0,
      passed: true,
      score: 1.0,
      message: 'No motif regions (skip check)'
    };
  }

  const solidities = [];

  for (const region of motifRegions) {
    const solidity = calculateSilhouetteSolidity(region.points);
    solidities.push(solidity);
  }

  const minSolidity = Math.min(...solidities);
  const avgSolidity = solidities.reduce((a, b) => a + b, 0) / solidities.length;

  console.log(`[QUALITY] Motif solidity: min=${minSolidity.toFixed(3)}, avg=${avgSolidity.toFixed(3)}`);

  // Criteria: silhouette solidity ≥0.82
  const passed = minSolidity >= 0.82;

  return {
    solidities,
    minSolidity,
    avgSolidity,
    passed,
    score: passed ? 1.0 : minSolidity,
    message: passed
      ? `Motif legibility excellent (solidity ${minSolidity.toFixed(2)})`
      : `FAIL: Motif solidity ${minSolidity.toFixed(2)} < 0.82 (too complex)`
  };
}

/**
 * Calculate silhouette solidity (area / convex hull area)
 * Higher values = simpler, more recognizable shapes
 * @param {Array} points - Polygon points
 * @returns {number} Solidity (0-1)
 */
function calculateSilhouetteSolidity(points) {
  // Calculate polygon area using shoelace formula
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  area = Math.abs(area) / 2;

  // Calculate convex hull area (simplified: use bounding box as approximation)
  // For production, use proper convex hull algorithm (Graham scan or Jarvis march)
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  const boundingArea = (maxX - minX) * (maxY - minY);

  // Solidity = actual area / bounding box area
  // (For true solidity, replace bounding box with convex hull)
  return boundingArea > 0 ? area / boundingArea : 1.0;
}

/**
 * Assess overall concept quality and determine remediation
 * @param {Object} concept - Concept data with regions, images, surface
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} Quality assessment with recommendations
 */
export async function assessConceptQuality(concept, options = {}) {
  const {
    checkCoverage = true,
    checkEdgeHealth = true,
    checkPalettePurity = false, // Only if image provided
    checkMotifLegibility = true,
    imageBuffer = null,
    palette = null,
    afterDithering = false
  } = options;

  console.log(`[QUALITY] === Starting Quality Assessment ===`);

  const results = {
    coverage: null,
    edgeHealth: null,
    palettePurity: null,
    motifLegibility: null
  };

  const weights = {
    coverage: 0.25,
    edgeHealth: 0.30,
    palettePurity: 0.25,
    motifLegibility: 0.20
  };

  let totalScore = 0;
  let totalWeight = 0;

  // Run checks
  if (checkCoverage && concept.regions && concept.surface) {
    results.coverage = analyzeCoverage(concept.regions, concept.surface);
    totalScore += results.coverage.score * weights.coverage;
    totalWeight += weights.coverage;
  }

  if (checkEdgeHealth && concept.regions) {
    results.edgeHealth = analyzeEdgeHealth(concept.regions);
    totalScore += results.edgeHealth.score * weights.edgeHealth;
    totalWeight += weights.edgeHealth;
  }

  if (checkPalettePurity && imageBuffer && palette) {
    results.palettePurity = await analyzePalettePurity(imageBuffer, palette, afterDithering);
    totalScore += results.palettePurity.score * weights.palettePurity;
    totalWeight += weights.palettePurity;
  }

  if (checkMotifLegibility && concept.regions) {
    results.motifLegibility = analyzeMotifLegibility(concept.regions);
    totalScore += results.motifLegibility.score * weights.motifLegibility;
    totalWeight += weights.motifLegibility;
  }

  // Calculate final score
  const finalScore = totalWeight > 0 ? totalScore / totalWeight : 1.0;

  // Determine remediation strategy
  const threshold = parseFloat(process.env.QUALITY_THRESHOLD || '0.65');
  const needsRemediation = finalScore < threshold;

  let remediation = null;
  if (needsRemediation) {
    // Single re-seed on motif pass only (cheapest/highest visual lift)
    remediation = {
      strategy: 'reseed_motifs',
      reason: `Quality score ${finalScore.toFixed(3)} < ${threshold}`,
      targetPass: 'motif_refinement',
      maxRetries: 1
    };

    console.log(`[QUALITY] FAIL: Score ${finalScore.toFixed(3)} < ${threshold}`);
    console.log(`[QUALITY] Remediation: ${remediation.strategy} (${remediation.reason})`);
  } else {
    console.log(`[QUALITY] PASS: Score ${finalScore.toFixed(3)} ≥ ${threshold}`);
  }

  return {
    score: finalScore,
    threshold,
    passed: !needsRemediation,
    results,
    remediation,
    summary: {
      coverage: results.coverage?.message || 'Not checked',
      edgeHealth: results.edgeHealth?.message || 'Not checked',
      palettePurity: results.palettePurity?.message || 'Not checked',
      motifLegibility: results.motifLegibility?.message || 'Not checked'
    }
  };
}

/**
 * Quick quality check for stencil generation (pre-SDXL)
 * Only checks geometric properties, not image quality
 * @param {Array} regions - Region array
 * @param {Object} surface - Surface dimensions
 * @returns {Object} Quick assessment
 */
export function quickGeometricCheck(regions, surface) {
  console.log(`[QUALITY] Running quick geometric check`);

  const coverage = analyzeCoverage(regions, surface);
  const edgeHealth = analyzeEdgeHealth(regions);
  const motifLegibility = analyzeMotifLegibility(regions);

  const score = (
    coverage.score * 0.35 +
    edgeHealth.score * 0.40 +
    motifLegibility.score * 0.25
  );

  const passed = score >= 0.70; // Lower threshold for geometric-only check

  console.log(`[QUALITY] Quick check: score=${score.toFixed(3)}, passed=${passed}`);

  return {
    score,
    passed,
    coverage: coverage.message,
    edgeHealth: edgeHealth.message,
    motifLegibility: motifLegibility.message
  };
}
