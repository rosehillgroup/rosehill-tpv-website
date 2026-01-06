// Vercel Serverless Function: Generate AI Design Name Suggestions
// POST /api/generate-design-name
// Uses Claude Haiku to generate creative project names for TPV designs

import Anthropic from '@anthropic-ai/sdk';
import { getAuthenticatedClient } from './_utils/supabase.js';
import { checkRateLimit, getRateLimitResponse, getRateLimitIdentifier } from './_utils/rateLimit.js';
import { getCached, setCache, hashInputs, CACHE_TTL, CACHE_PREFIX } from './_utils/cache.js';
import { createLogger } from './_utils/logger.js';

/**
 * Initialize Anthropic client
 */
function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable not set');
  }
  return new Anthropic({ apiKey });
}

/**
 * Generate design name suggestions using Claude Haiku
 *
 * Request body:
 * {
 *   prompt: string,              // Original design description
 *   colors: string[],            // TPV color names used in design
 *   dimensions: {                // Surface dimensions
 *     widthMM: number,
 *     lengthMM: number
 *   }
 * }
 *
 * Response:
 * {
 *   success: true,
 *   names: string[]              // Array of 3 suggested names
 * }
 */
export default async function handler(req, res) {
  // Initialize structured logger
  const logger = createLogger(req, { endpoint: '/api/generate-design-name' });

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    // Get authenticated user (REQUIRED for AI operations)
    const { user } = await getAuthenticatedClient(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in to generate design names.'
      });
    }

    // Check rate limit
    const identifier = getRateLimitIdentifier(req, user);
    const rateLimitCheck = await checkRateLimit(identifier, '/api/generate-design-name');

    if (!rateLimitCheck.allowed) {
      return res.status(429).json(
        getRateLimitResponse(rateLimitCheck.limit, rateLimitCheck.remaining, rateLimitCheck.reset)
      );
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', rateLimitCheck.limit.toString());
    res.setHeader('X-RateLimit-Remaining', rateLimitCheck.remaining.toString());
    res.setHeader('X-RateLimit-Reset', rateLimitCheck.reset.toString());

    const {
      prompt,
      colors = [],
      dimensions = {}
    } = req.body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid "prompt" field'
      });
    }

    // Check cache first
    const cacheKey = CACHE_PREFIX.DESIGN_NAME + hashInputs({
      prompt: prompt.trim().toLowerCase(),
      colors: colors.slice(0, 6).sort(), // Normalize colors
      dimensions: { w: dimensions.widthMM, l: dimensions.lengthMM }
    });

    const cachedNames = await getCached(cacheKey);
    if (cachedNames) {
      logger.info('Cache hit for design name', { cacheHit: true });
      res.setHeader('X-Correlation-Id', logger.correlationId);
      return res.status(200).json({
        success: true,
        names: cachedNames,
        cached: true
      });
    }

    logger.info('Generating design names', {
      promptLength: prompt.length,
      colorCount: colors.length,
      cacheHit: false
    });

    // Build context for Claude
    const colorList = colors.length > 0
      ? `Colors used: ${colors.slice(0, 6).join(', ')}`
      : '';

    const sizeInfo = dimensions.widthMM && dimensions.lengthMM
      ? `Size: ${dimensions.widthMM}mm x ${dimensions.lengthMM}mm`
      : '';

    const systemPrompt = `You are a creative naming assistant for TPV Studio, a playground surfacing design tool.
Generate professional, evocative project names for rubber playground surface designs.

Names should be:
- 3-5 words long
- Descriptive but not overly literal
- Suitable for professional client presentations
- Evocative of the theme without being childish
- Capitalised in title case

You MUST respond with only valid JSON in this exact format:
{
  "names": ["Name One", "Name Two", "Name Three"]
}

Do not include any other text or commentary.`;

    const userPrompt = `Generate 3 project names for this TPV playground surface design:

Design concept: "${prompt}"
${colorList}
${sizeInfo}

The names should capture the essence of the design theme while sounding professional.`;

    // Call Claude Haiku
    const anthropic = getAnthropicClient();

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    // Parse response
    const responseText = response.content[0]?.text || '';

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[GENERATE-NAME] Failed to parse Claude response:', responseText);
      // Try to extract names from response even if not valid JSON
      const nameMatches = responseText.match(/"([^"]+)"/g);
      if (nameMatches && nameMatches.length >= 1) {
        parsed = {
          names: nameMatches.slice(0, 3).map(n => n.replace(/"/g, ''))
        };
      } else {
        throw new Error('Invalid response format from AI');
      }
    }

    if (!parsed.names || !Array.isArray(parsed.names) || parsed.names.length === 0) {
      throw new Error('No names returned from AI');
    }

    const names = parsed.names.slice(0, 3);

    // Cache the result for 24 hours
    await setCache(cacheKey, names, CACHE_TTL.DESIGN_NAME);

    logger.info('Generated design names', {
      nameCount: names.length,
      durationMs: logger.getDuration()
    });

    res.setHeader('X-Correlation-Id', logger.correlationId);
    return res.status(200).json({
      success: true,
      names
    });

  } catch (error) {
    logger.error('Design name generation failed', {
      error: error.message,
      stack: error.stack?.slice(0, 500)
    });

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate design name'
    });
  }
}

/**
 * Export config
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100kb'
    }
  }
};
