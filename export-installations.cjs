const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function exportInstallations() {
  console.log('📤 Exporting all installation data from Supabase...');
  
  // Get all installations with all fields
  const { data, error } = await supabase.from('installations')
    .select('*')
    .order('installation_date', { ascending: false });
  
  if (error) {
    console.error('❌ Error fetching data:', error);
    return;
  }
  
  console.log(`✓ Fetched ${data.length} installations`);
  
  // Save to backup file
  const backupData = {
    exportDate: new Date().toISOString(),
    totalInstallations: data.length,
    installations: data
  };
  
  fs.writeFileSync('installations-backup.json', JSON.stringify(backupData, null, 2));
  console.log('✓ Backup saved to installations-backup.json');
  
  // Generate analysis
  const analysis = {
    total: data.length,
    withTimestamps: data.filter(inst => /\d{13}/.test(inst.slug)).length,
    withoutTimestamps: data.filter(inst => !/\d{13}/.test(inst.slug)).length,
    withTranslations: data.filter(inst => inst.title_es && inst.description_es).length,
    withoutTranslations: data.filter(inst => !inst.title_es || !inst.description_es).length,
    withSupabaseImages: data.filter(inst => inst.images && inst.images.length > 0 && inst.images[0].url).length,
    withLocalImages: data.filter(inst => inst.images && inst.images.length > 0 && !inst.images[0].url).length,
    withoutImages: data.filter(inst => !inst.images || inst.images.length === 0).length
  };
  
  console.log('\n📊 Export Analysis:');
  console.log('Total installations:', analysis.total);
  console.log('With timestamps:', analysis.withTimestamps);
  console.log('Without timestamps:', analysis.withoutTimestamps);  
  console.log('With translations:', analysis.withTranslations);
  console.log('Without translations:', analysis.withoutTranslations);
  console.log('With Supabase images:', analysis.withSupabaseImages);
  console.log('With local images:', analysis.withLocalImages);
  console.log('Without images:', analysis.withoutImages);
  
  // Create detailed breakdown for decision making
  const detailedAnalysis = {
    ...analysis,
    timestampedInstallations: data.filter(inst => /\d{13}/.test(inst.slug)),
    nonTimestampedInstallations: data.filter(inst => !/\d{13}/.test(inst.slug)),
    untranslatedInstallations: data.filter(inst => !inst.title_es || !inst.description_es)
  };
  
  fs.writeFileSync('installations-analysis.json', JSON.stringify(detailedAnalysis, null, 2));
  console.log('\n✓ Analysis saved to installations-analysis.json');
  
  // Show recommendations
  console.log('\n💡 Recommendations:');
  console.log(`- Consider ${analysis.withoutTimestamps > analysis.withTimestamps ? 'removing' : 'adding'} timestamps to standardize URLs`);
  console.log(`- Need to translate ${analysis.withoutTranslations} installations`);
  console.log(`- Need to migrate ${analysis.withLocalImages} installations to Supabase storage`);
}

exportInstallations().catch(console.error);