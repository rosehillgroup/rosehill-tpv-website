// TPV Studio - Geometry Utilities for Court Manipulation

/**
 * Snap a value to grid
 */
export function snapToGrid(value, gridSize) {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snap a position (x, y) to grid
 */
export function snapPositionToGrid(position, gridSize) {
  return {
    x: snapToGrid(position.x, gridSize),
    y: snapToGrid(position.y, gridSize)
  };
}

/**
 * Calculate bounding box for a court
 */
export function calculateCourtBounds(court) {
  const { template, position, rotation, scale } = court;
  const width = template.dimensions.width_mm * scale;
  const height = template.dimensions.length_mm * scale;

  // For now, simplified bounding box (no rotation)
  // TODO: Implement rotated bounding box
  return {
    x: position.x,
    y: position.y,
    width,
    height,
    centerX: position.x + width / 2,
    centerY: position.y + height / 2
  };
}

/**
 * Check if a point is inside a court's bounding box
 */
export function isPointInCourt(point, court) {
  const bounds = calculateCourtBounds(court);

  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  );
}

/**
 * Check if two courts overlap (simple bounding box check)
 */
export function courtsOverlap(court1, court2) {
  const bounds1 = calculateCourtBounds(court1);
  const bounds2 = calculateCourtBounds(court2);

  return !(
    bounds1.x + bounds1.width < bounds2.x ||
    bounds2.x + bounds2.width < bounds1.x ||
    bounds1.y + bounds1.height < bounds2.y ||
    bounds2.y + bounds2.height < bounds1.y
  );
}

/**
 * Calculate distance between two points
 */
export function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Rotate a point around a center point
 */
export function rotatePoint(point, center, angleDegrees) {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(angleRadians);
  const sin = Math.sin(angleRadians);

  // Translate point to origin
  const translatedX = point.x - center.x;
  const translatedY = point.y - center.y;

  // Rotate
  const rotatedX = translatedX * cos - translatedY * sin;
  const rotatedY = translatedX * sin + translatedY * cos;

  // Translate back
  return {
    x: rotatedX + center.x,
    y: rotatedY + center.y
  };
}

/**
 * Calculate rotation angle from two points relative to center
 */
export function calculateRotationAngle(center, point) {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

/**
 * Normalize angle to 0-360 range
 */
export function normalizeAngle(angle) {
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

/**
 * Snap angle to common increments (0°, 45°, 90°, etc.)
 */
export function snapAngle(angle, snapIncrement = 45) {
  return Math.round(angle / snapIncrement) * snapIncrement;
}

/**
 * Calculate new scale from a drag operation
 */
export function calculateScaleFromDrag(originalBounds, newBounds, maintainAspectRatio = true) {
  if (maintainAspectRatio) {
    // Use the average scale from both dimensions
    const scaleX = newBounds.width / originalBounds.width;
    const scaleY = newBounds.height / originalBounds.height;
    return (scaleX + scaleY) / 2;
  } else {
    return {
      scaleX: newBounds.width / originalBounds.width,
      scaleY: newBounds.height / originalBounds.height
    };
  }
}

/**
 * Constrain court position within surface bounds
 */
export function constrainPosition(position, courtDimensions, surfaceDimensions) {
  const { width_mm, length_mm } = courtDimensions;
  const { width_mm: surfaceWidth, length_mm: surfaceLength } = surfaceDimensions;

  return {
    x: Math.max(0, Math.min(position.x, surfaceWidth - width_mm)),
    y: Math.max(0, Math.min(position.y, surfaceLength - length_mm))
  };
}

/**
 * Calculate transform string for SVG
 */
export function getCourtTransformString(court) {
  const { position, rotation, scale, template } = court;
  const centerX = template.dimensions.width_mm / 2;
  const centerY = template.dimensions.length_mm / 2;

  // Transform order: translate to position, rotate around center, scale
  return `translate(${position.x}, ${position.y}) rotate(${rotation}, ${centerX}, ${centerY}) scale(${scale})`;
}

/**
 * Calculate the corners of a court (considering rotation)
 */
export function getCourtCorners(court) {
  const { template, position, rotation, scale } = court;
  const width = template.dimensions.width_mm * scale;
  const height = template.dimensions.length_mm * scale;

  const center = {
    x: position.x + width / 2,
    y: position.y + height / 2
  };

  const corners = [
    { x: position.x, y: position.y }, // Top-left
    { x: position.x + width, y: position.y }, // Top-right
    { x: position.x + width, y: position.y + height }, // Bottom-right
    { x: position.x, y: position.y + height } // Bottom-left
  ];

  // Rotate corners if needed
  if (rotation !== 0) {
    return corners.map(corner => rotatePoint(corner, center, rotation));
  }

  return corners;
}

/**
 * Calculate center point of a court
 */
export function getCourtCenter(court) {
  const { template, position, scale } = court;
  const width = template.dimensions.width_mm * scale;
  const height = template.dimensions.length_mm * scale;

  return {
    x: position.x + width / 2,
    y: position.y + height / 2
  };
}

/**
 * Align courts horizontally (left, center, right)
 */
export function alignCourtsHorizontal(courts, alignment = 'center') {
  if (courts.length < 2) return courts;

  const bounds = courts.map(court => calculateCourtBounds(court));

  let targetX;
  if (alignment === 'left') {
    targetX = Math.min(...bounds.map(b => b.x));
  } else if (alignment === 'right') {
    targetX = Math.max(...bounds.map(b => b.x + b.width));
  } else {
    // center
    const leftmost = Math.min(...bounds.map(b => b.x));
    const rightmost = Math.max(...bounds.map(b => b.x + b.width));
    targetX = (leftmost + rightmost) / 2;
  }

  return courts.map((court, i) => {
    const bound = bounds[i];
    let newX;

    if (alignment === 'left') {
      newX = targetX;
    } else if (alignment === 'right') {
      newX = targetX - bound.width;
    } else {
      newX = targetX - bound.width / 2;
    }

    return {
      ...court,
      position: { ...court.position, x: newX }
    };
  });
}

/**
 * Align courts vertically (top, middle, bottom)
 */
export function alignCourtsVertical(courts, alignment = 'middle') {
  if (courts.length < 2) return courts;

  const bounds = courts.map(court => calculateCourtBounds(court));

  let targetY;
  if (alignment === 'top') {
    targetY = Math.min(...bounds.map(b => b.y));
  } else if (alignment === 'bottom') {
    targetY = Math.max(...bounds.map(b => b.y + b.height));
  } else {
    // middle
    const topmost = Math.min(...bounds.map(b => b.y));
    const bottommost = Math.max(...bounds.map(b => b.y + b.height));
    targetY = (topmost + bottommost) / 2;
  }

  return courts.map((court, i) => {
    const bound = bounds[i];
    let newY;

    if (alignment === 'top') {
      newY = targetY;
    } else if (alignment === 'bottom') {
      newY = targetY - bound.height;
    } else {
      newY = targetY - bound.height / 2;
    }

    return {
      ...court,
      position: { ...court.position, y: newY }
    };
  });
}

/**
 * Distribute courts evenly with spacing
 */
export function distributeCourtsHorizontal(courts, spacing_mm = 1000) {
  if (courts.length < 2) return courts;

  // Sort courts by x position
  const sorted = [...courts].sort((a, b) => a.position.x - b.position.x);
  const bounds = sorted.map(court => calculateCourtBounds(court));

  // Calculate total width needed
  const totalWidth = bounds.reduce((sum, b) => sum + b.width, 0);
  const totalSpacing = spacing_mm * (courts.length - 1);

  let currentX = bounds[0].x;

  return sorted.map((court, i) => {
    const newPosition = { ...court.position, x: currentX };
    currentX += bounds[i].width + spacing_mm;

    return {
      ...court,
      position: newPosition
    };
  });
}

/**
 * Check if court fits within surface with safety clearance
 */
export function checkCourtFitsInSurface(court, surface, requireClearance = true) {
  const { template, position, scale } = court;
  const width = template.dimensions.width_mm * scale;
  const height = template.dimensions.length_mm * scale;
  const clearance = requireClearance ? (template.dimensions.min_surround_mm || 0) : 0;

  return {
    fitsX: position.x >= clearance && position.x + width <= surface.width_mm - clearance,
    fitsY: position.y >= clearance && position.y + height <= surface.length_mm - clearance,
    clearanceX: Math.min(position.x, surface.width_mm - (position.x + width)),
    clearanceY: Math.min(position.y, surface.length_mm - (position.y + height))
  };
}

/**
 * Convert mm to metres for display
 */
export function mmToMetres(mm) {
  return (mm / 1000).toFixed(2);
}

/**
 * Convert metres to mm for calculations
 */
export function metresToMm(m) {
  return m * 1000;
}

/**
 * Format dimensions for display (e.g., "28m × 15m")
 */
export function formatDimensions(width_mm, length_mm) {
  return `${mmToMetres(width_mm)}m × ${mmToMetres(length_mm)}m`;
}
