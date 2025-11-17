// TPV Studio - Design Serializer
// Converts design state to/from database format

/**
 * Serialize current design state into saveable format
 * Extracts all necessary data from InspirePanelRecraft component state
 *
 * @param {Object} state - Current component state
 * @returns {Object} Serialized design data ready for API
 */
export function serializeDesign(state) {
  const {
    inputMode,
    prompt,
    selectedFile,
    lengthMM,
    widthMM,
    result,
    viewMode,
    blendRecipes,
    solidRecipes,
    colorMapping,
    solidColorMapping,
    solidEditedColors,
    blendEditedColors,
    blendSvgUrl,
    solidSvgUrl,
    arMapping,
    jobId
  } = state;

  console.log('[SERIALIZE] Serializing design with result:', result);
  console.log('[SERIALIZE] result.svg_url:', result?.svg_url);
  console.log('[SERIALIZE] result.png_url:', result?.png_url);
  console.log('[SERIALIZE] result.thumbnail_url:', result?.thumbnail_url);

  // Convert Maps to plain objects for JSON storage
  const serializeMap = (map) => {
    if (!map) return null;
    if (!(map instanceof Map)) return map; // Already serialized
    return Object.fromEntries(map);
  };

  return {
    input_mode: inputMode,
    prompt: prompt || null,
    uploaded_file_url: selectedFile?.url || null,
    dimensions: {
      widthMM: widthMM,
      lengthMM: lengthMM
    },

    // Generated outputs
    original_svg_url: result?.svg_url || null,
    original_png_url: result?.png_url || null,
    thumbnail_url: result?.thumb_url || null,

    // Color recipes (already plain objects)
    blend_recipes: blendRecipes || null,
    solid_recipes: solidRecipes || null,

    // Color mappings (convert Maps to objects)
    color_mapping: serializeMap(colorMapping),
    solid_color_mapping: serializeMap(solidColorMapping),

    // User color edits (convert Maps to objects)
    solid_color_edits: serializeMap(solidEditedColors),
    blend_color_edits: serializeMap(blendEditedColors),

    // Final recolored SVGs
    final_blend_svg_url: blendSvgUrl || null,
    final_solid_svg_url: solidSvgUrl || null,
    preferred_view_mode: viewMode || 'solid',

    // Aspect ratio layout
    aspect_ratio_mapping: arMapping || null,

    // Link to job
    job_id: jobId || null
  };
}

/**
 * Deserialize saved design data back into component state
 * Converts database format into format expected by React component
 *
 * @param {Object} savedData - Design data from database
 * @returns {Object} State object to restore component
 */
export function deserializeDesign(savedData) {
  // Convert plain objects back to Maps
  const deserializeMap = (obj) => {
    if (!obj) return new Map();
    if (obj instanceof Map) return obj; // Already a Map
    return new Map(Object.entries(obj));
  };

  return {
    inputMode: savedData.input_mode,
    prompt: savedData.prompt || '',
    selectedFile: savedData.uploaded_file_url ? {
      url: savedData.uploaded_file_url,
      name: savedData.uploaded_file_url.split('/').pop()
    } : null,
    lengthMM: savedData.dimensions?.lengthMM || 0,
    widthMM: savedData.dimensions?.widthMM || 0,

    // Result object (matches job output format)
    result: {
      svg_url: savedData.original_svg_url,
      png_url: savedData.original_png_url,
      thumbnail_url: savedData.thumbnail_url
    },

    // Color recipes
    blendRecipes: savedData.blend_recipes || null,
    solidRecipes: savedData.solid_recipes || null,

    // Color mappings (convert back to Maps)
    colorMapping: deserializeMap(savedData.color_mapping),
    solidColorMapping: deserializeMap(savedData.solid_color_mapping),

    // User edits (convert back to Maps)
    solidEditedColors: deserializeMap(savedData.solid_color_edits),
    blendEditedColors: deserializeMap(savedData.blend_color_edits),

    // Final SVGs
    blendSvgUrl: savedData.final_blend_svg_url,
    solidSvgUrl: savedData.final_solid_svg_url,

    // View mode
    viewMode: savedData.preferred_view_mode || 'solid',

    // Aspect ratio
    arMapping: savedData.aspect_ratio_mapping,

    // Job ID
    jobId: savedData.job_id,

    // Restore UI state
    generating: false,
    generatingBlends: false,
    showFinalRecipes: !!savedData.blend_recipes,
    showSolidSummary: !!savedData.solid_recipes,
    colorEditorOpen: false,
    selectedColor: null
  };
}

/**
 * Validate that design state has minimum required data for saving
 * @param {Object} state - Component state
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateDesignState(state) {
  const errors = [];

  if (!state.inputMode) {
    errors.push('Input mode is required');
  }

  if (!state.widthMM || !state.lengthMM) {
    errors.push('Surface dimensions are required');
  }

  if (!state.result?.svg_url) {
    errors.push('No design to save - generate a design first');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
