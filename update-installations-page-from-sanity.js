#!/usr/bin/env node

/**
 * Update installations.html to use Sanity data instead of Supabase
 * This replaces the JavaScript that loads from Supabase with code that loads from Sanity
 * while keeping all existing styling and functionality exactly the same
 */

import { createClient } from '@sanity/client'
import fs from 'fs'

// Sanity configuration
const sanity = createClient({
  projectId: '68ola3dd',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
})

// Helper to get localized content
function getLocalizedField(field, locale = 'en') {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[locale] || field.en || ''
}

// Helper for slug fields
function getLocalizedSlug(slug, locale = 'en') {
  if (!slug) return ''
  const localeSlug = slug[locale] || slug.en
  return localeSlug?.current || ''
}

async function updateInstallationsPage() {
  console.log('🎯 Updating installations.html to use Sanity data...')
  
  try {
    // Read the current installations.html file
    if (!fs.existsSync('./installations.html')) {
      throw new Error('installations.html file not found')
    }
    
    let html = fs.readFileSync('./installations.html', 'utf8')
    
    // Replace the JavaScript section that loads from Supabase with Sanity code
    const newScript = `
        // Global variables
        let allInstallations = [];
        let filteredInstallations = [];
        let currentFilter = 'all';
        let currentPage = 1;
        const installationsPerPage = 9;

        // Sanity client configuration
        const SANITY_PROJECT_ID = '68ola3dd';
        const SANITY_DATASET = 'production';
        const SANITY_API_VERSION = '2023-05-03';

        // Helper to get localized content
        function getLocalizedField(field, locale = 'en') {
            if (!field) return '';
            if (typeof field === 'string') return field;
            return field[locale] || field.en || '';
        }

        // Helper for slug fields
        function getLocalizedSlug(slug, locale = 'en') {
            if (!slug) return '';
            const localeSlug = slug[locale] || slug.en;
            return localeSlug?.current || '';
        }

        // Load installations data from Sanity
        async function loadInstallations() {
            try {
                console.log('Loading installations from Sanity...');
                
                // Detect current language
                const currentLang = getCurrentLanguage() || 'en';
                console.log('Current language:', currentLang);
                
                // Fetch installations from Sanity
                const query = \`*[_type == "installation" && "\${currentLang}" in publishedLocales] | order(installationDate desc) {
                    _id,
                    title,
                    slug,
                    overview,
                    location,
                    installationDate,
                    application,
                    coverImage,
                    gallery,
                    tags,
                    thanksTo,
                    publishedLocales,
                    translationStatus,
                    seo
                }\`;
                
                const response = await fetch(\`https://\${SANITY_PROJECT_ID}.api.sanity.io/v\${SANITY_API_VERSION}/data/query/\${SANITY_DATASET}?query=\${encodeURIComponent(query)}\`);
                
                if (!response.ok) {
                    throw new Error(\`Sanity API error: \${response.status}\`);
                }
                
                const data = await response.json();
                const installations = data.result || [];
                
                // Process installations for display
                allInstallations = installations.map(installation => {
                    const title = getLocalizedField(installation.title, currentLang);
                    const overview = getLocalizedField(installation.overview, currentLang);
                    const city = getLocalizedField(installation.location?.city, currentLang);
                    const country = getLocalizedField(installation.location?.country, currentLang);
                    const slug = getLocalizedSlug(installation.slug, currentLang);
                    
                    // Handle overview array (if it's a rich text field)
                    let overviewText = overview;
                    if (Array.isArray(overview)) {
                        overviewText = overview.join(' ');
                    }
                    
                    return {
                        id: installation._id,
                        title: title,
                        displayTitle: title,
                        location: \`\${city}, \${country}\`.replace(/^, |, $/, ''),
                        displayLocation: \`\${city}, \${country}\`.replace(/^, |, $/, ''),
                        slug: slug,
                        displaySlug: slug,
                        description: overviewText,
                        displayDescription: overviewText,
                        installation_date: installation.installationDate,
                        category: installation.application || 'Playground',
                        application: installation.application || 'Playground',
                        images: installation.coverImage ? [installation.coverImage.asset?.url || 'images/installations/placeholder.jpg'] : ['images/installations/placeholder.jpg'],
                        formattedDate: new Date(installation.installationDate).toLocaleDateString('en-GB', {
                            month: 'short',
                            year: 'numeric'
                        })
                    };
                });
                
                console.log(\`Loaded \${allInstallations.length} installations for language: \${currentLang}\`);
                
                filteredInstallations = [...allInstallations];
                
                renderInstallations();
                updateStats();
                
                // Hide loading
                document.getElementById('loading').style.display = 'none';
                
            } catch (error) {
                console.error('Error loading installations from Sanity:', error);
                document.getElementById('loading').innerHTML = '<p>Error loading installations. Please try again later.</p>';
            }
        }

        // Get current language from URL
        function getCurrentLanguage() {
            const path = window.location.pathname;
            const langMatch = path.match(/^\/(fr|de|es)\//); 
            return langMatch ? langMatch[1] : null; // Return null for English
        }

        // Generate installation URL for current language
        function getInstallationUrl(slug) {
            const currentLang = getCurrentLanguage();
            if (currentLang) {
                return \`/\${currentLang}/installations/\${slug}.html\`;
            } else {
                return \`/installations/\${slug}.html\`; // English URLs have no prefix
            }
        }

        // Render installations grid (keeping exact same HTML structure)
        function renderInstallations() {
            const grid = document.getElementById('installations-grid');
            const startIndex = (currentPage - 1) * installationsPerPage;
            const endIndex = startIndex + installationsPerPage;
            const pageInstallations = filteredInstallations.slice(startIndex, endIndex);
            
            if (pageInstallations.length === 0) {
                document.getElementById('empty-state').style.display = 'block';
                grid.innerHTML = '';
                return;
            }
            
            document.getElementById('empty-state').style.display = 'none';
            
            grid.innerHTML = pageInstallations.map(installation => {
                const imageUrl = installation.images && installation.images.length > 0 ? installation.images[0] : 'images/installations/placeholder.jpg';
                
                const title = installation.displayTitle || installation.title;
                const location = installation.displayLocation || installation.location;
                const slug = installation.displaySlug || installation.slug;
                const description = installation.displayDescription || installation.description;
                
                const installationUrl = getInstallationUrl(slug);
                
                // Create preview text - first 150 characters of description
                let descriptionText = '';
                if (description) {
                    if (typeof description === 'string') {
                        descriptionText = description;
                    } else if (Array.isArray(description)) {
                        descriptionText = description.join(' ');
                    }
                }
                const previewText = descriptionText ? 
                    (descriptionText.substring(0, 150) + (descriptionText.length > 150 ? '...' : '')) : 
                    'Click to learn more about this installation.';
                
                const formattedDate = installation.formattedDate || 
                    new Date(installation.installation_date).toLocaleDateString('en-GB', {
                        month: 'short',
                        year: 'numeric'
                    });
                
                return \`
                    <div class="installation-card" data-category="\${installation.category || 'Playground'}">
                        <div class="installation-image" style="background-image: url('\${imageUrl}');"></div>
                        <div class="installation-content">
                            <div class="installation-meta">
                                <span class="installation-date">\${formattedDate}</span>
                                <span class="installation-application">\${installation.category || 'Playground'}</span>
                            </div>
                            <h3 class="installation-title">\${title}</h3>
                            <p class="installation-location">📍 \${location}</p>
                            <div class="installation-description">
                                <p>\${previewText}</p>
                            </div>
                            <a href="\${installationUrl}" class="read-more-btn">Read More →</a>
                        </div>
                    </div>
                \`;
            }).join('');
            
            updatePagination();
            
            // Add visible class to cards after a short delay for animation
            setTimeout(() => {
                document.querySelectorAll('.installation-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                });
            }, 100);
        }

        // Update statistics
        function updateStats() {
            const stats = document.getElementById('stats-bar');
            const total = filteredInstallations.length;
            const totalAll = allInstallations.length;
            
            if (currentFilter === 'all') {
                stats.textContent = \`Showing \${total} installations\`;
            } else {
                stats.textContent = \`Showing \${total} of \${totalAll} installations (filtered by \${currentFilter})\`;
            }
        }

        // Update pagination
        function updatePagination() {
            const totalPages = Math.ceil(filteredInstallations.length / installationsPerPage);
            const paginationSection = document.getElementById('pagination-section');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const pageInfo = document.getElementById('pagination-info');
            
            if (totalPages <= 1) {
                paginationSection.style.display = 'none';
                return;
            }
            
            paginationSection.style.display = 'block';
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages;
            pageInfo.textContent = \`Page \${currentPage} of \${totalPages}\`;
        }

        // Filter installations
        function filterInstallations(category) {
            currentFilter = category;
            currentPage = 1;
            
            if (category === 'all') {
                filteredInstallations = [...allInstallations];
            } else {
                filteredInstallations = allInstallations.filter(installation => 
                    installation.category && installation.category.toLowerCase().includes(category.toLowerCase())
                );
            }
            
            renderInstallations();
            updateStats();
            
            // Update filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === category);
            });
        }

        // Change page
        function changePage(direction) {
            const totalPages = Math.ceil(filteredInstallations.length / installationsPerPage);
            const newPage = currentPage + direction;
            
            if (newPage >= 1 && newPage <= totalPages) {
                currentPage = newPage;
                renderInstallations();
                
                // Scroll to top of installations
                document.querySelector('.installations-section').scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Mobile menu toggle (keeping existing functionality)
        function initMobileMenu() {
            const mobileToggle = document.getElementById('mobile-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (mobileToggle && mobileMenu) {
                mobileToggle.addEventListener('click', function() {
                    this.classList.toggle('active');
                    mobileMenu.classList.toggle('active');
                });
                
                // Close menu when clicking outside
                document.addEventListener('click', function(e) {
                    if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                        mobileToggle.classList.remove('active');
                        mobileMenu.classList.remove('active');
                    }
                });
            }
        }

        // Update SEO tags based on current language (keeping existing functionality)
        function updatePageSEO() {
            const currentLang = getCurrentLanguage() || 'en';
            const baseUrl = window.location.origin;
            
            // Localized content
            const seoContent = {
                'en': {
                    title: 'Latest Installations - Rosehill TPV® Sports & Play Surfaces Worldwide',
                    description: 'Discover Rosehill TPV® installations worldwide. From Olympic venues to theme parks, see how our coloured rubber granules create exceptional sports and play surfaces.',
                    locale: 'en_US'
                },
                'fr': {
                    title: 'Dernières Installations - Surfaces Sportives et de Jeu Rosehill TPV® dans le Monde',
                    description: 'Découvrez les installations Rosehill TPV® dans le monde entier. Des sites olympiques aux parcs à thème, voyez comment nos granulés de caoutchouc coloré créent des surfaces sportives et de jeu exceptionnelles.',
                    locale: 'fr_FR'
                },
                'de': {
                    title: 'Neueste Installationen - Rosehill TPV® Sport- und Spieloberflächen Weltweit',
                    description: 'Entdecken Sie Rosehill TPV® Installationen weltweit. Von olympischen Stätten bis zu Freizeitparks, sehen Sie, wie unsere farbigen Gummigranulate außergewöhnliche Sport- und Spieloberflächen schaffen.',
                    locale: 'de_DE'
                },
                'es': {
                    title: 'Últimas Instalaciones - Superficies Deportivas y de Juego Rosehill TPV® en Todo el Mundo',
                    description: 'Descubra las instalaciones de Rosehill TPV® en todo el mundo. Desde lugares olímpicos hasta parques temáticos, vea cómo nuestros gránulos de caucho coloreado crean superficies deportivas y de juego excepcionales.',
                    locale: 'es_ES'
                }
            };
            
            const content = seoContent[currentLang] || seoContent['en'];
            
            // Update page title
            document.title = content.title;
            document.getElementById('page-title').textContent = content.title;
            
            // Update meta description
            document.getElementById('meta-description').content = content.description;
            
            // Update language meta tag
            document.getElementById('meta-language').content = currentLang;
            
            // Update canonical URL
            const canonicalPath = currentLang === 'en' ? '/installations.html' : \`/\${currentLang}/installations.html\`;
            document.getElementById('canonical-link').href = \`\${baseUrl}\${canonicalPath}\`;
            
            // Update Open Graph tags
            document.getElementById('og-url').content = \`\${baseUrl}\${canonicalPath}\`;
            document.getElementById('og-title').content = content.title;
            document.getElementById('og-description').content = content.description;
            document.getElementById('og-locale').content = content.locale;
            
            // Update Twitter tags
            document.getElementById('twitter-url').content = \`\${baseUrl}\${canonicalPath}\`;
            document.getElementById('twitter-title').content = content.title;
            document.getElementById('twitter-description').content = content.description;
            
            // Update structured data
            updateStructuredDataForPage(content, currentLang, canonicalPath);
            
            // Generate hreflang tags
            generatePageHreflangTags();
        }
        
        // Update structured data for the installations page
        function updateStructuredDataForPage(content, lang, path) {
            const structuredData = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": content.title,
                "description": content.description,
                "url": \`\${window.location.origin}\${path}\`,
                "inLanguage": lang,
                "about": {
                    "@type": "Product",
                    "name": "Rosehill TPV® Rubber Surfacing",
                    "description": "Premium coloured rubber granules for sports and playground surfaces",
                    "brand": {
                        "@type": "Brand",
                        "name": "Rosehill TPV®"
                    }
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Rosehill TPV®",
                    "url": "https://tpv.rosehill.group",
                    "logo": {
                        "@type": "ImageObject",
                        "url": \`\${window.location.origin}/rosehill_tpv_logo.png\`
                    }
                }
            };
            
            document.getElementById('structured-data').textContent = JSON.stringify(structuredData, null, 2);
        }
        
        // Generate hreflang tags for the installations page
        function generatePageHreflangTags() {
            // Remove existing hreflang tags
            document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(tag => tag.remove());
            
            const baseUrl = window.location.origin;
            const languages = ['en', 'fr', 'de', 'es'];
            
            languages.forEach(lang => {
                const link = document.createElement('link');
                link.rel = 'alternate';
                link.hreflang = lang;
                
                if (lang === 'en') {
                    link.href = \`\${baseUrl}/installations.html\`;
                } else {
                    link.href = \`\${baseUrl}/\${lang}/installations.html\`;
                }
                
                document.head.appendChild(link);
            });
            
            // Add x-default pointing to English
            const defaultLink = document.createElement('link');
            defaultLink.rel = 'alternate';
            defaultLink.hreflang = 'x-default';
            defaultLink.href = \`\${baseUrl}/installations.html\`;
            document.head.appendChild(defaultLink);
        }

        // Initialize everything when page loads
        document.addEventListener('DOMContentLoaded', function() {
            updatePageSEO();
            loadInstallations();
            initMobileMenu();
            
            // Add filter button event listeners
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    filterInstallations(this.dataset.filter);
                });
            });
        });
    `

    // Find the existing script section and replace it
    const scriptStart = html.indexOf('// Global variables')
    const scriptEnd = html.indexOf('</script>', scriptStart)
    
    if (scriptStart === -1 || scriptEnd === -1) {
      throw new Error('Could not find the script section to replace')
    }
    
    // Replace the script content
    html = html.substring(0, scriptStart) + newScript + html.substring(scriptEnd)
    
    // Remove the Supabase script loading
    html = html.replace(/<!-- Load Supabase library directly for faster initialization -->\s*<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2"><\/script>/, '<!-- Supabase removed - now using Sanity -->')
    html = html.replace(/<script src="\/js\/supabase-client\.js"><\/script>/, '<!-- Supabase client removed - now using Sanity -->')
    
    // Write the updated file
    fs.writeFileSync('./installations.html', html)
    
    console.log('✅ Updated installations.html to use Sanity data')
    console.log('📝 The page now loads installations from Sanity while keeping the exact same design')
    
  } catch (error) {
    console.error('💥 Failed to update installations page:', error)
    process.exit(1)
  }
}

// Run the update
updateInstallationsPage()