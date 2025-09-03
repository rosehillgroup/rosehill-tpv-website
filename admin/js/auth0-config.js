// Auth0 configuration for admin pages
// This file loads Auth0 config from server-side environment variables

(async function() {
    try {
        const response = await fetch('/.netlify/functions/auth-config');
        if (!response.ok) {
            throw new Error('Failed to load Auth0 configuration');
        }
        
        const config = await response.json();
        
        // Set global Auth0 configuration
        window.AUTH0_DOMAIN = config.domain;
        window.AUTH0_CLIENT_ID = config.clientId;
        window.AUTH0_AUDIENCE = config.audience;
        
        console.log('Auth0 configuration loaded successfully');
        
    } catch (error) {
        console.error('Failed to load Auth0 configuration:', error);
        
        // Show user-friendly error
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%); 
            background: #fee2e2; color: #dc2626; padding: 12px 24px; 
            border-radius: 6px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        errorDiv.textContent = 'Auth0 configuration not available. Please check your deployment.';
        document.body.appendChild(errorDiv);
    }
})();