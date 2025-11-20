// Vercel Serverless Function: Process Uploaded SVG File
// POST /api/process-uploaded-svg
// Accepts pre-uploaded SVG files and processes them directly (fast path)

import { getSupabaseServiceClient, getAuthenticatedClient } from './_utils/supabase.js';
import { randomUUID } from 'crypto';

/**
 * Process uploaded SVG file (direct path - no AI generation)
 *
 * Request body:
 * {
 *   svg_url: string,             // URL to uploaded SVG file
 *   width_mm: number,            // Surface width in millimeters
 *   length_mm: number            // Surface height in millimeters
 * }
 *
 * Response:
 * {
 *   success: true,
 *   jobId: string,
 *   status: 'completed',
 *   svgUrl: string
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
    // Get authenticated user (if available)
    const { user } = await getAuthenticatedClient(req);

    const {
      svg_url,
      width_mm,
      length_mm
    } = req.body;

    // Validate required fields
    if (!svg_url || typeof svg_url !== 'string' || !svg_url.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid "svg_url" field'
      });
    }

    // Validate that URL is from Supabase storage (security check)
    if (!svg_url.includes('supabase.co/storage')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid SVG URL. Must be uploaded to Supabase storage first.'
      });
    }

    // Dimensions are optional - they're only used for tracking/metadata, not processing
    if (width_mm !== undefined && (typeof width_mm !== 'number' || width_mm <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid "width_mm" field (must be positive number if provided)'
      });
    }

    if (length_mm !== undefined && (typeof length_mm !== 'number' || length_mm <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid "length_mm" field (must be positive number if provided)'
      });
    }

    console.log('[PROCESS-SVG] New request:', {
      svgUrl: svg_url,
      dimensions: width_mm && length_mm ? `${width_mm}mm x ${length_mm}mm` : 'Not specified'
    });

    // Fetch and validate SVG content
    let svgContent;
    try {
      const response = await fetch(svg_url);
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`);
      }
      svgContent = await response.text();
    } catch (fetchError) {
      console.error('[PROCESS-SVG] Failed to fetch SVG:', fetchError);
      return res.status(400).json({
        success: false,
        error: 'Failed to fetch SVG file from provided URL',
        details: fetchError.message
      });
    }

    // Validate SVG content
    if (!svgContent.trim().toLowerCase().includes('<svg')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file. Must be a valid SVG file.'
      });
    }

    // Generate job ID (UUID format required by Supabase)
    const jobId = randomUUID();

    // Initialize Supabase client
    const supabase = getSupabaseServiceClient();

    // Create job record - mark as 'completed' immediately since no AI processing needed
    const jobData = {
      id: jobId,
      mode_type: 'uploaded_svg',
      status: 'completed', // Fast path - SVG is ready immediately
      prompt: `Uploaded SVG file: ${svg_url.split('/').pop()}`,
      user_id: user?.id || null, // Track which user created this job
      surface: {
        width_mm,
        height_mm: length_mm
      },
      width_mm,
      length_mm,
      attempt_current: 1,
      attempt_max: 1,
      validation_history: [],
      compliant: true, // Assume user's SVG is valid (will be validated in color extraction)
      all_attempt_urls: [svg_url],
      inspector_final_reasons: [],
      outputs: {
        svg_url: svg_url, // Frontend expects result.svg_url
        png_url: null, // No PNG for uploaded SVGs
        thumbnail_url: null
      },
      metadata: {
        source_svg_url: svg_url,
        upload_type: 'direct_svg',
        created_at: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: insertError } = await supabase
      .from('studio_jobs')
      .insert([jobData]);

    if (insertError) {
      console.error('[PROCESS-SVG] Failed to create job:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create job record',
        details: insertError.message
      });
    }

    console.log(`[PROCESS-SVG] Job created and completed immediately: ${jobId}`);

    // Return success - job is already complete and ready for color extraction
    return res.status(200).json({
      success: true,
      jobId,
      status: 'completed',
      svgUrl: svg_url,
      message: 'SVG uploaded successfully. Ready for color extraction.'
    });

  } catch (error) {
    console.error('[PROCESS-SVG] Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}
