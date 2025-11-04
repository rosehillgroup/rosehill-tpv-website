# Rosehill TPV Website

Official website for Rosehill TPV - Sports & Recreation Surfaces.

## Overview
This website showcases Rosehill TPV® coloured rubber granules and Flexilon® polyurethane binders for sports and playground surfaces.

## Features
- Product information and technical specifications
- Colour selector with 21 standard colours and custom blends
- Installation gallery with 60+ projects
- Binder selection tool
- Contact forms for technical support

## Technologies
- HTML5
- CSS3 (inline styles)
- Vanilla JavaScript
- Netlify hosting

## Structure
- `index.html` - Homepage
- `products.html` - Product information
- `applications.html` - Use cases and applications
- `colour.html` - Colour selector
- `installations.html` - Project gallery
- `about.html` - Company information
- `contact.html` - Contact forms
- `/installations/` - Individual project pages
- `/performance/uv-stability.html` - UV Fade Visualiser tool

## UV Fade Visualiser

Interactive tool comparing color stability of EPDM vs Rosehill TPV® under UV exposure using NASA satellite data.

### Data Processing Pipeline

The UV data is processed from NASA Earth Observations and served as map tiles. To regenerate the data:

#### Prerequisites
```bash
# Install Python dependencies
pip install requests numpy rasterio rio-cogeo

# Install GDAL tools
brew install gdal

# Install Supabase CLI (for uploading)
npm install -g supabase
```

#### Step 1: Generate Tiles
```bash
cd /Volumes/Marketing_SSD/Websites\ 2025/TPV_2025_Deploy

# Run the data processing pipeline
python3 scripts/process-uv-data.py --year 2024 --output-dir output

# This will:
# 1. Download 12 monthly UV Index GeoTIFFs from NASA
# 2. Calculate annual mean UV Index
# 3. Create Cloud Optimized GeoTIFF (COG)
# 4. Apply UV color ramp (Low/Moderate/High/Very High/Extreme)
# 5. Generate colored XYZ tiles (zoom levels 0-6)
# 6. Create lookup grid for client-side queries
# 7. Generate upload script for Supabase
```

**Key Change (Nov 2025):** The pipeline now applies the UV color ramp **before** tile generation to ensure consistent colors across all zoom levels. Previously, tiles were generated from grayscale data, causing color inconsistencies.

#### Step 2: Upload to Supabase
```bash
cd output

# Login to Supabase (first time only)
supabase login

# Run the generated upload script
./upload-to-supabase.sh
```

This uploads:
- **Tiles**: 5,461 PNG tiles (zoom 0-6) → `uv-data/tiles/uv/{z}/{x}/{y}.png`
- **Lookup Grid**: JSON file for point queries → `uv-data/data/uv_lookup_full.json`
- **Colored GeoTIFF**: Source colored image → `uv-data/data/uv_mean_colour.tif`

#### Step 3: Verify
Open `/performance/uv-stability.html` and:
1. Click different locations at various zoom levels
2. Verify UV colors remain consistent when zooming in/out
3. Check that UV Index values match the visual color coding

### Color Ramp Reference
- **Low** (0-2 UVI): Green `#C5E1A5`
- **Moderate** (3-5 UVI): Yellow `#FFF59D`
- **High** (6-7 UVI): Orange `#FFB74D`
- **Very High** (8-10 UVI): Red `#EF5350`
- **Extreme** (11-16 UVI): Purple `#AB47BC`

### Data Sources
- NASA Earth Observations: AURA UV Index Climatology
- Tile storage: Supabase Storage (https://okakomwfikxmwllvliva.supabase.co)
- Map rendering: MapLibre GL JS with Carto Dark basemap

## Deployment
Hosted on Netlify with automatic deployments from GitHub.

---

© 2025 Rosehill Sports & Play. All rights reserved.