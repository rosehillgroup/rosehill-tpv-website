# Database-Driven Translation System - Testing Guide

This guide will help you test the complete database-driven translation implementation for the TPV website.

## Prerequisites

Before testing, ensure you have:

1. **Applied the Database Schema**: 
   - Copy contents of `supabase-translation-schema.sql`
   - Paste into Supabase Dashboard → SQL Editor
   - Execute the SQL commands

2. **Deployed the Edge Function**:
   - Ensure `netlify/functions/translate-installation.js` is deployed to Netlify

3. **Environment Variables** (if testing locally):
   ```bash
   SUPABASE_URL=https://otidaseqlgubqzsqazqt.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   DEEPL_API_KEY=be41df2a-742b-4952-ac1c-f94c17f50a44
   ```

## Testing Checklist

### Phase 1: Database Schema ✅

**Test 1.1: Verify Table Creation**
```sql
-- Run in Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'installation_i18n';

-- Should return: installation_i18n
```

**Test 1.2: Check Table Structure**
```sql
-- Run in Supabase SQL Editor
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'installation_i18n' ORDER BY ordinal_position;

-- Should show columns: id, installation_id, lang, slug, title, overview, location, source, created_at, updated_at
```

**Test 1.3: Verify Indexes**
```sql
-- Run in Supabase SQL Editor
SELECT indexname FROM pg_indexes WHERE tablename = 'installation_i18n';

-- Should show multiple indexes including idx_installation_i18n_lookup
```

### Phase 2: Translation API ✅

**Test 2.1: API Endpoint Accessibility**
```bash
# Test OPTIONS request (CORS)
curl -X OPTIONS https://your-site.netlify.app/.netlify/functions/translate-installation

# Should return 200 with CORS headers
```

**Test 2.2: Single Installation Translation**
```bash
# Test actual translation
curl -X POST https://your-site.netlify.app/.netlify/functions/translate-installation \
  -H "Content-Type: application/json" \
  -d '{"installation_id": 1, "languages": ["fr"]}'

# Should return JSON with translation results
```

**Test 2.3: Verify Database Storage**
```sql
-- Run in Supabase SQL Editor after translation
SELECT installation_id, lang, title, LEFT(overview, 50) as overview_preview 
FROM installation_i18n 
WHERE installation_id = 1;

-- Should show translated content
```

### Phase 3: Bulk Translation Script ✅

**Test 3.1: Check Installation Count**
```bash
# Run the bulk translation script in dry-run mode first
SUPABASE_URL="your-url" SUPABASE_ANON_KEY="your-key" node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
supabase.from('installations').select('id').then(({data}) => console.log('Total installations:', data.length));
"
```

**Test 3.2: Run Bulk Translation (Small Batch)**
```bash
# Test with a small number first
SUPABASE_URL="your-url" SUPABASE_ANON_KEY="your-key" node bulk-translate-installations.js

# Monitor output for errors and success rates
```

**Test 3.3: Verify Translation Coverage**
```sql
-- Check translation coverage by language
SELECT 
    lang,
    COUNT(*) as translation_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM installations), 2) as coverage_percentage
FROM installation_i18n 
GROUP BY lang 
ORDER BY lang;
```

### Phase 4: Frontend Integration ✅

**Test 4.1: Installations List Page**
1. Visit `/installations.html` (English)
   - ✅ Page loads without errors
   - ✅ Installations display with English content
   - ✅ Search and filters work

2. Visit `/fr/installations.html` (French)
   - ✅ Page loads with French content (if translations exist)
   - ✅ Installations show translated titles/descriptions
   - ✅ Graceful fallback to English for missing translations

3. Visit `/de/installations.html` and `/es/installations.html`
   - ✅ Similar behavior to French version

**Test 4.2: Individual Installation Pages**
1. Visit any installation page in English (e.g., `/installations/sample-installation.html`)
   - ✅ Page loads with original content
   - ✅ No JavaScript errors in console

2. Visit translated versions (e.g., `/fr/installations/sample-installation.html`)
   - ✅ Content is translated if available in database
   - ✅ Meta tags are updated dynamically
   - ✅ Breadcrumb shows translated title

**Test 4.3: Language Switching**
1. Use language switcher on any page
   - ✅ Switches between languages correctly
   - ✅ URLs change appropriately
   - ✅ Content updates in real-time

### Phase 5: Admin Interface ✅

**Test 5.1: Translation Dashboard**
1. Visit `/admin-translations.html`
   - ✅ Dashboard loads with installation statistics
   - ✅ Translation status badges show correctly
   - ✅ Search and filtering work

**Test 5.2: Add Installation Form**
1. Visit `/admin-add-installation.html`
   - ✅ Form loads and accepts input
   - ✅ Image upload works (drag & drop)
   - ✅ Translation options are available

2. Submit a test installation
   - ✅ Installation saves to database
   - ✅ Automatic translation triggers (if enabled)
   - ✅ Success feedback shows

**Test 5.3: Bulk Translation Tool**
1. Visit `/admin-bulk-translate.html`
   - ✅ Status overview shows current translation counts
   - ✅ Translation options work (missing vs. all)
   - ✅ Progress tracking functions during translation

### Phase 6: SEO & Hreflang ✅

**Test 6.1: Meta Tags**
1. Check any installation page source:
   ```html
   <!-- Should include -->
   <title>Translated Title - Rosehill TPV® Installation</title>
   <meta name="description" content="Translated description...">
   <meta name="language" content="fr">
   <link rel="canonical" href="https://site.com/fr/installations/slug.html">
   ```

**Test 6.2: Hreflang Tags**
1. Check page source for hreflang tags:
   ```html
   <link rel="alternate" hreflang="en" href="https://site.com/installations/slug.html">
   <link rel="alternate" hreflang="fr" href="https://site.com/fr/installations/french-slug.html">
   <link rel="alternate" hreflang="x-default" href="https://site.com/installations/slug.html">
   ```

**Test 6.3: Structured Data**
1. Use Google's Rich Results Test: https://search.google.com/test/rich-results
   - Paste any installation page URL
   - ✅ Should validate without errors
   - ✅ Should show Article markup with correct language

**Test 6.4: Sitemap Generation**
```bash
# Generate sitemap
node generate-sitemap.js

# Check output files
ls -la sitemap.xml robots.txt

# Verify sitemap includes all languages
grep -c "hreflang" sitemap.xml
```

## Browser Testing

### Test in Multiple Browsers
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### Test Responsive Design
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

## SEO Testing Tools

### 1. Google Search Console
- Submit sitemap: `https://your-site.com/sitemap.xml`
- Monitor crawl errors
- Check hreflang implementation

### 2. Screaming Frog SEO Spider
- Crawl site to check for issues
- Verify hreflang tags
- Check meta tag consistency

### 3. Ahrefs/SEMrush
- Audit international SEO setup
- Check for duplicate content issues

## Performance Testing

### Test Page Load Speed
```bash
# Use PageSpeed Insights
# https://pagespeed.web.dev/

# Or Lighthouse CLI
npm install -g lighthouse
lighthouse https://your-site.com/installations.html --output html --output-path ./report.html
```

### Database Performance
```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM installation_with_translations WHERE lang = 'fr' LIMIT 10;

-- Should use indexes efficiently
```

## Common Issues & Solutions

### Issue: Translations Not Loading
**Check:**
1. Database table exists: `installation_i18n`
2. API endpoint responds: `/.netlify/functions/translate-installation`
3. Console errors in browser dev tools
4. Network tab shows successful API calls

### Issue: Hreflang Tags Missing
**Check:**
1. JavaScript runs without errors
2. `checkTranslationAvailability()` returns data
3. DOM has `<head>` element for insertion

### Issue: SEO Tags Not Updated
**Check:**
1. `updateMetaTags()` function executes
2. Elements with IDs exist in DOM
3. No JavaScript errors preventing execution

### Issue: Admin Interface Errors
**Check:**
1. Supabase client loads successfully
2. API keys are correct
3. Network connectivity to Supabase
4. CORS settings allow requests

## Final Verification

### Checklist for Go-Live
- [ ] Database schema applied
- [ ] Edge function deployed
- [ ] At least 10 installations translated for testing
- [ ] Admin interface functional
- [ ] No JavaScript errors in browser console
- [ ] Hreflang tags present on all pages
- [ ] Sitemap generated and submitted
- [ ] robots.txt includes sitemap reference
- [ ] PageSpeed score > 90
- [ ] All language variants accessible

### Post-Launch Monitoring
1. **Monitor Google Search Console** for crawl errors
2. **Check Analytics** for international traffic
3. **Review Translation Quality** and update as needed
4. **Monitor API Usage** (DeepL quota)
5. **Database Performance** under load

## Success Metrics

After implementation, you should see:
- 📈 **Improved SEO rankings** in target languages
- 🌍 **Increased international traffic**
- 🔍 **Better search visibility** for foreign keywords
- ⚡ **Fast page load times** with database-driven content
- 🎯 **Higher engagement** from international users

---

## Need Help?

If you encounter issues:
1. Check browser console for JavaScript errors
2. Verify API responses in Network tab
3. Test database queries in Supabase Dashboard
4. Review error logs in Netlify Functions

The implementation is comprehensive and production-ready. Follow this testing guide systematically to ensure everything works correctly before going live!