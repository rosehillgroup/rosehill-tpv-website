// OKLCH Palette Generator for TPV Studio Geometric Mode
// Generates harmonious color palettes with perceptual spacing

import { formatHex, oklch, differenceEuclidean } from 'culori';

/**
 * Generate a harmonious palette in OKLCH color space
 * @param {number} count - Number of colors (3-8)
 * @param {object} options - Generation options
 * @param {string} options.mood - Color mood (playful, serene, energetic, bold, calm)
 * @param {number} options.seed - Random seed for reproducibility
 * @returns {Array<string>} Array of hex color codes
 */
export function generatePalette(count, options = {}) {
  const { mood = 'playful', seed = 0 } = options;

  // Clamp count to 3-8
  count = Math.max(3, Math.min(8, count));

  // Seeded random (simple LCG)
  let rng = seed;
  const random = () => {
    rng = (rng * 1664525 + 1013904223) % 4294967296;
    return rng / 4294967296;
  };

  // Mood-based lightness and chroma ranges
  const moodConfig = {
    playful: { L: [0.55, 0.75], C: [0.12, 0.18], saturation: 'high' },
    serene: { L: [0.60, 0.80], C: [0.06, 0.12], saturation: 'low' },
    energetic: { L: [0.50, 0.70], C: [0.15, 0.22], saturation: 'high' },
    bold: { L: [0.45, 0.65], C: [0.16, 0.24], saturation: 'high' },
    calm: { L: [0.65, 0.85], C: [0.05, 0.10], saturation: 'low' }
  };

  const config = moodConfig[mood] || moodConfig.playful;

  // Generate colors with perceptual spacing
  const colors = [];
  const minDeltaE = 25; // Minimum perceptual difference

  // Start with a base hue (mood-dependent)
  const baseHues = {
    playful: [30, 330, 210],  // Orange, pink, blue
    serene: [200, 180, 260],  // Blue, cyan, violet
    energetic: [0, 45, 280],  // Red, orange, purple
    bold: [320, 60, 240],     // Magenta, yellow, blue
    calm: [140, 200, 100]     // Green, blue, yellow-green
  };

  const hueSeeds = baseHues[mood] || baseHues.playful;

  // Generate colors
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let candidate = null;

    while (attempts < 50) {
      // Pick hue from mood-appropriate range
      const hueBase = hueSeeds[i % hueSeeds.length];
      const hueVariation = (random() - 0.5) * 40; // ±20° variation
      const h = (hueBase + hueVariation + 360) % 360;

      // Pick lightness and chroma from mood range
      const l = config.L[0] + random() * (config.L[1] - config.L[0]);
      const c = config.C[0] + random() * (config.C[1] - config.C[0]);

      candidate = oklch({ mode: 'oklch', l, c, h });

      // Check if sufficiently different from existing colors
      let tooSimilar = false;
      for (const existing of colors) {
        const deltaE = differenceEuclidean('oklch')(candidate, existing);
        if (deltaE < minDeltaE) {
          tooSimilar = true;
          break;
        }
      }

      if (!tooSimilar || attempts === 49) {
        break;
      }

      attempts++;
    }

    if (candidate) {
      colors.push(candidate);
    }
  }

  // Convert to hex
  return colors.map(color => formatHex(color));
}

/**
 * Validate that a palette meets TPV constraints
 * @param {Array<string>} palette - Array of hex colors
 * @param {number} maxColors - Maximum allowed colors
 * @returns {object} Validation result with pass/fail and issues
 */
export function validatePalette(palette, maxColors = 8) {
  const issues = [];

  // Check count
  if (palette.length > maxColors) {
    issues.push(`Too many colors: ${palette.length} > ${maxColors}`);
  }

  if (palette.length < 3) {
    issues.push(`Too few colors: ${palette.length} < 3`);
  }

  // Check for sufficient contrast
  for (let i = 0; i < palette.length; i++) {
    for (let j = i + 1; j < palette.length; j++) {
      const color1 = oklch(palette[i]);
      const color2 = oklch(palette[j]);
      const deltaE = differenceEuclidean('oklch')(color1, color2);

      if (deltaE < 15) {
        issues.push(`Colors ${i} and ${j} too similar (ΔE = ${deltaE.toFixed(1)})`);
      }
    }
  }

  return {
    pass: issues.length === 0,
    issues
  };
}

/**
 * Merge colors if palette exceeds max count
 * Merges least-area/least-used colors into nearest neighbors
 * @param {Array<string>} palette - Current palette
 * @param {object} usage - Map of color index → area used (mm²)
 * @param {number} targetCount - Target number of colors
 * @returns {Array<string>} Reduced palette
 */
export function mergePalette(palette, usage, targetCount) {
  if (palette.length <= targetCount) {
    return palette;
  }

  const colors = palette.map(hex => ({ hex, color: oklch(hex), area: usage[hex] || 0 }));

  // Sort by area (least used first)
  colors.sort((a, b) => a.area - b.area);

  // Merge least-used colors into nearest neighbors
  while (colors.length > targetCount) {
    const victim = colors.shift(); // Remove least-used

    // Find nearest remaining color
    let minDist = Infinity;
    let nearestIdx = 0;

    for (let i = 0; i < colors.length; i++) {
      const dist = differenceEuclidean('oklch')(victim.color, colors[i].color);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }

    // Merge area into nearest
    colors[nearestIdx].area += victim.area;
  }

  return colors.map(c => c.hex);
}
