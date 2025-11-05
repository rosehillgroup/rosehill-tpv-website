// /.netlify/functions/studio/design-generate.js
// TPV Studio - Design Generation Endpoint
// Takes LayoutSpec and generates actual geometric designs with exports

/**
 * API Endpoint: POST /api/studio/design/generate
 *
 * Generates design variants from a LayoutSpec
 *
 * Request Body:
 * {
 *   spec: LayoutSpec,           // From design-plan endpoint
 *   variants: number            // Number of variants to generate (default 3)
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   variants: Array<{
 *     variant: number,
 *     score: number,
 *     bom: {colourAreas_m2: object, totalArea_m2: number},
 *     violations: Array<object>,
 *     svgUrl: string,
 *     pngUrl: string,
 *     dxfUrl: string,
 *     pdfUrl: string
 *   }>
 * }
 */

import { combineGrammars } from './studio/_utils/grammars.js';
import { assignColors, checkRegionConstraints, calculateInstallerScore, calculateBOM } from './studio/_utils/constraints.js';
import { generateAllExports } from './studio/_utils/exports.js';
import { SeededRandom } from './studio/_utils/random.js';

// CORS headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export default async (request) => {
  const startTime = Date.now();

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response('', { status: 204, headers });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  }

  try {
    // Parse request body
    const body = await request.json();
    const { spec, variants: variantCount = 3 } = body;

    // Validate LayoutSpec
    if (!spec || !spec.surface || !spec.palette || !spec.grammar) {
      return new Response(JSON.stringify({
        error: 'Invalid LayoutSpec',
        message: 'spec must include surface, palette, and grammar'
      }), { status: 400, headers });
    }

    console.log('[DESIGN GEN] Generating', variantCount, 'variants');
    console.log('[DESIGN GEN] Surface:', spec.surface);
    console.log('[DESIGN GEN] Colors:', spec.palette.map(p => p.code).join(', '));

    const generatedVariants = [];

    // Generate multiple variants with different seeds
    for (let i = 0; i < variantCount; i++) {
      const variantSeed = (spec.seeds?.global || 0) + (i * 1000);

      console.log(`[DESIGN GEN] Generating variant ${i + 1} (seed: ${variantSeed})...`);

      try {
        const variant = await generateVariant(spec, i + 1, variantSeed);
        generatedVariants.push(variant);
        console.log(`[DESIGN GEN] Variant ${i + 1} complete (score: ${variant.score})`);
      } catch (variantError) {
        console.error(`[DESIGN GEN] Variant ${i + 1} failed:`, variantError);
        // Continue with other variants
      }
    }

    if (generatedVariants.length === 0) {
      throw new Error('Failed to generate any variants');
    }

    const processingTime = Date.now() - startTime;
    console.log('[DESIGN GEN] All variants complete:', processingTime, 'ms');

    return new Response(JSON.stringify({
      success: true,
      variants: generatedVariants,
      processingTime
    }), { status: 200, headers });

  } catch (error) {
    console.error('[DESIGN GEN] Error:', error);

    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { status: 500, headers });
  }
}

/**
 * Generate a single design variant
 */
async function generateVariant(spec, variantNumber, seed) {
  const { surface, palette, grammar, rules } = spec;

  // Step 1: Generate geometric regions using grammars
  console.log(`[VARIANT ${variantNumber}] Generating regions...`);
  const regions = combineGrammars(grammar, surface, seed);
  console.log(`[VARIANT ${variantNumber}] Generated ${regions.length} regions`);

  // Step 2: Assign colors to regions
  console.log(`[VARIANT ${variantNumber}] Assigning colors...`);
  const coloredRegions = assignColors(regions, palette);

  // Step 3: Check constraints
  console.log(`[VARIANT ${variantNumber}] Checking constraints...`);
  const allViolations = [];
  for (const region of coloredRegions) {
    const violations = checkRegionConstraints(region, rules || {});
    allViolations.push(...violations);
  }

  console.log(`[VARIANT ${variantNumber}] Found ${allViolations.length} violations`);

  // Step 4: Calculate installer score
  const score = calculateInstallerScore(allViolations);
  console.log(`[VARIANT ${variantNumber}] Installer score: ${score}`);

  // Step 5: Calculate Bill of Materials
  const bom = calculateBOM(coloredRegions, palette);
  console.log(`[VARIANT ${variantNumber}] Total area: ${bom.totalArea_m2.toFixed(2)} m²`);

  // Step 6: Generate exports (SVG, PNG, DXF, PDF)
  console.log(`[VARIANT ${variantNumber}] Generating exports...`);
  const metadata = {
    title: spec.meta?.title || 'TPV Design',
    variant: variantNumber,
    theme: spec.meta?.theme || 'custom',
    seed
  };

  const exports = await generateAllExports(coloredRegions, surface, metadata, bom, palette);

  // Step 7: Return variant data
  return {
    variant: variantNumber,
    score,
    bom,
    violations: allViolations,
    svgUrl: exports.svgUrl,
    pngUrl: exports.pngUrl,
    dxfUrl: exports.dxfUrl,
    pdfUrl: exports.pdfUrl,
    metadata
  };
}
