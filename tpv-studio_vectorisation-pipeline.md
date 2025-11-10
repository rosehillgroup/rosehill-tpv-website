# TPV Studio — Vectorisation Pipeline (Production Outline)

**Goal:** Convert Flux Dev raster outputs into clean, installer‑ready vector art **before** users see them, so they always preview the “true” surface. Preserve the design’s colours and simplify geometry to be layable in TPV (large radii, no hairlines).

---

## 0) Overview

- **Input:** Raster PNG/JPEG from Flux Dev (e.g. 1536×1024 or 1024×1536).  
- **Output:** Layered SVG (and optional PDF/DXF), with:  
  - ≤ 8 unique fills found in the image (we _respect_ existing colours; only merge near‑duplicates).  
  - Min feature size ≥ _min_feature_mm_ (default **120 mm**) mapped to pixels via scale.  
  - Min inner radius ≥ _min_radius_mm_ (default **600 mm**).  
  - No hairline edges; no speckle; closed, non‑self‑intersecting paths.  
- **Latency budget (typical 1536×1024):** 1.5–3.0 s on a modern laptop; 2–6 s in Netlify Function if server‑side.  
- **Where it runs:** Prefer **client‑side Web Worker** for responsiveness; server fallback if image is large or device is slow.

---

## 1) Configuration (single place)

```jsonc
{
  "target_colours_max": 8,               // We won’t invent new colours; we merge near‑duplicates only.
  "colour_merge_delta": 6,               // CIEDE2000 ΔE threshold for fusing near‑identical fills.
  "min_feature_mm": 120,                 // Anything smaller becomes merged into neighbours.
  "min_radius_mm": 600,                  // Rounds small radii upward; removes sharp internal spikes.
  "pixel_density_dpi": 96,               // Assumed preview DPI; can be overridden per project.
  "scale_mm_per_px": 8,                  // Map pixels → millimetres (user sets Length × Width → scale).
  "simplify_tolerance_px": 1.5,          // Douglas–Peucker tolerance at raster scale.
  "spline_fitting": true,                // Fit smooth curves (cubic Béziers) after simplification.
  "hole_keep_ratio": 0.005,              // Holes smaller than this fraction of parent area are removed.
  "max_regions": 160,                    // Safety cap; triggers auto‑merge if exceeded.
  "export": { "svg": true, "pdf": true, "dxf": false }
}
```

- **`scale_mm_per_px`** is computed from user Length×Width vs chosen aspect & preview pixels. E.g. a 24 m × 6 m area at 1536×384 px ⇒ 1 px ≈ 15.625 mm ⇒ `scale_mm_per_px = 15.625`.
- If the generator behaves and keeps ≤ 8 colours, the colour phase is essentially a **de‑dupe** step only.

---

## 2) Pipeline Stages

### 2.1 Preflight & Normalise
1. Decode to RGBA in a **Web Worker** (off main thread).  
2. If larger than 2048 px on the long edge, downscale to **workSize** (e.g. long edge 1536) with **Lanczos** to reduce noise without aliasing.  
3. Optional: **Contrast‑limited adaptive histogram equalisation (CLAHE)** with gentle clip (e.g. 2.0) to firm up edges if image is hazy.  
4. Hard‑shadow enforcement (remove “soft” airbrush): apply small‑radius bilateral filter then **unsharp mask**; finally **posterise** to tiny luminance bins (e.g. 16) to flatten gradients.

### 2.2 Colour Set (respect the image; no palette forcing)
1. Extract the unique colours using **k‑means initialised by unique buckets** (hex‑bin first to avoid over‑splitting).  
2. Sort by pixel area; keep top _N_ (≤ `target_colours_max`).  
3. Merge near‑duplicates using **CIEDE2000 ΔE ≤ `colour_merge_delta`**.  
4. Replace each pixel by its winning centroid → **quantised image**. (No hue shifts beyond merging; this preserves the artist’s look.)

### 2.3 Regionisation
Two robust options; both are acceptable. Choose one and stick to it for determinism.

- **Option A: Flood‑fill over quantised raster**  
  - For each quantised colour index, BFS/DFS connected components.  
  - Record per‑component pixel list and bounding box.  
- **Option B: Superpixels then merge**  
  - Run **SLIC** (simple‑linear‑iterative‑clustering) to form superpixels.  
  - Merge adjacent superpixels with same quantised colour if the boundary contrast is below a small threshold.  
  - This can yield cleaner edges on soft originals.

### 2.4 Geometry Extraction
1. For each component, trace the outer contour and holes using a **marching squares** or **Potrace‑style** path trace.  
2. **Simplify** with **Douglas–Peucker** at `simplify_tolerance_px` (apply to both outer path and holes).  
3. **Min feature filter:** if a region’s area < (`min_feature_mm`/`scale_mm_per_px`)² × π/4, merge into the largest touching neighbour of the same colour.  
4. **Min radius enforcement:**  
   - Run a corner detector; where local radius < `min_radius_mm`, replace the local chain with a circular arc (fit cubic Bézier).  
   - Alternatively apply **morphological opening** (erode/dilate) per colour layer before tracing; then re‑trace. This “bulks up” tight spikes automatically.  
5. Remove **holes** smaller than `hole_keep_ratio × parent_area` unless the colour semantics require them (rare for TPV).  
6. Validate: ensure **closed paths**, no self‑intersections; repair with small offsets or boolean ops.

### 2.5 Topology & Layering
- Z‑order by **descending area** (largest shapes at the bottom) per colour.  
- Ensure deterministic stacking: background colour last, highlights topmost.  
- Optionally compute **region adjacency graph** to help later bill‑of‑materials grouping (not used by vectoriser itself, but cheap to compute here).

### 2.6 Export
- **SVG:**  
  - One `<g>` per colour with `fill:#RRGGBB`.  
  - Paths use relative cubic Béziers where helpful; keep decimals to 2–3 places.  
  - Include `<metadata>` with:
    - original raster dimensions, `scale_mm_per_px`, `min_feature_mm`, `min_radius_mm`, colour list with LAB values and pixel areas.  
- **PDF:** render SVG → PDF (e.g. using `resvg`/`yoga-wasm`/`pdf-lib`).  
- **DXF (optional):** convert each filled region to a closed LWPOLYLINE; group by colour layer name.

---

## 3) Implementation Notes (Browser‑first)

- **Threading:** Run vectorisation in a **Web Worker**. Use `OffscreenCanvas` for any image ops.  
- **Libraries:**  
  - Raster ops: `opencv.js` or lightweight WASM filters; or `sharp` server‑side.  
  - Tracing: `potrace-wasm`, `ImageTracer.js`, or custom marching‑squares (often fastest + predictable).  
  - Path utils/boolean: `Paper.js`, `Flatten‑JS`, or `svg-path-boolop` (WASM options: `clipper2` via WASM).  
  - Curves: `svgpathtools`‑like helpers (TS equivalents exist) to fit cubic Béziers.  
- **Determinism:** Fix random seeds (k‑means) and consistent scan order.  
- **Performance:** Avoid serialising huge arrays across worker boundary; use `Transferable` buffers.  
- **Failure safety:** If vectorisation exceeds 6 s or hits a topology error, serve the raster preview with a small badge **“raster preview — vectorising…”** and swap in the SVG when ready.

---

## 4) API Sketch

### 4.1 Worker message
```ts
type VectoriseRequest = {
  raster: ImageData | ArrayBuffer; // raw RGBA or PNG bytes
  width: number;
  height: number;
  config: VectoriserConfig;
};

type VectoriseResponse = {
  ok: true;
  svg: string;                     // data:text/svg+xml;utf8,… for inline preview
  stats: {
    colours: { hex: string; lab: [number,number,number]; px: number }[];
    regions: number;
    simplifyApplied: boolean;
    mergedSmallFeatures: number;
    minRadiusApplied: number;
    ms: number;
  };
} | { ok: false; error: string };
```

### 4.2 High‑level pseudo‑code
```ts
// main thread
const worker = new Worker('/vectoriser.worker.js');
worker.postMessage({ raster, width, height, config }, [raster.buffer]); // transfer

worker.onmessage = (e) => {
  const res = e.data as VectoriseResponse;
  if (res.ok) showSVG(res.svg);
  else showRasterWithBadge(error = res.error);
};
```

---

## 5) Testing Checklist (must pass before release)

- ✔ **Max colours respected** and no invented hues (only near‑duplicate merges).  
- ✔ **Min feature size**: no islands/bridges smaller than threshold.  
- ✔ **Min radius**: sharp corners rounded to ≥ target radius.  
- ✔ **No self‑intersections**; all paths closed.  
- ✔ **Layer order deterministic**; background never occluded.  
- ✔ **Time budget**: ≤ 3 s at 1536×1024 on reference laptop.  
- ✔ Compare SVG preview vs raster visually — shapes must match within 1–2 px tolerance.  
- ✔ Large/long aspect ratios produce stable, non‑cropped vectors (use smart canvas for generation; vectoriser is AR‑agnostic).

---

## 6) UX Integration

- The **user always sees the SVG** preview (with an instant raster fallback if vectorisation is still running).  
- Download menu: **SVG**, **PDF**, **DXF** (if enabled).  
- Metadata side‑panel: colours detected, areas, and scale (mm/px).  
- “Try simpler” re‑runs generation; vectoriser receives the new raster automatically.

---

## 7) Rollout Plan

1. Ship client‑side vectoriser (worker) for 1536×1024.  
2. Add server fallback (Netlify Function) for very long canvases or low‑power devices.  
3. Add DXF export.  
4. Add conformance tests against a corpus of 50 reference images (ocean, space, geometric, logos).

---

## 8) Gotchas & Remedies

- **Soft drop‑shadows:** Our posterise step flattens them; result is a crisp offset shape, not airbrush.  
- **Halos at colour joins:** Apply a 1 px morphological **closing** per colour before contour trace.  
- **Tiny holes:** Auto‑remove via `hole_keep_ratio`.  
- **Spiky motifs:** Enforced minimum radius smooths them; if still noisy, raise `simplify_tolerance_px` to 2.0–2.5.

---

## 9) What we are **not** doing (by design)

- No forced mapping to the 21‑colour TPV palette at this stage (that’s the matcher’s job later).  
- No gradient fills, textures, or strokes in SVG — **fills only**.  
- No text conversion — any letters generated by the model are removed by the negative prompt long before this step.

---

## 10) Acceptance Criteria

- 95% of Flux Dev generations vectorise on‑device in ≤ 3 s at 1536×1024.  
- All exported SVGs pass: min feature size, min radius, closed paths, and layer determinism.  
- Visual match to raster ≥ 98% IoU at colour‑region level on test set.

---

### Appendix: Minimal Dependency Set (Browser)

- `opencv.js` (WASM) — basic filters & morphology.  
- `ImageTracer.js` or custom marching‑squares + path simplify.  
- `paper.js` (optional) — boolean ops & curve fitting.  
- `tinycolor2` + LAB converter for ΔE merges (or your existing colour utils).

