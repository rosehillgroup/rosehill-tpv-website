// Composition utilities for TPV Studio
// Provides intelligent placement and spatial distribution

import { SeededRandom } from './random.js';
/**
 * Poisson-disc sampling for evenly-spaced point distribution
 * @param {number} width - Surface width
 * @param {number} height - Surface height
 * @param {number} minDist - Minimum distance between points
 * @param {number} seed - Random seed
 * @param {number} maxAttempts - Rejection sampling attempts (default 30)
 * @returns {Array} Array of {x, y} points
 */
export function poissonDisc(width, height, minDist, seed, maxAttempts = 30) {
  const rng = new SeededRandom(seed);
  const cellSize = minDist / Math.sqrt(2);
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);

  const grid = Array(gridWidth * gridHeight).fill(null);
  const active = [];
  const points = [];

  // Helper to get grid index
  const gridIndex = (x, y) => {
    const gx = Math.floor(x / cellSize);
    const gy = Math.floor(y / cellSize);
    if (gx < 0 || gx >= gridWidth || gy < 0 || gy >= gridHeight) return -1;
    return gy * gridWidth + gx;
  };

  // Start with random point
  const start = {
    x: rng.next() * width,
    y: rng.next() * height
  };

  const idx = gridIndex(start.x, start.y);
  grid[idx] = start;
  points.push(start);
  active.push(start);

  // Process active list
  while (active.length > 0) {
    const activeIdx = Math.floor(rng.next() * active.length);
    const point = active[activeIdx];
    let found = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Generate candidate point in annulus
      const angle = rng.next() * 2 * Math.PI;
      const radius = minDist * (1 + rng.next());
      const candidate = {
        x: point.x + radius * Math.cos(angle),
        y: point.y + radius * Math.sin(angle)
      };

      // Check bounds
      if (candidate.x < 0 || candidate.x >= width || candidate.y < 0 || candidate.y >= height) {
        continue;
      }

      // Check distance to existing points
      const candidateIdx = gridIndex(candidate.x, candidate.y);
      if (candidateIdx === -1) continue;

      let valid = true;
      const checkRadius = 2;

      for (let dy = -checkRadius; dy <= checkRadius && valid; dy++) {
        for (let dx = -checkRadius; dx <= checkRadius && valid; dx++) {
          const gx = Math.floor(candidate.x / cellSize) + dx;
          const gy = Math.floor(candidate.y / cellSize) + dy;

          if (gx >= 0 && gx < gridWidth && gy >= 0 && gy < gridHeight) {
            const neighbor = grid[gy * gridWidth + gx];
            if (neighbor) {
              const dist = Math.sqrt(
                (candidate.x - neighbor.x) ** 2 +
                (candidate.y - neighbor.y) ** 2
              );

              if (dist < minDist) {
                valid = false;
              }
            }
          }
        }
      }

      if (valid) {
        grid[candidateIdx] = candidate;
        points.push(candidate);
        active.push(candidate);
        found = true;
        break;
      }
    }

    if (!found) {
      active.splice(activeIdx, 1);
    }
  }

  return points;
}

/**
 * Define composition zones for theme-aware placement
 * @param {string} theme - Theme name (ocean, jungle, alphabet, etc.)
 * @param {Object} surface - {width_m, height_m}
 * @returns {Object} Named zones with bounds
 */
export function getCompositionZones(theme, surface) {
  const { width_m: w, height_m: h } = surface;

  // Default zones (linear composition)
  const defaultZones = {
    top: { x: 0, y: 0, width: w, height: h * 0.25 },
    middle: { x: 0, y: h * 0.25, width: w, height: h * 0.5 },
    bottom: { x: 0, y: h * 0.75, width: w, height: h * 0.25 },
    left: { x: 0, y: 0, width: w * 0.25, height: h },
    right: { x: w * 0.75, y: 0, width: w * 0.25, height: h },
    center: { x: w * 0.25, y: h * 0.25, width: w * 0.5, height: h * 0.5 },
    goldenTop: { x: w * 0.382, y: h * 0.25, width: w * 0.236, height: h * 0.236 },
    goldenBottom: { x: w * 0.618, y: h * 0.618, width: w * 0.236, height: h * 0.236 }
  };

  // Theme-specific overrides
  const themeZones = {
    ocean: {
      ...defaultZones,
      waveTop: { x: 0, y: 0, width: w, height: h * 0.3 },
      waveBottom: { x: 0, y: h * 0.7, width: w, height: h * 0.3 },
      flow: 'horizontal'
    },

    jungle: {
      ...defaultZones,
      canopy: { x: 0, y: 0, width: w, height: h * 0.4 },
      undergrowth: { x: 0, y: h * 0.6, width: w, height: h * 0.4 },
      focus: 'center'
    },

    alphabet: {
      ...defaultZones,
      grid: generateGridZones(w, h, 3, 2), // 3x2 grid
      alignment: 'grid'
    },

    space: {
      ...defaultZones,
      constellation: getConstellationPoints(w, h, 8),
      focus: 'radial'
    }
  };

  return themeZones[theme] || defaultZones;
}

/**
 * Generate grid zones for structured layouts
 */
export function generateGridZones(width, height, cols, rows) {
  const zones = [];
  const cellW = width / cols;
  const cellH = height / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      zones.push({
        x: col * cellW,
        y: row * cellH,
        width: cellW,
        height: cellH,
        col,
        row
      });
    }
  }

  return zones;
}

/**
 * Generate constellation-style anchor points
 */
export function getConstellationPoints(width, height, count) {
  // Golden spiral points
  const points = [];
  const phi = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < count; i++) {
    const angle = i * phi * 2 * Math.PI;
    const radius = Math.sqrt(i / count);

    points.push({
      x: width * 0.5 + radius * width * 0.4 * Math.cos(angle),
      y: height * 0.5 + radius * height * 0.4 * Math.sin(angle)
    });
  }

  return points;
}

/**
 * Sample flow field along a path for aligned placement
 * @param {Array} path - Array of {x, y} points
 * @param {function} flowField - Flow field function (x,y) -> {x,y}
 * @returns {Array} Array of {point, tangent} objects
 */
export function sampleFlowAlongPath(path, flowField) {
  return path.map(p => {
    const flow = flowField(p.x, p.y);
    const angle = Math.atan2(flow.y, flow.x);

    return {
      point: p,
      tangent: { x: Math.cos(angle), y: Math.sin(angle) },
      angle
    };
  });
}

/**
 * Distribute points along a curve
 * @param {Array} curve - Array of {x, y} points defining curve
 * @param {number} count - Number of points to place
 * @param {number} seed - Random seed for jitter
 * @returns {Array} Distributed points
 */
export function distributeAlongCurve(curve, count, seed = 0) {
  const rng = new SeededRandom(seed);
  const points = [];

  // Calculate cumulative distances
  const distances = [0];
  for (let i = 1; i < curve.length; i++) {
    const dx = curve[i].x - curve[i-1].x;
    const dy = curve[i].y - curve[i-1].y;
    distances.push(distances[i-1] + Math.sqrt(dx * dx + dy * dy));
  }

  const totalDist = distances[distances.length - 1];
  const spacing = totalDist / (count + 1);

  for (let i = 0; i < count; i++) {
    const targetDist = spacing * (i + 1) + (rng.next() - 0.5) * spacing * 0.3;

    // Find segment
    let segIdx = 0;
    for (let j = 1; j < distances.length; j++) {
      if (distances[j] > targetDist) {
        segIdx = j - 1;
        break;
      }
    }

    // Interpolate
    const t = (targetDist - distances[segIdx]) / (distances[segIdx + 1] - distances[segIdx]);
    const p0 = curve[segIdx];
    const p1 = curve[segIdx + 1];

    points.push({
      x: p0.x + t * (p1.x - p0.x),
      y: p0.y + t * (p1.y - p0.y)
    });
  }

  return points;
}

/**
 * Check if zone overlaps with existing regions
 * @param {Object} zone - {x, y, width, height}
 * @param {Array} regions - Array of polygons with .points
 * @param {number} minGap - Minimum gap to maintain
 * @returns {boolean} True if clear
 */
export function isZoneClear(zone, regions, minGap = 0.1) {
  const zoneCenter = {
    x: zone.x + zone.width / 2,
    y: zone.y + zone.height / 2
  };

  for (const region of regions) {
    // Simple centroid-based check
    const regionCenter = region.centroid || calculateCentroid(region.points);
    const dx = zoneCenter.x - regionCenter.x;
    const dy = zoneCenter.y - regionCenter.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < (zone.width / 2 + minGap)) {
      return false;
    }
  }

  return true;
}

/**
 * Calculate centroid helper
 */
export function calculateCentroid(points) {
  let cx = 0, cy = 0;
  for (const p of points) {
    cx += p.x;
    cy += p.y;
  }
  return { x: cx / points.length, y: cy / points.length };
}



