// TPV Studio - Mood Board Generator Job Enqueue (Vercel)
// Single-Pass Generation Pipeline:
// prompt → refine with Claude → text-to-image → atmospheric mood board
// Two-pass mode DISABLED for mood boards (preserve expressive atmosphere)

import { getSupabaseServiceClient } from './_utils/supabase.js';
import { buildFluxPrompt } from './_utils/prompt.js';
import { metersToPixels, resolveAspectRatio } from './_utils/aspect-resolver.js';
import { generateConceptFluxDev, estimateCost } from './_utils/replicate.js';
import { refineToDesignBrief } from './_utils/design-director.js';
import { initiatePass1, initiatePass2, isTwoPassEnabled } from './_utils/two-pass-generator.js';

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
    const retryCount = job.retry_count || 0;

    // Surface dimensions (for aspect ratio calculation only)
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

    console.log(`[ENQUEUE] Params: prompt="${userPrompt}", retry=${retryCount}`);
    console.log(`[ENQUEUE] Surface: ${surface.width_m}m × ${surface.height_m}m`);

    // ========================================================================
    // STEP 2: Refine prompt with Design Director → mood board description
    // ========================================================================

    console.log('[ENQUEUE] Refining prompt with Design Director...');

    let refinedPrompt;
    try {
      refinedPrompt = await refineToDesignBrief(userPrompt);
      console.log(`[ENQUEUE] Mood board description refined: "${refinedPrompt.slice(0, 80)}..."`);
    } catch (error) {
      console.error('[ENQUEUE] Design Director failed:', error.message);
      // Use simple fallback
      refinedPrompt = `A playful playground mood board inspired by "${userPrompt}". Rich colours, expressive atmosphere, and imaginative visual storytelling create an inviting playground concept.`;
    }

    // ========================================================================
    // STEP 3: Build Flux prompt from refined description
    // ========================================================================

    console.log('[ENQUEUE] Building Flux prompt...');

    const { positive, negative, guidance, steps, denoise } = buildFluxPrompt(refinedPrompt);

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
      // PASS 1: Text-to-Image Mood Board
      // ============================================================
      console.log('[ENQUEUE] Initiating Pass 1: Mood board text-to-image');

      const pass1Result = await initiatePass1(refinedPrompt, {
        aspect_ratio: aspectRatio,
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
      // PASS 2: Quality Refinement (SHOULD NOT BE USED FOR MOOD BOARDS)
      // ============================================================
      console.warn('[ENQUEUE] WARNING: Pass 2 should be DISABLED for mood boards');
      console.log('[ENQUEUE] Initiating Pass 2: Quality refinement');

      pass1ResultUrl = job.metadata?.pass1_result_url;
      if (!pass1ResultUrl) {
        throw new Error('Pass 2 requires pass1_result_url in job metadata');
      }

      console.log(`[ENQUEUE] Using Pass 1 result: ${pass1ResultUrl}`);

      const pass2Result = await initiatePass2(refinedPrompt, pass1ResultUrl, {
        aspect_ratio: aspectRatio,
        seed,
        webhook: webhookUrl
      });

      predictionId = pass2Result.predictionId;
      status = pass2Result.status;
      model = pass2Result.model;
      version = pass2Result.version;

      console.log(`[ENQUEUE] Pass 2 initiated: ${predictionId}`);

    } else {
      // ============================================================
      // SINGLE-PASS: Pure Text-to-Image (Default for Mood Boards)
      // ============================================================
      console.log('[ENQUEUE] Using single-pass mood board generation');

      const result = await generateConceptFluxDev(
        positive,
        negative,
        null,  // No init image for mood boards
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
      `[MOOD-BOARD] job=${job_id} prediction=${predictionId} model=${model} ` +
      `steps=${steps} guidance=${guidance} denoise=${denoise} ar=${aspectRatio} ` +
      `seed=${seed} retry=${retryCount} ` +
      `duration=${enqueueDuration}ms cost=${costEstimate.totalCost.toFixed(4)}`
    );

    // ========================================================================
    // STEP 7: Update job to queued with metadata
    // ========================================================================

    const metadata = {
      ...job.metadata,
      mode: twoPassMode ? 'mood_board_two_pass' : 'mood_board',
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
      refined_prompt: refinedPrompt,
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
      metadata.refinement_mode = true;  // Pass 2 is quality refinement (should be disabled)
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
      mode: twoPassMode ? 'mood_board_two_pass' : 'mood_board',
      pass: currentPass,
      estimated_duration: 30  // Single-pass mood boards: ~30s
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
