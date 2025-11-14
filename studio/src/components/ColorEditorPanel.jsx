// TPV Studio - Colour Editor Panel
// Simple colour picker for visual editing

import { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';

export default function ColorEditorPanel({
  color,           // {hex, rgb, lab, areaPct, originalHex}
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
                  className="swatch current"
                  style={{ backgroundColor: selectedHex }}
                  title="Current colour"
                />
                <span className="swatch-label">Current</span>
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

        {/* Colour Picker */}
        <div className="picker-section">
          <h4>Choose Colour</h4>
          <ChromePicker
            color={selectedHex}
            onChange={handleColorChange}
            disableAlpha={true}
          />
          <button onClick={handleReset} className="reset-button">
            Reset to Original
          </button>
        </div>
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
          margin: 0;
          color: #1a365d;
          font-size: 1.5rem;
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

        /* Picker Section */
        .picker-section {
          margin-bottom: 1rem;
        }

        .picker-section h4 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1rem;
          font-weight: 600;
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

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .color-editor-panel {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
