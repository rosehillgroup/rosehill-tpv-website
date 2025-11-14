// TPV Studio - SVG Preview Component
// Shows TPV blend SVG with color legend and color highlighting

import { useEffect, useRef, useState } from 'react';
import ColorLegend from './ColorLegend';

export default function SVGPreview({
  blendSvgUrl,
  recipes,
  onColorClick, // (colorData) => void - callback when user clicks a color
  selectedColor // Current color being edited (to highlight)
}) {
  const [highlightMask, setHighlightMask] = useState(null);
  const canvasRef = useRef(null);

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

        // Parse selected color (hex to RGB)
        const targetHex = selectedColor.blendHex || selectedColor.hex;
        const targetRgb = hexToRgb(targetHex);
        console.log('[SVGPreview] Target color:', targetHex, targetRgb);

        // Create mask (white where color matches, transparent elsewhere)
        const maskData = ctx.createImageData(canvas.width, canvas.height);
        let matchCount = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Check if pixel matches target color (with small tolerance)
          if (a > 0 && colorMatches(r, g, b, targetRgb)) {
            // Orange glow pixel for mask
            maskData.data[i] = 255;
            maskData.data[i + 1] = 107;
            maskData.data[i + 2] = 53;
            maskData.data[i + 3] = 200; // Semi-transparent orange
            matchCount++;
          } else {
            // Transparent
            maskData.data[i + 3] = 0;
          }
        }

        console.log('[SVGPreview] Matched pixels:', matchCount);

        if (matchCount === 0) {
          console.warn('[SVGPreview] No pixels matched the target color');
          setHighlightMask(null);
          return;
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
    const tolerance = 15; // Allow small variations
    return (
      Math.abs(r - target.r) <= tolerance &&
      Math.abs(g - target.g) <= tolerance &&
      Math.abs(b - target.b) <= tolerance
    );
  };

  if (!blendSvgUrl) {
    return null;
  }

  return (
    <div className="svg-preview">
      <div className="preview-header">
        <h3>TPV Blend Design</h3>
        {selectedColor && (
          <span className="editing-hint">
            Editing: {selectedColor.hex || selectedColor.blendHex}
          </span>
        )}
      </div>

      {/* SVG Display with Color Legend */}
      <div className="svg-display-container">
        <div className="svg-panel">
          <div className="svg-wrapper">
            <div className="svg-image-container">
              <img src={blendSvgUrl} alt="TPV blend design" className="svg-image" />
              {highlightMask && (
                <img
                  src={highlightMask}
                  alt="Colour highlight"
                  className="svg-highlight-mask"
                />
              )}
            </div>
          </div>
        </div>

        {recipes && recipes.length > 0 && (
          <div className="legend-sidebar">
            <ColorLegend
              recipes={recipes}
              onColorClick={onColorClick}
              selectedColor={selectedColor}
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
        }

        .preview-header h3 {
          margin: 0;
          color: #1a365d;
          font-size: 1.5rem;
        }

        /* SVG Display */
        .svg-display-container {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .svg-panel {
          flex: 1;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
          background: #fafafa;
        }

        .svg-wrapper {
          padding: 2rem;
          background: white;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .svg-image-container {
          position: relative;
          display: inline-block;
        }

        .svg-image {
          max-width: 100%;
          height: auto;
          display: block;
          border-radius: 4px;
        }

        .svg-highlight-mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          border-radius: 4px;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.7;
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
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .svg-preview {
            padding: 1rem;
          }

          .svg-display-container {
            flex-direction: column;
          }

          .svg-wrapper {
            padding: 1rem;
            min-height: 250px;
          }

          .legend-sidebar {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
