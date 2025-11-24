// TPV Studio - SVG Preview Component
// Shows TPV blend SVG with color legend and color highlighting

import { useEffect, useRef, useState, useMemo } from 'react';
import ColorLegend from './ColorLegend';
import { sanitizeSVG } from '../utils/sanitizeSVG';

export default function SVGPreview({
  blendSvgUrl,
  recipes,
  mode = 'blend', // 'blend' or 'solid' - affects color legend display
  onColorClick, // (colorData) => void - callback when user clicks a color
  onRegionClick, // (regionData) => void - callback when region clicked (eyedropper mode)
  onEyedropperCancel, // () => void - callback to cancel eyedropper mode
  selectedColor, // Current color being edited (to highlight)
  editedColors, // Map of edited colors (originalHex -> {newHex})
  onResetAll, // () => void - callback to reset all color edits
  designName = '', // AI-generated or user-edited design name
  onNameChange, // (newName) => void - callback when name is edited
  isNameLoading = false, // Whether name is being generated
  onInSituClick, // () => void - callback to open in-situ preview
  eyedropperActive = false, // Whether eyedropper mode is active
  eyedropperRegion = null, // Currently selected region for eyedropper
  // Undo/redo props
  onRegionUndo, // () => void - callback to undo last region edit
  onRegionRedo, // () => void - callback to redo next region edit
  canUndo = false, // Whether undo is available
  canRedo = false, // Whether redo is available
  regionOverridesCount = 0 // Number of region overrides applied
}) {
  const [highlightMask, setHighlightMask] = useState(null);
  const [inlineSvgContent, setInlineSvgContent] = useState(null);
  const imageRef = useRef(null);
  const svgContainerRef = useRef(null);
  const canvasRef = useRef(null);

  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const dragMovedRef = useRef(false); // Track if mouse actually moved during drag

  // Color editing tip banner state
  const [showColorTip, setShowColorTip] = useState(() => {
    const dismissed = localStorage.getItem('tpv_color_editing_tip_dismissed');
    return dismissed !== 'true';
  });

  const dismissColorTip = () => {
    setShowColorTip(false);
    localStorage.setItem('tpv_color_editing_tip_dismissed', 'true');
  };

  // Fetch SVG content for inline display (needed for region click detection)
  useEffect(() => {
    if (!blendSvgUrl) {
      setInlineSvgContent(null);
      return;
    }

    const fetchSvgContent = async () => {
      try {
        // Fetch SVG from blob URL or data URL
        const response = await fetch(blendSvgUrl);
        const svgText = await response.text();
        setInlineSvgContent(svgText);
        const hasRegionTags = svgText.includes('data-region-id');
        const regionCount = (svgText.match(/data-region-id/g) || []).length;
        console.log('[SVGPreview] Fetched inline SVG content - length:', svgText.length, 'hasRegionTags:', hasRegionTags, 'regionCount:', regionCount);
      } catch (error) {
        console.error('[SVGPreview] Failed to fetch SVG content:', error);
        setInlineSvgContent(null);
      }
    };

    fetchSvgContent();
  }, [blendSvgUrl]);

  // Sanitize SVG content to prevent XSS attacks
  const sanitizedSvgContent = useMemo(() => {
    if (!inlineSvgContent) {
      return null;
    }

    console.log('[SVGPreview] Sanitizing SVG content...');
    const sanitized = sanitizeSVG(inlineSvgContent);

    if (!sanitized) {
      console.error('[SVGPreview] SVG sanitization failed - content rejected');
      return null;
    }

    console.log('[SVGPreview] SVG sanitization complete - length:', sanitized.length);
    console.log('[SVGPreview] Sanitized content preview:', sanitized.substring(0, 200));

    if (!sanitized.includes('<svg')) {
      console.error('[SVGPreview] Sanitized SVG does not contain <svg> tag!');
      return null;
    }

    // Ensure SVG has width and height attributes for proper rendering
    // Replace opening <svg> tag to add width="100%" height="100%"
    const svgWithDimensions = sanitized.replace(
      /<svg([^>]*)>/i,
      (match, attributes) => {
        // Only add if not already present
        if (!attributes.includes('width=')) {
          attributes += ' width="100%"';
        }
        if (!attributes.includes('height=')) {
          attributes += ' height="100%"';
        }
        return `<svg${attributes}>`;
      }
    );

    return svgWithDimensions;
  }, [inlineSvgContent]);

  // Create highlight mask when a color is selected
  useEffect(() => {
    if (!selectedColor || !blendSvgUrl) {
      setHighlightMask(null);
      return;
    }

    const createHighlightMask = async () => {
      try {
        console.log('[SVGPreview] Creating highlight for color:', selectedColor);

        // Load the SVG image
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Handle CORS for data URLs

        // Wait for image to load
        const loadPromise = new Promise((resolve, reject) => {
          img.onload = () => {
            console.log('[SVGPreview] Image loaded:', img.width, 'x', img.height);
            resolve();
          };
          img.onerror = (e) => {
            console.error('[SVGPreview] Image load error:', e);
            reject(e);
          };
        });

        img.src = blendSvgUrl;
        await loadPromise;

        // Create canvas to analyze colors
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 1000;
        canvas.height = img.naturalHeight || img.height || 1000;
        const ctx = canvas.getContext('2d');

        // Draw SVG
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Parse selected color (hex to RGB) - use current hex (could be edited)
        const targetHex = selectedColor.hex; // Use current displayed color for highlighting
        const targetRgb = hexToRgb(targetHex);
        console.log('[SVGPreview] Target color:', targetHex, targetRgb);

        // First pass: identify all matching pixels
        const matches = new Set();
        let matchCount = 0;

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a > 0 && colorMatches(r, g, b, targetRgb)) {
              matches.add(`${x},${y}`);
              matchCount++;
            }
          }
        }

        console.log('[SVGPreview] Matched pixels:', matchCount);

        if (matchCount === 0) {
          console.warn('[SVGPreview] No pixels matched the target color');
          setHighlightMask(null);
          return;
        }

        // Second pass: find edges and draw white outline
        const maskData = ctx.createImageData(canvas.width, canvas.height);

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            const isMatch = matches.has(`${x},${y}`);

            if (isMatch) {
              // Check if this pixel is on the edge (has non-matching neighbors)
              const isEdge =
                !matches.has(`${x-1},${y}`) ||
                !matches.has(`${x+1},${y}`) ||
                !matches.has(`${x},${y-1}`) ||
                !matches.has(`${x},${y+1}`);

              if (isEdge) {
                // Draw bright pink/purple outline pixel
                maskData.data[i] = 255;     // R
                maskData.data[i + 1] = 0;   // G
                maskData.data[i + 2] = 255; // B (magenta/bright pink)
                maskData.data[i + 3] = 255; // A (fully opaque)
              }
            }
          }
        }

        // Draw mask to canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(maskData, 0, 0);

        // Convert to data URL
        const maskUrl = canvas.toDataURL();
        console.log('[SVGPreview] Highlight mask created');
        setHighlightMask(maskUrl);
      } catch (error) {
        console.error('[SVGPreview] Failed to create highlight mask:', error);
        setHighlightMask(null);
      }
    };

    createHighlightMask();
  }, [selectedColor, blendSvgUrl]);

  // Helper: Convert hex to RGB
  const hexToRgb = (hex) => {
    const cleanHex = hex.replace('#', '');
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16)
    };
  };

  // Helper: Check if colors match (with tolerance)
  const colorMatches = (r, g, b, target) => {
    const tolerance = 50; // Large tolerance for gradient/collapsed colors
    return (
      Math.abs(r - target.r) <= tolerance &&
      Math.abs(g - target.g) <= tolerance &&
      Math.abs(b - target.b) <= tolerance
    );
  };

  // Get color at specific pixel position
  const getColorAtPosition = async (x, y) => {
    try {
      if (!imageRef.current || !blendSvgUrl) return null;

      // Load the SVG image
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const loadPromise = new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      img.src = blendSvgUrl;
      await loadPromise;

      // Create canvas to read pixel color
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width || 1000;
      canvas.height = img.naturalHeight || img.height || 1000;
      const ctx = canvas.getContext('2d');

      // Draw SVG
      ctx.drawImage(img, 0, 0);

      // Scale click coordinates to canvas dimensions
      const rect = imageRef.current.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const canvasX = Math.floor(x * scaleX);
      const canvasY = Math.floor(y * scaleY);

      // Get pixel data at click position
      const imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
      const data = imageData.data;

      return {
        r: data[0],
        g: data[1],
        b: data[2],
        a: data[3]
      };
    } catch (error) {
      console.error('[SVGPreview] Failed to get color at position:', error);
      return null;
    }
  };

  // Zoom and pan handlers
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom / 1.5, 0.5));
  };

  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setZoom(prevZoom => Math.min(Math.max(prevZoom + delta, 0.5), 5));
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    dragMovedRef.current = false; // Reset drag moved flag
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    // Track if mouse moved more than threshold (5px) to distinguish drag from click
    const deltaX = Math.abs(e.clientX - (dragStart.x + pan.x));
    const deltaY = Math.abs(e.clientY - (dragStart.y + pan.y));
    if (deltaX > 5 || deltaY > 5) {
      dragMovedRef.current = true;
    }

    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, pan]);

  // Find region element from click target
  const findRegionElement = (element) => {
    // Walk up DOM tree to find element with data-region-id
    let el = element;
    while (el && el !== svgContainerRef.current) {
      if (el.hasAttribute && el.hasAttribute('data-region-id')) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  };

  // Handle click on SVG image
  const handleSVGClick = async (e) => {
    // Don't trigger color selection if we were dragging (panning)
    if (dragMovedRef.current) {
      console.log('[SVGPreview] Click ignored - was dragging');
      return;
    }

    console.log('[SVGPreview] Click detected - onRegionClick:', !!onRegionClick, 'inlineSvgContent:', !!inlineSvgContent, 'target:', e.target.tagName);

    // Try region-based click detection first (for inline SVG with region IDs)
    if (onRegionClick && inlineSvgContent) {
      console.log('[SVGPreview] Attempting region detection on target:', e.target);
      const regionEl = findRegionElement(e.target);
      console.log('[SVGPreview] Found region element:', regionEl);
      if (regionEl) {
        const regionId = regionEl.getAttribute('data-region-id');
        const fill = regionEl.getAttribute('fill') ||
                     regionEl.getAttribute('style')?.match(/fill:\s*([^;]+)/)?.[1];

        console.log('[SVGPreview] Region clicked:', regionId, 'fill:', fill);

        onRegionClick({
          regionId,
          sourceColor: fill,
          element: regionEl
        });
        return;
      } else {
        console.log('[SVGPreview] No region element found from target');
      }
    } else {
      console.log('[SVGPreview] Region detection skipped - onRegionClick:', !!onRegionClick, 'inlineSvgContent:', !!inlineSvgContent);
    }

    // Fallback to pixel-based color detection (for palette clicks or if no region found)
    if (!onColorClick || !recipes || recipes.length === 0) return;

    // Get click position relative to image
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log('[SVGPreview] Clicked at:', x, y);

    // Get color at click position
    const clickedColor = await getColorAtPosition(x, y);
    if (!clickedColor || clickedColor.a === 0) {
      console.log('[SVGPreview] Clicked on transparent area');
      return;
    }

    console.log('[SVGPreview] Clicked color:', clickedColor);

    // Find matching recipe
    let matchedRecipe = null;
    let bestMatch = Infinity;

    for (const recipe of recipes) {
      // Use targetColor (collapsed SVG color) for better matching
      const targetHex = recipe.targetColor.hex;
      const targetRgb = hexToRgb(targetHex);

      if (colorMatches(clickedColor.r, clickedColor.g, clickedColor.b, targetRgb)) {
        // Calculate exact distance for best match
        const distance = Math.sqrt(
          Math.pow(clickedColor.r - targetRgb.r, 2) +
          Math.pow(clickedColor.g - targetRgb.g, 2) +
          Math.pow(clickedColor.b - targetRgb.b, 2)
        );

        if (distance < bestMatch) {
          bestMatch = distance;
          matchedRecipe = recipe;
        }
      }
    }

    if (matchedRecipe) {
      console.log('[SVGPreview] Matched recipe:', matchedRecipe.targetColor.hex);

      // Call onColorClick with the same data format as ColorLegend
      onColorClick({
        hex: matchedRecipe.targetColor.hex,
        originalHex: matchedRecipe.originalColor.hex, // Use cluster centroid for mapping key
        blendHex: matchedRecipe.blendColor.hex,
        areaPct: matchedRecipe.targetColor.areaPct,
        recipe: matchedRecipe.chosenRecipe,
        targetColor: matchedRecipe.targetColor
      });
    } else {
      console.log('[SVGPreview] No matching recipe found for clicked color');
    }
  };

  if (!blendSvgUrl) {
    return null;
  }

  return (
    <div className="svg-preview">
      <div className="preview-header">
        <div className="design-name-container">
          {onNameChange ? (
            <input
              type="text"
              className="design-name-input"
              value={designName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={isNameLoading ? 'Generating name...' : 'Enter project name'}
            />
          ) : (
            <h3>{designName || 'TPV Blend Design'}</h3>
          )}
          {isNameLoading && (
            <span className="name-loading">Generating...</span>
          )}
        </div>
        {selectedColor && (
          <span className="editing-hint">
            Editing: {selectedColor.hex || selectedColor.blendHex}
          </span>
        )}
      </div>

      {/* Color Editing Tip Banner */}
      {showColorTip && onColorClick && (
        <div className="color-editing-tip">
          <div className="tip-icon">💡</div>
          <div className="tip-content">
            <strong>Tip:</strong> Click colours in the legend below to edit all instances,
            or click directly on the design to edit individual regions.
          </div>
          <button onClick={dismissColorTip} className="tip-close" title="Dismiss tip">
            ×
          </button>
        </div>
      )}

      {/* SVG Display with Color Legend */}
      <div className="svg-display-container">
        <div className="svg-panel">
          {/* Zoom Controls */}
          <div className="zoom-controls">
            <button onClick={handleZoomIn} className="zoom-btn" title="Zoom In">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <button onClick={handleZoomOut} className="zoom-btn" title="Zoom Out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="8" y1="11" x2="14" y2="11" />
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <button onClick={handleZoomReset} className="zoom-btn" title="Reset View">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6"/>
                <path d="M23 20v-6h-6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Undo/Redo Controls - Show only when region overrides exist */}
          {regionOverridesCount > 0 && (
            <div className="undo-redo-controls">
              <button
                onClick={onRegionUndo}
                className="undo-redo-btn"
                title="Undo (Ctrl+Z)"
                disabled={!canUndo}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7v6h6"/>
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                </svg>
              </button>
              <button
                onClick={onRegionRedo}
                className="undo-redo-btn"
                title="Redo (Ctrl+Y)"
                disabled={!canRedo}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 7v6h-6"/>
                  <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
                </svg>
              </button>
            </div>
          )}

          {/* In-Situ Preview Button */}
          {onInSituClick && (
            <button
              onClick={onInSituClick}
              className="in-situ-btn"
              title="Upload a photo of your installation site and see how this design will look in place with realistic perspective"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="m21 15-5-5L5 21"/>
              </svg>
              <span>Preview In-Situ</span>
            </button>
          )}

          <div
            ref={containerRef}
            className="svg-wrapper"
            onWheel={handleWheel}
          >
            <div
              className="svg-image-container"
              onClick={handleSVGClick}
              onMouseDown={handleMouseDown}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                cursor: isDragging ? 'grabbing' : (zoom > 1 ? 'grab' : (eyedropperActive ? 'crosshair' : (onColorClick ? 'pointer' : 'default')))
              }}
            >
              {sanitizedSvgContent ? (
                // Inline SVG for region click detection (sanitized to prevent XSS)
                <div
                  ref={svgContainerRef}
                  className="svg-inline-container"
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  dangerouslySetInnerHTML={{ __html: sanitizedSvgContent }}
                />
              ) : (
                // Fallback to image display
                <img
                  ref={imageRef}
                  src={blendSvgUrl}
                  alt="TPV blend design"
                  className="svg-image"
                />
              )}
              {highlightMask && (
                <img
                  src={highlightMask}
                  alt="Colour highlight"
                  className="svg-highlight-mask"
                />
              )}
            </div>
          </div>

          {/* Eyedropper instructions overlay */}
          {eyedropperActive && eyedropperRegion && (
            <div className="eyedropper-overlay">
              <div className="eyedropper-content">
                <div className="eyedropper-color-indicator">
                  <div
                    className="eyedropper-color-swatch"
                    style={{ backgroundColor: eyedropperRegion.sourceColor }}
                  />
                  <span>Click another area to copy its colour</span>
                </div>
                <button
                  className="eyedropper-cancel"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEyedropperCancel) {
                      onEyedropperCancel();
                    }
                  }}
                >
                  Cancel (Esc)
                </button>
              </div>
            </div>
          )}
        </div>

        {recipes && recipes.length > 0 && (
          <div className="legend-sidebar">
            <ColorLegend
              recipes={recipes}
              mode={mode}
              onColorClick={onColorClick}
              selectedColor={selectedColor}
              editedColors={editedColors}
              onResetAll={onResetAll}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .svg-preview {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .preview-header {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .design-name-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .preview-header h3 {
          margin: 0;
          color: #1a365d;
          font-size: 1.5rem;
        }

        .design-name-input {
          font-family: var(--font-heading), 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a365d;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          padding: 0.25rem 0;
          width: 100%;
          max-width: 400px;
          transition: border-color 0.2s;
        }

        .design-name-input:hover {
          border-bottom-color: #e5e7eb;
        }

        .design-name-input:focus {
          outline: none;
          border-bottom-color: #ff6b35;
        }

        .design-name-input::placeholder {
          color: #9ca3af;
          font-weight: normal;
        }

        .name-loading {
          font-size: 0.75rem;
          color: #9ca3af;
          font-style: italic;
        }

        /* Color Editing Tip Banner */
        .color-editing-tip {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: linear-gradient(to right, #fff7ed, #fffbeb);
          border: 1px solid #fed7aa;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .tip-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .tip-content {
          flex: 1;
          color: #78350f;
        }

        .tip-content strong {
          color: #92400e;
        }

        .tip-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #92400e;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          opacity: 0.6;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }

        .tip-close:hover {
          opacity: 1;
        }

        /* SVG Display */
        .svg-display-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: stretch;
        }

        .svg-panel {
          position: relative;
          flex: 1;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
          background: #fafafa;
        }

        /* Zoom Controls */
        .zoom-controls {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
          background: white;
          border-radius: 8px;
          padding: 0.5rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          z-index: 10;
          align-items: center;
        }

        .zoom-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          padding: 0;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          color: #1a365d;
          transition: all 0.2s ease;
        }

        .zoom-btn:hover {
          background: #f8fafc;
          border-color: #1e4a7a;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .zoom-btn:active {
          transform: translateY(0);
        }

        .zoom-btn svg {
          width: 20px;
          height: 20px;
        }

        .zoom-level {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1a365d;
          min-width: 50px;
          text-align: center;
          padding: 0 0.5rem;
        }

        /* Undo/Redo Controls */
        .undo-redo-controls {
          position: absolute;
          top: 5rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
          background: white;
          border-radius: 8px;
          padding: 0.5rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .undo-redo-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          padding: 0;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          color: #1a365d;
          transition: all 0.2s ease;
        }

        .undo-redo-btn:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #1e4a7a;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .undo-redo-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .undo-redo-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .undo-redo-btn svg {
          width: 20px;
          height: 20px;
        }

        .in-situ-btn {
          position: absolute;
          top: 1rem;
          left: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(255, 107, 53, 0.3);
          z-index: 10;
          transition: all 0.2s ease;
        }

        .in-situ-btn:hover {
          background: #e55a2b;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);
        }

        .in-situ-btn:active {
          transform: translateY(0);
        }

        .in-situ-btn svg {
          width: 18px;
          height: 18px;
        }

        .svg-wrapper {
          padding: 2rem;
          background: white;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .svg-image-container {
          position: relative;
          display: inline-block;
          user-select: none;
          transition: transform 0.1s ease-out;
          transform-origin: center center;
        }

        .svg-image {
          max-width: 100%;
          height: auto;
          display: block;
          border-radius: 4px;
          pointer-events: ${onColorClick ? 'auto' : 'none'};
        }

        .svg-inline-container {
          max-width: 100%;
          display: block;
          border-radius: 4px;
        }

        .svg-inline-container svg {
          max-width: 100%;
          height: auto;
          display: block;
        }

        .svg-highlight-mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          border-radius: 4px;
          filter: drop-shadow(0 0 3px rgba(255, 0, 255, 0.8)) drop-shadow(0 0 1px rgba(0, 0, 0, 0.6));
          animation: pulse 2s ease-in-out infinite;
        }

        .eyedropper-overlay {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
        }

        .eyedropper-content {
          background: white;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 16px;
          border: 2px solid #3b82f6;
        }

        .eyedropper-color-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          color: #111827;
        }

        .eyedropper-color-swatch {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 2px solid #d1d5db;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .eyedropper-cancel {
          padding: 8px 16px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .eyedropper-cancel:hover {
          background: #dc2626;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        .editing-hint {
          font-size: 0.9rem;
          color: #ff6b35;
          font-weight: 500;
          margin-left: 1rem;
        }

        .legend-sidebar {
          width: 100%;
        }

        @media (max-width: 768px) {
          .svg-preview {
            padding: 0.5rem;
            margin-top: 0.75rem;
            border-radius: 6px;
          }

          .preview-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
            margin-bottom: 0.5rem;
          }

          .preview-header h3 {
            font-size: 1.1rem;
          }

          .design-name-input {
            font-size: 1.1rem;
            max-width: 100%;
          }

          .editing-hint {
            margin-left: 0;
            font-size: 0.75rem;
          }

          .svg-panel {
            border: none;
            border-radius: 0;
          }

          .svg-wrapper {
            padding: 0;
            min-height: auto;
          }

          /* Position zoom controls at bottom-right on mobile */
          .zoom-controls {
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            top: auto;
            flex-direction: column;
            gap: 0.25rem;
            padding: 0.25rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            z-index: 50;
          }

          /* Position undo/redo controls above zoom on mobile */
          .undo-redo-controls {
            position: fixed;
            bottom: 12rem;
            right: 1rem;
            top: auto;
            gap: 0.25rem;
            padding: 0.25rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            z-index: 50;
          }

          /* Make buttons circular and compact on mobile */
          .zoom-btn,
          .undo-redo-btn {
            width: 44px;
            height: 44px;
            padding: 0;
            border-radius: 50%;
            min-width: unset;
            font-size: 1.1rem;
          }

          /* Hide text labels on mobile */
          .zoom-btn span {
            display: none;
          }

          /* In-situ button - compact on mobile */
          .in-situ-btn {
            padding: 0.4rem;
            font-size: 0;
            top: 0.5rem;
            left: 0.5rem;
            border-radius: 50%;
            width: 36px;
            height: 36px;
          }

          .in-situ-btn span {
            display: none;
          }

          .in-situ-btn svg {
            width: 18px;
            height: 18px;
          }

          .svg-image-container {
            /* Allow zoom on mobile via buttons */
            cursor: default !important;
          }
        }

        /* Extra small screens */
        @media (max-width: 480px) {
          .svg-preview {
            padding: 0.25rem;
            margin-top: 0.5rem;
          }

          .preview-header {
            padding: 0 0.25rem;
          }

          .preview-header h3 {
            font-size: 1rem;
          }

          .design-name-input {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
