// Painter utilities for TPV Studio
// Role-aware compositing, SVG generation, and PNG rasterization

const { polygonCentroid } = require('./geometry.js');
/**
 * Paint SVG with role-aware layering
 * @param {Object} surface - {width_m, height_m}
 * @param {Array} shapes - Geometry shapes with color assignments
 * @param {Array} motifs - Placed motifs
 * @param {Object} palette - Color palette
 * @param {Object} options - Rendering options
 * @returns {Object} {svg: string, metadata: Object}
 */
function paintSVG(surface, shapes, motifs, palette, options = {}) {
  const { width_m, height_m } = surface;
  const dpi = options.dpi || 96;
  const edgeSoftening = options.edgeSoftening !== false; // default true

  // Calculate SVG dimensions in pixels (for export)
  const width_px = Math.round(width_m * (1000 / 25.4) * dpi); // meters to inches to pixels
  const height_px = Math.round(height_m * (1000 / 25.4) * dpi);

  // Build SVG document
  const svgParts = [];

  // SVG header
  svgParts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" `);
  svgParts.push(`width="${width_m}m" height="${height_m}m" `);
  svgParts.push(`viewBox="0 0 ${width_m} ${height_m}" `);
  svgParts.push(`preserveAspectRatio="xMidYMid meet">`);

  // Add definitions for edge softening gradients
  if (edgeSoftening) {
    svgParts.push(`<defs>`);
    svgParts.push(`<filter id="soften-edge">`);
    svgParts.push(`<feGaussianBlur in="SourceAlpha" stdDeviation="0.01"/>`);
    svgParts.push(`<feOffset dx="0" dy="0" result="offsetblur"/>`);
    svgParts.push(`<feComponentTransfer>`);
    svgParts.push(`<feFuncA type="linear" slope="0.8"/>`);
    svgParts.push(`</feComponentTransfer>`);
    svgParts.push(`<feMerge>`);
    svgParts.push(`<feMergeNode/>`);
    svgParts.push(`<feMergeNode in="SourceGraphic"/>`);
    svgParts.push(`</feMerge>`);
    svgParts.push(`</filter>`);
    svgParts.push(`</defs>`);
  }

  // === LAYER 1: BASE FIELD ===
  // Full-surface rectangle with base color
  const baseColor = palette.find(p => p.role === 'base')?.code || palette[0].code;
  svgParts.push(`<g id="layer-base">`);
  svgParts.push(`<rect x="0" y="0" width="${width_m}" height="${height_m}" `);
  svgParts.push(`fill="${baseColor}" />`);
  svgParts.push(`</g>`);

  console.log(`[PAINTER] Base field: ${baseColor} (full surface)`);

  // === LAYER 2: ACCENT SHAPES (All accent roles) ===
  // Render accent layers in order: accent, accent1, accent2, accent3
  const accentRoles = ['accent', 'accent1', 'accent2', 'accent3'];
  for (const role of accentRoles) {
    const roleShapes = shapes.filter(s => s.colorRole === role);
    if (roleShapes.length > 0) {
      svgParts.push(`<g id="layer-${role}">`);
      for (const shape of roleShapes) {
        const pathData = pointsToPathData(shape.points);
        const filter = edgeSoftening ? ' filter="url(#soften-edge)"' : '';
        svgParts.push(`<path d="${pathData}" fill="${shape.color}"${filter} />`);
      }
      svgParts.push(`</g>`);
      console.log(`[PAINTER] ${role} layer: ${roleShapes.length} shapes`);
    }
  }

  // === LAYER 3: HIGHLIGHT SHAPES (All highlight roles) ===
  // Render highlight layers in order: highlight, highlight1, highlight2
  const highlightRoles = ['highlight', 'highlight1', 'highlight2'];
  for (const role of highlightRoles) {
    const roleShapes = shapes.filter(s => s.colorRole === role);
    if (roleShapes.length > 0) {
      svgParts.push(`<g id="layer-${role}">`);
      for (const shape of roleShapes) {
        const pathData = pointsToPathData(shape.points);
        const filter = edgeSoftening ? ' filter="url(#soften-edge)"' : '';
        svgParts.push(`<path d="${pathData}" fill="${shape.color}"${filter} />`);
      }
      svgParts.push(`</g>`);
      console.log(`[PAINTER] ${role} layer: ${roleShapes.length} shapes`);
    }
  }

  // === LAYER 4: MOTIFS ===
  if (motifs && motifs.length > 0) {
    svgParts.push(`<g id="layer-motifs">`);
    for (const motif of motifs) {
      // Transform motif: translate, scale, rotate
      const transform = [];
      transform.push(`translate(${motif.x}, ${motif.y})`);

      // Parse viewBox to get motif dimensions
      const viewBox = motif.viewBox.split(' ').map(Number);
      const motifWidth = viewBox[2] - viewBox[0];
      const motifHeight = viewBox[3] - viewBox[1];

      // Scale from viewBox units to world meters
      const scale = motif.size / Math.max(motifWidth, motifHeight);
      transform.push(`scale(${scale})`);

      // Rotate if specified
      if (motif.rotation) {
        const degrees = (motif.rotation * 180) / Math.PI;
        transform.push(`rotate(${degrees})`);
      }

      // Center the motif
      transform.push(`translate(${-motifWidth / 2}, ${-motifHeight / 2})`);

      svgParts.push(`<g transform="${transform.join(' ')}">`);
      svgParts.push(`<path d="${motif.paths}" fill="${motif.color}" />`);
      svgParts.push(`</g>`);
    }
    svgParts.push(`</g>`);
    console.log(`[PAINTER] Motifs layer: ${motifs.length} motifs`);
  }

  // Close SVG
  svgParts.push(`</svg>`);

  const svg = svgParts.join('\n');

  // Calculate coverage statistics
  const coverage = calculateCoverage(shapes, surface, palette);

  return {
    svg,
    metadata: {
      width_m,
      height_m,
      width_px,
      height_px,
      coverage,
      shapeCount: shapes.length,
      motifCount: motifs?.length || 0
    }
  };
}

/**
 * Convert array of points to SVG path data
 * @param {Array} points - Array of {x, y} points
 * @returns {string} SVG path data string
 */
function pointsToPathData(points) {
  if (!points || points.length === 0) return '';

  const parts = [];
  parts.push(`M ${points[0].x.toFixed(3)} ${points[0].y.toFixed(3)}`);

  for (let i = 1; i < points.length; i++) {
    parts.push(`L ${points[i].x.toFixed(3)} ${points[i].y.toFixed(3)}`);
  }

  parts.push('Z'); // Close path
  return parts.join(' ');
}

/**
 * Calculate coverage statistics by role
 * @param {Array} shapes - Colored shapes
 * @param {Object} surface - Surface dimensions
 * @param {Object} palette - Palette with roles
 * @returns {Object} Coverage percentages by role
 */
function calculateCoverage(shapes, surface, palette) {
  const totalArea = surface.width_m * surface.height_m;

  // Initialize coverage for all possible roles
  const roleAreas = {
    base: totalArea // Base always covers full surface
  };

  // Initialize all roles from palette to 0
  for (const p of palette) {
    if (p.role !== 'base') {
      roleAreas[p.role] = 0;
    }
  }

  // Accumulate areas by role
  for (const shape of shapes) {
    const role = shape.colorRole;
    if (!role) continue;

    // Calculate polygon area using shoelace formula
    const area = polygonArea(shape.points);
    roleAreas[role] = (roleAreas[role] || 0) + area;
  }

  // Convert to percentages
  const coverage = {};
  for (const [role, area] of Object.entries(roleAreas)) {
    coverage[role] = (area / totalArea) * 100;
  }

  return coverage;
}

/**
 * Calculate polygon area using shoelace formula
 * @param {Array} points - Array of {x, y} points
 * @returns {number} Area in square units
 */
function polygonArea(points) {
  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }

  return Math.abs(area) / 2;
}

/**
 * Generate PNG from SVG (requires sharp)
 * @param {string} svg - SVG string
 * @param {Object} options - {width, height, dpi}
 * @returns {Promise<Buffer>} PNG buffer
 */
export async function rasterizeToPNG(svg, options = {}) {
  // This will be implemented in the main generation function
  // which has access to the 'sharp' library
  throw new Error('rasterizeToPNG must be called from generation context with sharp');
}

/**
 * Export SVG for cutting/installation
 * Generates separate layers for each color
 * @param {Object} surface - Surface dimensions
 * @param {Array} shapes - Colored shapes
 * @param {Object} palette - Color palette
 * @returns {Object} {layers: Array of {color, svg}}
 */
function exportCuttingLayers(surface, shapes, palette) {
  const { width_m, height_m } = surface;
  const layers = [];

  // Group shapes by color
  const colorGroups = {};
  for (const shape of shapes) {
    const color = shape.color;
    if (!colorGroups[color]) {
      colorGroups[color] = [];
    }
    colorGroups[color].push(shape);
  }

  // Generate separate SVG for each color
  for (const [color, colorShapes] of Object.entries(colorGroups)) {
    const svgParts = [];
    svgParts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
    svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" `);
    svgParts.push(`width="${width_m}m" height="${height_m}m" `);
    svgParts.push(`viewBox="0 0 ${width_m} ${height_m}">`);

    for (const shape of colorShapes) {
      const pathData = pointsToPathData(shape.points);
      svgParts.push(`<path d="${pathData}" fill="${color}" stroke="none" />`);
    }

    svgParts.push(`</svg>`);

    const paletteEntry = palette.find(p => p.code === color);
    layers.push({
      color,
      colorName: color,
      role: paletteEntry?.role || 'unknown',
      shapeCount: colorShapes.length,
      svg: svgParts.join('\n')
    });
  }

  console.log(`[PAINTER] Exported ${layers.length} cutting layers`);
  return { layers };
}

/**
 * Validate design against constraints
 * @param {Object} metadata - Design metadata with coverage
 * @param {Object} constraints - Constraint thresholds
 * @returns {Object} {valid: boolean, violations: Array}
 */
function validateDesign(metadata, constraints = {}) {
  const violations = [];

  // Default coverage targets
  const targets = {
    base: constraints.minBaseCoverage || 45,
    accent: constraints.minAccentCoverage || 20,
    highlight: constraints.minHighlightCoverage || 10
  };

  // Check coverage targets
  for (const [role, minPercent] of Object.entries(targets)) {
    const actual = metadata.coverage[role] || 0;
    if (actual < minPercent) {
      violations.push({
        type: 'coverage',
        role,
        required: minPercent,
        actual: actual.toFixed(1),
        message: `${role} coverage ${actual.toFixed(1)}% is below minimum ${minPercent}%`
      });
    }
  }

  // Check shape counts
  const maxShapes = constraints.maxShapes || 100;
  if (metadata.shapeCount > maxShapes) {
    violations.push({
      type: 'complexity',
      message: `Shape count ${metadata.shapeCount} exceeds maximum ${maxShapes}`
    });
  }

  return {
    valid: violations.length === 0,
    violations
  };
}


module.exports = {
  paintSVG,
  pointsToPathData,
  calculateCoverage,
  polygonArea,
  exportCuttingLayers,
  validateDesign
};
