#!/usr/bin/env node

// Build script to generate installation pages during Netlify build
const fs = require('fs');
const path = require('path');

async function buildInstallationPages() {
  console.log('🔨 Building installation pages from Sanity...');
  
  const sanityClient = await import('@sanity/client');
  const imageUrlBuilder = await import('@sanity/image-url');
  
  const sanity = sanityClient.createClient({
    projectId: '68ola3dd',
    dataset: 'production',
    apiVersion: '2023-05-03',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false
  });
  
  const builder = imageUrlBuilder.default(sanity);
  const urlFor = (source) => builder.image(source);

  // Get all installations
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
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    },
    "gallery": gallery[] {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    },
    seo,
    publishedLocales,
    
    title__es, title__fr, title__de,
    overview__es, overview__fr, overview__de,
    thanksTo__es, thanksTo__fr, thanksTo__de,
    "location__es": location.city__es + ", " + location.country__es,
    "location__fr": location.city__fr + ", " + location.country__fr,
    "location__de": location.city__de + ", " + location.country__de
  }`;

  const installations = await sanity.fetch(query);
  console.log(`📊 Found ${installations.length} installations`);

  if (installations.length === 0) {
    console.log('⚠️ No installations found');
    return;
  }

  // Read template
  const template = fs.readFileSync('installation-template.html', 'utf8');

  // Create directories
  const installationsDir = path.join(__dirname, 'installations');
  if (!fs.existsSync(installationsDir)) {
    fs.mkdirSync(installationsDir, { recursive: true });
  }

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

  function createThumbnailGrid(gallery, title, urlFor) {
    if (!gallery || gallery.length === 0) return '';
    let thumbnailGrid = '<div class="thumbnail-grid">';
    gallery.forEach((image, index) => {
      if (image.asset) {
        const imageUrl = urlFor(image.asset).width(300).auto('format').quality(70).url();
        thumbnailGrid += `
                <img src="${imageUrl}" 
                     alt="${image.alt || title}" 
                     class="thumbnail" 
                     onclick="setMainImage(${index + 1}); openLightbox(${index + 1})">`;
      }
    });
    thumbnailGrid += '</div>';
    return thumbnailGrid;
  }

  function createImageArray(coverImage, gallery, urlFor) {
    const images = [];
    if (coverImage?.asset) {
      images.push(urlFor(coverImage.asset).width(1200).auto('format').quality(80).url());
    }
    if (gallery) {
      images.push(...gallery.filter(img => img?.asset).map(img => 
        urlFor(img.asset).width(1200).auto('format').quality(80).url()
      ));
    }
    return images.map(url => `"${url}"`).join(', ');
  }

  let generatedCount = 0;

  // Generate pages
  for (const installation of installations) {
    for (const lang of ['en', 'es', 'fr', 'de']) {
      if (lang !== 'en' && !installation.publishedLocales?.includes(lang)) {
        continue;
      }

      const title = installation[`title__${lang}`] || installation.title;
      const location = installation[`location__${lang}`] || 
                      `${installation.location?.city || ''}, ${installation.location?.country || ''}`.replace(/^, |, $/, '');
      const overview = installation[`overview__${lang}`] || installation.overview;
      const thanksTo = installation[`thanksTo__${lang}`] || installation.thanksTo;

      const fileName = `${installation.slug}.html`;
      const filePath = lang === 'en' 
        ? path.join(installationsDir, fileName)
        : path.join(__dirname, lang, 'installations', fileName);

      const thumbnailGrid = createThumbnailGrid(installation.gallery, title, urlFor);
      const contentParagraphs = portableTextToHtml(overview);
      const thanksParagraphs = portableTextToHtml(thanksTo);
      const imageArray = createImageArray(installation.coverImage, installation.gallery, urlFor);
      
      const metaDescription = `${title} installation in ${location}. Professional TPV surfacing by Rosehill Group.`;
      const firstImageUrl = installation.coverImage?.asset 
        ? urlFor(installation.coverImage.asset).width(1200).auto('format').quality(80).url()
        : '';
      
      let pageContent = template
        .replace(/{{TITLE}}/g, title)
        .replace(/{{LOCATION}}/g, location)
        .replace(/{{URL_SLUG}}/g, installation.slug)
        .replace(/{{META_DESCRIPTION}}/g, metaDescription)
        .replace(/{{KEYWORDS}}/g, `${title}, ${location}, Rosehill TPV, rubber surfacing`)
        .replace(/{{FIRST_IMAGE}}/g, firstImageUrl)
        .replace(/{{DATE}}/g, formatDate(installation.installationDate))
        .replace(/{{APPLICATION}}/g, installation.application || 'Installation')
        .replace(/{{THUMBNAIL_GRID}}/g, thumbnailGrid)
        .replace(/{{CONTENT_PARAGRAPHS}}/g, contentParagraphs)
        .replace(/{{THANKS_PARAGRAPHS}}/g, thanksParagraphs)
        .replace(/{{IMAGE_ARRAY}}/g, imageArray);
      
      fs.writeFileSync(filePath, pageContent);
      generatedCount++;
    }
  }

  console.log(`✅ Generated ${generatedCount} installation pages`);
}

// Run the build
buildInstallationPages()
  .then(() => console.log('🎉 Installation pages built successfully'))
  .catch(error => {
    console.error('❌ Build failed:', error);
    process.exit(1);
  });