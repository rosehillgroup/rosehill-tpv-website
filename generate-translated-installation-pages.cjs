// Generate translated installation pages by copying English template and replacing content
// This ensures perfect layout consistency across all languages

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration - use environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://otidaseqlgubqzsqazqt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Path to English template
const ENGLISH_TEMPLATE_PATH = path.join(__dirname, 'installations', 'new-soft-fall-surface.html');

// Languages and their labels
const LANGUAGES = {
    'fr': { 
        name: 'French', 
        code: 'fr',
        labels: {
            home: 'Accueil',
            products: 'Produits', 
            applications: 'Applications',
            colour: 'Couleur',
            installations: 'Installations',
            about: 'À propos',
            contact: 'Contact',
            projectOverview: 'Aperçu du Projet',
            projectImages: 'Images du Projet',
            location: 'Lieu',
            date: 'Date',
            application: 'Application',
            readyToTransform: 'Prêt à Transformer Votre Espace?',
            contactToday: 'Contactez-nous aujourd\'hui pour discuter de la façon dont Rosehill TPV<sup>®</sup> peut créer des surfaces sûres et dynamiques pour votre projet.',
            getStarted: 'Commencer',
            allRightsReserved: 'Tous droits réservés.',
            specialThanks: 'Remerciements Spéciaux',
            thanksMessage: 'Nous tenons à remercier le partenaire suivant pour sa contribution à ce projet :'
        }
    },
    'de': { 
        name: 'German',
        code: 'de', 
        labels: {
            home: 'Startseite',
            products: 'Produkte',
            applications: 'Anwendungen', 
            colour: 'Farbe',
            installations: 'Installationen',
            about: 'Über uns',
            contact: 'Kontakt',
            projectOverview: 'Projektübersicht',
            projectImages: 'Projektbilder',
            location: 'Ort',
            date: 'Datum',
            application: 'Anwendung',
            readyToTransform: 'Bereit, Ihren Raum zu Transformieren?',
            contactToday: 'Kontaktieren Sie uns noch heute, um zu besprechen, wie Rosehill TPV<sup>®</sup> sichere, lebendige Oberflächen für Ihr Projekt schaffen kann.',
            getStarted: 'Loslegen',
            allRightsReserved: 'Alle Rechte vorbehalten.',
            specialThanks: 'Besonderer Dank',
            thanksMessage: 'Wir möchten dem folgenden Partner für seinen Beitrag zu diesem Projekt danken:'
        }
    },
    'es': { 
        name: 'Spanish',
        code: 'es', 
        labels: {
            home: 'Inicio',
            products: 'Productos',
            applications: 'Aplicaciones',
            colour: 'Color',
            installations: 'Instalaciones',
            about: 'Acerca de',
            contact: 'Contacto',
            projectOverview: 'Descripción del Proyecto',
            projectImages: 'Imágenes del Proyecto',
            location: 'Ubicación',
            date: 'Fecha',
            application: 'Aplicación',
            readyToTransform: '¿Listo para Transformar tu Espacio?',
            contactToday: 'Contáctenos hoy para hablar sobre cómo Rosehill TPV<sup>®</sup> puede crear superficies seguras y vibrantes para su proyecto.',
            getStarted: 'Comenzar',
            allRightsReserved: 'Todos los derechos reservados.',
            specialThanks: 'Agradecimientos Especiales',
            thanksMessage: 'Queremos agradecer al siguiente socio por su contribución a este proyecto:'
        }
    }
};

/**
 * Transform Supabase URL to use image transformations
 */
function transformSupabaseUrl(originalUrl, options = {}) {
    if (!originalUrl || !originalUrl.includes('supabase.co/storage')) {
        return originalUrl;
    }
    
    const transformParams = [];
    if (options.width) transformParams.push(`width=${options.width}`);
    if (options.height) transformParams.push(`height=${options.height}`);
    
    const quality = options.quality || 75;
    transformParams.push(`quality=${quality}`);
    
    const resize = options.resize || 'cover';
    transformParams.push(`resize=${resize}`);
    
    if (options.format) {
        transformParams.push(`format=${options.format}`);
    }
    
    const transformQuery = transformParams.join('&');
    return `${originalUrl}?${transformQuery}`;
}

/**
 * Create optimized picture element
 */
function createOptimizedPictureElement(supabaseUrl, altText, options = {}, onclickHandler = '') {
    if (!supabaseUrl || !supabaseUrl.includes('supabase.co/storage')) {
        const onclickAttr = onclickHandler ? ` onclick="${onclickHandler}"` : '';
        return `<img src="${supabaseUrl}" alt="${altText}" loading="lazy"${onclickAttr}>`;
    }
    
    const webpUrl = transformSupabaseUrl(supabaseUrl, { ...options, format: 'webp' });
    const optimizedJpeg = transformSupabaseUrl(supabaseUrl, options);
    const onclickAttr = onclickHandler ? ` onclick="${onclickHandler}"` : '';
    
    return `<picture>
                        <source srcset="${webpUrl}" type="image/webp">
                        <img src="${optimizedJpeg}" alt="${altText}" loading="lazy"${onclickAttr}>
                    </picture>`;
}

/**
 * Format date for display
 */
function formatDate(dateString, lang) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        const locale = {
            'fr': 'fr-FR',
            'de': 'de-DE',
            'es': 'es-ES'
        }[lang] || 'en-US';
        
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

/**
 * Generate a single installation page by copying English template and replacing content
 */
async function generateInstallationPage(translation, installation, outputDir, lang) {
    const labels = LANGUAGES[lang].labels;
    
    // Read English template
    let htmlContent = fs.readFileSync(ENGLISH_TEMPLATE_PATH, 'utf8');
    
    // Process images
    let images = installation.images || [];
    if (typeof images === 'string') {
        try {
            images = JSON.parse(images);
        } catch (e) {
            images = [images];
        }
    }
    
    // Process image URLs to match English format
    const processedImages = images.map(img => {
        let imageUrl = '';
        if (typeof img === 'string') {
            if (img.startsWith('http')) {
                imageUrl = img;
            } else {
                imageUrl = `../images/installations/${img}`;
            }
        } else if (img && typeof img === 'object') {
            if (img.url && img.url.startsWith('http')) {
                imageUrl = img.url;
            } else if (img.filename) {
                imageUrl = `../images/installations/${img.filename}`;
            } else if (img.url) {
                imageUrl = `../images/installations/${img.url}`;
            }
        }
        return imageUrl;
    }).filter(url => url);

    // Build gallery HTML and modal HTML exactly like English template
    let imageGalleryHTML = '';
    let modalImagesHTML = '';
    
    if (processedImages.length > 0) {
        processedImages.forEach((imageUrl, index) => {
            const isSupabaseUrl = imageUrl.includes('supabase.co/storage');
            
            if (isSupabaseUrl) {
                const thumbnailElement = createOptimizedPictureElement(
                    imageUrl,
                    `${translation.title} - Image ${index + 1}`,
                    { width: 400, height: 300 },
                    `openModal(${index})`
                );
                imageGalleryHTML += `
                <div class="gallery-item">
                    ${thumbnailElement}
                </div>`;
                
                const fullSizeElement = createOptimizedPictureElement(
                    imageUrl,
                    `${translation.title} - Image ${index + 1}`,
                    { width: 1200, height: 800, quality: 75 }
                );
                const displayStyle = index === 0 ? 'style="display: block;"' : '';
                modalImagesHTML += `
                <div class="modal-image" id="modal-img-${index}" ${displayStyle}>
                    ${fullSizeElement}
                </div>`;
            } else {
                imageGalleryHTML += `
                <div class="gallery-item">
                    <img src="${imageUrl}" alt="${translation.title} - Image ${index + 1}" loading="lazy" onclick="openModal(${index})">
                </div>`;
                const displayStyle = index === 0 ? 'style="display: block;"' : '';
                modalImagesHTML += `
                <div class="modal-image" id="modal-img-${index}" ${displayStyle}>
                    <img src="${imageUrl}" alt="${translation.title} - Image ${index + 1}" loading="lazy">
                </div>`;
            }
        });
    }

    // Perform selective replacements
    
    // Language and basic meta
    htmlContent = htmlContent.replace('lang="en"', `lang="${lang}"`);
    htmlContent = htmlContent.replace('Nursery\'s New Soft-Fall Surface - Rosehill TPV Installation', `${translation.title} - Rosehill TPV Installation`);
    htmlContent = htmlContent.replace(/content="Nursery's New Soft-Fall Surface[^"]*"/, `content="${translation.overview ? translation.overview.substring(0, 155) : ''}"`);
    
    // Navigation links and labels
    htmlContent = htmlContent.replace('href="../index.html">Home</a>', `href="/${lang}/">${labels.home}</a>`);
    htmlContent = htmlContent.replace('href="../products.html">Products</a>', `href="/${lang}/products.html">${labels.products}</a>`);
    htmlContent = htmlContent.replace('href="../applications.html">Applications</a>', `href="/${lang}/applications.html">${labels.applications}</a>`);
    htmlContent = htmlContent.replace('href="../colour.html">Colour</a>', `href="/${lang}/colour.html">${labels.colour}</a>`);
    htmlContent = htmlContent.replace('href="../installations.html" class="active">Installations</a>', `href="/${lang}/installations.html" class="active">${labels.installations}</a>`);
    htmlContent = htmlContent.replace('href="../about.html">About Us</a>', `href="/${lang}/about.html">${labels.about}</a>`);
    htmlContent = htmlContent.replace('href="../contact.html" class="contact-btn">Get in Touch</a>', `href="/${lang}/contact.html" class="contact-btn">${labels.contact}</a>`);

    // Logo link
    htmlContent = htmlContent.replace('href="../index.html" class="logo"', `href="/${lang}/" class="logo"`);
    
    // Breadcrumb
    htmlContent = htmlContent.replace('<a href="../installations.html">Installations</a> / Nursery\'s New Soft-Fall Surface', `<a href="/${lang}/installations.html">${labels.installations}</a> / ${translation.title}`);
    
    // Installation title and meta
    htmlContent = htmlContent.replace('<h1>Nursery\'s New Soft-Fall Surface</h1>', `<h1>${translation.title}</h1>`);
    htmlContent = htmlContent.replace('<span class="meta-label">Location:</span>', `<span class="meta-label">${labels.location}:</span>`);
    htmlContent = htmlContent.replace('<span class="meta-value">Los Ángeles, Chile</span>', `<span class="meta-value">${translation.location}</span>`);
    htmlContent = htmlContent.replace('<span class="meta-label">Date:</span>', `<span class="meta-label">${labels.date}:</span>`);
    htmlContent = htmlContent.replace('<span class="meta-value">23 March 2025</span>', `<span class="meta-value">${formatDate(installation.installation_date, lang)}</span>`);
    htmlContent = htmlContent.replace('<span class="meta-label">Application:</span>', `<span class="meta-label">${labels.application}:</span>`);
    htmlContent = htmlContent.replace('<span class="meta-value">Playground Surfaces</span>', `<span class="meta-value">${installation.application || 'playground'}</span>`);
    
    // Section headings
    htmlContent = htmlContent.replace('<h3>Project Images</h3>', `<h3>${labels.projectImages}</h3>`);
    
    // Replace image gallery content - need to match the complete gallery-grid section
    htmlContent = htmlContent.replace(
        /<div class="gallery-grid">\s*\n?([\s\S]*?)\n?\s*<\/div>\s*<\/div>\s*<\/div>/m,
        `<div class="gallery-grid">${imageGalleryHTML}
                </div>
            </div>
            </div>`
    );
    
    // Process project overview content with paragraph breaks and thanks extraction
    const rawOverview = translation.overview || '';
    
    // Extract thanks information from overview if present
    let cleanOverview = rawOverview;
    let thanksText = '';
    let thanksLink = '';
    
    // Look for "Thanks to" or "Grâce à" patterns and extract them
    const thanksPatterns = [
        /(.+?)\s*(?:Thanks to|Grâce à|Dank|Gracias a)\s*<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>\s*$/i,
        /(.+?)\s*(?:Thanks to|Grâce à|Dank|Gracias a)\s+([^<]+)\s*$/i
    ];
    
    for (const pattern of thanksPatterns) {
        const match = rawOverview.match(pattern);
        if (match) {
            cleanOverview = match[1].trim();
            if (match[2] && match[3]) {
                // Has link
                thanksLink = match[2];
                thanksText = match[3];
            } else if (match[2]) {
                // Just text
                thanksText = match[2];
            }
            break;
        }
    }
    
    // Split overview into paragraphs (roughly every 2-3 sentences)
    const sentences = cleanOverview.split(/(?<=[.!?])\s+/).filter(s => s.trim());
    const paragraphs = [];
    let currentParagraph = '';
    
    for (let i = 0; i < sentences.length; i++) {
        currentParagraph += (currentParagraph ? ' ' : '') + sentences[i];
        
        // Create paragraph break every 2-3 sentences or at logical breaks
        if ((i + 1) % 2 === 0 || i === sentences.length - 1 || 
            sentences[i].includes('TPV®') && sentences[i + 1] && sentences[i + 1].includes('With')) {
            paragraphs.push(currentParagraph.trim());
            currentParagraph = '';
        }
    }
    
    // Generate paragraph HTML
    const overviewHTML = paragraphs.map(p => `<p>${p}</p>`).join('\n                ');
    
    // Replace the entire installation content section
    htmlContent = htmlContent.replace(
        /(<div class="installation-content">\s*<h2>Project Overview<\/h2>\s*)[\s\S]*?(<\/div>)/m,
        `$1${overviewHTML}
            $2`
    );
    
    // Now replace the heading after content replacement
    htmlContent = htmlContent.replace('<h2>Project Overview</h2>', `<h2>${labels.projectOverview}</h2>`);
    
    // Handle thanks section replacement
    if (thanksText || installation.thanks_to) {
        // Use database thanks_to if available, otherwise use extracted thanks
        const finalThanksText = installation.thanks_to || thanksText;
        const finalThanksLink = installation.thanks_to_link || thanksLink;
        
        let thanksHTML = `<div class="thanks-section">
                <h3>${labels.specialThanks}</h3>
                <p>${labels.thanksMessage}</p>`;
        
        if (finalThanksLink) {
            thanksHTML += `
                <a href="${finalThanksLink}" target="_blank" rel="noopener noreferrer" class="thanks-link">${finalThanksText}</a>`;
        } else {
            thanksHTML += `
                <span class="thanks-link">${finalThanksText}</span>`;
        }
        
        thanksHTML += `
            </div>`;
        
        // Replace the thanks section
        htmlContent = htmlContent.replace(
            /<div class="thanks-section">[\s\S]*?<\/div>/m,
            thanksHTML
        );
    } else {
        // Remove thanks section if no thanks data
        htmlContent = htmlContent.replace(
            /\s*<!-- Thanks Section - Appears after project overview -->\s*<div class="thanks-section">[\s\S]*?<\/div>\s*/m,
            ''
        );
    }
    
    // Replace modal content
    htmlContent = htmlContent.replace(/(<span class="close"[\s\S]*?<div class="modal-content"[^>]*>)[\s\S]*?(<button class="nav-btn prev")/, `$1${modalImagesHTML}
                    $2`);
    
    // Update total images in JavaScript
    htmlContent = htmlContent.replace('const totalImages = 3;', `const totalImages = ${processedImages.length};`);
    
    // CTA section
    htmlContent = htmlContent.replace('<h3>Ready to Transform Your Space?</h3>', `<h3>${labels.readyToTransform}</h3>`);
    htmlContent = htmlContent.replace('Contact us today to discuss how Rosehill TPV can create safe, vibrant surfaces for your project.', labels.contactToday);
    htmlContent = htmlContent.replace('href="../contact.html" class="cta-button">Get Started</a>', `href="/${lang}/contact.html" class="cta-button">${labels.getStarted}</a>`);
    
    // Footer navigation
    htmlContent = htmlContent.replace(/<nav class="footer-nav">[\s\S]*?<\/nav>/, `<nav class="footer-nav">
                <a href="/${lang}/">${labels.home}</a>
                <a href="/${lang}/products.html">${labels.products}</a>
                <a href="/${lang}/applications.html">${labels.applications}</a>
                <a href="/${lang}/colour.html">${labels.colour}</a>
                <a href="/${lang}/installations.html">${labels.installations}</a>
                <a href="/${lang}/about.html">${labels.about}</a>
                <a href="/${lang}/contact.html">${labels.contact}</a>
            </nav>`);
    htmlContent = htmlContent.replace('&copy; 2025 Rosehill TPV. All rights reserved.', `&copy; 2025 Rosehill TPV<sup>®</sup>. ${labels.allRightsReserved}`);

    // Write the file
    const filePath = path.join(outputDir, `${translation.slug}.html`);
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`✓ Generated: ${lang}/${translation.slug}.html`);
}

/**
 * Main function to generate all translated installation pages
 */
async function generateTranslatedInstallationPages() {
    try {
        console.log('🌍 Starting translation page generation...\n');
        
        // Get all installations from main table
        const { data: installations, error: installError } = await supabase
            .from('installations')
            .select('*')
            .order('installation_date', { ascending: false });

        if (installError) {
            throw new Error(`Failed to fetch installations: ${installError.message}`);
        }

        console.log(`Found ${installations.length} installations in database`);

        // Create a map for quick lookup
        const installationMap = {};
        installations.forEach(inst => {
            installationMap[inst.id] = inst;
        });

        // Process each language
        for (const [langCode, langConfig] of Object.entries(LANGUAGES)) {
            console.log(`\n📝 Generating ${langConfig.name} (${langCode}) pages...`);
            
            // Create output directory
            const outputDir = path.join(__dirname, langCode, 'installations');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Get all translations for this language
            const { data: translations, error: transError } = await supabase
                .from('installation_i18n')
                .select('*')
                .eq('lang', langCode)
                .order('created_at', { ascending: false });

            if (transError) {
                console.error(`Error fetching ${langCode} translations:`, transError);
                continue;
            }

            console.log(`Found ${translations.length} ${langConfig.name} translations`);

            // Generate page for each translation
            let generated = 0;
            for (const translation of translations) {
                const installation = installationMap[translation.installation_id];
                if (!installation) {
                    console.warn(`⚠️  No installation found for translation ${translation.id}`);
                    continue;
                }

                try {
                    await generateInstallationPage(translation, installation, outputDir, langCode);
                    generated++;
                } catch (error) {
                    console.error(`❌ Failed to generate ${langCode}/${translation.slug}.html:`, error.message);
                }
            }

            console.log(`✅ Generated ${generated} ${langConfig.name} pages`);
        }

        console.log('\n🎉 Translation page generation complete!');
        
        // Summary
        const totalGenerated = Object.keys(LANGUAGES).reduce((sum, lang) => {
            const dir = path.join(__dirname, lang, 'installations');
            if (fs.existsSync(dir)) {
                return sum + fs.readdirSync(dir).filter(f => f.endsWith('.html')).length;
            }
            return sum;
        }, 0);
        
        console.log(`\n📊 Summary: ${totalGenerated} total translated pages generated`);

    } catch (error) {
        console.error('❌ Fatal error in translation page generation:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    generateTranslatedInstallationPages();
}

module.exports = { generateTranslatedInstallationPages };