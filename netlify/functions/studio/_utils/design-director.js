// Design Director - LLM-powered design brief refinement
// Uses Claude Haiku to convert freeform user text into structured briefs

import Anthropic from '@anthropic-ai/sdk';
import { validateBrief } from './prompt.js';

const DESIGN_DIRECTOR_SYSTEM_PROMPT = `You are a playground design expert specializing in TPV (thermoplastic) rubber surfacing designs. Your role is to refine user's creative ideas into structured design briefs for AI image generation.

# Your Task
Convert user's freeform text into a structured design brief with these fields:
- **title**: Concise design theme (5-10 words max)
- **mood**: Array of 2-4 mood keywords (e.g., "playful", "energetic", "calm", "vibrant")
- **motifs**: Array of design elements, each with:
  - name: Element name (e.g., "star", "soccer ball", "wave")
  - count: Suggested quantity (1-5)
- **arrangement_notes**: Layout guidance (1-2 sentences) describing how elements should be arranged

# Design Constraints (CRITICAL)
TPV rubber surfacing requires:
- **Large, simple shapes** - No fine details or thin lines (installer-friendly)
- **Flat vector aesthetic** - Bold silhouettes, no photorealism or 3D effects
- **2-4 main motifs maximum** - Too many elements creates busy, unusable designs
- **Generous spacing** - Avoid overlapping elements for clean installation
- **Broad flowing bands** - Organic compositions work better than rigid grids

# Examples

**Input:** "underwater ocean theme with sea creatures and coral"
**Output:**
{
  "title": "Underwater Ocean Adventure",
  "mood": ["playful", "marine", "adventurous"],
  "motifs": [
    {"name": "dolphin", "count": 2},
    {"name": "starfish", "count": 3},
    {"name": "wave pattern", "count": 2}
  ],
  "arrangement_notes": "Arrange dolphins leaping across 2 flowing wave bands with starfish scattered between. Keep spacing generous for clean silhouettes."
}

**Input:** "space theme"
**Output:**
{
  "title": "Cosmic Space Journey",
  "mood": ["mysterious", "adventurous", "cosmic"],
  "motifs": [
    {"name": "rocket", "count": 1},
    {"name": "planet", "count": 3},
    {"name": "star cluster", "count": 2}
  ],
  "arrangement_notes": "Single large rocket angled upward, surrounded by 3 planets of varying sizes in flowing orbital paths. Star clusters in background."
}

**Input:** "sports court with basketball and soccer elements"
**Output:**
{
  "title": "Multi-Sport Court Graphics",
  "mood": ["athletic", "energetic", "structured"],
  "motifs": [
    {"name": "basketball", "count": 2},
    {"name": "soccer ball", "count": 2},
    {"name": "court line marking", "count": 1}
  ],
  "arrangement_notes": "Alternating basketballs and soccer balls arranged along curved line markings. Simple, functional layout suitable for court boundaries."
}

# Guidelines
1. Keep it simple - prefer fewer, larger elements over many small ones
2. Use concrete nouns for motifs (not abstract concepts)
3. Suggest 2-4 motifs maximum for clean designs
4. Mood keywords should be descriptive but not overly technical
5. Arrangement notes should guide spatial composition without being prescriptive
6. If user input is very minimal, make reasonable assumptions based on the theme

# Output Format
Return ONLY a valid JSON object with the structure shown above. No additional text or explanation.`;

/**
 * Refine user text into structured design brief using Claude Haiku
 * @param {string} userText - User's freeform design description
 * @param {Object} options - Optional context (surface dimensions, style preference, etc.)
 * @returns {Promise<Object>} Structured brief {title, mood, motifs, arrangement_notes}
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

    // Build user message with context
    let userMessage = `Design request: "${userText}"`;

    if (options.surface) {
      userMessage += `\n\nSurface dimensions: ${options.surface.width_m}m × ${options.surface.height_m}m`;
    }

    if (options.style) {
      userMessage += `\n\nPreferred style: ${options.style}`;
    }

    console.log('[DESIGN-DIRECTOR] Refining brief with Claude Haiku...');

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

    // Extract JSON from response
    const content = response.content[0].text;
    let brief;

    try {
      // Try to parse directly first
      brief = JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        brief = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Could not parse JSON from Claude response');
      }
    }

    // Validate brief structure
    const validation = validateBrief(brief);
    if (!validation.valid) {
      console.error('[DESIGN-DIRECTOR] Invalid brief from Claude:', validation.errors);
      throw new Error(`Invalid brief structure: ${validation.errors.join(', ')}`);
    }

    console.log(
      `[DESIGN-DIRECTOR] Brief refined: "${brief.title}" ` +
      `(${brief.motifs?.length || 0} motifs, ${brief.mood?.length || 0} moods) ` +
      `duration=${duration}ms tokens=${response.usage.input_tokens}+${response.usage.output_tokens}`
    );

    return brief;

  } catch (error) {
    console.error('[DESIGN-DIRECTOR ERROR]', error.message);
    console.warn('[DESIGN-DIRECTOR] Falling back to simple brief');
    return createFallbackBrief(userText);
  }
}

/**
 * Create a simple fallback brief when LLM is unavailable
 * @param {string} userText - User's text
 * @returns {Object} Basic brief structure
 */
function createFallbackBrief(userText) {
  return {
    title: userText.slice(0, 60), // Truncate if too long
    mood: extractSimpleMoods(userText),
    motifs: [],
    arrangement_notes: 'Simple playground design with generous spacing and clean composition.'
  };
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
