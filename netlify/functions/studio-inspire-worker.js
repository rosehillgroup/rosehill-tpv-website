// TPV Studio 2.0 - Inspire Background Worker
// Processes pending jobs from studio_jobs table
// Invoked manually or via cron/scheduled function

// TPV palette inline
const { getSupabaseServiceClient } = require('./studio/_utils/supabase.js');
const { buildPalettePrompt, generateConceptsSDXL, downloadImage, estimateCostSDXL } = require('./studio/_utils/replicate.js');
const { clampToTPVPalette, autoRankConcepts } = require('./studio/_utils/postprocess.js');
const { selectModelAspect } = require('./studio/_utils/aspect-resolver.js');
const { createPaletteSwatch } = require('./studio/_utils/palette-swatch.js');
const { uploadToStorage } = require('./studio/_utils/exports.js');
const { generateFlatStencil, renderStencilToSVG, rasterizeStencilToPNG } = require('./studio/_utils/stencil-generator.js');

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
 * Process a single job (img2img pipeline)
 */
async function processJob(job, imports) {
  // Extract imports
  const {
    getSupabaseServiceClient,
    buildPalettePrompt,
    generateConceptsSDXL,
    downloadImage,
    estimateCostSDXL,
    clampToTPVPalette,
    autoRankConcepts,
    selectModelAspect,
    createPaletteSwatch,
    uploadToStorage,
    generateFlatStencil,
    renderStencilToSVG,
    rasterizeStencilToPNG
  } = imports;
  const startTime = Date.now();
  const { id: jobId, prompt, surface, palette_colors, style, count } = job;

  console.log(`[WORKER] Processing job ${jobId}...`);
  console.log(`[WORKER] Prompt: ${prompt}`);
  console.log(`[WORKER] Surface: ${surface.width_m}m × ${surface.height_m}m`);

  // Step 1: Resolve aspect ratio
  const aspectInfo = selectModelAspect(surface.width_m, surface.height_m);
  console.log(`[WORKER] Model aspect: ${aspectInfo.ratio} (${aspectInfo.width}×${aspectInfo.height})`);

  // Step 2: Resolve palette colors
  const selectedColors = resolvePaletteColors(palette_colors);
  const targetPalette = selectedColors || TPV_PALETTE.slice(0, 6);
  console.log(`[WORKER] Target palette: ${targetPalette.map(c => c.code).join(', ')}`);

  // Step 3: Generate flat composition stencil
  console.log('[WORKER] Generating flat composition stencil...');
  const stencilStartTime = Date.now();

  const stencilRegions = generateFlatStencil(
    { width_m: aspectInfo.width / 100, height_m: aspectInfo.height / 100 },
    targetPalette,
    {
      strategy: 'voronoi',
      seed: Date.now(),
      minRegions: 6,
      maxRegions: 10,
      minFeatureSize_m: 0.8
    }
  );

  const stencilSVG = renderStencilToSVG(
    stencilRegions,
    { width_m: aspectInfo.width / 100, height_m: aspectInfo.height / 100 }
  );

  const stencilPNG = await rasterizeStencilToPNG(stencilSVG, aspectInfo.width, aspectInfo.height);
  const stencilFilename = `stencil_${jobId}_${Date.now()}.png`;
  const stencilUrl = await uploadToStorage(stencilPNG, stencilFilename, 'tpv-studio');

  const stencilDuration = Date.now() - stencilStartTime;
  console.log(`[WORKER] Stencil generated in ${stencilDuration}ms: ${stencilUrl}`);

  // Step 4: Build simplified prompt for img2img
  const enhancedPrompt = `${prompt}. flat vector art, screen print design, bold graphic illustration, paper cutout style, clean edges, solid color fills, installer-friendly geometry`;

  // Step 5: Generate concepts using SDXL img2img
  console.log('[WORKER] Generating concepts with SDXL img2img...');
  const genStartTime = Date.now();

  const rawConcepts = await generateConceptsSDXL(enhancedPrompt, {
    count,
    width: aspectInfo.width,
    height: aspectInfo.height,
    init_image: stencilUrl,
    denoise_strength: 0.3,
    style,
    guidance: 6.0,
    steps: 20
  });

  const genDuration = Date.now() - genStartTime;
  console.log(`[WORKER] Generated ${rawConcepts.length} concepts in ${genDuration}ms`);

  // Step 6: Process concepts (download, clamp, auto-rank)
  console.log('[WORKER] Processing concepts...');
  const processStartTime = Date.now();

  const conceptBuffers = [];

  for (let i = 0; i < rawConcepts.length; i++) {
    const rawConcept = rawConcepts[i];
    console.log(`[WORKER] Processing concept ${i + 1}/${rawConcepts.length}...`);

    try {
      const originalBuffer = await downloadImage(rawConcept.imageUrl);
      const quantizedBuffer = await clampToTPVPalette(originalBuffer, targetPalette);

      conceptBuffers.push({
        id: rawConcept.id,
        buffer: quantizedBuffer,
        originalBuffer: originalBuffer,
        palette: targetPalette,
        seed: rawConcept.seed,
        index: rawConcept.index
      });
    } catch (error) {
      console.error(`[WORKER] Failed to process concept ${i + 1}:`, error);
    }
  }

  const processDuration = Date.now() - processStartTime;
  console.log(`[WORKER] Processed ${conceptBuffers.length} concepts in ${processDuration}ms`);

  // Step 7: Auto-rank concepts
  console.log('[WORKER] Auto-ranking concepts...');
  const rankStartTime = Date.now();

  const rankedConcepts = await autoRankConcepts(conceptBuffers);

  const rankDuration = Date.now() - rankStartTime;
  console.log(`[WORKER] Ranked ${rankedConcepts.length} concepts in ${rankDuration}ms`);

  // Step 8: Upload concepts
  console.log('[WORKER] Uploading concepts to Supabase...');
  const uploadStartTime = Date.now();

  const concepts = [];

  for (let i = 0; i < rankedConcepts.length; i++) {
    const rankedConcept = rankedConcepts[i];

    try {
      const conceptId = rankedConcept.id;

      const quantizedUrl = await uploadToStorage(
        rankedConcept.buffer,
        `${conceptId}_quantized.png`,
        'tpv-studio'
      );

      const originalUrl = await uploadToStorage(
        rankedConcept.originalBuffer,
        `${conceptId}_original.png`,
        'tpv-studio'
      );

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
      console.error(`[WORKER] Failed to upload concept ${i + 1}:`, error);
    }
  }

  const uploadDuration = Date.now() - uploadStartTime;
  console.log(`[WORKER] Uploaded ${concepts.length} concepts in ${uploadDuration}ms`);

  // Calculate cost
  const cost = estimateCostSDXL(count);
  const totalDuration = Date.now() - startTime;

  console.log(`[WORKER] Complete! Generated ${concepts.length} concepts in ${totalDuration}ms`);

  // Return results
  return {
    concepts,
    metadata: {
      prompt,
      enhancedPrompt,
      surface,
      style,
      paletteUsed: targetPalette.map(c => ({ code: c.code, name: c.name, hex: c.hex })),
      aspectRatio: {
        selected: aspectInfo.ratio,
        modelWidth: aspectInfo.width,
        modelHeight: aspectInfo.height,
        targetAspect: aspectInfo.targetAspect,
        aspectDiff: aspectInfo.aspectDiff
      },
      duration: totalDuration,
      timings: {
        stencil: stencilDuration,
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
  };
}

/**
 * Worker Handler
 * GET /api/studio/inspire/worker
 * Processes one pending job per invocation
 */
exports.handler = async function(event, context) {
  // Dynamic import of ESM utilities
  
  
  
  
  
  
  

  const imports = {
    getSupabaseServiceClient,
    buildPalettePrompt,
    generateConceptsSDXL,
    downloadImage,
    estimateCostSDXL,
    clampToTPVPalette,
    autoRankConcepts,
    selectModelAspect,
    createPaletteSwatch,
    uploadToStorage,
    generateFlatStencil,
    renderStencilToSVG,
    rasterizeStencilToPNG
  };

  console.log('[WORKER] Starting inspire worker...');

  try {
    const supabase = getSupabaseServiceClient();

    // Find oldest pending job
    const { data: pendingJobs, error: fetchError } = await supabase
      .from('studio_jobs')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1);

    if (fetchError) {
      console.error('[WORKER] Failed to fetch pending jobs:', fetchError);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to fetch pending jobs', message: fetchError.message })
      };
    }

    if (!pendingJobs || pendingJobs.length === 0) {
      console.log('[WORKER] No pending jobs found');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'No pending jobs to process' })
      };
    }

    const job = pendingJobs[0];
    console.log(`[WORKER] Found job: ${job.id}`);

    // Mark job as processing
    const { error: updateError } = await supabase
      .from('studio_jobs')
      .update({ status: 'processing' })
      .eq('id', job.id);

    if (updateError) {
      console.error('[WORKER] Failed to mark job as processing:', updateError);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to update job status', message: updateError.message })
      };
    }

    // Process job
    try {
      const result = await processJob(job, imports);

      // Mark job as completed
      const { error: completeError } = await supabase
        .from('studio_jobs')
        .update({
          status: 'completed',
          concepts: result.concepts,
          metadata: result.metadata
        })
        .eq('id', job.id);

      if (completeError) {
        console.error('[WORKER] Failed to mark job as completed:', completeError);
        throw completeError;
      }

      console.log(`[WORKER] Job ${job.id} completed successfully`);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Job processed successfully',
          jobId: job.id,
          conceptCount: result.concepts.length
        })
      };

    } catch (processError) {
      console.error('[WORKER] Job processing failed:', processError);

      // Mark job as failed
      const { error: failError } = await supabase
        .from('studio_jobs')
        .update({
          status: 'failed',
          error: processError.message,
          retry_count: job.retry_count + 1
        })
        .eq('id', job.id);

      if (failError) {
        console.error('[WORKER] Failed to mark job as failed:', failError);
      }

      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Job processing failed',
          jobId: job.id,
          message: processError.message
        })
      };
    }

  } catch (error) {
    console.error('[WORKER] Worker error:', error);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Worker failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
}
