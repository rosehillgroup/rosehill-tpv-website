// TPV Studio - Motif Utilities for TPV Designer
// Handles fetching, sanitizing, and preparing playground designs for use as motifs

import { loadDesign, listDesigns } from '../api/designs.js';
import { sanitizeSVG, quickValidateSVG } from '../../utils/sanitizeSVG.js';
import { recolorSVG } from '../../utils/svgRecolor.js';
import { tagSvgRegions } from '../../utils/svgRegionTagger.js';
import { applyRegionOverrides } from '../../utils/svgRegionOverrides.js';

/**
 * Fetch a playground design and prepare it for use as a motif
 * Regenerates TPV-recolored SVGs from the original SVG + stored color mappings
 * @param {string} designId - UUID of the saved playground design
 * @returns {Promise<Object>} Motif data ready for sportsDesignStore.addMotif()
 */
export async function fetchMotifFromDesign(designId) {
  // Load the design from API - returns { design }
  const result = await loadDesign(designId);
  const design = result?.design || result;

  if (!design) {
    throw new Error('Design not found');
  }

  // Check design type
  if (design.input_mode === 'sports_surface') {
    throw new Error('Cannot use a sports surface design as a motif');
  }

  // We need the original SVG URL and color mappings to regenerate the recolored versions
  // Note: final_solid_svg_url and final_blend_svg_url are always NULL (blob URLs can't be stored)
  // So we regenerate them on-the-fly from original + color mappings (same as InspirePanelRecraft does)
  const originalUrl = design.original_svg_url;

  if (!originalUrl || originalUrl.startsWith('blob:')) {
    throw new Error('Design does not have a valid original SVG. Please ensure the design was saved after generation.');
  }

  // Need at least one color mapping to regenerate
  if (!design.solid_color_mapping && !design.color_mapping) {
    throw new Error('Design does not have color mappings. Please ensure the design was saved after color mapping.');
  }

  console.log('[MOTIF] Fetching original SVG from:', originalUrl);

  // Extract region overrides from design_data (nested JSONB field)
  const regionOverridesObj = design.design_data?.region_overrides || design.region_overrides || null;
  const originalTaggedSvg = design.design_data?.original_tagged_svg || design.original_tagged_svg || null;

  console.log('[MOTIF] Region overrides:', regionOverridesObj ? Object.keys(regionOverridesObj).length : 0, 'regions');
  console.log('[MOTIF] Original tagged SVG:', originalTaggedSvg ? 'present' : 'not present');

  // Convert region overrides to Map if present
  const regionOverrides = regionOverridesObj ? new Map(Object.entries(regionOverridesObj)) : null;

  // Fetch and sanitize the original SVG
  const originalSvg = await fetchAndSanitizeSVG(originalUrl);
  if (!originalSvg) {
    throw new Error('Failed to load or sanitize the original SVG.');
  }

  console.log('[MOTIF] Original SVG loaded, regenerating recolored versions...');

  // Regenerate solid and blend versions using the stored color mappings
  let solidSvgContent = null;
  let blendSvgContent = null;

  // Generate solid version from solid_color_mapping
  if (design.solid_color_mapping && Object.keys(design.solid_color_mapping).length > 0) {
    try {
      const solidMapping = deserializeColorMapping(design.solid_color_mapping);
      console.log('[MOTIF] Solid mapping has', solidMapping.size, 'colors');
      const { svgText } = await recolorSVG(null, solidMapping, originalSvg);
      solidSvgContent = svgText;
      console.log('[MOTIF] Generated solid SVG:', solidSvgContent.length, 'chars');

      // Apply region overrides (transparency, etc.) if present
      if (regionOverrides && regionOverrides.size > 0 && solidSvgContent) {
        console.log('[MOTIF] Applying', regionOverrides.size, 'region overrides to solid SVG');
        // Tag the SVG with region IDs if we have the original tagged SVG
        let taggedSvg = solidSvgContent;
        if (originalTaggedSvg) {
          // Use stored tagged SVG structure to apply region IDs
          taggedSvg = tagSvgRegions(solidSvgContent);
        } else {
          // Tag fresh
          taggedSvg = tagSvgRegions(solidSvgContent);
        }
        solidSvgContent = applyRegionOverrides(taggedSvg, regionOverrides);
        console.log('[MOTIF] Applied region overrides to solid SVG');
      }
    } catch (error) {
      console.error('[MOTIF] Failed to generate solid SVG:', error);
    }
  }

  // Generate blend version from color_mapping (blend colors)
  if (design.color_mapping && Object.keys(design.color_mapping).length > 0) {
    try {
      const blendMapping = deserializeColorMapping(design.color_mapping);
      console.log('[MOTIF] Blend mapping has', blendMapping.size, 'colors');
      const { svgText } = await recolorSVG(null, blendMapping, originalSvg);
      blendSvgContent = svgText;
      console.log('[MOTIF] Generated blend SVG:', blendSvgContent.length, 'chars');

      // Apply region overrides (transparency, etc.) if present
      if (regionOverrides && regionOverrides.size > 0 && blendSvgContent) {
        console.log('[MOTIF] Applying', regionOverrides.size, 'region overrides to blend SVG');
        let taggedSvg = tagSvgRegions(blendSvgContent);
        blendSvgContent = applyRegionOverrides(taggedSvg, regionOverrides);
        console.log('[MOTIF] Applied region overrides to blend SVG');
      }
    } catch (error) {
      console.error('[MOTIF] Failed to generate blend SVG:', error);
    }
  }

  // Must have at least one version
  if (!solidSvgContent && !blendSvgContent) {
    throw new Error('Failed to regenerate TPV-recolored SVG versions.');
  }

  // Extract dimensions from design.dimensions (JSONB field)
  const dimensions = design.dimensions || {};
  let width_mm = dimensions.widthMM || dimensions.width_mm || 5000;
  let height_mm = dimensions.lengthMM || dimensions.length_mm || 5000;

  // If dimensions are default square (5000x5000), extract from SVG viewBox for correct aspect ratio
  const isDefaultSquare = width_mm === 5000 && height_mm === 5000;
  const svgToCheck = solidSvgContent || blendSvgContent;

  if (svgToCheck) {
    const svgDimensions = extractSVGDimensions(svgToCheck);
    if (svgDimensions && svgDimensions.width && svgDimensions.height) {
      const aspectRatio = svgDimensions.width / svgDimensions.height;

      // Only override if not square OR if stored as default square
      if (isDefaultSquare || Math.abs(aspectRatio - 1) > 0.01) {
        if (aspectRatio > 1) {
          // Wider than tall - use width as base
          width_mm = 5000;
          height_mm = Math.round(5000 / aspectRatio);
        } else if (aspectRatio < 1) {
          // Taller than wide - use height as base
          height_mm = 5000;
          width_mm = Math.round(5000 * aspectRatio);
        }
        console.log('[MOTIF] Corrected dimensions from SVG viewBox:', width_mm, 'x', height_mm, 'mm (aspect ratio:', aspectRatio.toFixed(3), ')');
      }
    }
  }

  // Get thumbnail URL for preview (stored at top level)
  const thumbnailUrl = design.thumbnail_url || design.original_png_url || null;

  // Determine if both versions are available
  const hasBothVersions = solidSvgContent && blendSvgContent;

  return {
    sourceDesignId: designId,
    sourceDesignName: design.name || 'Unnamed Design',
    sourceThumbnailUrl: thumbnailUrl,
    // Store both versions (one may be null)
    solidSvgContent: solidSvgContent,
    blendSvgContent: blendSvgContent,
    // For backward compatibility, also provide svgContent (defaults to solid)
    svgContent: solidSvgContent || blendSvgContent,
    // Flag indicating if user can switch between versions
    hasBothVersions,
    originalWidth_mm: width_mm,
    originalHeight_mm: height_mm
  };
}

/**
 * Deserialize a color mapping from Object (stored in DB) to Map (for recolorSVG)
 * @param {Object} colorMappingObj - Object with hex keys -> mapping values
 * @returns {Map<string, Object>} Map for use with recolorSVG()
 */
function deserializeColorMapping(colorMappingObj) {
  const map = new Map();

  if (!colorMappingObj || typeof colorMappingObj !== 'object') {
    return map;
  }

  for (const [originalHex, mapping] of Object.entries(colorMappingObj)) {
    // Ensure the key has a # prefix (normalize)
    const normalizedKey = originalHex.startsWith('#') ? originalHex : `#${originalHex}`;
    map.set(normalizedKey, mapping);
  }

  return map;
}

/**
 * Fetch SVG content from URL and sanitize it
 * @param {string} url - URL to fetch SVG from
 * @returns {Promise<string|null>} Sanitized SVG content or null if failed
 */
async function fetchAndSanitizeSVG(url) {
  try {
    console.log('[MOTIF] Fetching SVG from:', url);
    const response = await fetch(url);

    if (!response.ok) {
      console.error('[MOTIF] Failed to fetch SVG:', response.status, response.statusText);
      return null;
    }

    const svgText = await response.text();
    console.log('[MOTIF] Fetched content length:', svgText.length, 'chars');
    console.log('[MOTIF] Content starts with:', svgText.substring(0, 100));

    // Quick validation first
    if (!quickValidateSVG(svgText)) {
      console.error('[MOTIF] SVG failed quick validation');
      return null;
    }

    // Full sanitization
    const sanitized = sanitizeSVG(svgText);

    if (!sanitized) {
      console.error('[MOTIF] SVG sanitization failed');
      return null;
    }

    console.log('[MOTIF] Sanitized SVG length:', sanitized.length, 'chars');
    return sanitized;
  } catch (error) {
    console.error('[MOTIF] Error fetching SVG:', error);
    return null;
  }
}

/**
 * List playground designs suitable for use as motifs
 * @param {Object} options - Query options
 * @param {number} [options.limit=50] - Results per page
 * @param {number} [options.offset=0] - Pagination offset
 * @param {string} [options.search] - Search query
 * @returns {Promise<Object>} List of designs with pagination info
 */
export async function listPlaygroundDesigns(options = {}) {
  const result = await listDesigns(options);

  // Filter to only playground designs (exclude sports surfaces)
  // The list API returns metadata only (not full design_data), so we check:
  // - input_mode !== 'sports_surface' (playground designs)
  // - Has thumbnail_url or original_svg_url (has generated content)
  const validDesigns = (result.designs || []).filter(design => {
    // Exclude sports surface designs
    if (design.input_mode === 'sports_surface') return false;

    // Include if it has any visual output (thumbnail or SVG)
    // These fields are set when a design is saved after generation
    return design.thumbnail_url || design.original_svg_url || design.original_png_url;
  });

  return {
    designs: validDesigns,
    pagination: result.pagination
  };
}

/**
 * Extract viewBox dimensions from SVG content
 * @param {string} svgContent - SVG string
 * @returns {Object|null} { width, height } or null if not found
 */
export function extractSVGDimensions(svgContent) {
  if (!svgContent) return null;

  // Try viewBox first
  const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/i);
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].split(/\s+/).map(Number);
    if (parts.length >= 4) {
      return {
        width: parts[2],
        height: parts[3]
      };
    }
  }

  // Fall back to width/height attributes
  const widthMatch = svgContent.match(/\bwidth=["']?(\d+(?:\.\d+)?)/i);
  const heightMatch = svgContent.match(/\bheight=["']?(\d+(?:\.\d+)?)/i);

  if (widthMatch && heightMatch) {
    return {
      width: parseFloat(widthMatch[1]),
      height: parseFloat(heightMatch[1])
    };
  }

  return null;
}

/**
 * Calculate the scaled dimensions of a motif
 * @param {Object} motif - Motif object from store
 * @returns {Object} { width_mm, height_mm }
 */
export function getMotifScaledDimensions(motif) {
  const scale = motif.scale || 1.0;
  return {
    width_mm: motif.originalWidth_mm * scale,
    height_mm: motif.originalHeight_mm * scale
  };
}

/**
 * Calculate bounding box for a rotated motif
 * @param {Object} motif - Motif object from store
 * @returns {Object} { x, y, width, height } in mm
 */
export function getMotifBoundingBox(motif) {
  const { width_mm, height_mm } = getMotifScaledDimensions(motif);
  const rotation = (motif.rotation || 0) * (Math.PI / 180);

  // For rotated rectangles, calculate axis-aligned bounding box
  const cos = Math.abs(Math.cos(rotation));
  const sin = Math.abs(Math.sin(rotation));

  const boundingWidth = width_mm * cos + height_mm * sin;
  const boundingHeight = width_mm * sin + height_mm * cos;

  // Position is top-left, calculate center then bounding box
  const centerX = motif.position.x + width_mm / 2;
  const centerY = motif.position.y + height_mm / 2;

  return {
    x: centerX - boundingWidth / 2,
    y: centerY - boundingHeight / 2,
    width: boundingWidth,
    height: boundingHeight
  };
}
