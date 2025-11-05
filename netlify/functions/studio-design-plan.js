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

// RH Palette - inline to avoid file loading issues in serverless
const RH_PALETTE_DATA = [
  { code: "RH30", name: "Beige", hex: "#E4C4AA" },
  { code: "RH31", name: "Cream", hex: "#E8E3D8" },
  { code: "RH41", name: "Bright Yellow", hex: "#FFD833" },
  { code: "RH40", name: "Mustard", hex: "#E5A144" },
  { code: "RH50", name: "Orange", hex: "#F15B32" },
  { code: "RH01", name: "Standard Red", hex: "#A5362F" },
  { code: "RH02", name: "Bright Red", hex: "#E21F2F" },
  { code: "RH90", name: "Funky Pink", hex: "#E8457E" },
  { code: "RH21", name: "Purple", hex: "#493D8C" },
  { code: "RH20", name: "Standard Blue", hex: "#0075BC" },
  { code: "RH22", name: "Light Blue", hex: "#47AFE3" },
  { code: "RH23", name: "Azure", hex: "#039DC4" },
  { code: "RH26", name: "Turquoise", hex: "#00A6A3" },
  { code: "RH12", name: "Dark Green", hex: "#006C55" },
  { code: "RH10", name: "Standard Green", hex: "#609B63" },
  { code: "RH11", name: "Bright Green", hex: "#3BB44A" },
  { code: "RH32", name: "Brown", hex: "#8B5F3C" },
  { code: "RH65", name: "Pale Grey", hex: "#D9D9D6" },
  { code: "RH61", name: "Light Grey", hex: "#939598" },
  { code: "RH60", name: "Dark Grey", hex: "#59595B" },
  { code: "RH70", name: "Black", hex: "#231F20" }
];

// Create palette Map
const RH_PALETTE = new Map();
for (const color of RH_PALETTE_DATA) {
  RH_PALETTE.set(color.code, { name: color.name, hex: color.hex });
}

function loadPalette() {
  return RH_PALETTE;
}

// CORS headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Few-shot examples from LLM_fewshot_prompts.md
const SYSTEM_PROMPT = `You are a senior playground surface designer. Convert the brief into LayoutSpec JSON using grammars and motifs that express the mood. Limit to 3 colours unless requested. Use RH codes from the standard palette. Use realistic parameters. Always include seeds.

IMPORTANT: You must ONLY use these grammar names in the "grammar" array:
- "Bands" (flowing horizontal/vertical bands)
- "Clusters" (organic circular island shapes)
- "Islands" (scattered irregular shapes)

Do NOT invent new grammar names. Only use Bands, Clusters, or Islands.

Return ONLY valid JSON matching the LayoutSpec schema. No extra fields. No prose. No markdown formatting.`;

const FEW_SHOT_EXAMPLES = [
  {
    user: 'Surface 5x5 m. Theme "ocean energy". Calm, flowing, playful. Colours auto. Add fish.',
    assistant: JSON.stringify({
      meta: { title: "Ocean Energy", theme: "ocean", mood: ["calm", "flowing", "playful"] },
      surface: { width_m: 5, height_m: 5, border_mm: 100 },
      seeds: { global: 41721, placement: 9182, colour: 1123 },
      palette: [
        { code: "RH22", role: "base", target_ratio: 0.55 },
        { code: "RH23", role: "accent", target_ratio: 0.30 },
        { code: "RH26", role: "highlight", target_ratio: 0.15 }
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
    user: 'Surface 8x4 m. Theme "jungle play". Energetic, lively. Use 3 specific colours: RH10, RH11, RH41.',
    assistant: JSON.stringify({
      meta: { title: "Jungle Play", theme: "jungle", mood: ["energetic", "lively"] },
      surface: { width_m: 8, height_m: 4, border_mm: 100 },
      seeds: { global: 90211, placement: 1234, colour: 3456 },
      palette: [
        { code: "RH10", role: "base", target_ratio: 0.5 },
        { code: "RH11", role: "accent", target_ratio: 0.35 },
        { code: "RH41", role: "highlight", target_ratio: 0.15 }
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
    return new Response('', { status: 204, headers });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
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
      return new Response(JSON.stringify({
        error: 'Invalid prompt',
        message: 'prompt is required and must be a non-empty string'
      }), { status: 400, headers });
    }

    if (!surface || typeof surface.width_m !== 'number' || typeof surface.height_m !== 'number') {
      return new Response(JSON.stringify({
        error: 'Invalid surface',
        message: 'surface must include width_m and height_m as numbers'
      }), { status: 400, headers });
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
      console.log('[DESIGN PLAN] Calling Llama 3.1...');
      const result = await generateLlama3Spec(prompt, surface, palette, complexity);
      spec = result.spec;
      model = `llama-3.1-${result.model}`;
      console.log(`[DESIGN PLAN] Llama 3.1 ${result.model} spec generated successfully`);
    } catch (llama3Error) {
      console.error('[DESIGN PLAN] Llama 3.1 failed, using fallback:', llama3Error.message);
      // Keep using fallbackSpec
    }

    const processingTime = Date.now() - startTime;

    console.log('[DESIGN PLAN] Plan generation complete:', processingTime, 'ms');

    return new Response(JSON.stringify({
      success: true,
      spec,
      model,
      processingTime
    }), { status: 200, headers });

  } catch (error) {
    console.error('[DESIGN PLAN] Error:', error);

    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { status: 500, headers });
  }
}

/**
 * Enforce user's palette on a LayoutSpec
 * NEVER let the LLM choose colors - always use user's selection
 */
function enforcePalette(spec, userPalette) {
  if (!userPalette || userPalette.length < 2) {
    throw new Error('Palette must have at least 2 RH codes');
  }

  const paletteMap = loadPalette();

  // Validate RH codes exist in palette BEFORE assigning roles
  const codes = userPalette.slice(0, 3).map(c => c.code || c);
  for (const code of codes) {
    if (!paletteMap.has(code)) {
      const availableCodes = Array.from(paletteMap.keys()).sort().join(', ');
      throw new Error(`Unknown RH code: ${code}. Available codes: ${availableCodes}`);
    }
  }

  // Define roles and ratios - this is policy, not LLM decision
  const roles = ['base', 'accent', 'highlight'];
  const ratios = [0.55, 0.30, 0.15];

  // Replace LLM's palette with user's selection
  spec.palette = codes.map((code, i) => ({
    code,
    role: roles[i] || 'accent',
    target_ratio: ratios[i] || 0.15
  }));

  // Validate roles
  const validRoles = ['base', 'accent', 'highlight'];
  for (const entry of spec.palette) {
    if (!validRoles.includes(entry.role)) {
      throw new Error(`Invalid palette role: ${entry.role}. Must be base, accent, or highlight`);
    }
  }

  // Validate ratios sum to ~1.0 (allow small floating point error)
  const sumRatios = spec.palette.reduce((sum, p) => sum + p.target_ratio, 0);
  if (Math.abs(sumRatios - 1.0) > 0.01) {
    throw new Error(`Palette ratios must sum to 1.0, got ${sumRatios.toFixed(2)}`);
  }

  console.log('[PALETTE] Enforced user palette:', spec.palette.map(p => {
    const colorInfo = paletteMap.get(p.code);
    return `${p.code}=${colorInfo.hex} "${colorInfo.name}" (${p.role})`;
  }).join(', '));

  return spec;
}

/**
 * Ensure spec has base coverage layer
 * Add Bands grammar with weight ≥0.5 if missing or too weak
 */
function ensureBaseLayer(spec, surface) {
  if (!spec.grammar || !Array.isArray(spec.grammar)) {
    spec.grammar = [];
  }

  // Find existing Bands grammar
  let bandsGrammar = spec.grammar.find(g => g.name === 'Bands');

  if (!bandsGrammar) {
    // No Bands - add one with weight 0.6
    const area_m2 = surface.width_m * surface.height_m;
    const bandCount = Math.max(2, Math.round(area_m2 / 6));  // Scale-aware: A/6

    bandsGrammar = {
      name: 'Bands',
      weight: 0.6,
      params: {
        bands: bandCount,
        amplitude_m: [0.3, 0.7],
        smoothness: 0.7
      }
    };
    spec.grammar.push(bandsGrammar);
    console.log('[BASE LAYER] Added missing Bands grammar with weight 0.6');
  } else if (bandsGrammar.weight < 0.5) {
    // Bands exists but too weak - boost to 0.5
    console.log(`[BASE LAYER] Boosting Bands weight from ${bandsGrammar.weight} to 0.5`);
    bandsGrammar.weight = 0.5;
  }

  // Normalize weights to sum to 1.0
  const totalWeight = spec.grammar.reduce((sum, g) => sum + g.weight, 0);
  if (Math.abs(totalWeight - 1.0) > 0.01) {
    for (const g of spec.grammar) {
      g.weight = g.weight / totalWeight;
    }
    console.log('[BASE LAYER] Normalized grammar weights to sum to 1.0');
  }

  return spec;
}

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
    // Default palette - using real RH codes
    const defaultPalette = ['RH22', 'RH23', 'RH26'];
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
 * Generate headers for Replicate API with optional account/project
 */
function getReplicateHeaders(token, account, project) {
  const headers = {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };

  if (account) {
    headers['X-Replicate-Account'] = account;
  }

  if (project) {
    headers['X-Replicate-Project'] = project;
  }

  return headers;
}

/**
 * Get the latest version ID for a model
 */
async function getModelVersion(token, account, project, modelSlug) {
  const url = `https://api.replicate.com/v1/models/${modelSlug}`;

  const response = await fetch(url, {
    headers: getReplicateHeaders(token, account, project)
  });

  const responseText = await response.text();
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    throw new Error(`Failed to parse model metadata: ${responseText.substring(0, 200)}`);
  }

  if (!response.ok) {
    throw new Error(`Model metadata error ${response.status}: ${JSON.stringify(data)}`);
  }

  return data?.latest_version?.id;
}

/**
 * Generate LayoutSpec using Llama 3.1 with version pinning
 */
async function generateLlama3Spec(prompt, surface, palette, complexity) {
  const token = process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY;
  const account = process.env.REPLICATE_ACCOUNT;
  const project = process.env.REPLICATE_PROJECT;

  if (!token) {
    throw new Error('REPLICATE_API_TOKEN not configured');
  }

  // Build user request
  let userRequest = `Surface ${surface.width_m}x${surface.height_m} m. Theme "${prompt}".`;

  if (palette && palette.length > 0) {
    const colorCodes = palette.map(c => c.code).join(', ');
    userRequest += ` Use ${palette.length} specific colours: ${colorCodes}.`;
  } else {
    userRequest += ' Colours auto.';
  }

  if (complexity === 'low') {
    userRequest += ' Keep it simple.';
  } else if (complexity === 'high') {
    userRequest += ' Make it complex and detailed.';
  }

  // Build complete prompt with system instructions and few-shot examples
  let fullPrompt = `${SYSTEM_PROMPT}\n\n`;

  // Add few-shot examples
  for (const example of FEW_SHOT_EXAMPLES) {
    fullPrompt += `USER: ${example.user}\n\nASSISTANT: ${example.assistant}\n\n`;
  }

  // Add current user request
  fullPrompt += `USER: ${userRequest}\n\nASSISTANT:`;

  console.log('[LLAMA3] Calling Replicate API...');
  console.log('[LLAMA3] User request:', userRequest);
  console.log('[LLAMA3] Full prompt length:', fullPrompt.length);

  // Get version ID for 405B model
  const modelSlug = 'meta/meta-llama-3.1-405b-instruct';
  console.log('[LLAMA3] Fetching version for:', modelSlug);

  const versionId = await getModelVersion(token, account, project, modelSlug);
  console.log('[LLAMA3] Version ID:', versionId);

  // Create prediction with version pinning
  const createUrl = 'https://api.replicate.com/v1/predictions';

  let createResponse = await fetch(createUrl, {
    method: 'POST',
    headers: getReplicateHeaders(token, account, project),
    body: JSON.stringify({
      version: versionId,  // Pin to specific version
      input: {
        prompt: fullPrompt,
        max_tokens: 6000,  // 405B model can generate very detailed designs
        temperature: 0.25,  // Low creativity for consistent, predictable designs
        top_p: 0.85  // Deterministic decoding until more grammars/motifs available
      }
    })
  });

  const createResponseText = await createResponse.text();
  let createData;
  try {
    createData = JSON.parse(createResponseText);
  } catch (e) {
    console.error('[LLAMA3] CREATE - Failed to parse JSON:', createResponseText.substring(0, 500));
    throw new Error(`Replicate create returned invalid JSON: ${createResponseText.substring(0, 200)}`);
  }

  if (!createResponse.ok) {
    console.error('[LLAMA3] CREATE ERROR:', createResponse.status, createData);

    // Retry once on 5xx errors
    if (createResponse.status >= 500) {
      console.log('[LLAMA3] Retrying after 500 error...');
      await new Promise(resolve => setTimeout(resolve, 1200));

      createResponse = await fetch(createUrl, {
        method: 'POST',
        headers: getReplicateHeaders(token, account, project),
        body: JSON.stringify({
          version: versionId,
          input: {
            prompt: fullPrompt,
            max_tokens: 6000,  // Match main call
            temperature: 0.25,  // Low creativity for consistent, predictable designs
            top_p: 0.85  // Deterministic decoding until more grammars/motifs available
          }
        })
      });

      const retryText = await createResponse.text();
      try {
        createData = JSON.parse(retryText);
      } catch (e) {
        throw new Error(`Retry also failed - invalid JSON: ${retryText.substring(0, 200)}`);
      }

      if (!createResponse.ok) {
        console.error('[LLAMA3] RETRY ALSO FAILED:', createResponse.status, createData);
        throw new Error(`Replicate create failed after retry (${createResponse.status}): ${JSON.stringify(createData)}`);
      }
    } else {
      throw new Error(`Replicate create failed (${createResponse.status}): ${JSON.stringify(createData)}`);
    }
  }

  console.log('[LLAMA3] Prediction created:', createData.id);

  // Poll for completion
  let prediction = createData;
  let attempts = 0;
  const maxAttempts = 60; // 90 seconds max

  while (['starting', 'processing', 'queued'].includes(prediction.status) && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    attempts++;

    const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: getReplicateHeaders(token, account, project)
    });

    const pollText = await pollResponse.text();
    let pollData;
    try {
      pollData = JSON.parse(pollText);
    } catch (e) {
      console.error('[LLAMA3] POLL - Failed to parse JSON:', pollText.substring(0, 500));
      throw new Error(`Poll response invalid JSON: ${pollText.substring(0, 200)}`);
    }

    if (!pollResponse.ok) {
      console.error('[LLAMA3] POLL ERROR:', pollResponse.status, pollData);
      throw new Error(`Replicate poll failed (${pollResponse.status}): ${JSON.stringify(pollData)}`);
    }

    prediction = pollData;
    console.log('[LLAMA3] Status:', prediction.status, `(attempt ${attempts}/${maxAttempts})`);
  }

  if (prediction.status === 'failed') {
    console.error('[LLAMA3] Prediction failed:', prediction.error);
    throw new Error(`Replicate prediction failed: ${prediction.error}`);
  }

  if (prediction.status !== 'succeeded') {
    throw new Error(`Prediction timed out or has unexpected status: ${prediction.status}`);
  }

  // Extract response text
  let responseText = '';
  if (typeof prediction.output === 'string') {
    responseText = prediction.output;
  } else if (Array.isArray(prediction.output)) {
    responseText = prediction.output.join('');
  } else {
    throw new Error('Unexpected output format from Llama 3.1');
  }

  console.log('[LLAMA3] Raw response length:', responseText.length);

  // Extract JSON from response
  const spec = extractJSON(responseText);

  if (!spec) {
    console.error('[LLAMA3] Failed to extract JSON from:', responseText.substring(0, 500));
    throw new Error('Failed to extract valid JSON from Llama 3.1 response');
  }

  // Validate essential fields
  if (!spec.surface || !spec.palette || !spec.grammar || !spec.rules) {
    throw new Error('Invalid LayoutSpec: missing required fields');
  }

  // Override surface dimensions with actual request values
  spec.surface.width_m = surface.width_m;
  spec.surface.height_m = surface.height_m;

  // Enforce user's palette - NEVER trust LLM's color choices
  if (palette && palette.length > 0) {
    enforcePalette(spec, palette);
  }

  // Ensure base coverage layer - prevent confetti designs
  ensureBaseLayer(spec, surface);

  return { spec, model: '70b' };
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
