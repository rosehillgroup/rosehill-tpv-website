// Trigger a Netlify rebuild to generate static pages
export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }
  
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }
  
  try {
    // You need to set up a build hook in Netlify and add the URL as an environment variable
    const buildHookUrl = process.env.NETLIFY_BUILD_HOOK;
    
    if (!buildHookUrl) {
      console.log('Build hook URL not configured. Set NETLIFY_BUILD_HOOK in environment variables.');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Build hook not configured - pages will be generated on next manual deploy' 
        })
      };
    }
    
    // Trigger the build
    const response = await fetch(buildHookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      throw new Error(`Build trigger failed: ${response.status}`);
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Site rebuild triggered - pages will be generated in a few minutes' 
      })
    };
    
  } catch (error) {
    console.error('Rebuild trigger error:', error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: 'Failed to trigger rebuild: ' + error.message }) 
    };
  }
}