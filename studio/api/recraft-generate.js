// Vercel Serverless Function: Generate Vector Design with Recraft
// POST /api/recraft-generate
// Replaces both AI mode (Flux) and Geometric mode with Recraft vector generation

import { getSupabaseServiceClient, getAuthenticatedClient } from './_utils/supabase.js';
import { generateRecraftSvg } from './_utils/recraft/client.js';
import { randomUUID } from 'crypto';

/**
 * Generate vector design using Recraft AI
 *
 * Request body:
 * {
 *   prompt: string,             // User's design description
 *   width_mm: number,           // Surface width in millimeters
 *   length_mm: number,          // Surface height in millimeters
 *   max_colours?: number,       // Maximum colors (3-8, default: 6)
 *   seed?: number               // Optional seed for reproducibility
 * }
 *
 * Response:
 * {
 *   success: true,
 *   jobId: string,
 *   status: 'pending',
 *   estimatedDuration: number  // seconds
 * }
 */
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    // Get authenticated user (if available)
    const { user } = await getAuthenticatedClient(req);

    const {
      prompt,
      width_mm,
      length_mm,
      seed = null
    } = req.body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid "prompt" field'
      });
    }

    if (!width_mm || typeof width_mm !== 'number' || width_mm <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid "width_mm" field (must be positive number)'
      });
    }

    if (!length_mm || typeof length_mm !== 'number' || length_mm <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid "length_mm" field (must be positive number)'
      });
    }

    console.log('[RECRAFT-GENERATE] New request:', {
      prompt: prompt.substring(0, 100) + '...',
      dimensions: `${width_mm}mm x ${length_mm}mm`,
      seed
    });

    // Generate job ID (UUID format required by Supabase)
    const jobId = randomUUID();

    // Initialize Supabase client
    const supabase = getSupabaseServiceClient();

    // Create job record
    const jobData = {
      id: jobId,
      mode_type: 'recraft_vector',
      status: 'pending',
      prompt: prompt,
      user_id: user?.id || null, // Track which user created this job
      surface: {
        width_mm,
        height_mm: length_mm
      },
      width_mm,
      length_mm,
      attempt_current: 0,
      attempt_max: 1, // Single generation - user can click "Simplify" to regenerate
      validation_history: [],
      compliant: null,
      all_attempt_urls: [],
      inspector_final_reasons: [],
      metadata: {
        seed: seed || Math.floor(Math.random() * 1000000),
        user_provided_seed: seed !== null,
        created_at: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: insertError } = await supabase
      .from('studio_jobs')
      .insert([jobData]);

    if (insertError) {
      console.error('[RECRAFT-GENERATE] Failed to create job:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create job record',
        details: insertError.message
      });
    }

    console.log(`[RECRAFT-GENERATE] Job created: ${jobId}`);

    // Build webhook URL
    const baseUrl = (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, ''); // Remove trailing slash
    const webhookToken = process.env.REPLICATE_WEBHOOK_SECRET;

    if (!baseUrl || !webhookToken) {
      console.error('[RECRAFT-GENERATE] Missing PUBLIC_BASE_URL or REPLICATE_WEBHOOK_SECRET');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    const webhookUrl = `${baseUrl}/api/replicate-callback?token=${webhookToken}`;

    // Call Recraft via Replicate
    try {
      const prediction = await generateRecraftSvg({
        prompt,
        width_mm,
        length_mm,
        seed: jobData.metadata.seed,
        correction: null, // First attempt, no correction
        webhook: webhookUrl,
        jobId
      });

      console.log(`[RECRAFT-GENERATE] Recraft prediction created: ${prediction.predictionId}`);

      // Update job with prediction ID and status
      const { error: updateError } = await supabase
        .from('studio_jobs')
        .update({
          status: 'queued',
          prediction_id: prediction.predictionId, // Top-level for webhook lookup
          metadata: {
            ...jobData.metadata,
            prediction_id: prediction.predictionId,
            prediction_status: prediction.status,
            model: prediction.model
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (updateError) {
        console.error('[RECRAFT-GENERATE] Failed to update job:', updateError);
        // Don't fail the request, prediction is already running
      }

      // Return success response
      return res.status(200).json({
        success: true,
        jobId,
        status: 'pending',
        predictionId: prediction.predictionId,
        estimatedDuration: 30 // Recraft typically takes 20-40 seconds
      });
    } catch (replicateError) {
      console.error('[RECRAFT-GENERATE] Replicate call failed:', replicateError.message);

      // Update job as failed
      await supabase
        .from('studio_jobs')
        .update({
          status: 'failed',
          error: replicateError.message,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      return res.status(500).json({
        success: false,
        error: 'Failed to start Recraft generation',
        details: replicateError.message,
        jobId // Return jobId so user can check status
      });
    }
  } catch (error) {
    console.error('[RECRAFT-GENERATE] Unexpected error:', error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Export config for larger payloads
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  }
};
