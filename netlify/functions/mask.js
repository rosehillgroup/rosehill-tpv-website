// /.netlify/functions/mask.js
// TPV Design Visualiser - Mask Generation API
// Week 2: Placeholder for Week 3 SAM 2 integration

/**
 * API Endpoint: POST /api/mask
 *
 * Generates segmentation masks for uploaded images
 *
 * Request Body:
 * {
 *   imageData: string,     // Base64 data URL of image
 *   mode?: string,         // "auto" | "simple" (default: "simple")
 *   points?: Array,        // Optional point prompts for SAM 2 (Week 3)
 *   boxes?: Array          // Optional box prompts for SAM 2 (Week 3)
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   maskUrl: string,       // Base64 data URL of mask (white=foreground, black=background)
 *   mode: string,          // Mode used to generate mask
 *   processingTime: number // Milliseconds
 * }
 */

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
    const { imageData, mode = 'simple', points, boxes } = body;

    // Validate required fields
    if (!imageData) {
      return new Response(
        JSON.stringify({
          error: 'Missing required field: imageData',
          message: 'imageData (base64 data URL) is required'
        }),
        { status: 400, headers }
      );
    }

    // Validate imageData format
    if (!imageData.startsWith('data:image/')) {
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
    let maskUrl;

    if (mode === 'simple') {
      // Simple mode: return full-image white mask
      maskUrl = generateSimpleMask();
    } else {
      // Auto mode: placeholder for Week 3 SAM 2 integration
      // For now, return simple mask with a note
      console.log('[MASK] Auto mode requested but SAM 2 not yet integrated. Using simple mask.');
      maskUrl = generateSimpleMask();
    }

    const processingTime = Date.now() - startTime;

    console.log('[MASK] Mask generation complete:', processingTime, 'ms');

    return new Response(
      JSON.stringify({
        success: true,
        maskUrl,
        mode,
        note: mode === 'auto' ? 'SAM 2 auto-segmentation will be available in Week 3' : undefined,
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

/**
 * Generate a simple full-image white mask
 * This creates a 1x1 white pixel PNG that can be scaled to match any image
 *
 * Returns: Base64 data URL of a white 1x1 pixel PNG
 */
function generateSimpleMask() {
  // 1x1 white pixel PNG
  // This is a minimal PNG file representing a single white pixel
  // When used as a mask: white = include in processing, black = exclude
  const whitePng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

  return whitePng;
}

/**
 * WEEK 3 PLACEHOLDER: SAM 2 Integration
 *
 * Future implementation will include:
 * - SAM 2 model integration via Replicate API
 * - Point-based prompting for specific object selection
 * - Box-based prompting for region selection
 * - Automatic ground/surface detection
 * - Multi-segment support for complex scenes
 *
 * Expected signature:
 * async function generateSAM2Mask(imageData, points, boxes) {
 *   // Call Replicate SAM 2 API
 *   // Process segmentation results
 *   // Return high-quality segmentation mask
 * }
 */
