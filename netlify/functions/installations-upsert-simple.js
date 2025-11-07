// Working installation save with Sanity but without translation
const { createClient } = require('@sanity/client');

const crypto = require('crypto');

function corsHeaders(origin) {
  const allowed = process.env.ALLOWED_ORIGIN || origin || '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type'
  };
}

function generateDocumentId() {
  return `installation.${crypto.randomUUID()}`;
}

exports.handler = async function(event, context) {
  const headers = corsHeaders(event.headers.origin);
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }
  
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }
  
  // Simple auth check without importing auth utils
  const authHeader = event.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return { 
      statusCode: 401, 
      headers, 
      body: JSON.stringify({ error: 'Missing authorization' }) 
    };
  }
  
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return { 
      statusCode: 400, 
      headers, 
      body: JSON.stringify({ error: 'Invalid JSON' }) 
    };
  }
  
  if (!data.title || !data.installationDate || !data.coverAssetId) {
    return { 
      statusCode: 400, 
      headers, 
      body: JSON.stringify({ error: 'Missing required fields' }) 
    };
  }
  
  try {
    
    const sanity = createClient({
      projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      token: process.env.SANITY_WRITE_TOKEN,
      useCdn: false
    });
    
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const docId = data.id || generateDocumentId();
    
    // Convert text arrays to Portable Text
    const overviewBlocks = (data.overview || []).map(text => ({
      _type: 'block',
      _key: crypto.randomUUID(),
      style: 'normal',
      children: [{
        _type: 'span',
        _key: crypto.randomUUID(),
        text: text
      }]
    }));
    
    const thanksToBlocks = (data.thanksTo || []).map(text => ({
      _type: 'block',
      _key: crypto.randomUUID(),
      style: 'normal',
      children: [{
        _type: 'span',
        _key: crypto.randomUUID(),
        text: text
      }]
    }));
    
    const doc = {
      _id: docId,
      _type: 'installation',
      title: data.title,
      slug: { _type: 'slug', current: slug },
      installationDate: data.installationDate,
      application: data.application || '',
      location: {
        city: data.location?.city || '',
        country: data.location?.country || ''
      },
      overview: overviewBlocks,
      thanksTo: thanksToBlocks,
      coverImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.coverAssetId },
        alt: data.title
      },
      gallery: (data.galleryAssetIds || []).map(assetId => ({
        _type: 'image',
        _key: crypto.randomUUID(),
        asset: { _type: 'reference', _ref: assetId },
        alt: data.title
      })),
      seo: {
        title: data.seo?.title || data.title,
        description: data.seo?.description || `${data.title} installation`
      },
      publishedLocales: ['en']
    };
    
    const savedDoc = data.id 
      ? await sanity.patch(docId).set(doc).commit()
      : await sanity.create(doc);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: savedDoc._id,
        slug: slug,
        publishedLocales: ['en'],
        viewUrls: {
          en: `/installations/${slug}.html`,
          es: null,
          fr: null,
          de: null
        }
      })
    };
    
  } catch (error) {
    console.error('Save error:', error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: 'Failed to save: ' + error.message }) 
    };
  }
}