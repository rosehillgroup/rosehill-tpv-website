TPV Studio – Mood Board Generator Pipeline (Markdown Specification)

Version: 1.0 – November 2025

This document defines the new behaviour for the AI generation system in TPV Studio.
We are replacing the old surface generator with a Mood Board Generator that produces atmospheric, creative concept visuals — not installer-friendly designs.

This file contains everything needed for implementation:
	•	System prompt
	•	Prompt refiner rules
	•	Final Flux prompt templates
	•	Negative prompt
	•	Parameters
	•	Pipeline notes
	•	Examples

Copy/paste this directly into Claude or your repo.

⸻

# 1. SYSTEM PROMPT (Claude Haiku – Prompt Refiner)

You are a professional playground concept designer.

Your purpose is to transform a user’s short request into a refined prompt for generating a playground-themed *mood board*. 

You DO NOT design finished surfaces, vector graphics, geometric layouts, or installer-friendly patterns.  
You DO NOT simplify shapes, flatten colours, or limit gradients.  
You DO NOT describe rubber flooring, TPV surfacing, or manufacturing constraints.

Your task is purely creative:

Turn the user’s idea into a rich, atmospheric, expressive description suitable for concept art and mood exploration.

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
• rules like “large shapes only”, “flat colours only”, “no gradients”, etc.  

Always output 1–3 sentences describing a visually inspiring playground concept.

Example:
User: “ocean theme”
Output: “A calming ocean-themed playground mood board with flowing blues, soft turquoise gradients, shimmering wave forms, playful sea creatures and gentle underwater lighting. A dreamy, atmospheric concept illustration evoking a sense of seaside adventure.”


⸻

# 2. FINAL POSITIVE PROMPT TEMPLATE (Flux Dev)

Used by the backend after merging Claude’s refined text into {REFINED_PROMPT}.

Playground concept art mood board, rich colours and expressive atmosphere, cinematic lighting, soft gradients, painterly textures, cohesive composition, modern design inspiration, creative environmental storytelling. Theme: {REFINED_PROMPT}. Overhead or angled perspective, harmonious colour palette, organic shapes, playful forms, depth and visual interest, professional mood board aesthetic, high-quality concept illustration.


⸻

# 3. NEGATIVE PROMPT TEMPLATE

We remove anything that breaks aesthetic coherence, but we allow gradients, shadows, depth.

text, letters, numbers, logos, watermarks, distorted faces, human portraits, glitch artifacts, excessive noise, low-resolution textures, overexposed highlights, extreme surrealism, gore, dismemberment, photoreal product mockups, 3D CAD renders, technical diagrams, blueprint layouts, vector-flat graphic style, geometric lineart surfaces, repetitive tiling, warped anatomy, broken perspectives


⸻

# 4. RECOMMENDED FLUX DEV PARAMETERS

Updated for mood-board generation.
No flattening, no simplification pass, no vector limitations.

Core Parameters

Parameter	Value	Notes
prompt_strength	0.90 – 1.0	Stick closely to refined prompt
guidance	3.0 – 4.5	Balanced creativity & control
steps	20 – 25	High quality without slowdown
scheduler	K_EULER or DPMSolver	Stable & clean
width/height	Use existing cropping pipeline	Keep aspect-ratio logic
Two-pass pipeline	❌ Disable completely	Mood boards should NOT be flattened

Disable Pass 2

Set:

FLUX_TWO_PASS_ENABLED=false

Mood boards must remain expressive and detailed.

⸻

# 5. PIPELINE FLOW (High-Level)

1. User enters prompt

e.g. “ocean playground with friendly sea animals”

2. Claude Haiku refines prompt
	•	no geometric constraints
	•	no manufacturing
	•	no surface language
	•	1–3 sentences describing mood, colour, atmosphere
	•	stored as {REFINED_PROMPT}

3. Backend builds final Flux Dev text prompt

POSITIVE_PROMPT({REFINED_PROMPT}) + NEGATIVE_PROMPT

4. Flux Dev generates mood board (raster image)
	•	No stencil, no img2img
	•	Pure text-to-image
	•	Cinematic, colourful, expressive

5. Crop/pad to desired aspect ratio

Keep the sophisticated cropping logic already in the system.

6. Upload to Supabase

Stored as the final mood board output.

⸻

# 6. EXAMPLE INPUT → OUTPUT TRANSFORMATIONS

Example 1

User:

“space playground”

Claude refines:

“A bright cosmic playground mood board filled with glowing planets, star trails, soft nebula clouds and floating playful shapes. Colourful gradients and imaginative space motifs create a sense of wonder.”

Final positive prompt becomes:

Playground concept art mood board, rich colours and expressive atmosphere, cinematic lighting, soft gradients, painterly textures, cohesive composition, modern design inspiration, creative environmental storytelling. Theme: A bright cosmic playground mood board filled with glowing planets, star trails, soft nebula clouds and floating playful shapes. Colourful gradients and imaginative space motifs create a sense of wonder. Overhead or angled perspective, harmonious colour palette, organic shapes, playful forms, depth and visual interest, professional mood board aesthetic, high-quality concept illustration.


⸻

# 7. IMPORTANT RULES

1. No more installer/surface prompts

Remove ALL previous constraints like:
	•	“flat colours only”
	•	“big radii”
	•	“installer-friendly geometry”
	•	“limit to 6 colours”
	•	“no gradients”
	•	“no shadows”
	•	“flat overhead raw shapes”

2. Mood Boards should use:
	•	gradients
	•	expressive lighting
	•	shadows
	•	textures
	•	painterly elements
	•	atmospheric storytelling
	•	rich colour palettes
	•	modern concept-art style

3. Mood Boards are NOT surfaces

We must avoid the generator creating:
	•	rubber mat texture
	•	flat-floor diagrams
	•	geometric TPV layouts
	•	literal “surfacing”

This pipeline is purely for creative ideation.

⸻

# 8. CHECKLIST FOR CLAUDE

Claude must always:
	•	interpret the user’s idea emotionally + visually
	•	expand it into a mood board description
	•	avoid technical language
	•	avoid describing installer constraints
	•	avoid geometric/surface rules
	•	output short, cinematic, imaginative text

⸻

# 9. READY TO IMPLEMENT

All changes required:
	•	Update Claude system prompt
	•	Remove Pass 2
	•	Replace old installer-friendly Flux prompts
	•	Install new creative prompts
	•	Replace negative prompt
	•	Adjust environment variables
	•	Keep cropping pipeline
	•	Keep job handling + webhooks unchanged
