const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

(async () => {
  const { data, error } = await supabase
    .from('installations')
    .select('title, description')
    .order('installation_date', { ascending: false });
  
  console.log('Installations with "Thanks" mentions:');
  console.log('=====================================\n');
  
  let count = 0;
  data.forEach(inst => {
    const desc = Array.isArray(inst.description) ? inst.description.join(' ') : inst.description;
    if (desc && desc.toLowerCase().includes('thanks')) {
      count++;
      console.log(`${count}. ${inst.title}:`);
      const thanksMatch = desc.match(/Thanks[^.]*\./gi);
      if (thanksMatch) {
        thanksMatch.forEach(match => {
          console.log(`   "${match}"`);
        });
      }
      console.log('');
    }
  });
  
  console.log(`\nTotal installations with thanks: ${count}`);
})();
