// Generate installation pages from properly formatted Sanity installations only
const fs = require('fs');
const path = require('path');

async function main() {
  const { createClient } = await import('@sanity/client');
  
  const sanity = createClient({
    projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2023-05-03',
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false
  });

  // Only get installations with valid cover images and proper structure
  const query = `*[_type == "installation" && defined(coverImage.asset._ref) && defined(title) && title != "[object Object]"] | order(installationDate desc) {
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
      "url": asset->url,
      alt
    },
    "gallery": gallery[] {
      "url": asset->url,
      alt
    },
    seo,
    publishedLocales,
    
    // Translations
    title__es, title__fr, title__de,
    "location__es": location.city__es + ", " + location.country__es,
    "location__fr": location.city__fr + ", " + location.country__fr, 
    "location__de": location.city__de + ", " + location.country__de,
    overview__es, overview__fr, overview__de,
    thanksTo__es, thanksTo__fr, thanksTo__de,
    thanksToUrls__es, thanksToUrls__fr, thanksToUrls__de
  }`;

  console.log('Fetching valid installations from Sanity...');
  const installations = await sanity.fetch(query);
  console.log(`Found ${installations.length} valid installations with cover images`);

  if (installations.length === 0) {
    console.log('No valid installations found. Create some with the admin form first.');
    return;
  }

  // Read template
  const template = fs.readFileSync('installation-template.html', 'utf8');

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

  // Language configurations
  const languages = [
    { code: 'en', dir: 'installations', urlPrefix: '' },
    { code: 'es', dir: 'es/installations', urlPrefix: '/es' },
    { code: 'fr', dir: 'fr/installations', urlPrefix: '/fr' },
    { code: 'de', dir: 'de/installations', urlPrefix: '/de' }
  ];

  // Create all language directories
  languages.forEach(lang => {
    const langDir = path.join(__dirname, lang.dir);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
  });

  let generatedPages = [];

  // Generate pages for each valid installation in all languages
  for (const installation of installations) {
    for (const lang of languages) {
      const fileName = `${installation.slug}.html`;
      const langDir = path.join(__dirname, lang.dir);
      const filePath = path.join(langDir, fileName);
      
      // Get content for this language
      const titleField = lang.code === 'en' ? 'title' : `title__${lang.code}`;
      const locationField = lang.code === 'en' ? 'location' : `location__${lang.code}`;
      const overviewField = lang.code === 'en' ? 'overview' : `overview__${lang.code}`;
      const thanksToField = lang.code === 'en' ? 'thanksTo' : `thanksTo__${lang.code}`;
      const thanksToUrlsField = lang.code === 'en' ? 'thanksToUrls' : `thanksToUrls__${lang.code}`;
      
      const title = installation[titleField] || installation.title;
      const location = installation[locationField] || `${installation.location?.city || ''}, ${installation.location?.country || ''}`.replace(/^, |, $/, '');
      const overview = installation[overviewField] || installation.overview;
      const thanksTo = installation[thanksToField] || installation.thanksTo;
      const thanksToUrls = installation[thanksToUrlsField] || installation.thanksToUrls;
      
      // Generate URLs for this language
      const urlBase = lang.code === 'en' ? '' : lang.urlPrefix;
      const urls = {
        home: `${urlBase}/index.html`,
        products: `${urlBase}/products.html`,
        applications: `${urlBase}/applications.html`,
        colour: `${urlBase}/colour.html`,
        installations: `${urlBase}/installations.html`,
        about: `${urlBase}/about.html`,
        contact: `${urlBase}/contact.html`,
        logoWebp: lang.code === 'en' ? '../rosehill_tpv_logo.webp' : '../../rosehill_tpv_logo.webp',
        logoPng: lang.code === 'en' ? '../rosehill_tpv_logo.png' : '../../rosehill_tpv_logo.png'
      };
      
      // Create gallery section
      let gallerySection = '';
      const allImages = [];
      if (installation.coverImage?.url) {
        allImages.push({ url: installation.coverImage.url, alt: installation.coverImage.alt || title });
      }
      if (installation.gallery) {
        installation.gallery.filter(img => img?.url).forEach(img => {
          allImages.push({ url: img.url, alt: img.alt || title });
        });
      }
      if (allImages.length > 0) {
        const singleClass = allImages.length === 1 ? ' single-image' : '';
        gallerySection = `            <section class="image-gallery">
                <div class="gallery-grid${singleClass}">`;
        allImages.forEach((image, index) => {
          gallerySection += `
                    <div class="gallery-item" data-index="${index}">
                        <img src="${image.url}"
                             alt="${(image.alt || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"
                             loading="${index === 0 ? 'eager' : 'lazy'}"
                             decoding="async">
                    </div>`;
        });
        gallerySection += `
                </div>
            </section>`;
      }
      
      // Create content paragraphs using language-specific content
      const contentParagraphs = portableTextToHtml(overview);
      
      // Generate attribution section using language-specific content
      const attributionSection = generateAttributionSection(thanksTo, thanksToUrls);
      
      // Create image array for JavaScript
      const images = [installation.coverImage?.url].filter(Boolean);
      if (installation.gallery) {
        images.push(...installation.gallery.filter(img => img?.url).map(img => img.url));
      }
      const imageArray = images.map(url => `"${url}"`).join(', ');
      
      // Replace template placeholders with language-specific content
      let pageContent = template
        .replace(/{{TITLE}}/g, title)
        .replace(/{{LOCATION}}/g, location)
        .replace(/{{URL_SLUG}}/g, installation.slug)
        .replace(/{{META_DESCRIPTION}}/g, installation.seo?.description || `${title} installation by Rosehill TPV`)
        .replace(/{{KEYWORDS}}/g, `${title}, Rosehill TPV, rubber surfacing, playground`)
        .replace(/{{FIRST_IMAGE}}/g, installation.coverImage?.url || '')
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
      
      // Write the page for this language
      fs.writeFileSync(filePath, pageContent);
      
      generatedPages.push({
        title: title,
        slug: installation.slug,
        fileName: fileName,
        language: lang.code,
        path: lang.dir
      });
      
      console.log(`✓ Generated: ${lang.code.toUpperCase()}/${fileName}`);
    }
  }

  console.log(`\n🎉 Generated ${generatedPages.length} installation pages!`);
}

main().catch(console.error);