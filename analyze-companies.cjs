const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Known company URLs
const companyUrls = {
  'Surface Designs TPV': 'https://www.surfacedesigns.com.au/',
  'Perth Playground & Rubber': 'https://perthplaygroundandrubber.com.au/',
  'GCC Sport Surfaces': 'https://en.gccsportsurfaces.nl',
  'LD Total': 'https://www.ldtotal.com.au/',
  'VALORIZA ECORUBBER': 'https://valorizaecorubber.com/en/',
  'Flexidal': 'https://www.rubbervloer.be/en/',
  'Full urbano': 'https://www.fullurbano.com/',
  'Full Urbano': 'https://www.fullurbano.com/',
  'The Win Win Group': 'https://www.winwingroup.com.hk/',
  'Glooloop Surfacing': 'https://glooloop.com.au/',
  'Australian Sports & Safety Surfaces': 'https://australiansportsandsafetysurfaces.com.au/',
  "Bruce's Playgrounds": 'https://brucesbobcats.com.au/',
  "Bruce's Playground": 'https://brucesbobcats.com.au/',
  'Grange Surfacing Pty Ltd': 'https://www.grangesurfacing.com.au/',
  'Glooloop Surfacing Pty Ltd': 'https://glooloop.com.au/',
  'NumatREC': null,
  'Bespoke Landscape Architects': null,
  'HAGS ESPAÑA': null,
  'Co-Ordinated Landscapes Pty Limited': null
};

(async () => {
  const { data, error } = await supabase
    .from('installations')
    .select('id, title, description')
    .order('installation_date', { ascending: false });
  
  console.log('Installations needing company links:');
  console.log('=====================================\n');
  
  const updates = [];
  
  data.forEach(inst => {
    const desc = Array.isArray(inst.description) ? inst.description : [inst.description];
    let needsUpdate = false;
    const updatedDesc = [];
    
    desc.forEach((paragraph, idx) => {
      if (paragraph && paragraph.toLowerCase().includes('thanks')) {
        let updatedParagraph = paragraph;
        
        // Check each company
        for (const [company, url] of Object.entries(companyUrls)) {
          if (url && paragraph.includes(company) && \!paragraph.includes('href=')) {
            console.log(`Found "${company}" in: ${inst.title}`);
            console.log(`  Original: "${paragraph.substring(0, 150)}"`);
            needsUpdate = true;
          }
        }
        
        updatedDesc.push(updatedParagraph);
      } else {
        updatedDesc.push(paragraph);
      }
    });
    
    if (needsUpdate) {
      updates.push({
        id: inst.id,
        title: inst.title
      });
    }
  });
  
  console.log(`\nFound ${updates.length} installations that need company links added`);
})();
