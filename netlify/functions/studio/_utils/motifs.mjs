// Motif utilities for TPV Studio
// Handles SVG icon loading, intelligent placement, and thematic elements

import { SeededRandom } from './random.mjs';
import { pointInPolygon, polygonCentroid, expandPolygon } from './geometry.mjs';
import { getCompositionZones } from './composition.mjs';
import { loadMotifFromFile, listMotifsInTheme, getRandomMotifFromTheme } from './svg-loader.mjs';
/**
 * SVG motif cache (now managed by svg-loader.js)
 */
export const MOTIF_CACHE = {};

/**
 * Load motif by ID
 * @param {string} id - Motif identifier
 * @param {string} theme - Optional theme hint (default: 'generic')
 * @returns {Object} Motif data with paths, viewBox, size range
 */
export function loadMotif(id, theme = 'generic') {
  const cacheKey = `${theme}:${id}`;

  // Check cache
  if (MOTIF_CACHE[cacheKey]) {
    return MOTIF_CACHE[cacheKey];
  }

  // Try loading from SVG files
  const motif = loadMotifFromFile(id, theme);

  if (motif) {
    MOTIF_CACHE[cacheKey] = motif;
    return motif;
  }

  // Fallback: simple rounded blob
  console.warn(`[MOTIFS] Could not load motif "${id}" from theme "${theme}", using fallback`);
  const fallback = {
    id,
    theme: 'generic',
    paths: 'M50,20 Q70,30 80,50 Q70,70 50,80 Q30,70 20,50 Q30,30 50,20',
    viewBox: '0 0 100 100',
    minSize_m: 0.3,
    maxSize_m: 0.8
  };
  MOTIF_CACHE[cacheKey] = fallback;
  return fallback;
}

/**
 * Find motifs matching theme
 * @param {string} theme - Theme name (ocean, space, food, gym, etc.)
 * @returns {Array} Array of motif IDs matching theme
 */
export function findMotifsForTheme(theme) {
  // Use SVG loader to get all motifs from theme folder
  const motifIds = listMotifsInTheme(theme);

  if (motifIds.length > 0) {
    return motifIds;
  }

  // Fallback: try generic theme
  console.warn(`[MOTIFS] No motifs found for theme "${theme}", falling back to generic`);
  return listMotifsInTheme('generic');
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
    const motifId = spec.id || 'whale'; // Default to a real motif
    const motif = loadMotif(motifId, theme);
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

  // Default: 3-5 motifs depending on surface area (increased from 2-4)
  const count = Math.min(5, Math.max(3, Math.floor(area_m2 / 12)));

  // Use up to 3 different motif types from the theme
  const selectedMotifs = motifIds.slice(0, 3);

  return selectedMotifs.map((id, index) => ({
    id,
    theme, // Include theme for proper loading
    count: Math.ceil(count / selectedMotifs.length),
    size_m: [0.4, 0.9],
    placement: index === 0 ? 'constellation' : 'scattered', // First motif uses constellation placement
    rotation: 'random',
    colorRole: index === 0 ? 'highlight1' : 'highlight2' // Vary color roles for visual interest
  }));
}



