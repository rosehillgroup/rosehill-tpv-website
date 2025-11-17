// TPV Studio - Design API Client
// Wrapper functions for design management endpoints

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
 * Save a new design or update existing
 * @param {Object} designData - Design data to save
 * @param {string} designData.name - Design name (required)
 * @param {string} [designData.description] - Design description
 * @param {string} [designData.project_id] - Project ID to assign to
 * @param {string[]} [designData.tags] - Tags for search/filtering
 * @param {Object} designData.design_data - Complete design state
 * @param {boolean} [designData.is_public] - Public sharing flag
 * @param {string} [designData.id] - Design ID (for updates only)
 * @returns {Promise<Object>} Response with design_id and success status
 */
export async function saveDesign(designData) {
  const headers = await getAuthHeaders();

  const response = await fetch('/api/designs/save', {
    method: 'POST',
    headers,
    body: JSON.stringify(designData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save design');
  }

  return response.json();
}

/**
 * List user's saved designs with pagination
 * @param {Object} options - Query options
 * @param {string} [options.project_id] - Filter by project
 * @param {number} [options.limit=50] - Results per page
 * @param {number} [options.offset=0] - Pagination offset
 * @param {string} [options.search] - Search query for name/tags
 * @returns {Promise<Object>} Designs array and pagination info
 */
export async function listDesigns({ project_id, limit = 50, offset = 0, search } = {}) {
  const headers = await getAuthHeaders();

  const params = new URLSearchParams();
  if (project_id) params.append('project_id', project_id);
  params.append('limit', limit);
  params.append('offset', offset);
  if (search) params.append('search', search);

  const response = await fetch(`/api/designs/list?${params}`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to list designs');
  }

  return response.json();
}

/**
 * Load a single design by ID
 * @param {string} designId - Design UUID
 * @returns {Promise<Object>} Full design data
 */
export async function loadDesign(designId) {
  const headers = await getAuthHeaders();

  const response = await fetch(`/api/designs/${designId}`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to load design');
  }

  return response.json();
}

/**
 * Update design metadata (name, description, project, etc.)
 * @param {string} designId - Design UUID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated design data
 */
export async function updateDesign(designId, updates) {
  const headers = await getAuthHeaders();

  const response = await fetch(`/api/designs/${designId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update design');
  }

  return response.json();
}

/**
 * Delete a design
 * @param {string} designId - Design UUID
 * @returns {Promise<Object>} Success response
 */
export async function deleteDesign(designId) {
  const headers = await getAuthHeaders();

  const response = await fetch(`/api/designs/${designId}`, {
    method: 'DELETE',
    headers
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete design');
  }

  return response.json();
}
