// Claude Haiku Brief Parser for TPV Studio Geometric Mode
// Uses Claude Haiku to intelligently extract design parameters from natural language briefs

import Replicate from 'replicate';

/**
 * Parse design brief using Claude Haiku via Replicate
 * @param {string} brief - User's natural language design brief
 * @param {object} defaultCanvas - Default canvas dimensions
 * @returns {Promise<object>} Parsed parameters {mood, composition, colorCount, themes}
 */
export async function parseWithClaude(brief, defaultCanvas = { width_mm: 15000, height_mm: 15000 }) {
  const apiKey = process.env.REPLICATE_API_TOKEN;
  if (!apiKey) {
    console.warn('[BRIEF-PARSER] REPLICATE_API_TOKEN not set, falling back to keyword parsing');
    return fallbackParsing(brief);
  }

  const replicate = new Replicate({ auth: apiKey });

  // Structured prompt for Claude Haiku
  const systemPrompt = `You are a design brief analyzer for TPV Studio, a playground surface design tool. Your task is to extract design parameters from natural language briefs.

Available categories:
- Moods: playful, serene, energetic, bold, calm
- Compositions: bands (horizontal stripes), islands (organic blobs), motifs (themed icons), mixed (combination)
- Themes: ocean, space, nature, fastfood, gym, transport, landmarks, alphabet, spring, trees

Respond ONLY with valid JSON (no markdown, no explanations) in this exact format:
{
  "mood": "playful|serene|energetic|bold|calm",
  "composition": "bands|islands|motifs|mixed",
  "colorCount": 3-8,
  "themes": ["theme1", "theme2"],
  "reasoning": "brief explanation"
}`;

  const userPrompt = `Design brief: "${brief}"

Extract the mood, composition type, color count (3-8), and relevant themes from this brief.`;

  try {
    console.log('[BRIEF-PARSER] Using Claude Haiku for brief analysis');

    const output = await replicate.run(
      "anthropic/claude-4.5-haiku",
      {
        input: {
          prompt: `${systemPrompt}\n\n${userPrompt}`,
          max_tokens: 500,
          temperature: 0.3  // Lower temperature for more consistent parsing
        }
      }
    );

    // Claude output is an array of strings, join them
    const responseText = Array.isArray(output) ? output.join('') : output;

    console.log('[BRIEF-PARSER] Claude response:', responseText.substring(0, 200));

    // Extract JSON from response (handle markdown code blocks if present)
    let jsonStr = responseText.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '').trim();
    }

    const parsed = JSON.parse(jsonStr);

    console.log('[BRIEF-PARSER] Parsed parameters:', {
      mood: parsed.mood,
      composition: parsed.composition,
      colorCount: parsed.colorCount,
      themes: parsed.themes,
      reasoning: parsed.reasoning
    });

    // Validate and sanitize output
    const result = {
      mood: validateMood(parsed.mood),
      composition: validateComposition(parsed.composition),
      colorCount: validateColorCount(parsed.colorCount),
      themes: Array.isArray(parsed.themes) ? parsed.themes.filter(t => typeof t === 'string') : [],
      reasoning: parsed.reasoning || 'Claude Haiku analysis'
    };

    return result;

  } catch (error) {
    console.error('[BRIEF-PARSER] Claude parsing failed:', error.message);
    console.warn('[BRIEF-PARSER] Falling back to keyword parsing');
    return fallbackParsing(brief);
  }
}

/**
 * Fallback keyword-based parsing (original simple implementation)
 * @param {string} brief - Design brief
 * @returns {object} Parsed parameters
 */
function fallbackParsing(brief) {
  const briefLower = brief.toLowerCase();

  // Detect mood
  let mood = 'playful'; // default
  if (briefLower.includes('serene') || briefLower.includes('calm') || briefLower.includes('peaceful')) {
    mood = 'serene';
  } else if (briefLower.includes('energetic') || briefLower.includes('vibrant') || briefLower.includes('dynamic')) {
    mood = 'energetic';
  } else if (briefLower.includes('bold') || briefLower.includes('striking') || briefLower.includes('dramatic')) {
    mood = 'bold';
  }

  // Detect composition preference
  let composition = 'mixed'; // default
  if (briefLower.includes('bands') || briefLower.includes('ribbon') || briefLower.includes('stripe')) {
    composition = 'bands';
  } else if (briefLower.includes('island') || briefLower.includes('blob') || briefLower.includes('organic')) {
    composition = 'islands';
  } else if (briefLower.includes('motif') || briefLower.includes('icon') || briefLower.includes('symbol')) {
    composition = 'motifs';
  }

  // Detect color count
  let colorCount = 5; // default
  const colorMatch = brief.match(/(\d+)\s*colou?rs?/i);
  if (colorMatch) {
    colorCount = Math.max(3, Math.min(8, parseInt(colorMatch[1])));
  }

  // Detect themes from keywords
  const themes = [];
  const themeKeywords = {
    ocean: ['ocean', 'sea', 'water', 'marine', 'wave', 'beach'],
    space: ['space', 'star', 'planet', 'rocket', 'galaxy', 'cosmic'],
    nature: ['nature', 'tree', 'leaf', 'plant', 'forest', 'eco'],
    fastfood: ['food', 'burger', 'pizza', 'cafe', 'restaurant'],
    gym: ['gym', 'fitness', 'sport', 'exercise', 'workout'],
    transport: ['car', 'bus', 'train', 'transport', 'vehicle'],
    landmarks: ['landmark', 'building', 'monument', 'city'],
    alphabet: ['letter', 'alphabet', 'text', 'typography'],
    spring: ['spring', 'flower', 'blossom', 'bloom'],
    trees: ['tree', 'forest', 'woodland']
  };

  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some(kw => briefLower.includes(kw))) {
      themes.push(theme);
    }
  }

  return {
    mood,
    composition,
    colorCount,
    themes,
    reasoning: 'Keyword-based fallback parsing'
  };
}

/**
 * Validate mood parameter
 */
function validateMood(mood) {
  const validMoods = ['playful', 'serene', 'energetic', 'bold', 'calm'];
  return validMoods.includes(mood) ? mood : 'playful';
}

/**
 * Validate composition parameter
 */
function validateComposition(composition) {
  const validCompositions = ['bands', 'islands', 'motifs', 'mixed'];
  return validCompositions.includes(composition) ? composition : 'mixed';
}

/**
 * Validate color count parameter
 */
function validateColorCount(count) {
  const num = parseInt(count);
  if (isNaN(num)) return 5;
  return Math.max(3, Math.min(8, num));
}

/**
 * Enhanced parse brief with Claude Haiku integration
 * @param {string} brief - User's design brief
 * @param {object} defaultCanvas - Default canvas dimensions
 * @returns {Promise<object>} Parsed parameters for generateGeometricSVG
 */
export async function parseBrief(brief, defaultCanvas = { width_mm: 15000, height_mm: 15000 }) {
  const parsed = await parseWithClaude(brief, defaultCanvas);

  console.log('[BRIEF-PARSER] Final parameters:', parsed);

  return {
    brief,
    canvas: defaultCanvas,
    options: {
      mood: parsed.mood,
      composition: parsed.composition,
      colorCount: parsed.colorCount,
      seed: Date.now()
    },
    metadata: {
      themes: parsed.themes,
      reasoning: parsed.reasoning
    }
  };
}
