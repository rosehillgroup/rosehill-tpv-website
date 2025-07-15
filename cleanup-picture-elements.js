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
    picturesFixed: 0,
    attributesFixed: 0,
    errors: 0
};

/**
 * Clean up malformed picture elements and duplicate attributes
 */
function cleanupPictureElements(htmlContent) {
    let updatedContent = htmlContent;
    let changesCount = 0;
    
    // Fix nested picture elements
    updatedContent = updatedContent.replace(/<picture>\s*<source[^>]*>\s*<picture>\s*<source[^>]*>\s*<img[^>]*>\s*<\/picture>\s*<\/picture>/gs, (match) => {
        // Extract the sources and img from the nested structure
        const sources = [];
        const sourceMatches = match.match(/<source[^>]*>/g);
        const imgMatch = match.match(/<img[^>]*>/);
        
        if (sourceMatches && imgMatch) {
            sourceMatches.forEach(source => {
                if (!sources.includes(source)) {
                    sources.push(source);
                }
            });
            
            const cleanPicture = `<picture>
                ${sources.join('\n                ')}
                ${imgMatch[0]}
            </picture>`;
            
            changesCount++;
            return cleanPicture;
        }
        
        return match;
    });
    
    // Fix duplicate attributes in img tags
    updatedContent = updatedContent.replace(/<img([^>]*)>/g, (match, attributes) => {
        const attrs = {};
        const attrMatches = attributes.match(/(\w+)=["']([^"']*?)["']/g);
        
        if (attrMatches) {
            attrMatches.forEach(attr => {
                const [key, value] = attr.split('=');
                const cleanValue = value.replace(/['"]/g, '');
                
                // For onclick, only keep the first occurrence
                if (key === 'onclick' && !attrs[key]) {
                    attrs[key] = cleanValue;
                } else if (key === 'loading' && !attrs[key]) {
                    attrs[key] = cleanValue;
                } else if (key !== 'onclick' && key !== 'loading') {
                    attrs[key] = cleanValue;
                }
            });
            
            const cleanAttributes = Object.entries(attrs)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ');
            
            const cleanImg = `<img ${cleanAttributes}>`;
            
            if (cleanImg !== match) {
                changesCount++;
            }
            
            return cleanImg;
        }
        
        return match;
    });
    
    return { content: updatedContent, changesCount };
}

/**
 * Process a single HTML file
 */
function processFile(filePath) {
    try {
        console.log(`\nProcessing: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
            console.log(`  ⚠ File not found: ${filePath}`);
            return;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const { content: updatedContent, changesCount } = cleanupPictureElements(content);
        
        if (changesCount > 0) {
            // Create backup if it doesn't exist
            const backupPath = filePath + '.backup';
            if (!fs.existsSync(backupPath)) {
                fs.writeFileSync(backupPath, content);
                console.log(`  📁 Created backup: ${path.basename(backupPath)}`);
            }
            
            // Write updated content
            fs.writeFileSync(filePath, updatedContent);
            console.log(`  ✅ Fixed ${changesCount} picture elements in ${path.basename(filePath)}`);
        } else {
            console.log(`  ℹ No picture elements to fix in ${path.basename(filePath)}`);
        }
        
        stats.filesProcessed++;
        stats.picturesFixed += changesCount;
        
    } catch (error) {
        console.error(`  ✗ Error processing ${filePath}:`, error.message);
        stats.errors++;
    }
}

/**
 * Main function
 */
function main() {
    console.log('🧹 Cleanup Picture Elements');
    console.log('========================');
    console.log('Fixing nested picture elements and duplicate attributes\n');
    
    const startTime = Date.now();
    
    // Process main HTML files
    console.log('📄 Processing main HTML files...');
    for (const file of HTML_FILES) {
        if (fs.existsSync(file)) {
            processFile(file);
        }
    }
    
    // Process installation files
    console.log('\n📁 Processing installation files...');
    if (fs.existsSync(INSTALLATION_DIR)) {
        const files = fs.readdirSync(INSTALLATION_DIR);
        const htmlFiles = files.filter(file => file.endsWith('.html') && !file.includes('.backup'));
        
        for (const file of htmlFiles) {
            const filePath = path.join(INSTALLATION_DIR, file);
            processFile(filePath);
        }
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Print statistics
    console.log('\n📊 Cleanup Summary');
    console.log('==================');
    console.log(`Files processed: ${stats.filesProcessed}`);
    console.log(`Picture elements fixed: ${stats.picturesFixed}`);
    console.log(`Errors: ${stats.errors}`);
    console.log(`Duration: ${duration}s`);
    
    if (stats.picturesFixed > 0) {
        console.log('\n✅ Picture elements cleaned up successfully!');
    } else {
        console.log('\nℹ No picture elements needed cleanup.');
    }
}

// Run the script
if (require.main === module) {
    main();
}