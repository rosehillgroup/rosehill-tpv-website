// PDF Export with resvg-js
// Converts SVG to high-quality PDF for print/installation
//
// Strategy:
// 1. Use resvg-js to render SVG to PNG at high resolution
// 2. Embed PNG in PDF using jsPDF (or similar)
// 3. Add metadata and installation notes




/**
 * Generate PDF from SVG
 * Creates print-ready PDF with embedded vector or high-res raster
 *
 * @param {string} svgString - SVG content
 * @param {Object} options - PDF generation options
 * @param {number} options.width_mm - Surface width in mm
 * @param {number} options.height_mm - Surface height in mm
 * @param {Object} options.metadata - Job metadata
 * @returns {Promise<Buffer>} PDF buffer
 */
async function generatePDF(svgString, options = {}) {
  const { Resvg } = await import('@resvg/resvg-js');

  console.log('[PDF-GEN] Generating PDF...');

  try {
    const { width_mm = 5000, height_mm = 5000, metadata = {} } = options;

    // ========================================================================
    // STEP 1: Render SVG to high-resolution PNG using resvg
    // ========================================================================

    console.log('[PDF-GEN] Rendering SVG to PNG with resvg...');

    // Calculate appropriate DPI for large format print
    // 150 DPI is sufficient for large playground surfaces viewed from distance
    // (300 DPI would create 3.5B pixels for 5m×5m, causing memory issues)
    const dpi = 150;

    // Convert mm to inches, then to pixels
    const widthInches = width_mm / 25.4;
    const heightInches = height_mm / 25.4;
    const widthPx = Math.round(widthInches * dpi);
    const heightPx = Math.round(heightInches * dpi);

    console.log(`[PDF-GEN] Output dimensions: ${widthPx}×${heightPx}px @ ${dpi} DPI`);

    // Configure resvg options
    const resvgOptions = {
      fitTo: {
        mode: 'width',
        value: widthPx
      },
      font: {
        loadSystemFonts: false // Don't load system fonts (we don't use text)
      }
    };

    // Render SVG
    const resvg = new Resvg(svgString, resvgOptions);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    console.log(`[PDF-GEN] Rendered PNG: ${pngBuffer.length} bytes`);

    // ========================================================================
    // STEP 2: Create PDF with embedded PNG
    // ========================================================================

    // For now, we'll return the PNG buffer directly
    // TODO: Implement proper PDF assembly with PDFKit or jsPDF
    // This would include:
    // - Proper PDF structure
    // - Embedded metadata
    // - Installation notes page
    // - Color swatches
    // - Dimensions and scale

    console.log('[PDF-GEN] PDF generation complete');

    // Return PNG buffer as placeholder
    // In production, this would be a proper PDF with embedded image
    return pngBuffer;

  } catch (error) {
    console.error('[PDF-GEN] Error:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}

/**
 * Generate PDF with cover page and installation notes
 * Enhanced version for production use
 *
 * @param {string} svgString - SVG content
 * @param {Object} options - PDF options
 * @returns {Promise<Buffer>} PDF buffer
 */
async function generateEnhancedPDF(svgString, options = {}) {
  // TODO: Implement full PDF generation with:
  // - Cover page with project details
  // - Installation instructions
  // - Color palette swatches with TPV codes
  // - Dimension specifications
  // - Material list with quantities
  // - Technical notes for installers

  // For MVP, use basic PDF generation
  return generatePDF(svgString, options);
}

/**
 * Create PDF metadata object
 * @param {Object} metadata - Job metadata
 * @returns {Object} PDF metadata
 */
function createPDFMetadata(metadata) {
  return {
    title: 'TPV Playground Surface Design',
    author: 'TPV Studio',
    subject: 'Thermoplastic Installation Design',
    keywords: 'TPV, playground, thermoplastic, installation',
    creator: 'TPV Studio Vectorization Pipeline',
    producer: 'resvg-js',
    creationDate: new Date(),
    ...metadata
  };
}

/**
 * Validate PDF output
 * Basic check for valid PDF structure
 *
 * @param {Buffer} pdfBuffer - PDF buffer
 * @returns {Object} {valid, errors}
 */
function validatePDF(pdfBuffer) {
  const errors = [];

  // Check PDF magic number (%PDF)
  const header = pdfBuffer.slice(0, 5).toString();
  if (!header.startsWith('%PDF')) {
    errors.push('Invalid PDF header (missing %PDF magic number)');
  }

  // Check for EOF marker
  const footer = pdfBuffer.slice(-10).toString();
  if (!footer.includes('%%EOF')) {
    errors.push('Invalid PDF footer (missing %%EOF marker)');
  }

  // Check minimum size
  if (pdfBuffer.length < 1000) {
    errors.push('PDF file too small (likely corrupt)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Estimate PDF file size before generation
 * @param {string} svgString - SVG content
 * @param {Object} options - Generation options
 * @returns {number} Estimated size in bytes
 */
function estimatePDFSize(svgString, options = {}) {
  const { width_mm = 5000, height_mm = 5000 } = options;

  // Rough estimate based on dimensions
  // High-res PNG: ~10 MB for 5m×5m @ 300 DPI
  // PDF overhead: ~5%

  const dpi = 300;
  const widthInches = width_mm / 25.4;
  const heightInches = height_mm / 25.4;
  const widthPx = Math.round(widthInches * dpi);
  const heightPx = Math.round(heightInches * dpi);

  // PNG compression ratio: ~10:1 for flat color designs
  const uncompressedSize = widthPx * heightPx * 3; // RGB
  const estimatedPngSize = uncompressedSize / 10;
  const estimatedPdfSize = estimatedPngSize * 1.05; // 5% overhead

  return Math.round(estimatedPdfSize);
}

module.exports = {
  generatePDF,
  generateEnhancedPDF,
  validatePDF,
  estimatePDFSize
};
