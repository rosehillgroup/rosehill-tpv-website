// Generate installation pages for all languages from Sanity data
const fs = require('fs');
const path = require('path');

async function main() {
  const sanityClient = await import('@sanity/client');
  const sanity = sanityClient.createClient({
    projectId: '68ola3dd',
    dataset: 'production',
    apiVersion: '2023-05-03',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false
  });

  // Get all installations with translations
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
    
    // Translation fields
    title__es, title__fr, title__de,
    overview__es, overview__fr, overview__de,
    thanksTo__es, thanksTo__fr, thanksTo__de,
    "location__es": location.city__es + ", " + location.country__es,
    "location__fr": location.city__fr + ", " + location.country__fr,
    "location__de": location.city__de + ", " + location.country__de,
    "seo__es": seo.title__es,
    "seo__fr": seo.title__fr,
    "seo__de": seo.title__de
  }`;

  console.log('Fetching installations from Sanity...');
  const installations = await sanity.fetch(query);
  console.log(`Found ${installations.length} installations`);

  if (installations.length === 0) {
    console.log('No installations found to generate pages for.');
    return;
  }

  // Read template
  const template = fs.readFileSync('installation-template.html', 'utf8');

  // Create directories for all languages
  const installationsDir = path.join(__dirname, 'installations');
  if (!fs.existsSync(installationsDir)) {
    fs.mkdirSync(installationsDir, { recursive: true });
  }

  // Create language subdirectories
  ['es', 'fr', 'de'].forEach(lang => {
    const langDir = path.join(__dirname, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
    const langInstallationsDir = path.join(langDir, 'installations');
    if (!fs.existsSync(langInstallationsDir)) {
      fs.mkdirSync(langInstallationsDir, { recursive: true });
    }
  });

  // Helper functions
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
    const languages = ['en', 'es', 'fr', 'de'];
    
    for (const lang of languages) {
      // Skip if translation doesn't exist
      if (lang !== 'en' && !installation.publishedLocales?.includes(lang)) {
        console.log(`⏭️  Skipping ${installation.slug} for ${lang} - not translated`);
        continue;
      }

      // Get language-specific content
      const title = installation[`title__${lang}`] || installation.title;
      const location = installation[`location__${lang}`] || 
                     `${installation.location?.city || ''}, ${installation.location?.country || ''}`.replace(/^, |, $/, '');
      const overview = installation[`overview__${lang}`] || installation.overview;
      const thanksTo = installation[`thanksTo__${lang}`] || installation.thanksTo;
      const seoTitle = installation[`seo__${lang}`] || installation.seo?.title || title;

      // Create file paths
      const fileName = `${installation.slug}.html`;
      const filePath = lang === 'en' 
        ? path.join(installationsDir, fileName)
        : path.join(__dirname, lang, 'installations', fileName);

      // Create content HTML
      const gallerySection = createGallerySection(installation.coverImage, installation.gallery, title);
      const contentParagraphs = portableTextToHtml(overview);
      const thanksParagraphs = portableTextToHtml(thanksTo);
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
        .replace(/{{APPLICATION}}/g, installation.application || 'Installation')
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

  console.log(`\n🎉 Generated ${generatedPages.length} installation pages total!`);
  
  const byLanguage = generatedPages.reduce((acc, page) => {
    acc[page.language] = (acc[page.language] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(byLanguage).forEach(([lang, count]) => {
    console.log(`📄 ${lang.toUpperCase()}: ${count} pages`);
  });
}

main().catch(console.error);