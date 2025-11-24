/**
 * Admin Jobs API Endpoint
 * GET /api/admin/jobs - List all generation jobs across all users
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

    // Build query with left join to check if saved
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
        attempt_current,
        attempt_max,
        compliant,
        outputs,
        metadata,
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

    // Get user emails for the jobs
    const userIds = [...new Set(jobs.map(j => j.user_id).filter(Boolean))];

    let userMap = {};
    if (userIds.length > 0) {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      if (authUsers?.users) {
        authUsers.users.forEach(u => {
          userMap[u.id] = u.email;
        });
      }
    }

    // Check which jobs have saved designs
    const jobIds = jobs.map(j => j.id);
    const { data: savedDesigns } = await supabase
      .from('saved_designs')
      .select('job_id')
      .in('job_id', jobIds);

    const savedJobIds = new Set((savedDesigns || []).map(sd => sd.job_id));

    // Format jobs with user info and saved status
    let formattedJobs = jobs.map(job => ({
      ...job,
      user_email: userMap[job.user_id] || 'Unknown',
      is_saved: savedJobIds.has(job.id),
      thumbnail_url: job.outputs?.thumbnail_url || null,
      duration_seconds: job.completed_at && job.started_at
        ? Math.round((new Date(job.completed_at) - new Date(job.started_at)) / 1000)
        : null
    }));

    // Apply saved_status filter after fetching
    if (saved_status === 'saved') {
      formattedJobs = formattedJobs.filter(j => j.is_saved);
    } else if (saved_status === 'orphaned') {
      formattedJobs = formattedJobs.filter(j => !j.is_saved && j.status === 'completed');
    }

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
