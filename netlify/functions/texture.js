// /.netlify/functions/texture.js
// TPV Design Visualiser - Texture Generation API
// Phase 2B: FLUX Fill Pro AI-powered texture generation

/**
 * API Endpoint: POST /api/texture
 *
 * Generates photorealistic TPV surface texture visualizations
 *
 * Request Body:
 * {
 *   imageUrl: string,      // Supabase signed URL for uploaded photo
 *   colorCode: string,     // TPV color code (e.g., "RH30")
 *   colorHex: string,      // Hex color value (e.g., "#E4C4AA")
 *   mode: string,          // "simple" | "ai-enhanced"
 *   maskUrl?: string       // Optional: Segmentation mask URL
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   textureUrl: string,    // Signed URL to generated texture
 *   deltaE: number,        // Color accuracy metric
 *   processingTime: number // Milliseconds
 * }
 */

import Replicate from 'replicate';
import { createClient } from '@supabase/supabase-js';

// Initialize clients
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://okakomwfikxmwllvliva.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE
);

export default async (request) => {
  const startTime = Date.now();

  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

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
    const { imageData, imageUrl, colorCode, colorHex, mode = 'simple', maskUrl } = body;

    // Validate required fields - accept either imageData OR imageUrl
    if ((!imageData && !imageUrl) || !colorCode || !colorHex) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          required: ['(imageData OR imageUrl)', 'colorCode', 'colorHex']
        }),
        { status: 400, headers }
      );
    }

    // Validate color code format (RH + 2 digits)
    if (!/^RH\d{2}$/.test(colorCode)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid color code format',
          expected: 'RH + 2 digits (e.g., RH30)'
        }),
        { status: 400, headers }
      );
    }

    // Validate hex color format
    if (!/^#[0-9A-F]{6}$/i.test(colorHex)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid hex color format',
          expected: '#RRGGBB (e.g., #E4C4AA)'
        }),
        { status: 400, headers }
      );
    }

    // PHASE 2B: Real FLUX Fill Pro texture generation
    console.log(`[TEXTURE] Generation request:`, {
      colorCode,
      colorHex,
      mode,
      hasImageData: !!imageData,
      hasImageUrl: !!imageUrl
    });

    // Step 1: Get image data (from base64 or URL)
    let imageBase64;
    if (imageData) {
      // Image provided as base64 data URL from client
      console.log('[TEXTURE] Using provided image data...');
      imageBase64 = imageData;
    } else {
      // Image provided as URL - download it
      console.log('[TEXTURE] Downloading image from URL...');
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.statusText}`);
      }
      const imageBuffer = await imageResponse.arrayBuffer();
      imageBase64 = `data:image/jpeg;base64,${Buffer.from(imageBuffer).toString('base64')}`;
    }

    // Step 2: Generate TPV texture prompt
    const prompt = generateTexturePrompt(colorCode, colorHex);
    console.log('[TEXTURE] Generated prompt:', prompt);

    // Step 3: Call Replicate FLUX Fill Pro for texture generation
    console.log('[TEXTURE] Calling FLUX Fill Pro API...');
    const output = await replicate.run(
      "black-forest-labs/flux-fill-pro",
      {
        input: {
          image: imageBase64,
          prompt: prompt,
          guidance: 3.5,
          num_outputs: 1,
          output_format: "png",
          output_quality: 90,
          prompt_strength: 0.85,
          num_inference_steps: 28
        }
      }
    );

    console.log('[TEXTURE] FLUX output:', output);

    // Step 4: Download generated texture
    const textureUrl = Array.isArray(output) ? output[0] : output;
    const textureResponse = await fetch(textureUrl);
    if (!textureResponse.ok) {
      throw new Error(`Failed to download generated texture: ${textureResponse.statusText}`);
    }
    const textureBuffer = await textureResponse.arrayBuffer();

    // Step 5: Upload to Supabase storage
    console.log('[TEXTURE] Uploading to Supabase storage...');
    const fileName = `${Date.now()}-${colorCode}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tpv-visualiser')
      .upload(fileName, textureBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Failed to upload to Supabase: ${uploadError.message}`);
    }

    console.log('[TEXTURE] Uploaded to:', uploadData.path);

    // Step 6: Generate signed URL (1 hour expiry)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('tpv-visualiser')
      .createSignedUrl(uploadData.path, 3600);

    if (signedUrlError) {
      throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
    }

    const processingTime = Date.now() - startTime;

    console.log('[TEXTURE] Generation complete:', {
      processingTime,
      textureUrl: signedUrlData.signedUrl.substring(0, 50) + '...'
    });

    // Step 7: Return response
    return new Response(
      JSON.stringify({
        success: true,
        textureUrl: signedUrlData.signedUrl,
        colorCode,
        colorHex,
        mode,
        deltaE: 0, // TODO Phase 2C: Calculate using tpv-palette.ts
        processingTime
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Texture generation error:', error);

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
 * Generate FLUX Fill Pro prompt for TPV texture generation
 * @param {string} colorCode - TPV color code (e.g., "RH30")
 * @param {string} colorHex - Hex color value (e.g., "#E4C4AA")
 * @returns {string} Optimized prompt for texture generation
 */
function generateTexturePrompt(colorCode, colorHex) {
  // TPV color name mapping (21 standard colors)
  const colorNames = {
    'RH30': 'Beige',
    'RH31': 'Light Grey',
    'RH32': 'Mid Grey',
    'RH33': 'Dark Grey',
    'RH34': 'Black',
    'RH35': 'White',
    'RH36': 'Red',
    'RH37': 'Orange',
    'RH38': 'Yellow',
    'RH39': 'Green',
    'RH40': 'Blue',
    'RH41': 'Purple',
    'RH42': 'Pink',
    'RH43': 'Brown',
    'RH44': 'Terracotta',
    'RH45': 'Sky Blue',
    'RH46': 'Navy Blue',
    'RH47': 'Forest Green',
    'RH48': 'Lime Green',
    'RH49': 'Burgundy',
    'RH50': 'Charcoal'
  };

  const colorName = colorNames[colorCode] || colorCode;

  return `Professional sports surface made of smooth TPV rubber granules in ${colorName} (${colorCode}). ` +
         `Photorealistic texture with uniform ${colorHex} colored rubber particles, ` +
         `even distribution, high quality athletic surface, clean and modern appearance, ` +
         `small granular texture, realistic lighting, professional photography quality.`;
}
