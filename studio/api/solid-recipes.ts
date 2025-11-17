import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRequire } from 'module';
import { PaletteExtractor } from './_utils/extraction/extractor.js';
import { SmartBlendSolver } from './_utils/colour/smartSolver.js';
import { calculateBlendColor, type BlendComponent, type TPVColor } from './_utils/colour/blendColor.js';

const require = createRequire(import.meta.url);
const tpvColours = require('./_utils/data/rosehill_tpv_21_colours.json');

// Build version for cache busting
const BUILD_VERSION = 'v3.9.0-solid-colors-20251117-1615';

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

      // Calculate the blend color (will be 100% of single TPV color)
      const blendComponents: BlendComponent[] = bestRecipe.components.map(c => ({
        code: c.code,
        pct: c.pct
      }));

      const blendColor = calculateBlendColor(blendComponents, tpvColours as TPVColor[]);

      // Format recipe (should have exactly 1 component at 100%)
      const chosenRecipe = {
        id: `solid_${i + 1}`,
        parts: bestRecipe.parts || {},
        total: bestRecipe.total || 12,
        deltaE: bestRecipe.deltaE,
        quality: bestRecipe.deltaE < 1.0 ? 'Excellent' : bestRecipe.deltaE < 3.0 ? 'Good' : 'Fair',
        resultRgb: bestRecipe.rgb,
        components: bestRecipe.components.map(c => ({
          code: c.code,
          name: tpvColours.find(col => col.code === c.code)?.name || c.code,
          weight: c.pct,
          parts: bestRecipe.parts ? bestRecipe.parts[c.code] : 12
        }))
      };

      console.log(`[SOLID-RECIPES]     Matched to: ${chosenRecipe.components[0].code} (${chosenRecipe.components[0].name}), ΔE ${bestRecipe.deltaE.toFixed(2)}`);

      // Pre-normalize: Use blendColor as targetColor
      recipes.push({
        originalColor: {
          hex: rgbToHex(color.rgb),
          rgb: color.rgb,
          lab: color.lab,
          areaPct: color.areaPct
        },
        targetColor: {
          hex: blendColor.hex,
          rgb: blendColor.rgb,
          lab: blendColor.lab,
          areaPct: color.areaPct
        },
        chosenRecipe,
        blendColor: {
          hex: blendColor.hex,
          rgb: blendColor.rgb,
          lab: blendColor.lab
        },
        alternativeRecipes: [] // No alternatives for solid colors
      });
    }

    const solveTime = Date.now() - solveStartTime;
    const totalTime = Date.now() - startTime;

    console.log(`[SOLID-RECIPES] Matched ${recipes.length} colors to solid TPV in ${solveTime}ms (total: ${totalTime}ms)`);

    // Format colors for response
    const colors = recipes.map(recipe => ({
      hex: recipe.targetColor.hex,
      rgb: recipe.targetColor.rgb,
      lab: recipe.targetColor.lab,
      areaPct: recipe.targetColor.areaPct
    }));

    return res.status(200).json({
      success: true,
      colors,
      recipes,
      metadata: {
        colorsExtracted: extraction.palette.length,
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
