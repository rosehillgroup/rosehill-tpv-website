// TPV Studio - SVG Tile Slicer
// Slices an SVG into 1m×1m tiles for easy installation

import JSZip from 'jszip';

/**
 * Get column letter from index (0=A, 1=B, ..., 25=Z, 26=AA, etc.)
 * @param {number} index - Column index (0-based)
 * @returns {string} Column letter(s)
 */
function getColumnLetter(index) {
  let letter = '';
  let i = index;
  while (i >= 0) {
    letter = String.fromCharCode((i % 26) + 65) + letter;
    i = Math.floor(i / 26) - 1;
  }
  return letter;
}

/**
 * Generate tile name using chess notation (A1, B2, etc.)
 * @param {number} col - Column index (0-based)
 * @param {number} row - Row index (0-based)
 * @returns {string} Tile name like "A1", "B2"
 */
function getTileName(col, row) {
  return `${getColumnLetter(col)}${row + 1}`;
}

/**
 * Slice an SVG into 1m×1m tiles
 * @param {string} svgContent - The SVG content as a string
 * @param {Object} dimensions - Design dimensions in mm
 * @param {number} dimensions.width - Width in mm
 * @param {number} dimensions.length - Length/height in mm
 * @param {string} designName - Name for the design (used in filenames)
 * @returns {Promise<Blob>} ZIP file blob containing all tiles
 */
export async function sliceSvgIntoTiles(svgContent, dimensions, designName = 'design') {
  const tileSize = 1000; // 1m = 1000mm

  // Calculate grid dimensions
  const cols = Math.ceil(dimensions.width / tileSize);
  const rows = Math.ceil(dimensions.length / tileSize);

  console.log(`[SLICER] Creating ${cols}×${rows} grid (${cols * rows} tiles) for ${dimensions.width}mm × ${dimensions.length}mm design`);

  // Parse the SVG to extract content
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svgElement = svgDoc.querySelector('svg');

  if (!svgElement) {
    throw new Error('Invalid SVG content');
  }

  // Get inner content (everything inside the <svg> tag)
  const innerContent = svgElement.innerHTML;

  // Get any existing attributes we want to preserve (like xmlns)
  const xmlns = svgElement.getAttribute('xmlns') || 'http://www.w3.org/2000/svg';

  // Create ZIP file
  const zip = new JSZip();
  const tilesFolder = zip.folder('tiles');

  // Generate each tile
  const tileNames = [];

  for (let row = 0; row < rows; row++) {
    const rowNames = [];
    for (let col = 0; col < cols; col++) {
      const tileName = getTileName(col, row);
      rowNames.push(tileName);

      // Calculate viewBox for this tile
      const x = col * tileSize;
      const y = row * tileSize;

      // For edge tiles, we might have partial tiles
      // But we still use full 1000mm viewBox - content outside will be clipped
      const viewBox = `${x} ${y} ${tileSize} ${tileSize}`;

      // Create tile SVG
      const tileSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="${xmlns}" viewBox="${viewBox}" width="${tileSize}mm" height="${tileSize}mm">
${innerContent}
</svg>`;

      // Add to ZIP
      const filename = `${sanitizeFilename(designName)}_${tileName}.svg`;
      tilesFolder.file(filename, tileSvg);
    }
    tileNames.push(rowNames);
  }

  // Create layout guide
  const layoutGuide = generateLayoutGuide(tileNames, dimensions, designName);
  zip.file('layout-guide.txt', layoutGuide);

  // Generate ZIP blob
  const blob = await zip.generateAsync({ type: 'blob' });

  console.log(`[SLICER] Created ZIP with ${cols * rows} tiles`);

  return blob;
}

/**
 * Generate a layout guide showing tile arrangement
 * @param {string[][]} tileNames - 2D array of tile names
 * @param {Object} dimensions - Design dimensions
 * @param {string} designName - Design name
 * @returns {string} Layout guide text
 */
function generateLayoutGuide(tileNames, dimensions, designName) {
  const rows = tileNames.length;
  const cols = tileNames[0].length;

  let guide = `TPV Studio - Tile Layout Guide
================================

Design: ${designName}
Total Size: ${dimensions.width}mm × ${dimensions.length}mm (${dimensions.width / 1000}m × ${dimensions.length / 1000}m)
Tile Size: 1000mm × 1000mm (1m × 1m)
Grid: ${cols} columns × ${rows} rows (${cols * rows} tiles)

Layout (view from above):
-------------------------

`;

  // Create visual grid
  const cellWidth = 6; // Width of each cell in characters

  // Top border
  guide += '┌' + ('─'.repeat(cellWidth) + '┬').repeat(cols - 1) + '─'.repeat(cellWidth) + '┐\n';

  for (let row = 0; row < rows; row++) {
    // Cell content
    guide += '│';
    for (let col = 0; col < cols; col++) {
      const name = tileNames[row][col];
      const padding = cellWidth - name.length;
      const leftPad = Math.floor(padding / 2);
      const rightPad = padding - leftPad;
      guide += ' '.repeat(leftPad) + name + ' '.repeat(rightPad) + '│';
    }
    guide += '\n';

    // Row separator or bottom border
    if (row < rows - 1) {
      guide += '├' + ('─'.repeat(cellWidth) + '┼').repeat(cols - 1) + '─'.repeat(cellWidth) + '┤\n';
    } else {
      guide += '└' + ('─'.repeat(cellWidth) + '┴').repeat(cols - 1) + '─'.repeat(cellWidth) + '┘\n';
    }
  }

  guide += `
Installation Notes:
-------------------
- Each tile is exactly 1m × 1m
- Tiles are named by column (A-Z) and row (1-${rows})
- Start from top-left corner (A1) when laying out
- Tiles align perfectly when placed edge-to-edge
- Edge tiles may contain partial content if design isn't exactly divisible by 1m

Generated by TPV Studio
`;

  return guide;
}

/**
 * Sanitize filename to remove invalid characters
 * @param {string} name - Original name
 * @returns {string} Sanitized name
 */
function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

/**
 * Download a blob as a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - Filename for download
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Slice SVG and download as ZIP
 * @param {string} svgUrl - URL of the SVG to slice
 * @param {Object} dimensions - Design dimensions in mm
 * @param {number} dimensions.width - Width in mm
 * @param {number} dimensions.length - Length/height in mm
 * @param {string} designName - Name for the design
 */
export async function downloadSvgTiles(svgUrl, dimensions, designName = 'design') {
  try {
    // Fetch SVG content
    const response = await fetch(svgUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.statusText}`);
    }

    const svgContent = await response.text();

    // Slice into tiles
    const zipBlob = await sliceSvgIntoTiles(svgContent, dimensions, designName);

    // Download ZIP
    const filename = `${sanitizeFilename(designName)}-tiles-1mx1m.zip`;
    downloadBlob(zipBlob, filename);

    console.log(`[SLICER] Downloaded ${filename}`);

    return true;
  } catch (error) {
    console.error('[SLICER] Failed to download tiles:', error);
    throw error;
  }
}
