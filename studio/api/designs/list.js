// TPV Studio - List User's Designs (Vercel)
// Returns paginated list of user's saved designs with optional project filter

import { getAuthenticatedClient } from '../_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated client and user
    const { client, user } = await getAuthenticatedClient(req);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - please sign in' });
    }

    // Parse query params
    const project_id = req.query.project_id;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || ''; // For name/tag search

    // Build query
    let query = client
      .from('saved_designs')
      .select(`
        id,
        name,
        description,
        project_id,
        tags,
        input_mode,
        thumbnail_url,
        original_png_url,
        preferred_view_mode,
        created_at,
        updated_at,
        last_opened_at,
        projects:project_id (
          id,
          name,
          color
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply project filter if provided
    if (project_id) {
      query = query.eq('project_id', project_id);
    }

    // Apply search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: designs, error, count } = await query;

    if (error) throw error;

    // Get total count for pagination
    let totalQuery = client
      .from('saved_designs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (project_id) {
      totalQuery = totalQuery.eq('project_id', project_id);
    }

    if (search) {
      totalQuery = totalQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { count: total_count } = await totalQuery;

    console.log(`[LIST-DESIGNS] Returned ${designs.length} designs for user ${user.email}`);

    return res.status(200).json({
      designs,
      pagination: {
        limit,
        offset,
        total_count,
        has_more: offset + limit < total_count
      }
    });

  } catch (error) {
    console.error('[LIST-DESIGNS ERROR]', {
      message: error.message,
      details: error.stack,
      hint: error.hint || '',
      code: error.code || ''
    });

    return res.status(500).json({
      error: error.message,
      hint: 'Check Vercel function logs for details'
    });
  }
}
