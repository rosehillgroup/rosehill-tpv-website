// Vercel Serverless Function: SAM-2 Webhook Callback
// Handles Replicate webhook when SAM-2 completes

import { getSupabaseServiceClient } from './_utils/supabase.js';

export default async function handler(req, res) {
  try {
    // Verify webhook token
    const token = req.query?.token;
    const jobId = req.query?.jobId;

    if (!token || token !== process.env.REPLICATE_WEBHOOK_SECRET) {
      console.error('[SAM-CALLBACK] Invalid or missing token');
      return res.status(401).send('Unauthorized');
    }

    if (!jobId) {
      console.error('[SAM-CALLBACK] Missing jobId');
      return res.status(400).send('Missing jobId');
    }

    const payload = req.body;
    const { id: predictionId, status, output, error: predictionError } = payload;

    console.log(`[SAM-CALLBACK] Received: ${predictionId}, status: ${status}, jobId: ${jobId}`);

    const supabase = getSupabaseServiceClient();

    // Find job
    const { data: job, error: fetchError } = await supabase
      .from('sam_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (fetchError || !job) {
      console.error('[SAM-CALLBACK] Job not found:', jobId);
      return res.status(200).send('Job not found');
    }

    // Check idempotency - don't process if already completed
    if (job.status === 'completed' || job.status === 'failed') {
      console.log('[SAM-CALLBACK] Job already processed, skipping');
      return res.status(200).send('Already processed');
    }

    // Handle failure
    if (status === 'failed' || predictionError) {
      console.error('[SAM-CALLBACK] Prediction failed:', predictionError);

      await supabase
        .from('sam_jobs')
        .update({
          status: 'failed',
          error: predictionError || 'Unknown error',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      return res.status(200).send('Failure recorded');
    }

    // Handle success
    if (status === 'succeeded' && output) {
      console.log('[SAM-CALLBACK] Processing successful output');

      // Extract mask URL from output
      let maskUrl;

      if (output.combined_mask) {
        maskUrl = output.combined_mask;
      } else if (output.individual_masks && output.individual_masks.length > 0) {
        maskUrl = output.individual_masks[0];
      } else if (Array.isArray(output)) {
        maskUrl = output[0];
      } else if (typeof output === 'string') {
        maskUrl = output;
      } else {
        console.error('[SAM-CALLBACK] Unexpected output format:', output);

        await supabase
          .from('sam_jobs')
          .update({
            status: 'failed',
            error: 'Unexpected output format from SAM-2',
            updated_at: new Date().toISOString()
          })
          .eq('id', jobId);

        return res.status(200).send('Invalid output');
      }

      console.log('[SAM-CALLBACK] Mask URL:', maskUrl);

      // Update job as completed
      await supabase
        .from('sam_jobs')
        .update({
          status: 'completed',
          mask_url: maskUrl,
          mask_dimensions: job.scaled_dimensions,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      console.log('[SAM-CALLBACK] Job completed successfully');
      return res.status(200).send('Success');
    }

    // Other status (processing, etc.)
    console.log('[SAM-CALLBACK] Unhandled status:', status);
    return res.status(200).send('OK');

  } catch (error) {
    console.error('[SAM-CALLBACK] Error:', error);
    return res.status(500).send('Internal error');
  }
}

export const config = {
  api: {
    bodyParser: true
  },
  maxDuration: 10 // Short - just updates database
};
