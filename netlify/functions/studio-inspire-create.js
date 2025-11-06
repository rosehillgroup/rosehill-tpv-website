// TPV Studio 2.0 - Create Inspire Job (Async)
// Creates a pending job record and returns immediately (no timeout)
// Background worker picks up pending jobs and processes them

/**
 * Create Inspire Job Handler
 * POST /api/studio/inspire/create
 *
 * Request body:
 * {
 *   prompt: string,
 *   surface: {width_m, height_m},
 *   paletteColors: [{code, hex, name}] | null,
 *   style: string,
 *   count: number
 * }
 *
 * Response:
 * {
 *   jobId: string,
 *   status: 'pending',
 *   statusUrl: string,
 *   estimatedDuration: number (seconds)
 * }
 */
exports.handler = async (event, context) => {
  // Dynamic import of ESM utilities
  const { getSupabaseServiceClient } = await import('./studio/_utils/supabase.mjs');

  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request
    const request = JSON.parse(event.body);
    const {
      prompt,
      surface = { width_m: 10, height_m: 3 },
      paletteColors = null,
      style = 'professional',
      count = 6
    } = request;

    // Validate
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    if (count < 1 || count > 12) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Count must be between 1 and 12' })
      };
    }

    console.log('[INSPIRE-CREATE] Creating job...');
    console.log('[INSPIRE-CREATE] Prompt:', prompt);
    console.log('[INSPIRE-CREATE] Surface:', `${surface.width_m}m x ${surface.height_m}m`);
    console.log('[INSPIRE-CREATE] Style:', style);
    console.log('[INSPIRE-CREATE] Count:', count);

    // Create job record in database
    const supabase = getSupabaseServiceClient();

    const { data: job, error } = await supabase
      .from('studio_jobs')
      .insert({
        prompt: prompt.trim(),
        surface,
        palette_colors: paletteColors,
        style,
        count,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('[INSPIRE-CREATE] Database error:', error);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Failed to create job',
          message: error.message
        })
      };
    }

    console.log('[INSPIRE-CREATE] Job created:', job.id);

    // Fire-and-forget: Trigger enqueue function in background
    const enqueueUrl = `${process.env.PUBLIC_BASE_URL || 'https://tpv.rosehill.group'}/.netlify/functions/studio-enqueue`;
    fetch(enqueueUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: job.id })
    }).catch(err => console.error('[INSPIRE-CREATE] Enqueue trigger failed:', err.message));

    // Build status URL
    const statusUrl = `/.netlify/functions/studio-inspire-status?jobId=${job.id}`;

    // Estimate duration (SDXL: ~4s per concept)
    const estimatedDuration = Math.ceil(count * 4 + 10); // +10s for stencil generation

    // Return job ID immediately (no waiting)
    return {
      statusCode: 202, // Accepted
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify({
        jobId: job.id,
        status: 'pending',
        statusUrl,
        estimatedDuration,
        message: 'Job created. Poll statusUrl for results.'
      })
    };

  } catch (error) {
    console.error('[INSPIRE-CREATE] Error:', error);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Job creation failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
