// Grammar Generators for TPV Studio
// Creates geometric patterns based on LayoutSpec grammar definitions

import { createSeededNoise, createFlowField, createThicknessFunction } from './noise.js';
import { offsetPolyline, superellipse, unionPolygons, smoothPolygon, circle } from './geometry.js';
import { poissonDisc } from './composition.js';
import { SeededRandom } from './random.js';

/**
 * Bands Grammar
 * Creates flowing horizontal or vertical bands using Perlin noise flow fields
 */
export class BandsGrammar {
  constructor(spec, surface, seed) {
    this.spec = spec;
    this.surface = surface;
    this.seed = seed;
    this.rng = new SeededRandom(seed);
  }

  /**
   * Generate band regions
   * Returns array of polygon paths for each band
   */
  generate() {
    const { width_m, height_m } = this.surface;
    const params = this.spec.params || {};
    const bands = params.bands || 3;
    const amplitude = params.amplitude_m || [0.3, 0.8];
    const smoothness = params.smoothness || 0.8;

    // Create noise and flow field
    const noiseScale = 0.3 / smoothness;
    const noise = createSeededNoise(this.seed);
    const flowField = createFlowField(this.seed + 1, noiseScale);

    // Sample points along the surface to create band centerlines
    const resolution = 50; // Points per band line
    const bandPaths = [];

    // Amplitude range
    const ampMin = Array.isArray(amplitude) ? amplitude[0] : amplitude * 0.5;
    const ampMax = Array.isArray(amplitude) ? amplitude[1] : amplitude * 1.5;

    // Create thickness function for variable band width
    const thicknessFunc = createThicknessFunction(
      noise,
      ampMin * 0.8,
      ampMax * 1.2,
      noiseScale * 0.5
    );

    for (let b = 0; b < bands; b++) {
      // Create centerline for this band
      const centerline = [];
      const yCenter = (height_m / (bands + 1)) * (b + 1);

      for (let i = 0; i <= resolution; i++) {
        const x = (width_m / resolution) * i;

        // Sample flow field to create organic curves
        const flow = flowField(x, yCenter);
        const noiseValue = noise(x * noiseScale, yCenter * noiseScale);

        // Apply amplitude variation
        const amp = ampMin + (ampMax - ampMin) * (Math.abs(noiseValue) * 0.5 + 0.5);
        const y = yCenter + noiseValue * amp;

        centerline.push({
          x,
          y: Math.max(0, Math.min(height_m, y))
        });
      }

      // Create band polygon using offset polyline with variable thickness
      const bandPolygon = offsetPolyline(centerline, thicknessFunc);

      // Smooth the polygon for organic edges
      const smoothedPolygon = smoothPolygon(bandPolygon, 1);

      bandPaths.push({
        type: 'band',
        index: b,
        points: smoothedPolygon
      });
    }

    return bandPaths;
  }
}

/**
 * Clusters Grammar
 * Creates island regions using Poisson-disc sampling and superellipse shapes
 */
export class ClustersGrammar {
  constructor(spec, surface, seed) {
    this.spec = spec;
    this.surface = surface;
    this.seed = seed;
    this.rng = new SeededRandom(seed);
  }

  /**
   * Generate cluster regions
   * Returns array of organic superellipse island shapes
   */
  generate() {
    const { width_m, height_m } = this.surface;
    const params = this.spec.params || {};
    const count = params.count || 3;
    const spread = params.spread || 0.6;
    const islandSize = params.island_size_m || [0.5, 1.0];

    const clusters = [];

    // Generate cluster centers using Poisson disc sampling
    // This ensures even distribution with minimum spacing
    const minSpacing = Math.min(width_m, height_m) * 0.2;
    const centers = poissonDisc(width_m, height_m, minSpacing, this.seed);

    // Limit to requested count
    const selectedCenters = centers.slice(0, count);

    // Create organic superellipse regions for each cluster
    for (let i = 0; i < selectedCenters.length; i++) {
      const center = selectedCenters[i];

      // Determine cluster size
      const minSize = Array.isArray(islandSize) ? islandSize[0] : islandSize * 0.7;
      const maxSize = Array.isArray(islandSize) ? islandSize[1] : islandSize * 1.3;
      const size = this.rng.nextFloat(minSize, maxSize);

      // Semi-axes with variation for organic shapes
      const a = (size / 2) * this.rng.nextFloat(0.9, 1.1);
      const b = (size / 2) * this.rng.nextFloat(0.9, 1.1);

      // Superellipse exponent: 2.0 = ellipse, 3.5 = more rectangular
      const n = this.rng.nextFloat(2.0, 3.2);

      // Generate superellipse shape
      const basePolygon = superellipse(a, b, n, 32, center);

      // Add organic variation and clamp to bounds
      const polygon = basePolygon.map(p => ({
        x: Math.max(0, Math.min(width_m, p.x)),
        y: Math.max(0, Math.min(height_m, p.y))
      }));

      // Smooth for organic edges
      const smoothedPolygon = smoothPolygon(polygon, 1);

      clusters.push({
        type: 'cluster',
        index: i,
        center,
        points: smoothedPolygon
      });
    }

    // Optional: merge overlapping clusters with metaball effect
    // For now, return individual shapes (can enable union later if needed)
    return clusters;
  }
}

/**
 * Islands Grammar
 * Similar to clusters but more scattered and irregular with varied shapes
 */
export class IslandsGrammar {
  constructor(spec, surface, seed) {
    this.spec = spec;
    this.surface = surface;
    this.seed = seed;
    this.rng = new SeededRandom(seed);
  }

  generate() {
    const { width_m, height_m } = this.surface;
    const params = this.spec.params || {};
    const count = params.count || 5;
    const sizeRange = params.size_m || [0.6, 1.2];
    const roundness = params.roundness || 0.8;

    const islands = [];

    for (let i = 0; i < count; i++) {
      // Random center position
      const center = {
        x: this.rng.nextFloat(width_m * 0.15, width_m * 0.85),
        y: this.rng.nextFloat(height_m * 0.15, height_m * 0.85)
      };

      // Random size
      const size = this.rng.nextFloat(sizeRange[0], sizeRange[1]);

      // Use superellipse for varied organic shapes
      const a = (size / 2) * this.rng.nextFloat(0.85, 1.15);
      const b = (size / 2) * this.rng.nextFloat(0.85, 1.15);

      // More variation in exponent for islands
      const n = this.rng.nextFloat(2.0, 3.5);

      // Generate base superellipse
      const segments = 16 + this.rng.nextInt(0, 16);
      const basePolygon = superellipse(a, b, n, segments, center);

      // Add additional organic variation by jittering points
      const polygon = basePolygon.map(p => {
        const dx = p.x - center.x;
        const dy = p.y - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Apply roundness-based variation
        const variation = this.rng.nextFloat(
          roundness * 0.9,
          roundness * 1.1 + (1 - roundness) * 0.3
        );

        return {
          x: Math.max(0, Math.min(width_m, center.x + dx * variation)),
          y: Math.max(0, Math.min(height_m, center.y + dy * variation))
        };
      });

      // Apply smoothing for organic edges
      const smoothedPolygon = smoothPolygon(polygon, 2);

      islands.push({
        type: 'island',
        index: i,
        center,
        points: smoothedPolygon
      });
    }

    return islands;
  }
}

/**
 * Grammar Factory
 * Creates grammar instances based on LayoutSpec
 */
export function createGrammar(grammarSpec, surface, seed) {
  const { name } = grammarSpec;

  switch (name) {
    case 'Bands':
      return new BandsGrammar(grammarSpec, surface, seed);

    case 'Clusters':
      return new ClustersGrammar(grammarSpec, surface, seed);

    case 'Islands':
      return new IslandsGrammar(grammarSpec, surface, seed);

    default:
      console.warn(`[GRAMMAR] Unknown grammar: ${name}, using Bands fallback`);
      return new BandsGrammar(grammarSpec, surface, seed);
  }
}

/**
 * Combine multiple grammars using weighted blending
 * For now, simple sequential application
 */
export function combineGrammars(grammarSpecs, surface, seed) {
  const regions = [];
  const totalWeight = grammarSpecs.reduce((sum, g) => sum + (g.weight || 1), 0);

  for (const grammarSpec of grammarSpecs) {
    const grammar = createGrammar(grammarSpec, surface, seed);
    const grammarRegions = grammar.generate();

    // Weight determines how many regions this grammar contributes
    const weight = (grammarSpec.weight || 1) / totalWeight;
    const count = Math.ceil(grammarRegions.length * weight);

    regions.push(...grammarRegions.slice(0, count));
  }

  return regions;
}
