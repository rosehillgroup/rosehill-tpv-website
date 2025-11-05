// TPV Studio - Supabase Auth
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG, STORAGE_KEYS } from '../constants.js';

const supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);

export const auth = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Check if email ends with @rosehill.group
    if (!email.endsWith('@rosehill.group')) {
      await supabase.auth.signOut();
      throw new Error('Access restricted to @rosehill.group emails');
    }

    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(data.session));
    return data;
  },

  async signOut() {
    await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

export { supabase };
