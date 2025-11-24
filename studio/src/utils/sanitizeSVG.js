/**
 * SVG Sanitization Utility
 * Removes XSS vectors from SVG content while preserving visual elements
 * Works in both browser and Node.js environments
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize SVG content to remove XSS vectors
 * @param {string} svgString - Raw SVG content
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized SVG content
 */
export function sanitizeSVG(svgString, options = {}) {
  if (!svgString || typeof svgString !== 'string') {
    console.warn('[SVG-SANITIZE] Invalid input:', typeof svgString);
    return '';
  }

  const config = {
    // Use SVG profile - allows SVG tags and attributes
    USE_PROFILES: { svg: true, svgFilters: true },

    // Explicitly forbid dangerous tags
    FORBID_TAGS: [
      'script',        // JavaScript execution
      'foreignObject', // Can contain HTML/scripts
      'iframe',        // Can load external content
      'object',        // Can load external content
      'embed',         // Can load external content
      'link',          // Can load external stylesheets
      'style',         // Can contain CSS injection
      'animation',     // SVG animations that could be abused
      'set',           // SVG set animations
      'animateMotion', // SVG motion animations
      'animateColor',  // SVG color animations
      'animateTransform' // SVG transform animations
    ],

    // Explicitly forbid dangerous attributes
    FORBID_ATTR: [
      'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout',
      'onmouseenter', 'onmouseleave', 'onmousemove', 'onmousedown',
      'onmouseup', 'onfocus', 'onblur', 'onkeydown', 'onkeyup',
      'onkeypress', 'onsubmit', 'onreset', 'onselect', 'onchange',
      'oninput', 'onanimationstart', 'onanimationend', 'onanimationiteration',
      'ontransitionend', 'ontransitionrun', 'ontransitionstart', 'ontransitioncancel',
      // Dangerous HREF attributes
      'xlink:href', // Can point to javascript: URLs
      ...options.additionalForbiddenAttrs || []
    ],

    // Allow data attributes (safe, used for region IDs)
    ALLOW_DATA_ATTR: true,

    // Keep comments for debugging if needed
    ALLOW_COMMENTS: false,

    // Return DOM instead of string for further processing
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,

    // Sanitize URLs in attributes
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,

    // Custom hook to validate href attributes
    HOOKS: {
      afterSanitizeAttributes: (node) => {
        // Remove any href that starts with javascript:
        if (node.hasAttribute('href')) {
          const href = node.getAttribute('href');
          if (href && href.toLowerCase().trim().startsWith('javascript:')) {
            node.removeAttribute('href');
            console.warn('[SVG-SANITIZE] Removed javascript: href');
          }
        }

        // Remove any xlink:href that could be dangerous
        if (node.hasAttribute('xlink:href')) {
          const xlinkHref = node.getAttribute('xlink:href');
          if (xlinkHref && (
            xlinkHref.toLowerCase().trim().startsWith('javascript:') ||
            xlinkHref.toLowerCase().trim().startsWith('data:text/html')
          )) {
            node.removeAttribute('xlink:href');
            console.warn('[SVG-SANITIZE] Removed dangerous xlink:href');
          }
        }
      }
    },

    // Override defaults with user options
    ...options
  };

  try {
    const sanitized = DOMPurify.sanitize(svgString, config);

    // Verify output is still valid SVG
    if (!sanitized || !sanitized.includes('<svg')) {
      console.error('[SVG-SANITIZE] Sanitization removed SVG content - input may be malicious');
      return '';
    }

    // Log if significant content was removed (possible attack)
    const inputLength = svgString.length;
    const outputLength = sanitized.length;
    const reductionPercent = ((inputLength - outputLength) / inputLength) * 100;

    if (reductionPercent > 10) {
      console.warn(
        `[SVG-SANITIZE] Removed ${reductionPercent.toFixed(1)}% of content ` +
        `(${inputLength - outputLength} chars) - possible malicious SVG detected`
      );
    }

    return sanitized;
  } catch (error) {
    console.error('[SVG-SANITIZE] Sanitization failed:', error);
    return '';
  }
}

/**
 * Quick check if SVG contains potentially dangerous elements
 * Use this for fast validation before more expensive sanitization
 * @param {string} svgString - SVG content to check
 * @returns {boolean} True if SVG appears safe
 */
export function quickValidateSVG(svgString) {
  if (!svgString || typeof svgString !== 'string') {
    return false;
  }

  const lowerContent = svgString.toLowerCase();

  // Check for obvious XSS patterns
  const dangerousPatterns = [
    '<script',
    'javascript:',
    'onload=',
    'onerror=',
    'onclick=',
    'onmouseover=',
    '<foreignobject',
    '<iframe',
    '<object',
    '<embed',
    'data:text/html',
    '<link',
    '<style',
    '<set ',
    '<animate'
  ];

  for (const pattern of dangerousPatterns) {
    if (lowerContent.includes(pattern)) {
      console.warn(`[SVG-VALIDATE] Dangerous pattern detected: ${pattern}`);
      return false;
    }
  }

  // Verify it starts with SVG tag
  if (!lowerContent.trim().startsWith('<svg') && !lowerContent.includes('<svg')) {
    console.warn('[SVG-VALIDATE] Content does not appear to be valid SVG');
    return false;
  }

  return true;
}

/**
 * Sanitize and validate SVG in one step
 * Returns null if SVG fails validation
 * @param {string} svgString - Raw SVG content
 * @returns {string|null} Sanitized SVG or null if invalid
 */
export function sanitizeAndValidateSVG(svgString) {
  // Quick pre-check
  if (!quickValidateSVG(svgString)) {
    return null;
  }

  // Full sanitization
  const sanitized = sanitizeSVG(svgString);

  if (!sanitized) {
    return null;
  }

  return sanitized;
}

export default sanitizeSVG;
