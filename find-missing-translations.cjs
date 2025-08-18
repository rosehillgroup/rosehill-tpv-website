const { createClient } = require('@supabase/supabase-js');

async function findMissingTranslations() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  console.log('🔍 Finding installations without translations...');
  
  const { data, error } = await supabase
    .from('installations')
    .select('id, slug, title, description, title_es, title_fr, title_de, description_es, description_fr, description_de')
    .order('installation_date', { ascending: false });
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  const missingTranslations = data.filter(inst => 
    !inst.title_es || !inst.title_fr || !inst.title_de || 
    !inst.description_es || !inst.description_fr || !inst.description_de
  );
  
  console.log(`Found ${missingTranslations.length} installations needing translations\n`);
  
  missingTranslations.forEach(inst => {
    console.log(`- ${inst.slug}`);
    console.log(`  ES: ${inst.title_es ? '✓' : '✗'} title, ${inst.description_es ? '✓' : '✗'} description`);
    console.log(`  FR: ${inst.title_fr ? '✓' : '✗'} title, ${inst.description_fr ? '✓' : '✗'} description`);
    console.log(`  DE: ${inst.title_de ? '✓' : '✗'} title, ${inst.description_de ? '✓' : '✗'} description`);
    console.log('');
  });
  
  // Save for batch translation
  const fs = require('fs');
  fs.writeFileSync('missing-translations.json', JSON.stringify({ 
    count: missingTranslations.length,
    installations: missingTranslations 
  }, null, 2));
  
  console.log('✓ Missing translations data saved to missing-translations.json');
  return missingTranslations;
}

findMissingTranslations().catch(console.error);