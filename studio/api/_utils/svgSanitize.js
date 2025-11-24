/**
 * SVG Sanitization Utility for Server-Side (API endpoints)
 * Removes XSS vectors from SVG content while preserving visual elements
 */

/**
 * Sanitize SVG content using regex-based approach
 * Simpler than DOMPurify but effective for basic XSS prevention
 * @param {string} svgString - Raw SVG content
 * @returns {string} Sanitized SVG content
 */
export function sanitizeSVG(svgString) {
  if (!svgString || typeof svgString !== 'string') {
    console.warn('[SVG-SANITIZE] Invalid input:', typeof svgString);
    return '';
  }

  let sanitized = svgString;

  try {
    // Remove script tags
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove dangerous tags
    const dangerousTags = ['script', 'foreignObject', 'iframe', 'object', 'embed', 'link'];
    dangerousTags.forEach(tag => {
      const regex = new RegExp(`<${tag}\\b[^>]*>.*?<\\/${tag}>`, 'gis');
      sanitized = sanitized.replace(regex, '');
      // Also remove self-closing versions
      const selfClosing = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi');
      sanitized = sanitized.replace(selfClosing, '');
    });

    // Remove event handlers
    const eventHandlers = [
      'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout',
      'onmouseenter', 'onmouseleave', 'onmousemove', 'onmousedown',
      'onmouseup', 'onfocus', 'onblur', 'onkeydown', 'onkeyup', 'onkeypress'
    ];
    eventHandlers.forEach(handler => {
      const regex = new RegExp(`\\s+${handler}\\s*=\\s*["'][^"']*["']`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });

    // Remove javascript: protocols
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove data:text/html
    sanitized = sanitized.replace(/data:text\/html/gi, '');

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
  if (!quickValidateSVG(svgString)) {
    return null;
  }

  const sanitized = sanitizeSVG(svgString);

  if (!sanitized) {
    return null;
  }

  return sanitized;
}
