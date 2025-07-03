# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Website Architecture

This is a static website for Rosehill TPV (Thermoplastic Vulcanizate), a UK manufacturer of sports surface granules and binders. The site uses vanilla HTML, CSS, and JavaScript with no build process.

### Core Structure

**Main Pages:**
- `index.html` - Homepage with hero, products overview, applications, installations
- `products.html` - Detailed product information with integrated benefits section and Flexilon binder selector 
- `colour.html` - 21 standard colours with hero CTA button linking to mixer
- `mixer.html` - React-based color mixer tool for creating custom TPV blends
- `applications.html` - Use cases and surface types
- `installations.html` - Dynamic showcase of completed projects
- `about.html` - Company information
- `contact.html` - Contact forms and details

**Key Features:**
- **Dynamic Installation System**: Uses `installations.json` with JavaScript to generate project showcase pages
- **Flexilon Binder Selector**: Interactive tool on products page with categorized recommendations (Binders, Primers, Pre-treatments)
- **Color Mixer Tool**: React-based granule mixing interface with PDF export and share codes
- **Premium SVG Icons**: From `Icons/Glyph/` folder, properly styled with brand colors
- **Cookie Consent System**: GDPR-compliant cookie management with Google Analytics integration
- **Sticky Color Mixer Button**: Appears on colour page after scrolling past hero section

### Navigation Architecture

**Clean Navigation Strategy:**
- Main nav: Home, Products, Applications, Colour, Installations, About Us, Contact
- Color Mixer accessed via prominent hero buttons on homepage and colour page (not in main nav)
- Mobile-responsive with hamburger menu
- Fixed header with scroll effects

### Technical Components

**Installation Management:**
- `installations.json` - Central data store for all project installations
- `generate-installation-pages.js` - Creates individual HTML pages from JSON data
- `installation-template.html` - Template for auto-generated pages
- `installations/` directory contains all generated installation pages

**Styling Patterns:**
- **Brand Colors**: Primary #1a365d (dark blue), Accent #ff6b35 (orange)
- **Typography**: Overpass for headings, Source Sans Pro for body text
- **Icons**: SVG icons from Icons/Glyph/ folder with proper viewBox preservation
- **Responsive**: Mobile-first approach with 768px and 900px breakpoints

**Color Mixer (`mixer.html`):**
- React 18 with vanilla JavaScript (no build process)
- Uses D3 Delaunay for Voronoi diagrams
- jsPDF for report generation
- 21 predefined TPV colors with hex codes
- Seed-based granule generation for consistent patterns
- Project details form with material calculations

**Cookie Consent System (`cookie-consent.js`):**
- GDPR-compliant consent management for UK-based company
- Essential cookies (always enabled) and Analytics cookies (consent required)
- Google Analytics conditional loading based on user consent
- 1-year consent expiry with localStorage persistence
- Unobtrusive bottom banner with brand styling
- Cookie Settings modal for granular control
- Footer links for easy consent management

### Content Management

**Adding New Installations:**
1. Add entry to `installations.json` with required fields (title, location, date, description, etc.)
2. Run `node generate-installation-pages.js` to create HTML page
3. Images should be placed in root directory with descriptive names
4. Use the admin form at `admin-add-installation.html` for easier entry

**Icon Usage:**
- Source icons from `Icons/Glyph/` folder only
- Read actual SVG files to get complete path data and viewBox
- Apply consistent styling: 80px containers, #ff6b35 fill, white hover fill
- Preserve viewBox attributes for proper scaling

**Brand Guidelines:**
- All TPV references should include ® superscript: `TPV<sup>®</sup>`
- Flexilon references should include ® superscript: `Flexilon<sup>®</sup>`
- Company name: "Rosehill Sports & Play, A Division of Rosehill Group"
- Maintain consistent color scheme and typography across all pages

### Development Workflow

**Local Development:**
- Static files, no build process required
- Open HTML files directly in browser for testing
- Use browser dev tools for responsive testing

**Content Updates:**
- Update installations via JSON file and regenerate pages
- SVG icons must be sourced from Icons folder
- Maintain navigation consistency across all pages
- Test mobile responsiveness, especially navigation menu

**Cookie Management:**
- Cookie consent appears after 1.5 seconds on first visit
- Users can choose "Accept All" or "Essential Only"
- Analytics cookies only load Google Analytics if user consents
- Settings accessible via banner link or footer "Cookie Settings" link
- Consent expires after 1 year, then banner reappears
- LocalStorage key: `rosehill_cookie_consent`

**Adding Cookie Consent to New Pages:**
1. Include `cookie-consent.js` script before other JavaScript
2. Add cookie banner HTML after closing `</footer>` tag
3. Add cookie consent CSS to page styles
4. Add "Cookie Settings" link to footer
5. Call `initializeConsent()` and `initializeCookieEventListeners()` on DOMContentLoaded
6. Replace 'GA_MEASUREMENT_ID' with actual Google Analytics ID when ready

**Key Files to Preserve:**
- Navigation structure and mobile menu functionality
- Color mixer functionality and React integration
- Installation generation system
- Brand-consistent styling and icon implementation
- Cookie consent system and GDPR compliance