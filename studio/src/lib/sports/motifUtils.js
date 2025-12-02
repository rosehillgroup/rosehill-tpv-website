// TPV Studio - Motif Utilities for Sports Surface Designer
// Handles fetching, sanitizing, and preparing playground designs for use as motifs

import { loadDesign, listDesigns } from '../api/designs.js';
import { sanitizeSVG, quickValidateSVG } from '../../utils/sanitizeSVG.js';

/**
 * Fetch a playground design and prepare it for use as a motif
 * @param {string} designId - UUID of the saved playground design
 * @returns {Promise<Object>} Motif data ready for sportsDesignStore.addMotif()
 */
export async function fetchMotifFromDesign(designId) {
  // Load the design from API
  const design = await loadDesign(designId);

  if (!design) {
    throw new Error('Design not found');
  }

  // Check design type
  if (design.input_mode === 'sports_surface') {
    throw new Error('Cannot use a sports surface design as a motif');
  }

  // Get the design data (stored design state)
  const designData = design.design_data || {};

  // Determine which SVG URL to use
  // Priority: solidSvgUrl (final recolored) > blendSvgUrl > result.svg_url (original)
  let svgUrl = designData.solidSvgUrl || designData.blendSvgUrl || designData.result?.svg_url;

  if (!svgUrl) {
    throw new Error('Design does not have an SVG output. Please ensure the design was saved after generation.');
  }

  // Fetch the SVG content
  const svgContent = await fetchAndSanitizeSVG(svgUrl);

  if (!svgContent) {
    throw new Error('Failed to load or sanitize the design SVG');
  }

  // Extract dimensions from design
  const width_mm = designData.widthMM || designData.width_mm || 5000;
  const height_mm = designData.lengthMM || designData.length_mm || 5000;

  // Get thumbnail URL for preview
  const thumbnailUrl = design.thumbnail_url || designData.result?.png_url || null;

  return {
    sourceDesignId: designId,
    sourceDesignName: design.name || 'Unnamed Design',
    sourceThumbnailUrl: thumbnailUrl,
    svgContent,
    originalWidth_mm: width_mm,
    originalHeight_mm: height_mm
  };
}

/**
 * Fetch SVG content from URL and sanitize it
 * @param {string} url - URL to fetch SVG from
 * @returns {Promise<string|null>} Sanitized SVG content or null if failed
 */
async function fetchAndSanitizeSVG(url) {
  try {
    // Handle blob URLs (from local state) vs remote URLs
    const response = await fetch(url);

    if (!response.ok) {
      console.error('[MOTIF] Failed to fetch SVG:', response.status, response.statusText);
      return null;
    }

    const svgText = await response.text();

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
