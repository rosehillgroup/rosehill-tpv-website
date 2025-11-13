// Vercel Serverless Function: Generate TPV Blend Recipes from SVG Colors
// POST /api/blend-recipes
// Extracts colors from Recraft SVG and generates blend recipes

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PaletteExtractor } from './_utils/extraction/extractor';
import { SmartBlendSolver } from './_utils/colour/smartSolver';
import tpvColours from './_utils/data/rosehill_tpv_21_colours.json';

/**
 * Generate TPV blend recipes from SVG colors
 *
 * Request body:
 * {
 *   svg_url: string,              // Supabase storage URL of SVG
 *   job_id: string,               // Job ID for tracking
 *   max_colors?: number,          // Maximum colors to extract (default: 8)
 *   max_components?: 1 | 2 | 3    // Max components in blend (default: 2)
 * }
 *
 * Response:
 * {
 *   success: true,
 *   colors: Array<{
 *     hex: string,
 *     rgb: { R, G, B },
 *     lab: { L, a, b },
 *     areaPct: number
 *   }>,
 *   recipes: Array<{
 *     targetColor: { hex, areaPct },
 *     blends: Array<{
 *       parts: { RH01: 2, RH05: 1 },
 *       total: 3,
 *       deltaE: 0.68,
 *       quality: 'Excellent',
 *       resultRgb: { R, G, B }
 *     }>
 *   }>
 * }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const {
      svg_url,
      job_id,
      max_colors = 8,
      max_components = 2
    } = req.body;

    // Validate required fields
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

    // Step 1: Fetch SVG from URL
    console.log('[BLEND-RECIPES] Fetching SVG from URL...');
    const svgResponse = await fetch(svg_url);

    if (!svgResponse.ok) {
      throw new Error(`Failed to fetch SVG: ${svgResponse.status} ${svgResponse.statusText}`);
    }

    const svgBuffer = await svgResponse.arrayBuffer();
    console.log(`[BLEND-RECIPES] SVG fetched (${svgBuffer.byteLength} bytes)`);

    // Step 2: Extract colors from SVG
    console.log('[BLEND-RECIPES] Extracting colors...');
    const extractor = new PaletteExtractor({
      maxColours: max_colors,
      minAreaPct: 1.0, // Only colors that cover at least 1% of the image
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

    // Step 3: Initialize blend solver
    console.log('[BLEND-RECIPES] Initializing blend solver...');
    const solver = new SmartBlendSolver(tpvColours, {
      maxComponents: max_components,
      stepPct: 0.04,  // 4% grid search precision
      minPct: 0.10,   // Minimum 10% per component
      mode: 'parts',  // Output as whole number parts
      parts: {
        total: 12,    // Aim for 12 parts total
        minPer: 1     // Minimum 1 part per component
      },
      preferAnchor: true  // Prefer simpler single-color solutions when close
    });

    // Step 4: Generate blend recipes for each color
    console.log('[BLEND-RECIPES] Generating blend recipes...');
    const recipes = [];
    const solveStartTime = Date.now();

    for (let i = 0; i < extraction.palette.length; i++) {
      const color = extraction.palette[i];

      console.log(`[BLEND-RECIPES]   Color ${i + 1}/${extraction.palette.length}: RGB(${color.rgb.R}, ${color.rgb.G}, ${color.rgb.B}) - ${color.areaPct.toFixed(1)}%`);

      // Get top 3 recipes for this color
      const colorRecipes = solver.solve(color.lab, 3);

      // Format recipes for response
      const formattedBlends = colorRecipes.map(recipe => ({
        parts: recipe.parts || {},
        total: recipe.total || 0,
        deltaE: recipe.deltaE,
        quality: recipe.deltaE < 1.0 ? 'Excellent' :
                 recipe.deltaE < 2.0 ? 'Good' : 'Fair',
        resultRgb: recipe.rgb,
        components: recipe.components.map(c => ({
          code: c.code,
          name: tpvColours.find(col => col.code === c.code)?.name || c.code,
          weight: c.weight,
          parts: recipe.parts ? recipe.parts[c.code] : null
        }))
      }));

      console.log(`[BLEND-RECIPES]     Best ΔE: ${colorRecipes[0].deltaE.toFixed(2)} (${formattedBlends[0].quality})`);

      recipes.push({
        targetColor: {
          hex: rgbToHex(color.rgb),
          rgb: color.rgb,
          lab: color.lab,
          areaPct: color.areaPct
        },
        blends: formattedBlends
      });
    }

    const solveTime = Date.now() - solveStartTime;
    const totalTime = Date.now() - startTime;

    console.log(`[BLEND-RECIPES] Generated ${recipes.length} recipe sets in ${solveTime}ms (total: ${totalTime}ms)`);

    // Step 5: Format and return results
    const colors = extraction.palette.map(c => ({
      hex: rgbToHex(c.rgb),
      rgb: c.rgb,
      lab: c.lab,
      areaPct: c.areaPct
    }));

    return res.status(200).json({
      success: true,
      colors,
      recipes,
      metadata: {
        colorsExtracted: extraction.palette.length,
        extractionTime: extractionTime,
        solveTime: solveTime,
        totalTime: totalTime,
        maxComponents: max_components
      }
    });

  } catch (error) {
    console.error('[BLEND-RECIPES] Error:', error);
    console.error(error.stack);

    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Convert RGB to hex color string
 */
function rgbToHex(rgb) {
  const toHex = (n) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(rgb.R)}${toHex(rgb.G)}${toHex(rgb.B)}`;
}

/**
 * Export config for larger payloads and longer timeout
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb'
    },
    responseLimit: '4mb',
    externalResolver: false
  },
  maxDuration: 60 // 60 seconds (color extraction can take time)
};
