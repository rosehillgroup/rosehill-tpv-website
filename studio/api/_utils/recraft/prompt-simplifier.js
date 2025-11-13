// Recraft Prompt Simplifier - Simple regex-based prompt cleaning
// Removes problematic words that lead to unwanted elements (playground equipment, people, etc.)

/**
 * Simplify user prompt for Recraft
 * Removes problematic words that lead to unwanted elements
 * Returns clean visual description of what user wants to see
 *
 * @param {string} userPrompt - Original user prompt
 * @returns {Promise<string>} Simplified prompt for Recraft
 */
export async function simplifyPrompt(userPrompt) {
  if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim().length === 0) {
    throw new Error('userPrompt is required');
  }

  console.log('[PROMPT-SIMPLIFIER] Input:', userPrompt);

  const startTime = Date.now();

  // List of problematic words that cause unwanted elements
  const problematicWords = [
    'playground', 'playgrounds',
    'children', 'child', 'kids', 'kid',
    'people', 'person', 'figures',
    'equipment', 'structure', 'structures',
    'slide', 'slides', 'swing', 'swings',
    'climbing frame', 'bench', 'benches',
    'furniture'
  ];

  let simplified = userPrompt;

  // Remove problematic words (case-insensitive)
  problematicWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    simplified = simplified.replace(regex, '');
  });

  // Clean up extra spaces
  simplified = simplified.replace(/\s+/g, ' ').trim();

  // If everything was removed, return original prompt as last resort
  if (simplified.length === 0) {
    console.warn('[PROMPT-SIMPLIFIER] Removed everything, using original');
    simplified = userPrompt;
  }

  const elapsed = Date.now() - startTime;
  console.log(`[PROMPT-SIMPLIFIER] Output (${elapsed}ms):`, simplified);

  return simplified;
}
