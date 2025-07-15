#!/usr/bin/env node

const fs = require('fs');

/**
 * URL encode file paths with spaces
 */
function encodeFilePaths(htmlContent) {
    let updatedContent = htmlContent;
    let changesCount = 0;
    
    // Pattern to match srcset attributes with spaces in filenames
    const srcsetPattern = /srcset="([^"]*\s[^"]*\.(avif|webp|jpg|jpeg|png))"/g;
    
    updatedContent = updatedContent.replace(srcsetPattern, (match, filePath, extension) => {
        // URL encode the file path
        const encodedPath = encodeURIComponent(filePath).replace(/%2F/g, '/');
        changesCount++;
        console.log(`  Encoding: ${filePath} → ${encodedPath}`);
        return `srcset="${encodedPath}"`;
    });
    
    // Pattern to match src attributes with spaces in filenames
    const srcPattern = /src="([^"]*\s[^"]*\.(avif|webp|jpg|jpeg|png))"/g;
    
    updatedContent = updatedContent.replace(srcPattern, (match, filePath, extension) => {
        // URL encode the file path
        const encodedPath = encodeURIComponent(filePath).replace(/%2F/g, '/');
        changesCount++;
        console.log(`  Encoding: ${filePath} → ${encodedPath}`);
        return `src="${encodedPath}"`;
    });
    
    return { content: updatedContent, changesCount };
}

/**
 * Main function
 */
function main() {
    console.log('🔧 Fix Colour Page URL Encoding');
    console.log('=================================');
    
    const filePath = './colour.html';
    
    if (!fs.existsSync(filePath)) {
        console.log('❌ colour.html not found');
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: updatedContent, changesCount } = encodeFilePaths(content);
    
    if (changesCount > 0) {
        // Create backup
        const backupPath = filePath + '.backup';
        if (!fs.existsSync(backupPath)) {
            fs.writeFileSync(backupPath, content);
            console.log(`📁 Created backup: ${backupPath}`);
        }
        
        // Write updated content
        fs.writeFileSync(filePath, updatedContent);
        console.log(`✅ Fixed ${changesCount} file paths with URL encoding`);
        console.log('\nNext steps:');
        console.log('1. Test the colour.html page in your browser');
        console.log('2. Check browser dev tools Network tab to see if AVIF files are loading');
        console.log('3. If still not working, the issue may be server-side MIME type configuration');
    } else {
        console.log('✓ No file paths with spaces found to encode');
    }
}

// Run the script
if (require.main === module) {
    main();
}