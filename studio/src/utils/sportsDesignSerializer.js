// TPV Studio - TPV Design Serializer
// Converts TPV design state to/from database format

/**
 * Serialize sports design state for database storage
 * @param {Object} state - Current design state from store.exportDesignData()
 * @param {Object} metadata - Additional metadata (name, description, etc.)
 * @returns {Object} Serialized design data ready for API
 */
export function serializeSportsDesign(state, metadata = {}) {
  return {
    // Type discriminator for database
    type: 'sports_surface',
    version: '1.0',

    // Design metadata
    name: metadata.name || state.name || 'Untitled Design',
    description: metadata.description || state.description || '',
    tags: metadata.tags || state.tags || [],

    // Surface configuration
    surface: state.surface,

    // Courts with full data
    courts: serializeCourts(state.courts),

    // Tracks with full data
    tracks: serializeTracks(state.tracks),

    // Motifs (playground designs placed on canvas)
    motifs: serializeMotifs(state.motifs),

    // Exclusion zones (buildings, obstacles)
    exclusionZones: serializeExclusionZones(state.exclusionZones),

    // Shapes (blobs, paths, polygons)
    shapes: serializeShapes(state.shapes),

    // Text elements
    texts: serializeTexts(state.texts),

    // Unified element render order
    elementOrder: state.elementOrder || [],

    // Custom markings and zones
    customMarkings: state.customMarkings || [],
    backgroundZones: state.backgroundZones || [],

    // Dimensions for quick reference (extracted from surface)
    dimensions: {
      width_mm: state.surface?.width_mm || 50000,
      length_mm: state.surface?.length_mm || 50000
    }
  };
}

/**
 * Serialize courts, ensuring all data is JSON-safe
 */
function serializeCourts(courts) {
  if (!courts) return {};

  return Object.fromEntries(
    Object.entries(courts).map(([id, court]) => [
      id,
      {
        id: court.id,
        templateId: court.templateId,
        template: court.template,
        position: court.position,
        rotation: court.rotation,
        scale: court.scale,
        lineColorOverrides: court.lineColorOverrides || {},
        zoneColorOverrides: court.zoneColorOverrides || {},
        courtSurfaceColor: court.courtSurfaceColor
      }
    ])
  );
}

/**
 * Serialize tracks, ensuring all data is JSON-safe
 */
function serializeTracks(tracks) {
  if (!tracks) return {};

  return Object.fromEntries(
    Object.entries(tracks).map(([id, track]) => [
      id,
      {
        id: track.id,
        templateId: track.templateId,
        template: track.template,
        position: track.position,
        rotation: track.rotation,
        parameters: track.parameters,
        trackSurfaceColor: track.trackSurfaceColor,
        laneSurfaceColors: track.laneSurfaceColors || [], // Per-lane color overrides
        trackLineColor: track.trackLineColor
      }
    ])
  );
}

/**
 * Serialize motifs (playground designs placed on canvas)
 */
function serializeMotifs(motifs) {
  if (!motifs) return {};

  return Object.fromEntries(
    Object.entries(motifs).map(([id, motif]) => [
      id,
      {
        id: motif.id,
        type: 'motif',
        sourceDesignId: motif.sourceDesignId,
        sourceDesignName: motif.sourceDesignName,
        sourceThumbnailUrl: motif.sourceThumbnailUrl,
        svgContent: motif.svgContent,
        originalWidth_mm: motif.originalWidth_mm,
        originalHeight_mm: motif.originalHeight_mm,
        position: motif.position,
        rotation: motif.rotation,
        scale: motif.scale
      }
    ])
  );
}

/**
 * Serialize exclusion zones (buildings, obstacles)
 */
function serializeExclusionZones(zones) {
  if (!zones) return {};

  return Object.fromEntries(
    Object.entries(zones).map(([id, zone]) => [
      id,
      {
        id: zone.id,
        type: 'exclusion',
        shapeType: zone.shapeType,
        sides: zone.sides,
        width_mm: zone.width_mm,
        height_mm: zone.height_mm,
        position: zone.position,
        rotation: zone.rotation,
        cornerRadius: zone.cornerRadius,
        locked: zone.locked,
        visible: zone.visible,
        customName: zone.customName,
        controlPoints: zone.controlPoints
      }
    ])
  );
}

/**
 * Serialize shapes (blobs, paths, polygons)
 */
function serializeShapes(shapes) {
  if (!shapes) return {};

  return Object.fromEntries(
    Object.entries(shapes).map(([id, shape]) => [
      id,
      {
        id: shape.id,
        shapeType: shape.shapeType,
        controlPoints: shape.controlPoints,
        width_mm: shape.width_mm,
        height_mm: shape.height_mm,
        position: shape.position,
        rotation: shape.rotation,
        fillColor: shape.fillColor,
        strokeEnabled: shape.strokeEnabled,
        strokeColor: shape.strokeColor,
        strokeWidth_mm: shape.strokeWidth_mm,
        sides: shape.sides,
        cornerRadius: shape.cornerRadius,
        closed: shape.closed,
        smooth: shape.smooth,
        editPointsVisible: shape.editPointsVisible
      }
    ])
  );
}

/**
 * Serialize text elements
 */
function serializeTexts(texts) {
  if (!texts) return {};

  return Object.fromEntries(
    Object.entries(texts).map(([id, text]) => [
      id,
      {
        id: text.id,
        content: text.content,
        fontFamily: text.fontFamily,
        fontSize_mm: text.fontSize_mm,
        scale_x: text.scale_x ?? 1,
        scale_y: text.scale_y ?? 1,
        fontWeight: text.fontWeight,
        fontStyle: text.fontStyle,
        textAlign: text.textAlign,
        position: text.position,
        rotation: text.rotation,
        fillColor: text.fillColor,
        strokeColor: text.strokeColor,
        strokeWidth_mm: text.strokeWidth_mm
      }
    ])
  );
}

/**
 * Deserialize saved design data back into store format
 * @param {Object} savedData - Design data from database
 * @returns {Object} State object to load into store
 */
export function deserializeSportsDesign(savedData) {
  // Handle both wrapped (from API) and unwrapped formats
  const data = savedData.design_data || savedData;

  // Migrate texts to include scale_x/scale_y if missing
  const migratedTexts = migrateTexts(data.texts || {});

  return {
    surface: data.surface || {
      width_mm: data.dimensions?.width_mm || 50000,
      length_mm: data.dimensions?.length_mm || 50000,
      color: { tpv_code: 'RH12', hex: '#006C55', name: 'Dark Green' }
    },
    courts: data.courts || {},
    tracks: data.tracks || {},
    motifs: data.motifs || {},
    exclusionZones: data.exclusionZones || {},
    shapes: data.shapes || {},
    texts: migratedTexts,
    elementOrder: data.elementOrder || [],
    customMarkings: data.customMarkings || [],
    backgroundZones: data.backgroundZones || [],
    name: data.name || savedData.name || 'Untitled Design',
    description: data.description || savedData.description || '',
    tags: data.tags || savedData.tags || []
  };
}

/**
 * Migrate text elements from older format (fontSize-based) to new format (scale-based)
 * Preserves visual appearance by converting fontSize_mm to scale factors
 */
function migrateTexts(texts) {
  if (!texts) return {};

  const BASE_FONT_SIZE = 500; // Default base font size

  return Object.fromEntries(
    Object.entries(texts).map(([id, text]) => {
      // If scale_x and scale_y already exist, use them as-is
      if (text.scale_x !== undefined && text.scale_y !== undefined) {
        return [id, text];
      }

      // Migration: convert fontSize_mm to scale factors
      // Old designs used fontSize_mm directly for sizing
      // New approach uses base font size (500mm) with scale transform
      const oldFontSize = text.fontSize_mm || BASE_FONT_SIZE;
      const scale = oldFontSize / BASE_FONT_SIZE;

      return [
        id,
        {
          ...text,
          fontSize_mm: BASE_FONT_SIZE, // Reset to base font size
          scale_x: scale,
          scale_y: scale
        }
      ];
    })
  );
}

/**
 * Validate that design state has minimum required data for saving
 * @param {Object} state - Design state
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateSportsDesign(state) {
  const errors = [];

  if (!state.surface) {
    errors.push('Surface configuration is required');
  }

  if (!state.surface?.width_mm || !state.surface?.length_mm) {
    errors.push('Surface dimensions are required');
  }

  const hasElements =
    (state.courts && Object.keys(state.courts).length > 0) ||
    (state.tracks && Object.keys(state.tracks).length > 0) ||
    (state.motifs && Object.keys(state.motifs).length > 0);

  if (!hasElements) {
    errors.push('Add at least one court, track, or motif to save');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

import { calculateMaterials as _calculateMaterials } from '../lib/sports/materialCalculator.js';

/**
 * Calculate total quantities for all elements using canvas rasterization.
 * This properly handles overlapping elements - only visible areas are counted.
 * Exclusion zones (buildings, obstacles) are not counted as material.
 *
 * Returns breakdown by TPV color code.
 *
 * @param {Object} state - Design state from store.exportDesignData()
 * @returns {Array} Array of { tpv_code, area_m2, quantity_kg, usages }
 */
export function calculateSportsQuantities(state) {
  const result = _calculateMaterials(state);
  // For backward compatibility, return just the materials array
  return result.materials || result;
}

/**
 * Calculate total quantities including exclusion zone information.
 * This is the full version that also reports excluded area.
 *
 * @param {Object} state - Design state from store.exportDesignData()
 * @returns {Object} { materials: Array, exclusionArea_m2: number }
 */
export function calculateSportsQuantitiesWithExclusions(state) {
  return _calculateMaterials(state);
}

/**
 * @deprecated Use calculateSportsQuantities (now using canvas rasterization)
 *
 * Legacy calculation that doesn't account for overlapping elements.
 * Kept for reference but not recommended for use.
 */
export function calculateSportsQuantitiesLegacy(state) {
  const DENSITY_KG_PER_M2 = 8;    // TPV at 20mm depth
  const SAFETY_FACTOR = 1.1;       // 10% wastage

  const quantities = {};

  // Helper to add area to a color
  const addQuantity = (tpvCode, areaMm2, usage) => {
    const areaM2 = areaMm2 / 1_000_000; // Convert mm² to m²
    if (!quantities[tpvCode]) {
      quantities[tpvCode] = { area_m2: 0, usages: [] };
    }
    quantities[tpvCode].area_m2 += areaM2;
    if (usage && !quantities[tpvCode].usages.includes(usage)) {
      quantities[tpvCode].usages.push(usage);
    }
  };

  // 1. Base surface area
  const surfaceAreaMm2 = state.surface.width_mm * state.surface.length_mm;
  addQuantity(state.surface.color.tpv_code, surfaceAreaMm2, 'Surface Base');

  // 2. Court areas
  for (const court of Object.values(state.courts || {})) {
    if (court.visible === false) continue;
    const courtArea = calculateCourtArea(court);

    // Court surface color (if different from base)
    if (court.courtSurfaceColor) {
      addQuantity(court.courtSurfaceColor.tpv_code, courtArea.playingAreaMm2, `Court: ${court.template.name}`);
      // Subtract from base
      addQuantity(state.surface.color.tpv_code, -courtArea.playingAreaMm2, 'Surface Base');
    }

    // Line colors
    for (const [markingId, color] of Object.entries(court.lineColorOverrides || {})) {
      const marking = court.template.markings?.find(m => m.id === markingId);
      if (marking && color) {
        const lineArea = calculateLineArea(marking, court);
        addQuantity(color.tpv_code, lineArea, `Lines: ${court.template.name}`);
      }
    }
  }

  // 3. Track areas
  for (const track of Object.values(state.tracks || {})) {
    if (track.visible === false) continue;
    const trackArea = calculateTrackArea(track);

    if (track.trackSurfaceColor) {
      addQuantity(track.trackSurfaceColor.tpv_code, trackArea.totalAreaMm2, `Track: ${track.template.name}`);
      // Subtract from base
      addQuantity(state.surface.color.tpv_code, -trackArea.totalAreaMm2, 'Surface Base');
    }

    // Lane line area
    if (trackArea.lineAreaMm2 > 0) {
      const lineColorCode = track.trackLineColor?.tpv_code || 'RH31';
      addQuantity(lineColorCode, trackArea.lineAreaMm2, 'Track Lane Lines');
    }
  }

  // Convert to final format with kg
  return Object.entries(quantities)
    .filter(([_, data]) => data.area_m2 > 0) // Remove negative/zero entries
    .map(([tpvCode, data]) => ({
      tpv_code: tpvCode,
      area_m2: Math.round(data.area_m2 * 100) / 100,
      quantity_kg: Math.round(data.area_m2 * DENSITY_KG_PER_M2 * SAFETY_FACTOR),
      usages: data.usages
    }))
    .sort((a, b) => b.area_m2 - a.area_m2);
}

/**
 * Calculate court area including playing surface and lines
 */
function calculateCourtArea(court) {
  const dims = court.template.dimensions;
  const scale = court.scale || 1;

  const playingAreaMm2 = dims.width_mm * dims.length_mm * scale * scale;

  // Calculate line area from markings
  let lineAreaMm2 = 0;
  for (const marking of court.template.markings || []) {
    lineAreaMm2 += calculateLineArea(marking, court);
  }

  return {
    playingAreaMm2,
    lineAreaMm2,
    totalAreaMm2: playingAreaMm2
  };
}

/**
 * Calculate area of a single line marking
 */
function calculateLineArea(marking, court) {
  const scale = court.scale || 1;
  const lineWidth = marking.lineWidth_mm || 50;

  if (marking.type === 'line') {
    // Straight line
    const dx = (marking.x2 - marking.x1) * scale;
    const dy = (marking.y2 - marking.y1) * scale;
    const length = Math.sqrt(dx * dx + dy * dy);
    return length * lineWidth;
  } else if (marking.type === 'rect') {
    // Rectangle outline
    const w = marking.width * scale;
    const h = marking.height * scale;
    const perimeter = 2 * (w + h);
    return perimeter * lineWidth;
  } else if (marking.type === 'circle') {
    // Circle outline
    const circumference = 2 * Math.PI * marking.radius * scale;
    return circumference * lineWidth;
  } else if (marking.type === 'arc') {
    // Arc
    const arcLength = (marking.endAngle - marking.startAngle) * marking.radius * scale;
    return Math.abs(arcLength) * lineWidth;
  }

  return 0;
}

/**
 * Calculate track area including lanes and line markings
 */
function calculateTrackArea(track) {
  const params = track.parameters;
  const numLanes = params.numLanes || 6;
  const laneWidth = params.laneWidth_mm || 1220;
  const lineWidth = params.lineWidth_mm || 50;

  // For curved tracks, calculate based on perimeter
  if (params.cornerRadius && Object.values(params.cornerRadius).some(r => r > 0)) {
    // Curved track - use rounded rectangle perimeter formula
    const width = params.width_mm;
    const height = params.height_mm;
    const corners = params.cornerRadius;

    // Calculate average corner radius for simplification
    const avgRadius = (corners.topLeft + corners.topRight + corners.bottomLeft + corners.bottomRight) / 4;

    // Outer perimeter (simplified)
    const straightH = width - 2 * avgRadius;
    const straightV = height - 2 * avgRadius;
    const arcLength = 2 * Math.PI * avgRadius;
    const outerPerimeter = 2 * straightH + 2 * straightV + arcLength;

    // Total track area (all lanes)
    const totalAreaMm2 = outerPerimeter * laneWidth * numLanes;

    // Lane lines area
    const lineAreaMm2 = outerPerimeter * lineWidth * (numLanes + 1);

    return {
      totalAreaMm2,
      lineAreaMm2,
      perimeterMm: outerPerimeter
    };
  } else {
    // Straight track
    const length = params.height_mm;
    const totalAreaMm2 = length * laneWidth * numLanes;
    const lineAreaMm2 = length * lineWidth * (numLanes + 1);

    return {
      totalAreaMm2,
      lineAreaMm2,
      perimeterMm: length * 2
    };
  }
}

/**
 * Generate element specifications for PDF report
 */
export function generateElementSpecs(state) {
  const specs = [];

  // Courts
  for (const court of Object.values(state.courts || {})) {
    const dims = court.template.dimensions;
    const scale = court.scale || 1;

    specs.push({
      type: 'court',
      name: court.template.name,
      sport: court.template.sport || 'Multi-sport',
      standard: court.template.standard || '-',
      dimensions: {
        width_m: (dims.width_mm * scale) / 1000,
        length_m: (dims.length_mm * scale) / 1000
      },
      area_m2: (dims.width_mm * dims.length_mm * scale * scale) / 1_000_000,
      lineTotal_m2: calculateCourtArea(court).lineAreaMm2 / 1_000_000,
      surfaceColor: court.courtSurfaceColor?.name || 'Surface default',
      lineColors: Object.values(court.lineColorOverrides || {})
        .map(c => c.name)
        .filter((v, i, a) => a.indexOf(v) === i) // Unique
    });
  }

  // Tracks
  for (const track of Object.values(state.tracks || {})) {
    const params = track.parameters;
    const trackArea = calculateTrackArea(track);

    const spec = {
      type: 'track',
      name: track.template.name,
      sport: 'Athletics',
      standard: track.template.standard || 'World Athletics',
      numLanes: params.numLanes,
      laneWidth_m: params.laneWidth_mm / 1000,
      dimensions: {
        width_m: params.width_mm / 1000,
        height_m: params.height_mm / 1000
      },
      area_m2: trackArea.totalAreaMm2 / 1_000_000,
      lineTotal_m2: trackArea.lineAreaMm2 / 1_000_000,
      surfaceColor: track.trackSurfaceColor?.name || 'Standard Red',
      lineColor: track.trackLineColor?.name || 'Cream'
    };

    // Add stagger info if staggered start
    if (params.startingBoxes?.enabled && params.startingBoxes?.style !== 'straight') {
      spec.staggers = calculateStaggerOffsets(track);
    }

    // Add corner radii for curved tracks
    if (params.cornerRadius) {
      spec.cornerRadii = {
        topLeft_m: params.cornerRadius.topLeft / 1000,
        topRight_m: params.cornerRadius.topRight / 1000,
        bottomLeft_m: params.cornerRadius.bottomLeft / 1000,
        bottomRight_m: params.cornerRadius.bottomRight / 1000
      };
    }

    specs.push(spec);
  }

  return specs;
}

/**
 * Calculate stagger offsets for each lane (for PDF report)
 */
function calculateStaggerOffsets(track) {
  const params = track.parameters;
  const numLanes = params.numLanes || 6;
  const laneWidth = params.laneWidth_mm || 1220;

  // Simplified stagger calculation based on lane perimeter differences
  const staggers = [];

  for (let i = 0; i < numLanes; i++) {
    // Lane 1 (innermost) = index numLanes-1 in geometry, stagger = 0
    // Each outer lane has additional stagger based on perimeter difference
    const laneIndex = numLanes - 1 - i; // Convert to 0=outer, last=inner
    const perimeterDiff = laneIndex * laneWidth * Math.PI; // Approximate for one lap

    staggers.push({
      lane: i + 1,
      stagger_m: Math.round(perimeterDiff) / 1000
    });
  }

  return staggers;
}
