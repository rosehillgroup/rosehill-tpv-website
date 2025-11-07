// TPV Studio - Enqueue Job
// Generates stencil and starts Replicate prediction with webhook

const { getSupabaseServiceClient } = require('./studio/_utils/supabase.js');
const { buildSimplePrompt, buildFluxPrompt } = require('./studio/_utils/prompt.js');
const { metersToPixels, pickNearestSize } = require('./studio/_utils/aspect-resolver.js');
const { createText2ImagePrediction, estimateCostSimple } = require('./studio/_utils/replicate.js');
const { generateAndUploadStencil, generateAndUploadBriefStencil, buildReplicateInput } = require('./studio/_utils/preprocessing.js');

// Dynamic import for ESM modules
let refineToDesignBrief, isDesignDirectorEnabled;
(async () => {
  const designDirector = await import('./studio/_utils/design-director.js');
  refineToDesignBrief = designDirector.refineToDesignBrief;
  isDesignDirectorEnabled = designDirector.isDesignDirectorEnabled;
})();

const REPLICATE_API = 'https://api.replicate.com/v1/predictions';
const SDXL_VERSION = '39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b'; // stable-diffusion-xl-1024-v1-0

exports.handler = async(event, context) => {
  // Dynamic import of ESM utilities
  

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

    // Feature flags: Guided Mode (with IMG2IMG) > Simple Mode (Inspiration) > Multi-pass Mode
    const guidedMode = process.env.INSPIRE_GUIDED_MODE === 'true';
    const simpleMode = process.env.INSPIRE_SIMPLE_MODE === 'true';

    if (guidedMode) {
      // === GUIDED MODE: Brief → Stencil → IMG2IMG ===
      console.log('[ENQUEUE] Using guided mode (stencil-guided IMG2IMG)');

      const startTime = Date.now();

      // Extract job parameters
      const userPrompt = job.prompt || 'abstract playground design';
      const style = job.style || process.env.INSPIRE_MODEL_STYLE_DEFAULT || 'playful_flat';
      const surface = job.surface || job.metadata?.surface || { width_m: 10, height_m: 10 };

      // Refine user text into structured brief
      let brief;
      if (isDesignDirectorEnabled && isDesignDirectorEnabled()) {
        console.log('[ENQUEUE] Using Design Director for brief refinement');
        try {
          brief = await refineToDesignBrief(userPrompt, { surface, style });
          console.log(`[ENQUEUE] Design Director refined: "${brief.title}" (${brief.motifs?.length || 0} motifs)`);
        } catch (error) {
          console.error('[ENQUEUE] Design Director failed, using simple brief:', error.message);
          brief = { title: userPrompt, mood: [], motifs: [], arrangement_notes: null };
        }
      } else {
        // Simple brief without LLM
        brief = { title: userPrompt, mood: [], motifs: [], arrangement_notes: null };
      }

      // Build FLUX prompt from brief
      const { positive: prompt, negative: negative_prompt, guidance, steps } = buildFluxPrompt(brief, { style });

      // Convert surface dimensions to pixels
      const ppi = parseInt(process.env.IMG_PPI || '200');
      const { w: targetW, h: targetH } = metersToPixels(surface.width_m, surface.height_m, ppi);
      const nearest = pickNearestSize({ targetW, targetH });

      // Use provided seed or generate random seed
      const seed = job.metadata?.seed || Math.floor(Math.random() * 1000000);

      // Generate brief-based stencil
      console.log('[ENQUEUE] Generating brief-based stencil...');
      const { stencilUrl, metadata: stencilMetadata } = await generateAndUploadBriefStencil(
        brief,
        { width: nearest.w, height: nearest.h },
        job_id,
        { seed, style }
      );

      // Build webhook URL
      const webhookUrl = `${process.env.PUBLIC_BASE_URL}/.netlify/functions/replicate-callback?token=${encodeURIComponent(process.env.REPLICATE_WEBHOOK_SECRET)}`;

      // Create IMG2IMG prediction with stencil
      const denoise_strength = parseFloat(process.env.IMG2IMG_DENOISE_STRENGTH || '0.6');
      const modelId = process.env.MODEL_ID || 'black-forest-labs/flux-dev';

      console.log('[ENQUEUE] Creating IMG2IMG prediction with stencil...');
      const { predictionId, version } = await createText2ImagePrediction({
        prompt,
        negative_prompt,
        width: nearest.w,
        height: nearest.h,
        steps,
        guidance,
        scheduler: process.env.GEN_SCHEDULER || 'K_EULER',
        seed,
        num_outputs: 1,
        webhook: webhookUrl,
        image: stencilUrl,
        denoise_strength
      });

      const enqueueDuration = Date.now() - startTime;

      // Estimate cost
      const costEstimate = estimateCostSimple(1);

      // Log concise line with all params
      console.log(
        `[GUIDED] job=${job_id} model=${modelId} steps=${steps} cfg=${guidance} ` +
        `denoise=${denoise_strength} gen=${nearest.w}×${nearest.h} target=${targetW}×${targetH} ` +
        `seed=${seed} brief="${brief.title}" motifs=${brief.motifs?.length || 0} ` +
        `enqueue_duration=${enqueueDuration}ms cost_est=${costEstimate.totalCost.toFixed(4)}`
      );

      // Update job to queued with metadata
      await supabase
        .from('studio_jobs')
        .update({
          status: 'queued',
          prediction_id: predictionId,
          started_at: new Date().toISOString(),
          metadata: {
            ...job.metadata,
            mode: 'guided',
            model: modelId,
            version,
            seed,
            ppi,
            target_dims: { w: targetW, h: targetH },
            gen_dims: { w: nearest.w, h: nearest.h },
            ar_label: nearest.label,
            steps,
            guidance,
            denoise_strength,
            style,
            brief: {
              title: brief.title,
              motifCount: brief.motifs?.length || 0,
              moodCount: brief.mood?.length || 0
            },
            prompt,
            negative: negative_prompt,
            stencilUrl,
            stencilMetadata,
            cost_estimate: costEstimate.totalCost,
            enqueue_duration: enqueueDuration
          }
        })
        .eq('id', job_id);

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, prediction_id: predictionId, mode: 'guided' })
      };

    } else if (simpleMode) {
      // === SIMPLE MODE: Direct text→image (Inspiration Mode) ===
      console.log('[ENQUEUE] Using simple mode (Inspiration Mode)');

      
      
      

      const startTime = Date.now();

      // Extract job parameters
      const userPrompt = job.prompt || 'abstract playground design';
      const style = job.style || process.env.INSPIRE_MODEL_STYLE_DEFAULT || 'playful_flat';
      const surface = job.surface || job.metadata?.surface || { width_m: 10, height_m: 10 };

      // Build material-anchored prompt using new prompt builder
      let prompt, negative, guidance, steps;

      // Check if Design Director LLM is enabled for brief refinement
      if (isDesignDirectorEnabled && isDesignDirectorEnabled()) {
        console.log('[ENQUEUE] Using Design Director for brief refinement');

        try {
          // Refine user text into structured brief with LLM
          const brief = await refineToDesignBrief(userPrompt, {
            surface,
            style
          });

          console.log(`[ENQUEUE] Design Director refined: "${brief.title}" (${brief.motifs?.length || 0} motifs)`);

          // Build FLUX prompt from structured brief
          const promptResult = buildFluxPrompt(brief, { style });
          prompt = promptResult.positive;
          negative = promptResult.negative;
          guidance = promptResult.guidance;
          steps = promptResult.steps;

        } catch (error) {
          console.error('[ENQUEUE] Design Director failed, falling back to simple prompt:', error.message);
          // Fall back to simple prompt if LLM fails
          const result = buildSimplePrompt(userPrompt, { style });
          prompt = result.positive;
          negative = result.negative;
          guidance = result.guidance;
          steps = result.steps;
        }
      } else {
        // Simple mode: wrap user text in brief structure without LLM
        const result = buildSimplePrompt(userPrompt, { style });
        prompt = result.positive;
        negative = result.negative;
        guidance = result.guidance;
        steps = result.steps;
      }

      // Convert surface dimensions to pixels and find nearest SDXL size
      const ppi = parseInt(process.env.IMG_PPI || '200');
      const { w: targetW, h: targetH } = metersToPixels(surface.width_m, surface.height_m, ppi);
      const nearest = pickNearestSize({ targetW, targetH });

      // Use provided seed or generate random seed
      const seed = job.metadata?.seed || Math.floor(Math.random() * 1000000);

      // Get model ID from env
      const modelId = process.env.MODEL_ID || 'stability-ai/sdxl';

      // Build webhook URL
      const webhookUrl = `${process.env.PUBLIC_BASE_URL}/.netlify/functions/replicate-callback?token=${encodeURIComponent(process.env.REPLICATE_WEBHOOK_SECRET)}`;

      // Create prediction
      const { predictionId, version } = await createText2ImagePrediction({
        prompt,
        negative_prompt: negative,
        width: nearest.w,
        height: nearest.h,
        steps,
        guidance,
        scheduler: process.env.GEN_SCHEDULER || 'K_EULER',
        seed,
        num_outputs: 1,
        webhook: webhookUrl
      });

      const enqueueDuration = Date.now() - startTime;

      // Estimate cost
      const costEstimate = estimateCostSimple(1);

      // Log concise line with all params
      console.log(
        `[INSP] job=${job_id} model=${modelId} steps=${steps} cfg=${guidance} ` +
        `gen=${nearest.w}×${nearest.h} target=${targetW}×${targetH} seed=${seed} ` +
        `enqueue_duration=${enqueueDuration}ms cost_est=${costEstimate.totalCost.toFixed(4)}`
      );

      // Update job to queued with metadata
      await supabase
        .from('studio_jobs')
        .update({
          status: 'queued',
          prediction_id: predictionId,
          started_at: new Date().toISOString(),
          metadata: {
            ...job.metadata,
            mode: 'simple',
            model: modelId,
            version,
            seed,
            ppi,
            target_dims: { w: targetW, h: targetH },
            gen_dims: { w: nearest.w, h: nearest.h },
            ar_label: nearest.label,
            steps,
            guidance,
            style,
            prompt,
            negative,
            cost_estimate: costEstimate.totalCost,
            enqueue_duration: enqueueDuration
          }
        })
        .eq('id', job_id);

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, prediction_id: predictionId, mode: 'simple' })
      };

    } else {
      // === MULTI-PASS MODE: Stencil-based pipeline (Original) ===
      console.log('[ENQUEUE] Using multi-pass mode (original pipeline)');

      

      // Step 1: Generate stencil (2s)
      const { stencilUrl, metadata } = await generateAndUploadStencil({
        ...job,
        jobId: job_id
      });

      // Step 2: Build Replicate input
      const input = buildReplicateInput(job, stencilUrl, metadata);

      // Step 3: Create prediction with webhook
      const webhookUrl = `${process.env.PUBLIC_BASE_URL}/.netlify/functions/replicate-callback?token=${encodeURIComponent(process.env.REPLICATE_WEBHOOK_SECRET)}`;

      const predictionResponse = await fetch(REPLICATE_API, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: SDXL_VERSION,
          input,
          webhook: webhookUrl,
          webhook_events_filter: ['start', 'completed']
        })
      });

      if (!predictionResponse.ok) {
        const errorData = await predictionResponse.json();
        throw new Error(`Replicate API error: ${JSON.stringify(errorData)}`);
      }

      const prediction = await predictionResponse.json();
      console.log(`[ENQUEUE] Prediction created: ${prediction.id}`);

      // Step 4: Update job to queued
      await supabase
        .from('studio_jobs')
        .update({
          status: 'queued',
          prediction_id: prediction.id,
          started_at: new Date().toISOString(),
          metadata: {
            ...job.metadata,
            ...metadata,
            mode: 'multi_pass',
            prediction_url: prediction.urls?.get
          }
        })
        .eq('id', job_id);

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, prediction_id: prediction.id, mode: 'multi_pass' })
      };
    }

  } catch (error) {
    console.error('[ENQUEUE ERROR]', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
