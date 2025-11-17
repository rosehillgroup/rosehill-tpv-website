import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRequire } from 'module';
import { PaletteExtractor } from './_utils/extraction/extractor.js';
import { SmartBlendSolver } from './_utils/colour/smartSolver.js';
import { calculateBlendColor, type BlendComponent, type TPVColor } from './_utils/colour/blendColor.js';

const require = createRequire(import.meta.url);
const tpvColours = require('./_utils/data/rosehill_tpv_21_colours.json');

// Build version for cache busting
const BUILD_VERSION = 'v3.0.0-tpv-normalization-20251117-1230';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[BLEND-RECIPES-V3] API Handler invoked - TPV color normalization enabled');
  console.log(`[BLEND-RECIPES-V3] Build version: ${BUILD_VERSION}`);

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { svg_url, job_id, max_colors = 15, max_components = 2 } = req.body;

    if (!svg_url) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: svg_url'
      });
    }

    console.log('[BLEND-RECIPES] Starting color extraction for job:', job_id);
    console.log('[BLEND-RECIPES] SVG URL:', svg_url);
    console.log('[BLEND-RECIPES] Max colors:', max_colors, 'Max components:', max_components);

    const startTime = Date.now();

    // Fetch SVG from URL
    console.log('[BLEND-RECIPES] Fetching SVG from URL...');
    const svgResponse = await fetch(svg_url);
    if (!svgResponse.ok) {
      throw new Error(`Failed to fetch SVG: ${svgResponse.status} ${svgResponse.statusText}`);
    }

    const svgBuffer = await svgResponse.arrayBuffer();
    console.log(`[BLEND-RECIPES] SVG fetched (${svgBuffer.byteLength} bytes)`);

    // Extract colors using PaletteExtractor (will use SVG parser for .svg files)
    console.log('[BLEND-RECIPES] Extracting colors...');
    const extractor = new PaletteExtractor({
      maxColours: max_colors,
      minAreaPct: 0, // Include all colors, even small design elements
      tpvPalette: tpvColours, // Pass TPV palette to avoid nested JSON imports
      rasterOptions: {
        resampleSize: 400,
        iterations: 15
      }
    });

    const extraction = await extractor.extract(svgBuffer, 'design.svg');
    const extractionTime = Date.now() - startTime;

    console.log(`[BLEND-RECIPES] Extracted ${extraction.palette.length} colors in ${extractionTime}ms`);

    if (extraction.palette.length === 0) {
      return res.status(200).json({
        success: true,
        colors: [],
        recipes: [],
        message: 'No significant colors found in SVG (all colors below 1% coverage)'
      });
    }

    // Initialize blend solver
    console.log('[BLEND-RECIPES] Initializing blend solver...');
    const solver = new SmartBlendSolver(tpvColours, {
      maxComponents: max_components,
      stepPct: 0.04,
      minPct: 0.10,
      mode: 'parts',
      parts: {
        enabled: true,
        total: 12,
        minPer: 1
      },
      preferAnchor: true
    });

    // Generate blend recipes for each color
    console.log('[BLEND-RECIPES] Generating blend recipes...');
    const recipes = [];
    const solveStartTime = Date.now();

    for (let i = 0; i < extraction.palette.length; i++) {
      const color = extraction.palette[i];
      console.log(`[BLEND-RECIPES]   Color ${i + 1}/${extraction.palette.length}: RGB(${color.rgb.R}, ${color.rgb.G}, ${color.rgb.B}) - ${color.areaPct.toFixed(1)}%`);

      // Solve for top 3 blend recipes
      const colorRecipes = solver.solve(color.lab, 3);

      // Select the best recipe (lowest ΔE)
      const bestRecipe = colorRecipes[0];

      // Calculate the visual blend color for the chosen recipe
      const blendComponents: BlendComponent[] = bestRecipe.components.map(c => ({
        code: c.code,
        pct: c.pct
      }));

      const blendColor = calculateBlendColor(blendComponents, tpvColours as TPVColor[]);

      // Format chosen recipe
      const chosenRecipe = {
        id: `recipe_${i + 1}_1`, // Recipe ID format: color_recipeIndex
        parts: bestRecipe.parts || {},
        total: bestRecipe.total || 0,
        deltaE: bestRecipe.deltaE,
        quality: bestRecipe.deltaE < 1.0 ? 'Excellent' : bestRecipe.deltaE < 2.0 ? 'Good' : 'Fair',
        resultRgb: bestRecipe.rgb,
        components: bestRecipe.components.map(c => ({
          code: c.code,
          name: tpvColours.find(col => col.code === c.code)?.name || c.code,
          weight: c.pct,
          parts: bestRecipe.parts ? bestRecipe.parts[c.code] : null
        }))
      };

      // Format alternative recipes (2nd and 3rd best)
      const alternativeRecipes = colorRecipes.slice(1).map((recipe, idx) => ({
        id: `recipe_${i + 1}_${idx + 2}`,
        parts: recipe.parts || {},
        total: recipe.total || 0,
        deltaE: recipe.deltaE,
        quality: recipe.deltaE < 1.0 ? 'Excellent' : recipe.deltaE < 2.0 ? 'Good' : 'Fair',
        resultRgb: recipe.rgb,
        components: recipe.components.map(c => ({
          code: c.code,
          name: tpvColours.find(col => col.code === c.code)?.name || c.code,
          weight: c.pct,
          parts: recipe.parts ? recipe.parts[c.code] : null
        }))
      }));

      console.log(`[BLEND-RECIPES]     Chosen: ΔE ${bestRecipe.deltaE.toFixed(2)} (${chosenRecipe.quality}), Blend: ${blendColor.hex}`);

      recipes.push({
        targetColor: {
          hex: rgbToHex(color.rgb),
          rgb: color.rgb,
          lab: color.lab,
          areaPct: color.areaPct
        },
        chosenRecipe,
        blendColor: {
          hex: blendColor.hex,
          rgb: blendColor.rgb,
          lab: blendColor.lab
        },
        alternativeRecipes
      });
    }

    const solveTime = Date.now() - solveStartTime;
    const totalTime = Date.now() - startTime;

    console.log(`[BLEND-RECIPES] Generated ${recipes.length} recipe sets in ${solveTime}ms (total: ${totalTime}ms)`);

    // Format colors for response
    const colors = extraction.palette.map(color => ({
      hex: rgbToHex(color.rgb),
      rgb: color.rgb,
      lab: color.lab,
      areaPct: color.areaPct
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
        maxComponents: max_components,
        warnings: extraction.warnings // Include extraction warnings for debugging
      }
    });

  } catch (error: any) {
    console.error('[BLEND-RECIPES] Error:', error);
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
