// Authentication helper for admin pages
// Ensures user is logged in with editor role via Auth0

(function() {
    'use strict';
    
    let auth0Client = null;
    let currentUser = null;
    let auth0Config = null;
    
    // Load Auth0 configuration from Netlify function
    async function loadAuth0Config() {
        try {
            const response = await fetch('/.netlify/functions/auth-config');
            if (!response.ok) {
                throw new Error(`Failed to load Auth0 configuration: ${response.status}`);
            }
            auth0Config = await response.json();
            return auth0Config;
        } catch (error) {
            console.error('Config load error:', error);
            throw error;
        }
    }
    
    // Initialize Auth0
    async function initAuth0() {
        try {
            // Load Auth0 SDK if not already loaded
            if (typeof auth0 === 'undefined') {
                // Auth0 SDK should be loaded from CDN in the HTML
                throw new Error('Auth0 SDK not loaded');
            }
            
            // Load configuration - check if already loaded as globals first
            if (window.AUTH0_DOMAIN && window.AUTH0_CLIENT_ID) {
                auth0Config = {
                    domain: window.AUTH0_DOMAIN,
                    clientId: window.AUTH0_CLIENT_ID,
                    audience: window.AUTH0_AUDIENCE
                };
            } else if (!auth0Config) {
                auth0Config = await loadAuth0Config();
            }
            
            // Create Auth0 client with localStorage to persist auth between pages
            auth0Client = await auth0.createAuth0Client({
                domain: auth0Config.domain,
                clientId: auth0Config.clientId,
                authorizationParams: {
                    redirect_uri: window.location.origin + '/admin/login.html',
                    audience: auth0Config.audience
                },
                cacheLocation: 'localstorage',
                useRefreshTokens: true
            });
            
            console.log('Auth.js initialized with config:', {
                domain: auth0Config.domain,
                clientId: auth0Config.clientId,
                audience: auth0Config.audience
            });
            
            // Check if user is authenticated
            const isAuthenticated = await auth0Client.isAuthenticated();
            console.log('Auth0 isAuthenticated:', isAuthenticated);
            
            if (!isAuthenticated) {
                console.log('User not authenticated, redirecting to login...');
                // Not logged in, redirect to login
                const currentPath = window.location.pathname + window.location.search;
                window.location.href = `/admin/login.html?redirect=${encodeURIComponent(currentPath)}`;
                return;
            }
            
            // Get user info
            currentUser = await auth0Client.getUser();
            
            // Check for editor role in custom claim
            const token = await auth0Client.getTokenSilently();
            const payload = JSON.parse(atob(token.split('.')[1]));
            const roles = payload['https://tpv.rosehill.group/roles'] || [];
            
            if (!roles.includes('editor')) {
                alert('You need editor access to use the admin panel.');
                auth0Client.logout({ logoutParams: { returnTo: window.location.origin } });
                return;
            }
            
            console.log('Authenticated as:', currentUser.email);
            
        } catch (error) {
            console.error('Auth initialization error:', error);
            window.location.href = '/admin/login.html';
        }
    }
    
    // Export auth functions to global scope
    window.adminAuth = {
        /**
         * Get the current user
         */
        getUser: function() {
            return currentUser;
        },
        
        /**
         * Get JWT token for API calls
         */
        getToken: async function() {
            if (!auth0Client) return null;
            try {
                return await auth0Client.getTokenSilently();
            } catch (error) {
                console.error('Token error:', error);
                return null;
            }
        },
        
        /**
         * Make authenticated API call
         */
        apiCall: async function(url, options = {}) {
            const token = await this.getToken();
            if (!token) {
                throw new Error('Not authenticated');
            }
            
            // Add authorization header
            options.headers = options.headers || {};
            options.headers['Authorization'] = `Bearer ${token}`;
            
            // Make the request
            const response = await fetch(url, options);
            
            // Handle authentication errors
            if (response.status === 401 || response.status === 403) {
                auth0Client.logout({ logoutParams: { returnTo: window.location.origin } });
                throw new Error('Authentication failed');
            }
            
            return response;
        },
        
        /**
         * Logout user
         */
        logout: function() {
            if (auth0Client) {
                auth0Client.logout({ logoutParams: { returnTo: window.location.origin } });
            }
        }
    };
    
    // Initialize on load - wait for config to be ready
    async function waitForConfigAndInit() {
        // If auth0-config.js is being used, wait for it to load
        if (document.querySelector('script[src*="auth0-config.js"]')) {
            let attempts = 0;
            while (!window.AUTH0_CONFIG_READY && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            if (!window.AUTH0_CONFIG_READY) {
                console.error('Auth0 config not loaded after timeout');
                window.location.href = '/admin/login.html';
                return;
            }
        }
        initAuth0();
    }
    
    waitForConfigAndInit();
    
    // Add logout handler to any logout buttons
    document.addEventListener('DOMContentLoaded', function() {
        const logoutButtons = document.querySelectorAll('[data-logout]');
        logoutButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    window.adminAuth.logout();
                }
            });
        });
    });
    
})();