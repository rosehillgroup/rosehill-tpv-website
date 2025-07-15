#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const QUALITY = 85; // WebP quality (1-100)
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];
const DIRECTORIES_TO_PROCESS = [
    './', // Main directory
    './images/installations/', // Installation images
    './Blends/' // Blend images
];

// Statistics
let stats = {
    processed: 0,
    skipped: 0,
    errors: 0,
    originalSize: 0,
    newSize: 0
};

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
 * Convert image to WebP format
 */
async function convertToWebP(inputPath, outputPath) {
    try {
        const originalSize = getFileSize(inputPath);
        
        await sharp(inputPath)
            .webp({ quality: QUALITY })
            .toFile(outputPath);
        
        const newSize = getFileSize(outputPath);
        
        stats.originalSize += originalSize;
        stats.newSize += newSize;
        stats.processed++;
        
        const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${formatBytes(originalSize)} → ${formatBytes(newSize)}, ${savings}% reduction)`);
        
        return true;
    } catch (error) {
        console.error(`✗ Error converting ${inputPath}:`, error.message);
        stats.errors++;
        return false;
    }
}

/**
 * Process all images in a directory
 */
async function processDirectory(dirPath) {
    console.log(`\\nProcessing directory: ${dirPath}`);
    
    if (!fs.existsSync(dirPath)) {
        console.log(`Directory ${dirPath} does not exist, skipping...`);
        return;
    }
    
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Skip subdirectories for now
            continue;
        }
        
        const ext = path.extname(file).toLowerCase();
        
        if (!SUPPORTED_FORMATS.includes(ext)) {
            continue;
        }
        
        const nameWithoutExt = path.basename(file, ext);
        const webpPath = path.join(dirPath, nameWithoutExt + '.webp');
        
        // Skip if WebP version already exists
        if (fs.existsSync(webpPath)) {
            console.log(`⚠ Skipping ${file} (WebP version already exists)`);
            stats.skipped++;
            continue;
        }
        
        await convertToWebP(filePath, webpPath);
        
        // Add a small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

/**
 * Main function
 */
async function main() {
    console.log('🖼️  Rosehill TPV Image Optimization Tool');
    console.log('=====================================');
    console.log(`WebP Quality: ${QUALITY}`);
    console.log(`Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
    console.log('');
    
    const startTime = Date.now();
    
    // Process each directory
    for (const dir of DIRECTORIES_TO_PROCESS) {
        await processDirectory(dir);
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Print statistics
    console.log('\\n📊 Optimization Summary');
    console.log('========================');
    console.log(`Processed: ${stats.processed} images`);
    console.log(`Skipped: ${stats.skipped} images`);
    console.log(`Errors: ${stats.errors} images`);
    console.log(`Original size: ${formatBytes(stats.originalSize)}`);
    console.log(`New size: ${formatBytes(stats.newSize)}`);
    
    if (stats.originalSize > 0) {
        const totalSavings = ((stats.originalSize - stats.newSize) / stats.originalSize * 100).toFixed(1);
        const savedBytes = stats.originalSize - stats.newSize;
        console.log(`Total savings: ${formatBytes(savedBytes)} (${totalSavings}%)`);
    }
    
    console.log(`Duration: ${duration}s`);
    console.log('\\n✅ Image optimization complete!');
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}