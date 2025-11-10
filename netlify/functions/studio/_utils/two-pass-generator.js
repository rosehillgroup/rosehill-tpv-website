// Two-Pass Flux Dev Generation System
// Pass 1: Text-to-image (vibrant, creative concept with no stencil)
// Pass 2: Cleanup/simplification (remove small artifacts, simplify for installation)

import { generateConceptFluxDev } from './replicate.js';
import { buildFluxPrompt } from './prompt.js';

/**
 * Initiate Pass 1: Pure text-to-image generation
 * No stencil, full creative freedom for vibrant colors and multiple motifs
 *
 * @param {Object} brief - Design brief from Design Director
 * @param {Object} options - Generation options
 * @param {string} options.aspect_ratio - Aspect ratio
 * @param {number} options.seed - Random seed
 * @param {string} options.webhook - Webhook URL
 * @returns {Promise<Object>} {predictionId, status, model}
 */
export async function initiatePass1(brief, options = {}) {
  console.log('[TWO-PASS] Initiating Pass 1: Text-to-image (no stencil)');

  // Build prompt with bright/colorful emphasis
  const { positive, negative, guidance, steps } = buildFluxPrompt(brief, {
    max_colours: options.max_colours || 6,
    try_simpler: false
  });

  // Pass 1 uses HIGH prompt_strength for full creative freedom
  const pass1Options = {
    aspect_ratio: options.aspect_ratio || '1:1',
    denoise: 0.95,  // Very high - no init image to preserve
    guidance: guidance,
    steps: steps,
    seed: options.seed,
    webhook: options.webhook
  };

  console.log('[TWO-PASS] Pass 1 parameters:', pass1Options);

  // Generate without stencil (null)
  const result = await generateConceptFluxDev(
    positive,
    negative,
    null,  // No stencil = pure text-to-image
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
 * Initiate Pass 2: Cleanup/simplification pass
 * Uses Pass 1 result to remove small artifacts and simplify for installation
 *
 * @param {Object} brief - Design brief
 * @param {string} pass1ResultUrl - URL of Pass 1 generated image
 * @param {Object} options - Generation options
 * @param {string} options.aspect_ratio - Aspect ratio
 * @param {number} options.seed - Random seed (should match Pass 1)
 * @param {string} options.webhook - Webhook URL
 * @param {boolean} options.try_simpler - Extra simplification (from Try Simpler button)
 * @returns {Promise<Object>} {predictionId, status, model}
 */
export async function initiatePass2(brief, pass1ResultUrl, options = {}) {
  console.log('[TWO-PASS] Initiating Pass 2: Cleanup/Simplification');
  console.log(`[TWO-PASS] Pass 1 result: ${pass1ResultUrl}`);
  console.log('[TWO-PASS] Pass 2 will remove small artifacts and simplify for installation');

  // Build base prompt
  const { positive: basePositive, negative: baseNegative, guidance, steps } = buildFluxPrompt(brief, {
    max_colours: options.max_colours || 6,
    try_simpler: options.try_simpler || false
  });

  // ADD PASS 2 CLEANUP/SIMPLIFICATION DIRECTIVES
  const pass2Positive = `${basePositive}, simplified clean composition, remove tiny scattered elements, large bold shapes only, installer-friendly scale, clean flat silhouettes, remove visual clutter`;

  const pass2Negative = `${baseNegative}, small scattered details, tiny dots, fine texture, scattered artifacts, visual clutter, busy areas, gradient shading in background bands, small decorative elements, texture noise, speckles, small stars, tiny objects`;

  // Pass 2 uses LOWER prompt_strength for cleanup (preserve colors/layout, refine details)
  const pass2Options = {
    aspect_ratio: options.aspect_ratio || '1:1',
    denoise: options.try_simpler ? 0.60 : 0.50,  // Lower = preserve more, just clean up
    guidance: 3.0,  // Slightly lower to allow smoothing
    steps: steps,
    seed: options.seed,
    webhook: options.webhook
  };

  console.log('[TWO-PASS] Pass 2 parameters:', pass2Options);
  console.log('[TWO-PASS] Pass 2 focus: Remove small artifacts, simplify shapes, flatten colors');

  // Generate with Pass 1 result as init image (NO stencil overlay)
  const result = await generateConceptFluxDev(
    pass2Positive,
    pass2Negative,
    pass1ResultUrl,  // Use Pass 1 result directly, no stencil
    pass2Options
  );

  console.log(`[TWO-PASS] Pass 2 initiated: ${result.predictionId}`);

  return {
    ...result,
    pass: 2,
    mode: 'img2img-cleanup',
    pass1_result_url: pass1ResultUrl,
    cleanup_mode: true,
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
