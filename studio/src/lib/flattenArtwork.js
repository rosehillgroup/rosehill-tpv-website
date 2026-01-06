/**
 * Flatten Artwork Utility
 * Phase 3: Escape hatch for complex AI-generated SVGs
 *
 * Workflow:
 * 1. Rasterize SVG to canvas at high resolution
 * 2. Quantize colors to TPV palette + transparency
 * 3. Trace back to vector using ImagetracerJS
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
 * Quality presets for ImagetracerJS
 */
const QUALITY_PRESETS = {
  fast: {
    // Faster, slightly rougher edges
    colorsampling: 2,      // 2 = random sampling
    numberofcolors: 24,    // Number of colors to use
    mincolorratio: 0,      // Minimum color ratio
    colorquantcycles: 1,   // Color quantization cycles (fewer = faster)
    ltres: 1,              // Line threshold
    qtres: 1,              // Quadratic spline threshold
    pathomit: 8,           // Omit paths shorter than this
    rightangleenhance: true,
    blurradius: 0,         // No blur
    blurdelta: 20,
    strokewidth: 1,
    linefilter: false,
    scale: 1,
    roundcoords: 1,        // Round coordinates to integers
    viewbox: false,
    desc: false,
    lcpr: 0,
    qcpr: 0
  },
  clean: {
    // Cleaner, smoother output (slower)
    colorsampling: 1,      // 1 = deterministic
    numberofcolors: 32,    // More colors for better fidelity
    mincolorratio: 0,
    colorquantcycles: 3,   // More cycles for better color matching
    ltres: 0.5,            // Tighter line threshold
    qtres: 0.5,            // Tighter curve threshold
    pathomit: 4,           // Keep smaller paths
    rightangleenhance: true,
    blurradius: 1,         // Slight blur for smoother edges
    blurdelta: 20,
    strokewidth: 1,
    linefilter: false,
    scale: 1,
    roundcoords: 2,        // More precision
    viewbox: false,
    desc: false,
    lcpr: 0,
    qcpr: 0
  }
};

/**
 * Calculate color distance (Euclidean in RGB space)
 */
function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
}

/**
 * Find closest TPV color to given RGB
 */
function findClosestTpvColor(r, g, b) {
  let closest = null;
  let minDistance = Infinity;

  for (const color of tpvColours) {
    const distance = colorDistance(r, g, b, color.R, color.G, color.B);
    if (distance < minDistance) {
      minDistance = distance;
      closest = color;
    }
  }

  return closest;
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

  // Build a color cache for performance
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
    const cacheKey = `${r},${g},${b}`;
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

  console.log(`[FLATTEN] Quantized to ${colorCache.size} unique colors mapped to TPV palette`);

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
    // Try to estimate path area from bounding box
    // This is a rough heuristic - actual area calculation would require path parsing
    try {
      // For ImagetracerJS output, paths have simple d attributes
      // We can estimate size from the coordinate ranges
      const d = path.getAttribute('d');
      if (!d) return;

      // Extract all numbers from path
      const numbers = d.match(/-?\d+\.?\d*/g);
      if (!numbers || numbers.length < 4) {
        // Very short path - likely speckle
        path.remove();
        removedCount++;
        return;
      }

      // Estimate bounding box
      const coords = numbers.map(Number);
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;

      // Assume alternating x,y coordinates (simplified)
      for (let i = 0; i < coords.length - 1; i += 2) {
        const x = coords[i];
        const y = coords[i + 1];
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }

      const bboxWidth = maxX - minX;
      const bboxHeight = maxY - minY;
      const area = bboxWidth * bboxHeight;

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
 * @param {number} width - Original width
 * @param {number} height - Original height
 * @returns {string} Properly structured SVG
 */
function structureSvg(svgString, width, height) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svg = doc.documentElement;

  // Set proper attributes
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('data-flattened', 'true');
  svg.setAttribute('data-flatten-date', new Date().toISOString());

  return new XMLSerializer().serializeToString(doc);
}

/**
 * Flatten SVG to clean vector
 *
 * Main entry point for the flatten functionality.
 *
 * @param {string} svgString - Source SVG content
 * @param {Object} options - Configuration options
 * @param {string} options.quality - 'fast' or 'clean' (default: 'fast')
 * @param {number} options.resolution - Max dimension in pixels (default: 4096)
 * @param {boolean} options.quantize - Apply TPV palette quantization (default: true)
 * @param {Function} options.onProgress - Progress callback (0-100)
 * @returns {Promise<{svg: string, stats: Object}>}
 */
export async function flattenSvg(svgString, options = {}) {
  const {
    quality = 'fast',
    resolution = DEFAULT_RESOLUTION,
    quantize = true,
    onProgress = () => {}
  } = options;

  const startTime = Date.now();
  const stats = {
    quality,
    resolution,
    quantized: quantize,
    originalSize: svgString.length,
    finalSize: 0,
    processingTime: 0
  };

  try {
    onProgress(5);
    console.log(`[FLATTEN] Starting flatten (quality: ${quality}, resolution: ${resolution})`);

    // Step 1: Render SVG to canvas
    onProgress(10);
    const { canvas, width, height, originalWidth, originalHeight } = await renderSvgToCanvas(svgString, resolution);
    const ctx = canvas.getContext('2d');

    // Step 2: Get image data
    onProgress(20);
    let imageData = ctx.getImageData(0, 0, width, height);

    // Step 3: Quantize to TPV palette (optional)
    if (quantize) {
      onProgress(30);
      imageData = quantizeToPalette(imageData);
      // Put quantized data back on canvas
      ctx.putImageData(imageData, 0, 0);
    }

    // Step 4: Trace with ImagetracerJS
    onProgress(50);
    const preset = QUALITY_PRESETS[quality] || QUALITY_PRESETS.fast;

    // ImagetracerJS works with ImageData
    const tracedSvg = ImageTracer.imagedataToSVG(imageData, preset);

    // Step 5: Clean up small paths
    onProgress(80);
    let cleanedSvg = removeSmallPaths(tracedSvg);

    // Step 6: Add proper structure (use original dimensions for viewBox)
    onProgress(90);
    cleanedSvg = structureSvg(cleanedSvg, originalWidth, originalHeight);

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

export default flattenSvg;
