// Motif Role Classification System for TPV Studio Geometric Mode
// Assigns hero, support, and accent roles to motifs based on theme and complexity

import { MOTIF_LIBRARY, getMotifsByCategory } from './motifs-generated.js';

/**
 * Role-based motif mappings per theme
 * Hero: Large focal motifs (1-2 per design)
 * Support: Medium complementary motifs (2-8 per design)
 * Accent: Small repeating motifs (0-20 per design)
 */
export const ROLE_MAPPINGS = {
  ocean: {
    hero: ['ocean_01_whale', 'ocean_16_sea_turtle', 'ocean_03_buoy', 'ocean_07_lighthouse'],
    support: ['ocean_08_fish', 'ocean_09_penguin', 'ocean_05_plant_coral', 'ocean_20_seaweed', 'ocean_19_fishing'],
    accent: ['ocean_12_starfish', 'ocean_02_wave', 'ocean_06_pearl', 'ocean_18_iceberg']
  },
  space: {
    hero: ['rocket', 'planet', 'astronaut', 'satellite', 'ufo'],
    support: ['moon', 'comet', 'alien', 'rover'],
    accent: ['star', 'asteroid', 'sparkle']
  },
  nature: {
    hero: ['tree', 'bear', 'deer', 'owl'],
    support: ['butterfly', 'bird', 'squirrel', 'rabbit', 'mushroom'],
    accent: ['leaf', 'flower', 'acorn', 'berry']
  },
  fastfood: {
    hero: ['burger', 'pizza', 'hotdog', 'icecream'],
    support: ['fries', 'donut', 'cupcake', 'soda', 'taco'],
    accent: ['cherry', 'sprinkle', 'olive', 'pickle']
  },
  gym: {
    hero: ['weightlifter', 'treadmill', 'boxing', 'barbell'],
    support: ['dumbbell', 'kettlebell', 'mat', 'ball', 'rope'],
    accent: ['water', 'towel', 'star', 'trophy']
  },
  transport: {
    hero: ['bus', 'train', 'airplane', 'ship', 'helicopter'],
    support: ['car', 'bike', 'scooter', 'truck', 'boat'],
    accent: ['wheel', 'road', 'track', 'cloud']
  },
  landmarks: {
    hero: ['tower', 'bridge', 'statue', 'castle', 'pyramid'],
    support: ['building', 'house', 'windmill', 'lighthouse'],
    accent: ['window', 'door', 'flag', 'brick']
  },
  alphabet: {
    hero: ['a', 'b', 'c', 'z'],
    support: ['d', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'],
    accent: ['dot', 'dash', 'apostrophe', 'exclamation']
  },
  spring: {
    hero: ['tree', 'flower', 'sun', 'rainbow'],
    support: ['butterfly', 'bird', 'bee', 'tulip', 'daisy'],
    accent: ['petal', 'bud', 'seed', 'raindrop']
  },
  trees: {
    hero: ['oak', 'pine', 'maple', 'palm'],
    support: ['sapling', 'bush', 'branch', 'trunk'],
    accent: ['leaf', 'pine', 'acorn', 'cone']
  }
};

/**
 * Build a motif plan based on theme and complexity level
 * @param {string|string[]} themes - Theme name(s) from brief parser
 * @param {string} complexity - 'simple' | 'medium' | 'complex'
 * @returns {object} Motif plan with hero, support, and accent roles
 */
export function buildMotifPlan(themes, complexity = 'medium') {
  // Handle multiple themes - use first as primary
  const primaryTheme = Array.isArray(themes) ? themes[0] : themes;
  const secondaryTheme = Array.isArray(themes) && themes.length > 1 ? themes[1] : null;

  console.log(`[MOTIF-ROLES] Building motif plan for theme: ${primaryTheme}, complexity: ${complexity}`);

  const roleMapping = ROLE_MAPPINGS[primaryTheme];
  if (!roleMapping) {
    console.warn(`[MOTIF-ROLES] Unknown theme "${primaryTheme}", using fallback`);
    return buildFallbackMotifPlan(complexity);
  }

  const plan = { hero: null, support: [], accent: [] };

  switch (complexity) {
    case 'simple':
      // Just one hero motif, very clean
      plan.hero = {
        name: selectMotif(roleMapping.hero, primaryTheme, 'hero'),
        count: 1,
        size_mm: [18000, 22000] // Scaled 15x for viewBox/nominalSize
      };
      break;

    case 'medium':
      // Hero + support motifs
      plan.hero = {
        name: selectMotif(roleMapping.hero, primaryTheme, 'hero'),
        count: 1,
        size_mm: [15000, 21000] // Scaled 15x
      };

      // 3-4 support motifs
      const supportCount = 3 + Math.floor(Math.random() * 2); // 3 or 4
      plan.support.push({
        name: selectMotif(roleMapping.support, primaryTheme, 'support'),
        count: supportCount,
        size_mm: [9000, 13500] // Scaled 15x
      });

      // Optional second support type from secondary theme
      if (secondaryTheme && ROLE_MAPPINGS[secondaryTheme]) {
        plan.support.push({
          name: selectMotif(ROLE_MAPPINGS[secondaryTheme].support, secondaryTheme, 'support'),
          count: 2,
          size_mm: [9000, 13500] // Scaled 15x
        });
      }
      break;

    case 'complex':
      // Hero + multiple support types + accent motifs
      plan.hero = {
        name: selectMotif(roleMapping.hero, primaryTheme, 'hero'),
        count: 1,
        size_mm: [15000, 22500] // Scaled 15x
      };

      // Multiple support motif types
      plan.support.push({
        name: selectMotif(roleMapping.support, primaryTheme, 'support', 0),
        count: 4,
        size_mm: [9000, 13500] // Scaled 15x
      });

      plan.support.push({
        name: selectMotif(roleMapping.support, primaryTheme, 'support', 1),
        count: 2,
        size_mm: [7500, 12000] // Scaled 15x
      });

      // Accent motifs for visual interest
      if (roleMapping.accent && roleMapping.accent.length > 0) {
        plan.accent.push({
          name: selectMotif(roleMapping.accent, primaryTheme, 'accent'),
          count: 6,
          size_mm: [4500, 7500] // Scaled 15x
        });
      }
      break;

    default:
      console.warn(`[MOTIF-ROLES] Unknown complexity "${complexity}", using medium`);
      return buildMotifPlan(themes, 'medium');
  }

  console.log(`[MOTIF-ROLES] Motif plan:`, {
    hero: plan.hero,
    support: plan.support.length,
    accent: plan.accent.length
  });

  return plan;
}

/**
 * Select a specific motif from a role list, ensuring it exists in the library
 * @param {string[]} candidates - List of motif name candidates
 * @param {string} theme - Theme category
 * @param {string} role - Role name (for logging)
 * @param {number} index - Optional index to pick specific candidate
 * @returns {string} Selected motif name with category prefix
 */
function selectMotif(candidates, theme, role, index = null) {
  if (!candidates || candidates.length === 0) {
    console.warn(`[MOTIF-ROLES] No candidates for ${role} in theme ${theme}`);
    return getRandomMotifFromLibrary(theme);
  }

  // If index specified, try that candidate first
  if (index !== null && index < candidates.length) {
    const candidate = candidates[index];
    const motifKey = findMotifInLibrary(candidate, theme);
    if (motifKey) return motifKey;
  }

  // Try each candidate in order
  for (const candidate of candidates) {
    const motifKey = findMotifInLibrary(candidate, theme);
    if (motifKey) {
      console.log(`[MOTIF-ROLES] Selected ${role}: ${motifKey}`);
      return motifKey;
    }
  }

  // Fallback: get random motif from theme category
  console.warn(`[MOTIF-ROLES] None of the ${role} candidates found in library, using random from ${theme}`);
  return getRandomMotifFromLibrary(theme);
}

/**
 * Find a motif in the library by partial name match
 * @param {string} partialName - Partial motif name (e.g., 'whale')
 * @param {string} theme - Theme category
 * @returns {string|null} Full motif key or null if not found
 */
function findMotifInLibrary(partialName, theme) {
  const lowerPartial = partialName.toLowerCase();

  // Search in theme category
  for (const [key, motif] of Object.entries(MOTIF_LIBRARY)) {
    if (motif.category === theme &&
        (key.toLowerCase().includes(lowerPartial) ||
         motif.name.toLowerCase().includes(lowerPartial))) {
      return key;
    }
  }

  return null;
}

/**
 * Get a random motif from a theme category
 * @param {string} theme - Theme category
 * @returns {string} Motif key
 */
function getRandomMotifFromLibrary(theme) {
  const categoryMotifs = getMotifsByCategory(theme);

  if (categoryMotifs.length === 0) {
    // Ultimate fallback: any motif
    const allKeys = Object.keys(MOTIF_LIBRARY);
    const randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
    console.warn(`[MOTIF-ROLES] No motifs in category ${theme}, using random: ${randomKey}`);
    return randomKey;
  }

  const randomIndex = Math.floor(Math.random() * categoryMotifs.length);
  return categoryMotifs[randomIndex];
}

/**
 * Fallback motif plan when theme is unknown
 * @param {string} complexity - Complexity level
 * @returns {object} Generic motif plan
 */
function buildFallbackMotifPlan(complexity) {
  console.log('[MOTIF-ROLES] Building fallback motif plan');

  const allKeys = Object.keys(MOTIF_LIBRARY);
  const randomMotif = () => allKeys[Math.floor(Math.random() * allKeys.length)];

  const plan = { hero: null, support: [], accent: [] };

  switch (complexity) {
    case 'simple':
      plan.hero = { name: randomMotif(), count: 1, size_mm: [1200, 1500] };
      break;
    case 'medium':
      plan.hero = { name: randomMotif(), count: 1, size_mm: [1000, 1400] };
      plan.support.push({ name: randomMotif(), count: 4, size_mm: [600, 900] });
      break;
    case 'complex':
      plan.hero = { name: randomMotif(), count: 1, size_mm: [1000, 1500] };
      plan.support.push({ name: randomMotif(), count: 4, size_mm: [600, 900] });
      plan.support.push({ name: randomMotif(), count: 2, size_mm: [500, 800] });
      plan.accent.push({ name: randomMotif(), count: 6, size_mm: [300, 500] });
      break;
  }

  return plan;
}

/**
 * Validate and normalize a motif plan
 * Ensures all motif names exist in library and size ranges are valid
 * @param {object} motifPlan - Motif plan to validate
 * @returns {object} Validated motif plan
 */
export function validateMotifPlan(motifPlan) {
  const validated = { hero: null, support: [], accent: [] };

  // Validate hero
  if (motifPlan.hero) {
    const heroKey = motifPlan.hero.name;
    if (MOTIF_LIBRARY[heroKey]) {
      validated.hero = {
        ...motifPlan.hero,
        size_mm: clampSizeRange(motifPlan.hero.size_mm, 800, 1500)
      };
    } else {
      console.warn(`[MOTIF-ROLES] Invalid hero motif: ${heroKey}, skipping`);
    }
  }

  // Validate support motifs
  for (const supportSpec of motifPlan.support || []) {
    if (MOTIF_LIBRARY[supportSpec.name]) {
      validated.support.push({
        ...supportSpec,
        size_mm: clampSizeRange(supportSpec.size_mm, 400, 900)
      });
    } else {
      console.warn(`[MOTIF-ROLES] Invalid support motif: ${supportSpec.name}, skipping`);
    }
  }

  // Validate accent motifs
  for (const accentSpec of motifPlan.accent || []) {
    if (MOTIF_LIBRARY[accentSpec.name]) {
      validated.accent.push({
        ...accentSpec,
        size_mm: clampSizeRange(accentSpec.size_mm, 200, 500)
      });
    } else {
      console.warn(`[MOTIF-ROLES] Invalid accent motif: ${accentSpec.name}, skipping`);
    }
  }

  return validated;
}

/**
 * Clamp a size range to manufacturing constraints
 * @param {number[]} range - [min, max] in mm
 * @param {number} absMin - Absolute minimum
 * @param {number} absMax - Absolute maximum
 * @returns {number[]} Clamped range
 */
function clampSizeRange(range, absMin, absMax) {
  const [min, max] = range;
  return [
    Math.max(absMin, Math.min(max, min)),
    Math.min(absMax, Math.max(min, max))
  ];
}
