/**
 * Admin Users API Endpoint
 * GET /api/admin/users - List all users with stats
 */

import { getAuthenticatedClient, getSupabaseServiceClient } from '../_utils/supabase.js';
import { requireAdmin, formatUserForAdmin } from '../_utils/admin.js';

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

    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('[ADMIN-USERS] Error fetching users:', authError);
      throw new Error('Failed to fetch users');
    }

    const users = authUsers.users || [];

    // Get user roles
    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role');

    const roleMap = {};
    (roles || []).forEach(r => {
      roleMap[r.user_id] = r.role;
    });

    // Get design counts per user
    const { data: designCounts } = await supabase
      .from('saved_designs')
      .select('user_id')
      .not('user_id', 'is', null);

    const designCountMap = {};
    (designCounts || []).forEach(d => {
      designCountMap[d.user_id] = (designCountMap[d.user_id] || 0) + 1;
    });

    // Get project counts per user
    const { data: projectCounts } = await supabase
      .from('projects')
      .select('user_id')
      .not('user_id', 'is', null);

    const projectCountMap = {};
    (projectCounts || []).forEach(p => {
      projectCountMap[p.user_id] = (projectCountMap[p.user_id] || 0) + 1;
    });

    // Get job counts per user
    const { data: jobCounts } = await supabase
      .from('studio_jobs')
      .select('user_id')
      .not('user_id', 'is', null);

    const jobCountMap = {};
    (jobCounts || []).forEach(j => {
      jobCountMap[j.user_id] = (jobCountMap[j.user_id] || 0) + 1;
    });

    // Get last design date per user
    const { data: lastDesigns } = await supabase
      .from('saved_designs')
      .select('user_id, created_at')
      .order('created_at', { ascending: false });

    const lastDesignMap = {};
    (lastDesigns || []).forEach(d => {
      if (!lastDesignMap[d.user_id]) {
        lastDesignMap[d.user_id] = d.created_at;
      }
    });

    // Format users with stats
    const formattedUsers = users.map(user => formatUserForAdmin(user, {
      role: roleMap[user.id] || 'user',
      design_count: designCountMap[user.id] || 0,
      project_count: projectCountMap[user.id] || 0,
      job_count: jobCountMap[user.id] || 0,
      last_design_at: lastDesignMap[user.id] || null,
    }));

    // Sort by design count (most active first)
    formattedUsers.sort((a, b) => b.design_count - a.design_count);

    return res.status(200).json({
      success: true,
      users: formattedUsers,
      total: formattedUsers.length
    });

  } catch (error) {
    console.error('[ADMIN-USERS] Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message
    });
  }
}
