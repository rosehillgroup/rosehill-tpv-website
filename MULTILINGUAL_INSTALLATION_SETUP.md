# Automated Multilingual Installation Translation Setup

This setup enables automatic translation of installation content when uploaded to Supabase, creating fully multilingual installation pages without manual work.

## 🏗️ Architecture Overview

1. **Upload Installation (English)** → Supabase `installations` table
2. **Database Trigger** → Automatically calls Supabase Edge Function
3. **Edge Function** → Translates content using DeepL API and stores in language-specific columns
4. **Build Process** → Generates multilingual installation pages using translated content

## 📋 Setup Steps

### 1. Deploy Database Changes

Run the SQL migrations to add language columns and triggers:

```bash
# Apply the migrations in your Supabase dashboard or CLI
# File: supabase/migrations/001_add_language_columns.sql
# File: supabase/migrations/002_create_translation_trigger.sql
```

### 2. Deploy Edge Function

Deploy the translation Edge Function:

```bash
# Using Supabase CLI
supabase functions deploy translate-installation

# Or upload manually through Supabase dashboard
# File: supabase/functions/translate-installation/index.ts
```

### 3. Set Environment Variables

In your Supabase project settings, add:

```
DEEPL_API_KEY=your-deepl-api-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Enable Required Extensions

In your Supabase SQL Editor, enable the pg_net extension:

```sql
-- Enable HTTP requests from database
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Set configuration for the function URL and service key
-- These can be set via Supabase dashboard in Settings > Database > Config
ALTER DATABASE postgres SET app.settings.supabase_url = 'https://your-project.supabase.co';
ALTER DATABASE postgres SET app.settings.service_role_key = 'your-service-role-key';
```

### 5. Test the System

Upload a new installation or update an existing one - translation should happen automatically!

## 🎯 How It Works

### When You Upload an Installation:

1. **Insert/Update** installation in Supabase
2. **Trigger fires** → calls `translate-installation` Edge Function
3. **Edge Function** fetches the installation data
4. **DeepL API** translates title, location, description, application
5. **Database updated** with translations in `title_fr`, `description_de`, etc.
6. **Build process** generates multilingual pages using appropriate language columns

### Language Fallback Strategy:

1. Try language-specific column (`title_fr`)
2. Fallback to English column (`title_en`) 
3. Final fallback to original column (`title`)

This ensures pages always have content even if translation fails.

## 📝 Database Schema

### New Columns Added:

```sql
-- English (source)
title_en, location_en, description_en, application_en

-- French
title_fr, location_fr, description_fr, application_fr

-- German  
title_de, location_de, description_de, application_de

-- Spanish
title_es, location_es, description_es, application_es

-- Translation tracking
translation_status JSONB
```

### Translation Status Tracking:

```json
{
  "fr": true,
  "de": true, 
  "es": false,
  "last_translated": "2025-08-15T10:30:00Z"
}
```

## 🔧 Usage

### For New Installations:

Just upload normally! Translation happens automatically.

### For Existing Installations:

Use the manual translation function:

```sql
-- Translate 5 installations that need translation
SELECT translate_existing_installations(5);
```

### Building Multilingual Pages:

```bash
# Generate installation pages for all languages
node generate-installation-pages-multilingual.cjs
```

## 🚀 Integration with Current Build

Update your `i18n/translate-netlify.js` to call the multilingual generator:

```javascript
// Add to the main translation script
const { generateMultilingualInstallationPages } = require('../generate-installation-pages-multilingual.cjs');

// Call during build process
await generateMultilingualInstallationPages();
```

## 📊 Monitoring

### Translation Logs:

Check the `translation_logs` table for debugging:

```sql
SELECT * FROM translation_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

### Translation Status:

Check which installations need translation:

```sql
SELECT title, translation_status 
FROM installations 
WHERE (translation_status->>'fr')::boolean = false
   OR (translation_status->>'de')::boolean = false  
   OR (translation_status->>'es')::boolean = false;
```

## 🎉 Benefits

✅ **Fully Automated** - Upload once, get all languages
✅ **SEO Optimized** - Each language has proper URLs and metadata  
✅ **Fast Loading** - No runtime translation, pre-generated content
✅ **Editable** - Can manually edit translations in Supabase
✅ **Scalable** - Easy to add more languages
✅ **Cost Effective** - Only translates new/changed content
✅ **Reliable** - Fallback strategy ensures content always displays

## 🛠️ Troubleshooting

### Translation Not Working:

1. Check Edge Function logs in Supabase dashboard
2. Verify DEEPL_API_KEY is set correctly
3. Check `translation_logs` table for errors
4. Ensure pg_net extension is enabled

### Missing Translations:

```sql
-- Manually trigger translation for specific installation
SELECT net.http_post(
  url := 'https://your-project.supabase.co/functions/v1/translate-installation',
  headers := '{"Content-Type": "application/json"}'::jsonb,
  body := '{"id": "installation-uuid-here"}'::jsonb
);
```

### Build Issues:

Ensure the multilingual generator can access Supabase:

```bash
# Set environment variables before running
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
node generate-installation-pages-multilingual.cjs
```