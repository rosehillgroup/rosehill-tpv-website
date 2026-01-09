/**
 * Admin Recovery - Orphaned Jobs API
 * GET /api/admin/recovery/orphaned - List orphaned generation jobs
 *
 * OPTIMIZED: Uses SQL-level filtering and pagination instead of fetching all records
 */

import { getAuthenticatedClient, getSupabaseServiceClient } from '../../_utils/supabase.js';
import { requireAdmin } from '../../_utils/admin.js';

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

    // Parse query params with pagination
    const {
      age_filter, // 24h, 7d, 30d, all
      group_by = 'none', // none, user, age
      page = '1',
      limit = '50'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const offset = (pageNum - 1) * limitNum;

    // Use service client for admin operations
    const supabase = getSupabaseServiceClient();

    // First, get all saved job_ids (this is a small lookup table)
    const { data: savedDesigns, error: savedError } = await supabase
      .from('saved_designs')
      .select('job_id');

    if (savedError) {
      console.error('[ADMIN-RECOVERY] Error fetching saved designs:', savedError);
      throw new Error('Failed to fetch saved designs');
    }

    const savedJobIds = (savedDesigns || []).map(sd => sd.job_id);

    // Build age filter date
    let ageFilterDate = null;
    if (age_filter === '24h') {
      ageFilterDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    } else if (age_filter === '7d') {
      ageFilterDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (age_filter === '30d') {
      ageFilterDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    // Build query for orphaned jobs - filter at SQL level
    // Only select fields needed for display (not full outputs/metadata)
    let jobsQuery = supabase
      .from('studio_jobs')
      .select('id, user_id, prompt, width_mm, length_mm, compliant, outputs, created_at, completed_at', { count: 'exact' })
      .eq('status', 'completed');

    // Apply age filter at SQL level
    if (ageFilterDate) {
      jobsQuery = jobsQuery.gte('created_at', ageFilterDate);
    }

    // Filter out saved jobs at SQL level (if we have saved IDs)
    if (savedJobIds.length > 0) {
      // Use NOT IN filter - Supabase uses 'not.in' for this
      jobsQuery = jobsQuery.not('id', 'in', `(${savedJobIds.join(',')})`);
    }

    // Get paginated results with count in single query
    const { data: orphanedJobs, error: jobsError, count: totalOrphaned } = await jobsQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (jobsError) {
      console.error('[ADMIN-RECOVERY] Error fetching orphaned jobs:', jobsError);
      throw new Error('Failed to fetch orphaned jobs');
    }

    // Get user emails only for users in current page (not all users)
    const userIds = [...new Set((orphanedJobs || []).map(j => j.user_id).filter(Boolean))];
    let userMap = {};

    if (userIds.length > 0) {
      // Fetch only the users we need using getUserById for each (more efficient for small sets)
      // Or use listUsers with pagination if the user count is large
      const { data: authUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      if (authUsers?.users) {
        // Only map the users we need
        authUsers.users.forEach(u => {
          if (userIds.includes(u.id)) {
            userMap[u.id] = u.email;
          }
        });
      }
    }

    // Calculate age buckets (for stats display)
    const now = Date.now();
    const ageBuckets = {
      '<24h': 0,
      '1-7d': 0,
      '7-30d': 0,
      '>30d': 0
    };

    // Format orphaned jobs
    const formattedJobs = (orphanedJobs || []).map(job => {
      const ageMs = now - new Date(job.created_at).getTime();
      const ageDays = ageMs / (1000 * 60 * 60 * 24);

      let ageBucket;
      if (ageDays < 1) {
        ageBucket = '<24h';
        ageBuckets['<24h']++;
      } else if (ageDays < 7) {
        ageBucket = '1-7d';
        ageBuckets['1-7d']++;
      } else if (ageDays < 30) {
        ageBucket = '7-30d';
        ageBuckets['7-30d']++;
      } else {
        ageBucket = '>30d';
        ageBuckets['>30d']++;
      }

      return {
        id: job.id,
        user_id: job.user_id,
        prompt: job.prompt,
        width_mm: job.width_mm,
        length_mm: job.length_mm,
        compliant: job.compliant,
        created_at: job.created_at,
        completed_at: job.completed_at,
        user_email: userMap[job.user_id] || 'Unknown',
        age_bucket: ageBucket,
        age_days: Math.floor(ageDays),
        thumbnail_url: job.outputs?.thumbnail_url || null,
        auto_name: job.prompt ? job.prompt.substring(0, 50) + (job.prompt.length > 50 ? '...' : '') : 'Untitled Design'
      };
    });

    // Group by user if requested (only for current page)
    let groupedByUser = null;
    if (group_by === 'user') {
      groupedByUser = {};
      formattedJobs.forEach(job => {
        const email = job.user_email;
        if (!groupedByUser[email]) {
          groupedByUser[email] = {
            user_id: job.user_id,
            user_email: email,
            count: 0,
            jobs: []
          };
        }
        groupedByUser[email].count++;
        groupedByUser[email].jobs.push(job);
      });

      // Convert to array and sort by count
      groupedByUser = Object.values(groupedByUser)
        .sort((a, b) => b.count - a.count);
    }

    return res.status(200).json({
      success: true,
      total: totalOrphaned || 0,
      page: pageNum,
      limit: limitNum,
      total_pages: Math.ceil((totalOrphaned || 0) / limitNum),
      age_buckets: ageBuckets,
      grouped_by_user: groupedByUser,
      orphaned_jobs: formattedJobs
    });

  } catch (error) {
    console.error('[ADMIN-RECOVERY] Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch orphaned jobs',
      message: error.message
    });
  }
}
