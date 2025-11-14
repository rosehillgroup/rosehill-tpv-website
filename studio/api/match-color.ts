import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRequire } from 'module';
import { SmartBlendSolver } from './_utils/colour/smartSolver.js';
import { calculateBlendColor, type BlendComponent, type TPVColor } from './_utils/colour/blendColor.js';
import { ColourSpaceConverter } from './_utils/extraction/utils.js';

const require = createRequire(import.meta.url);
const tpvColours = require('./_utils/data/rosehill_tpv_21_colours.json');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { hex, max_components = 2 } = req.body;

    if (!hex) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: hex'
      });
    }

    // Validate hex color format
    const hexPattern = /^#?[0-9A-Fa-f]{6}$/;
    if (!hexPattern.test(hex)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid hex color format. Expected #RRGGBB or RRGGBB'
      });
    }

    console.log('[MATCH-COLOR] Matching color:', hex, 'with max components:', max_components);

    const startTime = Date.now();

    // Parse hex to RGB
    const cleanHex = hex.replace('#', '');
    const rgb = {
      R: parseInt(cleanHex.substring(0, 2), 16),
      G: parseInt(cleanHex.substring(2, 4), 16),
      B: parseInt(cleanHex.substring(4, 6), 16)
    };

    // Convert to LAB
    const converter = new ColourSpaceConverter();
    const lab = converter.rgbToLab(rgb);

    console.log(`[MATCH-COLOR] Target RGB(${rgb.R}, ${rgb.G}, ${rgb.B}) -> LAB(${lab.L.toFixed(1)}, ${lab.a.toFixed(1)}, ${lab.b.toFixed(1)})`);

    // Initialize blend solver
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

    // Solve for top 5 blend recipes
    const colorRecipes = solver.solve(lab, 5);

    console.log(`[MATCH-COLOR] Found ${colorRecipes.length} recipes`);

    // Format recipes for response
    const recipes = colorRecipes.map((recipe, idx) => {
      // Calculate visual blend color
      const blendComponents: BlendComponent[] = recipe.components.map(c => ({
        code: c.code,
        pct: c.pct
      }));
      const blendColor = calculateBlendColor(blendComponents, tpvColours as TPVColor[]);

      // Format parts
      const parts = recipe.parts || {};
      const totalParts = recipe.total || 0;

      // Format components
      const components = recipe.components.map(comp => {
        const tpvColor = tpvColours.find(tc => tc.code === comp.code);
        return {
          code: comp.code,
          name: tpvColor?.name || comp.code,
          weight: comp.pct,
          parts: parts[comp.code] || null
        };
      });

      return {
        id: `recipe_${idx + 1}`,
        deltaE: recipe.deltaE,
        quality: recipe.deltaE < 1.0 ? 'Excellent' : recipe.deltaE < 2.0 ? 'Good' : 'Fair',
        components,
        parts: totalParts > 0 ? parts : null,
        total: totalParts > 0 ? totalParts : null,
        resultRgb: recipe.rgb,
        blendColor: {
          hex: blendColor.hex,
          rgb: blendColor.rgb,
          lab: blendColor.lab
        }
      };
    });

    const solveTime = Date.now() - startTime;

    if (recipes.length === 0) {
      console.error('[MATCH-COLOR] No recipes found for color:', hex);
      return res.status(404).json({
        success: false,
        error: 'No matching recipes found for this color'
      });
    }

    console.log(`[MATCH-COLOR] Completed in ${solveTime}ms, best ΔE: ${recipes[0].deltaE.toFixed(2)}`);

    return res.status(200).json({
      success: true,
      targetColor: {
        hex: `#${cleanHex}`,
        rgb,
        lab
      },
      recipes,
      metadata: {
        solveTime,
        recipesFound: recipes.length
      }
    });

  } catch (err) {
    console.error('[MATCH-COLOR] Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({
      success: false,
      error: errorMessage,
      details: err instanceof Error ? err.stack : String(err)
    });
  }
}
