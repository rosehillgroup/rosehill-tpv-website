// /.netlify/functions/_utils/sam2.js
// Shared SAM 2 segmentation utilities for TPV Design Visualiser

import Replicate from 'replicate';
import { createClient } from '@supabase/supabase-js';

/**
 * Upload base64 image to Supabase storage and return signed URL
 *
 * @param {string} imageData - Base64 data URL
 * @returns {Promise<string>} - Signed URL to uploaded image
 */
export async function uploadImageToSupabase(imageData) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  // Extract base64 data and MIME type
  const matches = imageData.match(/^data:image\/(\w+);base64,(.+)$/);

  if (!matches) {
    throw new Error('Invalid base64 image format');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  // Generate unique filename
  const filename = `mask-input-${Date.now()}.${mimeType}`;
  const filePath = `temp/${filename}`;

  console.log('[SAM2] Uploading to Supabase:', filePath);

  // Upload to tpv-visualiser bucket
  const { data, error } = await supabase.storage
    .from('tpv-visualiser')
    .upload(filePath, buffer, {
      contentType: `image/${mimeType}`,
      upsert: false
    });

  if (error) {
    console.error('[SAM2] Supabase upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get signed URL (valid for 1 hour)
  const { data: urlData, error: urlError } = await supabase.storage
    .from('tpv-visualiser')
    .createSignedUrl(filePath, 3600);

  if (urlError) {
    console.error('[SAM2] Supabase URL error:', urlError);
    throw new Error(`Failed to get image URL: ${urlError.message}`);
  }

  console.log('[SAM2] Upload complete:', urlData.signedUrl);

  return urlData.signedUrl;
}

/**
 * Generate segmentation mask using SAM 2 via Replicate
 *
 * Supports two modes:
 * 1. Automatic segmentation (no points/boxes) - segments entire image
 * 2. Point/box prompting - segments specific objects
 *
 * @param {string} imageUrl - HTTP URL to image
 * @param {Array<{x, y, label}>} [points] - Optional point prompts
 * @param {Array<[x1, y1, x2, y2]>} [boxes] - Optional box prompts
 * @returns {Promise<{maskUrl: string, segmentCount: number, selectedSegment: string}>}
 */
export async function generateSAM2Mask(imageUrl, points = null, boxes = null) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY
  });

  console.log('[SAM2] Starting segmentation for:', imageUrl);

  // Build SAM 2 input
  const input = {
    image: imageUrl
  };

  // Mode 1: Point or box prompting (if provided)
  if (points && points.length > 0) {
    console.log('[SAM2] Using point prompting with', points.length, 'points');

    // Convert points to SAM 2 format
    // Points should be [{x, y, label}] where label: 1=foreground, 0=background
    input.point_coords = points.map(p => [p.x, p.y]);
    input.point_labels = points.map(p => p.label ?? 1);
  } else if (boxes && boxes.length > 0) {
    console.log('[SAM2] Using box prompting with', boxes.length, 'boxes');

    // Boxes should be [[x1, y1, x2, y2], ...]
    input.box = boxes[0]; // SAM 2 supports single box
  } else {
    // Mode 2: Automatic segmentation
    console.log('[SAM2] Using automatic segmentation mode');

    // SAM 2 automatic segmentation parameters
    // These control the density and quality of automatic segmentation
    input.points_per_side = 32; // Grid density (higher = more segments)
    input.pred_iou_thresh = 0.88; // IoU threshold for mask filtering
    input.stability_score_thresh = 0.95; // Stability threshold
    input.crop_n_layers = 0; // Multi-crop layers (0 = disabled for speed)
    input.crop_n_points_downscale_factor = 1;
    input.min_mask_region_area = 0; // Minimum mask size (0 = no filter)
  }

  // Run SAM 2 prediction
  console.log('[SAM2] Calling Replicate API with input:', JSON.stringify(input, null, 2));

  const output = await replicate.run(
    "meta/sam-2:1e2b2fd4c6d89e03a1c3084e7945cef14e78f51c7d6e4ef24e64e410948af8db",
    { input }
  );

  console.log('[SAM2] Prediction complete:', JSON.stringify(output, null, 2));

  // Process SAM 2 output
  // Output can be a single mask URL or array of mask URLs
  let maskUrl;
  let segmentCount = 0;
  let selectedSegment = 'automatic';

  if (Array.isArray(output)) {
    console.log('[SAM2] Received', output.length, 'segments');
    segmentCount = output.length;

    // Select ground segment from multiple masks
    // For TPV use case, we want the largest segment in bottom half of image
    maskUrl = selectGroundSegment(output);
    selectedSegment = 'ground-heuristic';
  } else if (typeof output === 'string') {
    console.log('[SAM2] Received single mask URL');
    maskUrl = output;
    segmentCount = 1;
    selectedSegment = 'single-mask';
  } else if (output && output.masks) {
    console.log('[SAM2] Received masks array:', output.masks.length);
    segmentCount = output.masks.length;
    maskUrl = selectGroundSegment(output.masks);
    selectedSegment = 'ground-heuristic';
  } else {
    throw new Error('Unexpected SAM 2 output format');
  }

  console.log('[SAM2] Selected mask:', maskUrl);

  return {
    maskUrl,
    segmentCount,
    selectedSegment
  };
}

/**
 * Select ground/surface segment from multiple SAM 2 masks
 *
 * Heuristic: Choose the largest segment that occupies the bottom half of the image
 * This works well for playground/sports surface photos where ground is prominent
 *
 * For Week 3, this is a simple heuristic. Week 4 could add ML-based classification.
 *
 * @param {Array<string>} masks - Array of mask URLs
 * @returns {string} - Selected mask URL
 */
function selectGroundSegment(masks) {
  console.log('[SAM2] Selecting ground segment from', masks.length, 'masks');

  // For now, return the first mask as a simple heuristic
  // In a production system, you would:
  // 1. Download each mask
  // 2. Analyze pixel distribution (favor bottom-heavy masks)
  // 3. Calculate area (favor largest masks)
  // 4. Use ML classifier to identify ground vs. sky/objects

  // Simple heuristic: return first mask
  // This assumes SAM 2 returns masks sorted by area (largest first)
  return masks[0];
}

/**
 * Generate a simple full-image white mask
 * This creates a 1x1 white pixel PNG that can be scaled to match any image
 *
 * @returns {string} - Base64 data URL of a white 1x1 pixel PNG
 */
export function generateSimpleMask() {
  // 1x1 white pixel PNG
  // This is a minimal PNG file representing a single white pixel
  // When used as a mask: white = include in processing, black = exclude
  const whitePng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

  return whitePng;
}
