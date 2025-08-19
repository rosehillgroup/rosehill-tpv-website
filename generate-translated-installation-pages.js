// Generate HTML pages for translated installations
// This creates physical HTML files for each translated installation

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://otidaseqlgubqzsqazqt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Languages to generate pages for
const LANGUAGES = ['fr', 'de', 'es'];

// Read the installation template
const TEMPLATE_PATH = './installation-template-clean.html';

async function generateTranslatedPages() {
    console.log('🌍 Generating translated installation pages...\n');
    
    try {
        // Read the template file
        const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
        
        // Get all translations
        const { data: translations, error } = await supabase
            .from('installation_i18n')
            .select('*')
            .order('lang', { ascending: true });
        
        if (error) {
            console.error('Error fetching translations:', error.message);
            return;
        }
        
        if (!translations || translations.length === 0) {
            console.log('No translations found in database');
            return;
        }
        
        console.log(`Found ${translations.length} translations\n`);
        
        // Group translations by language
        const translationsByLang = {};
        translations.forEach(t => {
            if (!translationsByLang[t.lang]) {
                translationsByLang[t.lang] = [];
            }
            translationsByLang[t.lang].push(t);
        });
        
        // Process each language
        for (const lang of LANGUAGES) {
            const langTranslations = translationsByLang[lang] || [];
            
            if (langTranslations.length === 0) {
                console.log(`No translations for ${lang}`);
                continue;
            }
            
            console.log(`\n📝 Processing ${lang.toUpperCase()} (${langTranslations.length} installations)`);
            
            // Create language directory if it doesn't exist
            const langDir = path.join('.', lang);
            if (!fs.existsSync(langDir)) {
                fs.mkdirSync(langDir, { recursive: true });
                console.log(`  Created directory: ${langDir}`);
            }
            
            // Create installations subdirectory
            const installDir = path.join(langDir, 'installations');
            if (!fs.existsSync(installDir)) {
                fs.mkdirSync(installDir, { recursive: true });
                console.log(`  Created directory: ${installDir}`);
            }
            
            // Generate HTML file for each translation
            for (const translation of langTranslations) {
                const filename = `${translation.slug}.html`;
                const filepath = path.join(installDir, filename);
                
                // Create HTML with data attributes for dynamic loading
                const html = template
                    .replace(/data-installation-slug="[^"]*"/g, `data-installation-slug="${translation.slug}"`)
                    .replace(/data-installation-lang="[^"]*"/g, `data-installation-lang="${lang}"`)
                    .replace(/(<html lang=")[^"]*(")/g, `$1${lang}$2`);
                
                fs.writeFileSync(filepath, html, 'utf8');
                console.log(`  ✅ Created: ${filepath}`);
            }
        }
        
        // Also create a mapping file for the language switcher
        console.log('\n📋 Creating slug mapping file...');
        
        const slugMapping = {};
        
        // Get all installations with their English slugs
        const { data: installations } = await supabase
            .from('installations')
            .select('id, slug');
        
        for (const installation of installations) {
            slugMapping[installation.slug] = {
                id: installation.id,
                en: installation.slug
            };
            
            // Add translated slugs
            const translatedSlugs = translations.filter(t => t.installation_id === installation.id);
            translatedSlugs.forEach(t => {
                slugMapping[installation.slug][t.lang] = t.slug;
            });
        }
        
        // Save mapping file
        fs.writeFileSync(
            './js/installation-slug-mapping.json',
            JSON.stringify(slugMapping, null, 2),
            'utf8'
        );
        console.log('  ✅ Created: ./js/installation-slug-mapping.json');
        
        console.log('\n✨ Done! Generated pages for all translated installations.');
        
    } catch (error) {
        console.error('Error generating pages:', error);
        process.exit(1);
    }
}

// Run the generator
generateTranslatedPages();