# 🚀 Netlify Deployment Steps

## ✅ Pre-Deployment Status
- **85 installations** migrated successfully
- **87 pages** building without errors 
- **Environment variables** configured
- **Translation function** tested and working
- **Sanity CMS** ready at localhost:3333

---

## 📋 Deployment Steps

### 1. Connect Repository to Netlify

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Click "Add new site"** > "Import an existing project"
3. **Connect to Git provider** (GitHub/GitLab/Bitbucket)
4. **Select this repository**: `TPV_2025_Deploy`

### 2. Configure Build Settings

When prompted, enter these **exact** settings:

```bash
Build command: npm run build
Publish directory: site-astro/dist
Node version: 18.x
```

**Important**: Make sure the build command is `npm run build` (not `cd site-astro && npm run build`)

### 3. Environment Variables

In **Site settings > Environment variables**, confirm these are set:

```
SANITY_WRITE_TOKEN = skuvfq4qS9hLxVfhl9et4GwAaPWX5IJQoLsHvLrGl1sApNfRQSI16a8jKum6ekKWROcbApcSYgUlq2UiNrFdjRUTa96bDeh323mhSS0zARmQxuS9HiWoiaxXnQzGKri9qftdREHGAa6CXrWPtOYTCiacblZIojWCrAgX8sIVrFFbKOCAN79R

DEEPL_API_KEY = be41df2a-742b-4952-ac1c-f94c17f50a44
```

### 4. Deploy & Test

1. **Trigger first build** - Should complete successfully
2. **Check build logs** for any issues
3. **Visit your site** - Should show all 85 installations
4. **Test a sample page**: `/installations/new-playground-at-bullion-lane-primary-school/`

---

## 🔧 After Successful Deployment

### 5. Configure Sanity Webhook

1. **Copy your Netlify site URL** (e.g., `https://amazing-site-123.netlify.app`)
2. **Go to Sanity Management Console**: https://www.sanity.io/manage
3. **Select project**: rosehill-tpv-website (68ola3dd)
4. **API > Webhooks > Create webhook**

**Webhook Settings**:
```
Name: Translation Trigger
URL: https://YOUR-SITE.netlify.app/.netlify/functions/translate-installation
Method: POST
Dataset: production
Filter: _type == "installation"
```

### 6. Test Translation Workflow

1. **Open Sanity Studio**: http://localhost:3333
2. **Edit any installation**
3. **Change "Published Locales"** from `["en"]` to `["en", "fr"]`
4. **Save** - This should trigger automatic translation
5. **Check Netlify function logs** for success
6. **Visit French page**: `https://your-site.netlify.app/fr/`

---

## 🎯 Success Checklist

- [ ] Site deploys successfully on Netlify
- [ ] All 85 installation pages accessible
- [ ] Function logs show no errors
- [ ] Sanity webhook configured
- [ ] Translation test successful
- [ ] French pages generating correctly

---

## 🆘 Troubleshooting

### Build Fails
- Check Node version is 18.x
- Verify build command is exactly `npm run build`
- Check environment variables are set

### Function Errors
- Verify SANITY_WRITE_TOKEN in Netlify env vars
- Check function URL in webhook is correct
- Review function logs in Netlify dashboard

### No Translations
- Confirm webhook filter: `_type == "installation"`
- Check that publishedLocales includes target language
- Verify DeepL API key is working

---

Ready to deploy? Let's go! 🚀