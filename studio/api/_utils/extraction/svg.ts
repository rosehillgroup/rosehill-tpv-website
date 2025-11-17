/**
 * SVG Color Extractor
 * Parses SVG XML to extract fill and stroke colors directly from elements
 */

import type { RGB, Lab } from '../colour/types';

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
}

export class SVGExtractor {
  private options: Required<SVGExtractorOptions>;

  constructor(options: SVGExtractorOptions = {}) {
    this.options = {
      maxColours: options.maxColours ?? 20,
      minPercentage: options.minPercentage ?? 0 // Include all colors, even tiny accents
    };
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
      console.info(`[SVG] Using SVG extractor v2 with gradient support`);

      // Parse SVG dimensions
      const dimensions = this.parseSVGDimensions(svgText);
      const totalPixels = dimensions.width && dimensions.height
        ? dimensions.width * dimensions.height
        : 1000000; // Default if no dimensions found

      // Extract all colors from SVG elements (area-weighted)
      const colorCounts = this.extractColors(svgText);

      console.info(`[SVG] Found ${colorCounts.size} unique colors`);

      // Calculate percentages from area-weighted scores
      const totalWeight = Array.from(colorCounts.values()).reduce((sum, weight) => sum + weight, 0);

      console.info(`[SVG] Total weight: ${totalWeight}`);

      // Handle case where no colors were found
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
      // DON'T truncate yet - need to check coverage first!

      // Check if we should add white as background
      // If total coverage is < 95%, assume transparent background is white
      const totalCoverage = colours.reduce((sum, c) => sum + c.percentage, 0);
      console.warn(`[SVG-DEBUG] Total coverage: ${totalCoverage.toFixed(1)}%`);
      warnings.push(`DEBUG: Before white - ${colours.length} colors, ${totalCoverage.toFixed(1)}% coverage`);

      if (totalCoverage < 95) {
        const whiteCoverage = 100 - totalCoverage;
        console.warn(`[SVG-DEBUG] Adding white background with ${whiteCoverage.toFixed(1)}% coverage`);
        warnings.push(`DEBUG: Adding white with ${whiteCoverage.toFixed(1)}% coverage`);

        colours.push({
          rgb: { R: 255, G: 255, B: 255 },
          percentage: whiteCoverage,
          pixels: Math.round((whiteCoverage / 100) * totalPixels)
        });

        // Re-sort after adding white
        colours.sort((a, b) => b.percentage - a.percentage);
        warnings.push(`DEBUG: After adding white - ${colours.length} colors`);
      } else {
        console.warn(`[SVG-DEBUG] No white background needed (coverage >= 95%)`);
        warnings.push(`DEBUG: No white added (coverage >= 95%)`);
      }

      // NOW truncate to maxColours (after potentially adding white)
      const beforeTruncate = colours.length;
      colours = colours.slice(0, this.options.maxColours);
      warnings.push(`DEBUG: After truncate to ${this.options.maxColours} - ${colours.length} colors (was ${beforeTruncate})`);

      const elapsed = Date.now() - startTime;
      console.info(`[SVG] Extracted ${colours.length} colors in ${elapsed}ms`);

      // Add final debug summary
      warnings.push(`DEBUG: Final palette has ${colours.length} colors. White #ffffff present: ${colours.some(c => c.rgb.R === 255 && c.rgb.G === 255 && c.rgb.B === 255) ? 'YES' : 'NO'}`);

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

    // Extract colors from gradient stop-color attributes
    const stopColorMatches = svgText.matchAll(/stop-color=["']([^"']+)["']/gi);
    let gradientStopCount = 0;
    let gradientStopParsed = 0;
    for (const match of stopColorMatches) {
      gradientStopCount++;
      const rawColor = match[1];
      const color = this.normalizeColor(rawColor);
      if (color) {
        gradientStopParsed++;
        // Gradient colors are important visual components - weight them higher
        colorCounts.set(color, (colorCounts.get(color) || 0) + 10);
      } else {
        console.warn(`[SVG] Failed to parse stop-color: "${rawColor}"`);
      }
    }
    console.info(`[SVG] Found ${gradientStopCount} gradient stops, parsed ${gradientStopParsed} colors`);

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
    console.info('[SVG] Final color weights:');
    Array.from(colorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([color, weight]) => {
        console.info(`  ${color}: ${weight.toFixed(2)}`);
      });

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
}
