// Provides Auth0 configuration to admin pages
// This endpoint returns the public Auth0 configuration needed by the browser

export async function handler(event) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  };
  
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }
  
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  // Return public Auth0 configuration
  // Extract domain from issuer URL, removing protocol and trailing slash
  let domain = process.env.AUTH0_ISSUER_BASE_URL || process.env.AUTH0_DOMAIN || '';
  domain = domain.replace('https://', '').replace('http://', '').replace(/\/$/, '');
  
  const config = {
    domain: domain,
    clientId: process.env.AUTH0_CLIENT_ID,
    audience: process.env.AUTH0_AUDIENCE
  };
  
  // Debug: Log what variables are available (safely)
  console.log('Available Auth0 env vars:', {
    hasIssuerBaseUrl: !!process.env.AUTH0_ISSUER_BASE_URL,
    hasDomain: !!process.env.AUTH0_DOMAIN,
    hasClientId: !!process.env.AUTH0_CLIENT_ID,
    hasAudience: !!process.env.AUTH0_AUDIENCE,
    issuerValue: process.env.AUTH0_ISSUER_BASE_URL?.substring(0, 20) + '...',
    domainValue: process.env.AUTH0_DOMAIN?.substring(0, 20) + '...'
  });
  
  // Verify we have the required config
  if (!config.domain || !config.clientId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Auth0 configuration missing. Please check environment variables.',
        debug: {
          hasDomain: !!config.domain,
          hasClientId: !!config.clientId,
          hasAudience: !!config.audience
        }
      })
    };
  }
  
  // If audience is missing, we can proceed but warn
  if (!config.audience) {
    console.log('Warning: AUTH0_AUDIENCE not set, using default');
    config.audience = 'https://tpv-api';
  }
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(config)
  };
}