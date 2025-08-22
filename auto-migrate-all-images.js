#!/usr/bin/env node

/**
 * Automated migration script to update ALL Sanity installations with image data
 * from local installation HTML files. No manual work required!
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sanity configuration
const SANITY_PROJECT_ID = '68ola3dd';
const SANITY_DATASET = 'production';
// You need to set a valid Sanity write token as an environment variable
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN;

// Initialize Sanity client
const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: false,
  token: SANITY_TOKEN,
  apiVersion: '2023-05-03',
});

// Extract title from HTML content
function extractTitle(htmlContent) {
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
  if (!titleMatch) return null;
  
  let title = titleMatch[1];
  
  // Remove " | Rosehill TPV Installation" suffix
  title = title.replace(/\s*\|\s*Rosehill TPV.*Installation$/i, '');
  
  // Remove " - Rosehill TPV® Installation" suffix
  title = title.replace(/\s*-\s*Rosehill TPV®?\s*Installation$/i, '');
  
  // Remove location part (everything after last " - ")
  const lastDashIndex = title.lastIndexOf(' - ');
  if (lastDashIndex > 0) {
    title = title.substring(0, lastDashIndex);
  }
  
  return title.trim();
}

// Extract images array from HTML content
function extractImages(htmlContent) {
  // Look for const images = [...] pattern
  const imagesMatch = htmlContent.match(/const\s+images\s*=\s*\[(.*?)\]/s);
  if (!imagesMatch) return [];
  
  try {
    // Parse the array content
    let arrayContent = imagesMatch[1];
    // Remove any comments
    arrayContent = arrayContent.replace(/\/\/.*$/gm, '').replace(/\/\*.*?\*\//gs, '');
    
    // Convert single quotes to double quotes for valid JSON
    // But be careful not to replace quotes inside strings
    arrayContent = arrayContent
      .trim()
      .replace(/'/g, '"')
      .replace(/,\s*]/g, ']')  // Remove trailing commas
      .replace(/,\s*,/g, ','); // Remove double commas
    
    // Parse array
    const imageArray = JSON.parse(`[${arrayContent}]`);
    
    // Filter out placeholder images
    const realImages = imageArray.filter(img => 
      typeof img === 'string' && 
      !img.startsWith('placeholder-') &&
      img.trim() !== ''
    );
    
    return realImages;
  } catch (error) {
    // Silently skip parse errors - likely placeholder arrays
    return [];
  }
}

// Process images to proper format
function processImages(imageArray) {
  if (!imageArray || imageArray.length === 0) {
    return {
      imageReferences: [],
      imageCount: 0,
      coverImagePath: null
    };
  }

  // Convert to full paths
  const imageReferences = imageArray.map(img => {
    // If image is just a filename, prepend with images/installations/
    if (!img.startsWith('http') && !img.startsWith('images/')) {
      return `images/installations/${img}`;
    }
    return img;
  });

  return {
    imageReferences: imageReferences,
    imageCount: imageReferences.length,
    coverImagePath: imageReferences[0] || null
  };
}

async function migrateAllInstallations() {
  console.log('🚀 Starting automated migration of ALL installations...\n');
  
  try {
    // 1. Read all installation HTML files
    const installationsDir = path.join(__dirname, 'installations');
    const files = fs.readdirSync(installationsDir)
      .filter(file => file.endsWith('.html') && !file.endsWith('.backup'));
    
    console.log(`📁 Found ${files.length} installation HTML files\n`);
    
    // 2. Process each file to extract data
    const localInstallations = [];
    
    for (const file of files) {
      const filePath = path.join(installationsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const title = extractTitle(content);
      const images = extractImages(content);
      
      if (title) {
        const imageData = processImages(images);
        localInstallations.push({
          filename: file,
          title: title,
          ...imageData
        });
        
        if (imageData.imageCount > 0) {
          console.log(`✅ ${title}: ${imageData.imageCount} images`);
        } else {
          console.log(`⚠️ ${title}: No images`);
        }
      }
    }
    
    console.log(`\n📊 Processed ${localInstallations.length} installations`);
    console.log(`📸 With images: ${localInstallations.filter(i => i.imageCount > 0).length}`);
    console.log(`❌ Without images: ${localInstallations.filter(i => i.imageCount === 0).length}\n`);
    
    // 3. Get all Sanity installations
    console.log('📖 Fetching installations from Sanity...');
    const sanityInstallations = await sanity.fetch(`
      *[_type == "installation"] {
        _id,
        title,
        slug,
        imageReferences,
        imageCount,
        coverImagePath
      }
    `);
    console.log(`✓ Found ${sanityInstallations.length} installations in Sanity\n`);
    
    // 4. Update each Sanity installation with matching local data
    let updated = 0;
    let skipped = 0;
    let notFound = 0;
    
    for (const localInstall of localInstallations) {
      // Skip if no images
      if (localInstall.imageCount === 0) continue;
      
      // Find matching Sanity installation
      const sanityInstall = sanityInstallations.find(s => 
        s.title?.en === localInstall.title
      );
      
      if (!sanityInstall) {
        console.log(`❓ Not found in Sanity: "${localInstall.title}"`);
        notFound++;
        continue;
      }
      
      // Skip if already has images
      if (sanityInstall.imageReferences && sanityInstall.imageReferences.length > 0) {
        console.log(`⏭️ Already has images: "${localInstall.title}"`);
        skipped++;
        continue;
      }
      
      // Update Sanity document
      try {
        await sanity
          .patch(sanityInstall._id)
          .set({
            imageReferences: localInstall.imageReferences,
            imageCount: localInstall.imageCount,
            coverImagePath: localInstall.coverImagePath
          })
          .commit();
        
        console.log(`✅ Updated: "${localInstall.title}" with ${localInstall.imageCount} images`);
        updated++;
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Failed to update "${localInstall.title}": ${error.message}`);
      }
    }
    
    // 5. Summary
    console.log(`\n${'='.repeat(50)}`);
    console.log('📊 MIGRATION COMPLETE!');
    console.log(`${'='.repeat(50)}`);
    console.log(`✅ Updated: ${updated} installations`);
    console.log(`⏭️ Skipped (already had images): ${skipped}`);
    console.log(`❓ Not found in Sanity: ${notFound}`);
    console.log(`${'='.repeat(50)}\n`);
    
    if (updated > 0) {
      console.log('🎉 SUCCESS! Your installations should now display with images!');
      console.log('\n📋 Next steps:');
      console.log('1. Check: https://tpv.rosehill.group/installations.html');
      console.log('2. Verify: https://tpv.rosehill.group/admin/sanity/debug-image-data.html');
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Check for token
if (!SANITY_TOKEN) {
  console.error('❌ SANITY_WRITE_TOKEN environment variable is required!');
  console.log('\nTo get a Sanity token:');
  console.log('1. Go to: https://www.sanity.io/manage/project/68ola3dd/api');
  console.log('2. Create a new token with "Editor" or "Deploy Studio" permissions');
  console.log('3. Run this script with:');
  console.log('   SANITY_WRITE_TOKEN="your-token-here" node auto-migrate-all-images.js\n');
  process.exit(1);
}

// Run the migration
console.log('='.repeat(50));
console.log('AUTOMATED IMAGE MIGRATION SCRIPT');
console.log('='.repeat(50) + '\n');

migrateAllInstallations();