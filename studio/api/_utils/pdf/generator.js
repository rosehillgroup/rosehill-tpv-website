/**
 * PDF Export Generator for TPV Studio - Playground Designs
 * Creates professional PDF documents with design preview, colour tables, and installation data
 *
 * Refactored to use unified PDF utilities for consistent branding
 */

import { PDFDocument, StandardFonts } from 'pdf-lib';
import { createRequire } from 'module';
import {
  PDF_CONFIG,
  COLORS,
  MATERIAL_CONFIG,
  hexToRgb,
  formatWeight,
  calculateBags,
  formatDate,
  calculateBinder,
  drawHeader,
  drawFooter,
  drawColorSwatch,
  drawDimensionsPanel,
  drawMaterialRow,
  drawBinderSection,
  drawInstallationNotes,
  calculateRowsPerPage,
} from './unifiedPdfGenerator.js';

// Load JSON data
const require = createRequire(import.meta.url);
const TPV_COLOURS = require('../data/rosehill_tpv_21_colours.json');

const { pageWidth: PAGE_WIDTH, pageHeight: PAGE_HEIGHT, margin: MARGIN, contentWidth: CONTENT_WIDTH } = PDF_CONFIG;

/**
 * Validate component weights sum to 1.0 (100%)
 */
function validateComponentWeights(recipes) {
  for (const recipe of recipes) {
    const components = recipe.chosenRecipe?.components || [];
    if (components.length > 0) {
      const totalWeight = components.reduce((sum, c) => sum + (c.weight || 0), 0);
      if (Math.abs(totalWeight - 1.0) > 0.01) {
        console.warn(`[PDF-VALIDATION] Recipe component weights don't sum to 1.0: ${totalWeight.toFixed(3)} for color ${recipe.blendColor?.hex || recipe.targetColor?.hex}`);
      }
    }
  }
}

/**
 * Validate coverage percentages sum to approximately 100%
 */
function validateCoveragePercentages(recipes) {
  const totalCoverage = recipes.reduce((sum, r) => sum + (r.targetColor?.areaPct || 0), 0);
  if (Math.abs(totalCoverage - 100) > 1) {
    console.warn(`[PDF-VALIDATION] Coverage percentages don't sum to 100%: ${totalCoverage.toFixed(1)}%`);
  }
}

/**
 * Verify calculation consistency (blend mode only)
 */
function verifyCalculations(recipes, areaM2, mode) {
  if (mode !== 'blend') return;

  const { densityKgPerM2, safetyMargin } = MATERIAL_CONFIG;

  // Calculate total from individual colors
  const individualTotal = recipes.reduce((sum, r) => {
    const areaPct = r.targetColor?.areaPct || 0;
    const areaNeeded = (areaPct / 100) * areaM2;
    return sum + (areaNeeded * densityKgPerM2 * safetyMargin);
  }, 0);

  // Calculate total from aggregated components
  const tpvTotals = {};
  for (const recipe of recipes) {
    const areaPct = recipe.targetColor?.areaPct || 0;
    const areaNeeded = (areaPct / 100) * areaM2;
    const components = recipe.chosenRecipe?.components || [];

    for (const comp of components) {
      const code = comp.code;
      const weight = comp.weight || 0;
      const kgNeeded = areaNeeded * densityKgPerM2 * weight * safetyMargin;

      if (!tpvTotals[code]) {
        tpvTotals[code] = 0;
      }
      tpvTotals[code] += kgNeeded;
    }
  }

  const aggregatedTotal = Object.values(tpvTotals).reduce((sum, kg) => sum + kg, 0);

  if (Math.abs(individualTotal - aggregatedTotal) > 0.1) {
    console.error(`[PDF-VALIDATION] Calculation mismatch! Individual: ${individualTotal.toFixed(2)}kg, Aggregated: ${aggregatedTotal.toFixed(2)}kg`);
  } else {
    console.log(`[PDF-VALIDATION] Calculation verification passed: ${individualTotal.toFixed(2)}kg`);
  }
}

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
    projectName = 'TPV Studio',
    dimensions = { widthMM: 5000, lengthMM: 5000 },
    recipes = [],
    mode = 'solid',
    designId = '',
  } = data;

  // Calculate area for validation
  const widthM = dimensions.widthMM / 1000;
  const lengthM = dimensions.lengthMM / 1000;
  const areaM2 = widthM * lengthM;

  // Run validation checks
  validateComponentWeights(recipes);
  validateCoveragePercentages(recipes);
  verifyCalculations(recipes, areaM2, mode);

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
  const maxImageHeight = 320;
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
  const reportType = mode === 'blend' ? 'Blend Recipe Report' : 'Solid Colour Report';
  y = drawHeader(page1, fontBold, fontRegular, y, reportType);

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
  page1.drawText(`Generated: ${formatDate()}`, {
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
  const totalPages = 3 + Math.max(0, Math.ceil((recipes.length - 10) / 15)); // Estimate
  drawFooter(page1, fontRegular, 1, totalPages);

  // ============================================================================
  // PAGE 2+: Colour/Blend Breakdown (with pagination)
  // ============================================================================
  console.log('[PDF-EXPORT] Creating Colour Breakdown Pages');
  const { pages: colourPages, totalRows } = await drawColourTablePaginated(
    pdfDoc, fontBold, fontRegular, recipes, mode, areaM2
  );

  // Update page numbers for colour pages
  let pageNum = 2;
  for (const colourPage of colourPages) {
    drawFooter(colourPage, fontRegular, pageNum, totalPages);
    pageNum++;
  }

  // ============================================================================
  // FINAL PAGE: Installation Material Requirements
  // ============================================================================
  console.log('[PDF-EXPORT] Creating Material Summary Page');
  const finalPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;

  // Header
  y = drawHeader(finalPage, fontBold, fontRegular, y, reportType);

  // Title
  y -= 30;
  finalPage.drawText('Installation Material Requirements', {
    x: MARGIN,
    y,
    size: 16,
    font: fontBold,
    color: COLORS.text,
  });

  // Surface area info
  y -= 25;
  finalPage.drawText(`Total Surface Area: ${areaM2.toFixed(2)} m\u00B2`, {
    x: MARGIN,
    y,
    size: 12,
    font: fontBold,
    color: COLORS.text,
  });

  // Draw material totals
  y -= 30;
  const { y: newY, totalKg } = drawMaterialTotals(finalPage, fontBold, fontRegular, recipes, mode, areaM2, y);
  y = newY;

  // Binder section
  y -= 20;
  y = drawBinderSection(finalPage, fontBold, fontRegular, y);

  // Notes section
  y -= 30;
  y = drawInstallationNotes(finalPage, fontBold, fontRegular, y, 'playground');

  // Footer
  drawFooter(finalPage, fontRegular, pageNum, totalPages);

  // Save PDF
  console.log('[PDF-EXPORT] Saving PDF...');
  const pdfBytes = await pdfDoc.save();

  console.log(`[PDF-EXPORT] PDF generated: ${pdfBytes.length} bytes, ${pdfDoc.getPageCount()} pages`);

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
 * Draw colour/blend table with automatic pagination
 * Returns array of pages created
 */
async function drawColourTablePaginated(pdfDoc, fontBold, fontRegular, recipes, mode, areaM2) {
  const pages = [];
  const rowHeight = 24;
  const headerHeight = 50;
  const bottomMargin = 80;

  // Calculate rows per page
  const firstPageRows = calculateRowsPerPage(PAGE_HEIGHT - MARGIN - 80, rowHeight, bottomMargin);
  const subsequentPageRows = calculateRowsPerPage(PAGE_HEIGHT - MARGIN - 60, rowHeight, bottomMargin);

  let recipeIndex = 0;
  let isFirstPage = true;

  while (recipeIndex < recipes.length) {
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);

    let y = PAGE_HEIGHT - MARGIN;

    // Header
    const reportType = mode === 'blend' ? 'Blend Recipe Report' : 'Solid Colour Report';
    y = drawHeader(page, fontBold, fontRegular, y, reportType);

    // Title (only on first page)
    if (isFirstPage) {
      y -= 30;
      const tableTitle = mode === 'blend' ? 'Blend Colour Breakdown' : 'TPV Colour Breakdown';
      page.drawText(tableTitle, {
        x: MARGIN,
        y,
        size: 16,
        font: fontBold,
        color: COLORS.text,
      });
      y -= 10;
    } else {
      y -= 20;
      page.drawText(`Colour Breakdown (continued)`, {
        x: MARGIN,
        y,
        size: 12,
        font: fontRegular,
        color: COLORS.textLight,
      });
    }

    // Table headers
    y -= 25;
    y = drawTableHeaders(page, fontBold, mode, y);

    // Calculate how many rows fit on this page
    const maxRows = isFirstPage ? firstPageRows - 2 : subsequentPageRows;
    const rowsToRender = Math.min(maxRows, recipes.length - recipeIndex);

    // Draw rows
    for (let i = 0; i < rowsToRender && recipeIndex < recipes.length; i++) {
      const recipe = recipes[recipeIndex];
      y = drawTableRow(page, fontBold, fontRegular, recipe, mode, areaM2, y);
      recipeIndex++;
    }

    isFirstPage = false;
  }

  return { pages, totalRows: recipes.length };
}

/**
 * Draw table headers
 */
function drawTableHeaders(page, fontBold, mode, y) {
  const headers = mode === 'blend'
    ? ['Colour', 'Blend Name', 'dE', 'Recipe', 'Coverage', 'Area (m\u00B2)']
    : ['Colour', 'TPV Code', 'Name', 'Hex', 'Coverage', 'Area (m\u00B2)'];

  const colWidths = mode === 'blend'
    ? [45, 110, 40, 150, 60, 60]
    : [45, 65, 110, 70, 60, 60];

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

  y -= 8;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 0.5,
    color: COLORS.border,
  });

  return y - 15;
}

/**
 * Draw a single table row
 */
function drawTableRow(page, fontBold, fontRegular, recipe, mode, areaM2, y) {
  const colWidths = mode === 'blend'
    ? [45, 110, 40, 150, 60, 60]
    : [45, 65, 110, 70, 60, 60];

  let x = MARGIN;

  // Get colour info
  let hex, name, code, deltaE, recipeText, coverage;

  if (mode === 'blend') {
    hex = recipe.blendColor?.hex || recipe.targetColor?.hex || '#000000';
    name = getBlendName(recipe);
    deltaE = recipe.chosenRecipe?.deltaE?.toFixed(2) || '-';
    recipeText = formatRecipe(recipe.chosenRecipe);
    coverage = (recipe.targetColor?.areaPct || 0).toFixed(1) + '%';
  } else {
    const tpvInfo = recipe.chosenRecipe?.components?.[0] || {};
    code = tpvInfo.code || 'RH00';
    name = tpvInfo.name || 'Unknown';
    hex = getHexForCode(code);
    coverage = (recipe.targetColor?.areaPct || 0).toFixed(1) + '%';
  }

  const areaPct = recipe.targetColor?.areaPct || 0;
  const areaNeeded = ((areaPct / 100) * areaM2).toFixed(2);

  // Draw colour swatch
  drawColorSwatch(page, x + 8, y - 8, hex, 28, 14);
  x += colWidths[0];

  if (mode === 'blend') {
    // Blend name (with truncation if needed)
    const displayName = name.length > 18 ? name.substring(0, 17) + '\u2026' : name;
    page.drawText(displayName, {
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

    // Recipe (with truncation)
    const displayRecipe = recipeText.length > 26 ? recipeText.substring(0, 25) + '\u2026' : recipeText;
    page.drawText(displayRecipe, {
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
      size: 9,
      font: fontBold,
      color: COLORS.primary,
    });
    x += colWidths[1];

    // Name (with truncation)
    const displayName = name.length > 16 ? name.substring(0, 15) + '\u2026' : name;
    page.drawText(displayName, {
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

  return y - 24;
}

/**
 * Draw material totals for installers
 */
function drawMaterialTotals(page, fontBold, fontRegular, recipes, mode, areaM2, y) {
  const { densityKgPerM2, safetyMargin } = MATERIAL_CONFIG;
  let totalKg = 0;

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
        const kgNeeded = areaNeeded * densityKgPerM2 * weight * safetyMargin;

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

    // Draw header
    page.drawText('TPV Material Required (by component):', {
      x: MARGIN,
      y,
      size: 11,
      font: fontBold,
      color: COLORS.text,
    });

    y -= 22;

    // Table header
    page.drawText('Colour', { x: MARGIN, y, size: 9, font: fontBold, color: COLORS.text });
    page.drawText('Quantity', { x: MARGIN + 220, y, size: 9, font: fontBold, color: COLORS.text });
    page.drawText('Bags (25kg)', { x: MARGIN + 300, y, size: 9, font: fontBold, color: COLORS.text });

    y -= 8;
    page.drawLine({
      start: { x: MARGIN, y: y + 5 },
      end: { x: MARGIN + 380, y: y + 5 },
      thickness: 0.5,
      color: COLORS.border,
    });

    y -= 15;

    const sortedTotals = Object.values(tpvTotals).sort((a, b) => b.kg - a.kg);

    for (const total of sortedTotals) {
      const hex = getHexForCode(total.code);
      totalKg += total.kg;

      y = drawMaterialRow(page, fontBold, fontRegular, MARGIN, y, {
        hex,
        code: total.code,
        name: total.name,
        kg: total.kg,
        showBags: true,
      });
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

    y -= 22;

    // Table header
    page.drawText('Colour', { x: MARGIN, y, size: 9, font: fontBold, color: COLORS.text });
    page.drawText('Quantity', { x: MARGIN + 220, y, size: 9, font: fontBold, color: COLORS.text });
    page.drawText('Bags (25kg)', { x: MARGIN + 300, y, size: 9, font: fontBold, color: COLORS.text });

    y -= 8;
    page.drawLine({
      start: { x: MARGIN, y: y + 5 },
      end: { x: MARGIN + 380, y: y + 5 },
      thickness: 0.5,
      color: COLORS.border,
    });

    y -= 15;

    for (const recipe of recipes) {
      const areaPct = recipe.targetColor?.areaPct || 0;
      const areaNeeded = (areaPct / 100) * areaM2;
      const kgNeeded = areaNeeded * densityKgPerM2 * safetyMargin;
      totalKg += kgNeeded;

      const tpvInfo = recipe.chosenRecipe?.components?.[0] || {};
      const code = tpvInfo.code || 'RH00';
      const name = tpvInfo.name || 'Unknown';
      const hex = getHexForCode(code);

      y = drawMaterialRow(page, fontBold, fontRegular, MARGIN, y, {
        hex,
        code,
        name,
        kg: kgNeeded,
        showBags: true,
      });
    }
  }

  // Total row
  y -= 5;
  page.drawLine({
    start: { x: MARGIN, y: y + 12 },
    end: { x: MARGIN + 380, y: y + 12 },
    thickness: 1,
    color: COLORS.border,
  });

  y -= 5;
  page.drawText('TOTAL TPV', {
    x: MARGIN + 28,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.text,
  });

  page.drawText(formatWeight(totalKg), {
    x: MARGIN + 220,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.primary,
  });

  page.drawText(`${calculateBags(totalKg)} bags`, {
    x: MARGIN + 300,
    y,
    size: 10,
    font: fontBold,
    color: COLORS.text,
  });

  return { y, totalKg };
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
  } else if (components.length > 2) {
    return `${components[0].name}/${components[1].name} +${components.length - 2}`;
  }
  return 'Custom Blend';
}

/**
 * Helper: Format recipe as string
 */
function formatRecipe(chosenRecipe) {
  if (!chosenRecipe?.components) return '-';

  const components = chosenRecipe.components;
  if (components.length === 1) {
    return components[0].code;
  }

  // Use parts if available, otherwise fall back to weight
  return components
    .map(c => {
      const parts = c.parts || Math.round(c.weight * 12);
      return `${parts}p ${c.code}`;
    })
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
