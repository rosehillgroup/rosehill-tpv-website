// ESM import
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
const BUCKET = process.env.SUPABASE_BUCKET || 'tpv-photos';

console.log('Environment check:', {
  hasUrl: !!SUPABASE_URL,
  hasServiceRole: !!SUPABASE_SERVICE_ROLE,
  bucket: BUCKET
});

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Check environment variables first
    if (!SUPABASE_URL) {
      return { statusCode: 500, body: 'SUPABASE_URL not configured' };
    }

    if (!SUPABASE_SERVICE_ROLE) {
      return { statusCode: 500, body: 'SUPABASE_SERVICE_ROLE not configured' };
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

    const { installId, files = [], qrToken } = JSON.parse(event.body || '{}');

    // 1) Basic validation
    if (!installId || !Array.isArray(files) || files.length === 0) {
      return { statusCode: 400, body: 'Missing installId or files' };
    }

    // 2) Authorise request (replace with your real QR / JWT / HMAC check)
    // e.g. verify qrToken signature or look up installId validity
    // if (!isValid(qrToken, installId)) return { statusCode: 401, body: 'Unauthorised' };

    // 3) Create one signed upload token per file
    const expiresIn = 60 * 10; // 10 minutes
    const uploads = [];

    for (const f of files) {
      if (!f?.name || !f?.type || !Number.isFinite(f?.size)) {
        return { statusCode: 400, body: 'Invalid file metadata' };
      }
      // Optional client-side precheck mirrored here
      if (f.size > 20 * 1024 * 1024) { // 20 MB hard ceiling
        return { statusCode: 413, body: 'File too large' };
      }
      if (!/^image\/(jpe?g|png|webp|heic)$/i.test(f.type)) {
        return { statusCode: 415, body: 'Unsupported media type' };
      }

      const safeName = f.name.replace(/[^\w.\-]/g, '_');
      const path = `TPV/${installId}/${Date.now()}-${safeName}`;

      const { data, error } = await supabase
        .storage.from(BUCKET)
        .createSignedUploadUrl(path, { expiresIn });

      if (error) {
        return { statusCode: 500, body: `Signed URL error: ${error.message}` };
      }

      uploads.push({
        bucket: BUCKET,
        path,
        token: data.token,       // used client-side
        signedUrl: data.signedUrl, // full URL for direct upload
        contentType: f.type
      });
    }

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uploads })
    };
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
};