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

    // Note: Email domain restriction removed - users are manually added to Supabase
    // Access control is managed through user account creation, not email domain

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

  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    // Mark password as set in user metadata
    await supabase.auth.updateUser({
      data: { password_setup_complete: true }
    });

    return data;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

export { supabase };
