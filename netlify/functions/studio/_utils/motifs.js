// Motif utilities for TPV Studio
// Handles SVG icon loading, intelligent placement, and thematic elements

import { SeededRandom } from './random.js';
import { pointInPolygon, polygonCentroid, expandPolygon } from './geometry.js';
import { getCompositionZones } from './composition.js';

/**
 * SVG motif cache
 * In a real implementation, this would load from /public/assets/motifs/
 * For now, we define simple inline motifs
 */
const MOTIF_CACHE = {};

/**
 * Motif library with theme associations
 */
const MOTIF_LIBRARY = {
  // Ocean theme motifs
  'fish': {
    theme: 'ocean',
    paths: 'M50,30 Q40,25 30,30 Q35,35 30,40 L20,35 Q30,45 40,50 Q45,45 50,50 Q55,45 60,50 Q70,45 80,35 L70,40 Q65,35 70,30 Q60,25 50,30',
    viewBox: '0 0 100 80',
    minSize_m: 0.3,
    maxSize_m: 1.0
  },
  'starfish': {
    theme: 'ocean',
    paths: 'M50,10 L55,35 L80,35 L60,50 L70,75 L50,60 L30,75 L40,50 L20,35 L45,35 Z',
    viewBox: '0 0 100 100',
    minSize_m: 0.3,
    maxSize_m: 0.8
  },
  'wave': {
    theme: 'ocean',
    paths: 'M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z',
    viewBox: '0 0 100 100',
    minSize_m: 0.5,
    maxSize_m: 1.5
  },

  // Jungle theme motifs
  'leaf': {
    theme: 'jungle',
    paths: 'M50,10 Q60,30 70,50 Q60,70 50,90 Q40,70 30,50 Q40,30 50,10 M50,10 L50,90',
    viewBox: '0 0 100 100',
    minSize_m: 0.3,
    maxSize_m: 1.0
  },

  // Food theme motifs
  'ice-cream-cone': {
    theme: 'food',
    paths: 'M40,50 L50,80 L60,50 Z M50,30 Q35,30 35,45 Q35,55 50,55 Q65,55 65,45 Q65,30 50,30',
    viewBox: '0 0 100 100',
    minSize_m: 0.4,
    maxSize_m: 1.2
  },
  'splat': {
    theme: 'playful',
    paths: 'M50,30 Q40,35 35,45 Q30,40 25,50 Q30,60 35,55 Q40,65 50,70 Q60,65 65,55 Q70,60 75,50 Q70,40 65,45 Q60,35 50,30',
    viewBox: '0 0 100 100',
    minSize_m: 0.3,
    maxSize_m: 1.0
  },
  'drip': {
    theme: 'playful',
    paths: 'M50,20 L50,50 Q50,70 40,80 Q45,85 50,85 Q55,85 60,80 Q50,70 50,50 L50,20',
    viewBox: '0 0 100 100',
    minSize_m: 0.3,
    maxSize_m: 0.8
  },

  // Alphabet theme motifs
  'letter-a': {
    theme: 'alphabet',
    paths: 'M30,80 L40,30 L50,10 L60,30 L70,80 M35,60 L65,60',
    viewBox: '0 0 100 100',
    minSize_m: 0.5,
    maxSize_m: 1.5
  },

  // Generic shapes
  'heart': {
    theme: 'generic',
    paths: 'M50,75 Q20,55 20,35 Q20,15 35,15 Q45,15 50,25 Q55,15 65,15 Q80,15 80,35 Q80,55 50,75',
    viewBox: '0 0 100 100',
    minSize_m: 0.4,
    maxSize_m: 1.0
  },
  'star': {
    theme: 'generic',
    paths: 'M50,15 L58,40 L85,40 L63,56 L72,82 L50,66 L28,82 L37,56 L15,40 L42,40 Z',
    viewBox: '0 0 100 100',
    minSize_m: 0.3,
    maxSize_m: 1.0
  },
  'circle': {
    theme: 'generic',
    paths: 'M50,50 m-35,0 a35,35 0 1,0 70,0 a35,35 0 1,0 -70,0',
    viewBox: '0 0 100 100',
    minSize_m: 0.3,
    maxSize_m: 0.8
  }
};

/**
 * Load motif by ID
 * @param {string} id - Motif identifier
 * @returns {Object} Motif data with paths, viewBox, size range
 */
export function loadMotif(id) {
  // Check cache
  if (MOTIF_CACHE[id]) {
    return MOTIF_CACHE[id];
  }

  // Check library
  if (MOTIF_LIBRARY[id]) {
    MOTIF_CACHE[id] = MOTIF_LIBRARY[id];
    return MOTIF_LIBRARY[id];
  }

  // Fallback: simple rounded blob
  console.warn(`[MOTIFS] Unknown motif ID: ${id}, using fallback blob`);
  const fallback = {
    theme: 'generic',
    paths: 'M50,20 Q70,30 80,50 Q70,70 50,80 Q30,70 20,50 Q30,30 50,20',
    viewBox: '0 0 100 100',
    minSize_m: 0.3,
    maxSize_m: 0.8
  };
  MOTIF_CACHE[id] = fallback;
  return fallback;
}

/**
 * Find motifs matching theme
 * @param {string} theme - Theme name (ocean, jungle, alphabet, etc.)
 * @returns {Array} Array of motif IDs matching theme
 */
export function findMotifsForTheme(theme) {
  const matches = [];

  for (const [id, motif] of Object.entries(MOTIF_LIBRARY)) {
    if (motif.theme === theme || motif.theme === 'generic') {
      matches.push(id);
    }
  }

  // If no matches, return generic motifs
  if (matches.length === 0) {
    return Object.keys(MOTIF_LIBRARY).filter(id => MOTIF_LIBRARY[id].theme === 'generic');
  }

  return matches;
}

/**
 * Place motifs on surface with intelligent positioning
 * @param {Array} motifSpecs - Motif specifications from LayoutSpec
 * @param {Object} surface - {width_m, height_m}
 * @param {function} flowField - Flow field function for alignment
 * @param {Array} existingRegions - Existing geometry to avoid
 * @param {Object} palette - Color palette for motif coloring
 * @param {Object} constraints - Placement constraints
 * @param {number} seed - Random seed
 * @returns {Array} Array of placed motif instances
 */
export function placeMotifs(
  motifSpecs,
  surface,
  flowField,
  existingRegions,
  palette,
  constraints,
  seed
) {
  const rng = new SeededRandom(seed);
  const { width_m, height_m } = surface;
  const placedMotifs = [];

  // Default constraints
  const minFeatureMM = constraints.minFeatureMM || 120;
  const minGapMM = constraints.minGapMM || 80;
  const minGap_m = minGapMM / 1000;

  // Get composition zones (theme-aware placement hints)
  const theme = motifSpecs[0]?.theme || 'generic';
  const zones = getCompositionZones(theme, surface);

  for (const spec of motifSpecs) {
    const motifId = spec.id || 'circle';
    const motif = loadMotif(motifId);
    const count = spec.count || 3;

    // Determine size range
    const sizeMin = spec.size_m?.[0] || motif.minSize_m;
    const sizeMax = spec.size_m?.[1] || motif.maxSize_m;

    // Determine placement strategy
    const placement = spec.placement || 'scattered'; // 'scattered', 'clustered', 'along_band', 'constellation'

    for (let i = 0; i < count; i++) {
      // Try to find a valid position (rejection sampling)
      let attempts = 0;
      const maxAttempts = 50;
      let position = null;

      while (attempts < maxAttempts && !position) {
        attempts++;

        // Generate candidate position based on placement strategy
        let candidate;

        if (placement === 'scattered') {
          candidate = {
            x: rng.nextFloat(width_m * 0.1, width_m * 0.9),
            y: rng.nextFloat(height_m * 0.1, height_m * 0.9)
          };
        } else if (placement === 'clustered' && zones.center) {
          // Place near center zone
          candidate = {
            x: zones.center.x + rng.nextFloat(0, zones.center.width),
            y: zones.center.y + rng.nextFloat(0, zones.center.height)
          };
        } else if (placement === 'constellation' && zones.goldenTop) {
          // Place near golden ratio points
          const useTop = rng.next() < 0.5;
          const zone = useTop ? zones.goldenTop : zones.goldenBottom;
          candidate = {
            x: zone.x + rng.nextFloat(0, zone.width),
            y: zone.y + rng.nextFloat(0, zone.height)
          };
        } else {
          // Default to scattered
          candidate = {
            x: rng.nextFloat(width_m * 0.1, width_m * 0.9),
            y: rng.nextFloat(height_m * 0.1, height_m * 0.9)
          };
        }

        // Check if position is valid (not too close to existing regions)
        let valid = true;

        // Check distance from existing regions
        for (const region of existingRegions) {
          const centroid = region.centroid || polygonCentroid(region.points);
          const dx = candidate.x - centroid.x;
          const dy = candidate.y - centroid.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < minGap_m) {
            valid = false;
            break;
          }
        }

        // Check distance from other placed motifs
        if (valid) {
          for (const placed of placedMotifs) {
            const dx = candidate.x - placed.x;
            const dy = candidate.y - placed.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < minGap_m * 2) {
              valid = false;
              break;
            }
          }
        }

        if (valid) {
          position = candidate;
        }
      }

      // If we found a valid position, place the motif
      if (position) {
        const size = rng.nextFloat(sizeMin, sizeMax);

        // Determine rotation
        let rotation = 0;
        if (spec.rotation === 'follow_flow' && flowField) {
          const flow = flowField(position.x, position.y);
          rotation = Math.atan2(flow.y, flow.x);
        } else if (spec.rotation === 'random') {
          rotation = rng.nextFloat(0, Math.PI * 2);
        }

        // Determine color (default to highlight role)
        const colorRole = spec.colorRole || 'highlight';
        const colorEntry = palette.find(p => p.role === colorRole);
        const color = colorEntry ? colorEntry.code : palette[palette.length - 1].code;

        placedMotifs.push({
          type: 'motif',
          id: motifId,
          x: position.x,
          y: position.y,
          size,
          rotation,
          color,
          colorRole,
          paths: motif.paths,
          viewBox: motif.viewBox
        });
      } else {
        console.warn(`[MOTIFS] Failed to place motif ${motifId} after ${maxAttempts} attempts`);
      }
    }
  }

  console.log(`[MOTIFS] Placed ${placedMotifs.length} motifs`);
  return placedMotifs;
}

/**
 * Get default motif specs based on theme
 * @param {string} theme - Theme name
 * @param {Object} surface - Surface dimensions
 * @returns {Array} Default motif specifications
 */
export function getDefaultMotifs(theme, surface) {
  const area_m2 = surface.width_m * surface.height_m;
  const motifIds = findMotifsForTheme(theme);

  // Default: 2-4 motifs depending on surface area
  const count = Math.min(4, Math.max(2, Math.floor(area_m2 / 15)));

  return motifIds.slice(0, 2).map(id => ({
    id,
    count: Math.ceil(count / 2),
    size_m: [0.4, 0.8],
    placement: 'scattered',
    rotation: 'random',
    colorRole: 'highlight'
  }));
}
