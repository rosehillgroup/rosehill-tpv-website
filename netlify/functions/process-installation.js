const fs = require('fs').promises;
const path = require('path');
const multipart = require('parse-multipart-data');

// Utility functions
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function sanitizeFilename(filename) {
    const ext = path.extname(filename);
    const name = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    return `${Date.now()}_${name}${ext}`;
}

async function loadInstallationsJson() {
    try {
        const data = await fs.readFile('installations.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { installations: [] };
    }
}

async function saveInstallationsJson(data) {
    try {
        // Create backup
        const timestamp = Date.now();
        try {
            const existing = await fs.readFile('installations.json', 'utf8');
            await fs.writeFile(`installations.json.backup.${timestamp}`, existing);
        } catch (e) {
            // Backup failed, but continue
        }
        
        // Save new data
        await fs.writeFile('installations.json', JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Failed to save installations.json:', error);
        return false;
    }
}

async function saveImages(files) {
    const uploadedFiles = [];
    const uploadsDir = 'images/installations/';
    
    // Ensure directory exists
    try {
        await fs.mkdir(uploadsDir, { recursive: true });
    } catch (error) {
        console.error('Failed to create uploads directory:', error);
    }
    
    for (const file of files) {
        try {
            const filename = sanitizeFilename(file.filename);
            const filepath = path.join(uploadsDir, filename);
            
            await fs.writeFile(filepath, file.data);
            uploadedFiles.push(filename);
        } catch (error) {
            console.error('Failed to save image:', error);
        }
    }
    
    return uploadedFiles;
}

async function generateInstallationPage(installation) {
    try {
        // Load template
        const template = await fs.readFile('installation-template.html', 'utf8');
        
        // Generate slug and filename
        const slug = generateSlug(installation.title);
        const filename = `${slug}.html`;
        
        // Replace template placeholders
        let html = template
            .replace(/{{TITLE}}/g, installation.title)
            .replace(/{{LOCATION}}/g, installation.location)
            .replace(/{{DATE}}/g, new Date(installation.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }));
        
        // Generate description HTML
        const descriptionHtml = installation.description
            .map(p => `                <p>${p}</p>`)
            .join('\n');
        html = html.replace('{{DESCRIPTION}}', descriptionHtml);
        
        // Generate images HTML
        const imagesHtml = installation.images
            .map((image, index) => 
                `                <div class="installation-image">\n` +
                `                    <img src="../images/installations/${image}" alt="${installation.title} - Image ${index + 1}">\n` +
                `                </div>`
            ).join('\n');
        html = html.replace('{{IMAGES}}', imagesHtml);
        
        // Add meta description
        const metaDescription = installation.description[0].substring(0, 155) + '...';
        html = html.replace('{{META_DESCRIPTION}}', metaDescription);
        
        // Save the file
        const filepath = path.join('installations', filename);
        await fs.writeFile(filepath, html);
        
        return filename;
    } catch (error) {
        console.error('Failed to generate installation page:', error);
        throw error;
    }
}

async function updateSitemap(newSlug) {
    try {
        const sitemapFile = 'installation-sitemap.txt';
        const newUrl = `installations/${newSlug}.html`;
        
        let sitemap = '';
        try {
            sitemap = await fs.readFile(sitemapFile, 'utf8');
        } catch (e) {
            // File doesn't exist, create new
        }
        
        if (!sitemap.includes(newUrl)) {
            sitemap += '\n' + newUrl;
            await fs.writeFile(sitemapFile, sitemap.trim());
        }
    } catch (error) {
        console.error('Failed to update sitemap:', error);
    }
}

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };
    
    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
    
    try {
        // Parse multipart form data
        const boundary = event.headers['content-type'].split('boundary=')[1];
        const parts = multipart.parse(Buffer.from(event.body, 'base64'), boundary);
        
        // Extract form fields
        const formData = {};
        const files = [];
        
        parts.forEach(part => {
            if (part.filename) {
                // This is a file
                files.push({
                    filename: part.filename,
                    data: part.data,
                    type: part.type
                });
            } else {
                // This is a form field
                formData[part.name] = part.data.toString();
            }
        });
        
        // Validate required fields
        const required = ['title', 'location', 'date', 'application', 'descriptions'];
        for (const field of required) {
            if (!formData[field]) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: `Missing required field: ${field}` })
                };
            }
        }
        
        // Validate files
        if (files.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'At least one image is required' })
            };
        }
        
        // Parse descriptions
        let descriptions;
        try {
            descriptions = JSON.parse(formData.descriptions);
        } catch (e) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid descriptions format' })
            };
        }
        
        // Upload images
        const uploadedImages = await saveImages(files);
        if (uploadedImages.length === 0) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to upload images' })
            };
        }
        
        // Create installation object
        const installation = {
            title: formData.title.trim(),
            location: formData.location.trim(),
            date: formData.date,
            application: formData.application,
            description: descriptions,
            images: uploadedImages
        };
        
        // Load existing installations
        const data = await loadInstallationsJson();
        
        // Add new installation to the beginning
        data.installations.unshift(installation);
        
        // Save updated JSON
        const saved = await saveInstallationsJson(data);
        if (!saved) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to update installations database' })
            };
        }
        
        // Generate installation page
        const pageFilename = await generateInstallationPage(installation);
        
        // Update sitemap
        const slug = generateSlug(installation.title);
        await updateSitemap(slug);
        
        // Success response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Installation created successfully',
                data: {
                    filename: pageFilename,
                    slug: slug,
                    images_uploaded: uploadedImages.length
                }
            })
        };
        
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                details: error.message
            })
        };
    }
};