// Flux Dev Mood Board Generation System
// Pass 1: Text-to-image mood board generation (atmospheric concept art)
// Pass 2: DISABLED for mood boards (preserve expressive atmosphere)

import { generateConceptFluxDev } from './replicate.js';
import { buildFluxPrompt } from './prompt.js';

/**
 * Initiate Pass 1: Pure text-to-image mood board generation
 * Full creative freedom for atmospheric concept art
 *
 * @param {string} refinedPrompt - Refined mood board description from Design Director
 * @param {Object} options - Generation options
 * @param {string} options.aspect_ratio - Aspect ratio
 * @param {number} options.seed - Random seed
 * @param {string} options.webhook - Webhook URL
 * @returns {Promise<Object>} {predictionId, status, model}
 */
export async function initiatePass1(refinedPrompt, options = {}) {
  console.log('[TWO-PASS] Initiating Pass 1: Mood board text-to-image');

  // Build mood board prompt
  const { positive, negative, guidance, steps, denoise } = buildFluxPrompt(refinedPrompt);

  // Pass 1 parameters for mood boards
  const pass1Options = {
    aspect_ratio: options.aspect_ratio || '1:1',
    denoise: denoise,  // Use value from buildFluxPrompt (default 0.95)
    guidance: guidance,
    steps: steps,
    seed: options.seed,
    webhook: options.webhook
  };

  console.log('[TWO-PASS] Pass 1 parameters:', pass1Options);

  // Generate without init image (pure text-to-image)
  const result = await generateConceptFluxDev(
    positive,
    negative,
    null,  // No init image = pure text-to-image
    pass1Options
  );

  console.log(`[TWO-PASS] Pass 1 initiated: ${result.predictionId}`);

  return {
    ...result,
    pass: 1,
    mode: 'text-to-image',
    prompt: {
      positive,
      negative
    },
    parameters: pass1Options
  };
}

/**
 * Initiate Pass 2: Quality refinement pass (DISABLED FOR MOOD BOARDS)
 * NOTE: Two-pass mode should remain DISABLED for mood board generation
 * This function is preserved for potential future use but should not be called
 *
 * @param {string} refinedPrompt - Refined mood board description
 * @param {string} pass1ResultUrl - URL of Pass 1 generated image
 * @param {Object} options - Generation options
 * @param {string} options.aspect_ratio - Aspect ratio
 * @param {number} options.seed - Random seed (should match Pass 1)
 * @param {string} options.webhook - Webhook URL
 * @returns {Promise<Object>} {predictionId, status, model}
 */
export async function initiatePass2(refinedPrompt, pass1ResultUrl, options = {}) {
  console.warn('[TWO-PASS] WARNING: Pass 2 should be DISABLED for mood boards');
  console.log('[TWO-PASS] Initiating Pass 2: Quality refinement');
  console.log(`[TWO-PASS] Pass 1 result: ${pass1ResultUrl}`);

  // Build base prompt (mood board style)
  const { positive: basePositive, negative: baseNegative, guidance, steps } = buildFluxPrompt(refinedPrompt);

  // ADD MINIMAL QUALITY REFINEMENT (preserve atmosphere and gradients)
  const pass2Positive = `${basePositive}, enhanced cohesion, refined composition, professional finish`;

  const pass2Negative = `${baseNegative}, low quality, blurry, distorted, excessive noise`;

  // Pass 2 uses light touch to preserve mood board atmosphere
  const pass2Options = {
    aspect_ratio: options.aspect_ratio || '1:1',
    denoise: 0.25,  // Very low - preserve Pass 1 atmosphere
    guidance: guidance,
    steps: steps,
    seed: options.seed,
    webhook: options.webhook
  };

  console.log('[TWO-PASS] Pass 2 parameters:', pass2Options);
  console.log('[TWO-PASS] Pass 2 focus: Light quality refinement only');

  // Generate with Pass 1 result as init image
  const result = await generateConceptFluxDev(
    pass2Positive,
    pass2Negative,
    pass1ResultUrl,
    pass2Options
  );

  console.log(`[TWO-PASS] Pass 2 initiated: ${result.predictionId}`);

  return {
    ...result,
    pass: 2,
    mode: 'img2img-refinement',
    pass1_result_url: pass1ResultUrl,
    cleanup_mode: false,
    prompt: {
      positive: pass2Positive,
      negative: pass2Negative
    },
    parameters: pass2Options
  };
}

/**
 * Check if two-pass mode is enabled via environment variable
 * @returns {boolean}
 */
export function isTwoPassEnabled() {
  return process.env.FLUX_TWO_PASS_ENABLED !== 'false';  // Enabled by default
}

/**
 * Get Pass 1 prompt strength from environment (default: 0.95)
 * @returns {number}
 */
export function getPass1PromptStrength() {
  return parseFloat(process.env.FLUX_PASS1_PROMPT_STRENGTH || '0.95');
}

/**
 * Get Pass 2 prompt strength from environment (default: 0.55)
 * @returns {number}
 */
export function getPass2PromptStrength() {
  return parseFloat(process.env.FLUX_PASS2_PROMPT_STRENGTH || '0.55');
}

/**
 * Get stencil guidance opacity from environment (default: 15%)
 * @returns {number}
 */
export function getStencilGuidanceOpacity() {
  return parseInt(process.env.FLUX_PASS2_GUIDANCE_OPACITY || '15');
}
