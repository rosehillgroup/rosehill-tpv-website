// Recraft Webhook Handler - Inspector Loop & Retry Logic
// Processes Replicate callbacks for Recraft SVG generation with compliance validation

import { downloadSvg, generateRecraftSvg } from './client.js';
import { inspectSvgCompliance, quickSvgCheck } from './inspector.js';
import { generatePreviewSet, extractSvgMetadata } from '../svg/renderer.js';
import { uploadToStorage } from '../exports.js';

/**
 * Handle successful Recraft prediction with inspector loop
 * @param {object} res - Express response object
 * @param {object} supabase - Supabase client
 * @param {object} job - Job record from database
 * @param {array} output - Replicate output array
 * @returns {Promise<void>}
 */
export async function handleRecraftSuccess(res, supabase, job, output) {
  const jobId = job.id;
  const attempt = (job.attempt_current || 0) + 1;
  const maxAttempts = job.attempt_max || 3;

  console.log(`[RECRAFT-WEBHOOK] Processing attempt ${attempt}/${maxAttempts} for job ${jobId}`);

  try {
    // Extract SVG URL from Replicate output
    // Output format may vary - check for SVG in output array
    let svgUrl = null;

    if (Array.isArray(output) && output.length > 0) {
      // Could be direct URL or object with file_url
      svgUrl = typeof output[0] === 'string' ? output[0] : output[0]?.file_url || output[0]?.url;
    } else if (typeof output === 'string') {
      svgUrl = output;
    } else if (output?.file_url || output?.url) {
      svgUrl = output.file_url || output.url;
    }

    if (!svgUrl) {
      throw new Error('No SVG URL found in Replicate output');
    }

    console.log(`[RECRAFT-WEBHOOK] SVG URL: ${svgUrl}`);

    // Download SVG
    const svgString = await downloadSvg(svgUrl);

    // Extract metadata
    const svgMetadata = extractSvgMetadata(svgString);
    console.log(`[RECRAFT-WEBHOOK] SVG metadata:`, svgMetadata);

    // Quick preliminary check
    const quickCheck = quickSvgCheck(svgString, job.max_colours || 6);
    console.log(`[RECRAFT-WEBHOOK] Quick check:`, quickCheck);

    // Generate PNG previews
    const { preview, thumbnail } = await generatePreviewSet(svgString);

    // Upload current attempt files
    const attemptPrefix = `recraft/${jobId}/attempt_${attempt}`;

    const svgUpload = await uploadToStorage(
      Buffer.from(svgString, 'utf-8'),
      `${attemptPrefix}/design.svg`,
      { lifecycle: 'temp' }
    );

    const pngUpload = await uploadToStorage(
      preview,
      `${attemptPrefix}/design.png`,
      { lifecycle: 'temp' }
    );

    const thumbUpload = await uploadToStorage(
      thumbnail,
      `${attemptPrefix}/thumb.png`,
      { lifecycle: 'temp' }
    );

    console.log(`[RECRAFT-WEBHOOK] Uploaded attempt ${attempt} files`);

    // Run inspector with Claude Haiku
    let inspectorResult;

    try {
      inspectorResult = await inspectSvgCompliance({
        userPrompt: job.prompt,
        svgString,
        previewPng: preview,
        width_mm: job.width_mm,
        length_mm: job.length_mm,
        max_colours: job.max_colours || 6
      });
    } catch (inspectorError) {
      console.error('[RECRAFT-WEBHOOK] Inspector failed:', inspectorError);

      // Fail-safe: mark as non-compliant if inspector errors
      inspectorResult = {
        pass: false,
        reasons: ['Inspector technical error: ' + inspectorError.message],
        suggested_prompt_correction: 'simplify design significantly',
        elapsed: 0
      };
    }

    // Update validation history
    const validationHistory = job.validation_history || [];
    validationHistory.push({
      attempt,
      pass: inspectorResult.pass,
      reasons: inspectorResult.reasons,
      correction: inspectorResult.suggested_prompt_correction,
      timestamp: new Date().toISOString(),
      elapsed_ms: inspectorResult.elapsed
    });

    // Update attempt URLs
    const allAttemptUrls = job.all_attempt_urls || [];
    allAttemptUrls.push({
      attempt,
      svg_url: svgUpload.publicUrl,
      png_url: pngUpload.publicUrl,
      thumb_url: thumbUpload.publicUrl,
      passed: inspectorResult.pass,
      metadata: svgMetadata,
      quick_check: quickCheck
    });

    // Decision point: pass, retry, or fail
    if (inspectorResult.pass) {
      // SUCCESS - Design passed compliance
      console.log(`[RECRAFT-WEBHOOK] ✓ Design PASSED compliance on attempt ${attempt}`);

      // Upload final files
      const finalPrefix = `recraft/${jobId}/final`;

      const finalSvg = await uploadToStorage(
        Buffer.from(svgString, 'utf-8'),
        `${finalPrefix}/design.svg`,
        { lifecycle: 'final' }
      );

      const finalPng = await uploadToStorage(
        preview,
        `${finalPrefix}/design.png`,
        { lifecycle: 'final' }
      );

      const finalThumb = await uploadToStorage(
        thumbnail,
        `${finalPrefix}/thumb.png`,
        { lifecycle: 'final' }
      );

      // Update job as completed
      await supabase
        .from('studio_jobs')
        .update({
          status: 'completed',
          compliant: true,
          attempt_current: attempt,
          validation_history: validationHistory,
          all_attempt_urls: allAttemptUrls,
          inspector_final_reasons: [],
          outputs: {
            svg_url: finalSvg.publicUrl,
            png_url: finalPng.publicUrl,
            thumbnail_url: finalThumb.publicUrl,
            metadata: svgMetadata
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      console.log(`[RECRAFT-WEBHOOK] Job ${jobId} marked as completed`);

      return res.status(200).json({ ok: true, status: 'completed', attempt });
    } else if (attempt < maxAttempts) {
      // RETRY - Design failed but we have attempts left
      console.log(`[RECRAFT-WEBHOOK] ⚠ Design FAILED compliance, retrying (${attempt}/${maxAttempts})`);
      console.log(`[RECRAFT-WEBHOOK] Issues: ${inspectorResult.reasons.join(', ')}`);
      console.log(`[RECRAFT-WEBHOOK] Correction: ${inspectorResult.suggested_prompt_correction}`);

      // Update job to retrying status
      await supabase
        .from('studio_jobs')
        .update({
          status: 'retrying',
          attempt_current: attempt,
          validation_history: validationHistory,
          all_attempt_urls: allAttemptUrls,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      // Build webhook URL for next attempt
      const baseUrl = process.env.PUBLIC_BASE_URL;
      const webhookToken = process.env.REPLICATE_WEBHOOK_SECRET;
      const webhookUrl = `${baseUrl}/api/replicate-callback?token=${webhookToken}`;

      // Trigger new Recraft generation with correction
      const nextPrediction = await generateRecraftSvg({
        prompt: job.prompt,
        width_mm: job.width_mm,
        length_mm: job.length_mm,
        max_colours: job.max_colours || 6,
        seed: job.metadata?.seed + attempt, // Vary seed slightly
        correction: inspectorResult.suggested_prompt_correction,
        webhook: webhookUrl,
        jobId
      });

      console.log(`[RECRAFT-WEBHOOK] Started retry attempt ${attempt + 1}: ${nextPrediction.predictionId}`);

      // Update job with new prediction ID
      await supabase
        .from('studio_jobs')
        .update({
          metadata: {
            ...job.metadata,
            prediction_id: nextPrediction.predictionId,
            last_correction: inspectorResult.suggested_prompt_correction
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      return res.status(200).json({ ok: true, status: 'retrying', attempt });
    } else {
      // FAILED - Max attempts reached
      console.log(`[RECRAFT-WEBHOOK] ✗ Design FAILED after ${maxAttempts} attempts`);
      console.log(`[RECRAFT-WEBHOOK] Final issues: ${inspectorResult.reasons.join(', ')}`);

      // Upload last attempt as final (marked non-compliant)
      const finalPrefix = `recraft/${jobId}/final`;

      const finalSvg = await uploadToStorage(
        Buffer.from(svgString, 'utf-8'),
        `${finalPrefix}/design.svg`,
        { lifecycle: 'final' }
      );

      const finalPng = await uploadToStorage(
        preview,
        `${finalPrefix}/design.png`,
        { lifecycle: 'final' }
      );

      const finalThumb = await uploadToStorage(
        thumbnail,
        `${finalPrefix}/thumb.png`,
        { lifecycle: 'final' }
      );

      // Update job as failed (but with outputs)
      await supabase
        .from('studio_jobs')
        .update({
          status: 'failed',
          compliant: false,
          attempt_current: attempt,
          validation_history: validationHistory,
          all_attempt_urls: allAttemptUrls,
          inspector_final_reasons: inspectorResult.reasons,
          outputs: {
            svg_url: finalSvg.publicUrl,
            png_url: finalPng.publicUrl,
            thumbnail_url: finalThumb.publicUrl,
            metadata: svgMetadata,
            warning: 'This design did not pass compliance checks and is not production-ready'
          },
          error: `Failed compliance after ${maxAttempts} attempts: ${inspectorResult.reasons.join('; ')}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      console.log(`[RECRAFT-WEBHOOK] Job ${jobId} marked as failed (non-compliant)`);

      return res.status(200).json({ ok: true, status: 'failed', attempt });
    }
  } catch (error) {
    console.error(`[RECRAFT-WEBHOOK] Error processing attempt ${attempt}:`, error);

    // Update job with error
    await supabase
      .from('studio_jobs')
      .update({
        status: 'failed',
        error: error.message,
        attempt_current: attempt,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    return res.status(500).json({
      ok: false,
      error: error.message,
      attempt
    });
  }
}
