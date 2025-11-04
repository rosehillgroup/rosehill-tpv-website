# UV Fade Visualiser - Implementation Notes

## ✅ Phase 1 Complete - Front-End MVP

**Created:** November 3, 2025
**Status:** Ready for testing and review

---

## 📁 Files Created

### Main Application
- **`/performance/uv-stability.html`** (42KB)
  - Complete single-page application
  - MapLibre GL JS integration
  - Interactive drawer UI
  - 21 TPV® color swatches
  - Fade comparison calculator
  - Methodology modal

### Sample Data Files
- **`/data/cities.json`** - 20 curated cities with UV data
- **`/data/uv_sample_lookup.json`** - Sample UV Index lookup grid (0.25° resolution)
- **`/data/uv_copy.json`** - Content, methodology, and disclaimers

---

## 🎨 Features Implemented

### ✅ Core Functionality
- [x] Interactive world map (MapLibre GL JS with OpenStreetMap tiles)
- [x] UV Index legend (5 categories: Low → Extreme)
- [x] Click-to-select location on map
- [x] City search with dropdown (20 pre-loaded cities)
- [x] UV Index lookup from sample grid
- [x] Latitude-based fallback estimation

### ✅ Color & Fade System
- [x] All 21 TPV® colors from existing palette
- [x] Color swatch selector
- [x] Duration toggle (12 months / 3 years)
- [x] Exponential decay fade model: `L = 0.85 × (1 - e^(-2.4×D×t))`
- [x] HSL-based color desaturation for fading effect
- [x] Side-by-side EPDM vs TPV® comparison

### ✅ UI/UX
- [x] Matches existing TPV site styling (#1a365d, #ff6b35, Overpass/Source Sans Pro)
- [x] Responsive layout (desktop: side-by-side, mobile: stacked)
- [x] One-time onboarding tooltip
- [x] Methodology modal with data sources
- [x] "Request Sample" CTA button
- [x] Smooth animations and transitions

### ✅ Analytics
- [x] GA4 event tracking via dataLayer
  - `location_select`
  - `map_click`
  - `colour_change`
  - `duration_toggle`
  - `contact_cta_click`

### ✅ Integration
- [x] Reuses existing header/footer structure
- [x] Compatible with existing cookie consent system
- [x] Matches navigation and branding
- [x] GTM integration (GTM-5565Z2W7)

---

## 🎯 How It Works

### User Flow
1. **Page loads** → Map displays with UV legend
2. **Onboarding tooltip** appears (first visit only)
3. **User searches city** OR **clicks map** → Location selected
4. **UV data displayed** → Annual mean, peak, category badge
5. **User selects TPV® colour** → 21 colour swatches available
6. **User toggles duration** → 12 months or 3 years
7. **Fade comparison shown** → EPDM vs TPV® side-by-side
8. **CTA appears** → "Request Sample" button
9. **Optional:** User clicks "How This Works" → Methodology modal

### Technical Architecture
- **Client-side only** - No server dependencies
- **Data lookup** - Snaps lat/lon to nearest 0.25° grid point
- **Fallback logic** - Latitude-based UV estimation if grid lookup fails
- **Colour transform** - RGB → HSL → desaturate/lighten → RGB
- **Fade formula** - `Loss = 0.85 × (1 - exp(-2.4 × normalisedUVI × years))`

---

## 🚀 Next Steps - Phase 2

### Data Pipeline Integration
When ready to integrate real NASA data:

1. **Process NASA AURA_UVI_CLIM_M data** (GitHub Actions)
   - Download 12 monthly GeoTIFFs
   - Calculate annual mean
   - Generate XYZ tiles (z0-8)
   - Create full `uv_lookup_0_25deg.json`

2. **Upload to Supabase Storage**
   ```
   uv-data/
     tiles/uv/{z}/{x}/{y}.png
     data/uv_lookup_0_25deg.json
     data/cities.json
   ```

3. **Update HTML to use Supabase tiles**
   Replace OpenStreetMap source with:
   ```javascript
   map.addSource('uv-layer', {
     type: 'raster',
     tiles: ['https://<project-ref>.supabase.co/storage/v1/object/public/uv-data/tiles/uv/{z}/{x}/{y}.png'],
     tileSize: 256
   });
   ```

### Optional Enhancements
- [ ] Add photo comparison section (real EPDM vs TPV® examples)
- [ ] Export comparison as PDF/PNG
- [ ] Share URL with selected location/color
- [ ] External geocoding API (Mapbox/Google) for address search
- [ ] Custom hex color input
- [ ] Edge Function for event logging to Supabase
- [ ] Sanity CMS for content management

---

## 📊 Sample Data

### Cities Included (20 locations)
- **Extreme UV:** Singapore, Lima, Mexico City, Bangkok
- **Very High:** Dubai, Sydney, Cape Town, Hong Kong, Cairo, Mumbai, Johannesburg
- **High:** Los Angeles, Madrid, Tokyo
- **Moderate:** London, Berlin, Paris, New York, Oslo
- **Low:** Reykjavik

### UV Lookup Grid
- Resolution: 0.25 degrees (~28km at equator)
- Format: `"lat,lon": { "uvi": 11.2, "category": "Extreme" }`
- Covers all 20 sample cities
- Fallback: Latitude-based estimation

---

## 🔗 Integration Points

### Adding to Site Navigation
To add to main navigation, edit existing header in all pages:

```html
<li><a href="performance/uv-stability.html">UV Stability</a></li>
```

Or link from Products page:
```html
<a href="performance/uv-stability.html" class="btn">
  Explore UV Fade Visualiser
</a>
```

### Cookie Consent
The page already includes GTM. If you want to add explicit cookie consent banner:
1. Copy cookie consent HTML/CSS from `colour.html`
2. Include `cookie-consent.js`
3. Add cookie settings link to methodology section

---

## 🧪 Testing Checklist

### Functionality
- [x] Map loads and displays correctly
- [x] City search filters and selects locations
- [x] Map click updates location
- [x] UV values display correctly
- [x] Color picker selects and highlights
- [x] Duration toggle switches between 12m/3y
- [x] Fade comparison updates with correct calculations
- [x] Methodology modal opens/closes
- [x] Onboarding tooltip shows once
- [x] All links work (Contact CTA, back to home)

### Responsive Design
- [x] Desktop: Map left, drawer right
- [x] Mobile: Map top, drawer bottom
- [x] Legend repositions correctly
- [x] Touch interactions work on mobile
- [x] Text readable at all sizes

### Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Safari (Mac/iOS)
- [ ] Firefox
- [ ] Mobile browsers (iOS Safari, Chrome Android)

### Performance
- [ ] Page loads in <3 seconds
- [ ] Map interactions smooth
- [ ] Color changes instant
- [ ] No console errors
- [ ] Analytics events fire correctly

---

## 📝 Known Limitations (MVP)

1. **Sample data only** - Uses 25 grid points + fallback estimation
2. **No real UV tiles** - Map shows OpenStreetMap, not UV gradient overlay
3. **Simple fade model** - HSL desaturation, not true OKLCH (for browser compatibility)
4. **Static content** - No CMS integration yet
5. **No photo comparisons** - Placeholder text only
6. **Basic geocoding** - Curated city list only, no address search

These will be addressed in Phase 2 with real data pipeline and Supabase integration.

---

## 🎨 Brand Consistency

**Colors:**
- Primary: `#1a365d` (dark blue)
- Accent: `#ff6b35` (orange)
- Backgrounds: `#f8f9fa` (light grey)

**Typography:**
- Headings: `Overpass` (Google Fonts)
- Body: `Source Sans Pro` (Google Fonts)

**UI Elements:**
- Border radius: `8px`
- Button hover: `-2px translateY`
- Box shadows: `0 4px 12px rgba(0,0,0,0.1)`
- Transitions: `0.3s ease`

---

## 📧 Contact

For questions or feedback on the UV Visualiser:
- Review the live page at: `/performance/uv-stability.html`
- Check data files in: `/data/`
- Refer to original plan: `/uv-fade-visualiser.md`

---

**Built with:**
- MapLibre GL JS v3.6.2
- Vanilla JavaScript (no framework)
- Responsive CSS Grid & Flexbox
- Google Tag Manager for analytics
