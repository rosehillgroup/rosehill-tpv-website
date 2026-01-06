/**
 * SVG Diagnostics Utility
 * Analyzes SVG complexity for boolean operation planning
 *
 * Used to:
 * - Display complexity badges on motifs
 * - Warn before expensive boolean operations
 * - Suggest flatten for overly complex SVGs
 */

/**
 * Complexity thresholds (from plan)
 * - Warn at 1,500-2,000 segments
 * - Hard block at 10,000 segments
 */
const THRESHOLDS = {
  SIMPLE_MAX: 500,        // Up to 500 segments = simple
  MODERATE_MAX: 1500,     // 500-1500 segments = moderate
  COMPLEX_MAX: 10000,     // 1500-10000 segments = complex (warn)
  // Above 10000 = very complex (block booleans, suggest flatten)
};

/**
 * Count path segments from a path's d attribute
 * Each command (M, L, C, Q, A, Z, etc.) counts as one segment
 *
 * @param {string} d - Path d attribute value
 * @returns {number} Segment count
 */
function countPathSegments(d) {
  if (!d) return 0;

  // Count path commands (letters in the d attribute)
  // Commands: M, m, L, l, H, h, V, v, C, c, S, s, Q, q, T, t, A, a, Z, z
  const commands = d.match(/[MmLlHhVvCcSsQqTtAaZz]/g);
  return commands ? commands.length : 0;
}

/**
 * Parse path d attribute into segments for analysis
 *
 * @param {string} d - Path d attribute value
 * @returns {Array} Array of segment objects
 */
function parsePathSegments(d) {
  if (!d) return [];

  const segments = [];
  // Split by commands while keeping the command letter
  const parts = d.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || [];

  for (const part of parts) {
    const command = part[0];
    const args = part.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number);

    segments.push({ command, args, raw: part });
  }

  return segments;
}

/**
 * Estimate bounding box from path data (rough calculation)
 *
 * @param {string} d - Path d attribute
 * @returns {Object|null} Rough bounding box { minX, minY, maxX, maxY, width, height }
 */
function estimatePathBounds(d) {
  if (!d) return null;

  const segments = parsePathSegments(d);
  if (segments.length === 0) return null;

  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  let currentX = 0, currentY = 0;

  for (const seg of segments) {
    const { command, args } = seg;
    const isRelative = command === command.toLowerCase();
    const cmd = command.toUpperCase();

    switch (cmd) {
      case 'M':
      case 'L':
      case 'T':
        if (args.length >= 2) {
          currentX = isRelative ? currentX + args[0] : args[0];
          currentY = isRelative ? currentY + args[1] : args[1];
        }
        break;
      case 'H':
        if (args.length >= 1) {
          currentX = isRelative ? currentX + args[0] : args[0];
        }
        break;
      case 'V':
        if (args.length >= 1) {
          currentY = isRelative ? currentY + args[0] : args[0];
        }
        break;
      case 'C':
        // Cubic bezier: x1 y1 x2 y2 x y
        if (args.length >= 6) {
          // Include control points in bounds estimation
          for (let i = 0; i < args.length; i += 2) {
            const x = isRelative ? currentX + args[i] : args[i];
            const y = isRelative ? currentY + args[i + 1] : args[i + 1];
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
          currentX = isRelative ? currentX + args[args.length - 2] : args[args.length - 2];
          currentY = isRelative ? currentY + args[args.length - 1] : args[args.length - 1];
        }
        break;
      case 'S':
      case 'Q':
        if (args.length >= 4) {
          currentX = isRelative ? currentX + args[args.length - 2] : args[args.length - 2];
          currentY = isRelative ? currentY + args[args.length - 1] : args[args.length - 1];
        }
        break;
      case 'A':
        // Arc: rx ry x-rotation large-arc sweep x y
        if (args.length >= 7) {
          currentX = isRelative ? currentX + args[5] : args[5];
          currentY = isRelative ? currentY + args[6] : args[6];
        }
        break;
      case 'Z':
        // Close path - no coordinate change for bounds
        break;
    }

    minX = Math.min(minX, currentX);
    minY = Math.min(minY, currentY);
    maxX = Math.max(maxX, currentX);
    maxY = Math.max(maxY, currentY);
  }

  if (!isFinite(minX) || !isFinite(minY)) return null;

  return {
    minX, minY, maxX, maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Check if two bounding boxes overlap
 *
 * @param {Object} a - First bounding box
 * @param {Object} b - Second bounding box
 * @returns {boolean} True if boxes overlap
 */
function boxesOverlap(a, b) {
  if (!a || !b) return false;

  return !(
    a.maxX < b.minX ||
    a.minX > b.maxX ||
    a.maxY < b.minY ||
    a.minY > b.maxY
  );
}

/**
 * Detect potentially hidden shapes (shapes fully covered by later shapes)
 *
 * @param {Element} svgElement - SVG DOM element
 * @returns {Object} Hidden shape analysis
 */
function detectHiddenShapes(svgElement) {
  const paths = Array.from(svgElement.querySelectorAll('path, rect, circle, ellipse, polygon'));

  if (paths.length < 2) {
    return { hasHiddenShapes: false, hiddenCount: 0, details: [] };
  }

  const shapesWithBounds = paths.map((el, index) => {
    const d = el.getAttribute('d');
    const bounds = d ? estimatePathBounds(d) : null;

    // For non-path elements, try to get bounds from attributes
    let elementBounds = bounds;
    if (!elementBounds) {
      const tagName = el.tagName.toLowerCase();
      if (tagName === 'rect') {
        const x = parseFloat(el.getAttribute('x')) || 0;
        const y = parseFloat(el.getAttribute('y')) || 0;
        const width = parseFloat(el.getAttribute('width')) || 0;
        const height = parseFloat(el.getAttribute('height')) || 0;
        elementBounds = { minX: x, minY: y, maxX: x + width, maxY: y + height, width, height };
      } else if (tagName === 'circle') {
        const cx = parseFloat(el.getAttribute('cx')) || 0;
        const cy = parseFloat(el.getAttribute('cy')) || 0;
        const r = parseFloat(el.getAttribute('r')) || 0;
        elementBounds = { minX: cx - r, minY: cy - r, maxX: cx + r, maxY: cy + r, width: r * 2, height: r * 2 };
      } else if (tagName === 'ellipse') {
        const cx = parseFloat(el.getAttribute('cx')) || 0;
        const cy = parseFloat(el.getAttribute('cy')) || 0;
        const rx = parseFloat(el.getAttribute('rx')) || 0;
        const ry = parseFloat(el.getAttribute('ry')) || 0;
        elementBounds = { minX: cx - rx, minY: cy - ry, maxX: cx + rx, maxY: cy + ry, width: rx * 2, height: ry * 2 };
      }
    }

    return {
      element: el,
      index,
      bounds: elementBounds,
      regionId: el.getAttribute('data-region-id'),
      fill: el.getAttribute('fill') || 'none',
      fillOpacity: parseFloat(el.getAttribute('fill-opacity')) || 1
    };
  }).filter(s => s.bounds);

  // Check for shapes that might be hidden
  const potentiallyHidden = [];

  for (let i = 0; i < shapesWithBounds.length; i++) {
    const lower = shapesWithBounds[i];

    // Skip if shape is transparent
    if (lower.fill === 'none' || lower.fillOpacity === 0) continue;

    // Check if any later shape fully covers this one
    for (let j = i + 1; j < shapesWithBounds.length; j++) {
      const upper = shapesWithBounds[j];

      // Skip transparent shapes
      if (upper.fill === 'none' || upper.fillOpacity === 0) continue;

      // Check if upper shape's bounds fully contain lower shape's bounds
      if (
        upper.bounds.minX <= lower.bounds.minX &&
        upper.bounds.minY <= lower.bounds.minY &&
        upper.bounds.maxX >= lower.bounds.maxX &&
        upper.bounds.maxY >= lower.bounds.maxY
      ) {
        potentiallyHidden.push({
          hiddenIndex: i,
          hiddenRegion: lower.regionId,
          coveringIndex: j,
          coveringRegion: upper.regionId
        });
        break; // Only report first covering shape
      }
    }
  }

  return {
    hasHiddenShapes: potentiallyHidden.length > 0,
    hiddenCount: potentiallyHidden.length,
    details: potentiallyHidden
  };
}

/**
 * Analyze SVG complexity
 *
 * @param {string|Element} svg - SVG string or DOM element
 * @returns {Object} Complexity analysis
 */
export function analyzeSvg(svg) {
  let svgElement;

  if (typeof svg === 'string') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      return {
        valid: false,
        error: 'SVG parse error',
        pathCount: 0,
        totalSegments: 0,
        estimatedComplexity: 'unknown',
        warnings: ['Failed to parse SVG']
      };
    }

    svgElement = doc.documentElement;
  } else if (svg instanceof Element) {
    svgElement = svg;
  } else {
    return {
      valid: false,
      error: 'Invalid input',
      pathCount: 0,
      totalSegments: 0,
      estimatedComplexity: 'unknown',
      warnings: ['Input must be SVG string or Element']
    };
  }

  // Count paths and segments
  const paths = svgElement.querySelectorAll('path');
  const shapes = svgElement.querySelectorAll('rect, circle, ellipse, polygon, polyline, line');
  const groups = svgElement.querySelectorAll('g');

  let totalSegments = 0;
  let maxSegmentsInPath = 0;
  const pathDetails = [];

  paths.forEach((path, index) => {
    const d = path.getAttribute('d');
    const segments = countPathSegments(d);
    totalSegments += segments;
    maxSegmentsInPath = Math.max(maxSegmentsInPath, segments);

    pathDetails.push({
      index,
      segments,
      regionId: path.getAttribute('data-region-id')
    });
  });

  // Each basic shape counts as ~4 segments equivalent
  const shapeSegments = shapes.length * 4;
  totalSegments += shapeSegments;

  // Determine complexity level
  let estimatedComplexity;
  if (totalSegments <= THRESHOLDS.SIMPLE_MAX) {
    estimatedComplexity = 'simple';
  } else if (totalSegments <= THRESHOLDS.MODERATE_MAX) {
    estimatedComplexity = 'moderate';
  } else if (totalSegments <= THRESHOLDS.COMPLEX_MAX) {
    estimatedComplexity = 'complex';
  } else {
    estimatedComplexity = 'very_complex';
  }

  // Detect hidden shapes
  const hiddenAnalysis = detectHiddenShapes(svgElement);

  // Generate warnings
  const warnings = [];

  if (totalSegments > THRESHOLDS.MODERATE_MAX) {
    warnings.push(`High segment count (${totalSegments}) may slow boolean operations`);
  }

  if (totalSegments > THRESHOLDS.COMPLEX_MAX) {
    warnings.push('Consider using "Flatten Artwork" before boolean operations');
  }

  if (maxSegmentsInPath > 500) {
    warnings.push(`Complex path detected (${maxSegmentsInPath} segments in single path)`);
  }

  if (hiddenAnalysis.hasHiddenShapes) {
    warnings.push(`${hiddenAnalysis.hiddenCount} potentially hidden shape(s) detected`);
  }

  if (groups.length > 20) {
    warnings.push(`Deep nesting detected (${groups.length} groups)`);
  }

  return {
    valid: true,
    pathCount: paths.length,
    shapeCount: shapes.length,
    groupCount: groups.length,
    totalSegments,
    maxSegmentsInPath,
    estimatedComplexity,
    hasHiddenShapes: hiddenAnalysis.hasHiddenShapes,
    hiddenShapeCount: hiddenAnalysis.hiddenCount,
    hiddenShapeDetails: hiddenAnalysis.details,
    warnings,
    thresholds: THRESHOLDS,
    // For UI display
    complexityColor: getComplexityColor(estimatedComplexity),
    complexityLabel: getComplexityLabel(estimatedComplexity)
  };
}

/**
 * Get color for complexity badge
 *
 * @param {string} complexity - Complexity level
 * @returns {string} CSS color
 */
function getComplexityColor(complexity) {
  switch (complexity) {
    case 'simple': return '#22c55e';      // Green
    case 'moderate': return '#eab308';    // Yellow
    case 'complex': return '#f97316';     // Orange
    case 'very_complex': return '#ef4444'; // Red
    default: return '#6b7280';            // Gray
  }
}

/**
 * Get label for complexity badge
 *
 * @param {string} complexity - Complexity level
 * @returns {string} Human-readable label
 */
function getComplexityLabel(complexity) {
  switch (complexity) {
    case 'simple': return 'Simple';
    case 'moderate': return 'Moderate';
    case 'complex': return 'Complex';
    case 'very_complex': return 'Very Complex';
    default: return 'Unknown';
  }
}

/**
 * Quick complexity check (faster than full analysis)
 *
 * @param {string} svgString - SVG content
 * @returns {string} Complexity level: 'simple' | 'moderate' | 'complex' | 'very_complex'
 */
export function quickComplexityCheck(svgString) {
  if (!svgString) return 'unknown';

  // Quick estimate based on string patterns
  const pathMatches = svgString.match(/<path/gi);
  const pathCount = pathMatches ? pathMatches.length : 0;

  // Estimate segments from d attribute content length
  const dMatches = svgString.match(/\sd="([^"]+)"/g);
  let estimatedSegments = 0;

  if (dMatches) {
    for (const match of dMatches) {
      // Rough estimate: ~1 segment per 10 characters in d attribute
      estimatedSegments += Math.ceil(match.length / 10);
    }
  }

  if (estimatedSegments <= THRESHOLDS.SIMPLE_MAX) return 'simple';
  if (estimatedSegments <= THRESHOLDS.MODERATE_MAX) return 'moderate';
  if (estimatedSegments <= THRESHOLDS.COMPLEX_MAX) return 'complex';
  return 'very_complex';
}

/**
 * Check if boolean operations should be blocked
 *
 * @param {Object} analysis - Result from analyzeSvg()
 * @returns {Object} { blocked: boolean, reason: string|null }
 */
export function shouldBlockBooleans(analysis) {
  if (!analysis || !analysis.valid) {
    return { blocked: true, reason: 'Invalid SVG analysis' };
  }

  if (analysis.totalSegments > THRESHOLDS.COMPLEX_MAX) {
    return {
      blocked: true,
      reason: `Too complex for boolean operations (${analysis.totalSegments} segments). Use "Flatten Artwork" first.`
    };
  }

  return { blocked: false, reason: null };
}

/**
 * Check if boolean operations should show a warning
 *
 * @param {Object} analysis - Result from analyzeSvg()
 * @returns {Object} { warn: boolean, message: string|null }
 */
export function shouldWarnBooleans(analysis) {
  if (!analysis || !analysis.valid) {
    return { warn: false, message: null };
  }

  if (analysis.totalSegments > THRESHOLDS.MODERATE_MAX) {
    return {
      warn: true,
      message: `This operation may take a moment (${analysis.totalSegments} segments)`
    };
  }

  return { warn: false, message: null };
}

export default analyzeSvg;
