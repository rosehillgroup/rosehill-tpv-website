// Design Director - LLM-powered mood board description refinement
// Uses Claude Haiku to convert freeform user text into atmospheric descriptions

import Anthropic from '@anthropic-ai/sdk';

const DESIGN_DIRECTOR_SYSTEM_PROMPT = `You are a professional playground concept designer.

Your purpose is to transform a user's short request into a refined prompt for generating a playground-themed *mood board*.

You DO NOT design finished surfaces, vector graphics, geometric layouts, or installer-friendly patterns.
You DO NOT simplify shapes, flatten colours, or limit gradients.
You DO NOT describe rubber flooring, TPV surfacing, or manufacturing constraints.

Your task is purely creative:

Turn the user's idea into a rich, atmospheric, expressive description suitable for concept art and mood exploration.

Focus on:
• theme
• mood
• colour atmosphere
• lighting
• shapes and visual motifs
• playful or imaginative tone
• storytelling

Avoid:
• technical or geometric instructions
• references to installation or manufacturing
• vector-style constraints
• rules like "large shapes only", "flat colours only", "no gradients", etc.

Always output 1–3 sentences describing a visually inspiring playground concept.

# Examples

**Input:** "ocean theme"
**Output:** "A calming ocean-themed playground mood board with flowing blues, soft turquoise gradients, shimmering wave forms, playful sea creatures and gentle underwater lighting. A dreamy, atmospheric concept illustration evoking a sense of seaside adventure."

**Input:** "space playground"
**Output:** "A bright cosmic playground mood board filled with glowing planets, star trails, soft nebula clouds and floating playful shapes. Colourful gradients and imaginative space motifs create a sense of wonder."

**Input:** "nature forest with animals"
**Output:** "A lush forest playground mood board with rich greens, dappled sunlight filtering through trees, friendly woodland creatures and organic plant forms. Warm earthy tones and soft shadows create an inviting, natural atmosphere."

# Output Format
Return ONLY the refined 1-3 sentence description. No JSON, no markdown, no explanation, just the descriptive text.`;

/**
 * Refine user text into mood board description using Claude Haiku
 * @param {string} userText - User's freeform design description
 * @param {Object} options - Optional context (no longer used for mood boards)
 * @returns {Promise<string>} Refined 1-3 sentence mood board description
 */
export async function refineToDesignBrief(userText, options = {}) {
  const startTime = Date.now();

  // Validate API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[DESIGN-DIRECTOR] No ANTHROPIC_API_KEY found, returning simple brief');
    return createFallbackBrief(userText);
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    // Build user message - mood boards don't need surface dimensions or colour constraints
    const userMessage = `Design request: "${userText}"`;

    console.log('[DESIGN-DIRECTOR] Refining mood board description with Claude Haiku...');

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      temperature: 0.7, // Balanced creativity
      system: DESIGN_DIRECTOR_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: userMessage
      }]
    });

    const duration = Date.now() - startTime;

    // Extract text response (no JSON parsing needed)
    const refinedDescription = response.content[0].text.trim();

    console.log(
      `[DESIGN-DIRECTOR] Mood board description refined: "${refinedDescription.slice(0, 80)}..." ` +
      `duration=${duration}ms tokens=${response.usage.input_tokens}+${response.usage.output_tokens}`
    );

    return refinedDescription;

  } catch (error) {
    console.error('[DESIGN-DIRECTOR ERROR]', error.message);
    console.warn('[DESIGN-DIRECTOR] Falling back to simple description');
    return createFallbackBrief(userText);
  }
}

/**
 * Create a simple fallback mood board description when LLM is unavailable
 * @param {string} userText - User's text
 * @returns {string} Basic mood board description
 */
function createFallbackBrief(userText) {
  const moods = extractSimpleMoods(userText);
  const moodText = moods.length > 0 ? moods.join(', ') : 'playful';

  return `A ${moodText} playground mood board inspired by "${userText}". Rich colours, expressive atmosphere, and imaginative visual storytelling create an inviting playground concept.`;
}

/**
 * Extract simple mood keywords from text (basic fallback)
 * @param {string} text - User text
 * @returns {Array<string>} Mood keywords
 */
function extractSimpleMoods(text) {
  const moodKeywords = {
    'fun': 'playful',
    'playful': 'playful',
    'bright': 'vibrant',
    'colorful': 'vibrant',
    'calm': 'calm',
    'peaceful': 'calm',
    'sport': 'athletic',
    'athletic': 'athletic',
    'ocean': 'marine',
    'sea': 'marine',
    'space': 'cosmic',
    'cosmic': 'cosmic',
    'nature': 'natural',
    'geometric': 'geometric',
    'modern': 'modern'
  };

  const textLower = text.toLowerCase();
  const foundMoods = new Set();

  for (const [keyword, mood] of Object.entries(moodKeywords)) {
    if (textLower.includes(keyword)) {
      foundMoods.add(mood);
    }
  }

  return Array.from(foundMoods).slice(0, 4);
}

/**
 * Check if Design Director is enabled
 * @returns {boolean} True if LLM refinement is enabled
 */
export function isDesignDirectorEnabled() {
  return process.env.DESIGN_DIRECTOR_ENABLED === 'true' && !!process.env.ANTHROPIC_API_KEY;
}
