// TPV Studio - Perspective Warp Utility
// Client-side perspective transform for in-situ preview

/**
 * @typedef {Object} QuadPoint
 * @property {number} x
 * @property {number} y
 */

/**
 * Compute perspective transform matrix from source to destination quad
 * Returns a function that transforms source coordinates to destination
 * @param {number[]} srcPoints - [x0,y0, x1,y1, x2,y2, x3,y3] source corners
 * @param {number[]} dstPoints - [x0,y0, x1,y1, x2,y2, x3,y3] destination corners
 * @returns {function(number, number): [number, number]} transform function
 */
function computePerspectiveTransform(srcPoints, dstPoints) {
  // Compute 3x3 homography matrix using DLT (Direct Linear Transform)
  // H maps source points to destination points: dst = H * src

  const [x0, y0, x1, y1, x2, y2, x3, y3] = srcPoints;
  const [u0, v0, u1, v1, u2, v2, u3, v3] = dstPoints;

  // Build the 8x8 matrix A and 8x1 vector b for Ah = b
  const A = [
    [x0, y0, 1, 0, 0, 0, -u0*x0, -u0*y0],
    [0, 0, 0, x0, y0, 1, -v0*x0, -v0*y0],
    [x1, y1, 1, 0, 0, 0, -u1*x1, -u1*y1],
    [0, 0, 0, x1, y1, 1, -v1*x1, -v1*y1],
    [x2, y2, 1, 0, 0, 0, -u2*x2, -u2*y2],
    [0, 0, 0, x2, y2, 1, -v2*x2, -v2*y2],
    [x3, y3, 1, 0, 0, 0, -u3*x3, -u3*y3],
    [0, 0, 0, x3, y3, 1, -v3*x3, -v3*y3]
  ];

  const b = [u0, v0, u1, v1, u2, v2, u3, v3];

  // Solve using Gaussian elimination with partial pivoting
  const h = solveLinearSystem(A, b);

  // h = [h0, h1, h2, h3, h4, h5, h6, h7]
  // H = [[h0, h1, h2], [h3, h4, h5], [h6, h7, 1]]

  return function transform(x, y) {
    const w = h[6] * x + h[7] * y + 1;
    const px = (h[0] * x + h[1] * y + h[2]) / w;
    const py = (h[3] * x + h[4] * y + h[5]) / w;
    return [px, py];
  };
}

/**
 * Solve linear system Ax = b using Gaussian elimination
 * @param {number[][]} A - coefficient matrix
 * @param {number[]} b - right-hand side vector
 * @returns {number[]} solution vector
 */
function solveLinearSystem(A, b) {
  const n = A.length;

  // Create augmented matrix
  const aug = A.map((row, i) => [...row, b[i]]);

  // Forward elimination with partial pivoting
  for (let col = 0; col < n; col++) {
    // Find pivot
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) {
        maxRow = row;
      }
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    // Eliminate column
    for (let row = col + 1; row < n; row++) {
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= n; j++) {
        aug[row][j] -= factor * aug[col][j];
      }
    }
  }

  // Back substitution
  const x = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = aug[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= aug[i][j] * x[j];
    }
    x[i] /= aug[i][i];
  }

  return x;
}

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
 * @param {QuadPoint[]} [opts.shape] - Optional polygon for clipping (in photo coords)
 * @param {Object} [opts.lighting] - Optional lighting adjustment
 * @param {boolean} [opts.lighting.enabled] - Whether to apply lighting adjustment
 * @param {number} [opts.lighting.strength] - Adjustment strength (0-1)
 * @param {number} [opts.lighting.baseBrightness] - Base brightness factor
 * @param {number} [opts.lighting.baseContrast] - Base contrast factor
 */
export function warpDesignOntoPhoto({ photoCtx, photoImg, designImg, quad, opacity, shape, lighting }) {
  const canvas = photoCtx.canvas;

  // Clear and draw photo as base (canvas should be set to photo's natural dimensions)
  photoCtx.clearRect(0, 0, canvas.width, canvas.height);
  photoCtx.drawImage(photoImg, 0, 0, canvas.width, canvas.height);

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
  const perspT = computePerspectiveTransform(srcPoints, dstPoints);

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

  // Apply lighting adjustment if enabled
  if (lighting && lighting.enabled) {
    const s = lighting.strength || 0.6;
    const brightness = 1 + (lighting.baseBrightness - 1) * s;
    const contrast = 1 + (lighting.baseContrast - 1) * s;
    photoCtx.filter = `brightness(${brightness}) contrast(${contrast})`;
  }

  // Apply polygon clipping if shape is provided
  const clipPoints = shape && shape.length >= 3 ? shape : quad;
  photoCtx.beginPath();
  photoCtx.moveTo(clipPoints[0].x, clipPoints[0].y);
  for (let i = 1; i < clipPoints.length; i++) {
    photoCtx.lineTo(clipPoints[i].x, clipPoints[i].y);
  }
  photoCtx.closePath();
  photoCtx.clip();

  // Draw each grid cell as two triangles
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x0 = i * cellW;
      const y0 = j * cellH;
      const x1 = (i + 1) * cellW;
      const y1 = (j + 1) * cellH;

      // Transform corners
      const tl = perspT(x0, y0);
      const tr = perspT(x1, y0);
      const br = perspT(x1, y1);
      const bl = perspT(x0, y1);

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
