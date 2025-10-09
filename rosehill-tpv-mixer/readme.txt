=== Rosehill TPV® Colour Mixer ===
Contributors: Rosehill Group
Tags: color mixer, tpv, rubber granules, surface design, visualization
Requires at least: 5.0
Tested up to: 6.4
Requires PHP: 7.2
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Interactive color mixing tool for creating custom TPV® rubber granule blends with real-time visualization and professional reporting.

== Description ==

The Rosehill TPV® Colour Mixer is a professional-grade web application that allows users to create custom color blends using Rosehill's 21 premium TPV® rubber granule colors.

**Features:**

* **Interactive Color Selection** - Choose from 21 official Rosehill TPV® colors
* **Real-time Visualization** - See your mix come to life with realistic granule rendering
* **3D Tile Preview** - View a 3D representation of your surface with Three.js
* **Project Management** - Add project details, location, area, and installation depth
* **Material Calculations** - Automatic calculation of required materials based on project specifications
* **Professional PDF Reports** - Generate branded PDF reports with mix details and calculations
* **Share & Collaborate** - Create shareable codes and URLs for your mixes
* **PNG Export** - Export high-resolution images of your color blends
* **Undo/Redo** - Full editing history for your mixing process

**Technical Specifications:**

* React 18-based application
* WebGL-powered 3D rendering with Three.js
* Voronoi tessellation for realistic granule patterns
* Responsive design for desktop and mobile
* No backend required - runs entirely in browser

== Installation ==

1. Upload the `rosehill-tpv-mixer` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Use the shortcode `[rosehill_tpv_mixer]` on any page or post

== Usage ==

**Basic Usage:**
```
[rosehill_tpv_mixer]
```

**Custom Width:**
```
[rosehill_tpv_mixer width="800px"]
```

**Custom Max Width:**
```
[rosehill_tpv_mixer max-width="1200px"]
```

**Full Example:**
```
[rosehill_tpv_mixer width="100%" max-width="1400px"]
```

== Frequently Asked Questions ==

= What browsers are supported? =

The mixer works on all modern browsers including Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported.

= Does the mixer work on mobile devices? =

Yes, the mixer is fully responsive and works on tablets and mobile phones, though the experience is optimized for desktop use.

= Can I customize the colors? =

The plugin uses Rosehill's official 21 TPV® color palette. Color customization is not supported to maintain brand consistency.

= Does the mixer require an internet connection? =

The mixer requires an internet connection for initial load (to download React, Three.js, and other libraries from CDN). Once loaded, it works offline for the duration of the session.

= Can users save their mixes? =

Users can generate shareable codes and URLs for their mixes. Professional PDF reports can also be downloaded. Database storage is not currently supported.

= Is WebGL required? =

WebGL is required for the 3D tile preview feature. The main 2D mixer will work without WebGL, but users won't be able to view the 3D tile representation.

== Screenshots ==

1. Main mixing interface with color palette
2. Real-time Voronoi granule visualization
3. 3D tile preview with orbit controls
4. Project details and material calculations
5. Professional PDF report generation

== Changelog ==

= 1.0.0 =
* Initial release
* 21 Rosehill TPV® colors
* Interactive mixing canvas
* 3D tile preview
* PDF export functionality
* Share code generation
* Project management
* Material calculations

== Upgrade Notice ==

= 1.0.0 =
Initial release of the Rosehill TPV® Colour Mixer plugin.

== Technical Requirements ==

* WordPress 5.0 or higher
* PHP 7.2 or higher
* Modern browser with JavaScript enabled
* WebGL support (for 3D preview feature)
* Minimum 512MB RAM recommended

== Support ==

For technical support, please visit https://tpv.rosehill.group or contact Rosehill Group directly.

== Credits ==

Developed by Rosehill Group
Website: https://rosehill.group
TPV Product Page: https://tpv.rosehill.group

== License ==

This plugin is licensed under the GPL v2 or later.

Copyright (C) 2024 Rosehill Group

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
