const fs = require('fs');
const path = require('path');

// Import Sanity client
async function main() {
  const { createClient } = await import('@sanity/client');
  
  const sanity = createClient({
    projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2023-05-03',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false
  });

  // Read the installation template
  const template = fs.readFileSync('installation-template.html', 'utf8');

  // Create directories for all languages
  const languages = ['en', 'es', 'fr', 'de'];
  const installationsDir = path.join(__dirname, 'installations');
  
  // Create base installations directory
  if (!fs.existsSync(installationsDir)) {
    fs.mkdirSync(installationsDir, { recursive: true });
  }
  
  // Create language subdirectories
  languages.forEach(lang => {
    if (lang !== 'en') {
      const langDir = path.join(__dirname, lang, 'installations');
      if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
      }
    }
  });

  // Query all installations with translations
  const query = `*[_type == "installation"] | order(installationDate desc) {
    _id,
    title,
    "slug": slug.current,
    installationDate,
    application,
    location,
    overview,
    thanksTo,
    "coverImage": coverImage {
      "url": asset->url,
      alt
    },
    "gallery": gallery[] {
      "url": asset->url,
      alt
    },
    seo,
    publishedLocales,
    
    // Get all translation fields
    title__es,
    title__fr, 
    title__de,
    "location__es": location.city__es + ", " + location.country__es,
    "location__fr": location.city__fr + ", " + location.country__fr,
    "location__de": location.city__de + ", " + location.country__de,
    overview__es,
    overview__fr,
    overview__de,
    thanksTo__es,
    thanksTo__fr,
    thanksTo__de,
    "seo__es": seo.title__es,
    "seo__fr": seo.title__fr,
    "seo__de": seo.title__de
  }`;

  console.log('Fetching installations from Sanity...');
  const installations = await sanity.fetch(query);
  console.log(`Found ${installations.length} installations`);

  // Helper functions
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  function capitalizeApplication(app) {
    const appMap = {
      'playground': 'Playground',
      'muga': 'MUGA',
      'sports': 'Sports Court',
      'athletics': 'Athletics Track',
      'fitness': 'Fitness Area'
    };
    return appMap[app] || app.charAt(0).toUpperCase() + app.slice(1);
  }

  function portableTextToHtml(blocks) {
    if (!blocks || !Array.isArray(blocks)) return '';
    
    return blocks.map(block => {
      if (block._type === 'block' && block.children) {
        const text = block.children.map(child => child.text || '').join('');
        return `<p>${text}</p>`;
      }
      return '';
    }).join('\n                ');
  }

  function createGallerySection(coverImage, gallery, title) {
    const allImages = [];
    if (coverImage?.url) {
      allImages.push({ url: coverImage.url, alt: coverImage.alt || title });
    }
    if (gallery) {
      gallery.filter(img => img?.url).forEach(img => {
        allImages.push({ url: img.url, alt: img.alt || title });
      });
    }
    if (allImages.length === 0) return '';

    const singleClass = allImages.length === 1 ? ' single-image' : '';
    let html = `            <section class="image-gallery">
                <div class="gallery-grid${singleClass}">`;
    allImages.forEach((image, index) => {
      html += `
                    <div class="gallery-item" data-index="${index}">
                        <img src="${image.url}"
                             alt="${(image.alt || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"
                             loading="${index === 0 ? 'eager' : 'lazy'}"
                             decoding="async">
                    </div>`;
    });
    html += `
                </div>
            </section>`;
    return html;
  }

  function createImageArray(coverImage, gallery) {
    const images = [];
    if (coverImage?.url) {
      images.push(coverImage.url);
    }
    if (gallery) {
      images.push(...gallery.filter(img => img?.url).map(img => img.url));
    }
    return images.map(url => `"${url}"`).join(', ');
  }

  let generatedPages = [];

  // Generate pages for each installation and language
  for (const installation of installations) {
    for (const lang of languages) {
      // Skip if translation doesn't exist for this language
      if (lang !== 'en' && !installation.publishedLocales?.includes(lang)) {
        continue;
      }

      // Get language-specific content
      const title = installation[`title__${lang}`] || installation.title;
      const location = installation[`location__${lang}`] || 
                     `${installation.location?.city || ''}, ${installation.location?.country || ''}`.replace(/^, |, $/, '');
      const overview = installation[`overview__${lang}`] || installation.overview;
      const thanksTo = installation[`thanksTo__${lang}`] || installation.thanksTo;
      const seoTitle = installation[`seo__${lang}`] || installation.seo?.title || title;

      // Create file path
      const fileName = `${installation.slug}.html`;
      const filePath = lang === 'en' 
        ? path.join(installationsDir, fileName)
        : path.join(__dirname, lang, 'installations', fileName);

      // Create gallery section HTML
      const gallerySection = createGallerySection(installation.coverImage, installation.gallery, title);
      
      // Create content paragraphs HTML
      const contentParagraphs = portableTextToHtml(overview);
      const thanksParagraphs = portableTextToHtml(thanksTo);
      
      // Create image array for JavaScript
      const imageArray = createImageArray(installation.coverImage, installation.gallery);
      
      // Create meta description
      const metaDescription = `${title} installation in ${location}. Professional TPV surfacing by Rosehill Group.`;
      
      // Replace template placeholders
      let pageContent = template
        .replace(/{{TITLE}}/g, title)
        .replace(/{{LOCATION}}/g, location)
        .replace(/{{URL_SLUG}}/g, installation.slug)
        .replace(/{{META_DESCRIPTION}}/g, metaDescription)
        .replace(/{{KEYWORDS}}/g, `${title}, ${location}, Rosehill TPV, rubber surfacing`)
        .replace(/{{FIRST_IMAGE}}/g, installation.coverImage?.url || '')
        .replace(/{{DATE}}/g, formatDate(installation.installationDate))
        .replace(/{{APPLICATION}}/g, capitalizeApplication(installation.application))
        .replace(/{{GALLERY_SECTION}}/g, gallerySection)
        .replace(/{{CONTENT_PARAGRAPHS}}/g, contentParagraphs)
        .replace(/{{THANKS_PARAGRAPHS}}/g, thanksParagraphs)
        .replace(/{{IMAGE_ARRAY}}/g, imageArray);
      
      // Write the file
      fs.writeFileSync(filePath, pageContent);
      
      generatedPages.push({
        title: title,
        location: location,
        slug: installation.slug,
        fileName: fileName,
        language: lang,
        url: lang === 'en' ? `/installations/${installation.slug}.html` : `/${lang}/installations/${installation.slug}.html`
      });
      
      console.log(`✓ Generated: ${lang}/${fileName}`);
    }
  }

  console.log(`\n🎉 Successfully generated ${generatedPages.length} installation pages!`);
  console.log(`📁 English pages: ${generatedPages.filter(p => p.language === 'en').length}`);
  console.log(`📁 Translated pages: ${generatedPages.filter(p => p.language !== 'en').length}`);
}

// Run the script
main().catch(console.error);