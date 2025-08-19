// Installation Page Loader
// This script loads translated content for individual installation pages

/**
 * Load installation content based on current page URL and language
 */
async function loadInstallationContent() {
    try {
        // Get current language and extract slug from URL
        const currentLang = window.SupabaseClient.detectCurrentLanguage();
        const slug = extractSlugFromUrl();
        
        if (!slug) {
            console.error('Could not extract slug from URL');
            return;
        }
        
        console.log(`Loading installation content for slug: ${slug}, language: ${currentLang}`);
        
        // Fetch installation data
        const installation = await window.SupabaseClient.fetchInstallationBySlug(slug, currentLang);
        
        if (!installation) {
            console.error(`Installation not found for slug: ${slug}`);
            return;
        }
        
        console.log('Loaded installation:', installation);
        
        // Update page content with translated data
        updatePageContent(installation);
        
        // Update meta tags for SEO
        updateMetaTags(installation);
        
        // Generate hreflang tags
        await generateHreflangTags(installation);
        
        // Dispatch event to signal content is loaded
        window.dispatchEvent(new Event('installationLoaded'));
        
    } catch (error) {
        console.error('Error loading installation content:', error);
    }
}

/**
 * Extract slug from current URL
 */
function extractSlugFromUrl() {
    const path = window.location.pathname;
    
    // Match patterns like:
    // /installations/slug.html
    // /fr/installations/slug.html
    // /de/installations/slug.html
    const match = path.match(/\/installations\/([^\/]+)\.html$/);
    
    if (match) {
        return match[1];
    }
    
    return null;
}

/**
 * Update page content with installation data
 */
function updatePageContent(installation) {
    // Update title
    const titleElement = document.querySelector('h1, .installation-title, .article-title');
    if (titleElement && installation.title) {
        titleElement.textContent = installation.title;
    }
    
    // Update location
    const locationElements = document.querySelectorAll('.meta-value, .installation-location');
    locationElements.forEach(element => {
        if (element.textContent && installation.location) {
            // Check if this is likely the location element
            const parent = element.parentElement;
            if (parent && (parent.textContent.includes('Location') || parent.querySelector('.meta-icon'))) {
                element.textContent = installation.location;
            }
        }
    });
    
    // Update project overview/description
    const overviewSection = document.querySelector('.installation-content, .content-section');
    if (overviewSection && installation.description) {
        const overviewParagraphs = overviewSection.querySelectorAll('p');
        
        // Split description into paragraphs if it's a single string
        let descriptions = [];
        if (typeof installation.description === 'string') {
            // Split on double newlines or periods followed by space and capital letter
            descriptions = installation.description
                .split(/\n\n|\. (?=[A-Z])/)
                .map(p => p.trim())
                .filter(p => p.length > 0);
        } else if (Array.isArray(installation.description)) {
            descriptions = installation.description;
        }
        
        // Update existing paragraphs or create new ones
        if (descriptions.length > 0) {
            // Clear existing content except the heading
            const heading = overviewSection.querySelector('h2, h3');
            overviewSection.innerHTML = '';
            
            if (heading) {
                overviewSection.appendChild(heading);
            } else {
                // Add a default heading if none exists
                const newHeading = document.createElement('h2');
                newHeading.textContent = getLocalizedText('project_overview');
                overviewSection.appendChild(newHeading);
            }
            
            // Add description paragraphs
            descriptions.forEach(desc => {
                if (desc.trim()) {
                    const p = document.createElement('p');
                    // Strip any HTML tags from the description for security
                    const cleanDesc = desc.trim().replace(/<[^>]*>/g, '');
                    p.textContent = cleanDesc;
                    overviewSection.appendChild(p);
                }
            });
            
            // Add "thanks to" attribution if available
            if (installation.thanks_to_name) {
                const thanksP = document.createElement('p');
                thanksP.style.marginTop = '20px';
                thanksP.style.fontStyle = 'italic';
                
                if (installation.thanks_to_url) {
                    // Create a link if URL is provided
                    thanksP.innerHTML = `Special thanks to <a href="${installation.thanks_to_url}" target="_blank" rel="noopener noreferrer" style="color: #ff6b35; text-decoration: underline;">${installation.thanks_to_name}</a> for this installation.`;
                } else {
                    // Just display as text if no URL
                    thanksP.textContent = `Special thanks to ${installation.thanks_to_name} for this installation.`;
                }
                
                overviewSection.appendChild(thanksP);
            }
        }
    }
    
    // Update breadcrumb if present
    const breadcrumbSpan = document.querySelector('.breadcrumb span:last-child, .breadcrumb-nav span:last-child');
    if (breadcrumbSpan && installation.title) {
        breadcrumbSpan.textContent = installation.title;
    }
    
    // Add translation indicator for non-English content
    if (installation.lang && installation.lang !== 'en') {
        addTranslationIndicator(installation);
    }
}

/**
 * Update meta tags for SEO
 */
function updateMetaTags(installation) {
    if (!installation.title) return;
    
    const currentLang = window.SupabaseClient.detectCurrentLanguage();
    
    // Update page title with language-specific format
    const titleSuffix = getLocalizedText('title_suffix');
    document.title = `${installation.title} - ${titleSuffix}`;
    
    // Update meta description
    let description = '';
    if (installation.description) {
        if (typeof installation.description === 'string') {
            description = installation.description.substring(0, 160);
        } else if (Array.isArray(installation.description)) {
            description = installation.description.join(' ').substring(0, 160);
        }
    }
    
    if (description) {
        updateOrCreateMetaTag('name', 'description', description);
    }
    
    // Update language meta tag
    updateOrCreateMetaTag('name', 'language', currentLang);
    
    // Update robots meta tag
    updateOrCreateMetaTag('name', 'robots', 'index, follow');
    
    // Update keywords (dynamic based on content)
    const keywords = generateKeywords(installation);
    if (keywords) {
        updateOrCreateMetaTag('name', 'keywords', keywords);
    }
    
    // Update canonical URL
    updateCanonicalUrl(installation);
    
    // Update Open Graph tags
    updateOpenGraphTags(installation);
    
    // Update Twitter Card tags
    updateTwitterCardTags(installation);
    
    // Update JSON-LD structured data
    updateStructuredData(installation);
}

/**
 * Helper function to update or create meta tags
 */
function updateOrCreateMetaTag(attribute, name, content) {
    let tag = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
    }
    tag.content = content;
}

/**
 * Generate SEO keywords based on installation content
 */
function generateKeywords(installation) {
    const keywords = [];
    
    // Add base keywords
    keywords.push('Rosehill TPV', 'rubber surfacing', 'playground surfacing', 'sports surfacing', 'safety surfacing');
    
    // Add location-based keywords
    if (installation.location) {
        keywords.push(installation.location);
        // Extract country/city for additional keywords
        const locationParts = installation.location.split(',').map(part => part.trim());
        keywords.push(...locationParts);
    }
    
    // Add category-based keywords
    if (installation.category) {
        keywords.push(installation.category.toLowerCase());
        
        // Add related keywords based on category
        const categoryKeywords = {
            'playground': ['children playground', 'playground equipment', 'safe playground'],
            'sports court': ['basketball court', 'tennis court', 'sports facility'],
            'fitness area': ['outdoor gym', 'fitness equipment', 'exercise area'],
            'water park': ['splash pad', 'water play', 'aquatic playground'],
            'school': ['school playground', 'educational facility', 'children safety']
        };
        
        const relatedKeywords = categoryKeywords[installation.category.toLowerCase()];
        if (relatedKeywords) {
            keywords.push(...relatedKeywords);
        }
    }
    
    // Add content-based keywords from description
    if (installation.description) {
        const description = typeof installation.description === 'string' ? 
            installation.description : installation.description.join(' ');
        
        // Extract relevant terms (simple keyword extraction)
        const contentKeywords = description.toLowerCase()
            .match(/\b(?:tpv|rubber|surface|playground|safety|installation|project|school|community|children|outdoor|fitness|sport|court|area|facility)\b/g);
        
        if (contentKeywords) {
            keywords.push(...[...new Set(contentKeywords)]);
        }
    }
    
    // Remove duplicates and limit to 20 keywords
    return [...new Set(keywords)].slice(0, 20).join(', ');
}

/**
 * Update canonical URL
 */
function updateCanonicalUrl(installation) {
    const currentLang = window.SupabaseClient.detectCurrentLanguage();
    
    // Remove existing canonical tag
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
        existingCanonical.remove();
    }
    
    // Create new canonical URL
    const baseUrl = window.location.origin;
    const slug = installation.slug;
    
    let canonicalUrl;
    if (currentLang === 'en') {
        canonicalUrl = `${baseUrl}/installations/${slug}.html`;
    } else {
        canonicalUrl = `${baseUrl}/${currentLang}/installations/${slug}.html`;
    }
    
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    document.head.appendChild(canonical);
}

/**
 * Update Open Graph meta tags
 */
function updateOpenGraphTags(installation) {
    const currentLang = window.SupabaseClient.detectCurrentLanguage();
    const description = typeof installation.description === 'string' ? 
        installation.description.substring(0, 160) : '';
    
    // Get first image if available
    let imageUrl = '';
    if (installation.images && installation.images.length > 0) {
        let firstImage = installation.images[0];
        
        // Handle different image formats (string or object)
        if (typeof firstImage === 'object' && firstImage !== null) {
            firstImage = firstImage.url || firstImage.filename || '';
        }
        
        // Convert to string and check if it's a valid image path
        firstImage = String(firstImage);
        if (firstImage) {
            if (firstImage.includes('http')) {
                imageUrl = firstImage;
            } else {
                imageUrl = `${window.location.origin}/${firstImage}`;
            }
        }
    }
    
    const ogTags = {
        'og:type': 'article',
        'og:title': installation.title,
        'og:description': description,
        'og:url': window.location.href,
        'og:site_name': 'Rosehill TPV',
        'og:locale': getOGLocale(currentLang)
    };
    
    if (imageUrl) {
        ogTags['og:image'] = imageUrl;
        ogTags['og:image:alt'] = `${installation.title} - Rosehill TPV Installation`;
    }
    
    Object.entries(ogTags).forEach(([property, content]) => {
        if (!content) return;
        updateOrCreateMetaTag('property', property, content);
    });
}

/**
 * Update Twitter Card meta tags
 */
function updateTwitterCardTags(installation) {
    const description = typeof installation.description === 'string' ? 
        installation.description.substring(0, 160) : '';
    
    let imageUrl = '';
    if (installation.images && installation.images.length > 0) {
        let firstImage = installation.images[0];
        
        // Handle different image formats (string or object)
        if (typeof firstImage === 'object' && firstImage !== null) {
            firstImage = firstImage.url || firstImage.filename || '';
        }
        
        // Convert to string and check if it's a valid image path
        firstImage = String(firstImage);
        if (firstImage) {
            if (firstImage.includes('http')) {
                imageUrl = firstImage;
            } else {
                imageUrl = `${window.location.origin}/${firstImage}`;
            }
        }
    }
    
    const twitterTags = {
        'twitter:card': imageUrl ? 'summary_large_image' : 'summary',
        'twitter:title': installation.title,
        'twitter:description': description,
        'twitter:site': '@RosehillTPV'
    };
    
    if (imageUrl) {
        twitterTags['twitter:image'] = imageUrl;
    }
    
    Object.entries(twitterTags).forEach(([name, content]) => {
        if (!content) return;
        updateOrCreateMetaTag('name', name, content);
    });
}

/**
 * Update JSON-LD structured data
 */
function updateStructuredData(installation) {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
        existingScript.remove();
    }
    
    const currentLang = window.SupabaseClient.detectCurrentLanguage();
    const description = typeof installation.description === 'string' ? 
        installation.description : installation.description.join(' ');
    
    let imageUrl = '';
    if (installation.images && installation.images.length > 0) {
        const firstImage = installation.images[0];
        if (firstImage.includes('http')) {
            imageUrl = firstImage;
        } else {
            imageUrl = `${window.location.origin}/${firstImage}`;
        }
    }
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": installation.title,
        "description": description.substring(0, 160),
        "url": window.location.href,
        "datePublished": installation.installation_date,
        "dateModified": installation.updated_at || installation.installation_date,
        "inLanguage": currentLang,
        "about": {
            "@type": "Product",
            "name": "Rosehill TPV Rubber Surfacing",
            "description": "Premium coloured rubber granules for sports and playground surfaces",
            "brand": {
                "@type": "Brand",
                "name": "Rosehill TPV"
            }
        },
        "publisher": {
            "@type": "Organization",
            "name": "Rosehill TPV",
            "url": "https://tpv.rosehill.group",
            "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/rosehill_tpv_logo.png`
            }
        },
        "author": {
            "@type": "Organization",
            "name": "Rosehill TPV"
        }
    };
    
    if (imageUrl) {
        structuredData.image = {
            "@type": "ImageObject",
            "url": imageUrl,
            "caption": `${installation.title} - Rosehill TPV Installation`
        };
    }
    
    if (installation.location) {
        structuredData.contentLocation = {
            "@type": "Place",
            "name": installation.location
        };
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
}

/**
 * Get Open Graph locale code
 */
function getOGLocale(langCode) {
    const locales = {
        'en': 'en_US',
        'fr': 'fr_FR',
        'de': 'de_DE',
        'es': 'es_ES'
    };
    return locales[langCode] || 'en_US';
}

/**
 * Generate hreflang tags for SEO
 */
async function generateHreflangTags(installation) {
    try {
        // Check what translations are available
        const availableLanguages = await window.SupabaseClient.checkTranslationAvailability(installation.id);
        
        // Remove existing hreflang tags
        document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(tag => tag.remove());
        
        const baseSlug = installation.slug;
        const baseUrl = window.location.origin;
        
        // Always add English
        const enLink = document.createElement('link');
        enLink.rel = 'alternate';
        enLink.hreflang = 'en';
        enLink.href = `${baseUrl}/installations/${baseSlug}.html`;
        document.head.appendChild(enLink);
        
        // Add x-default for English (fallback)
        const defaultLink = document.createElement('link');
        defaultLink.rel = 'alternate';
        defaultLink.hreflang = 'x-default';
        defaultLink.href = `${baseUrl}/installations/${baseSlug}.html`;
        document.head.appendChild(defaultLink);
        
        // Add translated versions
        for (const lang of availableLanguages) {
            try {
                // Fetch translated slug from database
                const translatedSlug = await getTranslatedSlug(installation.id, lang) || baseSlug;
                
                const link = document.createElement('link');
                link.rel = 'alternate';
                link.hreflang = lang;
                link.href = `${baseUrl}/${lang}/installations/${translatedSlug}.html`;
                document.head.appendChild(link);
                
            } catch (error) {
                console.warn(`Error getting translated slug for ${lang}:`, error);
                // Fallback to base slug
                const link = document.createElement('link');
                link.rel = 'alternate';
                link.hreflang = lang;
                link.href = `${baseUrl}/${lang}/installations/${baseSlug}.html`;
                document.head.appendChild(link);
            }
        }
        
        const allLanguages = ['en', ...availableLanguages];
        console.log(`Generated hreflang tags for languages: ${allLanguages.join(', ')}`);
        
    } catch (error) {
        console.error('Error generating hreflang tags:', error);
    }
}

/**
 * Get translated slug for a specific language
 */
async function getTranslatedSlug(installationId, lang) {
    try {
        const supabase = await window.SupabaseClient.initSupabase();
        
        const { data, error } = await supabase
            .from('installation_i18n')
            .select('slug')
            .eq('installation_id', installationId)
            .eq('lang', lang)
            .single();
        
        if (error || !data) {
            return null;
        }
        
        return data.slug;
        
    } catch (error) {
        console.error(`Error fetching translated slug for ${lang}:`, error);
        return null;
    }
}

/**
 * Add translation indicator for non-English content
 */
function addTranslationIndicator(installation) {
    if (installation.translation_source === 'mt') {
        // Add a subtle indicator that this is machine translated
        const indicator = document.createElement('div');
        indicator.className = 'translation-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(255, 107, 53, 0.1);
            color: #ff6b35;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            z-index: 9998;
            border: 1px solid rgba(255, 107, 53, 0.2);
        `;
        indicator.textContent = '🤖 ' + getLocalizedText('machine_translated');
        
        document.body.appendChild(indicator);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 5000);
    }
}

/**
 * Get localized text based on current language
 */
function getLocalizedText(key) {
    const currentLang = window.SupabaseClient.detectCurrentLanguage();
    
    const translations = {
        'project_overview': {
            'en': 'Project Overview',
            'fr': 'Aperçu du Projet',
            'de': 'Projektübersicht',
            'es': 'Resumen del Proyecto'
        },
        'machine_translated': {
            'en': 'Machine Translated',
            'fr': 'Traduit Automatiquement',
            'de': 'Maschinell Übersetzt',
            'es': 'Traducido Automáticamente'
        },
        'title_suffix': {
            'en': 'Rosehill TPV® Installation',
            'fr': 'Installation Rosehill TPV®',
            'de': 'Rosehill TPV® Installation',
            'es': 'Instalación Rosehill TPV®'
        }
    };
    
    return translations[key]?.[currentLang] || translations[key]?.['en'] || key;
}

/**
 * Initialize installation page loading
 */
function initInstallationPageLoader() {
    // Only run on installation pages
    if (window.location.pathname.includes('/installations/') && window.location.pathname.endsWith('.html')) {
        // Wait for Supabase client to be available
        if (window.SupabaseClient) {
            loadInstallationContent();
        } else {
            // Wait a bit for the client to load
            setTimeout(() => {
                if (window.SupabaseClient) {
                    loadInstallationContent();
                } else {
                    console.warn('Supabase client not available, using static content');
                }
            }, 1000);
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstallationPageLoader);
} else {
    initInstallationPageLoader();
}

// Export for manual usage
window.InstallationPageLoader = {
    loadInstallationContent,
    extractSlugFromUrl,
    updatePageContent,
    updateMetaTags,
    generateHreflangTags
};