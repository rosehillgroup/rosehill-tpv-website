// TPV Studio - MUGA (Multi-Use Games Area) Preset Library
import mugaPresetsData from '../../data/mugaPresets.json';

/**
 * Get all available MUGA presets
 */
export function getAllMUGAPresets() {
  return Object.values(mugaPresetsData);
}

/**
 * Get a specific MUGA preset by ID
 */
export function getMUGAPreset(presetId) {
  return mugaPresetsData[presetId] || null;
}

/**
 * Get MUGA presets that fit within the given surface dimensions
 * @param {number} width_mm - Surface width in millimeters
 * @param {number} length_mm - Surface length in millimeters
 * @param {number} tolerance - Tolerance percentage (default 0.05 = 5%)
 * @returns {Array} Array of compatible MUGA presets
 */
export function getMUGAPresetsBySurfaceSize(width_mm, length_mm, tolerance = 0.05) {
  return getAllMUGAPresets().filter(preset => {
    const minWidth = preset.minSurface.width_mm;
    const minLength = preset.minSurface.length_mm;

    // Check if surface is large enough (with tolerance)
    const widthFits = width_mm >= minWidth * (1 - tolerance);
    const lengthFits = length_mm >= minLength * (1 - tolerance);

    return widthFits && lengthFits;
  });
}

/**
 * Check if a MUGA preset fits within the given surface
 * @param {object} preset - MUGA preset object
 * @param {number} width_mm - Surface width in millimeters
 * @param {number} length_mm - Surface length in millimeters
 * @returns {object} Compatibility information
 */
export function checkMUGACompatibility(preset, width_mm, length_mm) {
  const minWidth = preset.minSurface.width_mm;
  const minLength = preset.minSurface.length_mm;
  const recWidth = preset.recommendedSurface.width_mm;
  const recLength = preset.recommendedSurface.length_mm;

  const widthFits = width_mm >= minWidth;
  const lengthFits = length_mm >= minLength;
  const fitsMinimum = widthFits && lengthFits;

  const widthOptimal = width_mm >= recWidth;
  const lengthOptimal = length_mm >= recLength;
  const fitsRecommended = widthOptimal && lengthOptimal;

  let status = 'incompatible';
  let message = '';

  if (fitsRecommended) {
    status = 'optimal';
    message = 'Perfect fit for this surface';
  } else if (fitsMinimum) {
    status = 'compatible';
    message = 'Will fit, but recommended size is larger';
  } else {
    status = 'incompatible';
    const missingWidth = Math.max(0, minWidth - width_mm);
    const missingLength = Math.max(0, minLength - length_mm);

    if (missingWidth > 0 && missingLength > 0) {
      message = `Surface too small. Need ${(missingWidth / 1000).toFixed(1)}m more width and ${(missingLength / 1000).toFixed(1)}m more length`;
    } else if (missingWidth > 0) {
      message = `Surface too narrow. Need ${(missingWidth / 1000).toFixed(1)}m more width`;
    } else {
      message = `Surface too short. Need ${(missingLength / 1000).toFixed(1)}m more length`;
    }
  }

  return {
    fitsMinimum,
    fitsRecommended,
    status,
    message,
    minDimensions: { width_mm: minWidth, length_mm: minLength },
    recommendedDimensions: { width_mm: recWidth, length_mm: recLength }
  };
}

/**
 * Get color scheme legend for a MUGA preset
 * @param {object} preset - MUGA preset object
 * @returns {Array} Array of color legend items
 */
export function getMUGAColorScheme(preset) {
  return preset.colorScheme || [];
}
