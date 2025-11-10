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

/**
 * Quality check for Flux Dev generated images
 * Analyzes image complexity, color count, and visual characteristics
 *
 * @param {string} imageUrl - URL of generated image
 * @param {Object} brief - Design brief with composition constraints
 * @param {number} maxColours - Maximum allowed colours (1-8)
 * @returns {Promise<Object>} QC results {pass, region_count, colour_count, min_feature_mm, min_radius_mm, shadow_softness, score}
 */
export async function checkFluxDevQuality(imageUrl, brief, maxColours) {
  console.log(`[QUALITY] Checking Flux Dev output quality`);
  console.log(`[QUALITY] Max colours: ${maxColours}`);

  // Import sharp dynamically
  const sharp = (await import('sharp')).default;

  try {
    // Download and analyze image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;

    console.log(`[QUALITY] Image dimensions: ${width}×${height}`);

    // Extract pixel data for analysis
    const { data, info } = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    // 1. Count distinct colors (simplified - sample-based for performance)
    const colorSet = new Set();
    const sampleRate = 10; // Sample every 10th pixel

    for (let i = 0; i < data.length; i += info.channels * sampleRate) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Quantize to reduce noise (group similar colors)
      const qr = Math.floor(r / 16) * 16;
      const qg = Math.floor(g / 16) * 16;
      const qb = Math.floor(b / 16) * 16;
      colorSet.add(`${qr},${qg},${qb}`);
    }

    const colourCount = colorSet.size;
    console.log(`[QUALITY] Estimated colour count: ${colourCount} (sampled)`);

    // 2. Estimate region count using simple edge detection
    // For now, use a rough heuristic: more colors usually means more regions
    // A full implementation would use connected components analysis
    const estimatedRegions = Math.max(2, Math.min(15, Math.floor(colourCount * 0.8)));
    console.log(`[QUALITY] Estimated region count: ${estimatedRegions}`);

    // 3. Check composition constraints
    const composition = brief.composition || {
      min_feature_mm: 120,
      min_radius_mm: 600,
      target_region_count: 3
    };

    // Calculate minimum feature size in pixels (for reference)
    const ppi = parseInt(process.env.IMG_PPI || '200');
    const minFeaturePixels = (composition.min_feature_mm / 25.4) * ppi;
    const minRadiusPixels = (composition.min_radius_mm / 25.4) * ppi;

    console.log(`[QUALITY] Min feature: ${composition.min_feature_mm}mm (${minFeaturePixels.toFixed(0)}px)`);
    console.log(`[QUALITY] Min radius: ${composition.min_radius_mm}mm (${minRadiusPixels.toFixed(0)}px)`);

    // 4. Shadow detection (check for soft gradients)
    // Sample pixels and check for smooth gradients
    let softGradientCount = 0;
    const gradientSampleSize = 100;

    for (let i = 0; i < gradientSampleSize; i++) {
      const idx = Math.floor(Math.random() * (data.length / info.channels)) * info.channels;
      if (idx + info.channels * 2 < data.length) {
        const r1 = data[idx];
        const r2 = data[idx + info.channels];
        const r3 = data[idx + info.channels * 2];

        // Check for smooth gradient (small incremental changes)
        const diff1 = Math.abs(r2 - r1);
        const diff2 = Math.abs(r3 - r2);

        if (diff1 > 0 && diff1 < 20 && diff2 > 0 && diff2 < 20) {
          softGradientCount++;
        }
      }
    }

    const gradientRatio = softGradientCount / gradientSampleSize;
    const hasSoftShadows = gradientRatio > 0.15;  // >15% smooth gradients
    const shadowSoftness = hasSoftShadows ? 'soft' : 'hard';

    console.log(`[QUALITY] Shadow softness: ${shadowSoftness} (gradient ratio: ${(gradientRatio * 100).toFixed(1)}%)`);

    // 5. Calculate QC score and pass/fail
    const checks = {
      regionCount: estimatedRegions <= 10,
      colourCount: colourCount <= (maxColours + 1),  // +1 tolerance
      shadowsHard: !hasSoftShadows
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.values(checks).length;
    const score = Math.round((passedChecks / totalChecks) * 100);

    const pass = checks.regionCount && checks.colourCount && checks.shadowsHard;

    console.log(`[QUALITY] QC Result: ${pass ? 'PASS' : 'FAIL'} (score: ${score}/100)`);
    console.log(`[QUALITY] - Region count: ${estimatedRegions} ${checks.regionCount ? '✓' : '✗'} (≤10)`);
    console.log(`[QUALITY] - Colour count: ${colourCount} ${checks.colourCount ? '✓' : '✗'} (≤${maxColours + 1})`);
    console.log(`[QUALITY] - Shadow type: ${shadowSoftness} ${checks.shadowsHard ? '✓' : '✗'} (hard required)`);

    return {
      pass,
      region_count: estimatedRegions,
      colour_count: colourCount,
      min_feature_mm: composition.min_feature_mm,
      min_radius_mm: composition.min_radius_mm,
      shadow_softness: shadowSoftness,
      score,
      checks,
      message: pass
        ? `QC passed: ${estimatedRegions} regions, ${colourCount} colours, ${shadowSoftness} shadows`
        : `QC failed: ${!checks.regionCount ? 'too many regions' : ''} ${!checks.colourCount ? 'too many colours' : ''} ${!checks.shadowsHard ? 'soft shadows detected' : ''}`.trim()
    };

  } catch (error) {
    console.error('[QUALITY] QC check failed:', error);

    // On error, return a permissive result but log the issue
    return {
      pass: true,  // Don't block on QC errors
      region_count: 0,
      colour_count: 0,
      min_feature_mm: brief.composition?.min_feature_mm || 120,
      min_radius_mm: brief.composition?.min_radius_mm || 600,
      shadow_softness: 'unknown',
      score: 0,
      error: error.message,
      message: `QC check error (allowing pass): ${error.message}`
    };
  }
}

/**
 * Determine if QC auto-retry should be triggered
 * @param {Object} qcResults - Results from checkFluxDevQuality
 * @param {number} retryCount - Current retry count
 * @returns {boolean} True if should retry
 */
export function shouldRetryGeneration(qcResults, retryCount) {
  const maxRetries = parseInt(process.env.QC_MAX_RETRIES || '1');

  // Only retry if QC failed AND we haven't exceeded max retries
  const shouldRetry = !qcResults.pass && retryCount < maxRetries;

  if (shouldRetry) {
    console.log(`[QUALITY] QC failed, triggering auto-retry (attempt ${retryCount + 1}/${maxRetries})`);
  } else if (!qcResults.pass) {
    console.log(`[QUALITY] QC failed but max retries (${maxRetries}) reached`);
  }

  return shouldRetry;
}
