// TPV Studio - Create Project (Vercel)
// Creates a new project for organizing designs

import { getAuthenticatedClient } from '../_utils/supabase.js';
import { createLogger } from '../_utils/logger.js';

export default async function handler(req, res) {
  const logger = createLogger(req, { endpoint: '/api/projects/create' });
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated client and user
    const { client, user } = await getAuthenticatedClient(req);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - please sign in' });
    }

    const { name, description, color } = req.body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({
        error: 'Project name is required'
      });
    }

    // Create project
    const { data: project, error } = await client
      .from('projects')
      .insert({
        user_id: user.id,
        name: name.trim(),
        description: description || null,
        color: color || '#1a365d', // Default to TPV brand blue
        design_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`[CREATE-PROJECT] Created project ${project.id} (${project.name}) for user ${user.email}`);

    return res.status(201).json({
      success: true,
      project_id: project.id,
      project,
      message: 'Project created successfully'
    });

  } catch (error) {
    logger.error('Create project failed', { error: error.message, stack: error.stack, code: error.code || '' });
    res.setHeader('X-Correlation-Id', logger.correlationId);
    return res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
}
