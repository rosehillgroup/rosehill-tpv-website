import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRequire } from 'module';
import { PaletteExtractor } from './_utils/extraction/extractor.js';
import { SmartBlendSolver } from './_utils/colour/smartSolver.js';
import { calculateBlendColor, type BlendComponent, type TPVColor } from './_utils/colour/blendColor.js';

const require = createRequire(import.meta.url);
const tpvColours = require('./_utils/data/rosehill_tpv_21_colours.json');

// Build version for cache busting
const BUILD_VERSION = 'v3.10.0-exact-tpv-hex-dedup-20251117-1700';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[SOLID-RECIPES] API Handler invoked - Solid TPV colors only');
  console.log(`[SOLID-RECIPES] Build version: ${BUILD_VERSION}`);

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { svg_url, job_id, max_colors = 15 } = req.body;

    if (!svg_url) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: svg_url'
      });
    }

    console.log('[SOLID-RECIPES] Starting color extraction for job:', job_id);
    console.log('[SOLID-RECIPES] SVG URL:', svg_url);
    console.log('[SOLID-RECIPES] Max colors:', max_colors, 'Mode: SOLID (100% single TPV colors)');

    const startTime = Date.now();

    // Fetch SVG from URL
    console.log('[SOLID-RECIPES] Fetching SVG from URL...');
    const svgResponse = await fetch(svg_url);
    if (!svgResponse.ok) {
      throw new Error(`Failed to fetch SVG: ${svgResponse.status} ${svgResponse.statusText}`);
    }

    const svgBuffer = await svgResponse.arrayBuffer();
    console.log(`[SOLID-RECIPES] SVG fetched (${svgBuffer.byteLength} bytes)`);

    // Extract colors using PaletteExtractor
    console.log('[SOLID-RECIPES] Extracting colors...');
    const extractor = new PaletteExtractor({
      maxColours: max_colors,
      minAreaPct: 0,
      tpvPalette: tpvColours,
      rasterOptions: {
        resampleSize: 400,
        iterations: 15
      }
    });

    const extraction = await extractor.extract(svgBuffer, 'design.svg');
    const extractionTime = Date.now() - startTime;

    console.log(`[SOLID-RECIPES] Extracted ${extraction.palette.length} colors in ${extractionTime}ms`);

    if (extraction.palette.length === 0) {
      return res.status(200).json({
        success: true,
        colors: [],
        recipes: [],
        message: 'No significant colors found in SVG'
      });
    }

    // Initialize solver for SOLID colors only (maxComponents: 1)
    console.log('[SOLID-RECIPES] Initializing solid color solver (100% single TPV colors)...');
    const solver = new SmartBlendSolver(tpvColours, {
      maxComponents: 1,      // SOLID ONLY: Single component recipes
      stepPct: 0.04,
      minPct: 1.0,           // 100% of one color
      mode: 'parts',
      parts: {
        enabled: true,
        total: 12,
        minPer: 12           // All 12 parts = 100%
      },
      preferAnchor: true
    });

    // Generate solid color recipes for each extracted color
    console.log('[SOLID-RECIPES] Finding nearest solid TPV colors...');
    const recipes = [];
    const solveStartTime = Date.now();

    for (let i = 0; i < extraction.palette.length; i++) {
      const color = extraction.palette[i];
      console.log(`[SOLID-RECIPES]   Color ${i + 1}/${extraction.palette.length}: RGB(${color.rgb.R}, ${color.rgb.G}, ${color.rgb.B}) - ${color.areaPct.toFixed(1)}%`);

      // Solve for single best solid color (no alternatives needed)
      const colorRecipes = solver.solve(color.lab, 1);
      const bestRecipe = colorRecipes[0];

      // Get the exact TPV color from palette (100% pure color)
      const tpvColorCode = bestRecipe.components[0].code;
      const exactTpvColor = tpvColours.find(col => col.code === tpvColorCode);

      if (!exactTpvColor) {
        console.error(`[SOLID-RECIPES] TPV color not found: ${tpvColorCode}`);
        continue;
      }

      // Use exact TPV hex from palette (not calculated)
      const tpvHex = exactTpvColor.hex;
      const tpvRgb = exactTpvColor.rgb;
      const tpvLab = exactTpvColor.lab;

      // Format recipe (should have exactly 1 component at 100%)
      const chosenRecipe = {
        id: `solid_${i + 1}`,
        parts: bestRecipe.parts || {},
        total: bestRecipe.total || 12,
        deltaE: bestRecipe.deltaE,
        quality: bestRecipe.deltaE < 1.0 ? 'Excellent' : bestRecipe.deltaE < 3.0 ? 'Good' : 'Fair',
        resultRgb: bestRecipe.rgb,
        components: [{
          code: tpvColorCode,
          name: exactTpvColor.name,
          weight: 1.0,
          parts: 12
        }]
      };

      console.log(`[SOLID-RECIPES]     Matched to: ${tpvColorCode} (${exactTpvColor.name}), ΔE ${bestRecipe.deltaE.toFixed(2)}`);

      // Pre-normalize: Use exact TPV color as targetColor
      recipes.push({
        originalColor: {
          hex: rgbToHex(color.rgb),
          rgb: color.rgb,
          lab: color.lab,
          areaPct: color.areaPct
        },
        targetColor: {
          hex: tpvHex,
          rgb: tpvRgb,
          lab: tpvLab,
          areaPct: color.areaPct
        },
        chosenRecipe,
        blendColor: {
          hex: tpvHex,
          rgb: tpvRgb,
          lab: tpvLab
        },
        alternativeRecipes: [] // No alternatives for solid colors
      });
    }

    const solveTime = Date.now() - solveStartTime;

    // Build complete color mapping BEFORE deduplication (preserves all original colors)
    const colorMapping: Record<string, any> = {};
    recipes.forEach(recipe => {
      const originalHex = recipe.originalColor.hex.toLowerCase();
      const targetHex = recipe.targetColor.hex.toLowerCase();
      colorMapping[originalHex] = {
        blendHex: targetHex,
        recipeId: recipe.chosenRecipe.id,
        deltaE: recipe.chosenRecipe.deltaE,
        coverage: recipe.targetColor.areaPct,
        quality: recipe.chosenRecipe.quality,
        components: recipe.chosenRecipe.components
      };
    });

    console.log(`[SOLID-RECIPES] Built complete colorMapping with ${Object.keys(colorMapping).length} entries`);

    // Deduplicate recipes for display (merge colors that map to the same TPV color)
    const tpvColorMap = new Map();
    recipes.forEach(recipe => {
      const tpvHex = recipe.targetColor.hex.toLowerCase();
      if (tpvColorMap.has(tpvHex)) {
        // Merge coverage percentages
        const existing = tpvColorMap.get(tpvHex);
        existing.targetColor.areaPct += recipe.targetColor.areaPct;
        existing.blendColor.areaPct = existing.targetColor.areaPct;

        // Track all merged original colors for editing
        if (!existing.mergedOriginalColors) {
          existing.mergedOriginalColors = [existing.originalColor.hex.toLowerCase()];
        }
        existing.mergedOriginalColors.push(recipe.originalColor.hex.toLowerCase());

        console.log(`[SOLID-RECIPES] Merged duplicate ${tpvHex}, new coverage: ${existing.targetColor.areaPct.toFixed(1)}%`);
      } else {
        // Initialize with first color
        recipe.mergedOriginalColors = [recipe.originalColor.hex.toLowerCase()];
        tpvColorMap.set(tpvHex, recipe);
      }
    });

    const deduplicatedRecipes = Array.from(tpvColorMap.values());
    const totalTime = Date.now() - startTime;

    console.log(`[SOLID-RECIPES] Matched ${recipes.length} colors to ${deduplicatedRecipes.length} unique TPV colors in ${solveTime}ms (total: ${totalTime}ms)`);

    // Format colors for response
    const colors = deduplicatedRecipes.map(recipe => ({
      hex: recipe.targetColor.hex,
      rgb: recipe.targetColor.rgb,
      lab: recipe.targetColor.lab,
      areaPct: recipe.targetColor.areaPct
    }));

    return res.status(200).json({
      success: true,
      colors,
      recipes: deduplicatedRecipes,
      colorMapping, // Include complete mapping for SVG recoloring
      metadata: {
        colorsExtracted: extraction.palette.length,
        uniqueTPVColors: deduplicatedRecipes.length,
        extractionTime,
        solveTime,
        totalTime,
        maxComponents: 1,
        mode: 'solid',
        warnings: extraction.warnings
      }
    });

  } catch (error: any) {
    console.error('[SOLID-RECIPES] Error:', error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

function rgbToHex(rgb: { R: number; G: number; B: number }): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(rgb.R)}${toHex(rgb.G)}${toHex(rgb.B)}`;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb'
    },
    responseLimit: '4mb',
    externalResolver: false
  },
  maxDuration: 60 // 60 seconds for color extraction
};
