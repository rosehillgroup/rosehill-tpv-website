// SVG Loader for TPV Studio Motifs
// Dynamically loads SVG files from /motifs/ directory and extracts path data

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Handle both ESM and bundled environments
let __dirname;
try {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (e) {
  // Fallback for bundled/CommonJS environments (Netlify Functions)
  __dirname = process.cwd();
}

// Theme name to folder mapping
export const THEME_FOLDERS = {
  'ocean': 'Ocean',
  'space': 'Space',
  'food': 'FastFood',
  'gym': 'Gym',
  'transport': 'Transport',
  'alphabet': 'Alphabet',
  'nature': 'Nature',
  'spring': 'Spring',
  'landmarks': 'Landmarks',
  'trees': 'Trees',
  'generic': 'Ocean' // Fallback to Ocean for generic themes
};

// Motif cache to avoid repeated file reads
export const MOTIF_CACHE = {};
export const THEME_INDEX_CACHE = {};

/**
 * Get the motifs directory path
 * Resolves to /motifs/ from project root
 */
export function getMotifsDir() {
  // In bundled environment (Netlify Functions), use process.cwd()
  // In development, navigate up from netlify/functions/studio/_utils/
  const devPath = path.resolve(__dirname, '../../../../motifs');
  const prodPath = path.resolve(process.cwd(), 'motifs');

  // Check which path exists
  if (fs.existsSync(prodPath)) {
    return prodPath;
  } else if (fs.existsSync(devPath)) {
    return devPath;
  }

  // Fallback to prodPath (let it fail with a clear error)
  return prodPath;
}

/**
 * Parse SVG file and extract path data and viewBox
 * @param {string} svgContent - Raw SVG XML content
 * @returns {Object} {paths: string, viewBox: string}
 */
export function parseSVG(svgContent) {
  // Extract viewBox
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 64 64';

  // Extract all path d attributes
  const pathMatches = svgContent.matchAll(/<path[^>]*d="([^"]+)"[^>]*\/?>/g);
  const pathData = [];
  for (const match of pathMatches) {
    pathData.push(match[1]);
  }

  // Extract circle elements and convert to path data
  const circleMatches = svgContent.matchAll(/<circle[^>]*cx="([^"]+)"[^>]*cy="([^"]+)"[^>]*r="([^"]+)"[^>]*\/?>/g);
  for (const match of circleMatches) {
    const cx = parseFloat(match[1]);
    const cy = parseFloat(match[2]);
    const r = parseFloat(match[3]);
    // Convert circle to path using arc commands
    pathData.push(`M${cx},${cy} m-${r},0 a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 -${r * 2},0`);
  }

  // Combine all paths into a single string (space-separated)
  const paths = pathData.join(' ');

  return { paths, viewBox };
}

/**
 * Load motif by ID from theme folder
 * @param {string} id - Motif ID (e.g., 'whale', 'planet')
 * @param {string} theme - Theme name (e.g., 'ocean', 'space')
 * @returns {Object|null} Motif data or null if not found
 */
export function loadMotifFromFile(id, theme) {
  const cacheKey = `${theme}:${id}`;

  // Check cache
  if (MOTIF_CACHE[cacheKey]) {
    return MOTIF_CACHE[cacheKey];
  }

  // Get theme folder
  const folderName = THEME_FOLDERS[theme] || THEME_FOLDERS['generic'];
  const themeDir = path.join(getMotifsDir(), folderName);

  // Check if directory exists
  if (!fs.existsSync(themeDir)) {
    console.warn(`[SVG LOADER] Theme directory not found: ${themeDir}`);
    return null;
  }

  // List all SVG files in theme directory
  const files = fs.readdirSync(themeDir).filter(f => f.endsWith('.svg'));

  // Find file matching the ID (case-insensitive, partial match)
  const normalizedId = id.toLowerCase().replace(/[_-]/g, ' ');
  const matchingFile = files.find(f => {
    const fileName = f.replace('.svg', '').toLowerCase();
    // Remove leading numbers and normalize
    const cleanName = fileName.replace(/^\d+\s*/, '').replace(/[_-]/g, ' ');
    return cleanName.includes(normalizedId) || normalizedId.includes(cleanName);
  });

  if (!matchingFile) {
    console.warn(`[SVG LOADER] No matching file for ID "${id}" in theme "${theme}"`);
    return null;
  }

  // Read and parse SVG file
  const filePath = path.join(themeDir, matchingFile);
  const svgContent = fs.readFileSync(filePath, 'utf8');
  const { paths, viewBox } = parseSVG(svgContent);

  // Create motif object
  const motif = {
    id,
    theme,
    paths,
    viewBox,
    minSize_m: 0.3,
    maxSize_m: 1.0,
    sourceFile: matchingFile
  };

  // Cache and return
  MOTIF_CACHE[cacheKey] = motif;
  return motif;
}

/**
 * Get all motifs from a theme folder
 * @param {string} theme - Theme name
 * @returns {Array} Array of motif IDs
 */
export function listMotifsInTheme(theme) {
  // Check cache
  if (THEME_INDEX_CACHE[theme]) {
    return THEME_INDEX_CACHE[theme];
  }

  const folderName = THEME_FOLDERS[theme] || THEME_FOLDERS['generic'];
  const themeDir = path.join(getMotifsDir(), folderName);

  // Check if directory exists
  if (!fs.existsSync(themeDir)) {
    console.warn(`[SVG LOADER] Theme directory not found: ${themeDir}`);
    return [];
  }

  // List all SVG files
  const files = fs.readdirSync(themeDir).filter(f => f.endsWith('.svg'));

  // Extract IDs from filenames (remove numbers and .svg extension)
  const motifIds = files.map(f => {
    const name = f.replace('.svg', '');
    // Remove leading numbers and normalize to lowercase
    const id = name.replace(/^\d+\s*/, '').toLowerCase().replace(/\s+/g, '-');
    return id;
  });

  // Cache and return
  THEME_INDEX_CACHE[theme] = motifIds;
  return motifIds;
}

/**
 * Get random motif from theme
 * @param {string} theme - Theme name
 * @param {function} rng - Random number generator
 * @returns {Object|null} Motif data
 */
export function getRandomMotifFromTheme(theme, rng) {
  const motifIds = listMotifsInTheme(theme);

  if (motifIds.length === 0) {
    console.warn(`[SVG LOADER] No motifs found for theme: ${theme}`);
    return null;
  }

  // Pick random motif
  const randomIndex = Math.floor(rng.next() * motifIds.length);
  const motifId = motifIds[randomIndex];

  return loadMotifFromFile(motifId, theme);
}

/**
 * List all available themes
 * @returns {Array} Array of theme names
 */
export function listAvailableThemes() {
  return Object.keys(THEME_FOLDERS);
}

/**
 * Check if motifs directory exists and is accessible
 * @returns {boolean}
 */
export function validateMotifsDirectory() {
  const motifsDir = getMotifsDir();

  if (!fs.existsSync(motifsDir)) {
    console.error(`[SVG LOADER] Motifs directory not found: ${motifsDir}`);
    return false;
  }

  // Check if at least one theme folder exists
  const themes = listAvailableThemes();
  let foundTheme = false;

  for (const theme of themes) {
    const folderName = THEME_FOLDERS[theme];
    const themeDir = path.join(motifsDir, folderName);
    if (fs.existsSync(themeDir)) {
      foundTheme = true;
      const files = fs.readdirSync(themeDir).filter(f => f.endsWith('.svg'));
      console.log(`[SVG LOADER] Found ${files.length} motifs in theme: ${theme}`);
    }
  }

  return foundTheme;
}

// Validate on module load
console.log('[SVG LOADER] Initializing SVG motif loader...');
export const isValid = validateMotifsDirectory();
if (isValid) {
  console.log('[SVG LOADER] Motif library loaded successfully');
} else {
  console.warn('[SVG LOADER] Warning: Motif directory validation failed');
}



