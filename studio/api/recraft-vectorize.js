// Vercel Serverless Function: Vectorize Raster Image with Recraft
// POST /api/recraft-vectorize
// Converts uploaded PNG/JPG to SVG using Recraft AI

import { getSupabaseServiceClient, getAuthenticatedClient } from './_utils/supabase.js';
import { vectorizeImage } from './_utils/recraft/vectorize-client.js';
import { randomUUID } from 'crypto';
import { checkRateLimit, getRateLimitResponse, getRateLimitIdentifier } from './_utils/rateLimit.js';

/**
 * Vectorize raster image using Recraft AI
 *
 * Request body:
 * {
 *   image_url: string,           // URL to uploaded raster image (PNG/JPG)
 *   width_mm: number,            // Surface width in millimeters
 *   length_mm: number,           // Surface height in millimeters
 *   seed?: number                // Optional seed (not used by vectorize model)
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
    // Get authenticated user (REQUIRED for expensive AI operations)
    const { user } = await getAuthenticatedClient(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in to vectorize images.'
      });
    }

    // Check rate limit
    const identifier = getRateLimitIdentifier(req, user);
    const rateLimitCheck = await checkRateLimit(identifier, '/api/recraft-vectorize');

    if (!rateLimitCheck.allowed) {
      return res.status(429).json(
        getRateLimitResponse(rateLimitCheck.limit, rateLimitCheck.remaining, rateLimitCheck.reset)
      );
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', rateLimitCheck.limit.toString());
    res.setHeader('X-RateLimit-Remaining', rateLimitCheck.remaining.toString());
    res.setHeader('X-RateLimit-Reset', rateLimitCheck.reset.toString());

    const {
      image_url,
      width_mm,
      length_mm,
      seed = null
    } = req.body;

    // Validate required fields
    if (!image_url || typeof image_url !== 'string' || !image_url.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid "image_url" field'
      });
    }

    // SECURITY: Validate URL origin to prevent SSRF attacks
    // Use proper URL parsing instead of string includes()
    const allowedOrigins = [
      process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).origin : null
    ].filter(Boolean);

    let isAllowedUrl = false;
    try {
      const parsedUrl = new URL(image_url);
      // Check if origin matches an allowed origin
      isAllowedUrl = allowedOrigins.some(origin => parsedUrl.origin === origin);
      // Also check for Supabase storage path
      if (!isAllowedUrl && parsedUrl.hostname.endsWith('.supabase.co') && parsedUrl.pathname.includes('/storage/')) {
        isAllowedUrl = true;
      }
    } catch {
      // Invalid URL format
      isAllowedUrl = false;
    }

    if (!isAllowedUrl) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image URL: must be from allowed origin (Supabase storage)'
      });
    }

    // Dimensions are optional - they're only used for tracking/metadata, not vectorization
    if (width_mm !== undefined && (typeof width_mm !== 'number' || width_mm <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid "width_mm" field (must be positive number if provided)'
      });
    }

    if (length_mm !== undefined && (typeof length_mm !== 'number' || length_mm <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid "length_mm" field (must be positive number if provided)'
      });
    }

    console.log('[RECRAFT-VECTORIZE] New request:', {
      imageUrl: image_url,
      dimensions: width_mm && length_mm ? `${width_mm}mm x ${length_mm}mm` : 'Not specified',
      seed
    });

    // Generate job ID (UUID format required by Supabase)
    const jobId = randomUUID();

    // Initialize Supabase client
    const supabase = getSupabaseServiceClient();

    // Create job record
    const jobData = {
      id: jobId,
      mode_type: 'recraft_vectorize',
      status: 'pending',
      prompt: `Vectorized from uploaded image: ${image_url.split('/').pop()}`,
      user_id: user?.id || null, // Track which user created this job
      surface: {
        width_mm,
        height_mm: length_mm
      },
      width_mm,
      length_mm,
      attempt_current: 0,
      attempt_max: 1, // Single vectorization attempt
      validation_history: [],
      compliant: null,
      all_attempt_urls: [],
      inspector_final_reasons: [],
      metadata: {
        source_image_url: image_url,
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
      console.error('[RECRAFT-VECTORIZE] Failed to create job:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create job record',
        details: insertError.message
      });
    }

    console.log(`[RECRAFT-VECTORIZE] Job created: ${jobId}`);

    // Build webhook URL
    const baseUrl = (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, ''); // Remove trailing slash
    const webhookToken = process.env.REPLICATE_WEBHOOK_SECRET;

    if (!baseUrl || !webhookToken) {
      console.error('[RECRAFT-VECTORIZE] Missing PUBLIC_BASE_URL or REPLICATE_WEBHOOK_SECRET');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    const webhookUrl = `${baseUrl}/api/replicate-callback?token=${webhookToken}`;

    // Call Recraft Vectorize via Replicate
    try {
      const prediction = await vectorizeImage({
        imageUrl: image_url,
        webhook: webhookUrl,
        jobId
      });

      console.log(`[RECRAFT-VECTORIZE] Prediction created: ${prediction.predictionId}`);

      // Store prediction ID (at top level for webhook lookup)
      await supabase
        .from('studio_jobs')
        .update({
          prediction_id: prediction.predictionId, // Top-level for webhook
          metadata: {
            ...jobData.metadata,
            prediction_id: prediction.predictionId,
            prediction_status: prediction.status
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      // Return success with job ID
      return res.status(200).json({
        success: true,
        jobId,
        status: 'pending',
        predictionId: prediction.predictionId,
        estimatedDuration: 60 // Vectorization typically takes ~30-90 seconds
      });

    } catch (replicateError) {
      console.error('[RECRAFT-VECTORIZE] Replicate error:', replicateError);

      // Update job status to failed
      await supabase
        .from('studio_jobs')
        .update({
          status: 'failed',
          error_message: replicateError.message || 'Failed to start vectorization',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      return res.status(500).json({
        success: false,
        error: 'Failed to start vectorization',
        details: replicateError.message,
        jobId
      });
    }

  } catch (error) {
    console.error('[RECRAFT-VECTORIZE] Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}
