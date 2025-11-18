/**
 * PDF Export API Endpoint
 * POST /api/export-pdf
 *
 * Generates a professional PDF document with design preview,
 * colour breakdown, and installation material requirements.
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    },
    responseLimit: '10mb'
  },
  maxDuration: 60
};

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('[EXPORT-PDF] Request received');

  try {
    // Dynamic import to avoid CommonJS/ESM issues
    const { generateExportPDF } = await import('./_utils/pdf/generator.js');

    const {
      svgString,
      svgUrl,
      designName,
      projectName,
      dimensions,
      recipes,
      mode,
      userId,
      designId
    } = req.body;

    // Validate required fields
    if (!svgString && !svgUrl) {
      return res.status(400).json({ error: 'SVG content or URL is required' });
    }

    if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
      return res.status(400).json({ error: 'Recipes array is required' });
    }

    if (!dimensions || !dimensions.widthMM || !dimensions.lengthMM) {
      return res.status(400).json({ error: 'Valid dimensions object is required' });
    }

    // Fetch SVG from URL if not provided directly
    let svgContent = svgString;
    if (!svgContent && svgUrl) {
      console.log('[EXPORT-PDF] Fetching SVG from URL...');
      const svgResponse = await fetch(svgUrl);
      if (!svgResponse.ok) {
        throw new Error(`Failed to fetch SVG: ${svgResponse.status}`);
      }
      svgContent = await svgResponse.text();
    }

    console.log('[EXPORT-PDF] Generating PDF...');
    console.log('[EXPORT-PDF] Design:', designName);
    console.log('[EXPORT-PDF] Mode:', mode);
    console.log('[EXPORT-PDF] Recipes:', recipes.length);
    console.log('[EXPORT-PDF] Dimensions:', dimensions);

    // Generate PDF
    const pdfBuffer = await generateExportPDF({
      svgString: svgContent,
      designName: designName || 'Untitled Design',
      projectName: projectName || 'No Project',
      dimensions,
      recipes,
      mode: mode || 'solid',
      userId,
      designId
    });

    console.log(`[EXPORT-PDF] PDF generated: ${pdfBuffer.length} bytes`);

    // Set response headers for PDF download
    const filename = `${sanitizeFilename(designName || 'design')}_${mode || 'export'}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    return res.send(pdfBuffer);

  } catch (error) {
    console.error('[EXPORT-PDF] Error:', error);
    return res.status(500).json({
      error: 'PDF generation failed',
      message: error.message
    });
  }
}

/**
 * Sanitize filename for safe download
 */
function sanitizeFilename(name) {
  return name
    .replace(/[^a-zA-Z0-9-_\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50)
    .toLowerCase();
}
