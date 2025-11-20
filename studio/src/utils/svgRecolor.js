/**
 * SVG Recoloring Utility
 * Recolors SVG files by replacing original colors with blend colors
 */

import { normalizeHex } from './colorMapping.js';

/**
 * Fetch and recolor an SVG file
 *
 * @param {string} svgUrl - URL of the original SVG
 * @param {Map<string, Object>} colorMapping - Map of originalHex -> { blendHex, ... }
 * @returns {Promise<string>} Recolored SVG as data URL
 */
export async function recolorSVG(svgUrl, colorMapping) {
  try {
    // Fetch SVG content
    console.log('[SVG-RECOLOR] Fetching SVG from:', svgUrl);
    const response = await fetch(svgUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`);
    }

    const svgText = await response.text();
    console.log(`[SVG-RECOLOR] Fetched SVG (${svgText.length} chars)`);

    // Parse SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

    // Check for parse errors
    const parseError = svgDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error(`SVG parse error: ${parseError.textContent}`);
    }

    const svgElement = svgDoc.documentElement;
    if (svgElement.tagName !== 'svg') {
      throw new Error('Invalid SVG: root element is not <svg>');
    }

    // Recolor the SVG
    const stats = recolorSVGElement(svgElement, colorMapping);
    console.log('[SVG-RECOLOR] Recoloring complete:', stats);

    // Serialize back to string
    const serializer = new XMLSerializer();
    const recoloredSVG = serializer.serializeToString(svgDoc);

    // Convert to data URL
    const blob = new Blob([recoloredSVG], { type: 'image/svg+xml' });
    const dataUrl = URL.createObjectURL(blob);

    return {
      dataUrl,
      svgText: recoloredSVG,
      stats
    };

  } catch (error) {
    console.error('[SVG-RECOLOR] Error:', error);
    throw error;
  }
}

/**
 * Recolor an SVG DOM element in-place
 *
 * @param {Element} svgElement - SVG DOM element
 * @param {Map} colorMapping - Color mapping
 * @returns {Object} Statistics about recoloring
 */
function recolorSVGElement(svgElement, colorMapping) {
  const stats = {
    totalElements: 0,
    fillsReplaced: 0,
    strokesReplaced: 0,
    stopColorsReplaced: 0,
    stylesProcessed: 0,
    colorsNotMapped: new Set()
  };

  // Walk all elements in the SVG
  const allElements = svgElement.querySelectorAll('*');
  stats.totalElements = allElements.length;

  for (const element of allElements) {
    // Process fill attribute
    const fill = element.getAttribute('fill');
    if (fill && fill !== 'none') {
      const newFill = replaceColor(fill, colorMapping, stats.colorsNotMapped);
      if (newFill !== fill) {
        element.setAttribute('fill', newFill);
        stats.fillsReplaced++;
      }
    }

    // Process stroke attribute
    const stroke = element.getAttribute('stroke');
    if (stroke && stroke !== 'none') {
      const newStroke = replaceColor(stroke, colorMapping, stats.colorsNotMapped);
      if (newStroke !== stroke) {
        element.setAttribute('stroke', newStroke);
        stats.strokesReplaced++;
      }
    }

    // Process stop-color attribute (for gradients)
    const stopColor = element.getAttribute('stop-color');
    if (stopColor && stopColor !== 'none') {
      const newStopColor = replaceColor(stopColor, colorMapping, stats.colorsNotMapped);
      if (newStopColor !== stopColor) {
        element.setAttribute('stop-color', newStopColor);
        stats.stopColorsReplaced++;
      }
    }

    // Process style attribute
    const style = element.getAttribute('style');
    if (style) {
      const newStyle = recolorStyleAttribute(style, colorMapping, stats);
      if (newStyle !== style) {
        element.setAttribute('style', newStyle);
        stats.stylesProcessed++;
      }
    }
  }

  // Process <style> elements
  const styleElements = svgElement.querySelectorAll('style');
  for (const styleEl of styleElements) {
    const originalCSS = styleEl.textContent;
    const newCSS = recolorCSS(originalCSS, colorMapping, stats);
    if (newCSS !== originalCSS) {
      styleEl.textContent = newCSS;
      stats.stylesProcessed++;
    }
  }

  // Process gradient stop elements specifically (ensures coverage)
  const gradientStops = svgElement.querySelectorAll('stop');
  for (const stop of gradientStops) {
    // Check stop-color attribute
    const stopColor = stop.getAttribute('stop-color');
    if (stopColor && stopColor !== 'none') {
      const newStopColor = replaceColor(stopColor, colorMapping, stats.colorsNotMapped);
      if (newStopColor !== stopColor) {
        stop.setAttribute('stop-color', newStopColor);
        stats.stopColorsReplaced++;
      }
    }

    // Check style attribute for stop-color
    const stopStyle = stop.getAttribute('style');
    if (stopStyle && stopStyle.includes('stop-color')) {
      const newStyle = recolorStyleAttribute(stopStyle, colorMapping, stats);
      if (newStyle !== stopStyle) {
        stop.setAttribute('style', newStyle);
        stats.stylesProcessed++;
      }
    }
  }

  return stats;
}

/**
 * Replace a single color value
 *
 * @param {string} color - Color string (hex, rgb, etc.)
 * @param {Map} colorMapping - Color mapping
 * @param {Set} notMappedSet - Set to collect unmapped colors
 * @returns {string} Replaced color or original if not in mapping
 */
function replaceColor(color, colorMapping, notMappedSet) {
  // Normalize and try to find in mapping
  const normalized = normalizeColorValue(color);
  if (!normalized) return color;

  const mappingKey = `#${normalized}`;

  // Try exact match first (fast path)
  const exactMapping = colorMapping.get(mappingKey);
  if (exactMapping) {
    console.log(`[SVG-RECOLOR] Exact match: ${mappingKey} -> ${exactMapping.blendHex}`);
    return exactMapping.blendHex;
  }

  // Try tolerance-based match (for collapsed color clusters)
  const colorRgb = hexToRgbObj(normalized);
  if (colorRgb) {
    for (const [key, mapping] of colorMapping.entries()) {
      const keyRgb = hexToRgbObj(key.replace('#', ''));
      if (keyRgb && colorMatches(colorRgb, keyRgb)) {
        console.log(`[SVG-RECOLOR] Tolerance match: ${mappingKey} matched to ${key} -> ${mapping.blendHex}`);
        return mapping.blendHex;
      }
    }
  }

  // Color not in mapping
  console.log(`[SVG-RECOLOR] No match found for: ${mappingKey} RGB(${colorRgb?.r}, ${colorRgb?.g}, ${colorRgb?.b})`);
  if (notMappedSet) {
    notMappedSet.add(color);
  }

  return color;
}

/**
 * Convert hex to RGB object
 * @param {string} hex - Hex color (no #)
 * @returns {Object|null} {r, g, b} or null
 */
function hexToRgbObj(hex) {
  if (hex.length !== 6) return null;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

/**
 * Check if two RGB colors match within tolerance
 * @param {Object} rgb1 - {r, g, b}
 * @param {Object} rgb2 - {r, g, b}
 * @returns {boolean}
 */
function colorMatches(rgb1, rgb2) {
  const tolerance = 50; // Same as SVGPreview
  return (
    Math.abs(rgb1.r - rgb2.r) <= tolerance &&
    Math.abs(rgb1.g - rgb2.g) <= tolerance &&
    Math.abs(rgb1.b - rgb2.b) <= tolerance
  );
}

/**
 * Recolor a style attribute
 *
 * @param {string} style - Style attribute value
 * @param {Map} colorMapping - Color mapping
 * @param {Object} stats - Statistics object
 * @returns {string} Recolored style
 */
function recolorStyleAttribute(style, colorMapping, stats) {
  let newStyle = style;

  // Match fill: color
  newStyle = newStyle.replace(/fill:\s*([^;]+)/gi, (match, color) => {
    const newColor = replaceColor(color.trim(), colorMapping, stats.colorsNotMapped);
    return `fill: ${newColor}`;
  });

  // Match stroke: color
  newStyle = newStyle.replace(/stroke:\s*([^;]+)/gi, (match, color) => {
    const newColor = replaceColor(color.trim(), colorMapping, stats.colorsNotMapped);
    return `stroke: ${newColor}`;
  });

  // Match stop-color: color
  newStyle = newStyle.replace(/stop-color:\s*([^;]+)/gi, (match, color) => {
    const newColor = replaceColor(color.trim(), colorMapping, stats.colorsNotMapped);
    return `stop-color: ${newColor}`;
  });

  return newStyle;
}

/**
 * Recolor CSS content
 *
 * @param {string} css - CSS text
 * @param {Map} colorMapping - Color mapping
 * @param {Object} stats - Statistics object
 * @returns {string} Recolored CSS
 */
function recolorCSS(css, colorMapping, stats) {
  let newCSS = css;

  // Match fill: color
  newCSS = newCSS.replace(/fill:\s*([^;}\s]+)/gi, (match, color) => {
    const newColor = replaceColor(color.trim(), colorMapping, stats.colorsNotMapped);
    return `fill: ${newColor}`;
  });

  // Match stroke: color
  newCSS = newCSS.replace(/stroke:\s*([^;}\s]+)/gi, (match, color) => {
    const newColor = replaceColor(color.trim(), colorMapping, stats.colorsNotMapped);
    return `stroke: ${newColor}`;
  });

  // Match stop-color: color
  newCSS = newCSS.replace(/stop-color:\s*([^;}\s]+)/gi, (match, color) => {
    const newColor = replaceColor(color.trim(), colorMapping, stats.colorsNotMapped);
    return `stop-color: ${newColor}`;
  });

  return newCSS;
}

/**
 * Normalize a color value to hex (lowercase, no #)
 *
 * @param {string} color - Color value
 * @returns {string|null} Normalized hex or null
 */
function normalizeColorValue(color) {
  const trimmed = color.trim().toLowerCase();

  // Already hex
  if (trimmed.match(/^#?[0-9a-f]{6}$/)) {
    return normalizeHex(trimmed);
  }

  // Short hex (#fff -> #ffffff)
  const shortHex = trimmed.match(/^#?([0-9a-f]{3})$/);
  if (shortHex) {
    const expanded = shortHex[1].split('').map(c => c + c).join('');
    return expanded;
  }

  // RGB format
  const rgbMatch = trimmed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    return rgbToHex(r, g, b);
  }

  // Named colors (basic set) - map to hex
  const namedColors = {
    'white': 'ffffff',
    'black': '000000',
    'red': 'ff0000',
    'green': '008000',
    'blue': '0000ff',
    'yellow': 'ffff00',
    'cyan': '00ffff',
    'magenta': 'ff00ff',
    'gray': '808080',
    'grey': '808080',
    'orange': 'ffa500',
    'purple': '800080'
  };

  if (namedColors[trimmed]) {
    return namedColors[trimmed];
  }

  return null;
}

/**
 * Convert RGB to hex
 *
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color (lowercase, no #)
 */
function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const clamped = Math.max(0, Math.min(255, n));
    return clamped.toString(16).padStart(2, '0');
  };
  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Download recolored SVG as a file
 *
 * @param {string} svgText - SVG content
 * @param {string} filename - Filename (default: design_blend.svg)
 */
export function downloadSVG(svgText, filename = 'design_blend.svg') {
  const blob = new Blob([svgText], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
