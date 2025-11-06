// Prompt Builder for TPV Studio Inspiration Mode
// Material-first prompting with style presets

/**
 * Material-first prompt anchoring - optimized for FLUX models
 * Describes TPV rubber granule properties before creative theme
 */
const MATERIAL_TAIL = 'flat vector poster style, rubber granule surfacing look, large smooth shapes, soft shadows only, bold silhouettes, clean joins, no gradients, no text, no outlines';

/**
 * Unified negative prompts to avoid AI artifacts and unwanted outputs
 * Optimized for FLUX models to produce clean, designer-friendly results
 */
const NEGATIVE_PROMPTS = 'photographic texture, busy detail, thin lines, stippling, halftone, noise, grain, bevels, 3d shading, tiny symbols, watermark, text, logos, noodly details, micro-patterns, photorealistic rendering';

/**
 * Style presets for different design approaches
 * Optimized for FLUX.1-schnell (fast, clean results)
 */
export const STYLE_PRESETS = {
  playful_flat: {
    name: 'Playful Flat Design',
    description: 'Bold shapes, vibrant colors, fun themes for play areas',
    prefix: 'Bold flat shapes, vibrant playground design, playful motifs,',
    guidance: 5.5, // Optimized for FLUX - lower guidance = less artifacts
    steps: 16 // FLUX.1-schnell optimal steps
  },
  geometric: {
    name: 'Geometric Abstract',
    description: 'Clean lines, mathematical patterns, modern aesthetics',
    prefix: 'Geometric abstract pattern, clean lines, mathematical precision, modern minimalist design,',
    guidance: 5.5,
    steps: 16
  },
  sport_court: {
    name: 'Sport Court Graphics',
    description: 'Athletic field markings, court layouts, sport-specific designs',
    prefix: 'Sport court graphics, athletic field design, clean court markings, professional sports surface,',
    guidance: 6, // Slightly higher CFG for more structured output
    steps: 18
  }
};

/**
 * Get style preset by ID
 * @param {string} styleId - Style preset ID (playful_flat, geometric, sport_court)
 * @returns {Object} Style preset
 */
export function getStylePreset(styleId) {
  const defaultStyle = process.env.INSPIRE_MODEL_STYLE_DEFAULT || 'playful_flat';
  const style = STYLE_PRESETS[styleId] || STYLE_PRESETS[defaultStyle];

  if (!STYLE_PRESETS[styleId]) {
    console.warn(`[PROMPT] Unknown style "${styleId}", using default: ${defaultStyle}`);
  }

  return style;
}

/**
 * Build complete prompt with material anchoring
 * @param {Object} params - Prompt parameters
 * @param {string} params.user - User's creative prompt
 * @param {string} params.style - Style preset ID (optional, defaults to env var)
 * @returns {Object} {prompt, negative, guidance, steps, style}
 */
export function buildStylePrompt({ user, style = null }) {
  // Get style preset
  const preset = getStylePreset(style);

  // Validate user input
  if (!user || user.trim().length === 0) {
    throw new Error('User prompt cannot be empty');
  }

  // Sanitize user input (remove any unwanted characters or patterns)
  const sanitized = user
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 200); // Cap at 200 chars to avoid excessive length

  // Build final prompt: style prefix + user prompt + material tail
  const prompt = `${preset.prefix} ${sanitized}, ${MATERIAL_TAIL}`;

  console.log(`[PROMPT] Style: ${preset.name} | User: "${sanitized}" | Full: "${prompt}"`);

  return {
    prompt,
    negative: NEGATIVE_PROMPTS,
    guidance: preset.guidance,
    steps: preset.steps,
    style: preset.name
  };
}

/**
 * Extract key themes from user prompt for metadata
 * @param {string} userPrompt - User's creative prompt
 * @returns {Array<string>} Key themes/keywords
 */
export function extractThemes(userPrompt) {
  if (!userPrompt || userPrompt.trim().length === 0) {
    return [];
  }

  // Simple keyword extraction (can be enhanced with NLP later)
  const themes = userPrompt
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 3) // Filter out short words
    .slice(0, 5); // Take top 5 keywords

  return themes;
}

/**
 * Validate prompt parameters
 * @param {Object} params - Prompt parameters
 * @returns {Object} {valid, errors}
 */
export function validatePrompt(params) {
  const errors = [];

  if (!params.user || typeof params.user !== 'string') {
    errors.push('User prompt is required and must be a string');
  } else if (params.user.trim().length === 0) {
    errors.push('User prompt cannot be empty');
  } else if (params.user.length > 500) {
    errors.push('User prompt too long (max 500 characters)');
  }

  if (params.style && !STYLE_PRESETS[params.style]) {
    errors.push(`Invalid style preset: ${params.style}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
