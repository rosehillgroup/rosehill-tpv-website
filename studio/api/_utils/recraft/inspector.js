// SVG Compliance Inspector using Claude Haiku
// Validates Recraft SVG output against TPV surfacing installation rules

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
 * Build inspector system prompt (defines response format and rules)
 * @returns {string} System prompt for Claude Haiku
 */
function buildInspectorSystemPrompt() {
  return `You are a strict compliance inspector for TPV Studio, a playground surfacing design tool.
You analyze SVG artwork to decide whether it is suitable to be installed as rubber surfacing.

You MUST output only valid JSON, with this exact shape:

{
  "pass": boolean,
  "reasons": string[],
  "suggested_prompt_correction": string
}

Rules:
- "pass" MUST be false if ANY rule is broken.
- "reasons" MUST contain short, human-readable explanations of each issue.
- "suggested_prompt_correction" MUST be a short English instruction that we will append to the next AI generation prompt to fix the issues.
- Do not include any extra keys or commentary outside the JSON.`;
}

/**
 * Build inspector user prompt with SVG code, image, and validation rules
 * @param {object} params - Inspection parameters
 * @param {string} params.userPrompt - Original user prompt
 * @param {string} params.svgString - SVG code to inspect
 * @param {Buffer} params.previewPng - PNG preview of the SVG
 * @param {number} params.width_mm - Surface width in mm
 * @param {number} params.length_mm - Surface length in mm
 * @param {number} params.max_colours - Maximum allowed colors
 * @returns {array} Messages array for Claude API
 */
function buildInspectorUserPrompt(params) {
  const {
    userPrompt,
    svgString,
    previewPng,
    width_mm,
    length_mm,
    max_colours
  } = params;

  // Convert PNG buffer to base64
  const previewBase64 = previewPng.toString('base64');

  const textContent = `Check this artwork for TPV surfacing suitability.

Original user brief:
"${userPrompt}"

Surface size: ${width_mm}mm x ${length_mm}mm
Maximum allowed colours: ${max_colours}

SVG code:
\`\`\`svg
${svgString}
\`\`\`

Rules for PASS:

1. Style & Geometry
   • Overhead, top-down view only. No perspective or isometric drawing.
   • No buildings, no playground equipment, no furniture, no people, no vehicles unless explicitly requested.
   • Large smooth shapes with gentle curves.
   • No tiny decorative details: nothing smaller than roughly 120mm in real size.
   • No ultra-sharp corners with radius smaller than about 600mm in real size.

2. Rendering / Vector Rules
   • No gradients or soft shading.
   • No textures or noise.
   • No strokes, outlines, or visible borders around shapes.
   • No transparency: all fills should be fully opaque.
   • Total number of distinct fill colours should be ≤ ${max_colours}.

3. Content Match
   • Main motifs should match the theme of the user brief.
   • If you see large elements clearly not requested (e.g. a big playground tower, building, or object that dominates the design), this is a failure.

If the artwork breaks ANY rule above, set "pass" to false and explain why in "reasons".

In "suggested_prompt_correction", write a short instruction to the next generator run, for example:
• "remove all buildings and 3D structures, keep only flat ground shapes and fish silhouettes"
• "remove gradients and shading, use flat colours only"
• "limit the design to 4 large blobs and 3 fish silhouettes, no tiny details"
• "reduce color palette to ${max_colours} colors maximum, combine similar tones"

Respond with JSON only.`;

  return [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/png',
            data: previewBase64
          }
        },
        {
          type: 'text',
          text: textContent
        }
      ]
    }
  ];
}

/**
 * Inspect SVG with Claude Haiku
 * @param {object} params - Inspection parameters
 * @param {string} params.userPrompt - Original user prompt
 * @param {string} params.svgString - SVG code to validate
 * @param {Buffer} params.previewPng - PNG preview for visual inspection
 * @param {number} params.width_mm - Canvas width in mm
 * @param {number} params.length_mm - Canvas height in mm
 * @param {number} params.max_colours - Maximum allowed colors
 * @returns {Promise<object>} { pass: boolean, reasons: string[], suggested_prompt_correction: string }
 */
export async function inspectSvgCompliance(params) {
  const {
    userPrompt,
    svgString,
    previewPng,
    width_mm,
    length_mm,
    max_colours
  } = params;

  // Validate inputs
  if (!userPrompt) throw new Error('userPrompt is required');
  if (!svgString) throw new Error('svgString is required');
  if (!previewPng || !Buffer.isBuffer(previewPng)) throw new Error('previewPng Buffer is required');
  if (!width_mm || !length_mm) throw new Error('width_mm and length_mm are required');
  if (!max_colours) throw new Error('max_colours is required');

  console.log(`[INSPECTOR] Validating SVG (${svgString.length} bytes, ${max_colours} max colors)`);

  const client = getAnthropicClient();
  const startTime = Date.now();

  try {
    // Build prompts
    const systemPrompt = buildInspectorSystemPrompt();
    const userMessages = buildInspectorUserPrompt({
      userPrompt,
      svgString,
      previewPng,
      width_mm,
      length_mm,
      max_colours
    });

    // Call Claude Haiku with vision
    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: systemPrompt,
      messages: userMessages,
      temperature: 0.0 // Deterministic for consistency
    });

    const elapsed = Date.now() - startTime;

    // Extract JSON from response
    const contentBlock = response.content.find(block => block.type === 'text');
    if (!contentBlock) {
      throw new Error('No text content in Claude response');
    }

    let resultText = contentBlock.text.trim();

    // Remove markdown code fences if present
    if (resultText.startsWith('```json')) {
      resultText = resultText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (resultText.startsWith('```')) {
      resultText = resultText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    // Extract just the JSON object (Claude sometimes adds text after the JSON)
    // Find the first { and match it with its closing }
    const jsonStart = resultText.indexOf('{');
    if (jsonStart === -1) {
      throw new Error('No JSON object found in response');
    }

    let braceCount = 0;
    let jsonEnd = -1;
    for (let i = jsonStart; i < resultText.length; i++) {
      if (resultText[i] === '{') braceCount++;
      if (resultText[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          jsonEnd = i + 1;
          break;
        }
      }
    }

    if (jsonEnd === -1) {
      throw new Error('Unclosed JSON object in response');
    }

    const jsonText = resultText.substring(jsonStart, jsonEnd);

    // Parse JSON
    const result = JSON.parse(jsonText);

    // Validate structure
    if (typeof result.pass !== 'boolean') {
      throw new Error('Inspector response missing "pass" boolean');
    }
    if (!Array.isArray(result.reasons)) {
      throw new Error('Inspector response missing "reasons" array');
    }
    if (typeof result.suggested_prompt_correction !== 'string') {
      throw new Error('Inspector response missing "suggested_prompt_correction" string');
    }

    console.log(`[INSPECTOR] Validation complete in ${elapsed}ms: ${result.pass ? 'PASS' : 'FAIL'}`);
    if (!result.pass) {
      console.log(`[INSPECTOR] Issues found: ${result.reasons.length}`);
      result.reasons.forEach((reason, i) => {
        console.log(`[INSPECTOR]   ${i + 1}. ${reason}`);
      });
      console.log(`[INSPECTOR] Suggested correction: ${result.suggested_prompt_correction}`);
    }

    return {
      pass: result.pass,
      reasons: result.reasons,
      suggested_prompt_correction: result.suggested_prompt_correction,
      elapsed
    };
  } catch (error) {
    console.error('[INSPECTOR] Validation failed:', error.message);

    // If JSON parsing failed, return a fail-safe response
    if (error instanceof SyntaxError || error.message.includes('JSON')) {
      console.error('[INSPECTOR] Claude returned invalid JSON, marking as non-compliant (fail-safe)');
      return {
        pass: false,
        reasons: ['Inspector failed to validate (technical error)'],
        suggested_prompt_correction: 'simplify design with fewer elements and clearer structure',
        elapsed: Date.now() - startTime,
        error: error.message
      };
    }

    throw new Error(`Inspector error: ${error.message}`);
  }
}

/**
 * Quick SVG code-only check (no vision, faster but less accurate)
 * Useful for preliminary validation before running full inspector
 * @param {string} svgString - SVG code
 * @param {number} max_colours - Maximum allowed colors
 * @returns {object} { hasGradients, hasStrokes, estimatedColors, issues }
 */
export function quickSvgCheck(svgString, max_colours) {
  const issues = [];

  // Check for gradients
  const hasGradients = /<(?:linear|radial)Gradient/i.test(svgString);
  if (hasGradients) {
    issues.push('Contains gradient definitions');
  }

  // Check for strokes (excluding stroke="none")
  const hasStrokes = /stroke=["'][^"']*["']/.test(svgString) &&
                    !/stroke=["']none["']/.test(svgString);
  if (hasStrokes) {
    issues.push('Contains stroke attributes');
  }

  // Check for filters
  const hasFilters = /<filter/i.test(svgString);
  if (hasFilters) {
    issues.push('Contains filter effects');
  }

  // Estimate color count
  const fillMatches = svgString.match(/fill=["']#[0-9a-f]{6}["']/gi) || [];
  const uniqueColors = new Set(fillMatches.map(m => m.match(/#[0-9a-f]{6}/i)[0].toLowerCase()));
  const estimatedColors = uniqueColors.size;

  if (estimatedColors > max_colours) {
    issues.push(`Estimated ${estimatedColors} colors (max: ${max_colours})`);
  }

  // Check for common 3D/perspective indicators
  if (/isometric|perspective|3d/i.test(svgString)) {
    issues.push('SVG code mentions 3D/perspective keywords');
  }

  return {
    hasGradients,
    hasStrokes,
    hasFilters,
    estimatedColors,
    issues,
    quickPass: issues.length === 0
  };
}
