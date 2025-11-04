# UV Data Pipeline - Setup & Deployment Guide

**Created:** November 3, 2025
**For:** Rosehill TPV UV Fade Visualiser
**Status:** Ready for deployment

---

## 📋 Overview

This guide walks through setting up the complete UV Index data pipeline, from processing NASA satellite data to deploying the interactive map visualization.

---

## 🚀 Quick Start (Complete Workflow)

### Prerequisites

1. **Python 3.8+** with pip
2. **GDAL** (`brew install gdal` on Mac)
3. **Supabase CLI** (`npm install -g supabase`)
4. **Supabase Access**: Project `okakomwfikxmwllvliva`

###  Installation

```bash
# Install Python dependencies
pip3 install requests numpy rasterio rio-cogeo

# Verify GDAL is installed
gdal2tiles.py --version
```

### Run Pipeline

```bash
cd "/Volumes/Marketing_SSD/Websites 2025/TPV_2025_Deploy"

# Process NASA data (takes ~1-2 hours)
python3 scripts/process-uv-data.py --year 2024

# Upload to Supabase
cd output
./upload-to-supabase.sh
```

---

## 📊 Part 1: Supabase Storage Setup

### Step 1: Create Storage Bucket

1. **Access Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/okakomwfikxmwllvliva
   - Navigate to: Storage → Buckets

2. **Create New Bucket**
   - Name: `uv-data`
   - Public: ✅ **Yes** (Required for tile serving)
   - File size limit: 50 MB
   - Allowed MIME types: `image/png, application/json, image/tiff`

3. **Create Folder Structure** (optional, will be created automatically)
   ```
   uv-data/
     tiles/
       uv/
     data/
   ```

### Step 2: Configure Storage Policies

**Policy: Public Read Access**

```sql
CREATE POLICY "Public read access for uv-data"
ON storage.objects FOR SELECT
USING (bucket_id = 'uv-data');
```

**Policy: Service Role Upload**

```sql
CREATE POLICY "Service role upload for uv-data"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'uv-data'
  AND auth.role() = 'service_role'
);
```

### Step 3: Verify Access

Test public access with curl:

```bash
# Should return 404 (bucket exists but no file yet)
curl -I "https://okakomwfikxmwllvliva.supabase.co/storage/v1/object/public/uv-data/test.txt"
```

---

## 🔧 Part 2: Process NASA UV Data

### What the Script Does

The `process-uv-data.py` script:

1. **Downloads** 12 monthly UV Index GeoTIFFs from NASA (~600MB total)
2. **Calculates** annual mean UV Index
3. **Generates** Cloud Optimized GeoTIFF (COG)
4. **Creates** XYZ raster tiles (zoom 0-8, ~1000 tiles)
5. **Builds** JSON lookup grid (0.25° resolution, ~65,000 points)
6. **Prepares** upload script for Supabase

### Run the Pipeline

```bash
cd "/Volumes/Marketing_SSD/Websites 2025/TPV_2025_Deploy"

# Process data for 2024 (or current year)
python3 scripts/process-uv-data.py --year 2024 --output-dir output

# Expected output structure:
# output/
#   downloads/          (12 monthly GeoTIFFs, ~50MB each)
#   uv_mean.tif         (Annual mean, ~50MB)
#   uv_mean_cog.tif     (COG, ~50MB)
#   tiles/uv/           (XYZ tiles, zoom 0-8)
#     0/
#     1/
#     ...
#     8/
#   data/
#     uv_lookup_full.json  (~3MB)
#   upload-to-supabase.sh  (Automated upload script)
```

### Expected Runtime

- Downloads: 15-30 minutes (depends on connection)
- Processing: 5-10 minutes
- Tile generation: 10-20 minutes
- Lookup grid: 5-10 minutes
- **Total: ~1-2 hours**

### Troubleshooting

**NASA download fails:**
```bash
# Manual download alternative
curl -O "https://neo.gsfc.nasa.gov/archive/geotiff.float/AURA_UVI_CLIM_M/AURA_UVI_CLIM_M_2024-01.TIFF"
# Repeat for months 01-12
```

**GDAL not found:**
```bash
brew install gdal
# or
conda install -c conda-forge gdal
```

**Out of memory:**
```bash
# Reduce tile zoom range
python3 scripts/process-uv-data.py --year 2024 --max-zoom 7
```

---

## 📤 Part 3: Upload to Supabase

### Automatic Upload (Recommended)

The pipeline generates an upload script:

```bash
cd output
./upload-to-supabase.sh
```

This will:
- Upload ~1000 tile PNG files
- Upload `uv_lookup_full.json` (3MB)
- Upload `uv_mean_cog.tif` (optional, for future features)
- Set proper cache headers

**Expected upload time:** 10-15 minutes

### Manual Upload (Alternative)

If the script fails, upload manually:

```bash
supabase login
supabase link --project-ref okakomwfikxmwllvliva

# Upload tiles
supabase storage cp \
  --recursive \
  tiles/uv/ \
  storage://uv-data/tiles/uv/

# Upload lookup JSON
supabase storage cp \
  data/uv_lookup_full.json \
  storage://uv-data/data/uv_lookup_full.json
```

### Verify Upload

Check tile access:

```bash
# Test a zoom 0 tile
curl -I "https://okakomwfikxmwllvliva.supabase.co/storage/v1/object/public/uv-data/tiles/uv/0/0/0.png"
# Should return: 200 OK

# Test lookup JSON
curl "https://okakomwfikxmwllvliva.supabase.co/storage/v1/object/public/uv-data/data/uv_lookup_full.json" | jq '.data | length'
# Should return: ~65000
```

---

## 🗺️ Part 4: Integrate with UV Visualiser

### Step 1: Update HTML (Already Done)

The map integration will be updated to:
- Use CartoDB Dark Matter basemap
- Add UV raster overlay from Supabase tiles
- Fetch lookup data from Supabase

### Step 2: Update CSP Headers

Add Supabase storage to Content Security Policy in `netlify.toml`:

```toml
img-src 'self' ... https://*.supabase.co https://okakomwfikxmwllvliva.supabase.co ...
connect-src 'self' ... https://okakomwfikxmwllvliva.supabase.co ...
```

### Step 3: Test the Visualiser

1. Open: http://localhost:8080/performance/uv-stability.html
2. Verify:
   - ✅ Dark basemap loads
   - ✅ UV overlay appears (color-coded)
   - ✅ Click map → accurate UV values
   - ✅ Search cities → correct data
   - ✅ Legend matches overlay colors

---

## 🔄 Part 5: Annual Updates

### When to Update

Update UV data annually (or when NASA releases new climatology):
- Check NASA NEO for updated AURA_UVI_CLIM_M data
- Typically available 6-12 months after year end

### Quick Update Process

```bash
# 1. Process new year's data
python3 scripts/process-uv-data.py --year 2025

# 2. Upload to Supabase (overwrites old data)
cd output
./upload-to-supabase.sh

# 3. Clear browser cache
# No code changes needed!
```

### Version Management

Optional: Keep versioned datasets

```bash
# Upload to versioned path
supabase storage cp \
  --recursive \
  tiles/uv/ \
  storage://uv-data/tiles/uv-2025/

# Update HTML to point to new version
tiles: ['https://.../uv-data/tiles/uv-2025/{z}/{x}/{y}.png']
```

---

## 📁 File Structure

```
TPV_2025_Deploy/
├── scripts/
│   └── process-uv-data.py          # Main processing script
├── output/                          # Generated data (not in git)
│   ├── downloads/                   # NASA source files
│   ├── uv_mean.tif                  # Annual mean raster
│   ├── uv_mean_cog.tif             # Cloud Optimized GeoTIFF
│   ├── tiles/uv/                    # XYZ tile pyramid
│   ├── data/uv_lookup_full.json    # Lookup grid
│   └── upload-to-supabase.sh       # Upload script
└── performance/
    └── uv-stability.html            # UV Visualiser page
```

---

## 🔍 Data Specifications

### UV Index Raster

- **Format:** GeoTIFF (COG)
- **Resolution:** ~10km at equator (0.1°)
- **Extent:** Global (-180 to 180°, -90 to 90°)
- **Values:** 0-16 (UV Index scale)
- **Projection:** WGS84 (EPSG:4326)
- **Size:** ~50MB

### XYZ Tiles

- **Format:** PNG (8-bit RGB + alpha)
- **Zoom levels:** 0-8
- **Tile size:** 256×256 pixels
- **Count:** ~1000 tiles total
- **Total size:** ~50-100MB
- **Projection:** Web Mercator (EPSG:3857)

### Lookup Grid

- **Format:** JSON
- **Resolution:** 0.25° (~28km at equator)
- **Points:** ~65,000 global points
- **Size:** ~3MB uncompressed, ~500KB gzipped
- **Structure:**
  ```json
  {
    "version": "uv-v2024",
    "resolution": 0.25,
    "data": {
      "51.50,-0.25": { "uvi": 4.2, "category": "Moderate" },
      ...
    }
  }
  ```

---

## 🎨 UV Index Color Ramp

The tiles use this standard color ramp:

| Category    | UVI Range | Hex Color | RGB |
|-------------|-----------|-----------|-----|
| Low         | 0-2       | #C5E1A5   | 197, 225, 165 |
| Moderate    | 3-5       | #FFF59D   | 255, 245, 157 |
| High        | 6-7       | #FFB74D   | 255, 183, 77  |
| Very High   | 8-10      | #EF5350   | 239, 83, 80   |
| Extreme     | ≥11       | #AB47BC   | 171, 71, 188  |

---

## 📊 Expected Performance

### Client-Side Loading

- **Initial page load:** <2s
- **Tile loading:** 50-200ms per tile
- **Lookup query:** <50ms
- **Total data transfer:** ~500KB-2MB (initial + tiles)

### Caching

- **Tiles:** 1 year (`max-age=31536000`)
- **Lookup JSON:** 7 days (`max-age=604800`)
- **Subsequent visits:** Near-instant (cached)

---

## 🆘 Troubleshooting

### Tiles not loading

1. Check Supabase bucket is public
2. Verify CSP headers include Supabase domain
3. Check browser console for CORS errors
4. Test direct tile URL in browser

### UV values incorrect

1. Verify lookup grid uploaded correctly
2. Check grid resolution matches code (0.25°)
3. Test known cities (Singapore should be ~11, London ~4)

### Upload fails

1. Check Supabase CLI is logged in: `supabase status`
2. Verify project linked: `supabase projects list`
3. Check storage quota in Supabase dashboard
4. Try manual upload of individual files

---

## 📞 Support

- **NASA Data Issues:** https://neo.gsfc.nasa.gov/about/
- **Supabase Support:** https://supabase.com/docs
- **GDAL Documentation:** https://gdal.org/

---

## ✅ Checklist

Before going live:

- [ ] Supabase bucket `uv-data` created and public
- [ ] Python script runs successfully
- [ ] All 12 months downloaded
- [ ] Tiles generated (check `output/tiles/uv/`)
- [ ] Lookup JSON created (~3MB)
- [ ] Data uploaded to Supabase
- [ ] Test tile URL returns 200 OK
- [ ] Test lookup JSON is accessible
- [ ] UV Visualiser HTML updated
- [ ] CSP headers updated
- [ ] Local testing complete
- [ ] Deployed to production
- [ ] Smoke test on live site

---

**Next:** Proceed to updating the UV Visualiser HTML to integrate the new data!
