// Replicate API client for FLUX Dev image generation
// TPV Studio streamlined pipeline - img2img with stencil guidance

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
 * Generate concept image using Flux Dev
 * Supports both text-to-image (no stencil) and img2img (with stencil)
 *
 * @param {string} positivePrompt - Full positive prompt from buildFluxPrompt()
 * @param {string} negativePrompt - Negative prompt
 * @param {string|null} stencilImageUrl - URL of stencil PNG (init image for img2img), or null for text-to-image
 * @param {Object} options - Generation options (all parameters should come from prompt.js)
 * @param {string} options.aspect_ratio - Aspect ratio (e.g., "1:1", "4:3", "16:9")
 * @param {number} options.denoise - Prompt strength 0.0-1.0 (for img2img mode)
 * @param {number} options.guidance - Guidance scale
 * @param {number} options.steps - Inference steps
 * @param {number} options.seed - Random seed (optional)
 * @param {string} options.webhook - Webhook URL for completion callback
 * @returns {Promise<Object>} {predictionId, status, model}
 */
export async function generateConceptFluxDev(positivePrompt, negativePrompt, stencilImageUrl, options = {}) {
  const replicate = getReplicateClient();

  // All parameters come from options (populated by prompt.js)
  // No hardcoded defaults here - prompt.js is source of truth
  const {
    aspect_ratio = '1:1',
    denoise,  // Required from options
    guidance,  // Required from options
    steps,  // Required from options
    seed = Math.floor(Math.random() * 1000000),
    webhook = null
  } = options;

  // Validate required parameters
  if (denoise === undefined || guidance === undefined || steps === undefined) {
    throw new Error('Missing required parameters: denoise, guidance, and steps must be provided in options');
  }

  const modelId = 'black-forest-labs/flux-dev';
  const mode = stencilImageUrl ? 'img2img' : 'text-to-image';

  console.log(`[REPLICATE] Generating concept with ${modelId} (${mode})`);
  console.log(`[REPLICATE] Aspect: ${aspect_ratio}, Steps: ${steps}, Guidance: ${guidance}, Prompt Strength: ${denoise}`);
  console.log(`[REPLICATE] Seed: ${seed}`);
  if (stencilImageUrl) console.log(`[REPLICATE] Init image: ${stencilImageUrl}`);
  if (webhook) console.log(`[REPLICATE] Webhook: ${webhook}`);

  const startTime = Date.now();

  try {
    // Build Flux Dev input
    // For text-to-image: omit image and prompt_strength
    // For img2img: include image and prompt_strength
    const input = {
      prompt: positivePrompt,
      aspect_ratio: aspect_ratio,
      num_inference_steps: steps,
      guidance: guidance,
      seed: seed,
      output_format: 'png',
      output_quality: 90,
      disable_safety_checker: false
    };

    // Add img2img-specific parameters only when stencil is provided
    if (stencilImageUrl) {
      input.image = stencilImageUrl;
      input.prompt_strength = denoise;  // 0.0-1.0, higher = more transformation
    }

    // Add negative prompt inline (Flux Dev doesn't have separate negative_prompt param)
    if (negativePrompt && negativePrompt.trim().length > 0) {
      input.prompt = `${positivePrompt} [negative: ${negativePrompt}]`;
    }

    // Create prediction with optional webhook
    const predictionConfig = {
      model: modelId,
      input: input
    };

    if (webhook) {
      predictionConfig.webhook = webhook;
      predictionConfig.webhook_events_filter = ['completed'];
    }

    const prediction = await replicate.predictions.create(predictionConfig);

    const duration = Date.now() - startTime;

    console.log(`[REPLICATE] Prediction created in ${duration}ms: ${prediction.id}`);
    console.log(`[REPLICATE] Status: ${prediction.status}`);

    return {
      predictionId: prediction.id,
      status: prediction.status,
      model: modelId,
      version: prediction.version
    };

  } catch (error) {
    console.error('[REPLICATE] Flux Dev generation failed:', error);
    throw new Error(`Flux Dev generation failed: ${error.message}`);
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
 * Estimate cost for Flux Dev generation
 * Flux Dev pricing: ~$0.025 per image
 * @param {number} count - Number of images
 * @returns {Object} Cost estimate
 */
export function estimateCost(count = 1) {
  const costPerImage = 0.025;  // Flux Dev cost
  const totalCost = count * costPerImage;

  return {
    count,
    costPerImage,
    totalCost,
    currency: 'USD',
    model: 'Flux Dev'
  };
}
