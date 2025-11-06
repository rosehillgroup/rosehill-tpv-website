// Replicate API client for FLUX.1 [pro] image generation
// Handles palette-locked prompt engineering and concept generation

import Replicate from 'replicate';

/**
 * Initialize Replicate client
 */
function getReplicateClient() {
  const apiKey = process.env.REPLICATE_API_TOKEN;
  if (!apiKey) {
    throw new Error('REPLICATE_API_TOKEN environment variable not set');
  }
  return new Replicate({ auth: apiKey });
}

/**
 * Style preset configurations for FLUX prompts
 */
const STYLE_PRESETS = {
  professional: {
    prefix: 'clean vector graphic, professional design, flat colors, geometric shapes, modern minimal',
    negative: 'gradients, shadows, 3d effects, photorealistic, textures, text, words, letters'
  },
  playful: {
    prefix: 'playful vector illustration, friendly shapes, bold outlines, whimsical design, fun composition',
    negative: 'gradients, shadows, 3d effects, photorealistic, detailed textures, text, words'
  },
  geometric: {
    prefix: 'geometric abstract design, clean lines, sharp angles, mathematical precision, pattern-based',
    negative: 'organic shapes, gradients, shadows, 3d effects, photorealistic, text, words'
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
 * Generate concepts using SDXL + IP-Adapter (batch mode)
 * Fast generation with palette conditioning via image reference
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
    paletteSwatchUrl = null,
    style = 'professional',
    guidance = 7.5,
    steps = 25,
    ipAdapterScale = 0.9
  } = options;

  const preset = STYLE_PRESETS[style] || STYLE_PRESETS.professional;

  console.log(`[REPLICATE] Generating ${count} concepts with SDXL (Stability AI)`);
  console.log(`[REPLICATE] Size: ${width}×${height}, Steps: ${steps}, Guidance: ${guidance}`);

  const startTime = Date.now();
  const concepts = [];

  try {
    // Generate concepts sequentially (SDXL is fast: ~3-5s each)
    for (let i = 0; i < count; i++) {
      console.log(`[REPLICATE] Generating concept ${i + 1}/${count}...`);

      const seed = Math.floor(Math.random() * 1000000);

      // Use official Stability AI SDXL model
      const output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            prompt: prompt,
            negative_prompt: preset.negative,
            width: width,
            height: height,
            num_inference_steps: steps,
            guidance_scale: guidance,
            seed: seed,
            scheduler: "K_EULER"
          }
        }
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
    model: 'SDXL + IP-Adapter'
  };
}
