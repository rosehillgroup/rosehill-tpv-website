// TPV Studio 2.0 - Inspire Stage
// Generate AI concept images using FLUX.1 [pro] with palette-locked diffusion
// Replaces the old LLM-based design-plan endpoint

import { buildPalettePrompt, generateConcepts, downloadImage } from './studio/_utils/replicate.js';
import { quantizeImageToPalette, extractDominantColors } from './studio/_utils/color-quantize.js';
import { uploadToStorage } from './studio/_utils/exports.js';

// TPV palette inline (avoid file loading in serverless)
const TPV_PALETTE = [
  { code: "RH30", name: "Beige", hex: "#E4C4AA" },
  { code: "RH31", name: "Cream", hex: "#E8E3D8" },
  { code: "RH41", name: "Bright Yellow", hex: "#FFD833" },
  { code: "RH40", name: "Mustard", hex: "#E5A144" },
  { code: "RH50", name: "Orange", hex: "#F15B32" },
  { code: "RH01", name: "Standard Red", hex: "#A5362F" },
  { code: "RH02", name: "Bright Red", hex: "#E21F2F" },
  { code: "RH90", name: "Funky Pink", hex: "#E8457E" },
  { code: "RH21", name: "Purple", hex: "#493D8C" },
  { code: "RH20", name: "Standard Blue", hex: "#0075BC" },
  { code: "RH22", name: "Light Blue", hex: "#47AFE3" },
  { code: "RH23", name: "Azure", hex: "#039DC4" },
  { code: "RH26", name: "Turquoise", hex: "#00A6A3" },
  { code: "RH12", name: "Dark Green", hex: "#006C55" },
  { code: "RH10", name: "Standard Green", hex: "#609B63" },
  { code: "RH11", name: "Bright Green", hex: "#3BB44A" },
  { code: "RH32", name: "Brown", hex: "#8B5F3C" },
  { code: "RH65", name: "Pale Grey", hex: "#D9D9D6" },
  { code: "RH61", name: "Light Grey", hex: "#939598" },
  { code: "RH60", name: "Dark Grey", hex: "#59595B" },
  { code: "RH70", name: "Black", hex: "#231F20" }
];

/**
 * Resolve palette colors from codes
 * @param {Array} colorCodes - Array of {code} or code strings
 * @returns {Array} Full palette color objects
 */
function resolvePaletteColors(colorCodes) {
  if (!colorCodes || colorCodes.length === 0) {
    return null;
  }

  const colors = [];
  for (const item of colorCodes) {
    const code = typeof item === 'string' ? item : item.code;
    const color = TPV_PALETTE.find(c => c.code === code);

    if (!color) {
      throw new Error(`Unknown TPV color code: ${code}`);
    }

    colors.push(color);
  }

  return colors;
}

/**
 * Analyze concept image to score visual quality
 * Basic heuristics for auto-ranking concepts
 * @param {Buffer} imageBuffer - Quantized PNG
 * @param {Array} paletteColors - Used colors
 * @returns {Object} {contrast, balance, score}
 */
async function analyzeConceptQuality(imageBuffer, paletteColors) {
  try {
    // Extract dominant colors from the quantized image
    const dominantColors = await extractDominantColors(imageBuffer, 10);

    // Simple scoring heuristics
    const colorCount = dominantColors.length;
    const contrast = Math.min(colorCount / 5, 1.0); // More colors = better contrast
    const balance = 0.7; // Placeholder for color balance metric

    // Weighted score (0-1)
    const score = (contrast * 0.5) + (balance * 0.5);

    return {
      contrast: Math.round(contrast * 100) / 100,
      balance: Math.round(balance * 100) / 100,
      score: Math.round(score * 100) / 100,
      dominantColors
    };
  } catch (error) {
    console.warn('[INSPIRE] Analysis failed:', error.message);
    return {
      contrast: 0.5,
      balance: 0.5,
      score: 0.5,
      dominantColors: []
    };
  }
}

/**
 * Main Inspire Handler
 * POST /api/studio/inspire
 *
 * Request body:
 * {
 *   prompt: string - User's design description
 *   surface: {width_m, height_m} - Surface dimensions
 *   paletteColors: [{code}] - Optional color codes (max 6)
 *   style: string - Style preset (professional/playful/geometric)
 *   count: number - Number of concepts to generate (default 6)
 * }
 *
 * Response:
 * {
 *   concepts: [{
 *     id: string,
 *     originalUrl: string,
 *     quantizedUrl: string,
 *     thumbnailUrl: string,
 *     paletteUsed: [{code, name, hex}],
 *     quality: {contrast, balance, score},
 *     metadata: {seed, index}
 *   }]
 * }
 */
export async function handler(event, context) {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const startTime = Date.now();

  try {
    // Parse request
    const request = JSON.parse(event.body);
    const {
      prompt,
      surface = { width_m: 10, height_m: 3 },
      paletteColors = null,
      style = 'professional',
      count = 6
    } = request;

    // Validate
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    console.log('[INSPIRE] Starting concept generation...');
    console.log('[INSPIRE] Prompt:', prompt);
    console.log('[INSPIRE] Surface:', `${surface.width_m}m x ${surface.height_m}m`);
    console.log('[INSPIRE] Style:', style);
    console.log('[INSPIRE] Count:', count);

    // Resolve palette colors
    const selectedColors = resolvePaletteColors(paletteColors);
    const targetPalette = selectedColors || TPV_PALETTE.slice(0, 6); // Default to first 6 colors

    console.log('[INSPIRE] Target palette:', targetPalette.map(c => c.code).join(', '));

    // Step 1: Build enhanced prompt with color guidance
    const enhancedPrompt = buildPalettePrompt(prompt, targetPalette, style);

    // Step 2: Generate concepts using FLUX.1 [pro]
    const aspectRatio = `${Math.round(surface.width_m)}:${Math.round(surface.height_m)}`;
    console.log('[INSPIRE] Aspect ratio:', aspectRatio);

    const rawConcepts = await generateConcepts(enhancedPrompt, {
      count,
      aspectRatio,
      style,
      guidance: 3.5,
      steps: 28
    });

    console.log(`[INSPIRE] Generated ${rawConcepts.length} raw concepts from FLUX`);

    // Step 3: Process each concept (download, quantize, upload)
    const concepts = [];

    for (let i = 0; i < rawConcepts.length; i++) {
      const rawConcept = rawConcepts[i];
      console.log(`[INSPIRE] Processing concept ${i + 1}/${rawConcepts.length}...`);

      try {
        // Download original image from Replicate
        const originalBuffer = await downloadImage(rawConcept.imageUrl);
        console.log(`[INSPIRE] Downloaded ${originalBuffer.length} bytes`);

        // Apply hard palette quantization
        const quantizedBuffer = await quantizeImageToPalette(originalBuffer, targetPalette);
        console.log(`[INSPIRE] Quantized to TPV palette`);

        // Analyze quality
        const quality = await analyzeConceptQuality(quantizedBuffer, targetPalette);
        console.log(`[INSPIRE] Quality score: ${quality.score}`);

        // Upload to Supabase storage
        const conceptId = `concept_${Date.now()}_${i}`;

        // Upload quantized version (primary)
        const quantizedUrl = await uploadToStorage(
          quantizedBuffer,
          `${conceptId}_quantized.png`,
          'tpv-studio'
        );

        // Upload original for comparison (optional, but useful)
        const originalUrl = await uploadToStorage(
          originalBuffer,
          `${conceptId}_original.png`,
          'tpv-studio'
        );

        // Create thumbnail (smaller version for gallery)
        const sharp = (await import('sharp')).default;
        const thumbnailBuffer = await sharp(quantizedBuffer)
          .resize(400, null, { fit: 'contain' })
          .png()
          .toBuffer();

        const thumbnailUrl = await uploadToStorage(
          thumbnailBuffer,
          `${conceptId}_thumb.png`,
          'tpv-studio'
        );

        console.log(`[INSPIRE] Uploaded concept ${i + 1}: ${quantizedUrl}`);

        // Add to results
        concepts.push({
          id: conceptId,
          originalUrl,
          quantizedUrl,
          thumbnailUrl,
          paletteUsed: targetPalette,
          quality,
          metadata: {
            seed: rawConcept.seed,
            index: i,
            prompt: enhancedPrompt
          }
        });

      } catch (error) {
        console.error(`[INSPIRE] Failed to process concept ${i + 1}:`, error);
        // Continue with other concepts
      }
    }

    // Step 4: Sort by quality score (best first)
    concepts.sort((a, b) => b.quality.score - a.quality.score);

    const duration = Date.now() - startTime;
    console.log(`[INSPIRE] Complete! Generated ${concepts.length} concepts in ${duration}ms`);

    // Return results
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify({
        concepts,
        metadata: {
          prompt,
          enhancedPrompt,
          surface,
          style,
          paletteUsed: targetPalette.map(c => ({ code: c.code, name: c.name, hex: c.hex })),
          duration,
          count: concepts.length
        }
      })
    };

  } catch (error) {
    console.error('[INSPIRE] Error:', error);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Concept generation failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
}
