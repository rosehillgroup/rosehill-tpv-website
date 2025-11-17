/**
 * Color Mapping Builder
 * Creates a mapping from original design colors to blend colors
 */

/**
 * Build a color mapping from recipe data
 *
 * @param {Array} recipes - Array of recipe objects from API
 * @returns {Map<string, Object>} Map of originalHex -> { blendHex, recipeId, deltaE, coverage }
 */
export function buildColorMapping(recipes) {
  const colorMap = new Map();

  for (const recipe of recipes) {
    // Map originalColor (cluster centroid) to targetColor (pre-normalized blend)
    const originalHex = recipe.originalColor.hex.toLowerCase();
    const blendHex = recipe.targetColor.hex.toLowerCase();
    const recipeId = recipe.chosenRecipe.id;
    const deltaE = recipe.chosenRecipe.deltaE;
    const coverage = recipe.targetColor.areaPct;

    colorMap.set(originalHex, {
      blendHex,
      recipeId,
      deltaE,
      coverage,
      quality: recipe.chosenRecipe.quality,
      components: recipe.chosenRecipe.components
    });
  }

  return colorMap;
}

/**
 * Normalize a hex color to lowercase without leading #
 *
 * @param {string} hex - Hex color (with or without #)
 * @returns {string} Normalized hex color
 */
export function normalizeHex(hex) {
  return hex.replace('#', '').toLowerCase();
}

/**
 * Compare two hex colors (case-insensitive, with or without #)
 *
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @returns {boolean} True if colors match
 */
export function hexColorsMatch(hex1, hex2) {
  return normalizeHex(hex1) === normalizeHex(hex2);
}

/**
 * Find the blend color for a given original color
 *
 * @param {string} originalHex - Original color hex
 * @param {Map} colorMap - Color mapping
 * @returns {string|null} Blend hex color or null if not found
 */
export function getBlendColor(originalHex, colorMap) {
  const normalized = `#${normalizeHex(originalHex)}`;
  const mapping = colorMap.get(normalized);
  return mapping ? mapping.blendHex : null;
}

/**
 * Get statistics about the color mapping
 *
 * @param {Map} colorMap - Color mapping
 * @returns {Object} Statistics object
 */
export function getColorMappingStats(colorMap) {
  const mappings = Array.from(colorMap.values());

  return {
    totalColors: mappings.length,
    excellentMatches: mappings.filter(m => m.quality === 'Excellent').length,
    goodMatches: mappings.filter(m => m.quality === 'Good').length,
    fairMatches: mappings.filter(m => m.quality === 'Fair').length,
    averageDeltaE: mappings.reduce((sum, m) => sum + m.deltaE, 0) / mappings.length,
    totalCoverage: mappings.reduce((sum, m) => sum + m.coverage, 0)
  };
}

/**
 * Export color mapping as a plain object for storage/serialization
 *
 * @param {Map} colorMap - Color mapping
 * @returns {Object} Plain object representation
 */
export function exportColorMapping(colorMap) {
  const obj = {};
  for (const [key, value] of colorMap.entries()) {
    obj[key] = value;
  }
  return obj;
}

/**
 * Import color mapping from a plain object
 *
 * @param {Object} obj - Plain object representation
 * @returns {Map} Color mapping
 */
export function importColorMapping(obj) {
  const colorMap = new Map();
  for (const [key, value] of Object.entries(obj)) {
    colorMap.set(key, value);
  }
  return colorMap;
}
