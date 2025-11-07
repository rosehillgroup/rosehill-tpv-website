// Netlify Function: Temporary upload handler 
// Validates uploads and returns mock response until Sanity import is fixed

const { createClient } = require('@sanity/client');

exports.handler = async function(event) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  // Check for auth token (basic validation)
  const auth = event.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Missing authorization token' })
    };
  }
  
  // Parse JSON body
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON in request body' })
    };
  }
  
  // Validate required fields
  if (!data.image || !data.filename || !data.mimeType) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: 'Missing required fields: image (base64), filename, and mimeType are required' 
      })
    };
  }
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(data.mimeType)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
      })
    };
  }
  
  // Validate base64 and size
  try {
    const imageBuffer = Buffer.from(data.image, 'base64');
    const maxSize = 12 * 1024 * 1024;
    if (imageBuffer.length > maxSize) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` 
        })
      };
    }
    
    // Upload to Sanity using dynamic import
    try {
      
      
      const sanity = createClient({
        projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
        dataset: process.env.SANITY_DATASET || 'production',
        apiVersion: '2023-05-03',
        token: process.env.SANITY_WRITE_TOKEN,
        useCdn: false
      });
      
      const asset = await sanity.assets.upload('image', imageBuffer, {
        filename: data.filename
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          assetId: asset._id,
          url: asset.url,
          filename: data.filename,
          size: asset.size,
          dimensions: {
            width: asset.metadata?.dimensions?.width,
            height: asset.metadata?.dimensions?.height
          }
        })
      };
      
    } catch (sanityError) {
      console.error('Sanity upload error:', sanityError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: `Upload failed: ${sanityError.message}`
        })
      };
    }
    
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid base64 image data' })
    };
  }
};