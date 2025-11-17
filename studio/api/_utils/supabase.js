// Supabase client utility for TPV Studio
// Provides both anon and service role clients

import { createClient } from '@supabase/supabase-js';

/**
 * Get Supabase client with service role (admin) access
 * Use for backend operations that bypass RLS
 */
export function getSupabaseServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Get Supabase client with anon key
 * Use for operations that respect RLS policies
 */
export function getSupabaseAnonClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Get authenticated Supabase client from request headers
 * Extracts JWT token from Authorization header and creates user-scoped client
 * Use for operations that should respect RLS based on authenticated user
 *
 * @param {Request} req - Express/Vercel request object
 * @returns {Object} - { client: SupabaseClient, user: User | null }
 */
export async function getAuthenticatedClient(req) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  // Extract JWT token from Authorization header
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token, return client without auth
    const client = createClient(supabaseUrl, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    return { client, user: null };
  }

  const token = authHeader.replace('Bearer ', '');

  // Create client with JWT token in global headers
  // This ensures the token is sent with all requests for RLS
  const client = createClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  // Get user info from token
  const { data: { user }, error } = await client.auth.getUser(token);

  if (error || !user) {
    return { client, user: null };
  }

  return { client, user };
}
