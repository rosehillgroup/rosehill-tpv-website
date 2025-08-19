const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function translateText(text, targetLang, apiKey) {
  const response = await fetch('https://api.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'text': text,
      'target_lang': targetLang.toUpperCase(),
      'source_lang': 'EN',
      'preserve_formatting': '1'
    })
  });

  if (!response.ok) {
    throw new Error(`DeepL API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.translations[0].text;
}

async function batchTranslateInstallations() {
  console.log('🌍 Starting batch translation of installations...\n');
  
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.error('❌ DEEPL_API_KEY environment variable is required');
    return;
  }
  
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const missingData = JSON.parse(fs.readFileSync('missing-translations.json', 'utf8'));
  
  console.log(`📋 Translating ${missingData.count} installations into 3 languages`);
  console.log(`Total translations needed: ${missingData.count * 3 * 2} (title + description)\n`);
  
  const results = {
    successful: [],
    failed: [],
    skipped: []
  };
  
  for (const installation of missingData.installations) {
    console.log(`🔄 Processing: ${installation.title}`);
    
    try {
      const translations = {};
      
      // Translate title and description for each language
      for (const lang of ['es', 'fr', 'de']) {
        console.log(`  📝 Translating to ${lang.toUpperCase()}...`);
        
        // Title
        const titleKey = `title_${lang}`;
        if (!installation[titleKey]) {
          try {
            translations[titleKey] = await translateText(installation.title, lang, apiKey);
            console.log(`    ✓ Title: ${translations[titleKey]}`);
            await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
          } catch (error) {
            console.error(`    ❌ Title translation failed: ${error.message}`);
            throw error;
          }
        } else {
          translations[titleKey] = installation[titleKey];
          console.log(`    ✓ Title: ${translations[titleKey]} (existing)`);
        }
        
        // Description
        const descKey = `description_${lang}`;
        if (!installation[descKey]) {
          try {
            translations[descKey] = await translateText(installation.description, lang, apiKey);
            console.log(`    ✓ Description: ${translations[descKey].substring(0, 100)}...`);
            await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
          } catch (error) {
            console.error(`    ❌ Description translation failed: ${error.message}`);
            throw error;
          }
        } else {
          translations[descKey] = installation[descKey];
          console.log(`    ✓ Description: ${translations[descKey].substring(0, 100)}... (existing)`);
        }
      }
      
      // Update Supabase record
      console.log(`  💾 Updating database record...`);
      const { error } = await supabase
        .from('installations')
        .update(translations)
        .eq('id', installation.id);
      
      if (error) {
        console.error(`  ❌ Database update failed: ${error.message}`);
        results.failed.push({
          id: installation.id,
          slug: installation.slug,
          error: error.message
        });
      } else {
        console.log(`  ✅ Successfully updated database record`);
        results.successful.push({
          id: installation.id,
          slug: installation.slug,
          translations: translations
        });
      }
      
    } catch (error) {
      console.error(`  ❌ Translation failed: ${error.message}`);
      results.failed.push({
        id: installation.id,
        slug: installation.slug,
        error: error.message
      });
    }
    
    console.log(''); // Empty line for readability
  }
  
  console.log('📊 Translation Summary:');
  console.log(`- Successfully translated: ${results.successful.length} installations`);
  console.log(`- Failed translations: ${results.failed.length} installations`);
  console.log(`- Skipped: ${results.skipped.length} installations`);
  
  // Save results
  fs.writeFileSync('translation-results.json', JSON.stringify(results, null, 2));
  console.log(`\n✓ Translation results saved to translation-results.json`);
  
  if (results.failed.length > 0) {
    console.log(`\n⚠️  Failed translations:`);
    results.failed.forEach(fail => {
      console.log(`  - ${fail.slug}: ${fail.error}`);
    });
  }
  
  console.log(`\n💡 Next step: Regenerate installation pages to apply new translations`);
  
  return results;
}

// Only run if both API keys are available
if (process.env.DEEPL_API_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  batchTranslateInstallations().catch(console.error);
} else {
  console.log('🔑 Batch translation requires both DEEPL_API_KEY and SUPABASE_SERVICE_ROLE_KEY');
  console.log('Set the environment variables and run again:');
  console.log('DEEPL_API_KEY="your-key" SUPABASE_SERVICE_ROLE_KEY="your-key" node batch-translate-installations.cjs');
}