/**
 * Blend Color Calculator
 * Computes the visual appearance of a TPV blend by averaging component colors in LAB space
 */

import type { RGB, Lab } from './types';
import { sRGBToLab, labToSRGB } from './convert';

export interface BlendComponent {
  code: string;
  pct: number;  // Weight as percentage (0-1)
}

export interface TPVColor {
  code: string;
  name: string;
  hex: string;
  R: number;
  G: number;
  B: number;
  L: number;
  a: number;
  b: number;
}

export interface BlendColorResult {
  hex: string;
  rgb: RGB;
  lab: Lab;
}

/**
 * Calculate the visual blend color from recipe components
 * Uses weighted average in LAB color space for perceptually accurate results
 *
 * @param components - Array of blend components with TPV codes and weights
 * @param tpvColors - Array of all available TPV granule colors
 * @returns The computed blend color as hex, RGB, and LAB
 */
export function calculateBlendColor(
  components: BlendComponent[],
  tpvColors: TPVColor[]
): BlendColorResult {
  if (components.length === 0) {
    throw new Error('Cannot calculate blend color: no components provided');
  }

  // Normalize weights to ensure they sum to 1
  const totalWeight = components.reduce((sum, c) => sum + c.pct, 0);
  if (totalWeight === 0) {
    throw new Error('Cannot calculate blend color: total weight is zero');
  }

  const normalizedComponents = components.map(c => ({
    code: c.code,
    pct: c.pct / totalWeight
  }));

  // Perform weighted average in LAB space
  let weightedL = 0;
  let weightedA = 0;
  let weightedB = 0;

  for (const component of normalizedComponents) {
    // Find the TPV color for this component
    const tpvColor = tpvColors.find(tc => tc.code === component.code);

    if (!tpvColor) {
      console.warn(`TPV color not found for code: ${component.code}, using fallback`);
      continue;
    }

    // Use pre-calculated LAB values from TPV color data
    const lab: Lab = {
      L: tpvColor.L,
      a: tpvColor.a,
      b: tpvColor.b
    };

    // Accumulate weighted LAB values
    weightedL += lab.L * component.pct;
    weightedA += lab.a * component.pct;
    weightedB += lab.b * component.pct;
  }

  // Create the averaged LAB color
  const blendLab: Lab = {
    L: weightedL,
    a: weightedA,
    b: weightedB
  };

  // Convert back to RGB
  const blendRgb = labToSRGB(blendLab);

  // Convert to hex
  const blendHex = rgbToHex(blendRgb);

  return {
    hex: blendHex,
    rgb: blendRgb,
    lab: blendLab
  };
}

/**
 * Convert RGB to hex string
 */
function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const clamped = Math.round(Math.max(0, Math.min(255, n)));
    return clamped.toString(16).padStart(2, '0');
  };

  return `#${toHex(rgb.R)}${toHex(rgb.G)}${toHex(rgb.B)}`;
}

/**
 * Validate that a blend color calculation makes sense
 * Returns warnings if the blend seems unusual
 */
export function validateBlendColor(
  blendColor: BlendColorResult,
  components: BlendComponent[]
): string[] {
  const warnings: string[] = [];

  // Check if LAB values are in reasonable ranges
  if (blendColor.lab.L < 0 || blendColor.lab.L > 100) {
    warnings.push(`Unusual lightness value: ${blendColor.lab.L.toFixed(1)}`);
  }

  if (Math.abs(blendColor.lab.a) > 128 || Math.abs(blendColor.lab.b) > 128) {
    warnings.push('Unusual color saturation detected');
  }

  // Check if RGB values are clamped (indicates out-of-gamut color)
  if (
    blendColor.rgb.R === 0 || blendColor.rgb.R === 255 ||
    blendColor.rgb.G === 0 || blendColor.rgb.G === 255 ||
    blendColor.rgb.B === 0 || blendColor.rgb.B === 255
  ) {
    // This is only a warning if multiple channels are clamped
    const clampedChannels = [
      blendColor.rgb.R === 0 || blendColor.rgb.R === 255,
      blendColor.rgb.G === 0 || blendColor.rgb.G === 255,
      blendColor.rgb.B === 0 || blendColor.rgb.B === 255
    ].filter(Boolean).length;

    if (clampedChannels >= 2) {
      warnings.push('Blend color may be outside standard RGB gamut');
    }
  }

  return warnings;
}
