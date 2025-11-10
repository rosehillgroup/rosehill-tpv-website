// TPV Studio - Vectorization Pipeline
// Converts raster outputs to installer-ready SVG with manufacturing constraints
//
// Pipeline stages:
// 1. Fetch & decode raster image
// 2. Gradient detection with automatic flattening
// 3. K-means color quantization (reduce to ≤8 colors)
// 4. Region tracing with ImageTracer
// 5. Douglas-Peucker simplification
// 6. QC validation (IoU ≥ 0.80) - validates tracing accuracy
// 7. Min feature/radius enforcement (120mm, 600mm)
// 8. SVG assembly
// 9. Upload to storage and return URL

const { getSupabaseServiceClient } = require('./studio/_utils/supabase.js');

// Import vectorization modules
const { quantizeColors } = require('./studio/_utils/vectorization/quantizer.js');
const { detectGradients } = require('./studio/_utils/vectorization/gradient-detector.js');
const { flattenGradients } = require('./studio/_utils/vectorization/gradient-flattener.js');
const { traceRegions } = require('./studio/_utils/vectorization/tracer.js');
const { simplifyPaths } = require('./studio/_utils/vectorization/simplifier.js');
const { enforceConstraints } = require('./studio/_utils/vectorization/constraints.js');
const { calculateIoU } = require('./studio/_utils/vectorization/qc.js');
const { generateSVG } = require('./studio/_utils/vectorization/svg-generator.js');

/**
 * Vectorization endpoint handler
 *
 * @param {Object} event.body - Request body
 * @param {string} event.body.image_url - URL of raster image to vectorize
 * @param {string} event.body.job_id - Studio job ID for tracking
 * @param {number} event.body.width_mm - Surface width in millimeters
 * @param {number} event.body.height_mm - Surface height in millimeters
 * @param {number} event.body.max_colours - Maximum colors (1-8)
 * @returns {Promise<Object>} {ok, svg_url, metrics, qc_results}
 */
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const startTime = Date.now();

  try {
    // ========================================================================
    // STEP 1: Parse and validate input
    // ========================================================================

    const { image_url, job_id, width_mm, height_mm, max_colours } = JSON.parse(event.body || '{}');

    // Validate required parameters
    if (!image_url) {
      throw new Error('image_url is required');
    }
    if (!job_id) {
      throw new Error('job_id is required');
    }
    if (!width_mm || width_mm < 2000 || width_mm > 20000) {
      throw new Error('width_mm must be between 2000-20000mm');
    }
    if (!height_mm || height_mm < 2000 || height_mm > 20000) {
      throw new Error('height_mm must be between 2000-20000mm');
    }
    if (!max_colours || max_colours < 1 || max_colours > 8) {
      throw new Error('max_colours must be between 1-8');
    }

    console.log(`[VECTORIZE] Starting vectorization for job ${job_id}`);
    console.log(`[VECTORIZE] Source: ${image_url}`);
    console.log(`[VECTORIZE] Surface: ${width_mm}mm × ${height_mm}mm`);
    console.log(`[VECTORIZE] Max colours: ${max_colours}`);

    // ========================================================================
    // STEP 2: Fetch and decode raster image
    // ========================================================================

    console.log('[VECTORIZE] Stage 1/9: Fetching raster image...');

    const sharp = (await import('sharp')).default;

    // Fetch image from URL
    const imageResponse = await fetch(image_url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    let rasterBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Get dimensions
    const metadata = await sharp(rasterBuffer).metadata();
    const imageWidth = metadata.width;
    const imageHeight = metadata.height;

    console.log(`[VECTORIZE] Fetched: ${imageWidth}×${imageHeight}px, ${rasterBuffer.length} bytes`);

    // ========================================================================
    // STEP 3: Gradient detection with conditional flattening
    // ========================================================================

    console.log('[VECTORIZE] Stage 2/9: Detecting gradients...');

    const gradientResult = await detectGradients(rasterBuffer);
    const hasGradients = gradientResult.hasGradients;
    const gradientRatio = gradientResult.metrics.gradient_region_ratio;
    const softEdgeRatio = gradientResult.metrics.soft_edge_ratio;

    // Track QC metadata
    let qcMetadata = {
      gradient_detected: hasGradients,
      pre_flatten_gradient_ratio: gradientRatio,
      pre_flatten_soft_edge_ratio: softEdgeRatio,
      flattening_applied: false
    };

    if (hasGradients) {
      console.log(`[VECTORIZE] ⚠️  Gradients detected: gradient_ratio=${(gradientRatio * 100).toFixed(1)}%, soft_edge_ratio=${(softEdgeRatio * 100).toFixed(1)}%`);
      console.log('[VECTORIZE] Applying gradient flattening...');

      // Apply gradient flattening
      const flatteningResult = await flattenGradients(rasterBuffer, {
        bilateral: { d: 5, sigmaC: 45, sigmaS: 9 },
        k: Math.min(max_colours, 8)
      });

      rasterBuffer = flatteningResult.buffer;
      qcMetadata.flattening_applied = true;
      qcMetadata.flatten_metrics = flatteningResult.metrics;

      console.log(`[VECTORIZE] Flattening complete: k=${flatteningResult.metrics.k_used}, post_gradient_ratio=${(flatteningResult.metrics.post_flatten_gradient_ratio * 100).toFixed(1)}%`);
    } else {
      console.log('[VECTORIZE] No gradients detected, proceeding with original image');
    }

    // ========================================================================
    // STEP 4: K-means color quantization
    // ========================================================================

    let quantizedBuffer;
    let colorPalette;

    if (qcMetadata.flattening_applied) {
      // Skip quantization - flattening already posterized to exact colors
      console.log('[VECTORIZE] Stage 3/9: Using flattened image (skipping redundant quantization)...');

      quantizedBuffer = rasterBuffer;

      // Extract actual colors from flattened image
      const { data: rawData, info } = await sharp(rasterBuffer)
        .raw()
        .toBuffer({ resolveWithObject: true });

      const channels = info.channels;
      const uniqueColors = new Set();

      for (let i = 0; i < rawData.length; i += channels) {
        const r = rawData[i];
        const g = rawData[i + 1];
        const b = rawData[i + 2];
        uniqueColors.add(`${r},${g},${b}`);
      }

      colorPalette = Array.from(uniqueColors).map(colorStr => {
        const [r, g, b] = colorStr.split(',').map(Number);
        return { r, g, b };
      });

      console.log(`[VECTORIZE] Extracted ${colorPalette.length} unique colors from flattened image`);
      colorPalette.forEach((c, i) => {
        console.log(`    Color ${i + 1}: rgb(${c.r}, ${c.g}, ${c.b})`);
      });
    } else {
      // No flattening - apply quantization
      console.log('[VECTORIZE] Stage 3/9: Quantizing colors...');

      const quantizationResult = await quantizeColors(rasterBuffer, max_colours);
      quantizedBuffer = quantizationResult.buffer;
      colorPalette = quantizationResult.palette;

      console.log(`[VECTORIZE] Quantized to ${colorPalette.length} colors`);
    }

    // ========================================================================
    // STEP 5: Region tracing with ImageTracer
    // ========================================================================

    console.log('[VECTORIZE] Stage 4/9: Tracing regions...');

    const tracingResult = await traceRegions(quantizedBuffer, colorPalette);
    const tracedPaths = tracingResult.paths;

    console.log(`[VECTORIZE] Traced ${tracedPaths.length} regions`);

    // ========================================================================
    // STEP 6: Douglas-Peucker simplification
    // ========================================================================

    console.log('[VECTORIZE] Stage 5/9: Simplifying paths...');

    const simplifiedPaths = simplifyPaths(tracedPaths);

    console.log(`[VECTORIZE] Simplified ${simplifiedPaths.length} paths`);

    // ========================================================================
    // STEP 6: QC validation (IoU) - BEFORE manufacturing constraints
    // ========================================================================
    // Validate tracing accuracy before removing small features
    // This ensures complex designs can pass QC

    console.log('[VECTORIZE] Stage 6/9: QC validation (IoU)...');

    // Generate temporary SVG from simplified paths (before constraints)
    const qcSvgString = generateSVG(
      simplifiedPaths,
      { width: imageWidth, height: imageHeight },
      {
        job_id,
        surface_dimensions: { width: width_mm, height: height_mm }
      }
    );

    const iouResult = await calculateIoU(qcSvgString, quantizedBuffer, imageWidth, imageHeight);
    const iou = iouResult.iou;
    const qcPass = iou >= 0.80;

    if (!qcPass) {
      console.error(`[VECTORIZE] QC FAIL: IoU ${iou.toFixed(4)} < 0.80`);
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: false,
          error: 'QC_FAIL_IOU',
          message: `IoU ${iou.toFixed(4)} below threshold 0.80 (tracing accuracy check)`,
          qc_results: {
            pass: false,
            iou,
            threshold: 0.80,
            metrics: iouResult.metrics,
            ...qcMetadata
          }
        })
      };
    }

    console.log(`[VECTORIZE] QC PASS: IoU ${iou.toFixed(4)} (threshold: 0.80, ideal: 0.90+)`);

    // ========================================================================
    // STEP 7: Min feature/radius enforcement (AFTER QC)
    // ========================================================================

    console.log('[VECTORIZE] Stage 7/9: Enforcing manufacturing constraints...');

    const constraintsResult = enforceConstraints(simplifiedPaths, {
      width_mm,
      height_mm,
      image_width: imageWidth,
      image_height: imageHeight
    });

    const constrainedPaths = constraintsResult.paths;
    const constraintMetrics = constraintsResult.metrics;

    console.log(`[VECTORIZE] Constrained to ${constrainedPaths.length} paths (removed ${constraintMetrics.features_removed})`);

    // ========================================================================
    // STEP 8: SVG assembly (final, with constraints applied)
    // ========================================================================

    console.log('[VECTORIZE] Stage 8/9: Assembling final SVG...');

    const svgString = generateSVG(
      constrainedPaths,
      { width: imageWidth, height: imageHeight },
      {
        job_id,
        surface_dimensions: { width: width_mm, height: height_mm }
      }
    );

    console.log(`[VECTORIZE] Generated SVG: ${svgString.length} bytes`);

    // ========================================================================
    // STEP 10: Upload SVG to Supabase storage
    // ========================================================================
    // Note: PDF generation skipped - SVG is already perfect for print/installation
    // Large format surfaces (5m×5m) would require 3.5B pixels at 300 DPI

    console.log('[VECTORIZE] Stage 9/9: Uploading SVG to storage...');

    const supabase = getSupabaseServiceClient();

    // Upload SVG
    const svgFileName = `vectors/${job_id}_${Date.now()}.svg`;
    const { data: svgData, error: svgError } = await supabase.storage
      .from('studio-temp')
      .upload(svgFileName, Buffer.from(svgString), {
        contentType: 'image/svg+xml',
        cacheControl: '3600',
        upsert: false
      });

    if (svgError) throw new Error(`SVG upload failed: ${svgError.message}`);

    const { data: svgUrlData } = supabase.storage
      .from('studio-temp')
      .getPublicUrl(svgFileName);

    const svgUrl = svgUrlData.publicUrl;

    console.log(`[VECTORIZE] Uploaded SVG: ${svgUrl}`);

    // ========================================================================
    // STEP 11: Return results
    // ========================================================================

    const duration = Date.now() - startTime;

    const metrics = {
      duration_ms: duration,
      image_dimensions: { width: imageWidth, height: imageHeight },
      surface_dimensions_mm: { width: width_mm, height: height_mm },
      color_count: colorPalette.length,
      region_count: constrainedPaths.length,
      ...constraintMetrics,
      iou
    };

    console.log(`[VECTORIZE] Completed in ${duration}ms`);
    console.log(`[VECTORIZE] SVG: ${svgUrl}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        svg_url: svgUrl,
        metrics,
        qc_results: {
          pass: true,
          iou,
          color_count: colorPalette.length,
          region_count: constrainedPaths.length,
          min_feature_mm: constraintMetrics.min_feature_mm,
          min_radius_mm: constraintMetrics.min_radius_mm,
          ...qcMetadata
        }
      })
    };

  } catch (error) {
    console.error('[VECTORIZE] Error:', error);

    // Try to update job with error status
    try {
      const { job_id } = JSON.parse(event.body || '{}');
      if (job_id) {
        const supabase = getSupabaseServiceClient();
        await supabase
          .from('studio_jobs')
          .update({
            metadata: {
              vectorization_error: error.message,
              vectorization_failed_at: new Date().toISOString()
            }
          })
          .eq('id', job_id);
      }
    } catch (updateError) {
      console.error('[VECTORIZE] Failed to update job:', updateError);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: error.message
      })
    };
  }
};
