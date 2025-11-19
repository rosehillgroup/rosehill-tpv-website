// TPV Studio - Perspective Warp Utility
// Client-side perspective transform for in-situ preview

import Perspective from 'perspective-transform';

/**
 * @typedef {Object} QuadPoint
 * @property {number} x
 * @property {number} y
 */

/**
 * Load an image from URL
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
 * Rasterize SVG to an image element at specified max size
 * @param {string} svgUrl - URL of SVG to rasterize
 * @param {number} maxSize - Maximum dimension (width or height)
 * @returns {Promise<HTMLImageElement>}
 */
export async function rasterizeSvg(svgUrl, maxSize = 1536) {
  // Load SVG as image first to get dimensions
  const svgImg = await loadImage(svgUrl);

  const { naturalWidth, naturalHeight } = svgImg;

  // Calculate scale to fit within maxSize
  const scale = Math.min(1, maxSize / Math.max(naturalWidth, naturalHeight));
  const width = Math.round(naturalWidth * scale);
  const height = Math.round(naturalHeight * scale);

  // Create canvas and draw scaled SVG
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(svgImg, 0, 0, width, height);

  // Convert canvas to image
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = canvas.toDataURL('image/png');
  });
}

/**
 * Warp design image onto photo using perspective transform
 * Uses triangle mesh for accurate perspective mapping
 *
 * @param {Object} opts - Options
 * @param {CanvasRenderingContext2D} opts.photoCtx - Canvas context to draw on
 * @param {HTMLImageElement} opts.photoImg - Photo image
 * @param {HTMLImageElement} opts.designImg - Design image to warp
 * @param {[QuadPoint, QuadPoint, QuadPoint, QuadPoint]} opts.quad - Destination corners [TL, TR, BR, BL]
 * @param {number} opts.opacity - Overlay opacity (0-1)
 */
export function warpDesignOntoPhoto({ photoCtx, photoImg, designImg, quad, opacity }) {
  const canvas = photoCtx.canvas;
  const dpr = window.devicePixelRatio || 1;

  // Clear and draw photo as base
  photoCtx.clearRect(0, 0, canvas.width, canvas.height);
  photoCtx.drawImage(photoImg, 0, 0, canvas.width / dpr, canvas.height / dpr);

  // Get design dimensions
  const W = designImg.width;
  const H = designImg.height;

  // Source rectangle corners (design image space)
  const srcPoints = [0, 0, W, 0, W, H, 0, H];

  // Destination quadrilateral corners (photo space)
  const dstPoints = [
    quad[0].x, quad[0].y,
    quad[1].x, quad[1].y,
    quad[2].x, quad[2].y,
    quad[3].x, quad[3].y
  ];

  // Compute perspective transform
  const perspT = Perspective(srcPoints, dstPoints);

  // Draw warped design using triangle mesh
  // Divide into grid and draw each cell as two triangles
  const gridSize = 10; // Number of divisions
  const cellW = W / gridSize;
  const cellH = H / gridSize;

  // Create offscreen canvas for design
  const designCanvas = document.createElement('canvas');
  designCanvas.width = W;
  designCanvas.height = H;
  const designCtx = designCanvas.getContext('2d');
  designCtx.drawImage(designImg, 0, 0);

  photoCtx.save();
  photoCtx.globalAlpha = opacity;

  // Draw each grid cell as two triangles
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x0 = i * cellW;
      const y0 = j * cellH;
      const x1 = (i + 1) * cellW;
      const y1 = (j + 1) * cellH;

      // Transform corners
      const tl = perspT.transform(x0, y0);
      const tr = perspT.transform(x1, y0);
      const br = perspT.transform(x1, y1);
      const bl = perspT.transform(x0, y1);

      // Draw two triangles for this cell
      // Triangle 1: TL, TR, BL
      drawTexturedTriangle(
        photoCtx,
        designCanvas,
        x0, y0, x1, y0, x0, y1,  // source
        tl[0], tl[1], tr[0], tr[1], bl[0], bl[1]  // dest
      );

      // Triangle 2: TR, BR, BL
      drawTexturedTriangle(
        photoCtx,
        designCanvas,
        x1, y0, x1, y1, x0, y1,  // source
        tr[0], tr[1], br[0], br[1], bl[0], bl[1]  // dest
      );
    }
  }

  photoCtx.restore();
}

/**
 * Draw a textured triangle using affine transform
 * @param {CanvasRenderingContext2D} ctx - Destination context
 * @param {HTMLCanvasElement} texture - Source texture
 * @param {number} sx0 - Source x0
 * @param {number} sy0 - Source y0
 * @param {number} sx1 - Source x1
 * @param {number} sy1 - Source y1
 * @param {number} sx2 - Source x2
 * @param {number} sy2 - Source y2
 * @param {number} dx0 - Dest x0
 * @param {number} dy0 - Dest y0
 * @param {number} dx1 - Dest x1
 * @param {number} dy1 - Dest y1
 * @param {number} dx2 - Dest x2
 * @param {number} dy2 - Dest y2
 */
function drawTexturedTriangle(ctx, texture, sx0, sy0, sx1, sy1, sx2, sy2, dx0, dy0, dx1, dy1, dx2, dy2) {
  ctx.save();

  // Clip to triangle
  ctx.beginPath();
  ctx.moveTo(dx0, dy0);
  ctx.lineTo(dx1, dy1);
  ctx.lineTo(dx2, dy2);
  ctx.closePath();
  ctx.clip();

  // Calculate affine transform from source to dest triangle
  // Solve: [dx] = [a c e] [sx]
  //        [dy]   [b d f] [sy]
  //        [1 ]   [0 0 1] [1 ]

  const denom = (sx0 - sx2) * (sy1 - sy2) - (sx1 - sx2) * (sy0 - sy2);

  if (Math.abs(denom) < 0.001) {
    ctx.restore();
    return;
  }

  const a = ((dx0 - dx2) * (sy1 - sy2) - (dx1 - dx2) * (sy0 - sy2)) / denom;
  const b = ((dy0 - dy2) * (sy1 - sy2) - (dy1 - dy2) * (sy0 - sy2)) / denom;
  const c = ((sx0 - sx2) * (dx1 - dx2) - (sx1 - sx2) * (dx0 - dx2)) / denom;
  const d = ((sx0 - sx2) * (dy1 - dy2) - (sx1 - sx2) * (dy0 - dy2)) / denom;
  const e = dx0 - a * sx0 - c * sy0;
  const f = dy0 - b * sx0 - d * sy0;

  ctx.setTransform(a, b, c, d, e, f);
  ctx.drawImage(texture, 0, 0);

  ctx.restore();
}

/**
 * Download canvas as PNG
 * @param {HTMLCanvasElement} canvas - Canvas to download
 * @param {string} filename - Download filename
 */
export function downloadCanvasAsPng(canvas, filename = 'tpv-in-situ-preview.png') {
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
 * Calculate default quad for design with correct aspect ratio
 * Centers the quad in the photo
 * @param {number} photoWidth - Photo width in pixels
 * @param {number} photoHeight - Photo height in pixels
 * @param {number} designWidthMm - Design width in mm
 * @param {number} designLengthMm - Design length in mm
 * @returns {[QuadPoint, QuadPoint, QuadPoint, QuadPoint]} Default quad [TL, TR, BR, BL]
 */
export function calculateDefaultQuad(photoWidth, photoHeight, designWidthMm, designLengthMm) {
  const designAspect = designWidthMm / designLengthMm;

  // Target size: 60% of photo area
  const maxWidth = photoWidth * 0.6;
  const maxHeight = photoHeight * 0.6;

  let quadWidth, quadHeight;

  if (designAspect > maxWidth / maxHeight) {
    // Design is wider - fit to width
    quadWidth = maxWidth;
    quadHeight = maxWidth / designAspect;
  } else {
    // Design is taller - fit to height
    quadHeight = maxHeight;
    quadWidth = maxHeight * designAspect;
  }

  // Center in photo
  const offsetX = (photoWidth - quadWidth) / 2;
  const offsetY = (photoHeight - quadHeight) / 2;

  return [
    { x: offsetX, y: offsetY },                           // TL
    { x: offsetX + quadWidth, y: offsetY },               // TR
    { x: offsetX + quadWidth, y: offsetY + quadHeight },  // BR
    { x: offsetX, y: offsetY + quadHeight }               // BL
  ];
}
