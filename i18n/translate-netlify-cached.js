import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple configuration for Netlify - TPV Site
const CONFIG = {
  languages: ['fr', 'de', 'es'],
  priorityPages: [
    'index.html', 'products.html', 'applications.html',
    'colour.html', 'about.html', 'contact.html',
    'mixer.html', 'installations.html', 'thank-you.html'
  ]
};

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const CACHE_FILE = path.join(__dirname, 'translation-cache.json');

// Ensure cache directory exists
const cacheDir = path.dirname(CACHE_FILE);
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Load cache
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (e) {
    console.log('⚠️  Cache file corrupted, starting fresh');
  }
}

/**
 * Cache-only translate function (no API calls)
 */
let translationCount = 0;

async function translate(text, targetLang) {
  if (!text || text.trim().length === 0) return text;
  
  const cacheKey = `${targetLang}:${text}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  
  // For cached-only build, return original text if not in cache
  console.log(`⚠️  No cache entry for: "${text.substring(0, 50)}..." in ${targetLang}`);
  return text;
}

/**
 * Process a single HTML file
 */
async function processFile(sourceFile, targetLang, isInstallationPage = false) {
  console.log(`📄 Processing ${path.basename(sourceFile)} for ${targetLang}`);
  
  const html = fs.readFileSync(sourceFile, 'utf8');
  const $ = cheerio.load(html);
  const currentPageName = path.basename(sourceFile);
  
  let translationCount = 0;
  
  // Store scripts and styles to preserve them from translation
  const scripts = [];
  const styles = [];
  
  $('script').each((i, el) => {
    scripts.push({ index: i, html: $.html(el) });
    $(el).replaceWith(`<!-- SCRIPT_PLACEHOLDER_${i} -->`);
  });
  
  $('style').each((i, el) => {
    styles.push({ index: i, html: $.html(el) });
    $(el).replaceWith(`<!-- STYLE_PLACEHOLDER_${i} -->`);
  });
  
  // Fix paths for installation pages
  if (isInstallationPage) {
    // Update relative paths to go up one more level
    $('img[src^="../"]').each((i, el) => {
      const src = $(el).attr('src');
      $(el).attr('src', '../' + src);
    });
    
    $('link[href^="../"]').each((i, el) => {
      const href = $(el).attr('href');
      $(el).attr('href', '../' + href);
    });
    
    $('a[href^="../"]').each((i, el) => {
      const href = $(el).attr('href');
      // Don't update navigation links, only asset links
      if (!href.includes('.html')) {
        $(el).attr('href', '../' + href);
      }
    });
    
    // Update navigation links to include language prefix
    $('a[href$=".html"]').each((i, el) => {
      const href = $(el).attr('href');
      if (href.startsWith('../')) {
        // Main navigation links
        const page = href.replace('../', '');
        $(el).attr('href', `../../${page}`);
      }
    });
  }
  
  // Only translate if not English
  if (targetLang !== 'en') {
    
    // 1. Handle safe attributes first (these never break HTML structure)
    const attributeSelectors = [
      { selector: 'title', attr: 'text' },
      { selector: '[alt]', attr: 'alt' },
      { selector: '[placeholder]', attr: 'placeholder' },
      { selector: 'meta[name="description"]', attr: 'content' }
    ];
    
    for (const { selector, attr } of attributeSelectors) {
      $(selector).each(async function() {
        const el = $(this);
        const value = attr === 'text' ? el.text() : el.attr(attr);
        if (value && value.length >= 3) {
          const translated = await translate(value, targetLang);
          if (attr === 'text') {
            el.text(translated);
          } else {
            el.attr(attr, translated);
          }
          translationCount++;
        }
      });
    }
    
    // 2. DOM-aware text node extraction for content elements
    const translatableTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'td', 'th', 'label', 'button', 'a', 'span', 'figcaption'];
    const skipClasses = ['icon', 'breadcrumb', 'pagination'];
    const skipAttributes = ['aria-hidden', 'data-', 'role'];
    
    let textsToTranslate = [];
    
    // Extract text nodes from translatable elements
    translatableTags.forEach(tag => {
      $(tag).each((i, element) => {
        const el = $(element);
        
        // Skip elements with certain classes or attributes
        const hasSkipClass = skipClasses.some(cls => el.hasClass(cls));
        const hasSkipAttr = skipAttributes.some(attr => 
          attr.endsWith('-') ? 
            Object.keys(el.get(0).attribs || {}).some(a => a.startsWith(attr)) :
            el.attr(attr)
        );
        
        if (hasSkipClass || hasSkipAttr) return;
        
        // Get the direct text content (not nested element text)
        const textNodes = [];
        el.contents().each((i, node) => {
          if (node.type === 'text') {
            const text = node.data.trim();
            if (text && text.length >= 3) {
              textNodes.push({ node, text });
            }
          }
        });
        
        // If element has only text nodes (no child elements with text), translate the whole element
        if (textNodes.length > 0 && el.children().length === 0) {
          const fullText = el.text().trim();
          if (fullText && fullText.length >= 3 && fullText.length < 500) {
            textsToTranslate.push({
              element: el,
              text: fullText,
              type: 'fullElement'
            });
          }
        }
        // For elements with mixed content, translate individual text nodes
        else if (textNodes.length > 0) {
          textNodes.forEach(({ node, text }) => {
            if (text.length >= 3 && text.length < 200) {
              textsToTranslate.push({
                node: node,
                text: text,
                type: 'textNode'
              });
            }
          });
        }
      });
    });
    
    
    // 3. Handle elements with specific classes that contain UI text
    const classBasedSelectors = [
      '*[class*="btn"]',     // Any element with "btn" in class name
      '*[class*="menu"]',    // Any element with "menu" in class name  
      '*[class*="caption"]', // Any element with "caption" in class name
      '*[class*="nav"]'      // Any element with "nav" in class name (but not if it has icon class)
    ];
    
    for (const selector of classBasedSelectors) {
      $(selector).each((i, element) => {
        const el = $(element);
        
        // Skip if it has excluded classes
        const hasSkipClass = skipClasses.some(cls => el.hasClass(cls));
        if (hasSkipClass) return;
        
        // Only process elements with simple text content (no complex children)
        if (el.children().filter(':not(span)').length === 0) {
          const text = el.text().trim();
          if (text && text.length >= 2 && text.length < 100 && 
              !text.match(/^[0-9\s\-\+\*\/%=<>!@#$%^&*(){}[\]|\\:;",.<>?`~_]+$/)) {
            textsToTranslate.push({
              element: el,
              text: text,
              type: 'fullElement'
            });
          }
        }
      });
    }
    
    // 4. Handle additional attributes that may contain translatable text
    const attributeElements = [
      { selector: '[title]', attr: 'title' },
      { selector: 'img[alt]', attr: 'alt' },
      { selector: 'input[placeholder]', attr: 'placeholder' },
      { selector: 'button[aria-label]', attr: 'aria-label' }
    ];
    
    for (const { selector, attr } of attributeElements) {
      $(selector).each((i, element) => {
        const el = $(element);
        const value = el.attr(attr);
        if (value && value.length >= 3 && value.length < 100) {
          textsToTranslate.push({
            element: el,
            text: value,
            type: 'attribute',
            attr: attr
          });
        }
      });
    }
    
    // Now translate all collected texts (including the new ones)
    for (const item of textsToTranslate) {
      const translated = await translate(item.text, targetLang);
      
      if (item.type === 'fullElement') {
        item.element.text(translated);
      } else if (item.type === 'textNode') {
        item.node.data = translated;
      } else if (item.type === 'attribute') {
        item.element.attr(item.attr, translated);
      }
      
      translationCount++;
      
      // Rate limiting
      if (translationCount % 10 === 0) {
        await new Promise(r => setTimeout(r, 100));
      }
    }
  }
  
  // Add language switcher that preserves current page
  const pagePathPrefix = isInstallationPage ? 'installations/' : '';
  const switcherHTML = `
    <div id="language-switcher" style="position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);padding:8px 12px;border-radius:25px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:9999;border:1px solid rgba(255,107,53,0.1);backdrop-filter:blur(10px);font-family:'Source Sans Pro', sans-serif;font-size:14px;font-weight:500;">
      <a href="/en/${pagePathPrefix}${currentPageName}" style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;${targetLang === 'en' ? 'background:#ff6b35;color:white;box-shadow:0 2px 8px rgba(255,107,53,0.3);' : ''}">EN</a>
      <a href="/fr/${pagePathPrefix}${currentPageName}" style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;${targetLang === 'fr' ? 'background:#ff6b35;color:white;box-shadow:0 2px 8px rgba(255,107,53,0.3);' : ''}">FR</a>
      <a href="/de/${pagePathPrefix}${currentPageName}" style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;${targetLang === 'de' ? 'background:#ff6b35;color:white;box-shadow:0 2px 8px rgba(255,107,53,0.3);' : ''}">DE</a>
      <a href="/es/${pagePathPrefix}${currentPageName}" style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;${targetLang === 'es' ? 'background:#ff6b35;color:white;box-shadow:0 2px 8px rgba(255,107,53,0.3);' : ''}">ES</a>
    </div>
  `;
  $('body').prepend(switcherHTML);
  
  // Add performance optimizations to images (TPV images already have correct paths)
  $('img[src]').each(function() {
    if (!$(this).attr('loading')) {
      $(this).attr('loading', 'lazy');
    }
    if (!$(this).attr('decoding')) {
      $(this).attr('decoding', 'async');
    }
  });
  
  // Add hreflang tags
  if ($('link[rel="alternate"][hreflang]').length === 0) {
    $('head').append(`
      <link rel="alternate" hreflang="en" href="/en/">
      <link rel="alternate" hreflang="fr" href="/fr/">
      <link rel="alternate" hreflang="de" href="/de/">
      <link rel="alternate" hreflang="es" href="/es/">
    `);
  }
  
  console.log(`  ✓ Translated ${translationCount} items`);
  
  // Restore scripts and styles before returning HTML
  let finalHTML = $.html();
  
  // Restore scripts
  scripts.forEach(({ index, html }) => {
    finalHTML = finalHTML.replace(`<!-- SCRIPT_PLACEHOLDER_${index} -->`, html);
  });
  
  // Restore styles
  styles.forEach(({ index, html }) => {
    finalHTML = finalHTML.replace(`<!-- STYLE_PLACEHOLDER_${index} -->`, html);
  });
  
  return finalHTML;
}

/**
 * Copy assets to language directories - TPV structure
 */
function copyAssets() {
  const sourceDir = path.join(__dirname, '..');
  
  // TPV has images/assets in multiple locations - copy them all
  const assetPaths = [
    'images',        // Main images directory
    'Icons',         // SVG icons
    'Blends',        // Product blend images  
    'favicon_io',    // Favicons
    'favicon.ico',   // Root favicon
    'robots.txt',    // SEO files
    '_redirects'     // Netlify redirects
  ];
  
  // Also copy all root-level image files (*.jpg, *.png, *.avif, *.webp)
  const rootFiles = fs.readdirSync(sourceDir).filter(file => 
    /\.(jpg|jpeg|png|avif|webp|svg|ico)$/i.test(file)
  );
  
  ['en', ...CONFIG.languages].forEach(lang => {
    const langDir = path.join(__dirname, '../dist', lang);
    
    // Copy directories
    assetPaths.forEach(assetPath => {
      const sourcePath = path.join(sourceDir, assetPath);
      if (fs.existsSync(sourcePath)) {
        const targetPath = path.join(langDir, assetPath);
        if (fs.statSync(sourcePath).isDirectory()) {
          fs.cpSync(sourcePath, targetPath, { recursive: true });
        } else {
          fs.copyFileSync(sourcePath, targetPath);
        }
        console.log(`✓ Copied ${assetPath} to ${lang}/`);
      }
    });
    
    // Copy root image files
    rootFiles.forEach(file => {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(langDir, file);
      fs.copyFileSync(sourcePath, targetPath);
    });
    console.log(`✓ Copied ${rootFiles.length} root image files to ${lang}/`);
  });
}

/**
 * Main function
 */
async function main() {
  const startTime = Date.now();
  
  console.log('🚀 Starting Netlify-optimized translation build\n');
  console.log(`API Key: ${DEEPL_API_KEY ? 'SET ✓' : 'NOT SET ⚠️'}`);
  console.log(`Languages: ${CONFIG.languages.join(', ')}`);
  console.log(`Priority pages: ${CONFIG.priorityPages.join(', ')}\n`);
  
  console.log('📁 Checking source directory...');
  const sourceDir = path.join(__dirname, '..');
  console.log(`Source directory: ${sourceDir}`);
  
  // Create language directories at root level for Netlify
  const rootDir = path.join(__dirname, '../dist');
  
  // Clear and recreate dist directory
  if (fs.existsSync(rootDir)) {
    fs.rmSync(rootDir, { recursive: true });
  }
  fs.mkdirSync(rootDir, { recursive: true });
  
  // Create language directories
  ['en', ...CONFIG.languages].forEach(lang => {
    const langDir = path.join(rootDir, lang);
    fs.mkdirSync(langDir, { recursive: true });
  });
  
  // Copy assets first
  console.log('📁 Copying assets...');
  copyAssets();
  
  // Copy admin pages to root level only (English only)
  console.log('🔐 Copying admin pages to root level...');
  const adminPages = [
    'installation-approval-hub.html',
    'admin/add-installation.html',
    'installation-parser.js',
    'login.html'
  ];
  
  for (const adminPage of adminPages) {
    const sourcePath = path.join(sourceDir, adminPage);
    const targetPath = path.join(rootDir, adminPage);
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  ${adminPage} not found`);
      continue;
    }
    
    // Ensure directory exists for nested admin pages
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copy file as-is (no translation)
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✓ Copied ${adminPage} to root level`);
  }
  
  // Process each priority page
  
  for (const pageFile of CONFIG.priorityPages) {
    const sourcePath = path.join(sourceDir, pageFile);
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  ${pageFile} not found`);
      continue;
    }
    
    // Process English version (add language switcher and fix paths)
    console.log(`📄 Processing ${pageFile} for en`);
    const englishHTML = await processFile(sourcePath, 'en');
    const enPath = path.join(rootDir, 'en', pageFile);
    fs.writeFileSync(enPath, englishHTML);
    console.log(`✓ Processed ${pageFile} for en`);
    
    // Process translations
    for (const lang of CONFIG.languages) {
      const translatedHTML = await processFile(sourcePath, lang);
      const targetPath = path.join(rootDir, lang, pageFile);
      fs.writeFileSync(targetPath, translatedHTML);
      
      // Save cache after each file
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    }
  }
  
  // Process installation pages
  console.log('\n📄 Processing installation pages...');
  const installationsDir = path.join(sourceDir, 'installations');
  if (fs.existsSync(installationsDir)) {
    const installationFiles = fs.readdirSync(installationsDir)
      .filter(file => file.endsWith('.html') && !file.endsWith('.backup'));
    
    // Create installations directories for each language
    ['en', ...CONFIG.languages].forEach(lang => {
      const langInstallDir = path.join(rootDir, lang, 'installations');
      if (!fs.existsSync(langInstallDir)) {
        fs.mkdirSync(langInstallDir, { recursive: true });
      }
    });
    
    for (const installFile of installationFiles) {
      const sourcePath = path.join(installationsDir, installFile);
      
      // Process English version
      const englishHTML = await processFile(sourcePath, 'en', true);
      const enPath = path.join(rootDir, 'en', 'installations', installFile);
      fs.writeFileSync(enPath, englishHTML);
      
      // Process translations
      for (const lang of CONFIG.languages) {
        const translatedHTML = await processFile(sourcePath, lang, true);
        const targetPath = path.join(rootDir, lang, 'installations', installFile);
        fs.writeFileSync(targetPath, translatedHTML);
        
        // Save cache periodically
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
      }
    }
    
    console.log(`✓ Processed ${installationFiles.length} installation pages`);
  }
  
  // Copy config files to root and language directories
  console.log('\n📋 Copying config files...');
  const configFiles = ['robots.txt', 'netlify.toml', '_redirects'];
  
  configFiles.forEach(file => {
    const source = path.join(__dirname, '..', file);
    if (fs.existsSync(source)) {
      // Copy to root directory
      const rootTarget = path.join(rootDir, file);
      fs.copyFileSync(source, rootTarget);
      
      // Copy to each language directory  
      ['en', ...CONFIG.languages].forEach(lang => {
        const target = path.join(rootDir, lang, file);
        fs.copyFileSync(source, target);
      });
      console.log(`✓ Copied ${file} to root and all language directories`);
    }
  });
  
  // Create root index.html that redirects to English
  console.log('\n📋 Creating root redirect...');
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
        // JavaScript fallback redirect
        setTimeout(function() {
            window.location.href = '/en/';
        }, 1000);
    </script>
</body>
</html>`;
  
  fs.writeFileSync(path.join(rootDir, 'index.html'), rootIndexHTML);
  console.log('✓ Created root index.html redirect');
  
  // Final summary
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n✅ Build complete in ${elapsed}s`);
  console.log(`📝 Total translations: ${translationCount}/${MAX_TRANSLATIONS}`);
  console.log(`💾 Cache entries: ${Object.keys(cache).length}`);
  console.log(`📁 Output: dist/{${['en', ...CONFIG.languages].join(',')}}/ `);
  
  // Show final structure
  console.log('\n📋 Final directory structure:');
  try {
    const distContents = fs.readdirSync(rootDir);
    distContents.forEach(dir => {
      console.log(`  ${dir}/`);
      const dirPath = path.join(rootDir, dir);
      if (fs.statSync(dirPath).isDirectory()) {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
          console.log(`    ${file}`);
        });
      }
    });
  } catch (e) {
    console.log(`  Error reading dist: ${e.message}`);
  }
}

// Run
console.log('🚀 Starting cached translation build...');
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
} else {
  console.log('Forcing execution of cached build...');
  main().catch(console.error);
}

export { main };