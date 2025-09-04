// Netlify Function: Upload image to Sanity Assets
// Handles multipart form data with validation

import sanityClient from '@sanity/client';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { requireEditorRole, checkRateLimit, errorResponse, successResponse, safeLog } from './_utils/auth.js';

// Initialize Sanity client
const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_TOKEN,
  useCdn: false
});

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
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Validate file before upload
 */
function validateFile(file) {
  // Check file exists
  if (!file || !file.originalFilename) {
    return { valid: false, error: 'No file provided' };
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` 
    };
  }
  
  // Check MIME type
  const mimeType = file.mimetype || file.type;
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return { 
      valid: false, 
      error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}` 
    };
  }
  
  // Check file extension
  const ext = path.extname(file.originalFilename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { 
      valid: false, 
      error: `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` 
    };
  }
  
  return { valid: true };
}

/**
 * Generate safe filename
 */
function generateSafeFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const basename = path.basename(originalName, ext)
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
  
  const timestamp = Date.now();
  return `${basename}-${timestamp}${ext}`;
}

/**
 * Main handler
 */
export async function handler(event, context) {
  try {
    const headers = corsHeaders(event.headers?.origin);
    
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
    
    safeLog('Upload image POST request received', {
      method: event.httpMethod,
      headers: Object.keys(event.headers)
    });
  
  // Validate authentication
  const auth = await requireEditorRole(event, process.env.ALLOWED_ORIGIN);
  if (!auth.ok) {
    return new Response(auth.msg, { status: auth.status, headers });
  }
  
  // Rate limiting
  const rateLimit = checkRateLimit(auth.user.id);
  if (!rateLimit.ok) {
    return new Response(
      `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds`,
      { status: 429, headers }
    );
  }
  
  // Check for multipart content type
  const contentType = event.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return new Response('Expected multipart/form-data', { status: 400, headers });
  }
  
  try {
    // Configure formidable
    const form = formidable({
      multiples: false,
      maxFileSize: MAX_FILE_SIZE,
      keepExtensions: true
    });
    
    // Parse the form data
    // Note: Netlify Functions may provide body as base64
    const isBase64 = event.isBase64Encoded;
    const body = isBase64 ? Buffer.from(event.body, 'base64').toString('utf-8') : event.body;
    
    const { files } = await new Promise((resolve, reject) => {
      form.parse({ ...event, body }, (err, fields, files) => {
        if (err) {
          safeLog('Form parse error', { error: err.message });
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });
    
    // Get the uploaded file
    const file = files.file || files.image || Object.values(files)[0];
    
    if (!file) {
      return new Response('No file part', { status: 400, headers });
    }
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return new Response(validation.error, { status: 400, headers });
    }
    
    // Generate safe filename
    const safeFilename = generateSafeFilename(file.originalFilename);
    
    safeLog('Uploading to Sanity', { 
      filename: safeFilename,
      size: file.size,
      type: file.mimetype 
    });
    
    // Read file and upload to Sanity
    const stream = fs.createReadStream(file.filepath || file.path);
    
    const asset = await sanity.assets.upload('image', stream, {
      filename: safeFilename
    });
    
    // Clean up temp file
    try {
      fs.unlinkSync(file.filepath || file.path);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    safeLog('Upload successful', { assetId: asset._id });
    
    // Return asset information
    return new Response(JSON.stringify({
      assetId: asset._id,
      url: asset.url,
      filename: safeFilename,
      size: asset.size,
      dimensions: {
        width: asset.metadata?.dimensions?.width,
        height: asset.metadata?.dimensions?.height
      }
    }), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    safeLog('Upload error', { error: error.message });
    
    // Handle specific errors with CORS headers
    if (error.message?.includes('network')) {
      return new Response('Network error connecting to storage service', { status: 503, headers });
    }
    
    if (error.message?.includes('token')) {
      return new Response('Storage service authentication error', { status: 500, headers });
    }
    
    return new Response(`Upload failed: ${error.message}`, { status: 500, headers });
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