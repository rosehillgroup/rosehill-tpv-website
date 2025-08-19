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

// The corrected switchLanguage function
const newSwitchLanguageFunction = `        function switchLanguage(targetLang) {
            const currentPath = window.location.pathname;
            
            // Extract the installation page path (e.g., /installations/page.html)
            let basePath = currentPath;
            
            // Remove any existing language prefix
            const langMatch = currentPath.match(/^\\/(?:en|fr|de|es)\\//);
            if (langMatch) {
                basePath = currentPath.substring(langMatch[0].length - 1);
            }
            
            // Build the new path
            let newPath;
            if (targetLang === 'en') {
                // English doesn't use a prefix for installation pages
                newPath = basePath;
            } else {
                // Other languages get a prefix
                newPath = '/' + targetLang + basePath;
            }
            
            window.location.href = newPath;
        }`;

// Process each file
files.forEach((file, index) => {
    const filePath = path.join(installationsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find and replace the old switchLanguage function
    const functionStart = content.indexOf('function switchLanguage(targetLang) {');
    if (functionStart === -1) {
        console.log(`${index + 1}. ${file} - No switchLanguage function found`);
        return;
    }
    
    // Find the end of the function (closing brace)
    let braceCount = 0;
    let inFunction = false;
    let functionEnd = -1;
    
    for (let i = functionStart; i < content.length; i++) {
        if (content[i] === '{') {
            braceCount++;
            inFunction = true;
        } else if (content[i] === '}' && inFunction) {
            braceCount--;
            if (braceCount === 0) {
                functionEnd = i + 1;
                break;
            }
        }
    }
    
    if (functionEnd === -1) {
        console.log(`${index + 1}. ${file} - Could not find function end`);
        return;
    }
    
    // Get the indentation
    const lineStart = content.lastIndexOf('\n', functionStart) + 1;
    const indentation = content.substring(lineStart, functionStart);
    
    // Replace the function
    content = content.substring(0, lineStart) + 
              newSwitchLanguageFunction + 
              content.substring(functionEnd);
    
    // Write the updated content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`${index + 1}. ${file} - Updated switchLanguage function`);
});

console.log('\nAll installation pages updated with corrected language switcher!');