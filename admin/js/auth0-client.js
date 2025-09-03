// Shared Auth0 client for admin pages
// This ensures all pages use the same Auth0 instance for consistent authentication

(function() {
    'use strict';
    
    let auth0Client = null;
    let initPromise = null;
    
    // Create or get the Auth0 client instance
    async function getAuth0Client() {
        // If already initializing, wait for it
        if (initPromise) {
            return initPromise;
        }
        
        // If already initialized, return it
        if (auth0Client) {
            return auth0Client;
        }
        
        // Start initialization
        initPromise = initializeAuth0Client();
        return initPromise;
    }
    
    async function initializeAuth0Client() {
        try {
            // Load configuration
            const response = await fetch('/.netlify/functions/auth-config');
            if (!response.ok) {
                throw new Error(`Failed to load Auth0 configuration: ${response.status}`);
            }
            
            const config = await response.json();
            console.log('Creating shared Auth0 client with config:', config);
            
            // Create Auth0 client with consistent settings
            auth0Client = await auth0.createAuth0Client({
                domain: config.domain,
                clientId: config.clientId,
                authorizationParams: {
                    redirect_uri: window.location.origin + '/admin/login.html',
                    audience: config.audience,
                    scope: 'openid profile email'
                },
                cacheLocation: 'localstorage',
                useRefreshTokens: true,
                cacheLocationKey: 'rosehill_tpv_auth' // Explicit cache key
            });
            
            console.log('Shared Auth0 client created successfully');
            return auth0Client;
            
        } catch (error) {
            console.error('Failed to initialize shared Auth0 client:', error);
            throw error;
        }
    }
    
    // Export to global scope
    window.sharedAuth0 = {
        getClient: getAuth0Client,
        
        // Helper methods that use the shared client
        isAuthenticated: async function() {
            const client = await getAuth0Client();
            return client.isAuthenticated();
        },
        
        getUser: async function() {
            const client = await getAuth0Client();
            return client.getUser();
        },
        
        getTokenSilently: async function() {
            const client = await getAuth0Client();
            return client.getTokenSilently();
        },
        
        loginWithRedirect: async function() {
            const client = await getAuth0Client();
            return client.loginWithRedirect();
        },
        
        handleRedirectCallback: async function() {
            const client = await getAuth0Client();
            return client.handleRedirectCallback();
        },
        
        logout: async function() {
            const client = await getAuth0Client();
            return client.logout({ 
                logoutParams: { 
                    returnTo: window.location.origin 
                } 
            });
        }
    };
    
})();