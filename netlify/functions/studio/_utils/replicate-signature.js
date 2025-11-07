// replicate-signature.js - Replicate webhook signature verification
// Based on official Replicate docs: https://replicate.com/docs/webhooks#manually-validating-webhook-data
const crypto = require('crypto');

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function getRawBody(event) {
  if (event.isBase64Encoded) {
    return Buffer.from(event.body || '', 'base64');
  }
  return Buffer.from(event.body || '', 'utf8');
}

/**
 * Verify Replicate webhook signature per official docs
 * @param {Object} event - Lambda event object
 * @param {string} signingSecretEnvVar - Environment variable name for signing secret
 * @returns {boolean} true if signature is valid
 */
function verifyReplicateSignature(event, signingSecretEnvVar = 'REPLICATE_WEBHOOK_SIGNING_SECRET') {
  const secret = (process.env[signingSecretEnvVar] || '').trim();
  if (!secret) {
    console.warn('[WEBHOOK] No signing secret set');
    return false;
  }

  const headers = event.headers || {};

  // Replicate sends: webhook-id, webhook-timestamp, webhook-signature
  const webhookId = headers['webhook-id'] || headers['Webhook-Id'];
  const webhookTimestamp = headers['webhook-timestamp'] || headers['Webhook-Timestamp'];
  const webhookSignature = headers['webhook-signature'] || headers['Webhook-Signature'];

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    console.error('[WEBHOOK] Missing required headers:', {
      hasId: !!webhookId,
      hasTimestamp: !!webhookTimestamp,
      hasSignature: !!webhookSignature
    });
    return false;
  }

  // Extract signing key (remove whsec_ prefix if present)
  const signingKey = secret.startsWith('whsec_') ? secret.slice(6) : secret;

  // Construct signed content: webhook-id.webhook-timestamp.body
  const rawBody = getRawBody(event);
  const bodyString = rawBody.toString('utf8');
  const signedContent = `${webhookId}.${webhookTimestamp}.${bodyString}`;

  console.log('[WEBHOOK] Verification details:', {
    webhookId,
    webhookTimestamp,
    bodyLength: rawBody.length,
    signingKeyLength: signingKey.length,
    signedContentPrefix: signedContent.substring(0, 80),
    bodyPreview: bodyString.substring(0, 50)
  });

  // Parse webhook-signature header (space-delimited list: "v1,<sig1> v1,<sig2>")
  const signatures = webhookSignature.split(' ').map(s => {
    const parts = s.trim().split(',');
    if (parts.length === 2 && parts[0] === 'v1') {
      return parts[1];
    }
    return null;
  }).filter(Boolean);

  if (signatures.length === 0) {
    console.error('[WEBHOOK] No valid v1 signatures found in header');
    return false;
  }

  console.log('[WEBHOOK] Found', signatures.length, 'signature(s) to verify');

  // Compute expected signature
  const expectedSignature = crypto
    .createHmac('sha256', signingKey)
    .update(signedContent)
    .digest('base64');

  console.log('[WEBHOOK] Signature comparison:', {
    expectedPrefix: expectedSignature.substring(0, 12),
    receivedPrefixes: signatures.map(s => s.substring(0, 12))
  });

  // Verify against ANY of the provided signatures (constant-time comparison)
  for (const receivedSignature of signatures) {
    if (timingSafeEqual(receivedSignature, expectedSignature)) {
      console.log('[WEBHOOK] Signature verification SUCCESS');
      return true;
    }
  }

  console.error('[WEBHOOK] HMAC verification failed - no matching signatures');
  return false;
}

module.exports = { verifyReplicateSignature };
