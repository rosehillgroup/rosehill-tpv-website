// Recraft API client for SVG vector generation via Replicate
// TPV Studio Recraft integration - direct SVG output with TPV surfacing constraints

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
 * Build TPV-optimized prompt for Recraft
 * @param {string} userPrompt - User's design description
 * @param {number} maxColours - Maximum color palette size
 * @param {string|null} correction - Inspector's suggested correction from previous attempt
 * @returns {string} Enhanced prompt with TPV constraints
 */
export function buildRecraftPrompt(userPrompt, maxColours, correction = null) {
  const baseConstraints = `Playground TPV rubber surfacing design, overhead top-down view.
Flat vector illustration with large smooth shapes and bold silhouettes.
No buildings, no playground equipment, no slides, no climbing frames, no benches, no people.
No outlines or strokes, flat fills only, strictly no gradients or texture or shading.
Installer-friendly geometry with big contiguous regions and minimal small details.
Limit palette to ${maxColours} flat colours, harmonious and playful.`;

  const userSection = `User description: ${userPrompt}`;

  const focusPoints = `Focus on:
- Simple, abstract shapes that suggest the theme.
- Large character or motif silhouettes if relevant (fish, stars, leaves, etc.).
- Clear separation between colour regions.
- Overhead view, strictly 2D, no perspective or isometric.`;

  // Add correction from inspector if provided (retry attempt)
  const correctionSection = correction
    ? `\n\nIMPORTANT CORRECTIONS FROM PREVIOUS ATTEMPT:\n${correction}`
    : '';

  return `${baseConstraints}\n\n${userSection}\n\n${focusPoints}${correctionSection}`;
}

/**
 * Calculate aspect ratio and pixel dimensions from mm dimensions
 * @param {number} width_mm - Width in millimeters
 * @param {number} length_mm - Height/length in millimeters
 * @returns {object} { width_px, height_px, aspect_ratio }
 */
export function calculateDimensions(width_mm, length_mm) {
  const canvasPx = parseInt(process.env.RECRAFT_CANVAS_PX || '2048', 10);

  // Calculate ratio
  const ratio = width_mm / length_mm;

  let width_px, height_px;

  if (ratio >= 1) {
    // Wider than tall (landscape)
    width_px = canvasPx;
    height_px = Math.round(canvasPx / ratio);
  } else {
    // Taller than wide (portrait)
    height_px = canvasPx;
    width_px = Math.round(canvasPx * ratio);
  }

  // Ensure dimensions are at least 256px (Recraft minimum)
  width_px = Math.max(256, width_px);
  height_px = Math.max(256, height_px);

  // Format aspect ratio string
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(Math.round(ratio * 100), 100);
  const aspect_ratio = `${Math.round(ratio * 100) / divisor}:${100 / divisor}`;

  return { width_px, height_px, aspect_ratio };
}

/**
 * Generate SVG using Recraft via Replicate
 * @param {object} params - Generation parameters
 * @param {string} params.prompt - User prompt (will be enhanced with TPV constraints)
 * @param {number} params.width_mm - Canvas width in mm
 * @param {number} params.length_mm - Canvas height in mm
 * @param {number} params.max_colours - Maximum palette size (3-8)
 * @param {number} params.seed - Random seed for reproducibility
 * @param {string} params.correction - Inspector correction from previous attempt (for retries)
 * @param {string} params.webhook - Webhook URL for async callback
 * @param {string} params.jobId - Job ID for tracking
 * @returns {Promise<object>} { predictionId, status, model }
 */
export async function generateRecraftSvg(params) {
  const {
    prompt,
    width_mm,
    length_mm,
    max_colours,
    seed = Math.floor(Math.random() * 1000000),
    correction = null,
    webhook = null,
    jobId = null
  } = params;

  // Validate required parameters
  if (!prompt) throw new Error('prompt is required');
  if (!width_mm || !length_mm) throw new Error('width_mm and length_mm are required');
  if (!max_colours || max_colours < 3 || max_colours > 8) {
    throw new Error('max_colours must be between 3 and 8');
  }

  const replicate = getReplicateClient();
  const modelId = process.env.RECRAFT_MODEL || 'recraft-ai/recraft-v3-svg';

  // Build enhanced prompt
  const enhancedPrompt = buildRecraftPrompt(prompt, max_colours, correction);

  // Calculate pixel dimensions
  const { width_px, height_px, aspect_ratio } = calculateDimensions(width_mm, length_mm);

  console.log(`[RECRAFT] Generating SVG with ${modelId}`);
  console.log(`[RECRAFT] Job ID: ${jobId || 'none'}`);
  console.log(`[RECRAFT] Dimensions: ${width_mm}mm x ${length_mm}mm → ${width_px}px x ${height_px}px (${aspect_ratio})`);
  console.log(`[RECRAFT] Max colours: ${max_colours}`);
  console.log(`[RECRAFT] Seed: ${seed}`);
  if (correction) console.log(`[RECRAFT] Correction applied: ${correction.substring(0, 100)}...`);
  if (webhook) console.log(`[RECRAFT] Webhook: ${webhook}`);

  const startTime = Date.now();

  try {
    // Build Recraft input
    // Note: Actual Recraft API parameters may vary - adjust based on model documentation
    const input = {
      prompt: enhancedPrompt,
      width: width_px,
      height: height_px,
      seed: seed,
      style: 'line_art', // Recraft style: "any", "engraving", "line_art", "line_circuit", "linocut"
      output_format: 'svg'
    };

    // Try to pass color_palette_size if Recraft supports it
    // If not supported, inspector will validate color count
    if (max_colours) {
      input.color_palette_size = max_colours;
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

    const elapsed = Date.now() - startTime;
    console.log(`[RECRAFT] Prediction created in ${elapsed}ms: ${prediction.id}`);
    console.log(`[RECRAFT] Status: ${prediction.status}`);

    return {
      predictionId: prediction.id,
      status: prediction.status,
      model: modelId,
      urls: prediction.urls || {},
      elapsed
    };
  } catch (error) {
    console.error('[RECRAFT] Failed to create prediction:', error.message);

    // Check for specific Recraft errors
    if (error.message?.includes('color_palette_size')) {
      console.warn('[RECRAFT] Model does not support color_palette_size parameter, will rely on prompt + inspector');
      // Retry without color_palette_size
      const inputWithoutColor = { ...input };
      delete inputWithoutColor.color_palette_size;

      try {
        const prediction = await replicate.predictions.create({
          model: modelId,
          input: inputWithoutColor,
          webhook,
          webhook_events_filter: webhook ? ['completed'] : undefined
        });

        return {
          predictionId: prediction.id,
          status: prediction.status,
          model: modelId,
          urls: prediction.urls || {},
          elapsed: Date.now() - startTime
        };
      } catch (retryError) {
        throw new Error(`Recraft generation failed: ${retryError.message}`);
      }
    }

    throw new Error(`Recraft generation failed: ${error.message}`);
  }
}

/**
 * Download SVG from Replicate output URL
 * @param {string} url - URL of the SVG output
 * @returns {Promise<string>} SVG content as string
 */
export async function downloadSvg(url) {
  try {
    console.log(`[RECRAFT] Downloading SVG from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const svgString = await response.text();

    console.log(`[RECRAFT] Downloaded SVG (${svgString.length} bytes)`);

    // Basic validation
    if (!svgString.includes('<svg')) {
      throw new Error('Downloaded content does not appear to be valid SVG');
    }

    return svgString;
  } catch (error) {
    console.error('[RECRAFT] Failed to download SVG:', error.message);
    throw new Error(`SVG download failed: ${error.message}`);
  }
}

/**
 * Get prediction status (for polling if needed)
 * @param {string} predictionId - Prediction ID from generateRecraftSvg
 * @returns {Promise<object>} Prediction object with status and output
 */
export async function getPrediction(predictionId) {
  const replicate = getReplicateClient();

  try {
    const prediction = await replicate.predictions.get(predictionId);
    return prediction;
  } catch (error) {
    console.error('[RECRAFT] Failed to get prediction:', error.message);
    throw error;
  }
}

/**
 * Cancel a running prediction
 * @param {string} predictionId - Prediction ID to cancel
 * @returns {Promise<object>} Cancelled prediction object
 */
export async function cancelPrediction(predictionId) {
  const replicate = getReplicateClient();

  try {
    const prediction = await replicate.predictions.cancel(predictionId);
    console.log(`[RECRAFT] Cancelled prediction: ${predictionId}`);
    return prediction;
  } catch (error) {
    console.error('[RECRAFT] Failed to cancel prediction:', error.message);
    throw error;
  }
}
