// Cookie Consent Management System
// This file provides reusable cookie consent functionality for the Rosehill TPV website

const COOKIE_CONSENT_KEY = 'rosehill_cookie_consent';
const CONSENT_EXPIRY = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds

// GTM Consent Mode - integrates with Google Tag Manager
function setDefaultConsent() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'default_consent',
        'functionality_storage': 'denied',
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
    });
}

function updateConsent(analytics) {
    window.dataLayer = window.dataLayer || [];
    if (analytics) {
        window.dataLayer.push({
            'event': 'update_consent',
            'functionality_storage': 'granted',
            'analytics_storage': 'granted',
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted'
        });
    } else {
        window.dataLayer.push({
            'event': 'update_consent',
            'functionality_storage': 'granted',
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
        });
    }
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
    // Set default consent denial for GTM
    setDefaultConsent();

    const consent = getCookieConsent();
    if (consent) {
        // Update GTM consent based on stored preference
        updateConsent(consent.analytics);
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
            updateConsent(true);
            hideCookieBanner();
        });
    }
    
    // Essential only button
    const essentialOnlyBtn = document.getElementById('cookie-essential-only');
    if (essentialOnlyBtn) {
        essentialOnlyBtn.addEventListener('click', function() {
            setCookieConsent(false);
            updateConsent(false);
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
            updateConsent(false);
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
            updateConsent(analyticsConsent);

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