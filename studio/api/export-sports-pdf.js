/**
 * Sports Surface PDF Export API Endpoint
 * Server-side PDF generation for sports surface designs
 *
 * POST /api/export-sports-pdf
 */

import { checkRateLimit } from './_utils/rateLimit.js';
import { getCached, setCache, hashInputs, CACHE_TTL, CACHE_PREFIX } from './_utils/cache.js';
import { createLogger, getDesignContext, getExportContext } from './_utils/logger.js';

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

  // Initialize structured logger
  const logger = createLogger(req, { endpoint: '/api/export-sports-pdf' });

  try {
    const {
      svgString,
      designName,
      surface,
      courts,
      tracks,
      shapes,
      texts,
      motifs,
      exclusionZones,
      dimensions,
    } = req.body;

    // Validate required fields
    if (!svgString) {
      return res.status(400).json({ error: 'SVG string is required' });
    }

    if (!surface || !dimensions) {
      return res.status(400).json({ error: 'Surface and dimensions are required' });
    }

    // Generate cache key from design structure (not full SVG)
    const designSignature = {
      surfaceSize: `${surface.width_mm}x${surface.length_mm}`,
      courtCount: Object.keys(courts || {}).length,
      trackCount: Object.keys(tracks || {}).length,
      shapeCount: Object.keys(shapes || {}).length,
      textCount: Object.keys(texts || {}).length,
      motifCount: (motifs || []).length,
      exclusionCount: Object.keys(exclusionZones || {}).length,
      designName: designName || 'untitled',
      svgLength: svgString.length, // Include SVG length as rough content indicator
    };
    const cacheKey = CACHE_PREFIX.PDF + hashInputs(designSignature);

    // Check if this exact PDF was recently generated (within TTL)
    const cachedTimestamp = await getCached(cacheKey);
    const cacheHit = !!cachedTimestamp;

    // Get design context for logging
    const designContext = getDesignContext({
      surface,
      courts,
      tracks,
      shapes,
      texts,
      motifs,
      exclusionZones
    });

    logger.info('PDF export started', {
      designName,
      ...designContext,
      cacheHit,
      svgBytes: svgString.length
    });

    // Import generator dynamically (for edge runtime compatibility)
    const { generateSportsSurfacePDF } = await import('./_utils/pdf/sportsGenerator.js');

    const pdfBuffer = await generateSportsSurfacePDF({
      svgString,
      designName: designName || 'Sports Surface Design',
      surface,
      courts: courts || {},
      tracks: tracks || {},
      shapes: shapes || {},
      texts: texts || {},
      motifs: motifs || [],
      exclusionZones: exclusionZones || {},
      dimensions,
    });

    // Cache the generation timestamp (for observability)
    await setCache(cacheKey, Date.now(), CACHE_TTL.PDF_URL);

    logger.info('PDF export completed', {
      pdfBytes: pdfBuffer.length,
      durationMs: logger.getDuration()
    });

    // Set response headers
    const safeFilename = (designName || 'sports-surface')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}-materials.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('X-Correlation-Id', logger.correlationId);

    return res.status(200).send(pdfBuffer);

  } catch (error) {
    logger.error('PDF generation failed', {
      error: error.message,
      stack: error.stack?.slice(0, 500)
    });
    return res.status(500).json({
      error: 'PDF generation failed',
      message: error.message
    });
  }
}
