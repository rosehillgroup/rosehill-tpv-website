// Prompt Builder for TPV Studio Inspiration Mode
// Implements the full buildFluxPrompt() from the design plan

/**
 * Build FLUX prompt from structured design brief with composition object
 * @param {Object} brief - Design brief with title, mood, composition, motifs, arrangement_notes
 * @param {Object} options - Optional overrides
 * @param {number} options.max_colours - Maximum colours allowed (1-8, default 6)
 * @param {boolean} options.try_simpler - Apply stricter simplification parameters
 * @param {number} options.guidance - Override guidance (3.5-4.5)
 * @param {number} options.steps - Override steps (18-20)
 * @returns {Object} {positive, negative, guidance, steps, denoise}
 */
function buildFluxPrompt(brief, options = {}) {
  const max_colours = options.max_colours || 6;
  const try_simpler = options.try_simpler || false;

  // Extract brief components
  const theme = brief?.title ? `Theme: ${brief.title}.` : "";
  const mood = (brief?.mood || []).length ? `Mood: ${brief.mood.join(", ")}.` : "";

  // Build motifs line with size information if available
  const motifs = (brief?.motifs || [])
    .map(m => {
      if (m.size_m && Array.isArray(m.size_m)) {
        return `${m.name} x${m.count || 1} (${m.size_m[0]}-${m.size_m[1]}m)`;
      }
      return `${m.name} x${m.count || 1}`;
    })
    .join(", ");
  const motifsLine = motifs ? `Motifs: ${motifs} as bold, simple silhouettes.` : "";

  const composition = brief?.arrangement_notes
    ? `Composition: ${brief.arrangement_notes}`
    : `Composition: 2–3 broad flowing bands, generous spacing, minimal overlaps.`;

  // Build positive prompt
  const positive = [
    "Playground TPV rubber surfacing design",
    "flat vector look with large smooth shapes",
    "installer-friendly geometry",
    "bold silhouettes",
    "no outlines, no text, no tiny elements",
    "uniform flat colours (no gradients)",
    "optional hard drop-shadows with crisp edges (decal-style)",
    "matte finish",
    "overhead view",
    theme,
    mood,
    motifsLine,
    composition,
    `Keep total colours ≤ ${max_colours}.`
  ].filter(Boolean).join(", ");

  // Build negative prompt - comprehensive anti-gradient, anti-soft-shadow terms
  let negative = [
    // Complexity & detail
    "busy pattern", "fine texture", "high-frequency detail",
    "thin lines", "hairline strokes",
    "text", "letters", "numbers",
    // Rendering effects
    "metallic", "glossy", "photoreal", "photorealistic", "3D render", "3D",
    "perspective", "bevel", "emboss",
    // Gradients & soft effects (CRITICAL)
    "gradient", "gradients", "gradient shading",
    "soft shadows", "soft shadow", "feathered shadows",
    "airbrush", "blur", "glow",
    // Unwanted styles
    "grunge", "graffiti", "clipart clutter",
    "realistic texture", "depth", "transparency"
  ].join(", ");

  // Apply "Try Simpler" adjustments
  if (try_simpler) {
    negative += ", simplify shapes, fewer regions, larger silhouettes, complex shapes, overlapping elements, busy composition, small details, intricate patterns";
  }

  // FLUX-dev parameters
  let guidance = parseFloat(options.guidance || process.env.FLUX_DEV_GUIDANCE || '3.6');
  let steps = parseInt(options.steps || process.env.FLUX_DEV_STEPS || '20');
  let denoise = parseFloat(options.denoise || process.env.FLUX_DEV_DENOISE || '0.30');

  // Apply "Try Simpler" parameter adjustments (spec section 5)
  if (try_simpler) {
    denoise = Math.max(0.20, denoise - 0.05);
  }

  return {
    positive,
    negative,
    guidance,
    steps,
    denoise
  };
}

/**
 * Create simplified brief for "Try Simpler" functionality
 * Increases min feature and radius constraints
 * @param {Object} originalBrief - Original design brief
 * @returns {Object} Simplified brief with stricter constraints
 */
function createSimplifiedBrief(originalBrief) {
  return {
    ...originalBrief,
    composition: {
      ...originalBrief.composition,
      min_feature_mm: 160,  // Increased from 120mm
      min_radius_mm: 800     // Increased from 600mm
    }
  };
}

/**
 * Validate brief structure
 * @param {Object} brief - Design brief
 * @returns {Object} {valid, errors}
 */
function validateBrief(brief) {
  const errors = [];

  if (!brief || typeof brief !== 'object') {
    errors.push('Brief must be an object');
    return { valid: false, errors };
  }

  // Title required
  if (!brief.title) {
    errors.push('Brief must have a title');
  }

  // Validate composition object (required in new schema)
  if (!brief.composition || typeof brief.composition !== 'object') {
    errors.push('Brief must have a composition object');
  } else {
    const comp = brief.composition;

    // Validate coverage ratios
    if (typeof comp.base_coverage !== 'number' || comp.base_coverage < 0 || comp.base_coverage > 1) {
      errors.push('composition.base_coverage must be a number between 0 and 1');
    }
    if (typeof comp.accent_coverage !== 'number' || comp.accent_coverage < 0 || comp.accent_coverage > 1) {
      errors.push('composition.accent_coverage must be a number between 0 and 1');
    }
    if (typeof comp.highlight_coverage !== 'number' || comp.highlight_coverage < 0 || comp.highlight_coverage > 1) {
      errors.push('composition.highlight_coverage must be a number between 0 and 1');
    }

    // Validate shape density
    if (!['low', 'medium'].includes(comp.shape_density)) {
      errors.push('composition.shape_density must be "low" or "medium"');
    }

    // Validate detail level
    if (!['low', 'medium'].includes(comp.max_detail_level)) {
      errors.push('composition.max_detail_level must be "low" or "medium"');
    }

    // Validate feature sizes
    if (typeof comp.min_feature_mm !== 'number' || comp.min_feature_mm < 100) {
      errors.push('composition.min_feature_mm must be a number >= 100');
    }
    if (typeof comp.min_radius_mm !== 'number' || comp.min_radius_mm < 300) {
      errors.push('composition.min_radius_mm must be a number >= 300');
    }

    // Validate region count
    if (typeof comp.target_region_count !== 'number' || comp.target_region_count < 2 || comp.target_region_count > 10) {
      errors.push('composition.target_region_count must be a number between 2 and 10');
    }

    // Validate avoid array
    if (!Array.isArray(comp.avoid)) {
      errors.push('composition.avoid must be an array');
    }
  }

  // Validate motifs structure
  if (brief.motifs) {
    if (!Array.isArray(brief.motifs)) {
      errors.push('Motifs must be an array');
    } else {
      if (brief.motifs.length > 4) {
        errors.push('Maximum 4 motifs allowed');
      }
      brief.motifs.forEach((motif, i) => {
        if (!motif.name) {
          errors.push(`Motif ${i} missing name`);
        }
        if (motif.size_m && !Array.isArray(motif.size_m)) {
          errors.push(`Motif ${i} size_m must be an array [min, max]`);
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

// CommonJS exports
module.exports = {
  buildFluxPrompt,
  createSimplifiedBrief,
  validateBrief
};
