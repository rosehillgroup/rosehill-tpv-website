# Rosehill TPV Design + Visualiser
Version: 1.0  
Last updated: 2025-11-04  
Author: Rosehill Group

## Purpose
A single tool that first generates installer-ready TPV surface designs from natural language prompts, then (optionally) places the chosen design into a user photo of the proposed site for a realistic visualisation. The system enforces Rosehill’s 21-colour palette and installability constraints.

---

## Summary of capabilities
- Designer briefs with themes or feelings, e.g. “ocean energy with fish”
- Three creative variants per request generated as vector layouts
- Hard rules: minimum feature width, radius, gaps, area thresholds, colour count
- Exports: SVG, DXF, PDF plan with legend and Bill of Materials, PNG preview
- Optional context visualisation: upload site photo, detect ground plane, warp and blend the design into the scene with shadows preserved

---

## High-level architecture
```
Client (React/vanilla)  ─┬─ Creative UI (prompt, colours, size, variants)
                         ├─ Visualiser UI (photo upload, corner tool, slider)
                         └─ WebGL canvas workers (granule textures, compositing)

Edge/Server (Netlify/Vercel) ─┬─ /api/design/plan        (LLM planner → LayoutSpec)
                              ├─ /api/design/generate    (Geometry engine → SVG/DXF/PDF/PNG)
                              ├─ /api/motif/generate     (on-demand SVG motif creation)
                              └─ /api/visualise          (photo upload, Replicate calls, compositing orchestration)

Replicate  ─┬─ Llama 3/3.1 70B Instruct (brief → LayoutSpec JSON)
            ├─ SAM 2 (segmentation mask)
            └─ Depth Anything V2 (depth map)

Supabase   ─┬─ Auth (allow-list @rosehill.group)
            ├─ Storage (private buckets, signed URLs, 24 h purge)
            └─ Edge Function (hourly cleanup)
```

---

## Data contracts

### GenerateRequest
```ts
type GenerateRequest = {
  prompt: string;
  surface: { width_m: number; height_m: number; border_mm?: number };
  palette?: { code: string; ratio?: number }[];   // one of TPV21 or empty for auto
  max_colours?: number;                            // default 3
  complexity?: "low"|"medium"|"high";              // density and motif detail
  creativity?: 0|1|2|3;                            // 0 conservative .. 3 bold
  strictness?: 0|1|2|3;                            // 0 loose .. 3 strict install rules
  variants?: number;                               // default 3
};
```

### LayoutSpec (LLM output) — excerpt
```json
{
  "meta": {"title":"Ocean Energy","theme":"ocean","mood":["calm","flowing"]},
  "surface": {"width_m":5,"height_m":5,"border_mm":100},
  "seeds": {"global":41721,"placement":9182,"colour":1123},
  "palette": [
    {"code":"TPV08","role":"base","target_ratio":0.55},
    {"code":"TPV11","role":"accent","target_ratio":0.30},
    {"code":"TPV21","role":"highlight","target_ratio":0.15}
  ],
  "grammar": [
    {"name":"Bands","weight":0.6,"params":{"bands":3,"amplitude_m":[0.3,0.8],"smoothness":0.8}},
    {"name":"Clusters","weight":0.4,"params":{"count":3,"spread":0.6}}
  ],
  "motifs": [
    {"id":"fish-simple","count":6,"size_m":[0.5,0.9],"rotation":"follow_flow","layer":"accent"},
    {"id":"starfish","count":3,"size_m":[0.4,0.6],"layer":"highlight"}
  ],
  "rules": {
    "min_feature_mm":120,"min_radius_mm":600,"min_gap_mm":80,"min_island_area_m2":0.3,
    "max_colours":3,"max_pieces_per_colour":25,"no_acute_angles":true
  }
}
```

### GenerateResult
```ts
type GenerateResult = {
  variant: number;
  seed: number;
  svgUrl: string;
  dxfUrl: string;
  pdfUrl: string;
  pngUrl: string;
  bom: { colourAreas_m2: Record<string, number>; totalArea_m2: number };
  score: number;
  violations: Violation[];
  notes: string[];
};
```

### VisualiseRequest
```ts
type VisualiseRequest = {
  svgUrl: string;                                  // chosen design
  surface: { width_m: number; height_m: number };
  photo: File | string;                            // base64 or signed URL
  alignment?: { points?: [number,number][] };      // 4 points for manual override
  quality?: "preview"|"high";
};
```

### VisualiseResult
```ts
type VisualiseResult = {
  compositeUrl: string;        // final JPEG/PNG
  beforeUrl: string;           // original image for slider
  depthMapUrl?: string;
  maskUrl?: string;
  metrics: { ms: number; costUsd: number; method: "auto"|"manual" };
};
```

---

## APIs

### 1) Design planning
`POST /api/design/plan`  
- Input: `GenerateRequest`  
- Action: Calls Replicate Llama 3/3.1 to produce a strict JSON `LayoutSpec`. Uses few-shot examples and JSON mode.  
- Output: `{ spec: LayoutSpec, palette: ColourSpec[], notes: string[] }`

### 2) Design generation
`POST /api/design/generate`  
- Input: `{ spec: LayoutSpec, variants?: number }`  
- Action: Geometry engine builds vector designs using grammars, motifs and constraints, then exports assets.  
- Output: `GenerateResult[]`

### 3) Motif generation (on-demand)
`POST /api/motif/generate`  
- Input: `{ tags: string[], target_size_m?: number }` or `{ prompt: string }`  
- Action: Uses Flux Dev or SDXL to create a simple silhouette raster, vectorises, simplifies to constraints, saves SVG to catalogue.  
- Output: `{ id: string, svgUrl: string }`

### 4) Context visualisation
`POST /api/visualise`  
- Input: `VisualiseRequest`  
- Action:
  1) Store photo to private bucket, signed URL
  2) Replicate: SAM 2 → ground mask, Depth Anything V2 → depth
  3) Estimate ground plane and vanishing lines
  4) Compute homography from surface to image plane
  5) Rasterise SVG to texture, apply perspective warp
  6) Extract luminance-based shadow mask; composite with multiply
- Output: `VisualiseResult`

---

## Client workflow

1) Prompt, colours, size → `design/plan`  
2) Show 3 thumbnails from `design/generate`  
3) User selects one → “Visualise in my space”  
4) Upload photo → `visualise`  
5) Show before/after slider and “Download visualisation” button  
6) Exports from `design/generate` always available: SVG, DXF, PDF, PNG

---

## Geometry engine
- Runs server-side or as a Web Worker
- Grammar catalogue: Bands, Clusters, Rays, Islands, Mosaic, Network, Symmetry
- Shapes: superellipses, capsules, rounded polygons, smooth offset paths
- Flow fields: Perlin noise seeded for cohesion
- Boolean ops: robust polygon clipping
- Constraint checks: minimum width, radius, gaps, island area, piece count
- Auto-repair: thicken, round, merge, remove micro-fragments, adjust ratios within ±5 pp

---

## Colour governance
- Source of truth: `@rosehill/tpv-palette` (21 swatches)
- Roles: base, accent, highlight with target ratios
- Export enforces exact TPV codes
- Optional contrast advisory

---

## Visualiser details

### Plane detection
- SAM 2 mask + depth map to locate the dominant planar ground region
- If confidence low, prompt user to click 4 corners
- Maintain scale: 5 m corresponds to pixel distance along the fitted plane

### Homography and warp
- Compute 3x3 homography H using OpenCV.js
- Rasterise SVG at 1024–2048 px depending on output quality
- Warp with WebGL for speed or server compositor for “high”

### Shadows and colour
- LAB luminance channel yields a soft shadow field S
- Composite: `TPV = clamp( TPV * S^k )` with k in [0.8, 1.2]
- Optional small hue and gamma offset to match scene tone

### Output
- Preview JPEG 1600 px wide
- High-quality PNG with transparency preserved on edges
- Optional watermark and caption

---

## Auth, storage, security
- Supabase Auth, allow-list *@rosehill.group*
- Private buckets only, every access via signed URL (600 s default)
- Edge Function cron hourly: delete objects older than 24 h
- No PII stored, EXIF stripped from photos

---

## Costs (per visualisation)
- SAM 2 segmentation: ~$0.01
- Depth Anything V2: ~$0.01
- Compositing: client-side, free
- Total: about **$0.02**

---

## Telemetry
- Log prompt theme, grammars chosen, seed, generation time, score, violations, palette used
- Log visualise method: auto/manual, inference times, cost
- Do not log photos or store beyond 24 h

---

## Acceptance criteria
- Three distinct creative variants per request
- All designs pass constraint checks or are auto-repaired
- Only TPV palette colours present in outputs
- Visualisation aligns to perspective and preserves shadows
- Visualisation turnaround under 10 s for preview
- Exports available: SVG, DXF, PDF, PNG

---

## Delivery plan

### Phase 1: Design Engine (2 weeks)
- Implement `design/plan` and `design/generate`
- Grammars: Bands, Clusters, Islands, Symmetry
- Motif library starter set (fish, starfish, wave, numbers, letters)
- Exports and BoM

### Phase 2: Visualiser (1 week)
- Photo upload, EXIF strip, storage
- SAM 2 + Depth V2 calls
- Homography, WebGL compositor, before/after slider

### Phase 3: Polish (1 week)
- One-click repairs in UI, corner tool, high-quality PNG, watermark
- PDF plan styling and title block
- Analytics events

---

## Risks and mitigations
- Ambiguous prompts → examples, few-shot LLM hints, preview notes
- Segmentation fails → manual 4-point override
- Tiny details in motifs → auto-simplify and remove micro-fragments
- Colour confusion → palette enforcement and contrast warnings
- Performance → workers and WebGL, stream results

---

## Appendices

### A. Few-shot example (LLM)
User: 5x5 m, “ocean energy”, fish, colours auto  
Spec: see JSON excerpt above

### B. File layout
```
/apps/tpv-design-visualiser
  /public
  /src
    /components
    /workers
    /lib
      palette/
      geometry/
      grammars/
      api/
  /api
    design/
    motif/
    visualise/
```

### C. Environment variables
- REPLICATE_API_TOKEN
- SUPABASE_URL
- SUPABASE_SERVICE_KEY
- ALLOWLIST_DOMAIN=rosehill.group
