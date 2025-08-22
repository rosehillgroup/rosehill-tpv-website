#!/usr/bin/env node

/**
 * Comprehensive Supabase to Sanity Migration
 * 
 * This script performs a complete, idempotent migration that:
 * 1. Exports all installations from Supabase with proper image ordering
 * 2. Downloads and uploads images to Sanity Assets with hash-based deduplication
 * 3. Creates Sanity documents with text + images in single transaction
 * 4. Ensures perfect alignment between content and images
 */

import { createClient as createSupabase } from '@supabase/supabase-js'
import { createClient as createSanity } from '@sanity/client'
import fetch from 'node-fetch'
import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const SUPABASE_URL = "https://otidaseqlgubqzsqazqt.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWRhc2VxbGd1YnF6c3FhenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NjkzMzcsImV4cCI6MjA2NjM0NTMzN30.IR9Q5NrJuNC4frTc0Q2Snjz-_oIlkzFb3izk2iBisp4"
const SANITY_PROJECT_ID = '68ola3dd'
const SANITY_DATASET = 'production'
const SANITY_TOKEN = 'skrD4arZj8BnTrBl59CZtTc5cGPeLzmznMvkEGVOkbHq2ZElekjb97yFSwwErxmifyXtrcwMWS5Le25FuubBMiMa8Fs6QeEjTluq37hO0FDW61nAUokGZWgrBHPRH0qXMStwAjfnqNGkKIoWm33tSyevLvFtsWtXdDheVAjqXYkYMPH6VNJ6'

const DRY_RUN = process.argv.includes('--dry-run')
const CACHE_FILE = './asset-cache.json'

// Initialize clients
const supabase = createSupabase(SUPABASE_URL, SUPABASE_ANON_KEY)
const sanity = createSanity({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2023-05-03',
  token: SANITY_TOKEN,
  useCdn: false,
})

// Utility functions
function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

function createSlug(text) {
  if (!text) return 'untitled'
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .trim()                       // Remove leading/trailing whitespace
    .replace(/^-|-$/g, '')        // Remove leading/trailing hyphens
}

async function loadCache() {
  try {
    const cacheData = await fs.readFile(CACHE_FILE, 'utf8')
    return JSON.parse(cacheData)
  } catch (error) {
    console.log('📝 Starting with empty asset cache')
    return {}
  }
}

async function saveCache(cache) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2))
}

async function uploadImageOnce(imageUrl, cache, installationTitle) {
  // Return cached result if available
  if (cache[imageUrl]) {
    console.log(`    ♻️ Using cached asset for ${path.basename(imageUrl)}`)
    return cache[imageUrl]
  }

  try {
    console.log(`    📥 Downloading ${imageUrl}`)
    
    // Handle relative URLs
    let fullUrl = imageUrl
    if (imageUrl.startsWith('images/')) {
      fullUrl = `https://tpv.rosehill.group/${imageUrl}`
    }
    
    const response = await fetch(fullUrl)
    if (!response.ok) {
      console.log(`    ⚠️ Failed to fetch ${fullUrl}: ${response.status}`)
      return null
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const hash = sha256(buffer)
    
    // Check if we've already uploaded this exact image (by content hash)
    if (cache[hash]) {
      console.log(`    🔄 Duplicate content found, reusing asset`)
      cache[imageUrl] = cache[hash]
      return cache[hash]
    }

    if (DRY_RUN) {
      console.log(`    🧪 [DRY RUN] Would upload ${imageUrl} (${buffer.length} bytes, hash: ${hash.substring(0, 8)})`)
      const fakeAssetId = `image-${hash.substring(0, 8)}`
      cache[imageUrl] = fakeAssetId
      cache[hash] = fakeAssetId
      return fakeAssetId
    }

    // Upload to Sanity
    console.log(`    📤 Uploading to Sanity Assets (${buffer.length} bytes)`)
    const filename = path.basename(imageUrl) || `${installationTitle?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'installation'}.jpg`
    
    const asset = await sanity.assets.upload('image', buffer, {
      filename: filename,
      title: `${installationTitle} - ${filename}`,
    })

    console.log(`    ✅ Uploaded as ${asset._id}`)
    
    // Cache by both URL and content hash
    cache[imageUrl] = asset._id
    cache[hash] = asset._id
    
    return asset._id
    
  } catch (error) {
    console.log(`    ❌ Error uploading ${imageUrl}:`, error.message)
    return null
  }
}

async function processInstallation(installation, cache) {
  const title = installation.title || 'Untitled Installation'
  console.log(`\n🏗️ Processing: "${title}"`)
  
  // Process images in order - handle both URL strings and objects with url property
  const images = installation.images || []
  const imageUrls = images.map(img => typeof img === 'string' ? img : img?.url).filter(Boolean)
  
  console.log(`  📷 Found ${imageUrls.length} images`)
  
  const coverImageRef = imageUrls.length > 0
    ? await uploadImageOnce(imageUrls[0], cache, title)
    : null

  const galleryRefs = []
  if (imageUrls.length > 1) {
    for (let i = 1; i < imageUrls.length; i++) {
      const imageRef = await uploadImageOnce(imageUrls[i], cache, title)
      if (imageRef) {
        galleryRefs.push(imageRef)
      }
    }
  }

  // Generate slug
  const slug = createSlug(`${title} ${installation.location || ''}`)
  
  // Create Sanity document
  const docId = `installation.${installation.id}`
  const sanityDoc = {
    _id: docId,
    _type: 'installation',
    title: {
      en: title
    },
    slug: {
      en: {
        current: slug
      }
    },
    overview: {
      en: Array.isArray(installation.description) 
        ? installation.description.join('\n\n')
        : String(installation.description || installation.overview || `${title} installation featuring Rosehill TPV® surfaces.`)
    },
    location: {
      city: {
        en: installation.location?.split(',')[0]?.trim() || ''
      },
      country: {
        en: installation.location?.split(',')[1]?.trim() || installation.location || ''
      }
    },
    installationDate: installation.installation_date || new Date().toISOString().split('T')[0],
    application: installation.category || installation.application || 'Playground',
    tags: installation.tags || [],
    thanksTo: installation.thanksTo || installation.thanks_to || null,
    publishedLocales: ['en'],
    seo: {
      title: `${title} - ${installation.location || 'TPV Installation'}`,
      description: (Array.isArray(installation.description) 
        ? installation.description.join(' ')
        : String(installation.description || installation.overview || `${title} installation featuring Rosehill TPV® surfaces.`)).substring(0, 155)
    }
  }

  // Add images if we have them
  if (coverImageRef) {
    sanityDoc.coverImage = {
      _type: 'image',
      asset: {
        _ref: coverImageRef
      }
    }
  }

  if (galleryRefs.length > 0) {
    sanityDoc.gallery = galleryRefs.map(ref => ({
      _type: 'image',
      asset: {
        _ref: ref
      }
    }))
  }

  // Also store the original image references for fallback
  if (imageUrls.length > 0) {
    sanityDoc.imageReferences = imageUrls
    sanityDoc.imageCount = imageUrls.length
    sanityDoc.coverImagePath = imageUrls[0]
  }

  if (DRY_RUN) {
    console.log(`  🧪 [DRY RUN] Would create/update document:`, {
      _id: docId,
      title: sanityDoc.title.en,
      slug: sanityDoc.slug.en.current,
      coverImage: !!sanityDoc.coverImage,
      galleryCount: sanityDoc.gallery?.length || 0,
      imageReferencesCount: sanityDoc.imageReferences?.length || 0
    })
    return { success: true, id: docId }
  }

  try {
    console.log(`  📝 Creating/updating Sanity document ${docId}`)
    
    await sanity.transaction()
      .createOrReplace(sanityDoc)
      .commit()

    console.log(`  ✅ Successfully processed ${title}`)
    return { success: true, id: docId }
    
  } catch (error) {
    console.log(`  ❌ Error creating document for ${title}:`, error.message)
    return { success: false, id: docId, error: error.message }
  }
}

async function main() {
  console.log('🚀 Starting comprehensive Supabase to Sanity migration')
  console.log(`${DRY_RUN ? '🧪 DRY RUN MODE - No changes will be made' : '💾 LIVE MODE - Changes will be committed'}`)
  console.log('=' .repeat(60))

  // Load asset cache
  const cache = await loadCache()
  console.log(`📦 Loaded asset cache with ${Object.keys(cache).length} entries`)

  try {
    // Fetch all installations from Supabase
    console.log('\n📥 Fetching installations from Supabase...')
    const { data: installations, error } = await supabase
      .from('installations')
      .select('*')
      .order('installation_date', { ascending: false })

    if (error) {
      throw new Error(`Supabase fetch error: ${error.message}`)
    }

    console.log(`✅ Found ${installations.length} installations in Supabase`)

    // Process each installation
    const results = {
      success: 0,
      failed: 0,
      errors: []
    }

    for (const installation of installations) {
      const result = await processInstallation(installation, cache)
      
      if (result.success) {
        results.success++
      } else {
        results.failed++
        results.errors.push({ id: result.id, error: result.error })
      }

      // Save cache after each installation to prevent loss
      await saveCache(cache)
    }

    // Final summary
    console.log('\n' + '='.repeat(60))
    console.log('🎉 MIGRATION COMPLETE!')
    console.log('='.repeat(60))
    console.log(`✅ Successfully processed: ${results.success} installations`)
    console.log(`❌ Failed: ${results.failed} installations`)
    console.log(`📦 Asset cache now contains: ${Object.keys(cache).length} entries`)

    if (results.errors.length > 0) {
      console.log('\n❌ Errors encountered:')
      results.errors.forEach(err => {
        console.log(`  • ${err.id}: ${err.error}`)
      })
    }

    if (!DRY_RUN) {
      console.log('\n🔍 Verifying migration...')
      const sanityCount = await sanity.fetch('count(*[_type == "installation"])')
      console.log(`📊 Sanity now contains ${sanityCount} installation documents`)
      
      const withImages = await sanity.fetch('count(*[_type == "installation" && (defined(coverImage) || defined(gallery) || defined(imageReferences))])')
      console.log(`🖼️ ${withImages} installations have images`)
    }

  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  } finally {
    await saveCache(cache)
  }
}

// Run the migration
main()