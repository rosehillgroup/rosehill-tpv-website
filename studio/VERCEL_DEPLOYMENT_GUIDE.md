# TPV Studio - Vercel Deployment Guide

## Overview

This guide covers the migration of TPV Studio from Netlify to Vercel. The project is a React 18 + Vite application with serverless functions for AI-powered design generation.

---

## ✅ Configuration Files Created

The following files have been created to support Vercel deployment:

### 1. `vercel.json`
- **Purpose**: Routing configuration, security headers, cache control
- **Key Features**:
  - SPA routing (all routes → `/index.html`)
  - Security headers (CSP, X-Frame-Options, etc.)
  - Cache control for assets and API endpoints
  - API endpoint routing

### 2. `middleware.ts`
- **Purpose**: Edge middleware for geo-location cookie
- **Functionality**: Replicates Netlify's `geo-cookie` edge function
- **Sets**: `nl_geo` cookie with country, region, city, lat/lng, timezone
- **Runs on**: All routes (`/:path*`)

### 3. `vite.config.js` (Updated)
- **Changed**: `base: '/studio/'` → `base: '/'`
- **Reason**: Vercel Root Directory will be set to `studio`, so base path should be `/`

### 4. `api/` Directory
- **Purpose**: Vercel serverless functions
- **Structure**: `/studio/api/` for function files, `/studio/api/_utils/` for shared utilities

---

## 🔧 Vercel Project Settings (CRITICAL)

Log in to Vercel and configure your project with these **exact** settings:

### General Settings

| Setting | Value | Critical? |
|---------|-------|-----------|
| **Root Directory** | `studio` | ⚠️ **YES - MUST SET** |
| **Framework Preset** | Vite | Auto-detected |
| **Build Command** | `npm run build` | Default |
| **Output Directory** | `dist` | Default |
| **Install Command** | `npm install` | Default |
| **Node.js Version** | `20.x` | Recommended |

**⚠️ CRITICAL**: You MUST set **Root Directory** to `studio` in Vercel Project Settings → General. Without this, the deployment will fail.

### How to Set Root Directory:
1. Go to Vercel Dashboard → Your Project
2. Click **Settings** tab
3. Click **General** in left sidebar
4. Scroll to **Root Directory**
5. Click **Edit** button
6. Enter: `studio`
7. Click **Save**

---

## 🔐 Environment Variables

All environment variables from Netlify have been copied to Vercel. **Important**: Verify the following:

### Client-Side Variables (Must be "Exposed")

These variables are embedded in the build and sent to the browser:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

**How to set as exposed**:
1. Go to Vercel Project Settings → Environment Variables
2. For each `VITE_*` variable, check the **"Expose to front-end"** checkbox
3. Save changes

### Server-Only Variables (Keep Private)

All other variables should remain server-only (NOT exposed):

```
SUPABASE_SERVICE_ROLE
REPLICATE_API_TOKEN
ANTHROPIC_API_KEY
SANITY_WRITE_TOKEN
AUTH0_CLIENT_ID
JWT_SECRET
ADMIN_PASSWORD_HASH
DEEPL_API_KEY
GOOGLE_MAPS_API_KEY
```

### Variables to Update

Update these variables with Vercel-specific values:

| Variable | Current (Netlify) | Update To (Vercel) |
|----------|-------------------|---------------------|
| `PUBLIC_BASE_URL` | `https://tpv.rosehill.group` | Vercel deployment URL initially, then custom domain |
| `NODE_VERSION` | `20` | Remove (set in project settings instead) |

---

## 📦 Serverless Functions Migration

Your project has 35+ Netlify Functions. You'll need to migrate the ones your studio app uses.

### Function Migration Process

#### Step 1: Identify Required Functions

The studio app likely uses these core functions:
- `studio-inspire-simple.js` - Creates design jobs
- `studio-draftify.js` - Vectorizes concepts
- `studio-enqueue.js` - Job queue management
- `studio-job-status.js` - Status polling
- `replicate-callback.js` - Webhook handler

#### Step 2: Convert Function Format

**Netlify Format** (current):
```javascript
// netlify/functions/studio-inspire-simple.js
const { getSupabaseServiceClient } = require('./studio/_utils/supabase.js');

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);

  // Function logic here

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, data })
  };
}
```

**Vercel Format** (required):
```javascript
// studio/api/studio-inspire-simple.js
import { getSupabaseServiceClient } from './_utils/supabase.js';

export default async function handler(req, res) {
  // Vercel automatically parses JSON body
  const body = req.body;

  // Function logic here (mostly unchanged)

  res.status(200).json({ success: true, data });
}
```

#### Step 3: Key Differences

| Aspect | Netlify | Vercel |
|--------|---------|--------|
| **Entry Point** | `exports.handler` | `export default function handler` |
| **Request Body** | `JSON.parse(event.body)` | `req.body` (auto-parsed) |
| **Query Params** | `event.queryStringParameters` | `req.query` |
| **HTTP Method** | `event.httpMethod` | `req.method` |
| **Response** | Return object with `statusCode`, `body` | Use `res.status().json()` |
| **Headers** | `event.headers` | `req.headers` |
| **Module System** | CommonJS (`require`) | ESM (`import`) |

#### Step 4: Migrate Utilities

Your Netlify functions use utilities from `/netlify/functions/studio/_utils/`. Copy these to `/studio/api/_utils/`:

```bash
# From Netlify location:
netlify/functions/studio/_utils/
├── supabase.js
├── replicate.js
├── vectorize.js
└── ...

# To Vercel location:
studio/api/_utils/
├── supabase.js
├── replicate.js
├── vectorize.js
└── ...
```

Update import paths:
```javascript
// Before (Netlify)
const { getSupabaseServiceClient } = require('./studio/_utils/supabase.js');

// After (Vercel)
import { getSupabaseServiceClient } from './_utils/supabase.js';
```

#### Step 5: Update Webhook URLs

In your functions that create webhooks, update the callback URL:

```javascript
// Before (Netlify)
const webhookUrl = `${process.env.PUBLIC_BASE_URL}/.netlify/functions/replicate-callback`;

// After (Vercel)
const webhookUrl = `${process.env.PUBLIC_BASE_URL}/api/replicate-callback`;
```

### Example: Full Function Migration

**Before** (`netlify/functions/studio-job-status.js`):
```javascript
const { getSupabaseServiceClient } = require('./studio/_utils/supabase.js');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { jobId } = JSON.parse(event.body);
  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from('design_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job: data })
  };
};
```

**After** (`studio/api/studio-job-status.js`):
```javascript
import { getSupabaseServiceClient } from './_utils/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { jobId } = req.body;
  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from('design_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ job: data });
}
```

---

## 🧪 Testing Strategy

### Phase 1: Local Testing

1. **Build the App**:
   ```bash
   cd /Volumes/Marketing_SSD/Websites\ 2025/TPV_2025_Deploy/studio/
   npm run build
   ```

2. **Check Build Output**:
   - Should create `/studio/dist/` directory
   - Should contain `index.html`, `assets/` folder
   - No errors related to base path

3. **Test Functions Locally** (Optional):
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Run Vercel development server
   vercel dev
   ```

### Phase 2: Staging Deployment (Preview)

1. **Deploy to Vercel**:
   - Push your changes to GitHub
   - Vercel will auto-deploy a preview
   - Or manually deploy: `vercel --prod=false`

2. **Test Checklist**:

   **Frontend Tests**:
   - [ ] App loads at preview URL
   - [ ] No console errors
   - [ ] Assets load correctly (images, CSS, JS)
   - [ ] Client-side routing works (navigate between pages)
   - [ ] Environment variables accessible (check for `VITE_SUPABASE_URL`)

   **API Tests** (once functions migrated):
   - [ ] POST request to `/api/studio-inspire-simple` returns response
   - [ ] POST request to `/api/studio-job-status` returns job data
   - [ ] Webhook callback at `/api/replicate-callback` handles requests
   - [ ] No CORS errors in browser console

   **Integration Tests**:
   - [ ] Supabase database connectivity works
   - [ ] Replicate API calls succeed
   - [ ] Anthropic API calls succeed (if used)
   - [ ] Job creation → status polling → completion workflow works

   **Edge Middleware Tests**:
   - [ ] `nl_geo` cookie is set (check browser DevTools → Application → Cookies)
   - [ ] Cookie contains geographic data (country, region, etc.)

### Phase 3: Production Deployment

1. **Configure Custom Domain** (if desired):
   - Go to Vercel Project Settings → Domains
   - Add `studio.tpv.rosehill.group` or keep on main domain
   - Configure DNS (Vercel provides instructions)
   - Wait for SSL certificate to provision

2. **Update Environment Variables**:
   - Change `PUBLIC_BASE_URL` to production URL
   - Verify all other variables are correct

3. **Update External Services**:
   - **Replicate Dashboard**: Update webhook URLs to point to Vercel
   - **Supabase**: Check CORS settings if needed
   - **Auth0**: Update callback URLs if studio uses Auth0

4. **Deploy to Production**:
   - Push to `main` branch, or
   - Manually promote preview deployment in Vercel dashboard

5. **Post-Deployment Validation**:
   - Run through all test checklist items again
   - Monitor Vercel function logs for errors
   - Check performance metrics

---

## 🚨 Common Issues & Solutions

### Issue: "404 Not Found" on All Routes

**Cause**: Root Directory not set to `studio` in Vercel settings
**Solution**: Go to Project Settings → General → Root Directory → Set to `studio`

### Issue: "Module not found" Errors in Functions

**Cause**: Import paths incorrect or utilities not migrated
**Solution**:
- Ensure utilities copied to `/studio/api/_utils/`
- Update imports to use relative paths (`./_utils/...`)
- Check for CommonJS vs ESM issues

### Issue: Environment Variables Undefined

**Cause**: Variables not marked as "Exposed" (for VITE_* vars)
**Solution**: Go to Project Settings → Environment Variables → Check "Expose to front-end" for `VITE_*` variables

### Issue: CORS Errors

**Cause**: API endpoints not responding with correct headers
**Solution**: Add CORS headers in function response:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

### Issue: Function Timeout

**Cause**: Vercel has 10-second timeout on Hobby plan, 60s on Pro
**Solution**:
- Optimize function performance
- Consider upgrading to Vercel Pro if needed
- Use background jobs for long-running tasks

### Issue: Assets Not Loading

**Cause**: Base path configuration incorrect
**Solution**: Verify `vite.config.js` has `base: '/'` and Root Directory is `studio`

---

## 📋 Deployment Checklist

### Pre-Deployment

- [x] Created `vercel.json`
- [x] Created `middleware.ts`
- [x] Updated `vite.config.js` base path to `/`
- [x] Created `api/` directory structure
- [ ] Migrated required serverless functions to `/studio/api/`
- [ ] Migrated utility functions to `/studio/api/_utils/`
- [ ] Updated webhook callback URLs in code
- [ ] Tested local build (`npm run build`)

### Vercel Project Configuration

- [ ] Set **Root Directory** to `studio` in Vercel project settings
- [ ] Verified Framework Preset: Vite
- [ ] Verified Build Command: `npm run build`
- [ ] Verified Output Directory: `dist`
- [ ] Verified Install Command: `npm install`
- [ ] Set Node.js Version to `20.x`

### Environment Variables

- [ ] All variables from Netlify copied to Vercel
- [ ] `VITE_*` variables marked as "Exposed to front-end"
- [ ] `PUBLIC_BASE_URL` updated to Vercel deployment URL
- [ ] All API keys verified (Supabase, Replicate, Anthropic, etc.)

### Testing - Preview Environment

- [ ] App loads successfully
- [ ] No console errors
- [ ] SPA routing works
- [ ] Assets load correctly
- [ ] API endpoints respond (if migrated)
- [ ] Database connectivity works
- [ ] AI integrations work
- [ ] Webhooks functional
- [ ] Geo-cookie middleware sets cookie

### Production Deployment

- [ ] Custom domain configured (if applicable)
- [ ] DNS records updated
- [ ] SSL certificate provisioned
- [ ] `PUBLIC_BASE_URL` updated to production domain
- [ ] External service webhooks updated (Replicate, etc.)
- [ ] Supabase CORS settings verified
- [ ] Auth0 callbacks updated (if applicable)

### Post-Deployment Monitoring

- [ ] Checked Vercel function logs for errors
- [ ] Verified user workflows work end-to-end
- [ ] Monitored performance metrics
- [ ] No errors in browser console
- [ ] Analytics tracking works (if applicable)

---

## 📚 Additional Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel API Routes**: https://vercel.com/docs/functions/serverless-functions
- **Vercel Edge Middleware**: https://vercel.com/docs/functions/edge-middleware
- **Vite Configuration**: https://vitejs.dev/config/
- **React on Vercel**: https://vercel.com/docs/frameworks/vite

---

## 🆘 Need Help?

If you encounter issues during migration:

1. **Check Vercel Deployment Logs**: Vercel Dashboard → Deployments → Click deployment → View logs
2. **Check Function Logs**: Vercel Dashboard → Functions → Select function → View logs
3. **Check Browser Console**: F12 → Console tab for client-side errors
4. **Review this guide**: Many common issues are documented above

---

## ✅ What's Complete vs. Pending

### ✅ Completed Configuration

1. ✅ `vercel.json` created with routing and headers
2. ✅ `middleware.ts` created for geo-cookie edge function
3. ✅ `vite.config.js` updated (base path changed to `/`)
4. ✅ `api/` directory structure created

### ⏳ Pending (User Action Required)

1. ⏳ Set **Root Directory** to `studio` in Vercel project settings
2. ⏳ Mark `VITE_*` env vars as "Exposed" in Vercel
3. ⏳ Migrate serverless functions from Netlify to Vercel format
4. ⏳ Copy utility functions to `api/_utils/`
5. ⏳ Update webhook callback URLs in code
6. ⏳ Test in Vercel preview environment
7. ⏳ Configure custom domain (optional)
8. ⏳ Deploy to production

---

**Last Updated**: January 2025
