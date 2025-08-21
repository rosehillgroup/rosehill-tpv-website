#!/usr/bin/env node

/**
 * Test script for the translation function
 * This simulates what Sanity webhook would send to test the translation workflow
 */

import { createClient } from '@sanity/client'

// Sanity configuration
const SANITY_PROJECT_ID = '68ola3dd'
const SANITY_DATASET = 'production'
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN

// Initialize Sanity client
const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: false,
  token: SANITY_TOKEN,
  apiVersion: '2023-05-03',
})

// Import the translation function logic
async function translateText(text, targetLang) {
  const DEEPL_API_KEY = process.env.DEEPL_API_KEY || 'be41df2a-742b-4952-ac1c-f94c17f50a44'
  const DEEPL_API_URL = 'https://api.deepl.com/v2/translate'
  
  const DEEPL_LANGUAGE_MAP = {
    'fr': 'FR',
    'de': 'DE', 
    'es': 'ES',
  }
  
  const PROTECTED_TERMS = [
    'Rosehill TPV®', 'TPV®', 'Flexilon®', 'Rosehill', 'TPV', 'Flexilon'
  ]
  
  if (!text || typeof text !== 'string' || !text.trim()) return text
  
  // Protect brand terms
  let protectedText = text
  const placeholders = {}
  
  PROTECTED_TERMS.forEach((term, index) => {
    const placeholder = `__PROTECTED_${index}__`
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    protectedText = protectedText.replace(regex, placeholder)
    placeholders[placeholder] = term
  })
  
  try {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: protectedText,
        target_lang: DEEPL_LANGUAGE_MAP[targetLang],
        source_lang: 'EN',
        preserve_formatting: '1',
      }),
    })
    
    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`)
    }
    
    const data = await response.json()
    let translatedText = data.translations[0].text
    
    // Restore protected terms
    Object.entries(placeholders).forEach(([placeholder, term]) => {
      translatedText = translatedText.replace(new RegExp(placeholder, 'g'), term)
    })
    
    return translatedText
  } catch (error) {
    console.error(`Translation error for ${targetLang}:`, error)
    return text
  }
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-|-$/g, '')
}

async function testTranslation() {
  console.log('🧪 Testing translation workflow...')
  
  try {
    // Get a sample installation
    console.log('📖 Fetching sample installation...')
    const installation = await sanity.fetch(`
      *[_type == "installation" && title.en != "Test"][0] {
        _id,
        title,
        slug,
        overview,
        location,
        publishedLocales,
        translationStatus
      }
    `)
    
    if (!installation) {
      throw new Error('No installations found')
    }
    
    console.log(`✅ Found installation: ${installation.title?.en}`)
    console.log(`📍 Current locales: ${installation.publishedLocales?.join(', ')}`)
    
    // Test translation to French
    const targetLocale = 'fr'
    console.log(`\n🔄 Testing translation to ${targetLocale}...`)
    
    if (installation.title?.en) {
      const translatedTitle = await translateText(installation.title.en, targetLocale)
      console.log(`📝 Title translation: "${installation.title.en}" → "${translatedTitle}"`)
      
      const translatedSlug = generateSlug(translatedTitle)
      console.log(`🔗 Generated slug: "${translatedSlug}"`)
    }
    
    if (installation.overview?.en) {
      let overviewText = installation.overview.en
      if (Array.isArray(overviewText)) {
        overviewText = overviewText.join(' ')
      }
      const translatedOverview = await translateText(overviewText, targetLocale)
      console.log(`📄 Overview translation: "${overviewText.substring(0, 50)}..." → "${translatedOverview.substring(0, 50)}..."`)
    }
    
    if (installation.location?.city?.en) {
      const translatedCity = await translateText(installation.location.city.en, targetLocale)
      console.log(`🏙️ City translation: "${installation.location.city.en}" → "${translatedCity}"`)
    }
    
    console.log('\n✅ Translation test completed successfully!')
    console.log('🚀 Ready to set up webhook for automatic translations')
    
  } catch (error) {
    console.error('💥 Translation test failed:', error.message)
    process.exit(1)
  }
}

// Check environment
if (!SANITY_TOKEN) {
  console.error('❌ SANITY_WRITE_TOKEN environment variable is required')
  console.log('Run: export SANITY_WRITE_TOKEN="your_token_here"')
  process.exit(1)
}

// Run test
testTranslation().catch(console.error)