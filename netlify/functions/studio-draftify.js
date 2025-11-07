// TPV Studio 2.0 - Draftify Stage
// Vectorize selected concept into installable design with constraint checking
// Replaces the old grammar-based design-generate endpoint

/**
const { downloadImage } = require('./studio/_utils/replicate.js');
const { posterizeImage } = require('./studio/_utils/color-quantize.js');
const { vectorizeImage, estimateQuality } = require('./studio/_utils/vectorize.js');
const { autoRepair, generateRepairReport } = require('./studio/_utils/auto-repair.js');
const { calculateBOM, calculateInstallerScore, checkRegionConstraints } = require('./studio/_utils/constraints.js');
const { exportSVG, exportPNG, generateAllExports, uploadToStorage } = require('./studio/_utils/exports.js');

 * Convert vectorized regions (with SVG paths) to TPV region format (with points)
 * This is a simplified conversion - full implementation would parse SVG path strings
 * @param {Array} vectorRegions - Regions with SVG paths
 * @param {Object} surface - Surface dimensions
 * @returns {Array} TPV regions with points arrays
 */
function convertToTPVRegions(vectorRegions, surface) {
  console.log('[DRAFTIFY] Converting vector paths to TPV polygon format...');

  // TODO: Full implementation needs SVG path parsing
  // For now, create placeholder point arrays for each region
  // This allows constraint checking to run (even with dummy data)

  const tpvRegions = vectorRegions.map(region => {
    // Create a simple rectangular placeholder
    // Real implementation would parse the SVG path data
    const width = surface.width_m * 0.3;
    const height = surface.height_m * 0.3;
    const x = Math.random() * (surface.width_m - width);
    const y = Math.random() * (surface.height_m - height);

    return {
      color: region.color,
      points: [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height }
      ],
      pathData: region.paths // Keep original SVG paths for export
    };
  });

  console.log(`[DRAFTIFY] Converted ${tpvRegions.length} regions to TPV format`);
  return tpvRegions;
}

/**
 * Default TPV installation rules
 */
const DEFAULT_RULES = {
  min_island_area_m2: 0.3,
  min_feature_mm: 120,
  min_gap_mm: 80,
  min_radius_mm: 50
};

/**
 * Main Draftify Handler
 * POST /api/studio/draftify
 *
 * Request body:
 * {
 *   conceptUrl: string - URL of quantized concept image from Inspire stage
 *   surface: {width_m, height_m} - Surface dimensions
 *   paletteColors: [{code, hex, name}] - Colors used in the concept
 *   options: {
 *     posterize: boolean - Apply posterization before vectorization
 *     vectorQuality: string - 'draft' | 'balanced' | 'precise'
 *     autoRepair: boolean - Auto-fix constraint violations
 *   }
 * }
 *
 * Response:
 * {
 *   design: {
 *     id: string,
 *     regions: [...],
 *     exports: {svgUrl, pngUrl, dxfUrl, pdfUrl},
 *     constraints: {score, violations},
 *     bom: {colourAreas_m2, totalArea_m2},
 *     metadata: {...}
 *   }
 * }
 */
exports.handler = async function(event, context) {
  // Dynamic import of ESM utilities
  
  
  
  
  
  
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const startTime = Date.now();

  try {
    // Parse request
    const request = JSON.parse(event.body);
    const {
      conceptUrl,
      surface = { width_m: 10, height_m: 3 },
      paletteColors = [],
      options = {}
    } = request;

    const {
      posterize = false,
      vectorQuality = 'balanced',
      autoRepairEnabled = true
    } = options;

    // Validate
    if (!conceptUrl || typeof conceptUrl !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'conceptUrl is required' })
      };
    }

    if (!paletteColors || paletteColors.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'paletteColors is required' })
      };
    }

    console.log('[DRAFTIFY] Starting vectorization...');
    console.log('[DRAFTIFY] Concept URL:', conceptUrl);
    console.log('[DRAFTIFY] Surface:', `${surface.width_m}m x ${surface.height_m}m`);
    console.log('[DRAFTIFY] Palette:', paletteColors.map(c => c.code).join(', '));
    console.log('[DRAFTIFY] Options:', { posterize, vectorQuality, autoRepairEnabled });

    // Step 1: Download concept image
    console.log('[DRAFTIFY] Downloading concept image...');
    let imageBuffer = await downloadImage(conceptUrl);

    // Step 2: Apply posterization if requested
    if (posterize) {
      console.log('[DRAFTIFY] Applying posterization...');
      imageBuffer = await posterizeImage(imageBuffer, 4);
    }

    // Step 3: Vectorize image to SVG paths
    console.log('[DRAFTIFY] Vectorizing to SVG paths...');
    let vectorRegions = await vectorizeImage(imageBuffer, paletteColors, vectorQuality);

    const vectorQualityMetrics = estimateQuality(vectorRegions);
    console.log('[DRAFTIFY] Vector quality:', vectorQualityMetrics);

    // Step 4: Convert to TPV polygon format
    let tpvRegions = convertToTPVRegions(vectorRegions, surface);

    // Step 5: Auto-repair constraints if enabled
    let repairResult = null;
    if (autoRepairEnabled) {
      console.log('[DRAFTIFY] Running auto-repair...');
      repairResult = autoRepair(tpvRegions, {
        rules: DEFAULT_RULES,
        removeSmall: true,
        expandThin: true,
        simplify: true
      });

      tpvRegions = repairResult.repaired;
      console.log('[DRAFTIFY] Repair summary:', repairResult.summary);

      if (repairResult.summary.removedCount > 0) {
        console.log(`[DRAFTIFY] Removed ${repairResult.summary.removedCount} regions`);
      }
    }

    // Step 6: Check constraints
    console.log('[DRAFTIFY] Checking constraints...');
    const allViolations = [];

    for (const region of tpvRegions) {
      const violations = checkRegionConstraints(region, DEFAULT_RULES);
      if (violations.length > 0) {
        allViolations.push(...violations);
      }
    }

    const installerScore = calculateInstallerScore(allViolations);
    console.log(`[DRAFTIFY] Installer score: ${installerScore}/100`);
    console.log(`[DRAFTIFY] Violations: ${allViolations.length}`);

    // Step 7: Calculate Bill of Materials
    const bom = calculateBOM(tpvRegions, paletteColors);
    console.log('[DRAFTIFY] BoM calculated:', bom);

    // Step 8: Build palette for export (with dummy roles)
    const exportPalette = paletteColors.map((c, i) => ({
      code: c.code,
      role: i === 0 ? 'base' : 'accent',
      target_ratio: 1.0 / paletteColors.length
    }));

    // Step 9: Generate all export formats
    console.log('[DRAFTIFY] Generating exports (SVG, PNG, DXF, PDF)...');

    const designId = `design_${Date.now()}`;
    const metadata = {
      title: 'TPV Design',
      variant: 1,
      designId,
      surface,
      vectorQuality: vectorQualityMetrics,
      posterized: posterize
    };

    const exports = await generateAllExports(
      tpvRegions,
      surface,
      metadata,
      bom,
      exportPalette
    );

    console.log('[DRAFTIFY] Exports complete:', Object.keys(exports));

    // Step 10: Build response
    const design = {
      id: designId,
      regions: tpvRegions.map(r => ({
        color: r.color,
        pointCount: r.points.length,
        // Don't send full point arrays in response (too large)
        // pathData: r.pathData
      })),
      exports,
      constraints: {
        score: installerScore,
        violations: allViolations.length,
        details: allViolations.slice(0, 10) // First 10 violations
      },
      bom,
      metadata: {
        ...metadata,
        paletteUsed: paletteColors.map(c => ({ code: c.code, name: c.name, hex: c.hex })),
        duration: Date.now() - startTime,
        regionCount: tpvRegions.length
      }
    };

    // Add repair report if auto-repair was used
    if (repairResult) {
      design.repairReport = generateRepairReport(repairResult);
      design.repairSummary = repairResult.summary;
    }

    console.log(`[DRAFTIFY] Complete! Design ready in ${Date.now() - startTime}ms`);

    // Return results
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify({ design })
    };

  } catch (error) {
    console.error('[DRAFTIFY] Error:', error);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Draftify failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
}
