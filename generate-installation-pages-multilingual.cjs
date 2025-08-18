const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing required environment variables:');
    console.error('SUPABASE_URL:', !!supabaseUrl);
    console.error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY:', !!supabaseKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'es'];

// Language-specific content
const LANGUAGE_CONTENT = {
    en: {
        installationsNavText: 'Installations',
        projectImagesHeading: 'Project Images',
        projectOverviewHeading: 'Project Overview',
        readyToTransformHeading: 'Ready to Transform Your Space?',
        readyToTransformText: 'Contact us today to discuss how Rosehill TPV<sup>®</sup> can create safe, vibrant surfaces for your project.',
        getStartedButton: 'Get Started',
        footerText: 'Creating safer, more vibrant play and sports surfaces worldwide with our premium coloured rubber granules.',
        navHome: 'Home',
        navProducts: 'Products',
        navApplications: 'Applications',
        navColour: 'Colour',
        navInstallations: 'Installations',
        navAbout: 'About Us',
        navContact: 'Get in Touch',
        metaLocation: 'Location:',
        metaDate: 'Date:',
        metaApplication: 'Application:'
    },
    fr: {
        installationsNavText: 'Installations',
        projectImagesHeading: 'Images du Projet',
        projectOverviewHeading: 'Aperçu du Projet',
        readyToTransformHeading: 'Prêt à Transformer Votre Espace ?',
        readyToTransformText: 'Contactez-nous aujourd\'hui pour discuter de la façon dont Rosehill TPV<sup>®</sup> peut créer des surfaces sûres et vibrantes pour votre projet.',
        getStartedButton: 'Commencer',
        footerText: 'Créer des surfaces de jeu et de sport plus sûres et plus vibrantes dans le monde entier avec nos granulés de caoutchouc colorés de qualité supérieure.',
        navHome: 'Accueil',
        navProducts: 'Produits',
        navApplications: 'Applications',
        navColour: 'Couleur',
        navInstallations: 'Installations',
        navAbout: 'À Propos',
        navContact: 'Contactez-nous',
        metaLocation: 'Lieu :',
        metaDate: 'Date :',
        metaApplication: 'Application :'
    },
    de: {
        installationsNavText: 'Installationen',
        projectImagesHeading: 'Projektbilder',
        projectOverviewHeading: 'Projektübersicht',
        readyToTransformHeading: 'Bereit, Ihren Raum zu Verwandeln?',
        readyToTransformText: 'Kontaktieren Sie uns heute, um zu besprechen, wie Rosehill TPV<sup>®</sup> sichere, lebendige Oberflächen für Ihr Projekt schaffen kann.',
        getStartedButton: 'Loslegen',
        footerText: 'Schaffung sichererer, lebendigerer Spiel- und Sportflächen weltweit mit unseren hochwertigen farbigen Gummigranulaten.',
        navHome: 'Startseite',
        navProducts: 'Produkte',
        navApplications: 'Anwendungen',
        navColour: 'Farbe',
        navInstallations: 'Installationen',
        navAbout: 'Über Uns',
        navContact: 'Kontakt',
        metaLocation: 'Standort:',
        metaDate: 'Datum:',
        metaApplication: 'Anwendung:'
    },
    es: {
        installationsNavText: 'Instalaciones',
        projectImagesHeading: 'Imágenes del Proyecto',
        projectOverviewHeading: 'Visión General del Proyecto',
        readyToTransformHeading: '¿Listo para Transformar tu Espacio?',
        readyToTransformText: 'Contáctenos hoy para discutir cómo Rosehill TPV<sup>®</sup> puede crear superficies seguras y vibrantes para su proyecto.',
        getStartedButton: 'Empezar',
        footerText: 'Creando superficies de juego y deportes más seguras y vibrantes en todo el mundo con nuestros gránulos de caucho coloreados premium.',
        navHome: 'Inicio',
        navProducts: 'Productos',
        navApplications: 'Aplicaciones',
        navColour: 'Color',
        navInstallations: 'Instalaciones',
        navAbout: 'Acerca de',
        navContact: 'Contacto',
        metaLocation: 'Ubicación:',
        metaDate: 'Fecha:',
        metaApplication: 'Aplicación:'
    }
};

// Load customer URL mappings
function loadCustomerUrls() {
    try {
        const customerUrlsPath = path.join(__dirname, 'customer-urls.json');
        const customerUrlsData = fs.readFileSync(customerUrlsPath, 'utf8');
        return JSON.parse(customerUrlsData);
    } catch (error) {
        console.warn('Could not load customer URLs:', error.message);
        return {};
    }
}

/**
 * Convert customer company names to hyperlinks in text
 */
function linkCustomerNames(text, customerUrls) {
    if (!text || typeof text !== 'string') return text;
    
    // Don't process text that already has links
    if (text.includes('<a href=') || text.includes('href=')) return text;
    
    let linkedText = text;
    
    // Sort company names by length (longest first) to avoid partial matches
    const sortedCompanyNames = Object.keys(customerUrls).sort((a, b) => b.length - a.length);
    
    for (const companyName of sortedCompanyNames) {
        const url = customerUrls[companyName];
        if (!url) continue;
        
        // Create regex for case-insensitive matching, accounting for HTML entities
        const escapedCompanyName = companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedCompanyName.replace(/&/g, '(&amp;|&)')}\\b`, 'gi');
        
        linkedText = linkedText.replace(regex, (match, offset, string) => {
            const beforeMatch = string.substring(0, offset);
            const openTags = (beforeMatch.match(/<a[^>]*>/gi) || []).length;
            const closeTags = (beforeMatch.match(/<\/a>/gi) || []).length;
            
            if (openTags > closeTags) {
                return match;
            }
            
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #ff6b35; text-decoration: underline;">${match}</a>`;
        });
    }
    
    return linkedText;
}

/**
 * Get the appropriate content for a field based on language with fallback
 */
function getLocalizedContent(installation, field, language) {
    // Try language-specific column first
    const langField = `${field}_${language}`;
    if (installation[langField] !== null && installation[langField] !== undefined) {
        return installation[langField];
    }
    
    // Fallback to English-specific column
    const enField = `${field}_en`;
    if (installation[enField] !== null && installation[enField] !== undefined) {
        return installation[enField];
    }
    
    // Final fallback to original column
    return installation[field];
}

/**
 * Generate installation page for a specific language
 */
async function generateInstallationPage(installation, outputDir, customerUrls, language = 'en') {
    const { 
        id,
        slug,
        installation_date,
        images = []
    } = installation;

    // Get localized content with fallbacks
    const title = getLocalizedContent(installation, 'title', language);
    const location = getLocalizedContent(installation, 'location', language);
    const description = getLocalizedContent(installation, 'description', language);
    const application = getLocalizedContent(installation, 'application', language);

    if (!title || !slug) {
        console.warn(`Skipping installation ${id} - missing title or slug`);
        return;
    }

    const lang = LANGUAGE_CONTENT[language] || LANGUAGE_CONTENT.en;

    // Format the installation date
    const formattedDate = new Date(installation_date).toLocaleDateString(language === 'en' ? 'en-GB' : language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Application type mapping (localized)
    const applicationTypes = {
        en: {
            'playground': 'Playground Surfaces',
            'muga': 'Multi-Use Games Areas',
            'track': 'Running Tracks',
            'pitch': 'Sports Pitches',
            'footpath': 'Footpaths & Walkways',
            'splashpark': 'Splash Parks & Water Play',
            'tennis': 'Tennis Courts',
            'athletics': 'Athletics Tracks',
            'safety': 'Safety Surfaces',
            'other': 'Other Applications'
        },
        fr: {
            'playground': 'Surfaces de Jeux',
            'muga': 'Aires de Jeux Multi-Usages',
            'track': 'Pistes de Course',
            'pitch': 'Terrains de Sport',
            'footpath': 'Sentiers et Allées',
            'splashpark': 'Parcs Aquatiques et Jeux d\'Eau',
            'tennis': 'Courts de Tennis',
            'athletics': 'Pistes d\'Athlétisme',
            'safety': 'Surfaces de Sécurité',
            'other': 'Autres Applications'
        },
        de: {
            'playground': 'Spielplatzoberflächen',
            'muga': 'Mehrzweck-Spielbereiche',
            'track': 'Laufbahnen',
            'pitch': 'Sportplätze',
            'footpath': 'Fuß- und Gehwege',
            'splashpark': 'Wasserspielparks',
            'tennis': 'Tennisplätze',
            'athletics': 'Leichtathletikbahnen',
            'safety': 'Sicherheitsoberflächen',
            'other': 'Andere Anwendungen'
        },
        es: {
            'playground': 'Superficies de Juegos',
            'muga': 'Áreas de Juegos Multi-Uso',
            'track': 'Pistas de Atletismo',
            'pitch': 'Campos Deportivos',
            'footpath': 'Senderos y Pasarelas',
            'splashpark': 'Parques Acuáticos y Juegos de Agua',
            'tennis': 'Canchas de Tenis',
            'athletics': 'Pistas de Atletismo',
            'safety': 'Superficies de Seguridad',
            'other': 'Otras Aplicaciones'
        }
    };

    const applicationDisplay = applicationTypes[language]?.[application] || applicationTypes.en[application] || application;

    // Process description with customer linking
    let processedDescription = '';
    if (Array.isArray(description)) {
        processedDescription = description.map(para => {
            const linkedPara = linkCustomerNames(para, customerUrls);
            return `<p>${linkedPara}</p>`;
        }).join('\n                ');
    } else if (description) {
        const linkedDesc = linkCustomerNames(description, customerUrls);
        processedDescription = `<p>${linkedDesc}</p>`;
    }

    /**
     * Get the appropriate image path for an installation image
     * Handles both Supabase storage URLs and local files
     */
    function getImagePath(image) {
        // If the image has a Supabase URL, use it directly
        if (image.url && image.url.includes('supabase.co')) {
            return image.url;
        }
        
        // For local files, check if they exist
        if (image.filename) {
            const fs = require('fs');
            const path = require('path');
            const imagesDir = path.join(__dirname, 'dist', 'images', 'installations');
            
            // First, check if the original filename exists locally
            try {
                if (fs.existsSync(path.join(imagesDir, image.filename))) {
                    return `../images/installations/${image.filename}`;
                }
            } catch (error) {
                // Continue with fallback logic
            }
            
            // Check if filename has double timestamp pattern and try to find local equivalent
            const doubleTimestampMatch = image.filename.match(/^(\d{13})_(\d{13})\.(.+)$/);
            if (doubleTimestampMatch) {
                const [, newerTimestamp, olderTimestamp, extension] = doubleTimestampMatch;
                const candidateFilenames = [
                    `${olderTimestamp}.${extension}`,
                    `${newerTimestamp}.${extension}`,
                    `${olderTimestamp.substring(0, 10)}.${extension}`,
                    `${newerTimestamp.substring(0, 10)}.${extension}`
                ];
                
                for (const candidate of candidateFilenames) {
                    const candidatePath = path.join(imagesDir, candidate);
                    try {
                        if (fs.existsSync(candidatePath)) {
                            console.log(`📸 Fixed local image path: ${image.filename} → ${candidate}`);
                            return `../images/installations/${candidate}`;
                        }
                    } catch (error) {
                        continue;
                    }
                }
            }
            
            console.warn(`⚠️  Could not find local image for: ${image.filename}`);
        }
        
        return null;
    }

    // Generate image gallery HTML
    let galleryHTML = '';
    let modalHTML = '';
    let firstImageDisplay = 'block';

    let validImageCount = 0; // Track total valid images for JavaScript
    
    if (images && images.length > 0) {
        let validImageIndex = 0; // Track valid images for modal indexing
        
        images.forEach((image) => {
            // Get the appropriate image path (Supabase URL or local path)
            const imagePath = getImagePath(image);
            
            // Skip this image if we couldn't determine a valid path
            if (!imagePath) {
                console.warn(`⚠️  Skipping image - no valid path found:`, image);
                return;
            }
            
            const altText = `${title} - Image ${validImageIndex + 1}`;
            
            galleryHTML += `
                <div class="gallery-item">
                    <img src="${imagePath}" alt="${altText}" loading="lazy" onclick="openModal(${validImageIndex})">
                </div>`;
            
            modalHTML += `
                <div class="modal-image" id="modal-img-${validImageIndex}" ${validImageIndex === 0 ? 'style="display: block;"' : ''}>
                    <img src="${imagePath}" alt="${altText}" loading="lazy">
                </div>`;
            
            validImageIndex++;
            validImageCount++;
        });
    }

    // Language prefix for paths
    const langPrefix = language === 'en' ? 'en' : language;
    const basePath = `/${langPrefix}/`;
    const installationsPath = `${basePath}installations.html`;

    // Generate the complete HTML page
    const htmlContent = `<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Rosehill TPV® Installation</title>
    <meta name="description" content="${title} in ${location}. See how Rosehill TPV® coloured rubber granules were used to create safe, vibrant surfaces for ${applicationDisplay.toLowerCase()}.">
    <link rel="apple-touch-icon" sizes="180x180" href="../../favicon_io/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../../favicon_io/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../../favicon_io/favicon-16x16.png">
    <link rel="manifest" href="../../favicon_io/site.webmanifest">
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
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
        }

        .logo img {
            height: 60px;
        }

        .nav-menu {
            display: flex;
            list-style: none;
            gap: 30px;
            align-items: center;
        }

        .nav-menu a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            padding: 8px 16px;
            border-radius: 6px;
        }

        .nav-menu a:hover {
            background: rgba(255, 107, 53, 0.2);
            color: #ff6b35;
        }

        .nav-menu a.active {
            background: rgba(255, 107, 53, 0.2);
            color: #ff6b35;
            font-weight: 600;
        }

        .contact-btn {
            background: #ff6b35;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            margin-left: 10px;
        }

        .contact-btn:hover {
            background: #e55a2b !important;
            transform: translateY(-2px);
        }

        /* Main Content */
        .main-content {
            margin-top: 80px;
            padding: 40px 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .breadcrumb {
            margin-bottom: 30px;
            font-size: 14px;
            color: #666;
        }

        .breadcrumb a {
            color: #ff6b35;
            text-decoration: none;
        }

        .breadcrumb a:hover {
            text-decoration: underline;
        }

        .installation-header {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            margin-bottom: 40px;
        }

        .installation-header h1 {
            font-size: 2.5rem;
            color: #1a365d;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .installation-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            margin-bottom: 30px;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .meta-icon {
            width: 20px;
            height: 20px;
            color: #ff6b35;
        }

        .meta-label {
            font-weight: 600;
            color: #1a365d;
        }

        .meta-value {
            color: #666;
        }

        .installation-content {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            margin-bottom: 40px;
        }

        .installation-content h2 {
            color: #1a365d;
            margin-bottom: 20px;
            font-size: 1.8rem;
        }

        .installation-content p {
            margin-bottom: 20px;
            color: #555;
            font-size: 16px;
            line-height: 1.8;
        }

        /* Image Gallery */
        .image-gallery {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            margin-bottom: 40px;
        }

        .image-gallery h3 {
            color: #1a365d;
            margin-bottom: 30px;
            font-size: 1.8rem;
        }

        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }

        .gallery-item {
            position: relative;
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
            display: block;
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
            cursor: pointer;
        }

        .modal-content {
            position: relative;
            margin: 5% auto;
            max-width: 90%;
            max-height: 80%;
            cursor: default;
        }

        .modal-image {
            display: none;
            text-align: center;
        }

        .modal-image img {
            max-width: 100%;
            max-height: 70vh;
            object-fit: contain;
        }

        .close {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10001;
        }

        .close:hover {
            opacity: 0.7;
        }

        .nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            font-size: 24px;
            padding: 15px 20px;
            cursor: pointer;
            border-radius: 5px;
            transition: background 0.3s ease;
        }

        .nav-btn:hover {
            background: rgba(255,255,255,0.4);
        }

        .nav-btn.prev {
            left: 20px;
        }

        .nav-btn.next {
            right: 20px;
        }

        /* Call to Action */
        .cta-section {
            background: linear-gradient(135deg, #1a365d, #2d4a71);
            color: white;
            padding: 60px 40px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 40px;
        }

        .cta-section h3 {
            font-size: 2rem;
            margin-bottom: 20px;
        }

        .cta-section p {
            font-size: 18px;
            margin-bottom: 30px;
            opacity: 0.9;
        }

        .cta-button {
            display: inline-block;
            background: #ff6b35;
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 18px;
            transition: all 0.3s ease;
        }

        .cta-button:hover {
            background: #e55a2b;
            transform: translateY(-2px);
        }

        /* Footer */
        .footer {
            background: #1a365d;
            color: white;
            padding: 60px 20px 30px;
            text-align: center;
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
        }

        .footer-logo {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
        }

        .footer-logo img {
            height: 80px;
        }

        .footer-text {
            font-size: 16px;
            margin-bottom: 30px;
            opacity: 0.8;
        }

        .footer-nav {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 30px;
            margin-bottom: 30px;
        }

        .footer-nav a {
            color: white;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .footer-nav a:hover {
            color: #ff6b35;
        }

        .footer-bottom {
            border-top: 1px solid rgba(255,255,255,0.2);
            padding-top: 20px;
            font-size: 14px;
            opacity: 0.7;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }

            .installation-header h1 {
                font-size: 2rem;
            }

            .installation-meta {
                flex-direction: column;
                gap: 15px;
            }

            .gallery-grid {
                grid-template-columns: 1fr;
            }

            .installation-header,
            .installation-content,
            .image-gallery,
            .cta-section {
                padding: 20px;
            }

            .footer-nav {
                flex-direction: column;
                gap: 15px;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-container">
            <a href="${basePath}" class="logo">
                <img src="https://otidaseqlgubqzsqazqt.supabase.co/storage/v1/object/public/installation-images/branding/rosehill_tpv_logo.png" alt="Rosehill TPV">
            </a>
            <nav class="nav-menu">
                <a href="${basePath}">${lang.navHome}</a>
                <a href="${basePath}products.html">${lang.navProducts}</a>
                <a href="${basePath}applications.html">${lang.navApplications}</a>
                <a href="${basePath}colour.html">${lang.navColour}</a>
                <a href="${installationsPath}" class="active">${lang.navInstallations}</a>
                <a href="${basePath}about.html">${lang.navAbout}</a>
                <a href="${basePath}contact.html" class="contact-btn">${lang.navContact}</a>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <!-- Breadcrumb -->
            <div class="breadcrumb">
                <a href="${installationsPath}">${lang.installationsNavText}</a> / ${title}
            </div>

            <!-- Installation Header -->
            <div class="installation-header">
                <h1>${title}</h1>
                <div class="installation-meta">
                    <div class="meta-item">
                        <svg class="meta-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="meta-label">${lang.metaLocation}</span>
                        <span class="meta-value">${location}</span>
                    </div>
                    <div class="meta-item">
                        <svg class="meta-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="meta-label">${lang.metaDate}</span>
                        <span class="meta-value">${formattedDate}</span>
                    </div>
                    <div class="meta-item">
                        <svg class="meta-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="meta-label">${lang.metaApplication}</span>
                        <span class="meta-value">${applicationDisplay}</span>
                    </div>
                </div>
            </div>

            ${galleryHTML ? `
            <div class="image-gallery">
                <h3>${lang.projectImagesHeading}</h3>
                <div class="gallery-grid">
                    ${galleryHTML}
                </div>
            </div>

            <!-- Modal for image viewing -->
            <div id="imageModal" class="modal" onclick="closeModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <span class="close" onclick="closeModal()">&times;</span>
                    ${modalHTML}
                    ${images.length > 1 ? `
                    <button class="nav-btn prev" onclick="changeImage(-1)">&#10094;</button>
                    <button class="nav-btn next" onclick="changeImage(1)">&#10095;</button>
                    ` : ''}
                </div>
            </div>` : ''}

            <!-- Installation Content -->
            <div class="installation-content">
                <h2>${lang.projectOverviewHeading}</h2>
                ${processedDescription}
            </div>

            <!-- Call to Action -->
            <div class="cta-section">
                <h3>${lang.readyToTransformHeading}</h3>
                <p>${lang.readyToTransformText}</p>
                <a href="${basePath}contact.html" class="cta-button">${lang.getStartedButton}</a>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-logo">
                <img src="https://otidaseqlgubqzsqazqt.supabase.co/storage/v1/object/public/installation-images/branding/rosehill_tpv_logo.png" alt="Rosehill TPV">
            </div>
            <p class="footer-text">${lang.footerText}</p>
            <nav class="footer-nav">
                <a href="${basePath}">${lang.navHome}</a>
                <a href="${basePath}products.html">${lang.navProducts}</a>
                <a href="${basePath}applications.html">${lang.navApplications}</a>
                <a href="${basePath}colour.html">${lang.navColour}</a>
                <a href="${installationsPath}">${lang.navInstallations}</a>
                <a href="${basePath}about.html">${lang.navAbout}</a>
                <a href="${basePath}contact.html">${lang.navContact}</a>
            </nav>
            <div class="footer-bottom">
                <p>&copy; 2025 Rosehill TPV<sup>®</sup>. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        let currentImageIndex = 0;
        const totalImages = ${validImageCount};

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

        // Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            } else if (event.key === 'ArrowLeft') {
                changeImage(-1);
            } else if (event.key === 'ArrowRight') {
                changeImage(1);
            }
        });

        // Language switching functionality
        function switchLanguage(targetLang) {
            const currentPath = window.location.pathname;
            const currentLang = currentPath.split('/')[1];
            
            if (currentLang === targetLang) return;
            
            let newPath;
            if (currentLang && ['en', 'fr', 'de', 'es'].includes(currentLang)) {
                newPath = currentPath.replace('/' + currentLang + '/', '/' + targetLang + '/');
            } else {
                newPath = '/' + targetLang + '/';
            }
            
            window.location.href = newPath;
        }
    </script>

    <!-- Language Switcher -->
    <div id="language-switcher" style="position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);padding:8px 12px;border-radius:25px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:9999;border:1px solid rgba(255,107,53,0.1);backdrop-filter:blur(10px);font-family:'Source Sans Pro', sans-serif;font-size:14px;font-weight:500;">
        <a href="javascript:void(0)" onclick="switchLanguage('en')" id="lang-en" style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;${language === 'en' ? 'background:#ff6b35;color:white;box-shadow:0 2px 8px rgba(255,107,53,0.3);' : ''}">EN</a>
        <a href="javascript:void(0)" onclick="switchLanguage('fr')" id="lang-fr" style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;${language === 'fr' ? 'background:#ff6b35;color:white;box-shadow:0 2px 8px rgba(255,107,53,0.3);' : ''}">FR</a>
        <a href="javascript:void(0)" onclick="switchLanguage('de')" id="lang-de" style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;${language === 'de' ? 'background:#ff6b35;color:white;box-shadow:0 2px 8px rgba(255,107,53,0.3);' : ''}">DE</a>
        <a href="javascript:void(0)" onclick="switchLanguage('es')" id="lang-es" style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;${language === 'es' ? 'background:#ff6b35;color:white;box-shadow:0 2px 8px rgba(255,107,53,0.3);' : ''}">ES</a>
    </div>
    
    <script>
        // Set active language on page load
        document.addEventListener('DOMContentLoaded', function() {
            const currentLang = '${language}';
            const activeElement = document.getElementById('lang-' + currentLang);
            if (activeElement && !activeElement.style.background) {
                activeElement.style.background = '#ff6b35';
                activeElement.style.color = 'white';
                activeElement.style.boxShadow = '0 2px 8px rgba(255,107,53,0.3)';
            }
        });
    </script>
</body>
</html>`;

    // Write the HTML file
    const fileName = `${slug}.html`;
    const filePath = path.join(outputDir, fileName);
    
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`✓ Generated: ${fileName} (${language})`);
}

/**
 * Generate installation pages for all languages
 */
async function generateMultilingualInstallationPages() {
    try {
        console.log('🌍 Fetching installations from Supabase for multilingual generation...');
        
        // Load customer URLs for linking
        const customerUrls = loadCustomerUrls();
        console.log(`Loaded ${Object.keys(customerUrls).length} customer URL mappings`);
        
        // Get all installations from Supabase with language-specific columns
        const { data: installations, error } = await supabase
            .from('installations')
            .select(`
                *,
                title_en, title_fr, title_de, title_es,
                location_en, location_fr, location_de, location_es,
                description_en, description_fr, description_de, description_es,
                application_en, application_fr, application_de, application_es,
                translation_status
            `)
            .order('installation_date', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch installations: ${error.message}`);
        }

        console.log(`Found ${installations.length} installations in database`);

        // Generate pages for each language
        for (const language of SUPPORTED_LANGUAGES) {
            console.log(`\n🔨 Generating ${language.toUpperCase()} installation pages...`);
            
            // Create language-specific installations directory
            const languageInstallationsDir = path.join(__dirname, 'dist', language, 'installations');
            if (!fs.existsSync(languageInstallationsDir)) {
                fs.mkdirSync(languageInstallationsDir, { recursive: true });
            }

            // Generate a page for each installation in this language
            for (const installation of installations) {
                await generateInstallationPage(installation, languageInstallationsDir, customerUrls, language);
            }

            console.log(`✅ Generated ${installations.length} ${language.toUpperCase()} installation pages`);
        }

        console.log(`\n🎉 Successfully generated ${installations.length * SUPPORTED_LANGUAGES.length} total installation pages`);
        console.log(`📁 Languages: ${SUPPORTED_LANGUAGES.join(', ')}`);

    } catch (error) {
        console.error('❌ Error generating multilingual installation pages:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    generateMultilingualInstallationPages();
}

module.exports = { generateMultilingualInstallationPages, generateInstallationPage, getLocalizedContent };