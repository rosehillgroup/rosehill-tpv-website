/**
 * SVG Recoloring Utility
 * Recolors SVG files by replacing original colors with blend colors
 */

import { normalizeHex } from './colorMapping.js';
import { sanitizeSVG } from './sanitizeSVG.js';

/**
 * Fetch and recolor an SVG file
 *
 * @param {string} svgUrlOrText - URL of the original SVG, or SVG text content
 * @param {Map<string, Object>} colorMapping - Map of originalHex -> { blendHex, ... }
 * @param {string} [providedSvgText] - Optional pre-loaded SVG text (to skip fetch)
 * @returns {Promise<string>} Recolored SVG as data URL
 */
export async function recolorSVG(svgUrlOrText, colorMapping, providedSvgText = null) {
  try {
    let svgText;

    if (providedSvgText) {
      // Use provided SVG text (e.g., pre-tagged SVG)
      svgText = providedSvgText;
      console.log(`[SVG-RECOLOR] Using provided SVG text (${svgText.length} chars)`);
    } else {
      // Fetch SVG content from URL
      console.log('[SVG-RECOLOR] Fetching SVG from:', svgUrlOrText);
      const response = await fetch(svgUrlOrText);
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`);
      }

      svgText = await response.text();
      console.log(`[SVG-RECOLOR] Fetched SVG (${svgText.length} chars)`);
    }

    // Sanitize SVG content before parsing (XSS protection)
    console.log('[SVG-RECOLOR] Sanitizing SVG...');
    const sanitizedSvgText = sanitizeSVG(svgText);

    if (!sanitizedSvgText) {
      throw new Error('SVG sanitization failed - content rejected');
    }

    // Parse SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(sanitizedSvgText, 'image/svg+xml');

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
 * Replace a single color value using perceptual ΔE matching with guaranteed fallback
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

  // 1. Try exact match first (fast path)
  const exactMapping = colorMapping.get(mappingKey);
  if (exactMapping) {
    return exactMapping.blendHex;
  }

  // 2. Try perceptual ΔE-based tolerance match + track nearest color
  const colorRgb = hexToRgbObj(normalized);
  if (!colorRgb) return color;

  const colorLab = rgbToLab(colorRgb);
  let bestMatch = null;
  let smallestDeltaE = Infinity;

  for (const [key, mapping] of colorMapping.entries()) {
    const keyRgb = hexToRgbObj(key.replace('#', ''));
    if (!keyRgb) continue;

    const keyLab = rgbToLab(keyRgb);
    const deltaE = deltaE2000(colorLab, keyLab);

    // Track nearest color regardless of tolerance (for guaranteed fallback)
    if (deltaE < smallestDeltaE) {
      smallestDeltaE = deltaE;
      bestMatch = mapping;
    }

    // If within tolerance (ΔE ≤ 9), return immediately
    if (deltaE <= 9) {
      console.log(`[SVG-RECOLOR] Tolerance match: ${mappingKey} → ${key} (ΔE=${deltaE.toFixed(2)})`);
      return mapping.blendHex;
    }
  }

  // 3. Guaranteed fallback: Use nearest color by ΔE (ensures no uneditable areas)
  if (bestMatch) {
    console.log(`[SVG-RECOLOR] Fallback to nearest: ${mappingKey} → ${bestMatch.blendHex} (ΔE=${smallestDeltaE.toFixed(2)})`);
    if (notMappedSet) {
      notMappedSet.add(color);
    }
    return bestMatch.blendHex;
  }

  // Should never reach here, but safety fallback
  console.warn(`[SVG-RECOLOR] No mapping found: ${mappingKey}`);
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
 * Convert RGB to LAB color space
 * @param {Object} rgb - {r, g, b} values 0-255
 * @returns {Object} {L, a, b} LAB values
 */
function rgbToLab(rgb) {
  // RGB to XYZ
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100;

  // XYZ to LAB
  const xn = 95.047;
  const yn = 100.000;
  const zn = 108.883;

  let fx = x / xn;
  let fy = y / yn;
  let fz = z / zn;

  fx = fx > 0.008856 ? Math.pow(fx, 1/3) : (7.787 * fx + 16/116);
  fy = fy > 0.008856 ? Math.pow(fy, 1/3) : (7.787 * fy + 16/116);
  fz = fz > 0.008856 ? Math.pow(fz, 1/3) : (7.787 * fz + 16/116);

  return {
    L: (116 * fy) - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz)
  };
}

/**
 * Calculate perceptual color difference using CIEDE2000 formula
 * @param {Object} lab1 - {L, a, b}
 * @param {Object} lab2 - {L, a, b}
 * @returns {number} ΔE2000 value
 */
function deltaE2000(lab1, lab2) {
  const kL = 1, kC = 1, kH = 1;
  const deg360InRad = Math.PI * 2;
  const deg180InRad = Math.PI;

  const avgL = (lab1.L + lab2.L) / 2;
  const c1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
  const c2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
  const avgC = (c1 + c2) / 2;
  const g = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));

  const a1p = lab1.a * (1 + g);
  const a2p = lab2.a * (1 + g);
  const c1p = Math.sqrt(a1p * a1p + lab1.b * lab1.b);
  const c2p = Math.sqrt(a2p * a2p + lab2.b * lab2.b);
  const avgCp = (c1p + c2p) / 2;

  let h1p = Math.atan2(lab1.b, a1p);
  if (h1p < 0) h1p += deg360InRad;
  let h2p = Math.atan2(lab2.b, a2p);
  if (h2p < 0) h2p += deg360InRad;

  const avghp = Math.abs(h1p - h2p) > deg180InRad ? (h1p + h2p + deg360InRad) / 2 : (h1p + h2p) / 2;
  const t = 1 - 0.17 * Math.cos(avghp - Math.PI / 6) + 0.24 * Math.cos(2 * avghp) + 0.32 * Math.cos(3 * avghp + Math.PI / 30) - 0.2 * Math.cos(4 * avghp - 63 * Math.PI / 180);

  let deltahp = h2p - h1p;
  if (Math.abs(deltahp) > deg180InRad) {
    deltahp = deltahp > 0 ? deltahp - deg360InRad : deltahp + deg360InRad;
  }

  const deltaL = lab2.L - lab1.L;
  const deltaCp = c2p - c1p;
  const deltaHp = 2 * Math.sqrt(c1p * c2p) * Math.sin(deltahp / 2);

  const sL = 1 + (0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2));
  const sC = 1 + 0.045 * avgCp;
  const sH = 1 + 0.015 * avgCp * t;

  const deltaTheta = 30 * Math.PI / 180 * Math.exp(-Math.pow((avghp - 275 * Math.PI / 180) / (25 * Math.PI / 180), 2));
  const rC = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
  const rT = -rC * Math.sin(2 * deltaTheta);

  const deltaE = Math.sqrt(
    Math.pow(deltaL / (kL * sL), 2) +
    Math.pow(deltaCp / (kC * sC), 2) +
    Math.pow(deltaHp / (kH * sH), 2) +
    rT * (deltaCp / (kC * sC)) * (deltaHp / (kH * sH))
  );

  return deltaE;
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
  let replacementCount = 0;

  // Match fill: color
  newCSS = newCSS.replace(/fill:\s*([^;}\s]+)/gi, (match, color) => {
    const trimmedColor = color.trim();
    const newColor = replaceColor(trimmedColor, colorMapping, stats.colorsNotMapped);
    if (newColor !== trimmedColor) {
      replacementCount++;
      console.log(`[SVG-RECOLOR-CSS] Replaced fill: ${trimmedColor} → ${newColor}`);
    }
    return `fill: ${newColor}`;
  });

  // Match stroke: color
  newCSS = newCSS.replace(/stroke:\s*([^;}\s]+)/gi, (match, color) => {
    const trimmedColor = color.trim();
    const newColor = replaceColor(trimmedColor, colorMapping, stats.colorsNotMapped);
    if (newColor !== trimmedColor) {
      replacementCount++;
      console.log(`[SVG-RECOLOR-CSS] Replaced stroke: ${trimmedColor} → ${newColor}`);
    }
    return `stroke: ${newColor}`;
  });

  // Match stop-color: color
  newCSS = newCSS.replace(/stop-color:\s*([^;}\s]+)/gi, (match, color) => {
    const trimmedColor = color.trim();
    const newColor = replaceColor(trimmedColor, colorMapping, stats.colorsNotMapped);
    if (newColor !== trimmedColor) {
      replacementCount++;
      console.log(`[SVG-RECOLOR-CSS] Replaced stop-color: ${trimmedColor} → ${newColor}`);
    }
    return `stop-color: ${newColor}`;
  });

  if (replacementCount > 0) {
    console.log(`[SVG-RECOLOR-CSS] Total CSS color replacements: ${replacementCount}`);
  }

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
