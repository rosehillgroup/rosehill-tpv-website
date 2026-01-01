// TPV Studio - Shape Geometry Utilities
// Functions for generating SVG paths for polygons and shapes

/**
 * Generate SVG path for a regular polygon or star
 * @param {number} sides - Number of sides/points (3=triangle, 4=square, etc.)
 * @param {number} width - Width of bounding box in mm
 * @param {number} height - Height of bounding box in mm
 * @param {number} cornerRadius - Corner smoothing (0-100%)
 * @param {boolean} starMode - If true, generate star shape instead of polygon
 * @param {number} innerRadius - Inner radius ratio for stars (0.1-0.9)
 * @returns {string} SVG path data
 */
export function generatePolygonPath(sides, width, height, cornerRadius = 0, starMode = false, innerRadius = 0.5) {
  // If star mode, use star generator
  if (starMode && sides >= 3) {
    return generateStarPath(sides, width, height, innerRadius, cornerRadius);
  }
  // For high side counts (32+), render as ellipse
  if (sides >= 32) {
    return generateEllipsePath(width, height);
  }

  // Generate polygon vertices
  const points = generatePolygonPoints(sides, width, height);

  // Apply corner rounding if specified
  if (cornerRadius > 0) {
    return generateRoundedPolygonPath(points, cornerRadius, width, height);
  }

  // Generate simple polygon path
  return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
}

/**
 * Generate vertices for a regular polygon that fills the bounding box
 * @param {number} sides - Number of sides
 * @param {number} width - Bounding box width
 * @param {number} height - Bounding box height
 * @returns {Array<{x: number, y: number}>} Array of vertex points
 */
export function generatePolygonPoints(sides, width, height) {
  // For 4-sided shapes (square/rectangle), just return the corners directly
  // This ensures the shape exactly fills the bounding box
  if (sides === 4) {
    return [
      { x: 0, y: 0 },           // top-left
      { x: width, y: 0 },       // top-right
      { x: width, y: height },  // bottom-right
      { x: 0, y: height }       // bottom-left
    ];
  }

  // For other polygons, generate inscribed then scale to fill bounds
  const points = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const angleStep = (2 * Math.PI) / sides;

  // Start from top center (-90 degrees)
  const startAngle = -Math.PI / 2;

  // First, generate unit circle polygon
  for (let i = 0; i < sides; i++) {
    const angle = startAngle + angleStep * i;
    points.push({
      x: Math.cos(angle),
      y: Math.sin(angle)
    });
  }

  // Find the actual bounds of the generated polygon
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  // Calculate scale factors to fit the bounding box exactly
  const polyWidth = maxX - minX;
  const polyHeight = maxY - minY;
  const scaleX = width / polyWidth;
  const scaleY = height / polyHeight;

  // Scale and translate points to fill the bounding box
  return points.map(p => ({
    x: (p.x - minX) * scaleX,
    y: (p.y - minY) * scaleY
  }));
}

/**
 * Generate SVG path for a star shape
 * @param {number} points - Number of points (3=3-point star, 5=5-point star, etc.)
 * @param {number} width - Width of bounding box in mm
 * @param {number} height - Height of bounding box in mm
 * @param {number} innerRadius - Inner radius ratio (0.1-0.9, where 0.5 is classic star)
 * @param {number} cornerRadius - Corner smoothing (0-100%)
 * @returns {string} SVG path data
 */
export function generateStarPath(points, width, height, innerRadius = 0.5, cornerRadius = 0) {
  // Generate star vertices
  const vertices = generateStarPoints(points, width, height, innerRadius);

  // Apply corner rounding if specified
  if (cornerRadius > 0) {
    return generateRoundedPolygonPath(vertices, cornerRadius, width, height);
  }

  // Generate simple star path
  return `M ${vertices.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
}

/**
 * Generate vertices for a star that fills the bounding box
 * Stars have 2*N vertices: N outer points and N inner points alternating
 * @param {number} points - Number of star points
 * @param {number} width - Bounding box width
 * @param {number} height - Bounding box height
 * @param {number} innerRadius - Inner radius as ratio of outer (0.1-0.9)
 * @returns {Array<{x: number, y: number}>} Array of vertex points
 */
export function generateStarPoints(points, width, height, innerRadius = 0.5) {
  const vertices = [];
  const centerX = width / 2;
  const centerY = height / 2;

  // Angle between each vertex (outer and inner alternate)
  const totalVertices = points * 2;
  const angleStep = (2 * Math.PI) / totalVertices;

  // Start from top center (-90 degrees)
  const startAngle = -Math.PI / 2;

  // Clamp inner radius to valid range
  const clampedInnerRadius = Math.max(0.1, Math.min(0.9, innerRadius));

  // Generate vertices on unit circle first
  for (let i = 0; i < totalVertices; i++) {
    const angle = startAngle + angleStep * i;
    // Even indices are outer points, odd are inner points
    const radius = i % 2 === 0 ? 1.0 : clampedInnerRadius;
    vertices.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    });
  }

  // Find the actual bounds of the generated star
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  for (const p of vertices) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  // Calculate scale factors to fit the bounding box exactly
  const starWidth = maxX - minX;
  const starHeight = maxY - minY;
  const scaleX = width / starWidth;
  const scaleY = height / starHeight;

  // Scale and translate points to fill the bounding box
  return vertices.map(p => ({
    x: (p.x - minX) * scaleX,
    y: (p.y - minY) * scaleY
  }));
}

/**
 * Generate SVG path for an ellipse
 * @param {number} width - Ellipse width
 * @param {number} height - Ellipse height
 * @returns {string} SVG path data
 */
export function generateEllipsePath(width, height) {
  const rx = width / 2;
  const ry = height / 2;
  const cx = rx;
  const cy = ry;

  // Use two arc commands to draw a complete ellipse
  return `M ${cx - rx},${cy} ` +
         `A ${rx},${ry} 0 1,1 ${cx + rx},${cy} ` +
         `A ${rx},${ry} 0 1,1 ${cx - rx},${cy} Z`;
}

/**
 * Generate SVG path for a polygon with rounded corners
 * @param {Array<{x: number, y: number}>} points - Polygon vertices
 * @param {number} cornerRadius - Corner smoothing (0-100%)
 * @param {number} width - Bounding box width (for calculating max radius)
 * @param {number} height - Bounding box height (for calculating max radius)
 * @returns {string} SVG path data
 */
export function generateRoundedPolygonPath(points, cornerRadius, width, height) {
  if (points.length < 3) return '';

  // Calculate the maximum corner radius based on shortest edge
  let minEdgeLength = Infinity;
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const edgeLength = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    minEdgeLength = Math.min(minEdgeLength, edgeLength);
  }

  // Convert percentage to actual radius (max is half of shortest edge)
  const maxRadius = minEdgeLength / 2;
  const radius = (cornerRadius / 100) * maxRadius;

  // If radius is too small, return regular polygon
  if (radius < 1) {
    return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
  }

  // Build path with rounded corners
  const pathParts = [];

  for (let i = 0; i < points.length; i++) {
    const prev = points[(i - 1 + points.length) % points.length];
    const curr = points[i];
    const next = points[(i + 1) % points.length];

    // Calculate vectors from current point to adjacent points
    const toPrev = normalize({ x: prev.x - curr.x, y: prev.y - curr.y });
    const toNext = normalize({ x: next.x - curr.x, y: next.y - curr.y });

    // Calculate start and end points of the arc (offset from corner)
    const arcStart = {
      x: curr.x + toPrev.x * radius,
      y: curr.y + toPrev.y * radius
    };
    const arcEnd = {
      x: curr.x + toNext.x * radius,
      y: curr.y + toNext.y * radius
    };

    if (i === 0) {
      pathParts.push(`M ${arcStart.x},${arcStart.y}`);
    } else {
      pathParts.push(`L ${arcStart.x},${arcStart.y}`);
    }

    // Add quadratic curve for rounded corner
    pathParts.push(`Q ${curr.x},${curr.y} ${arcEnd.x},${arcEnd.y}`);
  }

  // Close back to the first arc start
  const firstPrev = points[points.length - 1];
  const firstCurr = points[0];
  const toPrev = normalize({ x: firstPrev.x - firstCurr.x, y: firstPrev.y - firstCurr.y });
  const firstArcStart = {
    x: firstCurr.x + toPrev.x * radius,
    y: firstCurr.y + toPrev.y * radius
  };
  pathParts.push(`L ${firstArcStart.x},${firstArcStart.y}`);
  pathParts.push('Z');

  return pathParts.join(' ');
}

/**
 * Normalize a 2D vector
 * @param {{x: number, y: number}} v - Vector to normalize
 * @returns {{x: number, y: number}} Normalized vector
 */
function normalize(v) {
  const length = Math.sqrt(v.x * v.x + v.y * v.y);
  if (length === 0) return { x: 0, y: 0 };
  return { x: v.x / length, y: v.y / length };
}

/**
 * Get display name for a shape based on sides and star mode
 * @param {number} sides - Number of sides/points
 * @param {boolean} starMode - Whether shape is a star
 * @returns {string} Shape name
 */
export function getShapeDisplayName(sides, starMode = false) {
  if (starMode) {
    if (sides === 5) return 'Star';
    return `${sides}-Point Star`;
  }

  const names = {
    3: 'Triangle',
    4: 'Rectangle',
    5: 'Pentagon',
    6: 'Hexagon',
    7: 'Heptagon',
    8: 'Octagon',
    9: 'Nonagon',
    10: 'Decagon',
    12: 'Dodecagon'
  };

  if (sides >= 32) return 'Circle';
  if (names[sides]) return names[sides];
  return `${sides}-gon`;
}

/**
 * Get icon/symbol for a shape based on sides and star mode
 * @param {number} sides - Number of sides/points
 * @param {boolean} starMode - Whether shape is a star
 * @returns {string} Unicode symbol or text
 */
export function getShapeIcon(sides, starMode = false) {
  if (starMode) return '★';
  if (sides >= 32) return '○';
  if (sides === 3) return '△';
  if (sides === 4) return '□';
  if (sides === 5) return '⬠';
  if (sides === 6) return '⬡';
  return `${sides}`;
}

/**
 * Calculate the bounding box of a shape after rotation
 * @param {number} width - Original width
 * @param {number} height - Original height
 * @param {number} rotation - Rotation in degrees
 * @returns {{width: number, height: number}} Rotated bounding box dimensions
 */
export function getRotatedBounds(width, height, rotation) {
  const radians = (rotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  return {
    width: width * cos + height * sin,
    height: width * sin + height * cos
  };
}
