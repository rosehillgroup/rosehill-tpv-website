// Netlify Function: Upload image to Sanity Assets
// Handles multipart form data with validation

import sanityClient from '@sanity/client';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { requireEditorRole, checkRateLimit, errorResponse, successResponse, safeLog } from './_utils/auth.js';

// Configure for Node.js runtime (required for formidable)
export const config = {
  runtime: 'nodejs18.x'
};

// Initialize Sanity client
const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_TOKEN,
  useCdn: false
});

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
export default async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }
  
  safeLog('Upload image request received', {
    method: event.httpMethod,
    headers: Object.keys(event.headers)
  });
  
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }
  
  // Validate authentication
  const auth = await requireEditorRole(event, process.env.ALLOWED_ORIGIN);
  if (!auth.ok) {
    return errorResponse(auth.msg, auth.status);
  }
  
  // Rate limiting
  const rateLimit = checkRateLimit(auth.user.id);
  if (!rateLimit.ok) {
    return errorResponse(
      `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds`,
      429
    );
  }
  
  // Check for multipart content type
  const contentType = event.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return errorResponse('Content-Type must be multipart/form-data', 400);
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
      return errorResponse('No file uploaded', 400);
    }
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return errorResponse(validation.error, 400);
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
    return successResponse({
      assetId: asset._id,
      url: asset.url,
      filename: safeFilename,
      size: asset.size,
      dimensions: {
        width: asset.metadata?.dimensions?.width,
        height: asset.metadata?.dimensions?.height
      }
    });
    
  } catch (error) {
    safeLog('Upload error', { error: error.message });
    
    // Handle specific errors
    if (error.message?.includes('network')) {
      return errorResponse('Network error connecting to storage service', 503);
    }
    
    if (error.message?.includes('token')) {
      return errorResponse('Storage service authentication error', 500);
    }
    
    return errorResponse('Failed to upload image: ' + error.message, 500);
  }
}