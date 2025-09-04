// Netlify Function: Get single installation for editing
// Returns English fields only

import { createClient } from '@sanity/client';
import { requireEditorRole, errorResponse, successResponse, safeLog } from './_utils/auth.js';

// Initialize Sanity client
const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_TOKEN,
  useCdn: false
});

/**
 * Generate CORS headers with proper origin handling
 */
function corsHeaders(origin) {
  const allowed = process.env.ALLOWED_ORIGIN || origin || '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type'
  };
}

/**
 * Main handler
 */
export async function handler(event, context) {
  const headers = corsHeaders(event.headers.origin);
  
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }
  
  safeLog('Get installation request', {
    method: event.httpMethod,
    params: event.queryStringParameters
  });
  
  // Only accept GET
  if (event.httpMethod !== 'GET') {
    return errorResponse('Method not allowed', 405, headers);
  }
  
  // Validate authentication
  const auth = await requireEditorRole(event, process.env.ALLOWED_ORIGIN);
  if (!auth.ok) {
    return errorResponse(auth.msg, auth.status, headers);
  }
  
  // Get installation ID from query params
  const { id } = event.queryStringParameters || {};
  
  if (!id) {
    return errorResponse('Installation ID is required', 400, headers);
  }
  
  try {
    // Query for the installation
    // Return only English fields for the edit form
    const query = `*[_type == "installation" && _id == $id][0] {
      _id,
      title,
      "slug": slug.current,
      installationDate,
      application,
      location {
        city,
        country
      },
      overview,
      thanksTo,
      "coverImage": coverImage {
        "assetId": asset._ref,
        "url": asset->url,
        alt
      },
      "gallery": gallery[] {
        "assetId": asset._ref,
        "url": asset->url,
        alt
      },
      seo {
        title,
        description
      },
      publishedLocales,
      translationStatus
    }`;
    
    const installation = await sanity.fetch(query, { id });
    
    if (!installation) {
      return errorResponse('Installation not found', 404, headers);
    }
    
    safeLog('Installation retrieved', { 
      id: installation._id,
      title: installation.title 
    });
    
    // Transform the data for the form
    const formData = {
      id: installation._id,
      title: installation.title || '',
      slug: installation.slug || '',
      installationDate: installation.installationDate || '',
      application: installation.application || '',
      location: {
        city: installation.location?.city || '',
        country: installation.location?.country || ''
      },
      // Convert Portable Text to plain paragraphs for the form
      overview: installation.overview?.map(block => 
        block.children?.map(child => child.text).join('') || ''
      ).filter(text => text) || [],
      thanksTo: installation.thanksTo?.map(block => 
        block.children?.map(child => child.text).join('') || ''
      ).filter(text => text) || [],
      coverImage: installation.coverImage || null,
      gallery: installation.gallery || [],
      seo: {
        title: installation.seo?.title || '',
        description: installation.seo?.description || ''
      },
      publishedLocales: installation.publishedLocales || ['en'],
      translationStatus: installation.translationStatus || {}
    };
    
    return successResponse(formData, 200, headers);
    
  } catch (error) {
    safeLog('Error fetching installation', { 
      error: error.message,
      id 
    });
    
    return errorResponse('Failed to fetch installation: ' + error.message, 500, headers);
  }
}