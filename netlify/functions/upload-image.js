// /.netlify/functions/upload-image.js
export const config = { runtime: 'nodejs18.x' };

import sanityClient from '@sanity/client';
import { createRemoteJWKSet, jwtVerify } from 'jose';

function getEnv(name, optional = false) {
  const v = process.env[name];
  if (!v && !optional) throw new Error(`Missing env: ${name}`);
  return v;
}

function corsHeaders(origin) {
  const allowed = process.env.ALLOWED_ORIGIN || origin || '*';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type'
  };
}

// Lazy singletons (constructed inside handler so missing envs don't crash at import)
function getSanity() {
  return sanityClient({
    projectId: getEnv('SANITY_PROJECT_ID'),
    dataset: getEnv('SANITY_DATASET'),
    apiVersion: '2023-05-03',
    token: getEnv('SANITY_TOKEN'),
    useCdn: false,
  });
}

async function requireEditorRole(request) {
  const ISSUER   = getEnv('AUTH0_ISSUER_BASE_URL');
  const AUDIENCE = getEnv('AUTH0_AUDIENCE');
  const JWKS     = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`));
  const ROLES    = 'https://tpv.rosehill.group/roles';

  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return { ok:false, status:401, msg:'Missing token' };

  try {
    const { payload } = await jwtVerify(token, JWKS, { issuer: ISSUER, audience: AUDIENCE });
    const roles = payload[ROLES] || [];
    return roles.includes('editor') ? { ok:true, user: payload }
                                    : { ok:false, status:403, msg:'Forbidden' };
  } catch (e) {
    return { ok:false, status:401, msg:'Invalid token' };
  }
}

export default async (request, context) => {
  const headers = corsHeaders(request.headers.get('origin'));

  try {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    // Only POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: `Method Not Allowed. Expected POST but received ${request.method}` }), {
        status: 405, headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Auth
    const gate = await requireEditorRole(request);
    if (!gate.ok) return new Response(gate.msg, { status: gate.status, headers });

    // Read multipart (v2 Request API)
    const form = await request.formData();
    const file = form.get('file');
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file part' }), {
        status: 400, headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    if (!(file instanceof Blob)) {
      return new Response(JSON.stringify({ error: 'Invalid file' }), {
        status: 400, headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
    const mime = file.type || '';
    if (!/^image\//i.test(mime)) {
      return new Response(JSON.stringify({ error: 'Unsupported file type' }), {
        status: 415, headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    // Upload to Sanity
    const sanity = getSanity();
    const buf = Buffer.from(await file.arrayBuffer());
    const filename = file.name || 'upload';
    const asset = await sanity.assets.upload('image', buf, { filename });

    return new Response(JSON.stringify({ assetId: asset._id, url: asset.url }), {
      status: 200, headers: { ...headers, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    // Never let the function crash silently: always return JSON with CORS
    return new Response(JSON.stringify({ error: String(err && err.message || err) }), {
      status: 500, headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
};