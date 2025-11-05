# TPV Studio — DXF Export Specification
Version: 1.0
Last updated: 2025-11-05
Owner: Rosehill Group

## Goal
Produce CAD-ready DXF files that import cleanly into AutoCAD and Rhino for cutting and layout.

## Target format
- DXF version: **R2013**
- Units: **millimetres (mm)**
- Geometry types: **POLYLINE/LWPOLYLINE** and **ARC**
- No SPLINE entities. Approximate Beziers with arc or polyline segments using a fixed tolerance.
- Coordinate origin at the top-left of the surface rectangle. Y increases downwards in design stage, but convert to CAD conventional Y-up by flipping at export if required by downstream workflow.

## Layering
- One layer per TPV colour using exact code, e.g. `TPV08`, `TPV11`, `TPV21`.
- Optional technical layers:
  - `OUTER_BORDER`
  - `CUT_ORDER`
  - `GRID` (not exported by default)
  - `NOTES` (metadata as MTEXT)

## Curves and tolerances
- Curve flattening tolerance: **±2 mm** maximum deviation when converting to polylines.
- Arc fitting:
  - Fit circular arcs where possible for long smooth curves.
  - Minimum arc length: 50 mm to avoid micro-segments.
- Vertex spacing:
  - Prefer 50–150 mm chord lengths on large shapes.
  - Keep vertex count under 1,500 per colour layer for performance.

## Winding and overlaps
- Polygons for different colours must not overlap. Perform boolean difference to ensure watertight tiling.
- Use even-odd fill semantics. Export each island as a separate closed polyline.
- Holes are separate closed loops on the same layer, marked as negative orientation if supported by the writer; otherwise export as separate islands and document.

## Text metadata
- Add an MTEXT block on layer `NOTES`:
  - Project title
  - Surface size (m)
  - Colour areas in m²
  - Generation seed
  - Date

## Validation steps
- Open DXF in AutoCAD and Rhino.
- Check: units in mm, layers present, no SPLINE.
- Measure sample radii for ≥ 600 mm.
- Count islands per colour ≤ 25.
- Confirm total area equals surface rectangle area within 0.5%.

## Known good libraries
- JS: `dxf-writer` or `@tarikjabiri/dxf`
- Node: custom writer if needed for arc support
- QA: Rhino Python script to sanity check after export

## Example layer list
- `TPV08`
- `TPV11`
- `TPV21`
- `OUTER_BORDER`
- `NOTES`