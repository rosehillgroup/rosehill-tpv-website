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

/**
 * Transform Supabase URL to use image transformations
 * @param {string} originalUrl - Original Supabase storage URL
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed URL
 */
function transformSupabaseUrl(originalUrl, options = {}) {
    if (!originalUrl || !originalUrl.includes('supabase.co/storage')) {
        return originalUrl;
    }
    
    const transformParams = [];
    
    // Add width and height if specified
    if (options.width) transformParams.push(`width=${options.width}`);
    if (options.height) transformParams.push(`height=${options.height}`);
    
    // Add quality (default 80, optimized 75)
    const quality = options.quality || 75;
    transformParams.push(`quality=${quality}`);
    
    // Add resize mode
    const resize = options.resize || 'cover';
    transformParams.push(`resize=${resize}`);
    
    // Add format for WebP
    if (options.format) {
        transformParams.push(`format=${options.format}`);
    }
    
    // Construct transform URL
    const transformQuery = transformParams.join('&');
    const transformUrl = `${originalUrl}?${transformQuery}`;
    
    return transformUrl;
}

/**
 * Create optimized picture element with Supabase transformations
 * @param {string} supabaseUrl - Original Supabase URL
 * @param {string} altText - Alt text for image
 * @param {Object} options - Size options
 * @param {string} onclickHandler - Optional onclick handler
 * @returns {string} - Picture element HTML
 */
function createOptimizedPictureElement(supabaseUrl, altText, options = {}, onclickHandler = '') {
    if (!supabaseUrl || !supabaseUrl.includes('supabase.co/storage')) {
        // Fallback for non-Supabase URLs
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

// Function to generate individual installation pages from Supabase data
async function generateInstallationPages() {
    try {
        console.log('Fetching installations from Supabase...');
        
        // Get all installations from Supabase
        const { data: installations, error } = await supabase
            .from('installations')
            .select('*')
            .order('installation_date', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch installations: ${error.message}`);
        }

        console.log(`Found ${installations.length} installations in database`);

        // Create installations directory if it doesn't exist
        const installationsDir = path.join(__dirname, 'installations');
        if (!fs.existsSync(installationsDir)) {
            fs.mkdirSync(installationsDir, { recursive: true });
        }

        // Generate a page for each installation
        for (const installation of installations) {
            await generateInstallationPage(installation, installationsDir);
        }

        console.log('✅ All installation pages generated successfully!');

    } catch (error) {
        console.error('❌ Error generating installation pages:', error);
        process.exit(1);
    }
}

// Function to generate a single installation page
async function generateInstallationPage(installation, outputDir) {
    const { title, location, installation_date, application, description, images, slug } = installation;

    console.log(`Generating page for: ${title}`);

    // Format date
    const date = new Date(installation_date);
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Generate breadcrumb
    const breadcrumb = `<a href="../installations.html">Installations</a> / ${title}`;

    // Generate image gallery HTML
    let imageGalleryHTML = '';
    if (images && images.length > 0) {
        const imageItems = images.map((img, index) => {
            // Handle different image data structures
            let imageUrl;
            let filename;
            
            if (typeof img === 'string') {
                // Old format: just a filename string
                imageUrl = `../images/installations/${img}`;
                filename = img;
            } else if (img && typeof img === 'object') {
                // New format: object with url and/or filename
                if (img.url) {
                    // Supabase Storage image - use the full URL
                    imageUrl = img.url;
                    filename = img.filename || 'image';
                } else if (img.filename) {
                    // Local image file - prepend images/installations/ path
                    imageUrl = `../images/installations/${img.filename}`;
                    filename = img.filename;
                }
            } else {
                // Fallback
                imageUrl = `../images/installations/${img}`;
                filename = img;
            }
            
            // Use optimized picture element for gallery thumbnails
            const galleryImageOptions = { width: 400, height: 300 };
            const pictureElement = createOptimizedPictureElement(
                imageUrl, 
                `${title} - Image ${index + 1}`, 
                galleryImageOptions, 
                `openModal(${index})`
            );
            
            return `
                <div class="gallery-item">
                    ${pictureElement}
                </div>`;
        }).join('');

        const modalImages = images.map((img, index) => {
            // Handle different image data structures (same logic as above)
            let imageUrl;
            
            if (typeof img === 'string') {
                imageUrl = `../images/installations/${img}`;
            } else if (img && typeof img === 'object') {
                if (img.url) {
                    imageUrl = img.url;
                } else if (img.filename) {
                    imageUrl = `../images/installations/${img.filename}`;
                }
            } else {
                imageUrl = `../images/installations/${img}`;
            }
            
            // Use optimized picture element for modal images (larger size)
            const modalImageOptions = { width: 1200, height: 800 };
            const pictureElement = createOptimizedPictureElement(
                imageUrl, 
                `${title} - Image ${index + 1}`, 
                modalImageOptions
            );
            
            return `
                <div class="modal-image" id="modal-img-${index}" ${index === 0 ? 'style="display: block;"' : ''}>
                    ${pictureElement}
                </div>`;
        }).join('');

        imageGalleryHTML = `
            <div class="image-gallery">
                <h3>Project Images</h3>
                <div class="gallery-grid">
                    ${imageItems}
                </div>
            </div>

            <!-- Modal for image viewing -->
            <div id="imageModal" class="modal" onclick="closeModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <span class="close" onclick="closeModal()">&times;</span>
                    ${modalImages}
                    ${images.length > 1 ? `
                    <button class="nav-btn prev" onclick="changeImage(-1)">&#10094;</button>
                    <button class="nav-btn next" onclick="changeImage(1)">&#10095;</button>
                    ` : ''}
                </div>
            </div>`;
    }

    // Generate description HTML
    const descriptionHTML = Array.isArray(description) 
        ? description.map(paragraph => `<p>${paragraph}</p>`).join('\n                ')
        : `<p>${description}</p>`;

    // Application type mapping
    const applicationTypes = {
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
    };

    const applicationDisplay = applicationTypes[application] || application;

    // Generate the complete HTML page
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Rosehill TPV Installation</title>
    <meta name="description" content="${title} in ${location}. See how Rosehill TPV coloured rubber granules were used to create safe, vibrant surfaces for ${applicationDisplay.toLowerCase()}.">
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
            <a href="../index.html" class="logo">
                <img src="../rosehill_tpv_logo.png" alt="Rosehill TPV">
            </a>
            <nav class="nav-menu">
                <a href="../index.html">Home</a>
                <a href="../products.html">Products</a>
                <a href="../applications.html">Applications</a>
                <a href="../colour.html">Colour</a>
                <a href="../installations.html" class="active">Installations</a>
                <a href="../about.html">About Us</a>
                <a href="../contact.html" class="contact-btn">Get in Touch</a>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <!-- Breadcrumb -->
            <div class="breadcrumb">
                ${breadcrumb}
            </div>

            <!-- Installation Header -->
            <div class="installation-header">
                <h1>${title}</h1>
                <div class="installation-meta">
                    <div class="meta-item">
                        <svg class="meta-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="meta-label">Location:</span>
                        <span class="meta-value">${location}</span>
                    </div>
                    <div class="meta-item">
                        <svg class="meta-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="meta-label">Date:</span>
                        <span class="meta-value">${formattedDate}</span>
                    </div>
                    <div class="meta-item">
                        <svg class="meta-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="meta-label">Application:</span>
                        <span class="meta-value">${applicationDisplay}</span>
                    </div>
                </div>
            </div>

            ${imageGalleryHTML}

            <!-- Installation Content -->
            <div class="installation-content">
                <h2>Project Overview</h2>
                ${descriptionHTML}
            </div>

            <!-- Call to Action -->
            <div class="cta-section">
                <h3>Ready to Transform Your Space?</h3>
                <p>Contact us today to discuss how Rosehill TPV can create safe, vibrant surfaces for your project.</p>
                <a href="../contact.html" class="cta-button">Get Started</a>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-logo">
                <img src="../rosehill_tpv_logo.png" alt="Rosehill TPV">
            </div>
            <p class="footer-text">Creating safer, more vibrant play and sports surfaces worldwide with our premium coloured rubber granules.</p>
            <nav class="footer-nav">
                <a href="../index.html">Home</a>
                <a href="../products.html">Products</a>
                <a href="../applications.html">Applications</a>
                <a href="../colour.html">Colour</a>
                <a href="../installations.html">Installations</a>
                <a href="../about.html">About Us</a>
                <a href="../contact.html">Get in Touch</a>
            </nav>
            <div class="footer-bottom">
                <p>&copy; 2025 Rosehill TPV. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        let currentImageIndex = 0;
        const totalImages = ${images ? images.length : 0};

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
</body>
</html>`;

    // Write the HTML file
    const fileName = `${slug}.html`;
    const filePath = path.join(outputDir, fileName);
    
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`✓ Generated: ${fileName}`);
}

// Run if called directly
if (require.main === module) {
    generateInstallationPages();
}

module.exports = { generateInstallationPages };