# Rosehill TPV® Colour Mixer - WordPress Plugin Installation Guide

## Quick Installation

1. **Download** the `rosehill-tpv-mixer.zip` file

2. **Install in WordPress:**
   - Go to WordPress Admin → Plugins → Add New
   - Click "Upload Plugin" button
   - Choose `rosehill-tpv-mixer.zip`
   - Click "Install Now"
   - Click "Activate Plugin"

3. **Add to Page:**
   - Edit any page or post
   - Add the shortcode: `[rosehill_tpv_mixer]`
   - Publish the page

## Shortcode Options

**Basic usage:**
```
[rosehill_tpv_mixer]
```

**Custom width:**
```
[rosehill_tpv_mixer width="800px"]
```

**Full width with max-width:**
```
[rosehill_tpv_mixer width="100%" max-width="1400px"]
```

## Technical Requirements

- WordPress 5.0 or higher
- PHP 7.2 or higher
- Modern browser with JavaScript enabled
- WebGL support (for 3D preview feature)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- **Not supported:** Internet Explorer

## Features Included

✓ Interactive color selection (21 TPV® colors)
✓ Real-time Voronoi granule visualization
✓ 3D tile preview with Three.js
✓ Project management tools
✓ Material calculations
✓ Professional PDF report generation
✓ Share codes and URLs
✓ PNG export
✓ Undo/Redo functionality

## External Dependencies (Loaded from CDN)

The plugin loads the following libraries from CDN:
- React 18
- React DOM 18
- D3 Delaunay 6.0.4
- Three.js r128
- OrbitControls

**Note:** An internet connection is required for initial load. Once loaded, the mixer works offline for the session.

## Troubleshooting

**Mixer not appearing:**
- Ensure JavaScript is enabled in your browser
- Check browser console for errors
- Verify the shortcode is spelled correctly: `[rosehill_tpv_mixer]`

**3D preview not working:**
- Check if WebGL is enabled in your browser
- Try a different browser (Chrome recommended)

**Styles look broken:**
- Check for theme CSS conflicts
- The plugin uses scoped CSS with `.rosehill-mixer-container` prefix
- Contact support if issues persist

## Support

For technical support:
- Website: https://tpv.rosehill.group
- Email: Contact Rosehill Group directly

## License

GPL v2 or later
Copyright (C) 2024 Rosehill Group

---

**Installation Package:** `rosehill-tpv-mixer.zip` (148KB)
**Version:** 1.0.0
