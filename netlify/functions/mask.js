// /.netlify/functions/mask.js
// TPV Design Visualiser - Mask Generation API
// Week 3: SAM 2 Auto-Segmentation Integration

/**
 * API Endpoint: POST /api/mask
 *
 * Generates segmentation masks for uploaded images using SAM 2
 *
 * Request Body:
 * {
 *   imageData: string,     // Base64 data URL of image
 *   imageUrl?: string,     // Optional: HTTP URL to image (alternative to imageData)
 *   mode?: string,         // "auto" | "simple" (default: "auto")
 *   points?: Array<{x, y, label}>, // Optional point prompts for SAM 2
 *   boxes?: Array<[x1, y1, x2, y2]> // Optional box prompts for SAM 2
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   maskUrl: string,       // Base64 data URL of mask (white=foreground, black=background)
 *   mode: string,          // Mode used to generate mask
 *   segmentCount?: number, // Number of segments detected (auto mode)
 *   selectedSegment?: string, // Heuristic used to select segment
 *   processingTime: number // Milliseconds
 * }
 */

import { uploadImageToSupabase, generateSAM2Mask, generateSimpleMask } from './_utils/sam2.js';

// CORS headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export default async (request) => {
  const startTime = Date.now();

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    // Parse request body
    const body = await request.json();
    const { imageData, imageUrl, mode = 'auto', points, boxes } = body;

    // Validate required fields (need either imageData or imageUrl)
    if (!imageData && !imageUrl) {
      return new Response(
        JSON.stringify({
          error: 'Missing required field',
          message: 'Either imageData (base64) or imageUrl (HTTP URL) is required'
        }),
        { status: 400, headers }
      );
    }

    // Validate imageData format if provided
    if (imageData && !imageData.startsWith('data:image/')) {
      return new Response(
        JSON.stringify({
          error: 'Invalid imageData format',
          message: 'imageData must be a base64 data URL starting with "data:image/"'
        }),
        { status: 400, headers }
      );
    }

    // Validate mode
    if (mode !== 'simple' && mode !== 'auto') {
      return new Response(
        JSON.stringify({
          error: 'Invalid mode',
          message: 'Mode must be either "simple" or "auto"'
        }),
        { status: 400, headers }
      );
    }

    console.log('[MASK] Generating mask with mode:', mode);

    // Route to appropriate mask generation handler
    let result;

    if (mode === 'simple') {
      // Simple mode: return full-image white mask
      result = {
        maskUrl: generateSimpleMask(),
        mode: 'simple'
      };
    } else {
      // Auto mode: use SAM 2 for segmentation
      console.log('[MASK] Calling SAM 2 for auto-segmentation...');

      try {
        // Upload image to Supabase if base64
        let finalImageUrl = imageUrl;

        if (imageData && !imageUrl) {
          console.log('[MASK] Uploading base64 image to Supabase...');
          finalImageUrl = await uploadImageToSupabase(imageData);
        }

        // Call SAM 2
        const sam2Result = await generateSAM2Mask(finalImageUrl, points, boxes);

        result = {
          maskUrl: sam2Result.maskUrl,
          mode: 'auto',
          segmentCount: sam2Result.segmentCount,
          selectedSegment: sam2Result.selectedSegment
        };
      } catch (sam2Error) {
        console.error('[MASK] SAM 2 failed, falling back to simple mask:', sam2Error);

        // Fallback to simple mask
        result = {
          maskUrl: generateSimpleMask(),
          mode: 'simple',
          fallback: true,
          error: sam2Error.message
        };
      }
    }

    const processingTime = Date.now() - startTime;

    console.log('[MASK] Mask generation complete:', processingTime, 'ms');

    return new Response(
      JSON.stringify({
        success: true,
        ...result,
        processingTime
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('[MASK] Error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { status: 500, headers }
    );
  }
};

// All mask generation functions now imported from _utils/sam2.js
