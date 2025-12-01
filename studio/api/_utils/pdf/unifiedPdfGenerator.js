/**
 * Unified PDF Generator Utilities for TPV Studio
 * Shared constants, helpers, and drawing functions used by both
 * playground and sports surface PDF generators
 */

import { rgb } from 'pdf-lib';

// ============================================================================
// CONSTANTS
// ============================================================================

// Page dimensions (A4 in points: 595.28 x 841.89)
export const PDF_CONFIG = {
  pageWidth: 595.28,
  pageHeight: 841.89,
  margin: 40,
  contentWidth: 515.28, // pageWidth - (margin * 2)
};

// Brand colours
export const COLORS = {
  primary: rgb(0.118, 0.306, 0.478),      // #1e4e7a - Rosehill navy
  accent: rgb(1, 0.420, 0.208),           // #ff6b35 - Rosehill orange
  text: rgb(0.102, 0.125, 0.173),         // #1a202c - Dark text
  textLight: rgb(0.392, 0.455, 0.545),    // #64748b - Light text
  border: rgb(0.894, 0.914, 0.941),       // #e4e9f0 - Borders
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0),
  success: rgb(0.063, 0.725, 0.506),      // #10b981 - Green
  warning: rgb(0.961, 0.620, 0.043),      // #f59e0b - Amber
};

// Material calculation constants
export const MATERIAL_CONFIG = {
  densityKgPerM2: 8,      // kg/m² at 20mm depth
  safetyMargin: 1.1,      // 10% extra for wastage
  bagSizeKg: 25,          // Standard bag size
  binderCoverageM2PerKg: 16, // Flexilon coverage
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parse hex colour to RGB values (0-1 range)
 */
export function hexToRgb(hex) {
  const hexClean = hex.replace('#', '');
  const r = parseInt(hexClean.substring(0, 2), 16) / 255;
  const g = parseInt(hexClean.substring(2, 4), 16) / 255;
  const b = parseInt(hexClean.substring(4, 6), 16) / 255;
  return { r, g, b };
}

/**
 * Format weight with appropriate units
 * Returns "X.X kg" for smaller values, "X.XX tonnes" for larger
 */
export function formatWeight(kg) {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} tonnes`;
  }
  return `${kg.toFixed(1)} kg`;
}

/**
 * Calculate number of bags needed (25kg bags)
 */
export function calculateBags(kg) {
  return Math.ceil(kg / MATERIAL_CONFIG.bagSizeKg);
}

/**
 * Format date in UK style
 */
export function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Calculate binder requirements based on total TPV
 * Returns object with product name, quantity, and notes
 */
export function calculateBinder(totalKg, surfaceType = 'playground') {
  // Binder typically 8-10% of TPV weight for outdoor applications
  const binderRatio = surfaceType === 'sports' ? 0.10 : 0.08;
  const binderKg = totalKg * binderRatio;

  // Flexilon PU-600 is the standard binder
  return {
    product: 'Flexilon PU-600',
    quantity: Math.ceil(binderKg),
    coverage: MATERIAL_CONFIG.binderCoverageM2PerKg,
    notes: 'Based on standard 20mm depth installation',
  };
}

/**
 * Calculate primer requirements if applicable
 */
export function calculatePrimer(areaM2, subbaseType = 'asphalt') {
  // Primer coverage is approximately 4-6 m²/litre depending on porosity
  const coverageM2PerLitre = subbaseType === 'concrete' ? 6 : 4;
  const litresNeeded = Math.ceil(areaM2 / coverageM2PerLitre);

  return {
    product: 'Flexilon Primer',
    quantity: litresNeeded,
    unit: 'litres',
    coverage: coverageM2PerLitre,
    notes: `For ${subbaseType} subbase`,
  };
}

// ============================================================================
// DRAWING FUNCTIONS
// ============================================================================

/**
 * Draw standard page header with Rosehill branding
 * @param {PDFPage} page - The PDF page to draw on
 * @param {PDFFont} fontBold - Bold font
 * @param {PDFFont} fontRegular - Regular font
 * @param {number} y - Starting Y position
 * @param {string} reportType - e.g., 'Playground Design' or 'Sports Surface'
 * @returns {number} New Y position after header
 */
export function drawHeader(page, fontBold, fontRegular, y, reportType = '') {
  const { margin, pageWidth } = PDF_CONFIG;

  // Logo text
  page.drawText('ROSEHILL', {
    x: margin,
    y,
    size: 14,
    font: fontBold,
    color: COLORS.primary,
  });

  page.drawText('TPV STUDIO', {
    x: margin + 75,
    y,
    size: 14,
    font: fontRegular,
    color: COLORS.accent,
  });

  // Report type on right side
  if (reportType) {
    const textWidth = fontRegular.widthOfTextAtSize(reportType, 10);
    page.drawText(reportType, {
      x: pageWidth - margin - textWidth,
      y,
      size: 10,
      font: fontRegular,
      color: COLORS.textLight,
    });
  }

  // Divider line
  y -= 15;
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1,
    color: COLORS.border,
  });

  return y;
}

/**
 * Draw standard page footer
 * @param {PDFPage} page - The PDF page
 * @param {PDFFont} fontRegular - Regular font
 * @param {number} pageNum - Current page number
 * @param {number} totalPages - Total pages (optional)
 */
export function drawFooter(page, fontRegular, pageNum, totalPages = null) {
  const { margin, pageWidth } = PDF_CONFIG;
  const y = 30;

  const pageText = totalPages
    ? `Page ${pageNum} of ${totalPages}`
    : `Page ${pageNum}`;

  page.drawText(pageText, {
    x: margin,
    y,
    size: 9,
    font: fontRegular,
    color: COLORS.textLight,
  });

  page.drawText('www.rosehilltpv.com', {
    x: pageWidth - margin - 100,
    y,
    size: 9,
    font: fontRegular,
    color: COLORS.textLight,
  });
}

/**
 * Draw a colour swatch (rounded rectangle with border)
 * @param {PDFPage} page - The PDF page
 * @param {number} x - X position
 * @param {number} y - Y position (bottom of swatch)
 * @param {string} hex - Hex colour code
 * @param {number} width - Swatch width (default 20)
 * @param {number} height - Swatch height (default 12)
 */
export function drawColorSwatch(page, x, y, hex, width = 20, height = 12) {
  const { r, g, b } = hexToRgb(hex);

  // Calculate a slightly darker border colour
  const darkenFactor = 0.8;
  const borderR = r * darkenFactor;
  const borderG = g * darkenFactor;
  const borderB = b * darkenFactor;

  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: rgb(r, g, b),
    borderColor: rgb(borderR, borderG, borderB),
    borderWidth: 0.75,
  });
}

/**
 * Draw dimensions panel (used on page 1 of both PDFs)
 */
export function drawDimensionsPanel(page, fontBold, fontRegular, widthM, lengthM, y) {
  const { margin } = PDF_CONFIG;
  const areaM2 = widthM * lengthM;

  page.drawText('Surface Dimensions', {
    x: margin,
    y,
    size: 11,
    font: fontBold,
    color: COLORS.text,
  });

  y -= 18;
  const widthMM = widthM * 1000;
  const lengthMM = lengthM * 1000;

  page.drawText(`Width: ${widthM.toFixed(2)}m (${widthMM.toFixed(0)}mm)    Length: ${lengthM.toFixed(2)}m (${lengthMM.toFixed(0)}mm)    Area: ${areaM2.toFixed(2)} m\u00B2`, {
    x: margin,
    y,
    size: 10,
    font: fontRegular,
    color: COLORS.textLight,
  });

  return y;
}

/**
 * Draw a material row with swatch, name, and quantity
 * Used in material totals section
 */
export function drawMaterialRow(page, fontBold, fontRegular, x, y, options) {
  const {
    hex = '#808080',
    code = '',
    name = 'Unknown',
    kg = 0,
    showBags = true,
    isTotal = false,
  } = options;

  // Colour swatch
  drawColorSwatch(page, x, y - 8, hex, 18, 10);

  // Code and name
  const labelText = code ? `${code} - ${name}` : name;
  page.drawText(labelText, {
    x: x + 28,
    y: y - 2,
    size: isTotal ? 10 : 9,
    font: isTotal ? fontBold : fontRegular,
    color: COLORS.text,
  });

  // Quantity
  const kgText = formatWeight(kg);
  page.drawText(kgText, {
    x: x + 220,
    y: y - 2,
    size: isTotal ? 10 : 9,
    font: isTotal ? fontBold : fontRegular,
    color: isTotal ? COLORS.primary : COLORS.text,
  });

  // Bags (optional)
  if (showBags && kg > 0) {
    const bags = calculateBags(kg);
    page.drawText(`${bags} bags`, {
      x: x + 300,
      y: y - 2,
      size: 9,
      font: fontRegular,
      color: COLORS.textLight,
    });
  }

  return y - 18;
}

/**
 * Draw binder requirements section
 */
export function drawBinderSection(page, fontBold, fontRegular, y, totalKg, surfaceType) {
  const { margin } = PDF_CONFIG;
  const binder = calculateBinder(totalKg, surfaceType);

  y -= 10;
  page.drawLine({
    start: { x: margin, y: y + 5 },
    end: { x: margin + 380, y: y + 5 },
    thickness: 0.5,
    color: COLORS.border,
  });

  y -= 15;
  page.drawText('Binder Requirements', {
    x: margin,
    y,
    size: 11,
    font: fontBold,
    color: COLORS.text,
  });

  y -= 18;
  page.drawText(`${binder.product}:`, {
    x: margin,
    y,
    size: 10,
    font: fontRegular,
    color: COLORS.text,
  });

  page.drawText(`${binder.quantity} kg`, {
    x: margin + 150,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.primary,
  });

  page.drawText(`(${calculateBags(binder.quantity)} bags)`, {
    x: margin + 220,
    y,
    size: 9,
    font: fontRegular,
    color: COLORS.textLight,
  });

  y -= 14;
  page.drawText(`Coverage: ${binder.coverage} m\u00B2/kg  |  ${binder.notes}`, {
    x: margin,
    y,
    size: 8,
    font: fontRegular,
    color: COLORS.textLight,
  });

  return y;
}

/**
 * Draw installation notes section
 */
export function drawInstallationNotes(page, fontBold, fontRegular, y, surfaceType = 'playground') {
  const { margin } = PDF_CONFIG;

  page.drawText('Installation Notes', {
    x: margin,
    y,
    size: 12,
    font: fontBold,
    color: COLORS.text,
  });

  y -= 18;

  const notes = [
    'Quantities include 10% safety margin for wastage and trimming',
    'Based on 20mm installation depth (8 kg/m\u00B2). Adjust for 15mm or 25mm as needed',
    'Coverage percentages are estimates; actual may vary with installation conditions',
    'Consult Rosehill technical team for specific binder and primer recommendations',
    'Ensure sub-base is properly prepared and meets relevant standards',
    'Store TPV granules in dry conditions away from direct sunlight',
  ];

  // Add sports-specific notes
  if (surfaceType === 'sports') {
    notes.push('Line marking quantities are estimates based on typical court/track layouts');
  }

  for (const note of notes) {
    page.drawText(`\u2022 ${note}`, {
      x: margin,
      y,
      size: 9,
      font: fontRegular,
      color: COLORS.textLight,
    });
    y -= 14;
  }

  return y;
}

/**
 * Calculate rows that can fit on a page for tables
 * @param {number} startY - Starting Y position
 * @param {number} rowHeight - Height per row
 * @param {number} bottomMargin - Space to leave at bottom (for footer)
 * @returns {number} Number of rows that fit
 */
export function calculateRowsPerPage(startY, rowHeight = 22, bottomMargin = 80) {
  const availableHeight = startY - bottomMargin;
  return Math.floor(availableHeight / rowHeight);
}
