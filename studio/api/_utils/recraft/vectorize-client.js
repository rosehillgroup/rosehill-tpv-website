// Recraft Vectorize API client - converts raster images to SVG via Replicate
// Uses recraft-ai/recraft-vectorize model

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
 * Vectorize a raster image using Recraft via Replicate
 * @param {object} params - Vectorization parameters
 * @param {string} params.imageUrl - URL to the raster image (PNG/JPG)
 * @param {string} params.webhook - Webhook URL for async callback
 * @param {string} params.jobId - Job ID for tracking
 * @returns {Promise<object>} { predictionId, status, model }
 */
export async function vectorizeImage(params) {
  const {
    imageUrl,
    webhook = null,
    jobId = null
  } = params;

  // Validate required parameters
  if (!imageUrl) throw new Error('imageUrl is required');

  const replicate = getReplicateClient();
  const modelId = 'recraft-ai/recraft-vectorize';

  console.log(`[RECRAFT-VECTORIZE] Vectorizing image with ${modelId}`);
  console.log(`[RECRAFT-VECTORIZE] Job ID: ${jobId || 'none'}`);
  console.log(`[RECRAFT-VECTORIZE] Image URL: ${imageUrl}`);
  if (webhook) console.log(`[RECRAFT-VECTORIZE] Webhook: ${webhook}`);

  const startTime = Date.now();

  try {
    // Build input for vectorization
    const input = {
      image: imageUrl,
      output_format: 'svg'
    };

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

    const elapsed = Date.now() - startTime;
    console.log(`[RECRAFT-VECTORIZE] Prediction created in ${elapsed}ms: ${prediction.id}`);
    console.log(`[RECRAFT-VECTORIZE] Status: ${prediction.status}`);

    return {
      predictionId: prediction.id,
      status: prediction.status,
      model: modelId,
      imageUrl: imageUrl
    };

  } catch (error) {
    console.error('[RECRAFT-VECTORIZE] Error creating prediction:', error);
    throw error;
  }
}
