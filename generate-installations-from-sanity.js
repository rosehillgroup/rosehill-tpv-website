#!/usr/bin/env node

/**
 * Generate installation pages from Sanity CMS
 * This integrates with your existing TPV website by:
 * 1. Fetching installations from Sanity instead of Supabase
 * 2. Generating pages into your existing /installations/ directory
 * 3. Keeping all other pages (products, colour, etc.) unchanged
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

// Sanity configuration
const sanity = createClient({
  projectId: '68ola3dd',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
})

// Read your existing installation template
const TEMPLATE_PATH = './installation-template.html'

// Helper to get localized content with fallback to English
function getLocalizedField(field, locale = 'en') {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[locale] || field.en || ''
}

// Helper for slug fields
function getLocalizedSlug(slug, locale = 'en') {
  if (!slug) return ''
  const localeSlug = slug[locale] || slug.en
  return localeSlug?.current || ''
}

// Generate HTML for a single installation
function generateInstallationHTML(installation, locale = 'en') {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Template file not found: ${TEMPLATE_PATH}`)
  }
  
  let template = fs.readFileSync(TEMPLATE_PATH, 'utf8')
  
  // Extract localized content
  const title = getLocalizedField(installation.title, locale)
  const overview = getLocalizedField(installation.overview, locale)
  const city = getLocalizedField(installation.location?.city, locale)
  const country = getLocalizedField(installation.location?.country, locale)
  const slug = getLocalizedSlug(installation.slug, locale)
  
  // Handle overview array (if it's a rich text field)
  let overviewText = overview
  if (Array.isArray(overview)) {
    overviewText = overview.join(' ')
  }
  
  // Replace placeholders in your existing template
  template = template
    .replace(/{{title}}/g, title)
    .replace(/{{overview}}/g, overviewText)
    .replace(/{{city}}/g, city)
    .replace(/{{country}}/g, country)
    .replace(/{{location}}/g, `${city}, ${country}`)
    .replace(/{{date}}/g, new Date(installation.installationDate).toLocaleDateString('en-US'))
    .replace(/{{application}}/g, installation.application || '')
    .replace(/{{slug}}/g, slug)
  
  // Add language switcher if this installation has multiple languages
  if (installation.publishedLocales && installation.publishedLocales.length > 1) {
    let languageSwitcher = '<div class="language-switcher"><h4>View in other languages:</h4><ul>'
    
    installation.publishedLocales.forEach(lang => {
      if (lang !== locale) {
        const langSlug = getLocalizedSlug(installation.slug, lang)
        const langDir = lang === 'en' ? '' : `${lang}/`
        languageSwitcher += `<li><a href="/${langDir}installations/${langSlug}/">${getLangName(lang)}</a></li>`
      }
    })
    
    languageSwitcher += '</ul></div>'
    template = template.replace('</body>', `${languageSwitcher}</body>`)
  }
  
  return template
}

function getLangName(code) {
  const names = { en: 'English', fr: 'Français', de: 'Deutsch', es: 'Español' }
  return names[code] || code
}

async function generateAllInstallations() {
  console.log('🎯 Generating installation pages from Sanity CMS...')
  
  try {
    // Fetch all installations from Sanity
    const installations = await sanity.fetch(`
      *[_type == "installation"] | order(installationDate desc) {
        _id,
        title,
        slug,
        overview,
        location,
        installationDate,
        application,
        publishedLocales,
        translationStatus
      }
    `)
    
    console.log(`✅ Found ${installations.length} installations in Sanity`)
    
    // Create installations directory if it doesn't exist
    if (!fs.existsSync('./installations')) {
      fs.mkdirSync('./installations')
    }
    
    let generated = 0
    
    for (const installation of installations) {
      const publishedLocales = installation.publishedLocales || ['en']
      
      for (const locale of publishedLocales) {
        try {
          const slug = getLocalizedSlug(installation.slug, locale)
          if (!slug) continue
          
          const html = generateInstallationHTML(installation, locale)
          
          // Determine file path based on locale
          let filePath
          if (locale === 'en') {
            filePath = `./installations/${slug}.html`
          } else {
            // Create language directory if needed
            if (!fs.existsSync(`./${locale}`)) {
              fs.mkdirSync(`./${locale}`)
            }
            if (!fs.existsSync(`./${locale}/installations`)) {
              fs.mkdirSync(`./${locale}/installations`)
            }
            filePath = `./${locale}/installations/${slug}.html`
          }
          
          fs.writeFileSync(filePath, html)
          console.log(`  ✅ Generated: ${filePath}`)
          generated++
          
        } catch (error) {
          console.error(`  ❌ Failed to generate ${installation.title?.en}: ${error.message}`)
        }
      }
    }
    
    console.log(`🎉 Generated ${generated} installation pages successfully!`)
    
    // Also generate a simple installations index from Sanity data
    await generateInstallationsIndex(installations)
    
  } catch (error) {
    console.error('💥 Failed to generate installations:', error)
    process.exit(1)
  }
}

async function generateInstallationsIndex(installations) {
  // This would update your installations.html to show Sanity data instead of JSON
  // For now, let's just log what we would do
  console.log('📝 To complete integration, update installations.html to use Sanity data')
  console.log('📝 This will replace the current installations.json dependency')
}

// Run the generator
generateAllInstallations()