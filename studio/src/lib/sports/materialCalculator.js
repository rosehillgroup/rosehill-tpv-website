// TPV Studio - Canvas-Based Material Calculator
// Calculates accurate material quantities by rendering all elements to canvas
// and counting pixels per TPV color - accounts for overlaps and occlusion

import { calculateTrackGeometry } from './trackGeometry.js';
import { generatePolygonPath, generatePolygonPoints } from './shapeGeometry.js';
import { controlPointsToSVGPath as blobControlPointsToSVGPath } from './blobGeometry.js';
import { controlPointsToSVGPath as pathControlPointsToSVGPath } from './pathGeometry.js';
import { generateSurfaceBoundaryPath } from './surfaceGeometry.js';

// Resolution: 10mm per pixel gives reasonable accuracy for large surfaces
// A 50m x 50m surface = 5000 x 5000 pixels = 25M pixels (manageable)
const PIXELS_PER_MM = 0.1;
const MM_PER_PIXEL = 1 / PIXELS_PER_MM;
const M2_PER_PIXEL = (MM_PER_PIXEL * MM_PER_PIXEL) / 1_000_000;

// Material constants
const DENSITY_KG_PER_M2 = 8;  // TPV at 20mm depth
const SAFETY_FACTOR = 1.1;     // 10% wastage

// Special color code for exclusion zones (not counted as material)
const EXCLUSION_COLOR_CODE = '__EXCLUSION__';

/**
 * Calculate material quantities by rendering design to canvas
 * This correctly handles overlapping elements - only visible areas are counted
 * Exclusion zones are rendered but not counted as material
 *
 * @param {Object} state - Design state from store.exportDesignData()
 * @returns {Object} { materials: Array<{tpv_code, area_m2, quantity_kg, usages}>, exclusionArea_m2: number }
 */
export function calculateMaterials(state) {
  const { surface, elementOrder, courts, tracks, shapes, texts, motifs, exclusionZones } = state;

  if (!surface) {
    return { materials: [], exclusionArea_m2: 0 };
  }

  // Calculate canvas dimensions
  const canvasWidth = Math.ceil(surface.width_mm * PIXELS_PER_MM);
  const canvasHeight = Math.ceil(surface.length_mm * PIXELS_PER_MM);

  // Limit canvas size to prevent memory issues (max 8000x8000 = 64M pixels)
  const maxDimension = 8000;
  const scale = Math.min(1, maxDimension / Math.max(canvasWidth, canvasHeight));
  const scaledWidth = Math.ceil(canvasWidth * scale);
  const scaledHeight = Math.ceil(canvasHeight * scale);

  // Build color map for all TPV codes in the design
  const { colorMap, reverseMap } = buildColorMap(state);

  // Create off-screen canvas
  let canvas, ctx;
  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(scaledWidth, scaledHeight);
    ctx = canvas.getContext('2d');
  } else {
    // Fallback for environments without OffscreenCanvas
    canvas = document.createElement('canvas');
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    ctx = canvas.getContext('2d');
  }

  // Disable anti-aliasing to get clean pixel-perfect color counts
  // This prevents edge blending that causes color misidentification
  ctx.imageSmoothingEnabled = false;

  const renderScale = PIXELS_PER_MM * scale;

  // 1. Fill with surface base color (respecting custom boundary if set)
  const surfaceColor = colorMap[surface.color?.tpv_code] || colorMap['UNKNOWN'];
  ctx.fillStyle = surfaceColor;

  // Check for custom surface boundary
  const boundaryPath = generateSurfaceBoundaryPath(surface.boundary, surface.width_mm, surface.length_mm);

  if (boundaryPath) {
    // Fill only the custom boundary shape
    ctx.beginPath();
    parseSVGPathToCanvas(ctx, boundaryPath, renderScale);
    ctx.fill();
  } else {
    // Standard rectangular surface
    ctx.fillRect(0, 0, scaledWidth, scaledHeight);
  }

  // 2. Render exclusion zones (buildings, obstacles - not counted as material)
  const exclusionColor = colorMap[EXCLUSION_COLOR_CODE];
  for (const zone of Object.values(exclusionZones || {})) {
    if (zone.visible === false) continue;
    renderExclusionZone(ctx, zone, exclusionColor, renderScale);
  }

  // 3. Render elements in z-order (bottom to top)
  for (const elementId of elementOrder || []) {
    const element = findElement(state, elementId);
    if (!element || element.visible === false) continue;

    renderElementToCanvas(ctx, element, colorMap, renderScale, state);
  }

  // 4. Count pixels per color
  const imageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight);
  const colorCounts = countPixelsByColor(imageData, reverseMap);

  // 5. Convert pixel counts to area and weight
  const adjustedM2PerPixel = M2_PER_PIXEL / (scale * scale);

  const results = [];
  let exclusionArea_m2 = 0;

  for (const [tpvCode, pixelCount] of Object.entries(colorCounts)) {
    if (tpvCode === 'UNKNOWN' || pixelCount === 0) continue;

    const area_m2 = Math.round(pixelCount * adjustedM2PerPixel * 100) / 100;

    // Skip colors with trivial area (likely anti-aliasing artifacts)
    const MIN_AREA_M2 = 0.01; // 100 cm² minimum
    if (area_m2 < MIN_AREA_M2 && tpvCode !== EXCLUSION_COLOR_CODE) continue;

    // Track exclusion area separately (not counted as material)
    if (tpvCode === EXCLUSION_COLOR_CODE) {
      exclusionArea_m2 = area_m2;
      continue;
    }

    const quantity_kg = Math.round(area_m2 * DENSITY_KG_PER_M2 * SAFETY_FACTOR);

    results.push({
      tpv_code: tpvCode,
      area_m2,
      quantity_kg,
      usages: getUsagesForColor(tpvCode, state)
    });
  }

  // Sort by area descending
  results.sort((a, b) => b.area_m2 - a.area_m2);

  // Clean up canvas to prevent memory leaks
  // For DOM canvas, remove references; for OffscreenCanvas, let GC handle it
  if (canvas && typeof canvas.remove === 'function') {
    canvas.remove();
  }
  // Clear context reference
  ctx = null;

  return { materials: results, exclusionArea_m2 };
}

/**
 * Render an exclusion zone to the canvas
 */
function renderExclusionZone(ctx, zone, fillColor, scale) {
  ctx.save();

  const pos = zone.position || { x: 0, y: 0 };
  const centerX = zone.width_mm / 2;
  const centerY = zone.height_mm / 2;

  ctx.translate(pos.x * scale, pos.y * scale);
  ctx.translate(centerX * scale, centerY * scale);
  ctx.rotate(((zone.rotation || 0) * Math.PI) / 180);
  ctx.translate(-centerX * scale, -centerY * scale);

  ctx.fillStyle = fillColor;

  // Generate path based on shape type
  let svgPath;
  if (zone.shapeType === 'path' && zone.controlPoints && zone.controlPoints.length >= 3) {
    svgPath = pathControlPointsToSVGPath(zone.controlPoints, zone.width_mm * scale, zone.height_mm * scale, true);
  } else {
    svgPath = generatePolygonPath(zone.sides || 4, zone.width_mm * scale, zone.height_mm * scale, zone.cornerRadius || 0);
  }

  if (svgPath) {
    ctx.beginPath();
    parseSVGPathToCanvas(ctx, svgPath, 1);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Build color map from all TPV codes in design
 * Assigns each unique TPV code a distinct RGB color for identification
 */
function buildColorMap(state) {
  const tpvCodes = new Set();

  // Collect all TPV codes used in the design
  if (state.surface?.color?.tpv_code) {
    tpvCodes.add(state.surface.color.tpv_code);
  }

  // Courts - only include visible elements
  for (const court of Object.values(state.courts || {})) {
    if (court.visible === false) continue;
    if (court.courtSurfaceColor?.tpv_code) {
      tpvCodes.add(court.courtSurfaceColor.tpv_code);
    }
    for (const color of Object.values(court.lineColorOverrides || {})) {
      if (color?.tpv_code) tpvCodes.add(color.tpv_code);
    }
  }

  // Tracks - only include visible elements
  for (const track of Object.values(state.tracks || {})) {
    if (track.visible === false) continue;
    if (track.trackSurfaceColor?.tpv_code) {
      tpvCodes.add(track.trackSurfaceColor.tpv_code);
    }
    if (track.trackLineColor?.tpv_code) {
      tpvCodes.add(track.trackLineColor.tpv_code);
    }
    // Per-lane surface colors
    for (const laneColor of track.laneSurfaceColors || []) {
      if (laneColor?.tpv_code) {
        tpvCodes.add(laneColor.tpv_code);
      }
    }
  }

  // Shapes - only include visible elements
  for (const shape of Object.values(state.shapes || {})) {
    if (shape.visible === false) continue;
    if (shape.fillColor?.tpv_code) {
      tpvCodes.add(shape.fillColor.tpv_code);
    }
    if (shape.strokeColor?.tpv_code && shape.strokeEnabled) {
      tpvCodes.add(shape.strokeColor.tpv_code);
    }
  }

  // Texts - only include visible elements
  for (const text of Object.values(state.texts || {})) {
    if (text.visible === false) continue;
    if (text.fillColor?.tpv_code) {
      tpvCodes.add(text.fillColor.tpv_code);
    }
    if (text.strokeColor?.tpv_code && text.strokeWidth_mm > 0) {
      tpvCodes.add(text.strokeColor.tpv_code);
    }
  }

  // Create color map with unique RGB values
  // Use RGB values that are unlikely to be anti-aliased into each other
  const colorMap = { 'UNKNOWN': '#000000' };
  const reverseMap = { '0,0,0': 'UNKNOWN' };

  // Add exclusion zone color (special marker for buildings/obstacles)
  colorMap[EXCLUSION_COLOR_CODE] = 'rgb(255,255,255)';
  reverseMap['255,255,255'] = EXCLUSION_COLOR_CODE;

  // Generate distinct colors with guaranteed minimum distance between them
  // Use a Set to track used colors and ensure no collisions
  const usedColors = new Set(['0,0,0', '255,255,255']); // Reserved for UNKNOWN and EXCLUSION

  let index = 1;
  for (const code of tpvCodes) {
    // Generate distinct colors with larger spacing to avoid anti-aliasing confusion
    // Each color component steps by at least 32 to maintain distance
    let r, g, b;
    let attempts = 0;

    do {
      // Use index to generate well-spaced colors
      // Start from 32 to stay away from black (UNKNOWN)
      // End at 224 to stay away from white (EXCLUSION)
      r = 32 + ((index * 41) % 193);
      g = 32 + ((index * 67 + 64) % 193);
      b = 32 + ((index * 97 + 128) % 193);

      // If collision, adjust by incrementing
      if (usedColors.has(`${r},${g},${b}`)) {
        index++;
        attempts++;
      }
    } while (usedColors.has(`${r},${g},${b}`) && attempts < 100);

    const color = `rgb(${r},${g},${b})`;
    colorMap[code] = color;
    reverseMap[`${r},${g},${b}`] = code;
    usedColors.add(`${r},${g},${b}`);
    index++;
  }

  return { colorMap, reverseMap };
}

/**
 * Find an element by ID from any collection
 */
function findElement(state, elementId) {
  if (state.courts?.[elementId]) {
    return { ...state.courts[elementId], type: 'court' };
  }
  if (state.tracks?.[elementId]) {
    return { ...state.tracks[elementId], type: 'track' };
  }
  if (state.shapes?.[elementId]) {
    return { ...state.shapes[elementId], type: 'shape' };
  }
  if (state.texts?.[elementId]) {
    return { ...state.texts[elementId], type: 'text' };
  }
  if (state.motifs?.[elementId]) {
    return { ...state.motifs[elementId], type: 'motif' };
  }
  return null;
}

/**
 * Render an element to the canvas
 */
function renderElementToCanvas(ctx, element, colorMap, scale, state) {
  ctx.save();

  const pos = element.position || { x: 0, y: 0 };
  ctx.translate(pos.x * scale, pos.y * scale);
  ctx.rotate(((element.rotation || 0) * Math.PI) / 180);

  switch (element.type) {
    case 'court':
      renderCourt(ctx, element, colorMap, scale, state);
      break;
    case 'track':
      renderTrack(ctx, element, colorMap, scale);
      break;
    case 'shape':
      renderShape(ctx, element, colorMap, scale);
      break;
    case 'text':
      renderText(ctx, element, colorMap, scale);
      break;
    case 'motif':
      renderMotif(ctx, element, colorMap, scale);
      break;
  }

  ctx.restore();
}

/**
 * Render a court element
 */
function renderCourt(ctx, court, colorMap, scale, state) {
  const template = court.template;
  if (!template) return;

  const dims = template.dimensions;
  const courtScale = court.scale || 1;

  // Apply court scale
  ctx.scale(courtScale, courtScale);

  // Draw court surface (if it has a different color from base)
  if (court.courtSurfaceColor?.tpv_code) {
    const fillColor = colorMap[court.courtSurfaceColor.tpv_code] || colorMap['UNKNOWN'];
    ctx.fillStyle = fillColor;

    // Court is centered at position, so offset by half dimensions
    const x = -dims.width_mm / 2 * scale;
    const y = -dims.length_mm / 2 * scale;
    const w = dims.width_mm * scale;
    const h = dims.length_mm * scale;

    ctx.fillRect(x, y, w, h);
  }

  // Draw court line markings
  for (const marking of template.markings || []) {
    const lineColor = court.lineColorOverrides?.[marking.id];
    if (!lineColor?.tpv_code) continue;

    const strokeColor = colorMap[lineColor.tpv_code] || colorMap['UNKNOWN'];
    const lineWidth = (marking.lineWidth_mm || 50) * scale;

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    renderMarking(ctx, marking, scale, dims);
  }
}

/**
 * Render a court marking (line, rect, circle, arc)
 */
function renderMarking(ctx, marking, scale, dims) {
  const offsetX = -dims.width_mm / 2;
  const offsetY = -dims.length_mm / 2;

  ctx.beginPath();

  switch (marking.type) {
    case 'line':
      ctx.moveTo((marking.x1 + offsetX) * scale, (marking.y1 + offsetY) * scale);
      ctx.lineTo((marking.x2 + offsetX) * scale, (marking.y2 + offsetY) * scale);
      break;

    case 'rect':
      ctx.rect(
        (marking.x + offsetX) * scale,
        (marking.y + offsetY) * scale,
        marking.width * scale,
        marking.height * scale
      );
      break;

    case 'circle':
      ctx.arc(
        (marking.cx + offsetX) * scale,
        (marking.cy + offsetY) * scale,
        marking.radius * scale,
        0,
        Math.PI * 2
      );
      break;

    case 'arc':
      ctx.arc(
        (marking.cx + offsetX) * scale,
        (marking.cy + offsetY) * scale,
        marking.radius * scale,
        marking.startAngle,
        marking.endAngle
      );
      break;
  }

  ctx.stroke();
}

/**
 * Render a track element
 */
function renderTrack(ctx, track, colorMap, scale) {
  const params = track.parameters;
  if (!params) return;

  const geometry = calculateTrackGeometry(params);

  // Default track surface color
  const defaultSurfaceColor = colorMap[track.trackSurfaceColor?.tpv_code] || colorMap['UNKNOWN'];

  // Helper to get lane-specific surface color
  const getLaneSurfaceColor = (laneNumber) => {
    const override = track.laneSurfaceColors?.[laneNumber - 1];
    if (override?.tpv_code) {
      return colorMap[override.tpv_code] || defaultSurfaceColor;
    }
    return defaultSurfaceColor;
  };

  // Lane line color
  const lineColor = colorMap[track.trackLineColor?.tpv_code || 'RH31'] || colorMap['UNKNOWN'];
  const lineWidth = (params.lineWidth_mm || 50) * scale;

  // For curved tracks, render each lane as individual ring
  if (!geometry.isStraightTrack) {
    // Fill each lane as a separate ring
    for (let i = 0; i < geometry.lanes.length; i++) {
      const lane = geometry.lanes[i];
      const nextLane = geometry.lanes[i + 1];
      const outerPath = lane.outerPath;
      const innerPath = nextLane ? nextLane.outerPath : lane.innerPath;

      ctx.fillStyle = getLaneSurfaceColor(lane.laneNumber);
      fillDonutPath(ctx, outerPath, innerPath, scale);
    }

    // Draw lane lines
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    for (const lane of geometry.lanes) {
      if (lane.outerPath) {
        strokeSVGPath(ctx, lane.outerPath, scale);
      }
    }
    // Draw innermost line
    const lastLane = geometry.lanes[geometry.lanes.length - 1];
    if (lastLane.innerPath) {
      strokeSVGPath(ctx, lastLane.innerPath, scale);
    }
  } else {
    // Straight track - parallel lanes with per-lane colors
    for (const lane of geometry.lanes) {
      const laneX = lane.laneX * scale;
      const laneWidth = lane.laneWidth * scale;
      const trackHeight = params.height_mm * scale;

      // Fill lane surface with per-lane color
      ctx.fillStyle = getLaneSurfaceColor(lane.laneNumber);
      ctx.fillRect(laneX, 0, laneWidth, trackHeight);

      // Draw lane lines
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(laneX, 0);
      ctx.lineTo(laneX, trackHeight);
      ctx.stroke();
    }

    // Draw final outer line
    const totalWidth = geometry.totalWidth * scale;
    const trackHeight = params.height_mm * scale;
    ctx.beginPath();
    ctx.moveTo(totalWidth, 0);
    ctx.lineTo(totalWidth, trackHeight);
    ctx.stroke();
  }
}

/**
 * Render a shape element (polygon, blob, or path)
 */
function renderShape(ctx, shape, colorMap, scale) {
  const fillColor = colorMap[shape.fillColor?.tpv_code] || colorMap['UNKNOWN'];

  let svgPath;

  switch (shape.shapeType) {
    case 'polygon':
      // Generate polygon path (supports stars via starMode)
      const width = (shape.width_mm || 2000) * scale;
      const height = (shape.height_mm || 2000) * scale;
      svgPath = generatePolygonPath(
        shape.sides || 4,
        width,
        height,
        shape.cornerRadius || 0,
        shape.starMode || false,
        shape.innerRadius || 0.5
      );
      break;

    case 'blob':
      // Generate blob path from control points
      if (shape.controlPoints) {
        const blobWidth = (shape.width_mm || 2000) * scale;
        const blobHeight = (shape.height_mm || 2000) * scale;
        svgPath = blobControlPointsToSVGPath(shape.controlPoints, blobWidth, blobHeight);
      }
      break;

    case 'path':
      // Generate path from control points
      if (shape.controlPoints) {
        const pathWidth = (shape.width_mm || 2000) * scale;
        const pathHeight = (shape.height_mm || 2000) * scale;
        svgPath = pathControlPointsToSVGPath(
          shape.controlPoints,
          pathWidth,
          pathHeight,
          shape.closed !== false,
          shape.smooth || false
        );
      }
      break;
  }

  if (svgPath) {
    // Center the shape (shapes are positioned by center)
    const w = (shape.width_mm || 2000) * scale;
    const h = (shape.height_mm || 2000) * scale;

    ctx.save();
    ctx.translate(-w / 2, -h / 2);

    ctx.fillStyle = fillColor;
    fillSVGPath(ctx, svgPath);

    // Stroke if enabled
    if (shape.strokeEnabled && shape.strokeColor?.tpv_code) {
      ctx.strokeStyle = colorMap[shape.strokeColor.tpv_code] || colorMap['UNKNOWN'];
      ctx.lineWidth = (shape.strokeWidth_mm || 50) * scale;
      strokeSVGPath(ctx, svgPath, 1); // Scale already applied
    }

    ctx.restore();
  }
}

/**
 * Render a text element
 */
function renderText(ctx, text, colorMap, scale) {
  const fillColor = colorMap[text.fillColor?.tpv_code] || colorMap['UNKNOWN'];

  // Set font
  const fontSize = (text.fontSize_mm || 200) * scale;
  const fontFamily = text.fontFamily || 'Overpass';
  const fontWeight = text.fontWeight || 'normal';
  const fontStyle = text.fontStyle || 'normal';

  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = text.textAlign || 'left';
  ctx.textBaseline = 'alphabetic';

  const content = text.content || '';

  // Draw stroke first if present (paint order: stroke then fill)
  if (text.strokeColor?.tpv_code && text.strokeWidth_mm > 0) {
    ctx.strokeStyle = colorMap[text.strokeColor.tpv_code] || colorMap['UNKNOWN'];
    ctx.lineWidth = (text.strokeWidth_mm || 0) * scale * 2; // Stroke is centered, so double for visible width
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeText(content, 0, 0);
  }

  // Draw fill
  ctx.fillStyle = fillColor;
  ctx.fillText(content, 0, 0);
}

/**
 * Render a motif element (SVG design placed on canvas)
 * Motifs are complex SVGs - for material calculation, approximate with bounding box
 */
function renderMotif(ctx, motif, colorMap, scale) {
  // For accurate SVG color extraction, we'd need to parse the SVG
  // For now, approximate with bounding box in the dominant color
  // This is a simplification - motifs may have multiple colors

  const width = (motif.originalWidth_mm || 5000) * (motif.scale || 1) * scale;
  const height = (motif.originalHeight_mm || 5000) * (motif.scale || 1) * scale;

  // Draw as rectangle - motifs overlay the surface but we can't easily
  // extract colors from SVG content without parsing
  // Use a placeholder color (won't count in final results)
  ctx.fillStyle = colorMap['UNKNOWN'] || '#000000';
  ctx.fillRect(-width / 2, -height / 2, width, height);
}

/**
 * Fill a donut-shaped path (outer - inner)
 */
function fillDonutPath(ctx, outerPath, innerPath, scale) {
  ctx.beginPath();
  parseSVGPathToCanvas(ctx, outerPath, scale);
  if (innerPath) {
    parseSVGPathToCanvas(ctx, innerPath, scale);
  }
  ctx.fill('evenodd');
}

/**
 * Fill an SVG path on canvas
 */
function fillSVGPath(ctx, svgPath) {
  ctx.beginPath();
  parseSVGPathToCanvas(ctx, svgPath, 1);
  ctx.fill();
}

/**
 * Stroke an SVG path on canvas
 */
function strokeSVGPath(ctx, svgPath, scale) {
  ctx.beginPath();
  parseSVGPathToCanvas(ctx, svgPath, scale);
  ctx.stroke();
}

/**
 * Parse SVG path commands and draw to canvas
 * Supports M, L, A, C, Q, Z commands
 */
function parseSVGPathToCanvas(ctx, pathData, scale = 1) {
  if (!pathData) return;

  // Normalize path data
  const normalized = pathData
    .replace(/,/g, ' ')
    .replace(/([A-Za-z])/g, ' $1 ')
    .trim()
    .split(/\s+/)
    .filter(s => s.length > 0);

  let i = 0;
  let currentX = 0, currentY = 0;
  let startX = 0, startY = 0;

  while (i < normalized.length) {
    const cmd = normalized[i];

    switch (cmd) {
      case 'M':
        currentX = parseFloat(normalized[++i]) * scale;
        currentY = parseFloat(normalized[++i]) * scale;
        ctx.moveTo(currentX, currentY);
        startX = currentX;
        startY = currentY;
        break;

      case 'L':
        currentX = parseFloat(normalized[++i]) * scale;
        currentY = parseFloat(normalized[++i]) * scale;
        ctx.lineTo(currentX, currentY);
        break;

      case 'C':
        const cp1x = parseFloat(normalized[++i]) * scale;
        const cp1y = parseFloat(normalized[++i]) * scale;
        const cp2x = parseFloat(normalized[++i]) * scale;
        const cp2y = parseFloat(normalized[++i]) * scale;
        currentX = parseFloat(normalized[++i]) * scale;
        currentY = parseFloat(normalized[++i]) * scale;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, currentX, currentY);
        break;

      case 'Q':
        const qcpx = parseFloat(normalized[++i]) * scale;
        const qcpy = parseFloat(normalized[++i]) * scale;
        currentX = parseFloat(normalized[++i]) * scale;
        currentY = parseFloat(normalized[++i]) * scale;
        ctx.quadraticCurveTo(qcpx, qcpy, currentX, currentY);
        break;

      case 'A':
        // Elliptical arc - simplified handling
        const rx = parseFloat(normalized[++i]) * scale;
        const ry = parseFloat(normalized[++i]) * scale;
        const xAxisRotation = parseFloat(normalized[++i]);
        const largeArcFlag = parseInt(normalized[++i]);
        const sweepFlag = parseInt(normalized[++i]);
        const endX = parseFloat(normalized[++i]) * scale;
        const endY = parseFloat(normalized[++i]) * scale;

        // Approximate arc with bezier curves
        drawArc(ctx, currentX, currentY, endX, endY, rx, ry, xAxisRotation, largeArcFlag, sweepFlag);
        currentX = endX;
        currentY = endY;
        break;

      case 'Z':
      case 'z':
        ctx.closePath();
        currentX = startX;
        currentY = startY;
        break;

      default:
        // Skip unknown commands
        i++;
    }

    i++;
  }
}

/**
 * Draw an SVG arc using canvas API
 * This is a simplified approximation - for accuracy would need proper arc-to-bezier conversion
 */
function drawArc(ctx, x1, y1, x2, y2, rx, ry, rotation, largeArc, sweep) {
  // For circular arcs (rx === ry), use canvas arc
  if (Math.abs(rx - ry) < 1) {
    // Calculate center of arc
    const dx = (x1 - x2) / 2;
    const dy = (y1 - y2) / 2;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d >= rx * 2) {
      // Degenerate case - just draw line
      ctx.lineTo(x2, y2);
      return;
    }

    const h = Math.sqrt(rx * rx - d * d);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    // Perpendicular direction
    const perpX = -dy / d * h;
    const perpY = dx / d * h;

    // Choose center based on flags
    const cx = mx + (largeArc !== sweep ? perpX : -perpX);
    const cy = my + (largeArc !== sweep ? perpY : -perpY);

    // Calculate angles
    const startAngle = Math.atan2(y1 - cy, x1 - cx);
    const endAngle = Math.atan2(y2 - cy, x2 - cx);

    ctx.arc(cx, cy, rx, startAngle, endAngle, !sweep);
  } else {
    // Elliptical arc - approximate with line for simplicity
    ctx.lineTo(x2, y2);
  }
}

/**
 * Count pixels by color in the canvas image data
 */
function countPixelsByColor(imageData, reverseMap) {
  const data = imageData.data;
  const counts = {};

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // const a = data[i + 3]; // Alpha - ignore for now

    const key = `${r},${g},${b}`;
    const tpvCode = reverseMap[key];

    if (tpvCode) {
      counts[tpvCode] = (counts[tpvCode] || 0) + 1;
    } else {
      // Unknown color (possibly anti-aliased) - try to find closest match
      const closestCode = findClosestColor(r, g, b, reverseMap);
      if (closestCode) {
        counts[closestCode] = (counts[closestCode] || 0) + 1;
      }
    }
  }

  return counts;
}

/**
 * Find the closest TPV code for an anti-aliased color
 */
function findClosestColor(r, g, b, reverseMap) {
  let minDist = Infinity;
  let closestCode = 'UNKNOWN';

  for (const [key, code] of Object.entries(reverseMap)) {
    const [kr, kg, kb] = key.split(',').map(Number);
    const dist = Math.abs(r - kr) + Math.abs(g - kg) + Math.abs(b - kb);

    if (dist < minDist) {
      minDist = dist;
      closestCode = code;
    }
  }

  // Only match if close enough (threshold for anti-aliasing)
  // Reduced from 30 to 15 to prevent false matches from anti-aliased edge pixels
  return minDist <= 15 ? closestCode : 'UNKNOWN';
}

/**
 * Get usage descriptions for a TPV color code
 */
function getUsagesForColor(tpvCode, state) {
  const usages = new Set();

  // Check surface
  if (state.surface?.color?.tpv_code === tpvCode) {
    usages.add('Surface Base');
  }

  // Check courts
  for (const court of Object.values(state.courts || {})) {
    if (court.courtSurfaceColor?.tpv_code === tpvCode) {
      usages.add(`Court: ${court.template?.name || 'Court'}`);
    }
    for (const color of Object.values(court.lineColorOverrides || {})) {
      if (color?.tpv_code === tpvCode) {
        usages.add(`Lines: ${court.template?.name || 'Court'}`);
      }
    }
  }

  // Check tracks
  for (const track of Object.values(state.tracks || {})) {
    if (track.trackSurfaceColor?.tpv_code === tpvCode) {
      usages.add(`Track: ${track.template?.name || 'Track'}`);
    }
    if (track.trackLineColor?.tpv_code === tpvCode) {
      usages.add('Track Lane Lines');
    }
    // Check per-lane colors
    for (let i = 0; i < (track.laneSurfaceColors || []).length; i++) {
      const laneColor = track.laneSurfaceColors[i];
      if (laneColor?.tpv_code === tpvCode) {
        usages.add(`Track Lane ${i + 1}`);
      }
    }
  }

  // Check shapes
  for (const shape of Object.values(state.shapes || {})) {
    if (shape.fillColor?.tpv_code === tpvCode) {
      usages.add('Shape Fill');
    }
    if (shape.strokeColor?.tpv_code === tpvCode && shape.strokeEnabled) {
      usages.add('Shape Stroke');
    }
  }

  // Check texts
  for (const text of Object.values(state.texts || {})) {
    if (text.fillColor?.tpv_code === tpvCode) {
      usages.add('Text');
    }
    if (text.strokeColor?.tpv_code === tpvCode && text.strokeWidth_mm > 0) {
      usages.add('Text Outline');
    }
  }

  return Array.from(usages);
}
