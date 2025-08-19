// Update Installation Pages Script
// This script adds database-driven translation support to all installation pages

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INSTALLATIONS_DIR = path.join(__dirname, 'installations');

/**
 * Update a single installation page to include database loader
 */
function updateInstallationPage(filePath) {
    try {
        console.log(`Updating ${path.basename(filePath)}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if already updated
        if (content.includes('supabase-client.js') && content.includes('installation-page-loader.js')) {
            console.log(`  ✓ Already updated`);
            return;
        }
        
        // Find the script insertion point
        const scriptPattern = /(\s*<!-- Language Switcher and Translation System -->\s*<script src="\/language-switcher-script\.js"><\/script>\s*<script src="\/i18n\/translate-client\.js"><\/script>)/;
        
        if (scriptPattern.test(content)) {
            // Insert new scripts before existing ones
            content = content.replace(
                scriptPattern,
                `    <!-- Supabase Client and Database-driven Translation System -->
    <script src="/js/supabase-client.js"></script>
    <script src="/js/installation-page-loader.js"></script>
    
$1`
            );
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✓ Updated successfully`);
        } else {
            console.log(`  ⚠ Script insertion point not found, updating manually...`);
            
            // Try alternative patterns
            const bodyEndPattern = /(<\/body>\s*<\/html>)/;
            if (bodyEndPattern.test(content)) {
                content = content.replace(
                    bodyEndPattern,
                    `    <!-- Supabase Client and Database-driven Translation System -->
    <script src="/js/supabase-client.js"></script>
    <script src="/js/installation-page-loader.js"></script>

$1`
                );
                
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`  ✓ Updated by adding scripts before </body>`);
            } else {
                console.log(`  ❌ Could not find insertion point`);
            }
        }
        
    } catch (error) {
        console.error(`  ❌ Error updating ${filePath}:`, error.message);
    }
}

/**
 * Main function to update all installation pages
 */
function main() {
    console.log('🚀 Updating installation pages with database translation support...\n');
    
    try {
        // Check if installations directory exists
        if (!fs.existsSync(INSTALLATIONS_DIR)) {
            console.error(`❌ Installations directory not found: ${INSTALLATIONS_DIR}`);
            return;
        }
        
        // Get all HTML files in installations directory
        const files = fs.readdirSync(INSTALLATIONS_DIR)
            .filter(file => file.endsWith('.html'))
            .map(file => path.join(INSTALLATIONS_DIR, file));
        
        console.log(`📁 Found ${files.length} installation pages`);
        
        if (files.length === 0) {
            console.log('❌ No HTML files found in installations directory');
            return;
        }
        
        // Update each file
        let updated = 0;
        let skipped = 0;
        let errors = 0;
        
        files.forEach(filePath => {
            try {
                const originalContent = fs.readFileSync(filePath, 'utf8');
                updateInstallationPage(filePath);
                
                // Check if file was actually modified
                const newContent = fs.readFileSync(filePath, 'utf8');
                if (originalContent !== newContent) {
                    updated++;
                } else {
                    skipped++;
                }
            } catch (error) {
                errors++;
                console.error(`❌ Failed to process ${path.basename(filePath)}:`, error.message);
            }
        });
        
        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 UPDATE SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Updated: ${updated} files`);
        console.log(`⏭️  Skipped: ${skipped} files (already updated)`);
        console.log(`❌ Errors: ${errors} files`);
        console.log(`📝 Total: ${files.length} files processed`);
        
        if (updated > 0) {
            console.log('\n🎉 Installation pages have been updated with database translation support!');
            console.log('\nNext steps:');
            console.log('1. Apply the database schema in Supabase Dashboard');
            console.log('2. Run the bulk translation script');
            console.log('3. Test the translated pages');
        } else {
            console.log('\n📋 All installation pages are already up to date.');
        }
        
    } catch (error) {
        console.error('💥 Script failed:', error.message);
        process.exit(1);
    }
}

// Run the script
main();

export { main };