// TPV Studio - SVG to DXF Conversion Utilities
// Converts SVG elements to DXF-compatible polyline vertices

/**
 * Parse SVG path 'd' attribute and convert to array of polyline vertices
 * Handles M, L, H, V, C, Q, A, Z commands (both absolute and relative)
 * @param {string} d - SVG path d attribute
 * @param {number} tolerance - Max deviation for curve flattening (default 2mm)
 * @returns {Array<Array<{x: number, y: number}>>} Array of closed/open polylines
 */
export function pathToPolylines(d, tolerance = 2) {
  if (!d) return [];

  const polylines = [];
  let currentPolyline = [];
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;

  // Parse path commands
  const commands = parsePath(d);

  for (const cmd of commands) {
    const type = cmd.type;
    const args = cmd.args;

    switch (type) {
      case 'M': // Move to (absolute)
        if (currentPolyline.length > 0) {
          polylines.push(currentPolyline);
        }
        currentX = args[0];
        currentY = args[1];
        startX = currentX;
        startY = currentY;
        currentPolyline = [{ x: currentX, y: currentY }];
        break;

      case 'm': // Move to (relative)
        if (currentPolyline.length > 0) {
          polylines.push(currentPolyline);
        }
        currentX += args[0];
        currentY += args[1];
        startX = currentX;
        startY = currentY;
        currentPolyline = [{ x: currentX, y: currentY }];
        break;

      case 'L': // Line to (absolute)
        currentX = args[0];
        currentY = args[1];
        currentPolyline.push({ x: currentX, y: currentY });
        break;

      case 'l': // Line to (relative)
        currentX += args[0];
        currentY += args[1];
        currentPolyline.push({ x: currentX, y: currentY });
        break;

      case 'H': // Horizontal line (absolute)
        currentX = args[0];
        currentPolyline.push({ x: currentX, y: currentY });
        break;

      case 'h': // Horizontal line (relative)
        currentX += args[0];
        currentPolyline.push({ x: currentX, y: currentY });
        break;

      case 'V': // Vertical line (absolute)
        currentY = args[0];
        currentPolyline.push({ x: currentX, y: currentY });
        break;

      case 'v': // Vertical line (relative)
        currentY += args[0];
        currentPolyline.push({ x: currentX, y: currentY });
        break;

      case 'C': // Cubic bezier (absolute)
        {
          const points = flattenCubicBezier(
            currentX, currentY,
            args[0], args[1],
            args[2], args[3],
            args[4], args[5],
            tolerance
          );
          currentPolyline.push(...points.slice(1));
          currentX = args[4];
          currentY = args[5];
        }
        break;

      case 'c': // Cubic bezier (relative)
        {
          const points = flattenCubicBezier(
            currentX, currentY,
            currentX + args[0], currentY + args[1],
            currentX + args[2], currentY + args[3],
            currentX + args[4], currentY + args[5],
            tolerance
          );
          currentPolyline.push(...points.slice(1));
          currentX += args[4];
          currentY += args[5];
        }
        break;

      case 'Q': // Quadratic bezier (absolute)
        {
          const points = flattenQuadraticBezier(
            currentX, currentY,
            args[0], args[1],
            args[2], args[3],
            tolerance
          );
          currentPolyline.push(...points.slice(1));
          currentX = args[2];
          currentY = args[3];
        }
        break;

      case 'q': // Quadratic bezier (relative)
        {
          const points = flattenQuadraticBezier(
            currentX, currentY,
            currentX + args[0], currentY + args[1],
            currentX + args[2], currentY + args[3],
            tolerance
          );
          currentPolyline.push(...points.slice(1));
          currentX += args[2];
          currentY += args[3];
        }
        break;

      case 'A': // Arc (absolute)
        {
          const points = flattenArc(
            currentX, currentY,
            args[0], args[1], // rx, ry
            args[2],          // x-axis-rotation
            args[3], args[4], // large-arc-flag, sweep-flag
            args[5], args[6], // x, y
            tolerance
          );
          currentPolyline.push(...points.slice(1));
          currentX = args[5];
          currentY = args[6];
        }
        break;

      case 'a': // Arc (relative)
        {
          const endX = currentX + args[5];
          const endY = currentY + args[6];
          const points = flattenArc(
            currentX, currentY,
            args[0], args[1],
            args[2],
            args[3], args[4],
            endX, endY,
            tolerance
          );
          currentPolyline.push(...points.slice(1));
          currentX = endX;
          currentY = endY;
        }
        break;

      case 'Z':
      case 'z': // Close path
        if (currentPolyline.length > 0) {
          // Close the path by returning to start
          currentPolyline.push({ x: startX, y: startY });
          currentX = startX;
          currentY = startY;
        }
        break;
    }
  }

  // Add final polyline
  if (currentPolyline.length > 0) {
    polylines.push(currentPolyline);
  }

  return polylines;
}

/**
 * Parse SVG path d attribute into array of commands
 */
function parsePath(d) {
  const commands = [];
  const regex = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;

  // Use matchAll instead of regex.exec loop
  const matches = [...d.matchAll(regex)];

  for (const match of matches) {
    const type = match[1];
    const argsStr = match[2].trim();
    const args = argsStr
      .split(/[\s,]+/)
      .filter(s => s.length > 0)
      .map(Number);

    commands.push({ type, args });
  }

  return commands;
}

/**
 * Flatten cubic bezier curve to polyline points using adaptive subdivision
 */
function flattenCubicBezier(x0, y0, x1, y1, x2, y2, x3, y3, tolerance) {
  const points = [{ x: x0, y: y0 }];
  subdivideCubic(x0, y0, x1, y1, x2, y2, x3, y3, tolerance, points);
  points.push({ x: x3, y: y3 });
  return points;
}

function subdivideCubic(x0, y0, x1, y1, x2, y2, x3, y3, tolerance, points) {
  // Check if curve is flat enough
  const dx = x3 - x0;
  const dy = y3 - y0;
  const d = Math.sqrt(dx * dx + dy * dy);

  if (d < 0.001) return;

  // Distance from control points to line
  const d1 = pointToLineDistance(x1, y1, x0, y0, x3, y3);
  const d2 = pointToLineDistance(x2, y2, x0, y0, x3, y3);

  if (d1 < tolerance && d2 < tolerance) {
    return; // Flat enough
  }

  // Subdivide at t=0.5
  const x01 = (x0 + x1) / 2;
  const y01 = (y0 + y1) / 2;
  const x12 = (x1 + x2) / 2;
  const y12 = (y1 + y2) / 2;
  const x23 = (x2 + x3) / 2;
  const y23 = (y2 + y3) / 2;
  const x012 = (x01 + x12) / 2;
  const y012 = (y01 + y12) / 2;
  const x123 = (x12 + x23) / 2;
  const y123 = (y12 + y23) / 2;
  const x0123 = (x012 + x123) / 2;
  const y0123 = (y012 + y123) / 2;

  subdivideCubic(x0, y0, x01, y01, x012, y012, x0123, y0123, tolerance, points);
  points.push({ x: x0123, y: y0123 });
  subdivideCubic(x0123, y0123, x123, y123, x23, y23, x3, y3, tolerance, points);
}

/**
 * Flatten quadratic bezier curve to polyline points
 */
function flattenQuadraticBezier(x0, y0, x1, y1, x2, y2, tolerance) {
  // Convert quadratic to cubic
  const cx1 = x0 + (2 / 3) * (x1 - x0);
  const cy1 = y0 + (2 / 3) * (y1 - y0);
  const cx2 = x2 + (2 / 3) * (x1 - x2);
  const cy2 = y2 + (2 / 3) * (y1 - y2);

  return flattenCubicBezier(x0, y0, cx1, cy1, cx2, cy2, x2, y2, tolerance);
}

/**
 * Flatten SVG arc to polyline points
 */
function flattenArc(x1, y1, rx, ry, angle, largeArc, sweep, x2, y2, tolerance) {
  // Handle degenerate cases
  if (rx === 0 || ry === 0) {
    return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  }

  // Convert to center parameterization
  const params = arcToCenter(x1, y1, rx, ry, angle, largeArc, sweep, x2, y2);
  if (!params) {
    return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  }

  const { cx, cy, theta1, dtheta, rx: adjustedRx, ry: adjustedRy } = params;
  const angleRad = (angle * Math.PI) / 180;

  // Calculate number of segments based on arc length and tolerance
  const avgRadius = (adjustedRx + adjustedRy) / 2;
  const arcLength = Math.abs(dtheta) * avgRadius;
  const numSegments = Math.max(4, Math.ceil(arcLength / (2 * Math.sqrt(2 * tolerance * avgRadius))));

  const points = [];
  for (let i = 0; i <= numSegments; i++) {
    const t = theta1 + (dtheta * i) / numSegments;
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);
    const cosAngle = Math.cos(angleRad);
    const sinAngle = Math.sin(angleRad);

    const x = cx + adjustedRx * cosT * cosAngle - adjustedRy * sinT * sinAngle;
    const y = cy + adjustedRx * cosT * sinAngle + adjustedRy * sinT * cosAngle;
    points.push({ x, y });
  }

  return points;
}

/**
 * Convert SVG arc endpoint parameterization to center parameterization
 */
function arcToCenter(x1, y1, rx, ry, angle, largeArc, sweep, x2, y2) {
  const phi = (angle * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  // Step 1: Compute (x1', y1')
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cosPhi * dx + sinPhi * dy;
  const y1p = -sinPhi * dx + cosPhi * dy;

  // Ensure radii are positive
  rx = Math.abs(rx);
  ry = Math.abs(ry);

  // Adjust radii if necessary
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    const sqrtLambda = Math.sqrt(lambda);
    rx *= sqrtLambda;
    ry *= sqrtLambda;
  }

  // Step 2: Compute (cx', cy')
  const rx2 = rx * rx;
  const ry2 = ry * ry;
  const x1p2 = x1p * x1p;
  const y1p2 = y1p * y1p;

  let sq = (rx2 * ry2 - rx2 * y1p2 - ry2 * x1p2) / (rx2 * y1p2 + ry2 * x1p2);
  if (sq < 0) sq = 0;
  const coef = (largeArc !== sweep ? 1 : -1) * Math.sqrt(sq);
  const cxp = coef * (rx * y1p) / ry;
  const cyp = coef * -(ry * x1p) / rx;

  // Step 3: Compute (cx, cy) from (cx', cy')
  const cx = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2;
  const cy = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2;

  // Step 4: Compute theta1 and dtheta
  const ux = (x1p - cxp) / rx;
  const uy = (y1p - cyp) / ry;
  const vx = (-x1p - cxp) / rx;
  const vy = (-y1p - cyp) / ry;

  const n = Math.sqrt(ux * ux + uy * uy);
  const theta1 = (uy >= 0 ? 1 : -1) * Math.acos(ux / n);

  const dot = ux * vx + uy * vy;
  const cross = ux * vy - uy * vx;
  let dtheta = Math.acos(Math.max(-1, Math.min(1, dot / (n * Math.sqrt(vx * vx + vy * vy)))));
  if (cross < 0) dtheta = -dtheta;

  if (!sweep && dtheta > 0) dtheta -= 2 * Math.PI;
  if (sweep && dtheta < 0) dtheta += 2 * Math.PI;

  return { cx, cy, theta1, dtheta, rx, ry };
}

/**
 * Distance from point to line
 */
function pointToLineDistance(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
  return Math.abs((dy * px - dx * py + x2 * y1 - y2 * x1) / d);
}

/**
 * Convert SVG rect to polyline vertices
 */
export function rectToPolyline(x, y, width, height, rx = 0, ry = 0) {
  x = parseFloat(x) || 0;
  y = parseFloat(y) || 0;
  width = parseFloat(width) || 0;
  height = parseFloat(height) || 0;
  rx = parseFloat(rx) || 0;
  ry = parseFloat(ry) || rx;

  if (rx === 0 && ry === 0) {
    // Simple rectangle
    return [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
      { x, y } // Close
    ];
  }

  // Rectangle with rounded corners
  // Clamp radii
  rx = Math.min(rx, width / 2);
  ry = Math.min(ry, height / 2);

  const points = [];
  const segments = 8; // Segments per corner arc

  // Top-right corner
  for (let i = 0; i <= segments; i++) {
    const angle = -Math.PI / 2 + (Math.PI / 2) * (i / segments);
    points.push({
      x: x + width - rx + rx * Math.cos(angle),
      y: y + ry + ry * Math.sin(angle)
    });
  }

  // Bottom-right corner
  for (let i = 0; i <= segments; i++) {
    const angle = 0 + (Math.PI / 2) * (i / segments);
    points.push({
      x: x + width - rx + rx * Math.cos(angle),
      y: y + height - ry + ry * Math.sin(angle)
    });
  }

  // Bottom-left corner
  for (let i = 0; i <= segments; i++) {
    const angle = Math.PI / 2 + (Math.PI / 2) * (i / segments);
    points.push({
      x: x + rx + rx * Math.cos(angle),
      y: y + height - ry + ry * Math.sin(angle)
    });
  }

  // Top-left corner
  for (let i = 0; i <= segments; i++) {
    const angle = Math.PI + (Math.PI / 2) * (i / segments);
    points.push({
      x: x + rx + rx * Math.cos(angle),
      y: y + ry + ry * Math.sin(angle)
    });
  }

  // Close the path
  points.push(points[0]);

  return points;
}

/**
 * Convert SVG circle to polyline vertices
 */
export function circleToPolyline(cx, cy, r, segments = 32) {
  cx = parseFloat(cx) || 0;
  cy = parseFloat(cy) || 0;
  r = parseFloat(r) || 0;

  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (2 * Math.PI * i) / segments;
    points.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    });
  }
  return points;
}

/**
 * Convert SVG ellipse to polyline vertices
 */
export function ellipseToPolyline(cx, cy, rx, ry, segments = 32) {
  cx = parseFloat(cx) || 0;
  cy = parseFloat(cy) || 0;
  rx = parseFloat(rx) || 0;
  ry = parseFloat(ry) || 0;

  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (2 * Math.PI * i) / segments;
    points.push({
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle)
    });
  }
  return points;
}

/**
 * Convert SVG polygon points to polyline vertices
 */
export function polygonToPolyline(pointsStr) {
  if (!pointsStr) return [];

  const coords = pointsStr.trim().split(/[\s,]+/).map(Number);
  const points = [];

  for (let i = 0; i < coords.length; i += 2) {
    if (i + 1 < coords.length) {
      points.push({ x: coords[i], y: coords[i + 1] });
    }
  }

  // Close polygon
  if (points.length > 0) {
    points.push({ x: points[0].x, y: points[0].y });
  }

  return points;
}

/**
 * Convert SVG polyline points to vertices (not closed)
 */
export function polylineToVertices(pointsStr) {
  if (!pointsStr) return [];

  const coords = pointsStr.trim().split(/[\s,]+/).map(Number);
  const points = [];

  for (let i = 0; i < coords.length; i += 2) {
    if (i + 1 < coords.length) {
      points.push({ x: coords[i], y: coords[i + 1] });
    }
  }

  return points;
}

/**
 * Convert SVG line to vertices
 */
export function lineToVertices(x1, y1, x2, y2) {
  return [
    { x: parseFloat(x1) || 0, y: parseFloat(y1) || 0 },
    { x: parseFloat(x2) || 0, y: parseFloat(y2) || 0 }
  ];
}

/**
 * Transform vertices using SVG transform string
 */
export function transformVertices(vertices, transformStr) {
  if (!transformStr || !vertices.length) return vertices;

  const matrix = parseTransform(transformStr);
  return vertices.map(v => applyMatrix(v, matrix));
}

/**
 * Parse SVG transform string to matrix
 */
function parseTransform(transformStr) {
  let matrix = [1, 0, 0, 1, 0, 0]; // Identity matrix [a, b, c, d, e, f]

  const transforms = transformStr.match(/\w+\([^)]+\)/g) || [];

  for (const transform of transforms) {
    const match = transform.match(/(\w+)\(([^)]+)\)/);
    if (!match) continue;

    const type = match[1];
    const args = match[2].split(/[\s,]+/).map(Number);

    let m;
    switch (type) {
      case 'translate':
        m = [1, 0, 0, 1, args[0] || 0, args[1] || 0];
        break;
      case 'scale':
        m = [args[0] || 1, 0, 0, args[1] ?? args[0] ?? 1, 0, 0];
        break;
      case 'rotate':
        const rad = (args[0] || 0) * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        if (args.length === 3) {
          // Rotate around point
          const cx = args[1];
          const cy = args[2];
          m = [cos, sin, -sin, cos, cx - cos * cx + sin * cy, cy - sin * cx - cos * cy];
        } else {
          m = [cos, sin, -sin, cos, 0, 0];
        }
        break;
      case 'matrix':
        m = args.slice(0, 6);
        while (m.length < 6) m.push(0);
        break;
      default:
        continue;
    }

    matrix = multiplyMatrices(matrix, m);
  }

  return matrix;
}

function multiplyMatrices(m1, m2) {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
  ];
}

function applyMatrix(point, matrix) {
  return {
    x: matrix[0] * point.x + matrix[2] * point.y + matrix[4],
    y: matrix[1] * point.x + matrix[3] * point.y + matrix[5]
  };
}
