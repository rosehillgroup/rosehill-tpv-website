# Batch Translation Guide

## Overview

This script automatically translates all existing installations that are missing translations in French, German, and Spanish. It uses the same `translate-installation` Edge Function that powers the automated translation system.

## Features

- ✅ **Safe** - Won't overwrite existing translations
- ✅ **Resumable** - Can be interrupted and resumed later  
- ✅ **Rate Limited** - Respects DeepL API limits with delays
- ✅ **Error Handling** - Retries failed translations with backoff
- ✅ **Progress Tracking** - Shows detailed progress and saves state
- ✅ **Dry Run Mode** - Test without making actual changes
- ✅ **Detailed Logging** - See exactly what's happening

## Quick Start

### 1. Test with Dry Run (Recommended)

```bash
npm run batch-translate:dry-run
```

This will:
- Show you exactly which installations need translation
- Display what fields are missing for each language
- Simulate the translation process without making any changes

### 2. Run the Actual Translation

```bash
npm run batch-translate
```

This will:
- Start translating installations that need it
- Show progress with detailed logging
- Save progress state for resumability
- Handle errors and retries automatically

## Usage Examples

### Check what needs translating
```bash
npm run batch-translate:dry-run
```

### Translate everything
```bash
npm run batch-translate
```

### Resume after interruption
Just run the same command again - it will pick up where it left off:
```bash
npm run batch-translate
```

## What the Script Does

1. **Fetches installations** from Supabase that are missing any of:
   - `title_fr`, `title_de`, `title_es`
   - `location_fr`, `location_de`, `location_es`  
   - `description_fr`, `description_de`, `description_es`
   - `application_fr`, `application_de`, `application_es`

2. **Processes each installation** by calling the Edge Function
3. **Waits between calls** to respect DeepL rate limits (1 second default)
4. **Retries failures** up to 3 times with exponential backoff
5. **Saves progress** after each installation to allow resuming

## Configuration

You can modify these settings in the script if needed:

```javascript
const CONFIG = {
    TARGET_LANGS: ['fr', 'de', 'es'],           // Languages to translate to
    DELAY_BETWEEN_CALLS: 1000,                  // 1 second between calls
    MAX_RETRIES: 3,                             // Retry failed translations
    RETRY_DELAY: 5000,                          // 5 seconds between retries
    PROGRESS_FILE: './translation-progress.json' // Progress tracking file
};
```

## Progress Tracking

The script creates a `translation-progress.json` file that tracks:
- Which installations have been completed
- Which installations failed (with error details)
- When the process started
- Total counts and progress

This file allows you to:
- Resume if the process is interrupted
- See detailed failure information
- Track overall progress

## Example Output

```
🌍 Rosehill TPV Batch Translation Tool
📅 Started at: 2025-01-15T10:30:00.000Z
🎯 Target languages: fr, de, es
⚙️  Mode: LIVE TRANSLATION

🔍 Fetching installations from Supabase...
📊 Found 79 total installations
🔤 32 installations need translation

📋 Translation breakdown:
   • Community Playground Installation: fr: title, description; de: title, description; es: title, description
   • Basketball Court Installation: fr: location, application; de: location, application
   • Fort Kinnaird Shopping Centre: es: description, application
   ... and 29 more

🚀 Starting translation process for 32 installations

[1/32] Processing: Community Playground Installation
   Missing: fr: title, description; de: title, description; es: title, description
🔄 Translating "Community Playground Installation" (attempt 1/3)
   ✅ Translation completed: Translation completed for languages: fr, de, es
   ⏳ Waiting 1000ms before next translation...

[2/32] Processing: Basketball Court Installation
   Missing: fr: location, application; de: location, application
🔄 Translating "Basketball Court Installation" (attempt 1/3)
   ✅ Translation completed: Translation completed for languages: fr, de, es

...

🎉 Translation batch complete!
   ✅ Successful: 32
   ❌ Failed: 0
   ⏭️  Skipped: 0

🏁 Batch translation completed successfully!
```

## Error Handling

If a translation fails:
- The script will retry up to 3 times with increasing delays
- Failed installations are logged with error details
- The script continues with other installations
- You can manually retry failed installations later

## Graceful Shutdown

You can stop the script safely with `Ctrl+C`:
- Progress will be saved automatically
- You can resume later by running the script again
- No translations will be lost or corrupted

## After Translation

Once the batch translation is complete:
1. **Regenerate installation pages** to include new translations:
   ```bash
   SUPABASE_URL="https://..." SUPABASE_ANON_KEY="..." node generate-installation-pages-multilingual.cjs
   ```

2. **Verify results** by checking a few translated installations in the Supabase dashboard

3. **Test the multilingual pages** on your website to ensure they display correctly

## Troubleshooting

### "No installations need translation"
- All installations are already translated
- Check the Supabase dashboard to verify translation status

### "Failed to fetch installations"
- Check your `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables
- Verify network connectivity

### "Translation failed: HTTP 401"
- The Edge Function authentication might be misconfigured
- Check that the anon key has permission to call Edge Functions

### "Translation failed: HTTP 429"
- DeepL rate limit exceeded
- Increase `DELAY_BETWEEN_CALLS` in the script configuration
- The script will automatically retry with exponential backoff

## Advanced Usage

### Custom languages
Modify `TARGET_LANGS` to translate to different languages (must be supported by DeepL).

### Different rate limits
Adjust `DELAY_BETWEEN_CALLS` based on your DeepL plan:
- Free plan: 2000ms+ recommended
- Pro plan: 500ms+ should be fine
- Advanced plan: 100ms+ possible

### Resume from specific point
Edit `translation-progress.json` to modify the completed/failed arrays if needed.