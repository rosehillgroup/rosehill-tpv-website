// Public API to get installations for the main website
// No auth required, returns published installations only

const { createClient } = require('@sanity/client');

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

// Helper function to convert Sanity blocks to plain text
function blocksToPlainText(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks
    .map(block =>
      block.children?.map(child => child.text || '').join('') || ''
    )
    .join(' ')
    .trim();
}

exports.handler = async function(event, context) {
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

  // Handle language parameter
  const lang = (event.queryStringParameters?.lang || '').toLowerCase();
  const supported = new Set(['en','fr','es','de']);
  const useLang = supported.has(lang) ? lang : 'en';
  const suffix = useLang === 'en' ? '' : `__${useLang}`;
  
  try {
    
    const sanity = createClient({
      projectId: process.env.SANITY_PROJECT_ID || (console.warn('SANITY_PROJECT_ID not set, using fallback'), '68ola3dd'),
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      token: process.env.SANITY_WRITE_TOKEN, // Need token to read from dataset
      useCdn: false
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

    // Get query parameters
    const qp = event.queryStringParameters || {};
    const limit = Number.parseInt(qp.limit, 10);
    const format = (qp.format || '').toLowerCase(); // 'cards' or default raw

    // If format is not 'cards', return raw Sanity data (backward compatible)
    if (format !== 'cards') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          installations: installations,
          count: installations.length,
          language: useLang,
          generated: new Date().toISOString()
        })
      };
    }

    // Transform to card-ready data with language-aware content (only when format=cards)
    const pick = (row, base) => row[`${base}${suffix}`] || row[base] || '';

    const allTransformed = installations.map(installation => {
      // Get localized overview text
      const overviewBlocks = installation[`overview${suffix}`] || installation.overview || [];
      const fullText = blocksToPlainText(overviewBlocks);
      const excerpt = fullText.length > 120 ? fullText.substring(0, 120) + '...' : fullText;

      // Build correct URL
      const installationUrl = useLang === 'en'
        ? `/installations/${installation.slug}.html`
        : `/${useLang}/installations/${installation.slug}.html`;

      // Compose location (handle both string and object formats)
      let locationText = '';
      if (installation[`location__${useLang}`]) {
        locationText = installation[`location__${useLang}`];
      } else if (installation.location?.city && installation.location?.country) {
        const city = installation.location[`city${suffix}`] || installation.location.city || '';
        const country = installation.location[`country${suffix}`] || installation.location.country || '';
        locationText = `${city}, ${country}`.replace(/^, |, $/, '');
      } else {
        locationText = installation.location || '';
      }

      return {
        _id: installation._id,
        title: pick(installation, 'title'),
        excerpt: excerpt,
        locationText: locationText,
        image: {
          src: installation.coverImage?.url || '',
          alt: pick(installation, 'coverImageAlt') || installation.coverImage?.alt || ''
        },
        url: installationUrl,
        installationDate: installation.installationDate,
        application: installation.application,
        slug: installation.slug // Keep for any debugging needs
      };
    });

    // Apply limit only if explicitly requested
    const transformedInstallations = Number.isFinite(limit) ? allTransformed.slice(0, limit) : allTransformed;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        installations: transformedInstallations,
        count: transformedInstallations.length,
        language: useLang,
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