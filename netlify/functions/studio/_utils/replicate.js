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
 * Generate concept image using Flux Dev with img2img stencil guidance
 * Streamlined single-pipeline generation following TPV Studio spec
 *
 * @param {string} positivePrompt - Full positive prompt from buildFluxPrompt()
 * @param {string} negativePrompt - Negative prompt
 * @param {string} stencilImageUrl - URL of stencil PNG (init image for img2img)
 * @param {Object} options - Generation options
 * @param {string} options.aspect_ratio - Aspect ratio (e.g., "1:1", "4:3", "16:9")
 * @param {number} options.denoise - Denoise strength 0.20-0.35 (default 0.30)
 * @param {number} options.guidance - Guidance scale 3.5-4.5 (default 3.6)
 * @param {number} options.steps - Inference steps 18-20 (default 20)
 * @param {number} options.seed - Random seed (optional)
 * @param {string} options.webhook - Webhook URL for completion callback
 * @returns {Promise<Object>} {predictionId, status, model}
 */
export async function generateConceptFluxDev(positivePrompt, negativePrompt, stencilImageUrl, options = {}) {
  const replicate = getReplicateClient();

  const {
    aspect_ratio = '1:1',
    denoise = parseFloat(process.env.FLUX_DEV_DENOISE || '0.30'),
    guidance = parseFloat(process.env.FLUX_DEV_GUIDANCE || '3.6'),
    steps = parseInt(process.env.FLUX_DEV_STEPS || '20'),
    seed = Math.floor(Math.random() * 1000000),
    webhook = null
  } = options;

  const modelId = 'black-forest-labs/flux-dev';

  console.log(`[REPLICATE] Generating concept with ${modelId}`);
  console.log(`[REPLICATE] Aspect: ${aspect_ratio}, Steps: ${steps}, Guidance: ${guidance}, Denoise: ${denoise}`);
  console.log(`[REPLICATE] Seed: ${seed}`);
  if (webhook) console.log(`[REPLICATE] Webhook: ${webhook}`);

  const startTime = Date.now();

  try {
    // Build Flux Dev input for img2img
    const input = {
      prompt: positivePrompt,
      image: stencilImageUrl,  // Init image for img2img
      prompt_strength: denoise,  // Maps to denoise (0.0-1.0, lower = closer to stencil)
      aspect_ratio: aspect_ratio,
      num_inference_steps: steps,
      guidance: guidance,  // Flux uses 'guidance' not 'guidance_scale'
      seed: seed,
      output_format: 'png',
      output_quality: 90,
      disable_safety_checker: false
    };

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
