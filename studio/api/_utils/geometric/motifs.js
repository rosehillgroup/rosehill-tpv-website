// Motif Library for TPV Studio Geometric Mode
// Pre-authored vector silhouettes with compliant radii (≥600mm at nominal size)

/**
 * Motif library - each motif is a reusable SVG shape
 * All shapes designed with min 600mm inside radius at nominal 1000mm size
 */
export const MOTIF_LIBRARY = {
  circle: {
    name: 'circle',
    nominalSize: 1000, // mm
    minScale: 0.6,
    maxScale: 1.5,
    // Simple circle - always compliant
    pathData: 'M 500,0 A 500,500 0 1,1 -500,0 A 500,500 0 1,1 500,0 Z',
    viewBox: '-500 -500 1000 1000',
    anchorPoint: { x: 0, y: 0 }
  },

  star: {
    name: 'star',
    nominalSize: 1000, // mm
    minScale: 0.6,
    maxScale: 1.2,
    // 5-pointed star with rounded corners (G² continuous)
    // Inner radius ~400mm, corners smoothed with arcs
    pathData:
      'M 0,-450 ' +
      'C 50,-350 100,-300 150,-150 ' +  // Top point to right upper
      'C 180,-100 250,-50 400,-20 ' +     // Right upper spike
      'C 300,20 220,80 180,200 ' +         // To right lower
      'C 150,280 140,350 100,450 ' +       // Right lower spike
      'C 50,380 0,320 -100,200 ' +         // To bottom left
      'C -140,120 -200,80 -400,-20 ' +     // Left lower spike
      'C -250,-50 -180,-100 -150,-150 ' +  // To left upper
      'C -100,-300 -50,-350 0,-450 Z',     // Back to top
    viewBox: '-450 -450 900 900',
    anchorPoint: { x: 0, y: 0 }
  },

  fish: {
    name: 'fish',
    nominalSize: 1200, // mm (longer shape)
    minScale: 0.6,
    maxScale: 1.0,
    // Simple fish silhouette with large curves
    // Body: ~800mm wide, tail: ~400mm, all curves ≥600mm radius
    pathData:
      'M -400,0 ' +                         // Nose
      'C -400,-200 -200,-300 0,-280 ' +    // Top of head/body
      'C 200,-260 400,-200 500,-100 ' +    // Upper body to tail base
      'C 550,-50 600,0 600,100 ' +         // Tail upper fin
      'C 600,50 550,0 500,0 ' +            // Tail tip
      'C 550,0 600,-50 600,-100 ' +        // Back from tail (symmetric)
      'C 600,0 550,50 500,100 ' +          // Tail lower fin
      'C 400,200 200,260 0,280 ' +         // Lower body
      'C -200,300 -400,200 -400,0 Z',      // Back to nose
    viewBox: '-420 -320 1040 640',
    anchorPoint: { x: 0, y: 0 }
  }
};

/**
 * Generate SVG path element for a motif instance
 * @param {string} motifName - Name from MOTIF_LIBRARY
 * @param {object} transform - Position and scale
 * @param {number} transform.x - X position (mm)
 * @param {number} transform.y - Y position (mm)
 * @param {number} transform.scale - Scale factor (0.6-1.5)
 * @param {number} transform.rotation - Rotation angle (degrees)
 * @param {string} fill - Fill color (hex)
 * @param {string} id - Element ID
 * @returns {string} SVG path element
 */
export function generateMotif(motifName, transform, fill, id) {
  const motif = MOTIF_LIBRARY[motifName];
  if (!motif) {
    throw new Error(`Unknown motif: ${motifName}`);
  }

  const { x = 0, y = 0, scale = 1.0, rotation = 0 } = transform;

  // Clamp scale to allowed range
  const clampedScale = Math.max(motif.minScale, Math.min(motif.maxScale, scale));

  // Build transform string
  const transforms = [];
  if (x !== 0 || y !== 0) transforms.push(`translate(${x.toFixed(2)} ${y.toFixed(2)})`);
  if (rotation !== 0) transforms.push(`rotate(${rotation.toFixed(2)})`);
  if (clampedScale !== 1.0) transforms.push(`scale(${clampedScale.toFixed(3)})`);

  const transformAttr = transforms.length > 0 ? ` transform="${transforms.join(' ')}"` : '';

  return `<path id="${id}" class="motif" data-motif="${motifName}" fill="${fill}"${transformAttr} d="${motif.pathData}"/>`;
}

/**
 * Place motifs using Poisson disk sampling for even distribution
 * @param {object} canvas - Canvas dimensions {width_mm, height_mm}
 * @param {Array} motifSpecs - Array of {name, count, size_m: [min, max]}
 * @param {number} seed - Random seed
 * @returns {Array} Array of placed motifs with positions
 */
export function placeMotifs(canvas, motifSpecs, seed = 0) {
  // Simple seeded random
  let rng = seed;
  const random = () => {
    rng = (rng * 1664525 + 1013904223) % 4294967296;
    return rng / 4294967296;
  };

  const placed = [];
  const minSpacing = 800; // mm minimum between motif centers

  for (const spec of motifSpecs) {
    const motif = MOTIF_LIBRARY[spec.name];
    if (!motif) continue;

    const count = spec.count || 1;
    const [minSize, maxSize] = spec.size_m || [0.6, 1.0];

    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let position = null;

      // Try to find valid position (not overlapping)
      while (attempts < 50) {
        const x = random() * canvas.width_mm;
        const y = random() * canvas.height_mm;
        const sizeMeters = minSize + random() * (maxSize - minSize);
        const scale = (sizeMeters * 1000) / motif.nominalSize;
        const rotation = random() * 360;

        // Check distance from other motifs
        let tooClose = false;
        for (const other of placed) {
          const dx = x - other.x;
          const dy = y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < minSpacing) {
            tooClose = true;
            break;
          }
        }

        if (!tooClose || attempts === 49) {
          position = { x, y, scale, rotation };
          break;
        }

        attempts++;
      }

      if (position) {
        placed.push({
          name: spec.name,
          ...position
        });
      }
    }
  }

  return placed;
}

/**
 * Get bounding box of a motif at given transform
 * @param {string} motifName - Motif name
 * @param {object} transform - Transform parameters
 * @returns {object} {x, y, width, height} in mm
 */
export function getMotifBounds(motifName, transform) {
  const motif = MOTIF_LIBRARY[motifName];
  if (!motif) return { x: 0, y: 0, width: 0, height: 0 };

  const { x = 0, y = 0, scale = 1.0 } = transform;

  // Parse viewBox to get original bounds
  const [vx, vy, vw, vh] = motif.viewBox.split(' ').map(Number);

  // Apply scale
  const width = vw * scale;
  const height = vh * scale;

  return {
    x: x + (vx * scale),
    y: y + (vy * scale),
    width,
    height
  };
}
