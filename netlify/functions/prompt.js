// /.netlify/functions/prompt.js
// TPV Design Visualiser - AI Prompt Generation API
// Week 3: Llama 3 prompt enhancement for FLUX Fill Pro

/**
 * API Endpoint: POST /api/prompt
 *
 * Generates enhanced prompts for FLUX Fill Pro using Llama 3
 *
 * Request Body:
 * {
 *   colors: Array<{code, name, hex, proportion}>, // TPV colors to describe
 *   context?: string,                              // Optional context (e.g., "playground", "sports court")
 *   style?: string                                  // Optional style hint (e.g., "photorealistic", "vibrant")
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   prompt: string,           // Enhanced prompt for FLUX Fill Pro
 *   basePrompt: string,       // Simple fallback prompt
 *   model: string,            // Model used (llama-3 or fallback)
 *   processingTime: number    // Milliseconds
 * }
 */

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
    const { colors, context = 'playground surface', style = 'photorealistic' } = body;

    // Validate required fields
    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Invalid colors',
          message: 'colors array is required and must contain at least one color'
        }),
        { status: 400, headers }
      );
    }

    console.log('[PROMPT] Generating enhanced prompt for', colors.length, 'colors');

    // Generate base prompt (fallback)
    const basePrompt = generateBasePrompt(colors, context, style);
    console.log('[PROMPT] Base prompt:', basePrompt);

    // Try to enhance with Llama 3
    let enhancedPrompt = basePrompt;
    let model = 'fallback';

    try {
      console.log('[PROMPT] Calling Llama 3 for prompt enhancement...');
      enhancedPrompt = await generateLlama3Prompt(colors, context, style);
      model = 'llama-3';
      console.log('[PROMPT] Llama 3 enhanced prompt:', enhancedPrompt);
    } catch (llama3Error) {
      console.error('[PROMPT] Llama 3 failed, using base prompt:', llama3Error);
      // Keep using basePrompt as fallback
    }

    const processingTime = Date.now() - startTime;

    console.log('[PROMPT] Prompt generation complete:', processingTime, 'ms');

    return new Response(
      JSON.stringify({
        success: true,
        prompt: enhancedPrompt,
        basePrompt,
        model,
        processingTime
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('[PROMPT] Error:', error);

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
 * Generate base prompt without AI enhancement
 * This is a deterministic fallback that always works
 */
function generateBasePrompt(colors, context, style) {
  // Describe colors
  const colorDescriptions = colors.map(c => {
    const proportion = c.proportion ? `${c.proportion}%` : '';
    return `${c.name} (${c.code})${proportion ? ' ' + proportion : ''}`;
  }).join(', ');

  // Build prompt
  const parts = [
    `${style} rendering of a ${context}`,
    `surface texture with TPV granules in`,
    colorDescriptions,
    'colors.',
    'Highly detailed, sharp focus,',
    'outdoor lighting, realistic granule texture,',
    'professional photography, 8k resolution'
  ];

  return parts.join(' ');
}

/**
 * Generate enhanced prompt using Llama 3 via Replicate
 *
 * Uses Llama 3 to create a more descriptive and contextual prompt
 * that guides FLUX Fill Pro to better photorealistic results
 */
async function generateLlama3Prompt(colors, context, style) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY
  });

  // Build color description for Llama 3
  const colorList = colors.map(c => {
    const prop = c.proportion ? ` (${c.proportion}%)` : '';
    return `- ${c.name} (${c.code}, hex: ${c.hex})${prop}`;
  }).join('\n');

  // Llama 3 system prompt
  const systemPrompt = `You are an expert prompt engineer for AI image generation models. Your task is to write highly detailed, photorealistic prompts for FLUX Fill Pro, an inpainting AI model.

IMPORTANT GUIDELINES:
- Focus on visual details: texture, lighting, materials, perspective
- Include technical photography terms: depth of field, bokeh, sharpness
- Describe the scene context and environment
- Emphasize realism and photographic quality
- Keep prompts concise but descriptive (2-3 sentences max)
- Do NOT include negative prompts or quality disclaimers
- Do NOT mention "TPV" or technical product names - describe visually instead`;

  // User prompt with color information
  const userPrompt = `Generate a detailed prompt for FLUX Fill Pro to render a ${style} ${context} surface with thermoplastic granules in the following colors:

${colorList}

The result should look like a professional photograph of a real sports/playground surface with visible rubber granules in these exact color proportions. Emphasize texture, lighting, and photorealism.

Respond with ONLY the prompt text, no explanations.`;

  console.log('[LLAMA3] Calling Replicate API...');

  // Call Llama 3
  const output = await replicate.run(
    "meta/meta-llama-3-70b-instruct",
    {
      input: {
        prompt: userPrompt,
        system_prompt: systemPrompt,
        max_tokens: 200,
        temperature: 0.7,
        top_p: 0.9
      }
    }
  );

  // Replicate returns an async iterator for streaming
  let enhancedPrompt = '';

  if (typeof output === 'string') {
    enhancedPrompt = output;
  } else if (Array.isArray(output)) {
    enhancedPrompt = output.join('');
  } else if (output && typeof output[Symbol.asyncIterator] === 'function') {
    // Handle streaming response
    for await (const chunk of output) {
      enhancedPrompt += chunk;
    }
  } else {
    throw new Error('Unexpected Llama 3 output format');
  }

  // Clean up the response
  enhancedPrompt = enhancedPrompt.trim();

  // Remove any markdown formatting or quotes
  enhancedPrompt = enhancedPrompt.replace(/^["']|["']$/g, '');
  enhancedPrompt = enhancedPrompt.replace(/^\*\*|^\*|\*\*$|\*$/g, '');

  // Ensure we got a valid prompt
  if (!enhancedPrompt || enhancedPrompt.length < 20) {
    throw new Error('Llama 3 returned invalid prompt');
  }

  return enhancedPrompt;
}
