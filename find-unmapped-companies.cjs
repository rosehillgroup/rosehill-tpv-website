const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Load customer URLs
const customerUrls = JSON.parse(fs.readFileSync('customer-urls.json', 'utf8'));
const mappedCompanies = Object.keys(customerUrls);

console.log('Currently mapped companies (' + mappedCompanies.length + '):');
mappedCompanies.forEach(c => console.log('- ' + c));

async function findUnmappedCompanies() {
  const { data } = await supabase.from('installations').select('title, description');
  
  const thanksPattern = /thanks to ([^.]*)/i;
  const unmappedCompanies = new Set();
  const examplesByCompany = {};
  
  console.log('\n=== COMPANIES MENTIONED IN THANKS WITHOUT URLS ===');
  
  data.forEach(inst => {
    const descriptionText = Array.isArray(inst.description) 
      ? inst.description.join(' ')
      : inst.description;
    
    if (thanksPattern.test(descriptionText)) {
      const thanksMatch = descriptionText.match(thanksPattern);
      if (thanksMatch) {
        const thanksText = thanksMatch[1];
        
        // Extract company names mentioned - split on common separators
        const companies = thanksText.split(/\s*(?:,|\sand\s|&|&amp;|\sfor\s)\s*/);
        
        companies.forEach(company => {
          let cleanCompany = company.trim()
            .replace(/\s*[–—-].*$/, '') // Remove everything after dash
            .replace(/\s*https?:\/\/.*$/, '') // Remove URLs
            .replace(/\s*for.*$/i, '') // Remove 'for the images' etc
            .replace(/\s*and everyone.*$/i, '') // Remove 'and everyone involved'
            .replace(/^thanks to\s*/i, '') // Remove leading 'thanks to'
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();
            
          // Remove trailing punctuation
          cleanCompany = cleanCompany.replace(/[.,;!?]+$/, '');
          
          if (cleanCompany && cleanCompany.length > 2) {
            const isMapped = mappedCompanies.some(mapped => {
              return mapped.toLowerCase() === cleanCompany.toLowerCase() ||
                cleanCompany.toLowerCase().includes(mapped.toLowerCase()) ||
                mapped.toLowerCase().includes(cleanCompany.toLowerCase());
            });
            
            if (!isMapped) {
              unmappedCompanies.add(cleanCompany);
              if (!examplesByCompany[cleanCompany]) {
                examplesByCompany[cleanCompany] = [];
              }
              examplesByCompany[cleanCompany].push(inst.title);
            }
          }
        });
      }
    }
  });
  
  console.log('\n=== UNMAPPED COMPANIES ===');
  Array.from(unmappedCompanies).sort().forEach(company => {
    console.log(`\n"${company}"`);
    console.log(`  Examples: ${examplesByCompany[company].slice(0, 3).join(', ')}`);
    if (examplesByCompany[company].length > 3) {
      console.log(`  (and ${examplesByCompany[company].length - 3} more...)`);
    }
  });
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`✅ Mapped companies: ${mappedCompanies.length}`);
  console.log(`❓ Unmapped companies: ${unmappedCompanies.size}`);
  
  if (unmappedCompanies.size > 0) {
    console.log('\n💡 These companies could be added to customer-urls.json if URLs are available');
  }
}

findUnmappedCompanies().catch(console.error);