// replicate-signature.js
const crypto = require('crypto');

function timingSafeEqualB64(aB64, bB64) {
  const a = Buffer.from(aB64, 'base64');
  const b = Buffer.from(bB64, 'base64');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function getRawBody(event) {
  // IMPORTANT: use the raw body bytes exactly as delivered to Lambda
  if (event.isBase64Encoded) {
    return Buffer.from(event.body || '', 'base64'); // raw bytes
  }
  // For non-base64, AWS/APIGW gives us a UTF-8 string; HMAC over those bytes
  return Buffer.from(event.body || '', 'utf8');
}

function parseReplicateSigHeader(headerValue = '') {
  // Accept: "v1,<base64>" OR "v1=<base64>" OR "t=<ts>,v1=<base64>"
  const parts = headerValue.split(',').map(s => s.trim());
  let t = null, v1 = null;
  for (const p of parts) {
    if (p.startsWith('t=')) t = p.slice(2);
    else if (p.startsWith('v1=')) v1 = p.slice(3);
    else if (p.startsWith('v1')) {
      // handle "v1,<base64>" or just "<base64>"
      const maybe = p.split('=');
      v1 = maybe.length === 2 ? maybe[1] : p.replace(/^v1[:=]?/, '').replace(/^,/, '').trim();
    } else if (!p.includes('=')) {
      // bare base64
      v1 = p;
    }
  }
  return { t, v1 };
}

function verifyReplicateSignature(event, signingSecretEnvVar = 'REPLICATE_WEBHOOK_SIGNING_SECRET') {
  const secret = (process.env[signingSecretEnvVar] || '').trim();
  if (!secret) {
    console.warn('[WEBHOOK] No signing secret set');
    return false;
  }

  // Header name can vary in case; normalize
  const h = event.headers || {};
  const sigHeader =
    h['replicate-signature'] ||
    h['Replicate-Signature'] ||
    h['REPLICATE-SIGNATURE'] ||
    h['replicate-webhook-signature'] ||
    h['Replicate-Webhook-Signature'] ||
    h['webhook-signature'] ||
    h['Webhook-Signature'];

  if (!sigHeader) {
    console.error('[WEBHOOK] Missing Replicate-Signature header');
    return false;
  }

  const { t, v1: receivedB64 } = parseReplicateSigHeader(String(sigHeader));
  if (!receivedB64) {
    console.error('[WEBHOOK] Signature header parse failed');
    return false;
  }

  const raw = getRawBody(event);

  // Compute according to the header shape:
  // - If a timestamp "t" is present: HMAC(secret, `${t}.${rawBodyString}`)
  // - Else: HMAC(secret, rawBodyBytes)
  let expectedB64;
  if (t) {
    const data = Buffer.concat([Buffer.from(String(t) + '.', 'utf8'), raw]);
    expectedB64 = crypto.createHmac('sha256', secret).update(data).digest('base64');
  } else {
    expectedB64 = crypto.createHmac('sha256', secret).update(raw).digest('base64');
  }

  const ok = timingSafeEqualB64(receivedB64, expectedB64);
  if (!ok) {
    console.error('[WEBHOOK] HMAC mismatch', {
      receivedPrefix: receivedB64.substring(0, 8),
      expectedPrefix: expectedB64.substring(0, 8)
    });
  }
  return ok;
}

module.exports = { verifyReplicateSignature };
