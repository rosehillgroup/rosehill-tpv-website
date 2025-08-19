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

// JavaScript to add to each installation page to handle language-aware navigation
const navScript = `
    <script>
        // Update navigation links based on current language
        document.addEventListener('DOMContentLoaded', function() {
            const path = window.location.pathname;
            const langMatch = path.match(/^\\/(?:es|fr|de)\\//);
            
            if (langMatch) {
                const currentLang = langMatch[0].slice(1, -1);
                
                // Update all navigation links to include the current language
                const navLinks = document.querySelectorAll('.nav-menu a:not(.contact-btn), .footer-nav a, .breadcrumb a');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('/') && !href.startsWith('/' + currentLang + '/')) {
                        // Add language prefix to root-relative URLs
                        link.setAttribute('href', '/' + currentLang + href);
                    }
                });
                
                // Update logo link
                const logoLinks = document.querySelectorAll('.logo');
                logoLinks.forEach(link => {
                    link.setAttribute('href', '/' + currentLang + '/');
                });
                
                // Update contact button
                const contactBtns = document.querySelectorAll('.contact-btn, .cta-button');
                contactBtns.forEach(btn => {
                    const href = btn.getAttribute('href');
                    if (href && href.startsWith('/') && !href.startsWith('/' + currentLang + '/')) {
                        btn.setAttribute('href', '/' + currentLang + href);
                    }
                });
            }
        });
    </script>
`;

// Process each file
files.forEach((file, index) => {
    const filePath = path.join(installationsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has this script
    if (content.includes('Update navigation links based on current language')) {
        console.log(`${index + 1}. ${file} - Already has nav update script`);
        return;
    }
    
    // Add the script before the language switcher script
    content = content.replace(
        '    <!-- Language Switcher and Translation System -->',
        navScript + '\n    <!-- Language Switcher and Translation System -->'
    );
    
    // Write the updated content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`${index + 1}. ${file} - Added navigation update script`);
});

console.log('\nAll installation pages updated with navigation script!');