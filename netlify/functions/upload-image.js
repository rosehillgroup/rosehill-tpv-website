// Netlify Function: Upload image to Sanity Assets
// Handles base64 encoded image uploads via JSON

import sanityClient from '@sanity/client';
import { requireEditorRole, checkRateLimit, safeLog } from './_utils/auth.js';

// Initialize Sanity client with error handling
let sanity;
try {
  sanity = sanityClient({
    projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2023-05-03',
    token: process.env.SANITY_TOKEN,
    useCdn: false
  });
} catch (error) {
  console.error('Failed to initialize Sanity client:', error);
}

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

// Validation constants
const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Main handler
 */
export async function handler(event, context) {
  try {
    const headers = corsHeaders(event.headers?.origin);
    
    // Check if Sanity client is initialized
    if (!sanity) {
      console.error('Sanity client not initialized');
      return new Response(JSON.stringify({ error: 'Storage service not configured' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    
    // Log what we're receiving for debugging
    console.log('Upload handler called with:', {
      method: event.httpMethod,
      headers: event.headers ? Object.keys(event.headers) : 'no headers',
      hasBody: !!event.body
    });
    
    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }
    
    // Diagnostic GET handler
    if (event.httpMethod === 'GET') {
      return new Response(JSON.stringify({
        message: 'Upload endpoint is working',
        expectedMethod: 'POST',
        receivedMethod: event.httpMethod
      }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
  
    // Only accept POST
    if (event.httpMethod !== 'POST') {
      console.log('Method not POST, returning 405. Actual method:', event.httpMethod);
      return new Response(JSON.stringify({ 
        error: `Method Not Allowed. Expected POST but received ${event.httpMethod || 'undefined'}` 
      }), { 
        status: 405, 
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    
    safeLog('Upload image POST request received');
  
    // Validate authentication
    const auth = await requireEditorRole(event, process.env.ALLOWED_ORIGIN);
    if (!auth.ok) {
      return new Response(JSON.stringify({ error: auth.msg }), { 
        status: auth.status, 
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
  
    // Rate limiting
    const rateLimit = checkRateLimit(auth.user.id);
    if (!rateLimit.ok) {
      return new Response(JSON.stringify({
        error: `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds`
      }), { 
        status: 429, 
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
  
    // Parse JSON body
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), { 
        status: 400, 
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    
    // Validate required fields
    if (!data.image || !data.filename || !data.mimeType) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: image (base64), filename, and mimeType are required' 
      }), { 
        status: 400, 
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    
    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(data.mimeType)) {
      return new Response(JSON.stringify({ 
        error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}` 
      }), { 
        status: 400, 
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    
    // Decode base64 image
    const imageBuffer = Buffer.from(data.image, 'base64');
    
    // Validate file size
    if (imageBuffer.length > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ 
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }), { 
        status: 400, 
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    
    safeLog('Uploading to Sanity', { 
      filename: data.filename,
      size: imageBuffer.length,
      type: data.mimeType 
    });
    
    try {
      // Upload buffer directly to Sanity
      const asset = await sanity.assets.upload('image', imageBuffer, {
        filename: data.filename,
        contentType: data.mimeType
      });
      
      safeLog('Upload successful', { assetId: asset._id });
      
      // Return asset information
      return new Response(JSON.stringify({
        assetId: asset._id,
        url: asset.url,
        filename: data.filename,
        size: asset.size,
        dimensions: {
          width: asset.metadata?.dimensions?.width,
          height: asset.metadata?.dimensions?.height
        }
      }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
      
    } catch (uploadError) {
      safeLog('Sanity upload error', { error: uploadError.message });
      
      if (uploadError.message?.includes('network')) {
        return new Response(JSON.stringify({ 
          error: 'Network error connecting to storage service' 
        }), { 
          status: 503, 
          headers: { ...headers, 'Content-Type': 'application/json' }
        });
      }
      
      if (uploadError.message?.includes('token')) {
        return new Response(JSON.stringify({ 
          error: 'Storage service authentication error' 
        }), { 
          status: 500, 
          headers: { ...headers, 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ 
        error: `Upload failed: ${uploadError.message}` 
      }), { 
        status: 500, 
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    
  } catch (outerError) {
    // Fallback error handler if something goes wrong in the function itself
    console.error('Function error:', outerError);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type'
      }
    });
  }
}