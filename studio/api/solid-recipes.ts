import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRequire } from 'module';
import { PaletteExtractor } from './_utils/extraction/extractor.js';
import { deltaE2000 } from './_utils/colour/deltaE.js';

const require = createRequire(import.meta.url);
const tpvColours = require('./_utils/data/rosehill_tpv_21_colours.json');

// Build version for cache busting
const BUILD_VERSION = 'v4.0.0-deconflict-colour-mapping-20260303';

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
      mode: 'solid', // Use ΔE ≤ 9 for more distinct color preservation
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

    // Rank all 21 TPV colours by deltaE for each extracted colour
    console.log('[SOLID-RECIPES] Ranking TPV colours for each extracted colour...');
    const solveStartTime = Date.now();

    type RankedMatch = { tpv: any; deltaE: number };
    type RankedColor = { color: any; index: number; ranked: RankedMatch[] };

    const rankedMatches: RankedColor[] = extraction.palette.map((color, index) => {
      const colorLab = { L: color.lab.L, a: color.lab.a, b: color.lab.b };
      const distances = tpvColours.map((tpv: any) => ({
        tpv,
        deltaE: deltaE2000(colorLab, { L: tpv.L, a: tpv.a, b: tpv.b })
      }));
      distances.sort((a: RankedMatch, b: RankedMatch) => a.deltaE - b.deltaE);

      console.log(`[SOLID-RECIPES]   Color ${index + 1}/${extraction.palette.length}: RGB(${color.rgb.R}, ${color.rgb.G}, ${color.rgb.B}) - ${color.areaPct.toFixed(1)}% → best: ${distances[0].tpv.code} (ΔE ${distances[0].deltaE.toFixed(2)})`);

      return { color, index, ranked: distances };
    });

    // Greedy deconfliction: assign TPV colours avoiding collisions
    // Sort by coverage (descending) so backgrounds get first pick
    const sortedByArea = [...rankedMatches].sort((a, b) => b.color.areaPct - a.color.areaPct);
    const assigned = new Set<string>(); // TPV codes already assigned
    const assignments = new Map<number, RankedMatch>(); // index → assigned TPV match

    // Max deltaE penalty before we accept a collision instead of an absurd reassignment
    const MAX_REASSIGNMENT_PENALTY = 30;

    for (const entry of sortedByArea) {
      const bestMatch = entry.ranked[0];

      if (!assigned.has(bestMatch.tpv.code)) {
        // Best match is free — assign it
        assignments.set(entry.index, bestMatch);
        assigned.add(bestMatch.tpv.code);
      } else {
        // Collision — find next-best unassigned TPV colour
        let reassigned = false;
        for (let r = 1; r < entry.ranked.length; r++) {
          const alt = entry.ranked[r];
          if (!assigned.has(alt.tpv.code)) {
            // Check if the penalty is acceptable
            const penalty = alt.deltaE - bestMatch.deltaE;
            if (penalty <= MAX_REASSIGNMENT_PENALTY) {
              assignments.set(entry.index, alt);
              assigned.add(alt.tpv.code);
              console.log(`[SOLID-RECIPES]   DECONFLICT: Color ${entry.index + 1} reassigned from ${bestMatch.tpv.code} (ΔE ${bestMatch.deltaE.toFixed(2)}) → ${alt.tpv.code} (ΔE ${alt.deltaE.toFixed(2)}, penalty +${penalty.toFixed(2)})`);
              reassigned = true;
              break;
            }
          }
        }
        if (!reassigned) {
          // All alternatives are too far or taken — keep the collision
          assignments.set(entry.index, bestMatch);
          console.log(`[SOLID-RECIPES]   COLLISION KEPT: Color ${entry.index + 1} stays on ${bestMatch.tpv.code} (no acceptable alternative)`);
        }
      }
    }

    // Build recipes from deconflicted assignments
    const recipes: any[] = [];

    for (let i = 0; i < extraction.palette.length; i++) {
      const color = extraction.palette[i];
      const match = assignments.get(i)!;
      const tpv = match.tpv;

      const chosenRecipe = {
        id: `solid_${i + 1}`,
        parts: { [tpv.code]: 12 },
        total: 12,
        deltaE: match.deltaE,
        quality: match.deltaE < 1.0 ? 'Excellent' : match.deltaE < 3.0 ? 'Good' : match.deltaE < 6.0 ? 'Fair' : 'Approximate',
        resultRgb: { R: tpv.R, G: tpv.G, B: tpv.B },
        components: [{
          code: tpv.code,
          name: tpv.name,
          weight: 1.0,
          parts: 12
        }]
      };

      console.log(`[SOLID-RECIPES]     Color ${i + 1} → ${tpv.code} (${tpv.name}), ΔE ${match.deltaE.toFixed(2)}`);

      recipes.push({
        originalColor: {
          hex: rgbToHex(color.rgb),
          rgb: color.rgb,
          lab: color.lab,
          areaPct: color.areaPct
        },
        targetColor: {
          hex: tpv.hex,
          rgb: { R: tpv.R, G: tpv.G, B: tpv.B },
          lab: { L: tpv.L, a: tpv.a, b: tpv.b },
          areaPct: color.areaPct
        },
        chosenRecipe,
        blendColor: {
          hex: tpv.hex,
          rgb: { R: tpv.R, G: tpv.G, B: tpv.B },
          lab: { L: tpv.L, a: tpv.a, b: tpv.b }
        },
        alternativeRecipes: []
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
