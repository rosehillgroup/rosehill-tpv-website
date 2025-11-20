// TPV Studio - Mixer Utilities
// Extracted from mixer.html for use in blend mode color editing

/**
 * TPV Color Palette (21 colors)
 * Data from rosehill_tpv_21_colours.json
 */
export const PALETTE = [
  {
    "code": "RH01",
    "name": "Standard Red",
    "hex": "#B71E2D",
    "R": 183,
    "G": 30,
    "B": 45,
    "L": 39.4,
    "a": 58.5,
    "b": 29.0
  },
  {
    "code": "RH02",
    "name": "Bright Red",
    "hex": "#E31D25",
    "R": 227,
    "G": 29,
    "B": 37,
    "L": 47.4,
    "a": 70.1,
    "b": 44.0
  },
  {
    "code": "RH10",
    "name": "Standard Green",
    "hex": "#006B3F",
    "R": 0,
    "G": 107,
    "B": 63,
    "L": 40.5,
    "a": -42.2,
    "b": 17.9
  },
  {
    "code": "RH11",
    "name": "Bright Green",
    "hex": "#4BAA34",
    "R": 75,
    "G": 170,
    "B": 52,
    "L": 62.1,
    "a": -47.7,
    "b": 47.2
  },
  {
    "code": "RH12",
    "name": "Dark Green",
    "hex": "#006747",
    "R": 0,
    "G": 103,
    "B": 71,
    "L": 39.6,
    "a": -38.3,
    "b": 13.1
  },
  {
    "code": "RH20",
    "name": "Standard Blue",
    "hex": "#1B4F9C",
    "R": 27,
    "G": 79,
    "B": 156,
    "L": 36.4,
    "a": 14.2,
    "b": -46.7
  },
  {
    "code": "RH21",
    "name": "Purple",
    "hex": "#662D91",
    "R": 102,
    "G": 45,
    "B": 145,
    "L": 31.5,
    "a": 41.9,
    "b": -40.9
  },
  {
    "code": "RH22",
    "name": "Light Blue",
    "hex": "#0091D7",
    "R": 0,
    "G": 145,
    "B": 215,
    "L": 55.3,
    "a": -19.1,
    "b": -37.3
  },
  {
    "code": "RH23",
    "name": "Azure",
    "hex": "#0076B6",
    "R": 0,
    "G": 118,
    "B": 182,
    "L": 47.7,
    "a": -4.8,
    "b": -34.8
  },
  {
    "code": "RH26",
    "name": "Turquoise",
    "hex": "#00A499",
    "R": 0,
    "G": 164,
    "B": 153,
    "L": 58.8,
    "a": -38.4,
    "b": -3.0
  },
  {
    "code": "RH30",
    "name": "Standard Beige",
    "hex": "#D4B585",
    "R": 212,
    "G": 181,
    "B": 133,
    "L": 75.2,
    "a": 3.8,
    "b": 24.8
  },
  {
    "code": "RH31",
    "name": "Cream",
    "hex": "#F2E6C8",
    "R": 242,
    "G": 230,
    "B": 200,
    "L": 91.8,
    "a": -0.5,
    "b": 12.5
  },
  {
    "code": "RH32",
    "name": "Brown",
    "hex": "#754C29",
    "R": 117,
    "G": 76,
    "B": 41,
    "L": 40.0,
    "a": 15.9,
    "b": 27.1
  },
  {
    "code": "RH90",
    "name": "Funky Pink",
    "hex": "#e8457e",
    "R": 232,
    "G": 69,
    "B": 126,
    "L": 55.0,
    "a": 66.1,
    "b": 4.9
  },
  {
    "code": "RH40",
    "name": "Mustard Yellow",
    "hex": "#C6972D",
    "R": 198,
    "G": 151,
    "B": 45,
    "L": 66.0,
    "a": 8.4,
    "b": 56.3
  },
  {
    "code": "RH41",
    "name": "Bright Yellow",
    "hex": "#FFD100",
    "R": 255,
    "G": 209,
    "B": 0,
    "L": 86.9,
    "a": -1.0,
    "b": 90.6
  },
  {
    "code": "RH50",
    "name": "Orange",
    "hex": "#F47920",
    "R": 244,
    "G": 121,
    "B": 32,
    "L": 63.2,
    "a": 49.8,
    "b": 60.2
  },
  {
    "code": "RH60",
    "name": "Dark Grey",
    "hex": "#4D4F53",
    "R": 77,
    "G": 79,
    "B": 83,
    "L": 34.1,
    "a": -0.4,
    "b": -2.4
  },
  {
    "code": "RH61",
    "name": "Light Grey",
    "hex": "#A7A8AA",
    "R": 167,
    "G": 168,
    "B": 170,
    "L": 69.0,
    "a": -0.5,
    "b": -1.0
  },
  {
    "code": "RH65",
    "name": "Pale Grey",
    "hex": "#DCDDDE",
    "R": 220,
    "G": 221,
    "B": 222,
    "L": 87.6,
    "a": -0.2,
    "b": -0.7
  },
  {
    "code": "RH70",
    "name": "Black",
    "hex": "#101820",
    "R": 16,
    "G": 24,
    "B": 32,
    "L": 9.1,
    "a": -0.3,
    "b": -6.3
  }
];

/**
 * Create a lookup map for quick color index by code
 */
export const COLOR_CODE_TO_INDEX = new Map(
  PALETTE.map((color, index) => [color.code, index])
);

/**
 * Simple seedable PRNG (Mulberry32 algorithm)
 * Used for deterministic granule generation
 *
 * @param {number} seed - Seed value for random generation
 * @returns {Function} Random number generator function (0-1)
 */
export function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Poisson disk sampling algorithm
 * Generates evenly distributed points for Voronoi granule visualization
 *
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} minDistance - Minimum distance between points
 * @param {number} maxTries - Maximum attempts per point (default: 30)
 * @param {Function} rng - Random number generator (default: Math.random)
 * @returns {Array<[number, number]>} Array of [x, y] point coordinates
 */
export function poissonDiskSampling(width, height, minDistance, maxTries = 30, rng = Math.random) {
  const cellSize = minDistance / Math.sqrt(2);
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);
  const grid = new Array(gridWidth * gridHeight).fill(-1);
  const points = [];
  const activeList = [];

  function addPoint(x, y) {
    const point = [x, y];
    points.push(point);
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    grid[gridY * gridWidth + gridX] = points.length - 1;
    activeList.push(points.length - 1);
    return point;
  }

  function inNeighbourhood(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);

    for (let i = Math.max(0, gridX - 2); i <= Math.min(gridWidth - 1, gridX + 2); i++) {
      for (let j = Math.max(0, gridY - 2); j <= Math.min(gridHeight - 1, gridY + 2); j++) {
        const idx = grid[j * gridWidth + i];
        if (idx !== -1) {
          const dx = x - points[idx][0];
          const dy = y - points[idx][1];
          if (dx * dx + dy * dy < minDistance * minDistance) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // Add first point
  addPoint(width * rng(), height * rng());

  while (activeList.length > 0) {
    const randomIndex = Math.floor(rng() * activeList.length);
    const pointIndex = activeList[randomIndex];
    const point = points[pointIndex];
    let found = false;

    for (let tries = 0; tries < maxTries; tries++) {
      const angle = 2 * Math.PI * rng();
      const radius = minDistance + minDistance * rng();
      const x = point[0] + radius * Math.cos(angle);
      const y = point[1] + radius * Math.sin(angle);

      if (x >= 0 && x < width && y >= 0 && y < height && !inNeighbourhood(x, y)) {
        addPoint(x, y);
        found = true;
        break;
      }
    }

    if (!found) {
      activeList.splice(randomIndex, 1);
    }
  }

  return points;
}

/**
 * Calculate blended color from parts using RGB weighted averaging
 *
 * @param {Map<number, number>} parts - Map of colorIndex -> partCount
 * @returns {string} Hex color string (e.g., '#FF5533')
 */
export function calculateBlendedColor(parts) {
  // Calculate total parts
  let totalParts = 0;
  parts.forEach(count => totalParts += count);

  if (totalParts === 0) return '#FFFFFF';

  let totalR = 0, totalG = 0, totalB = 0;

  parts.forEach((count, colorIndex) => {
    const color = PALETTE[colorIndex];
    const weight = count / totalParts;

    // Use RGB values from palette
    totalR += color.R * weight;
    totalG += color.G * weight;
    totalB += color.B * weight;
  });

  // Convert back to hex
  const toHex = (n) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return '#' + toHex(totalR) + toHex(totalG) + toHex(totalB);
}

/**
 * Calculate RGB values from hex string
 *
 * @param {string} hex - Hex color string (e.g., '#FF5533')
 * @returns {{r: number, g: number, b: number}} RGB object
 */
export function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

/**
 * Get contrast color (black or white) for text on colored background
 *
 * @param {string} hex - Background hex color
 * @returns {string} '#000000' or '#FFFFFF'
 */
export function getContrastColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

/**
 * Convert parts Map to recipe format used by Studio
 *
 * @param {Map<number, number>} parts - Map of colorIndex -> partCount
 * @returns {Object} Recipe object with parts, components, total
 */
export function partsToRecipe(parts) {
  let totalParts = 0;
  const partsObj = {};
  const components = [];

  parts.forEach((count, colorIndex) => {
    const color = PALETTE[colorIndex];
    totalParts += count;
    partsObj[color.code] = count;
    components.push({
      code: color.code,
      name: color.name,
      weight: 0, // Will be calculated below
      parts: count
    });
  });

  // Calculate weights
  components.forEach(comp => {
    comp.weight = comp.parts / totalParts;
  });

  return {
    parts: partsObj,
    components,
    total: totalParts
  };
}

/**
 * Convert recipe format to parts Map
 *
 * @param {Object} recipe - Recipe object with parts field
 * @returns {Map<number, number>} Map of colorIndex -> partCount
 */
export function recipeToParts(recipe) {
  const parts = new Map();

  if (!recipe || !recipe.parts) return parts;

  // recipe.parts is an object like { 'RH30': 3, 'RH50': 2 }
  Object.entries(recipe.parts).forEach(([code, count]) => {
    const colorIndex = COLOR_CODE_TO_INDEX.get(code);
    if (colorIndex !== undefined) {
      parts.set(colorIndex, count);
    }
  });

  return parts;
}

/**
 * Generate deterministic granule points for Voronoi visualization
 *
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} count - Number of granules (e.g., 10000)
 * @param {number} seed - Seed for deterministic generation
 * @returns {Array<[number, number]>} Array of [x, y] coordinates
 */
export function generateGranulePoints(width, height, count, seed = 12345) {
  const rng = mulberry32(seed);

  // Calculate minimum distance for approximately 'count' points
  const area = width * height;
  const minDistance = Math.sqrt(area / count) * 0.8;

  return poissonDiskSampling(width, height, minDistance, 30, rng);
}
