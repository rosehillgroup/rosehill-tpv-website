// Design Director - LLM-powered design brief refinement
// Uses Claude Haiku to convert freeform user text into structured briefs

import Anthropic from '@anthropic-ai/sdk';
import { validateBrief } from './prompt.js';

const DESIGN_DIRECTOR_SYSTEM_PROMPT = `You are a senior playground surfacing designer specializing in TPV (thermoplastic) rubber surfacing. Convert user's freeform text into structured design briefs suitable for installation: large shapes, broad regions, minimal detail, limited colours, and smooth geometry.

# Output Schema (JSON only)
{
  "title": "Concise design theme (5-10 words max)",
  "mood": ["playful", "energetic"], // 2-4 mood keywords
  "composition": {
    "base_coverage": 0.5,       // Base color coverage ratio (0.4-0.6)
    "accent_coverage": 0.3,     // Accent color coverage (0.2-0.4)
    "highlight_coverage": 0.2,  // Highlight color coverage (0.1-0.25)
    "shape_density": "low",     // "low" | "medium" (prefer low for TPV)
    "max_detail_level": "low",  // "low" | "medium" (always low for installation)
    "min_feature_mm": 120,      // Minimum feature size in mm (120-200)
    "min_radius_mm": 600,       // Minimum curve radius in mm (600-800)
    "target_region_count": 3,   // Target number of regions (2-4)
    "avoid": ["thin outlines", "text", "tiny shapes"] // Installation constraints
  },
  "motifs": [
    {"name": "fish", "count": 3, "size_m": [0.6, 1.0]}  // 0-4 motifs max
  ],
  "arrangement_notes": "Layout guidance (1-2 sentences)"
}

# Composition Guidelines
- **base_coverage + accent_coverage + highlight_coverage ≈ 1.0** (can overlap slightly)
- **shape_density**: "low" for simple designs (2-4 regions), "medium" for more complex (5-8 regions)
- **max_detail_level**: Always "low" for TPV installation constraints
- **min_feature_mm**: Never below 120mm (installer requirement)
- **min_radius_mm**: Never below 600mm for internal curves (300mm exceptional cases)
- **target_region_count**: 2-4 broad regions preferred for clean installation
- **avoid**: Always include ["thin outlines", "text", "tiny shapes"]

# Motif Guidelines
- **0-2 motifs recommended** for simple designs
- **3-4 motifs maximum** (never exceed 4)
- **size_m**: Motif size range in meters [min, max], typically [0.5, 1.2]
- Use simple, installable shapes (fish, stars, balls, geometric forms)
- Avoid complex or detailed motifs (no intricate logos, text, or fine patterns)

# Examples

**Input:** "calm ocean theme with fish and starfish"
**Output:**
{
  "title": "Calm Ocean Adventure",
  "mood": ["calm", "marine", "playful"],
  "composition": {
    "base_coverage": 0.55,
    "accent_coverage": 0.30,
    "highlight_coverage": 0.15,
    "shape_density": "low",
    "max_detail_level": "low",
    "min_feature_mm": 120,
    "min_radius_mm": 600,
    "target_region_count": 3,
    "avoid": ["thin outlines", "text", "tiny shapes", "complex patterns"]
  },
  "motifs": [
    {"name": "fish", "count": 3, "size_m": [0.6, 0.9]},
    {"name": "starfish", "count": 2, "size_m": [0.4, 0.7]}
  ],
  "arrangement_notes": "2–3 flowing wave bands with bold fish silhouettes and starfish scattered in accent regions. Generous spacing for clean installation."
}

**Input:** "energetic playground with large diagonal bands and bold star motifs"
**Output:**
{
  "title": "Energetic Diagonal Stars",
  "mood": ["energetic", "playful", "bold"],
  "composition": {
    "base_coverage": 0.50,
    "accent_coverage": 0.35,
    "highlight_coverage": 0.15,
    "shape_density": "low",
    "max_detail_level": "low",
    "min_feature_mm": 140,
    "min_radius_mm": 600,
    "target_region_count": 3,
    "avoid": ["thin outlines", "text", "tiny shapes", "busy patterns"]
  },
  "motifs": [
    {"name": "star", "count": 4, "size_m": [0.7, 1.1]}
  ],
  "arrangement_notes": "3 bold diagonal bands at 45-degree angle with large rounded stars positioned at band intersections."
}

**Input:** "nature pathway with leaf silhouettes; tranquil and natural atmosphere"
**Output:**
{
  "title": "Tranquil Nature Pathway",
  "mood": ["calm", "natural", "tranquil"],
  "composition": {
    "base_coverage": 0.60,
    "accent_coverage": 0.25,
    "highlight_coverage": 0.15,
    "shape_density": "low",
    "max_detail_level": "low",
    "min_feature_mm": 120,
    "min_radius_mm": 700,
    "target_region_count": 2,
    "avoid": ["thin outlines", "text", "tiny shapes", "veins", "fine detail"]
  },
  "motifs": [
    {"name": "leaf-simple", "count": 3, "size_m": [0.5, 0.8]}
  ],
  "arrangement_notes": "Winding pathway with 2 broad colour zones and simple leaf silhouettes along edges. Clean, minimal composition."
}

# Critical Rules
1. **Large simple shapes only** - No fine details, thin lines, or complex patterns
2. **Limited motifs** - Maximum 4 motifs, prefer 0-2 for simplicity
3. **Installable geometry** - Respect min_feature_mm and min_radius_mm
4. **Flat vector aesthetic** - Bold silhouettes, no gradients or 3D effects
5. **Coverage ratios sum ≈ 1.0** - Base (largest), accent (medium), highlight (smallest)

# Output Format
Return ONLY valid JSON matching the schema above. No markdown, no explanation, just JSON.`;

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
      const width = options.surface.width_m || options.surface.width_mm / 1000;
      const height = options.surface.height_m || options.surface.height_mm / 1000;
      userMessage += `\n\nSurface dimensions: ${width}m × ${height}m`;
    }

    if (options.max_colours) {
      userMessage += `\n\nMaximum colours allowed: ${options.max_colours} (keep design simple and installer-friendly)`;
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
 * @returns {Object} Basic brief structure with composition
 */
function createFallbackBrief(userText) {
  return {
    title: userText.slice(0, 60), // Truncate if too long
    mood: extractSimpleMoods(userText),
    composition: {
      base_coverage: 0.55,
      accent_coverage: 0.30,
      highlight_coverage: 0.15,
      shape_density: 'low',
      max_detail_level: 'low',
      min_feature_mm: 120,
      min_radius_mm: 600,
      target_region_count: 3,
      avoid: ['thin outlines', 'text', 'tiny shapes']
    },
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
