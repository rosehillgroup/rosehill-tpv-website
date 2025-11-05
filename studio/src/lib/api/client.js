// TPV Studio - API Client
import { API_ENDPOINTS } from '../constants.js';

class APIClient {
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
}

export const apiClient = new APIClient();
