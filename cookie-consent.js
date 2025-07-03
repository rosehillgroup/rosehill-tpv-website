// Cookie Consent Management System
// This file provides reusable cookie consent functionality for the Rosehill TPV website

const COOKIE_CONSENT_KEY = 'rosehill_cookie_consent';
const CONSENT_EXPIRY = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds

// Google Analytics - only loads if consent given
function loadGoogleAnalytics() {
    // Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics Measurement ID
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(script1);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
}

function getCookieConsent() {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent) {
        const data = JSON.parse(consent);
        if (new Date().getTime() - data.timestamp < CONSENT_EXPIRY) {
            return data;
        }
        localStorage.removeItem(COOKIE_CONSENT_KEY);
    }
    return null;
}

function setCookieConsent(analytics) {
    const consent = {
        analytics: analytics,
        timestamp: new Date().getTime()
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
}

function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.add('show');
    }
}

function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.remove('show');
    }
}

function initializeConsent() {
    const consent = getCookieConsent();
    if (consent) {
        if (consent.analytics) {
            loadGoogleAnalytics();
        }
    } else {
        // Show banner after a short delay
        setTimeout(showCookieBanner, 1500);
    }
}

function initializeCookieEventListeners() {
    // Accept all button
    const acceptAllBtn = document.getElementById('cookie-accept-all');
    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', function() {
            setCookieConsent(true);
            loadGoogleAnalytics();
            hideCookieBanner();
        });
    }
    
    // Essential only button
    const essentialOnlyBtn = document.getElementById('cookie-essential-only');
    if (essentialOnlyBtn) {
        essentialOnlyBtn.addEventListener('click', function() {
            setCookieConsent(false);
            hideCookieBanner();
        });
    }
    
    // Cookie settings link in banner
    const settingsLink = document.getElementById('cookie-settings-link');
    if (settingsLink) {
        settingsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showCookieModal();
        });
    }
    
    // Footer cookie settings link
    const footerSettingsLink = document.getElementById('footer-cookie-settings');
    if (footerSettingsLink) {
        footerSettingsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showCookieModal();
        });
    }
    
    // Modal buttons
    const modalEssentialBtn = document.getElementById('modal-essential-only');
    if (modalEssentialBtn) {
        modalEssentialBtn.addEventListener('click', function() {
            setCookieConsent(false);
            hideCookieBanner();
            hideCookieModal();
        });
    }
    
    const modalSaveBtn = document.getElementById('modal-save-settings');
    if (modalSaveBtn) {
        modalSaveBtn.addEventListener('click', function() {
            const analyticsToggle = document.getElementById('analytics-toggle');
            const analyticsConsent = analyticsToggle ? analyticsToggle.checked : false;
            setCookieConsent(analyticsConsent);
            
            if (analyticsConsent && !window.gtag) {
                loadGoogleAnalytics();
            }
            
            hideCookieBanner();
            hideCookieModal();
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideCookieModal();
            }
        });
    }
}

function showCookieModal() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Set current analytics preference
        const consent = getCookieConsent();
        const analyticsToggle = document.getElementById('analytics-toggle');
        if (consent && analyticsToggle) {
            analyticsToggle.checked = consent.analytics;
        }
    }
}

function hideCookieModal() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize cookie consent when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeConsent();
    initializeCookieEventListeners();
});