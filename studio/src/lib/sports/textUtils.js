// TPV Studio - Text Utilities
// Functions for text measurement and font management

/**
 * Measure text dimensions using canvas API
 * @param {string} content - Text content to measure
 * @param {string} fontFamily - CSS font family
 * @param {number} fontSize_mm - Font size in mm (canvas units)
 * @param {string} fontWeight - Font weight ('normal' or 'bold')
 * @param {string} fontStyle - Font style ('normal' or 'italic')
 * @returns {{width: number, height: number}} Text dimensions in mm
 */
export function measureText(content, fontFamily, fontSize_mm, fontWeight = 'normal', fontStyle = 'normal') {
  // Use a cached canvas for performance
  if (!measureText._canvas) {
    measureText._canvas = document.createElement('canvas');
    measureText._ctx = measureText._canvas.getContext('2d');
  }

  const ctx = measureText._ctx;
  const fontStyleStr = fontStyle === 'italic' ? 'italic ' : '';
  const fontWeightStr = fontWeight === 'bold' ? 'bold ' : '';

  ctx.font = `${fontStyleStr}${fontWeightStr}${fontSize_mm}px ${fontFamily}`;
  const metrics = ctx.measureText(content || 'Double-click to edit');

  return {
    width: Math.max(metrics.width, 100), // Minimum width for empty/short text
    height: fontSize_mm * 1.2 // Approximate line height
  };
}

/**
 * Get list of available fonts for text elements
 * @returns {Array<{name: string, family: string}>} Available font options
 */
export function getAvailableFonts() {
  return [
    { name: 'Open Sans', family: 'Open Sans, sans-serif' },
    { name: 'Roboto', family: 'Roboto, sans-serif' },
    { name: 'Montserrat', family: 'Montserrat, sans-serif' },
    { name: 'Oswald', family: 'Oswald, sans-serif' },
    { name: 'Playfair Display', family: 'Playfair Display, serif' },
    { name: 'Arial', family: 'Arial, sans-serif' },
    { name: 'Georgia', family: 'Georgia, serif' },
    { name: 'Impact', family: 'Impact, sans-serif' }
  ];
}

/**
 * Get default font family
 * @returns {string} Default font family CSS value
 */
export function getDefaultFont() {
  return 'Open Sans, sans-serif';
}

/**
 * Get default text color (black from TPV palette)
 * @returns {Object} Default color object
 */
export function getDefaultTextColor() {
  return {
    tpv_code: 'RH70',
    hex: '#1C1C1C',
    name: 'Black'
  };
}
