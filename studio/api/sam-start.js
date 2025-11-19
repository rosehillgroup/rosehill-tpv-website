// Vercel Serverless Function: Start SAM-2 Mask Generation Job
// POST /api/sam-start
// Creates async job and returns immediately

import Replicate from 'replicate';
import sharp from 'sharp';
import { getSupabaseServiceClient, getAuthenticatedClient } from './_utils/supabase.js';
import { randomUUID } from 'crypto';

// Maximum dimension for SAM-2 input (for performance)
const MAX_IMAGE_DIMENSION = 512;

/**
 * Initialize Replicate client
 */
function getReplicateClient() {
  const apiKey = process.env.REPLICATE_API_TOKEN;
  if (!apiKey) {
    throw new Error('REPLICATE_API_TOKEN environment variable not set');
  }
  return new Replicate({ auth: apiKey });
}

/**
 * Downscale image to max dimension while preserving aspect ratio
 */
async function downscaleImage(imageBuffer) {
  const metadata = await sharp(imageBuffer).metadata();
  const { width, height } = metadata;

  const maxDim = Math.max(width, height);
  if (maxDim <= MAX_IMAGE_DIMENSION) {
    return {
      buffer: imageBuffer,
      scale: 1,
      width,
      height
    };
  }

  const scale = MAX_IMAGE_DIMENSION / maxDim;
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);

  const resizedBuffer = await sharp(imageBuffer)
    .resize(newWidth, newHeight, { fit: 'inside' })
    .jpeg({ quality: 90 })
    .toBuffer();

  return {
    buffer: resizedBuffer,
    scale,
    width: newWidth,
    height: newHeight
  };
}

/**
 * Convert image buffer to data URL for Replicate
 */
function bufferToDataUrl(buffer) {
  const base64 = buffer.toString('base64');
  return `data:image/jpeg;base64,${base64}`;
}

/**
 * Scale points from original image coordinates to downscaled coordinates
 */
function scalePoints(points, scale) {
  if (!points || points.length === 0) return [];
  return points.map(([x, y]) => [
    Math.round(x * scale),
    Math.round(y * scale)
  ]);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    // Get authenticated user
    const { user } = await getAuthenticatedClient(req);

    const {
      image_url,
      positive_points = [],
      negative_points = [],
      auto_detect = false
    } = req.body;

    // Validate required fields
    if (!image_url) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: image_url'
      });
    }

    // Validate URL origin (prevent SSRF)
    const allowedOrigins = [
      'data:',
      process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).origin : null
    ].filter(Boolean);

    const isAllowedUrl = allowedOrigins.some(origin => image_url.startsWith(origin));
    if (!isAllowedUrl) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image URL: must be from Supabase storage'
      });
    }

    console.log('[SAM-START] Starting job creation');
    console.log('[SAM-START] Positive points:', positive_points.length);
    console.log('[SAM-START] Negative points:', negative_points.length);
    console.log('[SAM-START] Auto-detect:', auto_detect);

    // Generate job ID
    const jobId = randomUUID();

    // Initialize Supabase
    const supabase = getSupabaseServiceClient();

    // Fetch and downscale image
    console.log('[SAM-START] Fetching image...');
    const imageResponse = await fetch(image_url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const { buffer: scaledBuffer, scale, width, height } = await downscaleImage(imageBuffer);

    console.log(`[SAM-START] Image scaled: ${width}x${height} (scale: ${scale.toFixed(3)})`);

    // Convert to data URL for Replicate
    const imageDataUrl = bufferToDataUrl(scaledBuffer);

    // Scale points to match downscaled image
    const scaledPositivePoints = scalePoints(positive_points, scale);
    const scaledNegativePoints = scalePoints(negative_points, scale);

    // Create job record
    const jobData = {
      id: jobId,
      user_id: user?.id || null,
      status: 'pending',
      image_url,
      positive_points: scaledPositivePoints,
      negative_points: scaledNegativePoints,
      auto_detect,
      scale_factor: scale,
      original_dimensions: {
        width: Math.round(width / scale),
        height: Math.round(height / scale)
      },
      scaled_dimensions: { width, height },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: insertError } = await supabase
      .from('sam_jobs')
      .insert([jobData]);

    if (insertError) {
      console.error('[SAM-START] Failed to create job:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create job record',
        details: insertError.message
      });
    }

    // Build webhook URL
    const baseUrl = (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');
    const webhookToken = process.env.REPLICATE_WEBHOOK_SECRET;

    if (!baseUrl || !webhookToken) {
      console.error('[SAM-START] Missing PUBLIC_BASE_URL or REPLICATE_WEBHOOK_SECRET');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    const webhookUrl = `${baseUrl}/api/sam-callback?token=${webhookToken}&jobId=${jobId}`;

    // Initialize Replicate client
    const replicate = getReplicateClient();
    // SAM-2 version hash (from meta/sam-2:...)
    const versionId = 'fe97b453a6455861e3bac769b441ca1f1086110da7466dbb65cf1eecfd60dc83';

    // Build SAM-2 input
    const input = {
      image: imageDataUrl,
      multimask_output: false,
      return_logits: false
    };

    // Add point prompts
    if (scaledPositivePoints.length > 0 || scaledNegativePoints.length > 0) {
      const allPoints = [...scaledPositivePoints, ...scaledNegativePoints];
      const pointLabels = [
        ...scaledPositivePoints.map(() => 1),
        ...scaledNegativePoints.map(() => 0)
      ];

      if (allPoints.length > 0) {
        input.point_coords = allPoints;
        input.point_labels = pointLabels;
      }
    } else if (auto_detect) {
      // Auto-place point at bottom-center
      const autoPoint = [Math.round(width / 2), Math.round(height * 0.75)];
      input.point_coords = [autoPoint];
      input.point_labels = [1];
      console.log('[SAM-START] Auto-detect point:', autoPoint);
    }

    // Create prediction with webhook
    console.log('[SAM-START] Calling Replicate...');
    const prediction = await replicate.predictions.create({
      version: versionId,
      input,
      webhook: webhookUrl,
      webhook_events_filter: ['completed']
    });

    console.log(`[SAM-START] Prediction created: ${prediction.id}`);

    // Update job with prediction ID
    await supabase
      .from('sam_jobs')
      .update({
        prediction_id: prediction.id,
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    return res.status(200).json({
      success: true,
      jobId,
      status: 'processing',
      predictionId: prediction.id
    });

  } catch (error) {
    console.error('[SAM-START] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  },
  maxDuration: 15 // Short timeout - just creates job
};
