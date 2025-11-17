// import { PDFExtractor } from './pdf'; // PDF extraction not used in serverless environment
import { RasterExtractor } from './raster.js';
import { SVGExtractor } from './svg.js';
import {
  ColourSpaceConverter,
  generateColourId,
  combineColourSources,
  validateFileType,
  estimateExtractionComplexity,
  type PaletteColour
} from './utils.js';
import { getExtractionCache, generateCacheKey, ProgressiveLoader } from './cache.js';

export interface ExtractionOptions {
  maxColours?: number;
  minAreaPct?: number;
  combineStrategy?: 'prefer-pdf' | 'prefer-raster' | 'merge';
  rasterFallback?: boolean;
  pdfOptions?: {
    minFrequency?: number;
    tolerance?: number;
  };
  rasterOptions?: {
    resampleSize?: number;
    iterations?: number;
  };
}

export interface ExtractionResult {
  palette: PaletteColour[];
  metadata: {
    filename: string;
    fileSize: number;
    fileType: 'pdf' | 'image' | 'svg';
    extractionTime: number;
    complexity: 'low' | 'medium' | 'high';
    sources: ('pdf' | 'raster' | 'svg')[];
    totalColours: {
      pdf?: number;
      raster?: number;
      svg?: number;
      combined: number;
    };
  };
  warnings?: string[];
}

export class PaletteExtractor {
  private options: Required<ExtractionOptions>;
  private converter: ColourSpaceConverter;
  // private pdfExtractor: PDFExtractor; // PDF extraction not used
  private rasterExtractor: RasterExtractor;
  private svgExtractor: SVGExtractor;

  constructor(options: ExtractionOptions = {}) {
    this.options = {
      maxColours: options.maxColours ?? 15,
      minAreaPct: options.minAreaPct ?? 0, // Include all colors, even small design elements
      combineStrategy: options.combineStrategy ?? 'merge',
      rasterFallback: options.rasterFallback ?? true,
      pdfOptions: {
        minFrequency: 3,
        tolerance: 8,
        ...options.pdfOptions
      },
      rasterOptions: {
        resampleSize: 400,
        iterations: 15,
        ...options.rasterOptions
      }
    };

    this.converter = new ColourSpaceConverter();
    // this.pdfExtractor = new PDFExtractor(this.options.pdfOptions); // PDF extraction not used
    this.rasterExtractor = new RasterExtractor({
      maxColours: this.options.maxColours,
      minPercentage: this.options.minAreaPct,
      ...this.options.rasterOptions
    });
    this.svgExtractor = new SVGExtractor({
      maxColours: this.options.maxColours,
      minPercentage: this.options.minAreaPct
    });
  }

  async extract(
    fileBuffer: ArrayBuffer,
    filename: string,
    progressLoader?: ProgressiveLoader
  ): Promise<ExtractionResult> {
    const startTime = Date.now();
    const fileValidation = validateFileType(filename);
    const complexity = estimateExtractionComplexity(fileBuffer.byteLength, fileValidation.type!);
    const warnings: string[] = [];
    const sources: ('pdf' | 'raster')[] = [];

    if (!fileValidation.isValid) {
      throw new Error(`Unsupported file type: ${filename}`);
    }

    // Check cache first
    const cache = getExtractionCache();
    const cacheKey = generateCacheKey(filename, fileBuffer.byteLength, this.options);
    const cached = cache.get(cacheKey);
    
    if (cached) {
      progressLoader?.updateProgress('complete', 100, 'Using cached result');
      return cached;
    }

    progressLoader?.updateProgress('extracting', 10, 'Starting color extraction...');

    try {
      let pdfColours: PaletteColour[] = [];
      let rasterColours: PaletteColour[] = [];
      let svgColours: PaletteColour[] = [];

      // Skip server-side PDF processing entirely - client handles everything
      if (fileValidation.type === 'pdf') {
        progressLoader?.updateProgress('extracting', 25, 'Skipping server PDF processing - client handles extraction...');
        warnings.push('PDF processing handled client-side. Server extraction skipped to avoid canvas dependencies.');
        console.info('Skipping server-side PDF processing - relying on client-side extraction');
      }

      // Extract from SVG files (fast, direct parsing)
      if (fileValidation.type === 'svg') {
        try {
          progressLoader?.updateProgress('extracting', 30, 'Parsing SVG colors...');
          const svgResult = await this.svgExtractor.extract(
            fileBuffer,
            fileValidation.format!
          );

          svgColours = svgResult.colours.map(color => ({
            id: generateColourId(color.rgb, 'svg'),
            rgb: color.rgb,
            lab: this.converter.rgbToLab(color.rgb),
            areaPct: color.percentage,
            source: 'svg' as const,
            metadata: {
              pixels: color.pixels,
              percentage: color.percentage
            }
          }));

          sources.push('svg');

          // Add SVG extractor warnings to main warnings array
          if (svgResult.warnings) {
            warnings.push(...svgResult.warnings);
          }

          if (svgColours.length === 0) {
            warnings.push('No significant colors found in SVG');
          }
        } catch (error) {
          throw new Error(`SVG extraction failed: ${error.message}`);
        }
      }

      // Extract from raster images
      if (fileValidation.type === 'image') {
        try {
          progressLoader?.updateProgress('extracting', 40, 'Analyzing raster image colors...');
          const rasterResult = await this.rasterExtractor.extract(
            fileBuffer,
            fileValidation.format!
          );

          rasterColours = rasterResult.colours.map(color => ({
            id: generateColourId(color.rgb, 'raster'),
            rgb: color.rgb,
            lab: this.converter.rgbToLab(color.rgb),
            areaPct: color.percentage,
            source: 'raster' as const,
            metadata: {
              pixels: color.pixels,
              percentage: color.percentage
            }
          }));

          sources.push('raster');

          if (rasterColours.length === 0) {
            warnings.push('No significant colors found in raster image');
          }
        } catch (error) {
          throw new Error(`Image extraction failed: ${error.message}`);
        }
      }

      // Combine color sources
      progressLoader?.updateProgress('processing', 70, 'Combining and filtering colors...');
      let palette = [...pdfColours, ...svgColours, ...rasterColours];

      // Post-processing
      // Allow near-white and near-black colors to capture backgrounds
      palette = this.converter.filterInsignificant(
        palette,
        this.options.minAreaPct,
        false, // excludeNearWhite: allow light backgrounds (L > 95)
        false  // excludeNearBlack: allow dark backgrounds (L < 5)
      );

      // Deduplicate similar colors (moderate tolerance to preserve distinct shades)
      palette = this.converter.deduplicate(palette, 6);

      palette = this.converter.sortByImportance(palette);
      
      if (palette.length > this.options.maxColours) {
        palette = palette.slice(0, this.options.maxColours);
        warnings.push(`Truncated to ${this.options.maxColours} most significant colors`);
      }

      // Ensure we have at least one color
      if (palette.length === 0) {
        warnings.push('No colors extracted, using fallback');
        palette = [{
          id: generateColourId({ R: 128, G: 128, B: 128 }, 'fallback'),
          rgb: { R: 128, G: 128, B: 128 },
          lab: this.converter.rgbToLab({ R: 128, G: 128, B: 128 }),
          areaPct: 100,
          source: 'raster' as const
        }];
      }

      const result: ExtractionResult = {
        palette,
        metadata: {
          filename,
          fileSize: fileBuffer.byteLength,
          fileType: fileValidation.type,
          extractionTime: Date.now() - startTime,
          complexity,
          sources,
          totalColours: {
            pdf: pdfColours.length || undefined,
            svg: svgColours.length || undefined,
            raster: rasterColours.length || undefined,
            combined: palette.length
          }
        },
        warnings: warnings.length > 0 ? warnings : undefined
      };

      // Cache the result
      progressLoader?.updateProgress('caching', 90, 'Caching extraction result...');
      cache.set(cacheKey, result, 60 * 60 * 1000); // Cache for 1 hour

      progressLoader?.complete();
      return result;
    } catch (error) {
      throw new Error(`Palette extraction failed: ${error.message}`);
    }
  }

}