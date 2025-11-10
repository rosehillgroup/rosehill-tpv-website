// TPV Studio - Multi-Pass Replicate Webhook Callback
// State machine for draft → region refinement → polish pipeline
// Idempotent handling with prediction_id + job_id guard

const { verifyReplicateSignature, getSigHeader } = require('./studio/_utils/replicate-signature.js');
const { getSupabaseServiceClient } = require('./studio/_utils/supabase.js');
const { downloadImage, generateDraftSDXL, refineRegionSDXL } = require('./studio/_utils/replicate.js');
const { uploadByStage, uploadToStorage } = require('./studio/_utils/exports.js');
const { generateRoleMasks, generateMotifMasks } = require('./studio/_utils/mask-generator.js');
const { quantizeWithDithering } = require('./studio/_utils/oklch-quantize.js');
const { assessConceptQuality, checkFluxDevQuality, shouldRetryGeneration } = require('./studio/_utils/quality-gate.js');
const { cropPadToExactAR, makeThumbnail } = require('./studio/_utils/image.js');

exports.handler = async (event, context) => {

  try {
    // 1. Verify webhook authentication (URL token + optional signature)
    const token = event.queryStringParameters?.token;

    // Layer 1: Primary auth via URL token (required)
    if (!token || token !== process.env.REPLICATE_WEBHOOK_SECRET) {
      console.error('[WEBHOOK] Invalid or missing URL token');
      return { statusCode: 401, body: 'Unauthorized' };
    }

    // Layer 2: Optional signature verification (if header present)
    const rawBody = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
    const { verified, reason } = verifyReplicateSignature({
      headers: event.headers,
      rawBody,
      signingKey: process.env.REPLICATE_WEBHOOK_SIGNING_SECRET || ''
    });

    if (getSigHeader(event.headers)) {
      if (!verified) {
        console.error('[WEBHOOK] Signature verification failed:', reason);
        return { statusCode: 401, body: 'Invalid signature' };
      }
      console.log('[WEBHOOK] Signature verified');
    } else {
      console.warn('[WEBHOOK] Unsigned webhook (allowed via URL token)');
    }

    console.log('[WEBHOOK] Authentication successful');

    const payload = JSON.parse(event.body || '{}');
    const { id: prediction_id, status, output, error: predictionError } = payload;

    console.log(`[WEBHOOK] Received: ${prediction_id}, status: ${status}`);

    const supabase = getSupabaseServiceClient();

    // 2. Find job by prediction_id (idempotency layer 2)
    const { data: job, error: fetchError } = await supabase
      .from('studio_jobs')
      .select('*')
      .eq('prediction_id', prediction_id)
      .single();

    if (fetchError || !job) {
      console.error('[WEBHOOK] Job not found for prediction:', prediction_id);
      return { statusCode: 200, body: 'Job not found' };
    }

    // 3. Check if already processed (idempotency layer 3: prediction_id + job_id guard)
    const processedKey = `${prediction_id}_${job.id}`;
    const { data: existing } = await supabase
      .from('studio_webhooks')
      .select('*')
      .eq('prediction_id', prediction_id)
      .eq('job_id', job.id)
      .eq('status', status)
      .maybeSingle();

    if (existing) {
      console.log(`[WEBHOOK] Already processed: ${processedKey} (status: ${status})`);
      return { statusCode: 200, body: 'Already processed' };
    }

    // Log webhook receipt
    await supabase
      .from('studio_webhooks')
      .insert({
        prediction_id,
        job_id: job.id,
        status,
        payload,
        received_at: new Date().toISOString()
      });

    // 4. Handle status transitions via state machine
    if (status === 'starting') {
      return handleStarting(supabase, job);
    }

    if (status === 'processing') {
      return handleProcessing(supabase, job);
    }

    if (status === 'succeeded' && output) {
      return handleSuccess(supabase, job, output, prediction_id);
    }

    if (status === 'failed' || predictionError) {
      return handleFailure(supabase, job, predictionError);
    }

    return { statusCode: 200, body: 'OK' };

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return { statusCode: 500, body: error.message };
  }
};

/**
 * Handle 'starting' status
 */
async function handleStarting(supabase, job) {
  await supabase
    .from('studio_jobs')
    .update({ status: 'running' })
    .eq('id', job.id);

  console.log(`[WEBHOOK] Job ${job.id} starting`);
  return { statusCode: 200, body: 'Starting' };
}

/**
 * Handle 'processing' status
 */
async function handleProcessing(supabase, job) {
  // Optional: update progress metadata
  console.log(`[WEBHOOK] Job ${job.id} processing`);
  return { statusCode: 200, body: 'Processing' };
}

/**
 * Handle 'failed' status
 */
async function handleFailure(supabase, job, error) {
  await supabase
    .from('studio_jobs')
    .update({
      status: 'failed',
      error: error || 'Prediction failed'
    })
    .eq('id', job.id);

  console.error(`[WEBHOOK] Job ${job.id} failed:`, error);
  return { statusCode: 200, body: 'Failed' };
}

/**
 * Handle 'succeeded' status - route to appropriate pass handler or simple mode
 */
async function handleSuccess(supabase, job, output, prediction_id) {
  const mode = job.metadata?.mode;
  const pass = job.metadata?.pass;

  // === TWO-PASS FLUX DEV HANDLER ===
  if (mode === 'flux_dev_two_pass') {
    console.log(`[WEBHOOK] Job ${job.id} succeeded (two-pass mode, pass ${pass})`);

    if (pass === 1) {
      return handlePass1Success(supabase, job, output);
    } else if (pass === 2) {
      return handlePass2Success(supabase, job, output);
    } else {
      console.error(`[WEBHOOK] Unknown pass number: ${pass}`);
      return { statusCode: 500, body: 'Unknown pass number' };
    }
  }

  // === FLUX DEV / SIMPLE MODE HANDLER (Single-Pass Inspiration Mode) ===
  if (mode === 'simple' || mode === 'flux_dev') {
    console.log(`[WEBHOOK] Job ${job.id} succeeded (${mode} mode)`);
    return handleSimpleSuccess(supabase, job, output);
  }

  // === MULTI-PASS MODE HANDLER (Original Pipeline) ===
  const passType = job.metadata?.passType || 'draft';
  const pipelineState = job.metadata?.pipelineState || {};

  console.log(`[WEBHOOK] Job ${job.id} succeeded (multi-pass, pass: ${passType})`);

  // Route to appropriate pass handler
  switch (passType) {
    case 'draft':
      return handleDraftPass(supabase, job, output, pipelineState);

    case 'region_base':
    case 'region_accent':
    case 'region_highlight':
      return handleRegionPass(supabase, job, output, passType, pipelineState);

    case 'final':
      return handleFinalPass(supabase, job, output, pipelineState);

    default:
      console.error(`[WEBHOOK] Unknown pass type: ${passType}`);
      return { statusCode: 500, body: 'Unknown pass type' };
  }
}

/**
 * Handle Pass 1 success (Two-Pass Mode)
 * Store Pass 1 result, update status, trigger Pass 2
 */
async function handlePass1Success(supabase, job, output) {
  console.log(`[PASS1] Processing Pass 1 success for job ${job.id}`);

  try {
    // Get Pass 1 result URL
    const pass1ResultUrl = Array.isArray(output) ? output[0] : output;
    console.log(`[PASS1] Pass 1 result: ${pass1ResultUrl}`);

    // Update job with Pass 1 result and status
    await supabase
      .from('studio_jobs')
      .update({
        status: 'pass1_complete',
        metadata: {
          ...job.metadata,
          pass1_result_url: pass1ResultUrl,
          pass1_completed_at: new Date().toISOString()
        }
      })
      .eq('id', job.id);

    console.log(`[PASS1] Job ${job.id} marked as pass1_complete`);

    // Trigger Pass 2 by updating job to pending with pass=2, then calling enqueue
    await supabase
      .from('studio_jobs')
      .update({
        status: 'pending',
        metadata: {
          ...job.metadata,
          pass: 2,
          pass1_result_url: pass1ResultUrl,
          pass1_completed_at: new Date().toISOString()
        }
      })
      .eq('id', job.id);

    console.log(`[PASS1] Triggering Pass 2 for job ${job.id}`);

    // Call enqueue function to start Pass 2
    const enqueueUrl = `${process.env.PUBLIC_BASE_URL}/.netlify/functions/studio-enqueue`;
    const enqueueResponse = await fetch(enqueueUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: job.id })
    });

    if (!enqueueResponse.ok) {
      const errorData = await enqueueResponse.json();
      throw new Error(`Pass 2 enqueue failed: ${errorData.error || 'Unknown error'}`);
    }

    console.log(`[PASS1] Pass 2 enqueued successfully for job ${job.id}`);

    return { statusCode: 200, body: 'Pass 1 complete, Pass 2 initiated' };

  } catch (error) {
    console.error(`[PASS1] Error processing Pass 1 success:`, error);

    await supabase
      .from('studio_jobs')
      .update({
        status: 'failed',
        error: `Pass 1 → Pass 2 transition failed: ${error.message}`
      })
      .eq('id', job.id);

    return { statusCode: 500, body: error.message };
  }
}

/**
 * Handle Pass 2 success (Two-Pass Mode)
 * Download → crop/pad → thumbnail → upload → mark as completed
 * This is the final pass - user sees this result
 */
async function handlePass2Success(supabase, job, output) {
  console.log(`[PASS2] Processing Pass 2 success (final) for job ${job.id}`);

  // Process Pass 2 result the same way as simple mode
  // But store both Pass 1 and Pass 2 URLs in outputs
  return handleSimpleSuccess(supabase, job, output);
}

/**
 * Handle simple mode success (Inspiration Mode)
 * Download → crop/pad → thumbnail → upload → complete
 * WITH DETAILED TIMELINE TRACKING FOR PERFORMANCE DEBUGGING
 */
async function handleSimpleSuccess(supabase, job, output) {
  
  
  

  // Timeline tracking
  const timeline = [];
  const mark = (label, extra = {}) => {
    const entry = { t: new Date().toISOString(), label, ms: Date.now(), ...extra };
    timeline.push(entry);
    return entry;
  };

  const webhookReceivedMark = mark('webhook_received');
  const startTime = Date.now();

  try {
    mark('postprocess_begin');
    console.log(`[SIMPLE] Processing simple mode output for job ${job.id}`);

    // Handle missing output
    if (!output || (Array.isArray(output) && output.length === 0)) {
      console.error(`[SIMPLE] No output from prediction for job ${job.id}`);
      mark('error_no_output');
      await supabase
        .from('studio_jobs')
        .update({
          status: 'failed',
          error: 'No output from prediction',
          completed_at: new Date().toISOString(),
          metadata: { ...job.metadata, timeline }
        })
        .eq('id', job.id);

      return { statusCode: 200, body: 'No output' };
    }

    // Download generated image
    const imageUrl = Array.isArray(output) ? output[0] : output;
    console.log(`[SIMPLE] Downloading: ${imageUrl}`);
    mark('download_begin', { url: imageUrl });

    const t0 = Date.now();
    const rawBuffer = await downloadImage(imageUrl);
    const downloadMs = Date.now() - t0;
    mark('download_complete', { duration_ms: downloadMs, size_bytes: rawBuffer.length });

    // Run QC check for Flux Dev mode
    let qcResults = null;
    if (job.metadata?.mode === 'flux_dev') {
      mark('qc_begin');
      console.log(`[SIMPLE] Running Flux Dev QC for job ${job.id}`);
      try {
        qcResults = await checkFluxDevQuality(imageUrl, job.metadata?.brief || {}, job.max_colours || 6);
        mark('qc_complete', { pass: qcResults.pass, score: qcResults.score });
        console.log(`[SIMPLE] QC Results: ${qcResults.pass ? 'PASS' : 'FAIL'} (score: ${qcResults.score}/100)`);
      } catch (qcError) {
        console.error(`[SIMPLE] QC check failed:`, qcError);
        // Continue even if QC fails - we still want to complete the job
      }
    }

    // Get target dimensions from job metadata
    const targetW = job.metadata?.target_dims?.w || 2000;
    const targetH = job.metadata?.target_dims?.h || 2000;
    const genW = job.metadata?.gen_dims?.w || targetW;
    const genH = job.metadata?.gen_dims?.h || targetH;

    console.log(`[SIMPLE] Crop/pad: ${genW}×${genH} → ${targetW}×${targetH}`);

    // Crop/pad to exact aspect ratio
    mark('crop_pad_begin');
    const t1 = Date.now();
    const croppedBuffer = await cropPadToExactAR(rawBuffer, { targetW, targetH });
    const cropPadMs = Date.now() - t1;
    mark('crop_pad_complete', { duration_ms: cropPadMs, size_bytes: croppedBuffer.length });

    // Generate thumbnail
    mark('thumbnail_begin');
    const t2 = Date.now();
    const thumbnailBuffer = await makeThumbnail(croppedBuffer, 512);
    const thumbnailMs = Date.now() - t2;
    mark('thumbnail_complete', { duration_ms: thumbnailMs, size_bytes: thumbnailBuffer.length });

    // Upload to storage with signed URLs (private bucket)
    const finalFilename = `final_${job.id}_${Date.now()}.jpg`;
    const thumbFilename = `thumb_${job.id}_${Date.now()}.jpg`;

    // Parallel uploads for speed
    mark('upload_begin');
    const t3 = Date.now();
    const [finalUpload, thumbUpload] = await Promise.all([
      uploadToStorage(croppedBuffer, finalFilename, {
        lifecycle: 'final',
        jobId: job.id,
        contentType: 'image/jpeg'
      }),
      uploadToStorage(thumbnailBuffer, thumbFilename, {
        lifecycle: 'final',
        jobId: job.id,
        contentType: 'image/jpeg'
      })
    ]);
    const uploadMs = Date.now() - t3;
    mark('upload_complete', {
      duration_ms: uploadMs,
      final_url: finalUpload.publicUrl,
      thumb_url: thumbUpload.publicUrl
    });

    const processingDuration = Date.now() - startTime;
    const totalDuration = Date.now() - new Date(job.started_at).getTime();
    const webhookLatency = webhookReceivedMark.ms - new Date(job.started_at).getTime();

    // Calculate step durations for logging
    const stepDurations = {
      download: downloadMs,
      crop_pad: cropPadMs,
      thumbnail: thumbnailMs,
      upload: uploadMs,
      webhook_latency: webhookLatency
    };

    // Log detailed timeline
    console.log(
      `[INSP] job=${job.id} status=completed ` +
      `webhook_latency=${webhookLatency}ms ` +
      `download=${downloadMs}ms crop_pad=${cropPadMs}ms ` +
      `thumbnail=${thumbnailMs}ms upload=${uploadMs}ms ` +
      `processing=${processingDuration}ms total=${totalDuration}ms ` +
      `final_url=${finalUpload.publicUrl}`
    );

    // Update job to completed with full timeline and QC results
    mark('db_update_begin');
    const { data: updateData, error: updateError } = await supabase
      .from('studio_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        qc_results: qcResults,  // Add QC results
        outputs: {
          final_url: finalUpload.publicUrl,
          thumbnail_url: thumbUpload.publicUrl,
          final_path: finalUpload.path,
          thumbnail_path: thumbUpload.path,
          raw_output: imageUrl
        },
        metadata: {
          ...job.metadata,
          processing_duration: processingDuration,
          total_duration: totalDuration,
          webhook_latency: webhookLatency,
          step_durations: stepDurations,
          timeline: timeline,
          dimensions: {
            target: { w: targetW, h: targetH },
            gen: { w: genW, h: genH },
            final: { w: targetW, h: targetH }
          }
        }
      })
      .eq('id', job.id);

    if (updateError) {
      console.error(`[SIMPLE] DB update failed for job ${job.id}:`, updateError);
      throw new Error(`Database update failed: ${updateError.message}`);
    }

    console.log(`[SIMPLE] DB updated successfully for job ${job.id}`, updateData);
    mark('db_update_complete');

    console.log(`[SIMPLE] Timeline for job ${job.id}:`, JSON.stringify(timeline, null, 2));

    return { statusCode: 200, body: 'Simple mode completed' };

  } catch (error) {
    console.error(`[SIMPLE] Processing failed for job ${job.id}:`, error);
    mark('error', { message: error.message, stack: error.stack });

    // Mark job as failed with timeline
    await supabase
      .from('studio_jobs')
      .update({
        status: 'failed',
        error: `Processing failed: ${error.message}`,
        completed_at: new Date().toISOString(),
        metadata: { ...job.metadata, timeline }
      })
      .eq('id', job.id);

    return { statusCode: 500, body: error.message };
  }
}

/**
 * Handle Pass 1: Draft SDXL completion
 * Next: Generate masks and launch region refinements
 */
async function handleDraftPass(supabase, job, output, pipelineState) {
  
  
  
  

  console.log(`[DRAFT] Processing draft output for job ${job.id}`);

  // Download draft image
  const draftUrl = Array.isArray(output) ? output[0] : output;
  const draftBuffer = await downloadImage(draftUrl);

  // Upload draft as temp file
  const draftUpload = await uploadByStage(draftBuffer, `draft_${job.id}.png`, 'draft', job.id);

  // Generate role-based masks from regions
  const regions = job.metadata?.regions || [];
  const dimensions = {
    width: job.metadata?.surface?.width_m * 100 || 1024, // Convert to pixels (assume 100px/m)
    height: job.metadata?.surface?.height_m * 100 || 1024
  };

  const roleMasks = await generateRoleMasks(regions, dimensions, 2); // 2px interior feather

  // Upload masks
  const maskUploads = {};
  for (const [role, maskBuffer] of Object.entries(roleMasks)) {
    const maskUpload = await uploadByStage(maskBuffer, `mask_${role}_${job.id}.png`, 'temp', job.id);
    maskUploads[role] = maskUpload.publicUrl;
  }

  // Launch region refinements (respect MAX_REGION_REFINES cost cap)
  const maxRegionRefines = parseInt(process.env.MAX_REGION_REFINES || '4');
  const regionPasses = [];

  // Base regions (highest priority)
  if (roleMasks.base && regionPasses.length < maxRegionRefines) {
    const basePrediction = await refineRegionSDXL(
      draftUpload.publicUrl,
      maskUploads.base,
      job.metadata?.prompt || '',
      'base',
      {
        style: job.metadata?.style || 'professional',
        seed: pipelineState.seed
      }
    );

    regionPasses.push({
      role: 'base',
      prediction_id: basePrediction.id
    });

    // Create child job for region pass
    await supabase.from('studio_jobs').insert({
      user_id: job.user_id,
      type: 'region_refinement',
      prediction_id: basePrediction.id,
      metadata: {
        ...job.metadata,
        passType: 'region_base',
        parentJobId: job.id,
        pipelineState: {
          ...pipelineState,
          draftUrl: draftUpload.publicUrl,
          masks: maskUploads
        }
      }
    });
  }

  // Accent regions
  if (roleMasks.accent && regionPasses.length < maxRegionRefines) {
    const accentPrediction = await refineRegionSDXL(
      draftUpload.publicUrl,
      maskUploads.accent,
      job.metadata?.prompt || '',
      'accent',
      {
        style: job.metadata?.style || 'professional',
        seed: pipelineState.seed
      }
    );

    regionPasses.push({
      role: 'accent',
      prediction_id: accentPrediction.id
    });

    await supabase.from('studio_jobs').insert({
      user_id: job.user_id,
      type: 'region_refinement',
      prediction_id: accentPrediction.id,
      metadata: {
        ...job.metadata,
        passType: 'region_accent',
        parentJobId: job.id,
        pipelineState: {
          ...pipelineState,
          draftUrl: draftUpload.publicUrl,
          masks: maskUploads
        }
      }
    });
  }

  // Highlight regions (motifs)
  if (roleMasks.highlight && regionPasses.length < maxRegionRefines) {
    const highlightPrediction = await refineRegionSDXL(
      draftUpload.publicUrl,
      maskUploads.highlight,
      job.metadata?.prompt || '',
      'highlight',
      {
        style: job.metadata?.style || 'professional',
        seed: pipelineState.seed
      }
    );

    regionPasses.push({
      role: 'highlight',
      prediction_id: highlightPrediction.id
    });

    await supabase.from('studio_jobs').insert({
      user_id: job.user_id,
      type: 'region_refinement',
      prediction_id: highlightPrediction.id,
      metadata: {
        ...job.metadata,
        passType: 'region_highlight',
        parentJobId: job.id,
        pipelineState: {
          ...pipelineState,
          draftUrl: draftUpload.publicUrl,
          masks: maskUploads
        }
      }
    });
  }

  // Update job with draft results and pending region passes
  await supabase
    .from('studio_jobs')
    .update({
      status: 'regions_pending',
      metadata: {
        ...job.metadata,
        pipelineState: {
          ...pipelineState,
          draftUrl: draftUpload.publicUrl,
          masks: maskUploads,
          regionPasses,
          completedPasses: ['draft']
        }
      }
    })
    .eq('id', job.id);

  console.log(`[DRAFT] Launched ${regionPasses.length} region refinements for job ${job.id}`);
  return { statusCode: 200, body: 'Draft completed, regions launched' };
}

/**
 * Handle Pass 2: Region refinement completion
 * Next: Check if all regions done, then launch final polish
 */
async function handleRegionPass(supabase, job, output, passType, pipelineState) {
  
  

  console.log(`[REGION] Processing ${passType} output for job ${job.id}`);

  // Download refined region image
  const regionUrl = Array.isArray(output) ? output[0] : output;
  const regionBuffer = await downloadImage(regionUrl);

  // Upload region as temp file
  const regionUpload = await uploadByStage(
    regionBuffer,
    `${passType}_${job.id}.png`,
    'region',
    job.id
  );

  // Get parent job
  const parentJobId = job.metadata?.parentJobId;
  const { data: parentJob } = await supabase
    .from('studio_jobs')
    .select('*')
    .eq('id', parentJobId)
    .single();

  if (!parentJob) {
    console.error(`[REGION] Parent job ${parentJobId} not found`);
    return { statusCode: 500, body: 'Parent job not found' };
  }

  // Update pipeline state with completed region
  const updatedState = {
    ...parentJob.metadata.pipelineState,
    completedPasses: [
      ...(parentJob.metadata.pipelineState.completedPasses || []),
      passType
    ],
    regionUrls: {
      ...(parentJob.metadata.pipelineState.regionUrls || {}),
      [passType]: regionUpload.publicUrl
    }
  };

  // Check if all regions completed
  const regionPasses = parentJob.metadata.pipelineState.regionPasses || [];
  const completedRegions = updatedState.completedPasses.filter(p => p.startsWith('region_'));
  const allRegionsDone = completedRegions.length >= regionPasses.length;

  if (allRegionsDone) {
    console.log(`[REGION] All regions complete for job ${parentJobId}, launching final polish`);

    // Launch final polish pass (quantization + quality check)
    await supabase
      .from('studio_jobs')
      .update({
        status: 'finalizing',
        metadata: {
          ...parentJob.metadata,
          pipelineState: updatedState
        }
      })
      .eq('id', parentJobId);

    // Trigger final polish (no new prediction, just postprocessing)
    return handleFinalPolish(supabase, parentJob, updatedState);
  } else {
    // Still waiting for other regions
    await supabase
      .from('studio_jobs')
      .update({
        metadata: {
          ...parentJob.metadata,
          pipelineState: updatedState
        }
      })
      .eq('id', parentJobId);

    console.log(`[REGION] Region ${passType} complete, waiting for ${regionPasses.length - completedRegions.length} more`);
    return { statusCode: 200, body: 'Region completed, waiting for others' };
  }
}

/**
 * Handle Pass 3: Final polish (quantization + quality check)
 * Next: If quality passes, mark complete. If fails, retry motif pass.
 */
async function handleFinalPolish(supabase, job, pipelineState) {
  
  
  
  

  console.log(`[FINAL] Starting final polish for job ${job.id}`);

  // Composite all region passes (simplified: use last region output as base)
  // Production: properly composite all regions with masks using Sharp
  const finalRegionUrl = Object.values(pipelineState.regionUrls || {}).pop();
  const compositeBuffer = await downloadImage(finalRegionUrl);

  // Apply OKLCH quantization with dithering
  const palette = job.metadata?.targetPalette || [];
  const quantizedBuffer = await quantizeWithDithering(compositeBuffer, palette, {
    ditherStrength: parseFloat(process.env.DITHER_STRENGTH || '0.11'),
    mask: null // Apply globally
  });

  // Assess quality
  const qualityResult = await assessConceptQuality(
    {
      regions: job.metadata?.regions || [],
      surface: job.metadata?.surface || {}
    },
    {
      checkCoverage: true,
      checkEdgeHealth: true,
      checkPalettePurity: true,
      checkMotifLegibility: true,
      imageBuffer: quantizedBuffer,
      palette,
      afterDithering: true
    }
  );

  console.log(`[FINAL] Quality score: ${qualityResult.score.toFixed(3)} (threshold: ${qualityResult.threshold})`);

  // Check if retry needed
  if (!qualityResult.passed && !pipelineState.retriedMotifs) {
    console.log(`[FINAL] Quality below threshold, retrying motif pass`);

    // Re-seed motif pass only (cheapest/highest visual lift)
    

    const newSeed = Math.floor(Math.random() * 1000000);
    const retryPrediction = await refineRegionSDXL(
      pipelineState.draftUrl,
      pipelineState.masks.highlight,
      job.metadata?.prompt || '',
      'highlight',
      {
        style: job.metadata?.style || 'professional',
        seed: newSeed
      }
    );

    // Create retry job
    await supabase.from('studio_jobs').insert({
      user_id: job.user_id,
      type: 'region_refinement',
      prediction_id: retryPrediction.id,
      metadata: {
        ...job.metadata,
        passType: 'region_highlight',
        parentJobId: job.id,
        pipelineState: {
          ...pipelineState,
          retriedMotifs: true
        }
      }
    });

    await supabase
      .from('studio_jobs')
      .update({
        status: 'retrying_motifs',
        metadata: {
          ...job.metadata,
          pipelineState: {
            ...pipelineState,
            retriedMotifs: true,
            qualityCheck: qualityResult
          }
        }
      })
      .eq('id', job.id);

    return { statusCode: 200, body: 'Retrying motif pass' };
  }

  // Upload final quantized image
  const finalUpload = await uploadToStorage(quantizedBuffer, `final_${job.id}.png`, {
    lifecycle: 'final',
    jobId: job.id
  });

  // Mark complete
  await supabase
    .from('studio_jobs')
    .update({
      status: 'completed',
      outputs: {
        finalUrl: finalUpload.publicUrl,
        qualityScore: qualityResult.score,
        passed: qualityResult.passed
      },
      metadata: {
        ...job.metadata,
        pipelineState: {
          ...pipelineState,
          qualityCheck: qualityResult
        }
      }
    })
    .eq('id', job.id);

  console.log(`[FINAL] Job ${job.id} completed with quality score ${qualityResult.score.toFixed(3)}`);
  return { statusCode: 200, body: 'Completed' };
}

/**
 * Handle final pass (legacy single-pass support)
 */
async function handleFinalPass(supabase, job, output, pipelineState) {
  // Legacy: direct completion for single-pass jobs
  return handleFinalPolish(supabase, job, pipelineState);
}
