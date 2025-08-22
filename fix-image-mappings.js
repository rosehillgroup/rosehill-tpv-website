#!/usr/bin/env node

/**
 * Fix Image Mappings in Sanity
 * 
 * This script fixes the incorrect image mappings in Sanity by:
 * 1. Reading the original installations.json with correct image mappings
 * 2. Matching Sanity installations with original data by title/content similarity
 * 3. Updating Sanity records with the correct image references
 */

import { createClient } from '@sanity/client'
import fs from 'fs'

// Sanity configuration
const sanity = createClient({
  projectId: '68ola3dd',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skrD4arZj8BnTrBl59CZtTc5cGPeLzmznMvkEGVOkbHq2ZElekjb97yFSwwErxmifyXtrcwMWS5Le25FuubBMiMa8Fs6QeEjTluq37hO0FDW61nAUokGZWgrBHPRH0qXMStwAjfnqNGkKIoWm33tSyevLvFtsWtXdDheVAjqXYkYMPH6VNJ6',
})

const DRY_RUN = process.argv.includes('--dry-run')

// Load original installations data
function loadOriginalInstallations() {
  try {
    const data = fs.readFileSync('./installations.json', 'utf8')
    const parsed = JSON.parse(data)
    return parsed.installations || []
  } catch (error) {
    console.error('❌ Failed to load installations.json:', error.message)
    process.exit(1)
  }
}

// Helper function to get localized field
function getLocalizedField(field, locale = 'en') {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[locale] || field.en || ''
}

// Calculate similarity between two strings (simple approach)
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0
  
  str1 = str1.toLowerCase().trim()
  str2 = str2.toLowerCase().trim()
  
  // Exact match
  if (str1 === str2) return 1.0
  
  // Check if one contains the other
  if (str1.includes(str2) || str2.includes(str1)) return 0.8
  
  // Simple word overlap scoring
  const words1 = str1.split(/\s+/)
  const words2 = str2.split(/\s+/)
  const commonWords = words1.filter(word => words2.includes(word))
  
  return commonWords.length / Math.max(words1.length, words2.length)
}

// Find the best match for a Sanity installation in original data
function findBestMatch(sanityInstallation, originalInstallations) {
  const sanityTitle = getLocalizedField(sanityInstallation.title).toLowerCase()
  const sanityOverview = getLocalizedField(sanityInstallation.overview) || ''
  
  let bestMatch = null
  let bestScore = 0
  
  for (const original of originalInstallations) {
    // Skip if no images in original
    if (!original.images || original.images.length === 0) continue
    
    // Calculate title similarity
    const titleScore = calculateSimilarity(sanityTitle, original.title)
    
    // Calculate description similarity
    const originalDesc = Array.isArray(original.description) 
      ? original.description.join(' ') 
      : original.description || ''
    const descScore = calculateSimilarity(sanityOverview, originalDesc)
    
    // Combined score (title weighted higher)
    const combinedScore = (titleScore * 0.7) + (descScore * 0.3)
    
    if (combinedScore > bestScore && combinedScore > 0.3) { // Minimum threshold
      bestScore = combinedScore
      bestMatch = {
        original,
        score: combinedScore,
        titleScore,
        descScore
      }
    }
  }
  
  return bestMatch
}

async function fixImageMappings() {
  console.log('🔧 Starting image mapping fix...')
  console.log(`${DRY_RUN ? '🧪 DRY RUN MODE - No changes will be made' : '💾 LIVE MODE - Changes will be committed'}`)
  console.log('=' .repeat(60))
  
  // Load original data
  const originalInstallations = loadOriginalInstallations()
  console.log(`📂 Loaded ${originalInstallations.length} original installations`)
  
  // Fetch current Sanity installations
  console.log('🔍 Fetching Sanity installations...')
  const sanityInstallations = await sanity.fetch(`
    *[_type == "installation"] {
      _id,
      title,
      overview,
      imageReferences,
      coverImagePath,
      imageCount
    }
  `)
  
  console.log(`📊 Found ${sanityInstallations.length} installations in Sanity`)
  console.log('\\n🔄 Matching installations and fixing image mappings...\\n')
  
  const results = {
    matched: 0,
    updated: 0,
    skipped: 0,
    errors: []
  }
  
  for (const sanityInstallation of sanityInstallations) {
    const sanityTitle = getLocalizedField(sanityInstallation.title)
    
    try {
      // Find best match in original data
      const match = findBestMatch(sanityInstallation, originalInstallations)
      
      if (!match) {
        console.log(`⚠️  No match found for: "${sanityTitle}"`)
        results.skipped++
        continue
      }
      
      console.log(`✅ Matched: "${sanityTitle}"`)
      console.log(`   → "${match.original.title}" (score: ${match.score.toFixed(2)})`)
      console.log(`   → Images: ${match.original.images.join(', ')}`)
      
      results.matched++
      
      // Check if images need updating
      const currentImages = sanityInstallation.imageReferences || []
      const correctImages = match.original.images
      
      // Simple array comparison
      const imagesMatch = currentImages.length === correctImages.length && 
                         currentImages.every((img, i) => img === correctImages[i])
      
      if (imagesMatch) {
        console.log(`   ✓ Images already correct`)
        continue
      }
      
      // Update Sanity installation
      if (DRY_RUN) {
        console.log(`   🧪 [DRY RUN] Would update images from [${currentImages.join(', ')}] to [${correctImages.join(', ')}]`)
      } else {
        console.log(`   🔄 Updating images...`)
        
        await sanity
          .patch(sanityInstallation._id)
          .set({
            imageReferences: correctImages,
            coverImagePath: correctImages[0] || null,
            imageCount: correctImages.length
          })
          .commit()
        
        console.log(`   ✅ Updated successfully`)
      }
      
      results.updated++
      
    } catch (error) {
      console.error(`   ❌ Error processing "${sanityTitle}":`, error.message)
      results.errors.push({
        title: sanityTitle,
        error: error.message
      })
    }
    
    console.log('') // Empty line for readability
  }
  
  // Final summary
  console.log('\\n' + '='.repeat(60))
  console.log('🎉 IMAGE MAPPING FIX COMPLETE!')
  console.log('='.repeat(60))
  console.log(`✅ Installations matched: ${results.matched}`)
  console.log(`🔄 Installations updated: ${results.updated}`)
  console.log(`⚠️  Installations skipped: ${results.skipped}`)
  console.log(`❌ Errors: ${results.errors.length}`)
  
  if (results.errors.length > 0) {
    console.log('\\n❌ Error details:')
    results.errors.forEach(err => {
      console.log(`  • ${err.title}: ${err.error}`)
    })
  }
  
  if (!DRY_RUN && results.updated > 0) {
    console.log('\\n🔄 Image mappings have been fixed in Sanity!')
    console.log('📝 Next step: Regenerate installation pages with corrected data')
  }
}

// Run the fix
fixImageMappings().catch(error => {
  console.error('💥 Failed to fix image mappings:', error)
  process.exit(1)
})