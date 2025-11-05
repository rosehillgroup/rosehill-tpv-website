// Perlin Noise Generator
// Simplified implementation for TPV Studio flow fields

/**
 * Seeded Perlin noise generator
 * Used for creating smooth, organic flow patterns in Bands grammar
 */
export class PerlinNoise {
  constructor(seed = 0) {
    this.seed = seed;
    this.perm = this.generatePermutation(seed);
  }

  /**
   * Generate permutation table from seed
   */
  generatePermutation(seed) {
    const p = [];
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }

    // Fisher-Yates shuffle with seed
    let rng = this.seededRandom(seed);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }

    // Duplicate for wrapping
    const perm = new Array(512);
    for (let i = 0; i < 512; i++) {
      perm[i] = p[i & 255];
    }

    return perm;
  }

  /**
   * Seeded random number generator (LCG)
   */
  seededRandom(seed) {
    let state = seed;
    return function() {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  }

  /**
   * Fade function for smoothing
   */
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /**
   * Linear interpolation
   */
  lerp(t, a, b) {
    return a + t * (b - a);
  }

  /**
   * Gradient function
   */
  grad(hash, x, y) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  /**
   * 2D Perlin noise
   * Returns value between -1 and 1
   */
  noise2D(x, y) {
    // Find unit square that contains point
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    // Find relative x, y in square
    x -= Math.floor(x);
    y -= Math.floor(y);

    // Compute fade curves
    const u = this.fade(x);
    const v = this.fade(y);

    // Hash coordinates of square corners
    const a = this.perm[X] + Y;
    const aa = this.perm[a];
    const ab = this.perm[a + 1];
    const b = this.perm[X + 1] + Y;
    const ba = this.perm[b];
    const bb = this.perm[b + 1];

    // Add blended results from square corners
    return this.lerp(v,
      this.lerp(u,
        this.grad(this.perm[aa], x, y),
        this.grad(this.perm[ba], x - 1, y)
      ),
      this.lerp(u,
        this.grad(this.perm[ab], x, y - 1),
        this.grad(this.perm[bb], x - 1, y - 1)
      )
    );
  }

  /**
   * Octave noise with multiple frequencies
   * Creates more interesting, natural-looking patterns
   */
  octaveNoise2D(x, y, octaves = 4, persistence = 0.5, lacunarity = 2.0) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return total / maxValue;
  }

  /**
   * Generate flow field for Bands grammar
   * Returns angle at each point for directing band flow
   */
  generateFlowField(width, height, scale = 0.02, octaves = 3) {
    const field = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        // Get noise value and convert to angle
        const noise = this.octaveNoise2D(x * scale, y * scale, octaves);
        const angle = noise * Math.PI * 2; // -PI to PI range
        row.push(angle);
      }
      field.push(row);
    }
    return field;
  }
}
