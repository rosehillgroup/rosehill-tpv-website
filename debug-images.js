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
    // Get first 3 installations with all image-related fields
    const installations = await sanity.fetch(`
      *[_type == "installation"][0...3] {
        _id,
        title,
        coverImage,
        gallery,
        "hasGallery": defined(gallery),
        "hasCoverImage": defined(coverImage),
        "galleryLength": length(gallery),
      }
    `);
    
    console.log('=== Installation Image Data ===');
    installations.forEach((install, i) => {
      console.log(`\n${i + 1}. ${install.title?.en || 'Untitled'}`);
      console.log(`   ID: ${install._id}`);
      console.log(`   Has Cover Image: ${install.hasCoverImage}`);
      console.log(`   Has Gallery: ${install.hasGallery}`);
      console.log(`   Gallery Length: ${install.galleryLength || 0}`);
      
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