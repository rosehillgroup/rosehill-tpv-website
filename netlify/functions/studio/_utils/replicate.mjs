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
 * Style preset configurations for SDXL - enforces flat vector graphic aesthetic
 * Strong prompts to avoid photorealistic/painterly outputs
 */
export const STYLE_PRESETS = {
  professional: {
    prefix: 'flat vector art, screen print design, bold graphic illustration, paper cutout style, logo design aesthetic, Adobe Illustrator style, simple geometric shapes, solid color fills, poster design, large color blocks, clean edges, corporate identity design',
    negative: 'photorealistic, photograph, 3D render, painting, sketch, watercolor, airbrush, pencil drawing, gradients, shadows, lighting effects, depth, perspective, textures, fine details, intricate patterns, shading, highlights, reflections, blur, bokeh, text, words, letters, typography'
  },
  playful: {
    prefix: 'flat vector art, playful graphic illustration, bold cartoon style, paper craft design, fun poster art, simple colorful shapes, solid fills, friendly geometric forms, children\'s book illustration style, cut paper aesthetic, bold outlines, large simple areas',
    negative: 'photorealistic, photograph, 3D render, detailed painting, watercolor, airbrush, pencil drawing, gradients, soft shadows, lighting effects, depth, perspective, fine textures, intricate details, shading, highlights, reflections, blur, sophisticated rendering, text, words'
  },
  geometric: {
    prefix: 'flat vector art, geometric abstract design, mathematical shapes, hard edge painting, constructivist poster, Bauhaus style, pure geometric forms, sharp angles, clean lines, color field design, minimalist graphic, architectural abstraction, precise geometry',
    negative: 'photorealistic, photograph, 3D render, organic shapes, curved lines, painting textures, gradients, shadows, lighting, depth, perspective, fine details, decorative patterns, shading, soft edges, naturalistic forms, hand-drawn, sketchy, text, words'
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
    model: 'SDXL + IP-Adapter'
  };
}



