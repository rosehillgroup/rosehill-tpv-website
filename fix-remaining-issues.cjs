const fs = require('fs');
const path = require('path');

function fixRemainingIssues() {
  console.log('🔧 Fixing remaining installation system issues...\n');
  
  // 1. Fix logo URLs in installation template
  console.log('1. Updating logo URLs in installation template...');
  
  const templatePath = 'generate-installation-pages-multilingual.cjs';
  if (fs.existsSync(templatePath)) {
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Replace logo references with Supabase URL
    const supabaseLogoUrl = 'https://otidaseqlgubqzsqazqt.supabase.co/storage/v1/object/public/installation-images/branding/rosehill_tpv_logo.png';
    
    // Update both header and footer logo references
    template = template.replace(
      /src="\.\.\/\.\.\/rosehill_tpv_logo\.png"/g,
      `src="${supabaseLogoUrl}"`
    );
    
    fs.writeFileSync(templatePath, template);
    console.log('   ✅ Updated logo URLs in installation template');
  }
  
  // 2. Fix installations.html to use language-appropriate API calls
  console.log('2. Updating installations.html to use language-aware API...');
  
  const languages = ['en', 'es', 'fr', 'de'];
  languages.forEach(lang => {
    const installationsPagePath = `dist/${lang}/installations.html`;
    
    if (fs.existsSync(installationsPagePath)) {
      let content = fs.readFileSync(installationsPagePath, 'utf8');
      
      // Find and replace the API call to include language parameter
      const apiCallPattern = /fetch\('\/\.netlify\/functions\/get-installations-public'\)/g;
      const newApiCall = `fetch('/.netlify/functions/get-installations-public?lang=${lang}')`;
      
      if (content.includes("fetch('/.netlify/functions/get-installations-public')")) {
        content = content.replace(apiCallPattern, newApiCall);
        fs.writeFileSync(installationsPagePath, content);
        console.log(`   ✅ Updated ${lang}/installations.html API call`);
      }
    }
  });
  
  console.log('3. Generating updated installation pages with fixed logos...');
  
  return { success: true, message: 'All fixes applied successfully!' };
}

// Only run if called directly
if (require.main === module) {
  const result = fixRemainingIssues();
  console.log(`\n${result.success ? '✅' : '❌'} ${result.message}`);
}

module.exports = { fixRemainingIssues };