// Seed-based Variation Generator for TPV Studio Geometric Mode
// Generate multiple variations of a design by modifying the seed

import { generateGeometricSVG } from './generator.js';

/**
 * Generate multiple variations of a design by changing the seed
 * @param {object} baseParams - Base parameters from parseBrief() or user input
 * @param {number} count - Number of variations to generate (1-10)
 * @param {object} options - Variation options
 * @param {boolean} options.varyColors - Allow slight color variation (default: false)
 * @param {boolean} options.varyComposition - Allow composition variation (default: false)
 * @param {number} options.baseSeed - Starting seed (default: Date.now())
 * @returns {Promise<Array>} Array of {svg, metadata, seed} objects
 */
export async function generateVariations(baseParams, count = 4, options = {}) {
  const {
    varyColors = false,
    varyComposition = false,
    baseSeed = Date.now()
  } = options;

  // Validate count
  const variationCount = Math.max(1, Math.min(10, count));

  console.log(`[VARIATION-GEN] Generating ${variationCount} variations`);
  console.log(`[VARIATION-GEN] Base seed: ${baseSeed}`);
  console.log(`[VARIATION-GEN] Vary colors: ${varyColors}, Vary composition: ${varyComposition}`);

  const variations = [];

  for (let i = 0; i < variationCount; i++) {
    try {
      // Generate deterministic seed based on base seed and iteration
      const seed = baseSeed + (i * 1000);

      // Clone base params
      const params = {
        ...baseParams,
        options: {
          ...baseParams.options,
          seed
        }
      };

      // Apply variations if requested
      if (varyColors && i > 0) {
        // Slightly vary color count (±1)
        const baseColorCount = baseParams.options.colorCount || 5;
        const variation = (i % 3) - 1; // -1, 0, +1 pattern
        params.options.colorCount = Math.max(3, Math.min(8, baseColorCount + variation));
      }

      if (varyComposition && i > 0) {
        // Rotate through composition types
        const compositions = ['mixed', 'bands', 'islands', 'motifs'];
        const baseComposition = baseParams.options.composition || 'mixed';
        const baseIndex = compositions.indexOf(baseComposition);
        const newIndex = (baseIndex + i) % compositions.length;
        params.options.composition = compositions[newIndex];
      }

      console.log(`[VARIATION-GEN] Variation ${i + 1}/${variationCount} - Seed: ${seed}`);

      const result = await generateGeometricSVG(params);

      variations.push({
        svg: result.svg,
        metadata: {
          ...result.metadata,
          variationIndex: i,
          variationOf: baseSeed
        },
        seed
      });

    } catch (error) {
      console.error(`[VARIATION-GEN] Failed to generate variation ${i + 1}:`, error.message);
      // Continue with next variation instead of failing completely
    }
  }

  console.log(`[VARIATION-GEN] Successfully generated ${variations.length}/${variationCount} variations`);

  return variations;
}

/**
 * Generate a grid of variations (for preview/selection UI)
 * @param {object} baseParams - Base parameters
 * @param {number} rows - Grid rows (default: 2)
 * @param {number} cols - Grid columns (default: 2)
 * @param {object} options - Variation options
 * @returns {Promise<Array>} 2D array of variations [row][col]
 */
export async function generateVariationGrid(baseParams, rows = 2, cols = 2, options = {}) {
  const totalVariations = rows * cols;
  const variations = await generateVariations(baseParams, totalVariations, options);

  // Organize into grid structure
  const grid = [];
  let index = 0;

  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = variations[index] || null;
      index++;
    }
  }

  return grid;
}

/**
 * Regenerate a specific design using its seed
 * Useful for reproducing a previously generated design
 * @param {object} baseParams - Base parameters (brief, canvas, options)
 * @param {number} seed - Seed from previous generation
 * @returns {Promise<object>} {svg, metadata}
 */
export async function regenerateWithSeed(baseParams, seed) {
  console.log(`[VARIATION-GEN] Regenerating design with seed: ${seed}`);

  const params = {
    ...baseParams,
    options: {
      ...baseParams.options,
      seed
    }
  };

  return await generateGeometricSVG(params);
}

/**
 * Generate variations with progressive complexity
 * Useful for showing simple → complex versions of same theme
 * @param {object} baseParams - Base parameters
 * @param {number} count - Number of variations (3-5 recommended)
 * @returns {Promise<Array>} Array of variations from simple to complex
 */
export async function generateProgressiveComplexity(baseParams, count = 3) {
  console.log(`[VARIATION-GEN] Generating ${count} progressive complexity variations`);

  const baseSeed = baseParams.options.seed || Date.now();
  const variations = [];

  // Define complexity levels
  const complexityLevels = [
    { bands: 0, islands: 2, motifs: 0, colorCount: 3, mood: 'calm' },      // Simple
    { bands: 1, islands: 2, motifs: 3, colorCount: 5, mood: 'playful' },   // Medium
    { bands: 2, islands: 3, motifs: 6, colorCount: 7, mood: 'energetic' }  // Complex
  ];

  for (let i = 0; i < Math.min(count, complexityLevels.length); i++) {
    try {
      const level = complexityLevels[i];
      const seed = baseSeed + (i * 1000);

      const params = {
        ...baseParams,
        options: {
          ...baseParams.options,
          mood: level.mood,
          colorCount: level.colorCount,
          seed
        }
      };

      console.log(`[VARIATION-GEN] Complexity level ${i + 1}: ${level.mood}, ${level.colorCount} colors`);

      const result = await generateGeometricSVG(params);

      variations.push({
        svg: result.svg,
        metadata: {
          ...result.metadata,
          complexityLevel: i + 1,
          complexityLabel: ['Simple', 'Medium', 'Complex'][i]
        },
        seed
      });

    } catch (error) {
      console.error(`[VARIATION-GEN] Failed to generate complexity level ${i + 1}:`, error.message);
    }
  }

  return variations;
}

/**
 * Generate "family" of related designs with different moods
 * Useful for showing how same theme can have different emotional tones
 * @param {object} baseParams - Base parameters
 * @returns {Promise<Array>} Array of variations with different moods
 */
export async function generateMoodFamily(baseParams) {
  console.log('[VARIATION-GEN] Generating mood family variations');

  const moods = ['playful', 'serene', 'energetic', 'bold', 'calm'];
  const baseSeed = baseParams.options.seed || Date.now();
  const variations = [];

  for (let i = 0; i < moods.length; i++) {
    try {
      const mood = moods[i];
      const seed = baseSeed + (i * 1000);

      const params = {
        ...baseParams,
        options: {
          ...baseParams.options,
          mood,
          seed
        }
      };

      console.log(`[VARIATION-GEN] Mood: ${mood}`);

      const result = await generateGeometricSVG(params);

      variations.push({
        svg: result.svg,
        metadata: {
          ...result.metadata,
          moodVariation: mood
        },
        seed,
        mood
      });

    } catch (error) {
      console.error(`[VARIATION-GEN] Failed to generate mood ${moods[i]}:`, error.message);
    }
  }

  return variations;
}
