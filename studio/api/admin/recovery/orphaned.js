/**
 * Admin Recovery - Orphaned Jobs API
 * GET /api/admin/recovery/orphaned - List orphaned generation jobs
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

    // Parse query params
    const {
      age_filter, // 24h, 7d, 30d, all
      group_by = 'none' // none, user, age
    } = req.query;

    // Use service client for admin operations
    const supabase = getSupabaseServiceClient();

    // Get all completed jobs
    let jobsQuery = supabase
      .from('studio_jobs')
      .select('id, user_id, prompt, width_mm, length_mm, compliant, outputs, created_at, completed_at')
      .eq('status', 'completed');

    // Apply age filter
    if (age_filter === '24h') {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      jobsQuery = jobsQuery.gte('created_at', oneDayAgo);
    } else if (age_filter === '7d') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      jobsQuery = jobsQuery.gte('created_at', sevenDaysAgo);
    } else if (age_filter === '30d') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      jobsQuery = jobsQuery.gte('created_at', thirtyDaysAgo);
    }

    const { data: jobs, error: jobsError } = await jobsQuery;

    if (jobsError) {
      console.error('[ADMIN-RECOVERY] Error fetching jobs:', jobsError);
      throw new Error('Failed to fetch jobs');
    }

    // Get all saved designs job_ids
    const { data: savedDesigns, error: savedError } = await supabase
      .from('saved_designs')
      .select('job_id');

    if (savedError) {
      console.error('[ADMIN-RECOVERY] Error fetching saved designs:', savedError);
      throw new Error('Failed to fetch saved designs');
    }

    const savedJobIds = new Set((savedDesigns || []).map(sd => sd.job_id));

    // Filter orphaned jobs
    const orphanedJobs = jobs.filter(job => !savedJobIds.has(job.id));

    // Get user emails
    const userIds = [...new Set(orphanedJobs.map(j => j.user_id).filter(Boolean))];
    let userMap = {};

    if (userIds.length > 0) {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      if (authUsers?.users) {
        authUsers.users.forEach(u => {
          userMap[u.id] = u.email;
        });
      }
    }

    // Calculate age buckets
    const now = Date.now();
    const ageBuckets = {
      '<24h': 0,
      '1-7d': 0,
      '7-30d': 0,
      '>30d': 0
    };

    // Format orphaned jobs
    const formattedJobs = orphanedJobs.map(job => {
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
        ...job,
        user_email: userMap[job.user_id] || 'Unknown',
        age_bucket: ageBucket,
        age_days: Math.floor(ageDays),
        thumbnail_url: job.outputs?.thumbnail_url || null,
        auto_name: job.prompt ? job.prompt.substring(0, 50) + (job.prompt.length > 50 ? '...' : '') : 'Untitled Design'
      };
    });

    // Group by user if requested
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
      total: formattedJobs.length,
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
