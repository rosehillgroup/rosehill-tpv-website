// Simple installation save without translation for debugging
import crypto from 'crypto';
import { requireEditorRole, errorResponse, successResponse, safeLog } from './_utils/auth.js';

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

export async function handler(event, context) {
  const headers = corsHeaders(event.headers.origin);
  
  if (event.httpMethod === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }
  
  if (event.httpMethod !== 'POST') {
    return errorResponse('Method not allowed', 405, headers);
  }
  
  const auth = await requireEditorRole(event, process.env.ALLOWED_ORIGIN);
  if (!auth.ok) {
    return errorResponse(auth.msg, auth.status, headers);
  }
  
  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return errorResponse('Invalid JSON in request body', 400, headers);
  }
  
  if (!data.title || !data.installationDate || !data.coverAssetId) {
    return errorResponse('Missing required fields', 400, headers);
  }
  
  try {
    const { createClient } = await import('@sanity/client');
    const sanity = createClient({
      projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      token: process.env.SANITY_WRITE_TOKEN,
      useCdn: false
    });
    
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const docId = data.id || generateDocumentId();
    
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
      coverImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.coverAssetId },
        alt: data.title
      },
      publishedLocales: ['en']
    };
    
    const savedDoc = data.id 
      ? await sanity.patch(docId).set(doc).commit()
      : await sanity.create(doc);
    
    return successResponse({
      id: savedDoc._id,
      slug: slug
    }, 200, headers);
    
  } catch (error) {
    safeLog('Save error', { error: error.message });
    return errorResponse('Failed to save: ' + error.message, 500, headers);
  }
}