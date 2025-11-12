// TPV Studio - Flux Dev Job Enqueue (Vercel)
// Two-Pass Generation Pipeline:
// Pass 1: prompt → refine → text-to-image (no stencil) → bright, creative concept
// Pass 2: prompt → Pass 1 result + faint stencil → img2img refinement → final output

import { getSupabaseServiceClient } from './_utils/supabase.js';
import { buildFluxPrompt, createSimplifiedBrief } from './_utils/prompt.js';
import { metersToPixels, resolveAspectRatio } from './_utils/aspect-resolver.js';
import { generateConceptFluxDev, estimateCost } from './_utils/replicate.js';
import { generateBriefStencil } from './_utils/brief-stencil.js';
import { refineToDesignBrief } from './_utils/design-director.js';
import { initiatePass1, initiatePass2, isTwoPassEnabled } from './_utils/two-pass-generator.js';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { job_id } = req.body || {};
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
      return res.status(200).json({ ok: true, note: 'Already enqueued or not pending' });
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
    // STEP 5: Determine if this is Pass 1 or Pass 2
    // ========================================================================

    const currentPass = job.metadata?.pass || 1;
    const twoPassMode = isTwoPassEnabled && isTwoPassEnabled();

    console.log(`[ENQUEUE] Mode: ${twoPassMode ? 'Two-Pass' : 'Single-Pass'}, Current Pass: ${currentPass}`);

    // ========================================================================
    // STEP 6: Generate prediction based on pass
    // ========================================================================

    // Remove trailing slash from PUBLIC_BASE_URL to avoid double slashes
    const baseUrl = (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');
    const webhookUrl = `${baseUrl}/api/replicate-callback?token=${encodeURIComponent(process.env.REPLICATE_WEBHOOK_SECRET)}`;

    let predictionId, status, model, version, pass1ResultUrl, stencilUrl;

    if (twoPassMode && currentPass === 1) {
      // ============================================================
      // PASS 1: Text-to-Image (No Stencil)
      // ============================================================
      console.log('[ENQUEUE] Initiating Pass 1: Text-to-image (no stencil)');

      const pass1Result = await initiatePass1(brief, {
        aspect_ratio: aspectRatio,
        max_colours: maxColours,
        seed,
        webhook: webhookUrl
      });

      predictionId = pass1Result.predictionId;
      status = pass1Result.status;
      model = pass1Result.model;
      version = pass1Result.version;

      console.log(`[ENQUEUE] Pass 1 initiated: ${predictionId}`);

    } else if (twoPassMode && currentPass === 2) {
      // ============================================================
      // PASS 2: Img2Img Refinement (Pass 1 result + stencil guidance)
      // ============================================================
      console.log('[ENQUEUE] Initiating Pass 2: Img2img refinement');

      pass1ResultUrl = job.metadata?.pass1_result_url;
      if (!pass1ResultUrl) {
        throw new Error('Pass 2 requires pass1_result_url in job metadata');
      }

      console.log(`[ENQUEUE] Using Pass 1 result: ${pass1ResultUrl}`);

      const pass2Result = await initiatePass2(brief, pass1ResultUrl, {
        aspect_ratio: aspectRatio,
        max_colours: maxColours,
        seed,
        webhook: webhookUrl,
        try_simpler: trySimpler
      });

      predictionId = pass2Result.predictionId;
      status = pass2Result.status;
      model = pass2Result.model;
      version = pass2Result.version;

      console.log(`[ENQUEUE] Pass 2 (cleanup) initiated: ${predictionId}`);

    } else {
      // ============================================================
      // FALLBACK: Single-Pass with Stencil (Legacy Mode)
      // ============================================================
      console.log('[ENQUEUE] Using legacy single-pass mode with stencil');

      const stencilBuffer = await generateBriefStencil(
        brief,
        { width: 1024, height: 1024 },
        { seed }
      );

      stencilUrl = await uploadStencilToStorage(stencilBuffer, job_id);
      console.log(`[ENQUEUE] Stencil uploaded: ${stencilUrl}`);

      const result = await generateConceptFluxDev(
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

      predictionId = result.predictionId;
      status = result.status;
      model = result.model;
      version = result.version;
    }

    const enqueueDuration = Date.now() - startTime;
    const costEstimate = estimateCost(1);

    console.log(
      `[FLUX-DEV] job=${job_id} prediction=${predictionId} model=${model} ` +
      `steps=${steps} guidance=${guidance} denoise=${denoise} ar=${aspectRatio} ` +
      `seed=${seed} colours=${maxColours} retry=${retryCount} simpler=${trySimpler} ` +
      `duration=${enqueueDuration}ms cost=${costEstimate.totalCost.toFixed(4)}`
    );

    // ========================================================================
    // STEP 7: Update job to queued with metadata
    // ========================================================================

    const metadata = {
      ...job.metadata,
      mode: twoPassMode ? 'flux_dev_two_pass' : 'flux_dev',
      pass: currentPass,
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
        target_region_count: brief.composition?.target_region_count || 0,
        full_brief: brief  // Store full brief for Pass 2
      },
      prompt: positive,
      negative_prompt: negative,
      cost_estimate: costEstimate.totalCost,
      enqueue_duration: enqueueDuration
    };

    // Add pass-specific metadata
    if (currentPass === 1) {
      metadata.pass1_prediction_id = predictionId;
    } else if (currentPass === 2) {
      metadata.pass2_prediction_id = predictionId;
      metadata.pass1_result_url = pass1ResultUrl;
      metadata.cleanup_mode = true;  // Pass 2 is cleanup/simplification
    } else {
      // Legacy mode
      metadata.stencil_url = stencilUrl;
    }

    await supabase
      .from('studio_jobs')
      .update({
        status: 'queued',
        prediction_id: predictionId,
        started_at: new Date().toISOString(),
        metadata
      })
      .eq('id', job_id);

    return res.status(200).json({
      ok: true,
      prediction_id: predictionId,
      mode: twoPassMode ? 'flux_dev_two_pass' : 'flux_dev',
      pass: currentPass,
      estimated_duration: twoPassMode ? (currentPass === 1 ? 60 : 30) : 30  // Pass 1: ~30s + Pass 2: ~30s = 60s total
    });

  } catch (error) {
    console.error('[ENQUEUE] Error:', error);

    // Try to update job to failed status
    try {
      const { job_id } = req.body || {};
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

    return res.status(500).json({ error: error.message });
  }
}
