// Minimal test function to check if basic Netlify function works
const { requireEditorRole, errorResponse, successResponse } = require('./_utils/auth.js');

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type'
  };
}

exports.handler = async function(event, context) {
  const headers = corsHeaders(event.headers.origin);
  
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
  
  const auth = await requireEditorRole(event, process.env.ALLOWED_ORIGIN);
  if (!auth.ok) {
    return { 
      statusCode: auth.status, 
      headers, 
      body: JSON.stringify({ error: auth.msg }) 
    };
  }
  
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return { 
      statusCode: 400, 
      headers, 
      body: JSON.stringify({ error: 'Invalid JSON' }) 
    };
  }
  
  // Return expected data structure to match what admin form expects
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      id: 'test-id',
      slug: 'test-slug',
      publishedLocales: ['en'],
      viewUrls: {
        en: `/installations/test-slug.html`,
        es: null,
        fr: null,
        de: null
      }
    })
  };
}