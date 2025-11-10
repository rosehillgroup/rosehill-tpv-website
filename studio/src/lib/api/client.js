// TPV Studio - API Client (Flux Dev)
import { API_ENDPOINTS } from '../constants.js';

class APIClient {
  // TPV Studio - Flux Dev Generation
  // Create a Flux Dev job with new parameters
  async inspireSimpleCreateJob(request) {
    // Transform request from frontend format to backend format
    const payload = {
      prompt: request.prompt,
      surface: {
        width_mm: request.lengthMM || 5000,
        height_mm: request.widthMM || 5000
      },
      max_colours: request.maxColours || 6,
      try_simpler: request.trySimpler || false
    };

    // Add optional seed if provided
    if (request.seed) {
      payload.seed = request.seed;
    }

    const response = await fetch('/.netlify/functions/studio-inspire-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Job creation failed');
    }

    return response.json();
  }

  // Poll simple mode job status until completed or failed
  async inspireSimpleGetStatus(jobId) {
    const response = await fetch(`/.netlify/functions/studio-job-status?jobId=${jobId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Status fetch failed');
    }

    return response.json();
  }

  // Helper: Poll simple mode job until completion (with vectorization support)
  async inspireSimpleWaitForCompletion(jobId, onProgress = null, pollInterval = 2000) {
    return new Promise((resolve, reject) => {
      let completedAt = null;
      const maxWaitAfterCompletion = 35000; // Wait up to 35s for vectorization after completion (takes ~24s)

      const poll = async () => {
        try {
          const status = await this.inspireSimpleGetStatus(jobId);

          if (onProgress) {
            onProgress(status);
          }

          if (status.status === 'completed') {
            // Mark when we first saw completion
            if (!completedAt) {
              completedAt = Date.now();
            }

            // Check if vectorization is complete
            // Note: API returns outputs as "result", not "outputs"
            console.log('[API] Checking for vectorization:', {
              result: status.result,
              metadata_vectorization: status.metadata?.vectorization,
              has_result_svg: !!status.result?.svg_url,
              has_metadata_svg: !!status.metadata?.vectorization?.svg_url
            });
            const hasVectorization = status.result?.svg_url || status.metadata?.vectorization?.svg_url;

            if (hasVectorization) {
              // Vectorization complete - resolve immediately
              console.log('[API] Vectorization complete, resolving');
              resolve(status);
            } else {
              // Check if we've waited long enough for vectorization
              const waitTime = Date.now() - completedAt;

              if (waitTime >= maxWaitAfterCompletion) {
                // Timeout - resolve anyway (vectorization may have failed or is still running)
                console.log('[API] Vectorization timeout, resolving without vectors');
                resolve(status);
              } else {
                // Keep polling for vectorization
                console.log(`[API] Waiting for vectorization... (${Math.round(waitTime / 1000)}s)`);
                setTimeout(poll, pollInterval);
              }
            }
          } else if (status.status === 'failed') {
            reject(new Error(status.error || 'Job failed'));
          } else {
            // Still pending or processing, continue polling
            setTimeout(poll, pollInterval);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  // TPV Studio 2.0 - Draftify Stage
  // Vectorize concept into installable design
  async draftify(request) {
    const response = await fetch(API_ENDPOINTS.DRAFTIFY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Vectorization failed');
    }

    return response.json();
  }
}

export const apiClient = new APIClient();
