// Brief-Based Stencil Generator for IMG2IMG Mode
// Creates simple black/white layout guides from design briefs
// Optimized for FLUX img2img with denoise_strength

import sharp from 'sharp';

/**
 * Generate a simple stencil from a design brief with composition guidance
 * Creates flat composition: 2-4 broad colored regions + up to 2 large motif blobs
 * @param {Object} brief - Design brief {title, mood, composition, motifs, arrangement_notes}
 * @param {Object} dimensions - {width, height} in pixels
 * @param {Object} options - {seed}
 * @returns {Promise<Buffer>} PNG buffer of stencil
 */
export async function generateBriefStencil(brief, dimensions, options = {}) {
  const { width, height } = dimensions;
  const { seed = Date.now() } = options;

  // Extract composition parameters
  const composition = brief.composition || {
    target_region_count: 3,
    min_feature_mm: 120,
    min_radius_mm: 600
  };

  console.log(`[BRIEF-STENCIL] Generating ${width}×${height} stencil for "${brief.title || 'untitled'}"`);
  console.log(`[BRIEF-STENCIL] Target regions: ${composition.target_region_count}`);

  const totalMotifCount = (brief.motifs || []).reduce((sum, m) => sum + (m.count || 1), 0);
  console.log(`[BRIEF-STENCIL] Motifs: ${brief.motifs?.length || 0} types, ${totalMotifCount} individual shapes`);

  // Create an SVG layout guide using composition parameters
  const svg = generateLayoutSVG(brief, width, height, seed, composition);

  // Rasterize to PNG using sharp with blur and de-contrast
  // to reduce "copy pressure" in Flux Dev img2img
  const buffer = await sharp(Buffer.from(svg))
    .resize(width, height)
    .blur(2.5)  // Soften edges to reduce edge-field dominance
    .linear(0.75, 32)  // Reduce contrast by 25% and add 32-level grey overlay
    .png()
    .toBuffer();

  console.log(`[BRIEF-STENCIL] Generated ${buffer.length} byte PNG stencil (blurred + de-contrasted)`);
  return buffer;
}

/**
 * Generate SVG layout guide from brief using composition parameters
 * @param {Object} brief - Design brief
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} seed - Random seed
 * @param {Object} composition - Composition parameters
 * @returns {string} SVG markup
 */
function generateLayoutSVG(brief, width, height, seed, composition) {
  const motifs = brief.motifs || [];
  const targetRegions = composition.target_region_count || 3;

  // Simple seeded random
  let rngState = seed;
  const random = () => {
    rngState = (rngState * 1664525 + 1013904223) >>> 0;
    return (rngState / 0x100000000);
  };

  // Start SVG with white background
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${width}" height="${height}" fill="white"/>`;

  // Generate broad colored regions (2-4 regions as background)
  svg += generateBroadRegions(width, height, targetRegions, random);

  // Add semantic motif shapes (fish, seaweed, etc.)
  // generateSemanticMotifs will expand counts and cap at 5 total shapes
  if (motifs.length > 0) {
    svg += generateSemanticMotifs(motifs, width, height, random, composition);
  }

  svg += '</svg>';
  return svg;
}

/**
 * Generate broad colored regions (background bands)
 * Creates 2-4 large regions with generous spacing
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} targetRegions - Number of regions to create (2-4)
 * @param {Function} random - Random function
 * @returns {string} SVG path markup
 */
function generateBroadRegions(width, height, targetRegions, random) {
  let svg = '';

  // Create flowing horizontal bands (2-4 regions)
  const numRegions = Math.max(2, Math.min(4, targetRegions));
  const regionHeight = height / numRegions;

  for (let i = 0; i < numRegions; i++) {
    const y = regionHeight * i;
    const amplitude = regionHeight * 0.15;  // Gentle waves
    const wavelength = width / (1 + random());

    // Create wavy path for top edge
    let path = `M 0,${y}`;
    for (let x = 0; x <= width; x += wavelength / 8) {
      const wave = Math.sin((x / wavelength) * Math.PI * 2) * amplitude;
      path += ` L ${x},${y + wave}`;
    }

    // Go down to bottom edge
    path += ` L ${width},${y + regionHeight}`;
    path += ` L 0,${y + regionHeight}`;
    path += ' Z';

    // Use varying opacity to create visual distinction between regions
    const opacity = 0.15 + (i % 2) * 0.1;
    svg += `<path d="${path}" fill="black" opacity="${opacity}"/>`;
  }

  return svg;
}

/**
 * Generate semantic motif shapes based on motif names
 * Creates recognizable silhouettes (fish, seaweed, etc.) instead of generic blobs
 * @param {Array} motifs - Array of {name, count, size_m}
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {Function} random - Random function
 * @param {Object} composition - Composition parameters for sizing
 * @returns {string} SVG shapes markup
 */
function generateSemanticMotifs(motifs, width, height, random, composition) {
  let svg = '';

  // Expand motifs based on count (e.g., {name: "fish", count: 3} becomes 3 fish entries)
  const expandedMotifs = [];
  for (const motif of motifs) {
    const count = Math.min(motif.count || 1, 5);  // Cap at 5 per motif type
    for (let i = 0; i < count; i++) {
      expandedMotifs.push({ ...motif, count: 1 });  // Individual instances
    }
  }

  console.log(`[BRIEF-STENCIL] Expanded ${motifs.length} motif types to ${expandedMotifs.length} individual shapes`);

  // Position motifs with generous spacing (support up to 5 individual shapes)
  const positions = [
    { x: 0.20, y: 0.35 },  // Left
    { x: 0.50, y: 0.40 },  // Center
    { x: 0.80, y: 0.35 },  // Right
    { x: 0.35, y: 0.65 },  // Lower left
    { x: 0.65, y: 0.65 }   // Lower right
  ];

  for (let i = 0; i < Math.min(expandedMotifs.length, 5); i++) {
    const motif = expandedMotifs[i];
    const pos = positions[i];

    const x = width * pos.x;
    const y = height * (pos.y + (random() - 0.5) * 0.08);  // Small vertical variation

    // Calculate size
    let sizePixels;
    if (motif.size_m && Array.isArray(motif.size_m)) {
      const avgSizeM = (motif.size_m[0] + motif.size_m[1]) / 2;
      const ppi = parseInt(process.env.IMG_PPI || '200');
      sizePixels = (avgSizeM * 39.37 * ppi);
    } else {
      const minFeatureMM = composition.min_feature_mm || 120;
      const ppi = parseInt(process.env.IMG_PPI || '200');
      sizePixels = (minFeatureMM / 25.4 * ppi);
    }

    // Ensure size is reasonable
    sizePixels = Math.min(sizePixels, Math.min(width, height) * 0.35);
    sizePixels = Math.max(sizePixels, Math.min(width, height) * 0.12);

    // Determine motif type from name and generate appropriate shape
    const motifType = classifyMotif(motif.name);
    const rotation = random() * 360;  // Random rotation for variety

    console.log(`[BRIEF-STENCIL] Drawing ${motifType} for "${motif.name}" at (${x.toFixed(0)}, ${y.toFixed(0)}) size ${sizePixels.toFixed(0)}px`);

    switch (motifType) {
      case 'fish':
        svg += generateFishShape(x, y, sizePixels, rotation, random);
        break;
      case 'seaweed':
        svg += generateSeaweedShape(x, y, sizePixels, random);
        break;
      case 'star':
        svg += generateStarShape(x, y, sizePixels, rotation);
        break;
      case 'shell':
        svg += generateShellShape(x, y, sizePixels, rotation, random);
        break;
      default:
        svg += generateOrganicBlobShape(x, y, sizePixels, random);
    }
  }

  return svg;
}

/**
 * Classify motif type from name string
 */
function classifyMotif(name) {
  const nameLower = name.toLowerCase();

  if (nameLower.includes('fish') || nameLower.includes('shark') || nameLower.includes('dolphin')) {
    return 'fish';
  }
  if (nameLower.includes('seaweed') || nameLower.includes('kelp') || nameLower.includes('plant') || nameLower.includes('coral')) {
    return 'seaweed';
  }
  if (nameLower.includes('star') || nameLower.includes('starfish')) {
    return 'star';
  }
  if (nameLower.includes('shell') || nameLower.includes('clam') || nameLower.includes('oyster')) {
    return 'shell';
  }

  return 'organic';  // Generic organic blob fallback
}

/**
 * Generate fish silhouette with body, tail notch, and fin
 */
function generateFishShape(x, y, size, rotation, random) {
  const scale = size / 200;  // Base size 200px

  // Simple fish silhouette: body (ellipse-like), tail with notch, dorsal fin
  const path = `
    M ${x + 60*scale},${y}
    C ${x + 100*scale},${y - 20*scale} ${x + 120*scale},${y - 10*scale} ${x + 140*scale},${y}
    L ${x + 150*scale},${y - 15*scale}
    L ${x + 145*scale},${y}
    L ${x + 150*scale},${y + 15*scale}
    L ${x + 140*scale},${y}
    C ${x + 120*scale},${y + 10*scale} ${x + 100*scale},${y + 25*scale} ${x + 60*scale},${y + 30*scale}
    C ${x + 40*scale},${y + 30*scale} ${x + 20*scale},${y + 25*scale} ${x},${y + 15*scale}
    C ${x - 20*scale},${y + 5*scale} ${x - 20*scale},${y - 5*scale} ${x},${y - 15*scale}
    C ${x + 20*scale},${y - 25*scale} ${x + 40*scale},${y - 30*scale} ${x + 60*scale},${y}
    Z
  `;

  return `<path d="${path.trim()}" fill="black" opacity="0.3" transform="rotate(${rotation} ${x} ${y})"/>`;
}

/**
 * Generate seaweed/kelp silhouette - tall S-curve with blunt tips
 */
function generateSeaweedShape(x, y, size, random) {
  const scale = size / 200;
  const waveAmplitude = 15 * scale * (0.8 + random() * 0.4);

  // Tall S-curve seaweed frond
  const path = `
    M ${x - waveAmplitude},${y - size/2}
    Q ${x + waveAmplitude},${y - size/3} ${x - waveAmplitude/2},${y}
    Q ${x + waveAmplitude},${y + size/3} ${x},${y + size/2}
    L ${x + 8*scale},${y + size/2}
    Q ${x + waveAmplitude + 8*scale},${y + size/3} ${x - waveAmplitude/2 + 8*scale},${y}
    Q ${x + waveAmplitude + 8*scale},${y - size/3} ${x - waveAmplitude + 8*scale},${y - size/2}
    Z
  `;

  return `<path d="${path.trim()}" fill="black" opacity="0.3"/>`;
}

/**
 * Generate starfish shape - 5-pointed star
 */
function generateStarShape(x, y, size, rotation) {
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.4;

  let path = `M ${x},${y - outerRadius}`;

  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 72 - 90) * Math.PI / 180;
    const innerAngle = ((i + 0.5) * 72 - 90) * Math.PI / 180;

    path += ` L ${x + Math.cos(innerAngle) * innerRadius},${y + Math.sin(innerAngle) * innerRadius}`;
    path += ` L ${x + Math.cos(outerAngle + Math.PI/2.5) * outerRadius},${y + Math.sin(outerAngle + Math.PI/2.5) * outerRadius}`;
  }

  path += ' Z';

  return `<path d="${path}" fill="black" opacity="0.3" transform="rotate(${rotation} ${x} ${y})"/>`;
}

/**
 * Generate shell shape - simple clamshell silhouette
 */
function generateShellShape(x, y, size, rotation, random) {
  const scale = size / 200;

  // Simple clamshell with ridges (simplified)
  const path = `
    M ${x},${y - size/2}
    Q ${x + size/2},${y - size/3} ${x + size/2.5},${y + size/2.5}
    Q ${x},${y + size/3} ${x - size/2.5},${y + size/2.5}
    Q ${x - size/2},${y - size/3} ${x},${y - size/2}
    Z
  `;

  return `<path d="${path.trim()}" fill="black" opacity="0.3" transform="rotate(${rotation} ${x} ${y})"/>`;
}

/**
 * Generate organic blob shape as fallback
 */
function generateOrganicBlobShape(x, y, size, random) {
  // Irregular rounded blob using bezier curves
  const r = size / 2;
  const variation = 0.3;

  const path = `
    M ${x},${y - r * (1 + (random() - 0.5) * variation)}
    Q ${x + r * (1 + (random() - 0.5) * variation)},${y - r * 0.5} ${x + r * (1 + (random() - 0.5) * variation)},${y}
    Q ${x + r * (1 + (random() - 0.5) * variation)},${y + r * 0.5} ${x},${y + r * (1 + (random() - 0.5) * variation)}
    Q ${x - r * (1 + (random() - 0.5) * variation)},${y + r * 0.5} ${x - r * (1 + (random() - 0.5) * variation)},${y}
    Q ${x - r * (1 + (random() - 0.5) * variation)},${y - r * 0.5} ${x},${y - r * (1 + (random() - 0.5) * variation)}
    Z
  `;

  return `<path d="${path.trim()}" fill="black" opacity="0.25"/>`;
}

/**
 * Check if brief-based stencil mode is enabled
 * @returns {boolean} True if enabled
 */
export function isBriefStencilEnabled() {
  return process.env.INSPIRE_GUIDED_MODE === 'true';
}
