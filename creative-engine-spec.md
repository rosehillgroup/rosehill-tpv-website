# Rosehill TPV Surface Design Creative Engine
Version: 1.0  
Last Updated: 2025-11-04  
Author: Rosehill Group

## Purpose
Generate installer-ready vector surface designs from abstract user prompts while enforcing Rosehill TPV constraints and colour governance. The engine converts a natural language brief into a structured layout specification, then builds geometry that is beautiful, practical, and reproducible.

## High-level pipeline
1. **Prompt normalisation** → clean text and capture surface size and user options.
2. **LLM Planner** → convert brief into a `LayoutSpec` JSON: theme, grammar mix, palette proposal, motifs, constraints, and seeds.
3. **Geometry Engine** → produce vector shapes from the spec with hard rules.
4. **Validator and Auto-repair** → enforce min widths, radii, gaps, area thresholds.
5. **Variant Manager** → produce 3 creative directions from the same prompt.
6. **Exporter** → SVG, DXF, PDF plan, PNG preview, BoM.
7. **(Optional) Ideation Assist** → low-cost raster concept, then vectorise and simplify under constraints.

---

## Glossary
- **Grammar**: a compositional archetype such as Bands, Clusters, Rays, Islands, Mosaic, Network, Symmetry.
- **Motif**: a vector asset or parametric generator (e.g. fish, wave, star, capsule lane).
- **Rules**: installability constraints such as minimum feature width.
- **Seed**: random seed controlling layout variation for reproducibility.

---

## Contracts

### 1) Request model
```ts
type GenerateRequest = {
  prompt: string;
  surface: { width_m: number; height_m: number; border_mm?: number };
  palette?: { code: string; ratio?: number }[];   // from TPV21 or empty for auto
  max_colours?: number;                            // default 3
  complexity?: "low" | "medium" | "high";          // affects density and motif detail
  creativity?: 0|1|2|3;                            // 0 conservative .. 3 bold
  strictness?: 0|1|2|3;                            // 0 loose .. 3 very strict installer rules
  variants?: number;                                // default 3
};
```

### 2) LayoutSpec JSON (LLM output)
Authoritative plan that the geometry engine must follow. Use only fields described here.

```json
{
  "meta": {
    "title": "Ocean Energy",
    "theme": "ocean",
    "mood": ["calm","flowing","playful"],
    "notes": ["use waves and fish clusters", "avoid tiny fragments"]
  },
  "surface": { "width_m": 5, "height_m": 5, "border_mm": 100 },
  "seeds": { "global": 41721, "placement": 9182, "colour": 1123 },
  "palette": [
    {"code": "TPV08", "role": "base", "target_ratio": 0.55},
    {"code": "TPV11", "role": "accent", "target_ratio": 0.30},
    {"code": "TPV21", "role": "highlight", "target_ratio": 0.15}
  ],
  "grammar": [
    {"name": "Bands", "weight": 0.6, "params": {"bands": 3, "amplitude_m": [0.3,0.8], "smoothness": 0.8}},
    {"name": "Clusters", "weight": 0.4, "params": {"count": 3, "spread": 0.6}}
  ],
  "motifs": [
    {"id":"fish-simple","count":6,"size_m":[0.5,0.9],"rotation":"follow_flow","layer":"accent"},
    {"id":"starfish","count":3,"size_m":[0.4,0.6],"layer":"highlight"}
  ],
  "rules": {
    "min_feature_mm": 120,
    "min_radius_mm": 600,
    "min_gap_mm": 80,
    "min_island_area_m2": 0.3,
    "max_colours": 3,
    "max_pieces_per_colour": 25,
    "no_acute_angles": true
  }
}
```

### 3) Result model
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
  violations: Violation[];   // empty if perfect
  notes: string[];
};
```

```ts
type Violation =
  | { type: "MIN_WIDTH"; at: [number, number]; value_mm: number; required_mm: number }
  | { type: "MIN_RADIUS"; at: [number, number]; value_mm: number; required_mm: number }
  | { type: "MIN_GAP"; between: [string, string]; value_mm: number; required_mm: number }
  | { type: "MIN_AREA"; id: string; value_m2: number; required_m2: number }
  | { type: "MAX_COLOURS"; value: number; required: number }
  | { type: "PIECE_COUNT"; colour: string; value: number; max: number }
  | { type: "ACUTE_ANGLE"; at: [number, number]; angle_deg: number; min_deg: number };
```

---

## LLM Planner

### Model
Replicate: Llama 3 or 3.1 70B Instruct. Temperature 0.6–0.8 for creative briefs. JSON mode enforced.

### System prompt (summary)
```
You are a senior playground surface designer. Return compact JSON only.
Use grammars and motifs to translate the brief into a buildable plan.
Respect max 3 colours unless the user insists.
Output must match the LayoutSpec schema. No extra fields.
Every value must be realistic and installable.
```

### Few-shot hints
Provide 6 to 8 pairs of input brief and ideal LayoutSpec snippets for common themes: ocean, jungle, space, geometric, numbers and letters, calm sensory zone.

### Responsibilities
- Choose grammars and weights that reflect mood words.
- Propose a 2–3 colour palette from the TPV21 list or from user selection.
- Set `target_ratio` per colour with soft tolerance ±5 pp.
- Select motifs by id or tags. If missing, set `{"id":"__generate__","tags":["chicken","animal"]}` to trigger on-demand motif generation.
- Provide seeds to stabilise random decisions.
- Set rule overrides only when the user asks. Otherwise use defaults.

---

## Grammar catalogue

Each grammar returns polygonal regions or paths inside the surface rectangle.

### Bands
Curved parallel bands with smoothness and amplitude controls.
- Params: `bands` (2..6), `amplitude_m` [min,max], `smoothness` 0..1, optional `direction` (0, 90, radial)
- Output: stacked regions that sum to full area or partial overlays
- Colouring: base to accent gradient by target ratios

### Clusters
Compact groups of islands aligned to flow fields.
- Params: `count` (1..6), `spread` (0..1), `island_size_m` [min,max]
- Output: sets of rounded polygons suitable for motifs

### Rays
Radial or angular spokes from a focal point.
- Params: `spokes` (4..16), `sweep_deg` (30..360), `jitter`
- Use sparingly; ensures min widths at centre with hole if needed

### Islands
Discrete superellipse or capsule shapes.
- Params: `count`, `size_m` [min,max], `roundness` (0..1)

### Mosaic
Large tilings with rounded corners.
- Params: `cell` ("hex"|"tri"|"square"), `cell_m`, `rounding_mm`

### Network
Meandering tubes that never self-intersect.
- Params: `thickness_mm`, `curvature`, `loop_prob`

### Symmetry
Mirror arrangements for calm and clarity.
- Params: `axis` ("x"|"y"|"xy"), `offset`

Grammars can be blended: the engine composes outputs respecting weights. The flow field can be derived from Perlin noise seeded by `seeds.global` to provide cohesive movement across grammars.

---

## Motifs

### Library
A curated set of simple vector SVGs, each with metadata:
```json
{
  "file": "animals/fish-simple.svg",
  "tags": ["fish","animal","marine"],
  "complexity": "low",
  "min_feature_mm": 150,
  "min_radius_mm": 600,
  "recommended_min_size_m": 0.4,
  "safe_scale_range": [0.6, 2.5],
  "colours": "single"   // or "multi:2"
}
```

### On-demand motif generation
If `id="__generate__"` in the spec:
1. Generate a flat vector-style raster using Flux Dev or SDXL with a strict prompt for simple silhouette.
2. Vectorise (Potrace or custom marching squares).
3. Simplify and repair to meet rules.
4. Save as `/motifs/generated/{slug}.svg` and update the catalogue.
5. Return the new id to the geometry stage.

---

## Rules and defaults

```json
{
  "min_feature_mm": 120,
  "min_radius_mm": 600,
  "min_gap_mm": 80,
  "min_island_area_m2": 0.3,
  "max_colours": 3,
  "max_pieces_per_colour": 25,
  "no_acute_angles": true
}
```
Rules are enforced during generation and re-checked before export. Auto-repair strategies: inflate strokes, round corners, merge fragments, scale motifs up within bounds, remove micro-parts and redistribute colour ratios.

---

## Colour governance

- Palette: 21 TPV colours from a shared module `@rosehill/tpv-palette`.
- LLM proposes `base`, `accent`, `highlight` roles with target ratios.
- Geometry allocates regions to meet ratios within ±5 percentage points.
- Optional contrast checker warns about low contrast pairs.
- No blends in the final artwork unless designer explicitly selects a blend fill. Default is flat colour regions.

---

## Geometry Engine

- Coordinate space in metres. Origin at top-left of surface rectangle.
- Shapes: circles, capsules, superellipses, rounded polygons, offset paths.
- Boolean ops: robust polygon clipping (Clipper or martinez-polygon-clipping).
- Offsetting respects `min_radius_mm` by inserting arcs.
- Flow fields: 2D Perlin noise to drive wave direction and cluster placement.
- Randomness: xorshift* seeded with `seeds.global` and per-variant seed.
- Performance: run in a Web Worker for UI responsiveness.

### Installability checks
- **Minimum width**: compute medial axis or distance transform to find narrow parts.
- **Minimum radius**: evaluate curvature along Bezier segments and arcs.
- **Minimum gap**: compute distance between region boundaries of different colours.
- **Minimum area**: area per island vs threshold.
- **Piece count**: count disjoint regions per colour.
Violations contain coordinates in metres for UI markers.

---

## Variant Manager

Generate 3 variants per request:
- Same LayoutSpec theme, different seeds and weight jitters.
- Variant biases: Conceptual, Figurative, Playful.
- Present thumbnails with scores, areas and colour ratios.

---

## Export

- **SVG** layered by colour and motif groups.
- **DXF** layers per colour for cutting. Curves simplified to arcs and polylines within tolerance.
- **PDF** (A3 or A1): metre grid, legend, BoM, score, notes.
- **PNG** preview (1920 px).

BoM includes m² per colour, total area, optional binder estimates.

---

## API

```
POST /api/design/plan
→ { spec: LayoutSpec, palette: ColourSpec[], notes: string[] }

POST /api/design/generate
→ GenerateResult[]  // one per variant

POST /api/motif/generate   // only when id="__generate__"
→ { id: "animals/chicken-simple", svgUrl: string }
```

Signed URLs via Supabase, private bucket, 24 h expiry. Supabase Auth allow-list for *@rosehill.group*.

---

## LLM prompts (templates)

**System**
```
You are a senior playground surface designer. Produce strict, compact JSON called LayoutSpec.
Use only the schema fields. Choose grammars and motifs that express the mood.
Limit to 3 colours unless requested. Respect installer constraints.
```

**User example**
```
Surface: 5m x 5m. Theme: "ocean energy". Mood: calm, flowing, playful.
User prefers AI to choose colours from the TPV palette. Add fish.
```

**Output must be JSON only**

---

## Optional Ideation Assist

- Generate a single raster concept with SDXL or Flux Dev for inspiration.
- Extract coarse edges and region hints (Canny or SLIC superpixels).
- Geometry Engine uses hints to bias the grammar while still enforcing rules.
- Disabled by default.

---

## Telemetry

- Log theme, chosen grammars, colours, score, violations, seed, generation time.
- Never log user-uploaded images. No PII.

---

## Acceptance criteria

- For abstract prompts, output remains visually rich and varied.
- All exports pass rules with zero violations or with auto-repairs applied.
- Colour usage adheres to the 21 TPV palette, with ratios within ±5 pp.
- Generation time under 5 s for 5 m x 5 m on a typical laptop for non-ideation mode.

---

## Future work
- Depth-aware patterns for sloped surfaces.
- Layout editing handles and one-click fixers in the UI.
- Preset packs for schools, parks, and sports clients.
- Library curation workflow with preview thumbnails and tags.
