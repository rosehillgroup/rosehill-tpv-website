// Prompt Builder for TPV Studio Inspiration Mode
// Material-first prompting with style presets

/**
 * Material-first prompt anchoring - optimized for FLUX-dev
 * Describes TPV rubber granule properties before creative theme
 */
const MATERIAL_PREFIX = 'Playground TPV rubber surfacing design';
const MATERIAL_TAIL = 'flat vector look with large smooth shapes, installer-friendly geometry, no outlines, no text, no tiny elements, matte finish, soft ambient shadow only';

/**
 * Unified negative prompts to avoid AI artifacts and unwanted outputs
 * Optimized for FLUX-dev to produce clean, installer-friendly results
 */
const NEGATIVE_PROMPTS = 'busy pattern, fine texture, high-frequency detail, thin lines, hairline strokes, text, letters, numbers, bevel, emboss, metallic, glossy, photoreal, perspective props, stickers, clipart, grunge, graffiti, tiny symbols, noisy background, photographic texture, stippling, halftone, noodly details, micro-patterns';

/**
 * Style presets for different design approaches
 * Optimized for FLUX-dev (high-quality, designer-friendly results)
 */
export const STYLE_PRESETS = {
  playful_flat: {
    name: 'Playful Flat Design',
    description: 'Bold shapes, vibrant colors, fun themes',
    prefix: 'Bold flat shapes, vibrant colors, simple geometric forms,',
    guidance: 3.8, // FLUX-dev works best with 3-4 guidance (lower = less fussy)
    steps: 20 // FLUX-dev good default for quality
  },
  geometric: {
    name: 'Geometric Abstract',
    description: 'Clean lines, mathematical patterns, modern aesthetics',
    prefix: 'Geometric abstract pattern, clean lines, mathematical precision, modern minimalist design,',
    guidance: 3.8,
    steps: 20
  },
  sport_court: {
    name: 'Sport Court Graphics',
    description: 'Court line markings, field layouts, sport-specific graphics',
    prefix: 'Court line markings, field graphics, clean geometric boundaries,',
    guidance: 3.8,
    steps: 20
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

  // Build final prompt: material prefix + style + user prompt + material tail
  const prompt = `${MATERIAL_PREFIX}, ${preset.prefix} ${sanitized}, ${MATERIAL_TAIL}`;

  console.log(`[PROMPT] Style: ${preset.name} | User: "${sanitized}"`);
  console.log(`[PROMPT] Full prompt: "${prompt}"`);
  console.log(`[PROMPT] Negative: "${NEGATIVE_PROMPTS}"`);

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
