// Geometry utilities for TPV Studio
// Provides organic shape generation and polygon operations

import polygonClipping from 'polygon-clipping';
import chaikinSmooth from 'chaikin-smooth';

/**
 * Generate a superellipse (rounded rectangle with adjustable roundness)
 * @param {number} a - Semi-major axis (width/2)
 * @param {number} b - Semi-minor axis (height/2)
 * @param {number} n - Exponent (2=ellipse, higher=more rectangular, 2-3.5 range)
 * @param {number} segments - Number of points
 * @param {Object} center - {x, y} center point
 * @returns {Array} Array of {x, y} points
 */
export function superellipse(a, b, n, segments = 64, center = {x: 0, y: 0}) {
  const points = [];

  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * 2 * Math.PI;

    // Superellipse formula: |x/a|^n + |y/b|^n = 1
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);

    const x = Math.sign(cosT) * a * Math.pow(Math.abs(cosT), 2/n);
    const y = Math.sign(sinT) * b * Math.pow(Math.abs(sinT), 2/n);

    points.push({
      x: center.x + x,
      y: center.y + y
    });
  }

  return points;
}

/**
 * Offset a polyline to create a band polygon
 * @param {Array} centerline - Array of {x, y} points
 * @param {number|function} thickness - Constant or function(x,y)->thickness
 * @returns {Object} {outer: points[], inner: points[]}
 */
export function offsetPolyline(centerline, thickness) {
  const thicknessFunc = typeof thickness === 'function'
    ? thickness
    : () => thickness;

  const outer = [];
  const inner = [];

  for (let i = 0; i < centerline.length; i++) {
    const p = centerline[i];
    const halfThickness = thicknessFunc(p.x, p.y) / 2;

    // Calculate normal vector
    let normal;
    if (i === 0) {
      // Use forward difference for first point
      const next = centerline[i + 1];
      const dx = next.x - p.x;
      const dy = next.y - p.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      normal = { x: -dy / len, y: dx / len };
    } else if (i === centerline.length - 1) {
      // Use backward difference for last point
      const prev = centerline[i - 1];
      const dx = p.x - prev.x;
      const dy = p.y - prev.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      normal = { x: -dy / len, y: dx / len };
    } else {
      // Use central difference for middle points
      const prev = centerline[i - 1];
      const next = centerline[i + 1];
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      normal = { x: -dy / len, y: dx / len };
    }

    // Offset points
    outer.push({
      x: p.x + normal.x * halfThickness,
      y: p.y + normal.y * halfThickness
    });

    inner.push({
      x: p.x - normal.x * halfThickness,
      y: p.y - normal.y * halfThickness
    });
  }

  // Close the band: outer + reversed inner
  return [...outer, ...inner.reverse()];
}

/**
 * Smooth a polygon using Chaikin's algorithm
 * @param {Array} points - Array of {x, y} points
 * @param {number} iterations - Number of smoothing passes (default 1)
 * @returns {Array} Smoothed points
 */
export function smoothPolygon(points, iterations = 1) {
  // Convert to [x,y] pairs for chaikin-smooth
  const coords = points.map(p => [p.x, p.y]);

  let smoothed = coords;
  for (let i = 0; i < iterations; i++) {
    smoothed = chaikinSmooth(smoothed);
  }

  // Convert back to {x, y} objects
  return smoothed.map(([x, y]) => ({x, y}));
}

/**
 * Union multiple polygons (for metaball effect)
 * @param {Array} polygons - Array of polygons, each is array of {x, y} points
 * @returns {Array} Array of merged polygons
 */
export function unionPolygons(polygons) {
  if (polygons.length === 0) return [];
  if (polygons.length === 1) return polygons;

  // Convert to polygon-clipping format: [[[x,y], [x,y], ...]]
  const polys = polygons.map(poly =>
    [poly.map(p => [p.x, p.y])]
  );

  // Union all polygons
  let result = polys[0];
  for (let i = 1; i < polys.length; i++) {
    result = polygonClipping.union(result, polys[i]);
  }

  // Convert back to {x, y} format
  return result.map(ring =>
    ring[0].map(([x, y]) => ({x, y}))
  );
}

/**
 * Calculate polygon area using shoelace formula
 * @param {Array} points - Array of {x, y} points
 * @returns {number} Area in square units
 */
export function polygonArea(points) {
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
 * Calculate polygon perimeter
 * @param {Array} points - Array of {x, y} points
 * @returns {number} Perimeter in linear units
 */
export function polygonPerimeter(points) {
  let perimeter = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const dx = points[j].x - points[i].x;
    const dy = points[j].y - points[i].y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }

  return perimeter;
}

/**
 * Calculate polygon centroid
 * @param {Array} points - Array of {x, y} points
 * @returns {Object} {x, y} centroid
 */
export function polygonCentroid(points) {
  let cx = 0, cy = 0;
  let signedArea = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const cross = points[i].x * points[j].y - points[j].x * points[i].y;
    cx += (points[i].x + points[j].x) * cross;
    cy += (points[i].y + points[j].y) * cross;
    signedArea += cross;
  }

  signedArea *= 0.5;
  cx /= (6 * signedArea);
  cy /= (6 * signedArea);

  return { x: cx, y: cy };
}

/**
 * Check if point is inside polygon
 * @param {Object} point - {x, y}
 * @param {Array} polygon - Array of {x, y} points
 * @returns {boolean}
 */
export function pointInPolygon(point, polygon) {
  let inside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > point.y) !== (yj > point.y))
      && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Expand polygon by offset distance (simple implementation)
 * @param {Array} points - Array of {x, y} points
 * @param {number} offset - Offset distance (positive = expand, negative = shrink)
 * @returns {Array} Expanded polygon points
 */
export function expandPolygon(points, offset) {
  const centroid = polygonCentroid(points);

  return points.map(p => {
    const dx = p.x - centroid.x;
    const dy = p.y - centroid.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0) return p;

    const nx = dx / dist;
    const ny = dy / dist;

    return {
      x: p.x + nx * offset,
      y: p.y + ny * offset
    };
  });
}

/**
 * Create a rectangle polygon
 * @param {number} x - Left coordinate
 * @param {number} y - Top coordinate
 * @param {number} width
 * @param {number} height
 * @returns {Array} Rectangle as polygon points
 */
export function rectangle(x, y, width, height) {
  return [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height }
  ];
}

/**
 * Create a circle polygon
 * @param {number} cx - Center x
 * @param {number} cy - Center y
 * @param {number} radius
 * @param {number} segments - Number of sides (default 32)
 * @returns {Array} Circle as polygon points
 */
export function circle(cx, cy, radius, segments = 32) {
  const points = [];

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    });
  }

  return points;
}
