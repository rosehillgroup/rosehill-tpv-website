/**
 * Sports Surface PDF Export API Endpoint
 * Server-side PDF generation for sports surface designs
 *
 * POST /api/export-sports-pdf
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
    const rateCheck = await checkRateLimit(token, 'sports-pdf-export');
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
    console.error('[SPORTS-PDF] Rate limit check failed:', error);
    // Continue anyway if rate limit check fails
  }

  try {
    const {
      svgString,
      designName,
      surface,
      courts,
      tracks,
      motifs,
      dimensions,
    } = req.body;

    // Validate required fields
    if (!svgString) {
      return res.status(400).json({ error: 'SVG string is required' });
    }

    if (!surface || !dimensions) {
      return res.status(400).json({ error: 'Surface and dimensions are required' });
    }

    console.log('[SPORTS-PDF] Starting generation...');
    console.log('[SPORTS-PDF] Design:', designName);
    console.log('[SPORTS-PDF] Surface:', surface.width_mm, 'x', surface.length_mm);
    console.log('[SPORTS-PDF] Courts:', Object.keys(courts || {}).length);
    console.log('[SPORTS-PDF] Tracks:', Object.keys(tracks || {}).length);
    console.log('[SPORTS-PDF] Motifs:', (motifs || []).length);

    // Import generator dynamically (for edge runtime compatibility)
    const { generateSportsSurfacePDF } = await import('./_utils/pdf/sportsGenerator.js');

    const pdfBuffer = await generateSportsSurfacePDF({
      svgString,
      designName: designName || 'Sports Surface Design',
      surface,
      courts: courts || {},
      tracks: tracks || {},
      motifs: motifs || [],
      dimensions,
    });

    console.log('[SPORTS-PDF] Generated:', pdfBuffer.length, 'bytes');

    // Set response headers
    const safeFilename = (designName || 'sports-surface')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}-materials.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('[SPORTS-PDF] Generation error:', error);
    return res.status(500).json({
      error: 'PDF generation failed',
      message: error.message
    });
  }
}
