/**
 * Analytics Language Enhancer for Rosehill TPV
 * 
 * This script safely adds language tracking to Google Analytics
 * without modifying the existing translation system.
 * 
 * SAFETY FEATURES:
 * - Only reads from existing TranslationLoader (never modifies)
 * - Completely independent of translation functionality
 * - Can be removed without affecting translations
 * - No dependencies on translation cache or loading
 */

class AnalyticsLanguageEnhancer {
    constructor() {
        this.currentLanguage = 'en'; // Default fallback
        this.initialized = false;
    }

    /**
     * Safely detect language without touching translation system
     */
    detectLanguage() {
        try {
            // Method 1: Read from existing TranslationLoader if available
            if (window.TranslationLoader && window.translator && window.translator.currentLang) {
                return window.translator.currentLang;
            }
            
            // Method 2: Use same URL parsing as translation system
            const path = window.location.pathname;
            const langMatch = path.match(/^\/(fr|de|es)\//);
            return langMatch ? langMatch[1] : 'en';
        } catch (error) {
            console.warn('Analytics: Could not detect language, using default', error);
            return 'en';
        }
    }

    /**
     * Push language data to dataLayer safely
     */
    pushLanguageData() {
        try {
            // Ensure dataLayer exists (GTM creates this)
            window.dataLayer = window.dataLayer || [];
            
            // Push language context
            window.dataLayer.push({
                'event': 'language_detected',
                'content_language': this.currentLanguage,
                'page_language': this.currentLanguage,
                'multilingual_site': true,
                'language_method': 'url_based'
            });
            
            console.log(`✓ Analytics: Language tracking enabled for ${this.currentLanguage}`);
        } catch (error) {
            console.warn('Analytics: Could not push language data', error);
        }
    }

    /**
     * Track language switching events
     */
    trackLanguageSwitch(newLanguage, oldLanguage) {
        try {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'language_switch',
                'new_language': newLanguage,
                'previous_language': oldLanguage,
                'switch_method': 'navigation'
            });
        } catch (error) {
            console.warn('Analytics: Could not track language switch', error);
        }
    }

    /**
     * Monitor for language changes (for SPA-style navigation)
     */
    monitorLanguageChanges() {
        const initialLanguage = this.currentLanguage;
        
        // Check for language changes periodically (very lightweight)
        setInterval(() => {
            try {
                const newLanguage = this.detectLanguage();
                if (newLanguage !== this.currentLanguage) {
                    this.trackLanguageSwitch(newLanguage, this.currentLanguage);
                    this.currentLanguage = newLanguage;
                }
            } catch (error) {
                // Silent fail - don't log to avoid spam
            }
        }, 5000); // Check every 5 seconds
    }

    /**
     * Initialize analytics enhancement safely
     */
    init() {
        if (this.initialized) return;
        
        try {
            // Detect current language
            this.currentLanguage = this.detectLanguage();
            
            // Push initial language data
            this.pushLanguageData();
            
            // Start monitoring for changes
            this.monitorLanguageChanges();
            
            this.initialized = true;
            console.log('✓ Analytics Language Enhancer: Initialized successfully');
        } catch (error) {
            console.error('Analytics Language Enhancer: Initialization failed', error);
        }
    }
}

// Initialize when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a moment for translation system to initialize first
        setTimeout(() => {
            const enhancer = new AnalyticsLanguageEnhancer();
            enhancer.init();
        }, 1000);
    });
} else {
    // DOM already loaded
    setTimeout(() => {
        const enhancer = new AnalyticsLanguageEnhancer();
        enhancer.init();
    }, 1000);
}

// Export for potential manual use or debugging
window.AnalyticsLanguageEnhancer = AnalyticsLanguageEnhancer;