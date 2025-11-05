# TPV Studio - Week 1 MVP Complete

AI-powered playground surface design tool with generative grammars, constraint checking, and multi-format exports.

## What's Been Built

### ✅ Frontend (React 18 + Vite)
- **PromptPanel** - Design brief form with prompt, dimensions, colors (21 TPV colors), complexity
- **VariantGallery** - Grid view of 3 variants with installer scores, violations, BoM preview
- **ExportPanel** - Download buttons for SVG, DXF, PDF, PNG + detailed BoM table
- **Supabase Auth** - Restricted to `@rosehill.group` email domain
- **Professional Styling** - Rosehill brand colors, responsive design

### ✅ Backend (Netlify Functions)
- **design-plan.js** - LLM planner using Llama 3.1 70B Instruct with few-shot prompts
- **design-generate.js** - Generates 3 variants with different seeds

### ✅ Geometry Engine
- **Perlin Noise** - Smooth flow fields for organic patterns
- **Seeded Random** - Reproducible designs with Poisson disc sampling
- **Grammars**:
  - **Bands** - Flowing horizontal/vertical bands using Perlin noise
  - **Clusters** - Voronoi-like island regions
  - **Islands** - Scattered organic shapes

### ✅ Constraint System
- **Rules** (from RULES.md):
  - Min width: 120mm
  - Min radius: 600mm
  - Min gap: 80mm
  - Min area: 0.3m²
  - Max 3 colors (4 if requested)
- **Installer Score** - 0-100 scoring with deductions for violations
- **Bill of Materials** - Color areas and percentages

### ✅ Export Pipeline
- **SVG** - Layered vector graphics with metadata
- **PNG** - Rasterized with sharp (1200px width)
- **DXF** - Stub for R2013 format (mm units)
- **PDF** - Stub with BoM (full implementation in Week 2)
- **Supabase Storage** - All exports uploaded to `tpv-studio` bucket

## Access URLs

Once deployed:
- **Studio App**: `https://tpv.rosehill.group/studio`
- **Design Plan API**: `POST /api/studio/design/plan`
- **Design Generate API**: `POST /api/studio/design/generate`

## Workflow

1. User enters design brief (e.g., "Ocean energy with fish")
2. LLM generates LayoutSpec JSON (Llama 3.1 70B)
3. Generate 3 variants:
   - Apply grammars (Bands/Clusters) to create geometric regions
   - Assign colors from palette
   - Check constraints and calculate score
   - Generate SVG → PNG, DXF, PDF
   - Upload to Supabase storage
4. Display variants with scores, violations, BoM
5. User selects variant and downloads files

## Development

### Local Testing
```bash
# Install dependencies
cd studio
npm install

# Run dev server (with Netlify Functions proxy)
npm run dev

# Visit http://localhost:3000
```

### Build for Production
```bash
cd studio
npm run build
# Outputs to studio/dist/
```

## Environment Variables

Required in Netlify:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE` - Service role key (for storage uploads)
- `REPLICATE_API_TOKEN` - Replicate API key (for Llama 3.1)

## File Structure

```
studio/
├── src/
│   ├── components/
│   │   ├── PromptPanel.jsx      # Design brief form
│   │   ├── VariantGallery.jsx   # 3 variant grid
│   │   └── ExportPanel.jsx      # Downloads + BoM
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.js        # API client
│   │   │   └── auth.js          # Supabase auth
│   │   └── constants.js         # Config
│   ├── styles/
│   │   └── studio.css           # Rosehill branding
│   ├── App.jsx                  # Main app
│   └── main.jsx                 # Entry point
├── assets/
│   ├── tpv-palette.json         # 21 TPV colors
│   └── motifs-manifest.json     # 20 motif SVGs (Week 2)
├── dist/                        # Build output
├── package.json
├── vite.config.js
└── index.html

netlify/functions/studio/
├── design-plan.js               # LLM planner endpoint
├── design-generate.js           # Design generation endpoint
└── _utils/
    ├── perlin.js                # Perlin noise
    ├── random.js                # Seeded RNG, Poisson disc
    ├── grammars.js              # Bands, Clusters, Islands
    ├── constraints.js           # Checker, scoring, BoM
    └── exports.js               # SVG, PNG, DXF, PDF
```

## Configuration

### netlify.toml Updates
- Added `/api/studio/*` → `/.netlify/functions/studio/:splat` redirect
- Added `/studio/*` → `/studio/dist/index.html` SPA redirect
- Updated CSP to include `https://api.replicate.com`

### Supabase Storage
- Bucket: `tpv-studio` (public read access)
- Path structure: `designs/YYYYMMDD/{variantId}.{ext}`
- Files auto-expire after 24 hours (Week 2: add Edge Function cleanup)

## Week 2 Priorities

1. **Full DXF Export** - Proper R2013 format with polylines/arcs
2. **Full PDF Export** - Installation plan + BoM using pdfkit
3. **20 Motif SVGs** - Organized in 5 categories (marine, shapes, play, nature, geo)
4. **Motif Placement** - Constrained positioning with Poisson disc
5. **Auto-Repair** - Thicken, round, merge violations
6. **More Grammars** - Symmetry, Rays, Mosaic, Network
7. **Photo Visualisation** - Optional FLUX Fill Pro integration

## Notes

- Week 1 MVP focuses on **core workflow**: prompt → plan → generate → export
- LLM planner has fallback to simple Bands-only design if Llama 3.1 fails
- Constraint checking is simplified (perimeter-based width estimation)
- Auth is set up but login UI is minimal (shows message for non-@rosehill.group users)
- All code is seeded for reproducibility

## Testing

1. Deploy to Netlify
2. Visit `/studio`
3. Sign in with `@rosehill.group` email
4. Enter design brief: "Ocean energy with fish, calm and flowing"
5. Set dimensions: 5m x 5m
6. Select 2-3 TPV colors (optional)
7. Click "Generate 3 Variants"
8. View variants with scores
9. Select variant and download SVG/PNG/DXF/PDF

Expected: 3 variants generated in ~10-15 seconds with flowing bands pattern, scores 70-100, downloads work.
