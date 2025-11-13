// TPV Studio - API Client (Recraft Vector AI)
import { API_ENDPOINTS } from '../constants.js';

class APIClient {
  // ============================================================================
  // RECRAFT VECTOR AI (Current)
  // ============================================================================

  /**
   * Generate vector design using Recraft AI
   * @param {object} request - Generation request
   * @param {string} request.prompt - Design description
   * @param {number} request.lengthMM - Surface length in mm
   * @param {number} request.widthMM - Surface width in mm
   * @param {number} request.maxColours - Maximum colors (3-8)
   * @param {number} request.seed - Optional seed for reproducibility
   * @returns {Promise} { success, jobId, status, estimatedDuration }
   */
  async generateRecraft(request) {
    const payload = {
      prompt: request.prompt,
      width_mm: request.widthMM || 5000,
      length_mm: request.lengthMM || 5000,
      max_colours: request.maxColours || 6,
      seed: request.seed || null
    };

    const response = await fetch('/api/recraft-generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Recraft generation failed');
    }

    return response.json();
  }

  /**
   * Get Recraft job status with enhanced retry/compliance info
   * @param {string} jobId - Job ID
   * @returns {Promise} Status object with recraft-specific fields
   */
  async getRecraftStatus(jobId) {
    const response = await fetch(`/api/studio-job-status?jobId=${jobId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Status fetch failed');
    }

    return response.json();
  }

  /**
   * Poll Recraft job until completion
   * @param {string} jobId - Job ID
   * @param {function} onProgress - Progress callback (receives status object)
   * @param {number} pollInterval - Polling interval in ms (default: 2000)
   * @returns {Promise} Final status object
   */
  async waitForRecraftCompletion(jobId, onProgress = null, pollInterval = 2000) {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getRecraftStatus(jobId);

          if (onProgress) {
            onProgress(status);
          }

          if (status.status === 'completed') {
            // Check for SVG output
            const hasSvgOutput = status.result?.svg_url;

            if (hasSvgOutput) {
              console.log('[API] Recraft job complete with SVG output');
              resolve(status);
            } else {
              console.error('[API] Recraft job completed but no SVG output');
              reject(new Error('Job completed but no output received'));
            }
          } else if (status.status === 'failed') {
            // Failed jobs may still have output (non-compliant designs)
            if (status.result?.svg_url) {
              console.warn('[API] Job failed compliance but has output (non-compliant)');
              resolve(status); // Resolve with warning
            } else {
              reject(new Error(status.error || 'Job failed'));
            }
          } else if (status.status === 'retrying') {
            // Still retrying, continue polling
            console.log(`[API] Retrying: ${status.recraft?.attempt_current}/${status.recraft?.attempt_max}`);
            setTimeout(poll, pollInterval);
          } else {
            // Still pending, queued, or running
            setTimeout(poll, pollInterval);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  // ============================================================================
  // LEGACY METHODS (Deprecated - kept for backwards compatibility)
  // ============================================================================

  /**
   * @deprecated Use generateRecraft() instead
   * TPV Studio - Flux Dev Generation (LEGACY)
   */
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

    const response = await fetch('/api/studio-inspire-simple', {
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
    const response = await fetch(`/api/studio-job-status?jobId=${jobId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Status fetch failed');
    }

    return response.json();
  }

  // Helper: Poll simple mode job until completion (JPG output)
  async inspireSimpleWaitForCompletion(jobId, onProgress = null, pollInterval = 2000) {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.inspireSimpleGetStatus(jobId);

          if (onProgress) {
            onProgress(status);
          }

          if (status.status === 'completed') {
            // Job complete - check for JPG output
            const hasRasterOutput = status.result?.final_url;

            if (hasRasterOutput) {
              console.log('[API] Job complete with JPG output, resolving');
              resolve(status);
            } else {
              // No output - something went wrong
              console.log('[API] Job completed but no output received');
              reject(new Error('Job completed but no output received'));
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

  /**
   * @deprecated Legacy vectorization - no longer used
   * TPV Studio 2.0 - Draftify Stage (LEGACY)
   */
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

  /**
   * @deprecated Use generateRecraft() instead
   * TPV Studio 3.0 - Geometric Generator (LEGACY)
   */
  async generateGeometric(request) {
    const payload = {
      brief: request.prompt || request.brief,
      canvas: {
        width_mm: request.lengthMM || 5000,
        height_mm: request.widthMM || 5000
      },
      options: {
        mood: request.mood || 'playful',
        composition: request.composition || 'mixed',
        colorCount: request.maxColours || request.colorCount || 5,
        seed: request.seed
      },
      validate: true
    };

    const response = await fetch(API_ENDPOINTS.GEOMETRIC_GENERATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Geometric generation failed');
    }

    return response.json();
  }
}

export const apiClient = new APIClient();
