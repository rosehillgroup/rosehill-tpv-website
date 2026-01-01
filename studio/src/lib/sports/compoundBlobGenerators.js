/**
 * TPV Studio - Compound Blob Generators
 * Generate multi-element blob shapes (splash, cloud, flower, abstract)
 */

import { generateBlobFromStyle, seededRandom } from './blobGeometry.js';

/**
 * Compound blob style definitions
 */
export const COMPOUND_BLOB_STYLES = {
  splash: {
    name: 'Splash / Water',
    description: 'Central splash with flying droplets',
    icon: '💦',
    defaultSize: { width: 4000, height: 4000 }
  },
  cloud: {
    name: 'Cloud / Fluffy',
    description: 'Layered cumulus cloud with bumps',
    icon: '☁️',
    defaultSize: { width: 5000, height: 3000 }
  },
  flower: {
    name: 'Flower / Organic',
    description: 'Center with surrounding petals',
    icon: '🌸',
    defaultSize: { width: 4000, height: 4000 }
  },
  abstract: {
    name: 'Abstract / Artistic',
    description: 'Overlapping organic forms',
    icon: '🎨',
    defaultSize: { width: 5000, height: 5000 }
  }
};

/**
 * Generate a splash/water compound blob
 * Creates a central splash with radiating droplets
 *
 * @param {Object} params
 * @param {number} params.centerX - Center X position
 * @param {number} params.centerY - Center Y position
 * @param {number} params.totalWidth - Total width of compound
 * @param {number} params.totalHeight - Total height of compound
 * @param {number} params.seed - Random seed for reproducibility
 * @param {Object} params.primaryColor - Primary fill color
 * @param {Object} params.secondaryColor - Secondary fill color (for droplets)
 * @returns {Array} Array of shape configs
 */
export function generateSplashCompound({
  centerX,
  centerY,
  totalWidth,
  totalHeight,
  seed,
  primaryColor,
  secondaryColor
}) {
  const rng = seededRandom(seed);
  const shapes = [];

  // Main splash body (55-70% of total size)
  const mainSizeRatio = 0.55 + rng() * 0.15;
  const mainWidth = totalWidth * mainSizeRatio;
  const mainHeight = totalHeight * mainSizeRatio;

  shapes.push({
    shapeType: 'blob',
    blobStyle: 'splashy',
    width_mm: mainWidth,
    height_mm: mainHeight,
    position: {
      x: centerX - mainWidth / 2,
      y: centerY - mainHeight / 2
    },
    seed: seed,
    fillColor: primaryColor,
    rotation: 0
  });

  // Droplets (5-9 small blobs around the main)
  const dropletCount = 5 + Math.floor(rng() * 5);
  const minRadius = Math.min(totalWidth, totalHeight) * 0.5;

  for (let i = 0; i < dropletCount; i++) {
    // Distribute droplets around the perimeter
    const baseAngle = (i / dropletCount) * Math.PI * 2;
    const angleVariation = (rng() - 0.5) * 0.6;
    const angle = baseAngle + angleVariation;

    // Distance from center (60-95% of radius)
    const distanceRatio = 0.6 + rng() * 0.35;
    const distance = minRadius * distanceRatio;

    // Droplet size (8-16% of total)
    const dropletSize = (0.08 + rng() * 0.08) * Math.min(totalWidth, totalHeight);

    // Position
    const dropletX = centerX + Math.cos(angle) * distance - dropletSize / 2;
    const dropletY = centerY + Math.sin(angle) * distance - dropletSize / 2;

    shapes.push({
      shapeType: 'blob',
      blobStyle: 'organic',
      width_mm: dropletSize,
      height_mm: dropletSize * (0.8 + rng() * 0.4), // Slight variation in aspect
      position: { x: dropletX, y: dropletY },
      seed: seed + i + 1,
      fillColor: secondaryColor || primaryColor,
      rotation: rng() * 360
    });
  }

  return shapes;
}

/**
 * Generate a cloud/fluffy compound blob
 * Creates layered bumps forming a cumulus-like cloud
 *
 * @param {Object} params - Same as generateSplashCompound
 * @returns {Array} Array of shape configs
 */
export function generateCloudCompound({
  centerX,
  centerY,
  totalWidth,
  totalHeight,
  seed,
  primaryColor,
  secondaryColor
}) {
  const rng = seededRandom(seed);
  const shapes = [];

  // Base layer (wide, flat blob at bottom)
  const baseWidth = totalWidth * 0.9;
  const baseHeight = totalHeight * 0.45;
  const baseY = centerY + totalHeight * 0.15;

  shapes.push({
    shapeType: 'blob',
    blobStyle: 'cloudy',
    width_mm: baseWidth,
    height_mm: baseHeight,
    position: {
      x: centerX - baseWidth / 2,
      y: baseY - baseHeight / 2
    },
    seed: seed,
    fillColor: primaryColor,
    rotation: 0
  });

  // Bumps on top (4-7 overlapping circles)
  const bumpCount = 4 + Math.floor(rng() * 4);
  const bumpRowY = centerY - totalHeight * 0.15;

  for (let i = 0; i < bumpCount; i++) {
    // Distribute bumps across the top
    const xPosition = (i - (bumpCount - 1) / 2) / ((bumpCount - 1) / 2 || 1);
    const xOffset = xPosition * totalWidth * 0.35;

    // Random size variation
    const bumpSize = (0.25 + rng() * 0.15) * Math.min(totalWidth, totalHeight);

    // Slight y variation
    const yJitter = (rng() - 0.5) * totalHeight * 0.15;

    shapes.push({
      shapeType: 'blob',
      blobStyle: 'organic',
      width_mm: bumpSize,
      height_mm: bumpSize * 0.85,
      position: {
        x: centerX + xOffset - bumpSize / 2,
        y: bumpRowY + yJitter - bumpSize / 2
      },
      seed: seed + i + 1,
      fillColor: secondaryColor || primaryColor,
      rotation: rng() * 20 - 10
    });
  }

  return shapes;
}

/**
 * Generate a flower/organic compound blob
 * Creates a center with surrounding petals
 *
 * @param {Object} params - Same as generateSplashCompound
 * @returns {Array} Array of shape configs
 */
export function generateFlowerCompound({
  centerX,
  centerY,
  totalWidth,
  totalHeight,
  seed,
  primaryColor,
  secondaryColor
}) {
  const rng = seededRandom(seed);
  const shapes = [];

  const petalCount = 5 + Math.floor(rng() * 4); // 5-8 petals
  const minDimension = Math.min(totalWidth, totalHeight);

  // Generate petals first (so center overlays them)
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2 - Math.PI / 2; // Start from top

    // Petal dimensions
    const petalWidth = (0.22 + rng() * 0.08) * minDimension;
    const petalHeight = (0.35 + rng() * 0.1) * minDimension;

    // Distance from center to petal center
    const distance = minDimension * 0.28;

    // Calculate petal position
    const petalX = centerX + Math.cos(angle) * distance - petalWidth / 2;
    const petalY = centerY + Math.sin(angle) * distance - petalHeight / 2;

    // Rotation to point outward
    const petalRotation = (angle * 180 / Math.PI) + 90;

    shapes.push({
      shapeType: 'blob',
      blobStyle: 'organic',
      width_mm: petalWidth,
      height_mm: petalHeight,
      position: { x: petalX, y: petalY },
      seed: seed + i + 1,
      fillColor: primaryColor,
      rotation: petalRotation
    });
  }

  // Center circle (15-22% of total size)
  const centerSize = (0.15 + rng() * 0.07) * minDimension;

  shapes.push({
    shapeType: 'blob',
    blobStyle: 'organic',
    width_mm: centerSize,
    height_mm: centerSize,
    position: {
      x: centerX - centerSize / 2,
      y: centerY - centerSize / 2
    },
    seed: seed,
    fillColor: secondaryColor || primaryColor,
    rotation: 0
  });

  return shapes;
}

/**
 * Generate an abstract/artistic compound blob
 * Creates overlapping organic forms
 *
 * @param {Object} params - Same as generateSplashCompound
 * @returns {Array} Array of shape configs
 */
export function generateAbstractCompound({
  centerX,
  centerY,
  totalWidth,
  totalHeight,
  seed,
  primaryColor,
  secondaryColor
}) {
  const rng = seededRandom(seed);
  const shapes = [];

  const formCount = 3 + Math.floor(rng() * 3); // 3-5 forms
  const styles = ['organic', 'splashy', 'cloudy', 'rocky'];

  // Color palette for abstract - alternate between primary and secondary
  const colors = [primaryColor, secondaryColor || primaryColor];

  for (let i = 0; i < formCount; i++) {
    // Random size (25-50% of total dimensions)
    const width = (0.25 + rng() * 0.25) * totalWidth;
    const height = (0.25 + rng() * 0.25) * totalHeight;

    // Random offset from center
    const offsetX = (rng() - 0.5) * totalWidth * 0.4;
    const offsetY = (rng() - 0.5) * totalHeight * 0.4;

    // Random rotation
    const rotation = rng() * 360;

    // Random style
    const style = styles[Math.floor(rng() * styles.length)];

    // Alternate colors
    const color = colors[i % colors.length];

    shapes.push({
      shapeType: 'blob',
      blobStyle: style,
      width_mm: width,
      height_mm: height,
      position: {
        x: centerX + offsetX - width / 2,
        y: centerY + offsetY - height / 2
      },
      seed: seed + i,
      fillColor: color,
      rotation: rotation
    });
  }

  return shapes;
}

/**
 * Generate compound blob shapes based on style
 *
 * @param {string} compoundType - 'splash' | 'cloud' | 'flower' | 'abstract'
 * @param {Object} params - Generation parameters
 * @returns {Array} Array of shape configs
 */
export function generateCompoundBlob(compoundType, params) {
  switch (compoundType) {
    case 'splash':
      return generateSplashCompound(params);
    case 'cloud':
      return generateCloudCompound(params);
    case 'flower':
      return generateFlowerCompound(params);
    case 'abstract':
      return generateAbstractCompound(params);
    default:
      console.warn(`Unknown compound type: ${compoundType}, defaulting to splash`);
      return generateSplashCompound(params);
  }
}
