// TPV Studio - Multi-Pass Replicate Webhook Callback
// State machine for draft → region refinement → polish pipeline
// Idempotent handling with prediction_id + job_id guard

const crypto = require('crypto');
const { getSupabaseServiceClient } = require('./studio/_utils/supabase.js');
const { downloadImage, generateDraftSDXL, refineRegionSDXL } = require('./studio/_utils/replicate.js');
const { uploadByStage, uploadToStorage } = require('./studio/_utils/exports.js');
const { generateRoleMasks, generateMotifMasks } = require('./studio/_utils/mask-generator.js');
const { quantizeWithDithering } = require('./studio/_utils/oklch-quantize.js');
const { assessConceptQuality } = require('./studio/_utils/quality-gate.js');
const { cropPadToExactAR, makeThumbnail } = require('./studio/_utils/image.js');

/**
 * Helper: Get signature header (case-insensitive)
 */
function getSignatureHeader(headers) {
  return headers['webhook-signature'] || headers['Webhook-Signature'] || '';
}

/**
 * Helper: Parse Replicate's "t=timestamp,v1=signature" format
 */
function parseSigHeader(header) {
  const parts = header.split(',');
  const t = parts.find(p => p.startsWith('t='))?.split('=')[1];
  const v1 = parts.find(p => p.startsWith('v1='))?.split('=')[1];
  return { t, v1 };
}

/**
 * Helper: Get raw body buffer (handle base64 encoding)
 */
function rawBodyBuffer(event) {
  if (event.isBase64Encoded) {
    return Buffer.from(event.body, 'base64');
  }
  return Buffer.from(event.body, 'utf8');
}

/**
 * Helper: Compute HMAC-SHA256 hex
 */
function hmacHex(secret, data) {
  return crypto.createHmac('sha256', secret)
    .update(data)
    .digest('hex');
}

/**
 * Helper: Timing-safe hex string comparison
 */
function timingSafeEqHex(a, b) {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verify Replicate webhook signature
 * @param {Object} event - Netlify event object
 * @param {string} secret - REPLICATE_WEBHOOK_SIGNING_SECRET
 * @param {number} maxSkewSeconds - Max allowed time difference (default 5 minutes)
 * @returns {boolean} true if signature is valid
 */
function verifyReplicateSignature(event, secret, maxSkewSeconds = 5 * 60) {
  console.log('[WEBHOOK] Starting signature verification...');

  const header = getSignatureHeader(event.headers || {});
  console.log('[WEBHOOK] Signature header:', header ? 'present' : 'missing');
  console.log('[WEBHOOK] Raw signature header value:', JSON.stringify(header));
  console.log('[WEBHOOK] Header length:', header?.length);

  if (!header || !secret) {
    console.error('[WEBHOOK] Missing header or secret', {
      hasHeader: !!header,
      hasSecret: !!secret
    });
    return false;
  }

  const { t, v1 } = parseSigHeader(header);
  console.log('[WEBHOOK] Parsed signature parts:', {
    hasTimestamp: !!t,
    hasSignature: !!v1,
    timestamp: t,
    signatureLength: v1?.length
  });

  if (!t || !v1) {
    console.error('[WEBHOOK] Missing timestamp or signature in header');
    return false;
  }

  // Replay protection
  const now = Math.floor(Date.now() / 1000);
  const skew = Math.abs(now - Number(t));
  console.log('[WEBHOOK] Timestamp check:', {
    now,
    timestamp: t,
    skew,
    maxSkew: maxSkewSeconds
  });

  if (skew > maxSkewSeconds) {
    console.error('[WEBHOOK] Signature timestamp outside allowed window', { t, now, skew });
    return false;
  }

  const raw = rawBodyBuffer(event);
  const signedPayload = `${t}.${raw.toString('utf8')}`;
  const expected = hmacHex(secret, signedPayload);

  console.log('[WEBHOOK] HMAC comparison:', {
    providedLength: v1.length,
    expectedLength: expected.length,
    providedPrefix: v1.substring(0, 8),
    expectedPrefix: expected.substring(0, 8),
    base64Encoded: !!event.isBase64Encoded,
    bodyLength: raw.length
  });

  if (!timingSafeEqHex(v1, expected)) {
    console.error('[WEBHOOK] HMAC mismatch');
    return false;
  }

  console.log('[WEBHOOK] Signature verification SUCCESS');
  return true;
}

exports.handler = async (event, context) => {

  try {
    // 1. Verify webhook authentication (two layers)
    const token = event.queryStringParameters?.token;
    const signingSecret = process.env.REPLICATE_WEBHOOK_SIGNING_SECRET;

    // Layer 1: URL token (simple auth, already working)
    if (token && token !== process.env.REPLICATE_WEBHOOK_SECRET) {
      console.error('[WEBHOOK] Invalid URL token');
      return { statusCode: 401, body: 'Invalid token' };
    }

    // Layer 2: Replicate signature verification (proper cryptographic auth)
    if (signingSecret) {
      const signatureValid = verifyReplicateSignature(event, signingSecret);
      if (!signatureValid) {
        console.error('[WEBHOOK] Signature verification failed');
        return { statusCode: 401, body: 'Invalid signature' };
      }
      console.log('[WEBHOOK] Signature verified successfully');
    } else if (!token) {
      // No auth configured at all
      console.error('[WEBHOOK] No authentication configured (no token or signing secret)');
      return { statusCode: 401, body: 'Unauthorized' };
    }

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

  // === SIMPLE MODE HANDLER (Inspiration Mode) ===
  if (mode === 'simple') {
    console.log(`[WEBHOOK] Job ${job.id} succeeded (simple mode)`);
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

    // Update job to completed with full timeline
    mark('db_update_begin');
    await supabase
      .from('studio_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        result: {
          final_url: finalUpload.publicUrl,
          thumbnail_url: thumbUpload.publicUrl,
          raw_output: imageUrl,
          dimensions: {
            target: { w: targetW, h: targetH },
            gen: { w: genW, h: genH },
            final: { w: targetW, h: targetH }
          }
        },
        metadata: {
          ...job.metadata,
          processing_duration: processingDuration,
          total_duration: totalDuration,
          webhook_latency: webhookLatency,
          step_durations: stepDurations,
          timeline: timeline,
          final_path: finalUpload.path,
          thumbnail_path: thumbUpload.path
        }
      })
      .eq('id', job.id);
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
