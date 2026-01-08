/**
 * SVG Sanitization Utility for Server-Side (API endpoints)
 * Uses regex-based approach for XSS prevention (DOMPurify fails in Vercel serverless)
 *
 * NOTE: isomorphic-dompurify doesn't work in Vercel serverless due to jsdom/parse5 ESM issues
 * Error: "require() of ES Module not supported"
 */

/**
 * Sanitize SVG content using regex-based approach
 * Effective XSS prevention without external dependencies
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
    // Remove script tags (including content)
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove dangerous tags
    const dangerousTags = ['script', 'foreignObject', 'iframe', 'object', 'embed', 'link'];
    dangerousTags.forEach(tag => {
      // Remove opening and closing tags with content
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
      'onmouseup', 'onfocus', 'onblur', 'onkeydown', 'onkeyup', 'onkeypress',
      'onchange', 'oninput', 'onsubmit', 'onreset', 'onscroll', 'onwheel',
      'ondrag', 'ondrop', 'onanimationstart', 'onanimationend'
    ];
    eventHandlers.forEach(handler => {
      const regex = new RegExp(`\\s+${handler}\\s*=\\s*["'][^"']*["']`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });

    // Remove javascript: protocols
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove data:text/html (but allow data:image for embedded images)
    sanitized = sanitized.replace(/data:text\/html/gi, '');

    // Remove vbscript: protocols
    sanitized = sanitized.replace(/vbscript:/gi, '');

    // Remove expression() in style (IE-specific XSS)
    sanitized = sanitized.replace(/expression\s*\(/gi, '');

    // Remove url() with javascript in style
    sanitized = sanitized.replace(/url\s*\(\s*["']?\s*javascript:/gi, 'url(');

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
