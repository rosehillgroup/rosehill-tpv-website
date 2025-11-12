// ImageTracer Integration
// Traces quantized regions to vector paths
//
// Strategy:
// 1. Convert quantized PNG to ImageTracer format
// 2. Trace each color region separately
// 3. Extract path coordinates from SVG output
// 4. Return structured path data for further processing




/**
 * Trace regions from quantized image
 *
 * @param {Buffer} quantizedBuffer - Quantized image buffer
 * @param {Array<Object>} palette - Color palette [{r, g, b}]
 * @returns {Promise<Object>} {paths, metadata}
 */
async function traceRegions(quantizedBuffer, palette) {
  const ImageTracer = (await import('imagetracerjs')).default;
  const sharp = (await import('sharp')).default;

  console.log('[TRACER] Tracing regions with ImageTracer...');

  try {
    // Get image dimensions and raw pixel data
    const metadata = await sharp(quantizedBuffer).metadata();
    const { width, height } = metadata;

    // Convert to raw RGBA data for ImageTracer
    const { data } = await sharp(quantizedBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    console.log(`[TRACER] Image: ${width}×${height}px, ${data.length} bytes`);

    // Create ImageData-like object for ImageTracer
    const imageData = {
      data: new Uint8ClampedArray(data),
      width,
      height
    };

    // Configure ImageTracer options
    const options = {
      // Tracing options
      ltres: 1.0,          // Line threshold (higher = smoother, straighter edges)
      qtres: 1.0,          // Quad threshold (higher = smoother curves)
      pathomit: 8,         // Omit tiny paths (< 8px, likely noise)

      // Color quantization - use manual palette mode
      colorsampling: 2,    // 2 = manual palette (don't resample colors)
      numberofcolors: palette.length,
      mincolorratio: 0,    // Include all colors, even rare ones
      colorquantcycles: 1, // Minimal quantization (colors already quantized)

      // Smoothing options
      blurradius: 0,       // No blur (already posterized)
      blurdelta: 0,

      // Layer options
      layering: 0,         // Sequential layering

      // SVG rendering options
      strokewidth: 0,      // No strokes, only fills
      linefilter: false,   // Keep all paths
      scale: 1,            // Keep original scale
      roundcoords: 3,      // Round to 3 decimal places for better precision

      // Color palette - ImageTracer needs exact format
      palette: palette.map(c => ({
        r: c.r,
        g: c.g,
        b: c.b,
        a: 255
      }))
    };

    console.log(`[TRACER] Using manual palette with ${palette.length} colors`);

    // Trace image using imagedataToSVG (works in Node.js)
    console.log('[TRACER] Running ImageTracer...');
    const svgString = ImageTracer.imagedataToSVG(imageData, options);

    console.log('[TRACER] Tracing complete, parsing SVG...');
    console.log(`[TRACER] SVG output length: ${svgString.length} bytes`);
    console.log(`[TRACER] SVG preview (first 500 chars): ${svgString.substring(0, 500)}`);

    // Parse SVG to extract path data
    const paths = parseSVGPaths(svgString, palette);

    console.log(`[TRACER] Extracted ${paths.length} paths`);

    return {
      paths,
      metadata: {
        path_count: paths.length,
        total_points: paths.reduce((sum, p) => sum + p.points.length, 0)
      }
    };

  } catch (error) {
    console.error('[TRACER] Error:', error);
    throw new Error(`Region tracing failed: ${error.message}`);
  }
}

/**
 * Parse SVG string to extract path coordinates
 * Converts SVG path d attribute to structured point arrays
 *
 * @param {string} svgString - SVG XML string
 * @param {Array<Object>} palette - Color palette
 * @returns {Array<Object>} Array of {color, points, bounds}
 */
function parseSVGPaths(svgString, palette) {
  const paths = [];

  // Extract path elements - handle fill and d attributes in any order
  const pathRegex = /<path([^>]*)>/g;
  let match;
  let matchCount = 0;

  while ((match = pathRegex.exec(svgString)) !== null) {
    const pathTag = match[1];

    // Extract d attribute
    const dMatch = pathTag.match(/d="([^"]+)"/);
    if (!dMatch) continue;

    // Extract fill attribute
    const fillMatch = pathTag.match(/fill="([^"]+)"/);
    if (!fillMatch) continue;

    matchCount++;
    const dAttribute = dMatch[1];
    const fillColor = fillMatch[1];

    console.log(`[TRACER-PARSER] Path ${matchCount}: fill=${fillColor}, d length=${dAttribute.length}`);

    // Parse path d attribute to points
    const points = parsePathD(dAttribute);

    console.log(`[TRACER-PARSER] Parsed ${points.length} points`);

    if (points.length < 3) {
      // Skip degenerate paths
      console.log(`[TRACER-PARSER] Skipping degenerate path (${points.length} points)`);
      continue;
    }

    // Find matching palette color
    const color = findColorFromFill(fillColor, palette);

    // Calculate bounds
    const bounds = calculateBounds(points);

    paths.push({
      color,
      fill: fillColor,
      points,
      bounds,
      area: calculatePolygonArea(points)
    });
  }

  console.log(`[TRACER-PARSER] Found ${matchCount} path matches, kept ${paths.length} valid paths`);

  // Sort by area (largest first) for proper layering
  paths.sort((a, b) => b.area - a.area);

  return paths;
}

/**
 * Parse SVG path d attribute to point coordinates
 * Supports M (moveto), L (lineto), Q (quadratic), C (cubic), Z (closepath)
 *
 * @param {string} d - SVG path d attribute
 * @returns {Array<Object>} Array of {x, y} points
 */
function parsePathD(d) {
  const points = [];

  // Split into commands
  const commands = d.match(/[MLQCZ][^MLQCZ]*/gi);
  if (!commands) return points;

  let currentX = 0;
  let currentY = 0;

  for (const cmd of commands) {
    const type = cmd[0].toUpperCase();
    const coords = cmd.slice(1).trim().split(/[\s,]+/).map(parseFloat);

    switch (type) {
      case 'M': // MoveTo
        currentX = coords[0];
        currentY = coords[1];
        points.push({ x: currentX, y: currentY });
        break;

      case 'L': // LineTo
        for (let i = 0; i < coords.length; i += 2) {
          currentX = coords[i];
          currentY = coords[i + 1];
          points.push({ x: currentX, y: currentY });
        }
        break;

      case 'Q': // Quadratic Bezier - sample to points
        for (let i = 0; i < coords.length; i += 4) {
          const cpX = coords[i];
          const cpY = coords[i + 1];
          const endX = coords[i + 2];
          const endY = coords[i + 3];

          // Sample quadratic curve with higher density for accuracy
          const steps = 10;
          for (let t = 1; t <= steps; t++) {
            const tNorm = t / steps;
            const x = (1 - tNorm) * (1 - tNorm) * currentX +
                     2 * (1 - tNorm) * tNorm * cpX +
                     tNorm * tNorm * endX;
            const y = (1 - tNorm) * (1 - tNorm) * currentY +
                     2 * (1 - tNorm) * tNorm * cpY +
                     tNorm * tNorm * endY;
            points.push({ x, y });
          }

          currentX = endX;
          currentY = endY;
        }
        break;

      case 'C': // Cubic Bezier - sample to points
        for (let i = 0; i < coords.length; i += 6) {
          const cp1X = coords[i];
          const cp1Y = coords[i + 1];
          const cp2X = coords[i + 2];
          const cp2Y = coords[i + 3];
          const endX = coords[i + 4];
          const endY = coords[i + 5];

          // Sample cubic curve with higher density for accuracy
          const steps = 20;
          for (let t = 1; t <= steps; t++) {
            const tNorm = t / steps;
            const x = Math.pow(1 - tNorm, 3) * currentX +
                     3 * Math.pow(1 - tNorm, 2) * tNorm * cp1X +
                     3 * (1 - tNorm) * tNorm * tNorm * cp2X +
                     Math.pow(tNorm, 3) * endX;
            const y = Math.pow(1 - tNorm, 3) * currentY +
                     3 * Math.pow(1 - tNorm, 2) * tNorm * cp1Y +
                     3 * (1 - tNorm) * tNorm * tNorm * cp2Y +
                     Math.pow(tNorm, 3) * endY;
            points.push({ x, y });
          }

          currentX = endX;
          currentY = endY;
        }
        break;

      case 'Z': // ClosePath
        // Already closed, nothing to do
        break;
    }
  }

  return points;
}

/**
 * Find palette color from SVG fill attribute
 * @param {string} fill - SVG fill color (hex or rgb)
 * @param {Array<Object>} palette - Color palette
 * @returns {Object} {r, g, b}
 */
function findColorFromFill(fill, palette) {
  // Parse hex color
  if (fill.startsWith('#')) {
    const hex = fill.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Find closest palette color
    return findNearestColor({ r, g, b }, palette);
  }

  // Parse rgb() color
  const rgbMatch = fill.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);

    return findNearestColor({ r, g, b }, palette);
  }

  // Default to first palette color
  return palette[0];
}

/**
 * Find nearest palette color
 * @param {Object} color - {r, g, b}
 * @param {Array<Object>} palette - Palette colors
 * @returns {Object} Nearest color
 */
function findNearestColor(color, palette) {
  let minDist = Infinity;
  let nearest = palette[0];

  for (const paletteColor of palette) {
    const dist = Math.sqrt(
      Math.pow(color.r - paletteColor.r, 2) +
      Math.pow(color.g - paletteColor.g, 2) +
      Math.pow(color.b - paletteColor.b, 2)
    );

    if (dist < minDist) {
      minDist = dist;
      nearest = paletteColor;
    }
  }

  return nearest;
}

/**
 * Calculate bounding box of points
 * @param {Array<Object>} points - Array of {x, y}
 * @returns {Object} {minX, minY, maxX, maxY, width, height}
 */
function calculateBounds(points) {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Calculate polygon area using shoelace formula
 * @param {Array<Object>} points - Array of {x, y}
 * @returns {number} Area in square pixels
 */
function calculatePolygonArea(points) {
  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }

  return Math.abs(area / 2);
}

module.exports = {
  traceRegions
};
