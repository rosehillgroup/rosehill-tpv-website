// /.netlify/functions/palette-clamp.js
// TPV Design Visualiser - Color Quantization API
// Week 3: Post-process FLUX outputs to match TPV palette

/**
 * API Endpoint: POST /api/palette-clamp
 *
 * Quantizes AI-generated images to match TPV color palette
 *
 * Request Body:
 * {
 *   imageData: string,              // Base64 data URL of image to quantize
 *   imageUrl?: string,              // Alternative: HTTP URL to image
 *   targetColors: Array<{code, name, hex, proportion}>, // Desired TPV colors
 *   method?: string,                // "soft" | "hard" (default: "soft")
 *   strength?: number               // 0-1, how aggressively to clamp (default: 0.7)
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   clampedImageUrl: string,        // Base64 data URL of quantized image
 *   method: string,                 // Method used
 *   colorMapping: Object,           // Before/after color stats
 *   processingTime: number          // Milliseconds
 * }
 */

import sharp from 'sharp';
import { PALETTE, hexToRgb, rgbToHex, rgbToOklab, deltaE } from './_utils/color-science.js';

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
    const { imageData, imageUrl, targetColors, method = 'soft', strength = 0.7 } = body;

    // Validate required fields
    if (!imageData && !imageUrl) {
      return new Response(
        JSON.stringify({
          error: 'Missing required field',
          message: 'Either imageData (base64) or imageUrl (HTTP URL) is required'
        }),
        { status: 400, headers }
      );
    }

    if (!targetColors || !Array.isArray(targetColors) || targetColors.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Invalid targetColors',
          message: 'targetColors array is required and must contain at least one color'
        }),
        { status: 400, headers }
      );
    }

    // Validate method
    if (method !== 'soft' && method !== 'hard') {
      return new Response(
        JSON.stringify({
          error: 'Invalid method',
          message: 'method must be either "soft" or "hard"'
        }),
        { status: 400, headers }
      );
    }

    // Validate strength
    if (strength < 0 || strength > 1) {
      return new Response(
        JSON.stringify({
          error: 'Invalid strength',
          message: 'strength must be between 0 and 1'
        }),
        { status: 400, headers }
      );
    }

    console.log('[PALETTE-CLAMP] Processing image with', method, 'method, strength:', strength);
    console.log('[PALETTE-CLAMP] Target colors:', targetColors.map(c => c.code).join(', '));

    // Get image buffer
    let imageBuffer;

    if (imageData) {
      // Convert base64 to buffer
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      // Fetch from URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      imageBuffer = Buffer.from(await response.arrayBuffer());
    }

    // Process image with sharp
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    console.log('[PALETTE-CLAMP] Image size:', metadata.width, 'x', metadata.height);

    // Get raw pixel data
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Prepare target colors in OKLab space for accurate color matching
    const targetColorsOklab = targetColors.map(c => {
      const rgb = hexToRgb(c.hex);
      return {
        ...c,
        rgb,
        oklab: rgbToOklab(rgb.r, rgb.g, rgb.b)
      };
    });

    // Quantize pixels
    const clampedData = Buffer.alloc(data.length);
    const colorStats = {};

    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Find closest TPV color
      const pixelOklab = rgbToOklab(r, g, b);
      const closestColor = findClosestColor(pixelOklab, targetColorsOklab);

      // Apply quantization based on method
      let newR, newG, newB;

      if (method === 'hard') {
        // Hard clamp: replace with exact palette color
        newR = closestColor.rgb.r;
        newG = closestColor.rgb.g;
        newB = closestColor.rgb.b;
      } else {
        // Soft clamp: blend original with palette color
        const blend = strength;
        newR = Math.round(r * (1 - blend) + closestColor.rgb.r * blend);
        newG = Math.round(g * (1 - blend) + closestColor.rgb.g * blend);
        newB = Math.round(b * (1 - blend) + closestColor.rgb.b * blend);
      }

      clampedData[i] = newR;
      clampedData[i + 1] = newG;
      clampedData[i + 2] = newB;

      // Track color usage
      const colorKey = closestColor.code;
      colorStats[colorKey] = (colorStats[colorKey] || 0) + 1;
    }

    // Create clamped image
    const clampedImage = await sharp(clampedData, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 3
      }
    })
      .png()
      .toBuffer();

    // Convert to base64
    const clampedImageUrl = `data:image/png;base64,${clampedImage.toString('base64')}`;

    // Calculate color mapping stats
    const totalPixels = data.length / 3;
    const colorMapping = Object.entries(colorStats).map(([code, count]) => {
      const color = targetColors.find(c => c.code === code);
      return {
        code,
        name: color.name,
        hex: color.hex,
        pixelCount: count,
        percentage: Math.round((count / totalPixels) * 100 * 100) / 100
      };
    }).sort((a, b) => b.pixelCount - a.pixelCount);

    const processingTime = Date.now() - startTime;

    console.log('[PALETTE-CLAMP] Quantization complete:', processingTime, 'ms');
    console.log('[PALETTE-CLAMP] Color distribution:', colorMapping);

    return new Response(
      JSON.stringify({
        success: true,
        clampedImageUrl,
        method,
        strength,
        colorMapping,
        processingTime
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('[PALETTE-CLAMP] Error:', error);

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
 * Find closest color in target palette using perceptual OKLab distance
 */
function findClosestColor(pixelOklab, targetColorsOklab) {
  let minDistance = Infinity;
  let closestColor = targetColorsOklab[0];

  for (const targetColor of targetColorsOklab) {
    const distance = deltaE(pixelOklab, targetColor.oklab);

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = targetColor;
    }
  }

  return closestColor;
}
