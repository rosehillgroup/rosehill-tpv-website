// TPV Studio - Update/Delete Project (Vercel)
// Handles operations on a specific project by ID

import { getAuthenticatedClient } from '../_utils/supabase.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Project ID is required' });
  }

  try {
    // Get authenticated client and user
    const { client, user } = await getAuthenticatedClient(req);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - please sign in' });
    }

    // PUT - Update project
    if (req.method === 'PUT') {
      const { name, description, color } = req.body;

      const updates = {
        updated_at: new Date().toISOString()
      };

      if (name !== undefined) {
        if (name.trim() === '') {
          return res.status(400).json({ error: 'Project name cannot be empty' });
        }
        updates.name = name.trim();
      }
      if (description !== undefined) updates.description = description;
      if (color !== undefined) updates.color = color;

      const { data: project, error } = await client
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Project not found' });
        }
        throw error;
      }

      console.log(`[UPDATE-PROJECT] Updated project ${id} for user ${user.email}`);

      return res.status(200).json({
        success: true,
        project,
        message: 'Project updated successfully'
      });
    }

    // DELETE - Remove project
    if (req.method === 'DELETE') {
      // Check if project has designs
      const { count } = await client
        .from('saved_designs')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', id);

      if (count > 0) {
        return res.status(400).json({
          error: 'Cannot delete project with designs',
          hint: 'Move or delete designs first, or the designs will be unassigned',
          design_count: count
        });
      }

      const { error } = await client
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Project not found' });
        }
        throw error;
      }

      console.log(`[DELETE-PROJECT] Deleted project ${id} for user ${user.email}`);

      return res.status(200).json({
        success: true,
        message: 'Project deleted successfully'
      });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('[PROJECT-BY-ID ERROR]', {
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
