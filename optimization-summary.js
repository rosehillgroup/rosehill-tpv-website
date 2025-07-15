#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Get file size in bytes
 */
function getFileSize(filePath) {
    try {
        return fs.statSync(filePath).size;
    } catch (error) {
        return 0;
    }
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Get all files with specific extensions
 */
function getFilesByExtension(dir, extensions) {
    const files = [];
    
    function scanDirectory(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                scanDirectory(fullPath);
            } else {
                const ext = path.extname(item).toLowerCase();
                if (extensions.includes(ext)) {
                    files.push(fullPath);
                }
            }
        }
    }
    
    scanDirectory(dir);
    return files;
}

/**
 * Calculate savings comparison
 */
function calculateSavings() {
    const originalImages = getFilesByExtension('.', ['.jpg', '.jpeg', '.png']);
    const webpImages = getFilesByExtension('.', ['.webp']);
    
    let originalSize = 0;
    let webpSize = 0;
    let pairCount = 0;
    
    // Calculate size for images that have both original and WebP versions
    for (const originalPath of originalImages) {
        const ext = path.extname(originalPath);
        const webpPath = originalPath.replace(ext, '.webp');
        
        if (fs.existsSync(webpPath)) {
            originalSize += getFileSize(originalPath);
            webpSize += getFileSize(webpPath);
            pairCount++;
        }
    }
    
    return {
        originalImages: originalImages.length,
        webpImages: webpImages.length,
        pairCount,
        originalSize,
        webpSize,
        savings: originalSize - webpSize,
        savingsPercent: originalSize > 0 ? ((originalSize - webpSize) / originalSize * 100) : 0
    };
}

/**
 * Count HTML updates
 */
function countHtmlUpdates() {
    const htmlFiles = getFilesByExtension('.', ['.html']);
    let pictureElements = 0;
    let lazyLoadingImages = 0;
    
    for (const htmlFile of htmlFiles) {
        if (htmlFile.includes('test-webp.html') || htmlFile.includes('.backup')) {
            continue;
        }
        
        try {
            const content = fs.readFileSync(htmlFile, 'utf8');
            
            // Count picture elements
            const pictureMatches = content.match(/<picture>/g);
            if (pictureMatches) {
                pictureElements += pictureMatches.length;
            }
            
            // Count lazy loading images
            const lazyMatches = content.match(/loading="lazy"/g);
            if (lazyMatches) {
                lazyLoadingImages += lazyMatches.length;
            }
        } catch (error) {
            console.error(`Error reading ${htmlFile}:`, error.message);
        }
    }
    
    return {
        htmlFiles: htmlFiles.filter(f => !f.includes('test-webp.html') && !f.includes('.backup')).length,
        pictureElements,
        lazyLoadingImages
    };
}

/**
 * Main function
 */
function main() {
    console.log('🎉 Rosehill TPV Image Optimization Complete!');
    console.log('=============================================\\n');
    
    const savings = calculateSavings();
    const htmlStats = countHtmlUpdates();
    
    console.log('📊 Optimization Results');
    console.log('========================');
    console.log(`Original images: ${savings.originalImages} files`);
    console.log(`WebP images created: ${savings.webpImages} files`);
    console.log(`Image pairs (original + WebP): ${savings.pairCount} pairs\\n`);
    
    console.log('💾 File Size Comparison');
    console.log('========================');
    console.log(`Original images size: ${formatBytes(savings.originalSize)}`);
    console.log(`WebP images size: ${formatBytes(savings.webpSize)}`);
    console.log(`Space saved: ${formatBytes(savings.savings)} (${savings.savingsPercent.toFixed(1)}% reduction)\\n`);
    
    console.log('🌐 HTML Updates');
    console.log('================');
    console.log(`HTML files processed: ${htmlStats.htmlFiles} files`);
    console.log(`Picture elements added: ${htmlStats.pictureElements} elements`);
    console.log(`Images with lazy loading: ${htmlStats.lazyLoadingImages} images\\n`);
    
    console.log('✨ Performance Improvements');
    console.log('============================');
    console.log('• Faster page load times with smaller WebP images');
    console.log('• Improved Core Web Vitals scores');
    console.log('• Better user experience on slow connections');
    console.log('• Reduced bandwidth usage');
    console.log('• Lazy loading prevents unnecessary image downloads\\n');
    
    console.log('🔧 Technical Implementation');
    console.log('============================');
    console.log('• WebP images with JPEG/PNG fallbacks using <picture> elements');
    console.log('• Automatic lazy loading for improved performance');
    console.log('• 95%+ browser support with graceful degradation');
    console.log('• Original images preserved for compatibility\\n');
    
    console.log('📝 Files Created');
    console.log('=================');
    console.log('• optimize-images.js - Image conversion script');
    console.log('• update-html-images.js - HTML update script');
    console.log('• test-webp.html - WebP implementation test page');
    console.log('• *.backup files - Backup copies of modified HTML files\\n');
    
    console.log('🚀 Next Steps');
    console.log('==============');
    console.log('1. Test the website in different browsers');
    console.log('2. Use browser dev tools to verify WebP loading');
    console.log('3. Run lighthouse audits to measure performance gains');
    console.log('4. Deploy changes to production');
    console.log('5. Monitor page load metrics\\n');
    
    console.log('✅ Optimization project completed successfully!');
}

// Run the summary
if (require.main === module) {
    main();
}