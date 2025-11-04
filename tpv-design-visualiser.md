# Rosehill TPV Design Visualiser
Version: 1.0
Last Updated: 2025-11-04
Author: Rosehill Group

## 1. Overview

The **Rosehill TPV Design Visualiser** is an internal, high-fidelity web tool that allows users to:
- Upload a photo of an existing playground or site.
- Define the surface area to be resurfaced with Rosehill TPV®.
- Select TPV colours or blends (from the 21 approved colours or a Colour Mixer share code).
- Generate a realistic AI preview showing the proposed design using brand-accurate colours and materials.
- Export before/after images or client PDFs.

This app integrates deterministic colour management (via the existing Colour Mixer) with AI-assisted inpainting for photorealistic blending.

## 2. Objectives

- Uncompromising visual quality for internal client presentations.
- Strict colour compliance — only the 21 Rosehill TPV colours or authorised blends.
- Repeatable, deterministic results (same input = same output).
- Hybrid rendering pipeline combining geometric texture projection and AI seam harmonisation.
- Modular components reusable across other design tools.

## 3. System Architecture

### Stack

| Layer | Technology |
|-------|------------|
| Front-End | Vanilla JS or React (as per current TPV site), WebGL/Canvas for masking and rendering |
| Backend | Supabase Edge Functions (Deno) |
| Storage | Supabase Storage (private buckets, signed URLs, hourly cleanup) |
| AI Inference | Replicate REST API (FLUX Fill Pro, SAM 2, Llama 3); SDXL Inpaint emergency fallback |
| Authentication | Supabase Auth with @rosehill.group email allow-list, RLS policies |
| Analytics | GA4 (events: upload, colour_select, generate, export) |

## 4. User Flow

1. **Upload Photo**
   Accepts JPG/PNG ≤ 12 MB. EXIF stripped. Optional face blurring (MediaPipe, toggleable for customer-supplied photos).
2. **Mask Selection**  
   Auto-mask via SAM 2 (Replicate). Manual polygon + brush refine. Optional plane-fit.
3. **Colour Selection**  
   Pick up to 3 colours from the 21-colour palette, or paste a Colour Mixer share code. Mixer logic computes proportions and average colour.
4. **Design Options**  
   Pattern: `solid | speckle | swirl | islands | borders | logo`. Granule scale and brightness sliders.
5. **Generate Preview**  
   Two modes: **Mode A (Deterministic Overlay)** and **Mode B (AI Photoreal)**.
6. **Review & Export**  
   Before/after slider. Export JPG/PNG or A4 client PDF. Optional “Request Quote”.

## 5. Colour Management

### 5.1 Palette Source
The 21 TPV colours are loaded from `/assets/tpv-palette.json` (auto-generated from `mixer.html`).

```json
[
  { "code": "TPV01", "name": "Bright Red", "hex": "#d22630" }
  // ... 20 more entries
]
```

### 5.2 Blend Calculation
Reuse the mixer function to compute the average blend colour as a weighted RGB average.

### 5.3 Share Code Parsing
Mixer share codes encode colour IDs and ratios. Provide `decodeMix(code)` to return `{ code: fraction }` mapping.

### 5.4 Soft Colour Quantisation (Palette-Aware)

To maintain photorealism while preserving brand accuracy, we use a **tiered soft snapping** algorithm:

**Algorithm:**
1. Convert candidate pixels from sRGB to **OKLab** (perceptually uniform colour space)
2. Find nearest TPV swatch by computing ΔE (Euclidean distance in OKLab)
3. Apply tiered snapping based on ΔE:
   - **ΔE ≤ 2**: Full snap to nearest palette colour (exact match)
   - **2 < ΔE ≤ 6**: Soft blend `C_out = mix(C_original, C_nearest, α)` where α scales from 0.3 → 0.85
   - **6 < ΔE ≤ 10**: Minimal correction (edge tolerance for photorealism)
   - **ΔE > 10**: Flag as out-of-gamut, apply strongest correction + warning
4. **Edge Guard Band**: 6–12 px ring along mask edge is exempt from hard snapping; use guided filter to preserve photo texture
5. **Dithering**: Apply low-amplitude blue-noise or Floyd–Steinberg dithering before converting back to sRGB to maintain micro-contrast

**Result:** Surfaces read as TPV-branded colours without posterization or plastic appearance.

## 6. Rendering Pipeline

### 6.1 Mode A: Deterministic Overlay (with Non-Planar Support)

**Warp Modes** (three levels):
1. **Single Homography** (default, fast): For flat or near-planar surfaces
2. **Piecewise Mesh Warp**: Subdivide polygon into 16×16 or 32×32 grid; optimize vertex positions with ARAP (As-Rigid-As-Possible) for gentle slopes/curves
3. **Depth-Aware Warp**: Run fast monocular depth estimation (Depth-Anything) to derive per-pixel scale corrections

**Rendering Steps:**
1. Generate procedural TPV granule texture (tile size 512–1024 px, toroidal/tileable, Poisson-disk sampling of 1–4 mm granules)
2. Apply chosen warp mode to project texture onto masked region at correct scale
3. **Shadow Preservation:**
   - Convert original photo to linear RGB → compute luminance Y
   - Fit smooth reflectance field R (median-filtered chroma or polynomial fit over masked region)
   - Compute shading map: `S = clamp(Y / (R + ε), 0.6, 1.4)`
   - Composite: `TPV_out = TPV_render × S` (preserves existing shadows and falloff)
4. Output composite with exact TPV colours

### 6.2 Mode B: AI Photoreal
1. **Segmentation**: SAM 2 on Replicate to propose masks
2. **Prompt Refinement**: Llama 3 / 3.1 70B Instruct on Replicate converts user text and palette into a structured prompt
3. **Texture Reference**: Deterministic tile from Mode A passed as a reference (IP-Adapter or similar control)
4. **Inpainting**: FLUX 1 Fill Pro (Replicate) with image, mask, prompt, negative prompt, texture reference; 30–40 steps, guidance 8–10, 1536 px short edge (HD: 2048 px)
5. **Post-process**:
   - Soft palette quantisation (ΔE ≤ 8-10 at edges, stricter in-mask; see Section 5.4)
   - Edge blending (Laplacian or Poisson; see Section 6.3)
   - Optional Real-ESRGAN upscale (2×–4×)

### 6.3 Blending Options

**Client-side (default):**
- **Laplacian Pyramid Multiband Blending** (3–5 levels)
- GPU-accelerated via WebGL
- Fast and excellent for ground surfaces

**Server-side (optional "hero" mode):**
- **Poisson Seamless Cloning** for ultra-clean edges
- Longer processing time but sometimes cleaner on tricky seams

## 7. Replicate Models (preferred)

| Stage | Model | Purpose |
|-------|-------|---------|
| Segmentation | SAM 2 | Auto mask proposals |
| Prompt | Llama 3/3.1 70B Instruct | Structured, safe prompt |
| Inpainting | FLUX 1 Fill Pro | Photoreal ground replacement |
| Control (optional) | Depth/Canny Pro | Preserve geometry |
| Upscale (optional) | Real-ESRGAN | Final polish |

Typical full-quality run with 3 variants ≈ $0.50–$0.60 per job.

## 8. API Design

### 8.0 `/api/visualise` (Orchestration Endpoint)

Single endpoint for the front end that orchestrates the full pipeline:

```ts
POST /api/visualise
Body: {
  imageUrl: string | base64;                    // or signed://…
  mask: { polygon: [x,y][] } | { maskUrl: string };
  colours: { RH30:0.5, RH01:0.3, RH20:0.2 } | { mixCode: string };
  pattern: "solid" | "speckle" | "swirl" | "islands" | "borders" | "logo";
  mode: "deterministic" | "ai";
  options?: {
    variants?: number;         // default 3
    size?: number;             // 1536 (default) or 2048 (HD)
    granuleScaleMm?: number;   // 1–4, default 3
    brightness?: number;       // -0.2 to +0.2, default 0
  };
}

Response: {
  jobId: string;
  status: "complete" | "processing" | "error";
  results: {
    texture: { url: string, avgHex: string };
    mask: { url: string, autoDetected: boolean };
    prompt?: { text: string, negative: string };
    previews: Array<{
      url: string;
      paletteScore: { deltaEmean: number, deltaEmax: number, outOfGamutPx: number };
    }>;
    export?: { pdf: string, jpg: string };
  };
  metrics: { processingMs: number, replicateCostUsd: number };
}
```

**Behaviour:**
- Calls internal modular endpoints (`/api/texture`, `/api/mask`, `/api/prompt`, `/api/ai-preview`, `/api/palette-clamp`)
- Returns signed URLs (10 min expiry) for all assets
- Logs metrics and costs

### 8.1 `/api/texture`
Generate deterministic TPV texture tile.

```ts
POST /api/texture
Body: {
  parts: Record<string, number>;
  pattern: "solid" | "speckle" | "swirl" | "islands" | "borders" | "logo";
  seed?: string;
  size?: number; // 256–1024
}
→ { textureUrl: string, avgHex: string }
```

### 8.2 `/api/mask`
Generate or refine segmentation mask.

```ts
POST /api/mask
Body: { imageUrl: string, polygon?: [x,y][], refine?: boolean }
→ { maskUrl: string }
```

### 8.3 `/api/prompt`
Build structured prompt via Llama.

```ts
POST /api/prompt
Body: {
  userText: string;
  colours: string[]; // hex or TPV codes
  pattern: string;
  sceneCaption?: string;
}
→ { prompt: string, negative: string, cfg: number, steps: number, seed: number }
```

### 8.4 `/api/ai-preview`
Full AI render orchestration.

```ts
POST /api/ai-preview
Body: {
  imageUrl: string;
  maskUrl: string;
  textureUrl: string;
  prompt: string;
  negative: string;
  mode: "deterministic" | "ai";
  variants?: number; // default 3
  size?: number; // px
}
→ { previews: string[], paletteReport: { deltaEmax: number, outOfGamut: number } }
```

### 8.5 `/api/palette-clamp`
Quantise colours to the approved palette.

```ts
POST /api/palette-clamp
Body: { imageUrl: string, maskUrl: string, palette: string[], dE?: number }
→ { clampedUrl: string, metrics: { deltaEmean: number, deltaEmax: number } }
```

## 9. Prompt Template

```
PROMPT:
Blend only the ground surface inside the provided mask. Preserve all objects, people, buildings and shadows. Material: sustainable Rosehill TPV® rubber granule surfacing (1–4 mm), matte finish, fine stipple texture. Colours: {{ colourList }} (pattern: {{ pattern }}, ratios: {{ ratios }}). Maintain lighting and camera perspective.

NEGATIVE_PROMPT:
no extra objects, no people, no text, no glossy or wet surfaces, no overexposure, no distortion.
```

## 10. Front-End Components

| Component | Function |
|----------|----------|
| `Uploader` | Drag-and-drop, EXIF strip, face blur |
| `MaskEditor` | Polygon + brush, integrates SAM suggestions |
| `PalettePicker` | 21 swatches + share-code input |
| `PatternSelector` | Pattern presets |
| `GranuleScale` | Adjust texture density |
| `PreviewCanvas` | Before/after slider |
| `GenerateButton` | Mode A / Mode B toggle |
| `ExportPanel` | JPG/PDF download, quote request |
| `PaletteBadge` | “TPV Palette Locked” indicator (ΔE < 4) |

## 11. Storage Structure & Security

```
/tpv-visualiser/
  uploads/{sessionId}/original.jpg
  masks/{sessionId}/mask.png
  textures/{sessionId}/tile.png
  renders/{sessionId}/variant-{n}.jpg
  exports/{sessionId}/client-sheet.pdf
```

**Bucket Configuration:**
- Name: `tpv-visualiser` (**private**, not public)
- Access: Signed URLs with 600 s (10 min) expiry
- Cleanup: Hourly scheduled Edge Function deletes objects older than 24 h
- Session IDs: UUID v4 for namespace isolation

## 12. Quality Controls

- **Colour accuracy**: ΔE ≤ 8-10 at edges (soft snapping for photorealism), stricter in-mask (ΔE ≤ 2-6); measured in OKLab
- **Shadow preservation**: ≤ 10 % deviation in average luminance outside mask
- **Perspective alignment**: RMS warp error ≤ 1 px at mask edges (homography) or ≤ 2 px (mesh warp)
- **No hallucinated elements** in the surface area
- **Texture realism**: Granule size 1–4 mm at correct scale, matte finish

## 13. Security & Privacy

### 13.1 Authentication & Access Control
- **Supabase Auth** with @rosehill.group email allow-list
- Row-Level Security (RLS) policies on database tables
- Session-based access; signed URLs generated per authenticated session only

### 13.2 Data Retention & Privacy
- Images auto-deleted after 24 h via hourly scheduled cleanup
- Private storage bucket with signed URLs (600 s expiry)
- No PII stored in database
- **Face blurring**: Optional MediaPipe Face Detection (toggleable), nice-to-have for customer-supplied photos

### 13.3 API Security
- Replicate API key proxied via server-side Edge Functions (never exposed to client)
- Rate limiting on public endpoints
- CORS restricted to production domain

## 14. Export Specification

**PDF (A4 landscape via Puppeteer):**
- **Server-side generation**: Render HTML template with Puppeteer → PDF
- **Layout**:
  - Left: original image
  - Right: rendered preview
- **Footer**: Colours used (swatches + RH codes + percentages)
- **Metadata**: Date, project name, pattern type, ΔE report (mean/max), Rosehill contact info
- **Quality**: 300 DPI assets where available, suitable for projectors and printing

## 15. Future Enhancements

- Logo compositing (vector EPS onto TPV surface).
- AR mode (WebXR overlay).
- Sanity CMS for publishing case studies.
- Cloud batching for multiple viewpoints.

## 16. Developer Notes

- Reuse `mixer.html` granule-rendering logic for texture synthesis.
- Provide `@rosehill/tpv-palette` module exposing:
  - `PALETTE`
  - `computeAverageBlend(parts)`
  - `decodeMix(code)`
  - `quantiseToPalette(image, palette, dE)`
- Seed all random operations.
- Fallback to Mode A if Replicate is unavailable.

## 17. Example Workflow

```mermaid
flowchart LR
A[Upload Image] --> B[Generate Mask (SAM 2)]
B --> C[User Refines Mask]
C --> D[Select Colours / Mixer Code]
D --> E[Generate TPV Texture (/api/texture)]
E --> F[Prompt Refinement (Llama 3)]
F --> G[AI Inpaint (Flux Fill Pro)]
G --> H[Palette Clamp]
H --> I[Composite + Export]
```

## 18. References

- Colour Mixer HTML (`/public/mixer.html`) — palette logic and blend maths.
- Replicate models — SAM 2, FLUX Fill Pro, Llama 3 70B Instruct, Real-ESRGAN.
- Rosehill TPV colour standards (internal PDF).

## 19. Implementation Phases

### Phase 1: Core Infrastructure (2–3 weeks)
- **Mode A Deterministic Overlay** with mesh warp (ARAP) and single homography
- **Multiband Laplacian blending** (client-side, WebGL)
- Extract texture generation logic from mixer.html into reusable module (`@rosehill/tpv-palette`)
- **Mixer integration**: Full 21-color palette, share code parser
- **Supabase Storage** setup (private bucket, signed URLs with 600s expiry)
- **Supabase Auth** with @rosehill.group allow-list, RLS policies
- Basic upload UI with EXIF stripping
- Polygon masking editor
- JPG export
- **Deliverable**: Working Mode A with deterministic rendering

### Phase 2: AI Integration (1–2 weeks)
- **Replicate API integration** (SAM 2, FLUX Fill Pro, Llama 3)
- Set up Replicate API key in Supabase secrets
- Implement `/api/mask` (SAM 2 auto-segmentation)
- Implement `/api/prompt` (Llama 3 structured prompts)
- Implement `/api/ai-preview` (FLUX Fill Pro inpainting with texture reference)
- Implement `/api/palette-clamp` with **soft quantisation** (OKLab, tiered snapping ΔE ≤ 8-10 at edges)
- **Orchestration endpoint** `/api/visualise` (calls internal endpoints, returns signed URLs)
- Preview canvas with before/after slider
- **Deliverable**: Full AI pipeline with FLUX Fill Pro, soft color correction

### Phase 3: Export & Polish (1 week)
- **PDF export** via Puppeteer (A4 landscape, 300 DPI, color swatches + ΔE report)
- Share code support (import/export from Color Mixer)
- **Optional face blurring** (MediaPipe Face Detection, toggleable)
- **GA4 events** (upload, colour_select, generate, export)
- Scheduled cleanup Edge Function (hourly, delete >24h old objects)
- Error handling and rate limiting
- Documentation and deployment guide
- **Deliverable**: Production-ready visualiser with all features

### Cost & Timeline Summary
- **Total development**: 4–6 weeks
- **Runtime cost**: ~$0.51/job (3 variants), ~$25/month at <5 jobs/day
- **Emergency fallback**: SDXL Inpaint (feature-flagged)
