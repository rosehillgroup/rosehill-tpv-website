/**
 * Derive Current Colors Utility
 * Calculates the current colors and coverage from the edited SVG
 * Combines original recipes with edits from regionOverrides
 */

import { analyzeSvgCoverageFromUrl, normalizeHex, groupSimilarColors } from './svgCoverageAnalyzer.js';

// TPV color lookup for matching hex to TPV info
const tpvColors = [
  { code: 'RH01', name: 'Standard Red', hex: '#A5362F' },
  { code: 'RH02', name: 'Bright Red', hex: '#E21F2F' },
  { code: 'RH10', name: 'Standard Green', hex: '#609B63' },
  { code: 'RH11', name: 'Bright Green', hex: '#3BB44A' },
  { code: 'RH12', name: 'Dark Green', hex: '#006C55' },
  { code: 'RH20', name: 'Standard Blue', hex: '#0075BC' },
  { code: 'RH21', name: 'Purple', hex: '#493D8C' },
  { code: 'RH22', name: 'Light Blue', hex: '#47AFE3' },
  { code: 'RH23', name: 'Azure', hex: '#039DC4' },
  { code: 'RH26', name: 'Turquoise', hex: '#00A6A3' },
  { code: 'RH30', name: 'Standard Beige', hex: '#E4C4AA' },
  { code: 'RH31', name: 'Cream', hex: '#E8E3D8' },
  { code: 'RH32', name: 'Brown', hex: '#8B5F3C' },
  { code: 'RH90', name: 'Funky Pink', hex: '#E8457E' },
  { code: 'RH40', name: 'Mustard Yellow', hex: '#E5A144' },
  { code: 'RH41', name: 'Bright Yellow', hex: '#FFD833' },
  { code: 'RH50', name: 'Orange', hex: '#F15B32' },
  { code: 'RH60', name: 'Dark Grey', hex: '#59595B' },
  { code: 'RH61', name: 'Light Grey', hex: '#939598' },
  { code: 'RH65', name: 'Pale Grey', hex: '#D9D9D6' },
  { code: 'RH70', name: 'Black', hex: '#231F20' }
];

/**
 * Find TPV color info by hex
 * @param {string} hex - Hex color to lookup
 * @returns {{code: string, name: string, hex: string}|null}
 */
function findTpvColorByHex(hex) {
  if (!hex) return null;
  const normalized = normalizeHex(hex);
  return tpvColors.find(c => normalizeHex(c.hex) === normalized) || null;
}

/**
 * Derive current colors from the edited SVG
 * Analyzes the SVG to get accurate coverage percentages for all colors
 *
 * @param {string} svgBlobUrl - Blob URL of the current (edited) SVG
 * @param {Array} originalRecipes - Original recipe array from API
 * @param {Map} regionOverrides - Map of regionId -> {hex, tpvCode?, tpvName?, ...}
 * @param {string} mode - 'solid' or 'blend'
 * @returns {Promise<Array>} Updated recipes with current coverage percentages
 */
export async function deriveCurrentColors(svgBlobUrl, originalRecipes, regionOverrides, mode = 'solid') {
  if (!svgBlobUrl || !originalRecipes) {
    return originalRecipes || [];
  }

  try {
    // Analyze the current SVG to get pixel-accurate coverage
    const rawCoverage = await analyzeSvgCoverageFromUrl(svgBlobUrl, {
      canvasSize: 600, // Higher resolution for accuracy
      ignoreWhite: true,
      ignoreTransparent: true
    });

    // Group similar colors (anti-aliasing creates slight variations)
    const coverageMap = groupSimilarColors(rawCoverage, 15);

    console.log('[deriveCurrentColors] Coverage analysis:', coverageMap);

    // Build set of colors from region overrides (the new colors added by edits)
    const addedColors = new Map(); // hex -> {tpvCode, tpvName, editType, ...}
    if (regionOverrides && regionOverrides.size > 0) {
      regionOverrides.forEach((colorData) => {
        const hex = typeof colorData === 'string' ? colorData : colorData.hex;
        const normalized = normalizeHex(hex);
        if (normalized && hex !== 'transparent' && hex !== 'none') {
          // Store the richest color data we have
          if (!addedColors.has(normalized) || colorData.tpvCode) {
            addedColors.set(normalized, {
              hex: normalized,
              tpvCode: colorData.tpvCode || null,
              tpvName: colorData.tpvName || null,
              editType: colorData.editType || 'unknown',
              blendComponents: colorData.blendComponents || null
            });
          }
        }
      });
    }

    // Create a map to track which colors are in the result
    const resultColors = new Map();

    // Start with original recipes, update their coverage
    for (const recipe of originalRecipes) {
      const blendHex = normalizeHex(recipe.blendColor?.hex || recipe.targetColor?.hex);
      if (!blendHex) continue;

      // Find coverage for this color
      let coverage = 0;
      for (const [hex, data] of coverageMap) {
        if (normalizeHex(hex) === blendHex) {
          coverage = data.coverage;
          break;
        }
      }

      // Skip colors with zero coverage (they've been completely replaced)
      if (coverage > 0.1) {
        resultColors.set(blendHex, {
          ...recipe,
          targetColor: {
            ...recipe.targetColor,
            areaPct: coverage
          }
        });
      }
    }

    // Add any new colors from edits that aren't in original recipes
    for (const [hex, colorInfo] of addedColors) {
      if (!resultColors.has(hex)) {
        // Find coverage for this new color
        let coverage = 0;
        for (const [coverageHex, data] of coverageMap) {
          if (normalizeHex(coverageHex) === hex) {
            coverage = data.coverage;
            break;
          }
        }

        if (coverage > 0.1) {
          // Build a recipe for the new color
          const tpvInfo = colorInfo.tpvCode
            ? { code: colorInfo.tpvCode, name: colorInfo.tpvName }
            : findTpvColorByHex(hex);

          resultColors.set(hex, {
            originalColor: { hex },
            targetColor: { hex, areaPct: coverage },
            blendColor: { hex },
            chosenRecipe: colorInfo.blendComponents
              ? {
                  components: colorInfo.blendComponents,
                  deltaE: 0,
                  quality: 'Custom Blend'
                }
              : {
                  components: tpvInfo
                    ? [{ code: tpvInfo.code, name: tpvInfo.name, percentage: 100, parts: 10 }]
                    : [{ code: 'CUSTOM', name: 'Custom Color', percentage: 100, parts: 10 }],
                  deltaE: 0,
                  quality: tpvInfo ? 'Pure TPV Colour' : 'Custom'
                },
            // Store TPV info for display
            tpvCode: colorInfo.tpvCode || tpvInfo?.code || null,
            tpvName: colorInfo.tpvName || tpvInfo?.name || null,
            isAddedFromEdit: true
          });
        }
      }
    }

    // Convert to array and sort by coverage descending
    const result = Array.from(resultColors.values())
      .sort((a, b) => (b.targetColor?.areaPct || 0) - (a.targetColor?.areaPct || 0));

    console.log('[deriveCurrentColors] Derived colors:', result.length, 'colors');
    return result;

  } catch (err) {
    console.error('[deriveCurrentColors] Failed to analyze coverage:', err);
    // Fall back to original recipes
    return originalRecipes;
  }
}

/**
 * Get colors added by region edits that aren't in original recipes
 * Useful for showing "new colors" section in palette
 *
 * @param {Array} originalRecipes - Original recipe array
 * @param {Map} regionOverrides - Map of regionId -> colorData
 * @returns {Array<{hex, tpvCode?, tpvName?}>} New colors from edits
 */
export function getAddedColorsFromEdits(originalRecipes, regionOverrides) {
  if (!regionOverrides || regionOverrides.size === 0) return [];

  // Get set of original colors
  const originalHexes = new Set(
    (originalRecipes || []).map(r => normalizeHex(r.blendColor?.hex || r.targetColor?.hex))
  );

  // Find colors from edits that aren't original
  const addedColors = new Map();
  regionOverrides.forEach((colorData) => {
    const hex = typeof colorData === 'string' ? colorData : colorData.hex;
    const normalized = normalizeHex(hex);

    if (normalized && !originalHexes.has(normalized) && hex !== 'transparent' && hex !== 'none') {
      if (!addedColors.has(normalized)) {
        const tpvInfo = colorData.tpvCode
          ? { code: colorData.tpvCode, name: colorData.tpvName }
          : findTpvColorByHex(hex);

        addedColors.set(normalized, {
          hex: normalized,
          tpvCode: colorData.tpvCode || tpvInfo?.code || null,
          tpvName: colorData.tpvName || tpvInfo?.name || null,
          editType: colorData.editType || 'unknown'
        });
      }
    }
  });

  return Array.from(addedColors.values());
}

/**
 * Check if any region overrides exist that modify colors
 * @param {Map} regionOverrides
 * @returns {boolean}
 */
export function hasColorEdits(regionOverrides) {
  if (!regionOverrides || regionOverrides.size === 0) return false;
  for (const colorData of regionOverrides.values()) {
    const hex = typeof colorData === 'string' ? colorData : colorData.hex;
    if (hex && hex !== 'transparent' && hex !== 'none') {
      return true;
    }
  }
  return false;
}
