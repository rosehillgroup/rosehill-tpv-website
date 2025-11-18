/**
 * PDF Export Generator for TPV Studio
 * Creates professional PDF documents with design preview, colour tables, and installation data
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { createRequire } from 'module';

// Load JSON data
const require = createRequire(import.meta.url);
const TPV_COLOURS = require('../data/rosehill_tpv_21_colours.json');

// Page dimensions (A4 in points: 595.28 x 841.89)
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

// Colour definitions
const COLORS = {
  primary: rgb(0.118, 0.306, 0.478),      // #1e4e7a - Rosehill navy
  accent: rgb(1, 0.420, 0.208),           // #ff6b35 - Rosehill orange
  text: rgb(0.102, 0.125, 0.173),         // #1a202c
  textLight: rgb(0.392, 0.455, 0.545),    // #64748b
  border: rgb(0.894, 0.914, 0.941),       // #e4e9f0
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0),
};

/**
 * Generate a complete PDF export
 * @param {Object} data - Export data
 * @param {string} data.svgString - SVG content to render
 * @param {string} data.designName - Name of the design
 * @param {string} data.projectName - Name of the project
 * @param {Object} data.dimensions - { widthMM, lengthMM }
 * @param {Array} data.recipes - Array of recipe objects
 * @param {string} data.mode - 'solid' or 'blend'
 * @param {string} data.userId - User ID
 * @param {string} data.designId - Design ID
 * @returns {Promise<Buffer>} PDF buffer
 */
async function generateExportPDF(data) {
  const { Resvg } = await import('@resvg/resvg-js');

  console.log('[PDF-EXPORT] Starting PDF generation...');
  console.log('[PDF-EXPORT] Mode:', data.mode);
  console.log('[PDF-EXPORT] Recipes:', data.recipes?.length || 0);

  const {
    svgString,
    designName = 'Untitled Design',
    projectName = 'No Project',
    dimensions = { widthMM: 5000, lengthMM: 5000 },
    recipes = [],
    mode = 'solid',
    designId = '',
  } = data;

  // Create PDF document
  const pdfDoc = await PDFDocument.create();

  // Set metadata
  pdfDoc.setTitle(`${designName} - TPV Studio Export`);
  pdfDoc.setAuthor('TPV Studio');
  pdfDoc.setSubject('TPV Playground Surface Design');
  pdfDoc.setKeywords(['TPV', 'playground', 'thermoplastic', 'Rosehill']);
  pdfDoc.setProducer('TPV Studio PDF Generator');
  pdfDoc.setCreator('TPV Studio');
  pdfDoc.setCreationDate(new Date());

  // Embed fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Render SVG to PNG
  console.log('[PDF-EXPORT] Rendering SVG to PNG...');
  const pngBuffer = await renderSvgToPng(svgString, dimensions, Resvg);
  const pngImage = await pdfDoc.embedPng(pngBuffer);

  // Calculate image dimensions to fit on page
  const maxImageWidth = CONTENT_WIDTH;
  const maxImageHeight = 350;
  const imageAspect = pngImage.width / pngImage.height;
  let imageWidth, imageHeight;

  if (imageAspect > maxImageWidth / maxImageHeight) {
    imageWidth = maxImageWidth;
    imageHeight = maxImageWidth / imageAspect;
  } else {
    imageHeight = maxImageHeight;
    imageWidth = maxImageHeight * imageAspect;
  }

  // ============================================================================
  // PAGE 1: Design Overview
  // ============================================================================
  console.log('[PDF-EXPORT] Creating Page 1: Design Overview');
  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  // Header
  y = drawHeader(page1, fontBold, fontRegular, y);

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
  page1.drawText(`Project: ${projectName}`, {
    x: MARGIN,
    y,
    size: 11,
    font: fontRegular,
    color: COLORS.textLight,
  });

  y -= 16;
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

  if (designId) {
    y -= 16;
    page1.drawText(`Design ID: ${designId.substring(0, 8)}`, {
      x: MARGIN,
      y,
      size: 9,
      font: fontRegular,
      color: COLORS.textLight,
    });
  }

  // Dimensions panel
  y -= 35;
  y = drawDimensionsPanel(page1, fontBold, fontRegular, dimensions, y);

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

  // Mode indicator
  const modeText = mode === 'blend'
    ? 'Blend Version - Optimised blend recipes for colour matching'
    : 'Solid TPV Version - Direct TPV colour mapping';

  page1.drawText(modeText, {
    x: MARGIN,
    y,
    size: 10,
    font: fontRegular,
    color: COLORS.textLight,
  });

  // Colour count
  y -= 16;
  page1.drawText(`This design uses ${recipes.length} ${mode === 'blend' ? 'blend' : 'TPV'} colours`, {
    x: MARGIN,
    y,
    size: 10,
    font: fontRegular,
    color: COLORS.textLight,
  });

  // Footer
  drawFooter(page1, fontRegular, 1);

  // ============================================================================
  // PAGE 2: Colour/Blend Breakdown
  // ============================================================================
  console.log('[PDF-EXPORT] Creating Page 2: Colour Breakdown');
  const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;

  // Header
  y = drawHeader(page2, fontBold, fontRegular, y);

  // Title
  y -= 30;
  const tableTitle = mode === 'blend' ? 'Blend Colour Breakdown' : 'TPV Colour Breakdown';
  page2.drawText(tableTitle, {
    x: MARGIN,
    y,
    size: 16,
    font: fontBold,
    color: COLORS.text,
  });

  // Draw colour table
  y -= 25;
  y = await drawColourTable(pdfDoc, page2, fontBold, fontRegular, recipes, mode, dimensions, y);

  // Footer
  drawFooter(page2, fontRegular, 2);

  // ============================================================================
  // PAGE 3: Installation Totals
  // ============================================================================
  console.log('[PDF-EXPORT] Creating Page 3: Installation Totals');
  const page3 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;

  // Header
  y = drawHeader(page3, fontBold, fontRegular, y);

  // Title
  y -= 30;
  page3.drawText('Installation Material Requirements', {
    x: MARGIN,
    y,
    size: 16,
    font: fontBold,
    color: COLORS.text,
  });

  // Surface area info
  y -= 25;
  const areaM2 = (dimensions.widthMM / 1000) * (dimensions.lengthMM / 1000);
  page3.drawText(`Total Surface Area: ${areaM2.toFixed(2)} m2`, {
    x: MARGIN,
    y,
    size: 12,
    font: fontBold,
    color: COLORS.text,
  });

  // Draw material totals
  y -= 30;
  y = drawMaterialTotals(page3, fontBold, fontRegular, recipes, mode, areaM2, y);

  // Notes section
  y -= 40;
  page3.drawText('Installation Notes', {
    x: MARGIN,
    y,
    size: 12,
    font: fontBold,
    color: COLORS.text,
  });

  y -= 20;
  const notes = [
    '• Material quantities are estimates based on coverage percentages',
    '• Actual quantities may vary based on installation conditions',
    '• Allow 5-10% additional material for wastage and trimming',
    '• Consult Rosehill technical team for binder requirements',
    '• Ensure sub-base is properly prepared before installation',
  ];

  for (const note of notes) {
    page3.drawText(note, {
      x: MARGIN,
      y,
      size: 9,
      font: fontRegular,
      color: COLORS.textLight,
    });
    y -= 14;
  }

  // Footer
  drawFooter(page3, fontRegular, 3);

  // Save PDF
  console.log('[PDF-EXPORT] Saving PDF...');
  const pdfBytes = await pdfDoc.save();

  console.log(`[PDF-EXPORT] PDF generated: ${pdfBytes.length} bytes`);

  return Buffer.from(pdfBytes);
}

/**
 * Render SVG to PNG using resvg
 */
async function renderSvgToPng(svgString, dimensions, Resvg) {
  const { widthMM = 5000, lengthMM = 5000 } = dimensions;

  // Calculate DPI based on surface size
  // Use higher DPI for smaller surfaces, lower for larger
  const maxDimension = Math.max(widthMM, lengthMM);
  let dpi = 150;
  if (maxDimension < 2000) dpi = 300;
  else if (maxDimension > 8000) dpi = 100;

  const widthInches = widthMM / 25.4;
  const widthPx = Math.round(widthInches * dpi);

  // Cap maximum resolution to avoid memory issues
  const maxPx = 4000;
  const finalWidth = Math.min(widthPx, maxPx);

  console.log(`[PDF-EXPORT] Rendering at ${finalWidth}px width (${dpi} DPI)`);

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
 * Draw page header with Rosehill branding
 */
function drawHeader(page, fontBold, fontRegular, y) {
  // Logo text (simplified - could be replaced with actual logo image)
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

  // Divider line
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
function drawFooter(page, fontRegular, pageNum) {
  const y = 30;

  page.drawText(`Page ${pageNum}`, {
    x: MARGIN,
    y,
    size: 9,
    font: fontRegular,
    color: COLORS.textLight,
  });

  page.drawText('www.rosehillgroup.com', {
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
function drawDimensionsPanel(page, fontBold, fontRegular, dimensions, y) {
  const { widthMM, lengthMM } = dimensions;
  const widthM = (widthMM / 1000).toFixed(2);
  const lengthM = (lengthMM / 1000).toFixed(2);
  const areaM2 = ((widthMM / 1000) * (lengthMM / 1000)).toFixed(2);

  page.drawText('Surface Dimensions', {
    x: MARGIN,
    y,
    size: 11,
    font: fontBold,
    color: COLORS.text,
  });

  y -= 18;
  page.drawText(`Width: ${widthM}m (${widthMM}mm)    Length: ${lengthM}m (${lengthMM}mm)    Area: ${areaM2}m2`, {
    x: MARGIN,
    y,
    size: 10,
    font: fontRegular,
    color: COLORS.textLight,
  });

  return y;
}

/**
 * Draw colour/blend table
 */
async function drawColourTable(pdfDoc, page, fontBold, fontRegular, recipes, mode, dimensions, y) {
  const areaM2 = (dimensions.widthMM / 1000) * (dimensions.lengthMM / 1000);

  // Table headers
  const headers = mode === 'blend'
    ? ['Colour', 'Blend Name', 'dE', 'Recipe', 'Coverage', 'Area (m2)']
    : ['Colour', 'TPV Code', 'Name', 'Hex', 'Coverage', 'Area (m2)'];

  const colWidths = mode === 'blend'
    ? [40, 90, 35, 170, 60, 60]
    : [40, 60, 100, 70, 60, 60];

  // Draw header row
  let x = MARGIN;
  for (let i = 0; i < headers.length; i++) {
    page.drawText(headers[i], {
      x: x + 5,
      y,
      size: 9,
      font: fontBold,
      color: COLORS.text,
    });
    x += colWidths[i];
  }

  y -= 5;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 0.5,
    color: COLORS.border,
  });

  // Draw rows
  y -= 20;
  for (const recipe of recipes) {
    if (y < 80) break; // Don't overflow page

    x = MARGIN;

    // Get colour info
    let hex, name, code, deltaE, recipeText, coverage;

    if (mode === 'blend') {
      hex = recipe.blendColor?.hex || recipe.targetColor?.hex || '#000000';
      name = getBlendName(recipe);
      deltaE = recipe.chosenRecipe?.deltaE?.toFixed(2) || '-';
      recipeText = formatRecipe(recipe.chosenRecipe);
      coverage = (recipe.targetColor?.areaPct || 0).toFixed(1) + '%';
    } else {
      // Solid mode
      const tpvInfo = recipe.chosenRecipe?.components?.[0] || {};
      code = tpvInfo.code || 'RH00';
      name = tpvInfo.name || 'Unknown';
      hex = getHexForCode(code);
      coverage = (recipe.targetColor?.areaPct || 0).toFixed(1) + '%';
    }

    const areaPct = recipe.targetColor?.areaPct || 0;
    const areaNeeded = ((areaPct / 100) * areaM2).toFixed(2);

    // Draw colour swatch
    const hexClean = hex.replace('#', '');
    const r = parseInt(hexClean.substring(0, 2), 16) / 255;
    const g = parseInt(hexClean.substring(2, 4), 16) / 255;
    const b = parseInt(hexClean.substring(4, 6), 16) / 255;

    page.drawRectangle({
      x: x + 5,
      y: y - 8,
      width: 25,
      height: 12,
      color: rgb(r, g, b),
      borderColor: COLORS.border,
      borderWidth: 0.5,
    });
    x += colWidths[0];

    if (mode === 'blend') {
      // Blend name
      page.drawText(name.substring(0, 15), {
        x: x + 5,
        y: y - 3,
        size: 8,
        font: fontRegular,
        color: COLORS.text,
      });
      x += colWidths[1];

      // Delta E
      page.drawText(deltaE, {
        x: x + 5,
        y: y - 3,
        size: 8,
        font: fontRegular,
        color: COLORS.text,
      });
      x += colWidths[2];

      // Recipe
      page.drawText(recipeText.substring(0, 35), {
        x: x + 5,
        y: y - 3,
        size: 7,
        font: fontRegular,
        color: COLORS.textLight,
      });
      x += colWidths[3];
    } else {
      // TPV Code
      page.drawText(code, {
        x: x + 5,
        y: y - 3,
        size: 8,
        font: fontRegular,
        color: COLORS.text,
      });
      x += colWidths[1];

      // Name
      page.drawText(name.substring(0, 18), {
        x: x + 5,
        y: y - 3,
        size: 8,
        font: fontRegular,
        color: COLORS.text,
      });
      x += colWidths[2];

      // Hex
      page.drawText(hex, {
        x: x + 5,
        y: y - 3,
        size: 8,
        font: fontRegular,
        color: COLORS.textLight,
      });
      x += colWidths[3];
    }

    // Coverage
    page.drawText(coverage, {
      x: x + 5,
      y: y - 3,
      size: 8,
      font: fontRegular,
      color: COLORS.text,
    });
    x += colWidths[4];

    // Area needed
    page.drawText(areaNeeded, {
      x: x + 5,
      y: y - 3,
      size: 8,
      font: fontRegular,
      color: COLORS.text,
    });

    y -= 22;
  }

  return y;
}

/**
 * Draw material totals for installers
 */
function drawMaterialTotals(page, fontBold, fontRegular, recipes, mode, areaM2, y) {
  // Material density estimate (kg/m² at standard depth)
  const DENSITY_KG_PER_M2 = 8; // Approximate for TPV at 20mm depth

  if (mode === 'blend') {
    // Aggregate by TPV components
    const tpvTotals = {};

    for (const recipe of recipes) {
      const areaPct = recipe.targetColor?.areaPct || 0;
      const areaNeeded = (areaPct / 100) * areaM2;
      const components = recipe.chosenRecipe?.components || [];

      for (const comp of components) {
        const code = comp.code;
        const weight = comp.weight || 0;
        const kgNeeded = areaNeeded * DENSITY_KG_PER_M2 * weight;

        if (!tpvTotals[code]) {
          tpvTotals[code] = {
            code,
            name: comp.name,
            kg: 0
          };
        }
        tpvTotals[code].kg += kgNeeded;
      }
    }

    // Draw totals
    page.drawText('TPV Material Required (by component):', {
      x: MARGIN,
      y,
      size: 11,
      font: fontBold,
      color: COLORS.text,
    });

    y -= 20;

    const sortedTotals = Object.values(tpvTotals).sort((a, b) => b.kg - a.kg);

    for (const total of sortedTotals) {
      const hex = getHexForCode(total.code);
      const hexClean = hex.replace('#', '');
      const r = parseInt(hexClean.substring(0, 2), 16) / 255;
      const g = parseInt(hexClean.substring(2, 4), 16) / 255;
      const b = parseInt(hexClean.substring(4, 6), 16) / 255;

      // Swatch
      page.drawRectangle({
        x: MARGIN,
        y: y - 6,
        width: 20,
        height: 10,
        color: rgb(r, g, b),
        borderColor: COLORS.border,
        borderWidth: 0.5,
      });

      // Code and name
      page.drawText(`${total.code} - ${total.name}`, {
        x: MARGIN + 30,
        y,
        size: 10,
        font: fontRegular,
        color: COLORS.text,
      });

      // Quantity
      page.drawText(`${total.kg.toFixed(1)} kg`, {
        x: MARGIN + 200,
        y,
        size: 10,
        font: fontBold,
        color: COLORS.text,
      });

      y -= 18;
    }

  } else {
    // Solid mode - direct TPV quantities
    page.drawText('TPV Material Required:', {
      x: MARGIN,
      y,
      size: 11,
      font: fontBold,
      color: COLORS.text,
    });

    y -= 20;

    for (const recipe of recipes) {
      const areaPct = recipe.targetColor?.areaPct || 0;
      const areaNeeded = (areaPct / 100) * areaM2;
      const kgNeeded = areaNeeded * DENSITY_KG_PER_M2;

      const tpvInfo = recipe.chosenRecipe?.components?.[0] || {};
      const code = tpvInfo.code || 'RH00';
      const name = tpvInfo.name || 'Unknown';
      const hex = getHexForCode(code);

      const hexClean = hex.replace('#', '');
      const r = parseInt(hexClean.substring(0, 2), 16) / 255;
      const g = parseInt(hexClean.substring(2, 4), 16) / 255;
      const b = parseInt(hexClean.substring(4, 6), 16) / 255;

      // Swatch
      page.drawRectangle({
        x: MARGIN,
        y: y - 6,
        width: 20,
        height: 10,
        color: rgb(r, g, b),
        borderColor: COLORS.border,
        borderWidth: 0.5,
      });

      // Code and name
      page.drawText(`${code} - ${name}`, {
        x: MARGIN + 30,
        y,
        size: 10,
        font: fontRegular,
        color: COLORS.text,
      });

      // Quantity
      page.drawText(`${kgNeeded.toFixed(1)} kg`, {
        x: MARGIN + 200,
        y,
        size: 10,
        font: fontBold,
        color: COLORS.text,
      });

      y -= 18;
    }
  }

  // Total estimate
  const totalKg = areaM2 * DENSITY_KG_PER_M2;
  y -= 15;
  page.drawLine({
    start: { x: MARGIN, y: y + 10 },
    end: { x: MARGIN + 280, y: y + 10 },
    thickness: 0.5,
    color: COLORS.border,
  });

  page.drawText('Total TPV (estimated):', {
    x: MARGIN,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.text,
  });

  page.drawText(`${totalKg.toFixed(1)} kg`, {
    x: MARGIN + 200,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.primary,
  });

  return y;
}

/**
 * Helper: Get blend name from recipe
 */
function getBlendName(recipe) {
  const components = recipe.chosenRecipe?.components || [];
  if (components.length === 1) {
    return components[0].name;
  } else if (components.length === 2) {
    return `${components[0].name}/${components[1].name}`;
  } else {
    return 'Custom Blend';
  }
}

/**
 * Helper: Format recipe as string
 */
function formatRecipe(chosenRecipe) {
  if (!chosenRecipe?.components) return '-';

  const components = chosenRecipe.components;
  if (components.length === 1) {
    return `100% ${components[0].code}`;
  }

  return components
    .map(c => `${Math.round(c.weight * 100)}% ${c.code}`)
    .join(' + ');
}

/**
 * Helper: Get hex colour for TPV code
 */
function getHexForCode(code) {
  const colour = TPV_COLOURS.find(c => c.code === code);
  return colour?.hex || '#000000';
}

export {
  generateExportPDF
};
