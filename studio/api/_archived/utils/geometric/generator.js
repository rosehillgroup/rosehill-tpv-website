// Main SVG Generator for TPV Studio Geometric Mode
// Orchestrates palette, bands, islands, and motifs into complete SVG
// Now uses motif roles and layout recipes for professional playground designs

import { generatePalette } from './palette.js';
import { MOTIF_LIBRARY } from './motifs-generated.js';
import { parseBrief } from './brief-parser.js';
import { buildMotifPlan, validateMotifPlan } from './motif-roles.js';
import { chooseRecipe, getRecipeFunction } from './layout-recipes.js';

/**
 * Generate a complete geometric SVG design
 * @param {object} params - Generation parameters
 * @param {string} params.brief - Design brief/description
 * @param {object} params.canvas - {width_mm, height_mm}
 * @param {object} params.options - Generation options
 * @param {string} params.options.mood - Color mood (playful, serene, energetic, bold, calm)
 * @param {string} params.options.composition - Composition type (bands, islands, mixed)
 * @param {number} params.options.colorCount - Number of colors (3-8)
 * @param {number} params.options.seed - Random seed for reproducibility
 * @returns {object} {svg: string, metadata: object}
 */
export async function generateGeometricSVG(params) {
  const {
    brief = 'Abstract geometric design',
    canvas = { width_mm: 15000, height_mm: 15000 },
    options = {},
    layout = {},
    metadata = {}
  } = params;

  const {
    mood = 'playful',
    composition = 'mixed',
    colorCount = 5,
    seed = Date.now()
  } = options;

  const themes = metadata.themes || [];
  console.log('[GENERATOR] Starting generation:', { brief, mood, composition, themes, layout });

  // Step 1: Generate color palette
  const palette = generatePalette(colorCount, { mood, seed });
  console.log('[GENERATOR] Palette:', palette);

  // Step 2: Build or validate motif plan
  const complexity = layout.complexity || 'medium';
  const motifPlan = layout.motif_plan
    ? validateMotifPlan(layout.motif_plan)
    : buildMotifPlan(themes.length > 0 ? themes : 'nature', complexity);

  console.log('[GENERATOR] Motif plan:', motifPlan);

  // Step 3: Select layout recipe
  const recipeName = layout.recipe || chooseRecipe(composition, themes, mood);
  console.log('[GENERATOR] Using recipe:', recipeName);

  const recipeFunction = getRecipeFunction(recipeName);

  // Step 4: Generate layout using recipe
  const recipeLayers = recipeFunction(canvas, motifPlan, palette, seed);
  console.log('[GENERATOR] Recipe generated:', {
    bands: recipeLayers.bands.length,
    islands: recipeLayers.islands.length,
    motifs: recipeLayers.motifPlacements.length
  });

  // Step 5: Convert recipe output to SVG layers
  const layers = [];

  // Background layer (always present)
  const bgColor = palette[0];
  layers.push({
    id: 'background',
    type: 'background',
    color: bgColor,
    svg: `<rect id="bg" x="0" y="0" width="${canvas.width_mm}" height="${canvas.height_mm}" fill="${bgColor}"/>`
  });

  // Bands from recipe
  recipeLayers.bands.forEach((band, i) => {
    // Use composition engine assigned color if present, otherwise use default rotation
    const color = band.color || palette[(i + 1) % palette.length];
    layers.push({
      id: `band-${i}`,
      type: 'band',
      color,
      svg: `<path id="band-${i}" class="geometric-band" fill="${color}" d="${band.path}"/>`
    });
  });

  // Islands from recipe
  recipeLayers.islands.forEach((island, i) => {
    // Use composition engine assigned color if present, otherwise use default rotation
    const colorIdx = (i + recipeLayers.bands.length + 1) % palette.length;
    const color = island.color || palette[colorIdx];
    layers.push({
      id: `island-${i}`,
      type: 'island',
      color,
      svg: `<path id="island-${i}" class="geometric-island" fill="${color}" d="${island.path}"/>`
    });
  });

  // Motifs from recipe with role-based color assignment
  recipeLayers.motifPlacements.forEach((placement, i) => {
    // Use composition engine assigned color if present, otherwise fallback to role-based assignment
    const color = placement.color || assignColorByRole(placement.role, palette, i);

    const motifDef = MOTIF_LIBRARY[placement.motif];
    if (!motifDef) {
      console.warn(`[GENERATOR] Motif not found: ${placement.motif}`);
      return;
    }

    // Calculate scale from size_mm
    const targetSize = placement.size_mm;
    const scale = targetSize / motifDef.nominalSize;

    const transforms = [];
    if (placement.x !== 0 || placement.y !== 0) {
      transforms.push(`translate(${placement.x.toFixed(2)} ${placement.y.toFixed(2)})`);
    }
    if (placement.rotation) {
      transforms.push(`rotate(${placement.rotation.toFixed(2)})`);
    }
    if (scale !== 1.0) {
      transforms.push(`scale(${scale.toFixed(3)})`);
    }

    const transformAttr = transforms.length > 0 ? ` transform="${transforms.join(' ')}"` : '';

    layers.push({
      id: `motif-${i}`,
      type: 'motif',
      role: placement.role,
      color,
      motifName: placement.motif,
      svg: `<path id="motif-${i}" class="geometric-motif" data-motif="${placement.motif}" data-role="${placement.role}" fill="${color}"${transformAttr} d="${motifDef.pathData}"/>`
    });
  });

  // Step 6: Build complete SVG document
  const svg = buildSVG(canvas, layers, palette, brief, seed);

  // Step 7: Collect metadata
  const generationMetadata = {
    brief,
    canvas,
    palette,
    colorCount: palette.length,
    mood,
    composition: {
      recipe: recipeName,
      complexity,
      bands: recipeLayers.bands.length,
      islands: recipeLayers.islands.length,
      motifs: recipeLayers.motifPlacements.length
    },
    themes,
    seed,
    layerCount: layers.length,
    generatedAt: new Date().toISOString()
  };

  return { svg, metadata: generationMetadata };
}

/**
 * Assign color to motif based on its role
 * Hero motifs get high-contrast accent colors
 * Support motifs get mid-palette colors
 * Accent motifs harmonize with background
 * @private
 */
function assignColorByRole(role, palette, index) {
  const paletteLength = palette.length;

  switch (role) {
    case 'hero':
      // Use vibrant accent color from end of palette
      return palette[paletteLength - 1];

    case 'support':
      // Use mid-palette colors, cycling through them
      const midStart = Math.floor(paletteLength / 3);
      const midEnd = Math.floor((paletteLength * 2) / 3);
      const midRange = midEnd - midStart;
      return palette[midStart + (index % Math.max(1, midRange))];

    case 'accent':
      // Use colors that harmonize with background
      const accentIdx = 1 + (index % Math.max(1, paletteLength - 2));
      return palette[accentIdx];

    default:
      // Fallback: cycle through palette
      return palette[(index + 1) % paletteLength];
  }
}

/**
 * Build final SVG document with all layers
 * @private
 */
function buildSVG(canvas, layers, palette, brief, seed) {
  const { width_mm, height_mm } = canvas;

  // SVG header
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${width_mm} ${height_mm}"
     width="${width_mm}mm"
     height="${height_mm}mm"
     data-tpv-mode="geometric"
     data-seed="${seed}">
  <title>${brief}</title>
  <desc>TPV Studio Geometric Design - Generated ${new Date().toISOString()}</desc>

  <!-- Metadata -->
  <metadata>
    <tpv:design xmlns:tpv="http://rosehill.group/tpv">
      <tpv:mode>geometric</tpv:mode>
      <tpv:brief>${escapeXML(brief)}</tpv:brief>
      <tpv:palette>${palette.join(',')}</tpv:palette>
      <tpv:seed>${seed}</tpv:seed>
      <tpv:canvas width="${width_mm}" height="${height_mm}" unit="mm"/>
    </tpv:design>
  </metadata>

  <!-- Design layers -->
  <g id="design">`;

  // Layer SVG
  const layerSVG = layers.map(layer => `    ${layer.svg}`).join('\n');

  // SVG footer
  const footer = `
  </g>
</svg>`;

  return header + '\n' + layerSVG + footer;
}

/**
 * Escape XML special characters
 * @private
 */
function escapeXML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// parseBrief() is now imported from ./brief-parser.js (Claude Haiku integration)
// Export it for backward compatibility
export { parseBrief };
