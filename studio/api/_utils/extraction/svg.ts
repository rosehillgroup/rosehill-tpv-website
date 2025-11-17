/**
 * SVG Color Extractor v3 - TPV Color Normalization
 * Parses SVG XML to extract fill and stroke colors directly from elements
 * Normalizes colors to TPV palette and collapses similar colors
 */

import type { RGB, Lab } from '../colour/types.js';
import { deltaE2000 } from '../colour/deltaE.js';

export interface SVGColor {
  rgb: RGB;
  percentage: number;
  pixels: number;
}

export interface SVGExtractionResult {
  colours: SVGColor[];
  metadata: {
    width: number | null;
    height: number | null;
    totalPixels: number;
    format: string;
  };
  warnings?: string[];
}

export interface SVGExtractorOptions {
  maxColours?: number;
  minPercentage?: number;
  tpvPalette?: TPVColor[]; // Pass TPV palette from parent to avoid nested JSON imports
}

interface TPVColor {
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

export class SVGExtractor {
  private options: Required<SVGExtractorOptions>;
  private tpvColors: TPVColor[];
  private lightestTPVColor: TPVColor;

  constructor(options: SVGExtractorOptions = {}) {
    this.options = {
      maxColours: options.maxColours ?? 12, // Updated default to 12
      minPercentage: options.minPercentage ?? 0 // Include all colors, even tiny accents
    };

    // Use provided TPV palette or empty array (will be set by extractor.ts)
    this.tpvColors = options.tpvPalette || [];

    // Find lightest color (Cream RH31, L=91.8) if palette provided
    if (this.tpvColors.length > 0) {
      this.lightestTPVColor = this.tpvColors.reduce((lightest, color) =>
        color.L > lightest.L ? color : lightest
      , this.tpvColors[0]);

      console.info(`[SVG-EXTRACTOR-V3] Initialized with ${this.tpvColors.length} TPV colors. Lightest: ${this.lightestTPVColor.name} (${this.lightestTPVColor.hex})`);
    } else {
      // Fallback cream color if no palette provided
      this.lightestTPVColor = {
        code: 'RH31',
        name: 'Cream',
        hex: '#f2e6c8',
        R: 242,
        G: 230,
        B: 200,
        L: 91.8,
        a: -1.4,
        b: 17.6
      };
      console.warn('[SVG-EXTRACTOR-V3] No TPV palette provided, using fallback cream color');
    }
  }

  /**
   * Extract colors from SVG buffer
   */
  async extract(buffer: ArrayBuffer, format: string): Promise<SVGExtractionResult> {
    const startTime = Date.now();
    const warnings: string[] = [];

    try {
      // Convert buffer to string
      const svgText = new TextDecoder('utf-8').decode(buffer);

      console.info(`[SVG] Parsing SVG (${buffer.byteLength} bytes)`);
      console.info(`[SVG] Using SVG extractor v3 with TPV color normalization and smart collapsing`);

      // Parse SVG dimensions
      const dimensions = this.parseSVGDimensions(svgText);
      const totalPixels = dimensions.width && dimensions.height
        ? dimensions.width * dimensions.height
        : 1000000; // Default if no dimensions found

      // ===== PHASE 1: Extract colors from ORIGINAL SVG =====
      // Extract first, then normalize the color map (not the entire SVG text)
      let colorCounts: Map<string, number>;
      try {
        colorCounts = this.extractColors(svgText);
        console.info(`[SVG] Extracted ${colorCounts.size} unique colors from original SVG`);
        warnings.push(`PHASE 1: Extracted ${colorCounts.size} unique colors`);
      } catch (error) {
        console.error(`[SVG] Error in extractColors:`, error);
        warnings.push(`ERROR: Color extraction failed - ${error.message}`);
        colorCounts = new Map();
      }

      // ===== PHASE 2: Normalize color map to TPV palette =====
      // Snap "too light" colors to nearest TPV colors
      try {
        colorCounts = this.normalizeColorMap(colorCounts);
        console.info(`[SVG] Normalized color map to TPV palette (${colorCounts.size} colors)`);
        warnings.push(`PHASE 2: Normalized ${colorCounts.size} colors to TPV palette`);
      } catch (error) {
        console.error(`[SVG] Error in normalizeColorMap:`, error);
        warnings.push(`WARNING: Color normalization failed - ${error.message}`);
      }

      // ===== PHASE 3: Global color collapse =====
      // Merge similar colors across entire SVG (ΔE ≤ 25 for aggressive gradient collapse)
      try {
        colorCounts = this.collapseGlobalColors(colorCounts, 25);
        warnings.push(`PHASE 3: Collapsed to ${colorCounts.size} color clusters (ΔE ≤ 25)`);
      } catch (error) {
        console.error(`[SVG] Error in collapseGlobalColors:`, error);
        warnings.push(`WARNING: Color collapse failed - ${error.message}`);
      }

      // ===== PHASE 4: Calculate percentages =====
      const totalWeight = Array.from(colorCounts.values()).reduce((sum, weight) => sum + weight, 0);
      console.info(`[SVG] Total weight: ${totalWeight}`);

      let colours: SVGColor[] = [];

      if (totalWeight > 0) {
        colours = Array.from(colorCounts.entries())
          .map(([hexColor, weight]) => {
            const rgb = this.hexToRgb(hexColor);
            const percentage = (weight / totalWeight) * 100;
            return {
              rgb,
              percentage,
              pixels: Math.round((percentage / 100) * totalPixels)
            };
          })
          .filter(color => color.percentage >= this.options.minPercentage)
          .sort((a, b) => b.percentage - a.percentage);
      }

      warnings.push(`PHASE 4: Calculated coverage for ${colours.length} colors`);

      // ===== PHASE 5: Smart background detection =====
      // Add cream background if needed (BEFORE truncation)
      try {
        colours = this.detectAndAddBackground(colours, totalPixels);
        warnings.push(`PHASE 5: Smart background detection complete`);
      } catch (error) {
        console.error(`[SVG] Error in detectAndAddBackground:`, error);
        warnings.push(`WARNING: Background detection failed - ${error.message}`);
      }

      // ===== PHASE 6: Enforce 12-color palette cap =====
      const beforeCap = colours.length;
      try {
        colours = this.enforcePaletteCap(colours, this.options.maxColours);
        if (beforeCap > colours.length) {
          warnings.push(`PHASE 6: Reduced palette from ${beforeCap} to ${colours.length} colors`);
        } else {
          warnings.push(`PHASE 6: Palette already within ${this.options.maxColours}-color limit`);
        }
      } catch (error) {
        console.error(`[SVG] Error in enforcePaletteCap:`, error);
        warnings.push(`WARNING: Palette cap enforcement failed - ${error.message}`);
        // Fallback to simple truncation
        colours = colours.slice(0, this.options.maxColours);
      }

      const elapsed = Date.now() - startTime;
      console.info(`[SVG] Extracted and normalized ${colours.length} colors in ${elapsed}ms`);

      // Add final summary
      const creamPresent = colours.some(c => {
        const hex = this.rgbToHex(c.rgb).toLowerCase();
        return hex === this.lightestTPVColor.hex.toLowerCase();
      });
      warnings.push(
        `FINAL: ${colours.length} colors in palette. ` +
        `Cream (${this.lightestTPVColor.hex}) present: ${creamPresent ? 'YES' : 'NO'}`
      );

      return {
        colours,
        metadata: {
          width: dimensions.width,
          height: dimensions.height,
          totalPixels,
          format
        },
        warnings
      };
    } catch (error) {
      throw new Error(`SVG extraction failed: ${error.message}`);
    }
  }

  /**
   * Parse SVG dimensions from viewBox or width/height attributes
   */
  private parseSVGDimensions(svgText: string): { width: number | null; height: number | null } {
    // Try viewBox first
    const viewBoxMatch = svgText.match(/viewBox=["']([^"']+)["']/i);
    if (viewBoxMatch) {
      const [, , , width, height] = viewBoxMatch[1].split(/\s+/).map(parseFloat);
      if (!isNaN(width) && !isNaN(height)) {
        return { width, height };
      }
    }

    // Try width/height attributes
    const widthMatch = svgText.match(/width=["']([^"']+)["']/i);
    const heightMatch = svgText.match(/height=["']([^"']+)["']/i);

    if (widthMatch && heightMatch) {
      const width = parseFloat(widthMatch[1]);
      const height = parseFloat(heightMatch[1]);
      if (!isNaN(width) && !isNaN(height)) {
        return { width, height };
      }
    }

    return { width: null, height: null };
  }

  /**
   * Extract all colors from SVG elements
   * Returns a map of hex colors to their area-weighted scores
   * Large elements (like background rects) get higher weight based on pixel area
   */
  private extractColors(svgText: string): Map<string, number> {
    const colorCounts = new Map<string, number>();
    const processedRects = new Set<string>(); // Track which rect colors we've already weighted

    // Parse SVG dimensions for area calculations
    const dimensions = this.parseSVGDimensions(svgText);
    const svgWidth = dimensions.width || 1000;
    const svgHeight = dimensions.height || 1000;
    const svgArea = svgWidth * svgHeight;

    console.info(`[SVG] SVG dimensions: ${svgWidth}x${svgHeight}, area: ${svgArea}`);

    // Extract rect elements with area-based weighting for backgrounds
    const rectMatches = Array.from(svgText.matchAll(/<rect[^>]*>/gi));
    console.info(`[SVG] Found ${rectMatches.length} rect elements`);

    for (const match of rectMatches) {
      const rectTag = match[0];

      // Extract fill color from attribute or style
      let fillMatch = rectTag.match(/fill=["']([^"']+)["']/i);
      let color = fillMatch ? this.normalizeColor(fillMatch[1]) : null;

      // Try style attribute if no fill attribute
      if (!color) {
        const styleMatch = rectTag.match(/style=["']([^"']+)["']/i);
        if (styleMatch) {
          const fillStyleMatch = styleMatch[1].match(/fill:\s*([^;]+)/i);
          if (fillStyleMatch) {
            color = this.normalizeColor(fillStyleMatch[1]);
          }
        }
      }

      if (color) {
        // Calculate rect area
        const widthMatch = rectTag.match(/width=["']([^"']+)["']/i);
        const heightMatch = rectTag.match(/height=["']([^"']+)["']/i);

        if (widthMatch && heightMatch) {
          const widthStr = widthMatch[1];
          const heightStr = heightMatch[1];

          // Parse dimensions (handle percentages)
          let width: number;
          let height: number;

          if (widthStr.includes('%')) {
            width = (parseFloat(widthStr) / 100) * svgWidth;
          } else {
            width = parseFloat(widthStr);
          }

          if (heightStr.includes('%')) {
            height = (parseFloat(heightStr) / 100) * svgHeight;
          } else {
            height = parseFloat(heightStr);
          }

          if (!isNaN(width) && !isNaN(height)) {
            // Weight by percentage of total SVG area
            const rectArea = width * height;
            const areaWeight = (rectArea / svgArea) * 100;

            console.info(`[SVG] Rect ${color}: ${widthStr}x${heightStr} = ${width.toFixed(0)}x${height.toFixed(0)} = ${rectArea.toFixed(0)} (${areaWeight.toFixed(1)}% of total)`);

            // Add area-weighted score (min 1.0 to ensure it counts)
            colorCounts.set(color, (colorCounts.get(color) || 0) + Math.max(1.0, areaWeight));
            processedRects.add(color); // Mark as processed to avoid double-counting
            continue; // Skip adding this as regular fill below
          }
        }

        // Rect without dimensions, use default weight
        console.info(`[SVG] Rect ${color}: no dimensions, using default weight`);
        colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
        processedRects.add(color);
      }
    }

    // Extract fill colors from non-rect elements
    // (Don't double-count rect colors that were already area-weighted)
    const fillMatches = svgText.matchAll(/fill=["']([^"']+)["']/gi);
    let nonRectFills = 0;
    for (const match of fillMatches) {
      const color = this.normalizeColor(match[1]);
      if (color && !processedRects.has(color)) {
        colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
        nonRectFills++;
      }
    }
    console.info(`[SVG] Found ${nonRectFills} non-rect fill colors`);

    // Extract stroke colors
    const strokeMatches = svgText.matchAll(/stroke=["']([^"']+)["']/gi);
    for (const match of strokeMatches) {
      const color = this.normalizeColor(match[1]);
      if (color) {
        // Strokes typically have less visual weight than fills
        colorCounts.set(color, (colorCounts.get(color) || 0) + 0.5);
      }
    }

    // Extract colors from style attributes
    const styleMatches = svgText.matchAll(/style=["']([^"']+)["']/gi);
    for (const match of styleMatches) {
      const styleContent = match[1];

      // Extract fill from style
      const fillStyleMatch = styleContent.match(/fill:\s*([^;]+)/i);
      if (fillStyleMatch) {
        const color = this.normalizeColor(fillStyleMatch[1]);
        if (color) {
          colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
        }
      }

      // Extract stroke from style
      const strokeStyleMatch = styleContent.match(/stroke:\s*([^;]+)/i);
      if (strokeStyleMatch) {
        const color = this.normalizeColor(strokeStyleMatch[1]);
        if (color) {
          colorCounts.set(color, (colorCounts.get(color) || 0) + 0.5);
        }
      }
    }

    // Extract colors from gradients with usage-based weighting
    // Map gradient IDs to their colors
    const gradientColors = new Map<string, Set<string>>();
    const gradientMatches = svgText.matchAll(/<linearGradient[^>]+id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/linearGradient>/gi);

    for (const match of gradientMatches) {
      const gradientId = match[1];
      const gradientContent = match[2];
      const colors = new Set<string>();

      // Extract stop colors from this gradient
      const stopMatches = gradientContent.matchAll(/stop-color=["']([^"']+)["']/gi);
      for (const stopMatch of stopMatches) {
        const color = this.normalizeColor(stopMatch[1]);
        if (color) {
          colors.add(color);
        }
      }

      if (colors.size > 0) {
        // Consolidate similar colors within this gradient
        try {
          console.info(`[SVG] Consolidating ${colors.size} colors in gradient ${gradientId}`);
          const consolidated = this.consolidateSimilarColors(Array.from(colors), 8);
          console.info(`[SVG] Consolidated to ${consolidated.length} colors`);
          gradientColors.set(gradientId, new Set(consolidated));
        } catch (error) {
          console.error(`[SVG] Error consolidating gradient ${gradientId}:`, error);
          // Fallback to original colors if consolidation fails
          gradientColors.set(gradientId, colors);
        }
      }
    }

    console.info(`[SVG] Found ${gradientColors.size} gradients with colors`);

    // Find elements that use gradients and weight by usage count (proxy for area)
    const gradientUsage = new Map<string, number>();
    const urlMatches = svgText.matchAll(/fill=["']url\(#([^)]+)\)["']/gi);

    for (const match of urlMatches) {
      const gradientId = match[1];
      gradientUsage.set(gradientId, (gradientUsage.get(gradientId) || 0) + 1);
    }

    console.info(`[SVG] Found ${gradientUsage.size} gradients used in elements`);

    // Add gradient colors with same weight as regular fills
    let totalGradientColors = 0;
    for (const [gradientId, colors] of gradientColors.entries()) {
      const usageCount = gradientUsage.get(gradientId) || 1; // Default to 1 if not used
      const weight = usageCount; // Treat same as fill colors (no over-weighting)

      for (const color of colors) {
        colorCounts.set(color, (colorCounts.get(color) || 0) + weight);
        totalGradientColors++;
      }
    }

    console.info(`[SVG] Weighted ${totalGradientColors} gradient colors by usage`);

    // If no colors found, try to extract from CSS in <style> tags
    const cssStyleMatches = svgText.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    for (const match of cssStyleMatches) {
      const cssContent = match[1];

      // Extract fill colors from CSS
      const cssFillMatches = cssContent.matchAll(/fill:\s*([^;}\s]+)/gi);
      for (const fillMatch of cssFillMatches) {
        const color = this.normalizeColor(fillMatch[1]);
        if (color) {
          colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
        }
      }

      // Extract stroke colors from CSS
      const cssStrokeMatches = cssContent.matchAll(/stroke:\s*([^;}\s]+)/gi);
      for (const strokeMatch of cssStrokeMatches) {
        const color = this.normalizeColor(strokeMatch[1]);
        if (color) {
          colorCounts.set(color, (colorCounts.get(color) || 0) + 0.5);
        }
      }
    }

    // Log final color weights
    console.info(`[SVG] Extracted ${colorCounts.size} colors, returning map...`);
    // Removed verbose color weight logging to reduce overhead
    return colorCounts;
  }

  /**
   * Normalize color to hex format
   * Supports: hex (#fff, #ffffff), rgb(r,g,b), named colors
   */
  private normalizeColor(color: string): string | null {
    const trimmed = color.trim().toLowerCase();

    // Skip non-color values
    if (trimmed === 'none' || trimmed === 'transparent' || trimmed === 'currentcolor') {
      return null;
    }

    // Already hex format
    if (trimmed.match(/^#[0-9a-f]{3,6}$/)) {
      // Expand shorthand hex (#fff -> #ffffff)
      if (trimmed.length === 4) {
        return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
      }
      return trimmed;
    }

    // RGB format: rgb(255, 255, 255) or rgb(255,255,255)
    const rgbMatch = trimmed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      const hex = this.rgbToHex({ R: r, G: g, B: b });
      // console.info(`[SVG] Parsed rgb(${r},${g},${b}) -> ${hex}`);
      return hex;
    }

    // Named colors (basic set)
    const namedColors: Record<string, string> = {
      'white': '#ffffff',
      'black': '#000000',
      'red': '#ff0000',
      'green': '#008000',
      'blue': '#0000ff',
      'yellow': '#ffff00',
      'cyan': '#00ffff',
      'magenta': '#ff00ff',
      'gray': '#808080',
      'grey': '#808080',
      'orange': '#ffa500',
      'purple': '#800080',
      'brown': '#a52a2a',
      'pink': '#ffc0cb'
    };

    if (namedColors[trimmed]) {
      return namedColors[trimmed];
    }

    return null;
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): RGB {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { R: r, G: g, B: b };
  }

  /**
   * Convert RGB to hex
   */
  private rgbToHex(rgb: RGB): string {
    const toHex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
    return `#${toHex(rgb.R)}${toHex(rgb.G)}${toHex(rgb.B)}`;
  }

  /**
   * Consolidate similar colors using deltaE distance
   * Merges colors that are perceptually similar (within tolerance)
   */
  private consolidateSimilarColors(colors: string[], tolerance: number): string[] {
    if (colors.length <= 1) return colors;

    try {
      // Convert hex to Lab for perceptual comparison
      const colorData = colors.map(hex => {
        const rgb = this.hexToRgb(hex);
        const lab = this.rgbToLab(rgb);
        return { hex, rgb, lab };
      });

      const merged: typeof colorData = [];

      for (const color of colorData) {
        // Check if this color is similar to any already merged color
        let foundSimilar = false;

        for (const existing of merged) {
          const deltaE = this.calculateDeltaE(color.lab, existing.lab);
          if (deltaE < tolerance) {
            // Similar color found - skip this one (keep the first)
            foundSimilar = true;
            break;
          }
        }

        if (!foundSimilar) {
          merged.push(color);
        }
      }

      return merged.map(c => c.hex);
    } catch (error) {
      console.error('[SVG] Error in consolidateSimilarColors:', error);
      // Return original colors if consolidation fails
      return colors;
    }
  }

  /**
   * Convert RGB to Lab color space
   */
  private rgbToLab(rgb: RGB): { L: number; a: number; b: number } {
    // Simple sRGB to Lab conversion
    // Normalize RGB to 0-1
    let r = rgb.R / 255;
    let g = rgb.G / 255;
    let b = rgb.B / 255;

    // Apply gamma correction
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    // Convert to XYZ
    let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    // Normalize for D65 white point
    x = x / 0.95047;
    y = y / 1.00000;
    z = z / 1.08883;

    // Convert to Lab
    x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16/116);
    y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16/116);
    z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16/116);

    const L = (116 * y) - 16;
    const a = 500 * (x - y);
    const bVal = 200 * (y - z);

    return { L, a, b: bVal };
  }

  /**
   * Calculate deltaE (perceptual color difference)
   * Simplified deltaE76 formula
   */
  private calculateDeltaE(lab1: { L: number; a: number; b: number }, lab2: { L: number; a: number; b: number }): number {
    const dL = lab1.L - lab2.L;
    const da = lab1.a - lab2.a;
    const db = lab1.b - lab2.b;
    return Math.sqrt(dL * dL + da * da + db * db);
  }

  /**
   * Calculate chroma (saturation) from Lab values
   */
  private getChroma(lab: { L: number; a: number; b: number }): number {
    return Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  }

  /**
   * Smart background detection and addition
   * Looks for dominant low-chroma colors that might be backgrounds
   * Adds cream (not white) if coverage gaps exist
   */
  private detectAndAddBackground(colours: SVGColor[], totalPixels: number): SVGColor[] {
    const totalCoverage = colours.reduce((sum, c) => sum + c.percentage, 0);

    console.info(`[SVG] Checking for background (total coverage: ${totalCoverage.toFixed(1)}%)`);

    // Look for existing background: dominant color (>40%) with low chroma (<10)
    for (const color of colours) {
      if (color.percentage > 40) {
        const lab = this.rgbToLab(color.rgb);
        const chroma = this.getChroma(lab);

        if (chroma < 10) {
          console.info(
            `[SVG] Detected background: ${this.rgbToHex(color.rgb)} ` +
            `(${color.percentage.toFixed(1)}%, L=${lab.L.toFixed(1)}, C=${chroma.toFixed(1)})`
          );
          // Background already exists, no need to add one
          return colours;
        }
      }
    }

    // No background detected - check if we need to add one
    if (totalCoverage < 95) {
      const missingCoverage = 100 - totalCoverage;

      console.warn(
        `[SVG] No background found and coverage < 95%. ` +
        `Adding cream background with ${missingCoverage.toFixed(1)}% coverage`
      );

      // Add cream (RH31: #F2E6C8) as background, not white
      const creamRgb: RGB = {
        R: this.lightestTPVColor.R,
        G: this.lightestTPVColor.G,
        B: this.lightestTPVColor.B
      };

      colours.push({
        rgb: creamRgb,
        percentage: missingCoverage,
        pixels: Math.round((missingCoverage / 100) * totalPixels)
      });

      // Re-sort by percentage
      colours.sort((a, b) => b.percentage - a.percentage);

      console.info(`[SVG] Added cream background: ${this.lightestTPVColor.hex} (${missingCoverage.toFixed(1)}%)`);
    } else {
      console.info(`[SVG] Coverage >= 95%, no background needed`);
    }

    return colours;
  }

  /**
   * Enforce palette cap by iteratively merging closest colors if over limit
   * Preserves high-coverage colors
   */
  private enforcePaletteCap(colours: SVGColor[], maxColors: number): SVGColor[] {
    if (colours.length <= maxColors) {
      return colours;
    }

    console.info(`[SVG] Enforcing ${maxColors}-color palette cap (currently ${colours.length} colors)...`);

    // Since we already did global collapse with ΔE ≤ 5, the colors are perceptually distinct
    // Just take the top N colors by coverage (fast, O(n log n))
    const topColors = colours
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, maxColors);

    const droppedCoverage = colours
      .slice(maxColors)
      .reduce((sum, c) => sum + c.percentage, 0);

    console.info(
      `[SVG] Kept top ${topColors.length} colors by coverage ` +
      `(${topColors.reduce((sum, c) => sum + c.percentage, 0).toFixed(1)}% total), ` +
      `dropped ${colours.length - maxColors} colors (${droppedCoverage.toFixed(1)}% coverage)`
    );

    return topColors;
  }

  /**
   * Collapse globally similar colors across entire SVG
   * Merges colors within ΔE threshold to eliminate micro-gradients
   */
  private collapseGlobalColors(colorCounts: Map<string, number>, threshold: number = 5): Map<string, number> {
    console.info(`[SVG] Collapsing similar colors (ΔE ≤ ${threshold})...`);

    // Convert to array for processing
    const colorArray = Array.from(colorCounts.entries()).map(([hex, weight]) => {
      const rgb = this.hexToRgb(hex);
      const lab = this.rgbToLab(rgb);
      return { hex, weight, lab };
    });

    // Sort by weight (importance) - process high-coverage colors first
    colorArray.sort((a, b) => b.weight - a.weight);

    console.info(`[SVG] Before collapse: ${colorArray.length} colors`);

    // Build clusters - each cluster has a canonical color (first/highest weight)
    const clusters: Array<{
      canonicalHex: string;
      canonicalLab: { L: number; a: number; b: number };
      totalWeight: number;
      members: typeof colorArray;
    }> = [];

    for (const color of colorArray) {
      // Find if this color belongs to an existing cluster
      let foundCluster = false;

      for (const cluster of clusters) {
        const dE = this.calculateDeltaE(color.lab, cluster.canonicalLab);

        if (dE <= threshold) {
          // Add to this cluster
          cluster.members.push(color);
          cluster.totalWeight += color.weight;
          foundCluster = true;
          break;
        }
      }

      if (!foundCluster) {
        // Create new cluster with this color as canonical
        clusters.push({
          canonicalHex: color.hex,
          canonicalLab: color.lab,
          totalWeight: color.weight,
          members: [color]
        });
      }
    }

    console.info(`[SVG] After collapse: ${clusters.length} color clusters`);

    // Build collapsed map
    const collapsed = new Map<string, number>();

    for (const cluster of clusters) {
      collapsed.set(cluster.canonicalHex, cluster.totalWeight);

      // Log if cluster has multiple members
      if (cluster.members.length > 1) {
        const memberHexes = cluster.members.map(m => m.hex).join(', ');
        console.info(`[SVG]   Cluster ${cluster.canonicalHex}: merged ${cluster.members.length} colors (${memberHexes})`);
      }
    }

    return collapsed;
  }

  /**
   * Normalize color map by snapping "too light" colors to nearest TPV colors
   * Much more efficient than normalizing the entire SVG text
   */
  private normalizeColorMap(colorCounts: Map<string, number>): Map<string, number> {
    console.info(`[SVG] Normalizing ${colorCounts.size} colors to TPV palette...`);
    const normalized = new Map<string, number>();
    let snappedCount = 0;

    for (const [hexColor, weight] of colorCounts.entries()) {
      // Snap this color to TPV palette if needed
      const snappedColor = this.snapToNearestTPVColor(hexColor);

      // Accumulate weights for snapped colors
      const existing = normalized.get(snappedColor) || 0;
      normalized.set(snappedColor, existing + weight);

      // Count snaps (reduced logging to avoid timeout)
      if (snappedColor !== hexColor.toLowerCase()) {
        snappedCount++;
      }
    }

    console.info(`[SVG] Normalized ${colorCounts.size} → ${normalized.size} colors (snapped ${snappedCount} colors)`);
    return normalized;
  }

  /**
   * Normalize SVG colors by snapping "too light" colors to nearest TPV colors
   * This ensures all colors in the SVG can actually be produced by TPV granules
   * NOTE: This method is no longer used - we normalize the color map instead
   */
  private normalizeSvgColors(svgString: string): string {
    console.info('[SVG] Normalizing colors to TPV palette...');
    let normalized = svgString;
    const replacements = new Map<string, string>(); // Track what we're replacing

    // Helper to normalize and snap a color
    const normalizeAndSnap = (colorStr: string): string => {
      const normalizedColor = this.normalizeColor(colorStr);
      if (!normalizedColor) return colorStr; // Skip non-colors

      // Check if we've already processed this color
      if (replacements.has(normalizedColor)) {
        return replacements.get(normalizedColor)!;
      }

      // Snap to nearest TPV color
      const snappedColor = this.snapToNearestTPVColor(normalizedColor);
      replacements.set(normalizedColor, snappedColor);
      return snappedColor;
    };

    // Replace colors in fill attributes
    normalized = normalized.replace(
      /fill=["']([^"']+)["']/gi,
      (match, color) => {
        const snapped = normalizeAndSnap(color);
        return `fill="${snapped}"`;
      }
    );

    // Replace colors in stroke attributes
    normalized = normalized.replace(
      /stroke=["']([^"']+)["']/gi,
      (match, color) => {
        const snapped = normalizeAndSnap(color);
        return `stroke="${snapped}"`;
      }
    );

    // Replace colors in stop-color attributes (gradients)
    normalized = normalized.replace(
      /stop-color=["']([^"']+)["']/gi,
      (match, color) => {
        const snapped = normalizeAndSnap(color);
        return `stop-color="${snapped}"`;
      }
    );

    // Replace colors in style attributes (more complex)
    normalized = normalized.replace(
      /style=["']([^"']+)["']/gi,
      (match, styleContent) => {
        let updatedStyle = styleContent;

        // Replace fill in style
        updatedStyle = updatedStyle.replace(
          /fill:\s*([^;]+)/gi,
          (fillMatch, color) => {
            const snapped = normalizeAndSnap(color.trim());
            return `fill: ${snapped}`;
          }
        );

        // Replace stroke in style
        updatedStyle = updatedStyle.replace(
          /stroke:\s*([^;]+)/gi,
          (strokeMatch, color) => {
            const snapped = normalizeAndSnap(color.trim());
            return `stroke: ${snapped}`;
          }
        );

        return `style="${updatedStyle}"`;
      }
    );

    // Replace colors in <style> tags (CSS)
    normalized = normalized.replace(
      /<style[^>]*>([\s\S]*?)<\/style>/gi,
      (match, cssContent) => {
        let updatedCss = cssContent;

        // Replace fill colors in CSS
        updatedCss = updatedCss.replace(
          /fill:\s*([^;}\s]+)/gi,
          (cssMatch, color) => {
            const snapped = normalizeAndSnap(color.trim());
            return `fill: ${snapped}`;
          }
        );

        // Replace stroke colors in CSS
        updatedCss = updatedCss.replace(
          /stroke:\s*([^;}\s]+)/gi,
          (cssMatch, color) => {
            const snapped = normalizeAndSnap(color.trim());
            return `stroke: ${snapped}`;
          }
        );

        return `<style>${updatedCss}</style>`;
      }
    );

    // Log replacements
    const replacementCount = replacements.size;
    console.info(`[SVG] Normalized ${replacementCount} unique colors:`);
    for (const [original, snapped] of replacements.entries()) {
      if (original !== snapped) {
        console.info(`  ${original} → ${snapped}`);
      }
    }

    return normalized;
  }

  /**
   * Snap "unrealistic" colors (too light) to nearest TPV color
   * Colors lighter than cream (L > 91.8) can't be produced by TPV granules
   */
  private snapToNearestTPVColor(hexColor: string): string {
    const rgb = this.hexToRgb(hexColor);
    const lab = this.rgbToLab(rgb);

    // If color is not lighter than cream, keep it as-is
    if (lab.L <= this.lightestTPVColor.L) {
      return hexColor;
    }

    // Color is too light - need to snap to nearest TPV color
    const chroma = this.getChroma(lab);

    // Low chroma (neutral colors) → snap to cream
    if (chroma < 15) {
      // Snapping to cream (removed logging to reduce overhead)
      return this.lightestTPVColor.hex.toLowerCase();
    }

    // High chroma (tinted colors) → find nearest TPV color by ΔE
    let nearestColor = this.lightestTPVColor;
    let minDeltaE = deltaE2000(lab, {
      L: this.lightestTPVColor.L,
      a: this.lightestTPVColor.a,
      b: this.lightestTPVColor.b
    });

    for (const tpvColor of this.tpvColors) {
      const tpvLab = { L: tpvColor.L, a: tpvColor.a, b: tpvColor.b };
      const dE = deltaE2000(lab, tpvLab);

      if (dE < minDeltaE) {
        minDeltaE = dE;
        nearestColor = tpvColor;
      }
    }

    // Snapping to nearest color (removed logging to reduce overhead)
    return nearestColor.hex.toLowerCase();
  }
}
