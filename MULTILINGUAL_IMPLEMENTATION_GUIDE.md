# Multilingual Implementation Guide

This guide explains how to implement multilingual support for static websites using DeepL API translation with Netlify deployment.

## Overview

The multilingual system automatically translates static HTML pages into multiple languages during the build process, creating separate language directories (e.g., `/en/`, `/fr/`, `/de/`, `/es/`) with proper navigation and asset handling.

## Key Components

### 1. Translation Script (`i18n/translate-netlify.js`)
- **ES Module** compatible script using native Node.js 18 fetch API
- **Content-aware** translation that preserves HTML structure and JavaScript/CSS
- **Performance optimized** with persistent caching and translation limits
- **Script/Style protection** to prevent breaking React components and interactive features

### 2. Translation Cache (`i18n/translation-cache.json`)
- **Persistent cache** committed to Git repository
- **Reduces build times** by avoiding retranslation of existing content
- **API cost optimization** by storing translated strings between builds

### 3. Build Configuration (`netlify.toml`)
```toml
[build]
  command = "npm install && cd netlify/functions && npm install && cd ../.. && npm run translate"
  publish = "dist"
```

### 4. Package Dependencies (`package.json`)
Required dependencies:
```json
{
  "type": "module",
  "dependencies": {
    "cheerio": "1.0.0-rc.12"
  }
}
```

## Implementation Steps

### Step 1: Setup Translation Infrastructure

1. **Create the i18n directory structure:**
```bash
mkdir i18n
```

2. **Copy the translation script** from an existing multilingual site:
   - Copy `i18n/translate-netlify.js`
   - **IMPORTANT:** Also copy `i18n/translation-cache.json` to start with existing translations

3. **Update language configuration** in `translate-netlify.js`:
```javascript
const CONFIG = {
  languages: ['fr', 'de', 'es'], // Add/remove languages as needed
  priorityPages: [
    'index.html', 'products.html', // List all pages to translate
    // Add all main pages here
  ]
};
```

### Step 2: Configure Build Process

1. **Update netlify.toml** build command:
```toml
[build]
  command = "npm install && npm run translate"
  publish = "dist"
```

2. **Add translation script** to `package.json`:
```json
{
  "scripts": {
    "translate": "node i18n/translate-netlify.js"
  }
}
```

3. **Set DeepL API key** in Netlify dashboard:
   - Go to Site Settings → Environment Variables  
   - Add `DEEPL_API_KEY` with your DeepL API key

### Step 3: Content Security Policy Updates

For sites with interactive JavaScript components (React, etc.), update CSP in `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "script-src 'self' 'unsafe-inline' https://unpkg.com https://cdnjs.cloudflare.com; ..."
```

Add required CDN domains for external libraries.

### Step 4: Special Page Handling

#### Installation Pages
For dynamic content like installation pages, the script automatically:
- Creates `installations/` directories for each language
- Processes all HTML files in the `installations/` folder
- Fixes relative paths for the new directory structure
- Updates language switchers with proper installation paths

#### Interactive Pages (React/JavaScript)
The translation script preserves:
- `<script>` tags and their content
- `<style>` tags and CSS
- External script sources (with proper CSP configuration)

## Performance Optimization

### Translation Cache Strategy
- **Start with existing cache:** Always copy `translation-cache.json` from a working multilingual site
- **Commit cache file:** The cache is part of the repository and persists between builds
- **Translation limits:** 200 translations per build to prevent excessive API calls
- **Cache persistence:** Subsequent builds are much faster since content is already cached

### Build Time Expectations
- **First build:** ~5-10 minutes (populating cache)
- **Subsequent builds:** ~2-3 minutes (using cached translations)
- **Content-only changes:** ~1-2 minutes (minimal new translations)

### Cost Optimization
- Translation cache reduces DeepL API usage by ~90% after initial build
- Translation limits prevent runaway API costs
- Only new/changed content triggers API calls

## Directory Structure

After build, the site structure will be:
```
dist/
├── en/
│   ├── index.html
│   ├── products.html
│   ├── installations/
│   │   ├── project-1.html
│   │   └── project-2.html
│   └── ...
├── fr/
│   ├── index.html (French)
│   ├── products.html (French)
│   ├── installations/
│   └── ...
├── de/ (German versions)
├── es/ (Spanish versions)
└── index.html (redirects to /en/)
```

## Language Switcher

Automatically added to all pages:
- Fixed position bottom-right
- Preserves current page across languages
- Works correctly on installation pages
- Styled to match site branding

## Troubleshooting

### Common Issues

1. **Build failures due to missing dependencies:**
   - Ensure `cheerio` is in package.json
   - Use Node.js 18+ for native fetch support

2. **JavaScript broken after translation:**
   - Check CSP settings for external script sources
   - Verify script preservation in translation process

3. **Slow builds:**
   - Ensure `translation-cache.json` is committed
   - Check translation limits in script
   - Monitor DeepL API usage

4. **Installation pages not working:**
   - Verify installation HTML files are being processed
   - Check relative path corrections
   - Ensure installations directory is created for each language

### Debug Mode

Add environment variable for verbose logging:
```bash
DEBUG_TRANSLATION=true npm run translate
```

## Future Site Setup Checklist

When implementing multilingual support on a new site:

- [ ] Copy `i18n/translate-netlify.js` from existing multilingual site
- [ ] **IMPORTANT:** Copy `i18n/translation-cache.json` with existing translations
- [ ] Update `CONFIG.priorityPages` with all site pages
- [ ] Update `CONFIG.languages` for target languages
- [ ] Add translation script to package.json
- [ ] Update netlify.toml build command
- [ ] Set DEEPL_API_KEY in Netlify environment
- [ ] Update CSP for any external JavaScript libraries
- [ ] Test installation page handling if applicable
- [ ] Verify language switcher functionality
- [ ] Commit translation cache to repository

## Best Practices

1. **Always start with existing cache** - Copy from working multilingual site
2. **Test translation limits** - Monitor API usage and adjust limits
3. **Preserve JavaScript** - Ensure interactive components work in all languages  
4. **Content Security** - Update CSP for external libraries
5. **Path handling** - Test relative paths in subdirectories
6. **Cache maintenance** - Keep translation cache committed and up to date

This system provides robust, scalable multilingual support with optimal performance and cost efficiency.