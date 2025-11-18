/**
 * Admin Analytics Overview Endpoint
 * GET /api/admin/analytics/overview - Dashboard stats
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

    // Use service client for admin operations
    const supabase = getSupabaseServiceClient();

    // Get total users
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const totalUsers = authUsers?.users?.length || 0;

    // Get total designs
    const { count: totalDesigns } = await supabase
      .from('saved_designs')
      .select('*', { count: 'exact', head: true });

    // Get total projects
    const { count: totalProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    // Get total jobs
    const { count: totalJobs } = await supabase
      .from('studio_jobs')
      .select('*', { count: 'exact', head: true });

    // Get successful jobs
    const { count: successfulJobs } = await supabase
      .from('studio_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Get designs created in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentDesigns } = await supabase
      .from('saved_designs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    // Get designs created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: monthlyDesigns } = await supabase
      .from('saved_designs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Get active users (created design in last 30 days)
    const { data: activeUserIds } = await supabase
      .from('saved_designs')
      .select('user_id')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const activeUsers = new Set(activeUserIds?.map(d => d.user_id) || []).size;

    // Get designs by day for last 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const { data: recentDesignDates } = await supabase
      .from('saved_designs')
      .select('created_at')
      .gte('created_at', fourteenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // Group by day
    const designsByDay = {};
    (recentDesignDates || []).forEach(d => {
      const day = d.created_at.split('T')[0];
      designsByDay[day] = (designsByDay[day] || 0) + 1;
    });

    // Fill in missing days
    const activityTimeline = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      activityTimeline.push({
        date: dayStr,
        count: designsByDay[dayStr] || 0
      });
    }

    // Get input mode breakdown
    const { data: inputModes } = await supabase
      .from('saved_designs')
      .select('input_mode');

    const modeBreakdown = { prompt: 0, image: 0, svg: 0 };
    (inputModes || []).forEach(d => {
      const mode = d.input_mode || 'prompt';
      modeBreakdown[mode] = (modeBreakdown[mode] || 0) + 1;
    });

    // Get view mode preference
    const { data: viewModes } = await supabase
      .from('saved_designs')
      .select('preferred_view_mode');

    const viewModeBreakdown = { solid: 0, blend: 0 };
    (viewModes || []).forEach(d => {
      const mode = d.preferred_view_mode || 'blend';
      viewModeBreakdown[mode] = (viewModeBreakdown[mode] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      stats: {
        totals: {
          users: totalUsers,
          designs: totalDesigns || 0,
          projects: totalProjects || 0,
          jobs: totalJobs || 0
        },
        activity: {
          active_users_30d: activeUsers,
          designs_7d: recentDesigns || 0,
          designs_30d: monthlyDesigns || 0,
          job_success_rate: totalJobs ? ((successfulJobs || 0) / totalJobs * 100).toFixed(1) : 0
        },
        timeline: activityTimeline,
        breakdowns: {
          input_mode: modeBreakdown,
          view_mode: viewModeBreakdown
        }
      }
    });

  } catch (error) {
    console.error('[ADMIN-ANALYTICS] Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
}
