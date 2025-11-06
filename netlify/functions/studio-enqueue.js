// TPV Studio - Enqueue Job
// Generates stencil and starts Replicate prediction with webhook

import { getSupabaseServiceClient } from './studio/_utils/supabase.js';
import { generateAndUploadStencil, buildReplicateInput } from './studio/_utils/preprocessing.js';

const REPLICATE_API = 'https://api.replicate.com/v1/predictions';
const SDXL_VERSION = '39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b'; // stable-diffusion-xl-1024-v1-0

exports.handler = async function(event, context) {
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
          prediction_url: prediction.urls?.get
        }
      })
      .eq('id', job_id);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, prediction_id: prediction.id })
    };

  } catch (error) {
    console.error('[ENQUEUE ERROR]', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
