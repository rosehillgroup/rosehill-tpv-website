// Netlify Function: List installations for admin dashboard
// Returns paginated list with search capability

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
  
  // Parse query parameters
  const {
    search = '',
    page = '1',
    limit = '50',
    sortBy = 'date',
    sortOrder = 'desc'
  } = event.queryStringParameters || {};
  
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = Math.min(parseInt(limit, 10) || 50, 100); // Max 100 per page
  const offset = (pageNum - 1) * limitNum;
  
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
    
    // Build search filter
    let searchFilter = '';
    if (search) {
      // Escape special characters for GROQ
      const searchTerm = search.replace(/['"\\]/g, '\\$&');
      searchFilter = ` && (
        title match "*${searchTerm}*" || 
        location.city match "*${searchTerm}*" || 
        location.country match "*${searchTerm}*" ||
        application match "*${searchTerm}*"
      )`;
    }
    
    // Build sort clause
    let sortClause = '';
    switch (sortBy) {
      case 'title':
        sortClause = `| order(title ${sortOrder})`;
        break;
      case 'location':
        sortClause = `| order(location.city ${sortOrder}, location.country ${sortOrder})`;
        break;
      case 'application':
        sortClause = `| order(application ${sortOrder})`;
        break;
      case 'date':
      default:
        sortClause = `| order(installationDate ${sortOrder})`;
        break;
    }
    
    // Count total matching documents
    const countQuery = `count(*[_type == "installation"${searchFilter}])`;
    const totalCount = await sanity.fetch(countQuery);
    
    // Fetch paginated results
    const listQuery = `*[_type == "installation"${searchFilter}]${sortClause}[${offset}...${offset + limitNum}] {
      _id,
      title,
      "slug": slug.current,
      installationDate,
      application,
      location {
        city,
        country
      },
      "imageCount": count(gallery) + 1,
      publishedLocales,
      translationStatus
    }`;
    
    const items = await sanity.fetch(listQuery);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    
    safeLog('Installations listed', {
      total: totalCount,
      page: pageNum,
      returned: items.length
    });
    
    // Format response
    const response = {
      items: items.map(item => ({
        id: item._id,
        title: item.title || 'Untitled',
        slug: item.slug || '',
        installationDate: item.installationDate || '',
        application: item.application || 'Other',
        city: item.location?.city || '',
        country: item.location?.country || '',
        imageCount: item.imageCount || 0,
        publishedLocales: item.publishedLocales || ['en'],
        hasTranslations: {
          es: item.publishedLocales?.includes('es') || false,
          fr: item.publishedLocales?.includes('fr') || false,
          de: item.publishedLocales?.includes('de') || false
        },
        translationStatus: item.translationStatus || {}
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      filters: {
        search,
        sortBy,
        sortOrder
      }
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    console.error('Error listing installations:', error.message);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: 'Failed to list installations: ' + error.message }) 
    };
  }
}