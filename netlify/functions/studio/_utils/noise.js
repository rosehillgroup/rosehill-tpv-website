// Noise utilities for TPV Studio
// Provides seeded Perlin/Simplex noise for organic shape generation

import { createNoise2D } from 'simplex-noise';
import { SeededRandom } from './random.js';

/**
 * Create a seeded 2D noise function
 * @param {number} seed - Seed for noise generation
 * @returns {function} noise2D(x, y) -> [-1, 1]
 */
export function createSeededNoise(seed) {
  const prng = new SeededRandom(seed);
  const noise2D = createNoise2D(() => prng.next());

  return (x, y) => noise2D(x, y);
}

/**
 * Create a flow field from noise
 * Flow field returns a unit vector at each point
 * @param {number} seed - Seed for consistency
 * @param {number} scale - Spatial frequency (lower = smoother)
 * @returns {function} flowField(x, y) -> {x, y} unit vector
 */
export function createFlowField(seed, scale = 0.5) {
  const noise = createSeededNoise(seed);

  return (x, y) => {
    // Sample noise at position
    const angle = noise(x * scale, y * scale) * Math.PI * 2;

    return {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
  };
}

/**
 * Multi-octave (fractal) noise
 * Combines multiple frequencies for more natural variation
 * @param {number} seed
 * @param {number} octaves - Number of frequency layers (default 3)
 * @param {number} persistence - Amplitude falloff per octave (default 0.5)
 * @returns {function} noise(x, y) -> [-1, 1]
 */
export function createFractalNoise(seed, octaves = 3, persistence = 0.5) {
  const noise = createSeededNoise(seed);

  return (x, y) => {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value += noise(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;

      amplitude *= persistence;
      frequency *= 2;
    }

    return value / maxValue; // Normalize to [-1, 1]
  };
}

/**
 * Sample noise along a path with smoothing
 * Useful for varying band thickness or color intensity
 * @param {function} noise - Noise function
 * @param {Array} path - Array of {x, y} points
 * @param {number} scale - Spatial scale
 * @returns {Array} Array of noise values [-1, 1]
 */
export function sampleNoiseAlongPath(noise, path, scale = 1.0) {
  return path.map(p => noise(p.x * scale, p.y * scale));
}

/**
 * Generate a noise-based thickness variation function
 * Maps noise [-1,1] to thickness [min, max]
 * @param {function} noise - Noise function
 * @param {number} minThickness - Minimum thickness (meters)
 * @param {number} maxThickness - Maximum thickness (meters)
 * @param {number} scale - Spatial frequency
 * @returns {function} thickness(x, y) -> meters
 */
export function createThicknessFunction(noise, minThickness, maxThickness, scale = 0.3) {
  return (x, y) => {
    const noiseValue = noise(x * scale, y * scale); // [-1, 1]
    const t = (noiseValue + 1) / 2; // [0, 1]
    return minThickness + t * (maxThickness - minThickness);
  };
}
