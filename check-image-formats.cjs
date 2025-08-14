const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  const { data, error } = await supabase
    .from('installations')
    .select('title, images')
    .order('installation_date', { ascending: false });
  
  let oldFormatCount = 0;
  let newFormatCount = 0;
  
  data.forEach(inst => {
    if (inst.images && inst.images.length > 0) {
      const firstImage = inst.images[0];
      if (firstImage.url === null || !firstImage.url) {
        oldFormatCount++;
        console.log(`❌ OLD: ${inst.title}`);
      } else {
        newFormatCount++;
      }
    }
  });
  
  console.log('\nSummary:');
  console.log(`✅ New format (with URLs): ${newFormatCount}`);
  console.log(`❌ Old format (filenames only): ${oldFormatCount}`);
})();