# TPV Studio – Visual Composition Engine Upgrade Plan

## Overview (why this)

The LLM is now delivering good LayoutSpec (roles, grammars, motifs). The renderer is too literal (rects + circles), so outputs look flat. This plan upgrades the geometry + paint stack so the same JSON produces expressive, installer-friendly designs.

⸻

## Current vs Proposed Architecture

| Layer | Current | Proposed |
|-------|---------|----------|
| **Bands** | Flat rect stripes | Perlin-flow bands (wavy centerlines, variable thickness, easing at edges) |
| **Clusters** | Circles | Metaball/superellipse islands with irregular outlines and controlled overlap |
| **Motifs** | Placeholder blobs | Real SVG icons (scaled/rotated), palette-aware, with safe min sizes |
| **Colouring** | Direct fill order | Role-aware palette (base field → grammars → motifs), deterministic z-order |
| **Composition** | Random within bbox | Zones + flow (theme-aware placement, Poisson-disc spacing, flow alignment) |
| **Edge look** | Hard vector edges | Soft edge masks (alpha falloff), optional drop-shadow on motifs |
| **QA** | None | Coverage + thresholds (base ≥45%, accent ≥20%, highlight ≥10%; min feature checks) |

⸻

## Files to Touch (and new ones)

```
/netlify/functions/studio/_utils/
  grammars.js           # UPGRADE: bands, clusters, islands generators
  painter.js            # NEW: compositing, edge softening, role-aware paint
  palette.js            # UPGRADE: role semantics, RH→hex map
  motifs.js             # NEW: SVG loader, placement, scaling, theming
  composition.js        # NEW: zones, Poisson-disc, flow-field utilities
  noise.js              # NEW: Perlin/Simplex noise helpers
  geometry.js           # NEW: superellipse, metaball, polygon ops

/netlify/functions/studio/studio-design-generate.js
  # wire spec → geometry → paint → export (svg/png)

/public/assets/motifs/
  ice-cream-cone.svg, splat.svg, drip.svg, fish.svg, starfish.svg,
  leaf.svg, heart.svg, rounded-star.svg, wave.svg, alphabet-A.svg,
  alphabet-0.svg ...
```

⸻

## Priority Order

### Critical (do these first)
1. **Perlin-Bands** (replace rectangles)
2. **Motif-ball Clusters** (replace circles)
3. **SVG Motif Loader** (real icons)
4. **Role-Aware Colouring** + Base-first paint
5. **Coverage Rebalance** (auto-inflate/seed more shapes to hit role targets)

### Important
6. **Composition Zones & Flow Alignment** (theme heuristics + Poisson-disc)
7. **Edge Softening** (alpha falloff along borders; optional tiny drop shadow)

### Enhancements
8. **Theme Interpreters** (parameter presets per theme/mood)
9. **Outlines/Pinstriping** (1–2 cm highlight outline for contrast when needed)

⸻

## Algorithms & Implementation Notes

### 1) Perlin-flow Bands

**Inputs:** `bands:int, amplitude_m:[min,max], smoothness:[0..1], seed`

**Steps:**
- Build a flow field: `dir = normalize(∇noise(x*k, y*k))`, `k = lerp(0.2, 1.2, 1 - smoothness)`
- Create bands centerlines across the shorter axis (e.g., start left→right)
- Integrate centerlines following flow with RK2; sample every 1–3 cm (in world units)
- Generate band polygons by offsetting the polyline by half-thickness; thickness varies with a low-freq noise `t(x,y) = lerp(aMin, aMax, noise2)`
- Feather edges: store a per-edge "softness" factor (for painter)
- Output: Array of non-self-intersecting polygons tagged `role=accent/highlight` based on weights

### 2) Metaball / Superellipse Clusters

**Inputs:** `count:int, spread:[0..1], seed`

**Steps:**
- Place seeds with Poisson-disc (min distance = `max(0.4m, surface_min_dim/12)`)
- For each seed, create a superellipse: `|x/a|^n + |y/b|^n = 1` with `n∈[2,3.5]`, jittered; `a,b` from size range
- Merge overlapping shapes with metaball union (field sum threshold). If heavy, approximate by polygon union (clipper-lib)
- Apply border rounding (Chaikin or cubic smoothing)
- Output: Irregular islands with consistent minimum radius

### 3) Motif Loader & Placement

**Loader:** parse SVG once, cache as path commands with natural bounds

**Placement:**
- Choose anchor positions using zones (e.g., top-right "constellation", along a band flowline, or cluster centroids)
- Respect constraints: `min_feature_mm ≥120`, `min_gap_mm ≥80` from other colored geometry (use expanded polygons)
- Scale within `size_m` range; rotate per rotation (e.g., `follow_flow` samples local flow tangent)
- Colouring: default `highlight` or layer field; ensure motif colour contrasts base (auto-swap to accent if contrast < ΔE 12)

### 4) Role-Aware Colouring & Paint Order

**Order:** Base field → Bands/Islands/Clusters (accent) → Motifs (highlight) → Optional outlines

**Base field:** Fill entire surface with `palette.base`

**Coverage control:** after painting geometries, compute areal coverage by role. If under target:
- **Bands:** increase local thickness by 5–10%
- **Clusters/Islands:** spawn additional shapes or scale existing up to limits

**Targets (defaults):** base≥45%, accent≥25%, highlight≥10% (overrides allowed by spec)

### 5) Composition Zones & Flow

Provide 3 sensible presets and pick by theme:
- **Linear** (bands dominate top/bottom thirds; motifs cluster near golden-ratio points)
- **Radial** (central focus; motifs spiral along flow)
- **Drift** (everything follows a coherent flow angle; good for "ocean", "wind", "waves")

**Theme mapping (MVP):**
- `ocean, river, wave` → Drift, cooler palette bias, more bands than clusters
- `garden, jungle` → Radial/Drift hybrid, more clusters
- `alphabet, numbers` → Linear grid assist for motif alignment

### 6) Edge Softening

For each painted polygon, in the SVG define a stroke with gradient mask or render dual path:
- Fill solid → overlay a 2–4 mm inward feather using linear gradient mask to soften boundary
- PNG export: apply a small Gaussian blur (σ≈0.5–0.8 px) to the alpha channel only at edges

⸻

## Concrete Code Changes (by file)

### palette.js (UPGRADE)
- Build RH→hex map from `tpv-palette.json`
- Export `resolveRoles(paletteFromSpec, userPalette)` → `{ base, accent, highlight }`
- Export `ensureContrast(fgHex, bgHex, minDeltaE=12)` → maybe swap accent/highlight if needed

### noise.js (NEW)
- Export seeded Perlin/Simplex 2D noise (fast-noise-lite or custom)
- Helpers: `flowField(seed, scale)` returns `(x,y)→vec2`

### geometry.js (NEW)
- `offsetPolyline(poly, r)`
- `superellipse(a,b,n,segments)`
- `metaballUnion(polys, threshold)` (fallback: polygon unions via clipper-lib)
- `smoothPath(poly, iterations=1)` (Chaikin)

### composition.js (NEW)
- `poissonDisc(width,height,r,seed)`
- `zones(theme, surface)` → named rectangles/paths
- `followFlow(path, flowField)` → returns tangent angles for alignment

### grammars.js (UPGRADE)
- `generateBands(params, surface, seeds, flowField)` → polygons, role
- `generateClusters(params, surface, seeds)` → polygons, role
- `generateIslands(params, surface, seeds)` → polygons, role
- `rebalanceCoverage(targets, shapes)` → mutated shapes/new shapes

### motifs.js (NEW)
- `loadSVG(id)` → cached path data
- `placeMotifs(spec.motifs, surface, flow, zones, palette, constraints)` → array of motif instances (path + transform + colour)
- Fallback motif when ID missing (rounded blob) + log warning

### painter.js (NEW)
- `paintSVG(surface, shapes, motifs, palette, options)`
- Z-order: base → accent shapes → highlight motifs → outlines
- Edge feather: gradient mask or dual-path approach
- Returns `{svg, pngBuffer?}` (PNG via sharp if requested)

### studio-design-generate.js (WIRE)
- Parse spec → resolve palette → build flow field → call grammars → rebalance → place motifs → paint → export URLs
- Log coverage metrics and rule violations

⸻

## Parameters (sane defaults)

```javascript
const DEFAULTS = {
  bands: { count: 3, amplitude_m: [0.25, 0.8], smoothness: 0.8 },
  clusters: { count: 8, size_m: [0.4, 1.1], spread: 0.65 },
  islands: { count: 10, size_m: [0.3, 0.9], roundness: 0.7 },
  coverageTargets: { base: 0.50, accent: 0.30, highlight: 0.12 },
  constraints: { minFeatureMM: 120, minRadiusMM: 600, minGapMM: 80 }
};
```

⸻

## Acceptance Criteria (visual + technical)

### Visual
- Bands appear flowing, non-parallel, with tasteful thickness variation
- Clusters look organic, not perfect circles; overlaps form natural island chains
- Motifs are recognisable icons, sized 0.3–1.0 m, rotated/aligned plausibly
- Palette roles respected: base field fills whole canvas; accents & highlights stand out
- Edges are not razor-hard; subtle softness visible at 100% zoom

### Technical
- Base ≥45% coverage, accent ≥25%, highlight ≥10% (unless spec overrides)
- No features <120 mm width; min radius ≥600 mm (auto-repair or flag)
- No overlaps violating min-gap 80 mm between different colours
- Exported SVG is layered: `layer-base`, `layer-accent`, `layer-highlight`, `layer-motifs`
- PNG preview 2048px edge, under ~500 KB with acceptable quality

⸻

## Rollout Plan

1. **Branch:** `feature/visual-composition-engine`
2. Implement palette + painter + noise (low risk)
3. Swap bands generator → Perlin-flow
4. Swap clusters → superellipse/metaball
5. Add motifs with 6–10 SVGs to start (ice-cream cone, splat, drip, fish, starfish, leaf)
6. Enable coverage rebalance; verify targets
7. Add edge softening and simple zones
8. QA with a fixed seed suite of prompts (ocean, jungle, alphabet, city park, space)
9. Merge → behind a feature flag (`VCE_V2=true`) for quick rollback

⸻

## Test Prompts (for QA)

1. "Ocean energy with waves and fish, calm/playful, 5×5 m, 3 colours auto."
2. "Jungle play, energetic, 8×4 m, RH10/RH11/RH41."
3. "Alphabet garden, bold letters A–F, soft petals, 6×6 m, 4 colours: RH50,RH41,RH23,RH11."
4. "Space adventure, stars and planets, 7×5 m, high contrast."
5. "City park geometry, arcs and islands, 10×6 m, subdued palette."

⸻

## Expected Visual Improvements

**Before (current):**
- Flat horizontal bands (literal rectangles)
- Perfect circles for clusters
- No motifs/icons
- Hard vector edges
- Random color assignment

**After (with VCE v2):**
- Flowing, organic bands with thickness variation
- Irregular island shapes with natural overlaps
- Real SVG icons (ice cream cones, splats, fish, etc.)
- Soft edges with subtle feathering
- Intelligent color placement (base→accent→highlight)
- Theme-aware composition (ocean flows, jungle clusters, alphabet grids)

⸻

## Dependencies

### Node packages to add:
```json
{
  "fast-noise-lite": "^1.1.0",     // Perlin/Simplex noise
  "polygon-clipping": "^0.15.3",   // For metaball unions (polygon boolean ops)
  "chaikin-smooth": "^1.0.4"       // For border smoothing
}
```

### Existing dependencies (already in use):
- `sharp` - PNG rasterization
- `@supabase/supabase-js` - Storage uploads

⸻

## Next Steps

1. Review and approve this plan
2. Create feature branch
3. Start with Critical items 1-5
4. Implement and test iteratively
5. Add motif SVGs to `/public/assets/motifs/`
6. QA with test prompts
7. Deploy behind feature flag

⸻

**Status:** Draft
**Owner:** TPV Studio Engineering
**Last Updated:** 2025-11-05
