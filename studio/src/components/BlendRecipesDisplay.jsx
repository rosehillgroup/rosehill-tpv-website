// TPV Studio - Blend Recipes Display Component
// Shows extracted colors and TPV blend recipes

export default function BlendRecipesDisplay({ recipes, onClose }) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="blend-recipes-empty">
        <p>No colors extracted from design.</p>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    );
  }

  return (
    <div className="blend-recipes-display">
      <div className="recipes-header">
        <h3>TPV Blend Recipes</h3>
        <button onClick={onClose} className="close-button-icon">×</button>
      </div>

      <div className="quality-legend">
        <span className="legend-item">
          <span className="quality-badge excellent">Excellent</span>
          <span className="legend-text">ΔE &lt; 1.0</span>
        </span>
        <span className="legend-item">
          <span className="quality-badge good">Good</span>
          <span className="legend-text">ΔE 1.0 - 2.0</span>
        </span>
        <span className="legend-item">
          <span className="quality-badge fair">Fair</span>
          <span className="legend-text">ΔE &gt; 2.0</span>
        </span>
      </div>

      <div className="recipes-list">
        {recipes.map((recipe, idx) => (
          <div key={idx} className="recipe-card">
            {/* Color Header */}
            <div className="color-header">
              <div className="color-info">
                <div
                  className="color-swatch"
                  style={{ backgroundColor: recipe.targetColor.hex }}
                  title={recipe.targetColor.hex}
                />
                <div className="color-details">
                  <span className="color-hex">{recipe.targetColor.hex}</span>
                  <span className="color-coverage">{recipe.targetColor.areaPct.toFixed(1)}% of design</span>
                </div>
              </div>
            </div>

            {/* Blend Recipes */}
            <div className="blends-container">
              {recipe.blends.map((blend, blendIdx) => (
                <div key={blendIdx} className="blend-item">
                  <div className="blend-header">
                    <div className="blend-info">
                      <span className={`quality-badge ${blend.quality.toLowerCase()}`}>
                        {blend.quality}
                      </span>
                      <span className="delta-e">ΔE {blend.deltaE.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Recipe Formula */}
                  <div className="blend-formula">
                    {blend.components.map((comp, compIdx) => (
                      <span key={compIdx} className="component">
                        {comp.parts && <strong>{comp.parts} {comp.parts === 1 ? 'part' : 'parts'}</strong>}
                        {!comp.parts && <strong>{(comp.weight * 100).toFixed(1)}%</strong>}
                        {' '}
                        <span className="component-code">{comp.code}</span>
                        {' '}
                        <span className="component-name">({comp.name})</span>
                        {compIdx < blend.components.length - 1 && <span className="plus"> + </span>}
                      </span>
                    ))}
                  </div>

                  {/* Result Preview */}
                  <div className="result-preview">
                    <div
                      className="result-swatch"
                      style={{ backgroundColor: `rgb(${blend.resultRgb.R}, ${blend.resultRgb.G}, ${blend.resultRgb.B})` }}
                      title={`Result: RGB(${Math.round(blend.resultRgb.R)}, ${Math.round(blend.resultRgb.G)}, ${Math.round(blend.resultRgb.B)})`}
                    />
                    <span className="result-label">Result</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .blend-recipes-display {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .blend-recipes-empty {
          text-align: center;
          padding: 2rem;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .recipes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #1a365d;
        }

        .recipes-header h3 {
          margin: 0;
          color: #1a365d;
          font-size: 1.5rem;
        }

        .close-button-icon {
          background: none;
          border: none;
          font-size: 2rem;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          line-height: 1;
        }

        .close-button-icon:hover {
          color: #333;
        }

        .quality-legend {
          display: flex;
          gap: 1.5rem;
          padding: 0.75rem;
          background: #f0f7ff;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-text {
          font-size: 0.85rem;
          color: #666;
        }

        .recipes-list {
          display: grid;
          gap: 1.5rem;
        }

        .recipe-card {
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
        }

        .color-header {
          background: #f9f9f9;
          padding: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .color-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .color-swatch {
          width: 48px;
          height: 48px;
          border-radius: 4px;
          border: 2px solid #ddd;
          flex-shrink: 0;
        }

        .color-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .color-hex {
          font-weight: 600;
          font-size: 1.1rem;
          color: #333;
          font-family: 'Courier New', monospace;
        }

        .color-coverage {
          font-size: 0.85rem;
          color: #666;
        }

        .blends-container {
          padding: 1rem;
          display: grid;
          gap: 1rem;
        }

        .blend-item {
          padding: 0.75rem;
          background: #fafafa;
          border-radius: 4px;
          border: 1px solid #e8e8e8;
        }

        .blend-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .blend-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
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
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }

        .blend-formula {
          margin-bottom: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 4px;
          line-height: 1.8;
        }

        .component {
          display: inline-block;
        }

        .component-code {
          color: #1a365d;
          font-weight: 600;
        }

        .component-name {
          color: #666;
          font-size: 0.9rem;
        }

        .plus {
          color: #ff6b35;
          font-weight: bold;
        }

        .result-preview {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .result-swatch {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: 2px solid #ddd;
        }

        .result-label {
          font-size: 0.85rem;
          color: #666;
        }

        .close-button {
          padding: 0.75rem 1.5rem;
          background: #e0e0e0;
          color: #333;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
        }

        .close-button:hover {
          background: #d0d0d0;
        }

        @media (max-width: 768px) {
          .blend-recipes-display {
            padding: 1rem;
          }

          .quality-legend {
            flex-direction: column;
            gap: 0.5rem;
          }

          .blend-formula {
            font-size: 0.9rem;
          }

          .color-header {
            padding: 0.75rem;
          }

          .blends-container {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
