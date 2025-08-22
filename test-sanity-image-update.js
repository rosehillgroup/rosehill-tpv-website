#!/usr/bin/env node

/**
 * Test script to verify Sanity image field updates work correctly
 * This tests updating imageReferences, imageCount, and coverImagePath fields
 */

import { createClient as createSanityClient } from '@sanity/client'

// Sanity configuration
const SANITY_PROJECT_ID = '68ola3dd'
const SANITY_DATASET = 'production'
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN

// Initialize Sanity client
const sanity = createSanityClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: false,
  token: SANITY_TOKEN,
  apiVersion: '2023-05-03',
})

async function testImageFieldUpdate() {
  console.log('🧪 Testing Sanity image field updates...')
  
  try {
    // Get the first installation without image data
    console.log('📖 Finding installation to test...')
    const installations = await sanity.fetch(`
      *[_type == "installation" && !defined(imageReferences)][0...1] {
        _id,
        title,
        imageReferences,
        imageCount,
        coverImagePath
      }
    `)
    
    if (installations.length === 0) {
      console.log('⚠️  No installations found without image data. Looking for any installation...')
      
      // Get any installation for testing
      const anyInstallations = await sanity.fetch(`
        *[_type == "installation"][0...1] {
          _id,
          title,
          imageReferences,
          imageCount,
          coverImagePath
        }
      `)
      
      if (anyInstallations.length === 0) {
        console.log('❌ No installations found in Sanity at all!')
        return
      }
      
      installations.push(anyInstallations[0])
    }
    
    const testInstallation = installations[0]
    const title = testInstallation.title?.en || 'Untitled'
    
    console.log(`✓ Found installation to test: "${title}"`)
    console.log(`  ID: ${testInstallation._id}`)
    console.log(`  Current imageReferences: ${testInstallation.imageReferences ? testInstallation.imageReferences.length + ' items' : 'Not set'}`)
    console.log(`  Current imageCount: ${testInstallation.imageCount || 'Not set'}`)
    console.log(`  Current coverImagePath: ${testInstallation.coverImagePath || 'Not set'}`)
    
    // Test data
    const testImageData = {
      imageReferences: [
        'images/installations/test-image-1.jpg',
        'images/installations/test-image-2.jpg',
        'images/installations/test-image-3.jpg'
      ],
      imageCount: 3,
      coverImagePath: 'images/installations/test-image-1.jpg'
    }
    
    console.log('\n🔄 Attempting to update image fields...')
    console.log(`  Setting imageReferences: ${testImageData.imageReferences.length} items`)
    console.log(`  Setting imageCount: ${testImageData.imageCount}`)
    console.log(`  Setting coverImagePath: ${testImageData.coverImagePath}`)
    
    // Perform the update
    const result = await sanity
      .patch(testInstallation._id)
      .set(testImageData)
      .commit()
    
    console.log('✅ Update successful!')
    console.log(`  Updated document ID: ${result._id}`)
    console.log(`  Revision: ${result._rev}`)
    
    // Verify the update by fetching the document again
    console.log('\n🔍 Verifying update...')
    const updated = await sanity.fetch(`
      *[_type == "installation" && _id == $id][0] {
        _id,
        title,
        imageReferences,
        imageCount,
        coverImagePath
      }
    `, { id: testInstallation._id })
    
    if (updated) {
      console.log('✅ Verification successful!')
      console.log(`  Title: ${updated.title?.en || 'Untitled'}`)
      console.log(`  ImageReferences: ${updated.imageReferences ? updated.imageReferences.length + ' items' : 'Not set'}`)
      console.log(`  ImageCount: ${updated.imageCount || 'Not set'}`)
      console.log(`  CoverImagePath: ${updated.coverImagePath || 'Not set'}`)
      
      if (updated.imageReferences && updated.imageReferences.length > 0) {
        console.log(`  First image: ${updated.imageReferences[0]}`)
      }
      
      // Check if the update was successful
      const isSuccessful = 
        updated.imageReferences && 
        updated.imageReferences.length === testImageData.imageCount &&
        updated.imageCount === testImageData.imageCount &&
        updated.coverImagePath === testImageData.coverImagePath
      
      if (isSuccessful) {
        console.log('\n🎉 Test PASSED! Image fields can be updated successfully.')
        console.log('✅ Ready to run the full migration script.')
      } else {
        console.log('\n❌ Test FAILED! Data mismatch detected.')
        console.log('Expected vs Actual:')
        console.log(`  ImageCount: ${testImageData.imageCount} vs ${updated.imageCount}`)
        console.log(`  CoverImagePath: ${testImageData.coverImagePath} vs ${updated.coverImagePath}`)
        console.log(`  ImageReferences length: ${testImageData.imageReferences.length} vs ${updated.imageReferences ? updated.imageReferences.length : 0}`)
      }
    } else {
      console.log('❌ Failed to verify update - document not found')
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error)
    if (error.statusCode) {
      console.error(`  Status: ${error.statusCode}`)
    }
    if (error.details) {
      console.error(`  Details:`, error.details)
    }
  }
}

// Check environment
function checkEnvironment() {
  if (!SANITY_TOKEN) {
    console.error('❌ SANITY_WRITE_TOKEN environment variable is required')
    console.log('Please set it with your Sanity write token:')
    console.log('export SANITY_WRITE_TOKEN="your_token_here"')
    process.exit(1)
  }
}

// Main execution
async function main() {
  console.log('🔧 Checking environment...')
  checkEnvironment()
  
  console.log('✅ Environment check passed')
  console.log('\nThis test will:')
  console.log('• Find an installation document in Sanity')
  console.log('• Update it with test image data')
  console.log('• Verify the update was successful')
  console.log('• Confirm the migration script will work')
  
  await testImageFieldUpdate()
}

// Run the test
main().catch(console.error)