// TPV Studio - SVG Preview Component
// Shows side-by-side comparison of original and blend-colored SVG

import { useState } from 'react';

export default function SVGPreview({
  originalSvgUrl,
  blendSvgUrl,
  colorMapping,
  recipes
}) {
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' | 'original' | 'blend'

  if (!originalSvgUrl) {
    return null;
  }

  // Build color mapping array for legend
  const colorMappingArray = recipes ? recipes.map(recipe => ({
    original: recipe.targetColor.hex,
    blend: recipe.blendColor.hex,
    coverage: recipe.targetColor.areaPct,
    quality: recipe.chosenRecipe.quality,
    deltaE: recipe.chosenRecipe.deltaE
  })) : [];

  return (
    <div className="svg-preview">
      <div className="preview-header">
        <h3>Design Preview</h3>

        <div className="view-mode-buttons">
          <button
            className={`mode-button ${viewMode === 'side-by-side' ? 'active' : ''}`}
            onClick={() => setViewMode('side-by-side')}
          >
            Side by Side
          </button>
          <button
            className={`mode-button ${viewMode === 'original' ? 'active' : ''}`}
            onClick={() => setViewMode('original')}
          >
            Original
          </button>
          <button
            className={`mode-button ${viewMode === 'blend' ? 'active' : ''}`}
            onClick={() => setViewMode('blend')}
            disabled={!blendSvgUrl}
          >
            TPV Blend
          </button>
        </div>
      </div>

      {/* SVG Display */}
      <div className={`svg-display-container ${viewMode}`}>
        {viewMode === 'side-by-side' && (
          <>
            <div className="svg-panel">
              <div className="panel-label">Original Design</div>
              <div className="svg-wrapper">
                <img src={originalSvgUrl} alt="Original design" className="svg-image" />
              </div>
            </div>

            {blendSvgUrl && (
              <div className="svg-panel">
                <div className="panel-label blend-label">TPV Blend Colors</div>
                <div className="svg-wrapper">
                  <img src={blendSvgUrl} alt="TPV blend design" className="svg-image" />
                </div>
              </div>
            )}

            {!blendSvgUrl && (
              <div className="svg-panel placeholder">
                <div className="panel-label">TPV Blend Colors</div>
                <div className="svg-wrapper">
                  <div className="placeholder-content">
                    <p>Blend colors will appear here once recipes are generated</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {viewMode === 'original' && (
          <div className="svg-panel single">
            <div className="panel-label">Original Design</div>
            <div className="svg-wrapper">
              <img src={originalSvgUrl} alt="Original design" className="svg-image" />
            </div>
          </div>
        )}

        {viewMode === 'blend' && blendSvgUrl && (
          <div className="svg-panel single">
            <div className="panel-label blend-label">TPV Blend Colors</div>
            <div className="svg-wrapper">
              <img src={blendSvgUrl} alt="TPV blend design" className="svg-image" />
            </div>
          </div>
        )}
      </div>

      {/* Color Mapping Legend */}
      {colorMappingArray.length > 0 && (
        <div className="color-mapping-legend">
          <h4>Color Mapping</h4>
          <div className="mapping-grid">
            {colorMappingArray.map((mapping, idx) => (
              <div key={idx} className="mapping-item">
                <div className="mapping-swatches">
                  <div
                    className="swatch original"
                    style={{ backgroundColor: mapping.original }}
                    title={`Original: ${mapping.original}`}
                  />
                  <span className="arrow">→</span>
                  <div
                    className="swatch blend"
                    style={{ backgroundColor: mapping.blend }}
                    title={`Blend: ${mapping.blend}`}
                  />
                </div>
                <div className="mapping-info">
                  <span className="coverage">{mapping.coverage.toFixed(1)}% coverage</span>
                  <span className={`quality-indicator ${mapping.quality.toLowerCase()}`}>
                    {mapping.quality} (ΔE {mapping.deltaE.toFixed(2)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .svg-preview {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .preview-header h3 {
          margin: 0;
          color: #1a365d;
          font-size: 1.5rem;
        }

        .view-mode-buttons {
          display: flex;
          gap: 0.5rem;
          background: #f0f0f0;
          padding: 0.25rem;
          border-radius: 6px;
        }

        .mode-button {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          color: #666;
          transition: all 0.2s;
        }

        .mode-button:hover:not(:disabled) {
          background: #e0e0e0;
          color: #333;
        }

        .mode-button.active {
          background: #1a365d;
          color: white;
        }

        .mode-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Color Mapping Legend */
        .color-mapping-legend {
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 1rem;
          margin-top: 1.5rem;
        }

        .color-mapping-legend h4 {
          margin: 0 0 0.75rem 0;
          color: #333;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .mapping-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0.75rem;
        }

        .mapping-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          padding: 0.5rem;
          border-radius: 4px;
          border: 1px solid #e8e8e8;
        }

        .mapping-swatches {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .mapping-swatches .swatch {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: 2px solid #ddd;
          flex-shrink: 0;
        }

        .mapping-swatches .swatch.original {
          border-color: #999;
        }

        .mapping-swatches .swatch.blend {
          border-color: #ff6b35;
        }

        .mapping-swatches .arrow {
          color: #666;
          font-weight: bold;
        }

        .mapping-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.8rem;
        }

        .mapping-info .coverage {
          color: #666;
        }

        .quality-indicator {
          font-weight: 600;
          font-size: 0.75rem;
        }

        .quality-indicator.excellent {
          color: #2e7d32;
        }

        .quality-indicator.good {
          color: #ef6c00;
        }

        .quality-indicator.fair {
          color: #c62828;
        }

        /* SVG Display */
        .svg-display-container {
          display: grid;
          gap: 1.5rem;
        }

        .svg-display-container.side-by-side {
          grid-template-columns: 1fr 1fr;
        }

        .svg-display-container.original,
        .svg-display-container.blend {
          grid-template-columns: 1fr;
        }

        .svg-panel {
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
          background: #fafafa;
        }

        .svg-panel.single {
          max-width: 800px;
          margin: 0 auto;
        }

        .svg-panel.placeholder {
          background: #f0f0f0;
        }

        .panel-label {
          background: #1a365d;
          color: white;
          padding: 0.75rem 1rem;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .panel-label.blend-label {
          background: #ff6b35;
        }

        .svg-wrapper {
          padding: 2rem;
          background: white;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .svg-image {
          max-width: 100%;
          height: auto;
          display: block;
          border-radius: 4px;
        }

        .placeholder-content {
          text-align: center;
          color: #999;
          padding: 2rem;
        }

        .placeholder-content p {
          margin: 0;
        }

        @media (max-width: 768px) {
          .svg-preview {
            padding: 1rem;
          }

          .preview-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .view-mode-buttons {
            width: 100%;
          }

          .mode-button {
            flex: 1;
          }

          .svg-display-container.side-by-side {
            grid-template-columns: 1fr;
          }

          .svg-wrapper {
            padding: 1rem;
            min-height: 200px;
          }

          .mapping-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
