/**
 * Admin Designs API Endpoint
 * GET /api/admin/designs - List all designs across all users
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
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    // Use service client for admin operations
    const supabase = getSupabaseServiceClient();

    // Build query
    let query = supabase
      .from('saved_designs')
      .select(`
        id,
        user_id,
        name,
        description,
        thumbnail_url,
        original_png_url,
        input_mode,
        prompt,
        dimensions,
        tags,
        is_public,
        preferred_view_mode,
        created_at,
        updated_at,
        last_opened_at,
        project_id
      `, { count: 'exact' });

    // Apply filters
    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,prompt.ilike.%${search}%`);
    }

    // Apply sorting
    const validSortFields = ['created_at', 'updated_at', 'name', 'last_opened_at'];
    const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
    const ascending = sort_order === 'asc';

    query = query
      .order(sortField, { ascending })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: designs, error, count } = await query;

    if (error) {
      console.error('[ADMIN-DESIGNS] Error fetching designs:', error);
      throw new Error('Failed to fetch designs');
    }

    // Get user emails for the designs
    const userIds = [...new Set(designs.map(d => d.user_id).filter(Boolean))];

    let userMap = {};
    if (userIds.length > 0) {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      if (authUsers?.users) {
        authUsers.users.forEach(u => {
          userMap[u.id] = u.email;
        });
      }
    }

    // Get project names
    const projectIds = [...new Set(designs.map(d => d.project_id).filter(Boolean))];

    let projectMap = {};
    if (projectIds.length > 0) {
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, color')
        .in('id', projectIds);

      if (projects) {
        projects.forEach(p => {
          projectMap[p.id] = { name: p.name, color: p.color };
        });
      }
    }

    // Format designs with user and project info
    const formattedDesigns = designs.map(design => ({
      ...design,
      user_email: userMap[design.user_id] || 'Unknown',
      project: design.project_id ? projectMap[design.project_id] : null
    }));

    return res.status(200).json({
      success: true,
      designs: formattedDesigns,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('[ADMIN-DESIGNS] Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch designs',
      message: error.message
    });
  }
}
