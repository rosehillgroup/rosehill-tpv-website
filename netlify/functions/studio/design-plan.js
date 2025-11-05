// /.netlify/functions/studio/design-plan.js
// TPV Studio - LLM Design Planner
// Converts user design briefs into LayoutSpec JSON using Llama 3.1 70B Instruct

/**
 * API Endpoint: POST /api/studio/design/plan
 *
 * Generates a LayoutSpec JSON from a design brief using Llama 3.1
 *
 * Request Body:
 * {
 *   prompt: string,                           // Design brief (e.g., "ocean energy with fish")
 *   surface: {width_m: number, height_m: number},
 *   palette?: Array<{code: string}>,          // Optional TPV color codes
 *   complexity?: 'low' | 'medium' | 'high',   // Default: 'medium'
 *   variants?: number                          // Number of variants to plan for (default 3)
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   spec: LayoutSpec,                         // Full LayoutSpec JSON
 *   model: 'llama-3.1-70b' | 'fallback',
 *   processingTime: number
 * }
 */

import Replicate from 'replicate';

// CORS headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Few-shot examples from LLM_fewshot_prompts.md
const SYSTEM_PROMPT = `You are a senior playground surface designer. Convert the brief into LayoutSpec JSON using grammars and motifs that express the mood. Limit to 3 colours unless requested. Use TPV codes. Use realistic parameters. Always include seeds.

Return ONLY valid JSON matching the LayoutSpec schema. No extra fields. No prose. No markdown formatting.`;

const FEW_SHOT_EXAMPLES = [
  {
    user: 'Surface 5x5 m. Theme "ocean energy". Calm, flowing, playful. Colours auto. Add fish.',
    assistant: JSON.stringify({
      meta: { title: "Ocean Energy", theme: "ocean", mood: ["calm", "flowing", "playful"] },
      surface: { width_m: 5, height_m: 5, border_mm: 100 },
      seeds: { global: 41721, placement: 9182, colour: 1123 },
      palette: [
        { code: "TPV08", role: "base", target_ratio: 0.55 },
        { code: "TPV11", role: "accent", target_ratio: 0.30 },
        { code: "TPV21", role: "highlight", target_ratio: 0.15 }
      ],
      grammar: [
        { name: "Bands", weight: 0.6, params: { bands: 3, amplitude_m: [0.3, 0.8], smoothness: 0.8 } },
        { name: "Clusters", weight: 0.4, params: { count: 3, spread: 0.6 } }
      ],
      motifs: [
        { id: "marine/fish-simple", count: 6, size_m: [0.5, 0.9], rotation: "follow_flow", layer: "accent" },
        { id: "marine/starfish", count: 3, size_m: [0.4, 0.6], layer: "highlight" }
      ],
      rules: {
        min_feature_mm: 120,
        min_radius_mm: 600,
        min_gap_mm: 80,
        min_island_area_m2: 0.3,
        max_colours: 3,
        max_pieces_per_colour: 25,
        no_acute_angles: true
      }
    }, null, 0)
  },
  {
    user: 'Surface 8x4 m. Theme "jungle play". Energetic, lively. Use 3 specific colours: TPV05, TPV14, TPV18.',
    assistant: JSON.stringify({
      meta: { title: "Jungle Play", theme: "jungle", mood: ["energetic", "lively"] },
      surface: { width_m: 8, height_m: 4, border_mm: 100 },
      seeds: { global: 90211, placement: 1234, colour: 3456 },
      palette: [
        { code: "TPV05", role: "base", target_ratio: 0.5 },
        { code: "TPV14", role: "accent", target_ratio: 0.35 },
        { code: "TPV18", role: "highlight", target_ratio: 0.15 }
      ],
      grammar: [
        { name: "Bands", weight: 0.5, params: { bands: 4, amplitude_m: [0.2, 0.6], smoothness: 0.7 } },
        { name: "Islands", weight: 0.5, params: { count: 5, size_m: [0.6, 1.2], roundness: 0.8 } }
      ],
      motifs: [
        { id: "nature/leaf-simple", count: 6, size_m: [0.5, 0.8], rotation: "free", layer: "accent" },
        { id: "geo/star-5-rounded", count: 3, size_m: [0.4, 0.6], rotation: "free", layer: "highlight" }
      ],
      rules: {
        min_feature_mm: 120,
        min_radius_mm: 600,
        min_gap_mm: 80,
        min_island_area_m2: 0.3,
        max_colours: 3,
        max_pieces_per_colour: 25,
        no_acute_angles: true
      }
    }, null, 0)
  }
];

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
      prompt,
      surface,
      palette,
      complexity = 'medium',
      variants = 3
    } = body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Invalid prompt',
          message: 'prompt is required and must be a non-empty string'
        }),
        { status: 400, headers }
      );
    }

    if (!surface || typeof surface.width_m !== 'number' || typeof surface.height_m !== 'number') {
      return new Response(
        JSON.stringify({
          error: 'Invalid surface',
          message: 'surface must include width_m and height_m as numbers'
        }),
        { status: 400, headers }
      );
    }

    console.log('[DESIGN PLAN] Generating layout spec for:', prompt);
    console.log('[DESIGN PLAN] Surface:', surface);
    console.log('[DESIGN PLAN] Complexity:', complexity);

    // Generate fallback spec
    const fallbackSpec = generateFallbackSpec(prompt, surface, palette, complexity);

    // Try to generate with Llama 3.1
    let spec = fallbackSpec;
    let model = 'fallback';

    try {
      console.log('[DESIGN PLAN] Calling Llama 3.1 70B Instruct...');
      const llama3Spec = await generateLlama3Spec(prompt, surface, palette, complexity);
      spec = llama3Spec;
      model = 'llama-3.1-70b';
      console.log('[DESIGN PLAN] Llama 3.1 spec generated successfully');
    } catch (llama3Error) {
      console.error('[DESIGN PLAN] Llama 3.1 failed, using fallback:', llama3Error.message);
      // Keep using fallbackSpec
    }

    const processingTime = Date.now() - startTime;

    console.log('[DESIGN PLAN] Plan generation complete:', processingTime, 'ms');

    return new Response(
      JSON.stringify({
        success: true,
        spec,
        model,
        processingTime
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('[DESIGN PLAN] Error:', error);

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
 * Generate fallback LayoutSpec without AI
 * Simple Bands-only design that always works
 */
function generateFallbackSpec(prompt, surface, palette, complexity) {
  // Generate random seeds based on prompt
  const promptHash = hashString(prompt);
  const globalSeed = promptHash % 100000;
  const placementSeed = (promptHash * 7) % 100000;
  const colourSeed = (promptHash * 13) % 100000;

  // Determine color count based on complexity
  const colorCount = complexity === 'low' ? 2 : 3;

  // Use provided palette or generate default
  let colors;
  if (palette && palette.length > 0) {
    colors = palette.slice(0, colorCount).map((c, i) => ({
      code: c.code,
      role: i === 0 ? 'base' : i === 1 ? 'accent' : 'highlight',
      target_ratio: i === 0 ? 0.55 : i === 1 ? 0.30 : 0.15
    }));
  } else {
    // Default palette
    const defaultPalette = ['TPV08', 'TPV11', 'TPV21'];
    colors = defaultPalette.slice(0, colorCount).map((code, i) => ({
      code,
      role: i === 0 ? 'base' : i === 1 ? 'accent' : 'highlight',
      target_ratio: i === 0 ? 0.55 : i === 1 ? 0.30 : 0.15
    }));
  }

  // Complexity parameters
  const complexityParams = {
    low: { bands: 2, amplitude: [0.2, 0.5], smoothness: 0.9, clusters: 2 },
    medium: { bands: 3, amplitude: [0.3, 0.8], smoothness: 0.8, clusters: 3 },
    high: { bands: 4, amplitude: [0.4, 1.0], smoothness: 0.7, clusters: 4 }
  };

  const params = complexityParams[complexity] || complexityParams.medium;

  // Extract title from prompt
  const title = prompt.slice(0, 50).split(/[.!?]/)[0].trim();

  return {
    meta: {
      title: title || 'Custom Design',
      theme: 'custom',
      mood: ['playful']
    },
    surface: {
      width_m: surface.width_m,
      height_m: surface.height_m,
      border_mm: 100
    },
    seeds: {
      global: globalSeed,
      placement: placementSeed,
      colour: colourSeed
    },
    palette: colors,
    grammar: [
      {
        name: 'Bands',
        weight: 0.7,
        params: {
          bands: params.bands,
          amplitude_m: params.amplitude,
          smoothness: params.smoothness
        }
      },
      {
        name: 'Clusters',
        weight: 0.3,
        params: {
          count: params.clusters,
          spread: 0.6
        }
      }
    ],
    motifs: [],
    rules: {
      min_feature_mm: 120,
      min_radius_mm: 600,
      min_gap_mm: 80,
      min_island_area_m2: 0.3,
      max_colours: colors.length,
      max_pieces_per_colour: 25,
      no_acute_angles: true
    }
  };
}

/**
 * Generate LayoutSpec using Llama 3.1 70B Instruct
 */
async function generateLlama3Spec(prompt, surface, palette, complexity) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY
  });

  // Build user prompt
  let userPrompt = `Surface ${surface.width_m}x${surface.height_m} m. Theme "${prompt}".`;

  if (palette && palette.length > 0) {
    const colorCodes = palette.map(c => c.code).join(', ');
    userPrompt += ` Use ${palette.length} specific colours: ${colorCodes}.`;
  } else {
    userPrompt += ' Colours auto.';
  }

  if (complexity === 'low') {
    userPrompt += ' Keep it simple.';
  } else if (complexity === 'high') {
    userPrompt += ' Make it complex and detailed.';
  }

  // Build full conversation with few-shot examples
  const conversation = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  // Add few-shot examples
  for (const example of FEW_SHOT_EXAMPLES) {
    conversation.push({ role: 'user', content: example.user });
    conversation.push({ role: 'assistant', content: example.assistant });
  }

  // Add user request
  conversation.push({ role: 'user', content: userPrompt });

  console.log('[LLAMA3] Calling Replicate API...');
  console.log('[LLAMA3] User prompt:', userPrompt);

  // Call Llama 3.1 70B Instruct
  const output = await replicate.run(
    "meta/meta-llama-3.1-70b-instruct",
    {
      input: {
        prompt: userPrompt,
        system_prompt: SYSTEM_PROMPT,
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 0.9,
        // Note: JSON mode would be ideal but not all models support it
        // We'll parse the output manually
      }
    }
  );

  // Handle streaming response
  let responseText = '';

  if (typeof output === 'string') {
    responseText = output;
  } else if (Array.isArray(output)) {
    responseText = output.join('');
  } else if (output && typeof output[Symbol.asyncIterator] === 'function') {
    for await (const chunk of output) {
      responseText += chunk;
    }
  } else {
    throw new Error('Unexpected Llama 3.1 output format');
  }

  console.log('[LLAMA3] Raw response length:', responseText.length);

  // Extract JSON from response
  const spec = extractJSON(responseText);

  if (!spec) {
    throw new Error('Failed to extract valid JSON from Llama 3.1 response');
  }

  // Validate essential fields
  if (!spec.surface || !spec.palette || !spec.grammar || !spec.rules) {
    throw new Error('Invalid LayoutSpec: missing required fields');
  }

  // Override surface dimensions with actual request values
  spec.surface.width_m = surface.width_m;
  spec.surface.height_m = surface.height_m;

  return spec;
}

/**
 * Extract JSON object from text that may contain markdown or extra content
 */
function extractJSON(text) {
  try {
    // First, try direct parse
    return JSON.parse(text.trim());
  } catch (e) {
    // Try to find JSON block in markdown
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e2) {
        // Continue to next attempt
      }
    }

    // Try to find any JSON object
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch (e3) {
        // Continue to next attempt
      }
    }

    return null;
  }
}

/**
 * Simple string hash function for generating seeds
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
