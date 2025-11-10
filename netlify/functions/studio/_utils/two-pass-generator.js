// Two-Pass Flux Dev Generation System
// Pass 1: Text-to-image (vibrant, creative concept with no stencil)
// Pass 2: Img2img refinement (composition guidance using Pass 1 + faint stencil overlay)

import { generateConceptFluxDev } from './replicate.js';
import { buildFluxPrompt } from './prompt.js';
import { generateBriefStencil } from './brief-stencil.js';
import { compositeStencilOntoImage } from './composite-guidance.js';
import { uploadToStorage } from './exports.js';

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
 * Initiate Pass 2: Img2img refinement with composition guidance
 * Uses Pass 1 result as base + faint stencil overlay for spatial guidance
 *
 * @param {Object} brief - Design brief
 * @param {string} pass1ResultUrl - URL of Pass 1 generated image
 * @param {Object} options - Generation options
 * @param {string} options.aspect_ratio - Aspect ratio
 * @param {number} options.seed - Random seed (should match Pass 1)
 * @param {string} options.webhook - Webhook URL
 * @param {boolean} options.use_stencil_guidance - Whether to composite stencil (default: true)
 * @returns {Promise<Object>} {predictionId, status, model, compositeImageUrl}
 */
export async function initiatePass2(brief, pass1ResultUrl, options = {}) {
  console.log('[TWO-PASS] Initiating Pass 2: Composition refinement');
  console.log(`[TWO-PASS] Pass 1 result: ${pass1ResultUrl}`);

  const useStencilGuidance = options.use_stencil_guidance !== false;
  let initImageUrl = pass1ResultUrl;
  let compositeImageUrl = null;

  // Optional: Composite faint stencil onto Pass 1 result for spatial guidance
  if (useStencilGuidance) {
    try {
      console.log('[TWO-PASS] Generating semantic stencil for composition guidance');

      // Generate stencil at same dimensions as Pass 1 result
      const stencilBuffer = await generateBriefStencil(
        brief,
        { width: 1024, height: 1024 },  // Standard dimensions
        { seed: options.seed }
      );

      // Composite stencil at 15% opacity onto Pass 1 result
      const compositedBuffer = await compositeStencilOntoImage(
        pass1ResultUrl,
        stencilBuffer,
        15  // 15% opacity - barely visible hint
      );

      // Upload composited image
      const filename = `pass2_composite_${Date.now()}.png`;
      const uploadResult = await uploadToStorage(compositedBuffer, filename, {
        lifecycle: 'temp',
        contentType: 'image/png'
      });

      compositeImageUrl = uploadResult.publicUrl;
      initImageUrl = compositeImageUrl;

      console.log(`[TWO-PASS] Composited stencil guidance: ${compositeImageUrl}`);
    } catch (error) {
      console.error('[TWO-PASS] Failed to composite stencil guidance:', error);
      console.log('[TWO-PASS] Falling back to Pass 1 result only (no stencil guidance)');
      // Continue with Pass 1 result only
    }
  }

  // Build prompt (same as Pass 1)
  const { positive, negative, guidance, steps } = buildFluxPrompt(brief, {
    max_colours: options.max_colours || 6,
    try_simpler: options.try_simpler || false
  });

  // Pass 2 uses LOWER prompt_strength for refinement (not replacement)
  const pass2Options = {
    aspect_ratio: options.aspect_ratio || '1:1',
    denoise: options.try_simpler ? 0.60 : 0.55,  // Medium - refine composition
    guidance: guidance,
    steps: steps,
    seed: options.seed,
    webhook: options.webhook
  };

  console.log('[TWO-PASS] Pass 2 parameters:', pass2Options);

  // Generate with Pass 1 result (+ optional stencil guidance) as init image
  const result = await generateConceptFluxDev(
    positive,
    negative,
    initImageUrl,  // Pass 1 result or composited version
    pass2Options
  );

  console.log(`[TWO-PASS] Pass 2 initiated: ${result.predictionId}`);

  return {
    ...result,
    pass: 2,
    mode: 'img2img-refinement',
    pass1_result_url: pass1ResultUrl,
    composite_image_url: compositeImageUrl,
    stencil_guidance_used: useStencilGuidance && compositeImageUrl !== null,
    prompt: {
      positive,
      negative
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
