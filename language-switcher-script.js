// Fixed Language Switcher Script
document.addEventListener('DOMContentLoaded', function() {
    // Get current language from URL
    const path = window.location.pathname;
    const langMatch = path.match(/^\/(fr|de|es)\//);
    const currentLang = langMatch ? langMatch[1] : 'en';
    
    // Get base page path (remove language prefix)
    let basePage = path;
    if (langMatch) {
        basePage = path.replace(/^\/(fr|de|es)/, '');
    }
    if (basePage === '' || basePage === '/') {
        basePage = '/index.html';
    }
    
    // Update language switcher
    document.querySelectorAll('.language-switcher a').forEach(link => {
        const linkLang = link.textContent.toLowerCase();
        
        // Reset styles
        link.style.background = '';
        link.style.color = '#64748b';
        link.style.boxShadow = '';
        
        // Set correct URL for each language
        if (linkLang === 'en') {
            link.href = basePage;
        } else {
            link.href = `/${linkLang}${basePage}`;
        }
        
        // Highlight current language
        if (linkLang === currentLang) {
            link.style.background = '#ff6b35';
            link.style.color = 'white';
            link.style.boxShadow = '0 2px 8px rgba(255,107,53,0.3)';
        }
        
        // Add hover effects
        link.addEventListener('mouseenter', function() {
            if (this.textContent.toLowerCase() !== currentLang) {
                this.style.background = 'rgba(255, 107, 53, 0.1)';
                this.style.color = '#ff6b35';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            if (this.textContent.toLowerCase() !== currentLang) {
                this.style.background = '';
                this.style.color = '#64748b';
            }
        });
    });
});