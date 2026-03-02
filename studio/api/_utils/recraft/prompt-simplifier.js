// Recraft Prompt Simplifier - Intelligent prompt refinement via Claude Haiku
// Rewrites user prompts to produce recognisable flat vector art suitable for rubber surfacing

import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You refine user prompts for Recraft, a vector SVG image generator.
The artwork will be used for poured rubber granule surfacing.

Your job: enhance the user's prompt with style guidance while keeping EVERY specific detail they mentioned.

RULES:
1. NEVER drop, generalise, or summarise the user's details. "Magician pulling a rabbit out of a top hat" must keep magician, rabbit, AND top hat — not become "magician performing trick".
2. Keep the user's words as the core of the prompt. Add style/medium descriptors around them, don't rewrite their subject.
3. Append these style cues: flat vector illustration, bold simplified shapes, solid opaque colour fills, clean geometry, no gradients, no transparency, no shading
4. Only remove references to: playground equipment, children, people, furniture
5. Output ONLY the refined prompt. No explanation, no quotes.

Example:
User: "magician pulling a rabbit out of a top hat"
Output: "Magician pulling a rabbit out of a top hat, flat vector illustration, bold simplified shapes, solid opaque colour fills, clean geometry, no gradients, no shading"`;

/**
 * Refine user prompt for Recraft SVG generation via Claude Haiku.
 * Preserves subject matter while adding flat vector style guidance
 * appropriate for rubber granule surfacing.
 *
 * Falls back to basic word removal if Haiku is unavailable.
 *
 * @param {string} userPrompt - Original user prompt
 * @returns {Promise<string>} Refined prompt for Recraft
 */
export async function simplifyPrompt(userPrompt) {
  if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim().length === 0) {
    throw new Error('userPrompt is required');
  }

  console.log('[PROMPT-SIMPLIFIER] Input:', userPrompt);

  const startTime = Date.now();

  // Try Claude Haiku refinement first
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn('[PROMPT-SIMPLIFIER] No ANTHROPIC_API_KEY, falling back to basic cleanup');
      return basicCleanup(userPrompt);
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const refined = response.content[0]?.text?.trim();

    if (!refined || refined.length === 0) {
      console.warn('[PROMPT-SIMPLIFIER] Empty Haiku response, falling back');
      return basicCleanup(userPrompt);
    }

    const elapsed = Date.now() - startTime;
    console.log(`[PROMPT-SIMPLIFIER] Haiku refined (${elapsed}ms):`, refined);

    return refined;
  } catch (error) {
    console.error('[PROMPT-SIMPLIFIER] Haiku failed, falling back:', error.message);
    return basicCleanup(userPrompt);
  }
}

/**
 * Basic fallback: remove problematic words without adding constraints.
 * Used when Claude Haiku is unavailable.
 */
function basicCleanup(userPrompt) {
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

  problematicWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '');
  });

  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  if (cleaned.length === 0) {
    cleaned = userPrompt;
  }

  console.log('[PROMPT-SIMPLIFIER] Basic cleanup:', cleaned);
  return cleaned;
}
