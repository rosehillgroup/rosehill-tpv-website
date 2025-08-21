// Sanity CMS webhook for translating installation content
// This function translates installation content using DeepL API and updates Sanity documents

import {createClient} from '@sanity/client'

// Initialize Sanity client
const sanityClient = createClient({
  projectId: '68ola3dd',
  dataset: 'production',
  useCdn: false, // We need to write, so no CDN
  token: process.env.SANITY_WRITE_TOKEN, // Set this in Netlify env vars
  apiVersion: '2023-05-03',
})

// DeepL API configuration
const DEEPL_API_KEY = process.env.DEEPL_API_KEY || 'be41df2a-742b-4952-ac1c-f94c17f50a44'
const DEEPL_API_URL = 'https://api.deepl.com/v2/translate'

// Language mapping: Sanity locale -> DeepL language code
const DEEPL_LANGUAGE_MAP = {
  'fr': 'FR',
  'de': 'DE', 
  'es': 'ES',
}

// Brand terms and technical terms that should not be translated
const PROTECTED_TERMS = [
  'Rosehill TPV®',
  'TPV®',
  'Flexilon®',
  'Rosehill',
  'TPV',
  'Flexilon',
  'RH01', 'RH02', 'RH10', 'RH11', 'RH12', 'RH20', 'RH21', 'RH22', 'RH23', 'RH26', 'RH30', 'RH31', 'RH32', 'RH33', 'RH40', 'RH41', 'RH50', 'RH60', 'RH61', 'RH65', 'RH70', 'RH90'
]

// Translate text using DeepL API
async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string' || !text.trim()) return text
  
  // Protect brand terms by replacing with placeholders
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
    return text // Return original on error
  }
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-|-$/g, '')
}

// Main handler
export const handler = async (event, context) => {
  // Only handle POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({error: 'Method not allowed'}),
    }
  }
  
  try {
    const {documentId, targetLocales} = JSON.parse(event.body)
    
    if (!documentId || !targetLocales || !Array.isArray(targetLocales)) {
      return {
        statusCode: 400,
        body: JSON.stringify({error: 'Missing documentId or targetLocales'}),
      }
    }
    
    // Fetch the document from Sanity
    const document = await sanityClient.getDocument(documentId)
    
    if (!document) {
      return {
        statusCode: 404,
        body: JSON.stringify({error: 'Document not found'}),
      }
    }
    
    // Prepare update payload
    const updates = {}
    
    for (const locale of targetLocales) {
      if (locale === 'en') continue // Skip English (source language)
      
      console.log(`Translating to ${locale}...`)
      
      // Translate title
      if (document.title?.en && !document.title?.[locale]) {
        const translatedTitle = await translateText(document.title.en, locale)
        if (!updates.title) updates.title = {...document.title}
        updates.title[locale] = translatedTitle
        
        // Generate slug from translated title
        if (!updates.slug) updates.slug = {...document.slug}
        updates.slug[locale] = {
          _type: 'slug',
          current: generateSlug(translatedTitle)
        }
      }
      
      // Translate overview
      if (document.overview?.en && !document.overview?.[locale]) {
        const translatedOverview = await translateText(document.overview.en, locale)
        if (!updates.overview) updates.overview = {...document.overview}
        updates.overview[locale] = translatedOverview
      }
      
      // Translate location fields
      if (document.location?.city?.en && !document.location?.city?.[locale]) {
        if (!updates.location) updates.location = {...document.location}
        if (!updates.location.city) updates.location.city = {...document.location.city}
        updates.location.city[locale] = await translateText(document.location.city.en, locale)
      }
      
      if (document.location?.country?.en && !document.location?.country?.[locale]) {
        if (!updates.location) updates.location = {...document.location}
        if (!updates.location.country) updates.location.country = {...document.location.country}
        updates.location.country[locale] = await translateText(document.location.country.en, locale)
      }
      
      // Generate SEO fields
      if (updates.title?.[locale]) {
        if (!updates.seo) updates.seo = {...document.seo}
        if (!updates.seo.metaTitle) updates.seo.metaTitle = {}
        if (!updates.seo.metaDescription) updates.seo.metaDescription = {}
        
        updates.seo.metaTitle[locale] = `${updates.title[locale]} - Installation Rosehill TPV`
        updates.seo.metaDescription[locale] = updates.overview?.[locale]?.substring(0, 155) || ''
      }
      
      // Update translation status
      if (!updates.translationStatus) updates.translationStatus = {...document.translationStatus}
      updates.translationStatus[locale] = 'machine-translated'
      
      // Add to published locales if not already there
      const currentPublishedLocales = document.publishedLocales || ['en']
      if (!currentPublishedLocales.includes(locale)) {
        updates.publishedLocales = [...currentPublishedLocales, locale]
      }
    }
    
    // Update the document in Sanity if we have translations
    if (Object.keys(updates).length > 0) {
      await sanityClient
        .patch(documentId)
        .set(updates)
        .commit()
      
      console.log(`Successfully translated document ${documentId} to ${targetLocales.join(', ')}`)
    }
    
    // Trigger Netlify build hook (if configured)
    if (process.env.NETLIFY_BUILD_HOOK) {
      await fetch(process.env.NETLIFY_BUILD_HOOK, {method: 'POST'})
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        documentId,
        translatedLocales: targetLocales,
        message: 'Translation completed successfully'
      }),
    }
    
  } catch (error) {
    console.error('Translation function error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Translation failed',
        message: error.message
      }),
    }
  }
}