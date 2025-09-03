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
  const config = {
    domain: process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', ''),
    clientId: process.env.AUTH0_CLIENT_ID,
    audience: process.env.AUTH0_AUDIENCE
  };
  
  // Verify we have the required config
  if (!config.domain || !config.clientId || !config.audience) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Auth0 configuration missing. Please check environment variables.' 
      })
    };
  }
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(config)
  };
}