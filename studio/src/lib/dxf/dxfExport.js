// TPV Studio - DXF Export Generator
// Generates DXF R2013 files from SVG elements following DXF_EXPORT.md spec

import Drawing from 'dxf-writer';
import {
  pathToPolylines,
  rectToPolyline,
  circleToPolyline,
  ellipseToPolyline,
  polygonToPolyline,
  polylineToVertices,
  lineToVertices,
  transformVertices
} from './svgToDxf.js';

// Track export warnings to show user
let exportWarnings = [];

// TPV Color Palette - maps hex colors to RH codes for layer naming
const TPV_COLOR_MAP = {
  '#A5362F': 'RH01', // Standard Red
  '#E21F2F': 'RH02', // Bright Red
  '#609B63': 'RH10', // Standard Green
  '#3BB44A': 'RH11', // Bright Green
  '#006C55': 'RH12', // Dark Green
  '#0075BC': 'RH20', // Standard Blue
  '#493D8C': 'RH21', // Purple
  '#47AFE3': 'RH22', // Light Blue
  '#039DC4': 'RH23', // Azure
  '#00A6A3': 'RH26', // Turquoise
  '#E4C4AA': 'RH30', // Standard Beige
  '#E8E3D8': 'RH31', // Cream
  '#8B5F3C': 'RH32', // Brown
  '#E5A144': 'RH40', // Mustard Yellow
  '#FFD833': 'RH41', // Bright Yellow
  '#F15B32': 'RH50', // Orange
  '#59595B': 'RH60', // Dark Grey
  '#939598': 'RH61', // Light Grey
  '#D9D9D6': 'RH65', // Pale Grey
  '#231F20': 'RH70', // Black
  '#E8457E': 'RH90'  // Funky Pink
};

// AutoCAD Color Index mapping for TPV colors
const LAYER_COLORS = {
  'RH01': 1,   // Red
  'RH02': 1,   // Red
  'RH10': 3,   // Green
  'RH11': 3,   // Green
  'RH12': 3,   // Green
  'RH20': 5,   // Blue
  'RH21': 6,   // Magenta
  'RH22': 4,   // Cyan
  'RH23': 4,   // Cyan
  'RH26': 4,   // Cyan
  'RH30': 52,  // Tan
  'RH31': 7,   // White
  'RH32': 38,  // Brown
  'RH40': 2,   // Yellow
  'RH41': 2,   // Yellow
  'RH50': 30,  // Orange
  'RH60': 8,   // Grey
  'RH61': 8,   // Grey
  'RH65': 9,   // Light grey
  'RH70': 250, // Dark grey (nearly black)
  'RH90': 6,   // Magenta
  'OUTER_BORDER': 2, // Yellow
  'NOTES': 4,  // Cyan
  'TEXT_OUTLINES': 7, // White - text bounding boxes
  'OTHER_COLORS': 7   // White - non-TPV colors
};

/**
 * Generate DXF file content from SVG element
 * @param {SVGElement} svgElement - Cleaned SVG element (no selection UI)
 * @param {Object} options - Export options
 * @param {number} options.widthMm - Physical width in mm
 * @param {number} options.lengthMm - Physical length in mm
 * @param {string} options.designName - Design name for metadata
 * @param {string} options.seed - Generation seed (optional)
 * @returns {Object} { dxfContent: string, warnings: string[] }
 */
export function generateDXF(svgElement, options) {
  const { widthMm, lengthMm, designName = 'TPV Design', seed } = options;

  // Reset warnings for this export
  exportWarnings = [];

  // Create new DXF drawing
  const drawing = new Drawing();

  // Get SVG viewBox for coordinate transformation
  const viewBox = parseViewBox(svgElement);
  const scaleX = widthMm / viewBox.width;
  const scaleY = lengthMm / viewBox.height;

  // Track layers and their entities
  const layerEntities = new Map();

  // Process geometric elements (path, rect, circle, ellipse, polygon, polyline, line)
  const geoElements = svgElement.querySelectorAll('path, rect, circle, ellipse, polygon, polyline, line');

  let processedCount = 0;
  let skippedTransparent = 0;
  let skippedInvalid = 0;

  for (const el of geoElements) {
    // Skip invisible elements
    const display = el.getAttribute('display');
    const visibility = el.getAttribute('visibility');
    if (display === 'none' || visibility === 'hidden') continue;

    // Skip elements that are part of handles/UI (have specific classes)
    const className = el.getAttribute('class') || '';
    if (className.includes('handle') || className.includes('selection')) continue;

    // Get fill color and map to TPV code
    const fill = getElementFill(el);
    if (!fill || fill === 'none' || fill === 'transparent') {
      skippedTransparent++;
      continue;
    }

    const tpvCode = mapHexToTPVCode(fill);
    const layerName = tpvCode || 'OTHER_COLORS';

    // Get or create layer entities array
    if (!layerEntities.has(layerName)) {
      layerEntities.set(layerName, []);
    }

    // Convert element to polyline vertices
    let vertices;
    try {
      vertices = convertElementToVertices(el);
    } catch (err) {
      console.warn('[DXF] Error converting element:', err);
      skippedInvalid++;
      continue;
    }

    if (!vertices || vertices.length === 0) {
      skippedInvalid++;
      continue;
    }

    // Collect transforms from this element and all parent groups
    const fullTransform = collectTransforms(el);
    const transformedVertices = fullTransform
      ? transformVertices(vertices, fullTransform)
      : vertices;

    // Validate vertices - skip if any are invalid
    const validVertices = transformedVertices.filter(v =>
      isFinite(v.x) && isFinite(v.y) && !isNaN(v.x) && !isNaN(v.y)
    );

    if (validVertices.length < 2) {
      skippedInvalid++;
      continue;
    }

    // Scale and flip Y for DXF (SVG is Y-down, DXF is Y-up)
    const dxfVertices = validVertices.map(v => ({
      x: v.x * scaleX,
      y: lengthMm - (v.y * scaleY) // Flip Y axis
    }));

    layerEntities.get(layerName).push(dxfVertices);
    processedCount++;
  }

  // Check for text elements and warn user
  const textElements = svgElement.querySelectorAll('text');
  if (textElements.length > 0) {
    exportWarnings.push(`${textElements.length} text element(s) were converted to outlines. Edit text in CAD if needed.`);

    // Convert text to rectangles as placeholders
    for (const textEl of textElements) {
      try {
        const textBounds = getTextBounds(textEl, scaleX, scaleY, lengthMm);
        if (textBounds) {
          if (!layerEntities.has('TEXT_OUTLINES')) {
            layerEntities.set('TEXT_OUTLINES', []);
          }
          layerEntities.get('TEXT_OUTLINES').push(textBounds);
          processedCount++;
        }
      } catch (err) {
        console.warn('[DXF] Error converting text:', err);
      }
    }
  }

  // Check for image elements (motifs) and warn user
  const imageElements = svgElement.querySelectorAll('image');
  if (imageElements.length > 0) {
    exportWarnings.push(`${imageElements.length} motif(s)/image(s) could not be exported. Motifs are complex designs that require manual CAD import.`);
  }

  // Add layers to drawing
  for (const [layerName, entities] of layerEntities) {
    const aciColor = LAYER_COLORS[layerName] || 7; // Default to white
    try {
      drawing.addLayer(layerName, aciColor, 'CONTINUOUS');
      drawing.setActiveLayer(layerName);
    } catch (err) {
      console.warn(`[DXF] Error creating layer ${layerName}:`, err);
      continue;
    }

    for (const vertices of entities) {
      if (vertices.length >= 2) {
        try {
          // Check if closed (first and last point are same)
          const isClosed = vertices.length > 2 &&
            Math.abs(vertices[0].x - vertices[vertices.length - 1].x) < 0.01 &&
            Math.abs(vertices[0].y - vertices[vertices.length - 1].y) < 0.01;

          // Convert to array format for dxf-writer
          const pointArray = vertices.map(v => [v.x, v.y]);

          // Draw polyline (remove duplicate last point if closed)
          if (isClosed && pointArray.length > 1) {
            pointArray.pop();
          }

          // Validate point array before drawing
          const validPoints = pointArray.filter(p =>
            isFinite(p[0]) && isFinite(p[1]) && !isNaN(p[0]) && !isNaN(p[1])
          );

          if (validPoints.length >= 2) {
            drawing.drawPolyline(validPoints, isClosed);
          }
        } catch (err) {
          console.warn('[DXF] Error drawing polyline:', err);
        }
      }
    }
  }

  // Add OUTER_BORDER layer with surface boundary
  try {
    drawing.addLayer('OUTER_BORDER', LAYER_COLORS['OUTER_BORDER'], 'CONTINUOUS');
    drawing.setActiveLayer('OUTER_BORDER');
    drawing.drawPolyline([
      [0, 0],
      [widthMm, 0],
      [widthMm, lengthMm],
      [0, lengthMm]
    ], true);
  } catch (err) {
    console.warn('[DXF] Error adding border:', err);
  }

  // Add NOTES layer with metadata
  try {
    drawing.addLayer('NOTES', LAYER_COLORS['NOTES'], 'CONTINUOUS');
    drawing.setActiveLayer('NOTES');

    const metadata = [
      `Project: ${designName}`,
      `Size: ${(widthMm / 1000).toFixed(2)}m x ${(lengthMm / 1000).toFixed(2)}m`,
      `Generated: ${new Date().toISOString().split('T')[0]}`,
      seed ? `Seed: ${seed}` : null,
      'TPV Studio | rosehilltpv.com'
    ].filter(Boolean).join('\\P'); // \P is DXF line break

    // Position metadata below the surface
    drawing.drawText(10, -50, 100, 0, metadata);
  } catch (err) {
    console.warn('[DXF] Error adding notes:', err);
  }

  console.log(`[DXF] Export complete: ${processedCount} elements processed, ${skippedTransparent} transparent skipped, ${skippedInvalid} invalid skipped`);

  return {
    dxfContent: drawing.toDxfString(),
    warnings: exportWarnings
  };
}

/**
 * Collect all transform attributes from element up to root
 */
function collectTransforms(element) {
  const transforms = [];
  let current = element;

  while (current && current.getAttribute) {
    const transform = current.getAttribute('transform');
    if (transform) {
      transforms.unshift(transform); // Add to front so parent transforms come first
    }
    current = current.parentElement;
  }

  return transforms.length > 0 ? transforms.join(' ') : null;
}

/**
 * Get bounding box for text element and convert to DXF rectangle
 */
function getTextBounds(textEl, scaleX, scaleY, lengthMm) {
  try {
    // Try to get bounding box from browser
    const bbox = textEl.getBBox ? textEl.getBBox() : null;

    if (bbox && bbox.width > 0 && bbox.height > 0) {
      // Get transform
      const fullTransform = collectTransforms(textEl);

      // Create rectangle vertices
      let vertices = [
        { x: bbox.x, y: bbox.y },
        { x: bbox.x + bbox.width, y: bbox.y },
        { x: bbox.x + bbox.width, y: bbox.y + bbox.height },
        { x: bbox.x, y: bbox.y + bbox.height },
        { x: bbox.x, y: bbox.y } // Close
      ];

      // Apply transforms
      if (fullTransform) {
        vertices = transformVertices(vertices, fullTransform);
      }

      // Scale and flip Y
      return vertices.map(v => ({
        x: v.x * scaleX,
        y: lengthMm - (v.y * scaleY)
      }));
    }
  } catch (err) {
    console.warn('[DXF] Could not get text bounds:', err);
  }

  return null;
}

/**
 * Parse SVG viewBox attribute
 */
function parseViewBox(svgElement) {
  const viewBox = svgElement.getAttribute('viewBox');
  if (viewBox) {
    const [minX, minY, width, height] = viewBox.split(/\s+/).map(Number);
    return { minX, minY, width, height };
  }

  // Fallback to width/height attributes
  const width = parseFloat(svgElement.getAttribute('width')) || 1000;
  const height = parseFloat(svgElement.getAttribute('height')) || 1000;
  return { minX: 0, minY: 0, width, height };
}

/**
 * Get fill color from element (handles inline style and attribute)
 */
function getElementFill(el) {
  // Check inline style first
  const style = el.getAttribute('style');
  if (style) {
    const fillMatch = style.match(/fill:\s*([^;]+)/i);
    if (fillMatch) {
      return normalizeColor(fillMatch[1].trim());
    }
  }

  // Check fill attribute
  const fill = el.getAttribute('fill');
  if (fill) {
    return normalizeColor(fill);
  }

  // Default to black for paths without explicit fill
  return '#000000';
}

/**
 * Normalize color to uppercase hex format
 */
function normalizeColor(color) {
  if (!color) return null;

  // Already hex
  if (color.startsWith('#')) {
    // Convert 3-char hex to 6-char
    if (color.length === 4) {
      return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    return color.toUpperCase();
  }

  // RGB format
  const rgbMatch = color.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  }

  return color;
}

/**
 * Map hex color to TPV code (RHxx format)
 */
function mapHexToTPVCode(hex) {
  if (!hex) return null;

  const normalizedHex = hex.toUpperCase();

  // Direct match
  if (TPV_COLOR_MAP[normalizedHex]) {
    return TPV_COLOR_MAP[normalizedHex];
  }

  // Find closest color by RGB distance
  let closestCode = null;
  let minDistance = Infinity;

  const targetRgb = hexToRgb(normalizedHex);
  if (!targetRgb) return null;

  for (const [paletteHex, code] of Object.entries(TPV_COLOR_MAP)) {
    const paletteRgb = hexToRgb(paletteHex);
    if (!paletteRgb) continue;

    const distance = Math.sqrt(
      Math.pow(targetRgb.r - paletteRgb.r, 2) +
      Math.pow(targetRgb.g - paletteRgb.g, 2) +
      Math.pow(targetRgb.b - paletteRgb.b, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestCode = code;
    }
  }

  // Only return match if reasonably close (threshold of 50)
  return minDistance <= 50 ? closestCode : null;
}

/**
 * Convert hex color to RGB object
 */
function hexToRgb(hex) {
  if (!hex || !hex.startsWith('#')) return null;

  const match = hex.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return match ? {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16)
  } : null;
}

/**
 * Convert SVG element to polyline vertices
 */
function convertElementToVertices(el) {
  const tagName = el.tagName.toLowerCase();

  switch (tagName) {
    case 'path':
      const d = el.getAttribute('d');
      const polylines = pathToPolylines(d, 2); // 2mm tolerance
      // For now, return first polyline (or flatten all)
      return polylines.length > 0 ? polylines[0] : [];

    case 'rect':
      return rectToPolyline(
        el.getAttribute('x'),
        el.getAttribute('y'),
        el.getAttribute('width'),
        el.getAttribute('height'),
        el.getAttribute('rx'),
        el.getAttribute('ry')
      );

    case 'circle':
      return circleToPolyline(
        el.getAttribute('cx'),
        el.getAttribute('cy'),
        el.getAttribute('r'),
        32
      );

    case 'ellipse':
      return ellipseToPolyline(
        el.getAttribute('cx'),
        el.getAttribute('cy'),
        el.getAttribute('rx'),
        el.getAttribute('ry'),
        32
      );

    case 'polygon':
      return polygonToPolyline(el.getAttribute('points'));

    case 'polyline':
      return polylineToVertices(el.getAttribute('points'));

    case 'line':
      return lineToVertices(
        el.getAttribute('x1'),
        el.getAttribute('y1'),
        el.getAttribute('x2'),
        el.getAttribute('y2')
      );

    default:
      return [];
  }
}

/**
 * Download DXF content as file
 */
export function downloadDXF(dxfContent, filename = 'design.dxf') {
  const blob = new Blob([dxfContent], { type: 'application/dxf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Clean SVG element for DXF export (remove UI elements)
 */
export function cleanSvgForDxf(svgElement) {
  const clone = svgElement.cloneNode(true);

  // Remove selection indicators and handles
  const removeSelectors = [
    '.court-canvas__selection-outline',
    '.transform-handles',
    '.track-resize-handles',
    '[class*="selection"]',
    '[class*="handle"]',
    '[stroke-dasharray]'
  ];

  for (const selector of removeSelectors) {
    clone.querySelectorAll(selector).forEach(el => el.remove());
  }

  return clone;
}
