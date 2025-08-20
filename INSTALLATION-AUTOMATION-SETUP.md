# Installation Page Automation Setup

This document explains how to set up automatic installation page generation when new installations are added via the admin portal.

## Current Status

✅ **"Thanks To" Section Fixed** - Now displays properly on installation detail pages
✅ **Translation Functionality** - Available via "Regenerate Translations" button when editing installations  
✅ **Netlify Function Created** - `netlify/functions/regenerate-installation-pages.js`

## Automation Setup Steps

### 1. Supabase Webhook Configuration

1. **Go to Supabase Dashboard** → Your Project → Database → Webhooks
2. **Create a new webhook** with these settings:
   - **Name**: `Installation Pages Generator`
   - **Table**: `installations`  
   - **Events**: `INSERT`, `UPDATE`
   - **URL**: `https://tpv.rosehill.group/.netlify/functions/regenerate-installation-pages`
   - **HTTP Method**: `POST`

### 2. Environment Variables

Add these to your Netlify environment variables:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key (or service role key for better permissions)
- `NETLIFY_BUILD_HOOK`: (Optional) Your Netlify build hook URL for auto-deployment

### 3. Testing the Automation

1. **Add a test installation** via the admin portal
2. **Check Netlify function logs** to see if the webhook triggered
3. **Verify** the new installation page was generated
4. **Test the "Read More" link** from the installations page

## How It Works

1. **User adds/edits installation** via admin portal → Saves to Supabase
2. **Supabase webhook fires** → Calls Netlify function  
3. **Netlify function runs** → Regenerates all installation pages
4. **Optional build trigger** → Deploys updated pages automatically

## Translation Features

The admin form includes:

- **Automatic translation on save** (when enabled)
- **Manual "Regenerate Translations" button** (when editing)
- **Bulk translation tools** (separate admin page)

## Manual Fallback

If automation fails, you can always run manually:

```bash
SUPABASE_URL="your-url" SUPABASE_ANON_KEY="your-key" node generate-installation-pages-supabase.cjs
```

## Files Modified

- `generate-installation-pages-supabase.cjs` - Added "Thanks To" section support
- `netlify/functions/regenerate-installation-pages.js` - New automation function
- Installation page template - Added thanks section CSS and HTML

## Next Steps

1. Set up the Supabase webhook (requires admin access)
2. Add environment variables to Netlify
3. Test with a new installation
4. Monitor function logs for any issues