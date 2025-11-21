/**
 * SVG Region Tagger
 * Tags SVG shape elements with unique region IDs for per-element color editing
 */

/**
 * Tag all shape elements in SVG with unique region IDs
 * @param {string} svgText - SVG content as string
 * @returns {string} SVG with data-region-id attributes added
 */
export function tagSvgRegions(svgText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, 'image/svg+xml');

  // Check for parse errors
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    console.error('[SVG-REGION-TAGGER] Parse error:', parseError.textContent);
    return svgText; // Return original if parsing fails
  }

  let idx = 0;

  // Tag all shape elements with unique IDs
  const elements = doc.querySelectorAll('path, rect, circle, ellipse, polygon, polyline, line');

  elements.forEach(el => {
    // Only tag if not already tagged
    if (!el.hasAttribute('data-region-id')) {
      el.setAttribute('data-region-id', `region-${idx++}`);
    }
  });

  console.log(`[SVG-REGION-TAGGER] Tagged ${idx} regions`);

  return new XMLSerializer().serializeToString(doc);
}

/**
 * Check if SVG has region tags
 * @param {string} svgText - SVG content as string
 * @returns {boolean} True if SVG has region tags
 */
export function hasRegionTags(svgText) {
  return svgText.includes('data-region-id');
}

/**
 * Get region count from tagged SVG
 * @param {string} svgText - SVG content as string
 * @returns {number} Number of tagged regions
 */
export function getRegionCount(svgText) {
  const matches = svgText.match(/data-region-id="region-\d+"/g);
  return matches ? matches.length : 0;
}
