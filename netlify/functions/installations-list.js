// Netlify Function: List installations for admin dashboard
// Returns paginated list with search capability

import sanityClient from '@sanity/client';
import { requireEditorRole, errorResponse, successResponse, safeLog } from './_utils/auth.js';

// Initialize Sanity client
const sanity = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_TOKEN,
  useCdn: false
});

/**
 * Main handler
 */
export default async (event, context) => {
  safeLog('List installations request', {
    method: event.httpMethod,
    params: event.queryStringParameters
  });
  
  // Only accept GET
  if (event.httpMethod !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }
  
  // Validate authentication
  const auth = await requireEditorRole(event, process.env.ALLOWED_ORIGIN);
  if (!auth.ok) {
    return errorResponse(auth.msg, auth.status);
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
    
    return successResponse(response);
    
  } catch (error) {
    safeLog('Error listing installations', {
      error: error.message
    });
    
    return errorResponse('Failed to list installations: ' + error.message, 500);
  }
}