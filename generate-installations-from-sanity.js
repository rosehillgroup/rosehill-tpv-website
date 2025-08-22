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

// Read the new professional installation template
const TEMPLATE_PATH = './installation-template-professional.html'

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

// Generate HTML for a single installation using the exact template structure
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
  
  // Format location
  const location = [city, country].filter(Boolean).join(', ')
  
  // Format date - handle potential null/undefined dates
  let formattedDate = 'Date not available'
  let dateISO = new Date().toISOString()
  if (installation.installationDate) {
    try {
      const date = new Date(installation.installationDate)
      formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      dateISO = date.toISOString()
    } catch (e) {
      console.warn(`Invalid date for ${title}: ${installation.installationDate}`)
    }
  }
  
  // Get application type or default to 'Playground'
  const application = installation.application || 'Playground'
  
  // Create meta description (first 155 characters of overview)
  const metaDescription = overviewText ? 
    overviewText.substring(0, 155).replace(/"/g, '&quot;') : 
    `${title} installation in ${location}. Rosehill TPV® surface installation.`
  
  // Generate keywords
  const keywords = `Rosehill TPV, ${application}, ${location}, rubber surfacing, ${title}`
  
  // Handle images using same logic as main installations page
  let images = []
  
  // Try imageReferences first (migrated from Supabase)
  if (installation.imageReferences && Array.isArray(installation.imageReferences) && installation.imageReferences.length > 0) {
    images = installation.imageReferences
      .filter(img => img && typeof img === 'string')
      .map(img => img.startsWith('images/installations/') ? img.replace('images/installations/', '') : img)
  }
  // Try coverImage (Sanity asset)
  else if (installation.coverImage && installation.coverImage.asset && installation.coverImage.asset.url) {
    images = [installation.coverImage.asset.url]
  }
  // Try gallery (Sanity assets)  
  else if (installation.gallery && Array.isArray(installation.gallery) && installation.gallery.length) {
    images = installation.gallery
      .map(img => (img && img.asset && img.asset.url) ? img.asset.url : null)
      .filter(Boolean)
  }
  // Try coverImagePath (legacy)
  else if (installation.coverImagePath) {
    images = [installation.coverImagePath]
  }
  
  // Fallback to placeholder
  if (images.length === 0) {
    images = [`placeholder-${installation.application?.toLowerCase() || 'playground'}.jpg`]
  }
  
  // Get first image for meta tags
  const firstImage = images[0] || 'placeholder.jpg'
  
  // Create thumbnail grid HTML for professional template
  let thumbnailGrid = ''
  if (images.length > 1) {
    thumbnailGrid = `
                        <div class="thumbnail-grid">`
    images.slice(1).forEach((img, index) => {
      thumbnailGrid += `
                            <img src="../images/installations/${img}" 
                                 alt="${title} - Image ${index + 2}" 
                                 class="thumbnail" 
                                 onclick="setMainImage(${index + 1})">`
    })
    thumbnailGrid += `
                        </div>`
  }
  
  // Create image array for JavaScript
  const imageArray = images.map(img => `'${img}'`).join(', ')
  
  // Split overview into paragraphs
  let contentParagraphs = ''
  if (overviewText) {
    // Split by double newlines or periods followed by capital letters
    const paragraphs = overviewText
      .split(/\n\n|(?<=[.!?])\s+(?=[A-Z])/)
      .filter(p => p.trim())
    
    paragraphs.forEach(paragraph => {
      contentParagraphs += `<p>${paragraph.trim()}</p>\n                `
    })
  } else {
    contentParagraphs = '<p>This installation showcases the quality and durability of Rosehill TPV® surfaces.</p>'
  }
  
  // Create thanks section for professional template
  let thanksSection = ''
  if (installation.thanksTo?.company) {
    thanksSection = `
                    <div class="thanks-section">
                        <h3>Special Thanks</h3>
                        <p>We would like to thank <strong>${installation.thanksTo.company}</strong> for their collaboration on this project.</p>
                    </div>`
  }

  // Create summary text for hero section
  const summaryText = overviewText ? 
    overviewText.split('.')[0] + '.' : 
    `Discover this exceptional ${application.toLowerCase()} installation featuring Rosehill TPV® surfaces in ${location}.`

  // Create hero background image (use first image or default)
  const heroBackgroundImage = images.length > 0 ? `../images/installations/${images[0]}` : '../hero_background.jpg'

  // Create project details extra section
  let projectDetailsExtra = ''
  if (installation.thanksTo?.company) {
    projectDetailsExtra += `
                    <div class="detail-item">
                        <span class="detail-label">Partner</span>
                        <span class="detail-value">${installation.thanksTo.company}</span>
                    </div>`
  }
  
  // Replace all placeholders in template
  template = template
    .replace(/{{TITLE}}/g, title)
    .replace(/{{LOCATION}}/g, location)
    .replace(/{{DATE}}/g, formattedDate)
    .replace(/{{DATE_ISO}}/g, dateISO)
    .replace(/{{APPLICATION}}/g, application)
    .replace(/{{META_DESCRIPTION}}/g, metaDescription)
    .replace(/{{KEYWORDS}}/g, keywords)
    .replace(/{{FIRST_IMAGE}}/g, firstImage)
    .replace(/{{URL_SLUG}}/g, slug)
    .replace(/{{THUMBNAIL_GRID}}/g, thumbnailGrid)
    .replace(/{{CONTENT_PARAGRAPHS}}/g, contentParagraphs)
    .replace(/{{IMAGE_ARRAY}}/g, imageArray)
    .replace(/{{SUMMARY_TEXT}}/g, summaryText)
    .replace(/{{HERO_BACKGROUND_IMAGE}}/g, heroBackgroundImage)
    .replace(/{{THANKS_SECTION}}/g, thanksSection)
    .replace(/{{PROJECT_DETAILS_EXTRA}}/g, projectDetailsExtra)
    .replace(/{{IMAGE_COUNT}}/g, images.length)
  
  // Update navigation links based on locale
  if (locale !== 'en') {
    // Update navigation links for non-English pages
    template = template
      .replace(/href="\.\.\/index\.html"/g, `href="../../index.html"`)
      .replace(/href="\.\.\/products\.html"/g, `href="../../products.html"`)
      .replace(/href="\.\.\/installations\.html"/g, `href="../../${locale}/installations.html"`)
      .replace(/href="\.\.\/about\.html"/g, `href="../../about.html"`)
      .replace(/href="\.\.\/contact\.html"/g, `href="../../contact.html"`)
      .replace(/src="\.\.\/images\//g, `src="../../images/`)
      .replace(/<a href="\.\.\/\.\.\/index\.html">Home<\/a>/g, '<a href="../../index.html">Home</a>')
      .replace(/<a href="\.\.\/\.\.\/installations\.html">Installations<\/a>/g, `<a href="../../${locale}/installations.html">Installations</a>`)
  }
  
  // Remove Supabase scripts and add Sanity data attributes
  template = template
    .replace(/<script src="\/js\/supabase-client\.js"><\/script>/, '<!-- Supabase removed - using Sanity -->')
    .replace(/<script src="\/js\/installation-page-loader\.js"><\/script>/, '<!-- Page loader removed - content is static -->')
  
  // Add data attributes for the installation
  template = template.replace('<body>', `<body data-installation-id="${installation._id}" data-installation-lang="${locale}" data-installation-slug="${slug}">`)
  
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
        translationStatus,
        imageReferences,
        imageCount,
        coverImagePath,
        coverImage,
        gallery,
        thanksTo
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