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
    
    // Check if already has translation system
    if (content.includes('translate-client.js')) {
        console.log(`${index + 1}. ${file} - Already has translation system`);
        return;
    }
    
    // Add language switcher script and translation client before closing body tag
    const scriptsToAdd = `
    <!-- Language Switcher and Translation System -->
    <script src="/language-switcher-script.js"></script>
    <script src="/i18n/translate-client.js"></script>
</body>`;
    
    // Replace closing body tag with scripts + closing body
    content = content.replace('</body>', scriptsToAdd);
    
    // Write the updated content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`${index + 1}. ${file} - Updated with translation system`);
});

console.log('\nAll installation pages updated!');