# Archived TPV Studio Code

This folder contains code that was replaced by the Recraft Vector AI implementation (2025-01-13).

## Why Archived

TPV Studio was refactored to use **Recraft SVG generation** as the sole generation method, replacing both:
1. **AI Mode** (Flux Dev raster images)
2. **Geometric Mode** (native SVG patterns)

Recraft provides direct SVG output with AI-powered compliance validation via Claude Haiku, eliminating the need for separate raster-to-vector pipelines or manual pattern generation.

## Archived Files

### Endpoints (`/endpoints/`)
- `studio-inspire-simple.js` - Flux Dev mood board generation (LEGACY)
- `studio-enqueue.js` - Flux Dev job enqueuing (LEGACY)
- `studio-generate-geometric.js` - Native geometric SVG generation (LEGACY)

### Utilities (`/utils/`)
- `geometric/` - Entire geometric generation system (LEGACY)
  - Pattern recipes (hero_orbit, trail, cluster, striped_story)
  - Motif libraries and role assignments
  - Band/island shape generation
  - Layout composition engine
  - OKLCH color palette generation
  - Brief parser for natural language
  - QC validation system
- `design-director.js` - Claude Haiku prompt refinement for Flux (LEGACY)

### Frontend (`/src/components/_archived/`)
- `InspirePanel.jsx` - Old UI with AI/Geometric mode switching (LEGACY)

## Migration Path

**Old API Calls** → **New Recraft API**

```javascript
// OLD - Flux Dev (raster)
await apiClient.inspireSimpleCreateJob({ prompt, lengthMM, widthMM, maxColours });

// OLD - Geometric (native SVG patterns)
await apiClient.generateGeometric({ prompt, lengthMM, widthMM, mood, composition });

// NEW - Recraft (AI vector SVG)
await apiClient.generateRecraft({ prompt, lengthMM, widthMM, maxColours, seed });
```

## Key Differences

### Old System (Flux + Geometric)
- **Flux**: Raster images → manual vectorization → color quantization
- **Geometric**: Algorithmic patterns → limited themes → no AI
- **Result**: JPG mood boards OR geometric SVGs
- **QC**: Manual review required

### New System (Recraft)
- **Recraft**: Direct SVG generation from text prompts
- **Inspector**: Claude Haiku validates compliance automatically
- **Retry Loop**: Up to 3 attempts with prompt corrections
- **Result**: Always SVG with compliance report
- **QC**: Automated with detailed reasoning

## Benefits of Recraft

1. **Single Pipeline**: One system replaces two (simpler codebase)
2. **Direct SVG**: No raster-to-vector conversion needed
3. **AI Flexibility**: More creative freedom than geometric patterns
4. **Auto QC**: Claude Haiku inspector catches issues early
5. **Retry Logic**: Automatic refinement if design fails compliance
6. **Audit Trail**: All attempts saved for review

## If You Need Old Functionality

### Restoring Flux Dev Mode
1. Copy `studio-inspire-simple.js` back to `api/`
2. Copy `studio-enqueue.js` back to `api/`
3. Uncomment legacy methods in `src/lib/api/client.js`
4. Update `App.jsx` to support mode switching

### Restoring Geometric Mode
1. Copy `studio-generate-geometric.js` back to `api/`
2. Copy `geometric/` folder back to `api/_utils/`
3. Uncomment `generateGeometric()` in `src/lib/api/client.js`
4. Update frontend to add mode selector

## Timeline

- **Jan 2024**: Initial TPV Studio with Flux Dev (AI Mode)
- **Sep 2024**: Added Geometric Mode (native SVG patterns)
- **Dec 2024**: Built composition engine for geometric designs
- **Jan 2025**: Replaced both with Recraft Vector AI ✅

## Related Documentation

- [RECRAFT_PLAN.md](/RECRAFT_PLAN.md) - Full implementation plan
- [database/migrations/](/database/migrations/) - Schema changes for Recraft
- [api/_utils/recraft/](/api/_utils/recraft/) - New Recraft utilities

## Notes

- Archive is kept for reference and potential future needs
- Do NOT delete - may be needed for debugging or feature restoration
- If restoring old code, test thoroughly as dependencies may have changed
- Database schema supports both old and new job types (mode_type field)
