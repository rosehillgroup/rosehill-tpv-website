// Generate complete static HTML pages for translated installations
// This creates complete pages with embedded content, like the English generator

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://otidaseqlgubqzsqazqt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Languages and their labels
const LANGUAGES = {
    'fr': { name: 'French', labels: {
        home: 'Accueil',
        products: 'Produits', 
        applications: 'Applications',
        colour: 'Couleur',
        installations: 'Installations',
        about: 'À propos',
        contact: 'Contact',
        projectOverview: 'Aperçu du Projet',
        projectImages: 'Images du Projet',
        location: 'Lieu:',
        date: 'Date:',
        application: 'Application:',
        readyToTransform: 'Prêt à Transformer Votre Espace?',
        contactToday: 'Contactez-nous aujourd\'hui pour discuter de la façon dont Rosehill TPV peut créer des surfaces sûres et dynamiques pour votre projet.',
        getStarted: 'Commencer',
        companyInfo: 'Informations sur l\'Entreprise',
        companyDescription: 'Solutions de revêtement TPV professionnelles pour terrains de jeux, terrains de sport et espaces récréatifs.',
        quickLinks: 'Liens Rapides',
        contactInfo: 'Informations de Contact',
        allRightsReserved: 'Tous droits réservés.'
    }},
    'de': { name: 'German', labels: {
        home: 'Startseite',
        products: 'Produkte',
        applications: 'Anwendungen', 
        colour: 'Farbe',
        installations: 'Installationen',
        about: 'Über uns',
        contact: 'Kontakt',
        projectOverview: 'Projektübersicht',
        projectImages: 'Projektbilder',
        location: 'Standort:',
        date: 'Datum:',
        application: 'Anwendung:',
        readyToTransform: 'Bereit, Ihren Raum zu Verwandeln?',
        contactToday: 'Kontaktieren Sie uns heute, um zu besprechen, wie Rosehill TPV sichere, lebendige Oberflächen für Ihr Projekt schaffen kann.',
        getStarted: 'Loslegen',
        companyInfo: 'Firmeninformationen',
        companyDescription: 'Professionelle TPV-Oberflächenlösungen für Spielplätze, Sportplätze und Freizeitbereiche.',
        quickLinks: 'Schnelle Links',
        contactInfo: 'Kontaktinformationen',
        allRightsReserved: 'Alle Rechte vorbehalten.'
    }},
    'es': { name: 'Spanish', labels: {
        home: 'Inicio',
        products: 'Productos',
        applications: 'Aplicaciones',
        colour: 'Color', 
        installations: 'Instalaciones',
        about: 'Acerca de',
        contact: 'Contacto',
        projectOverview: 'Resumen del Proyecto',
        projectImages: 'Imágenes del Proyecto',
        location: 'Ubicación:',
        date: 'Fecha:',
        application: 'Aplicación:',
        readyToTransform: '¿Listo para Transformar su Espacio?',
        contactToday: 'Contáctenos hoy para hablar sobre cómo Rosehill TPV puede crear superficies seguras y vibrantes para su proyecto.',
        getStarted: 'Comenzar',
        companyInfo: 'Información de la Empresa',
        companyDescription: 'Soluciones profesionales de superficies TPV para parques infantiles, canchas deportivas y áreas recreativas.',
        quickLinks: 'Enlaces Rápidos',
        contactInfo: 'Información de Contacto',
        allRightsReserved: 'Todos los derechos reservados.'
    }}
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
    const transformUrl = `${originalUrl}?${transformQuery}`;
    
    return transformUrl;
}

/**
 * Create optimized picture element with Supabase transformations
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

async function generateTranslatedPages() {
    console.log('🌍 Generating complete translated installation pages...\n');
    
    try {
        // Get all translations with their corresponding installation data
        const { data: translations, error } = await supabase
            .from('installation_i18n')
            .select(`
                *,
                installations!inner(*)
            `)
            .order('lang', { ascending: true });
        
        if (error) {
            console.error('Error fetching translations:', error.message);
            return;
        }
        
        if (!translations || translations.length === 0) {
            console.log('No translations found in database');
            return;
        }
        
        console.log(`Found ${translations.length} translations\n`);
        
        // First create the slug mapping
        console.log('📋 Creating slug mapping file...');
        const slugMapping = await createSlugMappingFile(translations);
        
        // Process each translation
        for (const translation of translations) {
            const lang = translation.lang;
            const installation = translation.installations;
            
            if (!LANGUAGES[lang]) {
                console.log(`Skipping unsupported language: ${lang}`);
                continue;
            }
            
            console.log(`📝 Processing ${translation.title} (${lang.toUpperCase()})`);
            
            await generateTranslatedInstallationPage(translation, installation, lang, slugMapping);
        }
        
        console.log('\n✨ Done! Generated complete pages for all translated installations.');
        
    } catch (error) {
        console.error('Error generating pages:', error);
        process.exit(1);
    }
}

// Helper function to get language-specific slug
function getLangSlug(targetLang, installationId, slugMapping) {
    // Find the installation in the slug mapping
    for (const [englishSlug, data] of Object.entries(slugMapping)) {
        if (data.id === installationId) {
            return data[targetLang] || englishSlug;
        }
    }
    return '';
}

async function generateTranslatedInstallationPage(translation, installation, lang, slugMapping) {
    const labels = LANGUAGES[lang].labels;
    
    // Create language directory structure
    const langDir = path.join('.', lang);
    if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
    }
    
    const installDir = path.join(langDir, 'installations');
    if (!fs.existsSync(installDir)) {
        fs.mkdirSync(installDir, { recursive: true });
    }
    
    // Format date
    const date = new Date(installation.installation_date);
    const formattedDate = date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Generate image gallery HTML
    let imageGalleryHTML = '';
    if (installation.images && installation.images.length > 0) {
        const imageItems = installation.images.map((img, index) => {
            let imageUrl;
            
            if (typeof img === 'string') {
                imageUrl = `../../images/installations/${img}`;
            } else if (img && typeof img === 'object') {
                if (img.url) {
                    imageUrl = img.url;
                } else if (img.filename) {
                    imageUrl = `../../images/installations/${img.filename}`;
                }
            } else {
                imageUrl = `../../images/installations/${img}`;
            }
            
            const galleryImageOptions = { width: 400, height: 300 };
            const pictureElement = createOptimizedPictureElement(
                imageUrl, 
                `${translation.title} - Image ${index + 1}`, 
                galleryImageOptions, 
                `openModal(${index})`
            );
            
            return `
                <div class="gallery-item">
                    ${pictureElement}
                </div>`;
        }).join('');

        const modalImages = installation.images.map((img, index) => {
            let imageUrl;
            
            if (typeof img === 'string') {
                imageUrl = `../../images/installations/${img}`;
            } else if (img && typeof img === 'object') {
                if (img.url) {
                    imageUrl = img.url;
                } else if (img.filename) {
                    imageUrl = `../../images/installations/${img.filename}`;
                }
            } else {
                imageUrl = `../../images/installations/${img}`;
            }
            
            const modalImageOptions = { width: 1200, height: 800 };
            const pictureElement = createOptimizedPictureElement(
                imageUrl, 
                `${translation.title} - Image ${index + 1}`, 
                modalImageOptions
            );
            
            return `
                <div class="modal-image" id="modal-img-${index}" ${index === 0 ? 'style="display: block;"' : ''}>
                    ${pictureElement}
                </div>`;
        }).join('');

        imageGalleryHTML = `
            <div class="image-gallery">
                <h3>${labels.projectImages}</h3>
                <div class="gallery-grid">
                    ${imageItems}
                </div>
            </div>

            <!-- Modal for image viewing -->
            <div id="imageModal" class="modal" onclick="closeModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <span class="close" onclick="closeModal()">&times;</span>
                    ${modalImages}
                    ${installation.images.length > 1 ? `
                    <button class="nav-btn prev" onclick="changeImage(-1)">&#10094;</button>
                    <button class="nav-btn next" onclick="changeImage(1)">&#10095;</button>
                    ` : ''}
                </div>
            </div>`;
    }

    // Generate description HTML using 'overview' field
    const descriptionHTML = translation.overview 
        ? (Array.isArray(translation.overview) 
            ? translation.overview.map(paragraph => `<p>${paragraph}</p>`).join('\n                ')
            : `<p>${translation.overview}</p>`)
        : `<p>Project details coming soon...</p>`;

    // Application type mapping
    const applicationTypes = {
        'playground': lang === 'fr' ? 'Surfaces de Jeu' : lang === 'de' ? 'Spielplatzoberflächen' : 'Superficies de Juego',
        'muga': lang === 'fr' ? 'Aires Multi-Usages' : lang === 'de' ? 'Mehrzweck-Spielbereiche' : 'Áreas Multiusos',
        'track': lang === 'fr' ? 'Pistes de Course' : lang === 'de' ? 'Laufbahnen' : 'Pistas de Atletismo',
        'pitch': lang === 'fr' ? 'Terrains de Sport' : lang === 'de' ? 'Sportplätze' : 'Canchas Deportivas',
        'footpath': lang === 'fr' ? 'Sentiers et Allées' : lang === 'de' ? 'Fußwege' : 'Senderos y Pasarelas',
        'splashpark': lang === 'fr' ? 'Parcs Aquatiques' : lang === 'de' ? 'Wasserspielplätze' : 'Parques Acuáticos',
        'tennis': lang === 'fr' ? 'Courts de Tennis' : lang === 'de' ? 'Tennisplätze' : 'Canchas de Tenis',
        'athletics': lang === 'fr' ? 'Pistes d\'Athlétisme' : lang === 'de' ? 'Leichtathletikbahnen' : 'Pistas de Atletismo',
        'safety': lang === 'fr' ? 'Surfaces de Sécurité' : lang === 'de' ? 'Sicherheitsoberflächen' : 'Superficies de Seguridad',
        'other': lang === 'fr' ? 'Autres Applications' : lang === 'de' ? 'Andere Anwendungen' : 'Otras Aplicaciones'
    };

    const applicationDisplay = applicationTypes[installation.application] || installation.application;

    // Generate complete HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${translation.title} - Rosehill TPV Installation</title>
    <meta name="description" content="${translation.title} in ${translation.location}. See how Rosehill TPV coloured rubber granules were used to create safe, vibrant surfaces for ${applicationDisplay.toLowerCase()}.">
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

        .gallery-item img,
        .gallery-item picture {
            width: 100%;
            height: 250px;
            object-fit: cover;
            display: block;
        }
        
        .gallery-item picture img {
            width: 100%;
            height: 100%;
            object-fit: cover;
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

        .modal-image img,
        .modal-image picture img {
            max-width: 100%;
            max-height: 70vh;
            object-fit: contain;
        }
        
        .modal-image picture {
            display: block;
            max-width: 100%;
            max-height: 70vh;
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
            <a href="../../index.html" class="logo">
                <img src="../../rosehill_tpv_logo.webp" alt="Rosehill TPV">
            </a>
            <nav class="nav-menu">
                <a href="../../${lang}/index.html">${labels.home}</a>
                <a href="../../${lang}/products.html">${labels.products}</a>
                <a href="../../${lang}/applications.html">${labels.applications}</a>
                <a href="../../${lang}/colour.html">${labels.colour}</a>
                <a href="../../${lang}/installations.html" class="active">${labels.installations}</a>
                <a href="../../${lang}/about.html">${labels.about}</a>
                <a href="../../${lang}/contact.html" class="contact-btn">${labels.contact}</a>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <!-- Breadcrumb -->
            <div class="breadcrumb">
                <a href="../../${lang}/index.html">${labels.home}</a> / <a href="../../${lang}/installations.html">${labels.installations}</a> / ${translation.title}
            </div>

            <!-- Installation Header -->
            <div class="installation-header">
                <h1>${translation.title}</h1>
                <div class="installation-meta">
                    <div class="meta-item">
                        <svg class="meta-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="meta-label">${labels.location}</span>
                        <span class="meta-value">${translation.location}</span>
                    </div>
                    <div class="meta-item">
                        <svg class="meta-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="meta-label">${labels.date}</span>
                        <span class="meta-value">${formattedDate}</span>
                    </div>
                    <div class="meta-item">
                        <svg class="meta-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="meta-label">${labels.application}</span>
                        <span class="meta-value">${applicationDisplay}</span>
                    </div>
                </div>
            </div>

            <!-- Installation Content -->
            <div class="installation-content">
                <h2>${labels.projectOverview}</h2>
                ${descriptionHTML}
            </div>

            ${imageGalleryHTML}

            <!-- Call to Action -->
            <div class="cta-section">
                <h3>${labels.readyToTransform}</h3>
                <p>${labels.contactToday}</p>
                <a href="../../${lang}/contact.html" class="cta-button">${labels.getStarted}</a>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-logo">
                <img src="../../rosehill_tpv_logo.webp" alt="Rosehill TPV">
            </div>
            <p class="footer-text">${labels.companyDescription}</p>
            <nav class="footer-nav">
                <a href="../../${lang}/index.html">${labels.home}</a>
                <a href="../../${lang}/products.html">${labels.products}</a>
                <a href="../../${lang}/applications.html">${labels.applications}</a>
                <a href="../../${lang}/colour.html">${labels.colour}</a>
                <a href="../../${lang}/installations.html">${labels.installations}</a>
                <a href="../../${lang}/about.html">${labels.about}</a>
                <a href="../../${lang}/contact.html">${labels.contact}</a>
            </nav>
            <div class="footer-bottom">
                <p>&copy; 2025 Rosehill TPV. ${labels.allRightsReserved}</p>
            </div>
        </div>
    </footer>

    <script>
        let currentImageIndex = 0;
        const totalImages = ${installation.images ? installation.images.length : 0};

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
    </script>

    <!-- Language Switcher (Fixed Bottom-Right) -->
    <div class="language-switcher" id="language-switcher" style="position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);padding:8px 12px;border-radius:25px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:9999;border:1px solid rgba(255,107,53,0.1);backdrop-filter:blur(10px);display:flex;gap:4px;">
        <a href="../../installations/${installation.slug}.html" style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;font-size:14px;font-weight:500;">EN</a>
        <a href="../../es/installations/${getLangSlug('es', installation.id, slugMapping)}.html" ${lang === 'es' ? 'class="current"' : ''} style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:${lang === 'es' ? '#ff6b35' : '#64748b'};border-radius:15px;transition:all 0.2s ease;font-size:14px;font-weight:500;${lang === 'es' ? 'background:rgba(255,107,53,0.1);' : ''}">ES</a>
        <a href="../../fr/installations/${getLangSlug('fr', installation.id, slugMapping)}.html" ${lang === 'fr' ? 'class="current"' : ''} style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:${lang === 'fr' ? '#ff6b35' : '#64748b'};border-radius:15px;transition:all 0.2s ease;font-size:14px;font-weight:500;${lang === 'fr' ? 'background:rgba(255,107,53,0.1);' : ''}">FR</a>
        <a href="../../de/installations/${getLangSlug('de', installation.id, slugMapping)}.html" ${lang === 'de' ? 'class="current"' : ''} style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:${lang === 'de' ? '#ff6b35' : '#64748b'};border-radius:15px;transition:all 0.2s ease;font-size:14px;font-weight:500;${lang === 'de' ? 'background:rgba(255,107,53,0.1);' : ''}">DE</a>
    </div>
</body>
</html>`;

    // Write the HTML file
    const fileName = `${translation.slug}.html`;
    const filePath = path.join(installDir, fileName);
    
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`  ✅ Generated: ${fileName}`);
}

async function createSlugMappingFile(translations) {
    const slugMapping = {};
    
    // Get all installations with their English slugs
    const { data: installations } = await supabase
        .from('installations')
        .select('id, slug');
    
    for (const installation of installations) {
        slugMapping[installation.slug] = {
            id: installation.id,
            en: installation.slug
        };
        
        // Add translated slugs
        const translatedSlugs = translations.filter(t => t.installation_id === installation.id);
        translatedSlugs.forEach(t => {
            slugMapping[installation.slug][t.lang] = t.slug;
        });
    }
    
    // Save mapping file
    fs.writeFileSync(
        './js/installation-slug-mapping.json',
        JSON.stringify(slugMapping, null, 2),
        'utf8'
    );
    console.log('  ✅ Created: ./js/installation-slug-mapping.json');
    
    return slugMapping;
}

// Run the generator
generateTranslatedPages();