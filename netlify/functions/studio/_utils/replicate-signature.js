// replicate-signature.js
const crypto = require('crypto');

function timingSafeEqualB64(aB64, bB64) {
  const a = Buffer.from(aB64, 'base64');
  const b = Buffer.from(bB64, 'base64');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function getRawBody(event) {
  if (event.isBase64Encoded) return Buffer.from(event.body || '', 'base64');
  return Buffer.from(event.body || '', 'utf8');
}

// NEW: normalize header (handles quotes, arrays, stray whitespace)
function normalizeHeader(val) {
  if (!val) return '';
  let s = Array.isArray(val) ? val[0] : String(val);
  s = s.trim();
  // strip a single pair of wrapping quotes (either " or ')
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  return s.trim();
}

function parseReplicateSigHeader(headerValue = '') {
  const h = normalizeHeader(headerValue);

  // Accept forms:
  //  A) "v1,<base64>"
  //  B) "v1=<base64>"
  //  C) "t=<ts>,v1=<base64>"
  //  D) "<base64>" (bare)
  let t = null, v1 = null;

  // A) v1,<base64>
  if (/^v1,/.test(h)) {
    v1 = h.slice(3).replace(/^,/, '').trim();
    return { t, v1 };
  }

  // B/C) find v1=... and optionally t=...
  const parts = h.split(',').map(s => s.trim());
  for (const p of parts) {
    if (p.startsWith('t=')) t = p.slice(2);
    else if (p.startsWith('v1=')) v1 = p.slice(3);
  }
  if (v1) return { t, v1 };

  // D) bare base64 (no prefix)
  if (/^[A-Za-z0-9+/=]+$/.test(h)) {
    v1 = h;
    return { t, v1 };
  }

  // Last chance: "v1:<base64>" or "v1 <base64>"
  const m = /^v1[:\s]+(.+)$/.exec(h);
  if (m) return { t, v1: m[1].trim() };

  return { t: null, v1: null };
}

function verifyReplicateSignature(event, envVar = 'REPLICATE_WEBHOOK_SIGNING_SECRET') {
  const secret = (process.env[envVar] || '').trim();
  if (!secret) {
    console.warn('[WEBHOOK] No signing secret set');
    return false;
  }

  const headers = event.headers || {};
  const rawHeader =
    headers['replicate-signature'] ??
    headers['Replicate-Signature'] ??
    headers['REPLICATE-SIGNATURE'] ??
    headers['replicate-webhook-signature'] ??
    headers['Replicate-Webhook-Signature'] ??
    headers['webhook-signature'] ??
    headers['Webhook-Signature'];

  if (!rawHeader) {
    console.error('[WEBHOOK] Missing Replicate-Signature header');
    console.error('[WEBHOOK] Available headers:', Object.keys(headers).join(', '));
    return false;
  }

  const { t, v1: receivedB64 } = parseReplicateSigHeader(rawHeader);
  if (!receivedB64) {
    console.error('[WEBHOOK] Signature header parse failed');
    return false;
  }

  const raw = getRawBody(event);

  console.log('[WEBHOOK] Body info:', {
    isBase64Encoded: !!event.isBase64Encoded,
    bodyLength: raw.length,
    bodyPreview: raw.toString('utf8').substring(0, 100)
  });

  let expectedB64;
  if (t) {
    // timestamped variant: HMAC(secret, `${t}.${rawBodyBytes}`)
    const buf = Buffer.concat([Buffer.from(String(t) + '.', 'utf8'), raw]);
    expectedB64 = crypto.createHmac('sha256', secret).update(buf).digest('base64');
  } else {
    // simple variant: HMAC(secret, rawBodyBytes)
    expectedB64 = crypto.createHmac('sha256', secret).update(raw).digest('base64');
  }

  console.log('[WEBHOOK] HMAC comparison:', {
    receivedPrefix: receivedB64.substring(0, 12),
    expectedPrefix: expectedB64.substring(0, 12),
    receivedLength: receivedB64.length,
    expectedLength: expectedB64.length,
    secretLength: secret.length
  });

  const ok = timingSafeEqualB64(receivedB64, expectedB64);
  if (!ok) {
    console.error('[WEBHOOK] HMAC verification failed');
  } else {
    console.log('[WEBHOOK] HMAC verification SUCCESS');
  }
  return ok;
}

module.exports = { verifyReplicateSignature };
