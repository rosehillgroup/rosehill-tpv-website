// Language Switcher Script - COMPLETELY REWRITTEN
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Language Switcher: Initializing...');
    
    const path = window.location.pathname;
    console.log('Current path:', path);
    
    // Detect current language with more robust regex
    const langMatch = path.match(/^\/(?:es|fr|de)\//);
    const currentLang = langMatch ? langMatch[0].slice(1, -1) : 'en'; // Remove leading / and trailing /
    
    console.log('Detected language:', currentLang);
    
    // Get base page path by removing language prefix completely
    let basePage = path;
    if (langMatch) {
        // Remove the language prefix (e.g., /es/ or /fr/)
        basePage = path.substring(langMatch[0].length - 1); // Keep the trailing slash
    }
    
    // Ensure we have a proper page path
    if (basePage === '' || basePage === '/') {
        basePage = '/index.html';
    }
    
    console.log('Base page:', basePage);
    
    // Find all language switcher links
    const languageLinks = document.querySelectorAll('.language-switcher a');
    console.log('Found', languageLinks.length, 'language links');
    
    languageLinks.forEach(link => {
        const linkLang = link.textContent.toLowerCase().trim();
        
        // ALWAYS reset all styles first
        link.style.background = '';
        link.style.color = '#64748b';
        link.style.boxShadow = '';
        link.classList.remove('current', 'active');
        
        // Generate correct URL for this language
        if (linkLang === 'en') {
            link.href = basePage;
        } else {
            link.href = `/${linkLang}${basePage}`;
        }
        
        console.log(`${linkLang.toUpperCase()} link: ${link.href}`);
        
        // Highlight ONLY the current language
        if (linkLang === currentLang) {
            link.style.background = '#ff6b35';
            link.style.color = 'white';
            link.style.boxShadow = '0 2px 8px rgba(255,107,53,0.3)';
            link.classList.add('current');
            console.log(`✓ Highlighted ${linkLang.toUpperCase()} as current`);
        }
        
        // Remove any existing event listeners by cloning the element
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        // Add fresh hover effects
        newLink.addEventListener('mouseenter', function() {
            const thisLang = this.textContent.toLowerCase().trim();
            if (thisLang !== currentLang) {
                this.style.background = 'rgba(255, 107, 53, 0.1)';
                this.style.color = '#ff6b35';
            }
        });
        
        newLink.addEventListener('mouseleave', function() {
            const thisLang = this.textContent.toLowerCase().trim();
            if (thisLang !== currentLang) {
                this.style.background = '';
                this.style.color = '#64748b';
            } else {
                // Restore current language highlighting
                this.style.background = '#ff6b35';
                this.style.color = 'white';
                this.style.boxShadow = '0 2px 8px rgba(255,107,53,0.3)';
            }
        });
    });
    
    console.log('🌐 Language Switcher: Initialization complete');
});