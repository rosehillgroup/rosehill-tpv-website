# Rosehill TPV® Colour Mixer - WordPress Plugin Package

## 📦 Package Contents

This package contains the Rosehill TPV® Colour Mixer as a WordPress plugin, ready for installation on your WordPress website.

### Files Included

- **`rosehill-tpv-mixer.zip`** (148KB) - WordPress plugin installation file
- **`PLUGIN_INSTALLATION_GUIDE.md`** - Step-by-step installation instructions
- **`PLUGIN_TECHNICAL_DOCS.md`** - Technical documentation for developers

## 🚀 Quick Start

1. Download `rosehill-tpv-mixer.zip`
2. Install via WordPress Admin → Plugins → Add New → Upload Plugin
3. Activate the plugin
4. Add `[rosehill_tpv_mixer]` shortcode to any page

**That's it!** The color mixer will appear on your page.

## ✨ Features

The TPV® Colour Mixer provides:

- **21 Official TPV® Colors** - Complete Rosehill color palette
- **Interactive Mixing** - Real-time color blending with adjustable ratios
- **Voronoi Visualization** - Realistic granule pattern display
- **3D Tile Preview** - WebGL-powered surface visualization
- **Project Management** - Add details, location, area calculations
- **PDF Reports** - Professional branded reports with mix specifications
- **Share Functionality** - Generate shareable codes and URLs
- **PNG Export** - High-resolution image export
- **Full Editing History** - Undo/Redo capabilities

## 📋 Requirements

- WordPress 5.0+
- PHP 7.2+
- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- WebGL support (for 3D preview)

## 💻 Usage Examples

### Basic Implementation
```
[rosehill_tpv_mixer]
```

### Custom Sizing
```
[rosehill_tpv_mixer width="800px"]
[rosehill_tpv_mixer width="100%" max-width="1200px"]
```

### Full Width Layout
```
[rosehill_tpv_mixer width="100%" max-width="1400px"]
```

## 🔧 Technical Details

### Technologies Used
- React 18 (CDN)
- Three.js for 3D rendering (CDN)
- D3 Delaunay for Voronoi diagrams (CDN)
- jsPDF for PDF generation (local)

### Plugin Structure
- Self-contained with scoped CSS (`.rosehill-mixer-container`)
- No database requirements
- All dependencies properly enqueued
- Conditional script loading (only on pages with shortcode)

### Browser Compatibility
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ❌ Internet Explorer (not supported)

## 📚 Documentation

### For Non-Technical Users
See **`PLUGIN_INSTALLATION_GUIDE.md`** for:
- Installation steps
- Shortcode usage
- Troubleshooting
- Feature overview

### For Developers
See **`PLUGIN_TECHNICAL_DOCS.md`** for:
- Architecture details
- Customization points
- Code structure
- Development guidelines

## 🛠️ Support

For technical support or questions:
- Visit: https://tpv.rosehill.group
- Contact: Rosehill Group directly

## 📝 License

GPL v2 or later
Copyright (C) 2024 Rosehill Group

## 🎯 Next Steps

1. **Install the plugin** using the ZIP file
2. **Create a dedicated page** for the mixer (recommended)
3. **Add the shortcode** to your page
4. **Test the functionality** on different devices
5. **Share with your users!**

---

## 📸 What Users Can Do

Once installed, your users will be able to:

1. **Select from 21 TPV® colors** using the interactive palette
2. **Adjust color ratios** with intuitive controls
3. **See real-time visualization** of their custom blend
4. **View 3D tile preview** to understand surface appearance
5. **Add project details** (name, location, area, depth)
6. **Calculate materials needed** automatically
7. **Generate PDF reports** with all mix specifications
8. **Share their mixes** via unique codes or URLs
9. **Export PNG images** for presentations
10. **Save and restore** mixes using share codes

---

**Package Version:** 1.0.0
**Created:** October 2024
**Package Size:** 148KB

For the latest updates and support, visit https://tpv.rosehill.group
