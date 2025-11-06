// TPV Studio - Preprocessing Utilities
// Handles stencil generation and upload for SDXL img2img

import { generateFlatStencil, renderStencilToSVG, rasterizeStencilToPNG } from './stencil-generator.js';
import { selectModelAspect } from './aspect-resolver.js';
import { uploadToStorage } from './exports.js';

const TPV_PALETTE = [
  { code: "RH30", name: "Beige", hex: "#E4C4AA" },
  { code: "RH31", name: "Cream", hex: "#E8E3D8" },
  { code: "RH41", name: "Bright Yellow", hex: "#FFD833" },
  { code: "RH40", name: "Mustard", hex: "#E5A144" },
  { code: "RH50", name: "Orange", hex: "#F15B32" },
  { code: "RH01", name: "Standard Red", hex: "#A5362F" },
  { code: "RH02", name: "Bright Red", hex: "#E21F2F" },
  { code: "RH90", name: "Funky Pink", hex: "#E8457E" },
  { code: "RH21", name: "Purple", hex: "#493D8C" },
  { code: "RH20", name: "Standard Blue", hex: "#0075BC" },
  { code: "RH22", name: "Light Blue", hex: "#47AFE3" },
  { code: "RH23", name: "Azure", hex: "#039DC4" },
  { code: "RH26", name: "Turquoise", hex: "#00A6A3" },
  { code: "RH12", name: "Dark Green", hex: "#006C55" },
  { code: "RH10", name: "Standard Green", hex: "#609B63" },
  { code: "RH11", name: "Bright Green", hex: "#3BB44A" },
  { code: "RH32", name: "Brown", hex: "#8B5F3C" },
  { code: "RH65", name: "Pale Grey", hex: "#D9D9D6" },
  { code: "RH61", name: "Light Grey", hex: "#939598" },
  { code: "RH60", name: "Dark Grey", hex: "#59595B" },
  { code: "RH70", name: "Black", hex: "#231F20" }
];

/**
 * Resolve palette colors from codes
 */
function resolvePaletteColors(colorCodes) {
  if (!colorCodes || colorCodes.length === 0) {
    return null;
  }

  const colors = [];
  for (const item of colorCodes) {
    const code = typeof item === 'string' ? item : item.code;
    const color = TPV_PALETTE.find(c => c.code === code);
    if (!color) {
      throw new Error(`Unknown TPV color code: ${code}`);
    }
    colors.push(color);
  }

  return colors;
}

/**
 * Generate stencil and upload to storage
 * Returns: { stencilUrl, metadata }
 */
export async function generateAndUploadStencil(inputs) {
  const { surface, palette_colors } = inputs;

  console.log('[PREPROCESS] Generating stencil for surface:', surface);

  // Step 1: Resolve aspect ratio
  const aspectInfo = selectModelAspect(surface.width_m, surface.height_m);
  console.log(`[PREPROCESS] Model aspect: ${aspectInfo.ratio} (${aspectInfo.width}×${aspectInfo.height})`);

  // Step 2: Resolve palette
  const selectedColors = resolvePaletteColors(palette_colors);
  const targetPalette = selectedColors || TPV_PALETTE.slice(0, 6);
  console.log(`[PREPROCESS] Palette: ${targetPalette.map(c => c.code).join(', ')}`);

  // Step 3: Generate flat stencil
  const stencilRegions = generateFlatStencil(
    { width_m: aspectInfo.width / 100, height_m: aspectInfo.height / 100 },
    targetPalette,
    {
      strategy: 'voronoi',
      seed: Date.now(),
      minRegions: 6,
      maxRegions: 10,
      minFeatureSize_m: 0.8
    }
  );

  const stencilSVG = renderStencilToSVG(
    stencilRegions,
    { width_m: aspectInfo.width / 100, height_m: aspectInfo.height / 100 }
  );

  const stencilPNG = await rasterizeStencilToPNG(stencilSVG, aspectInfo.width, aspectInfo.height);

  // Step 4: Upload to storage
  const jobId = inputs.jobId || `job_${Date.now()}`;
  const stencilFilename = `stencil_${jobId}_${Date.now()}.png`;
  const stencilUrl = await uploadToStorage(stencilPNG, stencilFilename, 'tpv-studio');

  console.log(`[PREPROCESS] Stencil uploaded: ${stencilUrl}`);

  return {
    stencilUrl,
    metadata: {
      aspectInfo,
      targetPalette,
      stencilFilename
    }
  };
}

/**
 * Build Replicate prediction input payload
 */
export function buildReplicateInput(inputs, stencilUrl, metadata) {
  const { prompt, style, count } = inputs;
  const { aspectInfo } = metadata;

  // Enhanced prompt for flat vector style
  const enhancedPrompt = `${prompt}. flat vector art, screen print design, bold graphic illustration, paper cutout style, clean edges, solid color fills, installer-friendly geometry`;

  return {
    prompt: enhancedPrompt,
    image: stencilUrl,  // Replicate img2img parameter name
    num_outputs: count || 6,
    width: aspectInfo.width,
    height: aspectInfo.height,
    prompt_strength: 0.7,  // How much to respect the stencil (1 - denoise_strength)
    guidance_scale: 6.0,
    num_inference_steps: 20,
    scheduler: "K_EULER"
  };
}
