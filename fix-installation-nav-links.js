import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing installation HTML files
const installationsDir = path.join(__dirname, 'installations');

// Get all HTML files (excluding backups)
const files = fs.readdirSync(installationsDir)
    .filter(file => file.endsWith('.html') && !file.includes('.backup'));

console.log(`Found ${files.length} installation pages to update`);

// Process each file
files.forEach((file, index) => {
    const filePath = path.join(installationsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all hardcoded /en/ links in navigation with root-relative paths
    // This allows the language switcher script to handle the proper language routing
    
    // Replace nav menu links
    content = content.replace(/<a href="\/en\//g, '<a href="/');
    
    // Replace breadcrumb link
    content = content.replace(/<a href="\/en\/installations\.html">/g, '<a href="/installations.html">');
    
    // Replace contact CTA link
    content = content.replace(/<a href="\/en\/contact\.html" class="cta-button">/g, '<a href="/contact.html" class="cta-button">');
    
    // Write the updated content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`${index + 1}. ${file} - Fixed navigation links`);
});

console.log('\nAll installation pages updated with language-aware navigation!');