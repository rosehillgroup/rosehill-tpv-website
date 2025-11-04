# UV Fade Visualiser - Deployment Checklist

**Date:** November 3, 2025
**Status:** Ready for Data Processing & Deployment

---

## ✅ Completed - Phase 1 (Front-End MVP)

- [x] UV Fade Visualiser HTML page created
- [x] MapLibre GL JS integration
- [x] 21 TPV colours integrated
- [x] City search functionality
- [x] Fade calculation algorithm
- [x] Duration toggle (12m/3y)
- [x] Methodology modal
- [x] Mobile responsive design
- [x] British English throughout
- [x] GA4 analytics tracking
- [x] Sample data files (20 cities)
- [x] Dark basemap integration (CartoDB)
- [x] UV overlay layer prepared
- [x] Supabase URL configuration
- [x] CSP headers updated

---

## 🚀 Phase 2 - Data Pipeline (To Do)

### Step 1: Supabase Storage Setup

**Prerequisites:**
- [ ] Access to Supabase project `okakomwfikxmwllvliva`
- [ ] Supabase CLI installed: `npm install -g supabase`
- [ ] Logged in: `supabase login`

**Actions:**
- [ ] Create public storage bucket `uv-data`
- [ ] Configure bucket policies (public read access)
- [ ] Verify bucket accessible via browser

**Verification:**
```bash
curl -I "https://okakomwfikxmwllvliva.supabase.co/storage/v1/object/public/uv-data/"
# Should return: 404 (bucket exists, no file yet)
```

---

### Step 2: Process NASA UV Data

**Prerequisites:**
- [ ] Python 3.8+ installed
- [ ] GDAL installed: `brew install gdal`
- [ ] Python packages: `pip3 install requests numpy rasterio rio-cogeo`
- [ ] Disk space: ~2GB free

**Actions:**
```bash
cd "/Volumes/Marketing_SSD/Websites 2025/TPV_2025_Deploy"

# Run data processing pipeline
python3 scripts/process-uv-data.py --year 2024 --output-dir output

# Expected runtime: 1-2 hours
# Monitors progress in terminal
```

**Verification:**
- [ ] All 12 monthly files downloaded (~600MB)
- [ ] Annual mean GeoTIFF created (~50MB)
- [ ] COG created (~50MB)
- [ ] Tiles generated (check `output/tiles/uv/`, ~1000 files)
- [ ] Lookup JSON created (~3MB, ~65k points)
- [ ] Upload script created (`output/upload-to-supabase.sh`)

---

### Step 3: Upload Data to Supabase

**Actions:**
```bash
cd output
./upload-to-supabase.sh

# Expected runtime: 10-15 minutes
# Uploads ~1000 tile files + JSON + COG
```

**Verification:**
- [ ] Tiles accessible: Test `https://okakomwfikxmwllvliva.supabase.co/storage/v1/object/public/uv-data/tiles/uv/0/0/0.png`
- [ ] Lookup JSON accessible: `curl https://okakomwfikxmwllvliva.supabase.co/storage/v1/object/public/uv-data/data/uv_lookup_full.json | jq '.data | length'`
- [ ] Cities JSON accessible
- [ ] Content JSON accessible

---

### Step 4: Enable UV Overlay

**Edit:** `/performance/uv-stability.html`

**Line 925:** Change flag
```javascript
const USE_UV_OVERLAY = true; // Was: false
```

**Line 1001:** Change flag
```javascript
const USE_SUPABASE_DATA = true; // Was: false
```

**Save and commit changes**

---

### Step 5: Test Locally

**Start local server:**
```bash
cd "/Volumes/Marketing_SSD/Websites 2025/TPV_2025_Deploy"
python3 -m http.server 8080
```

**Open:** http://localhost:8080/performance/uv-stability.html

**Verify:**
- [ ] Dark basemap loads
- [ ] UV overlay appears (color-coded gradient)
- [ ] Legend matches overlay colors
- [ ] Click map → accurate UV values (~11 Singapore, ~4 London)
- [ ] Search cities → correct data from full grid
- [ ] Mobile responsive (test viewport < 968px)
- [ ] Console shows: "Loading data from: Supabase"
- [ ] Console shows: "~65,000 grid points" loaded
- [ ] No errors in console
- [ ] Tiles load within 2 seconds

---

### Step 6: Deploy to Production

**Commit changes:**
```bash
git add .
git commit -m "Enable UV overlay with Supabase data"
git push origin main
```

**Netlify will auto-deploy** (~2 minutes)

**Verify deployment:**
- [ ] Visit: https://tpv.rosehill.group/performance/uv-stability.html
- [ ] Map loads with UV overlay
- [ ] All functionality works
- [ ] No console errors
- [ ] Mobile performance good

---

## 🧪 Smoke Tests

### Test Cases

**1. Visual Test**
- [ ] Map displays dark basemap
- [ ] UV gradient visible (green poles → purple equator)
- [ ] Legend visible in top-left (mobile) or bottom-left (desktop)
- [ ] Colors match legend

**2. Interaction Test**
- [ ] Click Singapore → UVI ~11, category "Extreme"
- [ ] Click London → UVI ~4, category "Moderate"
- [ ] Click Reykjavik → UVI ~2, category "Low"
- [ ] Click random ocean → fallback estimation works

**3. Search Test**
- [ ] Type "sing" → Singapore appears in dropdown
- [ ] Select Singapore → map flies to location, data updates
- [ ] Type "lon" → London appears
- [ ] Select city → drawer shows correct UV Index

**4. Colour Test**
- [ ] Select "Standard Blue" → both swatches update
- [ ] Singapore (UVI 11) → EPDM shows ~80% fade
- [ ] London (UVI 4) → EPDM shows ~40% fade
- [ ] TPV swatch always shows original colour

**5. Duration Test**
- [ ] Toggle to "3 Years" → fade percentage increases
- [ ] Singapore 3y → EPDM shows ~90% fade
- [ ] Toggle back to "12 Months" → percentage decreases

**6. Mobile Test**
- [ ] Resize to 375px width (iPhone size)
- [ ] Map at top, drawer at bottom
- [ ] Legend at top of map (not overlapping drawer)
- [ ] All buttons accessible
- [ ] Search dropdown works
- [ ] Colour swatches tap-able

---

## 📊 Performance Benchmarks

**Target metrics:**
- Initial page load: < 2s
- Time to interactive: < 3s
- Tile loading: 50-200ms per tile
- Map interactions: 60fps
- Memory usage: < 100MB

**Test with:**
- Chrome DevTools → Performance tab
- Lighthouse audit
- Network tab (check tile caching)

---

## 🔄 Post-Launch Monitoring

### Week 1

- [ ] Monitor GA4 for usage patterns
- [ ] Check server logs for errors
- [ ] Monitor Supabase storage bandwidth
- [ ] Collect user feedback

### Monthly

- [ ] Review analytics (popular locations, colours)
- [ ] Check for broken tiles
- [ ] Monitor load times

### Annually

- [ ] Update NASA UV data (new year)
- [ ] Re-run processing pipeline
- [ ] Upload new tiles to Supabase
- [ ] Verify accuracy with latest data

---

## 🆘 Troubleshooting Guide

### Issue: Tiles not loading

**Symptoms:** Dark map loads but no UV overlay

**Fixes:**
1. Check `USE_UV_OVERLAY = true` in HTML
2. Verify Supabase bucket is public
3. Test direct tile URL in browser
4. Check browser console for CORS errors
5. Verify CSP headers include `basemaps.cartocdn.com`

### Issue: Incorrect UV values

**Symptoms:** UV Index seems wrong for known locations

**Fixes:**
1. Check `USE_SUPABASE_DATA = true` in HTML
2. Verify lookup JSON uploaded correctly
3. Test lookup URL: `curl ... | jq '.data | length'` (should be ~65000)
4. Check grid resolution matches code (0.25°)
5. Verify sample cities have correct values

### Issue: Slow loading

**Symptoms:** Page takes >5 seconds to load

**Fixes:**
1. Check Network tab → verify tile caching
2. Confirm cache headers set correctly
3. Test Supabase CDN speed
4. Consider reducing tile zoom levels (0-7 instead of 0-8)
5. Check lookup JSON is gzipped

### Issue: Mobile layout broken

**Symptoms:** Legend overlaps drawer on mobile

**Fixes:**
1. Check media query at 968px breakpoint
2. Verify legend positioned `top: 80px` on mobile
3. Test on real device (not just browser resize)

---

## 📝 Configuration Reference

### Feature Flags (in HTML)

```javascript
// Line 925
const USE_UV_OVERLAY = false;    // Set to true after data upload

// Line 1001
const USE_SUPABASE_DATA = false; // Set to true after data upload

// Line 926 & 1002
const SUPABASE_URL = 'https://okakomwfikxmwllvliva.supabase.co';
```

### Supabase URLs

- **Tiles:** `https://okakomwfikxmwllvliva.supabase.co/storage/v1/object/public/uv-data/tiles/uv/{z}/{x}/{y}.png`
- **Lookup:** `https://okakomwfikxmwllvliva.supabase.co/storage/v1/object/public/uv-data/data/uv_lookup_full.json`
- **Cities:** `https://okakomwfikxmwllvliva.supabase.co/storage/v1/object/public/uv-data/data/cities.json`

### Cache Headers

- Tiles: `public, max-age=31536000, immutable`
- JSON: `public, max-age=604800`

---

## 📞 Support Contacts

- **NASA Data:** https://neo.gsfc.nasa.gov/about/
- **Supabase:** https://supabase.com/docs
- **MapLibre:** https://maplibre.org/maplibre-gl-js/docs/
- **GDAL:** https://gdal.org/

---

## ✨ Success Criteria

**Launch is successful when:**
- ✅ UV overlay displays globally
- ✅ All 20 curated cities return accurate UV values
- ✅ Click anywhere on map returns reasonable UVI (0-16)
- ✅ Fade comparison updates correctly
- ✅ Mobile experience is smooth
- ✅ Page loads in < 3 seconds
- ✅ No console errors
- ✅ Analytics tracking works
- ✅ User feedback is positive

---

**Next Step:** Proceed with Step 1 - Create Supabase storage bucket!
