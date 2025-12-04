// TPV Studio - Mini Mixer Widget
// Inline blend editor for color customization in blend mode

import React, { useState, useEffect, useCallback, useRef } from 'react';
import VoronoiCanvas from './VoronoiCanvas';
import {
  PALETTE,
  calculateBlendedColor,
  recipeToParts,
  partsToRecipe,
  getContrastColor
} from '../utils/mixerUtils';

export default function MiniMixerWidget({
  initialRecipe = null,
  onBlendChange = null,
  originalColor = null
}) {
  // Parts state - Map of colorIndex -> partCount
  const [parts, setParts] = useState(new Map());

  // Track if this is the initial load to prevent infinite loops
  const isInitialLoadRef = useRef(true);
  const lastInitialRecipeRef = useRef(null);

  // Initialize parts from recipe - only when initialRecipe actually changes
  useEffect(() => {
    if (initialRecipe) {
      // Check if this is a genuinely new recipe (not just a re-render)
      const recipeKey = JSON.stringify(initialRecipe);
      if (recipeKey !== lastInitialRecipeRef.current) {
        lastInitialRecipeRef.current = recipeKey;
        isInitialLoadRef.current = true;
        const initialParts = recipeToParts(initialRecipe);
        setParts(initialParts);
      }
    }
  }, [initialRecipe]);

  // Calculate derived values
  const totalParts = Array.from(parts.values()).reduce((a, b) => a + b, 0);
  const blendedColor = calculateBlendedColor(parts);

  // Notify parent of blend changes - skip on initial load to prevent infinite loop
  useEffect(() => {
    // Skip the initial load notification to prevent infinite loop
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    // Fire callback even when parts is empty (for Clear All to work)
    if (onBlendChange) {
      const recipe = parts.size > 0 ? partsToRecipe(parts) : null;
      onBlendChange({
        blendHex: blendedColor,
        parts,
        recipe
      });
    }
  }, [parts, blendedColor]); // Removed onBlendChange from deps to prevent infinite loop

  // Add part handler with validation (max 4 parts per color, 12 total)
  const addPart = useCallback((colorIndex) => {
    setParts(prev => {
      const currentCount = prev.get(colorIndex) || 0;
      const totalParts = Array.from(prev.values()).reduce((a, b) => a + b, 0);

      // Check max 4 parts per color
      if (currentCount >= 4) {
        return prev; // Can't add more than 4 of same color
      }

      // Check max 12 total parts
      if (totalParts >= 12) {
        return prev; // Can't exceed 12 total parts
      }

      const newParts = new Map(prev);
      newParts.set(colorIndex, currentCount + 1);
      return newParts;
    });
  }, []);

  // Remove part handler
  const removePart = useCallback((colorIndex) => {
    const currentCount = parts.get(colorIndex) || 0;
    if (currentCount > 0) {
      setParts(prev => {
        const newParts = new Map(prev);
        if (currentCount === 1) {
          newParts.delete(colorIndex);
        } else {
          newParts.set(colorIndex, currentCount - 1);
        }
        return newParts;
      });
    }
  }, [parts]);

  // Clear all parts
  const clearParts = useCallback(() => {
    setParts(new Map());
  }, []);

  return (
    <>
      <div className="mini-mixer-widget">
        {/* Header with original color reference */}
        {originalColor && (
          <div className="mixer-header">
            <div className="mixer-title">Customise Blend Recipe</div>
            <div className="original-color-ref">
              <span className="label">Original:</span>
              <div
                className="color-swatch"
                style={{ backgroundColor: originalColor, cursor: 'pointer' }}
                title={`${originalColor} - Click to reset to original recipe`}
                onClick={() => {
                  if (initialRecipe) {
                    setParts(recipeToParts(initialRecipe));
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Voronoi Visualization */}
        <div className="mixer-canvas-section">
          <VoronoiCanvas
            parts={parts}
            width={700}
            height={350}
            cellCount={5000}
            seed={12345}
          />
        </div>

        {/* Mix Proportion Bar */}
        <div className="mix-proportion-bar">
          {totalParts === 0 ? (
            <div className="proportion-bar-empty" />
          ) : (
            Array.from(parts.entries()).map(([colorIndex, count]) => {
              const percentage = (count / totalParts) * 100;
              return (
                <div
                  key={colorIndex}
                  className="proportion-segment"
                  style={{
                    backgroundColor: PALETTE[colorIndex].hex,
                    flexBasis: `${percentage}%`
                  }}
                  title={`${PALETTE[colorIndex].name}: ${Math.round(percentage)}%`}
                />
              );
            })
          )}
        </div>

        {/* Blend Color Preview */}
        <div className="blend-preview">
          <div className="blend-preview-label">Blended Result:</div>
          <div className="blend-preview-color">
            <div
              className="blend-swatch"
              style={{
                backgroundColor: blendedColor,
                color: getContrastColor(blendedColor)
              }}
            >
              {blendedColor}
            </div>
            <div className="blend-parts-count">
              {totalParts} {totalParts === 1 ? 'part' : 'parts'}
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mixer-palette-section">
          <div className="mixer-palette-header">
            <h3>TPV Color Palette</h3>
            {totalParts > 0 && (
              <button className="clear-btn" onClick={clearParts}>
                Clear All
              </button>
            )}
          </div>
          <div className="mixer-palette-grid">
            {PALETTE.map((color, index) => {
              const partCount = parts.get(index) || 0;
              return (
                <div key={index} className="mixer-color-item">
                  <button
                    className={`mixer-color-swatch ${partCount > 0 ? 'has-parts' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => addPart(index)}
                    title={`${color.name} (${color.code})`}
                  />
                  <div className="mixer-color-info">
                    <div className="mixer-color-name">{color.name}</div>
                    <div className="mixer-color-code">{color.code}</div>
                  </div>
                  <div className="mixer-parts-controls">
                    <button
                      className="mixer-parts-btn"
                      onClick={() => removePart(index)}
                      disabled={partCount === 0}
                    >
                      −
                    </button>
                    <div className="mixer-parts-count">{partCount}</div>
                    <button
                      className="mixer-parts-btn"
                      onClick={() => addPart(index)}
                      disabled={partCount >= 4 || totalParts >= 12}
                      title={partCount >= 4 ? 'Max 4 parts per color' : totalParts >= 12 ? 'Max 12 total parts' : ''}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        {totalParts === 0 ? (
          <div className="mixer-instructions">
            Click colors above to add parts to your blend. The preview updates in real-time.
          </div>
        ) : totalParts >= 12 ? (
          <div className="mixer-instructions" style={{ background: '#fef3c7', borderColor: '#fbbf24' }}>
            Maximum of 12 parts reached. Remove parts to adjust your blend.
          </div>
        ) : null}
      </div>

      <style>{`
        .mini-mixer-widget {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .mixer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .mixer-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }

        .original-color-ref {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .original-color-ref .color-swatch {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 2px solid #d1d5db;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.2s;
        }

        .original-color-ref .color-swatch:hover {
          transform: scale(1.1);
          border-color: #3b82f6;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
        }

        .mixer-canvas-section {
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
        }

        .mix-proportion-bar {
          height: 24px;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
          margin: 16px 0;
          background: #e5e7eb;
        }

        .proportion-segment {
          transition: all 0.2s ease;
        }

        .proportion-segment:hover {
          filter: brightness(1.1);
          cursor: pointer;
        }

        .proportion-bar-empty {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
        }

        .blend-preview {
          margin-bottom: 24px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        }

        .blend-preview-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
          font-size: 0.95rem;
        }

        .blend-preview-color {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .blend-swatch {
          flex: 1;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          font-size: 1.1rem;
          border: 2px solid #d1d5db;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .blend-parts-count {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
          white-space: nowrap;
        }

        .mixer-palette-section {
          margin-bottom: 16px;
        }

        .mixer-palette-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .mixer-palette-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #111827;
        }

        .clear-btn {
          padding: 6px 12px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-btn:hover {
          background: #dc2626;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
        }

        .mixer-palette-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
          padding: 4px;
        }

        .mixer-color-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .mixer-color-item:hover {
          border-color: #3b82f6;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
        }

        .mixer-color-swatch {
          width: 100%;
          height: 48px;
          border-radius: 6px;
          border: 2px solid #d1d5db;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mixer-color-swatch:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .mixer-color-swatch.has-parts {
          border-color: #3b82f6;
          border-width: 3px;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .mixer-color-info {
          text-align: center;
        }

        .mixer-color-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: #374151;
          line-height: 1.2;
        }

        .mixer-color-code {
          font-size: 0.75rem;
          color: #9ca3af;
          font-family: 'Courier New', monospace;
        }

        .mixer-parts-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .mixer-parts-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          font-size: 1.2rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mixer-parts-btn:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .mixer-parts-btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .mixer-parts-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .mixer-parts-count {
          min-width: 24px;
          text-align: center;
          font-weight: 600;
          color: #111827;
          font-size: 0.9rem;
        }

        .mixer-instructions {
          text-align: center;
          color: #6b7280;
          font-size: 0.9rem;
          padding: 16px;
          background: #fffbeb;
          border-radius: 8px;
          border: 1px solid #fde68a;
        }

        @media (max-width: 768px) {
          .mini-mixer-widget {
            padding: 16px;
          }

          .mixer-canvas-section canvas {
            max-width: 100%;
            height: auto !important;
          }

          .mixer-palette-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 8px;
          }

          .blend-preview-color {
            flex-direction: column;
            gap: 12px;
          }

          .blend-swatch {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
