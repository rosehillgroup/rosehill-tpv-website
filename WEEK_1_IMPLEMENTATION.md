# TPV Visualiser - Week 1 Implementation Plan

**Date**: 2025-11-04
**Phase**: Week 1 of 4 - Mode A Foundation
**Status**: IN PROGRESS

## Overview

Week 1 focuses on building the core Mode A (deterministic rendering) infrastructure without AI dependencies. This provides a working tool that can be enhanced with AI in later weeks.

## Architecture Changes

### visualizer.html Structure

```
├── Upload Section (EXISTING)
├── Masking Section (NEW)
│   ├── Polygon Tool
│   ├── Brush Tool
│   ├── SAM 2 Auto-suggest Button
│   └── Mask Canvas Overlay
├── Color Section (ENHANCED)
│   ├── Multi-select (up to 3 colors)
│   ├── Proportion Sliders
│   └── Share Code Input
├── Pattern Section (NEW)
│   ├── Pattern Dropdown
│   ├── Granule Scale Slider
│   └── Brightness Slider
├── Mode Toggle (NEW)
│   ├── Mode A (Deterministic)
│   └── Mode B (AI) - disabled until Week 3
└── Preview Section (ENHANCED)
    ├── Original Tab
    ├── Mode A Result Tab
    └── Mode B Result Tab (Week 3)
```

## Task Breakdown

### Task 1: Polygon Drawing Tool ✅ IN PROGRESS

**Files**: `visualizer.html`

**Implementation**:
- Add polygon points array storage
- Click-to-add-point interaction
- Visual feedback (dots + lines)
- Close polygon on double-click or button
- "Clear Mask" button
- Display point count

**UI Elements**:
```html
<div class="mask-tools">
  <button id="polygonToolBtn" class="tool-btn active">Polygon</button>
  <button id="brushToolBtn" class="tool-btn">Brush</button>
  <button id="clearMaskBtn" class="btn-secondary">Clear Mask</button>
  <span id="pointCount">0 points</span>
</div>
```

**Canvas Rendering**:
- Red dots for polygon vertices (6px radius)
- Blue lines connecting points
- Semi-transparent red fill when closed (alpha: 0.3)
- Crosshair cursor in polygon mode

---

### Task 2: Brush Tool for Mask Refinement

**Implementation**:
- Add/subtract from mask with brush
- Adjustable brush size (10-50px slider)
- Toggle add/subtract mode
- Render brush as circular cursor
- Update mask bitmap in real-time

**UI Elements**:
```html
<div class="brush-controls" style="display: none;">
  <label>Brush Size: <span id="brushSizeValue">20</span>px</label>
  <input type="range" id="brushSize" min="10" max="50" value="20">
  <button id="brushModeBtn" data-mode="add">Add Mode</button>
</div>
```

---

### Task 3: Canvas-Based Mask Editor

**Implementation**:
- Separate mask canvas layer (overlay on preview canvas)
- Zoom controls (+/- buttons, mouse wheel)
- Pan mode (hold Space + drag)
- Mask export to PNG (binary: black=preserve, white=surface)
- Mask validation (ensure closed polygon for Mode A)

**Features**:
- `zoom`: 100%, 150%, 200%
- `pan`: Drag with spacebar held
- `export`: Generate mask bitmap for API

---

### Task 4: Multi-Color Selection (Up to 3)

**Current**: Single color selection
**Enhanced**: Support 1-3 colors with proportions

**Implementation**:
```javascript
let selectedColors = []; // Array of {code, name, hex, proportion}

function selectColor(color) {
  if (selectedColors.length < 3) {
    selectedColors.push({
      ...color,
      proportion: calculateInitialProportion()
    });
    updateColorDisplay();
    updateProportionSliders();
  }
}

function calculateInitialProportion() {
  // Distribute evenly: 1 color = 100%, 2 colors = 50% each, etc.
  const count = selectedColors.length + 1;
  return 100 / count;
}
```

**UI Elements**:
```html
<div class="selected-colors-list">
  <!-- Dynamically populated -->
  <div class="selected-color-item" data-code="RH30">
    <div class="color-swatch" style="background: #E4C4AA"></div>
    <span>Beige (RH30)</span>
    <button class="remove-color">×</button>
  </div>
</div>
```

---

### Task 5: Color Proportion Sliders

**Implementation**:
- One slider per selected color
- Sliders must sum to 100%
- Auto-adjust other sliders when one changes
- Display percentage next to each slider
- Lock mechanism (lock 1-2 colors, adjust remainder)

**Logic**:
```javascript
function updateProportion(colorIndex, newValue) {
  const oldValue = selectedColors[colorIndex].proportion;
  const delta = newValue - oldValue;

  selectedColors[colorIndex].proportion = newValue;

  // Distribute delta across unlocked colors
  const unlockedColors = selectedColors.filter((c, i) =>
    i !== colorIndex && !c.locked
  );

  distributeProportions(unlockedColors, -delta);
  enforceSum100();
}
```

---

### Task 6: Pattern Selector

**Patterns**:
1. `solid` - Uniform single/blend color
2. `speckle` - Random small color patches (2-5px)
3. `swirl` - Perlin noise-based color flow
4. `islands` - Distinct color regions (10-30px)
5. `borders` - Color bands at edges

**UI**:
```html
<select id="patternSelect">
  <option value="solid">Solid</option>
  <option value="speckle">Speckle</option>
  <option value="swirl">Swirl</option>
  <option value="islands">Islands</option>
  <option value="borders">Borders</option>
</select>
```

**Preview**: Small thumbnail showing pattern with current colors

---

### Task 7: Granule Scale & Brightness Sliders

**Granule Scale**:
- Range: 1-4mm (affects texture density)
- Default: 3mm
- Updates texture generation

**Brightness**:
- Range: -0.2 to +0.2 (affects final composite luminance)
- Default: 0
- Applied post-render

**UI**:
```html
<div class="texture-controls">
  <label>Granule Size: <span id="granuleValue">3</span>mm</label>
  <input type="range" id="granuleScale" min="1" max="4" step="0.5" value="3">

  <label>Brightness: <span id="brightnessValue">0.0</span></label>
  <input type="range" id="brightness" min="-0.2" max="0.2" step="0.05" value="0">
</div>
```

---

### Task 8: Mode A Deterministic Rendering

**Backend**: `netlify/functions/texture.js` (refactor existing)

**New API Contract**:
```javascript
POST /api/texture
{
  parts: { "RH30": 0.6, "RH01": 0.3, "RH20": 0.1 },
  pattern: "solid",
  granuleScaleMm: 3,
  brightness: 0,
  seed: "deterministic-seed-12345",
  size: 1024
}

Response:
{
  success: true,
  textureUrl: "data:image/png;base64,...",
  avgHex: "#D4B8A2",
  paletteCompliant: true
}
```

**Rendering Steps**:
1. Generate base texture tile (512-1024px, tileable)
2. Apply pattern (reuse mixer.html granule logic)
3. Blend colors by proportion (weighted RGB average)
4. Add procedural granule noise (Poisson disk sampling)
5. Apply granule scale (affects granule density)
6. Return base64 or upload to Supabase

**Frontend Integration**:
```javascript
async function generateModeA() {
  // 1. Export mask as PNG
  const maskDataUrl = exportMask();

  // 2. Call /api/texture for tile generation
  const textureResponse = await fetch('/.netlify/functions/texture', {
    method: 'POST',
    body: JSON.stringify({
      parts: getColorParts(),
      pattern: getPattern(),
      granuleScaleMm: getGranuleScale(),
      brightness: getBrightness(),
      seed: generateSeed()
    })
  });

  const { textureUrl, avgHex } = await textureResponse.json();

  // 3. Apply texture to masked region (homography warp)
  const result = applyTextureToMask(uploadedImage, maskDataUrl, textureUrl);

  // 4. Laplacian blending (Task 9)
  const blended = laplacianBlend(result, uploadedImage, maskDataUrl);

  // 5. Display result
  displayResult(blended);
}
```

---

### Task 9: Laplacian Pyramid Blending

**Purpose**: Seamlessly blend Mode A texture with original photo at mask edges

**Implementation**:
- Client-side WebGL shader
- 3-5 pyramid levels
- Multiband blending for smooth transitions

**Algorithm**:
```javascript
function laplacianBlend(foreground, background, mask, levels = 5) {
  const fgPyramid = buildLaplacianPyramid(foreground, levels);
  const bgPyramid = buildLaplacianPyramid(background, levels);
  const maskPyramid = buildGaussianPyramid(mask, levels);

  const blendedPyramid = fgPyramid.map((fgLevel, i) => {
    return blendLevel(fgLevel, bgPyramid[i], maskPyramid[i]);
  });

  return collapsePyramid(blendedPyramid);
}
```

**Library Option**: Use existing Laplacian blending library or implement WebGL shaders

---

## Week 1 Deliverables

By end of Week 1, the visualizer should:

✅ Allow polygon-based mask creation
✅ Support multi-color selection (1-3 colors)
✅ Offer pattern selection
✅ Generate deterministic Mode A previews
✅ Blend results seamlessly with original photo
✅ Work offline (no AI dependencies)

**NOT included in Week 1:**
- SAM 2 auto-segmentation (Week 3)
- FLUX Fill Pro AI rendering (Week 3)
- PDF export (Week 4)
- Multi-variant generation (Week 4)

---

## Testing Checklist

- [ ] Upload test image (playground photo)
- [ ] Draw polygon mask around surface area
- [ ] Select 2 colors (e.g., RH30 60%, RH36 40%)
- [ ] Choose "speckle" pattern
- [ ] Set granule scale to 3mm
- [ ] Generate Mode A preview
- [ ] Verify seamless blending at edges
- [ ] Download result as PNG
- [ ] Repeat with 1 color, 3 colors
- [ ] Test all patterns (solid/speckle/swirl/islands/borders)

---

## File Structure

```
visualizer.html              # Enhanced UI (Week 1 complete)
netlify/functions/
  └── texture.js            # Refactored for Mode A (Week 1)
assets/
  └── tpv-palette.json      # 21-color palette (existing)
tpv-palette.ts              # Color science module (Week 2: export for Node.js)
```

---

## Next Steps (Week 2)

1. Refactor texture.js into modular endpoints (/api/texture, /api/mask)
2. Integrate share code parser from tpv-palette.ts
3. Add comprehensive error handling
4. Performance optimization (WebGL acceleration)
5. Testing and refinement

---

## Notes

- **Deterministic**: Same input = same output (use seeded randomness)
- **Performance**: Target <2s for Mode A generation
- **Compatibility**: Test on Chrome, Firefox, Safari
- **Mobile**: Ensure touch-friendly controls
- **Accessibility**: Keyboard navigation for mask tools
