#!/usr/bin/env node

// Quick debug script to check image data in Sanity
import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: '68ola3dd',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_READ_TOKEN || process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
});

async function checkImageData() {
  try {
    // Get first 5 installations with all image-related fields including new ones
    const installations = await sanity.fetch(`
      *[_type == "installation"][0...5] {
        _id,
        title,
        coverImage,
        gallery,
        imageReferences,
        imageCount,
        coverImagePath,
        "hasGallery": defined(gallery),
        "hasCoverImage": defined(coverImage),
        "hasImageReferences": defined(imageReferences),
        "hasImageCount": defined(imageCount),
        "galleryLength": length(gallery),
        "imageReferencesLength": length(imageReferences),
      }
    `);
    
    console.log('=== Installation Image Data ===');
    installations.forEach((install, i) => {
      console.log(`\n${i + 1}. ${install.title?.en || 'Untitled'}`);
      console.log(`   ID: ${install._id}`);
      console.log(`   Has Cover Image: ${install.hasCoverImage}`);
      console.log(`   Has Gallery: ${install.hasGallery}`);
      console.log(`   Gallery Length: ${install.galleryLength || 0}`);
      console.log(`   Has Image References: ${install.hasImageReferences}`);
      console.log(`   Has Image Count: ${install.hasImageCount}`);
      console.log(`   Image References Length: ${install.imageReferencesLength || 0}`);
      console.log(`   Image Count Value: ${install.imageCount || 0}`);
      console.log(`   Cover Image Path: ${install.coverImagePath || 'None'}`);
      
      if (install.imageReferences && install.imageReferences.length > 0) {
        console.log(`   Image References:`, JSON.stringify(install.imageReferences.slice(0, 2), null, 2));
      }
      
      if (install.coverImage) {
        console.log(`   Cover Image Structure:`, JSON.stringify(install.coverImage, null, 2));
      }
      
      if (install.gallery && install.gallery.length > 0) {
        console.log(`   Gallery Structure:`, JSON.stringify(install.gallery[0], null, 2));
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkImageData();