// Language Switcher Script - Fixed Version
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    // Detect current language with more robust regex
    const langMatch = path.match(/^\/(?:es|fr|de)\//);
    const currentLang = langMatch ? langMatch[0].slice(1, -1) : 'en';
    
    // Get base page path by removing ALL language prefixes
    let basePage = path;
    // Remove any language prefix repeatedly until none remain
    basePage = basePage.replace(/^\/(?:es|fr|de|en)\//g, '/');
    // If we still have a language prefix, force remove it
    if (basePage.match(/^\/(?:es|fr|de|en)\//)) {
        const parts = basePage.split('/');
        if (['es', 'fr', 'de', 'en'].includes(parts[1])) {
            parts.splice(1, 1); // Remove the language part
            basePage = parts.join('/');
        }
    }
    
    // Ensure we have a proper page path
    if (basePage === '' || basePage === '/') {
        basePage = '/index.html';
    }
    
    // Find all language switcher links (both desktop and mobile)
    const languageLinks = document.querySelectorAll('.language-switcher a, .mobile-nav-menu .lang-btn');
    
    languageLinks.forEach(link => {
        const linkLang = link.textContent.toLowerCase().trim();
        
        // ALWAYS reset all styles first
        link.style.background = '';
        link.style.color = '#64748b';
        link.style.boxShadow = '';
        link.classList.remove('current', 'active');
        
        // Generate ABSOLUTE URL for this language to avoid any relative URL issues
        const origin = window.location.origin;
        if (linkLang === 'en') {
            link.href = origin + basePage;
        } else {
            link.href = origin + '/' + linkLang + basePage;
        }
        
        // Highlight ONLY the current language
        if (linkLang === currentLang) {
            link.style.background = '#ff6b35';
            link.style.color = 'white';
            link.style.boxShadow = '0 2px 8px rgba(255,107,53,0.3)';
            link.classList.add('current');
        }
        
        // Instead of cloning, just remove all existing click handlers and add a new one
        link.onclick = function(e) {
            e.preventDefault();
            // Use window.location.href for clean navigation
            window.location.href = this.href;
            return false;
        };
        
        // Add hover effects
        link.addEventListener('mouseenter', function() {
            const thisLang = this.textContent.toLowerCase().trim();
            if (thisLang !== currentLang) {
                this.style.background = 'rgba(255, 107, 53, 0.1)';
                this.style.color = '#ff6b35';
            }
        });
        
        link.addEventListener('mouseleave', function() {
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
});