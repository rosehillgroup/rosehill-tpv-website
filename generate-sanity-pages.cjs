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
    thanksTo__es, thanksTo__fr, thanksTo__de
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

  // Create installations directory
  const installationsDir = path.join(__dirname, 'installations');
  if (!fs.existsSync(installationsDir)) {
    fs.mkdirSync(installationsDir, { recursive: true });
  }

  let generatedPages = [];

  // Generate pages for each valid installation
  for (const installation of installations) {
    const fileName = `${installation.slug}.html`;
    const filePath = path.join(installationsDir, fileName);
    
    // Create thumbnail grid if gallery exists
    let thumbnailGrid = '';
    if (installation.gallery && installation.gallery.length > 0) {
      thumbnailGrid = '<div class="thumbnail-grid">';
      installation.gallery.forEach((image, index) => {
        if (image.url) {
          thumbnailGrid += `
                <img src="${image.url}" 
                     alt="${image.alt || installation.title}" 
                     class="thumbnail" 
                     onclick="setMainImage(${index + 1}); openLightbox(${index + 1})">`;
        }
      });
      thumbnailGrid += '</div>';
    }
    
    // Create content paragraphs
    const contentParagraphs = portableTextToHtml(installation.overview);
    const thanksParagraphs = portableTextToHtml(installation.thanksTo);
    
    // Create image array for JavaScript
    const images = [installation.coverImage?.url].filter(Boolean);
    if (installation.gallery) {
      images.push(...installation.gallery.filter(img => img?.url).map(img => img.url));
    }
    const imageArray = images.map(url => `"${url}"`).join(', ');
    
    // Replace template placeholders
    let pageContent = template
      .replace(/{{TITLE}}/g, installation.title)
      .replace(/{{LOCATION}}/g, `${installation.location?.city || ''}, ${installation.location?.country || ''}`.replace(/^, |, $/, ''))
      .replace(/{{URL_SLUG}}/g, installation.slug)
      .replace(/{{META_DESCRIPTION}}/g, installation.seo?.description || `${installation.title} installation by Rosehill TPV`)
      .replace(/{{KEYWORDS}}/g, `${installation.title}, Rosehill TPV, rubber surfacing, playground`)
      .replace(/{{FIRST_IMAGE}}/g, installation.coverImage?.url || '')
      .replace(/{{DATE}}/g, formatDate(installation.installationDate))
      .replace(/{{APPLICATION}}/g, installation.application || 'Installation')
      .replace(/{{THUMBNAIL_GRID}}/g, thumbnailGrid)
      .replace(/{{CONTENT_PARAGRAPHS}}/g, contentParagraphs)
      .replace(/{{THANKS_PARAGRAPHS}}/g, thanksParagraphs)
      .replace(/{{IMAGE_ARRAY}}/g, imageArray);
    
    // Write the English page
    fs.writeFileSync(filePath, pageContent);
    
    generatedPages.push({
      title: installation.title,
      slug: installation.slug,
      fileName: fileName
    });
    
    console.log(`✓ Generated: ${fileName}`);
  }

  console.log(`\n🎉 Generated ${generatedPages.length} installation pages!`);
}

main().catch(console.error);