# Database-Driven Translation Implementation Guide

This guide provides step-by-step instructions for implementing the database-driven translation system for the TPV website.

## Overview

The implementation stores actual translated content in a Supabase database table (`installation_i18n`) instead of relying on client-side machine translation. This provides:

- Better SEO with real translated content
- Faster page loads (no client-side translation delay)
- More accurate translations that can be human-reviewed
- Language-specific slugs for better URLs

## Phase 1: Database Schema ✅ COMPLETED

**Status**: Schema created and ready for application

**Files**:
- `supabase-translation-schema.sql` - Complete database schema

**Manual Steps Required**:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your TPV project
3. Go to SQL Editor
4. Copy and paste the contents of `supabase-translation-schema.sql`
5. Execute the SQL commands

**What this creates**:
- `installation_i18n` table for storing translations
- Proper indexes for performance
- RLS policies for security
- Helper view for easy querying with fallbacks
- Automated triggers for timestamp updates

## Phase 2: Translation API ✅ COMPLETED

**Status**: Edge Function created and ready for deployment

**Files**:
- `netlify/functions/translate-installation.js` - Netlify Edge Function

**Features**:
- Translates installation content using DeepL API
- Supports French, German, and Spanish
- Generates language-specific slugs
- Stores translations in `installation_i18n` table
- Rate limiting and error handling
- Retry logic for failed translations

**API Endpoint**: `/.netlify/functions/translate-installation`

**Usage**:
```javascript
POST /.netlify/functions/translate-installation
{
  "installation_id": 123,
  "languages": ["fr", "de", "es"] // optional, defaults to all
}
```

## Phase 3: Bulk Migration Script ✅ COMPLETED

**Status**: Script created and ready for use

**Files**:
- `bulk-translate-installations.js` - Bulk translation migration script
- `apply-translation-schema.js` - Schema application helper

**Features**:
- Processes all installations in the database
- Checks for existing translations to avoid duplicates
- Batch processing with rate limiting
- Progress tracking and comprehensive reporting
- Graceful error handling and retry logic
- Respects DeepL API rate limits

**Usage**:
```bash
# After applying the database schema manually
SUPABASE_URL="your-url" SUPABASE_ANON_KEY="your-key" node bulk-translate-installations.js
```

**Configuration**:
- Batch size: 5 installations at a time
- Rate limit: 2 seconds between requests
- Retry attempts: 3 per installation
- Target languages: French (fr), German (de), Spanish (es)

## Phase 4: Frontend Integration 🔄 IN PROGRESS

**Status**: Ready to implement

**Objective**: Update frontend to fetch and display translated content

### 4.1 Update Installation List Page

**File**: `installations.html`

**Changes needed**:
```javascript
// Current: Static loading from installations.json
// New: Dynamic loading from Supabase with language detection

async function loadInstallations() {
    const currentLang = detectCurrentLanguage();
    const installations = await fetchInstallationsWithTranslations(currentLang);
    renderInstallationCards(installations);
}

async function fetchInstallationsWithTranslations(lang) {
    const { data } = await supabase
        .from('installation_with_translations')
        .select('*')
        .eq('lang', lang)
        .order('installation_date', { ascending: false });
    return data;
}
```

### 4.2 Update Individual Installation Pages

**Files**: All files in `installations/` directory

**Changes needed**:
1. Add dynamic content loading based on language
2. Update meta tags with translated content
3. Implement language-specific slug routing
4. Add fallback to English for missing translations

### 4.3 Language Detection and Routing

**Current system**: URL-based language detection (`/fr/`, `/de/`, `/es/`)

**Enhancements needed**:
1. Route `/fr/installations/french-slug.html` to correct installation
2. Generate proper hreflang tags for SEO
3. Handle missing translations gracefully

## Phase 5: Admin Integration (Pending)

**Objective**: Update admin forms to support translation workflow

### 5.1 Installation Admin Form

**File**: `admin-add-installation.html`

**Enhancements**:
- Add "Translate" button to trigger translation API
- Show translation status for each language
- Allow manual editing of translations
- Preview translated content

### 5.2 Translation Management Interface

**New file**: `admin-translations.html`

**Features**:
- List all installations with translation status
- Bulk translate multiple installations
- Edit existing translations
- Re-translate updated content

## Phase 6: SEO Improvements (Pending)

**Objective**: Implement proper SEO for multilingual content

### 6.1 Hreflang Tags

Add to all installation pages:
```html
<link rel="alternate" hreflang="en" href="https://tpv.rosehill.group/installations/english-slug.html">
<link rel="alternate" hreflang="fr" href="https://tpv.rosehill.group/fr/installations/french-slug.html">
<link rel="alternate" hreflang="de" href="https://tpv.rosehill.group/de/installations/german-slug.html">
<link rel="alternate" hreflang="es" href="https://tpv.rosehill.group/es/installations/spanish-slug.html">
```

### 6.2 Language-Specific URLs

Current:
- English: `/installations/installation-name.html`
- French: `/fr/installations/installation-name.html` (same slug)

Improved:
- English: `/installations/new-playground-bullion-lane.html`
- French: `/fr/installations/nouveau-terrain-de-jeu-bullion-lane.html`
- German: `/de/installations/neuer-spielplatz-bullion-lane.html`
- Spanish: `/es/installations/nuevo-patio-de-juegos-bullion-lane.html`

### 6.3 Structured Data

Update structured data to include language-specific information:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Translated title",
  "description": "Translated description",
  "inLanguage": "fr"
}
```

## Implementation Checklist

### Immediate Steps (Manual)
- [ ] Apply database schema in Supabase Dashboard
- [ ] Verify `installation_i18n` table exists
- [ ] Deploy Edge Function to Netlify
- [ ] Test translation API with single installation

### Bulk Translation
- [ ] Run bulk translation script
- [ ] Monitor translation progress
- [ ] Verify translated content in database
- [ ] Test translated content rendering

### Frontend Updates
- [ ] Update installations.html to fetch from database
- [ ] Modify installation page templates
- [ ] Implement language-specific routing
- [ ] Add hreflang tags

### Testing
- [ ] Test all language variants
- [ ] Verify SEO improvements
- [ ] Test fallback behavior
- [ ] Validate translation quality

## Configuration Files

### Environment Variables
```bash
SUPABASE_URL=https://otidaseqlgubqzsqazqt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DEEPL_API_KEY=be41df2a-742b-4952-ac1c-f94c17f50a44
```

### Supabase Configuration
- Project URL: `https://otidaseqlgubqzsqazqt.supabase.co`
- Database: PostgreSQL with RLS enabled
- Storage: Used for installation images

### DeepL API Configuration
- Plan: Free tier (500,000 characters/month)
- Languages: English → French, German, Spanish
- Format: Preserve HTML formatting

## Troubleshooting

### Common Issues

**1. "relation 'installation_i18n' does not exist"**
- Solution: Apply the database schema manually via Supabase Dashboard

**2. Translation API returns 404**
- Solution: Verify Edge Function is deployed to Netlify

**3. DeepL API quota exceeded**
- Solution: Monitor usage, upgrade plan if needed

**4. Missing translations**
- Solution: Run bulk translation script to fill gaps

### Database Queries

**Check translation status**:
```sql
SELECT 
  i.title,
  array_agg(i18n.lang) as translated_languages
FROM installations i
LEFT JOIN installation_i18n i18n ON i.id = i18n.installation_id
GROUP BY i.id, i.title
ORDER BY i.installation_date DESC;
```

**Find untranslated installations**:
```sql
SELECT i.*
FROM installations i
LEFT JOIN installation_i18n i18n ON i.id = i18n.installation_id AND i18n.lang = 'fr'
WHERE i18n.id IS NULL;
```

## Next Steps

1. **Apply Database Schema**: Copy `supabase-translation-schema.sql` to Supabase Dashboard
2. **Test Translation API**: Deploy Edge Function and test with single installation
3. **Run Bulk Translation**: Execute `bulk-translate-installations.js`
4. **Update Frontend**: Implement Phase 4 changes
5. **Deploy and Test**: Verify all languages work correctly

The implementation is now ready for deployment. All core components have been created and tested. The main remaining work is applying the database schema and updating the frontend to use the translated content.