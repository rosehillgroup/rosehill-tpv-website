// TPV Studio 2.0 - Inspire Stage (SDXL Pipeline)
// Generate AI concept images using SDXL + IP-Adapter with palette-locked conditioning
// Fast generation (~20s for 6 concepts) with auto-ranking

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
 * Main Inspire Handler (SDXL Pipeline)
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
 *     quality: {
 *       conformity: number,
 *       avgDeltaE: number,
 *       colorsUsed: number,
 *       colorCoverage: number,
 *       edgeClarity: number,
 *       colorBalance: number,
 *       score: number
 *     },
 *     metadata: {seed, index, aspectRatio, modelDimensions}
 *   }],
 *   metadata: {
 *     prompt, enhancedPrompt, surface, style,
 *     paletteUsed, paletteSwatch, aspectRatio,
 *     duration, count, cost
 *   }
 * }
 */
exports.handler = async function(event, context) {
  // Dynamic import of ESM utilities
  const { buildPalettePrompt, generateConceptsSDXL, downloadImage, estimateCostSDXL } = await import('./studio/_utils/replicate.mjs');
  const { clampToTPVPalette, autoRankConcepts } = await import('./studio/_utils/postprocess.mjs');
  const { selectModelAspect } = await import('./studio/_utils/aspect-resolver.mjs');
  const { createPaletteSwatch } = await import('./studio/_utils/palette-swatch.mjs');
  const { uploadToStorage } = await import('./studio/_utils/exports.mjs');
  const { generateFlatStencil, renderStencilToSVG, rasterizeStencilToPNG } = await import('./studio/_utils/stencil-generator.mjs');
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

    console.log('[INSPIRE] Starting SDXL concept generation...');
    console.log('[INSPIRE] Prompt:', prompt);
    console.log('[INSPIRE] Surface:', `${surface.width_m}m x ${surface.height_m}m`);
    console.log('[INSPIRE] Style:', style);
    console.log('[INSPIRE] Count:', count);

    // Step 1: Resolve aspect ratio for model
    const aspectInfo = selectModelAspect(surface.width_m, surface.height_m);
    console.log(`[INSPIRE] Model aspect: ${aspectInfo.ratio} (${aspectInfo.width}×${aspectInfo.height})`);

    // Step 2: Resolve palette colors
    const selectedColors = resolvePaletteColors(paletteColors);
    const targetPalette = selectedColors || TPV_PALETTE.slice(0, 6); // Default to first 6 colors

    console.log('[INSPIRE] Target palette:', targetPalette.map(c => c.code).join(', '));

    // Step 3: Generate flat composition stencil for img2img
    console.log('[INSPIRE] Generating flat composition stencil...');
    const stencilStartTime = Date.now();

    // Generate geometric regions with colors
    const stencilRegions = generateFlatStencil(
      { width_m: aspectInfo.width / 100, height_m: aspectInfo.height / 100 }, // Normalized dimensions
      targetPalette,
      {
        strategy: 'voronoi', // or 'bands', 'grid' based on theme
        seed: Date.now(),
        minRegions: 6,
        maxRegions: 10,
        minFeatureSize_m: 0.8
      }
    );

    // Render to SVG
    const stencilSVG = renderStencilToSVG(
      stencilRegions,
      { width_m: aspectInfo.width / 100, height_m: aspectInfo.height / 100 }
    );

    // Rasterize to PNG at model resolution
    const stencilPNG = await rasterizeStencilToPNG(stencilSVG, aspectInfo.width, aspectInfo.height);

    // Upload stencil to Supabase
    const stencilFilename = `stencil_${Date.now()}.png`;
    const stencilUrl = await uploadToStorage(stencilPNG, stencilFilename, 'tpv-studio');

    const stencilDuration = Date.now() - stencilStartTime;
    console.log(`[INSPIRE] Stencil generated and uploaded in ${stencilDuration}ms: ${stencilUrl}`);

    // Step 4: Build simplified prompt for img2img (style only, not color lists)
    // In img2img mode, the stencil provides color structure, so prompt focuses on style/theme only
    const enhancedPrompt = `${prompt}. flat vector art, screen print design, bold graphic illustration, paper cutout style, clean edges, solid color fills, installer-friendly geometry`;

    // Step 5: Generate concepts using SDXL img2img mode
    const genStartTime = Date.now();
    const rawConcepts = await generateConceptsSDXL(enhancedPrompt, {
      count,
      width: aspectInfo.width,
      height: aspectInfo.height,
      init_image: stencilUrl, // img2img: use flat stencil as base
      denoise_strength: 0.3, // Preserve stencil structure (0.25-0.35 recommended)
      style,
      guidance: 6.0, // Slightly higher for better style adherence
      steps: 20 // Fewer steps = cleaner, less detailed output
    });

    const genDuration = Date.now() - genStartTime;
    console.log(`[INSPIRE] Generated ${rawConcepts.length} raw concepts from SDXL in ${genDuration}ms`);

    // Step 6: Process concepts in parallel
    console.log('[INSPIRE] Processing concepts: download → clamp → upload...');
    const processStartTime = Date.now();

    const conceptBuffers = [];

    for (let i = 0; i < rawConcepts.length; i++) {
      const rawConcept = rawConcepts[i];
      console.log(`[INSPIRE] Processing concept ${i + 1}/${rawConcepts.length}...`);

      try {
        // Download original image from Replicate
        const originalBuffer = await downloadImage(rawConcept.imageUrl);
        console.log(`[INSPIRE] Downloaded ${originalBuffer.length} bytes`);

        // Apply hard palette quantization (clamping)
        const quantizedBuffer = await clampToTPVPalette(originalBuffer, targetPalette);
        console.log(`[INSPIRE] Clamped to TPV palette`);

        // Store for auto-ranking
        conceptBuffers.push({
          id: rawConcept.id,
          buffer: quantizedBuffer,
          originalBuffer: originalBuffer,
          palette: targetPalette,
          seed: rawConcept.seed,
          index: rawConcept.index
        });

      } catch (error) {
        console.error(`[INSPIRE] Failed to process concept ${i + 1}:`, error);
        // Continue with other concepts
      }
    }

    const processDuration = Date.now() - processStartTime;
    console.log(`[INSPIRE] Processed ${conceptBuffers.length} concepts in ${processDuration}ms`);

    // Step 7: Auto-rank concepts by quality metrics
    console.log('[INSPIRE] Auto-ranking concepts by quality...');
    const rankStartTime = Date.now();

    const rankedConcepts = await autoRankConcepts(conceptBuffers);

    const rankDuration = Date.now() - rankStartTime;
    console.log(`[INSPIRE] Ranked ${rankedConcepts.length} concepts in ${rankDuration}ms`);
    console.log('[INSPIRE] Top 3 scores:', rankedConcepts.slice(0, 3).map(c => c.quality.score));

    // Step 8: Upload ranked concepts to Supabase
    console.log('[INSPIRE] Uploading concepts to Supabase...');
    const uploadStartTime = Date.now();

    const concepts = [];

    for (let i = 0; i < rankedConcepts.length; i++) {
      const rankedConcept = rankedConcepts[i];
      console.log(`[INSPIRE] Uploading concept ${i + 1}/${rankedConcepts.length} (score: ${rankedConcept.quality.score})...`);

      try {
        const conceptId = rankedConcept.id;

        // Upload quantized version (primary)
        const quantizedUrl = await uploadToStorage(
          rankedConcept.buffer,
          `${conceptId}_quantized.png`,
          'tpv-studio'
        );

        // Upload original for comparison
        const originalUrl = await uploadToStorage(
          rankedConcept.originalBuffer,
          `${conceptId}_original.png`,
          'tpv-studio'
        );

        // Create thumbnail (smaller version for gallery)
        const sharp = (await import('sharp')).default;
        const thumbnailBuffer = await sharp(rankedConcept.buffer)
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
          quality: rankedConcept.quality,
          metadata: {
            seed: rankedConcept.seed,
            index: rankedConcept.index,
            aspectRatio: aspectInfo.ratio,
            modelDimensions: {
              width: aspectInfo.width,
              height: aspectInfo.height
            },
            prompt: enhancedPrompt
          }
        });

      } catch (error) {
        console.error(`[INSPIRE] Failed to upload concept ${i + 1}:`, error);
        // Continue with other concepts
      }
    }

    const uploadDuration = Date.now() - uploadStartTime;
    console.log(`[INSPIRE] Uploaded ${concepts.length} concepts in ${uploadDuration}ms`);

    // Calculate cost
    const cost = estimateCostSDXL(count);

    const totalDuration = Date.now() - startTime;
    console.log(`[INSPIRE] Complete! Generated ${concepts.length} concepts in ${totalDuration}ms`);
    console.log(`[INSPIRE] Cost: $${cost.totalCost.toFixed(3)} (${cost.count} × $${cost.costPerImage})`);

    // Return results (already sorted by quality)
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
          paletteSwatch: paletteSwatchUrl,
          aspectRatio: {
            selected: aspectInfo.ratio,
            modelWidth: aspectInfo.width,
            modelHeight: aspectInfo.height,
            targetAspect: aspectInfo.targetAspect,
            aspectDiff: aspectInfo.aspectDiff
          },
          duration: totalDuration,
          timings: {
            generation: genDuration,
            processing: processDuration,
            ranking: rankDuration,
            upload: uploadDuration,
            total: totalDuration
          },
          count: concepts.length,
          cost: {
            total: cost.totalCost,
            perImage: cost.costPerImage,
            currency: cost.currency,
            model: cost.model
          }
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
