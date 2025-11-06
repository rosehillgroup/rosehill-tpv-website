// TPV Studio - API Client
import { API_ENDPOINTS } from '../constants.js';

class APIClient {
  // Legacy methods (deprecated)
  async designPlan(request) {
    const response = await fetch(API_ENDPOINTS.DESIGN_PLAN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Design planning failed');
    }

    return response.json();
  }

  async designGenerate(spec, variants = 3) {
    const response = await fetch(API_ENDPOINTS.DESIGN_GENERATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ spec, variants })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Design generation failed');
    }

    return response.json();
  }

  // TPV Studio 2.0 - Inspire Stage (Async Job Pattern)
  // Create job and return jobId immediately (no timeout)
  async inspireCreateJob(request) {
    const response = await fetch('/.netlify/functions/studio-inspire-create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Job creation failed');
    }

    return response.json();
  }

  // Poll job status until completed or failed
  async inspireGetStatus(jobId) {
    const response = await fetch(`/.netlify/functions/studio-inspire-status?jobId=${jobId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Status fetch failed');
    }

    return response.json();
  }

  // Helper: Poll job until completion
  async inspireWaitForCompletion(jobId, onProgress = null, pollInterval = 2000) {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.inspireGetStatus(jobId);

          if (onProgress) {
            onProgress(status);
          }

          if (status.status === 'completed') {
            resolve(status);
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

  // Legacy synchronous method (deprecated, kept for backward compatibility)
  async inspire(request) {
    const response = await fetch(API_ENDPOINTS.INSPIRE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Concept generation failed');
    }

    return response.json();
  }

  // TPV Studio Inspiration Mode - Simple Mode
  // Create a simple mode job
  async inspireSimpleCreateJob(request) {
    const response = await fetch('/.netlify/functions/studio-inspire-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
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

  // Helper: Poll simple mode job until completion
  async inspireSimpleWaitForCompletion(jobId, onProgress = null, pollInterval = 2000) {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.inspireSimpleGetStatus(jobId);

          if (onProgress) {
            onProgress(status);
          }

          if (status.status === 'completed') {
            resolve(status);
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
