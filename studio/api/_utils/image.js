// Image Processing Utilities for TPV Studio Inspiration Mode
// Sharp-based crop/pad and thumbnail generation

import sharp from 'sharp';

/**
 * Crop or pad image to exact aspect ratio
 * @param {Buffer} buffer - Input image buffer
 * @param {Object} params - Target dimensions
 * @param {number} params.targetW - Target width in pixels
 * @param {number} params.targetH - Target height in pixels
 * @returns {Promise<Buffer>} Processed image buffer
 */
export async function cropPadToExactAR(buffer, { targetW, targetH }) {
  try {
    const img = sharp(buffer).ensureAlpha();
    const meta = await img.metadata();

    const currentAR = meta.width / meta.height;
    const targetAR = targetW / targetH;

    console.log(
      `[IMAGE] Input: ${meta.width}×${meta.height} (AR: ${currentAR.toFixed(3)}) → ` +
      `Target: ${targetW}×${targetH} (AR: ${targetAR.toFixed(3)})`
    );

    let pipeline = img;

    // Determine if we need to crop or pad
    if (Math.abs(currentAR - targetAR) < 0.001) {
      // AR already matches, just resize
      console.log('[IMAGE] Exact AR match, resizing only');
      pipeline = pipeline.resize(targetW, targetH, {
        fit: 'fill',
        kernel: 'lanczos3'
      });
    } else if (currentAR > targetAR) {
      // Image is wider than target, need to crop width or pad height
      // Strategy: center-crop width to match target AR, then resize
      const newWidth = Math.round(meta.height * targetAR);
      const xOffset = Math.round((meta.width - newWidth) / 2);

      console.log(`[IMAGE] Crop width: ${newWidth}px (offset: ${xOffset}px)`);

      pipeline = pipeline
        .extract({
          left: xOffset,
          top: 0,
          width: newWidth,
          height: meta.height
        })
        .resize(targetW, targetH, {
          fit: 'fill',
          kernel: 'lanczos3'
        });
    } else {
      // Image is taller than target, need to crop height or pad width
      // Strategy: center-crop height to match target AR, then resize
      const newHeight = Math.round(meta.width / targetAR);
      const yOffset = Math.round((meta.height - newHeight) / 2);

      console.log(`[IMAGE] Crop height: ${newHeight}px (offset: ${yOffset}px)`);

      pipeline = pipeline
        .extract({
          left: 0,
          top: yOffset,
          width: meta.width,
          height: newHeight
        })
        .resize(targetW, targetH, {
          fit: 'fill',
          kernel: 'lanczos3'
        });
    }

    // Process with metadata preservation
    const result = await pipeline
      .withMetadata()
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer();

    console.log(`[IMAGE] Output: ${targetW}×${targetH} (${(result.length / 1024).toFixed(1)}KB)`);

    return result;
  } catch (error) {
    console.error('[IMAGE] Error in cropPadToExactAR:', error);
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

/**
 * Generate thumbnail for gallery preview
 * @param {Buffer} buffer - Input image buffer
 * @param {number} size - Max dimension in pixels (default: 512)
 * @returns {Promise<Buffer>} Thumbnail buffer
 */
export async function makeThumbnail(buffer, size = 512) {
  try {
    const thumbnail = await sharp(buffer)
      .resize(size, size, {
        fit: 'inside',
        kernel: 'lanczos3'
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    console.log(`[IMAGE] Thumbnail: ${size}px max (${(thumbnail.length / 1024).toFixed(1)}KB)`);

    return thumbnail;
  } catch (error) {
    console.error('[IMAGE] Error in makeThumbnail:', error);
    throw new Error(`Thumbnail generation failed: ${error.message}`);
  }
}

/**
 * Get image dimensions without loading full buffer
 * @param {Buffer} buffer - Input image buffer
 * @returns {Promise<Object>} {width, height, format, size}
 */
export async function getImageInfo(buffer) {
  try {
    const meta = await sharp(buffer).metadata();

    return {
      width: meta.width,
      height: meta.height,
      format: meta.format,
      size: buffer.length,
      aspectRatio: meta.width / meta.height
    };
  } catch (error) {
    console.error('[IMAGE] Error in getImageInfo:', error);
    throw new Error(`Image info extraction failed: ${error.message}`);
  }
}
