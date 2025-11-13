// Recraft Webhook Handler - Simple Immediate Completion
// Processes Replicate callbacks for Recraft SVG generation
// Customer decides if design is suitable

import { downloadSvg } from './client.js';
import { quickSvgCheck } from './inspector.js';
import { generatePreviewSet, extractSvgMetadata } from '../svg/renderer.js';
import { uploadToStorage } from '../exports.js';

/**
 * Handle successful Recraft prediction - immediate completion
 * Customer decides if design is suitable
 * @param {object} res - Express response object
 * @param {object} supabase - Supabase client
 * @param {object} job - Job record from database
 * @param {array} output - Replicate output array
 * @returns {Promise<void>}
 */
export async function handleRecraftSuccess(res, supabase, job, output) {
  const jobId = job.id;
  const attempt = 1;

  console.log(`[RECRAFT-WEBHOOK] Processing generation for job ${jobId}`);

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
    const quickCheck = quickSvgCheck(svgString);
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

    // Update attempt URLs
    const allAttemptUrls = job.all_attempt_urls || [];
    allAttemptUrls.push({
      attempt,
      svg_url: svgUpload.publicUrl,
      png_url: pngUpload.publicUrl,
      thumb_url: thumbUpload.publicUrl,
      metadata: svgMetadata,
      quick_check: quickCheck
    });

    console.log(`[RECRAFT-WEBHOOK] Generation complete`);

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
        compliant: null, // Customer decides
        attempt_current: attempt,
        all_attempt_urls: allAttemptUrls,
        inspector_final_reasons: [],
        outputs: {
          svg_url: finalSvg.publicUrl,
          png_url: finalPng.publicUrl,
          thumbnail_url: finalThumb.publicUrl,
          metadata: svgMetadata,
          quick_check: quickCheck
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    console.log(`[RECRAFT-WEBHOOK] Job ${jobId} marked as completed`);

    return res.status(200).json({
      ok: true,
      status: 'completed',
      attempt
    });
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
