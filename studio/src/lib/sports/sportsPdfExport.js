/**
 * Sports Surface PDF Export Generator
 * Creates professional PDF reports for sports surface designs
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Page dimensions (A4 in points)
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

// Brand colours
const COLORS = {
  primary: rgb(0.118, 0.306, 0.478),      // #1e4e7a
  accent: rgb(1, 0.420, 0.208),           // #ff6b35
  text: rgb(0.102, 0.125, 0.173),         // #1a202c
  textLight: rgb(0.392, 0.455, 0.545),    // #64748b
  border: rgb(0.894, 0.914, 0.941),       // #e4e9f0
};

// Material constants
const TPV_DENSITY_KG_PER_M2 = 8; // kg/m² at 20mm depth
const SAFETY_MARGIN = 1.1; // 10% extra

/**
 * Generate PDF report for a sports surface design
 */
export async function generateSportsPDF(svgElement, designState, designName) {
  console.log('[SPORTS-PDF] Starting PDF generation...');

  const pdfDoc = await PDFDocument.create();

  // Set metadata
  pdfDoc.setTitle(`${designName || 'Sports Surface'} - TPV Studio`);
  pdfDoc.setAuthor('TPV Studio');
  pdfDoc.setSubject('Sports Surface Design Report');
  pdfDoc.setCreator('Rosehill TPV Studio');
  pdfDoc.setCreationDate(new Date());

  // Embed fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Capture canvas as PNG
  const pngDataUrl = await captureCanvasAsPng(svgElement);
  const pngBytes = dataUrlToBytes(pngDataUrl);
  const pngImage = await pdfDoc.embedPng(pngBytes);

  // Calculate image dimensions
  const maxImageWidth = CONTENT_WIDTH;
  const maxImageHeight = 300;
  const imageAspect = pngImage.width / pngImage.height;
  let imageWidth, imageHeight;

  if (imageAspect > maxImageWidth / maxImageHeight) {
    imageWidth = maxImageWidth;
    imageHeight = maxImageWidth / imageAspect;
  } else {
    imageHeight = maxImageHeight;
    imageWidth = maxImageHeight * imageAspect;
  }

  // Extract data from design state
  const surface = designState.surface;
  const courts = designState.courts || {};
  const tracks = designState.tracks || {};

  const surfaceWidthM = surface.width_mm / 1000;
  const surfaceLengthM = surface.length_mm / 1000;
  const totalAreaM2 = surfaceWidthM * surfaceLengthM;

  // ============================================================================
  // PAGE 1: Design Overview
  // ============================================================================
  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  // Header
  y = drawHeader(page1, fontBold, fontRegular, y);

  // Title
  y -= 30;
  page1.drawText(designName || 'Sports Surface Design', {
    x: MARGIN,
    y,
    size: 20,
    font: fontBold,
    color: COLORS.text,
  });

  // Date
  y -= 20;
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  page1.drawText(`Generated: ${dateStr}`, {
    x: MARGIN,
    y,
    size: 11,
    font: fontRegular,
    color: COLORS.textLight,
  });

  // Dimensions panel
  y -= 30;
  y = drawDimensionsPanel(page1, fontBold, fontRegular, surfaceWidthM, surfaceLengthM, totalAreaM2, y);

  // Design image
  y -= 20;
  const imageX = MARGIN + (CONTENT_WIDTH - imageWidth) / 2;
  page1.drawImage(pngImage, {
    x: imageX,
    y: y - imageHeight,
    width: imageWidth,
    height: imageHeight,
  });
  y -= imageHeight + 15;

  // Element count
  const courtCount = Object.keys(courts).length;
  const trackCount = Object.keys(tracks).length;
  const elementSummary = [];
  if (courtCount > 0) elementSummary.push(`${courtCount} court${courtCount > 1 ? 's' : ''}`);
  if (trackCount > 0) elementSummary.push(`${trackCount} track${trackCount > 1 ? 's' : ''}`);

  page1.drawText(`This design contains: ${elementSummary.join(', ') || 'No elements'}`, {
    x: MARGIN,
    y,
    size: 10,
    font: fontRegular,
    color: COLORS.textLight,
  });

  // Footer
  drawFooter(page1, fontRegular, 1, 2);

  // ============================================================================
  // PAGE 2: Materials & Quantities
  // ============================================================================
  const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;

  // Header
  y = drawHeader(page2, fontBold, fontRegular, y);

  // Title
  y -= 30;
  page2.drawText('Material Requirements', {
    x: MARGIN,
    y,
    size: 16,
    font: fontBold,
    color: COLORS.text,
  });

  // Surface colour
  y -= 30;
  page2.drawText('Surface Base', {
    x: MARGIN,
    y,
    size: 12,
    font: fontBold,
    color: COLORS.text,
  });

  y -= 20;
  y = drawColourRow(page2, fontRegular, surface.color, totalAreaM2, y);

  // Courts section
  if (courtCount > 0) {
    y -= 25;
    page2.drawText('Courts', {
      x: MARGIN,
      y,
      size: 12,
      font: fontBold,
      color: COLORS.text,
    });

    y -= 20;
    for (const courtId of Object.keys(courts)) {
      const court = courts[courtId];
      const courtName = court.template?.name || 'Court';
      const courtWidthM = (court.template?.dimensions?.width_mm || 0) / 1000;
      const courtLengthM = (court.template?.dimensions?.length_mm || 0) / 1000;
      const courtArea = courtWidthM * courtLengthM * (court.scale || 1) ** 2;

      // Court name and dimensions
      page2.drawText(`${courtName} (${courtWidthM.toFixed(1)}m × ${courtLengthM.toFixed(1)}m)`, {
        x: MARGIN,
        y,
        size: 10,
        font: fontRegular,
        color: COLORS.text,
      });
      y -= 15;

      // Court surface colour if set
      if (court.courtSurfaceColor) {
        y = drawColourRow(page2, fontRegular, court.courtSurfaceColor, courtArea, y, 'Court Surface');
      }

      // Line colour
      if (court.lineColor) {
        y = drawColourRow(page2, fontRegular, court.lineColor, courtArea * 0.05, y, 'Line Markings');
      }

      y -= 10;
    }
  }

  // Tracks section
  if (trackCount > 0) {
    y -= 15;
    page2.drawText('Running Tracks', {
      x: MARGIN,
      y,
      size: 12,
      font: fontBold,
      color: COLORS.text,
    });

    y -= 20;
    for (const trackId of Object.keys(tracks)) {
      const track = tracks[trackId];
      const trackName = track.template?.name || 'Track';

      page2.drawText(trackName, {
        x: MARGIN,
        y,
        size: 10,
        font: fontRegular,
        color: COLORS.text,
      });
      y -= 15;

      if (track.trackSurfaceColor) {
        // Estimate track area (simplified)
        const trackArea = totalAreaM2 * 0.3; // Rough estimate
        y = drawColourRow(page2, fontRegular, track.trackSurfaceColor, trackArea, y, 'Track Surface');
      }

      y -= 10;
    }
  }

  // Total estimate
  y -= 20;
  page2.drawLine({
    start: { x: MARGIN, y: y + 10 },
    end: { x: PAGE_WIDTH - MARGIN, y: y + 10 },
    thickness: 0.5,
    color: COLORS.border,
  });

  const totalKg = totalAreaM2 * TPV_DENSITY_KG_PER_M2 * SAFETY_MARGIN;
  page2.drawText('Estimated Total TPV Required:', {
    x: MARGIN,
    y,
    size: 11,
    font: fontBold,
    color: COLORS.text,
  });
  page2.drawText(`${totalKg.toFixed(0)} kg`, {
    x: MARGIN + 200,
    y,
    size: 11,
    font: fontBold,
    color: COLORS.primary,
  });

  // Notes
  y -= 40;
  page2.drawText('Installation Notes', {
    x: MARGIN,
    y,
    size: 12,
    font: fontBold,
    color: COLORS.text,
  });

  y -= 20;
  const notes = [
    '• Quantities include 10% safety margin for wastage',
    '• Calculated for 20mm depth (adjust for 15mm or 25mm installations)',
    '• Line marking quantities are estimates based on typical coverage',
    '• Contact Rosehill for binder requirements and technical support',
    '• Ensure sub-base meets World Athletics/governing body standards',
  ];

  for (const note of notes) {
    page2.drawText(note, {
      x: MARGIN,
      y,
      size: 9,
      font: fontRegular,
      color: COLORS.textLight,
    });
    y -= 14;
  }

  // Footer
  drawFooter(page2, fontRegular, 2, 2);

  // Save and return
  const pdfBytes = await pdfDoc.save();
  console.log(`[SPORTS-PDF] Generated ${pdfBytes.length} bytes`);

  return pdfBytes;
}

/**
 * Convert data URL to Uint8Array (without using fetch)
 */
function dataUrlToBytes(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Capture SVG canvas as PNG data URL
 */
async function captureCanvasAsPng(svgElement) {
  return new Promise((resolve, reject) => {
    try {
      const svgClone = svgElement.cloneNode(true);

      // Remove selection indicators
      svgClone.querySelectorAll('[class*="selected"], .transform-handles, .track-resize-handles').forEach(el => {
        el.remove();
      });

      // Get dimensions
      const viewBox = svgElement.getAttribute('viewBox').split(' ').map(Number);
      const width = 1600;
      const height = Math.round((viewBox[3] / viewBox[2]) * width);

      svgClone.setAttribute('width', width);
      svgClone.setAttribute('height', height);

      const svgString = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to render SVG'));
      };

      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Draw page header
 */
function drawHeader(page, fontBold, fontRegular, y) {
  page.drawText('ROSEHILL', {
    x: MARGIN,
    y,
    size: 14,
    font: fontBold,
    color: COLORS.primary,
  });

  page.drawText('TPV STUDIO', {
    x: MARGIN + 75,
    y,
    size: 14,
    font: fontRegular,
    color: COLORS.accent,
  });

  page.drawText('Sports Surface Report', {
    x: PAGE_WIDTH - MARGIN - 120,
    y,
    size: 10,
    font: fontRegular,
    color: COLORS.textLight,
  });

  y -= 15;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 1,
    color: COLORS.border,
  });

  return y;
}

/**
 * Draw page footer
 */
function drawFooter(page, fontRegular, pageNum, totalPages) {
  const y = 30;

  page.drawText(`Page ${pageNum} of ${totalPages}`, {
    x: MARGIN,
    y,
    size: 9,
    font: fontRegular,
    color: COLORS.textLight,
  });

  page.drawText('www.rosehilltpv.com', {
    x: PAGE_WIDTH - MARGIN - 100,
    y,
    size: 9,
    font: fontRegular,
    color: COLORS.textLight,
  });
}

/**
 * Draw dimensions panel
 */
function drawDimensionsPanel(page, fontBold, fontRegular, widthM, lengthM, areaM2, y) {
  page.drawText('Surface Dimensions', {
    x: MARGIN,
    y,
    size: 11,
    font: fontBold,
    color: COLORS.text,
  });

  y -= 18;
  page.drawText(`${widthM.toFixed(1)}m × ${lengthM.toFixed(1)}m  (${areaM2.toFixed(1)} m²)`, {
    x: MARGIN,
    y,
    size: 10,
    font: fontRegular,
    color: COLORS.textLight,
  });

  return y;
}

/**
 * Draw a colour row with swatch and quantity
 */
function drawColourRow(page, fontRegular, colour, areaM2, y, label = null) {
  const hex = colour?.hex || '#808080';
  const name = colour?.name || 'Unknown';
  const code = colour?.tpv_code || '';

  // Parse hex
  const hexClean = hex.replace('#', '');
  const r = parseInt(hexClean.substring(0, 2), 16) / 255;
  const g = parseInt(hexClean.substring(2, 4), 16) / 255;
  const b = parseInt(hexClean.substring(4, 6), 16) / 255;

  // Colour swatch
  page.drawRectangle({
    x: MARGIN + 10,
    y: y - 6,
    width: 18,
    height: 10,
    color: rgb(r, g, b),
    borderColor: COLORS.border,
    borderWidth: 0.5,
  });

  // Label or code + name
  const displayText = label
    ? `${label}: ${code} ${name}`
    : `${code} ${name}`;

  page.drawText(displayText, {
    x: MARGIN + 35,
    y: y - 2,
    size: 9,
    font: fontRegular,
    color: COLORS.text,
  });

  // Quantity
  const kg = areaM2 * TPV_DENSITY_KG_PER_M2 * SAFETY_MARGIN;
  page.drawText(`${kg.toFixed(1)} kg`, {
    x: MARGIN + 350,
    y: y - 2,
    size: 9,
    font: fontRegular,
    color: COLORS.textLight,
  });

  return y - 18;
}

/**
 * Download PDF bytes as file
 */
export function downloadPDF(pdfBytes, filename) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
