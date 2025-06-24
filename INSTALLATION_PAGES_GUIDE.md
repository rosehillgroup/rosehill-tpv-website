# Installation Pages Management Guide

## Overview
This system creates individual SEO-friendly pages for each installation, helping with search engine rankings and user experience.

## For Marketing Assistant: How to Add New Installations

### Step 1: Add Installation to JSON
1. Open `installations.json`
2. Add your new installation to the end of the "installations" array:

```json
{
  "title": "Your Installation Title",
  "location": "City, Country",
  "date": "2024-MM-DD",
  "application": "playground|muga|sports|athletics|fitness",
  "description": [
    "First paragraph of description...",
    "Second paragraph...",
    "Third paragraph..."
  ],
  "images": [
    "image1.jpg",
    "image2.jpg",
    "image3.jpg"
  ]
}
```

### Step 2: Add Images
1. Place all images in the `images/installations/` folder
2. Make sure image filenames match exactly what you put in the JSON
3. Use descriptive filenames (e.g., `london-playground-main.jpg`)

### Step 3: Generate Pages
1. Open Terminal/Command Prompt
2. Navigate to the website folder
3. Run: `node generate-installation-pages.js`
4. This creates individual HTML pages for each installation

### Step 4: Upload to Website
1. Upload the entire `installations/` folder to your website
2. Upload updated `installations.json` file
3. Upload any new images to `images/installations/`

## What This Creates

### Individual Pages
- Each installation gets its own page with URL like: `/installations/playground-name-location/`
- Full SEO optimization (title, description, keywords, structured data)
- Image gallery with lightbox navigation
- Professional layout matching website design

### SEO Benefits
- Search engines can find and rank individual installations
- Better local SEO (location-based searches)
- Rich snippets in search results
- Social media sharing optimization

### Features for Each Page
- **Hero Image**: Large main image with gallery thumbnails
- **Image Gallery**: Click thumbnails to change main image
- **Lightbox**: Click any image to view full-size with navigation
- **Breadcrumbs**: Easy navigation back to installations list
- **Mobile Responsive**: Works perfectly on all devices
- **Fast Loading**: Optimized images and code

## File Structure
```
website/
├── installations.json                    # Your installation data
├── installations.html                   # Main installations page
├── generate-installation-pages.js       # Page generation script
├── installation-template.html          # Template (don't edit)
├── installations/                       # Generated pages folder
│   ├── playground-name-location.html    # Individual pages
│   ├── another-installation.html
│   └── index.md                        # Generated index
└── images/
    └── installations/                   # Your installation images
        ├── image1.jpg
        └── image2.jpg
```

## Tips for Best Results

### Writing Descriptions
- Write 2-4 paragraphs per installation
- Include location details and project specifics
- Mention Rosehill TPV benefits
- End with "Thanks to [contractor name]"

### Image Guidelines
- Use high-quality images (minimum 800px wide)
- Include before/after shots when possible
- Show different angles of the installation
- Compress images for web (keep under 500KB each)

### Titles & Locations
- **Good**: "Memorial Park Playground Renovation"
- **Location**: "Donald, Australia" (City, Country format)
- Avoid putting location in title (it's extracted automatically)

## Troubleshooting

### "Images not loading"
- Check image filenames match exactly (case-sensitive)
- Ensure images are in `images/installations/` folder
- Remove any special characters from filenames

### "Page generation failed"
- Check JSON syntax is valid (use JSONLint.com)
- Ensure all required fields are present
- Make sure Node.js is installed

### "SEO not working"
- Add sitemap entries to main sitemap.xml
- Submit individual pages to Google Search Console
- Check meta descriptions are under 160 characters

## Advanced: Bulk Image Processing

If you have images with size suffixes (like `-1024x768`), run:
```bash
# Remove size suffixes from all installation images
sed -i '' 's/-[0-9]*x[0-9]*\.jpeg/.jpeg/g' installations.json
sed -i '' 's/-[0-9]*x[0-9]*\.jpg/.jpg/g' installations.json
sed -i '' 's/-[0-9]*x[0-9]*\.png/.png/g' installations.json
```

## Questions?
If you need help, check:
1. Is Node.js installed? (`node --version`)
2. Are all file paths correct?
3. Is the JSON valid? (copy/paste to jsonlint.com)
4. Are images properly uploaded?

---

*Generated automatically - Last updated: ${new Date().toISOString().split('T')[0]}*