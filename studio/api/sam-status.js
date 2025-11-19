// Vercel Serverless Function: Get SAM-2 Job Status
// GET /api/sam-status?jobId=...

import { getSupabaseServiceClient } from './_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.'
    });
  }

  try {
    const { jobId } = req.query;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: jobId'
      });
    }

    const supabase = getSupabaseServiceClient();

    // Fetch job
    const { data: job, error: fetchError } = await supabase
      .from('sam_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (fetchError || !job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Return status and results
    return res.status(200).json({
      success: true,
      jobId: job.id,
      status: job.status,
      mask_url: job.mask_url || null,
      mask_dimensions: job.mask_dimensions || job.scaled_dimensions,
      scale_factor: job.scale_factor,
      original_dimensions: job.original_dimensions,
      error: job.error || null,
      created_at: job.created_at,
      updated_at: job.updated_at
    });

  } catch (error) {
    console.error('[SAM-STATUS] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

export const config = {
  maxDuration: 5 // Very short - just database query
};
