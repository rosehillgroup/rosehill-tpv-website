// Mask Generator for TPV Studio Multi-Pass Pipeline
// Generates binary masks with interior feathering for seamless compositing

/**
 * Convert array of {x, y} points to SVG path data
 * @param {Array} points - Array of {x, y} coordinate objects
 * @returns {string} SVG path data string
 */
function pointsToSVGPath(points) {
  if (!points || points.length === 0) return '';

  const firstPoint = points[0];
  let pathData = `M ${firstPoint.x} ${firstPoint.y}`;

  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i].x} ${points[i].y}`;
  }

  pathData += ' Z'; // Close path
  return pathData;
}

/**
 * Generate a binary mask for a single region with interior feathering
 * @param {Object} region - Region object with points array
 * @param {Object} dimensions - {width, height} in pixels
 * @param {number} featherPx - Feather radius in pixels (applied inside region)
 * @returns {Promise<Buffer>} PNG buffer (white inside, black outside, soft edge)
 */
export async function generateRegionMask(region, dimensions, featherPx = 2) {
  const { width, height } = dimensions;

  console.log(`[MASK] Generating region mask: ${width}×${height}px, feather: ${featherPx}px`);

  // Build SVG with white region on black background
  const pathData = pointsToSVGPath(region.points);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#000000"/>
  <path d="${pathData}" fill="#FFFFFF"/>
</svg>`;

  // Import sharp dynamically
  const sharp = (await import('sharp')).default;

  // Render SVG to PNG
  let maskBuffer = await sharp(Buffer.from(svg))
    .resize(width, height, {
      fit: 'fill',
      kernel: 'nearest'
    })
    .toBuffer();

  // Apply interior feathering if requested
  if (featherPx > 0) {
    const { data, info } = await sharp(maskBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Apply Gaussian blur
    const blurred = await sharp(maskBuffer)
      .blur(featherPx)
      .toBuffer();

    // Threshold at 240 to keep soft edge inside only
    // This prevents feathering from extending outside the region
    const thresholded = await sharp(blurred)
      .threshold(240)
      .toBuffer();

    maskBuffer = await sharp(thresholded)
      .png({ compressionLevel: 9 })
      .toBuffer();
  } else {
    maskBuffer = await sharp(maskBuffer)
      .png({ compressionLevel: 9 })
      .toBuffer();
  }

  console.log(`[MASK] Generated mask: ${maskBuffer.length} bytes`);
  return maskBuffer;
}

/**
 * Generate role-grouped masks (base, accent, highlight)
 * Role-first ordering prevents motifs from being washed by later accent passes
 * @param {Array} regions - Array of region objects with colorRole property
 * @param {Object} dimensions - {width, height} in pixels
 * @param {number} featherPx - Feather radius in pixels
 * @returns {Promise<Object>} Map of role → mask buffer
 */
export async function generateRoleMasks(regions, dimensions, featherPx = 2) {
  console.log(`[MASK] Generating role-grouped masks for ${regions.length} regions`);

  const { width, height } = dimensions;
  const sharp = (await import('sharp')).default;

  // Group regions by role
  const roleGroups = {
    base: regions.filter(r => r.colorRole === 'base'),
    accent: regions.filter(r => r.colorRole === 'accent'),
    highlight: regions.filter(r => r.colorRole === 'highlight')
  };

  console.log(`[MASK] Role distribution: base=${roleGroups.base.length}, accent=${roleGroups.accent.length}, highlight=${roleGroups.highlight.length}`);

  const roleMasks = {};

  for (const [role, roleRegions] of Object.entries(roleGroups)) {
    if (roleRegions.length === 0) {
      console.log(`[MASK] No ${role} regions, skipping mask`);
      continue;
    }

    // Build SVG with all regions of this role as white on black
    const paths = roleRegions.map(region => {
      const pathData = pointsToSVGPath(region.points);
      return `<path d="${pathData}" fill="#FFFFFF"/>`;
    }).join('\n');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#000000"/>
  ${paths}
</svg>`;

    // Render and feather
    let maskBuffer = await sharp(Buffer.from(svg))
      .resize(width, height, {
        fit: 'fill',
        kernel: 'nearest'
      })
      .toBuffer();

    if (featherPx > 0) {
      const blurred = await sharp(maskBuffer)
        .blur(featherPx)
        .toBuffer();

      maskBuffer = await sharp(blurred)
        .threshold(240)
        .png({ compressionLevel: 9 })
        .toBuffer();
    } else {
      maskBuffer = await sharp(maskBuffer)
        .png({ compressionLevel: 9 })
        .toBuffer();
    }

    roleMasks[role] = maskBuffer;
    console.log(`[MASK] Generated ${role} mask: ${maskBuffer.length} bytes`);
  }

  return roleMasks;
}

/**
 * Generate individual motif masks for fine-grained refinement
 * Only for highlight-role regions with recognizable motifs
 * @param {Array} regions - Array of region objects
 * @param {Object} dimensions - {width, height} in pixels
 * @param {number} featherPx - Feather radius in pixels
 * @returns {Promise<Array>} Array of {regionIndex, maskBuffer}
 */
export async function generateMotifMasks(regions, dimensions, featherPx = 2) {
  console.log(`[MASK] Generating individual motif masks`);

  // Filter for highlight regions only
  const motifRegions = regions
    .map((region, index) => ({ region, index }))
    .filter(({ region }) => region.colorRole === 'highlight');

  if (motifRegions.length === 0) {
    console.log(`[MASK] No highlight regions, skipping motif masks`);
    return [];
  }

  const motifMasks = [];

  for (const { region, index } of motifRegions) {
    const maskBuffer = await generateRegionMask(region, dimensions, featherPx);
    motifMasks.push({
      regionIndex: index,
      role: region.colorRole,
      color: region.color,
      maskBuffer
    });
  }

  console.log(`[MASK] Generated ${motifMasks.length} motif masks`);
  return motifMasks;
}

/**
 * Generate a union mask of all regions (for full-image operations)
 * @param {Array} regions - Array of region objects
 * @param {Object} dimensions - {width, height} in pixels
 * @returns {Promise<Buffer>} PNG buffer (white where any region exists, black elsewhere)
 */
export async function generateUnionMask(regions, dimensions) {
  console.log(`[MASK] Generating union mask for ${regions.length} regions`);

  const { width, height } = dimensions;
  const sharp = (await import('sharp')).default;

  // Build SVG with all regions as white on black
  const paths = regions.map(region => {
    const pathData = pointsToSVGPath(region.points);
    return `<path d="${pathData}" fill="#FFFFFF"/>`;
  }).join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#000000"/>
  ${paths}
</svg>`;

  const maskBuffer = await sharp(Buffer.from(svg))
    .resize(width, height, {
      fit: 'fill',
      kernel: 'nearest'
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  console.log(`[MASK] Generated union mask: ${maskBuffer.length} bytes`);
  return maskBuffer;
}
