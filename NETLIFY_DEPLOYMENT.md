# Netlify Deployment Guide

## 1. Environment Variables

Set these in your Netlify dashboard under **Site settings > Environment variables**:

### Required Variables

```bash
# Sanity CMS Configuration
SANITY_WRITE_TOKEN=your_sanity_write_token_here

# DeepL Translation (already configured)
DEEPL_API_KEY=be41df2a-742b-4952-ac1c-f94c17f50a44
```

### Optional Variables

```bash
# Netlify Build Hook (optional - for auto-rebuild after translations)
NETLIFY_BUILD_HOOK=https://api.netlify.com/build_hooks/your_hook_id
```

## 2. Getting Your Sanity Write Token

1. Go to [Sanity Management Console](https://www.sanity.io/manage)
2. Select your project: **rosehill-tpv-website** (ID: 68ola3dd)
3. Go to **API** tab
4. Click **Add API token**
5. Set permissions to **Editor** or **Maintainer**
6. Copy the token and add it to Netlify environment variables

## 3. Setting Up Build Hooks (Optional)

If you want automatic site rebuilds after translations:

1. In Netlify dashboard, go to **Site settings > Build & deploy**
2. Scroll to **Build hooks**
3. Click **Add build hook**
4. Name it "Translation Rebuild" 
5. Copy the webhook URL
6. Add it as `NETLIFY_BUILD_HOOK` environment variable

## 4. Deployment Configuration

Your `netlify.toml` is configured with:

- **Build command**: `npm run build` (builds Astro site)
- **Publish directory**: `site-astro/dist`
- **Functions**: `netlify/functions/` (translation webhook)
- **Node version**: 18.x
- **Timeout**: 30 seconds for functions

## 5. Setting Up Sanity Webhooks

After deployment, configure Sanity to trigger translations:

1. Go to Sanity Management Console
2. Navigate to **API > Webhooks**
3. Click **Create webhook**
4. Configure:
   - **Name**: "Translation Trigger"
   - **URL**: `https://your-site.netlify.app/.netlify/functions/translate-installation`
   - **Method**: POST
   - **Projection**: `{_id, publishedLocales}`
   - **Filter**: `_type == "installation"`

## 6. First Deploy Steps

1. **Connect Repository**: Link your Git repository to Netlify
2. **Set Environment Variables**: Add the required variables listed above
3. **Deploy**: Trigger your first build
4. **Test Translation Function**: 
   ```bash
   curl -X POST https://your-site.netlify.app/.netlify/functions/translate-installation \
     -H "Content-Type: application/json" \
     -d '{"documentId": "test-id", "targetLocales": ["fr", "de", "es"]}'
   ```

## 7. Monitoring

- **Build logs**: Check Netlify build logs for any errors
- **Function logs**: Monitor function execution in Netlify dashboard
- **Translation status**: Check Sanity Studio for translation progress

## 8. DNS Configuration

Once everything is working:

1. Update your domain DNS to point to Netlify
2. Configure custom domain in Netlify dashboard
3. Enable HTTPS (automatic with Netlify)

## 9. Post-Migration Checklist

- [ ] Environment variables configured
- [ ] First build successful
- [ ] Translation function working
- [ ] Sanity webhook configured
- [ ] Test installation migration completed
- [ ] DNS updated to new site
- [ ] Old Supabase system decommissioned

## Troubleshooting

### Build Fails
- Check Node version (should be 18.x)
- Verify all dependencies in `site-astro/package.json`
- Check build logs for specific errors

### Translation Function Errors
- Verify `SANITY_WRITE_TOKEN` is set correctly
- Check function logs in Netlify dashboard
- Test DeepL API connectivity

### Sanity Connection Issues
- Confirm project ID and dataset are correct
- Verify token permissions (Editor/Maintainer required)
- Check CORS settings if accessing from browser

This deployment architecture eliminates all the translation complexity you experienced with the previous system and provides a scalable, maintainable solution.