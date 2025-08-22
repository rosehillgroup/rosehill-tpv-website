#!/usr/bin/env node

/**
 * SMART Image Migration - Handles duplicates and fuzzy matching
 * This will ensure ALL installations get their images
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Extract title from HTML content
function extractTitle(htmlContent) {
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
  if (!titleMatch) return null;
  
  let title = titleMatch[1];
  
  // Remove various suffixes
  title = title.replace(/\s*\|\s*Rosehill TPV.*Installation$/i, '');
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
  const imagesMatch = htmlContent.match(/const\s+images\s*=\s*\[(.*?)\]/s);
  if (!imagesMatch) return [];
  
  try {
    let arrayContent = imagesMatch[1];
    arrayContent = arrayContent.replace(/\/\/.*$/gm, '').replace(/\/\*.*?\*\//gs, '');
    arrayContent = arrayContent
      .trim()
      .replace(/'/g, '"')
      .replace(/,\s*]/g, ']')
      .replace(/,\s*,/g, ',');
    
    const imageArray = JSON.parse(`[${arrayContent}]`);
    
    // Filter out placeholder images
    const realImages = imageArray.filter(img => 
      typeof img === 'string' && 
      !img.startsWith('placeholder-') &&
      img.trim() !== ''
    );
    
    return realImages;
  } catch (error) {
    return [];
  }
}

// Process images to proper format
function processImages(imageArray) {
  if (!imageArray || imageArray.length === 0) {
    return { imageReferences: [], imageCount: 0, coverImagePath: null };
  }

  const imageReferences = imageArray.map(img => {
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

// Normalize title for better matching
function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Find best match for a title
function findBestMatch(targetTitle, sanityInstallations) {
  const normalizedTarget = normalizeTitle(targetTitle);
  
  // 1. Try exact match first
  let exactMatch = sanityInstallations.find(s => 
    normalizeTitle(s.title?.en || '') === normalizedTarget
  );
  if (exactMatch) return exactMatch;
  
  // 2. Try partial match (contains)
  let partialMatch = sanityInstallations.find(s => {
    const sanityNormalized = normalizeTitle(s.title?.en || '');
    return sanityNormalized.includes(normalizedTarget) || normalizedTarget.includes(sanityNormalized);
  });
  if (partialMatch) return partialMatch;
  
  // 3. Try fuzzy match (similar words)
  const targetWords = normalizedTarget.split(' ').filter(w => w.length > 2);
  let bestMatch = null;
  let bestScore = 0;
  
  for (const install of sanityInstallations) {
    const sanityWords = normalizeTitle(install.title?.en || '').split(' ').filter(w => w.length > 2);
    const commonWords = targetWords.filter(word => sanityWords.includes(word));
    const score = commonWords.length / Math.max(targetWords.length, sanityWords.length);
    
    if (score > bestScore && score > 0.3) { // At least 30% similarity
      bestScore = score;
      bestMatch = install;
    }
  }
  
  return bestMatch;
}

async function smartMigration() {
  console.log('🧠 Starting SMART image migration...\n');
  
  try {
    // 1. Read all installation HTML files
    const installationsDir = path.join(__dirname, 'installations');
    const files = fs.readdirSync(installationsDir)
      .filter(file => file.endsWith('.html') && !file.endsWith('.backup'));
    
    console.log(`📁 Found ${files.length} installation HTML files`);
    
    // 2. Process files and group by title (handle duplicates)
    const installationMap = new Map();
    
    for (const file of files) {
      const filePath = path.join(installationsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const title = extractTitle(content);
      const images = extractImages(content);
      
      if (title && images.length > 0) {
        const imageData = processImages(images);
        
        // If we already have this title, prefer the one with more images
        if (installationMap.has(title)) {
          const existing = installationMap.get(title);
          if (imageData.imageCount > existing.imageCount) {
            installationMap.set(title, { filename: file, title, ...imageData });
          }
        } else {
          installationMap.set(title, { filename: file, title, ...imageData });
        }
      }
    }
    
    const uniqueInstallations = Array.from(installationMap.values());
    console.log(`📊 Unique installations with images: ${uniqueInstallations.length}`);
    
    // 3. Get all Sanity installations
    console.log('\n📖 Fetching installations from Sanity...');
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
    
    // 4. Smart matching and updating
    let updated = 0;
    let skipped = 0;
    let notFound = 0;
    
    for (const localInstall of uniqueInstallations) {
      console.log(`🔍 Processing: "${localInstall.title}"`);
      
      // Find best match
      const sanityMatch = findBestMatch(localInstall.title, sanityInstallations);
      
      if (!sanityMatch) {
        console.log(`  ❓ No match found in Sanity`);
        notFound++;
        continue;
      }
      
      const sanityTitle = sanityMatch.title?.en || 'Untitled';
      
      // Check if already has images
      if (sanityMatch.imageReferences && sanityMatch.imageReferences.length > 0) {
        console.log(`  ⏭️ "${sanityTitle}" already has ${sanityMatch.imageReferences.length} images`);
        skipped++;
        continue;
      }
      
      // Update with images
      try {
        await sanity
          .patch(sanityMatch._id)
          .set({
            imageReferences: localInstall.imageReferences,
            imageCount: localInstall.imageCount,
            coverImagePath: localInstall.coverImagePath
          })
          .commit();
        
        console.log(`  ✅ Updated "${sanityTitle}" with ${localInstall.imageCount} images`);
        updated++;
        
        // Remove from available matches to avoid duplicates
        const index = sanityInstallations.indexOf(sanityMatch);
        if (index > -1) sanityInstallations.splice(index, 1);
        
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.log(`  ❌ Failed to update "${sanityTitle}": ${error.message}`);
      }
    }
    
    // 5. Summary
    console.log(`\n${'='.repeat(50)}`);
    console.log('🎯 SMART MIGRATION COMPLETE!');
    console.log(`${'='.repeat(50)}`);
    console.log(`✅ Updated: ${updated} installations`);
    console.log(`⏭️ Skipped (already had images): ${skipped}`);
    console.log(`❓ Not found in Sanity: ${notFound}`);
    console.log(`📊 Total installations in Sanity: ${sanityInstallations.length + updated}`);
    console.log(`${'='.repeat(50)}\n`);
    
    if (updated > 0) {
      console.log('🎉 SUCCESS! Check your installations page now!');
      console.log('🔗 https://tpv.rosehill.group/installations.html');
      console.log('🔗 https://tpv.rosehill.group/admin/sanity/debug-image-data.html');
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

console.log('='.repeat(50));
console.log('🧠 SMART IMAGE MIGRATION');
console.log('Handles duplicates and fuzzy matching');
console.log('='.repeat(50) + '\n');

smartMigration();