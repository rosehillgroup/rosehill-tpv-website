#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Supabase Image Optimization for Installation Images
 * 
 * This script updates installation HTML files to use Supabase's image transformation
 * capabilities for automatic WebP conversion and optimization.
 */

/**
 * Transform Supabase URL to use image transformations
 * @param {string} originalUrl - Original Supabase storage URL
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed URL
 */
function transformSupabaseUrl(originalUrl, options = {}) {
    if (!originalUrl.includes('supabase.co/storage')) {
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
 * Create picture element with Supabase transformations
 * @param {string} supabaseUrl - Original Supabase URL
 * @param {string} altText - Alt text for image
 * @param {Object} options - Size options
 * @returns {string} - Picture element HTML
 */
function createSupabasePicture(supabaseUrl, altText, options = {}) {
    const webpUrl = transformSupabaseUrl(supabaseUrl, { ...options, format: 'webp' });
    const optimizedJpeg = transformSupabaseUrl(supabaseUrl, options);
    
    return `<picture>
                        <source srcset="${webpUrl}" type="image/webp">
                        <img src="${optimizedJpeg}" alt="${altText}" loading="lazy">
                    </picture>`;
}

/**
 * Process installation HTML file to add Supabase image transformations
 * @param {string} filePath - Path to HTML file
 */
function processInstallationFile(filePath) {
    console.log(`Processing: ${filePath}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let changesCount = 0;
    
    // Pattern to match Supabase image URLs
    const supabaseImagePattern = /<img\s+src="(https:\/\/[^"]*supabase\.co\/storage\/v1\/object\/public\/[^"]*\.(jpg|jpeg|png))"\s+alt="([^"]*)"[^>]*>/g;
    
    updatedContent = updatedContent.replace(supabaseImagePattern, (match, imageUrl, extension, altText) => {
        // Determine if this is a gallery image (larger) or thumbnail
        const isGalleryImage = match.includes('onclick="openModal');
        const isLargeImage = match.includes('installation-hero') || match.includes('gallery-image');
        
        let sizeOptions = {};
        
        if (isLargeImage) {
            // Large hero/gallery images
            sizeOptions = { width: 1200, height: 800 };
        } else if (isGalleryImage) {
            // Gallery thumbnails
            sizeOptions = { width: 400, height: 300 };
        } else {
            // Standard images
            sizeOptions = { width: 600, height: 400 };
        }
        
        const pictureElement = createSupabasePicture(imageUrl, altText, sizeOptions);
        
        // Preserve any onclick attributes for gallery functionality
        if (match.includes('onclick=')) {
            const onclickMatch = match.match(/onclick="([^"]*)"/);
            if (onclickMatch) {
                const onclick = onclickMatch[1];
                const modifiedPicture = pictureElement.replace(
                    '<img src=',
                    `<img onclick="${onclick}" src=`
                );
                changesCount++;
                console.log(`  Optimized: ${imageUrl}`);
                return modifiedPicture;
            }
        }
        
        changesCount++;
        console.log(`  Optimized: ${imageUrl}`);
        return pictureElement;
    });
    
    if (changesCount > 0) {
        // Create backup
        const backupPath = filePath + '.backup';
        if (!fs.existsSync(backupPath)) {
            fs.writeFileSync(backupPath, content);
        }
        
        // Write updated content
        fs.writeFileSync(filePath, updatedContent);
        console.log(`  ✅ Optimized ${changesCount} Supabase images`);
        return true;
    } else {
        console.log(`  ✓ No Supabase images found to optimize`);
        return false;
    }
}

/**
 * Main function to process all installation files
 */
function main() {
    console.log('🚀 Supabase Image Optimization');
    console.log('===============================');
    
    const installationsDir = './installations';
    
    if (!fs.existsSync(installationsDir)) {
        console.log('❌ Installations directory not found');
        return;
    }
    
    const files = fs.readdirSync(installationsDir)
        .filter(file => file.endsWith('.html'))
        .map(file => path.join(installationsDir, file));
    
    if (files.length === 0) {
        console.log('❌ No installation HTML files found');
        return;
    }
    
    let totalOptimized = 0;
    let filesProcessed = 0;
    
    files.forEach(filePath => {
        if (processInstallationFile(filePath)) {
            totalOptimized++;
        }
        filesProcessed++;
    });
    
    console.log('\n📊 Summary:');
    console.log(`Files processed: ${filesProcessed}`);
    console.log(`Files optimized: ${totalOptimized}`);
    console.log('\n✨ Benefits of Supabase Image Transformations:');
    console.log('• Automatic WebP conversion for supported browsers');
    console.log('• Optimal image sizing and compression');
    console.log('• Faster loading times');
    console.log('• Reduced bandwidth usage');
    console.log('• CDN-delivered optimized images');
    
    console.log('\nNext steps:');
    console.log('1. Test installation pages to verify WebP loading');
    console.log('2. Check browser dev tools Network tab for format confirmation');
    console.log('3. Monitor Supabase usage for image transformation costs');
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { transformSupabaseUrl, createSupabasePicture, processInstallationFile };