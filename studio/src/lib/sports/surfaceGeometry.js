// TPV Studio - Surface Geometry Utilities
// Calculation utilities for surface area, exclusion zones, and custom boundaries

import { generatePolygonPath } from './shapeGeometry.js';

/**
 * Calculate the area of a polygon using the Shoelace formula
 * @param {Array<{x: number, y: number}>} points - Array of polygon vertices
 * @returns {number} Area in square units
 */
export function calculatePolygonArea(points) {
  if (!points || points.length < 3) return 0;

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
 * Calculate the area of a regular polygon given its dimensions
 * @param {number} sides - Number of sides (32+ approximates a circle)
 * @param {number} width_mm - Width in mm
 * @param {number} height_mm - Height in mm
 * @returns {number} Area in mm²
 */
export function calculateRegularPolygonArea(sides, width_mm, height_mm) {
  if (sides >= 32) {
    // Circle approximation: use ellipse formula
    const rx = width_mm / 2;
    const ry = height_mm / 2;
    return Math.PI * rx * ry;
  }

  if (sides === 4) {
    // Rectangle
    return width_mm * height_mm;
  }

  if (sides === 3) {
    // Triangle (isoceles fitted in bounding box)
    return (width_mm * height_mm) / 2;
  }

  // General regular polygon
  // For a regular polygon inscribed in an ellipse
  const rx = width_mm / 2;
  const ry = height_mm / 2;
  const angleStep = (2 * Math.PI) / sides;

  // Generate points and calculate area
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = angleStep * i - Math.PI / 2;
    points.push({
      x: rx + rx * Math.cos(angle),
      y: ry + ry * Math.sin(angle)
    });
  }

  return calculatePolygonArea(points);
}

/**
 * Calculate the area of an exclusion zone based on its shape type
 * @param {Object} zone - Exclusion zone object from store
 * @returns {number} Area in mm²
 */
export function calculateExclusionZoneArea(zone) {
  if (!zone || zone.visible === false) return 0;

  const { shapeType, sides, width_mm, height_mm, controlPoints } = zone;

  if (shapeType === 'path' && controlPoints && controlPoints.length >= 3) {
    // Path-based shape: convert normalized points to absolute and calculate
    const absolutePoints = controlPoints.map(pt => ({
      x: pt.x * width_mm,
      y: pt.y * height_mm
    }));
    return calculatePolygonArea(absolutePoints);
  }

  // Regular polygon
  return calculateRegularPolygonArea(sides || 4, width_mm, height_mm);
}

/**
 * Calculate the total area of all visible exclusion zones
 * @param {Object} exclusionZones - Exclusion zones map from store
 * @returns {number} Total exclusion area in mm²
 */
export function calculateTotalExclusionArea(exclusionZones) {
  if (!exclusionZones) return 0;

  return Object.values(exclusionZones).reduce((total, zone) => {
    return total + calculateExclusionZoneArea(zone);
  }, 0);
}

/**
 * Calculate the effective surface area (total surface minus exclusions)
 * @param {Object} surface - Surface object from store
 * @param {Object} exclusionZones - Exclusion zones map from store
 * @returns {Object} { totalArea_mm2, exclusionArea_mm2, effectiveArea_mm2 }
 */
export function calculateEffectiveSurfaceArea(surface, exclusionZones) {
  const totalArea_mm2 = surface.width_mm * surface.length_mm;
  const exclusionArea_mm2 = calculateTotalExclusionArea(exclusionZones);
  const effectiveArea_mm2 = Math.max(0, totalArea_mm2 - exclusionArea_mm2);

  return {
    totalArea_mm2,
    exclusionArea_mm2,
    effectiveArea_mm2
  };
}

/**
 * Check if a point is inside an exclusion zone
 * Uses ray casting algorithm for polygon containment
 * @param {number} x - X coordinate in mm
 * @param {number} y - Y coordinate in mm
 * @param {Object} zone - Exclusion zone object
 * @returns {boolean} True if point is inside the zone
 */
export function isPointInExclusionZone(x, y, zone) {
  if (!zone || zone.visible === false) return false;

  const { position, width_mm, height_mm, rotation } = zone;

  // Transform point to zone's local coordinate system
  const cx = position.x + width_mm / 2;
  const cy = position.y + height_mm / 2;
  const rad = (rotation || 0) * Math.PI / 180;

  // Translate point to origin at zone center, then rotate
  const dx = x - cx;
  const dy = y - cy;
  const localX = dx * Math.cos(-rad) - dy * Math.sin(-rad) + width_mm / 2;
  const localY = dx * Math.sin(-rad) + dy * Math.cos(-rad) + height_mm / 2;

  // Check if point is within the zone bounds (simplified for rectangular zones)
  // For more complex shapes, use ray casting with the actual polygon points
  if (zone.shapeType === 'polygon' && zone.sides === 4) {
    return localX >= 0 && localX <= width_mm && localY >= 0 && localY <= height_mm;
  }

  if (zone.sides >= 32) {
    // Circle: check distance from center
    const rx = width_mm / 2;
    const ry = height_mm / 2;
    const normalizedDist = Math.pow((localX - rx) / rx, 2) + Math.pow((localY - ry) / ry, 2);
    return normalizedDist <= 1;
  }

  // For other polygons, use ray casting
  const sides = zone.sides || 4;
  const points = [];
  const angleStep = (2 * Math.PI) / sides;

  for (let i = 0; i < sides; i++) {
    const angle = angleStep * i - Math.PI / 2;
    points.push({
      x: width_mm / 2 + (width_mm / 2) * Math.cos(angle),
      y: height_mm / 2 + (height_mm / 2) * Math.sin(angle)
    });
  }

  return isPointInPolygon(localX, localY, points);
}

/**
 * Ray casting algorithm for polygon containment
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {Array<{x: number, y: number}>} polygon - Array of polygon vertices
 * @returns {boolean} True if point is inside polygon
 */
function isPointInPolygon(x, y, polygon) {
  let inside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Check if a point is inside any visible exclusion zone
 * @param {number} x - X coordinate in mm
 * @param {number} y - Y coordinate in mm
 * @param {Object} exclusionZones - Exclusion zones map from store
 * @returns {boolean} True if point is inside any exclusion zone
 */
export function isPointInAnyExclusionZone(x, y, exclusionZones) {
  if (!exclusionZones) return false;

  for (const zone of Object.values(exclusionZones)) {
    if (isPointInExclusionZone(x, y, zone)) {
      return true;
    }
  }

  return false;
}

/**
 * Generate SVG path for surface boundary
 * @param {Object} boundary - Boundary object from surface state
 * @param {number} width_mm - Surface width in mm
 * @param {number} length_mm - Surface length in mm
 * @returns {string|null} SVG path d attribute, or null if no custom boundary
 */
export function generateSurfaceBoundaryPath(boundary, width_mm, length_mm) {
  if (!boundary || boundary.type === 'rectangle' || !boundary.controlPoints) {
    return null;
  }

  const points = boundary.controlPoints;
  if (!points || points.length < 3) return null;

  // Convert normalized coordinates (0-1) to absolute coordinates
  const absPoints = points.map(pt => ({
    x: pt.x * width_mm,
    y: pt.y * length_mm
  }));

  // Generate SVG path
  let d = `M ${absPoints[0].x} ${absPoints[0].y}`;
  for (let i = 1; i < absPoints.length; i++) {
    d += ` L ${absPoints[i].x} ${absPoints[i].y}`;
  }
  d += ' Z';

  return d;
}

/**
 * Calculate the area of a custom surface boundary
 * @param {Object} boundary - Boundary object from surface state
 * @param {number} width_mm - Surface width in mm
 * @param {number} length_mm - Surface length in mm
 * @returns {number} Area in mm²
 */
export function calculateBoundaryArea(boundary, width_mm, length_mm) {
  if (!boundary || boundary.type === 'rectangle' || !boundary.controlPoints) {
    // Full rectangle
    return width_mm * length_mm;
  }

  const points = boundary.controlPoints;
  if (!points || points.length < 3) {
    return width_mm * length_mm;
  }

  // Convert normalized coordinates to absolute
  const absPoints = points.map(pt => ({
    x: pt.x * width_mm,
    y: pt.y * length_mm
  }));

  return calculatePolygonArea(absPoints);
}

/**
 * Generate SVG path for exclusion zone visualization
 * @param {Object} zone - Exclusion zone object
 * @returns {string} SVG path d attribute
 */
export function generateExclusionZonePath(zone) {
  const { shapeType, sides, width_mm, height_mm, controlPoints, cornerRadius } = zone;

  if (shapeType === 'path' && controlPoints && controlPoints.length >= 3) {
    // Convert normalized points to SVG path
    const absPoints = controlPoints.map(pt => ({
      x: pt.x * width_mm,
      y: pt.y * height_mm
    }));

    let d = `M ${absPoints[0].x} ${absPoints[0].y}`;
    for (let i = 1; i < absPoints.length; i++) {
      d += ` L ${absPoints[i].x} ${absPoints[i].y}`;
    }
    d += ' Z';
    return d;
  }

  // Use the standard polygon path generator
  return generatePolygonPath(sides || 4, width_mm, height_mm, cornerRadius || 0);
}
