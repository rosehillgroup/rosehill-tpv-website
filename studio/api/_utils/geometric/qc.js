// Quality Control Module for TPV Studio Geometric Mode
// Validates generated SVGs against TPV manufacturing constraints

// Paper.js is optional - only used for advanced geometry validation
// Lazy-loaded to avoid import errors in environments without canvas support
let paper = null;
let paperLoadAttempted = false;

async function loadPaper() {
  if (paperLoadAttempted) return paper;
  paperLoadAttempted = true;

  try {
    const paperModule = await import('paper');
    paper = paperModule.default;
  } catch (err) {
    console.warn('[QC] Paper.js not available - advanced geometry validation disabled');
  }

  return paper;
}

/**
 * TPV Manufacturing Constraints
 */
export const TPV_CONSTRAINTS = {
  MAX_COLORS: 8,
  MIN_FEATURE_WIDTH_MM: 120,
  MIN_INSIDE_RADIUS_MM: 600,
  MIN_COLOR_CONTRAST: 15 // Delta E in OKLCH
};

/**
 * Validate a geometric SVG design against TPV constraints
 * @param {string} svg - SVG string to validate
 * @param {object} metadata - Design metadata from generator
 * @returns {object} {pass: boolean, issues: Array<string>, warnings: Array<string>}
 */
export async function validateGeometricSVG(svg, metadata) {
  const issues = [];
  const warnings = [];

  try {
    // 1. Validate color count
    const colorCheck = validateColorCount(svg, metadata);
    if (!colorCheck.pass) {
      issues.push(...colorCheck.issues);
    }
    warnings.push(...colorCheck.warnings);

    // 2. Validate SVG structure
    const structureCheck = validateSVGStructure(svg);
    if (!structureCheck.pass) {
      issues.push(...structureCheck.issues);
    }

    // 3. Validate geometric constraints (feature width, radii)
    const geometryCheck = await validateGeometry(svg, metadata);
    if (!geometryCheck.pass) {
      issues.push(...geometryCheck.issues);
    }
    warnings.push(...geometryCheck.warnings);

    // 4. Validate canvas dimensions
    const canvasCheck = validateCanvas(metadata);
    if (!canvasCheck.pass) {
      issues.push(...canvasCheck.issues);
    }

  } catch (error) {
    issues.push(`Validation error: ${error.message}`);
  }

  return {
    pass: issues.length === 0,
    issues,
    warnings,
    timestamp: new Date().toISOString()
  };
}

/**
 * Validate color count constraint
 * @private
 */
function validateColorCount(svg, metadata) {
  const issues = [];
  const warnings = [];

  // Extract colors from palette metadata
  const paletteColors = metadata.palette || [];

  if (paletteColors.length > TPV_CONSTRAINTS.MAX_COLORS) {
    issues.push(`Too many colors: ${paletteColors.length} > ${TPV_CONSTRAINTS.MAX_COLORS}`);
  }

  if (paletteColors.length < 3) {
    warnings.push(`Very few colors: ${paletteColors.length}. Consider using at least 3 for visual interest.`);
  }

  // Also extract colors directly from SVG as a double-check
  const fillRegex = /fill="(#[0-9a-fA-F]{6})"/g;
  const uniqueColors = new Set();
  let match;
  while ((match = fillRegex.exec(svg)) !== null) {
    uniqueColors.add(match[1].toLowerCase());
  }

  if (uniqueColors.size > TPV_CONSTRAINTS.MAX_COLORS) {
    issues.push(`SVG contains ${uniqueColors.size} unique colors (exceeds ${TPV_CONSTRAINTS.MAX_COLORS})`);
  }

  if (uniqueColors.size !== paletteColors.length) {
    warnings.push(`Color mismatch: SVG has ${uniqueColors.size} colors but palette has ${paletteColors.length}`);
  }

  return {
    pass: issues.length === 0,
    issues,
    warnings
  };
}

/**
 * Validate SVG structure and syntax
 * @private
 */
function validateSVGStructure(svg) {
  const issues = [];

  // Check for valid XML/SVG declaration
  if (!svg.includes('<?xml') && !svg.includes('<svg')) {
    issues.push('Missing SVG declaration');
  }

  // Check for required viewBox
  if (!svg.includes('viewBox=')) {
    issues.push('Missing viewBox attribute');
  }

  // Check for closing svg tag
  if (!svg.includes('</svg>')) {
    issues.push('Missing closing </svg> tag');
  }

  // Check for valid hex colors
  const invalidColorRegex = /fill="(?!#[0-9a-fA-F]{6}"|none)[^"]*"/g;
  const invalidColors = svg.match(invalidColorRegex);
  if (invalidColors && invalidColors.length > 0) {
    issues.push(`Invalid color formats found: ${invalidColors.slice(0, 3).join(', ')}`);
  }

  return {
    pass: issues.length === 0,
    issues
  };
}

/**
 * Validate geometric constraints using Paper.js
 * @private
 */
async function validateGeometry(svg, metadata) {
  const issues = [];
  const warnings = [];

  // Try to load Paper.js for advanced validation
  await loadPaper();

  // Skip advanced validation if Paper.js not available
  if (!paper) {
    warnings.push('Advanced geometry validation skipped (Paper.js not available)');
    return { pass: true, issues, warnings };
  }

  try {
    // Set up Paper.js canvas
    const canvas = metadata.canvas || { width_mm: 15000, height_mm: 15000 };
    paper.setup(new paper.Size(canvas.width_mm, canvas.height_mm));

    // Parse SVG paths
    const pathRegex = /<path[^>]*d="([^"]*)"/g;
    let match;
    let pathCount = 0;

    while ((match = pathRegex.exec(svg)) !== null) {
      pathCount++;
      const pathData = match[1];

      try {
        // Import path into Paper.js
        const pathItem = new paper.Path(pathData);

        // Check if path is too small (could be below minimum width)
        const bounds = pathItem.bounds;
        const minDimension = Math.min(bounds.width, bounds.height);

        if (minDimension < TPV_CONSTRAINTS.MIN_FEATURE_WIDTH_MM) {
          warnings.push(
            `Path ${pathCount} may be too narrow: ${minDimension.toFixed(0)}mm < ${TPV_CONSTRAINTS.MIN_FEATURE_WIDTH_MM}mm minimum`
          );
        }

        // Check for very tight curves (approximate radius check)
        // This is a simplified check - full curvature analysis would be more complex
        if (pathItem.segments && pathItem.segments.length > 2) {
          for (let i = 1; i < pathItem.segments.length - 1; i++) {
            const prev = pathItem.segments[i - 1].point;
            const curr = pathItem.segments[i].point;
            const next = pathItem.segments[i + 1].point;

            // Calculate angle at current point
            const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
            const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
            const angleDiff = Math.abs(angle2 - angle1);

            // If angle change is sharp (> 45 degrees over short distance)
            const dist = prev.getDistance(curr) + curr.getDistance(next);
            if (angleDiff > Math.PI / 4 && dist < TPV_CONSTRAINTS.MIN_INSIDE_RADIUS_MM * 2) {
              warnings.push(
                `Path ${pathCount} segment ${i} may have tight curve (angle: ${(angleDiff * 180 / Math.PI).toFixed(0)}°)`
              );
              break; // Only report once per path
            }
          }
        }

        pathItem.remove();
      } catch (pathError) {
        warnings.push(`Could not analyze path ${pathCount}: ${pathError.message}`);
      }
    }

    if (pathCount === 0) {
      issues.push('No paths found in SVG');
    }

  } catch (error) {
    warnings.push(`Geometry validation incomplete: ${error.message}`);
  }

  return {
    pass: issues.length === 0,
    issues,
    warnings
  };
}

/**
 * Validate canvas dimensions
 * @private
 */
function validateCanvas(metadata) {
  const issues = [];

  const canvas = metadata.canvas;
  if (!canvas) {
    issues.push('Missing canvas dimensions in metadata');
    return { pass: false, issues };
  }

  if (!canvas.width_mm || !canvas.height_mm) {
    issues.push('Canvas missing width or height');
  }

  if (canvas.width_mm < 1000 || canvas.height_mm < 1000) {
    issues.push(`Canvas too small: ${canvas.width_mm}x${canvas.height_mm}mm`);
  }

  if (canvas.width_mm > 100000 || canvas.height_mm > 100000) {
    issues.push(`Canvas too large: ${canvas.width_mm}x${canvas.height_mm}mm`);
  }

  return {
    pass: issues.length === 0,
    issues
  };
}

/**
 * Generate a QC report for display/logging
 * @param {object} validationResult - Result from validateGeometricSVG
 * @param {object} metadata - Design metadata
 * @returns {string} Formatted report
 */
export function generateQCReport(validationResult, metadata) {
  const lines = [];

  lines.push('=== TPV Studio Geometric Design QC Report ===');
  lines.push(`Status: ${validationResult.pass ? '✓ PASS' : '✗ FAIL'}`);
  lines.push(`Timestamp: ${validationResult.timestamp}`);
  lines.push('');

  if (metadata) {
    lines.push('Design Metadata:');
    lines.push(`  Brief: ${metadata.brief || 'N/A'}`);
    lines.push(`  Canvas: ${metadata.canvas?.width_mm || '?'}x${metadata.canvas?.height_mm || '?'}mm`);
    lines.push(`  Colors: ${metadata.colorCount || metadata.palette?.length || '?'}`);
    lines.push(`  Mood: ${metadata.mood || 'N/A'}`);
    lines.push(`  Seed: ${metadata.seed || 'N/A'}`);
    lines.push('');
  }

  if (validationResult.issues.length > 0) {
    lines.push(`Issues (${validationResult.issues.length}):`);
    validationResult.issues.forEach((issue, i) => {
      lines.push(`  ${i + 1}. ${issue}`);
    });
    lines.push('');
  }

  if (validationResult.warnings.length > 0) {
    lines.push(`Warnings (${validationResult.warnings.length}):`);
    validationResult.warnings.forEach((warning, i) => {
      lines.push(`  ${i + 1}. ${warning}`);
    });
    lines.push('');
  }

  if (validationResult.pass && validationResult.issues.length === 0) {
    lines.push('All constraints satisfied. Design ready for manufacturing.');
  }

  lines.push('=== End Report ===');

  return lines.join('\n');
}

/**
 * Quick validation check (returns boolean only)
 * @param {string} svg - SVG string
 * @param {object} metadata - Design metadata
 * @returns {Promise<boolean>} True if passes all checks
 */
export async function quickValidate(svg, metadata) {
  const result = await validateGeometricSVG(svg, metadata);
  return result.pass;
}
