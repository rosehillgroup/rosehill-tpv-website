// Prompt Builder for TPV Studio Inspiration Mode
// Implements the full buildFluxPrompt() from the design plan

/**
 * Build FLUX prompt from structured design brief
 * @param {Object} brief - Design brief with title, mood, motifs, arrangement_notes
 * @param {Object} options - Optional overrides (simplicity, etc.)
 * @returns {Object} {positive, negative, guidance, steps}
 */
export function buildFluxPrompt(brief, options = {}) {
  // Extract brief components
  const theme = brief?.title ? `Theme: ${brief.title}.` : "";
  const mood = (brief?.mood || []).length ? `Mood: ${brief.mood.join(", ")}.` : "";

  const motifs = (brief?.motifs || [])
    .map(m => `${m.name} x${m.count || 1}`)
    .join(", ");
  const motifsLine = motifs ? `Motifs: ${motifs} as bold, simple silhouettes.` : "";

  const composition = brief?.arrangement_notes
    ? `Composition: ${brief.arrangement_notes}`
    : `Composition: 2–3 broad flowing bands, generous spacing, minimal overlaps.`;

  // Build positive prompt
  const positive = [
    "Flat vector illustration of playground TPV rubber surfacing design, graphic design style, flat 2D, no photorealism",
    "flat vector look with large smooth shapes",
    "installer-friendly geometry",
    "no outlines, no text, no tiny elements",
    "matte finish, soft ambient shadow only",
    theme,
    mood,
    motifsLine,
    composition,
    "bold flat vector aesthetic, large smooth geometric shapes, installer-friendly simple forms, clean matte finish, minimal soft shadows, no depth, no 3D, no texture, pure flat design"
  ].filter(Boolean).join(", ");

  // Build negative prompt - front-loaded with anti-realism terms
  let negative = [
    "photorealistic", "photo", "photography", "3D render", "3D", "depth",
    "shadows", "realistic lighting", "perspective",
    "busy pattern", "fine texture", "high-frequency detail",
    "thin lines", "hairline strokes", "text", "letters", "numbers",
    "bevel", "emboss", "metallic", "glossy", "shading", "gradients",
    "perspective props", "stickers", "clipart", "grunge", "graffiti",
    "tiny symbols", "noisy background", "photographic texture",
    "stippling", "halftone", "noodly details", "micro-patterns",
    "realistic", "detailed texture"
  ].join(", ");

  // Apply simplicity enhancement if requested
  if (options.simplicity === 'high' || options.trySimpler) {
    negative += ", complex shapes, overlapping elements, busy composition, small details, intricate patterns";
  }

  // FLUX-dev parameters
  const guidance = options.guidance || 3.8;  // Lower = less fussy
  const steps = options.steps || 20;

  return {
    positive,
    negative,
    guidance,
    steps
  };
}

/**
 * Build prompt from simple user text (backward compatibility)
 * Wraps user text in TPV design context
 * @param {string} userPrompt - Simple user description
 * @param {Object} options - Optional overrides (style, simplicity, etc.)
 * @returns {Object} {positive, negative, guidance, steps}
 */
export function buildSimplePrompt(userPrompt, options = {}) {
  let brief = {
    title: userPrompt,
    mood: [],
    motifs: [],
    arrangement_notes: null
  };

  // Apply style preset if provided
  if (options.style) {
    brief = applyStylePreset(brief, options.style);
  }

  return buildFluxPrompt(brief, options);
}

/**
 * Style presets for different design approaches
 * These can enhance the brief with style-specific hints
 */
export const STYLE_PRESETS = {
  playful_flat: {
    name: 'Playful Flat Design',
    description: 'Bold shapes, vibrant colors, fun themes',
    moodHints: ['playful', 'vibrant', 'fun'],
    guidance: 3.8,
    steps: 20
  },
  geometric: {
    name: 'Geometric Abstract',
    description: 'Clean lines, mathematical patterns, modern aesthetics',
    moodHints: ['minimal', 'modern', 'geometric'],
    guidance: 3.8,
    steps: 20
  },
  sport_court: {
    name: 'Sport Court Graphics',
    description: 'Court line markings, field layouts, sport-specific graphics',
    moodHints: ['athletic', 'structured', 'functional'],
    guidance: 3.8,
    steps: 20
  },
  tpv_flat_minimal: {
    name: 'TPV Flat Minimal',
    description: 'Ultra-simple, installer-friendly, large clean shapes',
    moodHints: ['minimal', 'clean', 'simple'],
    guidance: 3.8,
    steps: 20
  }
};

/**
 * Get style preset by ID
 * @param {string} styleId - Style preset ID
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
 * Enhance brief with style preset hints
 * @param {Object} brief - Design brief
 * @param {string} styleId - Style preset ID
 * @returns {Object} Enhanced brief
 */
export function applyStylePreset(brief, styleId) {
  const style = getStylePreset(styleId);

  return {
    ...brief,
    mood: [...(brief.mood || []), ...style.moodHints],
    style_preset: styleId
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
 * Validate brief structure
 * @param {Object} brief - Design brief
 * @returns {Object} {valid, errors}
 */
export function validateBrief(brief) {
  const errors = [];

  if (!brief || typeof brief !== 'object') {
    errors.push('Brief must be an object');
    return { valid: false, errors };
  }

  // Title or motifs required
  if (!brief.title && (!brief.motifs || brief.motifs.length === 0)) {
    errors.push('Brief must have either a title or motifs');
  }

  // Validate motifs structure
  if (brief.motifs) {
    if (!Array.isArray(brief.motifs)) {
      errors.push('Motifs must be an array');
    } else {
      brief.motifs.forEach((motif, i) => {
        if (!motif.name) {
          errors.push(`Motif ${i} missing name`);
        }
      });
    }
  }

  // Validate mood
  if (brief.mood && !Array.isArray(brief.mood)) {
    errors.push('Mood must be an array of strings');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
