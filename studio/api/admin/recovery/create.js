/**
 * Admin Recovery - Create Saved Designs from Jobs
 * POST /api/admin/recovery/create - Bulk recover orphaned jobs as saved designs
 */

import { getAuthenticatedClient, getSupabaseServiceClient } from '../../_utils/supabase.js';
import { requireAdmin } from '../../_utils/admin.js';

export const config = {
  api: {
    bodyParser: true
  },
  maxDuration: 60
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user
    const { user } = await getAuthenticatedClient(req);

    // Check admin access
    const isAdminUser = await requireAdmin(req, res, user);
    if (!isAdminUser) return;

    // Get job_ids from request body
    const { job_ids } = req.body;

    if (!job_ids || !Array.isArray(job_ids) || job_ids.length === 0) {
      return res.status(400).json({ error: 'job_ids array is required' });
    }

    // Use service client for admin operations
    const supabase = getSupabaseServiceClient();

    // Fetch jobs to recover
    const { data: jobs, error: jobsError } = await supabase
      .from('studio_jobs')
      .select('*')
      .in('id', job_ids)
      .eq('status', 'completed');

    if (jobsError) {
      console.error('[ADMIN-RECOVERY] Error fetching jobs:', jobsError);
      throw new Error('Failed to fetch jobs');
    }

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ error: 'No completed jobs found for the given IDs' });
    }

    // Check that none are already saved
    const { data: existingDesigns } = await supabase
      .from('saved_designs')
      .select('job_id')
      .in('job_id', job_ids);

    const alreadySavedJobIds = new Set((existingDesigns || []).map(sd => sd.job_id));

    // Filter out already saved
    const jobsToRecover = jobs.filter(job => !alreadySavedJobIds.has(job.id));

    if (jobsToRecover.length === 0) {
      return res.status(400).json({
        error: 'All selected jobs are already saved',
        already_saved_count: alreadySavedJobIds.size
      });
    }

    // Create saved_designs records
    const savedDesignsToCreate = jobsToRecover.map(job => {
      // Auto-generate name from prompt
      const autoName = job.prompt
        ? job.prompt.substring(0, 50) + (job.prompt.length > 50 ? '...' : '')
        : 'Untitled Design';

      return {
        user_id: job.user_id,
        job_id: job.id,
        name: autoName,
        description: `Recovered design from ${new Date(job.created_at).toLocaleDateString()}`,

        // Input data
        input_mode: 'prompt',
        prompt: job.prompt,
        dimensions: {
          widthMM: job.width_mm,
          lengthMM: job.length_mm
        },

        // Outputs from job
        original_svg_url: job.outputs?.svg_url || job.outputs?.final_url,
        original_png_url: job.outputs?.png_url,
        thumbnail_url: job.outputs?.thumbnail_url,

        // Recipes from job
        solid_recipes: job.outputs?.solid_recipes || [],
        blend_recipes: job.outputs?.blend_recipes || [],
        color_mapping: job.outputs?.color_mapping || {},
        solid_color_mapping: job.outputs?.solid_color_mapping || {},

        // Mark as recovered
        created_at: job.completed_at || job.created_at,
        updated_at: new Date().toISOString(),

        // Use preferred view mode from job metadata if available
        preferred_view_mode: job.metadata?.preferred_view_mode || 'blend'
      };
    });

    // Insert into saved_designs
    const { data: createdDesigns, error: insertError } = await supabase
      .from('saved_designs')
      .insert(savedDesignsToCreate)
      .select();

    if (insertError) {
      console.error('[ADMIN-RECOVERY] Error creating saved designs:', insertError);
      throw new Error('Failed to create saved designs: ' + insertError.message);
    }

    console.log(`[ADMIN-RECOVERY] Successfully recovered ${createdDesigns.length} designs`);

    return res.status(200).json({
      success: true,
      recovered_count: createdDesigns.length,
      skipped_count: alreadySavedJobIds.size,
      recovered_designs: createdDesigns
    });

  } catch (error) {
    console.error('[ADMIN-RECOVERY] Error:', error);
    return res.status(500).json({
      error: 'Failed to recover designs',
      message: error.message
    });
  }
}
