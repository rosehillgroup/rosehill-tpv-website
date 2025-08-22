#!/usr/bin/env node

/**
 * Fix publishedLocales for all installations to ensure they show up on the page
 */

import { createClient } from '@sanity/client';

const SANITY_PROJECT_ID = '68ola3dd';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = 'skrD4arZj8BnTrBl59CZtTc5cGPeLzmznMvkEGVOkbHq2ZElekjb97yFSwwErxmifyXtrcwMWS5Le25FuubBMiMa8Fs6QeEjTluq37hO0FDW61nAUokGZWgrBHPRH0qXMStwAjfnqNGkKIoWm33tSyevLvFtsWtXdDheVAjqXYkYMPH6VNJ6';

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: false,
  token: SANITY_TOKEN,
  apiVersion: '2023-05-03',
});

async function fixPublishedLocales() {
  console.log('🔧 Fixing publishedLocales for all installations...\n');
  
  try {
    // Get all installations
    const installations = await sanity.fetch(`*[_type == "installation"] { _id, title, publishedLocales, imageReferences }`);
    console.log(`Found ${installations.length} installations\n`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const install of installations) {
      const title = install.title?.en || 'Untitled';
      
      // Check if publishedLocales includes 'en'
      if (!install.publishedLocales || !install.publishedLocales.includes('en')) {
        console.log(`Updating: ${title}`);
        
        await sanity
          .patch(install._id)
          .set({ publishedLocales: ['en'] })
          .commit();
        
        updated++;
        await new Promise(resolve => setTimeout(resolve, 100)); // Rate limit
      } else {
        skipped++;
      }
    }
    
    console.log(`\n✅ Updated: ${updated} installations`);
    console.log(`⏭️ Skipped: ${skipped} installations (already had 'en')`);
    console.log('\n🎉 Done! Check https://tpv.rosehill.group/installations.html');
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

fixPublishedLocales();