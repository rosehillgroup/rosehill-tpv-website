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
    thanksToUrls,
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
    thanksToUrls__es, thanksToUrls__fr, thanksToUrls__de,
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

  function escAttr(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function createGallerySection(coverImage, gallery, title, urlFor) {
    const allImages = [];
    if (coverImage?.asset) {
      allImages.push({ asset: coverImage.asset, alt: coverImage.alt || title });
    }
    if (gallery) {
      gallery.filter(img => img?.asset).forEach(img => {
        allImages.push({ asset: img.asset, alt: img.alt || title });
      });
    }
    if (allImages.length === 0) return '';

    const singleClass = allImages.length === 1 ? ' single-image' : '';
    let html = `            <section class="image-gallery">
                <div class="gallery-grid${singleClass}">`;
    allImages.forEach((image, index) => {
      const imageUrl = urlFor(image.asset).width(1200).auto('format').quality(80).url();
      html += `
                    <div class="gallery-item" data-index="${index}">
                        <img src="${imageUrl}"
                             alt="${escAttr(image.alt)} - Image ${index + 1}"
                             loading="${index === 0 ? 'eager' : 'lazy'}"
                             decoding="async">
                    </div>`;
    });
    html += `
                </div>
            </section>`;
    return html;
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

  function generateAttributionSection(thanksTo, thanksToUrls) {
    if (!thanksTo || !Array.isArray(thanksTo) || thanksTo.length === 0) {
      return '';
    }

    const attributionItems = thanksTo.map((attribution, index) => {
      const url = thanksToUrls && thanksToUrls[index] && thanksToUrls[index].trim();
      const text = attribution.children?.map(child => child.text || '').join('') || attribution;
      
      if (url && url.startsWith('http')) {
        return `<p><a href="${url}" target="_blank" rel="noopener">${text}</a></p>`;
      } else {
        return `<p>${text}</p>`;
      }
    }).join('\n                ');

    return `
            <section class="attribution-section">
                <h3>Photo Credits & Acknowledgments</h3>
                ${attributionItems}
            </section>`;
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
      const thanksToUrls = installation[`thanksToUrls__${lang}`] || installation.thanksToUrls;

      const fileName = `${installation.slug}.html`;
      const filePath = lang === 'en' 
        ? path.join(installationsDir, fileName)
        : path.join(__dirname, lang, 'installations', fileName);

      // Generate URLs for this language
      const urlBase = lang === 'en' ? '' : `/${lang}`;
      const urls = {
        home: `${urlBase}/index.html`,
        products: `${urlBase}/products.html`,
        applications: `${urlBase}/applications.html`,
        colour: `${urlBase}/colour.html`,
        installations: `${urlBase}/installations.html`,
        about: `${urlBase}/about.html`,
        contact: `${urlBase}/contact.html`,
        logoWebp: lang === 'en' ? '../rosehill_tpv_logo.webp' : '../../rosehill_tpv_logo.webp',
        logoPng: lang === 'en' ? '../rosehill_tpv_logo.png' : '../../rosehill_tpv_logo.png'
      };

      const gallerySection = createGallerySection(installation.coverImage, installation.gallery, title, urlFor);
      const contentParagraphs = portableTextToHtml(overview);
      const attributionSection = generateAttributionSection(thanksTo, thanksToUrls);
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
        .replace(/{{GALLERY_SECTION}}/g, gallerySection)
        .replace(/{{CONTENT_PARAGRAPHS}}/g, contentParagraphs)
        .replace(/{{ATTRIBUTION_SECTION}}/g, attributionSection)
        .replace(/{{IMAGE_ARRAY}}/g, imageArray)
        .replace(/{{HOME_URL}}/g, urls.home)
        .replace(/{{PRODUCTS_URL}}/g, urls.products)
        .replace(/{{APPLICATIONS_URL}}/g, urls.applications)
        .replace(/{{COLOUR_URL}}/g, urls.colour)
        .replace(/{{INSTALLATIONS_URL}}/g, urls.installations)
        .replace(/{{ABOUT_URL}}/g, urls.about)
        .replace(/{{CONTACT_URL}}/g, urls.contact)
        .replace(/{{LOGO_WEBP_URL}}/g, urls.logoWebp)
        .replace(/{{LOGO_PNG_URL}}/g, urls.logoPng);
      
      fs.writeFileSync(filePath, pageContent);
      generatedCount++;
    }
  }

  console.log(`✅ Generated ${generatedCount} installation pages`);
}

async function replaceApiKeys() {
  console.log('🔑 Replacing API keys...');
  
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!googleMapsApiKey) {
    console.warn('⚠️ GOOGLE_MAPS_API_KEY environment variable not found');
    return;
  }
  
  // Replace API key in contact.html
  try {
    const contactHtmlPath = path.join(__dirname, 'contact.html');
    if (fs.existsSync(contactHtmlPath)) {
      let contactContent = fs.readFileSync(contactHtmlPath, 'utf8');
      contactContent = contactContent.replace(/GOOGLE_MAPS_API_KEY/g, googleMapsApiKey);
      fs.writeFileSync(contactHtmlPath, contactContent);
      console.log('✅ Updated contact.html with Google Maps API key');
    }
  } catch (error) {
    console.error('❌ Failed to update contact.html:', error);
  }
}

// Run the build
async function build() {
  try {
    await buildInstallationPages();
    await replaceApiKeys();
    console.log('🎉 Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();