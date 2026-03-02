// Recraft Prompt Simplifier - Wraps user prompts with TPV surfacing constraints
// Ensures generated designs are suitable for poured rubber granule surfaces

/**
 * Simplify and constrain user prompt for Recraft SVG generation.
 * Prepends TPV surfacing rules so Recraft produces flat, bold, simple designs
 * suitable for rubber granule installation. Also removes problematic words
 * that tend to generate unwanted 3D elements.
 *
 * @param {string} userPrompt - Original user prompt
 * @returns {Promise<string>} Constrained prompt for Recraft
 */
export async function simplifyPrompt(userPrompt) {
  if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim().length === 0) {
    throw new Error('userPrompt is required');
  }

  console.log('[PROMPT-SIMPLIFIER] Input:', userPrompt);

  const startTime = Date.now();

  // TPV surfacing constraints — prepended to every prompt
  const prefix = [
    'Flat 2D top-down vector illustration suitable for a poured rubber granule surface.',
    'Design rules: bold simple shapes, smooth curves, no fine detail smaller than a fist.',
    'Solid opaque flat-colour fills only — absolutely no gradients, no transparency, no opacity, no shading, no strokes, no outlines.',
    'No 3D, no perspective, no shadows, no realistic textures.',
    'Maximum 8-10 distinct colours. Shapes should be large and clearly separated.',
    'Think bold graphic mural, not detailed illustration.',
    '',
    'Subject:'
  ].join(' ');

  // Remove problematic words that cause unwanted 3D/structural elements
  const problematicWords = [
    'playground', 'playgrounds',
    'children', 'child', 'kids', 'kid',
    'people', 'person', 'figures',
    'equipment', 'structure', 'structures',
    'slide', 'slides', 'swing', 'swings',
    'climbing frame', 'bench', 'benches',
    'furniture'
  ];

  let cleaned = userPrompt;

  // Remove problematic words (case-insensitive)
  problematicWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '');
  });

  // Clean up extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // If everything was removed, return original prompt as last resort
  if (cleaned.length === 0) {
    console.warn('[PROMPT-SIMPLIFIER] Removed everything, using original');
    cleaned = userPrompt;
  }

  const result = `${prefix} ${cleaned}`;

  const elapsed = Date.now() - startTime;
  console.log(`[PROMPT-SIMPLIFIER] Output (${elapsed}ms):`, result);

  return result;
}
