/**
 * SVG Region Overrides
 * Apply per-region color overrides to SVG elements
 */

/**
 * Apply region-level color overrides to SVG
 * This happens AFTER global color mapping to allow per-element customization
 *
 * @param {string} svgString - SVG content as string
 * @param {Map<string, string>} overrides - Map of regionId -> hex color
 * @returns {string} SVG with region overrides applied
 */
export function applyRegionOverrides(svgString, overrides) {
  if (!overrides || overrides.size === 0) {
    return svgString;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');

  // Check for parse errors
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    console.error('[SVG-REGION-OVERRIDES] Parse error:', parseError.textContent);
    return svgString;
  }

  let appliedCount = 0;

  overrides.forEach((hex, regionId) => {
    const el = doc.querySelector(`[data-region-id="${regionId}"]`);
    if (el) {
      // Check if this is a transparency override
      const isTransparent = hex === 'transparent' || hex === 'none';

      // Update fill attribute
      if (el.hasAttribute('fill') || isTransparent) {
        if (isTransparent) {
          el.setAttribute('fill', 'none');
          el.setAttribute('fill-opacity', '0');
        } else {
          el.setAttribute('fill', hex);
          // Remove any transparency settings
          el.removeAttribute('fill-opacity');
        }
        appliedCount++;
      }

      // Update stroke if it exists and matches fill pattern
      if (el.hasAttribute('stroke') && el.getAttribute('stroke') !== 'none') {
        // Only update stroke if it was likely a fill color (not black/white border)
        const currentStroke = el.getAttribute('stroke');
        if (currentStroke && currentStroke !== '#000' && currentStroke !== '#000000' &&
            currentStroke !== '#fff' && currentStroke !== '#ffffff') {
          if (isTransparent) {
            el.setAttribute('stroke', 'none');
            el.setAttribute('stroke-opacity', '0');
          } else {
            el.setAttribute('stroke', hex);
          }
        }
      }

      // Update inline style if present
      const style = el.getAttribute('style');
      if (style && style.includes('fill:')) {
        if (isTransparent) {
          const newStyle = style.replace(/fill:\s*[^;]+/, 'fill: none');
          el.setAttribute('style', newStyle);
        } else {
          const newStyle = style.replace(/fill:\s*[^;]+/, `fill: ${hex}`);
          el.setAttribute('style', newStyle);
        }
      }
    } else {
      console.warn(`[SVG-REGION-OVERRIDES] Region not found: ${regionId}`);
    }
  });

  console.log(`[SVG-REGION-OVERRIDES] Applied ${appliedCount} region overrides`);

  return new XMLSerializer().serializeToString(doc);
}

/**
 * Get color of a specific region
 * @param {string} svgString - SVG content as string
 * @param {string} regionId - Region ID to query
 * @returns {string|null} Hex color or null if not found
 */
export function getRegionColor(svgString, regionId) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');

  const el = doc.querySelector(`[data-region-id="${regionId}"]`);
  if (!el) return null;

  // Try fill attribute first
  const fill = el.getAttribute('fill');
  if (fill && fill !== 'none') return fill;

  // Try inline style
  const style = el.getAttribute('style');
  if (style) {
    const match = style.match(/fill:\s*([^;]+)/);
    if (match) return match[1].trim();
  }

  return null;
}

/**
 * Remove all region overrides from a map for a specific color
 * Useful for "reset color" functionality
 * @param {Map<string, string>} overrides - Current overrides map
 * @param {string} targetHex - Hex color to remove overrides for
 * @returns {Map<string, string>} New map with overrides removed
 */
export function removeOverridesForColor(overrides, targetHex) {
  const newOverrides = new Map();
  const normalizedTarget = targetHex.toLowerCase();

  for (const [regionId, hex] of overrides.entries()) {
    if (hex.toLowerCase() !== normalizedTarget) {
      newOverrides.set(regionId, hex);
    }
  }

  return newOverrides;
}
