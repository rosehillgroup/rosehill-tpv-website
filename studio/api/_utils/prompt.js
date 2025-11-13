// Prompt Builder for TPV Studio Mood Board Generator
// Implements mood board generation with rich, atmospheric prompts

/**
 * Build FLUX prompt from refined mood board description
 * @param {string} refinedPrompt - Refined 1-3 sentence mood board description from Claude
 * @param {Object} options - Optional overrides
 * @param {number} options.guidance - Override guidance (3.0-4.5, default 4.0)
 * @param {number} options.steps - Override steps (20-25, default 22)
 * @param {number} options.denoise - Override denoise (0.90-1.0, default 0.95)
 * @returns {Object} {positive, negative, guidance, steps, denoise}
 */
function buildFluxPrompt(refinedPrompt, options = {}) {
  // Build positive prompt using mood board template
  const positive = `Playground concept art mood board, rich colours and expressive atmosphere, cinematic lighting, soft gradients, painterly textures, cohesive composition, modern design inspiration, creative environmental storytelling. Theme: ${refinedPrompt}. Overhead or angled perspective, harmonious colour palette, organic shapes, playful forms, depth and visual interest, professional mood board aesthetic, high-quality concept illustration.`;

  // Build negative prompt - removes aesthetic-breaking elements but allows gradients/shadows/depth
  const negative = `text, letters, numbers, logos, watermarks, distorted faces, human portraits, glitch artifacts, excessive noise, low-resolution textures, overexposed highlights, extreme surrealism, gore, dismemberment, photoreal product mockups, 3D CAD renders, technical diagrams, blueprint layouts, vector-flat graphic style, geometric lineart surfaces, repetitive tiling, warped anatomy, broken perspectives`;

  // FLUX-dev parameters optimized for mood boards
  const guidance = parseFloat(options.guidance || process.env.FLUX_DEV_GUIDANCE || '4.0');
  const steps = parseInt(options.steps || process.env.FLUX_DEV_STEPS || '22');
  const denoise = parseFloat(options.denoise || process.env.FLUX_DEV_DENOISE || '0.95');

  return {
    positive,
    negative,
    guidance,
    steps,
    denoise
  };
}

// CommonJS exports
export {
  buildFluxPrompt
};
