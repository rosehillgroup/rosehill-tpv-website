/**
 * SVG Normalization Utility
 * Uses SVGO for conservative cleanup of AI-generated SVGs
 *
 * IMPORTANT: Run BEFORE region tagging (tagSvgRegions)
 * Flow: sanitizeSVG() → normalizeSVG() → tagSvgRegions() → recolor()
 *
 * Conservative mode preserves:
 * - All IDs (needed for hit testing and selection)
 * - Group structure (needed for stacking semantics)
 * - Fills, strokes, and visual attributes
 */

import { optimize } from 'svgo';

/**
 * Conservative SVGO configuration
 *
 * SAFE plugins (enabled):
 * - cleanupAttrs: normalize whitespace in attributes
 * - removeDoctype: remove DOCTYPE declaration
 * - removeComments: remove XML comments
 * - removeMetadata: remove <metadata> elements
 * - removeEditorsNSData: remove editor namespace data (Illustrator, Inkscape cruft)
 * - convertTransform: optimize/bake transform matrices
 * - cleanupNumericValues: round numbers to reasonable precision
 * - convertShapeToPath: normalize shapes to paths for consistency
 *
 * DISABLED (would break region tagging/selection):
 * - cleanupIds: breaks hit testing and selection
 * - collapseGroups: breaks stacking semantics
 * - mergePaths: breaks individual region selection
 * - removeHiddenElems: might remove intentionally hidden elements
 */
const CONSERVATIVE_CONFIG = {
  plugins: [
    // === SAFE: Cleanup cruft ===
    'cleanupAttrs',           // Normalize whitespace in attributes
    'removeDoctype',          // Remove DOCTYPE declaration
    'removeXMLProcInst',      // Remove <?xml ...?> processing instructions
    'removeComments',         // Remove XML comments
    'removeMetadata',         // Remove <metadata> elements
    'removeEditorsNSData',    // Remove editor cruft (Illustrator, Inkscape, etc.)
    'removeEmptyAttrs',       // Remove empty attributes
    'removeEmptyContainers',  // Remove empty <g>, <defs>, etc.
    'removeUnusedNS',         // Remove unused namespace declarations

    // === SAFE: Numeric optimization ===
    {
      name: 'cleanupNumericValues',
      params: {
        floatPrecision: 3,      // Round to 3 decimal places (sufficient for TPV)
        leadingZero: true,      // Remove leading zeros (0.5 → .5)
        defaultPx: true,        // Remove 'px' units where redundant
        convertToPx: false      // Don't convert other units
      }
    },

    // === SAFE: Transform baking (converts nested transforms to coordinates) ===
    {
      name: 'convertTransform',
      params: {
        convertToShorts: true,
        floatPrecision: 3,
        transformPrecision: 5,
        matrixToTransform: true,
        shortTranslate: true,
        shortScale: true,
        shortRotate: true,
        removeUseless: true,
        collapseIntoOne: false,  // Keep transforms separate for debugging
        leadingZero: true,
        negativeExtraSpace: false
      }
    },

    // === SAFE: Shape normalization ===
    {
      name: 'convertShapeToPath',
      params: {
        convertArcs: false      // Keep arcs as arcs (more accurate)
      }
    },

    // === SAFE: Path optimization (doesn't change shape) ===
    {
      name: 'convertPathData',
      params: {
        applyTransforms: true,  // Bake transforms into path coordinates
        applyTransformsStroked: true,
        makeArcs: false,        // Don't convert to arcs (can be lossy)
        straightCurves: true,   // Simplify curves that are straight lines
        lineShorthands: true,   // Use H/V for horizontal/vertical lines
        curveSmoothShorthands: true,
        floatPrecision: 3,
        transformPrecision: 5,
        removeUseless: true,
        collapseRepeated: true,
        utilizeAbsolute: true,
        leadingZero: true,
        negativeExtraSpace: true,
        noSpaceAfterFlags: false,
        forceAbsolutePath: false
      }
    }

    // === EXPLICITLY DISABLED (would break region system) ===
    // 'cleanupIds'      - Need IDs for hit testing
    // 'collapseGroups'  - Need groups for stacking semantics
    // 'mergePaths'      - Need separate paths for region selection
    // 'removeHiddenElems' - Might remove intentionally hidden shapes
    // 'minifyStyles'    - Keep styles readable for debugging
    // 'inlineStyles'    - Keep style structure
  ],

  // Don't use multipass - single pass is sufficient for our conservative config
  multipass: false,

  // Float precision for output
  floatPrecision: 3,

  // Preserve comments for debugging (optional, remove in production)
  // js2svg: { pretty: true, indent: 2 }  // Enable for debugging
};

/**
 * Normalize SVG using conservative SVGO configuration
 *
 * @param {string} svgString - Raw SVG content
 * @param {Object} options - Optional configuration overrides
 * @returns {string} Normalized SVG content
 */
export function normalizeSVG(svgString, options = {}) {
  if (!svgString || typeof svgString !== 'string') {
    console.warn('[SVG-NORMALIZE] Invalid input:', typeof svgString);
    return svgString || '';
  }

  // Verify it looks like SVG
  if (!svgString.includes('<svg')) {
    console.warn('[SVG-NORMALIZE] Input does not appear to be SVG');
    return svgString;
  }

  try {
    const inputLength = svgString.length;

    // Merge user options with conservative defaults
    const config = {
      ...CONSERVATIVE_CONFIG,
      ...options
    };

    const result = optimize(svgString, config);

    if (!result || !result.data) {
      console.error('[SVG-NORMALIZE] SVGO returned no output');
      return svgString; // Return original on failure
    }

    const outputLength = result.data.length;
    const savings = inputLength - outputLength;
    const savingsPercent = ((savings / inputLength) * 100).toFixed(1);

    console.log(
      `[SVG-NORMALIZE] Optimized: ${inputLength} → ${outputLength} bytes ` +
      `(saved ${savings} bytes, ${savingsPercent}%)`
    );

    // Verify output is still valid SVG
    if (!result.data.includes('<svg')) {
      console.error('[SVG-NORMALIZE] Output is not valid SVG, returning original');
      return svgString;
    }

    return result.data;
  } catch (error) {
    console.error('[SVG-NORMALIZE] Optimization failed:', error.message);
    // Return original on error - fail gracefully
    return svgString;
  }
}

/**
 * Check if SVG would benefit from normalization
 * Quick heuristic check without full optimization
 *
 * @param {string} svgString - SVG content to check
 * @returns {boolean} True if normalization is recommended
 */
export function shouldNormalize(svgString) {
  if (!svgString) return false;

  // Check for indicators of messy SVG
  const indicators = [
    /<!--[\s\S]*?-->/,           // XML comments
    /<metadata[\s\S]*?<\/metadata>/i,  // Metadata blocks
    /xmlns:(?:inkscape|sodipodi|adobe|sketch)/i,  // Editor namespaces
    /transform="[^"]+"/g,       // Transforms that could be baked
    /matrix\(/i,                // Matrix transforms (can be simplified)
    /<!--/,                     // Any comment
    /data-name="/               // Illustrator layer names
  ];

  for (const pattern of indicators) {
    if (pattern.test(svgString)) {
      return true;
    }
  }

  // Also check if file is unusually large (> 50KB typically means bloat)
  if (svgString.length > 50000) {
    return true;
  }

  return false;
}

/**
 * Get SVG statistics for diagnostics
 *
 * @param {string} svgString - SVG content
 * @returns {Object} Statistics about the SVG
 */
export function getSvgStats(svgString) {
  if (!svgString) return null;

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    return { error: 'Parse error', valid: false };
  }

  const paths = doc.querySelectorAll('path');
  const groups = doc.querySelectorAll('g');
  const shapes = doc.querySelectorAll('rect, circle, ellipse, polygon, polyline, line');
  const transforms = doc.querySelectorAll('[transform]');
  const defs = doc.querySelectorAll('defs *');

  return {
    valid: true,
    bytes: svgString.length,
    pathCount: paths.length,
    groupCount: groups.length,
    shapeCount: shapes.length,
    transformCount: transforms.length,
    defsCount: defs.length,
    totalElements: paths.length + shapes.length
  };
}

export default normalizeSVG;
