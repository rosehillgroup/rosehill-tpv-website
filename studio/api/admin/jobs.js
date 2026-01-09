/**
 * Admin Jobs API Endpoint
 * GET /api/admin/jobs - List all generation jobs across all users
 *
 * OPTIMIZED: Reduced field selection, efficient user lookup
 */

import { getAuthenticatedClient, getSupabaseServiceClient } from '../_utils/supabase.js';
import { requireAdmin } from '../_utils/admin.js';

export const config = {
  api: {
    bodyParser: true
  },
  maxDuration: 30
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user
    const { user } = await getAuthenticatedClient(req);

    // Check admin access
    const isAdminUser = await requireAdmin(req, res, user);
    if (!isAdminUser) return;

    // Parse query params
    const {
      limit = 50,
      offset = 0,
      user_id,
      status, // queued, running, completed, failed
      saved_status, // all, saved, orphaned
      mode_type,
      search, // search in prompt
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    // Use service client for admin operations
    const supabase = getSupabaseServiceClient();

    // For saved_status filtering, we need to get saved job IDs first
    let savedJobIds = new Set();
    if (saved_status === 'saved' || saved_status === 'orphaned') {
      const { data: allSavedDesigns } = await supabase
        .from('saved_designs')
        .select('job_id');
      savedJobIds = new Set((allSavedDesigns || []).map(sd => sd.job_id));
    }

    // Build query - ONLY select fields needed for display (not full metadata/outputs)
    let query = supabase
      .from('studio_jobs')
      .select(`
        id,
        user_id,
        status,
        prompt,
        mode_type,
        width_mm,
        length_mm,
        compliant,
        outputs,
        created_at,
        started_at,
        completed_at
      `, { count: 'exact' });

    // Apply filters
    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (mode_type) {
      query = query.eq('mode_type', mode_type);
    }

    if (search) {
      query = query.ilike('prompt', `%${search}%`);
    }

    // Apply saved_status filter at SQL level when possible
    if (saved_status === 'orphaned') {
      // For orphaned, we need completed jobs that aren't saved
      query = query.eq('status', 'completed');
      if (savedJobIds.size > 0) {
        query = query.not('id', 'in', `(${Array.from(savedJobIds).join(',')})`);
      }
    } else if (saved_status === 'saved') {
      // For saved, filter to only saved job IDs
      if (savedJobIds.size > 0) {
        query = query.in('id', Array.from(savedJobIds));
      } else {
        // No saved jobs - return empty
        return res.status(200).json({
          success: true,
          jobs: [],
          total: 0,
          limit: parseInt(limit),
          offset: parseInt(offset)
        });
      }
    }

    // Apply sorting
    const validSortFields = ['created_at', 'completed_at', 'status'];
    const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
    const ascending = sort_order === 'asc';

    query = query
      .order(sortField, { ascending })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: jobs, error, count } = await query;

    if (error) {
      console.error('[ADMIN-JOBS] Error fetching jobs:', error);
      throw new Error('Failed to fetch jobs');
    }

    // Get user emails ONLY for users in current page (not all users)
    const userIds = [...new Set((jobs || []).map(j => j.user_id).filter(Boolean))];

    let userMap = {};
    if (userIds.length > 0) {
      // Fetch users - with perPage to limit request size
      const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      if (authUsers?.users) {
        // Only map users we need
        authUsers.users.forEach(u => {
          if (userIds.includes(u.id)) {
            userMap[u.id] = u.email;
          }
        });
      }
    }

    // Check which jobs in current page have saved designs (if not already filtered)
    let savedJobIdsInPage = savedJobIds;
    if (saved_status !== 'saved' && saved_status !== 'orphaned') {
      const jobIds = (jobs || []).map(j => j.id);
      if (jobIds.length > 0) {
        const { data: savedDesigns } = await supabase
          .from('saved_designs')
          .select('job_id')
          .in('job_id', jobIds);
        savedJobIdsInPage = new Set((savedDesigns || []).map(sd => sd.job_id));
      }
    }

    // Format jobs with user info and saved status - only include needed fields
    const formattedJobs = (jobs || []).map(job => ({
      id: job.id,
      user_id: job.user_id,
      status: job.status,
      prompt: job.prompt,
      mode_type: job.mode_type,
      width_mm: job.width_mm,
      length_mm: job.length_mm,
      compliant: job.compliant,
      created_at: job.created_at,
      started_at: job.started_at,
      completed_at: job.completed_at,
      user_email: userMap[job.user_id] || 'Unknown',
      is_saved: savedJobIdsInPage.has(job.id),
      thumbnail_url: job.outputs?.thumbnail_url || null,
      duration_seconds: job.completed_at && job.started_at
        ? Math.round((new Date(job.completed_at) - new Date(job.started_at)) / 1000)
        : null
    }));

    return res.status(200).json({
      success: true,
      jobs: formattedJobs,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('[ADMIN-JOBS] Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch jobs',
      message: error.message
    });
  }
}
