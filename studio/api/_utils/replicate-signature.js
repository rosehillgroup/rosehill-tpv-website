// replicate-signature.js - Replicate webhook signature verification
// Based on community patterns for Replicate webhook signing
import crypto from 'crypto';

function getSigHeader(headers) {
  // case-insensitive; handle both Replicate-Signature and X-Replicate-Signature
  const entries = Object.entries(headers || {});
  const kv = entries.find(([k]) => /^(x-)?replicate-signature$/i.test(k));
  return kv ? kv[1] : undefined;
}

function parseSigHeader(val) {
  if (!val) return null;
  const s = String(val).trim();

  // Format A: "t=<ts>,v1=<base64>"
  if (s.includes('t=') && s.includes('v1=')) {
    const parts = Object.fromEntries(s.split(',').map(p => p.split('=')));
    return { ts: parts.t, v1: parts.v1 };
  }
  // Format B: "v1,<base64>"
  if (s.startsWith('v1,')) {
    const v1 = s.slice(3).trim();
    return { ts: null, v1 };
  }
  return null;
}

function hmacBase64(key, data) {
  return crypto.createHmac('sha256', key).update(data).digest('base64');
}

function timingSafeEqBase64(a, b) {
  try {
    const ba = Buffer.from(a, 'base64');
    const bb = Buffer.from(b, 'base64');
    return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

function verifyReplicateSignature({ headers, rawBody, signingKey }) {
  const sigHeader = getSigHeader(headers);
  if (!sigHeader) return { verified: false, reason: 'missing' };

  const parsed = parseSigHeader(sigHeader);
  if (!parsed?.v1) return { verified: false, reason: 'bad_header' };

  const message = parsed.ts ? `${parsed.ts}.${rawBody}` : rawBody;
  const expected = hmacBase64(signingKey, message);

  return { verified: timingSafeEqBase64(parsed.v1, expected), reason: 'mismatch' };
}

export { verifyReplicateSignature, getSigHeader };
