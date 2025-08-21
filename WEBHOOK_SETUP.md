# Sanity Webhook Setup Guide

## Overview

This guide will help you set up the Sanity webhook to automatically trigger translations when you publish installations to new languages.

## Step 1: Deploy to Netlify First

Before setting up webhooks, you need to deploy your site to Netlify:

1. **Connect Repository**: 
   - Go to Netlify dashboard
   - Click "Add new site" > "Import an existing project"
   - Connect to your Git repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `site-astro/dist`
   - Node version: 18.x

3. **Set Environment Variables** in Netlify dashboard:
   ```
   SANITY_WRITE_TOKEN = skuvfq4qS9hLxVfhl9et4GwAaPWX5IJQoLsHvLrGl1sApNfRQSI16a8jKum6ekKWROcbApcSYgUlq2UiNrFdjRUTa96bDeh323mhSS0zARmQxuS9HiWoiaxXnQzGKri9qftdREHGAa6CXrWPtOYTCiacblZIojWCrAgX8sIVrFFbKOCAN79R
   DEEPL_API_KEY = be41df2a-742b-4952-ac1c-f94c17f50a44
   ```

## Step 2: Create Sanity Webhook

Once your site is deployed:

1. **Go to Sanity Management Console**: https://www.sanity.io/manage
2. **Select your project**: rosehill-tpv-website (ID: 68ola3dd)
3. **Navigate to API > Webhooks**
4. **Click "Create webhook"**

### Webhook Configuration:

```yaml
Name: "Translation Trigger"
URL: "https://your-site-name.netlify.app/.netlify/functions/translate-installation"
Method: POST
Dataset: production
Filter: _type == "installation"
```

### Advanced Settings:

**Projection** (copy this exactly):
```groq
{
  _id,
  _type,
  publishedLocales,
  title,
  slug,
  overview,
  location
}
```

**HTTP Headers**:
```
Content-Type: application/json
```

## Step 3: Test the Webhook

### Manual Test via Sanity Studio:

1. **Open Sanity Studio**: http://localhost:3333
2. **Edit any installation**
3. **Add a new locale to "Published Locales"** (e.g., add "fr" for French)
4. **Save the document**
5. **Check Netlify function logs** to see if translation was triggered

### Manual Test via API:

```bash
curl -X POST https://your-site-name.netlify.app/.netlify/functions/translate-installation \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "j5lOWBYah3CC7YUnpz4TAI",
    "targetLocales": ["fr", "de", "es"]
  }'
```

## Step 4: Workflow for Content Editors

### Creating New Installation:

1. **Go to Sanity Studio**: http://localhost:3333
2. **Create new Installation document**
3. **Fill in English content**:
   - Title
   - Overview/Description
   - Location (City, Country)
   - Installation Date
   - Application Type
   - Any images

4. **Set "Published Locales" to include target languages**:
   - Start with just `["en"]`
   - To trigger translations, add `["en", "fr", "de", "es"]`

5. **Save document** - This triggers the webhook automatically

### Translation Process:

1. **Automatic Translation**: DeepL translates content within ~30 seconds
2. **Review Translations**: Go back to the document and review machine translations
3. **Edit if needed**: Improve machine translations for accuracy
4. **Update Status**: Change translation status from "machine-translated" to "human-reviewed"

## Step 5: Monitoring and Debugging

### Check Function Logs:
- Go to Netlify dashboard > Functions tab
- Click on "translate-installation" function
- View logs for any errors

### Check Translation Status in Sanity:
- Each installation has a "Translation Status" field
- Shows status for each language: not-started, machine-translated, human-reviewed, published

### Verify Site Build:
- After translations, site should rebuild automatically
- Check new language pages at:
  - `/fr/installations/` (French)
  - `/de/installations/` (German)  
  - `/es/installations/` (Spanish)

## Step 6: Production Checklist

- [ ] Netlify site deployed successfully
- [ ] Environment variables set in Netlify
- [ ] Sanity webhook created and tested
- [ ] Translation function working (check logs)
- [ ] New language pages generating correctly
- [ ] DNS pointed to Netlify (when ready)

## Troubleshooting

### Webhook Not Triggering:
- Check webhook URL is correct (should include your actual Netlify domain)
- Verify webhook filter: `_type == "installation"`
- Check Sanity webhook logs in management console

### Translation Function Errors:
- Verify SANITY_WRITE_TOKEN is set correctly in Netlify
- Check DeepL API key is working
- Review function logs in Netlify dashboard

### No Language Pages Generated:
- Ensure publishedLocales includes the target language
- Check that translations were actually created in Sanity
- Verify Astro build succeeded after translations

This setup enables the "write once, translate automatically" workflow you wanted!