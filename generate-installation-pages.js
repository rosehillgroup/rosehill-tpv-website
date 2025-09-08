import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the installations data
const installationsData = JSON.parse(fs.readFileSync('installations.json', 'utf8'));
const template = fs.readFileSync('installation-template.html', 'utf8');

// Create installations directory if it doesn't exist
const installationsDir = path.join(__dirname, 'installations');
if (!fs.existsSync(installationsDir)) {
    fs.mkdirSync(installationsDir, { recursive: true });
}

// Function to create URL-friendly slug
function createSlug(title, location) {
    const combined = `${title} ${location}`.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim() // Trim whitespace
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    return combined;
}

// Function to create meta description
function createMetaDescription(description, location) {
    const firstParagraph = Array.isArray(description) ? description[0] : description;
    const cleanDescription = firstParagraph.replace(/®/g, '').substring(0, 150);
    return `${cleanDescription}... Rosehill TPV installation in ${location}.`;
}

// Function to create keywords
function createKeywords(title, location, application) {
    const baseKeywords = [
        'Rosehill TPV',
        'rubber surfacing',
        'playground surfacing',
        'sports surfacing',
        'safety surfacing'
    ];
    
    const locationKeywords = location.split(',').map(loc => loc.trim());
    const titleKeywords = title.toLowerCase().split(' ').filter(word => 
        word.length > 3 && !['the', 'and', 'for', 'with', 'from'].includes(word)
    );
    
    return [...baseKeywords, ...locationKeywords, ...titleKeywords, application].join(', ');
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Function to capitalize application
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

// Generate pages for each installation
let generatedPages = [];

installationsData.installations.forEach((installation, index) => {
    const slug = createSlug(installation.title, installation.location);
    const fileName = `${slug}.html`;
    const filePath = path.join(installationsDir, fileName);
    
    // Create thumbnail grid HTML
    let thumbnailGrid = '';
    if (installation.images && installation.images.length > 1) {
        thumbnailGrid = '<div class="thumbnail-grid">';
        installation.images.forEach((image, imgIndex) => {
            thumbnailGrid += `
                <img src="../images/installations/${image}" 
                     alt="${installation.title} - Image ${imgIndex + 1}" 
                     class="thumbnail" 
                     onclick="setMainImage(${imgIndex}); openLightbox(${imgIndex})">`;
        });
        thumbnailGrid += '</div>';
    }
    
    // Create content paragraphs HTML
    let contentParagraphs = '';
    if (installation.description && Array.isArray(installation.description)) {
        installation.description.forEach(paragraph => {
            contentParagraphs += `<p>${paragraph}</p>\n                `;
        });
    }
    
    // Create image array for JavaScript
    const imageArray = installation.images.map(img => `"${img}"`).join(', ');
    
    // Replace template placeholders
    let pageContent = template
        .replace(/{{TITLE}}/g, installation.title)
        .replace(/{{LOCATION}}/g, installation.location)
        .replace(/{{URL_SLUG}}/g, slug)
        .replace(/{{META_DESCRIPTION}}/g, createMetaDescription(installation.description, installation.location))
        .replace(/{{KEYWORDS}}/g, createKeywords(installation.title, installation.location, installation.application))
        .replace(/{{FIRST_IMAGE}}/g, installation.images[0])
        .replace(/{{DATE}}/g, formatDate(installation.date))
        .replace(/{{APPLICATION}}/g, capitalizeApplication(installation.application))
        .replace(/{{THUMBNAIL_GRID}}/g, thumbnailGrid)
        .replace(/{{CONTENT_PARAGRAPHS}}/g, contentParagraphs)
        .replace(/{{IMAGE_ARRAY}}/g, imageArray);
    
    // Write the file
    fs.writeFileSync(filePath, pageContent);
    
    generatedPages.push({
        title: installation.title,
        location: installation.location,
        slug: slug,
        fileName: fileName,
        url: `/installations/${slug}/`
    });
    
    console.log(`✓ Generated: ${fileName}`);
});

// Create index file for easy navigation
const indexContent = `# Generated Installation Pages

Total pages generated: ${generatedPages.length}

## Pages:
${generatedPages.map(page => `- [${page.title} - ${page.location}](${page.fileName})`).join('\n')}

## URLs:
${generatedPages.map(page => `- https://rosehilltpv.com${page.url}`).join('\n')}

Generated on: ${new Date().toISOString()}
`;

fs.writeFileSync(path.join(installationsDir, 'index.md'), indexContent);

console.log(`\n🎉 Successfully generated ${generatedPages.length} installation pages!`);
console.log(`📁 Pages saved to: ${installationsDir}`);
console.log(`📋 Index file created: ${path.join(installationsDir, 'index.md')}`);

// Generate sitemap entries
const sitemapEntries = generatedPages.map(page => 
    `https://rosehilltpv.com${page.url}`
).join('\n');

fs.writeFileSync('installation-sitemap.txt', sitemapEntries);
console.log(`🗺️  Sitemap entries saved to: installation-sitemap.txt`);

console.log('\n📝 Next steps:');
console.log('1. Upload the installations/ folder to your website');
console.log('2. Add the sitemap entries to your main sitemap.xml');
console.log('3. Update installations.html to link to individual pages');