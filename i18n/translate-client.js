/**
 * Translation system temporarily disabled for emergency fix
 * The site will work in English-only mode until we debug the redirect issue
 */

console.log('🚨 Translation system disabled - emergency mode');
console.log('Site running in English-only mode');

// Empty implementation to prevent errors
window.TranslationLoader = class {
  constructor() {
    console.log('Translation system in emergency mode');
  }
  
  async init() {
    console.log('Skipping translation initialization');
    return;
  }
};