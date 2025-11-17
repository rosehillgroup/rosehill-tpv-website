// TPV Studio - Projects API Client
// Wrapper functions for project management endpoints

import { supabase } from './auth.js';

/**
 * Get auth headers with JWT token
 */
async function getAuthHeaders() {
  const session = await supabase.auth.getSession();
  const token = session?.data?.session?.access_token;

  if (!token) {
    throw new Error('Not authenticated');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @param {string} projectData.name - Project name (required)
 * @param {string} [projectData.description] - Project description
 * @param {string} [projectData.color] - Hex color for project badge
 * @returns {Promise<Object>} Response with project_id and project data
 */
export async function createProject(projectData) {
  const headers = await getAuthHeaders();

  const response = await fetch('/api/projects/create', {
    method: 'POST',
    headers,
    body: JSON.stringify(projectData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create project');
  }

  return response.json();
}

/**
 * List all projects for the current user
 * @returns {Promise<Object>} Projects array
 */
export async function listProjects() {
  const headers = await getAuthHeaders();

  const response = await fetch('/api/projects/list', {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to list projects');
  }

  return response.json();
}

/**
 * Update project metadata
 * @param {string} projectId - Project UUID
 * @param {Object} updates - Fields to update (name, description, color)
 * @returns {Promise<Object>} Updated project data
 */
export async function updateProject(projectId, updates) {
  const headers = await getAuthHeaders();

  const response = await fetch(`/api/projects/by-id?id=${projectId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update project');
  }

  return response.json();
}

/**
 * Delete a project
 * @param {string} projectId - Project UUID
 * @returns {Promise<Object>} Success response
 */
export async function deleteProject(projectId) {
  const headers = await getAuthHeaders();

  const response = await fetch(`/api/projects/by-id?id=${projectId}`, {
    method: 'DELETE',
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete project');
  }

  return response.json();
}
