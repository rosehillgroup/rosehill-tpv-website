// Prompt Builder for TPV Studio Inspiration Mode
// Material-first prompting with style presets

/**
 * Material-first prompt anchoring
 * Describes TPV rubber granule properties before creative theme
 */
const MATERIAL_TAIL = 'rubber granule surfacing, matte finish, installer-friendly geometry, large smooth curves, clean joins, no text';

/**
 * Unified negative prompts to avoid unwanted outputs
 */
const NEGATIVE_PROMPTS = 'text, watermark, logo, thin lines, metallic, glossy, gradients, photorealistic textures, 3d render, shadows';

/**
 * Style presets for different design approaches
 */
export const STYLE_PRESETS = {
  playful_flat: {
    name: 'Playful Flat Design',
    description: 'Bold shapes, vibrant colors, fun themes for play areas',
    prefix: 'Bold flat shapes, vibrant playground design, playful motifs,',
    guidance: 5, // Lower CFG for more creative freedom
    steps: 18
  },
  geometric: {
    name: 'Geometric Abstract',
    description: 'Clean lines, mathematical patterns, modern aesthetics',
    prefix: 'Geometric abstract pattern, clean lines, mathematical precision, modern minimalist design,',
    guidance: 5,
    steps: 18
  },
  sport_court: {
    name: 'Sport Court Graphics',
    description: 'Athletic field markings, court layouts, sport-specific designs',
    prefix: 'Sport court graphics, athletic field design, clean court markings, professional sports surface,',
    guidance: 6, // Slightly higher CFG for more structured output
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
