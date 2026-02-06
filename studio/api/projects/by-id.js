// TPV Studio - Update/Delete Project (Vercel)
// Handles operations on a specific project by ID

import { getAuthenticatedClient } from '../_utils/supabase.js';
import { authorizedUpdate, authorizedDelete, ensureOwnership } from '../_utils/authorization.js';
import { createLogger } from '../_utils/logger.js';

export default async function handler(req, res) {
  const logger = createLogger(req, { endpoint: '/api/projects/by-id' });
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

      // Use authorized update (CRITICAL: IDOR protection)
      const result = await authorizedUpdate(client, 'projects', id, user.id, updates);

      if (!result.success) {
        if (result.error.includes('Unauthorized')) {
          return res.status(403).json({ error: result.error });
        }
        return res.status(404).json({ error: 'Project not found' });
      }

      console.log(`[UPDATE-PROJECT] Updated project ${id} for user ${user.email}`);

      return res.status(200).json({
        success: true,
        project: result.data,
        message: 'Project updated successfully'
      });
    }

    // DELETE - Remove project
    if (req.method === 'DELETE') {
      // First verify ownership (CRITICAL: IDOR protection)
      const ownedProject = await ensureOwnership(client, 'projects', id, user.id);

      if (!ownedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Check if project has designs (only user's designs)
      const { count } = await client
        .from('saved_designs')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', id)
        .eq('user_id', user.id); // CRITICAL: Only count user's designs

      if (count > 0) {
        return res.status(400).json({
          error: 'Cannot delete project with designs',
          hint: 'Move or delete designs first, or the designs will be unassigned',
          design_count: count
        });
      }

      // Use authorized delete (CRITICAL: IDOR protection)
      const result = await authorizedDelete(client, 'projects', id, user.id);

      if (!result.success) {
        if (result.error.includes('Unauthorized')) {
          return res.status(403).json({ error: result.error });
        }
        return res.status(404).json({ error: 'Project not found' });
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
    logger.error('Project operation failed', { error: error.message, stack: error.stack, code: error.code || '' });
    res.setHeader('X-Correlation-Id', logger.correlationId);
    return res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
}
