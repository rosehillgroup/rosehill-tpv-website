// TPV Studio - Colour Editor Panel
// Simple colour picker for visual editing

import { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import tpvColours from '../../api/_utils/data/rosehill_tpv_21_colours.json';

export default function ColorEditorPanel({
  color,           // {hex, rgb, lab, areaPct, originalHex}
  mode = 'blend',  // 'blend' or 'solid' - restricts editing in solid mode
  onColorChange,   // (newHex) => void
  onClose
}) {
  const [selectedHex, setSelectedHex] = useState(color?.hex || '#000000');

  // Update selected hex when color prop changes
  useEffect(() => {
    if (color?.hex) {
      setSelectedHex(color.hex);
    }
  }, [color?.hex]);

  // Handle color change
  const handleColorChange = (colorResult) => {
    const newHex = colorResult.hex;
    setSelectedHex(newHex);

    // Immediately notify parent of color change
    if (onColorChange) {
      onColorChange(newHex);
    }
  };

  // Reset to original color
  const handleReset = () => {
    if (color?.originalHex) {
      setSelectedHex(color.originalHex);
      if (onColorChange) {
        onColorChange(color.originalHex);
      }
    }
  };

  // Handle TPV color selection
  const handleTpvColorClick = (tpvColor) => {
    const newHex = tpvColor.hex;
    setSelectedHex(newHex);
    if (onColorChange) {
      onColorChange(newHex);
    }
  };

  // Handle transparent selection
  const handleMakeTransparent = () => {
    setSelectedHex('transparent');
    if (onColorChange) {
      onColorChange('transparent');
    }
  };

  // Check if currently transparent
  const isTransparent = selectedHex === 'transparent' || selectedHex === 'none';

  if (!color) {
    return null;
  }

  return (
    <div className="color-editor-panel">
      <div className="editor-header">
        <h3>Edit Colour</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="editor-content">
        {/* Colour Info */}
        <div className="color-info-section">
          <div className="color-display">
            <div className="swatch-pair">
              <div className="swatch-group">
                <div
                  className="swatch original"
                  style={{ backgroundColor: color.originalHex || color.hex }}
                  title="Original colour"
                />
                <span className="swatch-label">Original</span>
              </div>
              <span className="arrow">→</span>
              <div className="swatch-group">
                <div
                  className={`swatch current ${isTransparent ? 'transparent-preview' : ''}`}
                  style={isTransparent ? {} : { backgroundColor: selectedHex }}
                  title="Current colour"
                />
                <span className="swatch-label">{isTransparent ? 'Transparent' : 'Current'}</span>
              </div>
            </div>
          </div>

          <div className="color-details">
            <div className="detail-row">
              <span className="label">Hex:</span>
              <span className="value">{selectedHex}</span>
            </div>
            <div className="detail-row">
              <span className="label">Coverage:</span>
              <span className="value">{color.areaPct?.toFixed(1) || 0}%</span>
            </div>
          </div>
        </div>

        {/* Transparent Option */}
        <div className="transparent-section">
          <h4>Remove Fill</h4>
          <button
            className={`transparent-option ${isTransparent ? 'selected' : ''}`}
            onClick={handleMakeTransparent}
            title="Make this area transparent (remove fill)"
          >
            <div className="transparent-swatch" />
            <span>Make Transparent</span>
          </button>
        </div>

        {/* TPV Colour Palette */}
        <div className="tpv-palette-section">
          <h4>Standard TPV Colours</h4>
          <p className="palette-description">
            Select a pure TPV colour (no blending required)
          </p>
          <div className="tpv-color-grid">
            {tpvColours.map((tpvColor) => (
              <div
                key={tpvColor.code}
                className={`tpv-color-item ${selectedHex.toLowerCase() === tpvColor.hex.toLowerCase() ? 'selected' : ''}`}
                onClick={() => handleTpvColorClick(tpvColor)}
                title={`${tpvColor.code} - ${tpvColor.name}`}
              >
                <div
                  className="tpv-color-swatch"
                  style={{ backgroundColor: tpvColor.hex }}
                />
                <span className="tpv-color-code">{tpvColor.code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Colour Picker - Only in Blend Mode */}
        {mode === 'blend' && (
          <div className="picker-section">
            <h4>Custom Colour</h4>
            <p className="picker-description">
              Choose any colour (may require blending)
            </p>
            <ChromePicker
              color={selectedHex}
              onChange={handleColorChange}
              disableAlpha={true}
            />
            <button onClick={handleReset} className="reset-button">
              Reset to Original Colour
            </button>
          </div>
        )}

        {/* Solid Mode Info */}
        {mode === 'solid' && (
          <div className="solid-mode-info">
            <h4>Solid Mode Editing</h4>
            <p className="info-description">
              In solid mode, you can only select from the standard TPV colours above.
              Custom colours require blending - switch to Blend Mode for full colour customisation.
            </p>
            <button onClick={handleReset} className="reset-button">
              Reset to Original Colour
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .color-editor-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 400px;
          height: 100vh;
          background: white;
          box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 2px solid #1a365d;
          background: #f9f9f9;
        }

        .editor-header h3 {
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
          color: #1e4a7a;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 2rem;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          line-height: 1;
          transition: color 0.2s;
        }

        .close-button:hover {
          color: #333;
        }

        .editor-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        /* Color Info Section */
        .color-info-section {
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .color-display {
          margin-bottom: 1rem;
        }

        .swatch-pair {
          display: flex;
          align-items: center;
          gap: 1rem;
          justify-content: center;
        }

        .swatch-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .swatch {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          border: 3px solid #ddd;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .swatch.original {
          border-color: #999;
        }

        .swatch.current {
          border-color: #ff6b35;
        }

        .swatch.transparent-preview {
          background:
            linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%),
            linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%);
          background-size: 10px 10px;
          background-position: 0 0, 5px 5px;
          background-color: white;
        }

        .swatch-label {
          font-size: 0.85rem;
          color: #666;
          font-weight: 500;
        }

        .arrow {
          font-size: 1.5rem;
          color: #666;
          font-weight: bold;
        }

        .color-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.95rem;
        }

        .detail-row .label {
          font-weight: 600;
          color: #666;
        }

        .detail-row .value {
          font-family: 'Courier New', monospace;
          color: #333;
        }

        /* Transparent Section */
        .transparent-section {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .transparent-section h4 {
          margin: 0 0 0.75rem 0;
          color: #1a365d;
          font-size: 1rem;
          font-weight: 600;
        }

        .transparent-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: white;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.95rem;
          font-weight: 500;
          color: #374151;
        }

        .transparent-option:hover {
          border-color: #6b7280;
          background: #fafafa;
        }

        .transparent-option.selected {
          border-color: #ff6b35;
          background: #fff5f0;
          box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
        }

        .transparent-swatch {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: 1px solid #999;
          background:
            linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%),
            linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%);
          background-size: 8px 8px;
          background-position: 0 0, 4px 4px;
          background-color: white;
        }

        /* TPV Palette Section */
        .tpv-palette-section {
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .tpv-palette-section h4 {
          margin: 0 0 0.5rem 0;
          color: #1a365d;
          font-size: 1rem;
          font-weight: 600;
        }

        .palette-description {
          margin: 0 0 1rem 0;
          font-size: 0.85rem;
          color: #666;
        }

        .tpv-color-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .tpv-color-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem;
          border: 2px solid transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .tpv-color-item:hover {
          border-color: #ff6b35;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .tpv-color-item.selected {
          border-color: #ff6b35;
          background: #fff5f0;
          box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
        }

        .tpv-color-swatch {
          width: 100%;
          height: 50px;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .tpv-color-code {
          font-size: 0.75rem;
          font-weight: 600;
          color: #1a365d;
          font-family: 'Courier New', monospace;
        }

        /* Picker Section */
        .picker-section {
          margin-bottom: 1rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .picker-section h4 {
          margin: 0 0 0.5rem 0;
          color: #1a365d;
          font-size: 1rem;
          font-weight: 600;
        }

        .picker-description {
          margin: 0 0 1rem 0;
          font-size: 0.85rem;
          color: #666;
        }

        .picker-section :global(.chrome-picker) {
          box-shadow: none !important;
          width: 100% !important;
        }

        .reset-button {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
          background: #e0e0e0;
          color: #333;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .reset-button:hover {
          background: #d0d0d0;
        }

        /* Solid Mode Info */
        .solid-mode-info {
          margin-bottom: 1rem;
          padding: 1rem;
          background: #fff5f0;
          border: 2px solid #ff6b35;
          border-radius: 6px;
        }

        .solid-mode-info h4 {
          margin: 0 0 0.5rem 0;
          color: #1a365d;
          font-size: 1rem;
          font-weight: 600;
        }

        .info-description {
          margin: 0;
          font-size: 0.85rem;
          color: #666;
          line-height: 1.5;
        }

        /* Mobile Responsive - Fullscreen Modal */
        @media (max-width: 768px) {
          .color-editor-panel {
            width: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 0;
          }

          .editor-header {
            padding: 1rem;
            position: sticky;
            top: 0;
            z-index: 10;
          }

          .editor-header h3 {
            font-size: 1.25rem;
          }

          /* Larger close button for touch */
          .close-button {
            width: 44px;
            height: 44px;
            font-size: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .editor-content {
            padding: 1rem;
          }

          /* Color swatches - larger for touch */
          .swatch {
            width: 50px;
            height: 50px;
          }

          .color-info-section {
            padding: 0.75rem;
            margin-bottom: 1.5rem;
          }

          /* TPV color grid - better touch targets */
          .tpv-color-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 0.5rem;
          }

          .tpv-color-item {
            padding: 0.4rem;
            min-height: 44px;
          }

          .tpv-color-swatch {
            height: 36px;
          }

          .tpv-color-code {
            font-size: 0.65rem;
          }

          .tpv-palette-section {
            padding: 0.75rem;
            margin-bottom: 1.5rem;
          }

          .tpv-palette-section h4 {
            font-size: 0.9rem;
          }

          .palette-description {
            font-size: 0.8rem;
          }

          /* Picker section */
          .picker-section {
            padding: 0.75rem;
          }

          .picker-section h4 {
            font-size: 0.9rem;
          }

          .picker-description {
            font-size: 0.8rem;
          }

          /* Larger reset button for touch */
          .reset-button {
            min-height: 44px;
            font-size: 0.9rem;
          }

          .solid-mode-info {
            padding: 0.75rem;
          }

          .solid-mode-info h4 {
            font-size: 0.9rem;
          }

          .info-description {
            font-size: 0.8rem;
          }
        }

        /* Extra small screens */
        @media (max-width: 400px) {
          .tpv-color-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .tpv-color-swatch {
            height: 44px;
          }

          .swatch {
            width: 44px;
            height: 44px;
          }

          .swatch-pair {
            gap: 0.5rem;
          }

          .arrow {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}
