// TPV Studio - Create Simple Mode Job (Vercel)
// Creates a studio_jobs entry and triggers enqueue function

import { getSupabaseServiceClient } from './_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, surface, max_colours, try_simpler, seed } = req.body || {};

    if (!prompt || !prompt.trim()) {
      throw new Error('Prompt is required');
    }

    const supabase = getSupabaseServiceClient();

    // Create job in studio_jobs table
    const surfaceData = surface || { width_mm: 5000, height_mm: 5000 };
    const maxColours = max_colours || 6;
    const trySimpler = try_simpler || false;

    const { data: job, error: insertError } = await supabase
      .from('studio_jobs')
      .insert({
        status: 'pending',
        prompt: prompt.trim(),
        surface: surfaceData, // Required NOT NULL column
        max_colours: maxColours,
        try_simpler: trySimpler,
        metadata: {
          mode: 'flux_dev',
          surface: surfaceData,
          seed: seed, // Pass seed from frontend if provided
          created_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log(`[INSPIRE-SIMPLE] Created Flux Dev job ${job.id} (max_colours=${maxColours}, try_simpler=${trySimpler})`);

    // Trigger enqueue function
    const enqueueUrl = `${process.env.PUBLIC_BASE_URL}/api/studio-enqueue`;
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

    return res.status(200).json({
      ok: true,
      jobId: job.id,
      estimatedDuration: 30 // Simple mode ~20-40s
    });

  } catch (error) {
    console.error('[INSPIRE-SIMPLE ERROR]', error);
    return res.status(500).json({ error: error.message });
  }
}
