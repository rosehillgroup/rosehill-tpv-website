// TPV Studio - Create Simple Mode Job
// Creates a studio_jobs entry and triggers enqueue function

import { getSupabaseServiceClient } from './studio/_utils/supabase.js';

export const handler = async (event, context) => {
  // Dynamic import of ESM utilities
  

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { prompt, style, surface } = JSON.parse(event.body || '{}');

    if (!prompt || !prompt.trim()) {
      throw new Error('Prompt is required');
    }

    const supabase = getSupabaseServiceClient();

    // Create job in studio_jobs table
    const surfaceData = surface || { width_m: 10, height_m: 10 };

    const { data: job, error: insertError } = await supabase
      .from('studio_jobs')
      .insert({
        status: 'pending',
        prompt: prompt.trim(),
        style: style || 'playful_flat',
        surface: surfaceData, // Required NOT NULL column
        metadata: {
          mode: 'simple',
          surface: surfaceData,
          created_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log(`[INSPIRE-SIMPLE] Created job ${job.id}`);

    // Trigger enqueue function
    const enqueueUrl = `${process.env.PUBLIC_BASE_URL}/.netlify/functions/studio-enqueue`;
    const enqueueResponse = await fetch(enqueueUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ job_id: job.id })
    });

    if (!enqueueResponse.ok) {
      const errorData = await enqueueResponse.json();
      throw new Error(`Enqueue failed: ${errorData.error || 'Unknown error'}`);
    }

    const enqueueResult = await enqueueResponse.json();
    console.log(`[INSPIRE-SIMPLE] Enqueued job ${job.id}:`, enqueueResult);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ok: true,
        jobId: job.id,
        estimatedDuration: 30 // Simple mode ~20-40s
      })
    };

  } catch (error) {
    console.error('[INSPIRE-SIMPLE ERROR]', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
