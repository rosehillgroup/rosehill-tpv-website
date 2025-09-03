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
            
            // Load configuration first
            if (!auth0Config) {
                auth0Config = await loadAuth0Config();
            }
            
            // Create Auth0 client
            auth0Client = await auth0.createAuth0Client({
                domain: auth0Config.domain,
                clientId: auth0Config.clientId,
                authorizationParams: {
                    redirect_uri: window.location.origin + '/admin/login.html',
                    audience: auth0Config.audience
                }
            });
            
            // Check if user is authenticated
            const isAuthenticated = await auth0Client.isAuthenticated();
            
            if (!isAuthenticated) {
                // Check for callback from Auth0
                const query = window.location.search;
                if (query.includes('code=') || query.includes('state=')) {
                    try {
                        await auth0Client.handleRedirectCallback();
                        // Clear URL parameters
                        window.history.replaceState({}, document.title, window.location.pathname);
                        // Reload to restart auth check
                        window.location.reload();
                        return;
                    } catch (error) {
                        console.error('Auth0 callback error:', error);
                        window.location.href = '/admin/login.html';
                        return;
                    }
                } else {
                    // Not logged in, redirect to login
                    const currentPath = window.location.pathname + window.location.search;
                    window.location.href = `/admin/login.html?redirect=${encodeURIComponent(currentPath)}`;
                    return;
                }
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
    
    // Initialize on load
    initAuth0();
    
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