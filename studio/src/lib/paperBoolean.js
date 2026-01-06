/**
 * Paper.js Boolean Operations Utility
 * Phase 2: True geometry editing (cut, merge, subtract)
 *
 * SCOPE RESTRICTION: Only apply to:
 * - Recraft motifs
 * - User-drawn blobs / pen paths
 * - Simple playground shapes
 *
 * DO NOT apply to: Courts, tracks, or regulation shapes
 */

import paper from 'paper';
import { analyzeSvg, shouldBlockBooleans, shouldWarnBooleans } from '../utils/svgDiagnostics.js';

// Complexity thresholds (from plan)
const THRESHOLDS = {
  WARN_SEGMENTS: 1500,    // Warn above this
  BLOCK_SEGMENTS: 10000,  // Block above this
};

// Simplify tolerance (conservative - preserves shape details)
const SIMPLIFY_TOLERANCE = 0.5;

// Minimum area for paths to keep after boolean (removes slivers)
const MIN_PATH_AREA = 10; // square units

// Initialize Paper.js in headless mode (no canvas needed for path operations)
let paperScope = null;

/**
 * Initialize Paper.js scope
 * Must be called before any boolean operations
 */
function initPaper() {
  if (!paperScope) {
    paperScope = new paper.PaperScope();
    // Setup without canvas for pure path operations
    paperScope.setup([1, 1]); // Minimal canvas size
    console.log('[PAPER] Initialized Paper.js scope');
  }
  return paperScope;
}

/**
 * Parse SVG path d attribute into Paper.js Path
 *
 * @param {string} pathData - SVG path d attribute
 * @param {Object} attributes - Optional fill, stroke, etc.
 * @returns {paper.Path} Paper.js Path object
 */
export function svgPathToPath(pathData, attributes = {}) {
  const scope = initPaper();

  const path = new scope.Path(pathData);

  // Apply attributes
  if (attributes.fill) {
    path.fillColor = attributes.fill;
  }
  if (attributes.stroke) {
    path.strokeColor = attributes.stroke;
  }
  if (attributes.strokeWidth) {
    path.strokeWidth = parseFloat(attributes.strokeWidth);
  }

  return path;
}

/**
 * Convert Paper.js Path back to SVG path data
 *
 * @param {paper.Path|paper.CompoundPath} path - Paper.js path
 * @returns {string} SVG path d attribute
 */
export function pathToSvgData(path) {
  if (!path) return '';

  // Export as SVG and extract path data
  const svgElement = path.exportSVG({ asString: false });

  if (svgElement.tagName === 'path') {
    return svgElement.getAttribute('d') || '';
  }

  // For compound paths, might get a <g> with multiple paths
  if (svgElement.tagName === 'g') {
    const paths = svgElement.querySelectorAll('path');
    const dValues = Array.from(paths).map(p => p.getAttribute('d')).filter(Boolean);
    return dValues.join(' ');
  }

  return '';
}

/**
 * Import SVG element into Paper.js
 *
 * @param {Element} svgElement - SVG DOM element
 * @returns {paper.Item} Paper.js item
 */
export function importSvgElement(svgElement) {
  const scope = initPaper();
  return scope.project.importSVG(svgElement, { insert: false });
}

/**
 * Count segments in a Paper.js path or compound path
 *
 * @param {paper.Path|paper.CompoundPath} path
 * @returns {number} Total segment count
 */
function countSegments(path) {
  if (!path) return 0;

  if (path.className === 'CompoundPath') {
    return path.children.reduce((sum, child) => sum + (child.segments?.length || 0), 0);
  }

  return path.segments?.length || 0;
}

/**
 * Calculate path area (absolute value for both CW and CCW paths)
 *
 * @param {paper.Path} path
 * @returns {number} Absolute area
 */
function getPathArea(path) {
  if (!path || !path.area) return 0;
  return Math.abs(path.area);
}

/**
 * Remove small paths from compound path (sliver cleanup)
 *
 * @param {paper.CompoundPath|paper.Path} item
 * @param {number} minArea
 * @returns {paper.CompoundPath|paper.Path} Cleaned item
 */
function removeSmallPaths(item, minArea = MIN_PATH_AREA) {
  if (!item) return item;

  if (item.className === 'CompoundPath') {
    const toRemove = [];

    item.children.forEach(child => {
      if (getPathArea(child) < minArea) {
        toRemove.push(child);
      }
    });

    toRemove.forEach(child => child.remove());

    // If only one child left, return it directly
    if (item.children.length === 1) {
      const single = item.children[0];
      single.remove();
      item.remove();
      return single;
    }

    // If no children left, return null
    if (item.children.length === 0) {
      item.remove();
      return null;
    }
  }

  return item;
}

/**
 * Normalize fill rule for consistent rendering
 *
 * @param {paper.Path|paper.CompoundPath} path
 */
function normalizeFillRule(path) {
  if (!path) return;

  // Paper.js uses 'nonzero' by default, which is usually correct
  // For compound paths with holes, 'evenodd' might be needed
  if (path.className === 'CompoundPath') {
    path.fillRule = 'evenodd';
  }
}

/**
 * Post-process boolean result
 * - Simplify paths
 * - Remove tiny slivers
 * - Normalize fill rules
 *
 * @param {paper.Path|paper.CompoundPath} result
 * @param {Object} options
 * @returns {paper.Path|paper.CompoundPath} Cleaned result
 */
function cleanupBooleanResult(result, options = {}) {
  if (!result) return result;

  const {
    simplifyTolerance = SIMPLIFY_TOLERANCE,
    minArea = MIN_PATH_AREA
  } = options;

  // Simplify to reduce node count
  if (result.simplify) {
    result.simplify(simplifyTolerance);
  }

  // Remove small paths
  result = removeSmallPaths(result, minArea);

  // Normalize fill rule
  if (result) {
    normalizeFillRule(result);
  }

  return result;
}

/**
 * Check complexity before boolean operation
 *
 * @param {Array<paper.Path>} paths - Paths involved in operation
 * @returns {Object} { canProceed: boolean, warning: string|null, error: string|null }
 */
function checkComplexity(paths) {
  const totalSegments = paths.reduce((sum, p) => sum + countSegments(p), 0);

  if (totalSegments > THRESHOLDS.BLOCK_SEGMENTS) {
    return {
      canProceed: false,
      warning: null,
      error: `Too complex for boolean operations (${totalSegments} segments). Use "Flatten Artwork" first.`
    };
  }

  if (totalSegments > THRESHOLDS.WARN_SEGMENTS) {
    return {
      canProceed: true,
      warning: `This operation may take a moment (${totalSegments} segments)`,
      error: null
    };
  }

  return { canProceed: true, warning: null, error: null };
}

/**
 * Perform boolean subtraction
 * Subtracts cutoutPath from targetPath
 *
 * @param {paper.Path} targetPath - Path to subtract from
 * @param {paper.Path} cutoutPath - Path to subtract
 * @param {Object} options - Processing options
 * @returns {paper.Path|paper.CompoundPath|null} Result path
 */
export function subtractPath(targetPath, cutoutPath, options = {}) {
  if (!targetPath || !cutoutPath) {
    console.warn('[PAPER] subtractPath: missing path(s)');
    return targetPath;
  }

  // Check complexity
  const complexity = checkComplexity([targetPath, cutoutPath]);
  if (!complexity.canProceed) {
    throw new Error(complexity.error);
  }
  if (complexity.warning) {
    console.warn('[PAPER]', complexity.warning);
  }

  console.log('[PAPER] Subtracting paths...');
  const startTime = Date.now();

  try {
    // Perform boolean subtraction
    const result = targetPath.subtract(cutoutPath);

    // Cleanup result
    const cleaned = cleanupBooleanResult(result, options);

    console.log(`[PAPER] Subtraction complete in ${Date.now() - startTime}ms`);
    console.log(`[PAPER] Segments: ${countSegments(targetPath)} - ${countSegments(cutoutPath)} = ${countSegments(cleaned)}`);

    return cleaned;
  } catch (error) {
    console.error('[PAPER] Subtraction failed:', error);
    throw error;
  }
}

/**
 * Perform boolean union
 * Combines multiple paths into one
 *
 * @param {Array<paper.Path>} paths - Paths to unite
 * @param {Object} options - Processing options
 * @returns {paper.Path|paper.CompoundPath|null} Result path
 */
export function unitePaths(paths, options = {}) {
  if (!paths || paths.length === 0) {
    return null;
  }

  if (paths.length === 1) {
    return paths[0];
  }

  // Check complexity
  const complexity = checkComplexity(paths);
  if (!complexity.canProceed) {
    throw new Error(complexity.error);
  }
  if (complexity.warning) {
    console.warn('[PAPER]', complexity.warning);
  }

  console.log('[PAPER] Uniting paths...');
  const startTime = Date.now();

  try {
    // Start with first path and unite with rest
    let result = paths[0].clone();

    for (let i = 1; i < paths.length; i++) {
      const newResult = result.unite(paths[i]);
      result.remove();
      result = newResult;
    }

    // Cleanup result
    const cleaned = cleanupBooleanResult(result, options);

    console.log(`[PAPER] Union complete in ${Date.now() - startTime}ms`);

    return cleaned;
  } catch (error) {
    console.error('[PAPER] Union failed:', error);
    throw error;
  }
}

/**
 * Perform boolean intersection
 * Returns only the overlapping area
 *
 * @param {paper.Path} path1
 * @param {paper.Path} path2
 * @param {Object} options
 * @returns {paper.Path|paper.CompoundPath|null} Result path
 */
export function intersectPaths(path1, path2, options = {}) {
  if (!path1 || !path2) {
    return null;
  }

  // Check complexity
  const complexity = checkComplexity([path1, path2]);
  if (!complexity.canProceed) {
    throw new Error(complexity.error);
  }

  console.log('[PAPER] Intersecting paths...');
  const startTime = Date.now();

  try {
    const result = path1.intersect(path2);
    const cleaned = cleanupBooleanResult(result, options);

    console.log(`[PAPER] Intersection complete in ${Date.now() - startTime}ms`);

    return cleaned;
  } catch (error) {
    console.error('[PAPER] Intersection failed:', error);
    throw error;
  }
}

/**
 * Perform true cut-out operation on SVG
 * Subtracts a region from all shapes beneath it
 *
 * @param {string} svgString - Full SVG content
 * @param {string} cutoutRegionId - data-region-id of the shape to cut out
 * @returns {Promise<{svg: string, stats: Object}>}
 */
export async function performTrueCutout(svgString, cutoutRegionId) {
  console.log(`[PAPER] Performing true cut-out for region: ${cutoutRegionId}`);
  const startTime = Date.now();

  // Check overall SVG complexity
  const analysis = analyzeSvg(svgString);
  const blockCheck = shouldBlockBooleans(analysis);

  if (blockCheck.blocked) {
    throw new Error(blockCheck.reason);
  }

  const warnCheck = shouldWarnBooleans(analysis);
  if (warnCheck.warn) {
    console.warn('[PAPER]', warnCheck.message);
  }

  const scope = initPaper();

  // Parse SVG
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = doc.documentElement;

  // Find the cutout region
  const cutoutElement = svgElement.querySelector(`[data-region-id="${cutoutRegionId}"]`);
  if (!cutoutElement) {
    throw new Error(`Region ${cutoutRegionId} not found`);
  }

  // Import cutout shape
  const cutoutItem = importSvgElement(cutoutElement);
  if (!cutoutItem || cutoutItem.className === 'Group') {
    console.warn('[PAPER] Could not convert cutout region to path');
    throw new Error('Cutout region could not be converted to a path');
  }

  // Get cutout bounds for finding overlapping shapes
  const cutoutBounds = cutoutItem.bounds;

  // Find all path/shape elements that might overlap
  const allShapes = svgElement.querySelectorAll('path, rect, circle, ellipse, polygon');
  const shapesBelow = [];

  // Collect shapes that are BEFORE the cutout in DOM order (below in z-order)
  let foundCutout = false;
  allShapes.forEach(el => {
    if (el === cutoutElement) {
      foundCutout = true;
      return;
    }
    if (!foundCutout && el.hasAttribute('data-region-id')) {
      shapesBelow.push(el);
    }
  });

  console.log(`[PAPER] Found ${shapesBelow.length} shapes below cutout region`);

  let modifiedCount = 0;

  // Process each shape below the cutout
  for (const shapeEl of shapesBelow) {
    try {
      // Import shape
      const shapeItem = importSvgElement(shapeEl);
      if (!shapeItem) continue;

      // Check if bounds overlap (quick rejection)
      if (!shapeItem.bounds.intersects(cutoutBounds)) {
        shapeItem.remove();
        continue;
      }

      // Perform subtraction
      const result = subtractPath(shapeItem, cutoutItem.clone(), {
        simplifyTolerance: SIMPLIFY_TOLERANCE,
        minArea: MIN_PATH_AREA
      });

      if (result) {
        // Export back to SVG
        const newSvgElement = result.exportSVG({ asString: false });

        // Preserve attributes
        const regionId = shapeEl.getAttribute('data-region-id');
        const fill = shapeEl.getAttribute('fill');
        const fillOpacity = shapeEl.getAttribute('fill-opacity');
        const stroke = shapeEl.getAttribute('stroke');

        if (regionId) newSvgElement.setAttribute('data-region-id', regionId);
        if (fill) newSvgElement.setAttribute('fill', fill);
        if (fillOpacity) newSvgElement.setAttribute('fill-opacity', fillOpacity);
        if (stroke) newSvgElement.setAttribute('stroke', stroke);

        // Replace original element
        shapeEl.parentNode.replaceChild(newSvgElement, shapeEl);
        modifiedCount++;
      }

      shapeItem.remove();
    } catch (e) {
      console.warn(`[PAPER] Failed to process shape:`, e.message);
      // Continue with other shapes
    }
  }

  // Remove the cutout region entirely
  cutoutElement.remove();
  cutoutItem.remove();

  // Serialize result
  const resultSvg = new XMLSerializer().serializeToString(doc);

  const stats = {
    processingTime: Date.now() - startTime,
    shapesProcessed: shapesBelow.length,
    shapesModified: modifiedCount,
    cutoutRegionId
  };

  console.log(`[PAPER] True cut-out complete in ${stats.processingTime}ms`);
  console.log(`[PAPER] Modified ${modifiedCount} of ${shapesBelow.length} shapes`);

  return { svg: resultSvg, stats };
}

/**
 * Check if true cut-out should be offered for a region
 * Returns { allowed: false, reason: string } for courts, tracks, and other regulation shapes
 *
 * @param {Element} element - DOM element to check
 * @returns {{ allowed: boolean, reason: string|null }} Result object
 */
export function canPerformCutout(element) {
  if (!element) {
    return { allowed: false, reason: 'No element selected' };
  }

  // Check for regulation shape indicators
  const className = element.getAttribute('class') || '';

  // Block list - don't allow cut-out on these
  const blockedPatterns = [
    { pattern: 'court', label: 'court' },
    { pattern: 'track', label: 'track' },
    { pattern: 'lane', label: 'lane' },
    { pattern: 'line', label: 'line marking' },
    { pattern: 'marking', label: 'marking' },
    { pattern: 'boundary', label: 'boundary' },
    { pattern: 'regulation', label: 'regulation shape' }
  ];

  for (const { pattern, label } of blockedPatterns) {
    if (className.toLowerCase().includes(pattern)) {
      return { allowed: false, reason: `Cannot cut out ${label} elements` };
    }
  }

  // Check parent elements too
  let parent = element.parentElement;
  while (parent && parent.tagName !== 'svg') {
    const parentClass = parent.getAttribute('class') || '';
    for (const { pattern, label } of blockedPatterns) {
      if (parentClass.toLowerCase().includes(pattern)) {
        return { allowed: false, reason: `Cannot cut out elements inside ${label}` };
      }
    }
    parent = parent.parentElement;
  }

  return { allowed: true, reason: null };
}

/**
 * Estimate boolean operation cost
 *
 * @param {string} svgString - SVG content
 * @param {string} regionId - Region to analyze
 * @returns {Object} { segments: number, canProceed: boolean, warning: string|null }
 */
export function estimateBooleanCost(svgString, regionId) {
  const analysis = analyzeSvg(svgString);

  if (!analysis.valid) {
    return { segments: 0, canProceed: false, warning: 'Invalid SVG' };
  }

  const blockCheck = shouldBlockBooleans(analysis);
  if (blockCheck.blocked) {
    return {
      segments: analysis.totalSegments,
      canProceed: false,
      warning: blockCheck.reason
    };
  }

  const warnCheck = shouldWarnBooleans(analysis);
  return {
    segments: analysis.totalSegments,
    canProceed: true,
    warning: warnCheck.warn ? warnCheck.message : null
  };
}

export default {
  svgPathToPath,
  pathToSvgData,
  subtractPath,
  unitePaths,
  intersectPaths,
  performTrueCutout,
  canPerformCutout,
  estimateBooleanCost
};
