#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const HTML_FILES = [
    'index.html',
    'about.html',
    'applications.html',
    'colour.html',
    'contact.html',
    'installations.html',
    'mixer.html',
    'products.html'
];

const INSTALLATION_DIR = './installations/';

// Statistics
let stats = {
    filesProcessed: 0,
    imagesUpdated: 0,
    errors: 0
};

/**
 * Check if modern image formats exist (AVIF and WebP)
 */
function checkModernFormats(imagePath) {
    const ext = path.extname(imagePath);
    const nameWithoutExt = imagePath.replace(ext, '');
    const avifPath = nameWithoutExt + '.avif';
    const webpPath = nameWithoutExt + '.webp';
    
    return {
        avif: fs.existsSync(avifPath),
        webp: fs.existsSync(webpPath)
    };
}

/**
 * Update image references in HTML content
 */
function updateImageReferences(htmlContent, filePath) {
    let updatedContent = htmlContent;
    let imageCount = 0;
    
    // Pattern to match img tags with src attributes
    const imgPattern = /<img([^>]*?)src=["']([^"']+\.(jpg|jpeg|png))["']([^>]*?)>/gi;
    
    updatedContent = updatedContent.replace(imgPattern, (match, beforeSrc, imageSrc, ext, afterSrc) => {
        // Generate modern format paths
        const baseName = imageSrc.replace(/\.(jpg|jpeg|png)$/i, '');
        const avifSrc = baseName + '.avif';
        const webpSrc = baseName + '.webp';
        
        // Handle relative paths for format check
        let checkPath = imageSrc;
        if (!imageSrc.startsWith('/') && !imageSrc.startsWith('http')) {
            // For installation pages, images are in ../images/installations/
            if (filePath.includes('installations/')) {
                checkPath = path.join('../', imageSrc);
            } else {
                checkPath = imageSrc;
            }
        }
        
        const formats = checkModernFormats(checkPath);
        
        if (formats.avif || formats.webp) {
            // Create picture element with AVIF, WebP, and JPEG fallbacks
            const altMatch = match.match(/alt=["']([^"']*?)["']/);
            const altText = altMatch ? altMatch[1] : '';
            
            const classMatch = match.match(/class=["']([^"']*?)["']/);
            const classAttr = classMatch ? ` class="${classMatch[1]}"` : '';
            
            const styleMatch = match.match(/style=["']([^"']*?)["']/);
            const styleAttr = styleMatch ? ` style="${styleMatch[1]}"` : '';
            
            const loadingMatch = match.match(/loading=["']([^"']*?)["']/);
            const loadingAttr = loadingMatch ? ` loading="${loadingMatch[1]}"` : ' loading="lazy"';
            
            let sources = '';
            if (formats.avif) {
                sources += `<source srcset="${avifSrc}" type="image/avif">\n                `;
            }
            if (formats.webp) {
                sources += `<source srcset="${webpSrc}" type="image/webp">\n                `;
            }
            
            const newElement = `<picture>
                ${sources}<img${beforeSrc}src="${imageSrc}"${afterSrc}${loadingAttr}>
            </picture>`;
            
            imageCount++;
            const formatList = [formats.avif && 'AVIF', formats.webp && 'WebP', 'JPEG'].filter(Boolean).join(' → ');
            console.log(`  ✓ Updated: ${imageSrc} → ${formatList}`);
            return newElement;
        } else {
            // Just add lazy loading if not present
            if (!match.includes('loading=')) {
                const newMatch = match.replace('<img', '<img loading="lazy"');
                console.log(`  ⚠ Added lazy loading: ${imageSrc}`);
                return newMatch;
            }
        }
        
        return match;
    });
    
    return { content: updatedContent, imageCount };
}

/**
 * Process a single HTML file
 */
function processHtmlFile(filePath) {
    try {
        console.log(`\\nProcessing: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
            console.log(`  ⚠ File not found: ${filePath}`);
            return;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const { content: updatedContent, imageCount } = updateImageReferences(content, filePath);
        
        if (imageCount > 0) {
            // Create backup
            const backupPath = filePath + '.backup';
            if (!fs.existsSync(backupPath)) {
                fs.writeFileSync(backupPath, content);
                console.log(`  📁 Created backup: ${backupPath}`);
            }
            
            // Write updated content
            fs.writeFileSync(filePath, updatedContent);
            console.log(`  ✅ Updated ${imageCount} images in ${filePath}`);
        } else {
            console.log(`  ℹ No images to update in ${filePath}`);
        }
        
        stats.filesProcessed++;
        stats.imagesUpdated += imageCount;
        
    } catch (error) {
        console.error(`  ✗ Error processing ${filePath}:`, error.message);
        stats.errors++;
    }
}

/**
 * Process all installation HTML files
 */
function processInstallationFiles() {
    console.log(`\\n📁 Processing installation files...`);
    
    if (!fs.existsSync(INSTALLATION_DIR)) {
        console.log(`Installation directory not found: ${INSTALLATION_DIR}`);
        return;
    }
    
    const files = fs.readdirSync(INSTALLATION_DIR);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    for (const file of htmlFiles) {
        const filePath = path.join(INSTALLATION_DIR, file);
        processHtmlFile(filePath);
    }
}

/**
 * Main function
 */
function main() {
    console.log('🖼️  Rosehill TPV HTML Image Updater');
    console.log('===================================');
    console.log('Converting img tags to picture elements with WebP + fallback\\n');
    
    const startTime = Date.now();
    
    // Process main HTML files
    console.log('📄 Processing main HTML files...');
    for (const file of HTML_FILES) {
        processHtmlFile(file);
    }
    
    // Process installation files
    processInstallationFiles();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Print statistics
    console.log('\\n📊 Update Summary');
    console.log('==================');
    console.log(`Files processed: ${stats.filesProcessed}`);
    console.log(`Images updated: ${stats.imagesUpdated}`);
    console.log(`Errors: ${stats.errors}`);
    console.log(`Duration: ${duration}s`);
    
    console.log('\\n✅ HTML image update complete!');
    console.log('\\n💡 Note: Backup files (.backup) have been created for modified files.');
}

// Run the script
if (require.main === module) {
    main();
}