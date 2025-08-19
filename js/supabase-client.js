// Supabase Client for Frontend
// This script provides database access for translated content

// Supabase configuration - these should match your actual values
const SUPABASE_URL = 'https://otidaseqlgubqzsqazqt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4';

// Initialize Supabase client
let supabaseClient = null;

/**
 * Initialize Supabase client (lazy loading)
 */
async function initSupabase() {
    if (supabaseClient) return supabaseClient;
    
    try {
        // Import Supabase from CDN
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return supabaseClient;
    } catch (error) {
        console.error('Failed to initialize Supabase client:', error);
        throw error;
    }
}

/**
 * Detect current language from URL
 */
function detectCurrentLanguage() {
    const path = window.location.pathname;
    const langMatch = path.match(/^\/(?:fr|de|es)\//);
    return langMatch ? langMatch[0].slice(1, -1) : 'en';
}

/**
 * Fetch installations with translations for a specific language
 */
async function fetchInstallationsWithTranslations(lang = 'en', limit = null) {
    try {
        const supabase = await initSupabase();
        
        let query;
        if (lang === 'en') {
            // For English, fetch original installations
            query = supabase
                .from('installations')
                .select('*')
                .order('installation_date', { ascending: false });
        } else {
            // For other languages, use the translation view with fallbacks
            query = supabase
                .from('installation_with_translations')
                .select('*')
                .eq('lang', lang)
                .order('installation_date', { ascending: false });
        }
        
        if (limit) {
            query = query.limit(limit);
        }
        
        const { data, error } = await query;
        
        if (error) {
            console.error(`Error fetching installations for ${lang}:`, error);
            // Fallback to English installations
            return await fetchInstallationsWithTranslations('en', limit);
        }
        
        return data || [];
        
    } catch (error) {
        console.error('Failed to fetch installations:', error);
        return [];
    }
}

/**
 * Fetch a single installation with translation
 */
async function fetchInstallationBySlug(slug, lang = 'en') {
    try {
        const supabase = await initSupabase();
        
        if (lang === 'en') {
            // For English, search in main installations table
            const { data, error } = await supabase
                .from('installations')
                .select('*')
                .eq('slug', slug)
                .single();
                
            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error(`Error fetching installation ${slug}:`, error);
                return null;
            }
            
            return data;
        } else {
            // For other languages, first get the translation
            const { data: translation, error: transError } = await supabase
                .from('installation_i18n')
                .select('*')
                .eq('slug', slug)
                .eq('lang', lang)
                .single();
                
            if (translation && !transError) {
                // Now get the original installation data
                const { data: installation, error: installError } = await supabase
                    .from('installations')
                    .select('*')
                    .eq('id', translation.installation_id)
                    .single();
                    
                if (installation && !installError) {
                    // Merge translation with original installation data
                    return {
                        ...installation,
                        // Override with translated fields
                        title: translation.title,
                        description: translation.overview,
                        location: translation.location,
                        slug: translation.slug,
                        lang: translation.lang,
                        translation_source: translation.source
                    };
                }
            }
            
            // Fallback: try to find by English slug and return with warning
            console.warn(`No translation found for slug "${slug}" in ${lang}, falling back to English`);
            return await fetchInstallationBySlug(slug, 'en');
        }
        
    } catch (error) {
        console.error('Failed to fetch installation:', error);
        return null;
    }
}

/**
 * Generate language-specific URL for an installation
 */
function generateInstallationUrl(installation, targetLang = 'en') {
    const baseUrl = window.location.origin;
    
    if (targetLang === 'en') {
        return `${baseUrl}/installations/${installation.slug}.html`;
    } else {
        // Use translated slug if available, otherwise fall back to English slug
        const slug = installation.display_slug || installation.slug;
        return `${baseUrl}/${targetLang}/installations/${slug}.html`;
    }
}

/**
 * Check if an installation has translations available
 */
async function checkTranslationAvailability(installationId) {
    try {
        const supabase = await initSupabase();
        
        const { data, error } = await supabase
            .from('installation_i18n')
            .select('lang')
            .eq('installation_id', installationId);
            
        if (error) {
            console.error('Error checking translations:', error);
            return [];
        }
        
        return data ? data.map(t => t.lang) : [];
        
    } catch (error) {
        console.error('Failed to check translation availability:', error);
        return [];
    }
}

/**
 * Helper function to safely get translated field with fallback
 */
function getTranslatedField(installation, field, fallbackField = null) {
    const translatedField = `display_${field}`;
    
    // If we have a display field (from the translation view), use it
    if (installation[translatedField]) {
        return installation[translatedField];
    }
    
    // Otherwise use the original field
    return installation[fallbackField || field] || '';
}

/**
 * Format installation data for display
 */
function formatInstallationForDisplay(installation) {
    return {
        ...installation,
        // Ensure we have display fields
        displayTitle: getTranslatedField(installation, 'title'),
        displayDescription: getTranslatedField(installation, 'overview', 'description'),
        displayLocation: getTranslatedField(installation, 'location'),
        displaySlug: getTranslatedField(installation, 'slug'),
        
        // Format date consistently
        formattedDate: formatInstallationDate(installation.installation_date),
        
        // Generate URLs for all languages
        urls: {
            en: generateInstallationUrl(installation, 'en'),
            fr: generateInstallationUrl(installation, 'fr'),
            de: generateInstallationUrl(installation, 'de'),
            es: generateInstallationUrl(installation, 'es')
        }
    };
}

/**
 * Format installation date consistently
 */
function formatInstallationDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        const currentLang = detectCurrentLanguage();
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        // Format date according to current language
        const locale = {
            'en': 'en-US',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'es': 'es-ES'
        }[currentLang] || 'en-US';
        
        return date.toLocaleDateString(locale, options);
        
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

// Export functions for use in other scripts
window.SupabaseClient = {
    initSupabase,
    detectCurrentLanguage,
    fetchInstallationsWithTranslations,
    fetchInstallationBySlug,
    generateInstallationUrl,
    checkTranslationAvailability,
    formatInstallationForDisplay,
    formatInstallationDate
};