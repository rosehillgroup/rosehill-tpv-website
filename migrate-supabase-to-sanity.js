#!/usr/bin/env node

/**
 * Migration script to transfer installation data from Supabase to Sanity CMS
 * This script reads installation data from your current Supabase database
 * and creates corresponding documents in Sanity with proper localization structure
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

// Helper to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-|-$/g, '')
}

// Helper to convert application types
function mapApplicationType(app) {
  const mapping = {
    'playground': 'playground',
    'sports': 'sports-court', 
    'fitness': 'fitness',
    'water': 'water-park',
    'track': 'track-field',
    'pool': 'pool-surround'
  }
  
  return mapping[app] || 'playground'
}

// Helper to parse location string into city/country
function parseLocation(locationString) {
  if (!locationString) return { city: '', country: '' }
  
  // Try to split by comma
  const parts = locationString.split(',').map(p => p.trim())
  
  if (parts.length >= 2) {
    return {
      city: parts[0],
      country: parts[parts.length - 1] // Last part is usually country
    }
  } else {
    return {
      city: locationString,
      country: ''
    }
  }
}

async function migrateInstallations() {
  console.log('🚀 Starting migration from Supabase to Sanity...')
  
  try {
    // Fetch all installations from Supabase
    console.log('📖 Fetching installations from Supabase...')
    const { data: installations, error } = await supabase
      .from('installations')
      .select('*')
      .order('installation_date', { ascending: false })
    
    if (error) {
      throw new Error(`Failed to fetch installations: ${error.message}`)
    }
    
    console.log(`✓ Found ${installations.length} installations in Supabase`)
    
    const migrationResults = []
    
    for (let i = 0; i < installations.length; i++) {
      const installation = installations[i]
      console.log(`\n[${i + 1}/${installations.length}] Migrating: ${installation.title}`)
      
      try {
        const location = parseLocation(installation.location)
        
        // Create Sanity document structure
        const sanityDoc = {
          _type: 'installation',
          title: {
            en: installation.title
          },
          slug: {
            en: {
              _type: 'slug',
              current: generateSlug(installation.title)
            }
          },
          overview: {
            en: installation.description || installation.overview || ''
          },
          location: {
            city: {
              en: location.city
            },
            country: {
              en: location.country
            }
          },
          installationDate: installation.installation_date,
          application: mapApplicationType(installation.application),
          tags: installation.tags || [],
          publishedLocales: ['en'],
          translationStatus: {
            en: 'published',
            fr: 'not-started',
            de: 'not-started',
            es: 'not-started'
          },
          seo: {
            metaTitle: {
              en: `${installation.title} - Rosehill TPV Installation`
            },
            metaDescription: {
              en: String(installation.description || installation.overview || '').substring(0, 155)
            }
          }
        }
        
        // Add thanks to company if present
        if (installation.thanks_to) {
          sanityDoc.thanksTo = {
            company: installation.thanks_to,
            url: installation.thanks_url || ''
          }
        }
        
        // Create the document in Sanity
        const result = await sanity.create(sanityDoc)
        
        console.log(`  ✅ Created: ${result._id}`)
        
        migrationResults.push({
          supabaseId: installation.id,
          sanityId: result._id,
          title: installation.title,
          success: true
        })
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500))
        
      } catch (error) {
        console.error(`  ❌ Failed to migrate "${installation.title}": ${error.message}`)
        migrationResults.push({
          supabaseId: installation.id,
          sanityId: null,
          title: installation.title,
          success: false,
          error: error.message
        })
      }
    }
    
    // Save migration results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const resultsFile = `migration-results-${timestamp}.json`
    fs.writeFileSync(resultsFile, JSON.stringify(migrationResults, null, 2))
    
    // Summary
    const successful = migrationResults.filter(r => r.success).length
    const failed = migrationResults.filter(r => !r.success).length
    
    console.log(`\n📊 Migration Summary:`)
    console.log(`✅ Successful: ${successful}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`📝 Results saved to: ${resultsFile}`)
    
    if (failed > 0) {
      console.log(`\n❌ Failed migrations:`)
      migrationResults
        .filter(r => !r.success)
        .forEach(r => console.log(`  - ${r.title}: ${r.error}`))
    }
    
    console.log(`\n🎉 Migration completed!`)
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
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
  
  // Ask for confirmation
  console.log('\n⚠️  This will create new documents in your Sanity dataset.')
  console.log('Make sure you have a backup of your Sanity data before proceeding.')
  
  // In a real script, you might want to prompt for confirmation
  // For now, we'll proceed automatically
  
  await migrateInstallations()
}

// Run the migration
main().catch(console.error)