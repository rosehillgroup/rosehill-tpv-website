// Grammar Generators for TPV Studio
// Creates geometric patterns based on LayoutSpec grammar definitions

import { PerlinNoise } from './perlin.js';
import { SeededRandom, PoissonDisc } from './random.js';

/**
 * Bands Grammar
 * Creates flowing horizontal or vertical bands using Perlin noise flow fields
 */
export class BandsGrammar {
  constructor(spec, surface, seed) {
    this.spec = spec;
    this.surface = surface;
    this.seed = seed;
    this.perlin = new PerlinNoise(seed);
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

    // Sample points along the surface to create band paths
    const resolution = 50; // Points per band line
    const bandPaths = [];

    for (let b = 0; b < bands; b++) {
      const bandTop = [];
      const bandBottom = [];

      // Top edge of band
      const yTop = (height_m / (bands + 1)) * (b + 1);

      for (let i = 0; i <= resolution; i++) {
        const x = (width_m / resolution) * i;
        const noiseScale = 0.3 / smoothness;
        const noise = this.perlin.octaveNoise2D(x * noiseScale, yTop * noiseScale, 3);

        // Apply amplitude
        const ampMin = Array.isArray(amplitude) ? amplitude[0] : amplitude * 0.5;
        const ampMax = Array.isArray(amplitude) ? amplitude[1] : amplitude * 1.5;
        const amp = ampMin + (ampMax - ampMin) * Math.abs(noise);

        const y = yTop + noise * amp;

        bandTop.push({ x, y: Math.max(0, Math.min(height_m, y)) });
      }

      // Bottom edge of band (offset from next band's top)
      const yBottom = (height_m / (bands + 1)) * (b + 2);

      for (let i = resolution; i >= 0; i--) {
        const x = (width_m / resolution) * i;
        const noiseScale = 0.3 / smoothness;
        const noise = this.perlin.octaveNoise2D(x * noiseScale, yBottom * noiseScale, 3);

        const ampMin = Array.isArray(amplitude) ? amplitude[0] : amplitude * 0.5;
        const ampMax = Array.isArray(amplitude) ? amplitude[1] : amplitude * 1.5;
        const amp = ampMin + (ampMax - ampMin) * Math.abs(noise);

        const y = yBottom + noise * amp;

        bandBottom.push({ x, y: Math.max(0, Math.min(height_m, y)) });
      }

      // Combine top and bottom into closed polygon
      const polygon = [...bandTop, ...bandBottom];

      bandPaths.push({
        type: 'band',
        index: b,
        points: polygon
      });
    }

    return bandPaths;
  }
}

/**
 * Clusters Grammar
 * Creates island regions using Voronoi-like clustering
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
   * Returns array of circular/organic island shapes
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
    const poisson = new PoissonDisc(width_m, height_m, minSpacing, 30, this.seed);
    const centers = poisson.generate();

    // Limit to requested count
    const selectedCenters = centers.slice(0, count);

    // Create organic circular regions for each cluster
    for (let i = 0; i < selectedCenters.length; i++) {
      const center = selectedCenters[i];

      // Determine cluster size
      const minSize = Array.isArray(islandSize) ? islandSize[0] : islandSize * 0.7;
      const maxSize = Array.isArray(islandSize) ? islandSize[1] : islandSize * 1.3;
      const baseRadius = this.rng.nextFloat(minSize, maxSize) / 2;

      // Create organic shape by varying radius
      const points = 32;
      const polygon = [];

      for (let j = 0; j < points; j++) {
        const angle = (j / points) * Math.PI * 2;

        // Add organic variation using noise
        const noise = this.rng.nextFloat(0.8, 1.2);
        const radius = baseRadius * noise * spread;

        const x = center.x + Math.cos(angle) * radius;
        const y = center.y + Math.sin(angle) * radius;

        // Clamp to surface bounds
        polygon.push({
          x: Math.max(0, Math.min(width_m, x)),
          y: Math.max(0, Math.min(height_m, y))
        });
      }

      clusters.push({
        type: 'cluster',
        index: i,
        center,
        points: polygon
      });
    }

    return clusters;
  }
}

/**
 * Islands Grammar
 * Similar to clusters but more scattered and irregular
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
      const radius = size / 2;

      // Create organic polygon
      const points = 16 + this.rng.nextInt(0, 16);
      const polygon = [];

      for (let j = 0; j < points; j++) {
        const angle = (j / points) * Math.PI * 2;

        // Vary radius for organic shape
        const variation = this.rng.nextFloat(0.7, 1.3);
        const r = radius * (roundness + (1 - roundness) * variation);

        const x = center.x + Math.cos(angle) * r;
        const y = center.y + Math.sin(angle) * r;

        polygon.push({
          x: Math.max(0, Math.min(width_m, x)),
          y: Math.max(0, Math.min(height_m, y))
        });
      }

      islands.push({
        type: 'island',
        index: i,
        center,
        points: polygon
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
