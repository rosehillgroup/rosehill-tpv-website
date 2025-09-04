// Webhook to automatically generate installation pages when installations are created/updated
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../../');

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

export async function handler(event, context) {
  const headers = corsHeaders();
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }
  
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }
  
  try {
    const { createClient } = await import('@sanity/client');
    const sanity = createClient({
      projectId: process.env.SANITY_PROJECT_ID || '68ola3dd',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2023-05-03',
      token: process.env.SANITY_WRITE_TOKEN,
      useCdn: false
    });

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
        "url": asset->url,
        alt
      },
      "gallery": gallery[] {
        "url": asset->url,
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
    
    // Read template
    const template = fs.readFileSync(path.join(rootDir, 'installation-template.html'), 'utf8');

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

    function createThumbnailGrid(gallery, title) {
      if (!gallery || gallery.length === 0) return '';
      
      let thumbnailGrid = '<div class="thumbnail-grid">';
      gallery.forEach((image, index) => {
        if (image.url) {
          thumbnailGrid += `
                <img src="${image.url}" 
                     alt="${image.alt || title}" 
                     class="thumbnail" 
                     onclick="setMainImage(${index + 1}); openLightbox(${index + 1})">`;
        }
      });
      thumbnailGrid += '</div>';
      return thumbnailGrid;
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

    let generatedCount = 0;

    // Generate pages for each installation and language
    for (const installation of installations) {
      const languages = ['en', 'es', 'fr', 'de'];
      
      for (const lang of languages) {
        // Skip if translation doesn't exist
        if (lang !== 'en' && !installation.publishedLocales?.includes(lang)) {
          continue;
        }

        // Get language-specific content
        const title = installation[`title__${lang}`] || installation.title;
        const location = installation[`location__${lang}`] || 
                        `${installation.location?.city || ''}, ${installation.location?.country || ''}`.replace(/^, |, $/, '');
        const overview = installation[`overview__${lang}`] || installation.overview;
        const thanksTo = installation[`thanksTo__${lang}`] || installation.thanksTo;

        // Create file paths
        const fileName = `${installation.slug}.html`;
        const filePath = lang === 'en' 
          ? path.join(rootDir, 'installations', fileName)
          : path.join(rootDir, lang, 'installations', fileName);

        // Create directories if needed
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Create content HTML
        const thumbnailGrid = createThumbnailGrid(installation.gallery, title);
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
          .replace(/{{THUMBNAIL_GRID}}/g, thumbnailGrid)
          .replace(/{{CONTENT_PARAGRAPHS}}/g, contentParagraphs)
          .replace(/{{THANKS_PARAGRAPHS}}/g, thanksParagraphs)
          .replace(/{{IMAGE_ARRAY}}/g, imageArray);
        
        // Write the file
        fs.writeFileSync(filePath, pageContent);
        generatedCount++;
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Generated ${generatedCount} installation pages`,
        installations: installations.length,
        generated: generatedCount
      })
    };
    
  } catch (error) {
    console.error('Page generation error:', error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: 'Failed to generate pages: ' + error.message }) 
    };
  }
}