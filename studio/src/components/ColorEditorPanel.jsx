// TPV Studio - Color Editor Panel
// Interactive color editing with real-time blend recipe updates

import { useState, useEffect, useCallback } from 'react';
import { ChromePicker } from 'react-color';
import { apiClient } from '../lib/api/client.js';

export default function ColorEditorPanel({
  color,           // {hex, rgb, lab, areaPct, originalHex}
  currentRecipe,   // Current recipe for this color
  initialRecipes,  // Initial recipes from parent (hybrid approach)
  onRecipeChange,  // (newRecipe) => void
  onColorChange,   // (newHex) => void
  onClose
}) {
  const [selectedHex, setSelectedHex] = useState(color?.hex || '#000000');
  const [recipes, setRecipes] = useState(initialRecipes || []);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced color matching
  const [matchTimeout, setMatchTimeout] = useState(null);

  // Track abort controller for request cancellation
  const [abortController, setAbortController] = useState(null);

  // Update selected hex when color prop changes
  useEffect(() => {
    if (color?.hex) {
      setSelectedHex(color.hex);
    }
  }, [color?.hex]);

  // Fetch recipes for a color with timeout and cancellation
  const fetchRecipes = useCallback(async (hex) => {
    // Cancel any pending request
    if (abortController) {
      abortController.abort();
    }

    // Create new abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);

    setLoading(true);
    setError(null);

    try {
      console.log('[ColorEditor] Matching color:', hex);

      // Create timeout promise (10 seconds)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out after 10 seconds')), 10000)
      );

      // Race between API call and timeout
      const response = await Promise.race([
        apiClient.matchColor(hex, 2, { signal: controller.signal }),
        timeoutPromise
      ]);

      // Check if request was aborted
      if (controller.signal.aborted) {
        console.log('[ColorEditor] Request was cancelled');
        return;
      }

      if (response.success && response.recipes) {
        setRecipes(response.recipes);
        setSelectedRecipeIndex(0);

        // Notify parent of recipe change
        if (onRecipeChange && response.recipes.length > 0) {
          onRecipeChange(response.recipes[0]);
        }
      } else {
        throw new Error('No recipes found');
      }
    } catch (err) {
      // Don't show error if request was aborted
      if (err.name === 'AbortError' || controller.signal.aborted) {
        console.log('[ColorEditor] Request cancelled');
        return;
      }

      console.error('[ColorEditor] Error fetching recipes:', err);
      setError(err.message || 'Failed to fetch recipes');
    } finally {
      // Only clear loading if this is still the active request
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [abortController, onRecipeChange]);

  // Hybrid approach: Use initial recipes if provided, otherwise fetch
  useEffect(() => {
    // If we have initial recipes, use them (instant display)
    if (initialRecipes && initialRecipes.length > 0) {
      console.log('[ColorEditor] Using initial recipes:', initialRecipes.length);
      setRecipes(initialRecipes);
      setSelectedRecipeIndex(0);

      // Notify parent of initial recipe
      if (onRecipeChange && initialRecipes[0]) {
        onRecipeChange(initialRecipes[0]);
      }
    } else if (color?.hex) {
      // No initial recipes provided, fetch fresh ones
      console.log('[ColorEditor] No initial recipes, fetching for:', color.hex);
      fetchRecipes(color.hex);
    }
  }, [color?.hex, initialRecipes, fetchRecipes, onRecipeChange]);

  // Cleanup: Cancel any pending requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortController) {
        console.log('[ColorEditor] Unmounting, cancelling pending requests');
        abortController.abort();
      }
      if (matchTimeout) {
        clearTimeout(matchTimeout);
      }
    };
  }, [abortController, matchTimeout]);

  // Handle color change with debouncing
  const handleColorChange = (colorResult) => {
    const newHex = colorResult.hex;
    setSelectedHex(newHex);

    // Clear existing timeout
    if (matchTimeout) {
      clearTimeout(matchTimeout);
    }

    // Debounce recipe fetching (300ms)
    const timeout = setTimeout(() => {
      fetchRecipes(newHex);
      if (onColorChange) {
        onColorChange(newHex);
      }
    }, 300);

    setMatchTimeout(timeout);
  };

  // Handle recipe selection
  const handleRecipeSelect = (index) => {
    setSelectedRecipeIndex(index);
    if (onRecipeChange && recipes[index]) {
      onRecipeChange(recipes[index]);
    }
  };

  // Reset to original color
  const handleReset = () => {
    if (color?.originalHex) {
      setSelectedHex(color.originalHex);
      fetchRecipes(color.originalHex);
      if (onColorChange) {
        onColorChange(color.originalHex);
      }
    }
  };

  if (!color) {
    return null;
  }

  const selectedRecipe = recipes[selectedRecipeIndex];

  return (
    <div className="color-editor-panel">
      <div className="editor-header">
        <h3>Edit Color</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="editor-content">
        {/* Color Info */}
        <div className="color-info-section">
          <div className="color-display">
            <div className="swatch-pair">
              <div className="swatch-group">
                <div
                  className="swatch original"
                  style={{ backgroundColor: color.originalHex || color.hex }}
                  title="Original color"
                />
                <span className="swatch-label">Original</span>
              </div>
              <span className="arrow">→</span>
              <div className="swatch-group">
                <div
                  className="swatch current"
                  style={{ backgroundColor: selectedHex }}
                  title="Current color"
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

        {/* Color Picker */}
        <div className="picker-section">
          <h4>Choose Color</h4>
          <ChromePicker
            color={selectedHex}
            onChange={handleColorChange}
            disableAlpha={true}
          />
          <button onClick={handleReset} className="reset-button">
            Reset to Original
          </button>
        </div>

        {/* Recipe Display */}
        <div className="recipe-section">
          <h4>TPV Blend Recipes</h4>

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <span>Matching color...</span>
            </div>
          )}

          {error && (
            <div className="error-state">
              <strong>Error:</strong> {error}
              <button
                onClick={() => fetchRecipes(selectedHex)}
                className="retry-button"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && recipes.length > 0 && (
            <div className="recipes-list">
              {recipes.map((recipe, idx) => (
                <div
                  key={recipe.id}
                  className={`recipe-card ${idx === selectedRecipeIndex ? 'selected' : ''}`}
                  onClick={() => handleRecipeSelect(idx)}
                >
                  <div className="recipe-header">
                    <div
                      className="recipe-swatch"
                      style={{ backgroundColor: recipe.blendColor.hex }}
                      title={`Blend result: ${recipe.blendColor.hex}`}
                    />
                    <div className="recipe-quality">
                      <span className={`quality-badge ${recipe.quality.toLowerCase()}`}>
                        {recipe.quality}
                      </span>
                      <span className="delta-e">ΔE {recipe.deltaE.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="recipe-formula">
                    {recipe.components.map((comp, compIdx) => (
                      <span key={compIdx} className="component">
                        {comp.parts && <strong>{comp.parts} {comp.parts === 1 ? 'part' : 'parts'}</strong>}
                        {!comp.parts && <strong>{(comp.weight * 100).toFixed(0)}%</strong>}
                        {' '}
                        <span className="comp-code">{comp.code}</span>
                        {' '}
                        <span className="comp-name">({comp.name})</span>
                        {compIdx < recipe.components.length - 1 && <span className="separator"> + </span>}
                      </span>
                    ))}
                  </div>

                  {idx === selectedRecipeIndex && (
                    <div className="selected-indicator">✓ Selected</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && !error && recipes.length === 0 && (
            <div className="empty-state">
              No recipes available. Try selecting a color.
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .color-editor-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 450px;
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
          margin-bottom: 2rem;
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

        /* Recipe Section */
        .recipe-section {
          margin-bottom: 1rem;
        }

        .recipe-section h4 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1rem;
          font-weight: 600;
        }

        .loading-state,
        .error-state,
        .empty-state {
          padding: 2rem;
          text-align: center;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f0f0f0;
          border-top-color: #ff6b35;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-state {
          color: #c33;
          background: #fee;
          border: 1px solid #fcc;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .retry-button {
          padding: 0.5rem 1.5rem;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .retry-button:hover {
          background: #e55a25;
        }

        .empty-state {
          color: #999;
        }

        /* Recipes List */
        .recipes-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .recipe-card {
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .recipe-card:hover {
          border-color: #ff6b35;
          background: #fff9f7;
        }

        .recipe-card.selected {
          border-color: #ff6b35;
          background: #fff3e0;
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.2);
        }

        .recipe-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .recipe-swatch {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          border: 2px solid #ddd;
          flex-shrink: 0;
        }

        .recipe-quality {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .quality-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .quality-badge.excellent {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .quality-badge.good {
          background: #fff3e0;
          color: #ef6c00;
        }

        .quality-badge.fair {
          background: #ffebee;
          color: #c62828;
        }

        .delta-e {
          font-size: 0.8rem;
          color: #666;
        }

        .recipe-formula {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #333;
        }

        .component {
          display: inline;
        }

        .comp-code {
          color: #1a365d;
          font-weight: 600;
        }

        .comp-name {
          color: #666;
          font-size: 0.85rem;
        }

        .separator {
          color: #ff6b35;
          font-weight: bold;
        }

        .selected-indicator {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #ffe0b2;
          color: #ff6b35;
          font-weight: 600;
          font-size: 0.9rem;
          text-align: center;
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
