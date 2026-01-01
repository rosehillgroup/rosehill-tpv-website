/**
 * TPV Studio - Canvas PDF Generator
 * Generates PDF with design at 1:100 scale with dimension annotations
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { COLORS, formatDate, drawDimensionLine } from './unifiedPdfGenerator.js';

// Scale ratio: 1:100 means 1mm real = 0.01mm on paper
const SCALE_RATIO = 100;

// Points per mm (1 point = 0.352778mm, so 1mm = 2.835 points)
const MM_TO_POINTS = 2.835;

// Margin and annotation space in points
const MARGIN = 40;
const ANNOTATION_SPACE = 50;
const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 30;

/**
 * Generate a PDF with the design rendered at 1:100 scale
 * @param {Object} data - Export data
 * @param {string} data.svgString - SVG content
 * @param {string} data.designName - Design name
 * @param {number} data.widthMm - Physical width in mm
 * @param {number} data.lengthMm - Physical length in mm
 * @param {string} data.designType - 'sports' or 'playground'
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function generateCanvasPDF(data) {
  const { Resvg } = await import('@resvg/resvg-js');

  const { svgString, designName, widthMm, lengthMm, designType = 'sports' } = data;

  // Calculate paper dimensions at 1:100 scale
  // e.g., 50m (50000mm) → 500mm on paper → 1417.5 points
  const paperWidthMm = widthMm / SCALE_RATIO;
  const paperLengthMm = lengthMm / SCALE_RATIO;

  const paperWidthPts = paperWidthMm * MM_TO_POINTS;
  const paperLengthPts = paperLengthMm * MM_TO_POINTS;

  // Calculate total page size with margins and annotations
  const totalPageWidth = paperWidthPts + (2 * MARGIN) + ANNOTATION_SPACE;
  const totalPageHeight = paperLengthPts + (2 * MARGIN) + HEADER_HEIGHT + FOOTER_HEIGHT;

  // Create PDF document
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`${designName} - Canvas Export 1:100`);
  pdfDoc.setAuthor('TPV Studio');
  pdfDoc.setSubject(`Sports Surface Design - ${(widthMm / 1000).toFixed(1)}m x ${(lengthMm / 1000).toFixed(1)}m`);
  pdfDoc.setCreator('TPV Studio by Rosehill');

  // Embed fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Render SVG to PNG using resvg
  const pngBuffer = await renderSvgToPng(svgString, widthMm, lengthMm, Resvg);
  const pngImage = await pdfDoc.embedPng(pngBuffer);

  // Create page with custom dimensions
  const page = pdfDoc.addPage([totalPageWidth, totalPageHeight]);

  // Calculate image position
  const imageX = MARGIN + ANNOTATION_SPACE / 2;
  const imageY = MARGIN + FOOTER_HEIGHT;

  // =========================================================================
  // HEADER
  // =========================================================================
  const headerY = totalPageHeight - MARGIN;

  // Design name (title)
  page.drawText(designName, {
    x: MARGIN,
    y: headerY - 5,
    size: 16,
    font: fontBold,
    color: COLORS.text,
  });

  // Scale indicator
  page.drawText('Scale 1:100', {
    x: MARGIN,
    y: headerY - 22,
    size: 10,
    font: fontRegular,
    color: COLORS.textLight,
  });

  // Real dimensions
  page.drawText(`Real size: ${(widthMm / 1000).toFixed(1)}m × ${(lengthMm / 1000).toFixed(1)}m`, {
    x: MARGIN + 80,
    y: headerY - 22,
    size: 10,
    font: fontRegular,
    color: COLORS.textLight,
  });

  // Generated date (right aligned)
  const dateText = `Generated: ${formatDate()}`;
  const dateWidth = fontRegular.widthOfTextAtSize(dateText, 9);
  page.drawText(dateText, {
    x: totalPageWidth - MARGIN - dateWidth,
    y: headerY - 5,
    size: 9,
    font: fontRegular,
    color: COLORS.textLight,
  });

  // =========================================================================
  // DESIGN IMAGE
  // =========================================================================
  page.drawImage(pngImage, {
    x: imageX,
    y: imageY,
    width: paperWidthPts,
    height: paperLengthPts,
  });

  // Border around design
  page.drawRectangle({
    x: imageX,
    y: imageY,
    width: paperWidthPts,
    height: paperLengthPts,
    borderColor: COLORS.border,
    borderWidth: 0.5,
  });

  // =========================================================================
  // DIMENSION ANNOTATIONS
  // =========================================================================
  const dimOffset = 20;

  // Width dimension (horizontal, above image)
  const widthLabel = `${(widthMm / 1000).toFixed(2)} m`;
  drawDimensionLine(
    page,
    imageX,
    imageY + paperLengthPts + dimOffset,
    imageX + paperWidthPts,
    imageY + paperLengthPts + dimOffset,
    widthLabel,
    'horizontal',
    fontRegular,
    { fontSize: 9 }
  );

  // Length dimension (vertical, left of image)
  const lengthLabel = `${(lengthMm / 1000).toFixed(2)} m`;
  drawDimensionLine(
    page,
    imageX - dimOffset,
    imageY,
    imageX - dimOffset,
    imageY + paperLengthPts,
    lengthLabel,
    'vertical',
    fontRegular,
    { fontSize: 9 }
  );

  // =========================================================================
  // FOOTER
  // =========================================================================
  page.drawText('TPV Studio | www.rosehilltpv.com', {
    x: MARGIN,
    y: MARGIN - 5,
    size: 8,
    font: fontRegular,
    color: COLORS.textLight,
  });

  // Type indicator
  const typeText = designType === 'sports' ? 'Sports Surface Design' : 'Playground Design';
  const typeWidth = fontRegular.widthOfTextAtSize(typeText, 8);
  page.drawText(typeText, {
    x: totalPageWidth - MARGIN - typeWidth,
    y: MARGIN - 5,
    size: 8,
    font: fontRegular,
    color: COLORS.textLight,
  });

  // Generate PDF bytes
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Render SVG to PNG buffer at appropriate resolution for 1:100 scale
 */
async function renderSvgToPng(svgString, widthMm, lengthMm, Resvg) {
  // Calculate target resolution
  // At 1:100 scale with 300 DPI printing:
  // paperWidthMm = widthMm / 100
  // pixels = (paperWidthMm / 25.4) * 300
  const paperWidthMm = widthMm / SCALE_RATIO;
  const targetDpi = 300;
  const widthPx = Math.round((paperWidthMm / 25.4) * targetDpi);

  // Cap at reasonable maximum to avoid memory issues
  const maxPx = 6000;
  const finalWidth = Math.min(widthPx, maxPx);

  try {
    const resvg = new Resvg(svgString, {
      fitTo: {
        mode: 'width',
        value: finalWidth,
      },
      font: {
        loadSystemFonts: false,
      },
      logLevel: 'off',
    });

    const pngData = resvg.render();
    return pngData.asPng();
  } catch (error) {
    console.error('[CANVAS-PDF] SVG render error:', error);
    throw new Error('Failed to render design to image');
  }
}
