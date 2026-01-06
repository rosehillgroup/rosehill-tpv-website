/**
 * SVG Sanitization Utility for Server-Side (API endpoints)
 * Uses DOMPurify with strict allowlist for robust XSS prevention
 */

import DOMPurify from 'isomorphic-dompurify';

// Strict SVG allowlist - presentation elements only
const SVG_ALLOWED_TAGS = [
  'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line',
  'polyline', 'polygon', 'text', 'tspan', 'defs', 'clipPath',
  'linearGradient', 'radialGradient', 'stop', 'pattern', 'use',
  'symbol', 'title', 'desc', 'mask', 'image'
  // NOTE: 'filter' omitted - not needed and increases attack surface
];

// Explicit attributes - NO 'style' (use fill/stroke/etc directly)
const SVG_ALLOWED_ATTRS = [
  'id', 'class', 'fill', 'stroke', 'stroke-width', 'stroke-linecap',
  'stroke-linejoin', 'stroke-dasharray', 'stroke-opacity', 'fill-opacity',
  'opacity', 'transform', 'd', 'x', 'y', 'width', 'height', 'viewBox',
  'cx', 'cy', 'r', 'rx', 'ry', 'points', 'x1', 'y1', 'x2', 'y2',
  'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor',
  'dominant-baseline', 'clip-path', 'offset', 'stop-color', 'stop-opacity',
  'gradientUnits', 'gradientTransform', 'patternUnits', 'patternTransform',
  'preserveAspectRatio', 'xmlns', 'xmlns:xlink', 'fill-rule', 'clip-rule',
  'vector-effect', 'letter-spacing', 'text-decoration', 'alignment-baseline',
  'baseline-shift', 'mask', 'overflow', 'visibility'
  // NOTE: 'style' omitted - use explicit attributes instead
  // NOTE: 'href'/'xlink:href' handled separately via hook
];

/**
 * Sanitize SVG content using DOMPurify with strict allowlist
 * @param {string} svgString - Raw SVG content
 * @returns {string} Sanitized SVG content
 */
export function sanitizeSVG(svgString) {
  if (!svgString || typeof svgString !== 'string') {
    console.warn('[SVG-SANITIZE] Invalid input:', typeof svgString);
    return '';
  }

  try {
    // Configure DOMPurify for strict SVG sanitization
    const config = {
      USE_PROFILES: { svg: true, svgFilters: false }, // Filters disabled
      ALLOWED_TAGS: SVG_ALLOWED_TAGS,
      ALLOWED_ATTR: SVG_ALLOWED_ATTRS,
      FORBID_TAGS: ['script', 'foreignObject', 'iframe', 'object', 'embed', 'filter', 'link'],
      FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'style'],
      SANITIZE_DOM: true,
      KEEP_CONTENT: false, // Don't keep content of removed elements
      ALLOW_DATA_ATTR: false, // No data-* attributes
    };

    // Add hook to only allow internal href references (#id)
    DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
      if (data.attrName === 'href' || data.attrName === 'xlink:href') {
        const value = data.attrValue;
        // Block data: URLs explicitly
        if (value && value.startsWith('data:')) {
          data.attrValue = '';
          data.keepAttr = false;
          return;
        }
        // Only allow internal references (start with #) or valid image URLs
        if (value && !value.startsWith('#') && !isValidImageUrl(value)) {
          data.attrValue = '';
          data.keepAttr = false;
        }
      }
    });

    const result = DOMPurify.sanitize(svgString, config);

    // Remove the hook after use to prevent leaking
    DOMPurify.removeHook('uponSanitizeAttribute');

    // Verify result still contains SVG
    if (!result || !result.includes('<svg')) {
      console.error('[SVG-SANITIZE] Sanitization removed SVG content');
      return '';
    }

    return result;
  } catch (error) {
    console.error('[SVG-SANITIZE] Sanitization failed:', error);
    // Remove hook on error too
    try {
      DOMPurify.removeHook('uponSanitizeAttribute');
    } catch (e) {
      // Ignore hook removal errors
    }
    return '';
  }
}

/**
 * Check if a URL is a valid image URL (for image elements)
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid image URL
 */
function isValidImageUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url, 'https://example.com');
    // Only allow https and common image extensions
    if (parsed.protocol !== 'https:') return false;
    const path = parsed.pathname.toLowerCase();
    return path.endsWith('.png') || path.endsWith('.jpg') ||
           path.endsWith('.jpeg') || path.endsWith('.svg') ||
           path.endsWith('.gif') || path.endsWith('.webp');
  } catch {
    return false;
  }
}

/**
 * Quick check if SVG contains potentially dangerous elements
 * @param {string} svgString - SVG content to check
 * @returns {boolean} True if SVG appears safe
 */
export function quickValidateSVG(svgString) {
  if (!svgString || typeof svgString !== 'string') {
    return false;
  }

  const lowerContent = svgString.toLowerCase();

  // Check for obviously dangerous patterns (strict XSS vectors only)
  const dangerousPatterns = [
    '<script',
    'javascript:',
    'onload=',
    'onerror=',
    'onclick=',
    'onmouseover=',
    '<foreignobject',
    '<iframe',
    '<embed',
    'data:text/html'
  ];

  for (const pattern of dangerousPatterns) {
    if (lowerContent.includes(pattern)) {
      console.warn(`[SVG-VALIDATE] Dangerous pattern detected: ${pattern}`);
      return false;
    }
  }

  // Verify it contains SVG tag (anywhere in the content, not just at start)
  if (!lowerContent.includes('<svg')) {
    console.warn('[SVG-VALIDATE] Content does not appear to be valid SVG (no <svg> tag found)');
    return false;
  }

  return true;
}

/**
 * Sanitize and validate SVG in one step
 * @param {string} svgString - Raw SVG content
 * @returns {string|null} Sanitized SVG or null if invalid
 */
export function sanitizeAndValidateSVG(svgString) {
  // Quick validation first
  if (!quickValidateSVG(svgString)) {
    return null;
  }

  const sanitized = sanitizeSVG(svgString);

  if (!sanitized) {
    return null;
  }

  return sanitized;
}
