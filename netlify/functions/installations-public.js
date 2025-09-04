// Public API to get installations for the main website
// No auth required, returns published installations only

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

export async function handler(event, context) {
  const headers = corsHeaders(event.headers.origin);
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }
  
  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }
  
  try {
    const { createClient } = await import('@sanity/client');
    const sanity = createClient({
      projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      useCdn: true // Use CDN for public reads
    });
    
    // Get all published installations
    const query = `*[_type == "installation"] | order(installationDate desc) {
      _id,
      title,
      "slug": slug.current,
      installationDate,
      application,
      location,
      overview,
      thanksTo,
      "coverImage": coverImage {
        "url": asset->url,
        alt
      },
      "gallery": gallery[] {
        "url": asset->url,
        alt
      },
      seo,
      publishedLocales,
      
      // Translation fields
      title__es, title__fr, title__de,
      overview__es, overview__fr, overview__de,
      thanksTo__es, thanksTo__fr, thanksTo__de,
      "location__es": location.city__es + ", " + location.country__es,
      "location__fr": location.city__fr + ", " + location.country__fr,
      "location__de": location.city__de + ", " + location.country__de
    }`;
    
    const installations = await sanity.fetch(query);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        installations: installations,
        count: installations.length,
        generated: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('Error fetching installations:', error.message);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: 'Failed to fetch installations' }) 
    };
  }
}