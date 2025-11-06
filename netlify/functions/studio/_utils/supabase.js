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
