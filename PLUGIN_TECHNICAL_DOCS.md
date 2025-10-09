# Rosehill TPV® Colour Mixer - Technical Documentation

## Plugin Architecture

### File Structure
```
rosehill-tpv-mixer/
├── rosehill-tpv-mixer.php          # Main plugin file
├── readme.txt                       # WordPress plugin readme
├── includes/
│   └── class-mixer-shortcode.php   # Shortcode handler class
└── assets/
    ├── css/
    │   └── mixer.css               # Scoped styles
    └── js/
        ├── jspdf.umd.min.2.5.1.js # PDF generation library
        └── mixer-app.js            # React application
```

### Script Loading Order

The plugin loads scripts in a specific order to ensure dependencies are available:

1. **React 18** (CDN)
2. **React DOM 18** (CDN) - depends on React
3. **D3 Delaunay 6.0.4** (CDN) - for Voronoi diagrams
4. **Three.js r128** (CDN) - for 3D rendering
5. **OrbitControls** (CDN) - depends on Three.js
6. **jsPDF 2.5.1** (local) - for PDF export
7. **mixer-app.js** (local) - depends on all above

### CSS Scoping

All styles are scoped to `.rosehill-mixer-container` to prevent theme conflicts:

```css
.rosehill-mixer-container {
  /* Container styles */
}

.rosehill-mixer-container .mixer-canvas {
  /* Canvas styles */
}
```

### JavaScript Structure

The `mixer-app.js` is wrapped in an IIFE (Immediately Invoked Function Expression) with dependency checks:

```javascript
(function() {
    'use strict';

    function initMixer() {
        // Dependency checks
        if (typeof React === 'undefined') {
            console.error('React is required');
            return;
        }
        // ... other checks

        const container = document.getElementById('rosehill-tpv-mixer-root');
        startMixerApp(container);
    }

    // Wait for DOM and dependencies
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMixer);
    } else {
        initMixer();
    }
})();
```

### React Application

The mixer is a single-component React application with:
- **State Management**: Uses React hooks (useState, useEffect, useRef)
- **Canvas Rendering**: Direct DOM manipulation for Voronoi visualization
- **3D Rendering**: Three.js integration for tile preview
- **PDF Generation**: jsPDF for report export

### Key Constants

**TPV® Color Palette (21 colors):**
```javascript
const PALETTE = [
    { id: 1, name: 'Black', hex: '#1a1a1a' },
    { id: 2, name: 'White', hex: '#f5f5f5' },
    // ... 19 more colors
];
```

**Material Calculations:**
- Density: 650 kg/m³
- Coverage calculation based on area × depth
- 25kg bag calculations included

### Shortcode Attributes

```php
$atts = shortcode_atts([
    'width' => '100%',
    'height' => 'auto',
    'max-width' => '1400px'
], $atts, 'rosehill_tpv_mixer');
```

### WordPress Hooks

**Script Enqueuing:**
```php
add_action('wp_enqueue_scripts', 'rosehill_mixer_enqueue_scripts');
```

**Shortcode Registration:**
```php
add_action('init', 'rosehill_mixer_init');
add_shortcode('rosehill_tpv_mixer', [$shortcode, 'render']);
```

**Plugin Links:**
```php
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'rosehill_mixer_plugin_links');
```

### Performance Optimizations

1. **Conditional Loading**: Scripts only load on pages with the shortcode
2. **CDN Usage**: External libraries loaded from CDN for caching
3. **Minified Libraries**: jsPDF is minified
4. **Scoped Styles**: Prevents unnecessary style calculations

### Customization Points

**To customize colors:**
Edit the `PALETTE` constant in `mixer-app.js` (lines ~50-75)

**To adjust canvas size:**
Modify shortcode attributes or edit default values in `class-mixer-shortcode.php`

**To change PDF branding:**
Edit PDF generation functions in `mixer-app.js` (~lines 500-800)

**To modify 3D preview:**
Edit Three.js initialization in `mixer-app.js` (~lines 300-450)

### Browser Compatibility

**Supported Features:**
- ES6+ JavaScript (const, let, arrow functions)
- Canvas API
- WebGL (for 3D preview)
- LocalStorage (for share codes)

**Fallbacks:**
- NoScript message for users without JavaScript
- Error messages for missing dependencies
- Graceful degradation if WebGL unavailable

### Security Considerations

- All output is escaped using WordPress functions (`esc_attr`, `esc_url`)
- No user data is stored in database
- Share codes use base64 encoding (not encryption)
- CDN resources use SRI (Subresource Integrity) where available

### Development Notes

**To modify the plugin:**

1. Edit source files in plugin directory
2. Test changes locally
3. Update version number in main plugin file
4. Update `ROSEHILL_MIXER_VERSION` constant
5. Update changelog in `readme.txt`

**To debug:**

1. Enable WordPress debug mode: `define('WP_DEBUG', true);`
2. Check browser console for JavaScript errors
3. Inspect network tab for failed resource loads
4. Verify script dependencies are loading in correct order

### Known Limitations

- Requires internet connection for initial CDN resource load
- 3D preview requires WebGL support
- Large granule counts may impact performance on older devices
- PDF generation limited by jsPDF capabilities

### Future Enhancement Ideas

- Database storage for saved mixes
- User accounts and project history
- Email sharing functionality
- Additional export formats (SVG, JSON)
- Admin panel for color palette management
- Internationalization (i18n) support

---

**Version:** 1.0.0
**Last Updated:** October 2024
