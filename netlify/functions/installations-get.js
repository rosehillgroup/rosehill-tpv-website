// Netlify Function: Get single installation for editing
// Returns English fields only

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
    return { statusCode: 204, headers };
  }
  
  // Only accept GET
  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }
  
  // Simple auth check
  const authHeader = event.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return { 
      statusCode: 401, 
      headers, 
      body: JSON.stringify({ error: 'Missing authorization' }) 
    };
  }
  
  // Get installation ID from query params
  const { id } = event.queryStringParameters || {};
  
  if (!id) {
    return { 
      statusCode: 400, 
      headers, 
      body: JSON.stringify({ error: 'Installation ID is required' }) 
    };
  }
  
  try {
    // Create Sanity client
    const { createClient } = await import('@sanity/client');
    const sanity = createClient({
      projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      token: process.env.SANITY_WRITE_TOKEN,
      useCdn: false
    });
    
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
      return { 
        statusCode: 404, 
        headers, 
        body: JSON.stringify({ error: 'Installation not found' }) 
      };
    }
    
    console.log('Installation retrieved:', { 
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
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(formData)
    };
    
  } catch (error) {
    console.error('Error fetching installation:', { 
      error: error.message,
      id 
    });
    
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: 'Failed to fetch installation: ' + error.message }) 
    };
  }
}