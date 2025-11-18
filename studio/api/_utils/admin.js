/**
 * Admin utilities for TPV Studio
 * Role checking and admin-specific helpers
 */

import { getSupabaseServiceClient } from './supabase.js';

/**
 * Check if a user has admin privileges
 * @param {string} userId - The user ID to check
 * @returns {Promise<boolean>} True if user is admin or superadmin
 */
export async function isAdmin(userId) {
  if (!userId) return false;

  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.role === 'admin' || data.role === 'superadmin';
}

/**
 * Check if a user is a superadmin
 * @param {string} userId - The user ID to check
 * @returns {Promise<boolean>} True if user is superadmin
 */
export async function isSuperAdmin(userId) {
  if (!userId) return false;

  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.role === 'superadmin';
}

/**
 * Get user's role
 * @param {string} userId - The user ID
 * @returns {Promise<string>} User role ('user', 'admin', or 'superadmin')
 */
export async function getUserRole(userId) {
  if (!userId) return 'user';

  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return 'user';
  }

  return data.role;
}

/**
 * Middleware-style function to verify admin access
 * Returns error response if not admin
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Object} user - Authenticated user object
 * @returns {Promise<boolean>} True if admin, false if responded with error
 */
export async function requireAdmin(req, res, user) {
  if (!user) {
    res.status(401).json({ error: 'Authentication required' });
    return false;
  }

  const adminCheck = await isAdmin(user.id);
  if (!adminCheck) {
    res.status(403).json({ error: 'Admin access required' });
    return false;
  }

  return true;
}

/**
 * Format user data for admin display
 * Removes sensitive fields and adds computed properties
 * @param {Object} user - User object from Supabase
 * @param {Object} stats - User statistics
 * @returns {Object} Formatted user object
 */
export function formatUserForAdmin(user, stats = {}) {
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at,
    email_confirmed_at: user.email_confirmed_at,
    role: stats.role || 'user',
    design_count: stats.design_count || 0,
    project_count: stats.project_count || 0,
    job_count: stats.job_count || 0,
    last_design_at: stats.last_design_at || null,
  };
}
