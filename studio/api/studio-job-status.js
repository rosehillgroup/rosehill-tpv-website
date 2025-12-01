// TPV Studio - Get Job Status (Vercel)
// Polls studio_jobs table for job status with Replicate reconciliation

import { getSupabaseServiceClient, getAuthenticatedClient } from './_utils/supabase.js';
import { ensureOwnership } from './_utils/authorization.js';
import { getPrediction, downloadImage } from './_utils/replicate.js';
import { cropPadToExactAR, makeThumbnail } from './_utils/image.js';
import { uploadToStorage } from './_utils/exports.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const jobId = req.query.jobId;

    if (!jobId) {
      return res.status(400).json({ error: 'jobId parameter is required' });
    }

    // Authenticate user
    const { client, user } = await getAuthenticatedClient(req);

    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Use service client for operations but verify ownership first
    const supabase = getSupabaseServiceClient();

    // Verify user owns this job
    const job = await ensureOwnership(supabase, 'studio_jobs', jobId, user.id);

    if (!job) {
      return res.status(403).json({ error: 'Access denied: You do not own this job' });
    }

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
                outputs: {
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
            return res.status(200).json({
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
            });
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

            return res.status(200).json({
              jobId: job.id,
              status: 'failed',
              error: prediction.error || 'Prediction failed'
            });
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

    // Build base response
    const response = {
      jobId: updatedJob.id,
      status: updatedJob.status,
      result: updatedJob.outputs,
      error: updatedJob.error,
      metadata: updatedJob.metadata
    };

    // Add Recraft-specific fields if this is a Recraft vector job
    if (updatedJob.mode_type === 'recraft_vector') {
      response.recraft = {
        attempt_current: updatedJob.attempt_current || 0,
        attempt_max: updatedJob.attempt_max || 3,
        compliant: updatedJob.compliant,
        validation_history: updatedJob.validation_history || [],
        all_attempts: updatedJob.all_attempt_urls || [],
        inspector_reasons: updatedJob.inspector_final_reasons || [],
        max_colours: updatedJob.max_colours || 6
      };

      // Add helpful status messages based on attempt progress
      if (updatedJob.status === 'retrying') {
        response.progress_message = `Quality check ${updatedJob.attempt_current}/${updatedJob.attempt_max} - refining design...`;
      } else if (updatedJob.status === 'completed' && updatedJob.compliant) {
        response.progress_message = `✓ Design passed compliance checks`;
      } else if (updatedJob.status === 'failed' && updatedJob.compliant === false) {
        response.progress_message = `⚠ Best-effort design (did not pass all checks)`;
      }
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('[JOB-STATUS ERROR]', error.message);
    return res.status(500).json({
      error: 'An error occurred while fetching job status'
    });
  }
}
