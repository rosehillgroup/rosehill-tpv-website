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

  // TPV Studio 2.0 - Inspire Stage
  // Generate AI concept images using FLUX.1 [pro]
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
