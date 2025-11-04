// /.netlify/functions/texture.js
// TPV Design Visualiser - Texture Generation API
// Week 2: Refactored for Mode A (deterministic) and Mode B (AI) support

/**
 * API Endpoint: POST /api/texture
 *
 * Generates photorealistic TPV surface texture visualizations
 *
 * Request Body (Mode A - Deterministic):
 * {
 *   mode: "modeA",
 *   imageData: string,         // Base64 data URL of image
 *   maskData: string,          // Base64 data URL of mask
 *   colorCode: string,         // TPV color code (e.g., "RH30") - for single color
 *   colorHex: string,          // Hex color value (e.g., "#E4C4AA") - for single color
 *   shareCode?: string,        // Share code for multi-color (alternative to colorCode/colorHex)
 *   patternType?: string,      // "solid" | "speckle" | "swirl" | "islands" | "borders"
 *   granuleScale?: number,     // 1-4 (mm)
 *   brightness?: number        // -0.2 to 0.2
 * }
 *
 * Request Body (Mode B - AI):
 * {
 *   mode: "modeB",
 *   imageData: string,         // Base64 data URL of image
 *   maskData?: string,         // Base64 data URL of mask (optional, will generate if not provided)
 *   colorCode: string,         // TPV color code
 *   colorHex: string,          // Hex color value
 *   shareCode?: string         // Share code for multi-color
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   textureUrl: string,        // Data URL to generated texture
 *   colorCode?: string,        // Single color code used
 *   colors?: Array,            // Multi-color array if shareCode used
 *   mode: string,              // "modeA" or "modeB"
 *   deltaE?: number,           // Color accuracy metric
 *   processingTime: number     // Milliseconds
 * }
 */

import Replicate from 'replicate';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import {
  PALETTE,
  shareCodeToColors,
  hexToRgb,
  rgbToHex,
  computeAverageBlend,
  decodeMix
} from './_utils/color-science.js';
import { uploadImageToSupabase, generateSAM2Mask, generateSimpleMask } from './_utils/sam2.js';

// Initialize clients
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://okakomwfikxmwllvliva.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE
);

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
    const { mode, imageData, maskData, colorCode, colorHex, shareCode, patternType, granuleScale, brightness } = body;

    // Validate mode
    if (!mode || (mode !== 'modeA' && mode !== 'modeB')) {
      return new Response(
        JSON.stringify({
          error: 'Invalid mode',
          message: 'Mode must be either "modeA" or "modeB"'
        }),
        { status: 400, headers }
      );
    }

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

    // Validate color input (either colorCode/colorHex OR shareCode)
    if (!shareCode && (!colorCode || !colorHex)) {
      return new Response(
        JSON.stringify({
          error: 'Missing color information',
          message: 'Either provide colorCode+colorHex OR shareCode'
        }),
        { status: 400, headers }
      );
    }

    // Parse colors from shareCode if provided
    let colors = [];
    if (shareCode) {
      colors = shareCodeToColors(shareCode);
      if (colors.length === 0) {
        return new Response(
          JSON.stringify({
            error: 'Invalid share code',
            message: 'Share code could not be decoded or contains no valid colors'
          }),
          { status: 400, headers }
        );
      }
      console.log(`[TEXTURE] Decoded ${colors.length} colors from share code:`, colors);
    } else {
      // Single color mode
      // Validate color code format
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

      // Find color in palette
      const paletteColor = PALETTE.find(c => c.code === colorCode);
      if (!paletteColor) {
        return new Response(
          JSON.stringify({
            error: 'Color code not found in palette',
            message: `Color code ${colorCode} is not in the TPV palette`
          }),
          { status: 400, headers }
        );
      }

      colors = [{
        code: colorCode,
        name: paletteColor.name,
        hex: colorHex,
        proportion: 100
      }];
    }

    // Route to appropriate handler
    let result;
    if (mode === 'modeA') {
      result = await handleModeA({
        imageData,
        maskData,
        colors,
        patternType: patternType || 'solid',
        granuleScale: granuleScale || 3,
        brightness: brightness || 0
      });
    } else {
      result = await handleModeB({
        imageData,
        maskData,
        colors
      });
    }

    const processingTime = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        success: true,
        ...result,
        mode,
        colors: colors.length > 1 ? colors : undefined,
        colorCode: colors.length === 1 ? colors[0].code : undefined,
        processingTime
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('[TEXTURE] Error:', error);

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
 * Mode A: Deterministic texture generation
 * Generates texture server-side using pattern algorithms
 */
async function handleModeA({ imageData, maskData, colors, patternType, granuleScale, brightness }) {
  console.log('[MODE A] Starting deterministic texture generation...');
  console.log('[MODE A] Colors:', colors);
  console.log('[MODE A] Pattern:', patternType, 'Granule:', granuleScale, 'Brightness:', brightness);

  try {
    // For Mode A, we generate a texture tile and return it
    // The client will composite it with the mask
    const textureDataUrl = await generateTextureTile({
      colors,
      patternType,
      granuleScale,
      brightness,
      size: 512
    });

    console.log('[MODE A] Texture generation complete');

    return {
      textureUrl: textureDataUrl,
      deltaE: 0 // TODO: Calculate if needed
    };

  } catch (error) {
    console.error('[MODE A] Error:', error);
    throw new Error(`Mode A texture generation failed: ${error.message}`);
  }
}

/**
 * Mode B: AI-powered texture generation using FLUX Fill Pro
 */
async function handleModeB({ imageData, maskData, colors }) {
  console.log('[MODE B] Starting AI-powered texture generation...');
  console.log('[MODE B] Colors:', colors);

  try {
    // Ensure we have a mask
    let finalMaskData = maskData;
    let sam2Info = null;

    if (!finalMaskData) {
      console.log('[MODE B] No mask provided, generating SAM 2 auto-segmentation mask...');

      try {
        // Upload image to Supabase for SAM 2
        const imageUrl = await uploadImageToSupabase(imageData);

        // Generate mask using SAM 2
        const sam2Result = await generateSAM2Mask(imageUrl);

        finalMaskData = sam2Result.maskUrl;
        sam2Info = {
          segmentCount: sam2Result.segmentCount,
          selectedSegment: sam2Result.selectedSegment
        };

        console.log('[MODE B] SAM 2 mask generated:', sam2Info);
      } catch (sam2Error) {
        console.error('[MODE B] SAM 2 failed, falling back to simple mask:', sam2Error);

        // Fallback to simple mask if SAM 2 fails
        finalMaskData = generateSimpleMask();
        sam2Info = { fallback: true, error: sam2Error.message };
      }
    }

    // Generate prompt based on colors
    const prompt = generateFluxPrompt(colors);
    console.log('[MODE B] Prompt:', prompt);

    // Call Replicate FLUX Fill Pro
    console.log('[MODE B] Calling FLUX Fill Pro API...');
    const output = await replicate.run(
      "black-forest-labs/flux-fill-pro",
      {
        input: {
          image: imageData,
          mask: finalMaskData,
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

    console.log('[MODE B] FLUX output received');

    // Download generated texture
    const textureUrl = Array.isArray(output) ? output[0] : output;
    const textureResponse = await fetch(textureUrl);
    if (!textureResponse.ok) {
      throw new Error(`Failed to download generated texture: ${textureResponse.statusText}`);
    }
    const textureBuffer = await textureResponse.arrayBuffer();

    // Upload to Supabase storage
    console.log('[MODE B] Uploading to Supabase...');
    const colorCodes = colors.map(c => c.code).join('-');
    const fileName = `${Date.now()}-${colorCodes}.png`;

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

    // Generate signed URL (1 hour expiry)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('tpv-visualiser')
      .createSignedUrl(uploadData.path, 3600);

    if (signedUrlError) {
      throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
    }

    console.log('[MODE B] Texture generation complete');

    return {
      textureUrl: signedUrlData.signedUrl,
      deltaE: 0, // TODO: Calculate if needed
      sam2: sam2Info // Include SAM 2 segmentation info
    };

  } catch (error) {
    console.error('[MODE B] Error:', error);
    throw new Error(`Mode B texture generation failed: ${error.message}`);
  }
}

/**
 * Generate a texture tile based on colors and pattern
 */
async function generateTextureTile({ colors, patternType, granuleScale, brightness, size }) {
  console.log('[TEXTURE TILE] Generating', size, 'x', size, 'texture...');

  // Create image data buffer (RGBA)
  const pixelCount = size * size;
  const buffer = Buffer.alloc(pixelCount * 4);

  // Generate pattern based on type
  switch (patternType) {
    case 'solid':
      generateSolidPattern(buffer, size, colors, granuleScale, brightness);
      break;
    case 'speckle':
      generateSpecklePattern(buffer, size, colors, granuleScale, brightness);
      break;
    case 'swirl':
      generateSwirlPattern(buffer, size, colors, granuleScale, brightness);
      break;
    case 'islands':
      generateIslandsPattern(buffer, size, colors, granuleScale, brightness);
      break;
    case 'borders':
      generateBordersPattern(buffer, size, colors, granuleScale, brightness);
      break;
    default:
      generateSolidPattern(buffer, size, colors, granuleScale, brightness);
  }

  // Convert to PNG using sharp
  const pngBuffer = await sharp(buffer, {
    raw: {
      width: size,
      height: size,
      channels: 4
    }
  }).png().toBuffer();

  // Convert to base64 data URL
  const base64 = pngBuffer.toString('base64');
  return `data:image/png;base64,${base64}`;
}

/**
 * Pattern generation functions
 */

function generateSolidPattern(buffer, size, colors, granuleScale, brightness) {
  const avgColor = blendColorsWeighted(colors);
  const rgb = hexToRgb(avgColor);

  for (let i = 0; i < buffer.length; i += 4) {
    const noise = (Math.random() - 0.5) * 20 * (granuleScale / 3);
    const brightnessAdjust = brightness * 255;

    buffer[i] = clamp(rgb.r + noise + brightnessAdjust);     // R
    buffer[i + 1] = clamp(rgb.g + noise + brightnessAdjust); // G
    buffer[i + 2] = clamp(rgb.b + noise + brightnessAdjust); // B
    buffer[i + 3] = 255; // A
  }
}

function generateSpecklePattern(buffer, size, colors, granuleScale, brightness) {
  // Start with average color
  const avgColor = blendColorsWeighted(colors);
  const avgRgb = hexToRgb(avgColor);

  // Fill with base color
  for (let i = 0; i < buffer.length; i += 4) {
    buffer[i] = avgRgb.r;
    buffer[i + 1] = avgRgb.g;
    buffer[i + 2] = avgRgb.b;
    buffer[i + 3] = 255;
  }

  // Add speckles for each color
  const speckleSize = Math.max(1, Math.floor(2 + granuleScale));
  const specklesPerColor = Math.floor((size * size) / (speckleSize * speckleSize * 2));

  colors.forEach(color => {
    const rgb = hexToRgb(color.hex);
    const count = Math.floor(specklesPerColor * (color.proportion / 100));

    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);

      // Draw speckle
      for (let dy = -speckleSize; dy <= speckleSize; dy++) {
        for (let dx = -speckleSize; dx <= speckleSize; dx++) {
          const px = x + dx;
          const py = y + dy;

          if (px >= 0 && px < size && py >= 0 && py < size) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= speckleSize) {
              const idx = (py * size + px) * 4;
              const noise = (Math.random() - 0.5) * 10;
              const brightnessAdjust = brightness * 255;

              buffer[idx] = clamp(rgb.r + noise + brightnessAdjust);
              buffer[idx + 1] = clamp(rgb.g + noise + brightnessAdjust);
              buffer[idx + 2] = clamp(rgb.b + noise + brightnessAdjust);
            }
          }
        }
      }
    }
  });
}

function generateSwirlPattern(buffer, size, colors, granuleScale, brightness) {
  const centerX = size / 2;
  const centerY = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Create swirl pattern
      const value = (Math.sin(angle * 3 + distance / 20) + 1) / 2;

      // Map value to color
      let cumulative = 0;
      let selectedColor = colors[0];

      for (const color of colors) {
        cumulative += color.proportion / 100;
        if (value <= cumulative) {
          selectedColor = color;
          break;
        }
      }

      const rgb = hexToRgb(selectedColor.hex);
      const idx = (y * size + x) * 4;
      const noise = (Math.random() - 0.5) * 20 * (granuleScale / 3);
      const brightnessAdjust = brightness * 255;

      buffer[idx] = clamp(rgb.r + noise + brightnessAdjust);
      buffer[idx + 1] = clamp(rgb.g + noise + brightnessAdjust);
      buffer[idx + 2] = clamp(rgb.b + noise + brightnessAdjust);
      buffer[idx + 3] = 255;
    }
  }
}

function generateIslandsPattern(buffer, size, colors, granuleScale, brightness) {
  // Background color (first color)
  const bgColor = hexToRgb(colors[0].hex);

  // Fill background
  for (let i = 0; i < buffer.length; i += 4) {
    buffer[i] = bgColor.r;
    buffer[i + 1] = bgColor.g;
    buffer[i + 2] = bgColor.b;
    buffer[i + 3] = 255;
  }

  // Add islands for other colors
  const islandCount = 5 + Math.floor(granuleScale * 2);

  colors.forEach((color, idx) => {
    if (idx === 0) return; // Skip background

    const rgb = hexToRgb(color.hex);
    const count = Math.floor(islandCount * (color.proportion / 100));

    for (let i = 0; i < count; i++) {
      const centerX = Math.floor(Math.random() * size);
      const centerY = Math.floor(Math.random() * size);
      const radius = 10 + Math.random() * 20 * granuleScale;

      // Draw island
      for (let y = Math.floor(centerY - radius); y <= Math.ceil(centerY + radius); y++) {
        for (let x = Math.floor(centerX - radius); x <= Math.ceil(centerX + radius); x++) {
          if (x >= 0 && x < size && y >= 0 && y < size) {
            const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            if (dist <= radius) {
              const idx = (y * size + x) * 4;
              const noise = (Math.random() - 0.5) * 20;
              const brightnessAdjust = brightness * 255;

              buffer[idx] = clamp(rgb.r + noise + brightnessAdjust);
              buffer[idx + 1] = clamp(rgb.g + noise + brightnessAdjust);
              buffer[idx + 2] = clamp(rgb.b + noise + brightnessAdjust);
            }
          }
        }
      }
    }
  });
}

function generateBordersPattern(buffer, size, colors, granuleScale, brightness) {
  const bandHeight = size / colors.length;

  colors.forEach((color, idx) => {
    const rgb = hexToRgb(color.hex);
    const startY = Math.floor(idx * bandHeight);
    const endY = Math.floor((idx + 1) * bandHeight);

    for (let y = startY; y < endY; y++) {
      for (let x = 0; x < size; x++) {
        const pixelIdx = (y * size + x) * 4;
        const noise = (Math.random() - 0.5) * 20 * (granuleScale / 3);
        const brightnessAdjust = brightness * 255;

        buffer[pixelIdx] = clamp(rgb.r + noise + brightnessAdjust);
        buffer[pixelIdx + 1] = clamp(rgb.g + noise + brightnessAdjust);
        buffer[pixelIdx + 2] = clamp(rgb.b + noise + brightnessAdjust);
        buffer[pixelIdx + 3] = 255;
      }
    }
  });
}

/**
 * Helper functions
 */

function blendColorsWeighted(colors) {
  let r = 0, g = 0, b = 0;

  colors.forEach(color => {
    const rgb = hexToRgb(color.hex);
    const weight = color.proportion / 100;
    r += rgb.r * weight;
    g += rgb.g * weight;
    b += rgb.b * weight;
  });

  return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function generateFluxPrompt(colors) {
  if (colors.length === 1) {
    const color = colors[0];
    return `Professional sports surface made of smooth TPV rubber granules in ${color.name} (${color.code}). ` +
           `Photorealistic texture with uniform ${color.hex} colored rubber particles, ` +
           `even distribution, high quality athletic surface, clean and modern appearance, ` +
           `small granular texture, realistic lighting, professional photography quality.`;
  } else {
    const colorList = colors.map(c => `${c.name} (${Math.round(c.proportion)}%)`).join(', ');
    return `Professional sports surface made of mixed TPV rubber granules with ${colorList}. ` +
           `Photorealistic texture with evenly distributed colored rubber particles, ` +
           `high quality athletic surface, clean and modern appearance, ` +
           `small granular texture, realistic lighting, professional photography quality.`;
  }
}

function generateSimpleMask() {
  // Return a 1x1 white pixel PNG (tells FLUX to fill entire image)
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
}
