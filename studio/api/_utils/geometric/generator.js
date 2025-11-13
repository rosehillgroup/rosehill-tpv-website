// Main SVG Generator for TPV Studio Geometric Mode
// Orchestrates palette, bands, islands, and motifs into complete SVG

import { generatePalette } from './palette.js';
import { generateBands } from './bands.js';
import { generateIslands } from './islands.js';
import {
  placeMotifs,
  MOTIF_LIBRARY,
  getMotifsByCategory,
  getRandomMotifFromCategory,
  getAllCategories
} from './motifs-generated.js';

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
    options = {}
  } = params;

  const {
    mood = 'playful',
    composition = 'mixed',
    colorCount = 5,
    seed = Date.now()
  } = options;

  // Seeded random for deterministic generation
  let rng = seed;
  const random = () => {
    rng = (rng * 1664525 + 1013904223) % 4294967296;
    return rng / 4294967296;
  };

  // Step 1: Generate color palette
  const palette = generatePalette(colorCount, { mood, seed });

  // Step 2: Determine composition structure
  const structure = determineComposition(composition, brief, random);

  // Step 3: Generate SVG layers
  const layers = [];

  // Background layer (always present)
  const bgColor = palette[0];
  layers.push({
    id: 'background',
    type: 'background',
    color: bgColor,
    svg: `<rect id="bg" x="0" y="0" width="${canvas.width_mm}" height="${canvas.height_mm}" fill="${bgColor}"/>`
  });

  // Generate bands if requested
  if (structure.bands > 0) {
    const bands = generateBands(canvas, structure.bands, seed + 1000);
    bands.forEach((band, i) => {
      const color = palette[(i + 1) % palette.length];
      layers.push({
        id: `band-${i}`,
        type: 'band',
        color,
        svg: `<path id="band-${i}" class="geometric-band" fill="${color}" d="${band.path}"/>`
      });
    });
  }

  // Generate islands if requested
  if (structure.islands > 0) {
    const islands = generateIslands(canvas, structure.islands, seed + 2000);
    islands.forEach((island, i) => {
      const colorIdx = (i + structure.bands + 1) % palette.length;
      const color = palette[colorIdx];
      layers.push({
        id: `island-${i}`,
        type: 'island',
        color,
        svg: `<path id="island-${i}" class="geometric-island" fill="${color}" d="${island.path}"/>`
      });
    });
  }

  // Generate motifs if requested
  if (structure.motifs > 0) {
    const motifSpecs = selectMotifs(structure.motifs, brief, random);
    const placedMotifs = placeMotifs(canvas, motifSpecs, seed + 3000);

    placedMotifs.forEach((motif, i) => {
      const colorIdx = (i + structure.bands + structure.islands + 1) % palette.length;
      const color = palette[colorIdx];

      const motifDef = MOTIF_LIBRARY[motif.name];
      const transforms = [];
      if (motif.x !== 0 || motif.y !== 0) {
        transforms.push(`translate(${motif.x.toFixed(2)} ${motif.y.toFixed(2)})`);
      }
      if (motif.rotation !== 0) {
        transforms.push(`rotate(${motif.rotation.toFixed(2)})`);
      }
      if (motif.scale !== 1.0) {
        transforms.push(`scale(${motif.scale.toFixed(3)})`);
      }

      const transformAttr = transforms.length > 0 ? ` transform="${transforms.join(' ')}"` : '';

      layers.push({
        id: `motif-${i}`,
        type: 'motif',
        color,
        motifName: motif.name,
        svg: `<path id="motif-${i}" class="geometric-motif" data-motif="${motif.name}" fill="${color}"${transformAttr} d="${motifDef.pathData}"/>`
      });
    });
  }

  // Step 4: Build complete SVG document
  const svg = buildSVG(canvas, layers, palette, brief, seed);

  // Step 5: Collect metadata
  const metadata = {
    brief,
    canvas,
    palette,
    colorCount: palette.length,
    mood,
    composition: structure,
    seed,
    layerCount: layers.length,
    generatedAt: new Date().toISOString()
  };

  return { svg, metadata };
}

/**
 * Determine composition structure based on type and brief
 * @private
 */
function determineComposition(compositionType, brief, random) {
  // Default structures for each type
  const templates = {
    bands: { bands: 2, islands: 0, motifs: 0 },
    islands: { bands: 0, islands: 3, motifs: 0 },
    motifs: { bands: 0, islands: 0, motifs: 8 },
    mixed: { bands: 1, islands: 2, motifs: 4 }
  };

  let structure = templates[compositionType] || templates.mixed;

  // Add slight random variation
  if (compositionType === 'mixed') {
    structure = {
      bands: Math.floor(1 + random() * 2), // 1-2 bands
      islands: Math.floor(2 + random() * 2), // 2-3 islands
      motifs: Math.floor(3 + random() * 5) // 3-7 motifs
    };
  }

  return structure;
}

/**
 * Select appropriate motifs based on brief keywords
 * @private
 */
function selectMotifs(count, brief, random) {
  const briefLower = brief.toLowerCase();

  // Category keyword mapping
  const categoryKeywords = {
    ocean: ['ocean', 'sea', 'water', 'marine', 'wave', 'fish', 'whale', 'dolphin', 'coral', 'beach', 'aquatic'],
    space: ['space', 'star', 'planet', 'rocket', 'astronaut', 'galaxy', 'cosmic', 'celestial', 'universe'],
    nature: ['nature', 'tree', 'leaf', 'plant', 'forest', 'garden', 'eco', 'green', 'environment'],
    fastfood: ['food', 'burger', 'pizza', 'restaurant', 'cafe', 'kitchen', 'snack', 'fries', 'fastfood'],
    gym: ['gym', 'fitness', 'sport', 'exercise', 'workout', 'training', 'athletic', 'health'],
    transport: ['car', 'bus', 'train', 'transport', 'vehicle', 'traffic', 'road', 'travel'],
    landmarks: ['landmark', 'building', 'monument', 'city', 'architecture', 'tower', 'structure'],
    alphabet: ['letter', 'alphabet', 'text', 'typography', 'abc', 'character'],
    spring: ['spring', 'flower', 'blossom', 'bloom', 'seasonal', 'garden', 'floral'],
    trees: ['tree', 'forest', 'woodland', 'pine', 'oak', 'jungle']
  };

  // Detect matching categories
  const matchedCategories = [];
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(keyword => briefLower.includes(keyword));
    if (matches.length > 0) {
      matchedCategories.push({
        category,
        strength: matches.length
      });
    }
  }

  // Sort by match strength
  matchedCategories.sort((a, b) => b.strength - a.strength);

  // Select motifs from matched categories
  const specs = [];
  let remainingCount = count;

  if (matchedCategories.length > 0) {
    // Use top 1-2 matched categories
    const primaryCategory = matchedCategories[0].category;
    const primaryMotifs = getMotifsByCategory(primaryCategory);

    if (primaryMotifs.length > 0) {
      // 70% from primary category
      const primaryCount = Math.ceil(count * 0.7);
      const selectedPrimary = [];

      // Select random unique motifs from primary category
      for (let i = 0; i < primaryCount && selectedPrimary.length < primaryMotifs.length; i++) {
        const motifKey = getRandomMotifFromCategory(primaryCategory, random() * 10000);
        if (motifKey && !selectedPrimary.includes(motifKey)) {
          selectedPrimary.push(motifKey);
        }
      }

      selectedPrimary.forEach(motifKey => {
        specs.push({
          name: motifKey,
          count: 1,
          size_m: [0.6, 1.2]
        });
      });

      remainingCount -= selectedPrimary.length;
    }

    // Fill remaining with secondary category if available
    if (remainingCount > 0 && matchedCategories.length > 1) {
      const secondaryCategory = matchedCategories[1].category;
      const secondaryMotifs = getMotifsByCategory(secondaryCategory);

      if (secondaryMotifs.length > 0) {
        for (let i = 0; i < remainingCount; i++) {
          const motifKey = getRandomMotifFromCategory(secondaryCategory, random() * 10000);
          if (motifKey) {
            specs.push({
              name: motifKey,
              count: 1,
              size_m: [0.6, 1.0]
            });
          }
        }
        remainingCount = 0;
      }
    }
  }

  // Fallback: random selection from all categories
  if (remainingCount > 0) {
    const allCategories = getAllCategories();
    for (let i = 0; i < remainingCount; i++) {
      const randomCategory = allCategories[Math.floor(random() * allCategories.length)];
      const motifKey = getRandomMotifFromCategory(randomCategory, random() * 10000);
      if (motifKey) {
        specs.push({
          name: motifKey,
          count: 1,
          size_m: [0.6, 1.0]
        });
      }
    }
  }

  return specs.filter(s => s.count > 0);
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

/**
 * Parse a design brief using Claude Haiku to extract parameters
 * @param {string} brief - User's design brief
 * @param {object} defaultCanvas - Default canvas dimensions
 * @returns {object} Parsed parameters for generateGeometricSVG
 */
export async function parseBrief(brief, defaultCanvas = { width_mm: 15000, height_mm: 15000 }) {
  // TODO: Integrate with Claude Haiku API to parse brief
  // For now, use simple keyword detection

  const briefLower = brief.toLowerCase();

  // Detect mood
  let mood = 'playful'; // default
  if (briefLower.includes('serene') || briefLower.includes('calm') || briefLower.includes('peaceful')) {
    mood = 'serene';
  } else if (briefLower.includes('energetic') || briefLower.includes('vibrant') || briefLower.includes('dynamic')) {
    mood = 'energetic';
  } else if (briefLower.includes('bold') || briefLower.includes('striking') || briefLower.includes('dramatic')) {
    mood = 'bold';
  }

  // Detect composition preference
  let composition = 'mixed'; // default
  if (briefLower.includes('bands') || briefLower.includes('ribbon') || briefLower.includes('stripe')) {
    composition = 'bands';
  } else if (briefLower.includes('island') || briefLower.includes('blob') || briefLower.includes('organic')) {
    composition = 'islands';
  } else if (briefLower.includes('motif') || briefLower.includes('icon') || briefLower.includes('symbol')) {
    composition = 'motifs';
  }

  // Detect color count
  let colorCount = 5; // default
  const colorMatch = brief.match(/(\d+)\s*colou?rs?/i);
  if (colorMatch) {
    colorCount = Math.max(3, Math.min(8, parseInt(colorMatch[1])));
  }

  return {
    brief,
    canvas: defaultCanvas,
    options: {
      mood,
      composition,
      colorCount,
      seed: Date.now()
    }
  };
}
