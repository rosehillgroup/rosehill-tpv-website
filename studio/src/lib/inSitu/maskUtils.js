// TPV Studio - Mask Utilities for In-Situ Preview
// Functions for processing SAM-2 segmentation masks

/**
 * Load a mask image from URL and return as ImageData
 * @param {string} maskUrl - URL of the mask image
 * @returns {Promise<{imageData: ImageData, width: number, height: number}>}
 */
export async function loadMaskAsImageData(maskUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      resolve({
        imageData,
        width: canvas.width,
        height: canvas.height
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load mask image'));
    };

    img.src = maskUrl;
  });
}

/**
 * Convert mask to binary alpha channel (threshold at 0.5)
 * @param {ImageData} imageData - Original mask image data
 * @param {number} threshold - Threshold value (0-255), default 128
 * @returns {Uint8ClampedArray} Binary mask as alpha values (0 or 255)
 */
export function convertMaskToBinary(imageData, threshold = 128) {
  const { data, width, height } = imageData;
  const binaryMask = new Uint8ClampedArray(width * height);

  for (let i = 0; i < width * height; i++) {
    // SAM masks are typically grayscale - check any channel
    // or use alpha channel if it's the mask value
    const pixelIndex = i * 4;
    const value = data[pixelIndex]; // Red channel (grayscale)

    binaryMask[i] = value >= threshold ? 255 : 0;
  }

  return binaryMask;
}

/**
 * Apply gaussian blur to mask edges for feathering effect
 * @param {ImageData} imageData - Mask image data to feather
 * @param {number} radius - Blur radius in pixels (2-4 recommended)
 * @returns {ImageData} Feathered mask
 */
export function featherMask(imageData, radius = 3) {
  const { data, width, height } = imageData;
  const output = new Uint8ClampedArray(data.length);

  // Copy original data
  output.set(data);

  // Simple box blur for edge feathering
  // Apply only to edge pixels for performance
  const kernel = radius * 2 + 1;
  const kernelSize = kernel * kernel;

  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      const centerIndex = (y * width + x) * 4;
      const centerValue = data[centerIndex];

      // Check if this is an edge pixel (has different neighbors)
      let isEdge = false;
      for (let dy = -1; dy <= 1 && !isEdge; dy++) {
        for (let dx = -1; dx <= 1 && !isEdge; dx++) {
          const neighborIndex = ((y + dy) * width + (x + dx)) * 4;
          if (Math.abs(data[neighborIndex] - centerValue) > 10) {
            isEdge = true;
          }
        }
      }

      if (isEdge) {
        // Apply blur to edge pixel
        let sum = 0;
        for (let ky = -radius; ky <= radius; ky++) {
          for (let kx = -radius; kx <= radius; kx++) {
            const sampleIndex = ((y + ky) * width + (x + kx)) * 4;
            sum += data[sampleIndex];
          }
        }

        const avg = Math.round(sum / kernelSize);
        output[centerIndex] = avg;     // R
        output[centerIndex + 1] = avg; // G
        output[centerIndex + 2] = avg; // B
        // Keep alpha at 255
      }
    }
  }

  return new ImageData(output, width, height);
}

/**
 * Calculate bounding box of masked region
 * @param {Uint8ClampedArray|ImageData} mask - Binary mask or ImageData
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {{x: number, y: number, width: number, height: number, area: number}}
 */
export function getMaskBounds(mask, width, height) {
  // Handle both binary mask array and ImageData
  const data = mask instanceof ImageData ? mask.data : mask;
  const stride = mask instanceof ImageData ? 4 : 1;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let area = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const value = stride === 4 ? data[index * 4] : data[index];

      if (value > 128) {
        area++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Handle empty mask
  if (area === 0) {
    return { x: 0, y: 0, width: 0, height: 0, area: 0 };
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    area
  };
}

/**
 * Convert mask to SVG clip path (simplified polygon)
 * Uses marching squares for contour extraction
 * @param {ImageData} imageData - Mask image data
 * @param {number} simplifyThreshold - Douglas-Peucker simplification threshold
 * @returns {string} SVG path data string
 */
export function createClipPath(imageData, simplifyThreshold = 2) {
  const { data, width, height } = imageData;

  // Extract contour using simple edge detection
  const contourPoints = [];

  // Find first edge point
  let startX = -1, startY = -1;
  outer:
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      if (data[index] > 128) {
        // Check if it's an edge (has a non-mask neighbor)
        const hasEdge =
          x === 0 || y === 0 || x === width - 1 || y === height - 1 ||
          data[((y - 1) * width + x) * 4] <= 128 ||
          data[((y + 1) * width + x) * 4] <= 128 ||
          data[(y * width + (x - 1)) * 4] <= 128 ||
          data[(y * width + (x + 1)) * 4] <= 128;

        if (hasEdge) {
          startX = x;
          startY = y;
          break outer;
        }
      }
    }
  }

  if (startX === -1) {
    // No mask found
    return '';
  }

  // Trace contour using simple boundary following
  const visited = new Set();
  let x = startX, y = startY;
  const directions = [
    [1, 0], [1, 1], [0, 1], [-1, 1],
    [-1, 0], [-1, -1], [0, -1], [1, -1]
  ];
  let dir = 0;

  do {
    const key = `${x},${y}`;
    if (!visited.has(key)) {
      contourPoints.push([x, y]);
      visited.add(key);
    }

    // Find next edge pixel
    let found = false;
    for (let i = 0; i < 8; i++) {
      const newDir = (dir + i + 5) % 8; // Start from behind
      const [dx, dy] = directions[newDir];
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const index = (ny * width + nx) * 4;
        if (data[index] > 128) {
          x = nx;
          y = ny;
          dir = newDir;
          found = true;
          break;
        }
      }
    }

    if (!found) break;

  } while (x !== startX || y !== startY);

  // Simplify path using Douglas-Peucker algorithm
  const simplified = simplifyPath(contourPoints, simplifyThreshold);

  // Convert to SVG path
  if (simplified.length < 3) return '';

  let pathData = `M ${simplified[0][0]} ${simplified[0][1]}`;
  for (let i = 1; i < simplified.length; i++) {
    pathData += ` L ${simplified[i][0]} ${simplified[i][1]}`;
  }
  pathData += ' Z';

  return pathData;
}

/**
 * Douglas-Peucker path simplification
 * @param {Array<[number, number]>} points - Path points
 * @param {number} epsilon - Simplification threshold
 * @returns {Array<[number, number]>} Simplified points
 */
function simplifyPath(points, epsilon) {
  if (points.length <= 2) return points;

  // Find point with maximum distance from line
  let maxDist = 0;
  let maxIndex = 0;

  const first = points[0];
  const last = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], first, last);
    if (dist > maxDist) {
      maxDist = dist;
      maxIndex = i;
    }
  }

  // If max distance is greater than epsilon, recursively simplify
  if (maxDist > epsilon) {
    const left = simplifyPath(points.slice(0, maxIndex + 1), epsilon);
    const right = simplifyPath(points.slice(maxIndex), epsilon);

    return [...left.slice(0, -1), ...right];
  } else {
    return [first, last];
  }
}

/**
 * Calculate perpendicular distance from point to line
 */
function perpendicularDistance(point, lineStart, lineEnd) {
  const [x, y] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;

  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;

  let param = -1;
  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Create semi-transparent overlay for mask visualization
 * @param {ImageData} maskData - Mask image data
 * @param {string} color - Overlay color in rgba format, e.g., 'rgba(0, 200, 255, 0.3)'
 * @returns {ImageData} Colored overlay
 */
export function createMaskOverlay(maskData, color = 'rgba(0, 200, 255, 0.3)') {
  const { data, width, height } = maskData;
  const overlay = new Uint8ClampedArray(data.length);

  // Parse color
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  const a = parseFloat(match[4] || '1') * 255;

  for (let i = 0; i < width * height; i++) {
    const pixelIndex = i * 4;
    const maskValue = data[pixelIndex];

    if (maskValue > 128) {
      overlay[pixelIndex] = r;
      overlay[pixelIndex + 1] = g;
      overlay[pixelIndex + 2] = b;
      overlay[pixelIndex + 3] = a;
    } else {
      // Transparent for non-masked areas
      overlay[pixelIndex] = 0;
      overlay[pixelIndex + 1] = 0;
      overlay[pixelIndex + 2] = 0;
      overlay[pixelIndex + 3] = 0;
    }
  }

  return new ImageData(overlay, width, height);
}

/**
 * Convert mask to polygon points (for future cutting plans)
 * Returns array of polygon coordinates
 * @param {ImageData} imageData - Mask image data
 * @param {number} simplifyThreshold - Simplification threshold
 * @returns {Array<{x: number, y: number}>} Polygon points
 */
export function maskToPolygon(imageData, simplifyThreshold = 2) {
  const pathData = createClipPath(imageData, simplifyThreshold);
  if (!pathData) return [];

  // Parse SVG path to points
  const points = [];
  const commands = pathData.match(/[ML]\s*[\d.]+\s*[\d.]+/g) || [];

  for (const cmd of commands) {
    const parts = cmd.trim().split(/\s+/);
    if (parts.length >= 3) {
      points.push({
        x: parseFloat(parts[1]),
        y: parseFloat(parts[2])
      });
    }
  }

  return points;
}
