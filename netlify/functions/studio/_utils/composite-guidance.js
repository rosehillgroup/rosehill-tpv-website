// Composition Guidance Compositor
// Composites semantic stencil onto Pass 1 result for Pass 2 spatial guidance

import sharp from 'sharp';
import { downloadImage } from './replicate.js';

/**
 * Composite stencil onto base image at specified opacity
 * Used for Pass 2 to add faint compositional hints without dominating the image
 *
 * @param {string} baseImageUrl - URL of Pass 1 result image
 * @param {Buffer} stencilBuffer - PNG buffer of semantic stencil
 * @param {number} opacity - Opacity percentage (0-100, default: 15)
 * @returns {Promise<Buffer>} Composited image buffer
 */
export async function compositeStencilOntoImage(baseImageUrl, stencilBuffer, opacity = 15) {
  console.log(`[COMPOSITE] Compositing stencil at ${opacity}% opacity`);

  try {
    // Download base image (Pass 1 result)
    const baseImageBuffer = await downloadImage(baseImageUrl);

    // Get dimensions of base image
    const baseMetadata = await sharp(baseImageBuffer).metadata();
    const { width, height } = baseMetadata;

    console.log(`[COMPOSITE] Base image: ${width}x${height}px`);

    // Resize stencil to match base image dimensions
    const resizedStencil = await sharp(stencilBuffer)
      .resize(width, height, { fit: 'fill' })
      .toBuffer();

    // Composite stencil onto base image with specified opacity
    const compositedBuffer = await sharp(baseImageBuffer)
      .composite([{
        input: resizedStencil,
        blend: 'over',
        opacity: Math.round((opacity / 100) * 255)  // Convert percentage to 0-255
      }])
      .png()
      .toBuffer();

    const compositedSize = compositedBuffer.length;
    console.log(`[COMPOSITE] Generated ${compositedSize} byte composited image`);

    return compositedBuffer;

  } catch (error) {
    console.error('[COMPOSITE] Composition failed:', error);
    throw new Error(`Stencil composition failed: ${error.message}`);
  }
}

/**
 * Generate preview of stencil guidance (for debugging)
 * Shows base image + stencil side-by-side + composited result
 *
 * @param {string} baseImageUrl - URL of base image
 * @param {Buffer} stencilBuffer - Stencil buffer
 * @param {number} opacity - Opacity percentage
 * @returns {Promise<Buffer>} Preview image buffer (3-panel)
 */
export async function generateCompositePreview(baseImageUrl, stencilBuffer, opacity = 15) {
  console.log('[COMPOSITE] Generating composition preview');

  try {
    const baseImageBuffer = await downloadImage(baseImageUrl);
    const compositedBuffer = await compositeStencilOntoImage(baseImageUrl, stencilBuffer, opacity);

    // Get dimensions
    const { width, height } = await sharp(baseImageBuffer).metadata();

    // Resize stencil to match
    const resizedStencil = await sharp(stencilBuffer)
      .resize(width, height, { fit: 'fill' })
      .toBuffer();

    // Create 3-panel preview (base | stencil | composited)
    const previewWidth = width * 3 + 40;  // 20px gaps
    const previewHeight = height + 20;

    const preview = sharp({
      create: {
        width: previewWidth,
        height: previewHeight,
        channels: 3,
        background: { r: 240, g: 240, b: 240 }
      }
    })
    .composite([
      { input: baseImageBuffer, top: 10, left: 10 },
      { input: resizedStencil, top: 10, left: width + 20 },
      { input: compositedBuffer, top: 10, left: (width * 2) + 30 }
    ])
    .png()
    .toBuffer();

    console.log('[COMPOSITE] Preview generated');

    return preview;

  } catch (error) {
    console.error('[COMPOSITE] Preview generation failed:', error);
    throw new Error(`Preview generation failed: ${error.message}`);
  }
}
