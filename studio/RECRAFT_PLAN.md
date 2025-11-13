TPV Studio – Recraft SVG Vector Generation & Inspector Pipeline

0. Goals

We are moving TPV Studio’s AI mode from raster-first (Flux) to vector-first using Recraft’s recraft-v3-svg model on Replicate.

Required outcomes:
	1.	Direct SVG generation from text prompts (no raster → vector step).
	2.	Strict compliance with TPV surfacing constraints:
	•	Flat fills only (no gradients, textures, or soft shading).
	•	No strokes/outlines.
	•	Overhead, 2D surfacing – no buildings, furniture, or 3D structures.
	•	Large, installer-friendly shapes (no tiny details).
	•	Limited palette (configurable max colours).
	3.	Automatic AI inspection loop:
	•	Recraft generates SVG.
	•	An inspector LLM (Claude Haiku) validates against a checklist.
	•	If it fails, we automatically refine the prompt and regenerate.
	4.	SVG is the only final asset for this mode (plus a PNG thumbnail for preview).

This brief assumes:
	•	We are deployed on Vercel.
	•	We already use Replicate for AI calls.
	•	We already use Anthropic (Claude Haiku) for brief parsing elsewhere.
	•	We already use Supabase for storage (images, SVGs, job records).

⸻

1. New Mode Name & High-Level Behaviour

Name this new system “Vector AI Mode (Recraft)”.

Behaviour from user’s perspective:
	1.	User enters a text prompt (e.g. “calm ocean themed playground with big fish silhouettes”).
	2.	User chooses length/width (mm) and max colours (3–8).
	3.	System generates:
	•	A vector-only surface design as SVG.
	•	A PNG preview.
	4.	System guarantees:
	•	No unsuitable content (no buildings, slides, benches, etc).
	•	No gradients / strokes / textures.
	•	Reasonable complexity.
	5.	If generation fails QA after several retries, the UI shows a clear message and keeps any best-effort preview, but marks it as “not production-ready”.

⸻

2. Environment Variables

Add these environment variables (Vercel & local):

RECRAFT_MODEL=recraft-ai/recraft-v3-svg
RECRAFT_REPLICATE_TOKEN=<existing REPLICATE_API_TOKEN or new one>

VECTOR_AI_MAX_RETRIES=3           # How many re-tries per job
VECTOR_AI_MAX_COLOURS_DEFAULT=6   # Default colour cap
VECTOR_AI_MIN_COLOURS_DEFAULT=3
VECTOR_AI_CANVAS_PX=2048          # Working resolution for preview
VECTOR_AI_THUMB_PX=512           # Thumbnail size

# Anthropic (already exists, just document usage)
ANTHROPIC_API_KEY=...
ANTHROPIC_MODEL_HAIKU=claude-3-haiku-20240307


⸻

3. Data Flow Overview

High-level pipeline for Vector AI Mode:
	1.	Frontend submits request to api/vector-ai-enqueue.js.
	2.	Backend:
	•	Normalises prompt & parameters.
	•	Stores a job record in Supabase (studio_jobs or similar).
	•	Calls Replicate with Recraft (recraft-v3-svg) synchronously.
	•	Receives SVG result.
	3.	Run Inspector LLM:
	•	Generate PNG preview from SVG.
	•	Pass SVG text + PNG + original brief into Claude Haiku.
	•	Receive JSON verdict: pass, reasons[], corrected_prompt.
	4.	If pass === true:
	•	Store SVG + preview PNG in Supabase.
	•	Update job status → completed.
	•	Return job status + asset URLs to frontend.
	5.	If pass === false and retries left:
	•	Construct revised prompt using corrected_prompt.
	•	Call Recraft again.
	•	Re-run inspector.
	6.	If after N retries still failing:
	•	Store last SVG + PNG as “non-compliant” with compliant=false.
	•	Update job status → failed but keep preview and reasons.

This mode does not go via a Replicate webhook – we can do synchronous calls because Recraft is relatively fast and Vercel’s timeout can handle it. If latency becomes an issue later, we can switch to the existing enqueue + webhook pattern.

⸻

4. Backend Implementation Details

4.1 New API Route – api/vector-ai-enqueue.js

Create a Vercel serverless function:

Responsibilities:
	1.	Validate request body:
	•	prompt: string
	•	length_mm: number
	•	width_mm: number
	•	max_colours?: number (default VECTOR_AI_MAX_COLOURS_DEFAULT)
	•	seed?: number (optional, for reproducibility)
	2.	Create a job record in Supabase (reuse existing studio_jobs if possible):

type VectorAIJob = {
  id: string;
  mode: 'VECTOR_AI_RECRAFT';
  prompt: string;
  width_mm: number;
  length_mm: number;
  max_colours: number;
  seed: number | null;
  status: 'pending' | 'running' | 'completed' | 'failed';
  attempt: number;
  created_at: timestamp;
  updated_at: timestamp;
  result_svg_url: string | null;
  result_png_url: string | null;
  compliant: boolean | null;
  inspector_reasons: string[] | null;
};


	3.	Immediately call a helper runVectorAIPipeline(job) which:
	•	Updates status → running.
	•	Executes the Recraft → Inspector loop (see below).
	•	Returns the final job state.
	4.	Respond to client with job object:
	•	On success → status: completed, URLs included.
	•	On failure → status: failed, reasons included.

4.2 Recraft Call Helper

Create api/_utils/recraft/generate-svg.js.

Responsibilities:
	•	Accept:
	•	prompt: string
	•	width_mm: number
	•	length_mm: number
	•	max_colours: number
	•	seed?: number
	•	Build a Recraft-optimised prompt (see §5).
	•	Call Replicate recraft-v3-svg model with config:
	•	prompt
	•	width: 2048 (or similar)
	•	height: computed to maintain aspect ratio (see below).
	•	color_palette_size: max_colours (if supported).
	•	style / similar fields if available.
	•	Handle Replicate response:
	•	Extract SVG as text (download from URL if necessary).
	•	Return:
	•	svgString
	•	usedSeed (if Recraft supports returning final seed).

4.3 Aspect Ratio Handling

We need to approximate the requested surface dimensions (mm) into a working pixel canvas:
	1.	Compute ratio:

const ratio = width_mm / length_mm; // or vice versa, just be consistent


	2.	Start from a base size (e.g. 2048×2048) and then:
	•	If ratio >= 1 (wider than tall):
	•	width_px = VECTOR_AI_CANVAS_PX
	•	height_px = Math.round(VECTOR_AI_CANVAS_PX / ratio)
	•	Else (taller than wide):
	•	height_px = VECTOR_AI_CANVAS_PX
	•	width_px = Math.round(VECTOR_AI_CANVAS_PX * ratio)
	3.	Pass width_px and height_px into Recraft where possible.

We don’t need millimetre-perfect dimensions inside the SVG for v1, but we must store the real-world length/width in metadata so installers know the intended scale.

Later, we can add viewBox scaling so that 1mm corresponds to a known SVG unit.

4.4 SVG → PNG Helper

Create api/_utils/svg/render-png.js.

Use sharp or resvg in Node to render:

async function svgToPngBuffer(svgString: string, sizePx: number) {
  return sharp(Buffer.from(svgString))
    .resize(sizePx, sizePx, { fit: 'contain', background: '#ffffff' })
    .png()
    .toBuffer();
}

We will generate:
	•	A full-size preview (for exact QC): VECTOR_AI_CANVAS_PX (e.g. 2048×2048).
	•	A thumbnail: VECTOR_AI_THUMB_PX (e.g. 512×512) for UI.

4.5 Inspector LLM Helper

Create api/_utils/vector-ai/inspector.js.

Input:
	•	prompt: string (user prompt)
	•	svgString: string
	•	previewPngBuffer: Buffer
	•	width_mm: number
	•	length_mm: number
	•	max_colours: number

Output:

type InspectorResult = {
  pass: boolean;
  reasons: string[];
  suggested_prompt_correction: string; // may be empty if pass = true
};

Implementation:
	•	Use Anthropic Haiku with a vision + text call.
	•	Attach:
	•	SVG as text (in a fenced code block).
	•	PNG as an image attachment.
	•	Prompt + parameters as plain text.

Use a strict JSON-only reply. See §6 for the full prompt.

4.6 The Recraft → Inspector Loop

Create api/_utils/vector-ai/run-pipeline.js (used by vector-ai-enqueue.js).

Pseudo-code:

async function runVectorAIPipeline(job, maxRetries = VECTOR_AI_MAX_RETRIES) {
  let attempt = 0;
  let lastInspectorResult = null;
  let currentPrompt = job.prompt;

  while (attempt < maxRetries) {
    attempt++;

    // 1) Generate SVG from Recraft
    const { svgString, usedSeed } = await generateRecraftSvg({
      prompt: currentPrompt,
      width_mm: job.width_mm,
      length_mm: job.length_mm,
      max_colours: job.max_colours,
      seed: job.seed
    });

    // 2) Render PNG preview
    const previewPng = await svgToPngBuffer(svgString, VECTOR_AI_CANVAS_PX);
    const thumbPng = await svgToPngBuffer(svgString, VECTOR_AI_THUMB_PX);

    // 3) Run inspector
    const inspector = await inspectSvgWithClaude({
      prompt: job.prompt,
      svgString,
      previewPng,
      width_mm: job.width_mm,
      length_mm: job.length_mm,
      max_colours: job.max_colours
    });

    lastInspectorResult = inspector;

    if (inspector.pass) {
      // 4) Upload assets to Supabase
      const svgUrl = await uploadToSupabase(`vector/${job.id}.svg`, svgString);
      const pngUrl = await uploadToSupabase(`vector/${job.id}.png`, previewPng);
      const thumbUrl = await uploadToSupabase(`vector/${job.id}-thumb.png`, thumbPng);

      // 5) Update job
      await updateJob({
        id: job.id,
        status: 'completed',
        attempt,
        compliant: true,
        result_svg_url: svgUrl,
        result_png_url: pngUrl,
        thumbnail_url: thumbUrl,
        inspector_reasons: []
      });

      return;
    } else {
      // Adjust prompt for next iteration
      if (!inspector.suggested_prompt_correction || attempt >= maxRetries) {
        break;
      }

      currentPrompt = buildCorrectedPrompt(job.prompt, inspector.suggested_prompt_correction);
    }
  }

  // If we reach here, all attempts failed
  await updateJob({
    id: job.id,
    status: 'failed',
    compliant: false,
    inspector_reasons: lastInspectorResult?.reasons ?? []
  });
}

4.7 Prompt Correction Helper

buildCorrectedPrompt(originalPrompt, correction) should:
	•	Keep the original user intent.
	•	Append explicit constraints and inspector suggestions.

Example:

<originalPrompt>

Additional constraints:
- Flat TPV rubber surfacing design, overhead view only.
- No buildings, no playground structures, no people, no 3D furniture.
- Large smooth shapes, minimal detail, installer-friendly geometry.
- No outlines, no strokes, no gradients or shading of any kind.
- Keep total colours ≤ {max_colours}.
- Specific corrections from previous attempt: <correction>.


⸻

5. Recraft Prompt Template (Generation)

We want Recraft to behave like a TPV surfacing designer.

5.1 Base Template

When calling Recraft, construct a prompt like:

Playground TPV rubber surfacing design, overhead top-down view.
Flat vector illustration with large smooth shapes and bold silhouettes.
No buildings, no playground equipment, no slides, no climbing frames, no benches, no people.
No outlines or strokes, flat fills only, strictly no gradients or texture.
Installer-friendly geometry with big contiguous regions and minimal small details.
Limit palette to {max_colours} flat colours, harmonious and playful.

Theme: {theme extracted from user prompt if available}.
User description: {userPrompt}

Focus on:
- Simple, abstract shapes that suggest the theme.
- Large character or motif silhouettes if relevant (fish, stars, leaves, etc.).
- Clear separation between colour regions.

Optionally include mood keywords if you want (e.g. calm, energetic).

Do not mention things like “isometric” or “3D”. Always emphasise overhead view and flat vector.

⸻

6. Inspector LLM Prompt (Claude Haiku)

6.1 System Prompt

Use something along these lines:

You are a strict compliance inspector for TPV Studio, a playground surfacing design tool.
You analyse SVG artwork to decide whether it is suitable to be installed as rubber surfacing.

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
- Do not include any extra keys.

6.2 User Prompt Template

The user message to Haiku should include:
	1.	Structured requirements.
	2.	The original brief.
	3.	The SVG code (as text).
	4.	The rendered PNG (as an image attachment).

Example (text part):

Check this artwork for TPV surfacing suitability.

Original user brief:
"{userPrompt}"

Surface size: {width_mm}mm x {length_mm}mm
Maximum allowed colours: {max_colours}

SVG code:
```svg
{svgString}

Rules for PASS:
	1.	Style & Geometry
	•	Overhead, top-down view only. No perspective or isometric drawing.
	•	No buildings, no playground equipment, no furniture, no people, no vehicles unless explicitly requested.
	•	Large smooth shapes with gentle curves.
	•	No tiny decorative details: nothing smaller than roughly 120mm in real size.
	•	No ultra-sharp corners with radius smaller than about 600mm in real size.
	2.	Rendering / Vector Rules
	•	No gradients or soft shading.
	•	No textures or noise.
	•	No strokes, outlines, or visible borders around shapes.
	•	No transparency: all fills should be fully opaque.
	•	Total number of distinct fill colours should be ≤ {max_colours}.
	3.	Content Match
	•	Main motifs should match the theme of the user brief.
	•	If you see large elements clearly not requested (e.g. a big playground tower, building, or object that dominates the design), this is a failure.

If the artwork breaks ANY rule above, set “pass” to false and explain why in “reasons”.

In “suggested_prompt_correction”, write a short instruction to the next generator run, for example:
	•	“remove all buildings and 3D structures, keep only flat ground shapes and fish silhouettes”
	•	“remove gradients and shading, use flat colours only”
	•	“limit the design to 4 large blobs and 3 fish silhouettes, no tiny details”

Respond with JSON only.

Attach the PNG as an image in the `messages` payload for Anthropic.

---

## 7. Frontend Changes

### 7.1 Mode Selection

In the TPV Studio UI:

- Add a clear mode label: **“Vector AI (Beta)”** or similar.
- Inputs for this mode:
  - Prompt (text area).
  - Length (mm).
  - Width (mm).
  - Max colours (3–8), default from env.
- A “Generate Vector Design” button.

### 7.2 Job Feedback

While the job is running:

- Show status: “Generating vector design…” then “Checking for installation suitability…”.
- Optionally show an intermediate message if multiple attempts are being made: “First attempt not suitable, trying a simplified version…”

On completion:

- Show SVG rendered in browser (using `<img src="...svg">` or inline `<svg>`).
- Show a small text block:
  - “Installer-ready: Yes/No”.
  - If No → list the inspector reasons.

Provide download buttons:

- “Download SVG”.
- “Download PNG preview”.

---

## 8. Testing Checklist

When Claude implements this, please ensure:

1. **Unit-level tests** (if using Jest/Vitest):
   - Recraft prompt builder outputs the exact prompt template (snapshot test).
   - Inspector prompt builder matches the JSON contract.
   - Loop logic respects `VECTOR_AI_MAX_RETRIES`.

2. **Manual tests**:
   - Simple ocean brief (“calm ocean with big fish shapes”) → passes within 1–2 attempts.
   - Brief that naturally generates equipment (“playground with slide and sea theme”) → first attempt should fail due to slide; correction should remove structures.
   - Brief with too many colours → inspector should fail and suggest fewer regions; after correction we should see simpler compositions.

3. **Failure behaviour**:
   - If Recraft errors, job status is set to `failed` and a useful message is stored.
   - If Inspector errors, we default to **fail safe** (do not mark as compliant).

4. **Performance**:
   - End-to-end call completes under Vercel’s function timeout (ideally < 30 seconds).
   - Preview PNG and thumbnail generation do not exceed memory limits.

---

## 9. Summary for Claude

- Implement a **new vector-only AI mode** using **Recraft SVG** via Replicate.
- Build a **Recraft → Inspector loop** where:
  - Recraft generates SVGs.
  - Claude Haiku inspects them against TPV-specific rules.
  - The system retries with prompt corrections when necessary.
- Store final **SVG + PNG** in Supabase and expose them via the existing TPV Studio frontend.
- This mode must never return raster-only output; SVG is the primary artefact, with PNG strictly for preview.

Please follow this brief step-by-step, using the suggested file structure and prompt templates. If any parts of the existing codebase conflict, adapt paths but keep the overall architecture and behaviours described here.