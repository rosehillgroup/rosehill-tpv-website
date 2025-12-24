/**
 * PDF Export Generator for TPV Studio - Sports Surface Designs
 * Creates professional PDF documents with design preview, element breakdown, and materials
 *
 * Uses unified PDF utilities for consistent branding with playground exports
 */

import { PDFDocument, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import {
  PDF_CONFIG,
  COLORS,
  MATERIAL_CONFIG,
  formatWeight,
  calculateBags,
  formatDate,
  drawHeader,
  drawFooter,
  drawColorSwatch,
  drawDimensionsPanel,
  drawMaterialRow,
  drawBinderSection,
  drawInstallationNotes,
  drawImageWithDimensions,
  drawBinderSectionWithEstimates,
  drawInstallationChecklist,
  drawSectionBox,
} from './unifiedPdfGenerator.js';

const { pageWidth: PAGE_WIDTH, pageHeight: PAGE_HEIGHT, margin: MARGIN, contentWidth: CONTENT_WIDTH } = PDF_CONFIG;

/**
 * Line marking area estimates by court type (as percentage of court area)
 * Based on typical line widths and lengths for each sport
 */
const LINE_MARKING_PERCENTAGES = {
  tennis: 0.03,        // ~3% of court area
  basketball: 0.04,    // ~4% (more lines)
  netball: 0.035,      // ~3.5%
  badminton: 0.025,    // ~2.5% (smaller court)
  volleyball: 0.02,    // ~2%
  futsal: 0.03,        // ~3%
  hockey: 0.025,       // ~2.5%
  default: 0.03,       // Default 3%
};

/**
 * Generate a complete PDF export for sports surface design
 */
export async function generateSportsSurfacePDF(data) {
  const { Resvg } = await import('@resvg/resvg-js');

  console.log('[SPORTS-PDF] Starting PDF generation...');

  const {
    svgString,
    designName = 'Sports Surface Design',
    surface,
    courts = {},
    tracks = {},
    shapes = {},
    texts = {},
    motifs = [],
    exclusionZones = {},
    dimensions,
  } = data;

  // Calculate dimensions
  const widthM = surface.width_mm / 1000;
  const lengthM = surface.length_mm / 1000;
  const boundingAreaM2 = widthM * lengthM;

  // Calculate effective surface area (accounting for custom boundary)
  let totalAreaM2 = boundingAreaM2;
  let hasCustomBoundary = false;

  if (surface.boundary && surface.boundary.type !== 'rectangle' && surface.boundary.controlPoints) {
    hasCustomBoundary = true;
    // Calculate polygon area using shoelace formula
    const points = surface.boundary.controlPoints;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    totalAreaM2 = Math.abs(area) / 2 * boundingAreaM2; // Normalized coords, scale by bounding area
  }

  // Calculate exclusion zone total area
  let exclusionAreaM2 = 0;
  const exclusionZoneCount = Object.keys(exclusionZones).length;
  for (const zone of Object.values(exclusionZones)) {
    if (zone.visible === false) continue;
    const zoneWidthM = (zone.width_mm || 0) / 1000;
    const zoneHeightM = (zone.height_mm || 0) / 1000;
    exclusionAreaM2 += zoneWidthM * zoneHeightM;
  }

  // Effective area after exclusions
  const effectiveAreaM2 = Math.max(0, totalAreaM2 - exclusionAreaM2);

  console.log('[SPORTS-PDF] Area breakdown:', {
    bounding: boundingAreaM2.toFixed(1),
    boundary: totalAreaM2.toFixed(1),
    exclusions: exclusionAreaM2.toFixed(1),
    effective: effectiveAreaM2.toFixed(1)
  });

  // Create PDF document
  const pdfDoc = await PDFDocument.create();

  // Set metadata
  pdfDoc.setTitle(`${designName} - TPV Studio Sports Surface`);
  pdfDoc.setAuthor('TPV Studio');
  pdfDoc.setSubject('Sports Surface Design Report');
  pdfDoc.setKeywords(['TPV', 'sports surface', 'athletics', 'Rosehill']);
  pdfDoc.setProducer('TPV Studio PDF Generator');
  pdfDoc.setCreator('TPV Studio');
  pdfDoc.setCreationDate(new Date());

  // Embed fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Render SVG to PNG
  console.log('[SPORTS-PDF] Rendering SVG to PNG...');
  const pngBuffer = await renderSvgToPng(svgString, dimensions, Resvg);
  const pngImage = await pdfDoc.embedPng(pngBuffer);

  // Calculate image dimensions to fit on page
  const maxImageWidth = CONTENT_WIDTH;
  const maxImageHeight = 280;
  const imageAspect = pngImage.width / pngImage.height;
  let imageWidth, imageHeight;

  if (imageAspect > maxImageWidth / maxImageHeight) {
    imageWidth = maxImageWidth;
    imageHeight = maxImageWidth / imageAspect;
  } else {
    imageHeight = maxImageHeight;
    imageWidth = maxImageHeight * imageAspect;
  }

  // Extract all known colors from the design (including shapes and texts)
  const knownColors = extractKnownColors(surface, courts, tracks, shapes, texts, motifs);
  console.log('[SPORTS-PDF] Known colors in design:', knownColors.length);

  // Calculate VISIBLE area percentages from the rendered image
  // This accounts for overlapping elements - only visible pixels are counted
  const visibleAreaPcts = await calculateVisibleAreaPercentages(pngBuffer, knownColors);

  // Calculate all materials upfront (for element breakdown display)
  // First calculate motif total area so we can subtract from base surface
  const motifTotalArea = motifs.reduce((sum, m) => sum + (m.areaM2 || 0), 0);
  console.log('[SPORTS-PDF] Total motif area:', motifTotalArea.toFixed(2), 'm²');

  const courtTrackMaterials = calculateMaterials(surface, courts, tracks, totalAreaM2, motifTotalArea);
  const motifMaterials = calculateMotifMaterials(motifs);
  const allMaterials = [...courtTrackMaterials, ...motifMaterials];

  // Calculate accurate materials based on visible area (for totals)
  const visibleMaterials = calculateMaterialsFromVisibleArea(visibleAreaPcts, knownColors, totalAreaM2);

  console.log('[SPORTS-PDF] Court/Track materials:', courtTrackMaterials.length);
  console.log('[SPORTS-PDF] Motif materials:', motifMaterials.length);

  const totalPages = 3;

  // ============================================================================
  // PAGE 1: Design Overview
  // ============================================================================
  console.log('[SPORTS-PDF] Creating Page 1: Design Overview');
  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  // Header
  y = drawHeader(page1, fontBold, fontRegular, y, 'Sports Surface Report');

  // Design info
  y -= 30;
  page1.drawText(designName, {
    x: MARGIN,
    y,
    size: 20,
    font: fontBold,
    color: COLORS.text,
  });

  y -= 20;
  page1.drawText(`Generated: ${formatDate()}`, {
    x: MARGIN,
    y,
    size: 11,
    font: fontRegular,
    color: COLORS.textLight,
  });

  // Dimensions panel (brief summary)
  y -= 25;
  y = drawDimensionsPanel(page1, fontBold, fontRegular, widthM, lengthM, y);

  // Design image with dimension annotations
  // Add extra left margin for vertical dimension line
  y -= 40; // Extra space for horizontal dimension line above
  const dimensionPadding = 50; // Space for dimension annotations
  const availableWidth = CONTENT_WIDTH - dimensionPadding;
  const scaledImageWidth = Math.min(imageWidth, availableWidth);
  const scaledImageHeight = imageHeight * (scaledImageWidth / imageWidth);
  const imageX = MARGIN + dimensionPadding + (availableWidth - scaledImageWidth) / 2;
  const imageY = y - scaledImageHeight;

  // Draw image with dimension lines and area badge
  drawImageWithDimensions(
    page1,
    pngImage,
    imageX,
    imageY,
    scaledImageWidth,
    scaledImageHeight,
    widthM,
    lengthM,
    fontRegular,
    fontBold
  );

  y = imageY - 35; // Move below area badge

  // Element summary
  const courtCount = Object.keys(courts).length;
  const trackCount = Object.keys(tracks).length;
  const motifCount = motifs.length;
  const elements = [];
  if (courtCount > 0) elements.push(`${courtCount} court${courtCount > 1 ? 's' : ''}`);
  if (trackCount > 0) elements.push(`${trackCount} track${trackCount > 1 ? 's' : ''}`);
  if (motifCount > 0) elements.push(`${motifCount} motif${motifCount > 1 ? 's' : ''}`);

  page1.drawText(`Design Elements: ${elements.length > 0 ? elements.join(', ') : 'Base surface only'}`, {
    x: MARGIN,
    y,
    size: 10,
    font: fontRegular,
    color: COLORS.textLight,
  });

  // Show exclusion zone info if any exist
  if (exclusionZoneCount > 0) {
    y -= 15;
    page1.drawText(`Exclusion Zones: ${exclusionZoneCount} (${exclusionAreaM2.toFixed(1)} m² excluded)`, {
      x: MARGIN,
      y,
      size: 10,
      font: fontRegular,
      color: COLORS.textLight,
    });
  }

  // Show custom boundary info if applicable
  if (hasCustomBoundary) {
    y -= 15;
    const boundaryType = surface.boundary.preset || 'Custom';
    page1.drawText(`Surface Shape: ${boundaryType.charAt(0).toUpperCase() + boundaryType.slice(1).replace('-', ' ')}`, {
      x: MARGIN,
      y,
      size: 10,
      font: fontRegular,
      color: COLORS.textLight,
    });
  }

  // Footer
  drawFooter(page1, fontRegular, 1, totalPages);

  // ============================================================================
  // PAGE 2: Element Breakdown
  // ============================================================================
  console.log('[SPORTS-PDF] Creating Page 2: Element Breakdown');
  const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;

  // Header
  y = drawHeader(page2, fontBold, fontRegular, y, 'Sports Surface Report');

  // Title
  y -= 30;
  page2.drawText('Element Breakdown', {
    x: MARGIN,
    y,
    size: 16,
    font: fontBold,
    color: COLORS.text,
  });

  // Table headers
  y -= 25;
  page2.drawText('Element', { x: MARGIN, y, size: 9, font: fontBold, color: COLORS.text });
  page2.drawText('Colour', { x: MARGIN + 180, y, size: 9, font: fontBold, color: COLORS.text });
  page2.drawText('Area (m\u00B2)', { x: MARGIN + 290, y, size: 9, font: fontBold, color: COLORS.text });
  page2.drawText('TPV (kg)', { x: MARGIN + 370, y, size: 9, font: fontBold, color: COLORS.text });
  page2.drawText('Bags', { x: MARGIN + 440, y, size: 9, font: fontBold, color: COLORS.text });

  y -= 8;
  page2.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 0.5,
    color: COLORS.border,
  });
  y -= 15;

  // Add section header if there are motifs
  if (motifMaterials.length > 0 && courtTrackMaterials.length > 0) {
    page2.drawText('Courts & Tracks', {
      x: MARGIN,
      y,
      size: 11,
      font: fontBold,
      color: COLORS.primary,
    });
    y -= 18;
  }

  // Draw each court/track material row
  for (const mat of courtTrackMaterials) {
    y = drawElementRow(page2, fontBold, fontRegular, mat, y);

    // Check if we need to break to avoid overflow
    if (y < 180) {
      page2.drawText('(continued on next page...)', {
        x: MARGIN,
        y: y - 10,
        size: 8,
        font: fontRegular,
        color: COLORS.textLight,
      });
      break;
    }
  }

  // ---- Playground Motifs Section ----
  if (motifMaterials.length > 0) {
    y -= 20;

    // Section header
    page2.drawText('Playground Motifs', {
      x: MARGIN,
      y,
      size: 11,
      font: fontBold,
      color: COLORS.primary,
    });

    y -= 5;
    page2.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 0.5,
      color: COLORS.primary,
    });
    y -= 15;

    // Group materials by motif
    const motifGroups = groupMaterialsByMotif(motifMaterials);

    for (const group of Object.values(motifGroups)) {
      // Check if we need to break to avoid overflow
      if (y < 120) {
        page2.drawText('(continued on next page...)', {
          x: MARGIN,
          y: y - 10,
          size: 8,
          font: fontRegular,
          color: COLORS.textLight,
        });
        break;
      }

      // Motif name as sub-header
      const totalMotifArea = group.materials.reduce((sum, m) => sum + m.area, 0);
      page2.drawText(`${group.name} (${totalMotifArea.toFixed(2)} m²)`, {
        x: MARGIN,
        y,
        size: 9,
        font: fontBold,
        color: COLORS.text,
      });

      if (group.dimensions) {
        page2.drawText(group.dimensions, {
          x: MARGIN + 200,
          y,
          size: 8,
          font: fontRegular,
          color: COLORS.textLight,
        });
      }

      y -= 15;

      // Draw each color row for this motif (indented)
      for (const mat of group.materials) {
        y = drawMotifColorRow(page2, fontBold, fontRegular, mat, y);

        if (y < 100) break;
      }

      y -= 5;
    }
  }

  // Totals row
  y -= 10;
  page2.drawLine({
    start: { x: MARGIN, y: y + 5 },
    end: { x: PAGE_WIDTH - MARGIN, y: y + 5 },
    thickness: 1,
    color: COLORS.border,
  });

  const totalKg = allMaterials.reduce((sum, m) => sum + m.kg, 0);
  const totalArea = allMaterials.reduce((sum, m) => sum + m.area, 0);

  y -= 5;
  page2.drawText('TOTAL', {
    x: MARGIN,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.text,
  });

  page2.drawText(`${totalArea.toFixed(1)}`, {
    x: MARGIN + 290,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.text,
  });

  page2.drawText(formatWeight(totalKg), {
    x: MARGIN + 370,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.primary,
  });

  page2.drawText(`${calculateBags(totalKg)}`, {
    x: MARGIN + 440,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.text,
  });

  // Footer
  drawFooter(page2, fontRegular, 2, totalPages);

  // ============================================================================
  // PAGE 3: Material Summary & Installation Notes
  // ============================================================================
  console.log('[SPORTS-PDF] Creating Page 3: Material Summary');
  const page3 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;

  // Header
  y = drawHeader(page3, fontBold, fontRegular, y, 'Sports Surface Report');

  // Title
  y -= 30;
  page3.drawText('Material Summary', {
    x: MARGIN,
    y,
    size: 16,
    font: fontBold,
    color: COLORS.text,
  });

  y -= 10;
  if (exclusionZoneCount > 0) {
    // Show both total and effective area when there are exclusions
    page3.drawText(`Surface Area: ${totalAreaM2.toFixed(1)} m\u00B2  |  Exclusions: ${exclusionAreaM2.toFixed(1)} m\u00B2  |  Effective: ${effectiveAreaM2.toFixed(1)} m\u00B2`, {
      x: MARGIN,
      y,
      size: 10,
      font: fontRegular,
      color: COLORS.textLight,
    });
  } else {
    page3.drawText(`Total Surface Area: ${totalAreaM2.toFixed(1)} m\u00B2`, {
      x: MARGIN,
      y,
      size: 11,
      font: fontRegular,
      color: COLORS.textLight,
    });
  }

  // Aggregate by colour
  y -= 30;
  page3.drawText('TPV Required by Colour:', {
    x: MARGIN,
    y,
    size: 11,
    font: fontBold,
    color: COLORS.text,
  });

  y -= 20;

  // Use VISIBLE materials for accurate totals (accounts for overlapping elements)
  // This is calculated from the rasterized image, showing only what's actually visible

  // Table header
  page3.drawText('Colour', { x: MARGIN, y, size: 9, font: fontBold, color: COLORS.text });
  page3.drawText('Area (m²)', { x: MARGIN + 180, y, size: 9, font: fontBold, color: COLORS.text });
  page3.drawText('Quantity', { x: MARGIN + 250, y, size: 9, font: fontBold, color: COLORS.text });
  page3.drawText('Bags (25kg)', { x: MARGIN + 330, y, size: 9, font: fontBold, color: COLORS.text });

  y -= 8;
  page3.drawLine({
    start: { x: MARGIN, y: y + 5 },
    end: { x: MARGIN + 400, y: y + 5 },
    thickness: 0.5,
    color: COLORS.border,
  });

  y -= 15;

  // visibleMaterials is already sorted by area descending
  for (const mat of visibleMaterials) {
    y = drawMaterialRow(page3, fontBold, fontRegular, MARGIN, y, {
      hex: mat.colour.hex,
      code: mat.colour.tpv_code,
      name: mat.colour.name,
      kg: mat.kg,
      area: mat.area,
      showBags: true,
      showArea: true,
    });
  }

  // Total row using visible materials (accurate totals)
  const visibleTotalKg = visibleMaterials.reduce((sum, m) => sum + m.kg, 0);
  const visibleTotalArea = visibleMaterials.reduce((sum, m) => sum + m.area, 0);

  y -= 5;
  page3.drawLine({
    start: { x: MARGIN, y: y + 12 },
    end: { x: MARGIN + 400, y: y + 12 },
    thickness: 1,
    color: COLORS.border,
  });

  y -= 5;
  page3.drawText('TOTAL TPV', {
    x: MARGIN + 28,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.text,
  });

  page3.drawText(`${visibleTotalArea.toFixed(1)}`, {
    x: MARGIN + 180,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.text,
  });

  page3.drawText(formatWeight(visibleTotalKg), {
    x: MARGIN + 250,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.primary,
  });

  page3.drawText(`${calculateBags(visibleTotalKg)} bags`, {
    x: MARGIN + 330,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.text,
  });

  // Binder section with calculated estimates for this design (using visible totals)
  y -= 25;
  y = drawBinderSectionWithEstimates(page3, fontBold, fontRegular, y, visibleTotalKg, totalAreaM2);

  // Installation checklist
  y -= 20;
  y = drawInstallationChecklist(page3, fontBold, fontRegular, y, 'sports');

  // Footer
  drawFooter(page3, fontRegular, 3, totalPages);

  // Save PDF
  console.log('[SPORTS-PDF] Saving PDF...');
  const pdfBytes = await pdfDoc.save();

  console.log(`[SPORTS-PDF] PDF generated: ${pdfBytes.length} bytes, ${pdfDoc.getPageCount()} pages`);

  return Buffer.from(pdfBytes);
}

/**
 * Render SVG to PNG using resvg
 */
async function renderSvgToPng(svgString, dimensions, Resvg) {
  const { widthMM = 5000, lengthMM = 5000 } = dimensions;

  // Calculate DPI based on surface size
  const maxDimension = Math.max(widthMM, lengthMM);
  let dpi = 150;
  if (maxDimension < 2000) dpi = 300;
  else if (maxDimension > 8000) dpi = 100;

  const widthInches = widthMM / 25.4;
  const widthPx = Math.round(widthInches * dpi);

  // Cap maximum resolution
  const maxPx = 4000;
  const finalWidth = Math.min(widthPx, maxPx);

  console.log(`[SPORTS-PDF] Rendering at ${finalWidth}px width (${dpi} DPI)`);

  const resvgOptions = {
    fitTo: {
      mode: 'width',
      value: finalWidth
    },
    font: {
      loadSystemFonts: false
    }
  };

  const resvg = new Resvg(svgString, resvgOptions);
  const pngData = resvg.render();
  return pngData.asPng();
}

/**
 * Calculate visible area percentages by counting pixels in the rendered PNG
 * This accounts for overlapping elements - only visible pixels are counted
 *
 * @param {Buffer} pngBuffer - Rendered PNG buffer
 * @param {Array} knownColors - Array of known TPV colors in the design [{hex, code, name}]
 * @returns {Object} Map of hex color to percentage of visible area
 */
async function calculateVisibleAreaPercentages(pngBuffer, knownColors) {
  console.log('[SPORTS-PDF] Calculating visible area from rasterized image...');

  // Get raw pixel data from PNG
  const { data, info } = await sharp(pngBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const totalPixels = width * height;

  console.log(`[SPORTS-PDF] Image: ${width}x${height}, ${channels} channels, ${totalPixels} pixels`);

  // Count pixels by color
  const colorCounts = new Map();
  let transparentPixels = 0;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = channels === 4 ? data[i + 3] : 255;

    // Skip transparent/semi-transparent pixels
    if (a < 128) {
      transparentPixels++;
      continue;
    }

    // Convert to hex
    const hex = rgbToHex(r, g, b);

    // Find nearest known TPV color
    const nearestColor = findNearestColor(hex, knownColors);
    const key = nearestColor.hex.toLowerCase();

    colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
  }

  // Convert counts to percentages
  const visiblePixels = totalPixels - transparentPixels;
  const visiblePcts = {};

  for (const [hex, count] of colorCounts) {
    visiblePcts[hex] = (count / visiblePixels) * 100;
  }

  console.log(`[SPORTS-PDF] Visible area breakdown:`, Object.entries(visiblePcts).map(([hex, pct]) => `${hex}: ${pct.toFixed(1)}%`).join(', '));

  return visiblePcts;
}

/**
 * Convert RGB values to hex string
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Find the nearest color from a list of known colors using simple RGB distance
 * @param {string} hex - Hex color to match
 * @param {Array} knownColors - Array of known colors [{hex, code, name}]
 * @returns {Object} The nearest known color
 */
function findNearestColor(hex, knownColors) {
  if (!knownColors || knownColors.length === 0) {
    return { hex, code: '', name: 'Unknown' };
  }

  // Parse input hex
  const r1 = parseInt(hex.slice(1, 3), 16);
  const g1 = parseInt(hex.slice(3, 5), 16);
  const b1 = parseInt(hex.slice(5, 7), 16);

  let nearest = knownColors[0];
  let minDistance = Infinity;

  for (const color of knownColors) {
    const colorHex = color.hex || '#000000';
    const r2 = parseInt(colorHex.slice(1, 3), 16);
    const g2 = parseInt(colorHex.slice(3, 5), 16);
    const b2 = parseInt(colorHex.slice(5, 7), 16);

    // Simple RGB Euclidean distance
    const distance = Math.sqrt(
      Math.pow(r1 - r2, 2) +
      Math.pow(g1 - g2, 2) +
      Math.pow(b1 - b2, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = color;
    }
  }

  return nearest;
}

/**
 * Extract all unique colors used in the design
 */
function extractKnownColors(surface, courts, tracks, shapes, texts, motifs) {
  const colors = new Map();

  // Surface color
  if (surface?.color?.hex) {
    colors.set(surface.color.hex.toLowerCase(), surface.color);
  }

  // Court colors
  for (const court of Object.values(courts || {})) {
    if (court.courtSurfaceColor?.hex) {
      colors.set(court.courtSurfaceColor.hex.toLowerCase(), court.courtSurfaceColor);
    }
    // Line colors
    if (court.lineColorOverrides) {
      for (const lineColor of Object.values(court.lineColorOverrides)) {
        if (lineColor?.hex) {
          colors.set(lineColor.hex.toLowerCase(), lineColor);
        }
      }
    }
  }

  // Track colors
  for (const track of Object.values(tracks || {})) {
    if (track.trackSurfaceColor?.hex) {
      colors.set(track.trackSurfaceColor.hex.toLowerCase(), track.trackSurfaceColor);
    }
    // Track line color
    if (track.trackLineColor?.hex) {
      colors.set(track.trackLineColor.hex.toLowerCase(), track.trackLineColor);
    }
  }
  // Lane markings default color (cream)
  colors.set('#f5f0dc', { hex: '#F5F0DC', tpv_code: 'RH31', name: 'Cream' });

  // Shape colors (polygon, blob, path)
  for (const shape of Object.values(shapes || {})) {
    // Skip hidden shapes
    if (shape.visible === false) continue;

    if (shape.fillColor?.hex) {
      colors.set(shape.fillColor.hex.toLowerCase(), shape.fillColor);
    }
    if (shape.strokeEnabled && shape.strokeColor?.hex) {
      colors.set(shape.strokeColor.hex.toLowerCase(), shape.strokeColor);
    }
  }

  // Text colors
  for (const text of Object.values(texts || {})) {
    // Skip hidden texts
    if (text.visible === false) continue;

    if (text.fillColor?.hex) {
      colors.set(text.fillColor.hex.toLowerCase(), text.fillColor);
    }
    if (text.strokeColor?.hex && text.strokeWidth_mm > 0) {
      colors.set(text.strokeColor.hex.toLowerCase(), text.strokeColor);
    }
  }

  // Motif colors (from recipes)
  for (const motif of (motifs || [])) {
    if (motif.recipes) {
      for (const recipe of motif.recipes) {
        if (recipe.blendColor?.hex) {
          colors.set(recipe.blendColor.hex.toLowerCase(), recipe.blendColor);
        }
        if (recipe.targetColor?.hex) {
          colors.set(recipe.targetColor.hex.toLowerCase(), recipe.targetColor);
        }
        // TPV component colors
        const components = recipe.chosenRecipe?.components || [];
        for (const comp of components) {
          if (comp.hex) {
            colors.set(comp.hex.toLowerCase(), { hex: comp.hex, tpv_code: comp.code, name: comp.name });
          }
        }
      }
    }
  }

  return Array.from(colors.values());
}

/**
 * Calculate materials based on visible area percentages from rasterization
 * This gives accurate totals that account for overlapping elements
 *
 * @param {Object} visiblePcts - Map of hex color to percentage of visible area
 * @param {Array} knownColors - Array of known colors [{hex, code, name}]
 * @param {number} totalAreaM2 - Total surface area in m²
 * @returns {Array} Array of material objects
 */
function calculateMaterialsFromVisibleArea(visiblePcts, knownColors, totalAreaM2) {
  const { densityKgPerM2, safetyMargin } = MATERIAL_CONFIG;
  const materials = [];

  // Create a map for quick color lookup
  const colorMap = new Map();
  for (const color of knownColors) {
    colorMap.set(color.hex.toLowerCase(), color);
  }

  // Calculate materials for each visible color
  for (const [hex, pct] of Object.entries(visiblePcts)) {
    if (pct <= 0) continue;

    const areaM2 = (pct / 100) * totalAreaM2;
    const kg = areaM2 * densityKgPerM2 * safetyMargin;

    const colorInfo = colorMap.get(hex) || { hex, tpv_code: '', name: 'Unknown' };

    materials.push({
      colour: {
        hex: colorInfo.hex || hex,
        tpv_code: colorInfo.tpv_code || colorInfo.code || '',
        name: colorInfo.name || 'Unknown',
      },
      area: areaM2,
      kg,
      percentage: pct,
    });
  }

  // Sort by area descending
  materials.sort((a, b) => b.area - a.area);

  console.log('[SPORTS-PDF] Visible materials calculated:', materials.map(m => `${m.colour.name}: ${m.area.toFixed(1)}m² (${m.percentage.toFixed(1)}%)`).join(', '));

  return materials;
}

/**
 * Calculate all materials with accurate geometry
 * @param {Object} surface - Surface configuration
 * @param {Object} courts - Courts object
 * @param {Object} tracks - Tracks object
 * @param {number} totalAreaM2 - Total surface area in m²
 * @param {number} motifTotalArea - Total area covered by motifs in m² (to subtract from base)
 */
function calculateMaterials(surface, courts, tracks, totalAreaM2, motifTotalArea = 0) {
  const { densityKgPerM2, safetyMargin } = MATERIAL_CONFIG;
  const materials = [];

  // Track used areas to calculate remaining base surface
  // Include motif area as "used" since motifs sit on top of the base
  let usedArea = motifTotalArea;

  // Process courts
  for (const courtId of Object.keys(courts)) {
    const court = courts[courtId];
    const template = court.template || {};
    const courtType = template.type || 'default';
    const scale = court.scale || 1;

    // Court dimensions
    const courtWidthM = (template.dimensions?.width_mm || 0) / 1000 * scale;
    const courtLengthM = (template.dimensions?.length_mm || 0) / 1000 * scale;
    const courtArea = courtWidthM * courtLengthM;
    usedArea += courtArea;

    // Court surface
    if (court.courtSurfaceColor) {
      const kg = courtArea * densityKgPerM2 * safetyMargin;
      materials.push({
        element: `${template.name || 'Court'} Surface`,
        elementType: 'court-surface',
        colour: court.courtSurfaceColor,
        area: courtArea,
        kg,
        dimensions: `${courtWidthM.toFixed(1)}m × ${courtLengthM.toFixed(1)}m`,
      });
    }

    // Line markings (using sport-specific percentages)
    // Courts use lineColorOverrides object, not a single lineColor
    const lineColors = court.lineColorOverrides ? Object.values(court.lineColorOverrides) : [];
    if (lineColors.length > 0) {
      const linePercent = LINE_MARKING_PERCENTAGES[courtType] || LINE_MARKING_PERCENTAGES.default;
      const lineArea = courtArea * linePercent;

      // Group line colors by hex to aggregate same colors
      const colorGroups = {};
      for (const color of lineColors) {
        const hex = color?.hex || '#FFFFFF';
        if (!colorGroups[hex]) {
          colorGroups[hex] = { color, count: 0 };
        }
        colorGroups[hex].count++;
      }

      // Calculate area per color based on proportion of markings
      const totalMarkings = lineColors.length;
      for (const [hex, group] of Object.entries(colorGroups)) {
        const colorProportion = group.count / totalMarkings;
        const colorArea = lineArea * colorProportion;
        const lineKg = colorArea * densityKgPerM2 * safetyMargin;

        materials.push({
          element: `${template.name || 'Court'} Lines`,
          elementType: 'line-marking',
          colour: group.color,
          area: colorArea,
          kg: lineKg,
          dimensions: `~${(linePercent * 100).toFixed(0)}% of court`,
        });
      }
    }
  }

  // Process tracks
  for (const trackId of Object.keys(tracks)) {
    const track = tracks[trackId];
    const template = track.template || {};
    const params = track.parameters || template.parameters || {};

    // Calculate track area from geometry if available
    let trackArea = 0;

    // Get number of lanes from parameters (stored as numLanes, not lanes)
    const numLanes = params.numLanes || template.parameters?.numLanes || 0;
    const laneWidthMm = params.laneWidth_mm || template.parameters?.laneWidth_mm || 1220;

    if (numLanes > 0) {
      const laneWidthM = laneWidthMm / 1000;

      // Check if it's a straight or curved track
      const isStraightTrack = template.trackType === 'straight';

      if (isStraightTrack) {
        // Straight track: width * length
        const trackWidthM = (params.width_mm || 0) / 1000;
        const trackLengthM = (params.height_mm || 0) / 1000;
        trackArea = trackWidthM * trackLengthM;
      } else {
        // Curved track: calculate from geometry
        const trackWidthM = (params.width_mm || 0) / 1000;
        const trackHeightM = (params.height_mm || 0) / 1000;
        const cornerRadius = params.cornerRadius?.topLeft || 0;
        const cornerRadiusM = cornerRadius / 1000;

        if (cornerRadiusM > 0) {
          // Track with bends: straights + semicircular bends
          const straightLengthM = trackWidthM - (2 * cornerRadiusM);
          const innerRadius = cornerRadiusM;
          const outerRadius = cornerRadiusM + (numLanes * laneWidthM);

          // Two straights
          const straightsArea = 2 * straightLengthM * numLanes * laneWidthM;
          // Two semicircular bends = one full circle
          const bendsArea = Math.PI * (outerRadius ** 2 - innerRadius ** 2);

          trackArea = straightsArea + bendsArea;
        } else {
          // Fallback: use bounding box
          trackArea = trackWidthM * trackHeightM * 0.7; // Approximate
        }
      }
    } else {
      // Fallback: estimate as percentage of total
      trackArea = totalAreaM2 * 0.25;
    }

    usedArea += trackArea;

    if (track.trackSurfaceColor) {
      const kg = trackArea * densityKgPerM2 * safetyMargin;
      materials.push({
        element: template.name || 'Running Track',
        elementType: 'track-surface',
        colour: track.trackSurfaceColor,
        area: trackArea,
        kg,
        dimensions: numLanes > 0 ? `${numLanes} lanes` : '',
      });
    }

    // Track lane markings (white lines - hardcoded in renderer)
    if (numLanes > 0) {
      const laneMarkArea = trackArea * 0.02; // ~2% for lane lines
      const laneKg = laneMarkArea * densityKgPerM2 * safetyMargin;

      materials.push({
        element: `${template.name || 'Track'} Lane Markings`,
        elementType: 'line-marking',
        colour: { hex: '#FFFFFF', tpv_code: 'RH31', name: 'Cream' }, // White/cream lines
        area: laneMarkArea,
        kg: laneKg,
        dimensions: '',
      });
    }
  }

  // Base surface (remaining area)
  const baseArea = Math.max(0, totalAreaM2 - usedArea);
  if (baseArea > 0 && surface.color) {
    const kg = baseArea * densityKgPerM2 * safetyMargin;
    materials.push({
      element: 'Base Surface',
      elementType: 'base-surface',
      colour: surface.color,
      area: baseArea,
      kg,
      dimensions: '',
    });
  }

  // Sort: base surface first, then by area descending
  materials.sort((a, b) => {
    if (a.elementType === 'base-surface') return -1;
    if (b.elementType === 'base-surface') return 1;
    return b.area - a.area;
  });

  return materials;
}

/**
 * Calculate materials for motifs (playground designs placed on sports surface)
 * Each motif has recipes from its source playground design
 */
function calculateMotifMaterials(motifs) {
  const { densityKgPerM2, safetyMargin } = MATERIAL_CONFIG;
  const materials = [];

  for (const motif of motifs) {
    if (!motif.recipes || motif.recipes.length === 0) {
      console.log(`[SPORTS-PDF] Motif ${motif.name} has no recipes, skipping`);
      continue;
    }

    console.log(`[SPORTS-PDF] Processing motif: ${motif.name} (${motif.areaM2.toFixed(2)} m²)`);

    for (const recipe of motif.recipes) {
      // Get the coverage percentage for this color in the design
      const areaPct = recipe.targetColor?.areaPct || recipe.originalColor?.areaPct || 0;
      if (areaPct <= 0) continue;

      // Calculate the actual area this color covers in the motif
      const colorArea = (areaPct / 100) * motif.areaM2;

      // Get the recipe components (TPV colors and their weights)
      const components = recipe.chosenRecipe?.components || [];
      if (components.length === 0) continue;

      // For each component in the recipe, calculate its material contribution
      for (const comp of components) {
        const weight = comp.weight || 1;
        const componentArea = colorArea * weight;
        const kg = componentArea * densityKgPerM2 * safetyMargin;

        materials.push({
          element: motif.name,
          elementType: 'motif-surface',
          motifId: motif.id,
          colour: {
            hex: recipe.blendColor?.hex || recipe.targetColor?.hex || '#808080',
            tpv_code: comp.code || '',
            name: comp.name || 'Unknown'
          },
          area: componentArea,
          kg,
          dimensions: `${motif.widthM?.toFixed(1) || '?'}m × ${motif.heightM?.toFixed(1) || '?'}m`,
          coverage: areaPct
        });
      }
    }
  }

  return materials;
}

/**
 * Group motif materials by motif name for display
 */
function groupMaterialsByMotif(materials) {
  const groups = {};
  for (const mat of materials) {
    const name = mat.element;
    if (!groups[name]) {
      groups[name] = {
        name,
        materials: [],
        totalArea: 0,
        dimensions: mat.dimensions
      };
    }
    groups[name].materials.push(mat);
    groups[name].totalArea += mat.area;
  }
  return groups;
}

/**
 * Aggregate materials by colour for summary table
 */
function aggregateMaterialsByColour(materials) {
  const totals = {};

  for (const mat of materials) {
    const hex = mat.colour?.hex || '#808080';
    const key = hex.toLowerCase();

    if (!totals[key]) {
      totals[key] = {
        hex,
        code: mat.colour?.tpv_code || '',
        name: mat.colour?.name || 'Unknown',
        kg: 0,
      };
    }

    totals[key].kg += mat.kg;
  }

  return totals;
}

/**
 * Draw an element row in the breakdown table
 */
function drawElementRow(page, fontBold, fontRegular, material, y) {
  // Element name
  page.drawText(material.element, {
    x: MARGIN,
    y: y - 2,
    size: 9,
    font: fontRegular,
    color: COLORS.text,
  });

  // Dimensions (smaller, below name)
  if (material.dimensions) {
    page.drawText(material.dimensions, {
      x: MARGIN,
      y: y - 12,
      size: 7,
      font: fontRegular,
      color: COLORS.textLight,
    });
  }

  // Colour swatch and name
  const hex = material.colour?.hex || '#808080';
  const colourName = material.colour?.name || 'Unknown';
  const colourCode = material.colour?.tpv_code || '';

  drawColorSwatch(page, MARGIN + 180, y - 8, hex, 18, 10);

  page.drawText(colourCode ? `${colourCode} ${colourName}` : colourName, {
    x: MARGIN + 205,
    y: y - 2,
    size: 8,
    font: fontRegular,
    color: COLORS.text,
  });

  // Area
  page.drawText(material.area.toFixed(1), {
    x: MARGIN + 290,
    y: y - 2,
    size: 9,
    font: fontRegular,
    color: COLORS.text,
  });

  // TPV kg
  page.drawText(material.kg.toFixed(0), {
    x: MARGIN + 370,
    y: y - 2,
    size: 9,
    font: fontRegular,
    color: COLORS.text,
  });

  // Bags
  page.drawText(calculateBags(material.kg).toString(), {
    x: MARGIN + 440,
    y: y - 2,
    size: 9,
    font: fontRegular,
    color: COLORS.textLight,
  });

  return y - (material.dimensions ? 24 : 18);
}

/**
 * Draw a motif color row (indented, simpler format)
 */
function drawMotifColorRow(page, fontBold, fontRegular, material, y) {
  const indent = 15;

  // Colour swatch and name
  const hex = material.colour?.hex || '#808080';
  const colourName = material.colour?.name || 'Unknown';
  const colourCode = material.colour?.tpv_code || '';

  drawColorSwatch(page, MARGIN + indent, y - 8, hex, 16, 9);

  page.drawText(colourCode ? `${colourCode} ${colourName}` : colourName, {
    x: MARGIN + indent + 22,
    y: y - 2,
    size: 8,
    font: fontRegular,
    color: COLORS.text,
  });

  // Area
  page.drawText(`${material.area.toFixed(2)} m²`, {
    x: MARGIN + 290,
    y: y - 2,
    size: 8,
    font: fontRegular,
    color: COLORS.text,
  });

  // TPV kg
  page.drawText(`${material.kg.toFixed(0)} kg`, {
    x: MARGIN + 370,
    y: y - 2,
    size: 8,
    font: fontRegular,
    color: COLORS.text,
  });

  // Bags
  page.drawText(`${calculateBags(material.kg)}`, {
    x: MARGIN + 440,
    y: y - 2,
    size: 8,
    font: fontRegular,
    color: COLORS.textLight,
  });

  return y - 15;
}

export {
  calculateMaterials,
  aggregateMaterialsByColour,
};
