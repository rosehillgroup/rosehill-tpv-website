// SVG Assembly
// Generates clean, optimized SVG from constrained paths
//
// Strategy:
// 1. Create properly formatted SVG document
// 2. Convert paths to polygon elements
// 3. Group by color for easier editing
// 4. Add metadata for traceability

/**
 * Generate SVG from constrained paths
 *
 * @param {Array<Object>} paths - Constrained path data
 * @param {Object} dimensions - Image dimensions
 * @param {number} dimensions.width - Width in pixels
 * @param {number} dimensions.height - Height in pixels
 * @param {Object} metadata - Additional metadata
 * @returns {string} SVG string
 */
export function generateSVG(paths, dimensions, metadata = {}) {
  console.log('[SVG-GEN] Generating SVG...');

  const { width, height } = dimensions;

  // Start SVG document
  let svg = [];

  // SVG header with viewBox
  svg.push('<?xml version="1.0" encoding="UTF-8"?>');
  svg.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`);

  // Add metadata
  svg.push('  <metadata>');
  svg.push('    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"');
  svg.push('             xmlns:dc="http://purl.org/dc/elements/1.1/">');
  svg.push('      <rdf:Description>');
  svg.push(`        <dc:creator>TPV Studio Vectorization Pipeline</dc:creator>`);
  svg.push(`        <dc:date>${new Date().toISOString()}</dc:date>`);
  svg.push(`        <dc:description>Installer-ready playground surface design</dc:description>`);
  if (metadata.job_id) {
    svg.push(`        <dc:identifier>Job ${metadata.job_id}</dc:identifier>`);
  }
  if (metadata.surface_dimensions) {
    svg.push(`        <dc:format>Surface: ${metadata.surface_dimensions.width}mm × ${metadata.surface_dimensions.height}mm</dc:format>`);
  }
  svg.push('      </rdf:Description>');
  svg.push('    </rdf:RDF>');
  svg.push('  </metadata>');

  // Add title and description
  svg.push('  <title>TPV Playground Surface Design</title>');
  svg.push('  <desc>Vector design for thermoplastic installation</desc>');

  // ========================================================================
  // Group paths by color for easier editing
  // ========================================================================

  const pathsByColor = groupPathsByColor(paths);

  console.log(`[SVG-GEN] Grouped into ${Object.keys(pathsByColor).length} color groups`);

  // Add background (largest region, typically)
  svg.push('');
  svg.push('  <!-- Background Layer -->');
  svg.push(`  <rect width="${width}" height="${height}" fill="${rgbToHex(paths[0]?.color || { r: 240, g: 240, b: 240 })}" />`);

  // Add each color group
  let groupIndex = 1;

  for (const [colorKey, colorPaths] of Object.entries(pathsByColor)) {
    const color = colorPaths[0].color;
    const hexColor = rgbToHex(color);

    svg.push('');
    svg.push(`  <!-- Color Group ${groupIndex}: ${hexColor} (${colorPaths.length} regions) -->`);
    svg.push(`  <g id="color-group-${groupIndex}" fill="${hexColor}" stroke="none">`);

    // Add each path in this color group
    for (let i = 0; i < colorPaths.length; i++) {
      const path = colorPaths[i];

      // Convert points to polygon
      const pointsString = path.points
        .map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
        .join(' ');

      svg.push(`    <polygon id="region-${groupIndex}-${i + 1}" points="${pointsString}" />`);
    }

    svg.push('  </g>');

    groupIndex++;
  }

  // Close SVG
  svg.push('</svg>');

  const svgString = svg.join('\n');

  console.log(`[SVG-GEN] Generated SVG: ${svgString.length} bytes, ${paths.length} regions`);

  return svgString;
}

/**
 * Group paths by color for organized SVG output
 * @param {Array<Object>} paths - Path objects
 * @returns {Object} Map of color -> paths
 */
function groupPathsByColor(paths) {
  const groups = {};

  for (const path of paths) {
    const colorKey = rgbToHex(path.color);

    if (!groups[colorKey]) {
      groups[colorKey] = [];
    }

    groups[colorKey].push(path);
  }

  return groups;
}

/**
 * Convert RGB to hex color
 * @param {Object} color - {r, g, b}
 * @returns {string} Hex color (#RRGGBB)
 */
function rgbToHex(color) {
  const r = color.r.toString(16).padStart(2, '0');
  const g = color.g.toString(16).padStart(2, '0');
  const b = color.b.toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

/**
 * Generate SVG with advanced features (layers, clipping paths, etc.)
 * For future enhancement
 *
 * @param {Array<Object>} paths - Constrained path data
 * @param {Object} dimensions - Image dimensions
 * @param {Object} options - Advanced options
 * @returns {string} Enhanced SVG string
 */
export function generateAdvancedSVG(paths, dimensions, options = {}) {
  // TODO: Implement advanced SVG features:
  // - Layer organization by type (base, accent, highlight)
  // - Clipping paths for complex overlaps
  // - Gradients (if needed for future designs)
  // - Proper z-ordering with opacity
  // - Export-ready for Adobe Illustrator, Inkscape

  return generateSVG(paths, dimensions, options.metadata);
}

/**
 * Optimize SVG for file size
 * Removes unnecessary precision, whitespace, metadata
 *
 * @param {string} svgString - Input SVG
 * @returns {string} Optimized SVG
 */
export function optimizeSVG(svgString) {
  // Simple optimization - reduce decimal places
  let optimized = svgString;

  // Reduce coordinate precision to 1 decimal place
  optimized = optimized.replace(/(\d+\.\d{2,})/g, (match) => {
    return parseFloat(match).toFixed(1);
  });

  // Remove extra whitespace
  optimized = optimized.replace(/\n\s+\n/g, '\n');

  const originalSize = svgString.length;
  const optimizedSize = optimized.length;
  const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

  console.log(`[SVG-GEN] Optimized: ${originalSize} → ${optimizedSize} bytes (${reduction}% reduction)`);

  return optimized;
}

/**
 * Validate SVG output
 * Basic checks for well-formed SVG
 *
 * @param {string} svgString - SVG to validate
 * @returns {Object} {valid, errors}
 */
export function validateSVG(svgString) {
  const errors = [];

  // Check for opening tag
  if (!svgString.includes('<svg')) {
    errors.push('Missing <svg> opening tag');
  }

  // Check for closing tag
  if (!svgString.includes('</svg>')) {
    errors.push('Missing </svg> closing tag');
  }

  // Check for viewBox
  if (!svgString.includes('viewBox')) {
    errors.push('Missing viewBox attribute');
  }

  // Check for at least one shape
  const hasShapes = svgString.includes('<polygon') ||
                    svgString.includes('<path') ||
                    svgString.includes('<rect') ||
                    svgString.includes('<circle');

  if (!hasShapes) {
    errors.push('No shapes found in SVG');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
