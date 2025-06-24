# Website Reorganization Plan for Netlify Deployment

## Current Issues
1. All images are in the root directory or scattered folders
2. No external CSS files (all inline styles)
3. PHP file won't work on Netlify (static hosting)
4. No proper build configuration
5. Backup files mixed with production files

## Proposed New Structure

```
/
├── index.html                      # Homepage stays in root
├── netlify.toml                    # Netlify configuration
├── _redirects                      # URL redirects
├── robots.txt                      # SEO
├── sitemap.xml                     # SEO
│
├── /assets/
│   ├── /css/
│   │   ├── main.css               # Main stylesheet
│   │   └── admin.css              # Admin styles
│   ├── /js/
│   │   ├── main.js                # Site functionality
│   │   ├── binder-selector.js     # Binder tool
│   │   └── admin.js               # Admin functionality
│   └── /images/
│       ├── /logo/
│       │   └── rosehill_tpv_logo.png
│       ├── /heroes/
│       │   ├── hero_background.jpg
│       │   └── hero_background_colour.jpg
│       ├── /products/
│       │   ├── /granules/         # All TPV color images
│       │   ├── /blends/           # All blend images
│       │   └── /misc/             # tpv_granules.jpg, flexilon_binders.jpg
│       ├── /applications/
│       │   ├── playground.jpg
│       │   ├── muga.jpg
│       │   ├── track.jpg
│       │   ├── pitch.jpg
│       │   ├── footpath.jpg
│       │   └── splashpark.jpg
│       └── /installations/        # Keep existing structure
│
├── /pages/                        # Move non-index pages here
│   ├── about.html
│   ├── applications.html
│   ├── colour.html
│   ├── contact.html
│   ├── products.html
│   └── installations.html
│
├── /installations/                # Keep installation pages here
│   └── [all installation pages]
│
├── /admin/                        # Admin interface
│   └── add-installation.html
│
├── /api/                          # Netlify Functions (replace PHP)
│   └── process-installation.js    # Convert PHP to serverless function
│
├── /data/
│   └── installations.json
│
└── /docs/                         # Documentation
    ├── ADMIN_INSTRUCTIONS.md
    └── INSTALLATION_PAGES_GUIDE.md
```

## Step-by-Step Migration Plan

### Phase 1: Create Directory Structure
```bash
mkdir -p assets/{css,js,images/{logo,heroes,products/{granules,blends,misc},applications,installations}}
mkdir -p pages admin api data docs
```

### Phase 2: Move Images
1. Move logo: `rosehill_tpv_logo.png` → `/assets/images/logo/`
2. Move hero backgrounds → `/assets/images/heroes/`
3. Move all color granule images (e.g., "Azure RH23.jpg") → `/assets/images/products/granules/`
4. Move all blend images from `/Blends/` → `/assets/images/products/blends/`
5. Move application images → `/assets/images/applications/`
6. Keep `/images/installations/` as `/assets/images/installations/`

### Phase 3: Extract CSS
1. Create `main.css` with all common styles
2. Create `admin.css` for admin-specific styles
3. Update all HTML files to link to external CSS

### Phase 4: Extract JavaScript
1. Create `main.js` for common functionality (mobile menu, smooth scroll)
2. Create `binder-selector.js` for the binder tool
3. Create `admin.js` for admin functionality

### Phase 5: Update HTML Files
1. Move pages to `/pages/` directory
2. Update all image paths
3. Update all internal links
4. Add CSS and JS links

### Phase 6: Create Netlify Configuration

**netlify.toml:**
```toml
[build]
  publish = "/"

[[redirects]]
  from = "/about"
  to = "/pages/about.html"
  status = 200

[[redirects]]
  from = "/products"
  to = "/pages/products.html"
  status = 200

# Add redirects for all pages
```

### Phase 7: Convert PHP to Netlify Functions
Replace `admin-process-installation.php` with a Netlify Function

### Phase 8: Create Build Scripts
1. Image optimization script
2. Sitemap generation script
3. Installation page generation script

### Phase 9: Clean Up
1. Remove backup JSON files
2. Remove unused files
3. Create .gitignore

## Benefits
1. **Better Performance**: External CSS/JS can be cached
2. **Easier Maintenance**: Organized file structure
3. **Netlify Compatible**: No PHP, proper static structure
4. **SEO Friendly**: Proper sitemap and robots.txt
5. **Scalable**: Easy to add new sections/features
6. **Professional**: Follows industry best practices

## Implementation Priority
1. **High**: Fix PHP admin functionality for Netlify
2. **High**: Organize images into proper folders
3. **Medium**: Extract CSS to external files
4. **Medium**: Create proper build configuration
5. **Low**: Extract JavaScript to modules
6. **Low**: Optimize images

This reorganization will make the site much more maintainable and professional while ensuring it works perfectly on Netlify.