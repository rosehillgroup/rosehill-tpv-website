# TPV Design Visualiser - API Documentation

## Week 2 Implementation Summary

This document describes the refactored API architecture for the TPV Design Visualiser, supporting both deterministic (Mode A) and AI-powered (Mode B) texture generation.

---

## Architecture Overview

### Mode A - Deterministic Texture Generation
- **Purpose**: Fast, server-side texture generation using pattern algorithms
- **Processing**: Generates texture tiles based on color selection and pattern type
- **Use Case**: Quick previews, pattern testing, offline/local rendering
- **Performance**: ~500-2000ms typical response time

### Mode B - AI-Powered Texture Generation
- **Purpose**: Photorealistic texture generation using FLUX Fill Pro
- **Processing**: Uses Replicate API for AI-based image inpainting
- **Use Case**: Final production renders, maximum realism
- **Performance**: ~10-30s typical response time (AI model dependent)

---

## API Endpoints

### 1. POST /api/texture

Generates TPV surface textures based on color selection and rendering mode.

#### Endpoint
```
POST /.netlify/functions/texture
```

#### Request Headers
```
Content-Type: application/json
```

#### Request Body (Mode A)

```json
{
  "mode": "modeA",
  "imageData": "data:image/png;base64,...",
  "maskData": "data:image/png;base64,...",
  "colorCode": "RH30",
  "colorHex": "#E4C4AA",
  "patternType": "solid",
  "granuleScale": 3,
  "brightness": 0
}
```

**OR** for multi-color Mode A:

```json
{
  "mode": "modeA",
  "imageData": "data:image/png;base64,...",
  "maskData": "data:image/png;base64,...",
  "shareCode": "0A14",
  "patternType": "speckle",
  "granuleScale": 3,
  "brightness": 0
}
```

#### Request Body (Mode B)

```json
{
  "mode": "modeB",
  "imageData": "data:image/png;base64,...",
  "maskData": "data:image/png;base64,...",
  "colorCode": "RH30",
  "colorHex": "#E4C4AA"
}
```

**OR** for multi-color Mode B:

```json
{
  "mode": "modeB",
  "imageData": "data:image/png;base64,...",
  "shareCode": "0A14"
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mode` | string | Yes | Rendering mode: `"modeA"` or `"modeB"` |
| `imageData` | string | Yes | Base64 data URL of uploaded photo |
| `maskData` | string | Mode A: Yes, Mode B: No | Base64 data URL of segmentation mask |
| `colorCode` | string | If no shareCode | TPV color code (e.g., `"RH30"`) |
| `colorHex` | string | If no shareCode | Hex color value (e.g., `"#E4C4AA"`) |
| `shareCode` | string | If no colorCode | Encoded multi-color selection from mixer |
| `patternType` | string | Mode A only | Pattern: `"solid"`, `"speckle"`, `"swirl"`, `"islands"`, `"borders"` |
| `granuleScale` | number | Mode A only | Granule size in mm: 1-4 (default: 3) |
| `brightness` | number | Mode A only | Brightness adjustment: -0.2 to 0.2 (default: 0) |

#### Response (Success)

```json
{
  "success": true,
  "textureUrl": "data:image/png;base64,...",
  "mode": "modeA",
  "colorCode": "RH30",
  "processingTime": 1523
}
```

For multi-color requests:

```json
{
  "success": true,
  "textureUrl": "data:image/png;base64,...",
  "mode": "modeA",
  "colors": [
    {
      "code": "RH30",
      "name": "Beige",
      "hex": "#E4C4AA",
      "proportion": 71.4
    },
    {
      "code": "RH31",
      "name": "Cream",
      "hex": "#E8E3D8",
      "proportion": 28.6
    }
  ],
  "processingTime": 1845
}
```

#### Response (Error)

```json
{
  "error": "Invalid mode",
  "message": "Mode must be either \"modeA\" or \"modeB\""
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 405 | Method Not Allowed |
| 500 | Internal Server Error |

---

### 2. POST /api/mask

Generates segmentation masks for uploaded images. Currently returns simple full-image masks; SAM 2 integration planned for Week 3.

#### Endpoint
```
POST /.netlify/functions/mask
```

#### Request Headers
```
Content-Type: application/json
```

#### Request Body

```json
{
  "imageData": "data:image/png;base64,...",
  "mode": "simple"
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `imageData` | string | Yes | Base64 data URL of uploaded photo |
| `mode` | string | No | Mask mode: `"simple"` or `"auto"` (default: `"simple"`) |
| `points` | array | No | Point prompts for SAM 2 (Week 3) |
| `boxes` | array | No | Box prompts for SAM 2 (Week 3) |

#### Response (Success)

```json
{
  "success": true,
  "maskUrl": "data:image/png;base64,...",
  "mode": "simple",
  "processingTime": 12
}
```

For auto mode (Week 2 - not yet implemented):

```json
{
  "success": true,
  "maskUrl": "data:image/png;base64,...",
  "mode": "auto",
  "note": "SAM 2 auto-segmentation will be available in Week 3",
  "processingTime": 15
}
```

#### Response (Error)

```json
{
  "error": "Missing required field: imageData",
  "message": "imageData (base64 data URL) is required"
}
```

#### Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 405 | Method Not Allowed |
| 500 | Internal Server Error |

---

## Color Science Functions

The API includes a comprehensive color science library for TPV color management.

### Available Functions

#### `shareCodeToColors(shareCode)`
Decodes Color Mixer share codes into color arrays with proportions.

```javascript
const colors = shareCodeToColors("0A14");
// Returns: [
//   { code: "RH30", name: "Beige", hex: "#E4C4AA", proportion: 71.4 },
//   { code: "RH31", name: "Cream", hex: "#E8E3D8", proportion: 28.6 }
// ]
```

#### `hexToRgb(hex)`
Converts hex color to RGB object.

```javascript
const rgb = hexToRgb("#E4C4AA");
// Returns: { r: 228, g: 196, b: 170 }
```

#### `rgbToHex(r, g, b)`
Converts RGB values to hex string.

```javascript
const hex = rgbToHex(228, 196, 170);
// Returns: "#e4c4aa"
```

#### `rgbToOklab(rgb)`
Converts RGB to OKLab color space for perceptual calculations.

```javascript
const lab = rgbToOklab({ r: 228, g: 196, b: 170 });
// Returns: { L: 0.841, a: 0.024, b: 0.044 }
```

#### `deltaE(lab1, lab2)`
Calculates perceptual color difference (lower = more similar).

```javascript
const dE = deltaE(color1Lab, color2Lab);
// Returns: 0.084 (very similar colors)
```

#### `computeAverageBlend(parts)`
Computes weighted average of multiple colors.

```javascript
const blended = computeAverageBlend({ 'RH30': 5, 'RH31': 5 });
// Returns: "#e6d4c1"
```

---

## Pattern Types (Mode A)

### Solid
Uniform color blend with granule texture noise.

### Speckle
Random speckles of each color proportional to selection percentages.

### Swirl
Radial swirl pattern blending colors from center outward.

### Islands
Background color with circular "islands" of accent colors.

### Borders
Horizontal color bands with granule texture.

---

## Share Code Format

Share codes encode multi-color selections from the Color Mixer:
- Format: Pairs of base-36 characters `[colorIndex][count]`
- Color index: 0-20 (maps to PALETTE array index)
- Count: 0-35 (number of granule parts)
- Example: `"0A14"` = Color 0 (RH30) × 10 parts + Color 1 (RH31) × 4 parts

### Decoding Process
1. Split into pairs of characters
2. First char = palette index (base 36)
3. Second char = count (base 36)
4. Calculate proportions from counts
5. Map to color objects with proportion percentages

---

## TPV Color Palette

The API includes all 21 standard Rosehill TPV colors:

| Code | Name | Hex |
|------|------|-----|
| RH30 | Beige | #E4C4AA |
| RH31 | Cream | #E8E3D8 |
| RH41 | Bright Yellow | #FFD833 |
| RH40 | Mustard | #E5A144 |
| RH50 | Orange | #F15B32 |
| RH01 | Standard Red | #A5362F |
| RH02 | Bright Red | #E21F2F |
| RH90 | Funky Pink | #E8457E |
| RH21 | Purple | #493D8C |
| RH20 | Standard Blue | #0075BC |
| RH22 | Light Blue | #47AFE3 |
| RH23 | Azure | #039DC4 |
| RH26 | Turquoise | #00A6A3 |
| RH12 | Dark Green | #006C55 |
| RH10 | Standard Green | #609B63 |
| RH11 | Bright Green | #3BB44A |
| RH32 | Brown | #8B5F3C |
| RH65 | Pale Grey | #D9D9D6 |
| RH61 | Light Grey | #939598 |
| RH60 | Dark Grey | #59595B |
| RH70 | Black | #231F20 |

---

## Error Handling

All endpoints implement comprehensive error handling:

### Validation Errors (400)
- Missing required fields
- Invalid parameter formats
- Invalid color codes
- Invalid share codes
- Out-of-range numeric values

### Server Errors (500)
- Texture generation failures
- Image processing errors
- External API failures (Mode B)
- Storage upload failures (Mode B)

Error responses include:
```json
{
  "error": "Error category",
  "message": "Detailed error description",
  "stack": "Stack trace (development only)"
}
```

---

## Performance Considerations

### Mode A
- Texture generation: ~200-500ms
- No external API calls
- Suitable for real-time previews
- Deterministic output (same inputs = same output)

### Mode B
- FLUX Fill Pro API: ~10-30s
- Network dependent
- Requires Replicate API key
- Uploads to Supabase storage
- Returns signed URLs (1 hour expiry)

### Optimization Tips
1. Cache Mode A textures on client side
2. Use Mode A for quick iterations
3. Use Mode B for final renders only
4. Implement request throttling for Mode B
5. Consider response compression for large textures

---

## Future Enhancements (Week 3+)

### Planned Features
1. **SAM 2 Integration** - Automatic segmentation
2. **Manual Masking Tools** - Polygon and brush tools via API
3. **Delta E Calculation** - Color accuracy metrics
4. **Texture Caching** - Redis cache for Mode A textures
5. **Batch Processing** - Multiple renders in single request
6. **Advanced Patterns** - Voronoi, noise-based, photo-based patterns
7. **Quality Settings** - Texture resolution options

---

## Testing

Run the included test suite:

```bash
cd netlify/functions/_utils
node test-color-science.js
```

Tests cover:
- Palette loading
- Hex/RGB conversions
- Share code decoding
- Color blending
- OKLab color space
- Delta E calculations
- Error handling

---

## Dependencies

- `@supabase/supabase-js`: ^2.39.0 - Storage for Mode B outputs
- `replicate`: ^0.32.0 - FLUX Fill Pro AI model access
- `sharp`: ^0.33.0 - Server-side image processing

---

## Environment Variables

Required for full functionality:

```env
REPLICATE_API_KEY=r8_...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=eyJhb...
```

---

## Support

For issues or questions:
- Review error messages for specific guidance
- Check parameter validation requirements
- Ensure all required fields are provided
- Verify environment variables are set
- Test with simple single-color requests first

---

**Last Updated**: Week 2 - November 2025
**Version**: 2.0
**Status**: Mode A Complete, Mode B Complete, SAM 2 Pending
