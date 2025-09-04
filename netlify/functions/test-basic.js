// Minimal test function to check if basic Netlify function works
import { requireEditorRole, errorResponse, successResponse } from './_utils/auth.js';

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type'
  };
}

export async function handler(event, context) {
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
  
  // Just return success without doing anything
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Basic test successful',
      receivedData: { title: data.title }
    })
  };
}