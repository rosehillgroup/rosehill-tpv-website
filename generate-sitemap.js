// Generate Multilingual Sitemap
// This script generates an XML sitemap with hreflang support for all installation pages

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://otidaseqlgubqzsqazqt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4';

const BASE_URL = 'https://tpv.rosehill.group';
const LANGUAGES = ['en', 'fr', 'de', 'es'];

// Static pages configuration
const STATIC_PAGES = [
    { path: '/', priority: 1.0, changefreq: 'weekly' },
    { path: '/products.html', priority: 0.9, changefreq: 'monthly' },
    { path: '/applications.html', priority: 0.8, changefreq: 'monthly' },
    { path: '/colour.html', priority: 0.8, changefreq: 'monthly' },
    { path: '/installations.html', priority: 0.9, changefreq: 'daily' },
    { path: '/about.html', priority: 0.7, changefreq: 'monthly' },
    { path: '/contact.html', priority: 0.8, changefreq: 'monthly' },
    { path: '/mixer.html', priority: 0.6, changefreq: 'monthly' }
];

/**
 * Initialize Supabase client
 */
function initSupabase() {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Fetch all installations with translation data
 */
async function fetchInstallationsWithTranslations() {
    const supabase = initSupabase();
    
    try {
        // Get all installations
        const { data: installations, error: installationsError } = await supabase
            .from('installations')
            .select('id, slug, installation_date, updated_at')
            .order('installation_date', { ascending: false });
        
        if (installationsError) {
            throw new Error(`Error fetching installations: ${installationsError.message}`);
        }
        
        // Get all translations
        const { data: translations, error: translationsError } = await supabase
            .from('installation_i18n')
            .select('installation_id, lang, slug');
        
        if (translationsError) {
            console.warn('Error fetching translations:', translationsError.message);
        }
        
        // Group translations by installation
        const translationMap = {};
        if (translations) {
            translations.forEach(translation => {
                if (!translationMap[translation.installation_id]) {
                    translationMap[translation.installation_id] = {};
                }
                translationMap[translation.installation_id][translation.lang] = translation.slug;
            });
        }
        
        // Combine data
        return installations.map(installation => ({
            ...installation,
            translations: translationMap[installation.id] || {}
        }));
        
    } catch (error) {
        console.error('Error fetching installation data:', error);
        throw error;
    }
}

/**
 * Generate URL for a specific language and page
 */
function generateUrl(path, lang = 'en') {
    if (lang === 'en') {
        return `${BASE_URL}${path}`;
    } else {
        // Handle installation pages with translated slugs
        if (path.startsWith('/installations/')) {
            return `${BASE_URL}/${lang}${path}`;
        } else {
            return `${BASE_URL}/${lang}${path}`;
        }
    }
}

/**
 * Format date for sitemap
 */
function formatDate(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    try {
        return new Date(dateString).toISOString().split('T')[0];
    } catch (error) {
        return new Date().toISOString().split('T')[0];
    }
}

/**
 * Generate hreflang alternatives for a URL
 */
function generateHreflangAlternatives(basePath, slug, translations) {
    const alternatives = [];
    
    // Add English version
    alternatives.push({
        lang: 'en',
        url: generateUrl(basePath.replace('[slug]', slug), 'en')
    });
    
    // Add x-default (fallback to English)
    alternatives.push({
        lang: 'x-default',
        url: generateUrl(basePath.replace('[slug]', slug), 'en')
    });
    
    // Add translated versions
    LANGUAGES.slice(1).forEach(lang => { // Skip 'en' as it's already added
        const translatedSlug = translations[lang] || slug;
        alternatives.push({
            lang: lang,
            url: generateUrl(basePath.replace('[slug]', translatedSlug), lang)
        });
    });
    
    return alternatives;
}

/**
 * Generate sitemap XML content
 */
function generateSitemapXML(urls) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
    
    urls.forEach(urlData => {
        xml += '  <url>\n';
        xml += `    <loc>${urlData.url}</loc>\n`;
        xml += `    <lastmod>${urlData.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${urlData.changefreq}</changefreq>\n`;
        xml += `    <priority>${urlData.priority}</priority>\n`;
        
        // Add hreflang alternatives
        if (urlData.alternatives && urlData.alternatives.length > 0) {
            urlData.alternatives.forEach(alt => {
                xml += `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.url}" />\n`;
            });
        }
        
        xml += '  </url>\n';
    });
    
    xml += '</urlset>\n';
    return xml;
}

/**
 * Generate robots.txt content
 */
function generateRobotsTxt() {
    return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl-delay for being polite
Crawl-delay: 1

# Block admin areas
Disallow: /admin-*
Disallow: /_netlify/
Disallow: /js/
Disallow: /css/
`;
}

/**
 * Main function to generate sitemap
 */
async function main() {
    console.log('🗺️  Generating multilingual sitemap...\n');
    
    try {
        // Fetch installation data
        console.log('📋 Fetching installation data...');
        const installations = await fetchInstallationsWithTranslations();
        console.log(`✅ Found ${installations.length} installations`);
        
        const urls = [];
        
        // Add static pages
        console.log('📄 Processing static pages...');
        STATIC_PAGES.forEach(page => {
            LANGUAGES.forEach(lang => {
                const url = generateUrl(page.path, lang);
                const urlData = {
                    url: url,
                    lastmod: formatDate(),
                    changefreq: page.changefreq,
                    priority: page.priority
                };
                
                // Add hreflang alternatives for static pages
                if (lang === 'en') { // Only add alternatives once per page
                    urlData.alternatives = [];
                    LANGUAGES.forEach(altLang => {
                        urlData.alternatives.push({
                            lang: altLang === 'en' ? 'x-default' : altLang,
                            url: generateUrl(page.path, altLang)
                        });
                        if (altLang !== 'en') {
                            urlData.alternatives.push({
                                lang: altLang,
                                url: generateUrl(page.path, altLang)
                            });
                        }
                    });
                    
                    urls.push(urlData);
                }
            });
        });
        
        // Add installation pages
        console.log('🏗️  Processing installation pages...');
        installations.forEach(installation => {
            const lastmod = formatDate(installation.updated_at || installation.installation_date);
            
            // Add English version with hreflang alternatives
            const enUrl = generateUrl(`/installations/${installation.slug}.html`, 'en');
            const alternatives = generateHreflangAlternatives('/installations/[slug].html', installation.slug, installation.translations);
            
            urls.push({
                url: enUrl,
                lastmod: lastmod,
                changefreq: 'monthly',
                priority: 0.7,
                alternatives: alternatives
            });
            
            // Add translated versions (without duplicating hreflang)
            LANGUAGES.slice(1).forEach(lang => {
                const translatedSlug = installation.translations[lang];
                if (translatedSlug) {
                    const translatedUrl = generateUrl(`/installations/${translatedSlug}.html`, lang);
                    urls.push({
                        url: translatedUrl,
                        lastmod: lastmod,
                        changefreq: 'monthly',
                        priority: 0.7
                        // No alternatives here to avoid duplication
                    });
                }
            });
        });
        
        console.log(`📊 Generated ${urls.length} URLs total`);
        
        // Generate sitemap XML
        console.log('📝 Generating sitemap XML...');
        const sitemapXML = generateSitemapXML(urls);
        
        // Write sitemap.xml
        const sitemapPath = path.join(__dirname, 'sitemap.xml');
        fs.writeFileSync(sitemapPath, sitemapXML, 'utf8');
        console.log(`✅ Sitemap saved to: ${sitemapPath}`);
        
        // Generate and write robots.txt
        console.log('🤖 Generating robots.txt...');
        const robotsTxt = generateRobotsTxt();
        const robotsPath = path.join(__dirname, 'robots.txt');
        fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
        console.log(`✅ Robots.txt saved to: ${robotsPath}`);
        
        // Generate summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 SITEMAP GENERATION SUMMARY');
        console.log('='.repeat(50));
        
        const staticUrls = urls.filter(u => !u.url.includes('/installations/'));
        const installationUrls = urls.filter(u => u.url.includes('/installations/'));
        
        console.log(`📄 Static pages: ${staticUrls.length}`);
        console.log(`🏗️  Installation pages: ${installationUrls.length}`);
        console.log(`🌍 Languages supported: ${LANGUAGES.join(', ')}`);
        console.log(`📝 Total URLs: ${urls.length}`);
        console.log(`📍 Base URL: ${BASE_URL}`);
        
        // Language breakdown
        console.log('\n🌍 URLs by language:');
        LANGUAGES.forEach(lang => {
            const langUrls = urls.filter(u => 
                lang === 'en' ? !u.url.includes(`/${lang}/`) && !u.url.match(/\/(fr|de|es)\//) :
                u.url.includes(`/${lang}/`)
            );
            console.log(`   ${lang.toUpperCase()}: ${langUrls.length} URLs`);
        });
        
        console.log('\n✨ Sitemap generation completed successfully!');
        console.log(`🔗 Your sitemap: ${BASE_URL}/sitemap.xml`);
        
    } catch (error) {
        console.error('💥 Sitemap generation failed:', error.message);
        process.exit(1);
    }
}

// Run the script
main();