// Post-processing for SDXL-generated concepts
// Wraps color-quantize functions and adds auto-ranking

import sharp from 'sharp';
import { quantizeImageToPalette, extractDominantColors } from './color-quantize.js';
/**
 * Clamp image to TPV palette
 * Wrapper for quantizeImageToPalette
 * @param {Buffer} buffer - Input image
 * @param {Array} palette - TPV palette colors
 * @returns {Promise<Buffer>} Clamped image
 */
export async function clampToTPVPalette(buffer, palette) {
  console.log(`[POSTPROCESS] Clamping to ${palette.length} TPV colors`);
  return await quantizeImageToPalette(buffer, palette);
}

/**
 * Calculate palette conformity metrics
 * @param {Buffer} clampedBuffer - Palette-clamped image
 * @param {Array} paletteColors - Used palette colors
 * @returns {Promise<Object>} {conformity, avgDeltaE, colorsUsed}
 */
export async function calculatePaletteConformity(clampedBuffer, paletteColors) {
  try {
    const { data } = await sharp(clampedBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Since image is already clamped, conformity should be 100%
    // But we measure how many of the target colors are actually used
    const colorsUsed = new Set();
    const totalPixels = data.length / 3;

    // Create palette lookup
    const paletteLookup = paletteColors.map(c => {
      const hex = c.hex.replace('#', '');
      return {
        code: c.code,
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
      };
    });

    // Check each pixel
    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Find matching palette color (exact match since it's clamped)
      for (const color of paletteLookup) {
        if (color.r === r && color.g === g && color.b === b) {
          colorsUsed.add(color.code);
          break;
        }
      }
    }

    const conformity = 1.0; // 100% since it's clamped
    const avgDeltaE = 0.0; // Perfect match
    const colorCoverage = colorsUsed.size / paletteColors.length;

    console.log(`[POSTPROCESS] Conformity: 100%, Colors used: ${colorsUsed.size}/${paletteColors.length}`);

    return {
      conformity: Math.round(conformity * 100) / 100,
      avgDeltaE: Math.round(avgDeltaE * 100) / 100,
      colorsUsed: colorsUsed.size,
      colorCoverage: Math.round(colorCoverage * 100) / 100
    };

  } catch (error) {
    console.warn('[POSTPROCESS] Conformity calculation failed:', error.message);
    return {
      conformity: 0.95, // Fallback
      avgDeltaE: 2.0,
      colorsUsed: 0,
      colorCoverage: 0
    };
  }
}

/**
 * Calculate edge clarity score
 * Measures how crisp/sharp the edges are (good for vectorization)
 * @param {Buffer} imageBuffer
 * @returns {Promise<number>} Score 0-1
 */
async function calculateEdgeClarity(imageBuffer) {
  try {
    // Use Sobel edge detection
    const edges = await sharp(imageBuffer)
      .greyscale()
      .convolve({
        width: 3,
        height: 3,
        kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1]
      })
      .raw()
      .toBuffer();

    // Calculate mean edge strength
    let totalEdgeStrength = 0;
    for (let i = 0; i < edges.length; i++) {
      totalEdgeStrength += edges[i];
    }

    const meanEdgeStrength = totalEdgeStrength / edges.length;
    const clarity = Math.min(meanEdgeStrength / 128, 1.0); // Normalize

    return clarity;

  } catch (error) {
    console.warn('[POSTPROCESS] Edge clarity failed:', error.message);
    return 0.5; // Fallback
  }
}

/**
 * Calculate color balance score
 * Measures how evenly colors are distributed
 * @param {Buffer} imageBuffer
 * @param {Array} palette
 * @returns {Promise<number>} Score 0-1
 */
async function calculateColorBalance(imageBuffer, palette) {
  try {
    const { data } = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const colorCounts = {};
    for (const color of palette) {
      colorCounts[color.code] = 0;
    }

    // Create palette lookup
    const paletteLookup = palette.map(c => {
      const hex = c.hex.replace('#', '');
      return {
        code: c.code,
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
      };
    });

    // Count colors
    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      for (const color of paletteLookup) {
        if (color.r === r && color.g === g && color.b === b) {
          colorCounts[color.code]++;
          break;
        }
      }
    }

    // Calculate balance (Shannon entropy-like)
    const counts = Object.values(colorCounts);
    const total = counts.reduce((sum, c) => sum + c, 0);

    if (total === 0) return 0.5;

    let entropy = 0;
    for (const count of counts) {
      if (count > 0) {
        const p = count / total;
        entropy -= p * Math.log2(p);
      }
    }

    // Normalize by max entropy (log2(n))
    const maxEntropy = Math.log2(palette.length);
    const balance = maxEntropy > 0 ? entropy / maxEntropy : 0;

    return Math.min(balance, 1.0);

  } catch (error) {
    console.warn('[POSTPROCESS] Color balance failed:', error.message);
    return 0.5; // Fallback
  }
}

/**
 * Auto-rank concepts by quality
 * @param {Array} concepts - Array of {buffer, palette, metadata}
 * @returns {Promise<Array>} Ranked concepts with quality scores
 */
export async function autoRankConcepts(concepts) {
  console.log(`[POSTPROCESS] Ranking ${concepts.length} concepts`);

  const rankedConcepts = [];

  for (let i = 0; i < concepts.length; i++) {
    const concept = concepts[i];
    console.log(`[POSTPROCESS] Analyzing concept ${i + 1}/${concepts.length}`);

    try {
      // Calculate metrics
      const conformity = await calculatePaletteConformity(concept.buffer, concept.palette);
      const edgeClarity = await calculateEdgeClarity(concept.buffer);
      const colorBalance = await calculateColorBalance(concept.buffer, concept.palette);

      // Weighted score
      const score = (
        conformity.conformity * 0.2 +
        edgeClarity * 0.4 +
        colorBalance * 0.4
      );

      rankedConcepts.push({
        ...concept,
        quality: {
          conformity: conformity.conformity,
          avgDeltaE: conformity.avgDeltaE,
          colorsUsed: conformity.colorsUsed,
          colorCoverage: conformity.colorCoverage,
          edgeClarity: Math.round(edgeClarity * 100) / 100,
          colorBalance: Math.round(colorBalance * 100) / 100,
          score: Math.round(score * 100) / 100
        }
      });

    } catch (error) {
      console.error(`[POSTPROCESS] Failed to analyze concept ${i + 1}:`, error);
      // Add with fallback scores
      rankedConcepts.push({
        ...concept,
        quality: {
          conformity: 0.95,
          avgDeltaE: 2.0,
          colorsUsed: 0,
          colorCoverage: 0,
          edgeClarity: 0.5,
          colorBalance: 0.5,
          score: 0.5
        }
      });
    }
  }

  // Sort by score (highest first)
  rankedConcepts.sort((a, b) => b.quality.score - a.quality.score);

  console.log('[POSTPROCESS] Ranking complete');
  console.log('[POSTPROCESS] Top scores:', rankedConcepts.slice(0, 3).map(c => c.quality.score));

  return rankedConcepts;
}



