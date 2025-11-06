// Stencil Generator for TPV Studio
// Creates flat geometric compositions for img2img initialization
// Generates installer-friendly structure: large shapes, flat colors, clean edges

import { poissonDisc } from './composition.js';
import { polygonCentroid, expandPolygon } from './geometry.js';
import { SeededRandom } from './random.js';
import Delaunay from 'd3-delaunay';

/**
 * Generate flat composition stencil
 * Creates geometric regions with assigned TPV colors
 * @param {Object} surface - {width_m, height_m}
 * @param {Array} paletteColors - Array of {code, hex, name}
 * @param {Object} options - Generation options
 * @returns {Array} Array of colored regions with points
 */
export function generateFlatStencil(surface, paletteColors, options = {}) {
  const {
    strategy = 'voronoi', // 'voronoi', 'bands', 'grid'
    seed = Date.now(),
    minRegions = 4,
    maxRegions = 12,
    minFeatureSize_m = 1.0 // Minimum region size for installer-friendliness
  } = options;

  console.log(`[STENCIL] Generating ${strategy} composition for ${surface.width_m}×${surface.height_m}m`);
  console.log(`[STENCIL] Using ${paletteColors.length} colors: ${paletteColors.map(c => c.code).join(', ')}`);

  let regions = [];

  switch (strategy) {
    case 'voronoi':
      regions = generateVoronoiStencil(surface, paletteColors, seed, minRegions, maxRegions, minFeatureSize_m);
      break;
    case 'bands':
      regions = generateBandStencil(surface, paletteColors, seed);
      break;
    case 'grid':
      regions = generateGridStencil(surface, paletteColors, seed);
      break;
    default:
      throw new Error(`Unknown stencil strategy: ${strategy}`);
  }

  console.log(`[STENCIL] Generated ${regions.length} regions`);
  return regions;
}

/**
 * Generate Voronoi-based flat composition
 * Uses Poisson disc sampling for evenly-distributed sites
 * @param {Object} surface - Surface dimensions
 * @param {Array} paletteColors - TPV colors
 * @param {number} seed - Random seed
 * @param {number} minRegions - Minimum number of regions
 * @param {number} maxRegions - Maximum number of regions
 * @param {number} minFeatureSize_m - Minimum region size
 * @returns {Array} Colored Voronoi regions
 */
function generateVoronoiStencil(surface, paletteColors, seed, minRegions, maxRegions, minFeatureSize_m) {
  const { width_m, height_m } = surface;
  const rng = new SeededRandom(seed);

  // Calculate target number of sites
  const area_m2 = width_m * height_m;
  const targetRegions = Math.floor(rng.nextFloat(minRegions, maxRegions));

  // Calculate minimum distance between sites for installer-friendly regions
  const avgRegionArea = area_m2 / targetRegions;
  const avgRegionRadius = Math.sqrt(avgRegionArea / Math.PI);
  const minDist = Math.max(minFeatureSize_m, avgRegionRadius * 1.2);

  console.log(`[STENCIL] Voronoi: ${targetRegions} sites, minDist: ${minDist.toFixed(2)}m`);

  // Generate evenly-distributed sites using Poisson disc sampling
  const sites = poissonDisc(width_m, height_m, minDist, seed + 1);

  // If we didn't get enough sites, add more randomly
  while (sites.length < minRegions) {
    sites.push({
      x: rng.nextFloat(0, width_m),
      y: rng.nextFloat(0, height_m)
    });
  }

  // Limit to maxRegions
  const finalSites = sites.slice(0, maxRegions);

  console.log(`[STENCIL] Generated ${finalSites.length} Voronoi sites`);

  // Build Delaunay triangulation (Voronoi dual)
  const points = finalSites.map(s => [s.x, s.y]);
  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, width_m, height_m]);

  // Extract Voronoi cell polygons
  const regions = [];
  for (let i = 0; i < finalSites.length; i++) {
    const cell = voronoi.cellPolygon(i);

    if (!cell) continue;

    // Convert to {x, y} point format
    const cellPoints = cell.map(([x, y]) => ({ x, y }));

    // Assign color from palette (cycle through colors)
    const colorIndex = i % paletteColors.length;
    const color = paletteColors[colorIndex];

    regions.push({
      points: cellPoints,
      color: color.code,
      colorHex: color.hex,
      colorRole: i === 0 ? 'base' : (i < 3 ? 'accent' : 'highlight'),
      centroid: finalSites[i]
    });
  }

  return regions;
}

/**
 * Generate horizontal band composition
 * Simple flowing bands for themes like ocean, sky, etc.
 * @param {Object} surface - Surface dimensions
 * @param {Array} paletteColors - TPV colors
 * @param {number} seed - Random seed
 * @returns {Array} Colored band regions
 */
function generateBandStencil(surface, paletteColors, seed) {
  const { width_m, height_m } = surface;
  const rng = new SeededRandom(seed);

  const numBands = Math.min(paletteColors.length, 5);
  const regions = [];

  console.log(`[STENCIL] Generating ${numBands} horizontal bands`);

  // Generate flowing horizontal bands
  for (let i = 0; i < numBands; i++) {
    const y0 = (i / numBands) * height_m;
    const y1 = ((i + 1) / numBands) * height_m;

    // Add flow variation along x-axis
    const segments = 20;
    const points = [];

    // Top edge (right to left for proper winding)
    for (let j = segments; j >= 0; j--) {
      const x = (j / segments) * width_m;
      const yOffset = rng.nextFloat(-0.1, 0.1) * height_m;
      points.push({ x, y: Math.max(0, Math.min(height_m, y0 + yOffset)) });
    }

    // Bottom edge (left to right)
    for (let j = 0; j <= segments; j++) {
      const x = (j / segments) * width_m;
      const yOffset = rng.nextFloat(-0.1, 0.1) * height_m;
      points.push({ x, y: Math.max(0, Math.min(height_m, y1 + yOffset)) });
    }

    const color = paletteColors[i % paletteColors.length];

    regions.push({
      points,
      color: color.code,
      colorHex: color.hex,
      colorRole: i === 0 ? 'base' : (i < 3 ? 'accent' : 'highlight'),
      centroid: { x: width_m / 2, y: (y0 + y1) / 2 }
    });
  }

  return regions;
}

/**
 * Generate grid-based composition
 * Rectangular blocks for geometric, structured themes
 * @param {Object} surface - Surface dimensions
 * @param {Array} paletteColors - TPV colors
 * @param {number} seed - Random seed
 * @returns {Array} Colored grid regions
 */
function generateGridStencil(surface, paletteColors, seed) {
  const { width_m, height_m } = surface;
  const rng = new SeededRandom(seed);

  // Determine grid size based on surface aspect ratio
  const aspectRatio = width_m / height_m;
  const cols = aspectRatio > 2 ? 4 : 3;
  const rows = Math.ceil(paletteColors.length / cols);

  console.log(`[STENCIL] Generating ${cols}×${rows} grid`);

  const cellWidth = width_m / cols;
  const cellHeight = height_m / rows;

  const regions = [];
  let colorIndex = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (colorIndex >= paletteColors.length) break;

      // Add slight random offset to edges for organic feel
      const x0 = col * cellWidth + rng.nextFloat(-0.05, 0.05) * cellWidth;
      const y0 = row * cellHeight + rng.nextFloat(-0.05, 0.05) * cellHeight;
      const x1 = (col + 1) * cellWidth + rng.nextFloat(-0.05, 0.05) * cellWidth;
      const y1 = (row + 1) * cellHeight + rng.nextFloat(-0.05, 0.05) * cellHeight;

      const points = [
        { x: Math.max(0, x0), y: Math.max(0, y0) },
        { x: Math.min(width_m, x1), y: Math.max(0, y0) },
        { x: Math.min(width_m, x1), y: Math.min(height_m, y1) },
        { x: Math.max(0, x0), y: Math.min(height_m, y1) }
      ];

      const color = paletteColors[colorIndex];

      regions.push({
        points,
        color: color.code,
        colorHex: color.hex,
        colorRole: colorIndex === 0 ? 'base' : (colorIndex < 3 ? 'accent' : 'highlight'),
        centroid: {
          x: (points[0].x + points[2].x) / 2,
          y: (points[0].y + points[2].y) / 2
        }
      });

      colorIndex++;
    }
  }

  return regions;
}

/**
 * Render stencil regions to SVG
 * @param {Array} regions - Colored regions with points
 * @param {Object} surface - Surface dimensions
 * @returns {string} SVG string
 */
export function renderStencilToSVG(regions, surface) {
  const { width_m, height_m } = surface;

  const svg = [];
  svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width_m}" height="${height_m}" viewBox="0 0 ${width_m} ${height_m}">`);

  // Background rect (use first color or white)
  const bgColor = regions[0]?.colorHex || '#FFFFFF';
  svg.push(`<rect width="${width_m}" height="${height_m}" fill="${bgColor}"/>`);

  // Render each region
  for (const region of regions) {
    const pathData = pointsToSVGPath(region.points);
    svg.push(`<path d="${pathData}" fill="${region.colorHex}" stroke="none"/>`);
  }

  svg.push('</svg>');
  return svg.join('\n');
}

/**
 * Convert points array to SVG path data
 * @param {Array} points - Array of {x, y}
 * @returns {string} SVG path data
 */
function pointsToSVGPath(points) {
  if (!points || points.length === 0) return '';

  const parts = [`M ${points[0].x.toFixed(3)} ${points[0].y.toFixed(3)}`];

  for (let i = 1; i < points.length; i++) {
    parts.push(`L ${points[i].x.toFixed(3)} ${points[i].y.toFixed(3)}`);
  }

  parts.push('Z');
  return parts.join(' ');
}

/**
 * Rasterize SVG stencil to PNG buffer
 * @param {string} svg - SVG string
 * @param {number} width - PNG width in pixels
 * @param {number} height - PNG height in pixels
 * @returns {Promise<Buffer>} PNG buffer
 */
export async function rasterizeStencilToPNG(svg, width, height) {
  console.log(`[STENCIL] Rasterizing to ${width}×${height}px PNG`);

  // Import sharp dynamically (only available in serverless environment)
  const sharp = (await import('sharp')).default;

  const pngBuffer = await sharp(Buffer.from(svg))
    .resize(width, height, {
      fit: 'fill',
      kernel: 'nearest' // Sharp edges, no antialiasing
    })
    .png({
      compressionLevel: 9,
      palette: true // Optimize for flat colors
    })
    .toBuffer();

  console.log(`[STENCIL] Rasterized to ${pngBuffer.length} bytes`);
  return pngBuffer;
}
