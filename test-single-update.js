#!/usr/bin/env node

// Test script to manually update one installation with image data
import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: '68ola3dd',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
});

async function testSingleUpdate() {
  try {
    // Get the first installation
    const installations = await sanity.fetch(`
      *[_type == "installation"][0...1] {
        _id,
        title
      }
    `);
    
    if (installations.length === 0) {
      console.log('No installations found');
      return;
    }
    
    const testInstallation = installations[0];
    console.log(`Testing update on: ${testInstallation.title?.en || 'Untitled'}`);
    console.log(`ID: ${testInstallation._id}`);
    
    // Try to update with test image data
    const testImages = [
      'images/installations/test-image-1.jpg',
      'images/installations/test-image-2.jpg'
    ];
    
    console.log('Attempting to update...');
    
    const result = await sanity
      .patch(testInstallation._id)
      .set({
        imageReferences: testImages,
        imageCount: testImages.length,
        coverImagePath: testImages[0]
      })
      .commit();
    
    console.log('✅ Update successful!');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    // Verify the update
    console.log('\nVerifying update...');
    const updated = await sanity.fetch(`
      *[_type == "installation" && _id == "${testInstallation._id}"][0] {
        _id,
        title,
        imageReferences,
        imageCount,
        coverImagePath
      }
    `);
    
    console.log('Updated data:', JSON.stringify(updated, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
  }
}

testSingleUpdate();