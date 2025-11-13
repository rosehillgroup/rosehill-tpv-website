# TPV Studio - Vercel Deployment Guide

## Pre-Deployment Checklist

### ✅ Code Complete
- [x] Frontend components (InspirePanel, GeometricPanel)
- [x] API endpoints (inspire-simple, enqueue, callback, vectorise, draftify, geometric)
- [x] Vectorization pipeline (potrace-based)
- [x] Geometric generator (native SVG)
- [x] Build configuration (vercel.json, package.json)

### ✅ Dependencies Verified
- [x] potrace (^2.1.8) - Raster to vector conversion
- [x] sharp (^0.34.4) - Image processing
- [x] @supabase/supabase-js (^2.38.0) - Database and storage
- [x] replicate (^0.32.0) - AI model API
- [x] Node.js (>=20.18.1)

### ✅ Configuration Files
- [x] vercel.json - Routing, headers, build config
- [x] .env.example - Environment variable documentation
- [x] package.json - Dependencies and scripts

---

## Deployment Steps

### Step 1: Prepare Environment Variables

Required environment variables for Vercel:

```bash
# Frontend (VITE_ prefix)
VITE_SUPABASE_URL=https://okakomwfikxmwllvliva.supabase.co
VITE_SUPABASE_ANON_KEY=<get from Supabase Dashboard>

# Backend
SUPABASE_URL=https://okakomwfikxmwllvliva.supabase.co
SUPABASE_SERVICE_ROLE=<get from Supabase Dashboard>
REPLICATE_API_TOKEN=<get from Replicate Account>
REPLICATE_WEBHOOK_SECRET=<get from Replicate Webhooks>
PUBLIC_BASE_URL=https://your-app.vercel.app

# Optional (for team accounts)
REPLICATE_ACCOUNT=
REPLICATE_PROJECT=
```

**Where to get these:**
- Supabase: https://supabase.com/dashboard/project/okakomwfikxmwllvliva/settings/api
- Replicate API Token: https://replicate.com/account/api-tokens
- Replicate Webhook Secret: https://replicate.com/account/webhooks

### Step 2: Deploy to Vercel

**Option A: Via Vercel CLI**
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd "/Volumes/Marketing_SSD/Websites 2025/TPV_2025_Deploy/studio"
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Select your account]
# - Link to existing project? No
# - What's your project's name? tpv-studio
# - In which directory is your code located? ./
# - Want to override the settings? No

# Production deployment
vercel --prod
```

**Option B: Via GitHub + Vercel Dashboard**
1. Push code to GitHub repository
2. Go to https://vercel.com/new
3. Import the GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Node.js Version: 20.x
5. Add Environment Variables (copy from .env.example)
6. Deploy

### Step 3: Configure Environment Variables in Vercel

1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add each variable from the list above
3. Set for: Production, Preview, and Development
4. **CRITICAL**: Set `PUBLIC_BASE_URL` to your actual Vercel domain
   - Example: `https://tpv-studio.vercel.app`
5. Save all variables

### Step 4: Redeploy (to pick up environment variables)

```bash
# Via CLI
vercel --prod

# Or via Dashboard
# Go to Deployments tab > Latest deployment > ... menu > Redeploy
```

### Step 5: Configure Replicate Webhook

1. Go to https://replicate.com/account/webhooks
2. Create new webhook or update existing
3. Set webhook URL to: `https://your-domain.vercel.app/api/replicate-callback`
4. Set webhook secret (copy to REPLICATE_WEBHOOK_SECRET env var)
5. Select events to trigger: `predictions.output` and `predictions.completed`
6. Save webhook configuration

### Step 6: Verify Supabase Configuration

**Storage Buckets (must exist and be public):**
```sql
-- Check existing buckets
SELECT name, public FROM storage.buckets;

-- Create buckets if needed
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('tpv-studio', 'tpv-studio', true),
  ('studio-temp', 'studio-temp', true);

-- Set public access policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'tpv-studio');
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'studio-temp');
```

**Database Table (studio_jobs):**
```sql
-- Verify table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'studio_jobs';

-- Required columns:
-- id (uuid, primary key)
-- status (text)
-- prompt (text)
-- metadata (jsonb)
-- outputs (jsonb)
-- error (text)
-- created_at (timestamp)
-- updated_at (timestamp)
```

---

## Post-Deployment Testing

### Test 1: Geometric Mode (Should work immediately)
1. Visit `https://your-domain.vercel.app`
2. Select "Geometric Mode"
3. Enter a prompt (e.g., "Playful ocean theme")
4. Click "Generate"
5. Should see SVG within 1-2 seconds
6. Verify download button works

**Expected Result:** ✅ Instant SVG generation and display

### Test 2: AI Mode - Raster Generation
1. Select "AI Mode"
2. Enter a prompt (e.g., "Vibrant playground")
3. Click "Generate"
4. Wait ~30-40 seconds
5. Should see JPG image displayed
6. Download button should offer JPG

**Expected Result:** ✅ JPG displays after ~40 seconds

### Test 3: AI Mode - Vectorization Pipeline
1. After JPG appears (from Test 2)
2. Wait additional 10-20 seconds
3. Image should swap to SVG automatically
4. Download button should now offer SVG
5. Backup JPG download should also be available

**Expected Result:** ✅ SVG replaces JPG after vectorization completes

### Test 4: Webhook Verification
1. Check Vercel Function Logs:
   - Go to Vercel Dashboard > Your Project > Logs
   - Look for `/api/replicate-callback` calls
   - Should see `[CALLBACK]` log entries

2. Check Replicate Dashboard:
   - Go to https://replicate.com/predictions
   - Find recent prediction
   - Click to view details
   - Check "Webhooks" tab - should show successful delivery

**Expected Result:** ✅ Webhook logs show successful callbacks

---

## Troubleshooting

### Issue: Build fails on Vercel
**Symptoms:** Build error during `npm run build`
**Solution:**
- Check Vercel build logs for specific error
- Verify Node.js version is 20.x
- Ensure all dependencies are in package.json (not devDependencies for prod deps)
- Run `npm run build` locally to reproduce

### Issue: AI Mode shows "Job failed"
**Symptoms:** Generation starts but fails after a few seconds
**Solution:**
- Check Vercel Function Logs for error messages
- Verify REPLICATE_API_TOKEN is correct
- Check Replicate account has credits
- Ensure API token has proper permissions

### Issue: Image uploads fail
**Symptoms:** Job completes but no image displays
**Solution:**
- Verify SUPABASE_SERVICE_ROLE is correct
- Check Supabase Storage bucket permissions
- Verify buckets exist and are public
- Check Function Logs for upload errors

### Issue: Vectorization never completes
**Symptoms:** JPG displays but never swaps to SVG
**Solution:**
- Check if webhook is configured correctly in Replicate
- Verify PUBLIC_BASE_URL matches your Vercel domain
- Check `/api/vectorise` function logs for errors
- Verify potrace and sharp dependencies installed

### Issue: CORS errors in browser console
**Symptoms:** API calls blocked by CORS policy
**Solution:**
- Check vercel.json headers configuration
- Verify API endpoints are under /api/ path
- Check Supabase CORS settings if using direct client calls

### Issue: "Function timeout" errors
**Symptoms:** AI generation times out after 10 seconds (Hobby) or 60 seconds (Pro)
**Solution:**
- Vectorization runs asynchronously (shouldn't timeout)
- If replicate-callback timeouts, check for slow operations
- Consider upgrading to Vercel Pro for 60s timeout
- Optimize image processing in vectorise.js

---

## Monitoring & Maintenance

### Vercel Dashboard
- **Deployments**: Track deployment history and rollback if needed
- **Logs**: Real-time function execution logs
- **Analytics**: Usage metrics and performance data
- **Settings**: Update environment variables

### Supabase Dashboard
- **Storage**: Monitor bucket usage and costs
- **Database**: Check studio_jobs table for job history
- **Logs**: API request logs and errors
- **Settings**: Manage API keys and permissions

### Replicate Dashboard
- **Predictions**: View all AI generations and costs
- **Webhooks**: Monitor webhook delivery success/failure
- **Credits**: Track API usage and billing

---

## Cost Estimates

### Vercel (Hobby Plan - Free)
- 100 GB bandwidth/month
- 100 GB-hours compute/month
- 10 second function timeout
- Unlimited deployments
- **Upgrade to Pro ($20/mo) for:**
  - 60 second function timeout (important for vectorization)
  - More bandwidth and compute

### Replicate
- **Flux Dev (AI Mode)**: ~$0.025 per generation (~40s)
- **Estimated monthly cost:**
  - 100 generations/mo: $2.50
  - 500 generations/mo: $12.50
  - 1000 generations/mo: $25.00

### Supabase (Free Tier)
- 500 MB database storage
- 1 GB file storage
- 2 GB bandwidth/month
- **Estimated usage:**
  - Each design: ~500 KB (JPG) + ~100 KB (SVG) = ~600 KB
  - 1000 designs: ~600 MB (within free tier)

### Total Monthly Cost Estimate
- **Light usage** (100 designs): ~$0-3
- **Medium usage** (500 designs): ~$13-15
- **Heavy usage** (1000 designs): ~$25-30

---

## Deployment Checklist

Before going live:

- [ ] All environment variables added to Vercel
- [ ] PUBLIC_BASE_URL set to actual Vercel domain
- [ ] Replicate webhook URL updated to Vercel domain
- [ ] Supabase storage buckets created and public
- [ ] Supabase database table (studio_jobs) exists
- [ ] Build succeeds locally (`npm run build`)
- [ ] Build succeeds on Vercel
- [ ] Geometric mode tested and working
- [ ] AI mode raster generation tested
- [ ] AI mode vectorization tested
- [ ] Webhook callbacks verified in logs
- [ ] Download functionality tested
- [ ] Mobile responsiveness checked
- [ ] CORS headers working
- [ ] Error handling tested

When all checked, TPV Studio is ready for production! 🚀
