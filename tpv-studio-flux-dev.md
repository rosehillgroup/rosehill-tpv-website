# TPV Studio — Flux Dev Generation Specification (v1)

## Overview

This document defines the complete image-generation pipeline for **TPV Studio**, designed to create realistic, installable **TPV playground surface concepts** using **Flux Dev**.  

The goal is to produce **one clean, installer-friendly image** with large shapes, limited colours, and no unnecessary detail — ready to display or export.  
Every generation follows the same pipeline: **prompt → refiner → stencil → Flux → QC → save.**

---

## 1. User Inputs

The user provides only four controls:

| Input | Description |
|--------|--------------|
| **Prompt** | Free text describing the design idea (e.g. “Calm ocean theme with fish and starfish”). |
| **Length (mm)** | Used to calculate aspect ratio. |
| **Width (mm)** | Used to calculate aspect ratio. |
| **Max Colours** | Limits total colours in the design (default 6, maximum 8). |
| *(Post-generation)* **Try Simpler** | Re-runs the same prompt with stricter simplification parameters. |

No other settings or modes are exposed.

---

## 2. Pipeline Summary

1. **Prompt Refinement (Claude Haiku)**  
   Rewrites the user’s prompt into a structured *Design Brief* JSON that constrains the design to:
   - Large radii and simple geometry  
   - Limited colours  
   - Minimal visual noise  
   - Bold, easily installable shapes  

2. **Stencil Generation**  
   Creates a minimal flat composition at the target aspect ratio.  
   - 2–4 broad coloured regions  
   - Up to 2 large motif blobs (circles, icons, or simplified shapes)  
   - Rendered as SVG → PNG  
   - No gradients, no outlines  
   - Used as the base image for Flux Dev (img2img)

3. **Flux Dev Image Generation (img2img)**  
   Runs with tuned parameters optimised for simplicity and reliability.  
   - Uses the refined brief and stencil  
   - Preserves full composition (never cropped)  
   - If aspect ratio not supported, letterbox or pillarbox to fit  

4. **Quality Control (QC)**  
   Automatically analyses the output:  
   - Region count (≤ ~10)  
   - Minimum feature size (≥ 120 mm)  
   - Minimum curvature radius (≥ 600 mm)  
   - Effective colour count (≤ max_colours + 1)  
   - Shadow style (reject soft/airbrushed gradients)  
   If complexity exceeds limits → one automatic rerun with stricter parameters.  

5. **Output & Save**  
   - Displays final image.  
   - “Try Simpler” button repeats generation with stronger simplification (lower denoise, stronger negatives).  
   - Stores prompt, brief JSON, parameters, seed, QC results, and final image to Supabase.

---

## 3. Prompt Refinement

**Model:** Claude Haiku  
**Instruction:**  
> “You are a senior playground surfacing designer. Convert the user’s text into a concise TPV design brief suitable for installation: large shapes, broad regions, minimal detail, limited colours, and smooth geometry. Output valid JSON only.”

**Expected Output Schema:**
```json
{
  "title": "string",
  "mood": ["calm", "playful", "bold"],
  "composition": {
    "base_coverage": 0.5,
    "accent_coverage": 0.3,
    "highlight_coverage": 0.2,
    "shape_density": "low",
    "max_detail_level": "low",
    "min_feature_mm": 120,
    "min_radius_mm": 600,
    "target_region_count": 3,
    "avoid": ["thin outlines", "text", "tiny shapes"]
  },
  "motifs": [
    {"name":"fish","count":3,"size_m":[0.6,1.0]}
  ],
  "arrangement_notes": "2–3 flowing bands with bold silhouettes and generous spacing."
}
```

The JSON is then converted into a Flux-ready text prompt.

---

## 4. Prompt Construction for Flux Dev

**Positive Prompt Template:**
```
Playground TPV rubber surfacing design, flat vector look with large smooth shapes,
installer-friendly geometry, bold silhouettes, no outlines, no text, minimal detail,
uniform flat colours (no gradients), optional hard drop-shadows with crisp edges (decal-style),
matte finish, overhead view.

Theme: {title}; mood: {mood list}.
Motifs: {motif list as simple icons}.
Composition: {arrangement_notes}.
Keep total colours ≤ {max_colours}.
```

**Negative Prompt Template:**
```
busy pattern, fine texture, thin lines, high-frequency detail, text, letters, numbers,
metallic, glossy, photoreal, perspective, bevel, emboss, gradient shading, soft shadows,
airbrush, grunge, graffiti, clipart clutter
```

---

## 5. Flux Dev Parameters

| Parameter | Value / Range | Purpose |
|------------|----------------|---------|
| **steps** | 18 – 20 | Sufficient detail without over-rendering |
| **guidance** | 3.5 – 4.5 | Balances creativity and clarity |
| **denoise** | 0.30 | Keeps stencil composition |
| **seed** | random (saved) | Ensures reproducibility |
| **aspect_ratio** | Nearest Flux Dev supported AR | Automatically mapped from user width/length |
| **outputs** | 1 | One clean design per generation |

**“Try Simpler” rerun:**
- `denoise`: −0.05 (min 0.20)  
- Append to negative prompt: *simplify shapes, fewer regions, larger silhouettes*  
- Increase `min_feature_mm` → 160 mm, `min_radius_mm` → 800 mm in the refined brief  

---

## 6. Aspect Ratio Handling

- Calculate user AR = `width_mm / length_mm`.  
- Map to closest supported Flux Dev AR (e.g. 1:1, 4:3, 3:2, 16:9, 9:16).  
- Always **letterbox or pillarbox** if aspect ratios differ — never centre-crop.  
- When resizing for display, maintain all visual information (no auto-cropping).  

---

## 7. Quality Control Rules

After each Flux Dev output:

| Check | Target |
|--------|---------|
| **Region count** | ≤ 10 |
| **Min feature size** | ≥ 120 mm |
| **Min curvature radius** | ≥ 600 mm |
| **Colour count** | ≤ max_colours + 1 |
| **Shadow softness** | None (hard-edged only) |

If any fail → automatic one-time rerun with stricter parameters.  

---

## 8. Storage Schema

Each generation is stored in Supabase under the authenticated user:

```json
{
  "user_id": "uuid",
  "prompt": "Calm ocean theme with fish",
  "brief": { ... },
  "params": { "steps": 19, "guidance": 4.0, "denoise": 0.30 },
  "seed": 123456789,
  "aspect_ratio": "3:2",
  "qc": { "region_count": 8, "colours": 6 },
  "image_url": "https://...",
  "created_at": "timestamp"
}
```

---

## 9. Example Prompts

1. **Calm Ocean**  
   “Calm ocean theme with fish and starfish; flowing bands and gentle movement.”

2. **Geometric Energy**  
   “Energetic playground with large diagonal bands and bold star motifs.”

3. **Nature Pathway**  
   “Leaf silhouettes and winding paths; tranquil and natural atmosphere.”

Each should produce 2–4 regions, ≤ 6 colours, bold shapes, and crisp edges.

---

## 10. Implementation Summary

1. Accept user inputs (prompt / width / length / max colours).  
2. Send to Claude Haiku → receive refined Design Brief.  
3. Generate flat stencil (SVG → PNG) from Design Brief.  
4. Run Flux Dev img2img using:  
   - Stencil as base  
   - Refined prompt + negatives  
   - Parameters listed above  
5. Run QC; if too complex, auto-retry once.  
6. Return final image + “Try Simpler” button.  
7. Save run metadata to Supabase.

---

### Done Criteria

- Single streamlined generation process (no modes or optional steps).  
- Always produces one clean, installable TPV-style design.  
- Automatically respects aspect ratio, colour limits, and simplicity rules.  
- Results consistent enough for client presentation or direct download.

---

✅ **End of Specification** — Claude can now implement this version directly.
