// TPV Studio - Design Serializer
// Converts design state to/from database format

import { FEATURE_FLAGS } from '../lib/constants.js';

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
    jobId,
    inSituData,
    regionOverrides,
    originalTaggedSvg,
    originalUnflattenedSvg
  } = state;


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
    job_id: jobId || null,

    // In-situ preview data
    in_situ: inSituData ? {
      room_photo_url: inSituData.room_photo_url || null,
      mask_url: inSituData.mask_url || null,
      floor_dimensions_m: inSituData.floor_dimensions_m || null,
      preview_url: inSituData.preview_url || null,
      blend_opacity: inSituData.blend_opacity || 20,
      perspective_corners: inSituData.perspective_corners || null
    } : null,

    // Per-region overrides (for individual element edits like transparency)
    region_overrides: serializeMap(regionOverrides),
    original_tagged_svg: originalTaggedSvg || null,

    // Original unflattened SVG for revert functionality
    original_unflattened_svg: originalUnflattenedSvg || null
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

  // Helper to get field from top-level or nested design_data (for backwards compatibility)
  const getField = (field) => savedData[field] ?? savedData.design_data?.[field];

  // Determine region overrides source
  const regionOverridesData = getField('region_overrides');
  const originalTaggedSvgData = getField('original_tagged_svg');
  const originalUnflattenedSvgData = getField('original_unflattened_svg');


  return {
    inputMode: savedData.input_mode || getField('input_mode'),
    prompt: getField('prompt') || '',
    selectedFile: getField('uploaded_file_url') ? {
      url: getField('uploaded_file_url'),
      name: getField('uploaded_file_url').split('/').pop()
    } : null,
    lengthMM: getField('dimensions')?.lengthMM || 0,
    widthMM: getField('dimensions')?.widthMM || 0,

    // Result object (matches job output format)
    result: {
      svg_url: getField('original_svg_url'),
      png_url: getField('original_png_url'),
      thumbnail_url: getField('thumbnail_url')
    },

    // Color recipes
    blendRecipes: getField('blend_recipes') || null,
    solidRecipes: getField('solid_recipes') || null,

    // Color mappings (convert back to Maps)
    colorMapping: deserializeMap(getField('color_mapping')),
    solidColorMapping: deserializeMap(getField('solid_color_mapping')),

    // User edits (convert back to Maps)
    solidEditedColors: deserializeMap(getField('solid_color_edits')),
    blendEditedColors: deserializeMap(getField('blend_color_edits')),

    // Final SVGs - Don't restore blob URLs, they need to be regenerated
    // The component will regenerate these from the original SVG + recipes + edits
    blendSvgUrl: null,
    solidSvgUrl: null,

    // View mode - force solid mode if blend is disabled via feature flag
    viewMode: FEATURE_FLAGS.BLEND_MODE_ENABLED
      ? (getField('preferred_view_mode') || 'solid')
      : 'solid',

    // Aspect ratio
    arMapping: getField('aspect_ratio_mapping'),

    // Job ID
    jobId: getField('job_id'),

    // In-situ preview data
    inSituData: getField('in_situ') || null,

    // Per-region overrides (for individual element edits like transparency)
    regionOverrides: deserializeMap(regionOverridesData),
    originalTaggedSvg: originalTaggedSvgData || null,

    // Original unflattened SVG for revert functionality
    originalUnflattenedSvg: originalUnflattenedSvgData || null,

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

  // Check for valid positive dimensions (not 0, null, or undefined)
  if (!(state.widthMM > 0) || !(state.lengthMM > 0)) {
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
