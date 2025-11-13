// Recraft Prompt Simplifier - Claude-based prompt cleaning
// Interprets user intent and removes problematic words for Recraft generation

import Anthropic from '@anthropic-ai/sdk';

/**
 * Initialize Anthropic client
 */
function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable not set');
  }
  return new Anthropic({ apiKey });
}

/**
 * Simplify user prompt for Recraft
 * Removes problematic words that lead to unwanted elements (playground equipment, people, etc.)
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

  try {
    const anthropic = getAnthropicClient();

    const systemPrompt = `You are a prompt simplifier for an AI vector illustration generator.

Your task: Interpret what the user wants to SEE visually, and output a clean simple description.

REMOVE these problematic words that cause unwanted elements:
- "playground" (causes playground equipment to appear)
- "children", "kids", "people" (causes human figures)
- "equipment", "structure", "furniture" (causes 3D objects)
- "slide", "swing", "climbing frame", "bench" (specific playground items)

KEEP:
- Visual themes (ocean, space, jungle, etc.)
- Natural elements (waves, fish, stars, trees, leaves, etc.)
- Colors and shapes (blue, circular, wavy, etc.)
- Abstract concepts that translate to visual patterns

Examples:
- "ocean playground theme" → "ocean with waves and fish"
- "space playground for children" → "space with stars and planets"
- "jungle playground with animals" → "jungle with leaves and animals"
- "calm ocean theme with big fish silhouettes" → "calm ocean with large fish"

Output ONLY the simplified prompt (1-10 words). No explanation, no quotes, no extra text.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 100,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    const elapsed = Date.now() - startTime;

    // Extract simplified prompt
    const contentBlock = response.content.find(block => block.type === 'text');
    if (!contentBlock) {
      throw new Error('No text content in Claude response');
    }

    const simplifiedPrompt = contentBlock.text.trim();

    // Validation: ensure it's not empty and not too long
    if (simplifiedPrompt.length === 0) {
      throw new Error('Claude returned empty prompt');
    }

    if (simplifiedPrompt.length > 200) {
      console.warn('[PROMPT-SIMPLIFIER] Claude returned long prompt, truncating');
      return simplifiedPrompt.substring(0, 200);
    }

    console.log(`[PROMPT-SIMPLIFIER] Output (${elapsed}ms):`, simplifiedPrompt);

    return simplifiedPrompt;
  } catch (error) {
    console.error('[PROMPT-SIMPLIFIER] Failed:', error.message);

    // Fallback: basic word removal if Claude fails
    console.warn('[PROMPT-SIMPLIFIER] Using fallback word removal');

    const problematicWords = [
      'playground', 'playgrounds',
      'children', 'child', 'kids', 'kid',
      'people', 'person', 'figures',
      'equipment', 'structure', 'structures',
      'slide', 'slides', 'swing', 'swings',
      'climbing frame', 'bench', 'benches',
      'furniture'
    ];

    let simplified = userPrompt.toLowerCase();

    // Remove problematic words
    problematicWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      simplified = simplified.replace(regex, '');
    });

    // Clean up extra spaces
    simplified = simplified.replace(/\s+/g, ' ').trim();

    // If everything was removed, return original prompt as last resort
    if (simplified.length === 0) {
      console.warn('[PROMPT-SIMPLIFIER] Fallback removed everything, using original');
      return userPrompt;
    }

    console.log('[PROMPT-SIMPLIFIER] Fallback output:', simplified);
    return simplified;
  }
}
