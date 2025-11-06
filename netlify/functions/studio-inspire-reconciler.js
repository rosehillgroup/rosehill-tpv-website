// TPV Studio - Inspire Reconciler
// Rescues stuck jobs by checking Replicate status
// Runs as backup safety net (e.g., every 1 minute via cron)

const REPLICATE_API = 'https://api.replicate.com/v1/predictions';
const STUCK_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

exports.handler = async(event, context) => {
  // Dynamic import of ESM utilities
  const { getSupabaseServiceClient } = await import('./studio/_utils/supabase.mjs');
  const { downloadImage } = await import('./studio/_utils/replicate.mjs');
  const { clampToTPVPalette, autoRankConcepts } = await import('./studio/_utils/postprocess.mjs');
  const { uploadToStorage } = await import('./studio/_utils/exports.mjs');

  try {
    console.log('[RECONCILER] Starting reconciliation check...');

    const supabase = getSupabaseServiceClient();

    // Find stuck jobs (queued/running, older than 5 minutes)
    const stuckThreshold = new Date(Date.now() - STUCK_THRESHOLD_MS).toISOString();

    const { data: stuckJobs, error } = await supabase
      .from('studio_jobs')
      .select('*')
      .in('status', ['queued', 'running'])
      .lt('created_at', stuckThreshold)
      .limit(5);

    if (error) throw error;

    if (!stuckJobs || stuckJobs.length === 0) {
      console.log('[RECONCILER] No stuck jobs found');
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, message: 'No stuck jobs' })
      };
    }

    console.log(`[RECONCILER] Found ${stuckJobs.length} stuck jobs`);

    const results = [];

    for (const job of stuckJobs) {
      try {
        console.log(`[RECONCILER] Checking job ${job.id}, prediction ${job.prediction_id}`);

        if (!job.prediction_id) {
          // Job stuck in 'queued' without prediction_id - mark as failed
          await supabase
            .from('studio_jobs')
            .update({
              status: 'failed',
              error: 'No prediction ID generated'
            })
            .eq('id', job.id);

          results.push({ job_id: job.id, action: 'marked_failed', reason: 'no_prediction_id' });
          continue;
        }

        // Query Replicate API
        const predictionUrl = `${REPLICATE_API}/${job.prediction_id}`;
        const response = await fetch(predictionUrl, {
          headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` }
        });

        if (!response.ok) {
          console.error(`[RECONCILER] Replicate API error for ${job.prediction_id}:`, response.statusText);
          results.push({ job_id: job.id, action: 'skipped', reason: 'api_error' });
          continue;
        }

        const prediction = await response.json();
        console.log(`[RECONCILER] Replicate status: ${prediction.status}`);

        // Update job to match Replicate status
        if (prediction.status === 'succeeded' && prediction.output) {
          console.log(`[RECONCILER] Processing outputs for job ${job.id}`);

          // Process outputs like webhook would
          const conceptBuffers = [];

          for (let i = 0; i < prediction.output.length; i++) {
            try {
              const originalBuffer = await downloadImage(prediction.output[i]);
              const targetPalette = job.metadata?.targetPalette || [];
              const quantizedBuffer = await clampToTPVPalette(originalBuffer, targetPalette);

              conceptBuffers.push({
                id: `concept_${job.id}_${i}`,
                buffer: quantizedBuffer,
                originalBuffer,
                palette: targetPalette,
                index: i
              });
            } catch (err) {
              console.error(`[RECONCILER] Failed to process output ${i}:`, err);
            }
          }

          const rankedConcepts = await autoRankConcepts(conceptBuffers);

          // Upload concepts
          const concepts = [];
          for (const concept of rankedConcepts) {
            const quantizedUrl = await uploadToStorage(
              concept.buffer,
              `${concept.id}_quantized.png`,
              'tpv-studio'
            );

            const originalUrl = await uploadToStorage(
              concept.originalBuffer,
              `${concept.id}_original.png`,
              'tpv-studio'
            );

            concepts.push({
              id: concept.id,
              originalUrl,
              quantizedUrl,
              quality: concept.quality,
              index: concept.index
            });
          }

          await supabase
            .from('studio_jobs')
            .update({
              status: 'completed',
              outputs: { concepts },
              concepts
            })
            .eq('id', job.id);

          results.push({ job_id: job.id, action: 'completed', concepts: concepts.length });

        } else if (prediction.status === 'failed') {
          await supabase
            .from('studio_jobs')
            .update({
              status: 'failed',
              error: prediction.error || 'Prediction failed'
            })
            .eq('id', job.id);

          results.push({ job_id: job.id, action: 'marked_failed', reason: prediction.error });

        } else if (prediction.status === 'starting') {
          await supabase
            .from('studio_jobs')
            .update({ status: 'running' })
            .eq('id', job.id);

          results.push({ job_id: job.id, action: 'updated_to_running' });

        } else {
          // Still processing, leave it alone
          results.push({ job_id: job.id, action: 'still_processing', status: prediction.status });
        }

      } catch (err) {
        console.error(`[RECONCILER] Error processing job ${job.id}:`, err);
        results.push({ job_id: job.id, action: 'error', message: err.message });
      }
    }

    console.log('[RECONCILER] Reconciliation complete');

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        checked: stuckJobs.length,
        results
      })
    };

  } catch (error) {
    console.error('[RECONCILER ERROR]', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
