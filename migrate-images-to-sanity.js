#!/usr/bin/env node

/**
 * Migration script to add missing image data from Supabase to existing Sanity installations
 * This script updates existing Sanity documents with image references from Supabase
 */

import { createClient } from '@supabase/supabase-js'
import { createClient as createSanityClient } from '@sanity/client'
import fs from 'fs'

// Supabase configuration (your existing database)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://otidaseqlgubqzsqazqt.supabase.co'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4'

// Sanity configuration (your new CMS)
const SANITY_PROJECT_ID = '68ola3dd'
const SANITY_DATASET = 'production'
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN // You'll need to set this

// Initialize clients
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const sanity = createSanityClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: false,
  token: SANITY_TOKEN,
  apiVersion: '2023-05-03',
})

// Helper to generate slug from title (match the original migration)
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-|-$/g, '')
}

// Helper to process image data from Supabase
function processImages(supabaseImages) {
  if (!supabaseImages || !Array.isArray(supabaseImages)) {
    return {
      imageReferences: [],
      imageCount: 0,
      coverImagePath: null
    }
  }

  // Filter out any null/undefined entries and process image paths
  const validImages = supabaseImages
    .filter(img => img && typeof img === 'string' && img.trim() !== '')
    .map(img => {
      // If image is just a filename, prepend with images/installations/
      if (!img.startsWith('http') && !img.startsWith('images/')) {
        return `images/installations/${img}`
      }
      return img
    })

  return {
    imageReferences: validImages,
    imageCount: validImages.length,
    coverImagePath: validImages.length > 0 ? validImages[0] : null
  }
}

async function migrateImageData() {
  console.log('🖼️  Starting image data migration from Supabase to Sanity...')
  
  try {
    // Fetch all installations from Supabase with image data
    console.log('📖 Fetching installations with images from Supabase...')
    const { data: supabaseInstallations, error } = await supabase
      .from('installations')
      .select('id, title, images, slug')
      .not('images', 'is', null)
      .order('installation_date', { ascending: false })
    
    if (error) {
      throw new Error(`Failed to fetch installations from Supabase: ${error.message}`)
    }
    
    console.log(`✓ Found ${supabaseInstallations.length} installations with images in Supabase`)

    // Fetch all installations from Sanity
    console.log('📖 Fetching installations from Sanity...')
    const sanityInstallations = await sanity.fetch(`
      *[_type == "installation"] {
        _id,
        title,
        slug,
        imageReferences,
        imageCount,
        coverImagePath
      }
    `)
    
    console.log(`✓ Found ${sanityInstallations.length} installations in Sanity`)

    const migrationResults = []
    let updated = 0
    let skipped = 0
    let notFound = 0

    for (let i = 0; i < supabaseInstallations.length; i++) {
      const supabaseInstall = supabaseInstallations[i]
      console.log(`\n[${i + 1}/${supabaseInstallations.length}] Processing: ${supabaseInstall.title}`)
      
      try {
        // Find matching Sanity installation by title
        const titleToMatch = supabaseInstall.title
        const sanityInstall = sanityInstallations.find(s => 
          s.title?.en === titleToMatch
        )
        
        if (!sanityInstall) {
          console.log(`  ⚠️  No matching Sanity installation found for "${titleToMatch}"`)
          notFound++
          migrationResults.push({
            supabaseTitle: titleToMatch,
            sanityId: null,
            success: false,
            reason: 'not-found-in-sanity'
          })
          continue
        }

        // Check if images already exist
        if (sanityInstall.imageReferences && sanityInstall.imageReferences.length > 0) {
          console.log(`  ⏭️  Skipping - already has ${sanityInstall.imageReferences.length} images`)
          skipped++
          migrationResults.push({
            supabaseTitle: titleToMatch,
            sanityId: sanityInstall._id,
            success: true,
            reason: 'already-has-images'
          })
          continue
        }

        // Process image data
        const imageData = processImages(supabaseInstall.images)
        
        console.log(`  📸 Processing ${imageData.imageCount} images`)
        console.log(`  🏞️  Cover image: ${imageData.coverImagePath}`)
        
        if (imageData.imageCount === 0) {
          console.log(`  ⚠️  No valid images found in Supabase data`)
          migrationResults.push({
            supabaseTitle: titleToMatch,
            sanityId: sanityInstall._id,
            success: false,
            reason: 'no-valid-images'
          })
          continue
        }

        // Update Sanity document with image data
        const result = await sanity
          .patch(sanityInstall._id)
          .set({
            imageReferences: imageData.imageReferences,
            imageCount: imageData.imageCount,
            coverImagePath: imageData.coverImagePath
          })
          .commit()
        
        console.log(`  ✅ Updated Sanity document: ${result._id}`)
        updated++
        
        migrationResults.push({
          supabaseTitle: titleToMatch,
          sanityId: sanityInstall._id,
          success: true,
          imageCount: imageData.imageCount,
          coverImage: imageData.coverImagePath,
          reason: 'updated'
        })
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (error) {
        console.error(`  ❌ Failed to update "${supabaseInstall.title}": ${error.message}`)
        migrationResults.push({
          supabaseTitle: supabaseInstall.title,
          sanityId: null,
          success: false,
          error: error.message,
          reason: 'update-failed'
        })
      }
    }
    
    // Save migration results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const resultsFile = `image-migration-results-${timestamp}.json`
    fs.writeFileSync(resultsFile, JSON.stringify(migrationResults, null, 2))
    
    // Summary
    console.log(`\n📊 Image Migration Summary:`)
    console.log(`✅ Updated: ${updated}`)
    console.log(`⏭️  Skipped (already has images): ${skipped}`)
    console.log(`❓ Not found in Sanity: ${notFound}`)
    console.log(`❌ Failed: ${migrationResults.filter(r => !r.success && r.reason !== 'not-found-in-sanity' && r.reason !== 'already-has-images').length}`)
    console.log(`📝 Results saved to: ${resultsFile}`)
    
    if (updated > 0) {
      console.log(`\n🎉 Successfully migrated images for ${updated} installations!`)
      console.log(`\n📋 Next steps:`)
      console.log(`1. Check your installations page: https://tpv.rosehill.group/installations.html`)
      console.log(`2. Use the debug tool: https://tpv.rosehill.group/admin/sanity/debug-image-data.html`)
      console.log(`3. Verify individual installation pages are working`)
    }
    
  } catch (error) {
    console.error('💥 Image migration failed:', error)
    process.exit(1)
  }
}

// Check for required environment variables
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
  
  console.log('\n📋 This script will:')
  console.log('• Read image data from your Supabase installations table')
  console.log('• Find matching installations in Sanity (by title)')
  console.log('• Add imageReferences, imageCount, and coverImagePath fields')
  console.log('• Skip installations that already have images')
  console.log('\n⚠️  Make sure you have a backup of your Sanity data before proceeding.')
  
  await migrateImageData()
}

// Run the migration
main().catch(console.error)