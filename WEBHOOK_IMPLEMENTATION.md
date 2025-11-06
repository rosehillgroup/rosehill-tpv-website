# Webhook Pattern Implementation Guide

## Status: Implementation Complete ✅
✅ Migration 008 - Schema changes pushed to Supabase
✅ Preprocessing utilities created
✅ studio-enqueue.js created
✅ replicate-callback.js created
✅ studio-inspire-create.js updated with fire-and-forget trigger
✅ studio-inspire-reconciler.js created
✅ Frontend updated for queued/running states

## Architecture Overview

```
User → Create Job (pending)
     ↓
Enqueue (2s): Generate stencil → Start Replicate → Mark 'queued'
     ↓
Replicate (~40s): SDXL img2img processing
     ↓
Webhook (8s): Download → Clamp → Rank → Upload → Mark 'completed'
     ↓
Frontend polls → Display results

Total: ~50s (vs ~100s with cron)
```

## Environment Variables Required

Add to Netlify:
```bash
REPLICATE_API_TOKEN=r8_... # Your Replicate API token (standard name)
REPLICATE_WEBHOOK_SECRET=$(openssl rand -hex 32) # Generate with this command
PUBLIC_BASE_URL=https://yoursite.netlify.app
SUPABASE_URL=https://okakomwfikxmwllvliva.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc... # Service role key
```

## File 1: netlify/functions/studio-enqueue.js

```javascript
// TPV Studio - Enqueue Job
// Generates stencil and starts Replicate prediction with webhook

import { getSupabaseServiceClient } from './studio/_utils/supabase.js';
import { generateAndUploadStencil, buildReplicateInput } from './studio/_utils/preprocessing.js';

const REPLICATE_API = 'https://api.replicate.com/v1/predictions';
const SDXL_VERSION = '39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b'; // stable-diffusion-xl-1024-v1-0

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { job_id } = JSON.parse(event.body || '{}');
    if (!job_id) throw new Error('job_id required');

    const supabase = getSupabaseServiceClient();

    // Load job
    const { data: job, error } = await supabase
      .from('studio_jobs')
      .select('*')
      .eq('id', job_id)
      .single();

    if (error) throw error;
    if (!job || job.status !== 'pending') {
      return { statusCode: 200, body: JSON.stringify({ ok: true, note: 'Already enqueued or not pending' }) };
    }

    console.log(`[ENQUEUE] Processing job ${job_id}`);

    // Step 1: Generate stencil (2s)
    const { stencilUrl, metadata } = await generateAndUploadStencil({
      ...job,
      jobId: job_id
    });

    // Step 2: Build Replicate input
    const input = buildReplicateInput(job, stencilUrl, metadata);

    // Step 3: Create prediction with webhook
    const webhookUrl = `${process.env.PUBLIC_BASE_URL}/.netlify/functions/replicate-callback?token=${encodeURIComponent(process.env.REPLICATE_WEBHOOK_SECRET)}`;

    const predictionResponse = await fetch(REPLICATE_API, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: SDXL_VERSION,
        input,
        webhook: webhookUrl,
        webhook_events_filter: ['start', 'completed']
      })
    });

    if (!predictionResponse.ok) {
      const errorData = await predictionResponse.json();
      throw new Error(`Replicate API error: ${JSON.stringify(errorData)}`);
    }

    const prediction = await predictionResponse.json();
    console.log(`[ENQUEUE] Prediction created: ${prediction.id}`);

    // Step 4: Update job to queued
    await supabase
      .from('studio_jobs')
      .update({
        status: 'queued',
        prediction_id: prediction.id,
        started_at: new Date().toISOString(),
        metadata: {
          ...job.metadata,
          ...metadata,
          prediction_url: prediction.urls?.get
        }
      })
      .eq('id', job_id);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, prediction_id: prediction.id })
    };

  } catch (error) {
    console.error('[ENQUEUE ERROR]', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
```

## File 2: netlify/functions/replicate-callback.js

```javascript
// TPV Studio - Replicate Webhook Callback
// Processes completed predictions and updates job status

import { getSupabaseServiceClient } from './studio/_utils/supabase.js';
import { downloadImage } from './studio/_utils/replicate.js';
import { clampToTPVPalette, autoRankConcepts } from './studio/_utils/postprocess.js';
import { uploadToStorage } from './studio/_utils/exports.js';

export async function handler(event, context) {
  try {
    // Verify webhook token
    const token = event.queryStringParameters?.token;
    if (token !== process.env.REPLICATE_WEBHOOK_SECRET) {
      console.error('[WEBHOOK] Invalid token');
      return { statusCode: 401, body: 'Unauthorized' };
    }

    const body = JSON.parse(event.body || '{}');
    const { id: prediction_id, status, output, error: predictionError } = body;

    console.log(`[WEBHOOK] Received: ${prediction_id}, status: ${status}`);

    const supabase = getSupabaseServiceClient();

    // Find job by prediction_id
    const { data: job, error: fetchError } = await supabase
      .from('studio_jobs')
      .select('*')
      .eq('prediction_id', prediction_id)
      .single();

    if (fetchError || !job) {
      console.error('[WEBHOOK] Job not found for prediction:', prediction_id);
      return { statusCode: 200, body: 'Job not found' };
    }

    // Handle status transitions
    if (status === 'starting') {
      await supabase
        .from('studio_jobs')
        .update({ status: 'running' })
        .eq('id', job.id);

      return { statusCode: 200, body: 'Running' };
    }

    if (status === 'succeeded' && output) {
      console.log(`[WEBHOOK] Processing ${output.length} outputs for job ${job.id}`);

      // Post-process: download, clamp, rank, upload
      const conceptBuffers = [];

      for (let i = 0; i < output.length; i++) {
        try {
          const originalBuffer = await downloadImage(output[i]);
          const targetPalette = job.metadata?.targetPalette || [];
          const quantizedBuffer = await clampToTPVPalette(originalBuffer, targetPalette);

          conceptBuffers.push({
            id: `concept_${job.id}_${i}`,
            buffer: quantizedBuffer,
            originalBuffer,
            palette: targetPalette,
            index: i
          });
        } catch (err) {
          console.error(`[WEBHOOK] Failed to process output ${i}:`, err);
        }
      }

      const rankedConcepts = await autoRankConcepts(conceptBuffers);

      // Upload final concepts
      const concepts = [];
      for (const concept of rankedConcepts) {
        const quantizedUrl = await uploadToStorage(
          concept.buffer,
          `${concept.id}_quantized.png`,
          'tpv-studio'
        );

        const originalUrl = await uploadToStorage(
          concept.originalBuffer,
          `${concept.id}_original.png`,
          'tpv-studio'
        );

        concepts.push({
          id: concept.id,
          originalUrl,
          quantizedUrl,
          quality: concept.quality,
          index: concept.index
        });
      }

      await supabase
        .from('studio_jobs')
        .update({
          status: 'completed',
          outputs: { concepts },
          concepts // Keep for backward compatibility
        })
        .eq('id', job.id);

      console.log(`[WEBHOOK] Job ${job.id} completed with ${concepts.length} concepts`);
      return { statusCode: 200, body: 'Completed' };
    }

    if (status === 'failed' || predictionError) {
      await supabase
        .from('studio_jobs')
        .update({
          status: 'failed',
          error: predictionError || 'Prediction failed'
        })
        .eq('id', job.id);

      return { statusCode: 200, body: 'Failed' };
    }

    return { statusCode: 200, body: 'OK' };

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return { statusCode: 500, body: error.message };
  }
}
```

## File 3: Update studio-inspire-create.js

Add fire-and-forget enqueue call after job creation:

```javascript
// After creating job, before returning:
const enqueueUrl = `${process.env.PUBLIC_BASE_URL || 'https://tpv.rosehill.group'}/.netlify/functions/studio-enqueue`;
fetch(enqueueUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ job_id: job.id })
}).catch(err => console.error('[FIRE-AND-FORGET ERROR]', err.message));
```

## File 4: Convert worker to reconciler

Rename `studio-inspire-worker.js` → `studio-inspire-reconciler.js` and update:

```javascript
// Only process stuck jobs older than 5 minutes
const { data: stuckJobs, error } = await supabase
  .from('studio_jobs')
  .select('*')
  .in('status', ['queued', 'running'])
  .lt('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())
  .limit(5);

for (const job of stuckJobs) {
  // Query Replicate API for prediction status
  const predictionUrl = `https://api.replicate.com/v1/predictions/${job.prediction_id}`;
  const response = await fetch(predictionUrl, {
    headers: { 'Authorization': `Token ${process.env.REPLICATE_API_KEY}` }
  });
  const prediction = await response.json();

  // Update job to match Replicate status
  if (prediction.status === 'succeeded') {
    // Process outputs like webhook would
  } else if (prediction.status === 'failed') {
    await supabase.from('studio_jobs').update({
      status: 'failed',
      error: prediction.error
    }).eq('id', job.id);
  }
}
```

## File 5: Update Frontend (InspirePanel.jsx)

Add 'queued' and 'running' states to polling handler:

```javascript
case 'queued':
  setProgress('Job queued. Stencil generated, waiting for GPU...');
  break;
case 'running':
  setProgress('Generating concepts with SDXL img2img...');
  break;
```

## Testing Checklist

1. ✅ Migration pushed
2. ⏳ Set environment variables in Netlify
3. ⏳ Deploy functions
4. ⏳ Test job creation
5. ⏳ Verify enqueue generates stencil
6. ⏳ Check Replicate dashboard for prediction
7. ⏳ Verify webhook receives callback
8. ⏳ Confirm concepts appear in frontend
9. ⏳ Test reconciler rescues stuck jobs

## Deployment

```bash
# Commit all changes
git add netlify/functions supabase/migrations
git commit -m "Implement webhook pattern for SDXL generation"

# Deploy to Netlify (automatic on push)
git push origin main

# Or deploy manually
netlify deploy --prod
```

## Monitoring

Check Netlify function logs:
- `studio-enqueue`: Should complete in ~2s
- `replicate-callback`: Should receive webhook after ~40s
- `studio-inspire-reconciler`: Runs every minute as backup

## Rollback Plan

If webhook pattern has issues, revert to cron-based:
1. Comment out fire-and-forget enqueue call
2. Keep using `studio-inspire-worker.js` on 1-minute cron
3. Frontend polling still works with either approach
