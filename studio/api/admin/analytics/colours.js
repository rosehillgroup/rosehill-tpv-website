/**
 * Admin Colour Analytics Endpoint
 * GET /api/admin/analytics/colours - TPV colour usage statistics
 */

import { getAuthenticatedClient, getSupabaseServiceClient } from '../../_utils/supabase.js';
import { requireAdmin } from '../../_utils/admin.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const TPV_COLOURS = require('../../_utils/data/rosehill_tpv_21_colours.json');

export const config = {
  api: {
    bodyParser: true
  },
  maxDuration: 60
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user
    const { user } = await getAuthenticatedClient(req);

    // Check admin access
    const isAdminUser = await requireAdmin(req, res, user);
    if (!isAdminUser) return;

    // Use service client for admin operations
    const supabase = getSupabaseServiceClient();

    // Get all designs with solid recipes
    const { data: designs } = await supabase
      .from('saved_designs')
      .select('solid_recipes, blend_recipes, created_at')
      .not('solid_recipes', 'is', null);

    // Count TPV colour usage from solid recipes
    const colourUsage = {};
    const blendUsage = {};

    // Initialize all colours with 0
    TPV_COLOURS.forEach(c => {
      colourUsage[c.code] = {
        code: c.code,
        name: c.name,
        hex: c.hex,
        count: 0,
        total_coverage: 0
      };
    });

    // Process solid recipes
    (designs || []).forEach(design => {
      const solidRecipes = design.solid_recipes;
      if (Array.isArray(solidRecipes)) {
        solidRecipes.forEach(recipe => {
          const components = recipe?.chosenRecipe?.components || [];
          components.forEach(comp => {
            const code = comp.code;
            if (colourUsage[code]) {
              colourUsage[code].count += 1;
              colourUsage[code].total_coverage += (recipe.targetColor?.areaPct || 0);
            }
          });
        });
      }

      // Process blend recipes for component usage
      const blendRecipes = design.blend_recipes;
      if (Array.isArray(blendRecipes)) {
        blendRecipes.forEach(recipe => {
          const components = recipe?.chosenRecipe?.components || [];

          // Track blend combinations
          if (components.length > 1) {
            const blendKey = components.map(c => c.code).sort().join('+');
            if (!blendUsage[blendKey]) {
              blendUsage[blendKey] = {
                components: components.map(c => ({
                  code: c.code,
                  name: c.name,
                  hex: getHexForCode(c.code)
                })),
                count: 0
              };
            }
            blendUsage[blendKey].count += 1;
          }

          // Also count individual colours in blends
          components.forEach(comp => {
            const code = comp.code;
            if (colourUsage[code]) {
              colourUsage[code].count += 1;
            }
          });
        });
      }
    });

    // Convert to array and sort by usage
    const colourStats = Object.values(colourUsage)
      .sort((a, b) => b.count - a.count);

    // Get top blends
    const topBlends = Object.values(blendUsage)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate totals
    const totalColourUsages = colourStats.reduce((sum, c) => sum + c.count, 0);
    const totalDesigns = designs?.length || 0;

    // Group by colour family
    const colourFamilies = {
      reds: colourStats.filter(c => ['RH01', 'RH02', 'RH90'].includes(c.code)),
      greens: colourStats.filter(c => ['RH10', 'RH11', 'RH12'].includes(c.code)),
      blues: colourStats.filter(c => ['RH20', 'RH21', 'RH22', 'RH23', 'RH26'].includes(c.code)),
      yellows: colourStats.filter(c => ['RH40', 'RH41', 'RH50'].includes(c.code)),
      neutrals: colourStats.filter(c => ['RH30', 'RH31', 'RH32', 'RH60', 'RH61', 'RH65', 'RH70'].includes(c.code))
    };

    // Calculate family totals
    const familyStats = {
      reds: colourFamilies.reds.reduce((sum, c) => sum + c.count, 0),
      greens: colourFamilies.greens.reduce((sum, c) => sum + c.count, 0),
      blues: colourFamilies.blues.reduce((sum, c) => sum + c.count, 0),
      yellows: colourFamilies.yellows.reduce((sum, c) => sum + c.count, 0),
      neutrals: colourFamilies.neutrals.reduce((sum, c) => sum + c.count, 0)
    };

    return res.status(200).json({
      success: true,
      analytics: {
        totals: {
          designs_analysed: totalDesigns,
          colour_usages: totalColourUsages
        },
        colours: colourStats,
        top_colours: colourStats.slice(0, 10),
        top_blends: topBlends,
        families: familyStats
      }
    });

  } catch (error) {
    console.error('[ADMIN-COLOURS] Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch colour analytics',
      message: error.message
    });
  }
}

/**
 * Helper: Get hex colour for TPV code
 */
function getHexForCode(code) {
  const colour = TPV_COLOURS.find(c => c.code === code);
  return colour?.hex || '#000000';
}
