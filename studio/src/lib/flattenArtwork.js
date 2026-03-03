/**
 * Flatten Artwork Utility
 * Phase 3: Escape hatch for complex AI-generated SVGs
 *
 * Workflow:
 * 1. Rasterize SVG to canvas at high resolution
 * 2. Quantize colors to TPV palette (using perceptual deltaE2000) + transparency
 * 3. Trace back to vector using ImagetracerJS with TPV palette lock
 * 4. Clean up micro-shapes
 * 5. Return clean SVG
 *
 * Scope: Motifs and AI art ONLY - not courts, tracks, or regulation shapes
 */

import ImageTracer from 'imagetracerjs';
import tpvColours from '../../api/_utils/data/rosehill_tpv_21_colours.json';

// Default resolution (longest side in pixels)
const DEFAULT_RESOLUTION = 4096;

// Minimum area threshold for shapes (in square pixels at trace resolution)
// Shapes smaller than this are considered speckle and removed
const MIN_SHAPE_AREA = 25; // 5x5 pixels

/**
 * ImagetracerJS tracing preset — smooth edges, high fidelity.
 * Custom palette is injected at runtime to prevent re-quantization.
 */
const TRACE_PRESET = {
  colorsampling: 0,        // 0 = use custom palette (pal option)
  numberofcolors: 24,      // Ignored when pal is provided
  mincolorratio: 0,
  colorquantcycles: 1,     // 1 cycle only — prevents palette drift from our exact TPV values
  ltres: 0.5,              // Tighter line threshold (smoother)
  qtres: 0.5,              // Tighter curve threshold (smoother)
  pathomit: 4,             // Keep smaller paths
  rightangleenhance: true,
  blurradius: 1,           // Slight blur for edge smoothing
  blurdelta: 20,
  strokewidth: 1,
  linefilter: false,
  scale: 1,
  roundcoords: 2,          // More precision
  viewbox: false,
  desc: false,
  lcpr: 0,
  qcpr: 0
};

// --- Perceptual colour matching (CIE Lab + deltaE2000) ---

/**
 * Convert sRGB to CIE Lab
 */
function rgbToLab(r, g, b) {
  // Linearize sRGB
  let rl = r / 255;
  let gl = g / 255;
  let bl = b / 255;

  rl = rl > 0.04045 ? Math.pow((rl + 0.055) / 1.055, 2.4) : rl / 12.92;
  gl = gl > 0.04045 ? Math.pow((gl + 0.055) / 1.055, 2.4) : gl / 12.92;
  bl = bl > 0.04045 ? Math.pow((bl + 0.055) / 1.055, 2.4) : bl / 12.92;

  // RGB to XYZ (D65 illuminant)
  const x = (rl * 0.4124 + gl * 0.3576 + bl * 0.1805) * 100;
  const y = (rl * 0.2126 + gl * 0.7152 + bl * 0.0722) * 100;
  const z = (rl * 0.0193 + gl * 0.1192 + bl * 0.9505) * 100;

  // XYZ to Lab
  const xn = 95.047, yn = 100.000, zn = 108.883;
  let fx = x / xn;
  let fy = y / yn;
  let fz = z / zn;

  fx = fx > 0.008856 ? Math.pow(fx, 1 / 3) : (7.787 * fx + 16 / 116);
  fy = fy > 0.008856 ? Math.pow(fy, 1 / 3) : (7.787 * fy + 16 / 116);
  fz = fz > 0.008856 ? Math.pow(fz, 1 / 3) : (7.787 * fz + 16 / 116);

  return {
    L: (116 * fy) - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz)
  };
}

/**
 * CIEDE2000 perceptual colour difference
 */
function deltaE2000(lab1, lab2) {
  const kL = 1, kC = 1, kH = 1;
  const deg360 = Math.PI * 2;
  const deg180 = Math.PI;

  const avgL = (lab1.L + lab2.L) / 2;
  const c1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
  const c2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
  const avgC = (c1 + c2) / 2;
  const g = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));

  const a1p = lab1.a * (1 + g);
  const a2p = lab2.a * (1 + g);
  const c1p = Math.sqrt(a1p * a1p + lab1.b * lab1.b);
  const c2p = Math.sqrt(a2p * a2p + lab2.b * lab2.b);
  const avgCp = (c1p + c2p) / 2;

  let h1p = Math.atan2(lab1.b, a1p);
  if (h1p < 0) h1p += deg360;
  let h2p = Math.atan2(lab2.b, a2p);
  if (h2p < 0) h2p += deg360;

  const avghp = Math.abs(h1p - h2p) > deg180 ? (h1p + h2p + deg360) / 2 : (h1p + h2p) / 2;
  const t = 1 - 0.17 * Math.cos(avghp - Math.PI / 6) + 0.24 * Math.cos(2 * avghp) + 0.32 * Math.cos(3 * avghp + Math.PI / 30) - 0.2 * Math.cos(4 * avghp - 63 * Math.PI / 180);

  let deltahp = h2p - h1p;
  if (Math.abs(deltahp) > deg180) {
    deltahp = deltahp > 0 ? deltahp - deg360 : deltahp + deg360;
  }

  const deltaL = lab2.L - lab1.L;
  const deltaCp = c2p - c1p;
  const deltaHp = 2 * Math.sqrt(c1p * c2p) * Math.sin(deltahp / 2);

  const sL = 1 + (0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2));
  const sC = 1 + 0.045 * avgCp;
  const sH = 1 + 0.015 * avgCp * t;

  const deltaTheta = 30 * Math.PI / 180 * Math.exp(-Math.pow((avghp - 275 * Math.PI / 180) / (25 * Math.PI / 180), 2));
  const rC = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
  const rT = -rC * Math.sin(2 * deltaTheta);

  return Math.sqrt(
    Math.pow(deltaL / (kL * sL), 2) +
    Math.pow(deltaCp / (kC * sC), 2) +
    Math.pow(deltaHp / (kH * sH), 2) +
    rT * (deltaCp / (kC * sC)) * (deltaHp / (kH * sH))
  );
}

// Pre-compute Lab values for all 21 TPV colours (once at module load)
const TPV_LAB_CACHE = tpvColours.map(c => ({
  ...c,
  lab: rgbToLab(c.R, c.G, c.B)
}));

/**
 * Find closest TPV color to given RGB using perceptual deltaE2000
 */
function findClosestTpvColor(r, g, b) {
  const lab = rgbToLab(r, g, b);
  let closest = null;
  let minDelta = Infinity;

  for (const tpv of TPV_LAB_CACHE) {
    const delta = deltaE2000(lab, tpv.lab);
    if (delta < minDelta) {
      minDelta = delta;
      closest = tpv;
    }
  }

  return closest;
}

/**
 * Build ImagetracerJS palette from TPV colours + transparent white.
 * This locks the tracer to our exact palette so it doesn't re-quantize.
 */
function buildTracerPalette() {
  const pal = tpvColours.map(c => ({ r: c.R, g: c.G, b: c.B, a: 255 }));
  // Add transparent white for background/transparent regions
  pal.push({ r: 255, g: 255, b: 255, a: 0 });
  return pal;
}

/**
 * Quantize image data to TPV palette + transparency
 *
 * @param {ImageData} imageData - Source image data
 * @param {number} transparencyThreshold - Alpha below this is transparent (0-255)
 * @returns {ImageData} Quantized image data
 */
function quantizeToPalette(imageData, transparencyThreshold = 128) {
  const data = imageData.data;
  const quantized = new Uint8ClampedArray(data.length);

  // Build a color cache for performance (deltaE2000 is expensive per-pixel)
  const colorCache = new Map();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Handle transparency
    if (a < transparencyThreshold) {
      // Make fully transparent (white with 0 alpha)
      quantized[i] = 255;
      quantized[i + 1] = 255;
      quantized[i + 2] = 255;
      quantized[i + 3] = 0;
      continue;
    }

    // Check cache for this color
    const cacheKey = (r << 16) | (g << 8) | b;
    let closestColor = colorCache.get(cacheKey);

    if (!closestColor) {
      closestColor = findClosestTpvColor(r, g, b);
      colorCache.set(cacheKey, closestColor);
    }

    // Apply quantized color
    quantized[i] = closestColor.R;
    quantized[i + 1] = closestColor.G;
    quantized[i + 2] = closestColor.B;
    quantized[i + 3] = 255; // Fully opaque
  }

  console.log(`[FLATTEN] Quantized ${colorCache.size} unique colors to TPV palette (deltaE2000)`);

  return new ImageData(quantized, imageData.width, imageData.height);
}

/**
 * Render SVG to canvas
 *
 * @param {string} svgString - SVG content
 * @param {number} maxSize - Maximum dimension (longest side)
 * @returns {Promise<{canvas: HTMLCanvasElement, width: number, height: number}>}
 */
async function renderSvgToCanvas(svgString, maxSize = DEFAULT_RESOLUTION) {
  return new Promise((resolve, reject) => {
    // Parse SVG to get dimensions
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.documentElement;

    // Get viewBox or width/height
    let width, height;
    const viewBox = svgElement.getAttribute('viewBox');

    if (viewBox) {
      const parts = viewBox.split(/\s+/).map(Number);
      width = parts[2];
      height = parts[3];
    } else {
      width = parseFloat(svgElement.getAttribute('width')) || 1000;
      height = parseFloat(svgElement.getAttribute('height')) || 1000;
    }

    // Calculate scale to fit maxSize
    const scale = maxSize / Math.max(width, height);
    const canvasWidth = Math.round(width * scale);
    const canvasHeight = Math.round(height * scale);

    console.log(`[FLATTEN] Rendering SVG ${width}x${height} to canvas ${canvasWidth}x${canvasHeight}`);

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    // Fill with white background (for transparency handling)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Create image from SVG
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      URL.revokeObjectURL(url);
      resolve({
        canvas,
        width: canvasWidth,
        height: canvasHeight,
        originalWidth: width,   // Original SVG dimensions for viewBox
        originalHeight: height
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG for rasterization'));
    };

    img.src = url;
  });
}

/**
 * Parse SVG path d attribute and extract coordinate points.
 * Handles M, L, H, V, C, S, Q, T, A, Z commands (absolute and relative).
 *
 * @param {string} d - SVG path d attribute
 * @returns {{points: Array<{x: number, y: number}>}} Extracted points
 */
function parsePathPoints(d) {
  const points = [];
  let curX = 0, curY = 0;
  let startX = 0, startY = 0;

  // Tokenize: split into commands and their numeric arguments
  const tokens = d.match(/[a-zA-Z][^a-zA-Z]*/g);
  if (!tokens) return { points };

  for (const token of tokens) {
    const cmd = token[0];
    const nums = token.slice(1).trim().match(/-?\d+\.?\d*/g);
    const args = nums ? nums.map(Number) : [];

    switch (cmd) {
      case 'M':
        for (let i = 0; i < args.length; i += 2) {
          curX = args[i]; curY = args[i + 1];
          points.push({ x: curX, y: curY });
        }
        startX = points.length > 0 ? points[points.length - args.length / 2].x : curX;
        startY = points.length > 0 ? points[points.length - args.length / 2].y : curY;
        break;
      case 'm':
        for (let i = 0; i < args.length; i += 2) {
          curX += args[i]; curY += args[i + 1];
          points.push({ x: curX, y: curY });
        }
        startX = points.length > 0 ? points[points.length - args.length / 2].x : curX;
        startY = points.length > 0 ? points[points.length - args.length / 2].y : curY;
        break;
      case 'L':
        for (let i = 0; i < args.length; i += 2) {
          curX = args[i]; curY = args[i + 1];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'l':
        for (let i = 0; i < args.length; i += 2) {
          curX += args[i]; curY += args[i + 1];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'H':
        for (const a of args) { curX = a; points.push({ x: curX, y: curY }); }
        break;
      case 'h':
        for (const a of args) { curX += a; points.push({ x: curX, y: curY }); }
        break;
      case 'V':
        for (const a of args) { curY = a; points.push({ x: curX, y: curY }); }
        break;
      case 'v':
        for (const a of args) { curY += a; points.push({ x: curX, y: curY }); }
        break;
      case 'C':
        for (let i = 0; i < args.length; i += 6) {
          // Control points + endpoint
          points.push({ x: args[i], y: args[i + 1] });
          points.push({ x: args[i + 2], y: args[i + 3] });
          curX = args[i + 4]; curY = args[i + 5];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'c':
        for (let i = 0; i < args.length; i += 6) {
          points.push({ x: curX + args[i], y: curY + args[i + 1] });
          points.push({ x: curX + args[i + 2], y: curY + args[i + 3] });
          curX += args[i + 4]; curY += args[i + 5];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'S': case 's':
        for (let i = 0; i < args.length; i += 4) {
          if (cmd === 'S') {
            points.push({ x: args[i], y: args[i + 1] });
            curX = args[i + 2]; curY = args[i + 3];
          } else {
            points.push({ x: curX + args[i], y: curY + args[i + 1] });
            curX += args[i + 2]; curY += args[i + 3];
          }
          points.push({ x: curX, y: curY });
        }
        break;
      case 'Q':
        for (let i = 0; i < args.length; i += 4) {
          points.push({ x: args[i], y: args[i + 1] });
          curX = args[i + 2]; curY = args[i + 3];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'q':
        for (let i = 0; i < args.length; i += 4) {
          points.push({ x: curX + args[i], y: curY + args[i + 1] });
          curX += args[i + 2]; curY += args[i + 3];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'T':
        for (let i = 0; i < args.length; i += 2) {
          curX = args[i]; curY = args[i + 1];
          points.push({ x: curX, y: curY });
        }
        break;
      case 't':
        for (let i = 0; i < args.length; i += 2) {
          curX += args[i]; curY += args[i + 1];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'A':
        for (let i = 0; i < args.length; i += 7) {
          curX = args[i + 5]; curY = args[i + 6];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'a':
        for (let i = 0; i < args.length; i += 7) {
          curX += args[i + 5]; curY += args[i + 6];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'Z': case 'z':
        curX = startX; curY = startY;
        break;
    }
  }

  return { points };
}

/**
 * Remove small paths from SVG (speckle cleanup)
 *
 * @param {string} svgString - SVG content
 * @param {number} minArea - Minimum path area to keep
 * @returns {string} Cleaned SVG
 */
function removeSmallPaths(svgString, minArea = MIN_SHAPE_AREA) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svg = doc.documentElement;

  const paths = svg.querySelectorAll('path');
  let removedCount = 0;

  paths.forEach(path => {
    try {
      const d = path.getAttribute('d');
      if (!d) return;

      const { points } = parsePathPoints(d);
      if (points.length < 2) {
        path.remove();
        removedCount++;
        return;
      }

      // Calculate bounding box from parsed points
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;

      for (const pt of points) {
        if (pt.x < minX) minX = pt.x;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.y < minY) minY = pt.y;
        if (pt.y > maxY) maxY = pt.y;
      }

      const area = (maxX - minX) * (maxY - minY);

      if (area < minArea) {
        path.remove();
        removedCount++;
      }
    } catch (e) {
      // Keep path if we can't analyze it
    }
  });

  if (removedCount > 0) {
    console.log(`[FLATTEN] Removed ${removedCount} small paths (speckle cleanup)`);
  }

  return new XMLSerializer().serializeToString(doc);
}

/**
 * Add proper SVG structure and viewBox
 *
 * @param {string} svgString - Raw traced SVG
 * @param {number} canvasWidth - Canvas width (traced paths are at this scale)
 * @param {number} canvasHeight - Canvas height (traced paths are at this scale)
 * @param {number} originalWidth - Original SVG viewBox width
 * @param {number} originalHeight - Original SVG viewBox height
 * @returns {string} Properly structured SVG
 */
function structureSvg(svgString, canvasWidth, canvasHeight, originalWidth, originalHeight) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svg = doc.documentElement;

  // ImagetracerJS outputs paths at canvas scale (e.g. 4096x4096).
  // We need the viewBox to match the ORIGINAL SVG dimensions so the
  // preview zoom/fit calculation stays consistent with the pre-flatten view.
  // Wrap all traced content in a scale transform to map canvas coords → original coords.

  const tracedWidth = parseFloat(svg.getAttribute('width')) || canvasWidth;
  const tracedHeight = parseFloat(svg.getAttribute('height')) || canvasHeight;

  console.log(`[FLATTEN] structureSvg - canvas: ${canvasWidth}x${canvasHeight}, traced: ${tracedWidth}x${tracedHeight}, original: ${originalWidth}x${originalHeight}`);

  // Calculate scale to map traced paths back to original coordinate space
  const scaleX = originalWidth / tracedWidth;
  const scaleY = originalHeight / tracedHeight;

  // Wrap all existing children in a scale group if dimensions differ
  if (Math.abs(scaleX - 1) > 0.001 || Math.abs(scaleY - 1) > 0.001) {
    const g = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `scale(${scaleX}, ${scaleY})`);

    // Move all children into the group
    while (svg.firstChild) {
      g.appendChild(svg.firstChild);
    }
    svg.appendChild(g);
  }

  // Set viewBox to original dimensions so zoom/fit matches pre-flatten
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('viewBox', `0 0 ${originalWidth} ${originalHeight}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('data-flattened', 'true');
  svg.setAttribute('data-flatten-date', new Date().toISOString());

  console.log(`[FLATTEN] Final viewBox: 0 0 ${originalWidth} ${originalHeight}`);

  return new XMLSerializer().serializeToString(doc);
}

/**
 * Flatten SVG to clean vector
 *
 * Main entry point for the flatten functionality.
 *
 * @param {string} svgString - Source SVG content
 * @param {Object} options - Configuration options
 * @param {number} options.resolution - Max dimension in pixels (default: 4096)
 * @param {boolean} options.quantize - Apply TPV palette quantization (default: true)
 * @param {Function} options.onProgress - Progress callback (0-100)
 * @returns {Promise<{svg: string, stats: Object}>}
 */
export async function flattenSvg(svgString, options = {}) {
  const {
    resolution = DEFAULT_RESOLUTION,
    quantize = true,
    onProgress = () => {}
  } = options;

  const startTime = Date.now();
  const stats = {
    resolution,
    quantized: quantize,
    originalSize: svgString.length,
    finalSize: 0,
    processingTime: 0
  };

  try {
    // Yield to event loop so React can render progress updates between heavy sync steps
    const yieldToUI = () => new Promise(resolve => setTimeout(resolve, 0));

    onProgress(5);
    console.log(`[FLATTEN] Starting flatten (resolution: ${resolution})`);

    // Step 1: Render SVG to canvas
    onProgress(10);
    await yieldToUI();
    const { canvas, width, height, originalWidth, originalHeight } = await renderSvgToCanvas(svgString, resolution);
    const ctx = canvas.getContext('2d');

    // Step 2: Get image data
    onProgress(20);
    await yieldToUI();
    let imageData = ctx.getImageData(0, 0, width, height);

    // Step 3: Quantize to TPV palette (optional)
    if (quantize) {
      onProgress(30);
      await yieldToUI();
      imageData = quantizeToPalette(imageData);
      // Put quantized data back on canvas
      ctx.putImageData(imageData, 0, 0);
    }

    // Step 4: Trace with ImagetracerJS using locked TPV palette
    onProgress(50);
    await yieldToUI();
    const preset = {
      ...TRACE_PRESET,
      pal: buildTracerPalette()  // Lock tracer to our TPV palette — prevents re-quantization
    };

    // ImagetracerJS works with ImageData
    const tracedSvg = ImageTracer.imagedataToSVG(imageData, preset);

    // Step 5: Clean up small paths
    onProgress(80);
    await yieldToUI();
    let cleanedSvg = removeSmallPaths(tracedSvg);

    // Step 6: Add proper structure (restore original viewBox, scale traced paths to match)
    onProgress(90);
    await yieldToUI();
    cleanedSvg = structureSvg(cleanedSvg, width, height, originalWidth, originalHeight);

    // Done
    onProgress(100);
    stats.finalSize = cleanedSvg.length;
    stats.processingTime = Date.now() - startTime;

    console.log(`[FLATTEN] Complete in ${stats.processingTime}ms`);
    console.log(`[FLATTEN] Size: ${stats.originalSize} to ${stats.finalSize} bytes`);

    return { svg: cleanedSvg, stats };
  } catch (error) {
    console.error('[FLATTEN] Error:', error);
    throw error;
  }
}

/**
 * Check if SVG has already been flattened
 *
 * @param {string} svgString - SVG content
 * @returns {boolean} True if SVG has flatten marker
 */
export function isFlattened(svgString) {
  return svgString.includes('data-flattened="true"');
}

/**
 * Get TPV palette as array of RGB values
 * Useful for custom quantization
 *
 * @returns {Array<{r: number, g: number, b: number, hex: string, name: string}>}
 */
export function getTpvPalette() {
  return tpvColours.map(c => ({
    r: c.R,
    g: c.G,
    b: c.B,
    hex: c.hex,
    name: c.name,
    code: c.code
  }));
}

/**
 * Extract colors from SVG and build solid recipes
 * Used after flattening to rebuild the color legend with TPV names
 *
 * @param {string} svgString - SVG content (should be flattened with TPV colors)
 * @returns {{recipes: Array, colorMapping: Map}} Recipes and color mapping
 */
export function buildRecipesFromFlattenedSvg(svgString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svg = doc.documentElement;

  // Collect all fill colors from paths
  const colorCounts = new Map();
  const paths = svg.querySelectorAll('path, rect, circle, ellipse, polygon');

  paths.forEach(path => {
    let fill = path.getAttribute('fill');
    if (!fill) {
      const style = path.getAttribute('style');
      if (style) {
        const match = style.match(/fill:\s*([^;]+)/);
        if (match) fill = match[1].trim();
      }
    }

    if (fill && fill !== 'none' && fill !== 'transparent') {
      // Normalize hex format
      fill = fill.toLowerCase();
      if (fill.startsWith('rgb')) {
        // Convert rgb to hex
        const match = fill.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
          fill = '#' + [match[1], match[2], match[3]]
            .map(x => parseInt(x).toString(16).padStart(2, '0'))
            .join('');
        }
      }

      const count = colorCounts.get(fill) || 0;
      colorCounts.set(fill, count + 1);
    }
  });

  // Calculate total for percentages
  const total = Array.from(colorCounts.values()).reduce((a, b) => a + b, 0);

  // Build recipes by matching to TPV palette
  const recipes = [];
  const colorMapping = new Map();

  colorCounts.forEach((count, hex) => {
    // Find closest TPV color
    const tpvColor = findClosestTpvColorByHex(hex);
    const areaPct = total > 0 ? Math.round((count / total) * 100) : 0;

    if (tpvColor) {
      recipes.push({
        targetColor: {
          hex: hex,
          areaPct: areaPct
        },
        originalColor: {
          hex: hex
        },
        blendColor: {
          hex: tpvColor.hex
        },
        chosenRecipe: {
          components: [{
            code: tpvColor.code,
            name: tpvColor.name,
            hex: tpvColor.hex,
            pct: 100
          }],
          hex: tpvColor.hex
        },
        // Include TPV info for display
        tpvCode: tpvColor.code,
        tpvName: tpvColor.name
      });

      // Color mapping must have blendHex property for recolorSVG
      colorMapping.set(hex, { blendHex: tpvColor.hex });
    }
  });

  // Sort by area percentage (descending)
  recipes.sort((a, b) => b.targetColor.areaPct - a.targetColor.areaPct);

  console.log(`[FLATTEN] Built ${recipes.length} recipes from flattened SVG`);

  return { recipes, colorMapping };
}

/**
 * Find closest TPV color by hex value (uses perceptual deltaE2000)
 */
function findClosestTpvColorByHex(hex) {
  // Parse hex
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return findClosestTpvColor(r, g, b);
}

export default flattenSvg;
