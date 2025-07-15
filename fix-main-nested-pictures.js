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

/**
 * Fix nested picture elements that still remain
 */
function fixNestedPictures(htmlContent) {
    let updatedContent = htmlContent;
    let changesCount = 0;
    
    // Pattern to match nested picture elements with proper source extraction
    const nestedPicturePattern = /<picture>\s*<source[^>]*type="image\/webp"[^>]*>\s*<picture>\s*(<source[^>]*type="image\/avif"[^>]*>)?\s*(<source[^>]*type="image\/webp"[^>]*>)?\s*(<img[^>]*>)\s*<\/picture>\s*<\/picture>/gs;
    
    updatedContent = updatedContent.replace(nestedPicturePattern, (match) => {
        // Extract all source elements and img element
        const avifMatch = match.match(/<source[^>]*type="image\/avif"[^>]*>/);
        const webpMatches = match.match(/<source[^>]*type="image\/webp"[^>]*>/g);
        const imgMatch = match.match(/<img[^>]*>/);
        
        if (imgMatch) {
            let sources = [];
            
            // Add AVIF source first if it exists
            if (avifMatch) {
                sources.push(avifMatch[0]);
            }
            
            // Add WebP source (use first WebP source found)
            if (webpMatches && webpMatches.length > 0) {
                sources.push(webpMatches[0]);
            }
            
            const cleanPicture = `<picture>
                ${sources.join('\n                ')}
                ${imgMatch[0]}
            </picture>`;
            
            changesCount++;
            return cleanPicture;
        }
        
        return match;
    });
    
    return { content: updatedContent, changesCount };
}

/**
 * Process a single file
 */
function processFile(filePath) {
    try {
        console.log(`Processing: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
            console.log(`  ⚠ File not found: ${filePath}`);
            return;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const { content: updatedContent, changesCount } = fixNestedPictures(content);
        
        if (changesCount > 0) {
            fs.writeFileSync(filePath, updatedContent);
            console.log(`  ✅ Fixed ${changesCount} nested picture elements`);
        } else {
            console.log(`  ✓ No nested pictures to fix`);
        }
        
        return changesCount;
        
    } catch (error) {
        console.error(`  ✗ Error processing ${filePath}:`, error.message);
        return 0;
    }
}

/**
 * Main function
 */
function main() {
    console.log('🔧 Fix Main Files Nested Picture Elements');
    console.log('==========================================');
    
    let totalFixed = 0;
    
    // Process main HTML files
    for (const file of HTML_FILES) {
        if (fs.existsSync(file)) {
            totalFixed += processFile(file);
        }
    }
    
    console.log(`\n📊 Total nested picture elements fixed: ${totalFixed}`);
    
    if (totalFixed > 0) {
        console.log('✅ Nested picture elements cleaned up successfully!');
    } else {
        console.log('✓ No nested picture elements found.');
    }
}

// Run the script
if (require.main === module) {
    main();
}