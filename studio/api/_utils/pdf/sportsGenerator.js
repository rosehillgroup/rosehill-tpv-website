/**
 * PDF Export Generator for TPV Studio - Sports Surface Designs
 * Creates professional PDF documents with design preview, element breakdown, and materials
 *
 * Uses unified PDF utilities for consistent branding with playground exports
 */

import { PDFDocument, StandardFonts } from 'pdf-lib';
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
    dimensions,
  } = data;

  // Calculate dimensions
  const widthM = surface.width_mm / 1000;
  const lengthM = surface.length_mm / 1000;
  const totalAreaM2 = widthM * lengthM;

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

  // Calculate all materials upfront
  const materials = calculateMaterials(surface, courts, tracks, totalAreaM2);
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

  // Dimensions panel
  y -= 30;
  y = drawDimensionsPanel(page1, fontBold, fontRegular, widthM, lengthM, y);

  // Design image
  y -= 25;
  const imageX = MARGIN + (CONTENT_WIDTH - imageWidth) / 2;
  page1.drawImage(pngImage, {
    x: imageX,
    y: y - imageHeight,
    width: imageWidth,
    height: imageHeight,
  });
  y -= imageHeight + 20;

  // Element summary
  const courtCount = Object.keys(courts).length;
  const trackCount = Object.keys(tracks).length;
  const elements = [];
  if (courtCount > 0) elements.push(`${courtCount} court${courtCount > 1 ? 's' : ''}`);
  if (trackCount > 0) elements.push(`${trackCount} track${trackCount > 1 ? 's' : ''}`);

  page1.drawText(`Design Elements: ${elements.length > 0 ? elements.join(', ') : 'Base surface only'}`, {
    x: MARGIN,
    y,
    size: 10,
    font: fontRegular,
    color: COLORS.textLight,
  });

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

  // Draw each material row
  for (const mat of materials) {
    y = drawElementRow(page2, fontBold, fontRegular, mat, y);

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
  }

  // Totals row
  y -= 10;
  page2.drawLine({
    start: { x: MARGIN, y: y + 5 },
    end: { x: PAGE_WIDTH - MARGIN, y: y + 5 },
    thickness: 1,
    color: COLORS.border,
  });

  const totalKg = materials.reduce((sum, m) => sum + m.kg, 0);
  const totalArea = materials.reduce((sum, m) => sum + m.area, 0);

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
  page3.drawText(`Total Surface Area: ${totalAreaM2.toFixed(1)} m\u00B2`, {
    x: MARGIN,
    y,
    size: 11,
    font: fontRegular,
    color: COLORS.textLight,
  });

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

  // Group materials by colour
  const colourTotals = aggregateMaterialsByColour(materials);

  // Table header
  page3.drawText('Colour', { x: MARGIN, y, size: 9, font: fontBold, color: COLORS.text });
  page3.drawText('Quantity', { x: MARGIN + 220, y, size: 9, font: fontBold, color: COLORS.text });
  page3.drawText('Bags (25kg)', { x: MARGIN + 300, y, size: 9, font: fontBold, color: COLORS.text });

  y -= 8;
  page3.drawLine({
    start: { x: MARGIN, y: y + 5 },
    end: { x: MARGIN + 380, y: y + 5 },
    thickness: 0.5,
    color: COLORS.border,
  });

  y -= 15;

  // Sort by quantity descending
  const sortedColours = Object.values(colourTotals).sort((a, b) => b.kg - a.kg);

  for (const colour of sortedColours) {
    y = drawMaterialRow(page3, fontBold, fontRegular, MARGIN, y, {
      hex: colour.hex,
      code: colour.code,
      name: colour.name,
      kg: colour.kg,
      showBags: true,
    });
  }

  // Total row
  y -= 5;
  page3.drawLine({
    start: { x: MARGIN, y: y + 12 },
    end: { x: MARGIN + 380, y: y + 12 },
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

  page3.drawText(formatWeight(totalKg), {
    x: MARGIN + 220,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.primary,
  });

  page3.drawText(`${calculateBags(totalKg)} bags`, {
    x: MARGIN + 300,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.text,
  });

  // Binder section
  y -= 25;
  y = drawBinderSection(page3, fontBold, fontRegular, y, totalKg, 'sports');

  // Installation notes
  y -= 30;
  y = drawInstallationNotes(page3, fontBold, fontRegular, y, 'sports');

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
 * Calculate all materials with accurate geometry
 */
function calculateMaterials(surface, courts, tracks, totalAreaM2) {
  const { densityKgPerM2, safetyMargin } = MATERIAL_CONFIG;
  const materials = [];

  // Track used areas to calculate remaining base surface
  let usedArea = 0;

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
    if (court.lineColor) {
      const linePercent = LINE_MARKING_PERCENTAGES[courtType] || LINE_MARKING_PERCENTAGES.default;
      const lineArea = courtArea * linePercent;
      const lineKg = lineArea * densityKgPerM2 * safetyMargin;

      materials.push({
        element: `${template.name || 'Court'} Lines`,
        elementType: 'line-marking',
        colour: court.lineColor,
        area: lineArea,
        kg: lineKg,
        dimensions: `~${(linePercent * 100).toFixed(0)}% of court`,
      });
    }
  }

  // Process tracks
  for (const trackId of Object.keys(tracks)) {
    const track = tracks[trackId];
    const template = track.template || {};

    // Calculate track area from geometry if available
    let trackArea = 0;

    if (template.lanes && template.laneWidth) {
      // Running track: use lane geometry
      const lanes = template.lanes || 6;
      const laneWidthM = (template.laneWidth || 1220) / 1000;
      const straightLengthM = (template.straightLength || 84390) / 1000;
      const bendRadiusM = (template.bendRadius || 36500) / 1000;

      // Track area = (straights) + (bends)
      // Each straight: lanes * laneWidth * straightLength * 2
      // Each bend: pi * (outer_radius^2 - inner_radius^2) / 2 * 2
      const straightsArea = lanes * laneWidthM * straightLengthM * 2;
      const innerRadius = bendRadiusM;
      const outerRadius = bendRadiusM + (lanes * laneWidthM);
      const bendsArea = Math.PI * (outerRadius ** 2 - innerRadius ** 2);

      trackArea = straightsArea + bendsArea;
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
        dimensions: template.lanes ? `${template.lanes} lanes` : '',
      });
    }

    // Track lane markings if applicable
    if (track.laneMarkingColor && template.lanes) {
      const laneMarkArea = trackArea * 0.02; // ~2% for lane lines
      const laneKg = laneMarkArea * densityKgPerM2 * safetyMargin;

      materials.push({
        element: 'Lane Markings',
        elementType: 'line-marking',
        colour: track.laneMarkingColor,
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

export {
  calculateMaterials,
  aggregateMaterialsByColour,
};
