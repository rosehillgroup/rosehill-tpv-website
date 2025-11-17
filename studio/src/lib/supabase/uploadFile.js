// File upload utility for TPV Studio
// Handles direct client → Supabase storage uploads

import { supabase } from './client.js';

/**
 * Upload a file (image or SVG) to Supabase storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The Supabase bucket name (default: 'tpv-studio-uploads')
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function uploadFile(file, bucket = 'tpv-studio-uploads') {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomId}.${extension}`;
    const filePath = `uploads/${filename}`;

    console.log('[Upload] Uploading file:', file.name, '→', filePath);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('[Upload] Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload file'
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('[Upload] Success:', publicUrl);

    return {
      success: true,
      url: publicUrl,
      path: filePath
    };

  } catch (err) {
    console.error('[Upload] Unexpected error:', err);
    return {
      success: false,
      error: err.message || 'Unexpected error during upload'
    };
  }
}

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {{valid: boolean, error?: string}}
 */
export function validateFile(file, options = {}) {
  const {
    maxSizeMB = 10,
    allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml']
  } = options;

  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    const typesStr = allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ');
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${typesStr}`
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`
    };
  }

  return { valid: true };
}
