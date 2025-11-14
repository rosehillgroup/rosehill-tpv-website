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
      minPercentage: options.minPercentage ?? 0.5
    };
  }

  /**
   * Extract colors from SVG buffer
   */
  async extract(buffer: ArrayBuffer, format: string): Promise<SVGExtractionResult> {
    const startTime = Date.now();

    try {
      // Convert buffer to string
      const svgText = new TextDecoder('utf-8').decode(buffer);

      console.info(`[SVG] Parsing SVG (${buffer.byteLength} bytes)`);

      // Parse SVG dimensions
      const dimensions = this.parseSVGDimensions(svgText);
      const totalPixels = dimensions.width && dimensions.height
        ? dimensions.width * dimensions.height
        : 1000000; // Default if no dimensions found

      // Extract all colors from SVG elements
      const colorCounts = this.extractColors(svgText);

      // Calculate percentages
      const totalCount = Array.from(colorCounts.values()).reduce((sum, count) => sum + count, 0);

      const colours: SVGColor[] = Array.from(colorCounts.entries())
        .map(([hexColor, count]) => {
          const rgb = this.hexToRgb(hexColor);
          const percentage = (count / totalCount) * 100;
          return {
            rgb,
            percentage,
            pixels: Math.round((percentage / 100) * totalPixels)
          };
        })
        .filter(color => color.percentage >= this.options.minPercentage)
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, this.options.maxColours);

      const elapsed = Date.now() - startTime;
      console.info(`[SVG] Extracted ${colours.length} colors in ${elapsed}ms`);

      return {
        colours,
        metadata: {
          width: dimensions.width,
          height: dimensions.height,
          totalPixels,
          format
        }
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
   * Returns a map of hex colors to their occurrence counts
   */
  private extractColors(svgText: string): Map<string, number> {
    const colorCounts = new Map<string, number>();

    // Extract fill colors
    const fillMatches = svgText.matchAll(/fill=["']([^"']+)["']/gi);
    for (const match of fillMatches) {
      const color = this.normalizeColor(match[1]);
      if (color) {
        colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
      }
    }

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
    for (const match of stopColorMatches) {
      const color = this.normalizeColor(match[1]);
      if (color) {
        // Gradient colors are important visual components
        colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
      }
    }

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

    // RGB format: rgb(255, 255, 255)
    const rgbMatch = trimmed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      return this.rgbToHex({ R: r, G: g, B: b });
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
