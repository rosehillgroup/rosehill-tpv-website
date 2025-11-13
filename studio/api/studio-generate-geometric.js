// Vercel Serverless Function: Generate Geometric SVG Design
// POST /api/studio-generate-geometric

import { generateGeometricSVG, parseBrief } from './_utils/geometric/generator.js';
import { validateGeometricSVG, generateQCReport } from './_utils/geometric/qc.js';

/**
 * Generate a geometric SVG design from a brief
 *
 * Request body:
 * {
 *   brief: string,              // Design brief/description
 *   canvas?: {                  // Optional canvas dimensions
 *     width_mm: number,
 *     height_mm: number
 *   },
 *   options?: {                 // Optional generation parameters
 *     mood: string,             // playful, serene, energetic, bold, calm
 *     composition: string,      // bands, islands, motifs, mixed
 *     colorCount: number,       // 3-8
 *     seed: number              // For reproducibility
 *   },
 *   validate?: boolean          // Run QC validation (default: true)
 * }
 *
 * Response:
 * {
 *   success: true,
 *   svg: string,
 *   metadata: object,
 *   validation?: {
 *     pass: boolean,
 *     issues: string[],
 *     warnings: string[]
 *   }
 * }
 */
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const {
      brief,
      canvas,
      options = {},
      validate = true
    } = req.body;

    // Validate required fields
    if (!brief || typeof brief !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid "brief" field'
      });
    }

    console.log('[GEOMETRIC] Generating design for brief:', brief);
    console.log('[GEOMETRIC] Options:', options);

    // Parse brief to extract parameters (can be overridden by explicit options)
    const parsedParams = await parseBrief(brief, canvas);

    // Merge explicit options over parsed params
    const finalParams = {
      brief,
      canvas: canvas || parsedParams.canvas,
      options: {
        ...parsedParams.options,
        ...options
      },
      layout: parsedParams.layout,      // Pass layout (recipe, complexity)
      metadata: parsedParams.metadata   // Pass metadata (themes, reasoning)
    };

    // Generate SVG
    const startTime = Date.now();
    const { svg, metadata } = await generateGeometricSVG(finalParams);
    const generationTime = Date.now() - startTime;

    console.log(`[GEOMETRIC] Generated in ${generationTime}ms`);
    console.log('[GEOMETRIC] Layers:', metadata.layerCount);
    console.log('[GEOMETRIC] Palette:', metadata.palette);

    // Run QC validation if requested
    let validationResult = null;
    if (validate) {
      console.log('[GEOMETRIC] Running QC validation...');
      validationResult = await validateGeometricSVG(svg, metadata);

      if (!validationResult.pass) {
        console.warn('[GEOMETRIC] QC FAILED:', validationResult.issues);
      } else {
        console.log('[GEOMETRIC] QC PASSED');
      }

      if (validationResult.warnings.length > 0) {
        console.warn('[GEOMETRIC] QC Warnings:', validationResult.warnings);
      }

      // Generate and log full report
      const report = generateQCReport(validationResult, metadata);
      console.log('[GEOMETRIC] QC Report:\n' + report);
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      svg,
      metadata: {
        ...metadata,
        generationTimeMs: generationTime
      },
      validation: validationResult
    });

  } catch (error) {
    console.error('[GEOMETRIC] Generation error:', error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate geometric design',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Export config for larger payloads (SVG can be large)
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};
