// TPV Studio - Get Job Status
// Polls studio_jobs table for job status with Replicate reconciliation

import { getSupabaseServiceClient } from './studio/_utils/supabase.js';
import { getPrediction } from './studio/_utils/replicate.js';
import { downloadImage } from './studio/_utils/replicate.js';
import { cropPadToExactAR, makeThumbnail } from './studio/_utils/image.js';
import { uploadToStorage } from './studio/_utils/exports.js';

export const handler = async (event, context) => {
  // Dynamic import of ESM utilities
  
  

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const jobId = event.queryStringParameters?.jobId;

    if (!jobId) {
      throw new Error('jobId parameter is required');
    }

    const supabase = getSupabaseServiceClient();

    // Get job status
    const { data: job, error } = await supabase
      .from('studio_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) throw error;
    if (!job) throw new Error('Job not found');

    // Reconciliation: If job is stuck in queued/running and has a prediction_id,
    // fetch actual status from Replicate and update if webhook was missed
    if ((job.status === 'queued' || job.status === 'running') && job.prediction_id) {
      const startedAt = new Date(job.started_at || job.created_at);
      const ageMinutes = (Date.now() - startedAt.getTime()) / 1000 / 60;

      // If job is older than 2 minutes, check Replicate status
      if (ageMinutes > 2) {
        console.log(`[JOB-STATUS] Reconciling job ${jobId} (age: ${ageMinutes.toFixed(1)}min)`);

        try {
          const prediction = await getPrediction(job.prediction_id);

          console.log(`[JOB-STATUS] Replicate status: ${prediction.status}`);

          // If Replicate shows succeeded but our DB shows queued/running, webhook was missed
          if (prediction.status === 'succeeded' && prediction.output) {
            console.log(`[JOB-STATUS] Webhook missed! Triggering manual completion for job ${jobId}`);

            // Manually trigger the same completion logic as webhook
            
            
            

            // Download and process image
            const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
            const rawBuffer = await downloadImage(imageUrl);

            const targetW = job.metadata?.target_dims?.w || 2000;
            const targetH = job.metadata?.target_dims?.h || 2000;

            const croppedBuffer = await cropPadToExactAR(rawBuffer, { targetW, targetH });
            const thumbnailBuffer = await makeThumbnail(croppedBuffer, 512);

            const finalFilename = `final_${job.id}_${Date.now()}.jpg`;
            const thumbFilename = `thumb_${job.id}_${Date.now()}.jpg`;

            const finalUpload = await uploadToStorage(croppedBuffer, finalFilename, {
              lifecycle: 'final',
              jobId: job.id,
              contentType: 'image/jpeg'
            });

            const thumbUpload = await uploadToStorage(thumbnailBuffer, thumbFilename, {
              lifecycle: 'final',
              jobId: job.id,
              contentType: 'image/jpeg'
            });

            // Update job to completed
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
                    gen: { w: job.metadata?.gen_dims?.w || targetW, h: job.metadata?.gen_dims?.h || targetH },
                    final: { w: targetW, h: targetH }
                  }
                },
                metadata: {
                  ...job.metadata,
                  reconciled: true,
                  reconciliation_time: new Date().toISOString()
                }
              })
              .eq('id', job.id);

            console.log(`[JOB-STATUS] Job ${jobId} reconciled and marked complete`);

            // Return updated status
            return {
              statusCode: 200,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jobId: job.id,
                status: 'completed',
                result: {
                  final_url: finalUpload.publicUrl,
                  thumbnail_url: thumbUpload.publicUrl,
                  raw_output: imageUrl,
                  dimensions: {
                    target: { w: targetW, h: targetH },
                    gen: { w: job.metadata?.gen_dims?.w || targetW, h: job.metadata?.gen_dims?.h || targetH },
                    final: { w: targetW, h: targetH }
                  }
                },
                metadata: { ...job.metadata, reconciled: true }
              })
            };
          } else if (prediction.status === 'failed' || prediction.error) {
            // Update job to failed
            await supabase
              .from('studio_jobs')
              .update({
                status: 'failed',
                error: prediction.error || 'Prediction failed',
                completed_at: new Date().toISOString()
              })
              .eq('id', job.id);

            console.log(`[JOB-STATUS] Job ${jobId} marked as failed (reconciled)`);

            return {
              statusCode: 200,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jobId: job.id,
                status: 'failed',
                error: prediction.error || 'Prediction failed'
              })
            };
          } else if (prediction.status === 'processing' || prediction.status === 'starting') {
            // Still running, update status to running
            await supabase
              .from('studio_jobs')
              .update({ status: 'running' })
              .eq('id', job.id);

            console.log(`[JOB-STATUS] Job ${jobId} is still running on Replicate`);
          }
        } catch (reconcileError) {
          console.error(`[JOB-STATUS] Reconciliation failed for job ${jobId}:`, reconcileError);
          // Don't throw - just return current status
        }
      }
    }

    // Return current status from DB (may have been updated by reconciliation)
    const { data: updatedJob } = await supabase
      .from('studio_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId: updatedJob.id,
        status: updatedJob.status,
        result: updatedJob.result,
        error: updatedJob.error,
        metadata: updatedJob.metadata
      })
    };

  } catch (error) {
    console.error('[JOB-STATUS ERROR]', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
