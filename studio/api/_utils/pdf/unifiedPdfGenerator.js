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
  rowAlt: rgb(0.973, 0.976, 0.984),       // #f8f9fb - Alternating row bg
  dimensionLine: rgb(0.4, 0.4, 0.4),      // #666666 - Dimension lines
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
 * Draw binder and ancillary requirements section
 * Shows generic application rate ranges rather than specific product calculations
 */
export function drawBinderSection(page, fontBold, fontRegular, y) {
  const { margin } = PDF_CONFIG;

  y -= 10;
  page.drawLine({
    start: { x: margin, y: y + 5 },
    end: { x: margin + 420, y: y + 5 },
    thickness: 0.5,
    color: COLORS.border,
  });

  y -= 15;
  page.drawText('Binder & Ancillary Requirements', {
    x: margin,
    y,
    size: 11,
    font: fontBold,
    color: COLORS.text,
  });

  // Binder usage rates
  y -= 20;
  page.drawText('Binder usage rates (% of TPV weight):', {
    x: margin,
    y,
    size: 9,
    font: fontBold,
    color: COLORS.text,
  });

  y -= 14;
  page.drawText('\u2022 Wet pour installations: 12-20%', {
    x: margin + 10,
    y,
    size: 9,
    font: fontRegular,
    color: COLORS.text,
  });

  y -= 12;
  page.drawText('\u2022 Paver applications: 10-12%', {
    x: margin + 10,
    y,
    size: 9,
    font: fontRegular,
    color: COLORS.text,
  });

  y -= 12;
  page.drawText('\u2022 Compression moulding: 6%', {
    x: margin + 10,
    y,
    size: 9,
    font: fontRegular,
    color: COLORS.text,
  });

  // Primer and pre-treatment
  y -= 18;
  page.drawText('Primer coverage: 2-3 m\u00B2/kg', {
    x: margin,
    y,
    size: 9,
    font: fontRegular,
    color: COLORS.text,
  });

  y -= 14;
  page.drawText('Pre-treatment: 1-2% of rubber weight', {
    x: margin,
    y,
    size: 9,
    font: fontRegular,
    color: COLORS.text,
  });

  // Contact note
  y -= 18;
  page.drawText('Contact Rosehill for specific product recommendations based on climate and application.', {
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

// ============================================================================
// DIMENSION ANNOTATION FUNCTIONS
// ============================================================================

/**
 * Draw an arrow head at the specified position
 * @param {PDFPage} page - The PDF page
 * @param {number} x - X position of arrow tip
 * @param {number} y - Y position of arrow tip
 * @param {'left'|'right'|'up'|'down'} direction - Direction arrow points
 * @param {number} size - Size of arrow head (default 5)
 */
export function drawArrowHead(page, x, y, direction, size = 5) {
  const points = [];

  switch (direction) {
    case 'left':
      points.push({ x, y }); // Tip
      points.push({ x: x + size, y: y - size / 2 });
      points.push({ x: x + size, y: y + size / 2 });
      break;
    case 'right':
      points.push({ x, y }); // Tip
      points.push({ x: x - size, y: y - size / 2 });
      points.push({ x: x - size, y: y + size / 2 });
      break;
    case 'up':
      points.push({ x, y }); // Tip
      points.push({ x: x - size / 2, y: y - size });
      points.push({ x: x + size / 2, y: y - size });
      break;
    case 'down':
      points.push({ x, y }); // Tip
      points.push({ x: x - size / 2, y: y + size });
      points.push({ x: x + size / 2, y: y + size });
      break;
  }

  // Draw filled triangle
  if (points.length === 3) {
    // Draw as lines forming a triangle (pdf-lib doesn't have built-in polygon fill)
    page.drawLine({
      start: points[0],
      end: points[1],
      thickness: 1,
      color: COLORS.dimensionLine,
    });
    page.drawLine({
      start: points[1],
      end: points[2],
      thickness: 1,
      color: COLORS.dimensionLine,
    });
    page.drawLine({
      start: points[2],
      end: points[0],
      thickness: 1,
      color: COLORS.dimensionLine,
    });
  }
}

/**
 * Draw a dimension line with arrows at both ends and a label
 * @param {PDFPage} page - The PDF page
 * @param {number} x1 - Start X
 * @param {number} y1 - Start Y
 * @param {number} x2 - End X
 * @param {number} y2 - End Y
 * @param {string} label - Dimension text (e.g., "15.00m")
 * @param {'horizontal'|'vertical'} orientation - Line orientation
 * @param {PDFFont} font - Font for label
 * @param {Object} options - Additional options
 */
export function drawDimensionLine(page, x1, y1, x2, y2, label, orientation, font, options = {}) {
  const { fontSize = 9, arrowSize = 4, labelOffset = 8 } = options;

  // Draw the main line
  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness: 0.5,
    color: COLORS.dimensionLine,
  });

  // Draw arrow heads at both ends
  if (orientation === 'horizontal') {
    drawArrowHead(page, x1, y1, 'left', arrowSize);
    drawArrowHead(page, x2, y2, 'right', arrowSize);

    // Draw label centered above the line
    const labelWidth = font.widthOfTextAtSize(label, fontSize);
    const labelX = (x1 + x2) / 2 - labelWidth / 2;
    const labelY = y1 + labelOffset;

    // Draw white background for label
    page.drawRectangle({
      x: labelX - 3,
      y: labelY - 2,
      width: labelWidth + 6,
      height: fontSize + 4,
      color: COLORS.white,
    });

    page.drawText(label, {
      x: labelX,
      y: labelY,
      size: fontSize,
      font,
      color: COLORS.dimensionLine,
    });
  } else {
    // Vertical
    drawArrowHead(page, x1, y1, 'down', arrowSize);
    drawArrowHead(page, x2, y2, 'up', arrowSize);

    // Draw label centered to the left of the line, rotated
    // For simplicity, we'll draw it horizontally to the left
    const labelWidth = font.widthOfTextAtSize(label, fontSize);
    const midY = (y1 + y2) / 2;
    const labelX = x1 - labelOffset - labelWidth;
    const labelY = midY - fontSize / 2;

    // Draw white background for label
    page.drawRectangle({
      x: labelX - 3,
      y: labelY - 2,
      width: labelWidth + 6,
      height: fontSize + 4,
      color: COLORS.white,
    });

    page.drawText(label, {
      x: labelX,
      y: labelY,
      size: fontSize,
      font,
      color: COLORS.dimensionLine,
    });
  }

  // Draw small perpendicular lines at ends (extension lines)
  const extLength = 4;
  if (orientation === 'horizontal') {
    page.drawLine({
      start: { x: x1, y: y1 - extLength },
      end: { x: x1, y: y1 + extLength },
      thickness: 0.5,
      color: COLORS.dimensionLine,
    });
    page.drawLine({
      start: { x: x2, y: y2 - extLength },
      end: { x: x2, y: y2 + extLength },
      thickness: 0.5,
      color: COLORS.dimensionLine,
    });
  } else {
    page.drawLine({
      start: { x: x1 - extLength, y: y1 },
      end: { x: x1 + extLength, y: y1 },
      thickness: 0.5,
      color: COLORS.dimensionLine,
    });
    page.drawLine({
      start: { x: x2 - extLength, y: y2 },
      end: { x: x2 + extLength, y: y2 },
      thickness: 0.5,
      color: COLORS.dimensionLine,
    });
  }
}

/**
 * Draw design image with dimension annotations
 * @param {PDFPage} page - The PDF page
 * @param {Object} pngImage - Embedded PNG image
 * @param {number} imageX - Image X position
 * @param {number} imageY - Image Y position (bottom)
 * @param {number} imageWidth - Image width
 * @param {number} imageHeight - Image height
 * @param {number} widthM - Width in metres
 * @param {number} lengthM - Length in metres
 * @param {PDFFont} fontRegular - Regular font for labels
 * @param {PDFFont} fontBold - Bold font for area badge
 */
export function drawImageWithDimensions(page, pngImage, imageX, imageY, imageWidth, imageHeight, widthM, lengthM, fontRegular, fontBold) {
  const padding = 20; // Space between image and dimension lines

  // Draw the design image
  page.drawImage(pngImage, {
    x: imageX,
    y: imageY,
    width: imageWidth,
    height: imageHeight,
  });

  // Width dimension (horizontal, above image)
  drawDimensionLine(
    page,
    imageX,
    imageY + imageHeight + padding,
    imageX + imageWidth,
    imageY + imageHeight + padding,
    `${widthM.toFixed(2)}m`,
    'horizontal',
    fontRegular
  );

  // Length dimension (vertical, left of image)
  drawDimensionLine(
    page,
    imageX - padding,
    imageY,
    imageX - padding,
    imageY + imageHeight,
    `${lengthM.toFixed(2)}m`,
    'vertical',
    fontRegular
  );

  // Area badge (below image, centred)
  const areaM2 = widthM * lengthM;
  const areaText = `Total Area: ${areaM2.toFixed(2)} m\u00B2`;
  const areaWidth = fontBold.widthOfTextAtSize(areaText, 10) + 16;
  const badgeHeight = 18;
  const badgeX = imageX + (imageWidth - areaWidth) / 2;
  const badgeY = imageY - 25;

  // Draw badge background
  page.drawRectangle({
    x: badgeX,
    y: badgeY,
    width: areaWidth,
    height: badgeHeight,
    color: COLORS.primary,
  });

  // Draw badge text
  page.drawText(areaText, {
    x: badgeX + 8,
    y: badgeY + 5,
    size: 10,
    font: fontBold,
    color: COLORS.white,
  });
}

/**
 * Draw a checklist item with checkbox
 * @param {PDFPage} page - The PDF page
 * @param {number} x - X position
 * @param {number} y - Y position (baseline)
 * @param {string} text - Checkbox text
 * @param {PDFFont} font - Font for text
 * @param {boolean} checked - Whether checkbox is checked (visual only)
 */
export function drawChecklistItem(page, x, y, text, font, checked = false) {
  const boxSize = 8;

  // Draw checkbox square
  page.drawRectangle({
    x,
    y: y - 6,
    width: boxSize,
    height: boxSize,
    borderColor: COLORS.textLight,
    borderWidth: 0.5,
    color: checked ? COLORS.primary : COLORS.white,
  });

  // Draw checkmark if checked
  if (checked) {
    page.drawLine({
      start: { x: x + 2, y: y - 2 },
      end: { x: x + 4, y: y - 4 },
      thickness: 1,
      color: COLORS.white,
    });
    page.drawLine({
      start: { x: x + 4, y: y - 4 },
      end: { x: x + 7, y: y + 1 },
      thickness: 1,
      color: COLORS.white,
    });
  }

  // Draw text
  page.drawText(text, {
    x: x + boxSize + 6,
    y: y - 2,
    size: 9,
    font,
    color: COLORS.text,
  });

  return y - 16;
}

/**
 * Draw a section box with title header
 * @param {PDFPage} page - The PDF page
 * @param {number} x - X position
 * @param {number} y - Y position (top)
 * @param {number} width - Box width
 * @param {number} height - Box height
 * @param {string} title - Section title
 * @param {PDFFont} fontBold - Bold font for title
 * @returns {number} Y position inside box (for content)
 */
export function drawSectionBox(page, x, y, width, height, title, fontBold) {
  const headerHeight = 22;

  // Draw main box border
  page.drawRectangle({
    x,
    y: y - height,
    width,
    height,
    borderColor: COLORS.border,
    borderWidth: 1,
    color: COLORS.white,
  });

  // Draw header background
  page.drawRectangle({
    x: x + 0.5,
    y: y - headerHeight,
    width: width - 1,
    height: headerHeight - 0.5,
    color: COLORS.primary,
  });

  // Draw header text
  page.drawText(title, {
    x: x + 10,
    y: y - headerHeight + 6,
    size: 11,
    font: fontBold,
    color: COLORS.white,
  });

  // Return Y position for content (below header)
  return y - headerHeight - 10;
}

/**
 * Draw improved binder section with calculated estimates for the specific design
 * @param {PDFPage} page - The PDF page
 * @param {PDFFont} fontBold - Bold font
 * @param {PDFFont} fontRegular - Regular font
 * @param {number} y - Starting Y position
 * @param {number} totalKg - Total TPV weight in kg
 * @param {number} areaM2 - Total area in square metres
 * @returns {number} New Y position
 */
export function drawBinderSectionWithEstimates(page, fontBold, fontRegular, y, totalKg, areaM2) {
  const { margin } = PDF_CONFIG;
  const boxWidth = 480;
  const boxHeight = 140;

  // Draw section box
  const contentY = drawSectionBox(page, margin, y, boxWidth, boxHeight, 'BINDER & ANCILLARY REQUIREMENTS', fontBold);

  let innerY = contentY;
  const col1 = margin + 15;
  const col2 = margin + 220;

  // Wet pour section
  page.drawText('Wet Pour Installation', {
    x: col1,
    y: innerY,
    size: 10,
    font: fontBold,
    color: COLORS.text,
  });

  page.drawText('Binder: 12-20% of TPV weight', {
    x: col2,
    y: innerY,
    size: 9,
    font: fontRegular,
    color: COLORS.textLight,
  });

  innerY -= 14;
  const binderMin = Math.ceil(totalKg * 0.12);
  const binderMax = Math.ceil(totalKg * 0.20);
  page.drawText(`For this design:`, {
    x: col1,
    y: innerY,
    size: 9,
    font: fontRegular,
    color: COLORS.text,
  });

  page.drawText(`Est. ${binderMin}-${binderMax} kg`, {
    x: col2,
    y: innerY,
    size: 10,
    font: fontBold,
    color: COLORS.primary,
  });

  // Divider
  innerY -= 18;
  page.drawLine({
    start: { x: col1, y: innerY + 5 },
    end: { x: margin + boxWidth - 15, y: innerY + 5 },
    thickness: 0.5,
    color: COLORS.border,
  });

  // Primer section
  innerY -= 10;
  page.drawText('Primer (if required)', {
    x: col1,
    y: innerY,
    size: 10,
    font: fontBold,
    color: COLORS.text,
  });

  page.drawText('Coverage: 2-3 m\u00B2/kg', {
    x: col2,
    y: innerY,
    size: 9,
    font: fontRegular,
    color: COLORS.textLight,
  });

  innerY -= 14;
  const primerMin = Math.ceil(areaM2 / 3);
  const primerMax = Math.ceil(areaM2 / 2);
  page.drawText(`For ${areaM2.toFixed(1)} m\u00B2:`, {
    x: col1,
    y: innerY,
    size: 9,
    font: fontRegular,
    color: COLORS.text,
  });

  page.drawText(`Est. ${primerMin}-${primerMax} kg`, {
    x: col2,
    y: innerY,
    size: 10,
    font: fontBold,
    color: COLORS.primary,
  });

  // Contact note
  innerY -= 22;
  page.drawText('Note: Contact Rosehill technical team for specific product recommendations based on site conditions.', {
    x: col1,
    y: innerY,
    size: 8,
    font: fontRegular,
    color: COLORS.textLight,
  });

  return y - boxHeight - 10;
}

/**
 * Draw installation notes as a visual checklist
 * @param {PDFPage} page - The PDF page
 * @param {PDFFont} fontBold - Bold font
 * @param {PDFFont} fontRegular - Regular font
 * @param {number} y - Starting Y position
 * @param {string} surfaceType - 'playground' or 'sports'
 * @returns {number} New Y position
 */
export function drawInstallationChecklist(page, fontBold, fontRegular, y, surfaceType = 'playground') {
  const { margin } = PDF_CONFIG;

  page.drawText('Installation Checklist', {
    x: margin,
    y,
    size: 12,
    font: fontBold,
    color: COLORS.text,
  });

  y -= 20;

  // Before installation
  page.drawText('Before Installation:', {
    x: margin,
    y,
    size: 9,
    font: fontBold,
    color: COLORS.primary,
  });

  y -= 14;
  y = drawChecklistItem(page, margin + 10, y, 'Verify sub-base is properly prepared and meets standards', fontRegular);
  y = drawChecklistItem(page, margin + 10, y, 'Check all materials are present and match specification', fontRegular);
  y = drawChecklistItem(page, margin + 10, y, 'Confirm weather conditions are suitable (dry, 5-30\u00B0C)', fontRegular);

  y -= 8;
  page.drawText('During Installation:', {
    x: margin,
    y,
    size: 9,
    font: fontBold,
    color: COLORS.primary,
  });

  y -= 14;
  y = drawChecklistItem(page, margin + 10, y, 'Quantities include 10% safety margin for wastage', fontRegular);
  y = drawChecklistItem(page, margin + 10, y, 'Based on 20mm depth (8 kg/m\u00B2) - adjust as needed', fontRegular);

  if (surfaceType === 'sports') {
    y = drawChecklistItem(page, margin + 10, y, 'Line marking quantities are estimates - actual may vary', fontRegular);
  }

  y -= 8;
  page.drawText('Storage:', {
    x: margin,
    y,
    size: 9,
    font: fontBold,
    color: COLORS.primary,
  });

  y -= 14;
  y = drawChecklistItem(page, margin + 10, y, 'Store TPV granules in dry conditions away from sunlight', fontRegular);
  y = drawChecklistItem(page, margin + 10, y, 'Keep binder sealed until ready for use', fontRegular);

  return y;
}
