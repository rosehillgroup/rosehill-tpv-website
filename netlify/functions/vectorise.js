// TPV Studio - Vectorization Pipeline
// Converts raster outputs to installer-ready SVG/PDF with manufacturing constraints
//
// Pipeline stages:
// 1. Fetch & decode raster image
// 2. Gradient detection (fail QC if soft shadows detected)
// 3. K-means color quantization (reduce to ≤8 colors)
// 4. Region tracing with ImageTracer
// 5. Douglas-Peucker simplification
// 6. Min feature/radius enforcement (120mm, 600mm)
// 7. SVG assembly
// 8. QC validation (IoU ≥ 0.98)
// 9. PDF export with resvg-js
// 10. Upload to storage and return URLs

const { getSupabaseServiceClient } = require('./studio/_utils/supabase.js');

// Dynamic imports for ESM modules
let quantizeColors, detectGradients, traceRegions, simplifyPaths, enforceConstraints, calculateIoU, generateSVG, generatePDF;

(async () => {
  // Lazy load helper modules
  const quantizer = await import('./studio/_utils/vectorization/quantizer.js');
  quantizeColors = quantizer.quantizeColors;

  const gradientDetector = await import('./studio/_utils/vectorization/gradient-detector.js');
  detectGradients = gradientDetector.detectGradients;

  const tracer = await import('./studio/_utils/vectorization/tracer.js');
  traceRegions = tracer.traceRegions;

  const simplifier = await import('./studio/_utils/vectorization/simplifier.js');
  simplifyPaths = simplifier.simplifyPaths;

  const constraints = await import('./studio/_utils/vectorization/constraints.js');
  enforceConstraints = constraints.enforceConstraints;

  const qc = await import('./studio/_utils/vectorization/qc.js');
  calculateIoU = qc.calculateIoU;

  const svgGen = await import('./studio/_utils/vectorization/svg-generator.js');
  generateSVG = svgGen.generateSVG;

  const pdfGen = await import('./studio/_utils/vectorization/pdf-generator.js');
  generatePDF = pdfGen.generatePDF;
})();

/**
 * Vectorization endpoint handler
 *
 * @param {Object} event.body - Request body
 * @param {string} event.body.image_url - URL of raster image to vectorize
 * @param {string} event.body.job_id - Studio job ID for tracking
 * @param {number} event.body.width_mm - Surface width in millimeters
 * @param {number} event.body.height_mm - Surface height in millimeters
 * @param {number} event.body.max_colours - Maximum colors (1-8)
 * @returns {Promise<Object>} {ok, svg_url, pdf_url, metrics, qc_results}
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

    const rasterBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Get dimensions
    const metadata = await sharp(rasterBuffer).metadata();
    const imageWidth = metadata.width;
    const imageHeight = metadata.height;

    console.log(`[VECTORIZE] Fetched: ${imageWidth}×${imageHeight}px, ${rasterBuffer.length} bytes`);

    // ========================================================================
    // STEP 3: Gradient detection (QC gate)
    // ========================================================================

    console.log('[VECTORIZE] Stage 2/9: Detecting gradients...');

    const gradientResult = await detectGradients(rasterBuffer);
    const hasGradients = gradientResult.hasGradients;

    if (hasGradients) {
      console.error('[VECTORIZE] QC FAIL: Soft shadows/gradients detected');
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: false,
          error: 'QC_FAIL_GRADIENTS',
          message: 'Soft shadows or gradients detected in raster image',
          qc_results: {
            pass: false,
            gradient_detected: true,
            confidence: gradientResult.confidence,
            metrics: gradientResult.metrics
          }
        })
      };
    }

    console.log('[VECTORIZE] Gradient check passed');

    // ========================================================================
    // STEP 4: K-means color quantization
    // ========================================================================

    console.log('[VECTORIZE] Stage 3/9: Quantizing colors...');

    const quantizationResult = await quantizeColors(rasterBuffer, max_colours);
    const quantizedBuffer = quantizationResult.buffer;
    const colorPalette = quantizationResult.palette;

    console.log(`[VECTORIZE] Quantized to ${colorPalette.length} colors`);

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
    // STEP 7: Min feature/radius enforcement
    // ========================================================================

    console.log('[VECTORIZE] Stage 6/9: Enforcing manufacturing constraints...');

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
    // STEP 8: SVG assembly
    // ========================================================================

    console.log('[VECTORIZE] Stage 7/9: Assembling SVG...');

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
    // STEP 9: QC validation (IoU)
    // ========================================================================

    console.log('[VECTORIZE] Stage 8/9: QC validation (IoU)...');

    const iouResult = await calculateIoU(svgString, quantizedBuffer, imageWidth, imageHeight);
    const iou = iouResult.iou;
    const qcPass = iou >= 0.98;

    if (!qcPass) {
      console.error(`[VECTORIZE] QC FAIL: IoU ${iou.toFixed(4)} < 0.98`);
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: false,
          error: 'QC_FAIL_IOU',
          message: `IoU ${iou.toFixed(4)} below threshold 0.98`,
          qc_results: {
            pass: false,
            iou,
            threshold: 0.98,
            metrics: iouResult.metrics
          }
        })
      };
    }

    console.log(`[VECTORIZE] QC PASS: IoU ${iou.toFixed(4)}`);

    // ========================================================================
    // STEP 10: PDF export
    // ========================================================================

    console.log('[VECTORIZE] Stage 9/9: Generating PDF...');

    const pdfBuffer = await generatePDF(svgString, {
      width_mm,
      height_mm,
      metadata: { job_id }
    });

    console.log(`[VECTORIZE] Generated PDF: ${pdfBuffer.length} bytes`);

    // ========================================================================
    // STEP 11: Upload to Supabase storage
    // ========================================================================

    console.log('[VECTORIZE] Uploading SVG and PDF to storage...');

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

    // Upload PDF
    const pdfFileName = `vectors/${job_id}_${Date.now()}.pdf`;
    const { data: pdfData, error: pdfError } = await supabase.storage
      .from('studio-temp')
      .upload(pdfFileName, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });

    if (pdfError) throw new Error(`PDF upload failed: ${pdfError.message}`);

    const { data: pdfUrlData } = supabase.storage
      .from('studio-temp')
      .getPublicUrl(pdfFileName);

    const pdfUrl = pdfUrlData.publicUrl;

    console.log(`[VECTORIZE] Uploaded: SVG=${svgUrl}, PDF=${pdfUrl}`);

    // ========================================================================
    // STEP 12: Return results
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
    console.log(`[VECTORIZE] PDF: ${pdfUrl}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        svg_url: svgUrl,
        pdf_url: pdfUrl,
        metrics,
        qc_results: {
          pass: true,
          iou,
          gradient_detected: false,
          color_count: colorPalette.length,
          region_count: constrainedPaths.length,
          min_feature_mm: constraintMetrics.min_feature_mm,
          min_radius_mm: constraintMetrics.min_radius_mm
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
