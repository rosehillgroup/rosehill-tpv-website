// Netlify Function: Upload image to Sanity Assets
// Uses exact same auth pattern as other working admin functions

import sanityClient from '@sanity/client';
import { requireEditorRole, checkRateLimit, errorResponse, successResponse, safeLog } from './_utils/auth.js';

function corsHeaders(origin) {
  const allowed = process.env.ALLOWED_ORIGIN || origin || '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS', 
    'Access-Control-Allow-Headers': 'Authorization, Content-Type'
  };
}

// Initialize Sanity client (same pattern as working functions)
const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-05-03', 
  token: process.env.SANITY_TOKEN,
  useCdn: false
});

export async function handler(event, context) {
  const headers = corsHeaders(event.headers?.origin);
  
  safeLog('Upload image request received', {
    method: event.httpMethod,
    headers: Object.keys(event.headers)
  });
  
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }
  
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return errorResponse('Method not allowed', 405, headers);
  }
  
  // Validate authentication - EXACT SAME CALL AS OTHER FUNCTIONS
  const auth = await requireEditorRole(event, process.env.ALLOWED_ORIGIN);
  if (!auth.ok) {
    return errorResponse(auth.msg, auth.status, headers);
  }
  
  // Rate limiting
  const rateLimit = checkRateLimit(auth.user.id);
  if (!rateLimit.ok) {
    return errorResponse(
      `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds`,
      429,
      headers
    );
  }
  
  // Parse JSON body
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return errorResponse('Invalid JSON in request body', 400, headers);
  }
  
  // Validate required fields
  if (!data.image || !data.filename || !data.mimeType) {
    return errorResponse('Missing required fields: image (base64), filename, and mimeType are required', 400, headers);
  }
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(data.mimeType)) {
    return errorResponse(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, 400, headers);
  }
  
  // Decode and validate image
  const imageBuffer = Buffer.from(data.image, 'base64');
  const maxSize = 12 * 1024 * 1024;
  if (imageBuffer.length > maxSize) {
    return errorResponse(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`, 400, headers);
  }
  
  try {
    // Upload to Sanity
    const asset = await sanity.assets.upload('image', imageBuffer, {
      filename: data.filename
    });
    
    safeLog('Upload successful', { assetId: asset._id });
    
    return successResponse({
      assetId: asset._id,
      url: asset.url,
      filename: data.filename,
      size: asset.size,
      dimensions: {
        width: asset.metadata?.dimensions?.width,
        height: asset.metadata?.dimensions?.height
      }
    }, 200, headers);
    
  } catch (error) {
    safeLog('Upload error', { error: error.message });
    return errorResponse('Failed to upload image: ' + error.message, 500, headers);
  }
}