// TPV Studio - Flux Dev Job Enqueue
// Streamlined single-pipeline generation following spec
// Pipeline: prompt → refine → stencil → Flux Dev img2img → QC → save

const { getSupabaseServiceClient } = require('./studio/_utils/supabase.js');
const { buildFluxPrompt, createSimplifiedBrief } = require('./studio/_utils/prompt.js');
const { metersToPixels, resolveAspectRatio } = require('./studio/_utils/aspect-resolver.js');
const { generateConceptFluxDev, estimateCost } = require('./studio/_utils/replicate.js');
const { generateBriefStencil } = require('./studio/_utils/brief-stencil.js');

// Dynamic import for ESM modules
let refineToDesignBrief;
(async () => {
  const designDirector = await import('./studio/_utils/design-director.js');
  refineToDesignBrief = designDirector.refineToDesignBrief;
})();

// Helper to upload stencil to Supabase temp storage
async function uploadStencilToStorage(buffer, jobId) {
  const supabase = getSupabaseServiceClient();
  const fileName = `stencils/${jobId}_${Date.now()}.png`;

  const { data, error } = await supabase.storage
    .from('studio-temp')
    .upload(fileName, buffer, {
      contentType: 'image/png',
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw new Error(`Stencil upload failed: ${error.message}`);

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('studio-temp')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { job_id } = JSON.parse(event.body || '{}');
    if (!job_id) throw new Error('job_id required');

    const supabase = getSupabaseServiceClient();

    // Load job
    const { data: job, error } = await supabase
      .from('studio_jobs')
      .select('*')
      .eq('id', job_id)
      .single();

    if (error) throw error;
    if (!job || job.status !== 'pending') {
      return { statusCode: 200, body: JSON.stringify({ ok: true, note: 'Already enqueued or not pending' }) };
    }

    console.log(`[ENQUEUE] Processing job ${job_id}`);

    const startTime = Date.now();

    // ========================================================================
    // STEP 1: Extract parameters
    // ========================================================================

    const userPrompt = job.prompt || 'abstract playground design';
    const maxColours = job.max_colours || 6;
    const trySimpler = job.try_simpler || false;
    const retryCount = job.retry_count || 0;

    // Surface dimensions (support both mm and m formats)
    let surface;
    if (job.surface) {
      surface = {
        width_m: job.surface.width_m || (job.surface.width_mm / 1000),
        height_m: job.surface.height_m || (job.surface.height_mm / 1000)
      };
    } else {
      surface = { width_m: 5, height_m: 5 };  // Default
    }

    // Seed for reproducibility
    const seed = job.metadata?.seed || Math.floor(Math.random() * 1000000);

    console.log(`[ENQUEUE] Params: prompt="${userPrompt}", max_colours=${maxColours}, try_simpler=${trySimpler}, retry=${retryCount}`);
    console.log(`[ENQUEUE] Surface: ${surface.width_m}m × ${surface.height_m}m`);

    // ========================================================================
    // STEP 2: Refine prompt with Design Director → brief JSON
    // ========================================================================

    console.log('[ENQUEUE] Refining prompt with Design Director...');

    let brief;
    try {
      brief = await refineToDesignBrief(userPrompt, {
        surface,
        max_colours: maxColours
      });
      console.log(`[ENQUEUE] Brief refined: "${brief.title}" (${brief.motifs?.length || 0} motifs, ${brief.composition?.target_region_count || 0} regions)`);
    } catch (error) {
      console.error('[ENQUEUE] Design Director failed:', error.message);
      // Create fallback brief with composition
      brief = {
        title: userPrompt,
        mood: ['playful'],
        composition: {
          base_coverage: 0.55,
          accent_coverage: 0.30,
          highlight_coverage: 0.15,
          shape_density: 'low',
          max_detail_level: 'low',
          min_feature_mm: 120,
          min_radius_mm: 600,
          target_region_count: 3,
          avoid: ['thin outlines', 'text', 'tiny shapes']
        },
        motifs: [],
        arrangement_notes: 'Simple playground design with generous spacing and clean composition.'
      };
    }

    // Apply "Try Simpler" adjustments if requested
    if (trySimpler) {
      console.log('[ENQUEUE] Applying "Try Simpler" adjustments');
      brief = createSimplifiedBrief(brief);
    }

    // ========================================================================
    // STEP 3: Build Flux prompt from brief + max_colours
    // ========================================================================

    console.log('[ENQUEUE] Building Flux prompt...');

    const { positive, negative, guidance, steps, denoise } = buildFluxPrompt(brief, {
      max_colours: maxColours,
      try_simpler: trySimpler
    });

    console.log(`[ENQUEUE] Prompt params: guidance=${guidance}, steps=${steps}, denoise=${denoise}`);

    // ========================================================================
    // STEP 4: Calculate aspect ratio and dimensions
    // ========================================================================

    const ppi = parseInt(process.env.IMG_PPI || '200');
    const { w: targetW, h: targetH } = metersToPixels(surface.width_m, surface.height_m, ppi);
    const aspectRatio = resolveAspectRatio(targetW, targetH);

    console.log(`[ENQUEUE] Target: ${targetW}×${targetH}px, Aspect: ${aspectRatio}`);

    // ========================================================================
    // STEP 5: Generate stencil from brief + surface dimensions
    // ========================================================================

    console.log('[ENQUEUE] Generating stencil...');

    const stencilBuffer = await generateBriefStencil(
      brief,
      { width: 1024, height: 1024 },  // Stencil at standard size
      { seed }
    );

    // ========================================================================
    // STEP 6: Upload stencil to temp storage
    // ========================================================================

    console.log('[ENQUEUE] Uploading stencil to storage...');
    const stencilUrl = await uploadStencilToStorage(stencilBuffer, job_id);
    console.log(`[ENQUEUE] Stencil uploaded: ${stencilUrl}`);

    // ========================================================================
    // STEP 7: Create Flux Dev prediction (img2img)
    // ========================================================================

    console.log('[ENQUEUE] Creating Flux Dev prediction...');

    const webhookUrl = `${process.env.PUBLIC_BASE_URL}/.netlify/functions/replicate-callback?token=${encodeURIComponent(process.env.REPLICATE_WEBHOOK_SECRET)}`;

    const { predictionId, status, model, version } = await generateConceptFluxDev(
      positive,
      negative,
      stencilUrl,
      {
        aspect_ratio: aspectRatio,
        denoise,
        guidance,
        steps,
        seed,
        webhook: webhookUrl
      }
    );

    const enqueueDuration = Date.now() - startTime;
    const costEstimate = estimateCost(1);

    console.log(
      `[FLUX-DEV] job=${job_id} prediction=${predictionId} model=${model} ` +
      `steps=${steps} guidance=${guidance} denoise=${denoise} ar=${aspectRatio} ` +
      `seed=${seed} colours=${maxColours} retry=${retryCount} simpler=${trySimpler} ` +
      `duration=${enqueueDuration}ms cost=${costEstimate.totalCost.toFixed(4)}`
    );

    // ========================================================================
    // STEP 8: Update job to queued with metadata
    // ========================================================================

    await supabase
      .from('studio_jobs')
      .update({
        status: 'queued',
        prediction_id: predictionId,
        started_at: new Date().toISOString(),
        metadata: {
          ...job.metadata,
          mode: 'flux_dev',
          model,
          version,
          seed,
          ppi,
          aspect_ratio: aspectRatio,
          target_dims: { w: targetW, h: targetH },
          steps,
          guidance,
          denoise,
          max_colours: maxColours,
          try_simpler: trySimpler,
          brief: {
            title: brief.title,
            motif_count: brief.motifs?.length || 0,
            mood_count: brief.mood?.length || 0,
            target_region_count: brief.composition?.target_region_count || 0
          },
          prompt: positive,
          negative_prompt: negative,
          stencil_url: stencilUrl,
          cost_estimate: costEstimate.totalCost,
          enqueue_duration: enqueueDuration
        }
      })
      .eq('id', job_id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        prediction_id: predictionId,
        mode: 'flux_dev',
        estimated_duration: 30  // Flux Dev takes ~30s
      })
    };

  } catch (error) {
    console.error('[ENQUEUE] Error:', error);

    // Try to update job to failed status
    try {
      const { job_id } = JSON.parse(event.body || '{}');
      if (job_id) {
        const supabase = getSupabaseServiceClient();
        await supabase
          .from('studio_jobs')
          .update({
            status: 'failed',
            error: error.message
          })
          .eq('id', job_id);
      }
    } catch (updateError) {
      console.error('[ENQUEUE] Failed to update job status:', updateError);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
