import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://otidaseqlgubqzsqazqt.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4';

const supabase = createClient(supabaseUrl, supabaseKey);

// Main pages to copy
const MAIN_PAGES = [
  'index.html',
  'products.html',
  'applications.html',
  'colour.html',
  'about.html',
  'contact.html',
  'mixer.html',
  'installations.html',
  'thank-you.html'
];

// Basic UI translations
const UI_TRANSLATIONS = {
  fr: {
    'Home': 'Accueil',
    'Products': 'Produits',
    'Applications': 'Applications',
    'Colour': 'Couleur',
    'Installations': 'Installations',
    'About Us': 'À Propos',
    'Get in Touch': 'Contactez-nous',
    'Contact': 'Contact',
    'Creating safer, more vibrant play and sports surfaces worldwide with our premium coloured rubber granules.': 'Créer des surfaces de jeu et de sport plus sûres et plus vibrantes dans le monde entier avec nos granulés de caoutchouc colorés de qualité supérieure.',
    'Ready to Transform Your Space?': 'Prêt à Transformer Votre Espace ?',
    'Get Started': 'Commencer',
    'Location:': 'Lieu :',
    'Date:': 'Date :',
    'Application:': 'Application :',
    'Project Images': 'Images du Projet',
    'Project Overview': 'Aperçu du Projet'
  },
  de: {
    'Home': 'Startseite',
    'Products': 'Produkte',
    'Applications': 'Anwendungen',
    'Colour': 'Farbe',
    'Installations': 'Installationen',
    'About Us': 'Über Uns',
    'Get in Touch': 'Kontakt',
    'Contact': 'Kontakt',
    'Creating safer, more vibrant play and sports surfaces worldwide with our premium coloured rubber granules.': 'Schaffung sichererer, lebendigerer Spiel- und Sportflächen weltweit mit unseren hochwertigen farbigen Gummigranulaten.',
    'Ready to Transform Your Space?': 'Bereit, Ihren Raum zu Verwandeln?',
    'Get Started': 'Loslegen',
    'Location:': 'Standort:',
    'Date:': 'Datum:',
    'Application:': 'Anwendung:',
    'Project Images': 'Projektbilder',
    'Project Overview': 'Projektübersicht'
  },
  es: {
    'Home': 'Inicio',
    'Products': 'Productos',
    'Applications': 'Aplicaciones',
    'Colour': 'Color',
    'Installations': 'Instalaciones',
    'About Us': 'Acerca de',
    'Get in Touch': 'Contáctanos',
    'Contact': 'Contacto',
    'Creating safer, more vibrant play and sports surfaces worldwide with our premium coloured rubber granules.': 'Creando superficies de juego y deportivas más seguras y vibrantes en todo el mundo con nuestros gránulos de caucho de colores premium.',
    'Ready to Transform Your Space?': '¿Listo para Transformar tu Espacio?',
    'Get Started': 'Comenzar',
    'Location:': 'Ubicación:',
    'Date:': 'Fecha:',
    'Application:': 'Aplicación:',
    'Project Images': 'Imágenes del Proyecto',
    'Project Overview': 'Resumen del Proyecto'
  }
};

async function translateMainPages() {
  console.log('🌍 Generating multilingual main pages...\n');

  const languages = ['en', 'fr', 'de', 'es'];

  for (const page of MAIN_PAGES) {
    const sourcePath = path.join(__dirname, page);
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  ${page} not found`);
      continue;
    }

    const content = fs.readFileSync(sourcePath, 'utf8');

    for (const lang of languages) {
      let translatedContent = content;
      
      // Update HTML lang attribute
      translatedContent = translatedContent.replace(/<html[^>]*lang="[^"]*"/, `<html lang="${lang}"`);
      
      // Update navigation links to include language prefix
      translatedContent = translatedContent.replace(/href="([^"]*\.html)"/g, (match, p1) => {
        // Skip external links and already prefixed links
        if (p1.startsWith('http') || p1.startsWith('/')) return match;
        // Add language prefix
        return `href="/${lang}/${p1}"`;
      });
      
      // Update home link
      translatedContent = translatedContent.replace(/href="index\.html"/g, `href="/${lang}/"`);
      
      if (lang !== 'en') {
        // Apply UI translations
        const translations = UI_TRANSLATIONS[lang];
        for (const [english, translated] of Object.entries(translations)) {
          // Replace in navigation and buttons
          const regex = new RegExp(`>\\s*${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*<`, 'g');
          translatedContent = translatedContent.replace(regex, `>${translated}<`);
        }
      }

      // Add language switcher
      const switcherHTML = `
    <!-- Language Switcher -->
    <div id="language-switcher" style="position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);padding:8px 12px;border-radius:25px;box-shadow:0 4px 20px rgba(0,0,0,0.15);z-index:9999;border:1px solid rgba(255,107,53,0.1);backdrop-filter:blur(10px);font-family:'Source Sans Pro', sans-serif;font-size:14px;font-weight:500;">
        <a href="javascript:void(0)" onclick="switchLanguage('en')" id="lang-en" style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;${lang === 'en' ? 'background:#ff6b35;color:white;box-shadow:0 2px 8px rgba(255,107,53,0.3);' : ''}">EN</a>
        <a href="javascript:void(0)" onclick="switchLanguage('fr')" id="lang-fr" style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;${lang === 'fr' ? 'background:#ff6b35;color:white;box-shadow:0 2px 8px rgba(255,107,53,0.3);' : ''}">FR</a>
        <a href="javascript:void(0)" onclick="switchLanguage('de')" id="lang-de" style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;${lang === 'de' ? 'background:#ff6b35;color:white;box-shadow:0 2px 8px rgba(255,107,53,0.3);' : ''}">DE</a>
        <a href="javascript:void(0)" onclick="switchLanguage('es')" id="lang-es" style="display:inline-block;padding:6px 12px;margin:0 2px;text-decoration:none;color:#64748b;border-radius:15px;transition:all 0.2s ease;${lang === 'es' ? 'background:#ff6b35;color:white;box-shadow:0 2px 8px rgba(255,107,53,0.3);' : ''}">ES</a>
    </div>
    
    <script>
        // Language switching functionality
        function switchLanguage(targetLang) {
            const currentPath = window.location.pathname;
            const currentLang = currentPath.split('/')[1];
            
            if (currentLang === targetLang) return;
            
            let newPath;
            if (currentLang && ['en', 'fr', 'de', 'es'].includes(currentLang)) {
                newPath = currentPath.replace('/' + currentLang + '/', '/' + targetLang + '/');
            } else {
                newPath = '/' + targetLang + '/';
            }
            
            window.location.href = newPath;
        }
        
        // Set active language on page load
        document.addEventListener('DOMContentLoaded', function() {
            const currentLang = '${lang}';
            const activeElement = document.getElementById('lang-' + currentLang);
            if (activeElement && !activeElement.style.background) {
                activeElement.style.background = '#ff6b35';
                activeElement.style.color = 'white';
                activeElement.style.boxShadow = '0 2px 8px rgba(255,107,53,0.3)';
            }
        });
    </script>`;

      // Add language switcher before closing body tag
      if (!translatedContent.includes('language-switcher')) {
        translatedContent = translatedContent.replace('</body>', switcherHTML + '\n</body>');
      }

      // Save to language directory
      const targetPath = path.join(__dirname, 'dist', lang, page);
      const targetDir = path.dirname(targetPath);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      fs.writeFileSync(targetPath, translatedContent);
      console.log(`✓ Generated ${page} for ${lang}`);
    }
  }

  console.log('\n✅ Main pages generated for all languages!');
}

// Run the script
translateMainPages().catch(console.error);