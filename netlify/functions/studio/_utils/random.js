// Seeded Random Number Generator
// Ensures reproducible designs from the same seed

/**
 * Seeded RNG using xorshift128+
 * Faster and better quality than simple LCG
 */
export class SeededRandom {
  constructor(seed = 0) {
    // Initialize state from seed
    this.state0 = seed;
    this.state1 = seed * 3;

    // Warm up the generator
    for (let i = 0; i < 10; i++) {
      this.next();
    }
  }

  /**
   * Generate next random number [0, 1)
   */
  next() {
    let s1 = this.state0;
    let s0 = this.state1;
    this.state0 = s0;
    s1 ^= s1 << 23;
    s1 ^= s1 >> 17;
    s1 ^= s0;
    s1 ^= s0 >> 26;
    this.state1 = s1;
    return Math.abs((s0 + s1) % 2147483647) / 2147483647;
  }

  /**
   * Random integer between min (inclusive) and max (exclusive)
   */
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Random float between min and max
   */
  nextFloat(min, max) {
    return this.next() * (max - min) + min;
  }

  /**
   * Random point in rectangle
   */
  nextPoint(minX, minY, maxX, maxY) {
    return {
      x: this.nextFloat(minX, maxX),
      y: this.nextFloat(minY, maxY)
    };
  }

  /**
   * Shuffle array in place (Fisher-Yates)
   */
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Choose random element from array
   */
  choice(array) {
    return array[this.nextInt(0, array.length)];
  }

  /**
   * Normal distribution (Box-Muller transform)
   */
  nextGaussian(mean = 0, stdDev = 1) {
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
}

/**
 * Poisson disc sampling for evenly distributed points
 * Used for motif placement with minimum distance constraint
 */
export class PoissonDisc {
  constructor(width, height, minDistance, maxAttempts = 30, seed = 0) {
    this.width = width;
    this.height = height;
    this.minDistance = minDistance;
    this.maxAttempts = maxAttempts;
    this.rng = new SeededRandom(seed);

    // Cell size for spatial grid
    this.cellSize = minDistance / Math.sqrt(2);
    this.gridWidth = Math.ceil(width / this.cellSize);
    this.gridHeight = Math.ceil(height / this.cellSize);

    // Initialize grid
    this.grid = new Array(this.gridWidth * this.gridHeight).fill(null);
    this.points = [];
    this.active = [];
  }

  /**
   * Generate Poisson disc sample points
   */
  generate() {
    // Start with random point
    const firstPoint = {
      x: this.rng.nextFloat(0, this.width),
      y: this.rng.nextFloat(0, this.height)
    };

    this.addPoint(firstPoint);

    // Process active list
    while (this.active.length > 0) {
      const idx = this.rng.nextInt(0, this.active.length);
      const point = this.active[idx];
      let found = false;

      // Try to add nearby points
      for (let i = 0; i < this.maxAttempts; i++) {
        const angle = this.rng.next() * Math.PI * 2;
        const radius = this.rng.nextFloat(this.minDistance, this.minDistance * 2);

        const newPoint = {
          x: point.x + Math.cos(angle) * radius,
          y: point.y + Math.sin(angle) * radius
        };

        // Check if point is valid
        if (this.isValid(newPoint)) {
          this.addPoint(newPoint);
          found = true;
        }
      }

      // Remove from active list if no valid points found
      if (!found) {
        this.active.splice(idx, 1);
      }
    }

    return this.points;
  }

  /**
   * Check if point is valid (within bounds and far enough from others)
   */
  isValid(point) {
    if (point.x < 0 || point.x >= this.width || point.y < 0 || point.y >= this.height) {
      return false;
    }

    // Check grid cells around point
    const cellX = Math.floor(point.x / this.cellSize);
    const cellY = Math.floor(point.y / this.cellSize);

    const startX = Math.max(0, cellX - 2);
    const endX = Math.min(this.gridWidth - 1, cellX + 2);
    const startY = Math.max(0, cellY - 2);
    const endY = Math.min(this.gridHeight - 1, cellY + 2);

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const existing = this.grid[y * this.gridWidth + x];
        if (existing) {
          const dx = point.x - existing.x;
          const dy = point.y - existing.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < this.minDistance * this.minDistance) {
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * Add point to grid and lists
   */
  addPoint(point) {
    const cellX = Math.floor(point.x / this.cellSize);
    const cellY = Math.floor(point.y / this.cellSize);
    this.grid[cellY * this.gridWidth + cellX] = point;
    this.points.push(point);
    this.active.push(point);
  }
}
