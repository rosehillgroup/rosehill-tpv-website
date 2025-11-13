Development Plan: SVG Color Extraction & Blend Matching
Overview
Build a feature that takes an SVG file, extracts all colors used in it, finds optimal TPV blend recipes for each color, and displays the results with quality metrics.

Architecture Understanding
Existing System Components (Already Built)
The system already has most pieces you need:

Color Extraction: apps/web/src/lib/extraction/ - Extracts colors from images/PDFs
Blend Solver: apps/web/src/lib/colour/smartSolver.ts - Finds optimal recipes
API Endpoints:
/api/upload.ts - Handles file uploads
/api/palette.ts - Extracts color palette
/api/solve.ts - Generates blend recipes
UI Components: RecipesTable.tsx, PaletteTable.tsx - Display results
Good News: SVG files are already supported! (See apps/web/src/pages/api/upload.ts:57 and apps/web/src/lib/extraction/utils.ts:214)

Implementation Plan
Phase 1: Understanding the Current Flow
Study these files in order:

Start here: apps/web/src/lib/extraction/utils.ts

Line 214: See SVG is listed in imageFormats
Lines 73-98: Understand color deduplication logic
Lines 148-161: See how colors are sorted by importance
Color extraction: apps/web/src/lib/extraction/extractor.ts

Lines 118-146: See how raster images are processed
SVGs are treated as raster images (rendered to pixels, then analyzed)
Lines 156-167: Post-processing filters insignificant colors
API flow: apps/web/src/pages/api/upload.ts → palette.ts → solve.ts

Upload returns jobId
Palette extraction happens on first request (cached after)
Solve generates blend recipes for selected colors
Phase 2: SVG Color Extraction Deep Dive
Current Behavior (what already happens):

SVG File → Browser renders to canvas → Canvas pixels extracted → 
Color clustering (k-means) → Deduplicate similar colors → 
Filter by area % → Sort by importance → Return top 15 colors
Files involved:

apps/web/src/lib/extraction/raster.ts (you'll need to read this)

Contains RasterExtractor class
Uses k-means clustering to find dominant colors
Default: 15 iterations, 400px resample size
Filters colors <1% area coverage
apps/web/src/pages/api/palette.ts:66-80

Creates PaletteExtractor instance
Settings: maxColours: 15, minAreaPct: 0.5%
Caches results in Netlify Blobs storage
Data Structure (what you get back):

interface PaletteEntry {
  id: string;                    // "raster_abc123"
  rgb: { R, G, B };             // sRGB values 0-255
  lab: { L, a, b };             // Perceptual color space
  areaPct: number;              // Coverage % in image
  source: 'pdf' | 'raster';     // Always 'raster' for SVG
  metadata?: {
    pixels?: number;            // Pixel count
    percentage?: number;        // Same as areaPct
  };
}
Phase 3: Understanding the Blend Algorithm
How it works (already implemented in smartSolver.ts):

Initialization (SmartBlendSolver constructor):

const solver = new SmartBlendSolver(
  tpvColours,              // 21 TPV colors from JSON
  {
    maxComponents: 2,       // 1, 2, or 3 colors in blend
    stepPct: 0.04,         // Grid search precision (4%)
    minPct: 0.10,          // Min component weight (10%)
    mode: 'parts',         // 'parts' or 'percent'
    parts: {
      total: 12,           // Total parts to aim for
      minPer: 1            // Min parts per component
    }
  }
);
Solving (call solve() method):

const recipes = solver.solve(
  { L: 45.2, a: 38.1, b: -15.3 },  // Target color in Lab
  15                                // Number of candidates
);
What you get back:

interface SmartRecipe {
  components: BlendComponent[];     // [{ code: "RH01", weight: 0.67 }, ...]
  parts?: { [code: string]: number }; // { RH01: 2, RH02: 1 }
  total?: number;                   // 3 (sum of parts)
  rgb: { R, G, B };                // Resulting color
  lab: { L, a, b };                // Result in Lab space
  deltaE: number;                   // Quality metric (lower is better)
  note?: string;                    // Human explanation
}
Quality Metrics (ΔE2000):

< 1.0: Excellent (virtually identical)
1.0 - 2.0: Good (very close)
> 2.0: Fair (visible difference)
Key Algorithm Steps (you don't need to modify, just understand):

Phase 1: Single Component
├─ Compare target to all 21 TPV colors
└─ Return top 2 closest matches (ΔE ranking)

Phase 2: Two-Way Blends  
├─ Precompute all 210 possible 2-color combinations
├─ Grid search: Try ratios at 4% intervals (0%, 4%, 8%, ..., 96%, 100%)
├─ Apply penalties: Opposition, Sparsity, Anchor bonuses
├─ Find top 20 candidates
├─ Refine top 20 with finer 1% grid
└─ Return top 10

Phase 3: Three-Way Blends (if maxComponents = 3)
├─ Group 2-way results by hue sector (6 sectors)
├─ Pick diverse seeds (one from each sector)
├─ Try adding third color to each seed
├─ Hill-climbing: iteratively adjust ratios
└─ Return top 5
Files to read:

apps/web/src/lib/colour/smartSolver.ts:60-250 - Main solve logic
apps/web/src/lib/colour/penalties.ts - Penalty/bonus system
apps/web/src/lib/solver/search2.ts - Two-way search
apps/web/src/lib/solver/search3.ts - Three-way search
Phase 4: Building the End-to-End Flow
Option A: Use Existing UI (Easiest)

The existing app already handles SVGs! Just use it:

User uploads SVG via UploadForm.tsx
System extracts colors automatically
User selects target colors from PaletteTable.tsx
User clicks "Generate Recipes"
Results shown in RecipesTable.tsx
No code needed - it already works!

Option B: Build Standalone CLI/Script

If you want a command-line tool:

// File: scripts/svg-to-recipes.ts

import { readFileSync } from 'fs';
import { PaletteExtractor } from '../apps/web/src/lib/extraction/extractor';
import { SmartBlendSolver } from '../apps/web/src/lib/colour/smartSolver';
import tpvColours from '../apps/web/src/data/rosehill_tpv_21_colours.json';

async function processeSvg(svgPath: string) {
  // Step 1: Load SVG file
  const fileBuffer = readFileSync(svgPath);
  const arrayBuffer = fileBuffer.buffer.slice(
    fileBuffer.byteOffset,
    fileBuffer.byteOffset + fileBuffer.byteLength
  );
  
  console.log('📁 Loaded SVG:', svgPath);
  
  // Step 2: Extract colors
  const extractor = new PaletteExtractor({
    maxColours: 15,
    minAreaPct: 0.5,
    rasterOptions: {
      resampleSize: 400,
      iterations: 15
    }
  });
  
  const extraction = await extractor.extract(arrayBuffer, svgPath);
  console.log(`🎨 Extracted ${extraction.palette.length} colors in ${extraction.metadata.extractionTime}ms`);
  
  // Step 3: Initialize solver
  const solver = new SmartBlendSolver(tpvColours, {
    maxComponents: 2,      // Try 1 and 2 component blends
    stepPct: 0.04,
    minPct: 0.10,
    mode: 'parts',
    parts: {
      total: 12,
      minPer: 1
    },
    preferAnchor: true
  });
  
  // Step 4: Solve for each color
  console.log('\n🔬 Generating blend recipes...\n');
  
  for (const color of extraction.palette) {
    console.log(`\n━━━ Color: RGB(${color.rgb.R}, ${color.rgb.G}, ${color.rgb.B}) ━━━`);
    console.log(`Coverage: ${color.areaPct.toFixed(1)}%`);
    
    const recipes = solver.solve(color.lab, 5);  // Get top 5 recipes
    
    recipes.forEach((recipe, index) => {
      console.log(`\n  Recipe ${index + 1}: ΔE = ${recipe.deltaE.toFixed(2)}`);
      
      if (recipe.parts && recipe.total) {
        // Parts mode
        const partsStr = Object.entries(recipe.parts)
          .map(([code, parts]) => `${parts} parts ${code}`)
          .join(' + ');
        console.log(`    ${partsStr} (total: ${recipe.total})`);
      } else {
        // Percentage mode
        const percStr = recipe.components
          .map(c => `${(c.weight * 100).toFixed(1)}% ${c.code}`)
          .join(' + ');
        console.log(`    ${percStr}`);
      }
      
      const quality = recipe.deltaE < 1.0 ? 'Excellent' :
                      recipe.deltaE < 2.0 ? 'Good' : 'Fair';
      console.log(`    Quality: ${quality}`);
      console.log(`    Result: RGB(${recipe.rgb.R}, ${recipe.rgb.G}, ${recipe.rgb.B})`);
    });
  }
}

// Run it
processeSvg(process.argv[2]);
Usage:

npx tsx scripts/svg-to-recipes.ts path/to/logo.svg
Expected Output:

📁 Loaded SVG: logo.svg
🎨 Extracted 5 colors in 342ms

🔬 Generating blend recipes...

━━━ Color: RGB(237, 28, 36) ━━━
Coverage: 45.2%

  Recipe 1: ΔE = 0.68
    2 parts RH01 + 1 part RH05 (total: 3)
    Quality: Excellent
    Result: RGB(238, 29, 34)

  Recipe 2: ΔE = 1.24
    1 part RH01 (total: 1)
    Quality: Good
    Result: RGB(232, 30, 38)
...
Option C: Build Programmatic API Wrapper

If you want to integrate into another app:

// File: lib/svg-blend-matcher.ts

import { PaletteExtractor, ExtractionResult } from './extraction/extractor';
import { SmartBlendSolver, SmartRecipe } from './colour/smartSolver';
import tpvColours from '../data/rosehill_tpv_21_colours.json';

export interface BlendMatchResult {
  extractedColor: {
    rgb: { R: number; G: number; B: number };
    hex: string;
    areaPct: number;
  };
  recipes: SmartRecipe[];
}

export async function matchSvgColors(
  svgBuffer: ArrayBuffer,
  filename: string,
  options?: {
    maxColors?: number;
    recipesPerColor?: number;
    maxComponents?: 1 | 2 | 3;
  }
): Promise<BlendMatchResult[]> {
  
  // Extract colors
  const extractor = new PaletteExtractor({
    maxColours: options?.maxColors || 10,
    minAreaPct: 1.0
  });
  
  const extraction = await extractor.extract(svgBuffer, filename);
  
  // Initialize solver
  const solver = new SmartBlendSolver(tpvColours, {
    maxComponents: options?.maxComponents || 2,
    stepPct: 0.04,
    minPct: 0.10,
    mode: 'parts',
    parts: { total: 12, minPer: 1 }
  });
  
  // Solve for each color
  const results: BlendMatchResult[] = [];
  
  for (const color of extraction.palette) {
    const recipes = solver.solve(
      color.lab,
      options?.recipesPerColor || 3
    );
    
    results.push({
      extractedColor: {
        rgb: color.rgb,
        hex: rgbToHex(color.rgb),
        areaPct: color.areaPct
      },
      recipes
    });
  }
  
  return results;
}

function rgbToHex(rgb: { R: number; G: number; B: number }): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(rgb.R)}${toHex(rgb.G)}${toHex(rgb.B)}`;
}
Usage:

import { matchSvgColors } from './lib/svg-blend-matcher';

const svgFile = await fetch('/logo.svg').then(r => r.arrayBuffer());

const results = await matchSvgColors(svgFile, 'logo.svg', {
  maxColors: 5,
  recipesPerColor: 3,
  maxComponents: 2
});

results.forEach(result => {
  console.log(`Color: ${result.extractedColor.hex} (${result.extractedColor.areaPct.toFixed(1)}%)`);
  
  result.recipes.forEach((recipe, i) => {
    console.log(`  Recipe ${i + 1}: ΔE ${recipe.deltaE.toFixed(2)}`);
    console.log(`    ${formatRecipe(recipe)}`);
  });
});
Phase 5: Displaying Results
UI Component (if building web interface):

Use the existing RecipesTable.tsx component - it's already built!

Key features it provides:

Color swatches (target vs result)
Quality badges (Excellent/Good/Fair)
Parts or percentage display
Pin functionality
Mobile responsive
Export to CSV/PDF
Integration:

import RecipesTable from './components/RecipesTable';

<RecipesTable
  recipes={recipes}          // Your SmartRecipe[] array
  targetColors={extractedColors}
  onPinToggle={(id) => {...}}
/>
Or build custom output:

function formatRecipeForDisplay(recipe: SmartRecipe): string {
  const components = recipe.components.map(c => {
    if (recipe.parts && recipe.parts[c.code]) {
      return `${recipe.parts[c.code]} parts ${c.code}`;
    } else {
      return `${(c.weight * 100).toFixed(1)}% ${c.code}`;
    }
  }).join(' + ');
  
  const quality = recipe.deltaE < 1.0 ? '⭐ Excellent' :
                  recipe.deltaE < 2.0 ? '✓ Good' : '○ Fair';
  
  return `${components} | ${quality} | ΔE: ${recipe.deltaE.toFixed(2)}`;
}
Testing Plan
Test 1: Simple SVG
Create test-simple.svg:

<svg width="100" height="100">
  <rect width="100" height="100" fill="#ED1C24"/>
</svg>
Expected: Should extract pure red, find RH01 as perfect match (ΔE < 1.0)

Test 2: Multi-Color SVG
Create test-multi.svg:

<svg width="200" height="100">
  <rect x="0" width="100" height="100" fill="#ED1C24"/>
  <rect x="100" width="100" height="100" fill="#2E3192"/>
</svg>
Expected: Should extract 2 colors (red ~50%, blue ~50%)

Test 3: Gradient SVG
<svg width="200" height="100">
  <defs>
    <linearGradient id="grad">
      <stop offset="0%" stop-color="#ED1C24"/>
      <stop offset="100%" stop-color="#FFF200"/>
    </linearGradient>
  </defs>
  <rect width="200" height="100" fill="url(#grad)"/>
</svg>
Expected: Should extract 5-10 colors along gradient spectrum

Troubleshooting Guide
Issue: No colors extracted from SVG
Diagnosis:

const extraction = await extractor.extract(buffer, 'file.svg');
console.log('Extraction result:', {
  colorsFound: extraction.palette.length,
  warnings: extraction.warnings,
  metadata: extraction.metadata
});
Fixes:

Lower minAreaPct to 0.1% (from 0.5%)
Increase maxColours to 20 (from 15)
Check SVG has visible colors (not all white/black)
Issue: Poor blend matches (high ΔE)
Diagnosis:

const recipes = solver.solve(targetLab, 20); // Get more candidates
console.log('Best ΔE:', recipes[0].deltaE);
console.log('Worst ΔE:', recipes[recipes.length - 1].deltaE);
Fixes:

Increase maxComponents to 3 (allows more complex blends)
Decrease stepPct to 0.02 (finer search, slower)
Check if target color is outside TPV gamut (some colors impossible to match)
Issue: Weird parts ratios (like 47 parts total)
Diagnosis:

const recipes = solver.solve(targetLab, 5);
recipes.forEach(r => {
  console.log('Parts:', r.parts, 'Total:', r.total);
  console.log('Weights:', r.components.map(c => c.weight));
});
Fixes:

Set parts.total to desired value (9, 12, 15 are good)
Check smartParts.ts:findOptimalParts() is being called
Verify parts conversion doesn't add too much ΔE penalty
Performance Optimization
For many colors (>10)
Run solves in parallel:

const results = await Promise.all(
  colors.map(color => solver.solve(color.lab, 5))
);
Cache results
const cacheKey = `${color.rgb.R}_${color.rgb.G}_${color.rgb.B}`;
if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}
const recipes = solver.solve(color.lab, 5);
cache.set(cacheKey, recipes);
Profile slow operations
console.time('Extraction');
const extraction = await extractor.extract(buffer, filename);
console.timeEnd('Extraction');  // Usually 200-500ms

console.time('Solving');
const recipes = solver.solve(targetLab, 5);
console.timeEnd('Solving');  // Usually 100-300ms for 2-way, 500-1000ms for 3-way
Key Files Reference
Must Read:

apps/web/src/lib/extraction/extractor.ts - Color extraction orchestrator
apps/web/src/lib/colour/smartSolver.ts:60-250 - Main solver logic
apps/web/src/pages/api/solve.ts - API endpoint example
apps/web/src/lib/colour/blend.ts - Color blending math
Nice to Read:

apps/web/src/lib/colour/penalties.ts - Understanding recipe scoring
apps/web/src/lib/colour/deltaE.ts - Color difference metrics
apps/web/src/lib/colour/convert.ts - Color space conversions
UI Reference:

apps/web/src/components/RecipesTable.tsx - Display recipes
apps/web/src/components/PaletteTable.tsx - Display extracted colors
Summary: Quickstart Steps
Read these 3 files first:

apps/web/src/lib/extraction/extractor.ts
apps/web/src/lib/colour/smartSolver.ts
apps/web/src/pages/api/solve.ts
Try the existing app (it already works with SVG!)

Upload an SVG
See extracted colors
Generate recipes
Build your feature using one of the 3 options above

Test with simple SVGs before complex ones

Reference the API when stuck:

// Extract
const extraction = await extractor.extract(buffer, filename);

// Solve
const solver = new SmartBlendSolver(tpvColours, constraints);
const recipes = solver.solve(color.lab, 5);

// Display
<RecipesTable recipes={recipes} targetColors={colors} />
That's it! The system is already 95% built - you just need to wire it together for your use case.