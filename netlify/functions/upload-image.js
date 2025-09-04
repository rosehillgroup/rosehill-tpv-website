// Netlify Function: Upload image to Sanity Assets
// Uses v1 API for consistency with other admin functions

import sanityClient from '@sanity/client';
import { requireEditorRole, checkRateLimit, safeLog } from './_utils/auth.js';

/**
 * Generate CORS headers with proper origin handling
 */
function corsHeaders(origin) {
  const allowed = process.env.ALLOWED_ORIGIN || origin || '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Vary': 'Origin', 
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type'
  };
}

// Lazy Sanity client initialization
let sanity = null;
function getSanity() {
  if (!sanity) {
    sanity = sanityClient({
      projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
      dataset: process.env.SANITY_DATASET || 'production', 
      apiVersion: '2023-05-03',
      token: process.env.SANITY_TOKEN,
      useCdn: false
    });
  }
  return sanity;
}

/**
 * Main handler - v1 API for consistency
 */
export async function handler(event, context) {
  const headers = corsHeaders(event.headers?.origin);
  
  try {
    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers,
        body: ''
      };
    }
    
    // Only accept POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: `Method Not Allowed. Expected POST but received ${event.httpMethod}` 
        })
      };
    }
    
    // Validate authentication using the same pattern as other functions
    const auth = await requireEditorRole(event, process.env.ALLOWED_ORIGIN);
    if (!auth.ok) {
      return {
        statusCode: auth.status,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: auth.msg })
      };
    }
    
    // Rate limiting  
    const rateLimit = checkRateLimit(auth.user.sub);
    if (!rateLimit.ok) {
      return {
        statusCode: 429,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds`
        })
      };
    }
    
    // Parse JSON body (expecting base64 encoded image)
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }
    
    // Validate required fields
    if (!data.image || !data.filename || !data.mimeType) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
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
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
        })
      };
    }
    
    // Decode and validate image
    const imageBuffer = Buffer.from(data.image, 'base64');
    const maxSize = 12 * 1024 * 1024;
    if (imageBuffer.length > maxSize) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` 
        })
      };
    }
    
    // Upload to Sanity
    try {
      const sanityClient = getSanity();
      const asset = await sanityClient.assets.upload('image', imageBuffer, {
        filename: data.filename
      });
      
      safeLog('Upload successful', { assetId: asset._id });
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
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
      
    } catch (uploadError) {
      safeLog('Sanity upload error', { error: uploadError.message });
      
      return {
        statusCode: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: `Upload failed: ${uploadError.message}` 
        })
      };
    }
    
  } catch (outerError) {
    // Never let the function crash - always return valid response
    console.error('Function error:', outerError);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}