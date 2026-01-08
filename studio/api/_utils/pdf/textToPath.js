/**
 * Text-to-Path Conversion Utility
 * Converts SVG text elements to path elements using opentype.js
 *
 * This ensures text renders correctly in Resvg/PDF regardless of system fonts
 */

import opentype from 'opentype.js';

// Cache for loaded fonts
const fontCache = new Map();

// Google Fonts API URLs for common fonts (TTF format for opentype.js compatibility)
const GOOGLE_FONT_URLS = {
  'Open Sans': 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-muw.ttf',
  'Open Sans Bold': 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjr.ttf',
  'Black Ops One': 'https://fonts.gstatic.com/s/blackopsone/v20/qWcsB6-ypo7xBdr6Xshe96H3WDc.ttf',
  'Roboto': 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5g.ttf',
  'Arial': null, // System font fallback
};

// Fallback font (bundled or system)
const FALLBACK_FONT = 'Open Sans';

/**
 * Load a font by name, fetching from Google Fonts if needed
 * @param {string} fontFamily - Font family name
 * @param {string} fontWeight - Font weight ('normal' or 'bold')
 * @returns {Promise<opentype.Font>} Loaded font
 */
async function loadFont(fontFamily, fontWeight = 'normal') {
  // Normalize font family name
  const baseFontName = fontFamily.split(',')[0].trim().replace(/['"]/g, '');
  const fontKey = fontWeight === 'bold' ? `${baseFontName} Bold` : baseFontName;

  // Check cache
  if (fontCache.has(fontKey)) {
    return fontCache.get(fontKey);
  }

  // Try to load the font
  let fontUrl = GOOGLE_FONT_URLS[fontKey] || GOOGLE_FONT_URLS[baseFontName];

  // If no URL for this font, try fallback
  if (!fontUrl) {
    console.log(`[TEXT-TO-PATH] Font "${fontKey}" not available, using fallback`);
    fontUrl = GOOGLE_FONT_URLS[FALLBACK_FONT];
  }

  if (!fontUrl) {
    throw new Error(`No font URL available for "${fontFamily}"`);
  }

  try {
    console.log(`[TEXT-TO-PATH] Loading font: ${fontKey}`);
    const response = await fetch(fontUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const font = opentype.parse(arrayBuffer);

    fontCache.set(fontKey, font);
    console.log(`[TEXT-TO-PATH] Font loaded: ${fontKey}`);

    return font;
  } catch (error) {
    console.error(`[TEXT-TO-PATH] Failed to load font "${fontKey}":`, error.message);

    // Try fallback if not already using it
    if (fontKey !== FALLBACK_FONT) {
      return loadFont(FALLBACK_FONT, fontWeight);
    }

    throw error;
  }
}

/**
 * Convert a single text element to path data and attributes
 * @param {Element} textElement - SVG text element
 * @param {opentype.Font} font - Loaded font
 * @param {Document} doc - XML document for creating elements
 * @returns {Element|null} SVG group element containing path
 */
function textElementToPathElement(textElement, font, doc) {
  const content = textElement.textContent || '';
  if (!content.trim()) return null;

  // Get text attributes
  const fontSize = parseFloat(textElement.getAttribute('fontSize') || textElement.getAttribute('font-size')) || 500;
  const fill = textElement.getAttribute('fill') || '#000000';
  const stroke = textElement.getAttribute('stroke');
  const strokeWidth = textElement.getAttribute('stroke-width') || textElement.getAttribute('strokeWidth');
  const textAnchor = textElement.getAttribute('text-anchor') || 'start';
  const paintOrder = textElement.getAttribute('paint-order') || 'fill stroke';

  // Get position from x, y attributes
  const x = parseFloat(textElement.getAttribute('x')) || 0;
  const y = parseFloat(textElement.getAttribute('y')) || 0;

  // Generate path data using opentype.js
  const path = font.getPath(content, 0, 0, fontSize);
  const pathData = path.toPathData(3); // 3 decimal places

  // Calculate offset based on text-anchor
  let offsetX = 0;
  if (textAnchor === 'middle') {
    const width = font.getAdvanceWidth(content, fontSize);
    offsetX = -width / 2;
  } else if (textAnchor === 'end') {
    const width = font.getAdvanceWidth(content, fontSize);
    offsetX = -width;
  }

  // Create group element with transform
  const groupEl = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
  groupEl.setAttribute('transform', `translate(${x + offsetX}, ${y})`);

  // Create path element
  const pathEl = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathEl.setAttribute('d', pathData);
  pathEl.setAttribute('fill', fill);

  if (stroke && stroke !== 'none') {
    pathEl.setAttribute('stroke', stroke);
    if (strokeWidth) {
      pathEl.setAttribute('stroke-width', strokeWidth);
    }
    pathEl.setAttribute('stroke-linejoin', 'round');
    pathEl.setAttribute('stroke-linecap', 'round');
    if (paintOrder) {
      pathEl.setAttribute('paint-order', paintOrder);
    }
  }

  groupEl.appendChild(pathEl);

  // Copy any class from the original text
  const className = textElement.getAttribute('class');
  if (className) {
    groupEl.setAttribute('class', className);
  }

  return groupEl;
}

/**
 * Convert all text elements in an SVG string to paths
 * @param {string} svgString - SVG content
 * @returns {Promise<string>} SVG with text converted to paths
 */
export async function convertTextToPaths(svgString) {
  if (!svgString || !svgString.includes('<text')) {
    console.log('[TEXT-TO-PATH] No text elements found, skipping conversion');
    return svgString; // No text elements, return as-is
  }

  console.log('[TEXT-TO-PATH] Converting text elements to paths...');

  // Parse SVG using linkedom (serverless-compatible, unlike jsdom)
  const { parseHTML } = await import('linkedom');
  const { document: doc } = parseHTML(`<!DOCTYPE html><html><body>${svgString}</body></html>`);

  // Find all text elements
  const textElements = doc.querySelectorAll('text');
  console.log(`[TEXT-TO-PATH] Found ${textElements.length} text elements`);

  if (textElements.length === 0) {
    return svgString;
  }

  // Convert each text element to paths
  const elementsToConvert = Array.from(textElements);
  let convertedCount = 0;

  for (const textEl of elementsToConvert) {
    try {
      const fontFamily = textEl.getAttribute('fontFamily') || textEl.getAttribute('font-family') || 'Open Sans';
      const fontWeight = textEl.getAttribute('fontWeight') || textEl.getAttribute('font-weight') || 'normal';
      const textContent = textEl.textContent || '';

      console.log(`[TEXT-TO-PATH] Processing: "${textContent.substring(0, 30)}" (font: ${fontFamily}, weight: ${fontWeight})`);

      // Load the font
      const font = await loadFont(fontFamily, fontWeight);

      // Convert to path element
      const pathGroup = textElementToPathElement(textEl, font, doc);

      if (pathGroup) {
        // Replace text with path group
        textEl.parentNode.replaceChild(pathGroup, textEl);
        convertedCount++;
        console.log(`[TEXT-TO-PATH] Successfully converted: "${textContent.substring(0, 20)}..."`);
      }
    } catch (error) {
      console.error(`[TEXT-TO-PATH] Failed to convert text:`, error.message, error.stack?.substring(0, 200));
      // Leave the text element as-is if conversion fails
    }
  }

  console.log(`[TEXT-TO-PATH] Converted ${convertedCount}/${elementsToConvert.length} text elements`);

  // Get the SVG element and serialize it
  const svgElement = doc.querySelector('svg');
  if (!svgElement) {
    console.error('[TEXT-TO-PATH] No SVG element found after conversion');
    return svgString;
  }

  // linkedom elements have outerHTML property
  const result = svgElement.outerHTML;

  console.log('[TEXT-TO-PATH] Conversion complete, output length:', result.length);
  return result;
}

export { loadFont };
