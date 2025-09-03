// Simple authentication helper using shared Auth0 client
// Ensures user is logged in with editor role

(function() {
    'use strict';
    
    let currentUser = null;
    
    // Check authentication on page load
    async function checkAuth() {
        try {
            console.log('Checking authentication...');
            
            // Check if authenticated
            const isAuthenticated = await window.sharedAuth0.isAuthenticated();
            console.log('Is authenticated:', isAuthenticated);
            
            if (!isAuthenticated) {
                // Redirect to login
                const currentPath = window.location.pathname + window.location.search;
                window.location.href = `/admin/login.html?redirect=${encodeURIComponent(currentPath)}`;
                return;
            }
            
            // Get user info and check role
            currentUser = await window.sharedAuth0.getUser();
            const token = await window.sharedAuth0.getTokenSilently();
            
            // Check for editor role
            const payload = JSON.parse(atob(token.split('.')[1]));
            const roles = payload['https://tpv.rosehill.group/roles'] || [];
            
            if (!roles.includes('editor')) {
                alert('You need editor access to use the admin panel.');
                await window.sharedAuth0.logout();
                return;
            }
            
            console.log('Authenticated as:', currentUser.email);
            
        } catch (error) {
            console.error('Auth check error:', error);
            window.location.href = '/admin/login.html';
        }
    }
    
    // Export auth functions
    window.adminAuth = {
        getUser: function() {
            return currentUser;
        },
        
        getToken: async function() {
            return window.sharedAuth0.getTokenSilently();
        },
        
        apiCall: async function(url, options = {}) {
            const token = await this.getToken();
            if (!token) {
                throw new Error('Not authenticated');
            }
            
            options.headers = options.headers || {};
            options.headers['Authorization'] = `Bearer ${token}`;
            
            const response = await fetch(url, options);
            
            if (response.status === 401 || response.status === 403) {
                await window.sharedAuth0.logout();
                throw new Error('Authentication failed');
            }
            
            return response;
        },
        
        logout: function() {
            return window.sharedAuth0.logout();
        }
    };
    
    // Initialize
    checkAuth();
    
    // Add logout handlers
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