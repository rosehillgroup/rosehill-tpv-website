/**
 * Canvas PDF Export API Endpoint
 * Server-side PDF generation at 1:100 scale with dimension annotations
 *
 * POST /api/export-canvas-pdf
 */

import { checkRateLimit } from './_utils/rateLimit.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
  maxDuration: 60, // 60 second timeout for PDF generation
};

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  // Check rate limit
  try {
    const rateCheck = await checkRateLimit(token, 'canvas-pdf-export');
    if (!rateCheck.allowed) {
      res.setHeader('X-RateLimit-Limit', rateCheck.limit);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', rateCheck.reset);
      return res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: rateCheck.reset
      });
    }

    res.setHeader('X-RateLimit-Limit', rateCheck.limit);
    res.setHeader('X-RateLimit-Remaining', rateCheck.remaining);
    res.setHeader('X-RateLimit-Reset', rateCheck.reset);
  } catch (error) {
    console.error('[CANVAS-PDF] Rate limit check failed:', error);
    // Continue anyway if rate limit check fails
  }

  try {
    const {
      svgString,
      designName,
      widthMm,
      lengthMm,
      designType,
    } = req.body;

    // Validate required fields
    if (!svgString) {
      return res.status(400).json({ error: 'SVG string is required' });
    }

    if (!widthMm || !lengthMm) {
      return res.status(400).json({ error: 'Dimensions (widthMm, lengthMm) are required' });
    }

    console.log('[CANVAS-PDF] Starting generation...');
    console.log('[CANVAS-PDF] Design:', designName);
    console.log('[CANVAS-PDF] Dimensions:', widthMm, 'x', lengthMm, 'mm');

    // Import generator dynamically to reduce cold start
    const { generateCanvasPDF } = await import('./_utils/pdf/canvasGenerator.js');

    // Generate the PDF
    const pdfBuffer = await generateCanvasPDF({
      svgString,
      designName: designName || 'TPV Design',
      widthMm,
      lengthMm,
      designType: designType || 'sports',
    });

    console.log('[CANVAS-PDF] Generation complete, size:', pdfBuffer.length, 'bytes');

    // Create safe filename
    const safeFilename = (designName || 'design')
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
      .substring(0, 50);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}-canvas.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-store');

    // Send PDF
    return res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('[CANVAS-PDF] Generation failed:', error);

    // Return appropriate error response
    if (error.message?.includes('SVG') || error.message?.includes('render')) {
      return res.status(400).json({
        error: 'Failed to process design',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'PDF generation failed',
      message: error.message
    });
  }
}
