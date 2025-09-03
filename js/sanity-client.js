// Sanity client for public pages
// Handles GROQ queries with language-aware field coalescing

class SanityPublicClient {
    constructor() {
        this.projectId = '68ola3dd';
        this.dataset = 'production';
        this.apiVersion = '2023-05-03';
        this.baseUrl = `https://${this.projectId}.api.sanity.io/v${this.apiVersion}/data/query/${this.dataset}`;
        
        // Detect current language from URL
        this.currentLanguage = this.detectLanguage();
    }
    
    /**
     * Detect language from current URL path
     */
    detectLanguage() {
        const path = window.location.pathname;
        const match = path.match(/^\/(de|fr|es)\//);
        return match ? match[1] : 'en';
    }
    
    /**
     * Execute GROQ query with language parameter
     */
    async query(groqQuery, params = {}) {
        try {
            const queryParams = new URLSearchParams({
                query: groqQuery,
                ...Object.entries(params).reduce((acc, [key, value]) => {
                    acc[`$${key}`] = JSON.stringify(value);
                    return acc;
                }, {})
            });
            
            const response = await fetch(`${this.baseUrl}?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`Sanity query failed: ${response.status}`);
            }
            
            const data = await response.json();
            return data.result;
            
        } catch (error) {
            console.error('Sanity query error:', error);
            throw error;
        }
    }
    
    /**
     * Get all installations for current language
     */
    async getAllInstallations() {
        const query = `*[_type=="installation" && $lang in publishedLocales]
        | order(installationDate desc) {
            _id,
            "slug": slug.current,
            installationDate,
            application,
            "title": select(
                $lang=="es" => coalesce(title__es, title),
                $lang=="fr" => coalesce(title__fr, title),
                $lang=="de" => coalesce(title__de, title),
                title
            ),
            "overview": select(
                $lang=="es" => coalesce(overview__es, overview),
                $lang=="fr" => coalesce(overview__fr, overview),
                $lang=="de" => coalesce(overview__de, overview),
                overview
            ),
            location {
                "city": select(
                    $lang=="es" => coalesce(city__es, city),
                    $lang=="fr" => coalesce(city__fr, city),
                    $lang=="de" => coalesce(city__de, city),
                    city
                ),
                "country": select(
                    $lang=="es" => coalesce(country__es, country),
                    $lang=="fr" => coalesce(country__fr, country),
                    $lang=="de" => coalesce(country__de, country),
                    country
                )
            },
            "coverImage": coverImage {
                "url": asset->url,
                "alt": select(
                    $lang=="es" => coalesce(alt__es, alt),
                    $lang=="fr" => coalesce(alt__fr, alt),
                    $lang=="de" => coalesce(alt__de, alt),
                    alt
                )
            }
        }`;
        
        return await this.query(query, { lang: this.currentLanguage });
    }
    
    /**
     * Get single installation by slug for current language
     */
    async getInstallationBySlug(slug) {
        const query = `*[_type=="installation" && slug.current == $slug && $lang in publishedLocales][0] {
            _id,
            "slug": slug.current,
            installationDate,
            application,
            "title": select(
                $lang=="es" => coalesce(title__es, title),
                $lang=="fr" => coalesce(title__fr, title),
                $lang=="de" => coalesce(title__de, title),
                title
            ),
            "overview": select(
                $lang=="es" => coalesce(overview__es, overview),
                $lang=="fr" => coalesce(overview__fr, overview),
                $lang=="de" => coalesce(overview__de, overview),
                overview
            ),
            "thanksTo": select(
                $lang=="es" => coalesce(thanksTo__es, thanksTo),
                $lang=="fr" => coalesce(thanksTo__fr, thanksTo),
                $lang=="de" => coalesce(thanksTo__de, thanksTo),
                thanksTo
            ),
            location {
                "city": select(
                    $lang=="es" => coalesce(city__es, city),
                    $lang=="fr" => coalesce(city__fr, city),
                    $lang=="de" => coalesce(city__de, city),
                    city
                ),
                "country": select(
                    $lang=="es" => coalesce(country__es, country),
                    $lang=="fr" => coalesce(country__fr, country),
                    $lang=="de" => coalesce(country__de, country),
                    country
                )
            },
            "coverImage": coverImage {
                "url": asset->url,
                "alt": select(
                    $lang=="es" => coalesce(alt__es, alt),
                    $lang=="fr" => coalesce(alt__fr, alt),
                    $lang=="de" => coalesce(alt__de, alt),
                    alt
                )
            },
            "gallery": gallery[] {
                "url": asset->url,
                "alt": select(
                    $lang=="es" => coalesce(alt__es, alt),
                    $lang=="fr" => coalesce(alt__fr, alt),
                    $lang=="de" => coalesce(alt__de, alt),
                    alt
                )
            },
            "seo": {
                "title": select(
                    $lang=="es" => coalesce(seo.title__es, seo.title),
                    $lang=="fr" => coalesce(seo.title__fr, seo.title),
                    $lang=="de" => coalesce(seo.title__de, seo.title),
                    seo.title
                ),
                "description": select(
                    $lang=="es" => coalesce(seo.description__es, seo.description),
                    $lang=="fr" => coalesce(seo.description__fr, seo.description),
                    $lang=="de" => coalesce(seo.description__de, seo.description),
                    seo.description
                )
            },
            publishedLocales
        }`;
        
        return await this.query(query, { lang: this.currentLanguage, slug });
    }
    
    /**
     * Convert Portable Text to HTML
     */
    portableTextToHtml(blocks) {
        if (!blocks || !Array.isArray(blocks)) return '';
        
        return blocks.map(block => {
            if (block._type !== 'block' || !block.children) return '';
            
            const text = block.children
                .map(child => child.text || '')
                .join('');
            
            const style = block.style || 'normal';
            
            switch (style) {
                case 'h1': return `<h1>${text}</h1>`;
                case 'h2': return `<h2>${text}</h2>`;
                case 'h3': return `<h3>${text}</h3>`;
                case 'h4': return `<h4>${text}</h4>`;
                default: return `<p>${text}</p>`;
            }
        }).join('');
    }
    
    /**
     * Format date for display
     */
    formatDate(dateString, locale = null) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const lang = locale || this.currentLanguage;
        
        // Language-specific date formatting
        const localeMap = {
            'en': 'en-GB',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'de': 'de-DE'
        };
        
        return date.toLocaleDateString(localeMap[lang] || 'en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
    
    /**
     * Get available languages for language switcher
     */
    getAvailableLanguages() {
        return [
            { code: 'en', name: 'English', path: '/' },
            { code: 'es', name: 'Español', path: '/es/' },
            { code: 'fr', name: 'Français', path: '/fr/' },
            { code: 'de', name: 'Deutsch', path: '/de/' }
        ];
    }
    
    /**
     * Build language-specific URL for an installation
     */
    buildInstallationUrl(slug, lang = null) {
        const language = lang || this.currentLanguage;
        const basePath = language === 'en' ? '' : `/${language}`;
        return `${basePath}/installations/${slug}.html`;
    }
}

// Create global instance
window.sanityClient = new SanityPublicClient();