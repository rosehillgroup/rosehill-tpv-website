// Enhanced Language Switcher with Slug Mapping Support
(function() {
    let slugMapping = null;
    
    // Load slug mapping asynchronously
    async function loadSlugMapping() {
        try {
            const response = await fetch('/js/installation-slug-mapping.json');
            if (response.ok) {
                slugMapping = await response.json();
                console.log('✅ Loaded slug mapping for installations');
            }
        } catch (error) {
            console.warn('Could not load slug mapping:', error);
        }
    }
    
    // Get the correct slug for a language
    function getTranslatedSlug(currentSlug, targetLang) {
        if (!slugMapping || !slugMapping[currentSlug]) {
            return currentSlug; // Fallback to current slug
        }
        
        const mapping = slugMapping[currentSlug];
        return mapping[targetLang] || currentSlug;
    }
    
    // Initialize language switcher
    async function initLanguageSwitcher() {
        console.log('🌐 Enhanced Language Switcher: Initializing...');
        
        // Load slug mapping first
        await loadSlugMapping();
        
        const path = window.location.pathname;
        console.log('Current path:', path);
        
        // Detect current language
        const langMatch = path.match(/^\/(?:es|fr|de)\//);
        const currentLang = langMatch ? langMatch[0].slice(1, -1) : 'en';
        console.log('Detected language:', currentLang);
        
        // Parse the path to extract the installation slug if on an installation page
        let isInstallationPage = false;
        let currentInstallationSlug = null;
        
        if (path.includes('/installations/')) {
            isInstallationPage = true;
            // Extract slug from path (remove .html extension)
            const match = path.match(/\/installations\/([^/]+)\.html/);
            if (match) {
                currentInstallationSlug = match[1];
                console.log('Current installation slug:', currentInstallationSlug);
            }
        }
        
        // Get base page path
        let basePage = path;
        basePage = basePage.replace(/^\/(?:es|fr|de|en)\//g, '/');
        
        if (basePage === '' || basePage === '/') {
            basePage = '/index.html';
        }
        
        console.log('Base page:', basePage);
        
        // Find all language switcher links
        const languageLinks = document.querySelectorAll('.language-switcher a, .mobile-nav-menu .lang-btn');
        console.log('Found', languageLinks.length, 'language links');
        
        languageLinks.forEach(link => {
            const linkLang = link.textContent.toLowerCase().trim();
            
            // Reset styles
            link.style.background = '';
            link.style.color = '#64748b';
            link.style.boxShadow = '';
            link.classList.remove('current', 'active');
            
            // Generate URL for this language
            const origin = window.location.origin;
            let targetUrl;
            
            if (isInstallationPage && currentInstallationSlug && slugMapping) {
                // For installation pages, use the translated slug
                
                // First, find the English slug (it might be a translated slug we're starting from)
                let englishSlug = currentInstallationSlug;
                
                // Search through mapping to find which installation this is
                for (const [enSlug, mapping] of Object.entries(slugMapping)) {
                    if (mapping[currentLang] === currentInstallationSlug || enSlug === currentInstallationSlug) {
                        englishSlug = enSlug;
                        break;
                    }
                }
                
                // Now get the target language slug
                const targetSlug = linkLang === 'en' ? 
                    englishSlug : 
                    (slugMapping[englishSlug]?.[linkLang] || englishSlug);
                
                if (linkLang === 'en') {
                    targetUrl = `${origin}/installations/${targetSlug}.html`;
                } else {
                    targetUrl = `${origin}/${linkLang}/installations/${targetSlug}.html`;
                }
                
                console.log(`${linkLang.toUpperCase()} URL: ${targetUrl} (slug: ${targetSlug})`);
            } else {
                // For non-installation pages, use the standard approach
                if (linkLang === 'en') {
                    targetUrl = origin + basePage;
                } else {
                    targetUrl = `${origin}/${linkLang}${basePage}`;
                }
            }
            
            link.href = targetUrl;
            console.log(`${linkLang.toUpperCase()} link: ${targetUrl}`);
            
            // Highlight current language
            if (linkLang === currentLang) {
                link.style.background = '#ff6b35';
                link.style.color = 'white';
                link.style.boxShadow = '0 2px 4px rgba(255, 107, 53, 0.3)';
                link.classList.add('current', 'active');
                console.log(`✓ Highlighted ${linkLang.toUpperCase()} as current`);
            }
        });
        
        console.log('🌐 Enhanced Language Switcher: Initialization complete');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
    } else {
        initLanguageSwitcher();
    }
})();