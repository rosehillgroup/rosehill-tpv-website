// TPV Studio - List User's Projects (Vercel)
// Returns all projects for the authenticated user with design counts

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

    // Get all projects for user, ordered by most recently updated
    const { data: projects, error } = await client
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    console.log(`[LIST-PROJECTS] Returned ${projects.length} projects for user ${user.email}`);

    return res.status(200).json({
      projects
    });

  } catch (error) {
    console.error('[LIST-PROJECTS ERROR]', {
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
