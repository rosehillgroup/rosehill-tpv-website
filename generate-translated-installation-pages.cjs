// Generate complete static HTML pages for translated installations
// This creates complete pages from the installation_i18n table

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration - use environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://otidaseqlgubqzsqazqt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
            allRightsReserved: 'Tous droits réservés.'
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
            location: 'Standort',
            date: 'Datum',
            application: 'Anwendung',
            readyToTransform: 'Bereit, Ihren Raum zu Verwandeln?',
            contactToday: 'Kontaktieren Sie uns heute, um zu besprechen, wie Rosehill TPV<sup>®</sup> sichere, lebendige Oberflächen für Ihr Projekt schaffen kann.',
            getStarted: 'Loslegen',
            allRightsReserved: 'Alle Rechte vorbehalten.'
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
            projectOverview: 'Resumen del Proyecto',
            projectImages: 'Imágenes del Proyecto',
            location: 'Ubicación',
            date: 'Fecha',
            application: 'Aplicación',
            readyToTransform: '¿Listo para Transformar su Espacio?',
            contactToday: 'Contáctenos hoy para hablar sobre cómo Rosehill TPV<sup>®</sup> puede crear superficies seguras y vibrantes para su proyecto.',
            getStarted: 'Comenzar',
            allRightsReserved: 'Todos los derechos reservados.'
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
 * Generate a single installation page
 */
async function generateInstallationPage(translation, installation, outputDir, lang) {
    const labels = LANGUAGES[lang].labels;
    
    // Process images
    let images = installation.images || [];
    if (typeof images === 'string') {
        try {
            images = JSON.parse(images);
        } catch (e) {
            images = [images];
        }
    }
    
    // Process image URLs
    const processedImages = images.map(img => {
        let imageUrl = '';
        if (typeof img === 'string') {
            if (img.startsWith('http')) {
                imageUrl = img;
            } else {
                imageUrl = `../images/installations/${img}`;
            }
        } else if (img && typeof img === 'object') {
            if (img.url) {
                imageUrl = img.url;
            } else if (img.filename) {
                if (img.filename.startsWith('http')) {
                    imageUrl = img.filename;
                } else {
                    imageUrl = `../images/installations/${img.filename}`;
                }
            }
        }
        return imageUrl;
    }).filter(url => url);

    // Generate image gallery HTML
    let imageGalleryHTML = '';
    let modalImagesHTML = '';
    
    if (processedImages.length > 0) {
        processedImages.forEach((imageUrl, index) => {
            const isSupabaseUrl = imageUrl.includes('supabase.co/storage');
            
            if (isSupabaseUrl) {
                // Optimized Supabase images
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
                    { width: 1200, quality: 85 }
                );
                modalImagesHTML += fullSizeElement.replace('<img', `<img class="modal-image" style="${index === 0 ? '' : 'display:none;'}"`);
            } else {
                // Regular images
                imageGalleryHTML += `
                <div class="gallery-item">
                    <img src="${imageUrl}" alt="${translation.title} - Image ${index + 1}" onclick="openModal(${index})" loading="lazy">
                </div>`;
                modalImagesHTML += `<img src="${imageUrl}" alt="${translation.title} - Image ${index + 1}" class="modal-image" style="${index === 0 ? '' : 'display:none;'}">`;
            }
        });
    }

    // Generate HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${translation.title} - Rosehill TPV®</title>
    <meta name="description" content="${translation.overview ? translation.overview.substring(0, 155) : ''}">
    <link rel="canonical" href="https://tpv.rosehill.group/${lang}/installations/${translation.slug}.html">
    
    <!-- Language alternates -->
    <link rel="alternate" hreflang="en" href="https://tpv.rosehill.group/installations/${installation.slug}.html">
    <link rel="alternate" hreflang="fr" href="https://tpv.rosehill.group/fr/installations/${translation.slug}.html">
    <link rel="alternate" hreflang="de" href="https://tpv.rosehill.group/de/installations/${translation.slug}.html">
    <link rel="alternate" hreflang="es" href="https://tpv.rosehill.group/es/installations/${translation.slug}.html">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Overpass:wght@300;400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Source Sans Pro', sans-serif;
            background: #f8f9fa;
            color: #333;
            line-height: 1.6;
        }

        /* Header Styles */
        .header {
            background: linear-gradient(135deg, #1a365d, #2d4a71);
            color: white;
            padding: 15px 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: white;
        }

        .logo img {
            height: 40px;
            margin-right: 15px;
        }

        .logo-text {
            font-size: 24px;
            font-weight: 700;
            font-family: 'Overpass', sans-serif;
        }

        .nav-menu {
            display: flex;
            list-style: none;
            gap: 30px;
        }

        .nav-menu a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.3s ease;
        }

        .nav-menu a:hover {
            opacity: 0.8;
        }

        /* Main Content */
        .main-content {
            margin-top: 80px;
            padding: 40px 20px;
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
        }

        .breadcrumb {
            margin-bottom: 30px;
            color: #64748b;
            font-size: 14px;
        }

        .breadcrumb a {
            color: #ff6b35;
            text-decoration: none;
        }

        .installation-header {
            margin-bottom: 40px;
        }

        .installation-title {
            font-size: 36px;
            font-weight: 700;
            color: #1a365d;
            margin-bottom: 20px;
            font-family: 'Overpass', sans-serif;
        }

        .installation-meta {
            display: flex;
            gap: 30px;
            flex-wrap: wrap;
            color: #64748b;
            font-size: 16px;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .meta-item strong {
            color: #1a365d;
        }

        /* Image Gallery */
        .gallery-section {
            margin-bottom: 50px;
        }

        .section-title {
            font-size: 28px;
            font-weight: 600;
            color: #1a365d;
            margin-bottom: 25px;
            font-family: 'Overpass', sans-serif;
        }

        .image-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }

        .gallery-item {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .gallery-item:hover {
            transform: translateY(-5px);
        }

        .gallery-item img {
            width: 100%;
            height: 250px;
            object-fit: cover;
        }

        /* Project Overview */
        .overview-section {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 50px;
        }

        .overview-content {
            font-size: 18px;
            line-height: 1.8;
            color: #374151;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
        }

        .modal-content {
            margin: auto;
            display: block;
            max-width: 90%;
            max-height: 90%;
            margin-top: 50px;
        }

        .modal-image {
            width: 100%;
            height: auto;
            object-fit: contain;
        }

        .close {
            position: absolute;
            top: 15px;
            right: 35px;
            color: #f1f1f1;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
        }

        .close:hover {
            color: #ff6b35;
        }

        .modal-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: white;
            font-size: 30px;
            cursor: pointer;
            padding: 10px;
            background: rgba(0,0,0,0.5);
            user-select: none;
        }

        .prev {
            left: 10px;
        }

        .next {
            right: 10px;
        }

        /* CTA Section */
        .cta-section {
            background: linear-gradient(135deg, #ff6b35, #ff8c61);
            color: white;
            padding: 60px 40px;
            border-radius: 12px;
            text-align: center;
            margin-top: 50px;
        }

        .cta-title {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 20px;
            font-family: 'Overpass', sans-serif;
        }

        .cta-text {
            font-size: 18px;
            margin-bottom: 30px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .cta-button {
            display: inline-block;
            background: white;
            color: #ff6b35;
            padding: 15px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 18px;
            transition: transform 0.3s ease;
        }

        .cta-button:hover {
            transform: translateY(-2px);
        }

        /* Footer */
        .footer {
            background: #1a365d;
            color: white;
            padding: 40px 20px 20px;
            margin-top: 80px;
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }

            .installation-title {
                font-size: 28px;
            }

            .overview-section {
                padding: 25px;
            }

            .image-gallery {
                grid-template-columns: 1fr;
            }

            .modal-content {
                margin-top: 100px;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-container">
            <a href="/${lang}/" class="logo">
                <img src="/rosehill_tpv_logo.png" alt="Rosehill TPV®">
                <span class="logo-text">Rosehill TPV<sup>®</sup></span>
            </a>
            <nav>
                <ul class="nav-menu">
                    <li><a href="/${lang}/">${labels.home}</a></li>
                    <li><a href="/${lang}/products.html">${labels.products}</a></li>
                    <li><a href="/${lang}/applications.html">${labels.applications}</a></li>
                    <li><a href="/${lang}/colour.html">${labels.colour}</a></li>
                    <li><a href="/${lang}/installations.html">${labels.installations}</a></li>
                    <li><a href="/${lang}/about.html">${labels.about}</a></li>
                    <li><a href="/${lang}/contact.html">${labels.contact}</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
            <a href="/${lang}/">${labels.home}</a> / 
            <a href="/${lang}/installations.html">${labels.installations}</a> / 
            ${translation.title}
        </div>

        <!-- Installation Header -->
        <div class="installation-header">
            <h1 class="installation-title">${translation.title}</h1>
            <div class="installation-meta">
                <div class="meta-item">
                    <strong>${labels.location}:</strong> ${translation.location}
                </div>
                <div class="meta-item">
                    <strong>${labels.date}:</strong> ${formatDate(installation.installation_date, lang)}
                </div>
                ${installation.application ? `
                <div class="meta-item">
                    <strong>${labels.application}:</strong> ${installation.application}
                </div>` : ''}
            </div>
        </div>

        <!-- Image Gallery -->
        ${processedImages.length > 0 ? `
        <section class="gallery-section">
            <h2 class="section-title">${labels.projectImages}</h2>
            <div class="image-gallery">
                ${imageGalleryHTML}
            </div>
        </section>` : ''}

        <!-- Project Overview -->
        <section class="overview-section">
            <h2 class="section-title">${labels.projectOverview}</h2>
            <div class="overview-content">
                ${translation.overview || ''}
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
            <h2 class="cta-title">${labels.readyToTransform}</h2>
            <p class="cta-text">${labels.contactToday}</p>
            <a href="/${lang}/contact.html" class="cta-button">${labels.getStarted}</a>
        </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <p>&copy; 2025 Rosehill TPV<sup>®</sup>. ${labels.allRightsReserved}</p>
        </div>
    </footer>

    <!-- Modal -->
    <div id="imageModal" class="modal">
        <span class="close" onclick="closeModal()">&times;</span>
        <span class="modal-nav prev" onclick="changeImage(-1)">&#10094;</span>
        <span class="modal-nav next" onclick="changeImage(1)">&#10095;</span>
        <div class="modal-content">
            ${modalImagesHTML}
        </div>
    </div>

    <script>
        let currentImageIndex = 0;
        const totalImages = ${processedImages.length};

        function openModal(index) {
            currentImageIndex = index;
            document.getElementById('imageModal').style.display = 'block';
            showImage(index);
        }

        function closeModal() {
            document.getElementById('imageModal').style.display = 'none';
        }

        function changeImage(direction) {
            currentImageIndex += direction;
            if (currentImageIndex >= totalImages) currentImageIndex = 0;
            if (currentImageIndex < 0) currentImageIndex = totalImages - 1;
            showImage(currentImageIndex);
        }

        function showImage(index) {
            const images = document.querySelectorAll('.modal-image');
            images.forEach((img, i) => {
                img.style.display = i === index ? 'block' : 'none';
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            } else if (event.key === 'ArrowLeft') {
                changeImage(-1);
            } else if (event.key === 'ArrowRight') {
                changeImage(1);
            }
        });
    </script>
</body>
</html>`;

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