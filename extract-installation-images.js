#!/usr/bin/env node

// Script to extract image data from existing installation HTML files
// and update Sanity with the image references

import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: '68ola3dd',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
});

const installationsDir = './installations';
const imagesDir = './images/installations';

// Function to extract images from an installation HTML file
function extractImagesFromHTML(htmlContent) {
  const images = [];
  
  // Look for img tags with src pointing to images/installations/
  const imgRegex = /<img[^>]*src=["']([^"']*images\/installations\/[^"']*)["'][^>]*>/gi;
  let match;
  
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const imgPath = match[1];
    // Clean up the path and get just the filename
    const filename = imgPath.split('/').pop();
    if (filename && !images.includes(filename)) {
      images.push(filename);
    }
  }
  
  // Also look for background-image CSS properties
  const bgImgRegex = /background-image:\s*url\(['"]?([^'")]*images\/installations\/[^'")]*)['"]?\)/gi;
  while ((match = bgImgRegex.exec(htmlContent)) !== null) {
    const imgPath = match[1];
    const filename = imgPath.split('/').pop();
    if (filename && !images.includes(filename)) {
      images.push(filename);
    }
  }
  
  return images;
}

// Function to generate slug from filename
function generateSlugFromFilename(filename) {
  return filename
    .replace(/\.html$/, '')
    .replace(/\d+-/g, '') // Remove timestamp prefixes
    .toLowerCase();
}

async function extractAndUpdateImages() {
  try {
    // Get all HTML files in installations directory
    const files = fs.readdirSync(installationsDir)
      .filter(file => file.endsWith('.html') && !file.includes('.backup'))
      .slice(0, 10); // Process first 10 for testing
    
    console.log(`Found ${files.length} installation files to process`);
    
    // Get existing installations from Sanity to match by slug
    const existingInstallations = await sanity.fetch(`
      *[_type == "installation"] {
        _id,
        title,
        slug,
        "slugString": slug.en.current
      }
    `);
    
    console.log(`Found ${existingInstallations.length} installations in Sanity`);
    
    const updates = [];
    
    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      console.log(`\\n[${i + 1}/${files.length}] Processing: ${filename}`);
      
      try {
        const filePath = path.join(installationsDir, filename);
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        
        // Extract images from the HTML
        const images = extractImagesFromHTML(htmlContent);
        console.log(`  Found ${images.length} images: ${images.slice(0, 3).join(', ')}${images.length > 3 ? '...' : ''}`);
        
        if (images.length === 0) continue;
        
        // Try to match this file to a Sanity installation
        const fileSlug = generateSlugFromFilename(filename);
        const matchedInstall = existingInstallations.find(install => {
          const sanitySlug = install.slugString || '';
          // Try exact match first
          if (sanitySlug === fileSlug) return true;
          // Try partial match
          if (sanitySlug.includes(fileSlug) || fileSlug.includes(sanitySlug)) return true;
          // Try title-based matching
          const title = install.title?.en?.toLowerCase() || '';
          if (title && fileSlug.includes(title.replace(/\\s+/g, '-'))) return true;
          return false;
        });
        
        if (matchedInstall) {
          console.log(`  ✓ Matched to: ${matchedInstall.title?.en || 'Untitled'} (${matchedInstall._id})`);
          
          // Prepare image references for Sanity (as strings for now)
          const imageRefs = images.map(img => `images/installations/${img}`);
          
          updates.push({
            installationId: matchedInstall._id,
            title: matchedInstall.title?.en || filename,
            images: imageRefs,
            coverImage: imageRefs[0] // Use first image as cover
          });
        } else {
          console.log(`  ⚠️  No match found for: ${fileSlug}`);
        }
        
      } catch (error) {
        console.error(`  ✗ Error processing ${filename}:`, error.message);
      }
    }
    
    console.log(`\\n=== Summary ===`);
    console.log(`Files processed: ${files.length}`);
    console.log(`Installations matched: ${updates.length}`);
    console.log(`Ready to update Sanity: ${updates.length > 0 ? 'YES' : 'NO'}`);
    
    if (updates.length > 0) {
      console.log('\\nFirst 3 matches:');
      updates.slice(0, 3).forEach((update, i) => {
        console.log(`${i + 1}. ${update.title}: ${update.images.length} images`);
      });
      
      // Ask user before applying updates
      console.log('\\n⚠️  This will update Sanity installations with image data.');
      console.log('Set environment variable APPLY_UPDATES=true to proceed with updates.');
      
      if (process.env.APPLY_UPDATES === 'true') {
        console.log('\\n🚀 Applying updates to Sanity...');
        
        for (const update of updates) {
          try {
            // For now, just add the image paths as strings
            // Later we can upload them as proper Sanity assets
            await sanity.patch(update.installationId)
              .set({
                imageReferences: update.images,
                // Add a simple coverImage reference 
                coverImagePath: update.coverImage
              })
              .commit();
            
            console.log(`✓ Updated ${update.title}`);
          } catch (error) {
            console.error(`✗ Failed to update ${update.title}:`, error.message);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

extractAndUpdateImages();