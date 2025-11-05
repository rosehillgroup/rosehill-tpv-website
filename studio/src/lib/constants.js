// TPV Studio - Constants
// All paths use BASE_URL for deployment at /studio

export const BASE_URL = '/studio';

export const API_ENDPOINTS = {
  // Legacy endpoints (deprecated)
  DESIGN_PLAN: '/.netlify/functions/studio-design-plan',
  DESIGN_GENERATE: '/.netlify/functions/studio-design-generate',

  // TPV Studio 2.0 - AI-first workflow
  INSPIRE: '/.netlify/functions/studio-inspire',
  DRAFTIFY: '/.netlify/functions/studio-draftify'
};

export const SUPABASE_CONFIG = {
  URL: import.meta.env.VITE_SUPABASE_URL || 'https://okakomwfikxmwllvliva.supabase.co',
  ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
};

export const BRAND_COLORS = {
  PRIMARY: '#1a365d',
  ACCENT: '#ff6b35',
  TEXT_DARK: '#2d3748',
  TEXT_LIGHT: '#718096',
  BG_LIGHT: '#f7fafc',
  BG_WHITE: '#ffffff',
  BORDER: '#e2e8f0'
};

export const COMPLEXITY_LEVELS = {
  LOW: { value: 'low', label: 'Simple', description: 'Clean, minimal patterns' },
  MEDIUM: { value: 'medium', label: 'Moderate', description: 'Balanced detail' },
  HIGH: { value: 'high', label: 'Complex', description: 'Rich, intricate designs' }
};

export const DEFAULT_SURFACE = {
  width_m: 5,
  height_m: 5,
  border_mm: 100
};

export const STORAGE_KEYS = {
  AUTH_SESSION: 'studio_auth_session',
  RECENT_PROJECTS: 'studio_recent_projects'
};
