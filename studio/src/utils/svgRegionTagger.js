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

  const svgElement = doc.documentElement;

  // Ensure SVG has proper dimensions for rendering
  if (!svgElement.hasAttribute('viewBox')) {
    // Try to get dimensions from width/height attributes
    const width = svgElement.getAttribute('width');
    const height = svgElement.getAttribute('height');

    if (width && height) {
      // Remove units (px, pt, etc) and parse numbers
      const w = parseFloat(width);
      const h = parseFloat(height);

      if (!isNaN(w) && !isNaN(h)) {
        svgElement.setAttribute('viewBox', `0 0 ${w} ${h}`);
        console.log(`[SVG-REGION-TAGGER] Added viewBox from dimensions: 0 0 ${w} ${h}`);
      }
    } else {
      // Try to calculate bounding box from content
      const bbox = calculateContentBounds(doc);
      if (bbox) {
        svgElement.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
        console.log(`[SVG-REGION-TAGGER] Added viewBox from content bounds: ${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
      }
    }
  }

  // Keep width/height attributes for intrinsic sizing
  // CSS max-width: 100% will scale the SVG to fit container
  // viewBox ensures aspect ratio is preserved during scaling

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
 * Calculate bounding box of all content in SVG
 * @param {Document} doc - SVG document
 * @returns {Object|null} Bounding box {x, y, width, height} or null
 */
function calculateContentBounds(doc) {
  try {
    // Create a temporary SVG element to calculate bounds
    const svg = doc.documentElement.cloneNode(true);
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    document.body.appendChild(tempDiv);
    tempDiv.appendChild(svg);

    const bbox = svg.getBBox();
    document.body.removeChild(tempDiv);

    if (bbox.width > 0 && bbox.height > 0) {
      return {
        x: Math.floor(bbox.x),
        y: Math.floor(bbox.y),
        width: Math.ceil(bbox.width),
        height: Math.ceil(bbox.height)
      };
    }
  } catch (error) {
    console.warn('[SVG-REGION-TAGGER] Could not calculate content bounds:', error);
  }

  return null;
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
