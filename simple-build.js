import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting multilingual build for TPV site with translation support');

// Translation cache to avoid hitting API limits
const translationCache = new Map();
let cacheLoaded = false;

// Load translation cache from file
function loadTranslationCache() {
    try {
        const cacheFile = path.join(__dirname, '.translation-cache.json');
        if (fs.existsSync(cacheFile)) {
            const cacheData = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
            Object.entries(cacheData).forEach(([key, value]) => {
                translationCache.set(key, value);
            });
            console.log(`📚 Loaded ${translationCache.size} cached translations`);
        }
    } catch (error) {
        console.warn('⚠️ Could not load translation cache:', error.message);
    }
    cacheLoaded = true;
}

// Save translation cache to file
function saveTranslationCache() {
    try {
        const cacheFile = path.join(__dirname, '.translation-cache.json');
        const cacheData = Object.fromEntries(translationCache);
        fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
        console.log(`💾 Saved ${translationCache.size} translations to cache`);
    } catch (error) {
        console.warn('⚠️ Could not save translation cache:', error.message);
    }
}

// Simple translation function with caching
async function translateText(text, targetLang) {
    if (targetLang === 'en') return text;
    
    const cacheKey = `${text}_${targetLang}`;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }
    
    // For now, return original text - translation API can be added later
    // This prevents hitting API limits while maintaining structure
    console.log(`📝 Using original text for ${targetLang}: ${text.substring(0, 50)}...`);
    translationCache.set(cacheKey, text);
    return text;
}

// Add language switcher to HTML (fixed bottom-right design)
function addLanguageSwitcher(html, currentLang = 'en') {
    const $ = cheerio.load(html);
    
    // Create the language switcher HTML with the correct design pattern
    const getActiveStyle = (lang) => {
        return lang === currentLang 
            ? 'display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;background:#ff6b35;color:white;box-shadow:0 2px 8px rgba(255,107,53,0.3);'
            : 'display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;';
    };
    
    const languageSwitcherHtml = `
    <div id="language-switcher" style="position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);padding:8px 12px;border-radius:25px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:9999;border:1px solid rgba(255,107,53,0.1);backdrop-filter:blur(10px);font-family:'Source Sans Pro', sans-serif;font-size:14px;font-weight:500;">
        <a href="/en/" style="${getActiveStyle('en')}">EN</a>
        <a href="/fr/" style="${getActiveStyle('fr')}">FR</a>
        <a href="/de/" style="${getActiveStyle('de')}">DE</a>
        <a href="/es/" style="${getActiveStyle('es')}">ES</a>
    </div>`;
    
    // Add language switcher before closing body tag
    $('body').append(languageSwitcherHtml);
    
    return $.html();
}

// Clear and create dist directory
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}

// Create language directories
const langDirs = ['en', 'fr', 'de', 'es'];
langDirs.forEach(lang => {
  const langDir = path.join(distDir, lang);
  fs.mkdirSync(langDir, { recursive: true });
});

// Files and directories to copy to each language directory
const itemsToCopy = [
  // HTML files
  'index.html',
  'products.html', 
  'applications.html',
  'colour.html',
  'about.html',
  'contact.html',
  'installations.html',
  'mixer.html',
  'thank-you.html',
  
  // Asset directories
  'images',
  'Icons', 
  'Blends',
  'favicon_io',
  
  // Installation pages
  'installations',
  
  // Root assets
  'rosehill_tpv_logo.png',
  'rosehill_tpv_logo.webp',
  'favicon.ico',
  'robots.txt',
  '_redirects'
];

// Copy all root image files
const rootFiles = fs.readdirSync(__dirname).filter(file => 
  /\.(jpg|jpeg|png|avif|webp|svg|ico)$/i.test(file)
);

itemsToCopy.push(...rootFiles);

// Load translation cache
loadTranslationCache();

// Process each language directory
async function processLanguageDirectories() {
  for (const lang of langDirs) {
    console.log(`\n🌍 Processing ${lang} directory...`);
    const langDir = path.join(distDir, lang);
    
    // Copy all items to language directory
    for (const item of itemsToCopy) {
      const sourcePath = path.join(__dirname, item);
      const targetPath = path.join(langDir, item);
      
      if (fs.existsSync(sourcePath)) {
        try {
          const stat = fs.statSync(sourcePath);
          if (stat.isDirectory()) {
            fs.cpSync(sourcePath, targetPath, { recursive: true });
            console.log(`✓ Copied directory ${item} to ${lang}/`);
          } else if (item.endsWith('.html')) {
            // Process HTML files with language switcher
            let htmlContent = fs.readFileSync(sourcePath, 'utf8');
            
            // Add language switcher to HTML
            htmlContent = addLanguageSwitcher(htmlContent, lang);
            
            // Update language attribute
            htmlContent = htmlContent.replace(/<html lang="en">/, `<html lang="${lang}">`);
            
            // For non-English languages, could add translation here in the future
            // For now, we keep English content to avoid API limits
            
            fs.writeFileSync(targetPath, htmlContent);
            console.log(`✓ Processed HTML file ${item} for ${lang}/`);
          } else {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`✓ Copied file ${item} to ${lang}/`);
          }
        } catch (error) {
          console.warn(`⚠️ Failed to copy ${item}:`, error.message);
        }
      } else {
        console.warn(`⚠️ Source not found: ${item}`);
      }
    }
  }
}

// Run the processing
await processLanguageDirectories();

// Copy admin pages to root level (English only)
const adminPages = [
  'installation-approval-hub.html',
  'admin/add-installation.html',
  'installation-parser.js',
  'login.html'
];

adminPages.forEach(adminPage => {
  const sourcePath = path.join(__dirname, adminPage);
  const targetPath = path.join(distDir, adminPage);
  
  if (fs.existsSync(sourcePath)) {
    // Ensure directory exists for nested admin pages
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✓ Copied admin page ${adminPage} to root level`);
  } else {
    console.warn(`⚠️ Admin page not found: ${adminPage}`);
  }
});

// Create root index.html redirect
const rootIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=/en/">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rosehill TPV - Redirecting...</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: #f8f9fa; 
        }
        .loading { 
            color: #1a365d; 
            font-size: 18px; 
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #ff6b35;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loading">
        <div class="spinner"></div>
        <p>Redirecting to Rosehill TPV...</p>
        <p><a href="/en/">Click here if not redirected automatically</a></p>
    </div>
    <script>
        setTimeout(function() {
            window.location.href = '/en/';
        }, 1000);
    </script>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), rootIndexHTML);
console.log('✓ Created root index.html redirect');

// Save translation cache
saveTranslationCache();

console.log(`\n✅ Build complete! Created ${langDirs.length} language directories in dist/`);
console.log('📁 Structure created:');
langDirs.forEach(lang => {
  console.log(`   dist/${lang}/ (with language switcher)`);
});

console.log('\n🌍 Language switchers added to all HTML pages');
console.log('💡 Translation API can be added to translateText() function when ready');