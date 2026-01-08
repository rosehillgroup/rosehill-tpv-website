/**
 * Recipe-Based Materials Calculator v2
 *
 * Calculates TPV materials from design state using pre-calculated recipes and geometry.
 * No pixel counting - uses geometric areas and stored recipe data for fast, reliable results.
 *
 * Replaces the slow pixel-counting approach that times out on complex designs.
 */

import { MATERIAL_CONFIG } from './unifiedPdfGenerator.js';

/**
 * Line marking area estimates by court type (as percentage of court area)
 */
const LINE_MARKING_PERCENTAGES = {
  tennis: 0.03,
  basketball: 0.04,
  netball: 0.035,
  badminton: 0.025,
  volleyball: 0.02,
  futsal: 0.03,
  hockey: 0.025,
  default: 0.03,
};

/**
 * Calculate all materials from design state using recipes and geometry.
 * Returns aggregated materials by TPV code, ready for the PDF summary.
 *
 * @param {Object} params - Design parameters
 * @param {Object} params.surface - Surface configuration
 * @param {Object} params.courts - Courts object
 * @param {Object} params.tracks - Tracks object
 * @param {Object} params.shapes - Shapes object (polygon, blob, path)
 * @param {Object} params.texts - Texts object
 * @param {Array} params.motifs - Motifs array with recipes
 * @param {Object} params.exclusionZones - Exclusion zones object
 * @param {number} params.totalAreaM2 - Total surface area in m²
 * @returns {Object} { elementMaterials, aggregatedMaterials }
 */
export function calculateMaterialsFromDesign({
  surface,
  courts = {},
  tracks = {},
  shapes = {},
  texts = {},
  motifs = [],
  exclusionZones = {},
  totalAreaM2
}) {
  const { densityKgPerM2, safetyMargin } = MATERIAL_CONFIG;
  const elementMaterials = [];

  // Track used areas and element bounds for overlap detection
  let usedArea = 0;
  const elementBounds = [];

  // 1. Calculate motif materials from recipes (highest layer, calculated first)
  const motifTotalArea = motifs.reduce((sum, m) => sum + (m.areaM2 || 0), 0);
  usedArea += motifTotalArea;

  for (const motif of motifs) {
    if (!motif.recipes || motif.recipes.length === 0) continue;

    // Track bounds for overlap detection
    const bounds = {
      x: motif.position?.x || 0,
      y: motif.position?.y || 0,
      width: (motif.widthM || 0) * 1000,
      height: (motif.heightM || 0) * 1000,
      area: motif.areaM2 || 0
    };
    elementBounds.push(bounds);

    for (const recipe of motif.recipes) {
      const areaPct = recipe.targetColor?.areaPct || recipe.originalColor?.areaPct || 0;
      if (areaPct <= 0) continue;

      const colorArea = (areaPct / 100) * motif.areaM2;
      const components = recipe.chosenRecipe?.components || [];

      for (const comp of components) {
        const weight = comp.weight || 1;
        const componentArea = colorArea * weight;
        const kg = componentArea * densityKgPerM2 * safetyMargin;

        elementMaterials.push({
          element: motif.name || 'Motif',
          elementType: 'motif-surface',
          motifId: motif.id,
          colour: {
            hex: comp.hex || recipe.blendColor?.hex || '#808080',
            tpv_code: comp.code || '',
            name: comp.name || 'Unknown'
          },
          area: componentArea,
          kg,
          dimensions: `${motif.widthM?.toFixed(1) || '?'}m × ${motif.heightM?.toFixed(1) || '?'}m`
        });
      }
    }
  }

  // 2. Calculate shape materials (geometric area × fill color)
  for (const shape of Object.values(shapes)) {
    if (shape.visible === false) continue;

    const shapeAreaM2 = calculateShapeArea(shape) / 1_000_000; // Convert mm² to m²
    if (shapeAreaM2 <= 0) continue;

    usedArea += shapeAreaM2;

    if (shape.fillColor) {
      const kg = shapeAreaM2 * densityKgPerM2 * safetyMargin;
      elementMaterials.push({
        element: shape.type === 'polygon' ? 'Polygon' : shape.type === 'blob' ? 'Blob' : 'Shape',
        elementType: 'shape-fill',
        colour: shape.fillColor,
        area: shapeAreaM2,
        kg,
        dimensions: ''
      });
    }

    // Stroke (if enabled)
    if (shape.strokeEnabled && shape.strokeColor && shape.strokeWidth_mm > 0) {
      const strokeAreaM2 = calculateStrokeArea(shape) / 1_000_000;
      if (strokeAreaM2 > 0) {
        const kg = strokeAreaM2 * densityKgPerM2 * safetyMargin;
        elementMaterials.push({
          element: 'Shape Outline',
          elementType: 'shape-stroke',
          colour: shape.strokeColor,
          area: strokeAreaM2,
          kg,
          dimensions: ''
        });
      }
    }
  }

  // 3. Calculate text materials (approximate from font size and content length)
  for (const text of Object.values(texts)) {
    if (text.visible === false || !text.content) continue;

    // Estimate text area from font size and scale
    const textAreaM2 = estimateTextArea(text) / 1_000_000;
    if (textAreaM2 <= 0) continue;

    usedArea += textAreaM2;

    if (text.fillColor) {
      const kg = textAreaM2 * densityKgPerM2 * safetyMargin;
      elementMaterials.push({
        element: `Text: "${text.content.substring(0, 20)}${text.content.length > 20 ? '...' : ''}"`,
        elementType: 'text-fill',
        colour: text.fillColor,
        area: textAreaM2,
        kg,
        dimensions: ''
      });
    }
  }

  // 4. Calculate court materials (known geometry)
  for (const court of Object.values(courts)) {
    const template = court.template || {};
    const courtType = template.type || 'default';
    const scale = court.scale || 1;

    const courtWidthM = ((template.dimensions?.width_mm || 0) / 1000) * scale;
    const courtLengthM = ((template.dimensions?.length_mm || 0) / 1000) * scale;
    const courtArea = courtWidthM * courtLengthM;
    usedArea += courtArea;

    // Court surface
    if (court.courtSurfaceColor) {
      const kg = courtArea * densityKgPerM2 * safetyMargin;
      elementMaterials.push({
        element: `${template.name || 'Court'} Surface`,
        elementType: 'court-surface',
        colour: court.courtSurfaceColor,
        area: courtArea,
        kg,
        dimensions: `${courtWidthM.toFixed(1)}m × ${courtLengthM.toFixed(1)}m`
      });
    }

    // Line markings
    const lineColors = court.lineColorOverrides ? Object.values(court.lineColorOverrides) : [];
    if (lineColors.length > 0) {
      const linePercent = LINE_MARKING_PERCENTAGES[courtType] || LINE_MARKING_PERCENTAGES.default;
      const lineArea = courtArea * linePercent;

      // Group line colors
      const colorGroups = {};
      for (const color of lineColors) {
        const hex = color?.hex || '#FFFFFF';
        if (!colorGroups[hex]) colorGroups[hex] = { color, count: 0 };
        colorGroups[hex].count++;
      }

      const totalMarkings = lineColors.length;
      for (const group of Object.values(colorGroups)) {
        const colorProportion = group.count / totalMarkings;
        const colorArea = lineArea * colorProportion;
        const kg = colorArea * densityKgPerM2 * safetyMargin;

        elementMaterials.push({
          element: `${template.name || 'Court'} Lines`,
          elementType: 'line-marking',
          colour: group.color,
          area: colorArea,
          kg,
          dimensions: `~${(linePercent * 100).toFixed(0)}% of court`
        });
      }
    }
  }

  // 5. Calculate track materials
  for (const track of Object.values(tracks)) {
    const template = track.template || {};
    const params = track.parameters || template.parameters || {};

    const trackArea = calculateTrackArea(track, template, params, totalAreaM2);
    usedArea += trackArea;

    if (track.trackSurfaceColor) {
      const kg = trackArea * densityKgPerM2 * safetyMargin;
      const numLanes = params.numLanes || template.parameters?.numLanes || 0;
      elementMaterials.push({
        element: template.name || 'Running Track',
        elementType: 'track-surface',
        colour: track.trackSurfaceColor,
        area: trackArea,
        kg,
        dimensions: numLanes > 0 ? `${numLanes} lanes` : ''
      });
    }

    // Lane markings
    const numLanes = params.numLanes || template.parameters?.numLanes || 0;
    if (numLanes > 0) {
      const laneMarkArea = trackArea * 0.02;
      const kg = laneMarkArea * densityKgPerM2 * safetyMargin;
      elementMaterials.push({
        element: `${template.name || 'Track'} Lane Markings`,
        elementType: 'line-marking',
        colour: { hex: '#F5F0DC', tpv_code: 'RH31', name: 'Cream' },
        area: laneMarkArea,
        kg,
        dimensions: ''
      });
    }
  }

  // 6. Base surface (remaining area after all elements)
  const baseArea = Math.max(0, totalAreaM2 - usedArea);
  if (baseArea > 0 && surface?.color) {
    const kg = baseArea * densityKgPerM2 * safetyMargin;
    elementMaterials.push({
      element: 'Base Surface',
      elementType: 'base-surface',
      colour: surface.color,
      area: baseArea,
      kg,
      dimensions: ''
    });
  }

  // Aggregate by TPV code for summary
  const aggregatedMaterials = aggregateByTpvCode(elementMaterials);

  return {
    elementMaterials,
    aggregatedMaterials
  };
}

/**
 * Calculate shape area based on shapeType
 * Shapes have: shapeType ('polygon', 'blob', 'path'), width_mm, height_mm, controlPoints[], sides
 */
function calculateShapeArea(shape) {
  const shapeType = shape.shapeType || shape.type;

  // Polygon shapes: use width_mm × height_mm with coverage factor based on sides
  if (shapeType === 'polygon' && shape.width_mm && shape.height_mm) {
    const coverageFactor = getPolygonCoverage(shape.sides || 4);
    return shape.width_mm * shape.height_mm * coverageFactor;
  }

  // Blob shapes: use bounding box with ~70% coverage for organic shapes
  if (shapeType === 'blob' && shape.width_mm && shape.height_mm) {
    return shape.width_mm * shape.height_mm * 0.7;
  }

  // Path shapes: calculate from controlPoints if closed, or stroke area if open
  if (shapeType === 'path') {
    if (shape.controlPoints?.length >= 3 && shape.closed !== false) {
      // Closed path - calculate polygon area from control points
      return polygonArea(shape.controlPoints);
    } else if (shape.controlPoints?.length >= 2) {
      // Open path - use stroke width × length
      const length = calculatePathLength(shape.controlPoints);
      const width = shape.strokeWidth_mm || 50;
      return length * width;
    }
  }

  // Fallback: try width_mm × height_mm
  if (shape.width_mm && shape.height_mm) {
    return shape.width_mm * shape.height_mm * 0.7;
  }

  return 0;
}

/**
 * Get coverage factor for regular polygons inscribed in bounding box
 */
function getPolygonCoverage(sides) {
  if (!sides || sides < 3) return 1.0;
  if (sides >= 100) return Math.PI / 4; // Circle: ~0.785

  const coverageMap = {
    3: 0.50,   // Triangle
    4: 1.00,   // Square/Rectangle
    5: 0.69,   // Pentagon
    6: 0.87,   // Hexagon
    7: 0.80,   // Heptagon
    8: 0.83,   // Octagon
  };

  return coverageMap[sides] || 0.8; // Default for other polygons
}

/**
 * Calculate path length from control points
 */
function calculatePathLength(controlPoints) {
  if (!controlPoints || controlPoints.length < 2) return 0;

  let length = 0;
  for (let i = 1; i < controlPoints.length; i++) {
    const prev = controlPoints[i - 1];
    const curr = controlPoints[i];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
}

/**
 * Calculate polygon area using shoelace formula
 */
function polygonArea(points) {
  if (!points || points.length < 3) return 0;

  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

/**
 * Calculate stroke area (perimeter × stroke width)
 */
function calculateStrokeArea(shape) {
  const strokeWidth = shape.strokeWidth_mm || 0;
  if (strokeWidth <= 0) return 0;

  if (shape.type === 'polygon' && shape.points?.length >= 3) {
    const perimeter = calculatePerimeter(shape.points);
    return perimeter * strokeWidth;
  }

  return 0;
}

/**
 * Calculate perimeter of polygon
 */
function calculatePerimeter(points) {
  if (!points || points.length < 2) return 0;

  let perimeter = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const dx = points[j].x - points[i].x;
    const dy = points[j].y - points[i].y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  return perimeter;
}

/**
 * Estimate text area from font size, content length, and scale
 * Text has: content, fontSize_mm, scale_x, scale_y, fontWeight
 */
function estimateTextArea(text) {
  if (!text.content || !text.fontSize_mm) return 0;

  // Estimate based on character count and font size
  const charCount = text.content.length;
  const charWidth = text.fontSize_mm * 0.6;  // Average character width ratio
  const charHeight = text.fontSize_mm;
  const scale_x = text.scale_x || 1;
  const scale_y = text.scale_y || 1;

  // Base area: characters × char dimensions × scale
  const baseArea = charCount * charWidth * charHeight;
  const scaledArea = baseArea * scale_x * scale_y;

  // Coverage factor: text typically covers ~50-60% of bounding area
  const coverageFactor = text.fontWeight === 'bold' ? 0.65 : 0.55;
  return scaledArea * coverageFactor;
}

/**
 * Calculate track area from geometry
 */
function calculateTrackArea(track, template, params, totalAreaM2) {
  const numLanes = params.numLanes || template.parameters?.numLanes || 0;
  const laneWidthMm = params.laneWidth_mm || template.parameters?.laneWidth_mm || 1220;

  if (numLanes <= 0) return totalAreaM2 * 0.25; // Fallback estimate

  const laneWidthM = laneWidthMm / 1000;
  const isStraightTrack = template.trackType === 'straight';

  if (isStraightTrack) {
    const trackWidthM = (params.width_mm || 0) / 1000;
    const trackLengthM = (params.height_mm || 0) / 1000;
    return trackWidthM * trackLengthM;
  }

  // Curved track
  const trackWidthM = (params.width_mm || 0) / 1000;
  const cornerRadius = params.cornerRadius?.topLeft || 0;
  const cornerRadiusM = cornerRadius / 1000;

  if (cornerRadiusM > 0) {
    const straightLengthM = trackWidthM - (2 * cornerRadiusM);
    const innerRadius = cornerRadiusM;
    const outerRadius = cornerRadiusM + (numLanes * laneWidthM);

    const straightsArea = 2 * straightLengthM * numLanes * laneWidthM;
    const bendsArea = Math.PI * (outerRadius ** 2 - innerRadius ** 2);

    return straightsArea + bendsArea;
  }

  // Fallback: bounding box estimate
  const trackWidthMEstimate = (params.width_mm || 0) / 1000;
  const trackHeightM = (params.height_mm || 0) / 1000;
  return trackWidthMEstimate * trackHeightM * 0.7;
}

/**
 * Get bounding box from SVG path data
 */
function getBoundsFromPathData(pathData) {
  // Simple bounding box extraction from path data
  const numbers = pathData.match(/-?\d+\.?\d*/g)?.map(Number) || [];
  if (numbers.length < 4) return { width: 0, height: 0 };

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < numbers.length; i += 2) {
    if (i + 1 < numbers.length) {
      minX = Math.min(minX, numbers[i]);
      maxX = Math.max(maxX, numbers[i]);
      minY = Math.min(minY, numbers[i + 1]);
      maxY = Math.max(maxY, numbers[i + 1]);
    }
  }

  return {
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Estimate path length from SVG path data
 */
function estimatePathLength(pathData) {
  // Very rough estimate - just count coordinate pairs and multiply by average distance
  const numbers = pathData.match(/-?\d+\.?\d*/g)?.map(Number) || [];
  const pointCount = Math.floor(numbers.length / 2);
  if (pointCount < 2) return 0;

  // Estimate average segment length
  let totalLength = 0;
  for (let i = 2; i < numbers.length; i += 2) {
    const dx = numbers[i] - numbers[i - 2];
    const dy = numbers[i + 1] - numbers[i - 1];
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }

  return totalLength;
}

/**
 * Aggregate materials by TPV code for summary view
 */
function aggregateByTpvCode(materials) {
  const aggregated = {};

  for (const mat of materials) {
    const code = mat.colour?.tpv_code || mat.colour?.code || '';
    const hex = (mat.colour?.hex || '#808080').toLowerCase();
    const key = code || hex; // Use code if available, else hex

    if (!aggregated[key]) {
      aggregated[key] = {
        colour: {
          hex: mat.colour?.hex || '#808080',
          tpv_code: code,
          name: mat.colour?.name || 'Unknown'
        },
        area: 0,
        kg: 0,
        percentage: 0
      };
    }

    aggregated[key].area += mat.area;
    aggregated[key].kg += mat.kg;
  }

  // Convert to array and calculate percentages
  const totalArea = Object.values(aggregated).reduce((sum, m) => sum + m.area, 0);
  const result = Object.values(aggregated).map(m => ({
    ...m,
    percentage: totalArea > 0 ? (m.area / totalArea) * 100 : 0
  }));

  // Sort by area descending
  result.sort((a, b) => b.area - a.area);

  return result;
}

export {
  calculateShapeArea,
  calculateStrokeArea,
  aggregateByTpvCode,
  LINE_MARKING_PERCENTAGES
};
