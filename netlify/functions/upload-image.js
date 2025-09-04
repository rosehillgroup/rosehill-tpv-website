// Netlify Function: Upload image to Sanity Assets (CommonJS for compatibility)
const { createClient } = require('@sanity/client');
const { createRemoteJWKSet, jwtVerify } = require('jose');

function corsHeaders(origin) {
  const allowed = process.env.ALLOWED_ORIGIN || origin || '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS', 
    'Access-Control-Allow-Headers': 'Authorization, Content-Type'
  };
}

// Lazy Sanity client 
let sanity = null;
function getSanity() {
  if (!sanity) {
    sanity = createClient({
      projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2023-05-03', 
      token: process.env.SANITY_TOKEN,
      useCdn: false
    });
  }
  return sanity;
}

async function requireEditorRole(event) {
  const ISSUER = process.env.AUTH0_ISSUER_BASE_URL;
  const AUDIENCE = process.env.AUTH0_AUDIENCE;
  
  if (!ISSUER || !AUDIENCE) {
    return { ok: false, status: 500, msg: 'Auth configuration missing' };
  }
  
  const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`));
  const ROLES = 'https://tpv.rosehill.group/roles';

  const auth = event.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return { ok: false, status: 401, msg: 'Missing token' };

  try {
    const { payload } = await jwtVerify(token, JWKS, { issuer: ISSUER, audience: AUDIENCE });
    const roles = payload[ROLES] || [];
    return roles.includes('editor') ? { ok: true, user: payload }
                                    : { ok: false, status: 403, msg: 'Forbidden' };
  } catch (e) {
    return { ok: false, status: 401, msg: 'Invalid token' };
  }
}

exports.handler = async (event, context) => {
  const headers = corsHeaders(event.headers?.origin);
  
  try {
    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers,
        body: ''
      };
    }
    
    // Only accept POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: `Method Not Allowed. Expected POST but received ${event.httpMethod}` 
        })
      };
    }
    
    // Validate authentication 
    const auth = await requireEditorRole(event);
    if (!auth.ok) {
      return {
        statusCode: auth.status,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: auth.msg })
      };
    }
    
    // Rate limiting
    const rateLimit = checkRateLimit ? checkRateLimit(auth.user.sub) : { ok: true };
    if (!rateLimit.ok) {
      return {
        statusCode: 429,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds`
        })
      };
    }
    
    // Parse JSON body
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }
    
    // Validate required fields
    if (!data.image || !data.filename || !data.mimeType) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Missing required fields: image (base64), filename, and mimeType are required' 
        })
      };
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(data.mimeType)) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
        })
      };
    }
    
    // Decode and validate image
    const imageBuffer = Buffer.from(data.image, 'base64');
    const maxSize = 12 * 1024 * 1024;
    if (imageBuffer.length > maxSize) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` 
        })
      };
    }
    
    // Upload to Sanity
    try {
      const sanityClient = getSanity();
      const asset = await sanityClient.assets.upload('image', imageBuffer, {
        filename: data.filename
      });
      
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: asset._id,
          url: asset.url,
          filename: data.filename,
          size: asset.size,
          dimensions: {
            width: asset.metadata?.dimensions?.width,
            height: asset.metadata?.dimensions?.height
          }
        })
      };
      
    } catch (uploadError) {
      return {
        statusCode: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: `Upload failed: ${uploadError.message}` 
        })
      };
    }
    
  } catch (outerError) {
    // Never let the function crash
    console.error('Function error:', outerError);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};