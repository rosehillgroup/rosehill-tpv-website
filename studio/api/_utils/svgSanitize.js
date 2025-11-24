/**
 * SVG Sanitization Utility for Server-Side (API endpoints)
 * Removes XSS vectors from SVG content while preserving visual elements
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize SVG content to remove XSS vectors
 * @param {string} svgString - Raw SVG content
 * @returns {string} Sanitized SVG content
 */
export function sanitizeSVG(svgString) {
  if (!svgString || typeof svgString !== 'string') {
    console.warn('[SVG-SANITIZE] Invalid input:', typeof svgString);
    return '';
  }

  const config = {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: [
      'script', 'foreignObject', 'iframe', 'object', 'embed',
      'link', 'style', 'animation', 'set', 'animateMotion',
      'animateColor', 'animateTransform'
    ],
    FORBID_ATTR: [
      'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout',
      'onmouseenter', 'onmouseleave', 'onmousemove', 'onmousedown',
      'onmouseup', 'onfocus', 'onblur', 'onkeydown', 'onkeyup',
      'onkeypress', 'xlink:href'
    ],
    ALLOW_DATA_ATTR: true,
    ALLOW_COMMENTS: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false
  };

  try {
    const sanitized = DOMPurify.sanitize(svgString, config);

    if (!sanitized || !sanitized.includes('<svg')) {
      console.error('[SVG-SANITIZE] Sanitization removed SVG content');
      return '';
    }

    return sanitized;
  } catch (error) {
    console.error('[SVG-SANITIZE] Sanitization failed:', error);
    return '';
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

  const dangerousPatterns = [
    '<script', 'javascript:', 'onload=', 'onerror=', 'onclick=',
    'onmouseover=', '<foreignobject', '<iframe', '<object',
    '<embed', 'data:text/html', '<link', '<style'
  ];

  for (const pattern of dangerousPatterns) {
    if (lowerContent.includes(pattern)) {
      console.warn(`[SVG-VALIDATE] Dangerous pattern detected: ${pattern}`);
      return false;
    }
  }

  if (!lowerContent.trim().startsWith('<svg') && !lowerContent.includes('<svg')) {
    console.warn('[SVG-VALIDATE] Content does not appear to be valid SVG');
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
  if (!quickValidateSVG(svgString)) {
    return null;
  }

  const sanitized = sanitizeSVG(svgString);

  if (!sanitized) {
    return null;
  }

  return sanitized;
}
