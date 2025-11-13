// Parse motif SVG files and generate motifs.js library
// Usage: node parse-motifs.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOTIFS_DIR = path.join(__dirname, '..', 'motifs');
const OUTPUT_FILE = path.join(__dirname, 'api', '_utils', 'geometric', 'motifs-generated.js');

// Motif categories to process
const CATEGORIES = [
  'Alphabet',
  'FastFood',
  'Gym',
  'Landmarks',
  'Nature',
  'Ocean',
  'Space',
  'Spring',
  'Transport',
  'Trees'
];

/**
 * Parse SVG file and extract path data
 */
function parseSVG(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract viewBox
  const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 64 64';

  // Extract all path elements and combine their d attributes
  const pathMatches = content.matchAll(/<path[^>]*d="([^"]+)"[^>]*>/g);
  const paths = Array.from(pathMatches).map(match => match[1]);

  // Combine all paths into single path data
  const pathData = paths.join(' ');

  return { viewBox, pathData };
}

/**
 * Generate motif entry for JavaScript
 */
function generateMotifEntry(name, categoryName, svgData, index) {
  // Create a safe JavaScript key from the filename
  const keyName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

  const fullKey = `${categoryName}_${keyName}`;

  // Center the viewBox (SVGs are 0 0 64 64, center to -32 -32 64 64)
  const centeredViewBox = '-32 -32 64 64';

  return {
    key: fullKey,
    name: name,
    category: categoryName,
    object: `  '${fullKey}': {
    name: '${name}',
    category: '${categoryName}',
    nominalSize: 1000, // mm at surface
    minScale: 0.6,
    maxScale: 1.5,
    pathData: '${svgData.pathData.replace(/'/g, "\\'")}',
    viewBox: '${centeredViewBox}',
    anchorPoint: { x: 0, y: 0 }
  }`
  };
}

/**
 * Process all motif categories
 */
function processMotifs() {
  const allMotifs = [];
  const categoryStats = {};

  for (const category of CATEGORIES) {
    const categoryDir = path.join(MOTIFS_DIR, category);

    if (!fs.existsSync(categoryDir)) {
      console.log(`⚠️  Category not found: ${category}`);
      continue;
    }

    const files = fs.readdirSync(categoryDir)
      .filter(f => f.endsWith('.svg'))
      .sort();

    categoryStats[category] = files.length;
    console.log(`📁 ${category}: ${files.length} motifs`);

    files.forEach((file, index) => {
      const filePath = path.join(categoryDir, file);
      const name = file.replace('.svg', '');
      const svgData = parseSVG(filePath);

      const motifEntry = generateMotifEntry(
        name,
        category.toLowerCase(),
        svgData,
        index
      );

      allMotifs.push(motifEntry);
    });
  }

  return { allMotifs, categoryStats };
}

/**
 * Generate motifs.js file content
 */
function generateMotifsFile(allMotifs, categoryStats) {
  const totalMotifs = allMotifs.length;
  const categoryList = Object.entries(categoryStats)
    .map(([cat, count]) => `//   - ${cat}: ${count} motifs`)
    .join('\n');

  const motifsObject = allMotifs.map(m => m.object).join(',\n\n');

  return `// TPV Studio - Motif Library (Auto-generated)
// Generated: ${new Date().toISOString()}
// Total motifs: ${totalMotifs} across ${Object.keys(categoryStats).length} categories
//
// Categories:
${categoryList}

/**
 * Motif library - each motif is a reusable SVG shape
 * All shapes designed with min 600mm inside radius at nominal 1000mm size
 *
 * Structure:
 * - nominalSize: Standard size in mm at surface (typically 1000mm)
 * - minScale/maxScale: Allowed scaling range for manufacturing compliance
 * - pathData: SVG path data (extracted from source files)
 * - viewBox: SVG viewBox for proper scaling (centered at 0,0)
 * - anchorPoint: Center point for rotation and positioning
 */
export const MOTIF_LIBRARY = {
${motifsObject}
};

/**
 * Get all motifs for a specific category
 * @param {string} categoryName - Category name (e.g., 'ocean', 'fastfood', 'gym')
 * @returns {Array} Array of motif keys in that category
 */
export function getMotifsByCategory(categoryName) {
  const category = categoryName.toLowerCase();
  return Object.keys(MOTIF_LIBRARY).filter(key =>
    MOTIF_LIBRARY[key].category === category
  );
}

/**
 * Get random motif from a category
 * @param {string} categoryName - Category name
 * @param {number} seed - Random seed
 * @returns {string} Motif key
 */
export function getRandomMotifFromCategory(categoryName, seed = 0) {
  const motifs = getMotifsByCategory(categoryName);
  if (motifs.length === 0) return null;

  // Seeded random
  let rng = seed;
  const random = () => {
    rng = (rng * 1664525 + 1013904223) % 4294967296;
    return rng / 4294967296;
  };

  const index = Math.floor(random() * motifs.length);
  return motifs[index];
}

/**
 * Get all available categories
 * @returns {Array} Array of category names
 */
export function getAllCategories() {
  const categories = new Set();
  Object.values(MOTIF_LIBRARY).forEach(motif => {
    categories.add(motif.category);
  });
  return Array.from(categories).sort();
}

/**
 * Generate SVG path element for a motif instance
 * @param {string} motifName - Name from MOTIF_LIBRARY
 * @param {object} transform - Position and scale
 * @param {number} transform.x - X position (mm)
 * @param {number} transform.y - Y position (mm)
 * @param {number} transform.scale - Scale factor (0.6-1.5)
 * @param {number} transform.rotation - Rotation angle (degrees)
 * @param {string} fill - Fill color (hex)
 * @param {string} id - Element ID
 * @returns {string} SVG path element
 */
export function generateMotif(motifName, transform, fill, id) {
  const motif = MOTIF_LIBRARY[motifName];
  if (!motif) {
    throw new Error(\`Unknown motif: \${motifName}\`);
  }

  const { x = 0, y = 0, scale = 1.0, rotation = 0 } = transform;

  // Clamp scale to allowed range
  const clampedScale = Math.max(motif.minScale, Math.min(motif.maxScale, scale));

  // Build transform string
  const transforms = [];
  if (x !== 0 || y !== 0) transforms.push(\`translate(\${x.toFixed(2)} \${y.toFixed(2)})\`);
  if (rotation !== 0) transforms.push(\`rotate(\${rotation.toFixed(2)})\`);
  if (clampedScale !== 1.0) transforms.push(\`scale(\${clampedScale.toFixed(3)})\`);

  const transformAttr = transforms.length > 0 ? \` transform="\${transforms.join(' ')}"\` : '';

  return \`<path id="\${id}" class="motif" data-motif="\${motifName}" fill="\${fill}"\${transformAttr} d="\${motif.pathData}"/>\`;
}

/**
 * Place motifs using Poisson disk sampling for even distribution
 * @param {object} canvas - Canvas dimensions {width_mm, height_mm}
 * @param {Array} motifSpecs - Array of {name, count, size_m: [min, max]}
 * @param {number} seed - Random seed
 * @returns {Array} Array of placed motifs with positions
 */
export function placeMotifs(canvas, motifSpecs, seed = 0) {
  // Simple seeded random
  let rng = seed;
  const random = () => {
    rng = (rng * 1664525 + 1013904223) % 4294967296;
    return rng / 4294967296;
  };

  const placed = [];
  const minSpacing = 800; // mm minimum between motif centers

  for (const spec of motifSpecs) {
    const motif = MOTIF_LIBRARY[spec.name];
    if (!motif) continue;

    const count = spec.count || 1;
    const [minSize, maxSize] = spec.size_m || [0.6, 1.0];

    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let position = null;

      // Try to find valid position (not overlapping)
      while (attempts < 50) {
        const x = random() * canvas.width_mm;
        const y = random() * canvas.height_mm;
        const sizeMeters = minSize + random() * (maxSize - minSize);
        const scale = (sizeMeters * 1000) / motif.nominalSize;
        const rotation = random() * 360;

        // Check distance from other motifs
        let tooClose = false;
        for (const other of placed) {
          const dx = x - other.x;
          const dy = y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < minSpacing) {
            tooClose = true;
            break;
          }
        }

        if (!tooClose || attempts === 49) {
          position = { x, y, scale, rotation };
          break;
        }

        attempts++;
      }

      if (position) {
        placed.push({
          name: spec.name,
          ...position
        });
      }
    }
  }

  return placed;
}

/**
 * Get bounding box of a motif at given transform
 * @param {string} motifName - Motif name
 * @param {object} transform - Transform parameters
 * @returns {object} {x, y, width, height} in mm
 */
export function getMotifBounds(motifName, transform) {
  const motif = MOTIF_LIBRARY[motifName];
  if (!motif) return { x: 0, y: 0, width: 0, height: 0 };

  const { x = 0, y = 0, scale = 1.0 } = transform;

  // Parse viewBox to get original bounds
  const [vx, vy, vw, vh] = motif.viewBox.split(' ').map(Number);

  // Apply scale
  const width = vw * scale;
  const height = vh * scale;

  return {
    x: x + (vx * scale),
    y: y + (vy * scale),
    width,
    height
  };
}
`;
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Parsing motif SVG files...\n');

  const { allMotifs, categoryStats } = processMotifs();

  console.log(`\n✅ Parsed ${allMotifs.length} motifs total`);
  console.log('\n📝 Generating motifs.js file...');

  const fileContent = generateMotifsFile(allMotifs, categoryStats);

  fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf-8');

  console.log(`✅ Generated: ${OUTPUT_FILE}`);
  console.log(`📦 File size: ${(fileContent.length / 1024).toFixed(1)} KB`);

  console.log('\n🎉 Motif library generated successfully!');
  console.log('\nNext steps:');
  console.log('1. Review the generated file');
  console.log('2. Update imports in composition.js to use new motif library');
  console.log('3. Test with geometric mode');
}

main();
