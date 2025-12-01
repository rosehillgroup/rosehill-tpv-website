/**
 * PDF Export API Endpoint
 * POST /api/export-pdf
 *
 * Generates a professional PDF document with design preview,
 * colour breakdown, and installation material requirements.
 */

import { getAuthenticatedClient } from './_utils/supabase.js';
import { checkRateLimit, getRateLimitResponse, getRateLimitIdentifier } from './_utils/rateLimit.js';

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
    // Get authenticated user (REQUIRED)
    const { user } = await getAuthenticatedClient(req);

    if (!user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please sign in to export PDFs.'
      });
    }

    // Check rate limit
    const identifier = getRateLimitIdentifier(req, user);
    const rateLimitCheck = await checkRateLimit(identifier, '/api/export-pdf');

    if (!rateLimitCheck.allowed) {
      return res.status(429).json(
        getRateLimitResponse(rateLimitCheck.limit, rateLimitCheck.remaining, rateLimitCheck.reset)
      );
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', rateLimitCheck.limit.toString());
    res.setHeader('X-RateLimit-Remaining', rateLimitCheck.remaining.toString());
    res.setHeader('X-RateLimit-Reset', rateLimitCheck.reset.toString());

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
      // SECURITY: Validate URL origin to prevent SSRF attacks
      const allowedOrigins = [
        process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).origin : null,
        'https://replicate.delivery',
        'https://pbxt.replicate.delivery'
      ].filter(Boolean);

      let isAllowedUrl = false;
      try {
        const parsedUrl = new URL(svgUrl);
        isAllowedUrl = allowedOrigins.some(origin => parsedUrl.origin === origin);
        // Also allow Supabase storage subdomains
        if (!isAllowedUrl && parsedUrl.hostname.endsWith('.supabase.co')) {
          isAllowedUrl = true;
        }
      } catch {
        isAllowedUrl = false;
      }

      if (!isAllowedUrl) {
        return res.status(400).json({
          error: 'Invalid SVG URL: must be from allowed origin'
        });
      }

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
