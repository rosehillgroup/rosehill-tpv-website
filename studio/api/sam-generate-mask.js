// Vercel Serverless Function: Generate Floor Mask with SAM-2
// POST /api/sam-generate-mask
// Uses Meta's SAM-2 via Replicate for interactive floor segmentation

import Replicate from 'replicate';
import sharp from 'sharp';
import { getAuthenticatedClient } from './_utils/supabase.js';

// Maximum dimension for SAM-2 input (for performance)
const MAX_IMAGE_DIMENSION = 1024;

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
 * @param {Buffer} imageBuffer - Original image buffer
 * @returns {Promise<{buffer: Buffer, scale: number, width: number, height: number}>}
 */
async function downscaleImage(imageBuffer) {
  const metadata = await sharp(imageBuffer).metadata();
  const { width, height } = metadata;

  // Calculate scale factor
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
 * @param {Buffer} buffer - Image buffer
 * @returns {string} Data URL
 */
function bufferToDataUrl(buffer) {
  const base64 = buffer.toString('base64');
  return `data:image/jpeg;base64,${base64}`;
}

/**
 * Scale points from original image coordinates to downscaled coordinates
 * @param {Array<[number, number]>} points - Points in original coordinates
 * @param {number} scale - Scale factor applied to image
 * @returns {Array<[number, number]>} Scaled points
 */
function scalePoints(points, scale) {
  if (!points || points.length === 0) return [];
  return points.map(([x, y]) => [
    Math.round(x * scale),
    Math.round(y * scale)
  ]);
}

/**
 * Generate floor mask using SAM-2 via Replicate
 *
 * Request body:
 * {
 *   image_url: string,                    // URL of site photo (Supabase storage)
 *   positive_points: [[x,y], ...],        // Points on floor (click)
 *   negative_points: [[x,y], ...],        // Points not on floor (alt+click)
 *   auto_detect?: boolean                 // If true, run initial detection with no points
 * }
 *
 * Response:
 * {
 *   success: true,
 *   mask_url: string,                     // URL of generated mask
 *   mask_dimensions: { width, height },   // Mask dimensions
 *   preview_overlay_url?: string          // Optional preview with mask overlay
 * }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    // Get authenticated user (optional for this endpoint)
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
      console.error('[SAM-MASK] Blocked URL:', image_url.substring(0, 100));
      return res.status(400).json({
        success: false,
        error: 'Invalid image URL: must be from Supabase storage'
      });
    }

    console.log('[SAM-MASK] Starting mask generation');
    console.log('[SAM-MASK] Image URL:', image_url.substring(0, 100) + '...');
    console.log('[SAM-MASK] Positive points:', positive_points.length);
    console.log('[SAM-MASK] Negative points:', negative_points.length);
    console.log('[SAM-MASK] Auto-detect:', auto_detect);

    const startTime = Date.now();

    // Fetch and downscale image
    console.log('[SAM-MASK] Fetching image...');
    const imageResponse = await fetch(image_url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const { buffer: scaledBuffer, scale, width, height } = await downscaleImage(imageBuffer);

    console.log(`[SAM-MASK] Image scaled: ${width}x${height} (scale: ${scale.toFixed(3)})`);

    // Convert to data URL for Replicate
    const imageDataUrl = bufferToDataUrl(scaledBuffer);

    // Scale points to match downscaled image
    const scaledPositivePoints = scalePoints(positive_points, scale);
    const scaledNegativePoints = scalePoints(negative_points, scale);

    // Initialize Replicate client
    const replicate = getReplicateClient();

    // SAM-2 model on Replicate
    const modelId = 'meta/sam-2:fe97b453a6455861e3bac769b441ca1f1086110da7466dbb65cf1eecfd60dc83';

    // Build SAM-2 input
    const input = {
      image: imageDataUrl,
      multimask_output: false, // We want a single best mask
      return_logits: false
    };

    // Add point prompts if provided
    if (scaledPositivePoints.length > 0 || scaledNegativePoints.length > 0) {
      // SAM-2 expects point_coords as flat array of [x1, y1, x2, y2, ...]
      // and point_labels as [1, 1, 0, 0, ...] where 1=positive, 0=negative
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
      // For auto-detect, place a single point at bottom-center
      // This often captures the floor in room photos
      const autoPoint = [Math.round(width / 2), Math.round(height * 0.75)];
      input.point_coords = [autoPoint];
      input.point_labels = [1];
      console.log('[SAM-MASK] Auto-detect point:', autoPoint);
    } else {
      // No points provided and no auto-detect - run without prompts
      // SAM-2 will attempt automatic segmentation
      console.log('[SAM-MASK] No points provided, running automatic segmentation');
    }

    console.log('[SAM-MASK] Calling SAM-2...');

    // Run SAM-2 synchronously (it's fast enough for interactive use)
    const output = await replicate.run(modelId, { input });

    const samTime = Date.now() - startTime;
    console.log(`[SAM-MASK] SAM-2 completed in ${samTime}ms`);

    // SAM-2 returns an array of masks (or single mask if multimask_output=false)
    // Each mask is a URL to a PNG image
    let maskUrl;

    if (Array.isArray(output)) {
      // Take the first/best mask
      maskUrl = output[0];
    } else if (typeof output === 'string') {
      maskUrl = output;
    } else if (output && output.mask) {
      maskUrl = output.mask;
    } else {
      console.error('[SAM-MASK] Unexpected output format:', output);
      throw new Error('Unexpected SAM-2 output format');
    }

    console.log('[SAM-MASK] Mask URL:', maskUrl);

    const totalTime = Date.now() - startTime;
    console.log(`[SAM-MASK] Total time: ${totalTime}ms`);

    return res.status(200).json({
      success: true,
      mask_url: maskUrl,
      mask_dimensions: {
        width,
        height
      },
      scale_factor: scale,
      original_dimensions: {
        width: Math.round(width / scale),
        height: Math.round(height / scale)
      },
      metadata: {
        points_used: {
          positive: scaledPositivePoints.length,
          negative: scaledNegativePoints.length
        },
        sam_time_ms: samTime,
        total_time_ms: totalTime
      }
    });

  } catch (error) {
    console.error('[SAM-MASK] Error:', error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Allow larger images
    },
    responseLimit: '4mb'
  },
  maxDuration: 30 // 30 seconds timeout for SAM-2
};
