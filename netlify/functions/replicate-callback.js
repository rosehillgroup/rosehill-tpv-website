// TPV Studio - Replicate Webhook Callback
// Processes completed predictions and updates job status

exports.handler = async (event, context) => {
  // Dynamic import of ESM utilities
  const { getSupabaseServiceClient } = await import('./studio/_utils/supabase.mjs');
  const { downloadImage } = await import('./studio/_utils/replicate.mjs');
  const { clampToTPVPalette, autoRankConcepts } = await import('./studio/_utils/postprocess.mjs');
  const { uploadToStorage } = await import('./studio/_utils/exports.mjs');
  try {
    // Verify webhook token
    const token = event.queryStringParameters?.token;
    if (token !== process.env.REPLICATE_WEBHOOK_SECRET) {
      console.error('[WEBHOOK] Invalid token');
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const body = JSON.parse(event.body || '{}');
    const { id: prediction_id, status, output, error: predictionError } = body;

    console.log(`[WEBHOOK] Received: ${prediction_id}, status: ${status}`);

    const supabase = getSupabaseServiceClient();

    // Find job by prediction_id
    const { data: job, error: fetchError } = await supabase
      .from('studio_jobs')
      .select('*')
      .eq('prediction_id', prediction_id)
      .single();

    if (fetchError || !job) {
      console.error('[WEBHOOK] Job not found for prediction:', prediction_id);
      return { statusCode: 200, body: 'Job not found' };
    }

    // Handle status transitions
    if (status === 'starting') {
      await supabase
        .from('studio_jobs')
        .update({ status: 'running' })
        .eq('id', job.id);

      return { statusCode: 200, body: 'Running' };
    }

    if (status === 'succeeded' && output) {
      console.log(`[WEBHOOK] Processing ${output.length} outputs for job ${job.id}`);

      // Post-process: download, clamp, rank, upload
      const conceptBuffers = [];

      for (let i = 0; i < output.length; i++) {
        try {
          const originalBuffer = await downloadImage(output[i]);
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
          console.error(`[WEBHOOK] Failed to process output ${i}:`, err);
        }
      }

      const rankedConcepts = await autoRankConcepts(conceptBuffers);

      // Upload final concepts
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
          concepts // Keep for backward compatibility
        })
        .eq('id', job.id);

      console.log(`[WEBHOOK] Job ${job.id} completed with ${concepts.length} concepts`);
      return { statusCode: 200, body: 'Completed' };
    }

    if (status === 'failed' || predictionError) {
      await supabase
        .from('studio_jobs')
        .update({
          status: 'failed',
          error: predictionError || 'Prediction failed'
        })
        .eq('id', job.id);

      return { statusCode: 200, body: 'Failed' };
    }

    return { statusCode: 200, body: 'OK' };

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return { statusCode: 500, body: error.message };
  }
};
