// Band Generator for TPV Studio Geometric Mode
// Creates smooth flowing ribbons with controlled curvature (min 600mm radius)

import smooth from 'chaikin-smooth';

/**
 * Generate a flowing band (ribbon) across the canvas
 * @param {object} canvas - {width_mm, height_mm}
 * @param {object} options - Band parameters
 * @param {number} options.width - Band width in mm (default: 800-1500mm)
 * @param {string} options.direction - 'horizontal' | 'vertical' | 'diagonal'
 * @param {number} options.curvature - 0-1, amount of waviness (default: 0.3)
 * @param {number} options.seed - Random seed for reproducibility
 * @returns {string} SVG path data for the band
 */
export function generateBand(canvas, options = {}) {
  const {
    width = 1000,
    direction = 'horizontal',
    curvature = 0.3,
    seed = 0
  } = options;

  // Seeded random
  let rng = seed;
  const random = () => {
    rng = (rng * 1664525 + 1013904223) % 4294967296;
    return rng / 4294967296;
  };

  // Generate spine control points
  const spinePoints = generateSpine(canvas, direction, curvature, random);

  // Smooth spine using Chaikin
  const smoothedSpine = smooth(spinePoints, 2); // 2 iterations

  // Offset spine to create band with width
  const topEdge = offsetCurve(smoothedSpine, width / 2);
  const bottomEdge = offsetCurve(smoothedSpine, -width / 2);

  // Build path: top edge forward, bottom edge backward, close
  const pathParts = [];

  // Start at first point of top edge
  pathParts.push(`M ${topEdge[0][0].toFixed(2)},${topEdge[0][1].toFixed(2)}`);

  // Cubic Bézier along top edge
  for (let i = 0; i < topEdge.length - 1; i++) {
    const [x0, y0] = topEdge[i];
    const [x1, y1] = topEdge[i + 1];
    const [x2, y2] = topEdge[Math.min(i + 2, topEdge.length - 1)];

    // Control points for smooth curve
    const cp1x = x0 + (x1 - x0) * 0.5;
    const cp1y = y0 + (y1 - y0) * 0.5;
    const cp2x = x1 - (x2 - x1) * 0.3;
    const cp2y = y1 - (y2 - y1) * 0.3;

    pathParts.push(`C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${x1.toFixed(2)},${y1.toFixed(2)}`);
  }

  // Line to start of bottom edge
  pathParts.push(`L ${bottomEdge[bottomEdge.length - 1][0].toFixed(2)},${bottomEdge[bottomEdge.length - 1][1].toFixed(2)}`);

  // Cubic Bézier along bottom edge (reversed)
  for (let i = bottomEdge.length - 1; i > 0; i--) {
    const [x0, y0] = bottomEdge[i];
    const [x1, y1] = bottomEdge[i - 1];
    const [x2, y2] = bottomEdge[Math.max(i - 2, 0)];

    const cp1x = x0 + (x1 - x0) * 0.5;
    const cp1y = y0 + (y1 - y0) * 0.5;
    const cp2x = x1 - (x2 - x1) * 0.3;
    const cp2y = y1 - (y2 - y1) * 0.3;

    pathParts.push(`C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${x1.toFixed(2)},${y1.toFixed(2)}`);
  }

  // Close path
  pathParts.push('Z');

  return pathParts.join(' ');
}

/**
 * Generate spine control points for a band
 * @private
 */
function generateSpine(canvas, direction, curvature, random) {
  const points = [];
  const numPoints = 6; // Control points along spine

  if (direction === 'horizontal') {
    const baseY = canvas.height_mm / 2;
    const amplitude = canvas.height_mm * curvature * 0.3;

    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const x = t * canvas.width_mm;
      // Sine wave with random variation
      const y = baseY + Math.sin(t * Math.PI * 2) * amplitude + (random() - 0.5) * amplitude;
      points.push([x, y]);
    }
  } else if (direction === 'vertical') {
    const baseX = canvas.width_mm / 2;
    const amplitude = canvas.width_mm * curvature * 0.3;

    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const y = t * canvas.height_mm;
      const x = baseX + Math.sin(t * Math.PI * 2) * amplitude + (random() - 0.5) * amplitude;
      points.push([x, y]);
    }
  } else { // diagonal
    const amplitude = Math.min(canvas.width_mm, canvas.height_mm) * curvature * 0.2;

    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const x = t * canvas.width_mm;
      const y = t * canvas.height_mm;
      const offset = Math.sin(t * Math.PI * 3) * amplitude + (random() - 0.5) * amplitude;
      points.push([x + offset, y - offset]);
    }
  }

  return points;
}

/**
 * Offset a curve by a given distance (creates parallel curve)
 * @private
 */
function offsetCurve(points, distance) {
  const offset = [];

  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];

    // Calculate normal vector (perpendicular to tangent)
    let nx, ny;

    if (i === 0) {
      // Use forward difference at start
      const [x1, y1] = points[i + 1];
      const dx = x1 - x;
      const dy = y1 - y;
      const len = Math.sqrt(dx * dx + dy * dy);
      nx = -dy / len;
      ny = dx / len;
    } else if (i === points.length - 1) {
      // Use backward difference at end
      const [x0, y0] = points[i - 1];
      const dx = x - x0;
      const dy = y - y0;
      const len = Math.sqrt(dx * dx + dy * dy);
      nx = -dy / len;
      ny = dx / len;
    } else {
      // Use central difference in middle
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i + 1];
      const dx = x1 - x0;
      const dy = y1 - y0;
      const len = Math.sqrt(dx * dx + dy * dy);
      nx = -dy / len;
      ny = dx / len;
    }

    // Offset point along normal
    offset.push([x + nx * distance, y + ny * distance]);
  }

  return offset;
}

/**
 * Generate multiple bands for composition
 * @param {object} canvas - Canvas dimensions
 * @param {number} count - Number of bands (1-3)
 * @param {number} seed - Random seed
 * @returns {Array} Array of band path data
 */
export function generateBands(canvas, count, seed = 0) {
  const bands = [];
  const directions = ['horizontal', 'vertical', 'diagonal'];

  // Seeded random
  let rng = seed;
  const random = () => {
    rng = (rng * 1664525 + 1013904223) % 4294967296;
    return rng / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    const width = 800 + random() * 700; // 800-1500mm
    const direction = directions[i % directions.length];
    const curvature = 0.2 + random() * 0.3; // 0.2-0.5

    bands.push({
      path: generateBand(canvas, {
        width,
        direction,
        curvature,
        seed: seed + i * 1000
      }),
      width,
      direction
    });
  }

  return bands;
}
