// Replicate API client for FLUX.1 [pro] image generation
// Handles palette-locked prompt engineering and concept generation

import Replicate from 'replicate';
/**
 * Initialize Replicate client
 */
export function getReplicateClient() {
  const apiKey = process.env.REPLICATE_API_TOKEN;
  if (!apiKey) {
    throw new Error('REPLICATE_API_TOKEN environment variable not set');
  }
  return new Replicate({ auth: apiKey });
}

/**
 * Style preset configurations for SDXL - Multi-pass surgical prompts
 * Enforces flat vector graphic aesthetic with material-first approach
 */
export const STYLE_PRESETS = {
  professional: {
    // Base draft: material description only
    baseDraft: 'rubber granule surfacing, TPV playground surface, matte finish, subtle micro-shadowing, no gradients larger than 3% luminance, no outlines, installer-friendly geometry, large smooth curves, photoreal texture',

    // Bands/clusters: flowing organic forms
    bands: 'flowing bands, macro undulation, no high-frequency detail, clean border joins, installer-friendly transitions, smooth color blocks',

    // Motifs: bold recognizable shapes
    motifs: 'bold icon silhouette, ≤3 interior cuts, large radii, no tiny cavities, simple recognizable shapes, installer-friendly geometry, large smooth forms',

    // Unified negative (all passes)
    negative: 'text, logo marks, thin strokes, serif letters, halftone, bevel, metallic, glossy, watercolor, oil paint, fine details, busy patterns, sharp angles, gradients, shadows, lighting effects, depth, perspective',

    // Legacy prefix for backwards compatibility
    prefix: 'flat vector art, screen print design, bold graphic illustration, paper cutout style, clean edges, solid color fills'
  },
  playful: {
    baseDraft: 'rubber granule surfacing, playful TPV surface, matte finish, friendly curves, subtle micro-shadowing, no gradients larger than 3% luminance, no outlines, large simple shapes',
    bands: 'playful flowing bands, fun undulations, cheerful transitions, clean joins, bold color blocks',
    motifs: 'fun bold icon, ≤3 interior shapes, large friendly radii, simple happy forms, no tiny details',
    negative: 'text, logo marks, thin strokes, serif letters, halftone, bevel, metallic, glossy, watercolor, oil paint, fine details, busy patterns, sophisticated rendering, gradients, shadows',
    prefix: 'flat vector art, playful graphic illustration, bold cartoon style, paper craft design, solid fills'
  },
  geometric: {
    baseDraft: 'rubber granule surfacing, geometric TPV surface, matte finish, mathematical precision, subtle micro-shadowing, no gradients, sharp clean edges, installer-friendly geometry',
    bands: 'geometric bands, precise transitions, mathematical undulations, clean angular joins, bold color fields',
    motifs: 'geometric icon, ≤3 interior angles, precise radii, mathematical forms, architectural shapes',
    negative: 'text, logo marks, thin strokes, organic shapes, curved lines, halftone, bevel, metallic, glossy, watercolor, oil paint, decorative patterns, gradients, shadows',
    prefix: 'flat vector art, geometric abstract design, mathematical shapes, hard edge painting, precise geometry'
  }
};

/**
 * Build palette-locked prompt for FLUX
 * Injects color guidance into the prompt
 * @param {string} userPrompt - User's design description
 * @param {Array} paletteColors - Array of {code, hex, name}
 * @param {string} style - Style preset name
 * @returns {string} Enhanced prompt
 */
export function buildPalettePrompt(userPrompt, paletteColors, style = 'professional') {
  const preset = STYLE_PRESETS[style] || STYLE_PRESETS.professional;

  // Extract color descriptions
  const colorDescriptions = paletteColors.map(c => `${c.name} (${c.hex})`).join(', ');
  const colorCount = paletteColors.length;

  // Build enhanced prompt
  const prompt = [
    preset.prefix,
    userPrompt,
    `using ONLY these ${colorCount} specific colors: ${colorDescriptions}`,
    'flat vector design with clean edges and solid fills',
    'no gradients, no shading, no texture details'
  ].join(', ');

  console.log('[REPLICATE] Enhanced prompt:', prompt);
  return prompt;
}

/**
 * Generate concept images using FLUX.1 [pro]
 * @param {string} prompt - Enhanced prompt with palette guidance
 * @param {Object} options - Generation options
 * @returns {Promise<Array>} Array of image URLs
 */
export async function generateConcepts(prompt, options = {}) {
  const replicate = getReplicateClient();

  const {
    count = 6,
    width = 1024,
    height = 1024,
    aspectRatio = '1:1',
    style = 'professional',
    guidance = 3.5, // Strength of prompt adherence (2-5)
    steps = 28 // Quality vs speed tradeoff (20-50)
  } = options;

  console.log(`[REPLICATE] Generating ${count} concepts with FLUX.1 [pro]`);
  console.log(`[REPLICATE] Size: ${width}x${height}, Guidance: ${guidance}, Steps: ${steps}`);

  const startTime = Date.now();

  try {
    // Generate concepts in parallel batches
    // FLUX.1 [pro] supports batch generation, but we'll do sequential for better error handling
    const concepts = [];
    const preset = STYLE_PRESETS[style] || STYLE_PRESETS.professional;

    for (let i = 0; i < count; i++) {
      console.log(`[REPLICATE] Generating concept ${i + 1}/${count}...`);

      const output = await replicate.run(
        "black-forest-labs/flux-1.1-pro",
        {
          input: {
            prompt: prompt,
            aspect_ratio: aspectRatio,
            output_format: "png",
            output_quality: 90,
            safety_tolerance: 2,
            prompt_upsampling: true,
            // Additional seed variation for each concept
            seed: Math.floor(Math.random() * 1000000)
          }
        }
      );

      // FLUX returns a URL or array of URLs
      const imageUrl = Array.isArray(output) ? output[0] : output;

      concepts.push({
        id: `concept_${Date.now()}_${i}`,
        imageUrl,
        seed: i,
        index: i
      });

      console.log(`[REPLICATE] Concept ${i + 1} complete: ${imageUrl}`);
    }

    const duration = Date.now() - startTime;
    console.log(`[REPLICATE] Generated ${concepts.length} concepts in ${duration}ms`);

    return concepts;

  } catch (error) {
    console.error('[REPLICATE] Generation failed:', error);
    throw new Error(`FLUX generation failed: ${error.message}`);
  }
}

/**
 * Download image from URL to buffer
 * @param {string} url - Image URL from Replicate
 * @returns {Promise<Buffer>} Image buffer
 */
export async function downloadImage(url) {
  console.log(`[REPLICATE] Downloading image: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('[REPLICATE] Download failed:', error);
    throw new Error(`Image download failed: ${error.message}`);
  }
}

/**
 * Estimate cost for generation
 * FLUX.1 [pro] pricing: ~$0.055 per image
 * @param {number} count - Number of concepts to generate
 * @returns {Object} Cost estimate
 */
export function estimateCost(count) {
  const costPerImage = 0.055;
  const totalCost = count * costPerImage;

  return {
    count,
    costPerImage,
    totalCost,
    currency: 'USD'
  };
}

/**
 * Generate concepts using SDXL (txt2img or img2img mode)
 * Supports both text-to-image and image-to-image generation
 * @param {string} prompt - Enhanced prompt
 * @param {Object} options - Generation options
 * @returns {Promise<Array>} Array of {imageUrl, seed, index}
 */
export async function generateConceptsSDXL(prompt, options = {}) {
  const replicate = getReplicateClient();

  const {
    count = 6,
    width = 1024,
    height = 1024,
    init_image = null, // Base64 data URI or URL for img2img
    denoise_strength = 0.3, // For img2img: 0.25-0.35 (lower = more structure preservation)
    paletteSwatchUrl = null, // Unused for now (IP-Adapter removed)
    style = 'professional',
    guidance = 7.5,
    steps = 25
  } = options;

  const preset = STYLE_PRESETS[style] || STYLE_PRESETS.professional;

  const mode = init_image ? 'img2img' : 'txt2img';
  console.log(`[REPLICATE] Generating ${count} concepts with SDXL ${mode} (Stability AI)`);
  console.log(`[REPLICATE] Size: ${width}×${height}, Steps: ${steps}, Guidance: ${guidance}`);

  if (init_image) {
    console.log(`[REPLICATE] img2img mode: denoise_strength=${denoise_strength}`);
  }

  const startTime = Date.now();
  const concepts = [];

  try {
    // Generate concepts sequentially (SDXL is fast: ~3-5s each)
    for (let i = 0; i < count; i++) {
      console.log(`[REPLICATE] Generating concept ${i + 1}/${count}...`);

      const seed = Math.floor(Math.random() * 1000000);

      // Use official Stability AI SDXL model
      // Build model input (different for txt2img vs img2img)
      const modelInput = {
        prompt: prompt,
        negative_prompt: preset.negative,
        num_inference_steps: steps,
        guidance_scale: guidance,
        seed: seed,
        scheduler: "K_EULER"
      };

      // Add mode-specific parameters
      if (init_image) {
        // img2img mode: use init_image and prompt_strength
        modelInput.image = init_image;
        modelInput.prompt_strength = denoise_strength; // How much to transform (0.25-0.35 = preserve structure)
      } else {
        // txt2img mode: specify dimensions
        modelInput.width = width;
        modelInput.height = height;
      }

      const output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        { input: modelInput }
      );

      // SDXL returns URL or array
      const imageUrl = Array.isArray(output) ? output[0] : output;

      concepts.push({
        id: `concept_${Date.now()}_${i}`,
        imageUrl,
        seed,
        index: i
      });

      console.log(`[REPLICATE] Concept ${i + 1} complete: ${imageUrl}`);
    }

    const duration = Date.now() - startTime;
    console.log(`[REPLICATE] Generated ${concepts.length} concepts in ${duration}ms`);

    return concepts;

  } catch (error) {
    console.error('[REPLICATE] SDXL generation failed:', error);
    throw new Error(`SDXL generation failed: ${error.message}`);
  }
}

/**
 * Estimate cost for SDXL generation
 * SDXL pricing: ~$0.03 per image
 * @param {number} count - Number of concepts
 * @returns {Object} Cost estimate
 */
export function estimateCostSDXL(count) {
  const costPerImage = 0.03;
  const totalCost = count * costPerImage;

  return {
    count,
    costPerImage,
    totalCost,
    currency: 'USD',
    model: 'SDXL'
  };
}

/**
 * Generate draft image using SDXL (Pass 1: Base Draft)
 * Fast, stable parameters for initial composition
 * @param {string} prompt - User prompt
 * @param {string} initImage - Base stencil URL
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} {imageUrl, seed}
 */
export async function generateDraftSDXL(prompt, initImage, options = {}) {
  const replicate = getReplicateClient();

  const {
    width = 1024,
    height = 1024,
    style = 'professional',
    steps = parseInt(process.env.IMG_DRAFT_STEPS || '18'),
    guidance = parseFloat(process.env.IMG_DRAFT_CFG || '5.0'),
    denoiseStrength = parseFloat(process.env.IMG_DRAFT_STRENGTH || '0.40'),
    seed = Math.floor(Math.random() * 1000000)
  } = options;

  const preset = STYLE_PRESETS[style] || STYLE_PRESETS.professional;

  console.log(`[REPLICATE] Pass 1: Generating draft with SDXL`);
  console.log(`[REPLICATE] Steps: ${steps}, CFG: ${guidance}, Denoise: ${denoiseStrength}`);

  // Build draft prompt (material-first, no theme words yet)
  const draftPrompt = `${preset.baseDraft}. ${prompt}`;

  const modelInput = {
    prompt: draftPrompt,
    negative_prompt: preset.negative,
    image: initImage,
    prompt_strength: denoiseStrength, // How much to transform
    num_inference_steps: steps,
    guidance_scale: guidance,
    seed,
    scheduler: 'K_EULER' // Fast, stable scheduler
  };

  const startTime = Date.now();

  try {
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      { input: modelInput }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;
    const duration = Date.now() - startTime;

    console.log(`[REPLICATE] Draft generated in ${duration}ms: ${imageUrl}`);

    return { imageUrl, seed };

  } catch (error) {
    console.error('[REPLICATE] Draft generation failed:', error);
    throw new Error(`Draft SDXL failed: ${error.message}`);
  }
}

/**
 * Refine specific region using masked img2img (Pass 2: Region Refinement)
 * Role-specific parameters for targeted improvements
 * @param {string} initImage - Current image URL
 * @param {string} maskImage - Region mask URL (white = refine, black = preserve)
 * @param {string} prompt - User prompt
 * @param {string} regionType - 'base' | 'accent' | 'highlight'
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} {imageUrl, seed}
 */
export async function refineRegionSDXL(initImage, maskImage, prompt, regionType, options = {}) {
  const replicate = getReplicateClient();

  const {
    style = 'professional',
    seed = Math.floor(Math.random() * 1000000)
  } = options;

  const preset = STYLE_PRESETS[style] || STYLE_PRESETS.professional;

  // Role-specific parameters (surgical precision)
  let steps, guidance, denoiseStrength, regionPrompt;

  if (regionType === 'base') {
    // Base regions: preserve most structure
    steps = parseInt(process.env.IMG_ACCENT_STEPS || '20');
    guidance = parseFloat(process.env.IMG_ACCENT_CFG || '5.5');
    denoiseStrength = parseFloat(process.env.IMG_ACCENT_STRENGTH || '0.32');
    regionPrompt = `${preset.baseDraft}. ${prompt}`;
  } else if (regionType === 'accent') {
    // Accent regions (bands/clusters): moderate refinement
    steps = parseInt(process.env.IMG_ACCENT_STEPS || '20');
    guidance = parseFloat(process.env.IMG_ACCENT_CFG || '5.5');
    denoiseStrength = parseFloat(process.env.IMG_ACCENT_STRENGTH || '0.32');
    regionPrompt = `${preset.bands}. ${prompt}`;
  } else if (regionType === 'highlight') {
    // Highlight regions (motifs): more freedom for detail
    steps = parseInt(process.env.IMG_HIGHLIGHT_STEPS || '21');
    guidance = parseFloat(process.env.IMG_HIGHLIGHT_CFG || '6.0');
    denoiseStrength = parseFloat(process.env.IMG_HIGHLIGHT_STRENGTH || '0.54');
    regionPrompt = `${preset.motifs}. ${prompt}`;
  } else {
    throw new Error(`Unknown region type: ${regionType}`);
  }

  console.log(`[REPLICATE] Pass 2: Refining ${regionType} region`);
  console.log(`[REPLICATE] Steps: ${steps}, CFG: ${guidance}, Denoise: ${denoiseStrength}`);

  const modelInput = {
    prompt: regionPrompt,
    negative_prompt: preset.negative,
    image: initImage,
    mask: maskImage,
    prompt_strength: denoiseStrength,
    num_inference_steps: steps,
    guidance_scale: guidance,
    seed,
    scheduler: 'K_EULER'
  };

  const startTime = Date.now();

  try {
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      { input: modelInput }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;
    const duration = Date.now() - startTime;

    console.log(`[REPLICATE] ${regionType} refined in ${duration}ms: ${imageUrl}`);

    return { imageUrl, seed };

  } catch (error) {
    console.error(`[REPLICATE] Region refinement failed (${regionType}):`, error);
    throw new Error(`Region SDXL failed: ${error.message}`);
  }
}

/**
 * Build region-specific prompt
 * @param {string} userPrompt - User's design description
 * @param {string} role - 'base' | 'accent' | 'highlight'
 * @param {string} style - Style preset name
 * @returns {string} Role-specific prompt
 */
export function buildRegionPrompt(userPrompt, role, style = 'professional') {
  const preset = STYLE_PRESETS[style] || STYLE_PRESETS.professional;

  if (role === 'base') {
    return `${preset.baseDraft}. ${userPrompt}`;
  } else if (role === 'accent') {
    return `${preset.bands}. ${userPrompt}`;
  } else if (role === 'highlight') {
    return `${preset.motifs}. ${userPrompt}`;
  } else {
    // Fallback
    return `${preset.baseDraft}. ${userPrompt}`;
  }
}

/**
 * Create text-to-image prediction with webhook (Inspiration Mode - Simple Pipeline)
 * Submits async prediction and returns prediction ID for webhook tracking
 * @param {Object} params - Generation parameters
 * @param {string} params.prompt - Full prompt with style and material anchoring
 * @param {string} params.negative_prompt - Negative prompt
 * @param {number} params.width - Image width in pixels
 * @param {number} params.height - Image height in pixels
 * @param {number} params.steps - Number of inference steps
 * @param {number} params.guidance - Guidance scale (CFG)
 * @param {string} params.scheduler - Scheduler type (K_EULER, DPM++, etc.)
 * @param {number} params.seed - Random seed for reproducibility
 * @param {number} params.num_outputs - Number of images to generate (default: 1)
 * @param {string} params.webhook - Webhook URL for completion callback
 * @returns {Promise<Object>} {predictionId, version, model}
 */
export async function createText2ImagePrediction(params) {
  const replicate = getReplicateClient();

  const {
    prompt,
    negative_prompt,
    width,
    height,
    steps,
    guidance,
    scheduler = 'K_EULER',
    seed,
    num_outputs = 1,
    webhook
  } = params;

  // Use FLUX.1-dev for high-quality, designer-friendly results
  // Better quality than schnell with proper guidance and negative prompts
  const modelId = 'black-forest-labs/flux-dev';

  console.log(`[REPLICATE] Creating text→image prediction with ${modelId}`);
  console.log(`[REPLICATE] Size: ${width}×${height}, Steps: ${steps}, CFG: ${guidance}, Seed: ${seed}`);
  console.log(`[REPLICATE] Webhook: ${webhook}`);

  const startTime = Date.now();

  try {
    // Build input based on model
    let input;
    if (modelId.includes('flux')) {
      // FLUX models (dev supports negative prompts, schnell doesn't)
      input = {
        prompt,
        width,
        height,
        num_inference_steps: steps,
        guidance: guidance, // FLUX-dev uses 'guidance' not 'guidance_scale'
        seed,
        num_outputs,
        output_format: 'png',
        output_quality: 90,
        prompt_upsampling: false, // We write good prompts!
        disable_safety_checker: false
      };

      // Add negative_prompt if model is flux-dev (not schnell)
      if (modelId.includes('flux-dev') && negative_prompt) {
        input.prompt = `${prompt} [negative: ${negative_prompt}]`;
      }
    } else {
      // SDXL fallback (legacy)
      input = {
        prompt,
        negative_prompt,
        width,
        height,
        num_inference_steps: steps,
        guidance_scale: guidance,
        scheduler,
        seed,
        num_outputs
      };
    }

    // Create prediction with webhook using model name (Replicate will resolve latest version)
    const prediction = await replicate.predictions.create({
      model: modelId,
      input,
      webhook,
      webhook_events_filter: ['completed']
    });

    const duration = Date.now() - startTime;

    console.log(`[REPLICATE] Prediction created in ${duration}ms: ${prediction.id}`);
    console.log(`[REPLICATE] Status: ${prediction.status}`);

    return {
      predictionId: prediction.id,
      version: prediction.version,
      model: modelId,
      status: prediction.status
    };

  } catch (error) {
    console.error('[REPLICATE] Prediction creation failed:', error);
    throw new Error(`Text→image prediction failed: ${error.message}`);
  }
}

/**
 * Get prediction status (for polling/reconciliation)
 * @param {string} predictionId - Prediction ID
 * @returns {Promise<Object>} Prediction object with status and output
 */
export async function getPrediction(predictionId) {
  const replicate = getReplicateClient();

  try {
    const prediction = await replicate.predictions.get(predictionId);

    return {
      id: prediction.id,
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
      metrics: prediction.metrics
    };

  } catch (error) {
    console.error(`[REPLICATE] Failed to get prediction ${predictionId}:`, error);
    throw new Error(`Get prediction failed: ${error.message}`);
  }
}

/**
 * Cancel a running prediction (for cleanup/timeout scenarios)
 * @param {string} predictionId - Prediction ID
 * @returns {Promise<Object>} Cancelled prediction
 */
export async function cancelPrediction(predictionId) {
  const replicate = getReplicateClient();

  try {
    const prediction = await replicate.predictions.cancel(predictionId);

    console.log(`[REPLICATE] Cancelled prediction ${predictionId}`);

    return {
      id: prediction.id,
      status: prediction.status
    };

  } catch (error) {
    console.error(`[REPLICATE] Failed to cancel prediction ${predictionId}:`, error);
    throw new Error(`Cancel prediction failed: ${error.message}`);
  }
}

/**
 * Estimate cost for simple text2image generation
 * FLUX.1-schnell pricing: ~$0.003 per image (fast, clean results)
 * @param {number} count - Number of images
 * @returns {Object} Cost estimate
 */
export function estimateCostSimple(count = 1) {
  const costPerImage = 0.003; // FLUX.1-schnell cost (optimized)
  const totalCost = count * costPerImage;

  return {
    count,
    costPerImage,
    totalCost,
    currency: 'USD',
    model: 'FLUX.1-schnell (simple mode)'
  };
}
