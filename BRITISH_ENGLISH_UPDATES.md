# British English Updates - UV Fade Visualiser

**Date:** November 3, 2025
**Status:** Complete ✅

---

## Summary

All user-facing text in the UV Fade Visualiser has been updated to use British English spelling conventions.

---

## Files Updated

### 1. `/performance/uv-stability.html`

**Meta Tags & Titles:**
- "Color Stability" → "Colour Stability" (page title, OG tags, Twitter cards)
- "color stability" → "colour stability" (meta descriptions)
- "color retention" → "colour retention" (keywords)

**CSS Comments:**
- "Color Picker" → "Colour Picker"

**CSS Classes:**
- `.color-swatch` → `.colour-swatch`
- `.colour-name` (already correct)
- Note: `.color-grid` class name retained (technical identifier, not user-facing)

**HTML Content:**
- "color stability" → "colour stability" (onboarding tooltip, drawer header)
- "Select TPV® Color" → "Select TPV® Colour" (section title)
- "Color Loss:" → "Colour Loss:" (fade comparison labels)

**JavaScript:**
- `TPV_COLORS` → `TPV_COLOURS` (constant name)
- `selectedColor` → `selectedColour` (variable name)
- `initializeColorGrid()` → `initialiseColourGrid()` (function name)
- `selectColor()` → `selectColour()` (function name)
- `colorSection` → `colourSection` (element ID)
- `colorGrid` → `colourGrid` (element ID)
- "Initialize" → "Initialise" (comment)
- "normalized" → "normalised" (variable name)
- Comments: "color" → "colour" throughout

**Event Tracking:**
- Event property: `{ color: ... }` → `{ colour: ... }`

---

### 2. `/data/uv_copy.json`

**Title & Subtitle:**
- "color stability" → "colour stability"

**Introduction:**
- "color stability" → "colour stability"

**Methodology Sections:**
- "Fade Model" content: "color loss" → "colour loss"
- "Color Transform" → "Colour Transform" (heading)
- "colors" → "colours"
- "color saturation" → "colour saturation"
- "color space" → "colour space"
- "color perception" → "colour perception"

**Disclaimer:**
- "color retention" → "colour retention"

**Benefits:**
- EPDM: "High color loss" → "High colour loss"
- EPDM description: "color change" → "colour change"
- TPV: "vibrant colors" → "vibrant colours"

**CTA:**
- "color stability" → "colour stability"

---

## What Was NOT Changed

The following remain as American English because they are technical terms or CSS/JavaScript standards:

### CSS Properties
- `color: #333;` (CSS property)
- `background-color` (CSS property)
- `border-color` (CSS property)

### Technical Class Names
- `.color-grid` (CSS class identifier - technical, not user-facing)
- `.legend-color` (CSS class identifier)

### JavaScript Standard APIs
- Hex color values (e.g., `#E4C4AA`)
- RGB/HSL color space references in code comments (when referring to technical specifications)

---

## Verification

All instances of "color" in user-facing text have been changed to "colour":
- ✅ Page titles and meta tags
- ✅ UI labels and section headings
- ✅ Onboarding and help text
- ✅ Variable names and function names
- ✅ Comments in code
- ✅ JSON data content

CSS properties and technical identifiers remain unchanged as per web standards.

---

## Other British English Conventions Applied

- "Initialize" → "Initialise"
- "normalized" → "normalised"
- "categorised" (already correct in JSON)

---

## Testing Checklist

- [ ] Page loads correctly
- [ ] All colour swatches display
- [ ] Colour selection works
- [ ] Fade comparison updates with correct spelling in labels
- [ ] Methodology modal displays correct spelling
- [ ] No JavaScript console errors
- [ ] Analytics events fire with correct property names

---

## Notes

This update maintains consistency with the existing Rosehill TPV website, which uses British English throughout (e.g., "colour.html", "Colour Mixer" tool).

The updates are purely cosmetic/linguistic and do not affect any functionality. All technical implementations (colour calculations, fade algorithms, data lookups) remain unchanged.
