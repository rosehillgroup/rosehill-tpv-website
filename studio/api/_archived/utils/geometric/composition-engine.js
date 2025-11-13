// Composition Engine for TPV Studio Geometric Mode
// Enforces visual hierarchy, flow, balance, and rhythm for coherent playground designs
// Transforms random placement into intentional, designed compositions

/**
 * Composition Archetypes
 * Each archetype defines a different visual structure and design approach
 */
export const COMPOSITION_TYPES = {
  CENTERPIECE: 'centerpiece',      // Large hero with orbital elements (hero_orbit)
  FLOW: 'flow',                    // Directional movement along paths (trail)
  CLUSTER: 'cluster',              // Dense grouping in zones (cluster)
  HORIZON: 'horizon',              // Top/bottom separation (NEW)
  STRIPED: 'striped',              // Parallel bands/stripes (striped_story)
  RADIAL: 'radial',                // Circular symmetry (NEW)
  RHYTHM: 'rhythm'                 // Grid/repetition patterns (NEW)
};

/**
 * Theme → Composition Mapping
 * Determines which composition type best suits each theme
 */
const THEME_COMPOSITION_MAP = {
  ocean: COMPOSITION_TYPES.FLOW,           // Ocean currents, flowing water
  space: COMPOSITION_TYPES.CENTERPIECE,    // Planets orbit around focal point
  nature: COMPOSITION_TYPES.CLUSTER,       // Organic clustering of plants/animals
  forest: COMPOSITION_TYPES.CLUSTER,       // Trees cluster naturally
  fastfood: COMPOSITION_TYPES.RHYTHM,      // Repetitive menu items
  gym: COMPOSITION_TYPES.STRIPED,          // Equipment arranged in rows
  transport: COMPOSITION_TYPES.FLOW,       // Vehicles follow paths
  landmarks: COMPOSITION_TYPES.CENTERPIECE, // Monument as focal point
  alphabet: COMPOSITION_TYPES.RHYTHM,      // Letters in grid
  spring: COMPOSITION_TYPES.CLUSTER,       // Flowers cluster
  trees: COMPOSITION_TYPES.CLUSTER,        // Tree groupings
  abstract: COMPOSITION_TYPES.RADIAL       // Geometric symmetry
};

/**
 * Composition Rules
 * Define design principles for each composition type
 */
const COMPOSITION_RULES = {
  [COMPOSITION_TYPES.CENTERPIECE]: {
    heroSizeRatio: [0.40, 0.60],      // Hero should be 40-60% of canvas width
    supportSizeRatio: [0.40, 0.60],   // Support 40-60% of hero size
    accentSizeRatio: [0.20, 0.30],    // Accent 20-30% of hero size
    rotationVariance: 15,              // ±15° max rotation from radial
    symmetryLevel: 'high',             // Near-symmetrical placement
    densityBalance: 'center-heavy',    // More elements near center
    maxBands: 2                        // Maximum background bands
  },

  [COMPOSITION_TYPES.FLOW]: {
    heroSizeRatio: [0.35, 0.50],      // Hero slightly smaller for flow
    supportSizeRatio: [0.50, 0.70],   // Support more prominent
    accentSizeRatio: [0.25, 0.35],    // Accent moderate
    rotationVariance: 15,              // ±15° from flow tangent
    flowAlignment: 'strict',           // Must follow curve direction
    sizeGradient: 'tapered',          // Taper toward edges
    densityBalance: 'path-following',  // Density along path
    maxBands: 3                        // Can have multiple flow bands
  },

  [COMPOSITION_TYPES.CLUSTER]: {
    heroSizeRatio: [0.40, 0.55],      // Hero prominent in cluster
    supportSizeRatio: [0.45, 0.65],   // Support fills cluster
    accentSizeRatio: [0.20, 0.35],    // Accent creates texture
    clusterCoverage: [0.50, 0.60],    // Cluster occupies 50-60% of canvas
    outsideMotifRatio: 0.20,          // 20% of motifs outside cluster
    densityGradient: 'center-to-edge', // Dense center, sparse edges
    maxBands: 2                        // Minimal background
  },

  [COMPOSITION_TYPES.HORIZON]: {
    heroSizeRatio: [0.35, 0.50],      // Hero moderate for horizon
    supportSizeRatio: [0.40, 0.60],   // Support balanced
    accentSizeRatio: [0.25, 0.40],    // Accent fills zones
    horizonPosition: [0.45, 0.55],    // Horizon at 45-55% height
    transitionZone: 0.10,             // 10% transition zone
    semanticPlacement: true,          // Place motifs by meaning
    maxBands: 3                        // Separate sky/ground/transition
  },

  [COMPOSITION_TYPES.STRIPED]: {
    heroSizeRatio: [0.35, 0.50],      // Hero proportional to stripe
    supportSizeRatio: [0.45, 0.65],   // Support distributed
    accentSizeRatio: [0.25, 0.40],    // Accent creates rhythm
    stripeCount: [2, 3],              // 2-3 stripes
    equalWidth: true,                 // Stripes must be equal
    densityPerStripe: 'balanced',     // Equal density across stripes
    rhythmPattern: 'repeating',       // Repeated motif placement
    maxBands: 3                        // Bands ARE the stripes
  },

  [COMPOSITION_TYPES.RADIAL]: {
    heroSizeRatio: [0.30, 0.45],      // Hero at center
    supportSizeRatio: [0.35, 0.55],   // Support on rings
    accentSizeRatio: [0.20, 0.35],    // Accent on outer rings
    ringCount: [3, 4],                // 3-4 concentric rings
    angularSpacing: 'even',           // 360° / motif_count
    rotationalSymmetry: 'strict',     // Perfect or near-perfect
    scaleGradient: 'inward',          // Large inner → small outer
    maxBands: 1                        // Minimal background (circular)
  },

  [COMPOSITION_TYPES.RHYTHM]: {
    heroSizeRatio: [0.30, 0.40],      // Hero part of grid
    supportSizeRatio: [0.80, 1.00],   // Support same size as hero
    accentSizeRatio: [0.50, 0.80],    // Accent creates variation
    gridSize: [3, 5],                 // 3×3 to 5×5 grid
    repetitionPattern: 'strict',      // Repeat same motif
    variationType: 'rotation_only',   // Vary only rotation/color
    randomness: 'minimal',            // High predictability
    maxBands: 1                        // Simple background
  }
};

/**
 * Get composition type based on theme, mood, and composition preference
 * @param {string[]} themes - Array of theme names
 * @param {string} mood - Mood (playful, serene, energetic, bold, calm)
 * @param {string} compositionPreference - User's composition preference
 * @returns {string} Composition type from COMPOSITION_TYPES
 */
export function getCompositionType(themes, mood, compositionPreference) {
  // Check for explicit composition preference first
  if (compositionPreference === 'bands') return COMPOSITION_TYPES.STRIPED;
  if (compositionPreference === 'islands') return COMPOSITION_TYPES.CLUSTER;
  if (compositionPreference === 'motifs') return COMPOSITION_TYPES.CENTERPIECE;

  // Use theme-based mapping
  const primaryTheme = Array.isArray(themes) && themes.length > 0 ? themes[0] : null;

  if (primaryTheme && THEME_COMPOSITION_MAP[primaryTheme]) {
    return THEME_COMPOSITION_MAP[primaryTheme];
  }

  // Fall back to mood-based selection
  if (mood === 'calm' || mood === 'serene') return COMPOSITION_TYPES.RHYTHM;
  if (mood === 'energetic') return COMPOSITION_TYPES.FLOW;
  if (mood === 'bold') return COMPOSITION_TYPES.CENTERPIECE;

  // Default
  return COMPOSITION_TYPES.CENTERPIECE;
}

/**
 * Validate visual hierarchy in layer composition
 * Ensures hero > support > accent size relationships are maintained
 * @param {array} motifPlacements - Array of {role, size_mm, x, y}
 * @param {object} canvas - {width_mm, height_mm}
 * @returns {object} {valid: boolean, issues: string[], adjustments: object[]}
 */
export function validateVisualHierarchy(motifPlacements, canvas) {
  const issues = [];
  const adjustments = [];

  // Group by role
  const byRole = {
    hero: motifPlacements.filter(m => m.role === 'hero'),
    support: motifPlacements.filter(m => m.role === 'support'),
    accent: motifPlacements.filter(m => m.role === 'accent')
  };

  // Check hero dominance
  if (byRole.hero.length > 0) {
    const avgHeroSize = byRole.hero.reduce((sum, m) => sum + m.size_mm, 0) / byRole.hero.length;

    // Hero must be larger than all support motifs
    for (const support of byRole.support) {
      if (support.size_mm >= avgHeroSize * 0.9) {
        issues.push(`Support motif too large (${support.size_mm}mm vs hero ${avgHeroSize}mm)`);
        adjustments.push({
          motif: support,
          property: 'size_mm',
          suggestedValue: avgHeroSize * 0.6
        });
      }
    }

    // Hero must be much larger than accent motifs
    for (const accent of byRole.accent) {
      if (accent.size_mm >= avgHeroSize * 0.5) {
        issues.push(`Accent motif too large (${accent.size_mm}mm vs hero ${avgHeroSize}mm)`);
        adjustments.push({
          motif: accent,
          property: 'size_mm',
          suggestedValue: avgHeroSize * 0.3
        });
      }
    }
  }

  // Check size consistency within roles
  for (const [role, motifs] of Object.entries(byRole)) {
    if (motifs.length > 1) {
      const sizes = motifs.map(m => m.size_mm);
      const minSize = Math.min(...sizes);
      const maxSize = Math.max(...sizes);
      const ratio = maxSize / minSize;

      // Flag if size variance is too high within same role
      if (ratio > 2.5) {
        issues.push(`${role} motifs have inconsistent sizes (ratio: ${ratio.toFixed(2)})`);
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    adjustments
  };
}

/**
 * Balance density across canvas to create negative space
 * @param {array} motifPlacements - Array of motif placements
 * @param {object} canvas - {width_mm, height_mm}
 * @param {string} compositionType - Type of composition
 * @returns {array} Adjusted motif placements with better density balance
 */
export function balanceDensity(motifPlacements, canvas, compositionType) {
  const rules = COMPOSITION_RULES[compositionType] || COMPOSITION_RULES[COMPOSITION_TYPES.CENTERPIECE];

  // Calculate density zones (divide canvas into quadrants)
  const quadrants = {
    topLeft: { xMin: 0, xMax: canvas.width_mm / 2, yMin: 0, yMax: canvas.height_mm / 2, count: 0 },
    topRight: { xMin: canvas.width_mm / 2, xMax: canvas.width_mm, yMin: 0, yMax: canvas.height_mm / 2, count: 0 },
    bottomLeft: { xMin: 0, xMax: canvas.width_mm / 2, yMin: canvas.height_mm / 2, yMax: canvas.height_mm, count: 0 },
    bottomRight: { xMin: canvas.width_mm / 2, xMax: canvas.width_mm, yMin: canvas.height_mm / 2, yMax: canvas.height_mm, count: 0 }
  };

  // Count motifs in each quadrant
  for (const motif of motifPlacements) {
    for (const quad of Object.values(quadrants)) {
      if (motif.x >= quad.xMin && motif.x < quad.xMax &&
          motif.y >= quad.yMin && motif.y < quad.yMax) {
        quad.count++;
      }
    }
  }

  // For non-cluster compositions, aim for balanced distribution
  if (rules.densityBalance !== 'center-heavy' && rules.densityBalance !== 'path-following') {
    const avgCount = motifPlacements.length / 4;
    const tolerance = avgCount * 0.5; // 50% tolerance

    for (const [name, quad] of Object.entries(quadrants)) {
      if (Math.abs(quad.count - avgCount) > tolerance) {
        console.log(`[COMPOSITION] Density imbalance in ${name}: ${quad.count} vs avg ${avgCount.toFixed(1)}`);
      }
    }
  }

  // Note: Actual repositioning would require complex collision detection
  // For now, this function analyzes and logs density issues
  // Full implementation would adjust positions to balance quadrants

  return motifPlacements;
}

/**
 * Establish visual flow for directional compositions
 * Adjusts rotations to follow composition direction
 * @param {array} motifPlacements - Array of motif placements
 * @param {string} compositionType - Type of composition
 * @param {object} canvas - {width_mm, height_mm}
 * @returns {array} Adjusted motif placements with aligned rotations
 */
export function establishFlow(motifPlacements, compositionType, canvas) {
  const rules = COMPOSITION_RULES[compositionType];

  if (!rules || rules.flowAlignment !== 'strict') {
    return motifPlacements; // No flow adjustment needed
  }

  // For FLOW compositions, align rotations to movement direction
  const centerX = canvas.width_mm / 2;
  const centerY = canvas.height_mm / 2;

  return motifPlacements.map(motif => {
    // Calculate angle from center to motif
    const dx = motif.x - centerX;
    const dy = motif.y - centerY;
    const angleToCenter = Math.atan2(dy, dx) * (180 / Math.PI);

    // Apply flow direction with limited variance
    const flowAngle = angleToCenter + 90; // Perpendicular to radial
    const variance = (Math.random() - 0.5) * 2 * rules.rotationVariance;

    return {
      ...motif,
      rotation: flowAngle + variance
    };
  });
}

/**
 * Enforce color hierarchy (60% main, 20% secondary, 10% accent, 10% motifs)
 * @param {object} layers - {bands, islands, motifPlacements}
 * @param {array} palette - Color palette
 * @returns {object} Layers with adjusted color assignments
 */
export function enforceColorHierarchy(layers, palette) {
  if (palette.length < 3) {
    console.warn('[COMPOSITION] Palette too small for color hierarchy');
    return layers;
  }

  // Define color roles
  const colorRoles = {
    main: palette.slice(0, 2),          // First 2 colors: 60-70% coverage
    secondary: palette.slice(2, 4),     // Next 2 colors: 20-30% coverage
    accent: palette.slice(4)            // Remaining: 5-10% coverage
  };

  // Assign background colors (bands/islands) to main colors
  const updatedBands = layers.bands.map((band, i) => ({
    ...band,
    color: colorRoles.main[i % colorRoles.main.length]
  }));

  const updatedIslands = layers.islands.map((island, i) => ({
    ...island,
    color: colorRoles.secondary[i % colorRoles.secondary.length]
  }));

  // Assign motif colors based on role
  const updatedMotifs = layers.motifPlacements.map(motif => {
    if (motif.role === 'hero') {
      // Hero always gets accent color for emphasis
      return { ...motif, color: colorRoles.accent[0] || palette[palette.length - 1] };
    } else if (motif.role === 'support') {
      // Support gets secondary colors
      return { ...motif, color: colorRoles.secondary[0] || palette[2] };
    } else {
      // Accent motifs get accent colors
      return { ...motif, color: colorRoles.accent[1] || colorRoles.accent[0] || palette[palette.length - 1] };
    }
  });

  return {
    ...layers,
    bands: updatedBands,
    islands: updatedIslands,
    motifPlacements: updatedMotifs
  };
}

/**
 * Check shape coherence (bands, islands, motifs)
 * Ensures geometric consistency
 * @param {object} layers - {bands, islands, motifPlacements}
 * @returns {object} {valid: boolean, warnings: string[]}
 */
export function checkShapeCoherence(layers) {
  const warnings = [];

  // Check band count
  if (layers.bands.length > 3) {
    warnings.push(`Too many bands (${layers.bands.length}), recommend max 3 for clarity`);
  }

  // Check island count
  if (layers.islands.length > 6) {
    warnings.push(`Too many islands (${layers.islands.length}), recommend max 6 to avoid clutter`);
  }

  // Check motif spacing
  for (let i = 0; i < layers.motifPlacements.length; i++) {
    for (let j = i + 1; j < layers.motifPlacements.length; j++) {
      const m1 = layers.motifPlacements[i];
      const m2 = layers.motifPlacements[j];

      const dx = m2.x - m1.x;
      const dy = m2.y - m1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const minSpacing = (m1.size_mm + m2.size_mm) / 2;

      if (distance < minSpacing * 1.2) {
        warnings.push(`Motifs ${i} and ${j} may be too close (${distance.toFixed(0)}mm vs ${minSpacing.toFixed(0)}mm recommended)`);
      }
    }
  }

  return {
    valid: warnings.length === 0,
    warnings
  };
}

/**
 * Main integration function: Apply composition rules to recipe output
 * @param {object} options - Configuration object
 * @param {object} options.layers - Recipe output {bands, islands, motifPlacements}
 * @param {object} options.canvas - {width_mm, height_mm}
 * @param {object} options.motifPlan - {hero, support, accent}
 * @param {array} options.palette - Color palette
 * @param {string} options.compositionType - Composition type
 * @param {string[]} options.designPrinciples - Principles to apply ['hierarchy', 'flow', 'balance', 'rhythm']
 * @returns {object} Enhanced layers with composition rules applied
 */
export function applyCompositionRules(options) {
  const {
    layers,
    canvas,
    motifPlan,
    palette,
    compositionType,
    designPrinciples = ['hierarchy', 'flow', 'balance', 'rhythm']
  } = options;

  console.log(`[COMPOSITION] Applying rules for ${compositionType}:`, designPrinciples.join(', '));

  let enhancedLayers = { ...layers };

  // Apply visual hierarchy validation
  if (designPrinciples.includes('hierarchy')) {
    const hierarchyCheck = validateVisualHierarchy(layers.motifPlacements, canvas);
    if (!hierarchyCheck.valid) {
      console.warn('[COMPOSITION] Hierarchy issues:', hierarchyCheck.issues);

      // Apply suggested adjustments
      for (const adjustment of hierarchyCheck.adjustments) {
        const motifIndex = enhancedLayers.motifPlacements.indexOf(adjustment.motif);
        if (motifIndex >= 0) {
          enhancedLayers.motifPlacements[motifIndex][adjustment.property] = adjustment.suggestedValue;
        }
      }
    }
  }

  // Establish visual flow
  if (designPrinciples.includes('flow')) {
    enhancedLayers.motifPlacements = establishFlow(
      enhancedLayers.motifPlacements,
      compositionType,
      canvas
    );
  }

  // Balance density
  if (designPrinciples.includes('balance')) {
    enhancedLayers.motifPlacements = balanceDensity(
      enhancedLayers.motifPlacements,
      canvas,
      compositionType
    );
  }

  // Check shape coherence
  const coherenceCheck = checkShapeCoherence(enhancedLayers);
  if (!coherenceCheck.valid) {
    console.warn('[COMPOSITION] Shape coherence warnings:', coherenceCheck.warnings);
  }

  // Enforce color hierarchy
  enhancedLayers = enforceColorHierarchy(enhancedLayers, palette);

  console.log('[COMPOSITION] Enhancement complete');

  return enhancedLayers;
}

/**
 * Map recipe names to composition types
 * @param {string} recipeName - Recipe name (hero_orbit, trail, cluster, striped_story)
 * @returns {string} Composition type
 */
export function recipeToCompositionType(recipeName) {
  const mapping = {
    'hero_orbit': COMPOSITION_TYPES.CENTERPIECE,
    'trail': COMPOSITION_TYPES.FLOW,
    'cluster': COMPOSITION_TYPES.CLUSTER,
    'striped_story': COMPOSITION_TYPES.STRIPED
  };

  return mapping[recipeName] || COMPOSITION_TYPES.CENTERPIECE;
}

/**
 * Get composition rules for a specific type
 * @param {string} compositionType - Composition type
 * @returns {object} Rules object or null
 */
export function getCompositionRules(compositionType) {
  return COMPOSITION_RULES[compositionType] || null;
}
