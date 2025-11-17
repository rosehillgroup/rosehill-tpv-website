// TPV Studio - Get/Update/Delete Single Design (Vercel)
// Handles operations on a specific design by ID

import { getAuthenticatedClient } from '../_utils/supabase.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Design ID is required' });
  }

  try {
    // Get authenticated client and user
    const { client, user } = await getAuthenticatedClient(req);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - please sign in' });
    }

    // GET - Load design
    if (req.method === 'GET') {
      const { data: design, error } = await client
        .from('saved_designs')
        .select(`
          *,
          projects:project_id (
            id,
            name,
            color
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Design not found' });
        }
        throw error;
      }

      // Update last_opened_at timestamp
      await client
        .from('saved_designs')
        .update({ last_opened_at: new Date().toISOString() })
        .eq('id', id);

      console.log(`[GET-DESIGN] Loaded design ${id} for user ${user.email}`);

      return res.status(200).json({ design });
    }

    // PUT - Update design metadata (name, description, project, etc.)
    if (req.method === 'PUT') {
      const { name, description, project_id, tags, is_public } = req.body;

      const updates = {
        updated_at: new Date().toISOString()
      };

      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (project_id !== undefined) updates.project_id = project_id;
      if (tags !== undefined) updates.tags = tags;
      if (is_public !== undefined) updates.is_public = is_public;

      const { data: design, error } = await client
        .from('saved_designs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Design not found' });
        }
        throw error;
      }

      console.log(`[UPDATE-DESIGN] Updated design ${id} for user ${user.email}`);

      return res.status(200).json({
        success: true,
        design,
        message: 'Design updated successfully'
      });
    }

    // DELETE - Remove design
    if (req.method === 'DELETE') {
      const { error } = await client
        .from('saved_designs')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Design not found' });
        }
        throw error;
      }

      console.log(`[DELETE-DESIGN] Deleted design ${id} for user ${user.email}`);

      return res.status(200).json({
        success: true,
        message: 'Design deleted successfully'
      });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('[DESIGN-BY-ID ERROR]', {
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
