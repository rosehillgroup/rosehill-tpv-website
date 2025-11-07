// Brief-Based Stencil Generator for IMG2IMG Mode
// Creates simple black/white layout guides from design briefs
// Optimized for FLUX img2img with denoise_strength

import sharp from 'sharp';

/**
 * Generate a simple stencil from a design brief
 * Creates black/white layout guide showing motif placements
 * @param {Object} brief - Design brief {title, mood, motifs, arrangement_notes}
 * @param {Object} dimensions - {width, height} in pixels
 * @param {Object} options - {seed, style}
 * @returns {Promise<Buffer>} PNG buffer of stencil
 */
export async function generateBriefStencil(brief, dimensions, options = {}) {
  const { width, height } = dimensions;
  const { seed = Date.now() } = options;

  console.log(`[BRIEF-STENCIL] Generating ${width}×${height} stencil for "${brief.title || 'untitled'}"`);
  console.log(`[BRIEF-STENCIL] Motifs: ${brief.motifs?.length || 0}`);

  // For now, generate a simple geometric layout guide
  // This will be a minimalist black/white composition showing:
  // - Simple shapes representing motif positions
  // - Flowing curves suggesting arrangement
  // - Generous negative space (white background)

  const motifCount = brief.motifs?.reduce((sum, m) => sum + (m.count || 1), 0) || 3;

  // Create an SVG layout guide
  const svg = generateLayoutSVG(brief, width, height, seed);

  // Rasterize to PNG using sharp
  const buffer = await sharp(Buffer.from(svg))
    .resize(width, height)
    .png()
    .toBuffer();

  console.log(`[BRIEF-STENCIL] Generated ${buffer.length} byte PNG stencil`);
  return buffer;
}

/**
 * Generate SVG layout guide from brief
 * @param {Object} brief - Design brief
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} seed - Random seed
 * @returns {string} SVG markup
 */
function generateLayoutSVG(brief, width, height, seed) {
  const motifs = brief.motifs || [];

  // Simple seeded random
  let rngState = seed;
  const random = () => {
    rngState = (rngState * 1664525 + 1013904223) >>> 0;
    return (rngState / 0x100000000);
  };

  // Start SVG with white background
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${width}" height="${height}" fill="white"/>`;

  // If no motifs, create simple flowing bands
  if (motifs.length === 0) {
    svg += generateSimpleBands(width, height, random);
  } else {
    // Generate simple shapes for each motif
    svg += generateMotifShapes(motifs, width, height, random);
  }

  svg += '</svg>';
  return svg;
}

/**
 * Generate simple flowing bands as fallback layout
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {Function} random - Random function
 * @returns {string} SVG path markup
 */
function generateSimpleBands(width, height, random) {
  let svg = '';

  // Create 2-3 flowing horizontal bands
  const numBands = 2 + Math.floor(random() * 2);
  const bandHeight = height / (numBands + 1);

  for (let i = 0; i < numBands; i++) {
    const y = bandHeight * (i + 0.5 + (random() - 0.5) * 0.3);
    const amplitude = bandHeight * 0.3;
    const wavelength = width / (2 + random() * 2);

    // Create wavy path
    let path = `M 0,${y}`;
    for (let x = 0; x <= width; x += wavelength / 10) {
      const wave = Math.sin((x / wavelength) * Math.PI * 2) * amplitude;
      path += ` L ${x},${y + wave}`;
    }

    // Close the shape with some thickness
    const thickness = bandHeight * 0.6;
    for (let x = width; x >= 0; x -= wavelength / 10) {
      const wave = Math.sin((x / wavelength) * Math.PI * 2) * amplitude;
      path += ` L ${x},${y + wave + thickness}`;
    }
    path += ' Z';

    svg += `<path d="${path}" fill="black" opacity="0.3"/>`;
  }

  return svg;
}

/**
 * Generate simple shapes representing motifs
 * @param {Array} motifs - Array of {name, count}
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {Function} random - Random function
 * @returns {string} SVG shapes markup
 */
function generateMotifShapes(motifs, width, height, random) {
  let svg = '';

  // Calculate total motif count
  const totalMotifs = motifs.reduce((sum, m) => sum + (m.count || 1), 0);

  // Place each motif as a simple geometric shape
  let placedCount = 0;
  for (const motif of motifs) {
    const count = motif.count || 1;

    for (let i = 0; i < count; i++) {
      placedCount++;

      // Distribute shapes across canvas with some randomness
      // Use a simple grid-based approach with jitter
      const gridCols = Math.ceil(Math.sqrt(totalMotifs * (width / height)));
      const gridRows = Math.ceil(totalMotifs / gridCols);

      const col = placedCount % gridCols;
      const row = Math.floor((placedCount - 1) / gridCols);

      const cellWidth = width / gridCols;
      const cellHeight = height / gridRows;

      const x = cellWidth * (col + 0.5 + (random() - 0.5) * 0.4);
      const y = cellHeight * (row + 0.5 + (random() - 0.5) * 0.4);

      // Size based on canvas dimensions
      const size = Math.min(cellWidth, cellHeight) * (0.3 + random() * 0.3);

      // Simple shape: circle, rectangle, or rounded rectangle
      const shapeType = Math.floor(random() * 3);

      if (shapeType === 0) {
        // Circle
        svg += `<circle cx="${x}" cy="${y}" r="${size/2}" fill="black" opacity="0.4"/>`;
      } else if (shapeType === 1) {
        // Rectangle
        svg += `<rect x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size}" fill="black" opacity="0.4"/>`;
      } else {
        // Rounded rectangle
        const rx = size * 0.2;
        svg += `<rect x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size}" rx="${rx}" fill="black" opacity="0.4"/>`;
      }
    }
  }

  return svg;
}

/**
 * Check if brief-based stencil mode is enabled
 * @returns {boolean} True if enabled
 */
export function isBriefStencilEnabled() {
  return process.env.INSPIRE_GUIDED_MODE === 'true';
}
