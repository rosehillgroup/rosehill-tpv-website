// TPV Studio - Blend Recipes Display Component
// Shows TPV blend recipes in simplified format

export default function BlendRecipesDisplay({ recipes, onClose }) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="blend-recipes-empty">
        <p>No colours extracted from design.</p>
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

      {/* Recipe Cards */}
      <div className="recipes-grid">
        {recipes.map((recipe, idx) => {
          const chosen = recipe.chosenRecipe;

          return (
            <div key={idx} className="recipe-card">
              {/* Color Swatch and Metadata */}
              <div className="card-top">
                <div className="swatch-section">
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: recipe.blendColor.hex }}
                    title={`TPV blend: ${recipe.blendColor.hex}`}
                  />
                </div>

                <div className="card-meta">
                  <div className="meta-row">
                    <span className="meta-label">Hex:</span>
                    <span className="hex-value">{recipe.blendColor.hex}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Coverage:</span>
                    <span className="coverage-value">{recipe.targetColor.areaPct.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Blend Formula */}
              <div className="card-formula">
                <div className="formula-label">
                  {chosen.components.length === 1 ? 'Pure TPV Colour' : 'TPV Blend Formula'}
                </div>
                <div className="formula-content">
                  {chosen.components.length === 1 ? (
                    // Single-color recipe
                    <span className="formula-component solid">
                      <strong className="parts">100%</strong>
                      <span className="comp-code">{chosen.components[0].code}</span>
                      <span className="comp-name">({chosen.components[0].name})</span>
                    </span>
                  ) : (
                    // Multi-component blend
                    chosen.components.map((comp, compIdx) => (
                      <span key={compIdx} className="formula-component">
                        <strong className="parts">{comp.parts || (comp.weight * 100).toFixed(0) + '%'}</strong>
                        <span className="comp-code">{comp.code}</span>
                        <span className="comp-name">({comp.name})</span>
                        {compIdx < chosen.components.length - 1 && <span className="separator">+</span>}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .blend-recipes-display {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 2rem;
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
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #1a365d;
        }

        .recipes-header h3 {
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
          color: #1e4a7a;
          font-size: 1.5rem;
          font-weight: 600;
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

        /* Card Grid Layout */
        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .recipe-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .recipe-card:hover {
          border-color: #ff6b35;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.15);
        }

        /* Card Top Section */
        .card-top {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f9f9f9;
          border-bottom: 2px solid #e8e8e8;
          align-items: center;
        }

        .swatch-section {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .color-swatch {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          border: 3px solid #ff6b35;
          flex-shrink: 0;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .card-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          justify-content: center;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .meta-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #666;
          min-width: 80px;
        }

        .hex-value {
          font-family: 'Courier New', monospace;
          font-size: 1.1rem;
          color: #333;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .coverage-value {
          font-size: 1.1rem;
          color: #1a365d;
          font-weight: 700;
        }

        /* Card Formula Section */
        .card-formula {
          padding: 1.5rem;
          background: white;
        }

        .formula-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a365d;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }

        .formula-content {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
          line-height: 1.8;
        }

        .formula-component {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .parts {
          color: #333;
          font-size: 1rem;
        }

        .comp-code {
          color: #1a365d;
          font-weight: 700;
          font-size: 1.05rem;
        }

        .comp-name {
          color: #666;
          font-size: 0.9rem;
        }

        .separator {
          color: #ff6b35;
          font-weight: bold;
          font-size: 1rem;
          margin: 0 0.35rem;
        }

        .formula-component.solid {
          background: #fff5f0;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          border: 1px solid #ff6b35;
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

          .recipes-grid {
            grid-template-columns: 1fr;
          }

          .card-top {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .color-swatch {
            width: 60px;
            height: 60px;
          }

          .card-meta {
            width: 100%;
          }

          .meta-label {
            min-width: 70px;
          }

          .card-formula {
            padding: 1rem;
          }

          .formula-label {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
