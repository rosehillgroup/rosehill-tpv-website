# TPV Studio — Installation Rules and Geometry Constraints
Version: 1.0
Last updated: 2025-11-05
Owner: Rosehill Group

## Purpose
These rules enforce designs that are practical to install in TPV rubber. They are applied during generation, validated before export, and used to auto-repair where possible.

## Units
- Drawing units: metres (m) in the geometry engine
- Export DXF units: millimetres (mm)
- PDF plan: metres grid

## Global limits (defaults)
- Minimum feature width: **120 mm**
- Minimum internal radius: **600 mm** (exceptional internal corners down to 300 mm if unavoidable)
- Minimum gap between adjacent colours: **80 mm**
- Minimum island area: **0.30 m²**
- Maximum colours per design: **3** (4 only if user insists)
- Maximum separate pieces per colour: **25**
- No acute angles: target minimum interior angle **> 60°**

These defaults reflect installer practice across recent projects. Adjust per project if needed, but do not go below these without sign off.

## What counts as a violation
- **Min feature width**: Any region that narrows below 120 mm at any point along its medial axis.
- **Min radius**: Any internal corner or curvature that implies a bend tighter than 600 mm.
- **Min gap**: Distance between boundaries of different colours below 80 mm after offsets.
- **Min island area**: Standalone piece area less than 0.30 m².
- **Piece count**: More than 25 disjoint islands for a single colour.
- **Acute angles**: Vertex interior angle below 60° after simplification.

## Auto-repair strategies
- Inflate thin features by offsetting borders outward until width ≥ 120 mm, then re-clip to neighbours.
- Round sharp corners by filleting arcs to achieve the minimum radius.
- Increase gaps by pushing adjacent boundaries apart with equal offsets.
- Merge micro-islands into nearest parent region of the same colour.
- Remove fragments whose area < 0.03 m², then rebalance colour areas within ±5 percentage points of target ratios.
- If repair fails twice, mark as blocking violation and lower the design score.

## Scoring (installer score 0–100)
- Start 100, deduct:
  - Min width fail: −15 each (cap −30)
  - Min radius fail: −10 each (cap −20)
  - Min gap fail: −10 each (cap −20)
  - Min island area fail: −10 each (cap −20)
  - Piece count exceed per colour: −5 each (cap −20)
  - Acute angle: −5 each (cap −15)
- Auto repairs recover half the deduction for that issue.
- Any blocking violation remaining after repair sets a hard cap of 70.

## Colour governance
- Use only official TPV21 swatches.
- Default maximum 3 colours per design.
- Target area ratios must be within ±5 percentage points of the spec.
- Warn if two colours have very low contrast. Allow but flag.

## Geometry assumptions
- Surfaces treated as planar rectangles in metres.
- Shapes are rounded polygons, capsules, superellipses, and offset paths.
- Boolean operations must be robust and numerically stable.
- Randomness is seeded and reproducible.

## Designer overrides
- Designer may raise minimums or reduce max colours.
- Designer may force 4th colour with explicit toggle.
- Designer may mark motifs as "must keep". Repairs then scale rather than delete.

## Examples
- Fish motif scaled to 0.45 m fails min area. Auto-scale to 0.6 m.
- Two wave bands meet with 40 mm gap. Auto-separate to 80 mm by symmetric offsets.
- Star motif has 45° tips. Auto-round to 70° equivalent with fillet radius 0.6 m.

## Acceptance
A design is exportable if:
- All blocking violations are resolved
- Score ≥ 80 after repair, or explicit override is applied by designer
- Colour use matches palette and ratio tolerances