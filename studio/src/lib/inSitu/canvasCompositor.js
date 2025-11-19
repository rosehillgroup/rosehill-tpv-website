// TPV Studio - Canvas Compositor for In-Situ Preview
// Handles design projection onto site photos

/**
 * Load image from URL into Image element
 * @param {string} url - Image URL
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));

    img.src = url;
  });
}

/**
 * Calculate scale factor to fit design into floor area
 * @param {object} designDimensions - Design dimensions in mm {width, length}
 * @param {object} floorDimensions - Floor dimensions in meters {width, length}
 * @param {object} maskBounds - Mask bounding box in pixels {width, height}
 * @returns {number} Scale factor (pixels per mm)
 */
export function scaleDesignToFit(designDimensions, floorDimensions, maskBounds) {
  // Convert floor dimensions to mm
  const floorWidthMM = floorDimensions.width * 1000;
  const floorLengthMM = floorDimensions.length * 1000;

  // Calculate design aspect ratio
  const designRatio = designDimensions.width / designDimensions.length;
  const floorRatio = floorWidthMM / floorLengthMM;

  // Fit design to floor while maintaining aspect ratio
  let targetWidthMM, targetLengthMM;

  if (designRatio > floorRatio) {
    // Design is wider - fit to width
    targetWidthMM = floorWidthMM;
    targetLengthMM = floorWidthMM / designRatio;
  } else {
    // Design is taller - fit to length
    targetLengthMM = floorLengthMM;
    targetWidthMM = floorLengthMM * designRatio;
  }

  // Calculate pixels per mm based on mask bounds
  const pxPerMM_width = maskBounds.width / floorWidthMM;
  const pxPerMM_length = maskBounds.height / floorLengthMM;

  // Use average scale
  return (pxPerMM_width + pxPerMM_length) / 2;
}

/**
 * Apply simple perspective transform using 4 corner points
 * Uses homography matrix calculation
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLImageElement|HTMLCanvasElement} source - Source image
 * @param {Array<{x: number, y: number}>} srcCorners - Source corners [tl, tr, br, bl]
 * @param {Array<{x: number, y: number}>} dstCorners - Destination corners [tl, tr, br, bl]
 */
export function applyPerspectiveTransform(ctx, source, srcCorners, dstCorners) {
  // For a simple implementation, we'll use canvas triangulation
  // This divides the quad into triangles and applies affine transforms

  const sw = source.width;
  const sh = source.height;

  // Create offscreen canvas for source
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = sw;
  srcCanvas.height = sh;
  const srcCtx = srcCanvas.getContext('2d');
  srcCtx.drawImage(source, 0, 0);

  // Define two triangles for the quad
  // Triangle 1: TL, TR, BL
  // Triangle 2: TR, BR, BL
  const triangles = [
    {
      src: [srcCorners[0], srcCorners[1], srcCorners[3]],
      dst: [dstCorners[0], dstCorners[1], dstCorners[3]]
    },
    {
      src: [srcCorners[1], srcCorners[2], srcCorners[3]],
      dst: [dstCorners[1], dstCorners[2], dstCorners[3]]
    }
  ];

  ctx.save();

  for (const { src, dst } of triangles) {
    // Calculate affine transform matrix
    const matrix = calculateAffineTransform(src, dst);

    // Set clipping path to triangle
    ctx.beginPath();
    ctx.moveTo(dst[0].x, dst[0].y);
    ctx.lineTo(dst[1].x, dst[1].y);
    ctx.lineTo(dst[2].x, dst[2].y);
    ctx.closePath();
    ctx.clip();

    // Apply transform
    ctx.setTransform(
      matrix.a, matrix.b, matrix.c,
      matrix.d, matrix.e, matrix.f
    );

    ctx.drawImage(source, 0, 0);

    // Reset for next triangle
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore();
    ctx.save();
  }

  ctx.restore();
}

/**
 * Calculate 2D affine transform matrix from 3 source points to 3 destination points
 * @param {Array<{x: number, y: number}>} src - Source points
 * @param {Array<{x: number, y: number}>} dst - Destination points
 * @returns {{a: number, b: number, c: number, d: number, e: number, f: number}}
 */
function calculateAffineTransform(src, dst) {
  // Solve for affine transform: [dst] = [M] * [src]
  // Using Cramer's rule

  const x0 = src[0].x, y0 = src[0].y;
  const x1 = src[1].x, y1 = src[1].y;
  const x2 = src[2].x, y2 = src[2].y;

  const u0 = dst[0].x, v0 = dst[0].y;
  const u1 = dst[1].x, v1 = dst[1].y;
  const u2 = dst[2].x, v2 = dst[2].y;

  const det = x0 * (y1 - y2) - x1 * (y0 - y2) + x2 * (y0 - y1);

  if (Math.abs(det) < 0.0001) {
    // Degenerate case - return identity
    return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  }

  const a = ((u0 - u2) * (y1 - y2) - (u1 - u2) * (y0 - y2)) / det;
  const b = ((u1 - u2) * (x0 - x2) - (u0 - u2) * (x1 - x2)) / det;
  const c = ((v0 - v2) * (y1 - y2) - (v1 - v2) * (y0 - y2)) / det;
  const d = ((v1 - v2) * (x0 - x2) - (v0 - v2) * (x1 - x2)) / det;
  const e = u0 - a * x0 - b * y0;
  const f = v0 - c * x0 - d * y0;

  return { a, b, c, d, e, f };
}

/**
 * Apply mask clipping to design
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {ImageData} maskData - Mask image data
 */
export function applyMaskClip(ctx, maskData) {
  // Create a temporary canvas with the mask
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = maskData.width;
  maskCanvas.height = maskData.height;
  const maskCtx = maskCanvas.getContext('2d');
  maskCtx.putImageData(maskData, 0, 0);

  // Use destination-in to clip to mask
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(maskCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
}

/**
 * Blend design with underlying photo
 * @param {CanvasRenderingContext2D} ctx - Canvas context with design
 * @param {HTMLImageElement} photo - Original photo
 * @param {number} blendOpacity - Environment blend amount (0-1, default 0.2)
 */
export function blendWithPhoto(ctx, photo, blendOpacity = 0.2) {
  // The ctx already has the clipped design
  // We need to blend the underlying photo into the design areas

  const canvas = ctx.canvas;
  const { width, height } = canvas;

  // Get current design pixels
  const designData = ctx.getImageData(0, 0, width, height);

  // Create photo canvas
  const photoCanvas = document.createElement('canvas');
  photoCanvas.width = width;
  photoCanvas.height = height;
  const photoCtx = photoCanvas.getContext('2d');
  photoCtx.drawImage(photo, 0, 0, width, height);
  const photoData = photoCtx.getImageData(0, 0, width, height);

  // Blend pixels
  const result = designData.data;
  const photoPixels = photoData.data;

  for (let i = 0; i < result.length; i += 4) {
    const alpha = result[i + 3];

    if (alpha > 0) {
      // Blend with photo
      const designWeight = 1 - blendOpacity;
      const photoWeight = blendOpacity;

      result[i] = Math.round(result[i] * designWeight + photoPixels[i] * photoWeight);
      result[i + 1] = Math.round(result[i + 1] * designWeight + photoPixels[i + 1] * photoWeight);
      result[i + 2] = Math.round(result[i + 2] * designWeight + photoPixels[i + 2] * photoWeight);
    }
  }

  ctx.putImageData(designData, 0, 0);
}

/**
 * Draw scale markers on the preview
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {object} floorDimensions - Floor dimensions in meters {width, length}
 * @param {object} bounds - Mask bounds in pixels {x, y, width, height}
 */
export function drawScaleMarkers(ctx, floorDimensions, bounds) {
  const pxPerMeter = bounds.width / floorDimensions.width;

  // Draw 1 meter scale bar
  const barLength = pxPerMeter;
  const barHeight = 8;
  const margin = 20;

  const barX = bounds.x + margin;
  const barY = bounds.y + bounds.height - margin - barHeight;

  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(barX - 5, barY - 20, barLength + 10, barHeight + 35);

  // Scale bar
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(barX, barY, barLength, barHeight);

  // End caps
  ctx.fillRect(barX, barY - 5, 2, barHeight + 10);
  ctx.fillRect(barX + barLength - 2, barY - 5, 2, barHeight + 10);

  // Label
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('1 metre', barX + barLength / 2, barY + barHeight + 15);

  // Draw boundary outline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  ctx.setLineDash([]);

  // Dimension labels
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(bounds.x + bounds.width / 2 - 30, bounds.y - 25, 60, 20);
  ctx.fillStyle = '#ffffff';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${floorDimensions.width}m`, bounds.x + bounds.width / 2, bounds.y - 10);

  // Height label (rotated)
  ctx.save();
  ctx.translate(bounds.x - 10, bounds.y + bounds.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(-30, -15, 60, 20);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${floorDimensions.length}m`, 0, 0);
  ctx.restore();
}

/**
 * Full composition pipeline
 * @param {object} params - Composition parameters
 * @param {string} params.photoUrl - URL of site photo
 * @param {string} params.designUrl - URL of TPV design (SVG or PNG)
 * @param {ImageData} params.maskData - Processed mask data
 * @param {object} params.maskBounds - Mask bounding box {x, y, width, height}
 * @param {object} params.designDimensions - Design dimensions in mm {width, length}
 * @param {object} params.floorDimensions - Floor dimensions in meters {width, length}
 * @param {number} params.blendOpacity - Blend amount with photo (0-1)
 * @param {Array<{x, y}>} params.perspectiveCorners - Optional 4 corners for perspective
 * @param {boolean} params.showScaleMarkers - Whether to draw scale markers
 * @returns {Promise<{canvas: HTMLCanvasElement, dataUrl: string}>}
 */
export async function compositeDesignOnPhoto(params) {
  const {
    photoUrl,
    designUrl,
    maskData,
    maskBounds,
    designDimensions,
    floorDimensions,
    blendOpacity = 0.2,
    perspectiveCorners = null,
    showScaleMarkers = false
  } = params;

  // Load images
  const [photo, design] = await Promise.all([
    loadImage(photoUrl),
    loadImage(designUrl)
  ]);

  // Create main canvas at photo size
  const canvas = document.createElement('canvas');
  canvas.width = photo.naturalWidth;
  canvas.height = photo.naturalHeight;
  const ctx = canvas.getContext('2d');

  // Draw photo as base
  ctx.drawImage(photo, 0, 0);

  // Create design layer canvas
  const designCanvas = document.createElement('canvas');
  designCanvas.width = canvas.width;
  designCanvas.height = canvas.height;
  const designCtx = designCanvas.getContext('2d');

  // Calculate scale factor
  const scaleFactor = scaleDesignToFit(designDimensions, floorDimensions, maskBounds);

  // Calculate design size in pixels
  const designWidth = designDimensions.width * scaleFactor;
  const designHeight = designDimensions.length * scaleFactor;

  // Position design centered in mask bounds
  const designX = maskBounds.x + (maskBounds.width - designWidth) / 2;
  const designY = maskBounds.y + (maskBounds.height - designHeight) / 2;

  if (perspectiveCorners && perspectiveCorners.length === 4) {
    // Apply perspective transform
    const srcCorners = [
      { x: 0, y: 0 },
      { x: design.naturalWidth, y: 0 },
      { x: design.naturalWidth, y: design.naturalHeight },
      { x: 0, y: design.naturalHeight }
    ];

    applyPerspectiveTransform(designCtx, design, srcCorners, perspectiveCorners);
  } else {
    // Simple scale and position
    designCtx.drawImage(
      design,
      designX,
      designY,
      designWidth,
      designHeight
    );
  }

  // Apply mask clipping
  applyMaskClip(designCtx, maskData);

  // Blend with photo
  blendWithPhoto(designCtx, photo, blendOpacity);

  // Composite design layer onto main canvas
  ctx.drawImage(designCanvas, 0, 0);

  // Draw scale markers if requested
  if (showScaleMarkers) {
    drawScaleMarkers(ctx, floorDimensions, maskBounds);
  }

  return {
    canvas,
    dataUrl: canvas.toDataURL('image/png')
  };
}

/**
 * Export preview as PNG blob
 * @param {HTMLCanvasElement} canvas - Composite canvas
 * @param {string} filename - Download filename
 */
export function downloadPreview(canvas, filename = 'tpv-in-situ-preview.png') {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Export mask as PNG blob
 * @param {ImageData} maskData - Mask image data
 * @param {string} filename - Download filename
 */
export function downloadMask(maskData, filename = 'tpv-floor-mask.png') {
  const canvas = document.createElement('canvas');
  canvas.width = maskData.width;
  canvas.height = maskData.height;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(maskData, 0, 0);

  downloadPreview(canvas, filename);
}
