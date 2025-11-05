// /.netlify/functions/visualise.js
// TPV Design Visualiser - Orchestration API
// Week 3: Coordinates SAM 2, Llama 3, FLUX Fill Pro, and palette quantization

/**
 * API Endpoint: POST /api/visualise
 *
 * One-click AI visualization pipeline
 *
 * Request Body:
 * {
 *   imageData: string,              // Base64 data URL of image
 *   colors: Array<{code, name, hex, proportion}>, // TPV colors
 *   mode: "modeA" | "modeB",        // Rendering mode
 *
 *   // Mode A specific (deterministic):
 *   pattern?: string,                // "solid" | "speckle" | "swirl" | "islands" | "borders"
 *   granuleScale?: number,           // 1-4mm
 *   brightness?: number,             // -0.2 to 0.2
 *   maskData?: string,               // Optional pre-made mask
 *
 *   // Mode B specific (AI):
 *   useEnhancedPrompt?: boolean,     // Use Llama 3 (default: false)
 *   useAutoMask?: boolean,           // Use SAM 2 (default: true)
 *   usePaletteClamp?: boolean,       // Quantize output (default: true)
 *   clampStrength?: number           // 0-1 (default: 0.7)
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   resultUrl: string,               // Final visualization
 *   mode: string,
 *   pipeline: {
 *     mask?: Object,                 // SAM 2 info if used
 *     prompt?: Object,               // Llama 3 info if used
 *     texture: Object,               // FLUX/Mode A info
 *     clamp?: Object                 // Palette clamp info if used
 *   },
 *   processingTime: number
 * }
 */

import { uploadImageToSupabase, generateSAM2Mask, generateSimpleMask } from './_utils/sam2.js';
import { shareCodeToColors } from './_utils/color-science.js';
import Replicate from 'replicate';

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
    const {
      imageData,
      colors,
      mode,
      pattern,
      granuleScale,
      brightness,
      maskData,
      useEnhancedPrompt = false,
      useAutoMask = true,
      usePaletteClamp = true,
      clampStrength = 0.7
    } = body;

    // Validate required fields
    if (!imageData) {
      return new Response(
        JSON.stringify({
          error: 'Missing required field: imageData'
        }),
        { status: 400, headers }
      );
    }

    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Invalid colors',
          message: 'colors array is required'
        }),
        { status: 400, headers }
      );
    }

    if (!mode || (mode !== 'modeA' && mode !== 'modeB')) {
      return new Response(
        JSON.stringify({
          error: 'Invalid mode',
          message: 'mode must be "modeA" or "modeB"'
        }),
        { status: 400, headers }
      );
    }

    console.log('[VISUALISE] Starting', mode, 'pipeline with', colors.length, 'colors');

    const pipeline = {};

    // Route to appropriate pipeline
    let result;

    if (mode === 'modeA') {
      result = await runModeAPipeline({
        imageData,
        maskData,
        colors,
        pattern: pattern || 'solid',
        granuleScale: granuleScale || 3,
        brightness: brightness || 0,
        pipeline
      });
    } else {
      result = await runModeBPipeline({
        imageData,
        maskData,
        colors,
        useEnhancedPrompt,
        useAutoMask,
        usePaletteClamp,
        clampStrength,
        pipeline
      });
    }

    const processingTime = Date.now() - startTime;

    console.log('[VISUALISE] Pipeline complete:', processingTime, 'ms');

    return new Response(
      JSON.stringify({
        success: true,
        resultUrl: result.textureUrl,
        mode,
        pipeline,
        processingTime
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('[VISUALISE] Error:', error);

    return new Response(
      JSON.stringify({
        error: 'Pipeline failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { status: 500, headers }
    );
  }
};

/**
 * Mode A Pipeline: Deterministic rendering
 * Calls /api/texture directly with Mode A parameters
 */
async function runModeAPipeline({ imageData, maskData, colors, pattern, granuleScale, brightness, pipeline }) {
  console.log('[MODE A PIPELINE] Starting deterministic rendering...');

  // Call texture endpoint
  const textureResponse = await fetch(`${process.env.URL}/.netlify/functions/texture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'modeA',
      imageData,
      maskData,
      shareCode: colors.map(c => `${c.code}_${c.proportion}`).join('-'),
      patternType: pattern,
      granuleScale,
      brightness
    })
  });

  if (!textureResponse.ok) {
    const error = await textureResponse.json();
    throw new Error(`Mode A texture generation failed: ${error.message || textureResponse.statusText}`);
  }

  const textureResult = await textureResponse.json();

  pipeline.texture = {
    pattern,
    granuleScale,
    brightness,
    processingTime: textureResult.processingTime
  };

  return textureResult;
}

/**
 * Mode B Pipeline: AI-powered rendering
 * Orchestrates: SAM 2 → Llama 3 → FLUX Fill Pro → Palette Clamp
 */
async function runModeBPipeline({ imageData, maskData, colors, useEnhancedPrompt, useAutoMask, usePaletteClamp, clampStrength, pipeline }) {
  console.log('[MODE B PIPELINE] Starting AI rendering...');

  // Step 1: Skip SAM 2 for now - just process whole image
  // TODO: Fix SAM 2 model version once Replicate access is confirmed
  console.log('[MODE B PIPELINE] Skipping SAM 2 - processing entire image');

  const finalMaskData = null; // null = FLUX processes entire image

  pipeline.mask = {
    method: 'none',
    note: 'Processing entire image (SAM 2 disabled)'
  };

  // Step 2: Generate enhanced prompt (if requested)
  let prompt;

  if (useEnhancedPrompt) {
    console.log('[MODE B PIPELINE] Step 2: Generating enhanced prompt with Llama 3...');

    try {
      const promptResponse = await fetch(`${process.env.URL}/.netlify/functions/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors })
      });

      if (promptResponse.ok) {
        const promptResult = await promptResponse.json();
        prompt = promptResult.prompt;

        pipeline.prompt = {
          method: 'llama3',
          prompt: promptResult.prompt,
          basePrompt: promptResult.basePrompt
        };

        console.log('[MODE B PIPELINE] Enhanced prompt generated');
      } else {
        throw new Error('Prompt endpoint failed');
      }
    } catch (promptError) {
      console.error('[MODE B PIPELINE] Llama 3 failed:', promptError);

      // Use simple prompt
      prompt = generateSimplePrompt(colors);

      pipeline.prompt = {
        method: 'simple',
        prompt,
        fallback: true,
        error: promptError.message
      };
    }
  } else {
    prompt = generateSimplePrompt(colors);
    pipeline.prompt = { method: 'simple', prompt };
  }

  // Step 3: Call FLUX Fill Pro
  console.log('[MODE B PIPELINE] Step 3: Calling FLUX Fill Pro...');

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY
  });

  const fluxOutput = await replicate.run(
    "black-forest-labs/flux-fill-pro",
    {
      input: {
        image: imageData,
        mask: finalMaskData,
        prompt,
        guidance: 3.5,
        num_outputs: 1,
        output_format: "png",
        output_quality: 90,
        prompt_strength: 0.85,
        num_inference_steps: 28
      }
    }
  );

  let fluxImageUrl = Array.isArray(fluxOutput) ? fluxOutput[0] : fluxOutput;

  pipeline.texture = {
    model: 'flux-fill-pro',
        prompt
  };

  console.log('[MODE B PIPELINE] FLUX generation complete');

  // Step 4: Palette clamp (if requested)
  let finalResult = fluxImageUrl;

  if (usePaletteClamp) {
    console.log('[MODE B PIPELINE] Step 4: Applying palette quantization...');

    try {
      const clampResponse = await fetch(`${process.env.URL}/.netlify/functions/palette-clamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: fluxImageUrl,
          targetColors: colors,
          method: 'soft',
          strength: clampStrength
        })
      });

      if (clampResponse.ok) {
        const clampResult = await clampResponse.json();
        finalResult = clampResult.clampedImageUrl;

        pipeline.clamp = {
          method: 'soft',
          strength: clampStrength,
          colorMapping: clampResult.colorMapping
        };

        console.log('[MODE B PIPELINE] Palette quantization complete');
      } else {
        throw new Error('Palette clamp endpoint failed');
      }
    } catch (clampError) {
      console.error('[MODE B PIPELINE] Palette clamp failed:', clampError);

      pipeline.clamp = {
        fallback: true,
        error: clampError.message
      };
    }
  }

  return { textureUrl: finalResult };
}

/**
 * Generate simple fallback prompt
 */
function generateSimplePrompt(colors) {
  const colorList = colors.map(c => `${c.name} (${Math.round(c.proportion)}%)`).join(', ');
  return `Professional sports surface made of TPV rubber granules with ${colorList}. ` +
         `Photorealistic texture, high quality athletic surface, small granular texture, realistic lighting.`;
}
