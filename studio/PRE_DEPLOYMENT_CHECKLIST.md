# Pre-Deployment Checklist - Recraft Integration

**Date**: 2025-01-13
**Status**: Ready for Deployment Testing
**Completion**: 92% (11/12 tasks) - Testing remains

---

## ✅ Phase 1: Pre-Deployment Verification

### 1.1 Database Migration Preparation

**File to run**: `database/migrations/001_add_recraft_fields.sql`

**Before running, verify:**
- [ ] Supabase project is accessible
- [ ] You have admin/migration privileges
- [ ] studio_jobs table exists
- [ ] No conflicting column names

**Run migration:**
```bash
# Option 1: Supabase Dashboard
# 1. Go to SQL Editor
# 2. Paste contents of 001_add_recraft_fields.sql
# 3. Click "Run"

# Option 2: psql command line
psql "postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres" \
  -f database/migrations/001_add_recraft_fields.sql
```

**Verify migration success:**
```sql
-- Check new columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'studio_jobs'
AND column_name IN (
  'mode_type',
  'attempt_current',
  'attempt_max',
  'validation_history',
  'compliant',
  'all_attempt_urls',
  'inspector_final_reasons',
  'max_colours'
);

-- Should return 8 rows
```

### 1.2 Environment Variables Setup

**Add to Vercel Environment Variables:**

```bash
# Existing (verify these are already set)
REPLICATE_API_TOKEN=r8_...
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE=eyJhbGc...
PUBLIC_BASE_URL=https://[your-app].vercel.app
REPLICATE_WEBHOOK_SECRET=whsec_...

# New for Recraft (add these)
RECRAFT_MODEL=recraft-ai/recraft-v3-svg
RECRAFT_MAX_RETRIES=3
RECRAFT_MAX_COLOURS_DEFAULT=6
RECRAFT_MIN_COLOURS_DEFAULT=3
RECRAFT_CANVAS_PX=2048
RECRAFT_THUMB_PX=512
```

**Verification steps:**
```bash
# In Vercel Dashboard:
# 1. Go to Settings > Environment Variables
# 2. Verify all existing vars are present
# 3. Add each new RECRAFT_* variable
# 4. Set for: Production, Preview, Development
# 5. Click "Save"
```

### 1.3 Dependencies Check

**Verify package.json includes:**
```json
{
  "@resvg/resvg-js": "^2.6.0",
  "@anthropic-ai/sdk": "^0.9.0",
  "replicate": "latest",
  "sharp": "^0.33.0"
}
```

**Run if needed:**
```bash
cd /Volumes/Marketing_SSD/Websites\ 2025/TPV_2025_Deploy/studio
npm install
```

### 1.4 Code Verification

**Check critical files exist:**
```bash
# Backend utilities
ls -la api/_utils/svg/renderer.js
ls -la api/_utils/recraft/client.js
ls -la api/_utils/recraft/inspector.js
ls -la api/_utils/recraft/webhook-handler.js

# API endpoints
ls -la api/recraft-generate.js
ls -la api/replicate-callback.js
ls -la api/studio-job-status.js

# Frontend
ls -la src/components/InspirePanelRecraft.jsx
ls -la src/lib/api/client.js
ls -la src/App.jsx

# Database
ls -la database/migrations/001_add_recraft_fields.sql
```

**All files should exist and have non-zero size.**

---

## ✅ Phase 2: Deployment

### 2.1 Git Commit & Push

**Commit all changes:**
```bash
git status
git add .
git commit -m "feat: Implement Recraft Vector AI integration

- Add Recraft SVG generation with Claude Haiku validation
- Replace AI Mode (Flux Dev) and Geometric Mode
- Add retry loop with automatic prompt corrections
- Extend database schema for attempt/compliance tracking
- Archive legacy endpoints and utilities
- Simplify frontend to single unified mode

Ready for testing"

git push origin main
```

### 2.2 Vercel Deployment

**Automatic deployment should trigger after push.**

**Monitor deployment:**
1. Go to Vercel Dashboard > Deployments
2. Wait for build to complete
3. Check for build errors
4. Verify deployment URL is live

**Manual redeploy if needed:**
```bash
# Install Vercel CLI if not already
npm i -g vercel

# Deploy
vercel --prod
```

---

## ✅ Phase 3: Smoke Tests

### 3.1 Basic Health Check

**Test 1: Frontend loads**
```
1. Open https://[your-app].vercel.app
2. Sign in with @rosehill.group account
3. Verify InspirePanelRecraft component renders
4. Check browser console for errors (should be none)
```

**Test 2: API endpoints respond**
```bash
# Check Recraft generation endpoint exists
curl -X POST https://[your-app].vercel.app/api/recraft-generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","width_mm":5000,"length_mm":5000,"max_colours":6}'

# Should return 4xx/5xx error (expected - needs auth) or job creation
```

### 3.2 Environment Variable Check

**Verify vars are loaded:**
```bash
# Check Vercel logs for startup
# Should NOT see "Missing required env var" warnings

# If you have access to Vercel CLI:
vercel env pull .env.local
cat .env.local | grep RECRAFT
```

---

## ✅ Phase 4: Integration Tests

### Test Scenario 1: Happy Path ✅

**Objective**: Simple design should pass compliance on first attempt

**Steps:**
1. Enter prompt: `"calm ocean with big fish shapes"`
2. Set: Length 5000mm, Width 5000mm, Max Colors 6
3. Click "Generate Vector Design"
4. Monitor progress (should show "Generating initial design...")
5. Wait for completion (~30-60 seconds)

**Expected Result:**
- ✓ Job completes with status: `completed`
- ✓ Compliance badge shows: `✓ Installer-Ready`
- ✓ SVG and PNG downloads available
- ✓ Attempt counter shows: `1/3`
- ✓ No warnings displayed

**If Failed:**
- Check Vercel logs for errors
- Verify inspector returned `{ "pass": true }`
- Check Supabase storage for uploaded files

---

### Test Scenario 2: Retry Path 🔄

**Objective**: Design with prohibited elements should fail, then retry and pass

**Steps:**
1. Enter prompt: `"playground with slide structure and ocean theme"`
2. Set: Length 5000mm, Width 5000mm, Max Colors 6
3. Click "Generate Vector Design"
4. Monitor progress messages

**Expected Result:**
- ⚠ Attempt 1: Fails inspector (contains playground equipment)
- 🔄 Status changes to: `retrying`
- ⏳ Progress shows: `Quality check 1/3 - refining design...`
- ⚠ Attempt 2: May still fail or pass
- ✓ Eventually passes (by attempt 2-3)
- ✓ Compliance badge shows: `✓ Installer-Ready`
- ℹ️ Attempt counter shows: `2/3` or `3/3`
- 📋 All attempts visible in history

**If Failed:**
- Check inspector reasons in validation_history
- Verify suggested_prompt_correction was applied
- Check if max retries was reached

---

### Test Scenario 3: Color Limit Enforcement 🎨

**Objective**: Design with too many colors should be caught and corrected

**Steps:**
1. Enter prompt: `"rainbow explosion with all the colors"`
2. Set: Max Colors to **4** (strict limit)
3. Click "Generate Vector Design"

**Expected Result:**
- ⚠ Attempt 1: Likely fails (too many colors)
- 🔄 Inspector suggests: "Reduce palette to 4 flat colors"
- ⚠ Attempt 2: Retries with simplified palette
- ✓ Eventually passes with ≤4 colors
- ✓ Compliance badge shows: `✓ Installer-Ready`

---

### Test Scenario 4: Gradient Detection 🌅

**Objective**: Inspector catches gradients and requests flat colors

**Steps:**
1. Enter prompt: `"sunset sky with smooth gradient from orange to purple"`
2. Click "Generate Vector Design"

**Expected Result:**
- ⚠ Attempt 1: Fails (contains gradients)
- 🔄 Inspector suggests: "Use flat colors only, no gradients"
- ✓ Attempt 2: Passes with flat color bands
- ✓ Compliance badge shows: `✓ Installer-Ready`

---

### Test Scenario 5: Max Retries Exhausted ⚠️

**Objective**: Extremely complex prompt should fail after 3 attempts

**Steps:**
1. Enter prompt: `"ultra-detailed Victorian architecture with intricate ornate patterns and realistic people playing on playground equipment with slide and swings and climbing frame"`
2. Click "Generate Vector Design"

**Expected Result:**
- ⚠ Attempt 1: Fails (multiple violations)
- 🔄 Attempt 2: Fails (still too complex)
- 🔄 Attempt 3: Fails (max retries reached)
- ⚠ Status: `failed` or `completed` (with compliant=false)
- ⚠ Compliance badge shows: `⚠ Non-Compliant`
- ⚠ Inspector warnings displayed
- ℹ️ Attempt counter shows: `3/3`
- ✓ Best-effort output still downloadable
- 📋 All 3 attempts saved in history

**What to check:**
- Verify job.compliant = false
- Verify job.status = 'failed' or 'completed'
- Verify inspector_final_reasons contains specific violations
- Verify all 3 attempts saved to storage

---

## ✅ Phase 5: Data Verification

### 5.1 Database Check

**Query Supabase after each test:**
```sql
-- Get most recent Recraft jobs
SELECT
  id,
  status,
  mode_type,
  attempt_current,
  attempt_max,
  compliant,
  max_colours,
  created_at
FROM studio_jobs
WHERE mode_type = 'recraft_vector'
ORDER BY created_at DESC
LIMIT 10;

-- Check validation history for a specific job
SELECT
  id,
  validation_history,
  inspector_final_reasons,
  all_attempt_urls
FROM studio_jobs
WHERE id = '[job-id-from-test]';
```

**Verify:**
- [ ] mode_type = 'recraft_vector'
- [ ] attempt_current increments correctly
- [ ] validation_history contains inspector results
- [ ] compliant flag set correctly
- [ ] all_attempt_urls contains all attempts

### 5.2 Storage Check

**Check Supabase Storage buckets:**
```
studio-assets/
  recraft/
    [job-id]/
      attempt_1/
        design.svg
        preview.png
        thumbnail.png
      attempt_2/  (if retry occurred)
        design.svg
        preview.png
        thumbnail.png
      final/  (only if compliant)
        design.svg
        preview.png
        thumbnail.png
```

**Verify:**
- [ ] All attempt folders created
- [ ] Each folder has svg + png + thumbnail
- [ ] Final folder only exists if compliant=true
- [ ] File URLs are publicly accessible

### 5.3 Logs Check

**Vercel Runtime Logs:**
```
Search for: [RECRAFT] or [WEBHOOK] or [INSPECTOR]

Expected log flow:
[RECRAFT] Starting generation for job [id]
[RECRAFT] Created Replicate prediction: [pred-id]
[WEBHOOK] Received Recraft success for job [id]
[WEBHOOK] Attempt 1/3
[INSPECTOR] Running compliance check...
[INSPECTOR] Result: { pass: true/false, reasons: [...] }
[WEBHOOK] ✓ Design passed compliance / ⚠ Retrying...
```

**Look for:**
- ✓ No unhandled errors
- ✓ Inspector calls succeed
- ✓ SVG downloads succeed
- ✓ PNG rendering succeeds
- ✓ Storage uploads succeed

---

## ✅ Phase 6: Performance & Cost Monitoring

### 6.1 Performance Metrics

**Target benchmarks:**
- Average time to completion: < 60 seconds (1 attempt)
- Average time with retry: < 120 seconds (2 attempts)
- Webhook processing time: < 10 seconds
- Inspector response time: < 5 seconds

**Monitor:**
- Vercel function execution time
- Replicate prediction duration
- Claude Haiku API latency

### 6.2 Cost Monitoring

**Estimated costs per design:**
- Recraft generation: ~$0.02-0.05 per attempt
- Claude Haiku inspector: ~$0.001 per check
- Vercel serverless: Included in plan
- Supabase storage: ~$0.001 per design

**Target: < $0.10 per completed design**

**Track:**
- Replicate API usage dashboard
- Anthropic API usage dashboard
- Supabase storage metrics

### 6.3 Success Rate Monitoring

**Target metrics:**
- >70% jobs pass on attempt 1
- >90% jobs pass within 3 attempts
- <5% user-reported compliance issues

**Track over first week:**
- Attempt distribution (1st, 2nd, 3rd)
- Most common inspector failure reasons
- False positive rate (compliant flagged as non-compliant)

---

## 🚨 Troubleshooting Common Issues

### Issue: Job stuck in 'pending' status

**Possible causes:**
- Replicate API token invalid/expired
- Webhook URL not configured correctly
- Replicate service down

**Solutions:**
1. Check Replicate API token in Vercel env vars
2. Verify PUBLIC_BASE_URL matches actual deployment URL
3. Check Replicate status: https://status.replicate.com
4. Test webhook manually:
```bash
curl -X POST https://[your-app].vercel.app/api/replicate-callback \
  -H "Content-Type: application/json" \
  -d '{"id":"test","status":"succeeded","output":{"svg":"https://..."}}'
```

---

### Issue: Inspector always fails

**Possible causes:**
- ANTHROPIC_API_KEY invalid/expired
- Claude Haiku quota exhausted
- Inspector prompt too strict

**Solutions:**
1. Verify ANTHROPIC_API_KEY in Vercel env vars
2. Check Anthropic Console for usage/limits
3. Test inspector directly:
```bash
# In Vercel logs, look for inspector requests
# Check if API returns valid JSON response
```

---

### Issue: SVG rendering fails

**Possible causes:**
- @resvg/resvg-js not installed
- Invalid SVG structure
- Memory limits exceeded

**Solutions:**
1. Verify @resvg/resvg-js in package.json
2. Run `npm install` and redeploy
3. Check SVG structure validation in logs
4. Consider reducing RECRAFT_CANVAS_PX if memory issues

---

### Issue: Webhook not received

**Possible causes:**
- PUBLIC_BASE_URL incorrect
- REPLICATE_WEBHOOK_SECRET mismatch
- Webhook signature validation failing

**Solutions:**
1. Verify PUBLIC_BASE_URL = actual Vercel deployment URL
2. Check REPLICATE_WEBHOOK_SECRET matches Replicate dashboard
3. Look for webhook signature errors in logs
4. Test webhook endpoint manually

---

### Issue: Database insert fails

**Possible causes:**
- Migration not run
- Schema mismatch
- SUPABASE_SERVICE_ROLE invalid

**Solutions:**
1. Run migration: database/migrations/001_add_recraft_fields.sql
2. Verify schema matches expected columns
3. Check SUPABASE_SERVICE_ROLE is service role key (not anon key)

---

## 📊 Success Criteria

### Implementation Complete When:

- [x] All 10 new files created
- [x] All 4 files modified correctly
- [x] All 6 items archived with documentation
- [x] Database migration script ready
- [x] Environment variables documented
- [ ] **Database migration executed on production**
- [ ] **Environment variables set in Vercel**
- [ ] **All 5 test scenarios pass**
- [ ] **No errors in production logs**
- [ ] **Success rate >70% on attempt 1**

---

## 🎯 Next Actions

### Immediate (Today):
1. ✅ Run database migration on Supabase
2. ✅ Set all environment variables in Vercel
3. ✅ Deploy to production
4. ✅ Run Test Scenario 1 (happy path)

### Short-term (Week 1):
5. ✅ Run all 5 test scenarios
6. ✅ Monitor success rate and costs
7. ✅ Tune inspector prompt if needed
8. ✅ Document any edge cases

### Long-term (Month 1):
9. Add storage lifecycle policy (delete temp files after 30 days)
10. Implement ZIP download for all attempts
11. Add manual override for non-compliant designs
12. Create admin dashboard for monitoring

---

## 📞 Support

**Implementation Details**: See [RECRAFT_IMPLEMENTATION.md](./RECRAFT_IMPLEMENTATION.md)
**Original Plan**: See [RECRAFT_PLAN.md](./RECRAFT_PLAN.md)
**Archive Info**: See [api/_archived/README.md](./api/_archived/README.md)

**Rollback Plan**: See RECRAFT_IMPLEMENTATION.md § Rollback Plan

---

## ✅ Sign-off

**Implementation Status**: Code-Complete ✅
**Testing Status**: Pending User Deployment
**Deployment Ready**: YES

**Final checklist before going live:**
- [ ] Database migration executed
- [ ] Environment variables configured
- [ ] Code deployed to production
- [ ] Test Scenario 1 passes
- [ ] No critical errors in logs

Once these 5 items are checked, the Recraft integration is LIVE! 🚀
