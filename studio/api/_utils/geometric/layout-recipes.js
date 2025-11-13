// Layout Recipe System for TPV Studio Geometric Mode
// Implements 4 layout patterns: hero_orbit, trail, cluster, striped_story

import { generateBand } from './bands.js';
import { generateBlob } from './islands.js';

/**
 * Seeded random number generator (LCG)
 * @param {number} seed - Random seed
 * @returns {function} Random function that returns 0-1
 */
function createSeededRandom(seed) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;

  return function () {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

// ============================================================================
// GEOMETRY HELPER FUNCTIONS
// ============================================================================

/**
 * Place hero motif in a named zone
 * @param {string} zone - 'centre', 'top_third', 'left_third', 'right_third', 'bottom_third'
 * @param {object} dimensions - {width_mm, height_mm}
 * @param {function} random - Seeded random function
 * @returns {object} {x, y} position in mm
 */
export function placeHero(zone, dimensions, random) {
  const { width_mm, height_mm } = dimensions;
  const jitter = 200; // Small random offset for variety

  let x, y;

  switch (zone) {
    case 'centre':
      x = width_mm / 2 + (random() - 0.5) * jitter;
      y = height_mm / 2 + (random() - 0.5) * jitter;
      break;

    case 'top_third':
      x = width_mm / 2 + (random() - 0.5) * jitter;
      y = height_mm / 3 + (random() - 0.5) * jitter;
      break;

    case 'bottom_third':
      x = width_mm / 2 + (random() - 0.5) * jitter;
      y = (height_mm * 2) / 3 + (random() - 0.5) * jitter;
      break;

    case 'left_third':
      x = width_mm / 3 + (random() - 0.5) * jitter;
      y = height_mm / 2 + (random() - 0.5) * jitter;
      break;

    case 'right_third':
      x = (width_mm * 2) / 3 + (random() - 0.5) * jitter;
      y = height_mm / 2 + (random() - 0.5) * jitter;
      break;

    default:
      x = width_mm / 2;
      y = height_mm / 2;
  }

  return { x, y };
}

/**
 * Place motifs along an arc (orbital placement)
 * @param {object} center - {x, y} center point
 * @param {number} radius - Arc radius in mm
 * @param {number} count - Number of motifs to place
 * @param {number} spreadAngle - Arc spread in degrees (e.g., 180 for half circle)
 * @param {function} random - Seeded random function
 * @returns {array} [{x, y}] positions
 */
export function placeMotifsOnArc(center, radius, count, spreadAngle, random) {
  const positions = [];
  const startAngle = (360 - spreadAngle) / 2; // Center the arc
  const angleStep = count > 1 ? spreadAngle / (count - 1) : 0;

  for (let i = 0; i < count; i++) {
    const baseAngle = startAngle + i * angleStep;
    const jitter = (random() - 0.5) * 20; // ±10° jitter
    const angle = (baseAngle + jitter) * (Math.PI / 180);

    const radiusJitter = (random() - 0.5) * 200; // ±100mm radius jitter

    positions.push({
      x: center.x + (radius + radiusJitter) * Math.cos(angle),
      y: center.y + (radius + radiusJitter) * Math.sin(angle)
    });
  }

  return positions;
}

/**
 * Place motifs along a band path
 * @param {array} bandSpine - Array of {x, y} points defining band centerline
 * @param {number} count - Number of motifs
 * @param {number} margin - Margin from band edges (mm)
 * @param {function} random - Seeded random function
 * @returns {array} [{x, y, rotation}] positions with rotation to follow path
 */
export function placeMotifsAlongBand(bandSpine, count, margin, random) {
  const positions = [];
  const pathLength = calculatePathLength(bandSpine);

  for (let i = 0; i < count; i++) {
    // Evenly space along path with jitter
    const baseT = i / (count - 1);
    const jitter = (random() - 0.5) * 0.1; // ±5% position jitter
    const t = Math.max(0, Math.min(1, baseT + jitter));

    const point = interpolateAlongPath(bandSpine, t);

    // Calculate tangent for rotation
    const tangent = calculateTangent(bandSpine, t);
    const rotation = Math.atan2(tangent.y, tangent.x) * (180 / Math.PI);

    // Offset perpendicular to path
    const offsetDistance = (random() - 0.5) * margin;
    const perpX = -tangent.y;
    const perpY = tangent.x;

    positions.push({
      x: point.x + perpX * offsetDistance,
      y: point.y + perpY * offsetDistance,
      rotation
    });
  }

  return positions;
}

/**
 * Place motif randomly within a rectangular bounds
 * @param {object} bounds - {xMin, xMax, yMin, yMax} in mm
 * @param {number} padding - Padding from edges (mm)
 * @param {function} random - Seeded random function
 * @returns {object} {x, y} position
 */
export function randomWithinRect(bounds, padding, random) {
  const { xMin, xMax, yMin, yMax } = bounds;

  return {
    x: xMin + padding + random() * (xMax - xMin - 2 * padding),
    y: yMin + padding + random() * (yMax - yMin - 2 * padding)
  };
}

/**
 * Enforce minimum spacing between motif placements
 * Removes placements that violate spacing constraint
 * @param {array} placements - Array of {x, y, ...} placements
 * @param {number} minDistance - Minimum center-to-center distance (mm)
 * @returns {array} Filtered placements
 */
export function enforceMinSpacing(placements, minDistance) {
  const valid = [];

  for (const placement of placements) {
    let tooClose = false;

    for (const existing of valid) {
      const dx = placement.x - existing.x;
      const dy = placement.y - existing.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      valid.push(placement);
    }
  }

  if (valid.length < placements.length) {
    console.log(`[LAYOUT] Enforced spacing: ${placements.length} → ${valid.length} placements`);
  }

  return valid;
}

// ============================================================================
// PATH INTERPOLATION HELPERS
// ============================================================================

function calculatePathLength(points) {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
}

function interpolateAlongPath(points, t) {
  const targetLength = t * calculatePathLength(points);
  let accumulatedLength = 0;

  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    if (accumulatedLength + segmentLength >= targetLength) {
      const localT = (targetLength - accumulatedLength) / segmentLength;
      return {
        x: points[i - 1].x + dx * localT,
        y: points[i - 1].y + dy * localT
      };
    }

    accumulatedLength += segmentLength;
  }

  return points[points.length - 1];
}

function calculateTangent(points, t) {
  const targetLength = t * calculatePathLength(points);
  let accumulatedLength = 0;

  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    if (accumulatedLength + segmentLength >= targetLength) {
      // Normalize tangent
      return {
        x: dx / segmentLength,
        y: dy / segmentLength
      };
    }

    accumulatedLength += segmentLength;
  }

  // Last segment tangent
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const dx = last.x - prev.x;
  const dy = last.y - prev.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  return { x: dx / len, y: dy / len };
}

// ============================================================================
// LAYOUT RECIPE IMPLEMENTATIONS
// ============================================================================

/**
 * Hero Orbit Recipe
 * One large hero motif with support motifs orbiting around it
 * @param {object} canvas - {width_mm, height_mm}
 * @param {object} motifPlan - {hero, support, accent}
 * @param {array} palette - Color palette
 * @param {number} seed - Random seed
 * @returns {object} {bands, islands, motifPlacements}
 */
export function generateHeroOrbit(canvas, motifPlan, palette, seed) {
  console.log('[RECIPE:HERO_ORBIT] Generating hero orbit layout');

  const random = createSeededRandom(seed);
  const { width_mm, height_mm } = canvas;
  const minDim = Math.min(width_mm, height_mm);

  const layers = {
    bands: [],
    islands: [],
    motifPlacements: []
  };

  // 1. Background bands (2-3 diagonal bands for visual interest)
  const bandCount = 2 + Math.floor(random() * 2); // 2 or 3
  for (let i = 0; i < bandCount; i++) {
    const direction = random() < 0.5 ? 'diagonal' : 'horizontal';
    const width = 800 + random() * 700; // 800-1500mm
    const curvature = 0.2 + random() * 0.3; // Gentle curves

    layers.bands.push({
      path: generateBand(canvas, {
        width,
        direction,
        curvature,
        seed: seed + i * 100
      }),
      width,
      direction
    });
  }

  // 2. Hero placement (centre or centre-top depending on aspect ratio)
  const heroZone = height_mm > width_mm ? 'top_third' : 'centre';
  const heroPos = placeHero(heroZone, canvas, random);

  if (motifPlan.hero) {
    const heroSize = motifPlan.hero.size_mm[0] + random() * (motifPlan.hero.size_mm[1] - motifPlan.hero.size_mm[0]);

    layers.motifPlacements.push({
      role: 'hero',
      motif: motifPlan.hero.name,
      x: heroPos.x,
      y: heroPos.y,
      size_mm: heroSize,
      rotation: (random() - 0.5) * 30 // Slight rotation variety
    });
  }

  // 3. Support motifs on arcs around hero
  let arcRadius = minDim * 0.25 + random() * (minDim * 0.15); // 25-40% of canvas

  for (const supportSpec of motifPlan.support || []) {
    const spreadAngle = 90 + random() * 90; // 90-180° spread
    const arcPositions = placeMotifsOnArc(
      heroPos,
      arcRadius,
      supportSpec.count,
      spreadAngle,
      random
    );

    for (const pos of arcPositions) {
      const size = supportSpec.size_mm[0] + random() * (supportSpec.size_mm[1] - supportSpec.size_mm[0]);

      layers.motifPlacements.push({
        role: 'support',
        motif: supportSpec.name,
        x: pos.x,
        y: pos.y,
        size_mm: size,
        rotation: random() * 360
      });
    }

    arcRadius += 400; // Next arc is further out
  }

  // 4. Accent motifs on outer arcs (sparse)
  for (const accentSpec of motifPlan.accent || []) {
    const outerRadius = arcRadius + 300;
    const accentPositions = placeMotifsOnArc(
      heroPos,
      outerRadius,
      accentSpec.count,
      270, // Wider spread
      random
    );

    for (const pos of accentPositions) {
      const size = accentSpec.size_mm[0] + random() * (accentSpec.size_mm[1] - accentSpec.size_mm[0]);

      layers.motifPlacements.push({
        role: 'accent',
        motif: accentSpec.name,
        x: pos.x,
        y: pos.y,
        size_mm: size,
        rotation: random() * 360
      });
    }
  }

  // Enforce minimum spacing
  layers.motifPlacements = enforceMinSpacing(layers.motifPlacements, 300);

  console.log(`[RECIPE:HERO_ORBIT] Generated ${layers.motifPlacements.length} motif placements`);
  return layers;
}

/**
 * Trail Recipe
 * Motifs follow a flowing path across the canvas
 * @param {object} canvas - {width_mm, height_mm}
 * @param {object} motifPlan - {hero, support, accent}
 * @param {array} palette - Color palette
 * @param {number} seed - Random seed
 * @returns {object} {bands, islands, motifPlacements}
 */
export function generateTrail(canvas, motifPlan, palette, seed) {
  console.log('[RECIPE:TRAIL] Generating trail layout');

  const random = createSeededRandom(seed);
  const { width_mm, height_mm } = canvas;

  const layers = {
    bands: [],
    islands: [],
    motifPlacements: []
  };

  // 1. Main flowing band (the trail path)
  const direction = width_mm > height_mm ? 'horizontal' : 'vertical';
  const bandWidth = 800 + random() * 400; // 800-1200mm
  const curvature = 0.3 + random() * 0.3; // Moderate flow

  const mainBand = {
    path: generateBand(canvas, {
      width: bandWidth,
      direction,
      curvature,
      seed
    }),
    width: bandWidth,
    direction
  };
  layers.bands.push(mainBand);

  // Generate spine points for the band path (for motif placement)
  const spinePoints = generateBandSpine(canvas, direction, curvature, random);

  // 2. Hero at trail start or end
  const heroAtStart = random() < 0.5;
  const heroT = heroAtStart ? 0.1 : 0.9; // 10% or 90% along path

  if (motifPlan.hero) {
    const heroPoint = interpolateAlongPath(spinePoints, heroT);
    const heroSize = motifPlan.hero.size_mm[0] + random() * (motifPlan.hero.size_mm[1] - motifPlan.hero.size_mm[0]);

    layers.motifPlacements.push({
      role: 'hero',
      motif: motifPlan.hero.name,
      x: heroPoint.x,
      y: heroPoint.y,
      size_mm: heroSize,
      rotation: (random() - 0.5) * 40
    });
  }

  // 3. Support and accent motifs along the trail
  const totalMotifsToPlace = (motifPlan.support || []).reduce((sum, s) => sum + s.count, 0) +
                             (motifPlan.accent || []).reduce((sum, a) => sum + a.count, 0);

  const allMotifSpecs = [
    ...(motifPlan.support || []).map(s => ({ ...s, role: 'support' })),
    ...(motifPlan.accent || []).map(a => ({ ...a, role: 'accent' }))
  ];

  // Place along path
  for (const spec of allMotifSpecs) {
    const positions = placeMotifsAlongBand(spinePoints, spec.count, 200, random);

    for (const pos of positions) {
      const size = spec.size_mm[0] + random() * (spec.size_mm[1] - spec.size_mm[0]);

      layers.motifPlacements.push({
        role: spec.role,
        motif: spec.name,
        x: pos.x,
        y: pos.y,
        size_mm: size,
        rotation: pos.rotation + (random() - 0.5) * 40 // Follow path + variation
      });
    }
  }

  // 4. Secondary background band for visual interest
  if (random() < 0.7) {
    const secondaryDirection = direction === 'horizontal' ? 'vertical' : 'horizontal';
    const secondaryWidth = 600 + random() * 300;
    layers.bands.push({
      path: generateBand(canvas, {
        width: secondaryWidth,
        direction: secondaryDirection,
        curvature: 0.2,
        seed: seed + 500
      }),
      width: secondaryWidth,
      direction: secondaryDirection
    });
  }

  layers.motifPlacements = enforceMinSpacing(layers.motifPlacements, 350);

  console.log(`[RECIPE:TRAIL] Generated ${layers.motifPlacements.length} motif placements`);
  return layers;
}

/**
 * Cluster Recipe
 * Dense motif cluster in one area, calm elsewhere
 * @param {object} canvas - {width_mm, height_mm}
 * @param {object} motifPlan - {hero, support, accent}
 * @param {array} palette - Color palette
 * @param {number} seed - Random seed
 * @returns {object} {bands, islands, motifPlacements}
 */
export function generateCluster(canvas, motifPlan, palette, seed) {
  console.log('[RECIPE:CLUSTER] Generating cluster layout');

  const random = createSeededRandom(seed);
  const { width_mm, height_mm } = canvas;

  const layers = {
    bands: [],
    islands: [],
    motifPlacements: []
  };

  // 1. Define cluster zone (center-left or center-right 50% of canvas)
  const clusterLeft = random() < 0.5;
  const clusterBounds = clusterLeft
    ? { xMin: 0, xMax: width_mm * 0.6, yMin: height_mm * 0.2, yMax: height_mm * 0.8 }
    : { xMin: width_mm * 0.4, xMax: width_mm, yMin: height_mm * 0.2, yMax: height_mm * 0.8 };

  // 2. Large island/blob to define cluster zone visually
  const centerX = (clusterBounds.xMin + clusterBounds.xMax) / 2;
  const centerY = (clusterBounds.yMin + clusterBounds.yMax) / 2;
  const blobRadius = 800 + random() * 700;

  const clusterBlobPath = generateBlob(centerX, centerY, blobRadius, seed);
  layers.islands.push({
    path: clusterBlobPath,
    x: centerX,
    y: centerY,
    radius: blobRadius
  });

  // 3. Hero in cluster zone
  if (motifPlan.hero) {
    const heroPos = randomWithinRect(clusterBounds, 400, random);
    const heroSize = motifPlan.hero.size_mm[0] + random() * (motifPlan.hero.size_mm[1] - motifPlan.hero.size_mm[0]);

    layers.motifPlacements.push({
      role: 'hero',
      motif: motifPlan.hero.name,
      x: heroPos.x,
      y: heroPos.y,
      size_mm: heroSize,
      rotation: random() * 360
    });
  }

  // 4. Most support motifs in cluster zone (densely packed)
  for (const supportSpec of motifPlan.support || []) {
    const inClusterCount = Math.ceil(supportSpec.count * 0.8); // 80% in cluster

    for (let i = 0; i < inClusterCount; i++) {
      const pos = randomWithinRect(clusterBounds, 200, random);
      const size = supportSpec.size_mm[0] + random() * (supportSpec.size_mm[1] - supportSpec.size_mm[0]);

      layers.motifPlacements.push({
        role: 'support',
        motif: supportSpec.name,
        x: pos.x,
        y: pos.y,
        size_mm: size,
        rotation: random() * 360
      });
    }
  }

  // 5. Few motifs outside cluster (sparse)
  const outsideBounds = clusterLeft
    ? { xMin: width_mm * 0.6, xMax: width_mm, yMin: 0, yMax: height_mm }
    : { xMin: 0, xMax: width_mm * 0.4, yMin: 0, yMax: height_mm };

  for (const supportSpec of motifPlan.support || []) {
    const outsideCount = Math.floor(supportSpec.count * 0.2); // 20% outside

    for (let i = 0; i < outsideCount; i++) {
      const pos = randomWithinRect(outsideBounds, 300, random);
      const size = supportSpec.size_mm[0] + random() * (supportSpec.size_mm[1] - supportSpec.size_mm[0]);

      layers.motifPlacements.push({
        role: 'support',
        motif: supportSpec.name,
        x: pos.x,
        y: pos.y,
        size_mm: size,
        rotation: random() * 360
      });
    }
  }

  // 6. Background bands around cluster
  const bandWidth = 700 + random() * 400;
  layers.bands.push({
    path: generateBand(canvas, {
      width: bandWidth,
      direction: 'horizontal',
      curvature: 0.25,
      seed: seed + 100
    }),
    width: bandWidth,
    direction: 'horizontal'
  });

  layers.motifPlacements = enforceMinSpacing(layers.motifPlacements, 250); // Tighter spacing for cluster

  console.log(`[RECIPE:CLUSTER] Generated ${layers.motifPlacements.length} motif placements`);
  return layers;
}

/**
 * Striped Story Recipe
 * 2-3 horizontal/vertical bands with motifs distributed across them
 * @param {object} canvas - {width_mm, height_mm}
 * @param {object} motifPlan - {hero, support, accent}
 * @param {array} palette - Color palette
 * @param {number} seed - Random seed
 * @returns {object} {bands, islands, motifPlacements}
 */
export function generateStripedStory(canvas, motifPlan, palette, seed) {
  console.log('[RECIPE:STRIPED_STORY] Generating striped story layout');

  const random = createSeededRandom(seed);
  const { width_mm, height_mm } = canvas;

  const layers = {
    bands: [],
    islands: [],
    motifPlacements: []
  };

  // 1. Divide canvas into 2-3 broad stripes
  const stripeCount = 2 + Math.floor(random() * 2); // 2 or 3
  const direction = width_mm > height_mm ? 'vertical' : 'horizontal';
  const isVertical = direction === 'vertical';

  const stripes = [];
  const stripeSize = (isVertical ? width_mm : height_mm) / stripeCount;

  for (let i = 0; i < stripeCount; i++) {
    const bounds = isVertical
      ? { xMin: i * stripeSize, xMax: (i + 1) * stripeSize, yMin: 0, yMax: height_mm }
      : { xMin: 0, xMax: width_mm, yMin: i * stripeSize, yMax: (i + 1) * stripeSize };

    stripes.push({
      index: i,
      bounds,
      role: i === Math.floor(stripeCount / 2) ? 'middle' : i === 0 ? 'top' : 'bottom'
    });

    // Generate band for each stripe
    const bandWidth = stripeSize * 0.8; // Slightly smaller than stripe
    const curvature = 0.15 + random() * 0.15; // Gentle curves

    layers.bands.push({
      path: generateBand(canvas, {
        width: bandWidth,
        direction,
        curvature,
        seed: seed + i * 200
      }),
      width: bandWidth,
      direction
    });
  }

  // 2. Hero goes in middle stripe
  const middleStripe = stripes.find(s => s.role === 'middle') || stripes[Math.floor(stripes.length / 2)];

  if (motifPlan.hero) {
    const heroPos = randomWithinRect(middleStripe.bounds, 300, random);
    const heroSize = motifPlan.hero.size_mm[0] + random() * (motifPlan.hero.size_mm[1] - motifPlan.hero.size_mm[0]);

    layers.motifPlacements.push({
      role: 'hero',
      motif: motifPlan.hero.name,
      x: heroPos.x,
      y: heroPos.y,
      size_mm: heroSize,
      rotation: (random() - 0.5) * 30
    });
  }

  // 3. Distribute support motifs across stripes
  for (const supportSpec of motifPlan.support || []) {
    const motifsPerStripe = Math.ceil(supportSpec.count / stripes.length);

    for (const stripe of stripes) {
      const count = Math.min(motifsPerStripe, supportSpec.count - layers.motifPlacements.filter(p => p.role === 'support' && p.motif === supportSpec.name).length);

      for (let i = 0; i < count; i++) {
        const pos = randomWithinRect(stripe.bounds, 200, random);
        const size = supportSpec.size_mm[0] + random() * (supportSpec.size_mm[1] - supportSpec.size_mm[0]);

        layers.motifPlacements.push({
          role: 'support',
          motif: supportSpec.name,
          x: pos.x,
          y: pos.y,
          size_mm: size,
          rotation: random() * 360
        });
      }
    }
  }

  // 4. Accent motifs in top/bottom stripes
  for (const accentSpec of motifPlan.accent || []) {
    const topBottomStripes = stripes.filter(s => s.role !== 'middle');

    for (const stripe of topBottomStripes) {
      const count = Math.ceil(accentSpec.count / 2);

      for (let i = 0; i < count; i++) {
        const pos = randomWithinRect(stripe.bounds, 150, random);
        const size = accentSpec.size_mm[0] + random() * (accentSpec.size_mm[1] - accentSpec.size_mm[0]);

        layers.motifPlacements.push({
          role: 'accent',
          motif: accentSpec.name,
          x: pos.x,
          y: pos.y,
          size_mm: size,
          rotation: random() * 360
        });
      }
    }
  }

  layers.motifPlacements = enforceMinSpacing(layers.motifPlacements, 350);

  console.log(`[RECIPE:STRIPED_STORY] Generated ${layers.motifPlacements.length} motif placements`);
  return layers;
}

// ============================================================================
// RECIPE SELECTION LOGIC
// ============================================================================

/**
 * Choose appropriate recipe based on composition type, theme, and mood
 * @param {string} composition - 'bands' | 'islands' | 'motifs' | 'mixed'
 * @param {string|string[]} themes - Theme name(s)
 * @param {string} mood - Mood name
 * @returns {string} Recipe name
 */
export function chooseRecipe(composition, themes, mood) {
  const primaryTheme = Array.isArray(themes) ? themes[0] : themes;

  // Direct composition mappings
  if (composition === 'motifs') {
    return 'hero_orbit'; // Icon-focused → orbital layout
  }

  if (composition === 'bands') {
    return 'striped_story'; // Band-focused → striped layout
  }

  if (composition === 'islands') {
    return 'cluster'; // Blob-focused → cluster layout
  }

  // Mixed composition: use heuristics based on theme and mood
  if (composition === 'mixed') {
    // Journey/movement themes → trail
    if (['transport', 'space'].includes(primaryTheme)) {
      return 'trail';
    }

    // Calm/serene moods → cluster (focused calm area)
    if (['calm', 'serene'].includes(mood)) {
      return 'cluster';
    }

    // Energetic/bold → hero orbit (dynamic radial)
    if (['energetic', 'bold'].includes(mood)) {
      return 'hero_orbit';
    }

    // Default for mixed
    return 'hero_orbit';
  }

  // Fallback
  return 'hero_orbit';
}

/**
 * Get recipe function by name
 * @param {string} recipeName - Recipe name
 * @returns {function} Recipe function
 */
export function getRecipeFunction(recipeName) {
  const recipes = {
    hero_orbit: generateHeroOrbit,
    trail: generateTrail,
    cluster: generateCluster,
    striped_story: generateStripedStory
  };

  return recipes[recipeName] || recipes.hero_orbit;
}

// ============================================================================
// HELPER: Generate band spine for trail recipe
// ============================================================================

function generateBandSpine(canvas, direction, curvature, random) {
  const { width_mm, height_mm } = canvas;
  const points = [];

  if (direction === 'horizontal') {
    const numPoints = 6;
    for (let i = 0; i < numPoints; i++) {
      const x = (width_mm / (numPoints - 1)) * i;
      const y = height_mm / 2 + (random() - 0.5) * height_mm * curvature;
      points.push({ x, y });
    }
  } else {
    const numPoints = 6;
    for (let i = 0; i < numPoints; i++) {
      const y = (height_mm / (numPoints - 1)) * i;
      const x = width_mm / 2 + (random() - 0.5) * width_mm * curvature;
      points.push({ x, y });
    }
  }

  return points;
}
