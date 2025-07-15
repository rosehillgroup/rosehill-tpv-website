#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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
 * Update image references in HTML content for installation pages
 */
function updateInstallationImages(htmlContent, filePath) {
    let updatedContent = htmlContent;
    let imageCount = 0;
    
    // Pattern to match img tags with src="../images/installations/..."
    const imgPattern = /<img([^>]*?)src=["']\.\.\/images\/installations\/([^"']+\.(jpg|jpeg|png))["']([^>]*?)>/gi;
    
    updatedContent = updatedContent.replace(imgPattern, (match, beforeSrc, imageName, ext, afterSrc) => {
        // Check if modern formats exist in the actual images/installations/ directory
        const baseName = imageName.replace(/\.(jpg|jpeg|png)$/i, '');
        const formats = checkModernFormats(`images/installations/${baseName}.jpg`);
        
        if (formats.avif || formats.webp) {
            // Create picture element with AVIF, WebP, and JPEG fallbacks
            const altMatch = match.match(/alt=["']([^"']*?)["']/);
            const altText = altMatch ? altMatch[1] : '';
            
            const onclickMatch = match.match(/onclick=["']([^"']*?)["']/);
            const onclickAttr = onclickMatch ? ` onclick="${onclickMatch[1]}"` : '';
            
            const classMatch = match.match(/class=["']([^"']*?)["']/);
            const classAttr = classMatch ? ` class="${classMatch[1]}"` : '';
            
            const styleMatch = match.match(/style=["']([^"']*?)["']/);
            const styleAttr = styleMatch ? ` style="${styleMatch[1]}"` : '';
            
            const loadingMatch = match.match(/loading=["']([^"']*?)["']/);
            const loadingAttr = loadingMatch ? ` loading="${loadingMatch[1]}"` : ' loading="lazy"';
            
            const avifSrc = `../images/installations/${baseName}.avif`;
            const webpSrc = `../images/installations/${baseName}.webp`;
            const originalSrc = `../images/installations/${imageName}`;
            
            let sources = '';
            if (formats.avif) {
                sources += `<source srcset="${avifSrc}" type="image/avif">\n                `;
            }
            if (formats.webp) {
                sources += `<source srcset="${webpSrc}" type="image/webp">\n                `;
            }
            
            const newElement = `<picture>
                ${sources}<img${beforeSrc}src="${originalSrc}"${afterSrc}${loadingAttr}${onclickAttr}>
            </picture>`;
            
            imageCount++;
            const formatList = [formats.avif && 'AVIF', formats.webp && 'WebP', 'JPEG'].filter(Boolean).join(' → ');
            console.log(`  ✓ Updated: ${imageName} → ${formatList}`);
            return newElement;
        } else {
            // Just add lazy loading if not present and no modern formats available
            if (!match.includes('loading=')) {
                const newMatch = match.replace('<img', '<img loading="lazy"');
                console.log(`  ⚠ Added lazy loading: ${imageName}`);
                return newMatch;
            }
        }
        
        return match;
    });
    
    return { content: updatedContent, imageCount };
}

/**
 * Process a single installation HTML file
 */
function processInstallationFile(filePath) {
    try {
        console.log(`\\nProcessing: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
            console.log(`  ⚠ File not found: ${filePath}`);
            return;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const { content: updatedContent, imageCount } = updateInstallationImages(content, filePath);
        
        if (imageCount > 0) {
            // Create backup if it doesn't exist
            const backupPath = filePath + '.backup';
            if (!fs.existsSync(backupPath)) {
                fs.writeFileSync(backupPath, content);
                console.log(`  📁 Created backup: ${path.basename(backupPath)}`);
            }
            
            // Write updated content
            fs.writeFileSync(filePath, updatedContent);
            console.log(`  ✅ Updated ${imageCount} images in ${path.basename(filePath)}`);
        } else {
            console.log(`  ℹ No images to update in ${path.basename(filePath)}`);
        }
        
        stats.filesProcessed++;
        stats.imagesUpdated += imageCount;
        
    } catch (error) {
        console.error(`  ✗ Error processing ${filePath}:`, error.message);
        stats.errors++;
    }
}

/**
 * Main function
 */
function main() {
    console.log('🔧 Fix Installation Images for WebP');
    console.log('===================================');
    console.log('Converting installation page img tags to picture elements with WebP + fallback\\n');
    
    const startTime = Date.now();
    const installationDir = './installations/';
    
    if (!fs.existsSync(installationDir)) {
        console.log(`Installation directory not found: ${installationDir}`);
        return;
    }
    
    // Get all HTML files in installations directory
    const files = fs.readdirSync(installationDir);
    const htmlFiles = files.filter(file => file.endsWith('.html') && !file.includes('.backup'));
    
    console.log(`Found ${htmlFiles.length} installation HTML files to process\\n`);
    
    // Process each file
    for (const file of htmlFiles) {
        const filePath = path.join(installationDir, file);
        processInstallationFile(filePath);
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Print statistics
    console.log('\\n📊 Installation Image Fix Summary');
    console.log('==================================');
    console.log(`Files processed: ${stats.filesProcessed}`);
    console.log(`Images updated: ${stats.imagesUpdated}`);
    console.log(`Errors: ${stats.errors}`);
    console.log(`Duration: ${duration}s`);
    
    if (stats.imagesUpdated > 0) {
        console.log('\\n✅ Installation images updated successfully!');
        console.log('💡 Note: Backup files (.backup) created for modified files.');
    } else {
        console.log('\\nℹ No installation images needed updating.');
    }
}

// Run the script
if (require.main === module) {
    main();
}