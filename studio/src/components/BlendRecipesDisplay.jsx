// TPV Studio - Blend Recipes Display Component
// Shows extracted colours and TPV blend recipes in compact format

import { useState } from 'react';

export default function BlendRecipesDisplay({ recipes, onClose }) {
  const [expandedColors, setExpandedColors] = useState(new Set());

  if (!recipes || recipes.length === 0) {
    return (
      <div className="blend-recipes-empty">
        <p>No colours extracted from design.</p>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    );
  }

  const toggleColorExpanded = (idx) => {
    const newExpanded = new Set(expandedColors);
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx);
    } else {
      newExpanded.add(idx);
    }
    setExpandedColors(newExpanded);
  };

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

      {/* Recipe Cards */}
      <div className="recipes-grid">
        {recipes.map((recipe, idx) => {
          const chosen = recipe.chosenRecipe;
          const isExpanded = expandedColors.has(idx);
          const hasAlternatives = recipe.alternativeRecipes && recipe.alternativeRecipes.length > 0;

          return (
            <div key={idx} className="recipe-card">
              {/* Top Section: Swatches and Metadata */}
              <div className="card-top">
                <div className="swatch-pair-large">
                  <div className="swatch-group">
                    <div
                      className="color-swatch-large original"
                      style={{ backgroundColor: recipe.targetColor.hex }}
                      title={`Image colour: ${recipe.targetColor.hex}`}
                    />
                    <span className="swatch-label">Image</span>
                  </div>
                  <span className="swatch-arrow-large">→</span>
                  <div className="swatch-group">
                    <div
                      className="color-swatch-large blend"
                      style={{ backgroundColor: recipe.blendColor.hex }}
                      title={`TPV blend: ${recipe.blendColor.hex}`}
                    />
                    <span className="swatch-label">TPV</span>
                  </div>
                </div>

                <div className="card-meta">
                  <div className="meta-row">
                    <span className="meta-label">Hex:</span>
                    <span className="hex-value">{recipe.targetColor.hex}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Coverage:</span>
                    <span className="coverage-value">{recipe.targetColor.areaPct.toFixed(1)}%</span>
                  </div>
                  <div className="meta-row quality-row">
                    <span className={`quality-badge ${chosen.quality.toLowerCase()}`}>
                      {chosen.quality}
                    </span>
                    <span className="delta-e">ΔE {chosen.deltaE.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Middle Section: Blend Formula */}
              <div className="card-formula">
                <div className="formula-label">TPV Blend Formula</div>
                <div className="formula-content">
                  {chosen.components.map((comp, compIdx) => (
                    <span key={compIdx} className="formula-component">
                      <strong className="parts">{comp.parts || (comp.weight * 100).toFixed(0) + '%'}</strong>
                      <span className="comp-code">{comp.code}</span>
                      <span className="comp-name">({comp.name})</span>
                      {compIdx < chosen.components.length - 1 && <span className="separator">+</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Section: Expand Button for Alternatives */}
              {hasAlternatives && (
                <div className="card-footer">
                  <button
                    className="alternatives-toggle"
                    onClick={() => toggleColorExpanded(idx)}
                  >
                    {isExpanded ? '− Hide Alternatives' : '+ Show Alternatives'}
                  </button>
                </div>
              )}

              {/* Alternative Recipes (Expandable) */}
              {isExpanded && hasAlternatives && (
                <div className="alternatives-section">
                  <div className="alternatives-header">Alternative Formulas</div>
                  {recipe.alternativeRecipes.map((alt, altIdx) => (
                    <div key={altIdx} className="alternative-card">
                      <div className="alt-header">
                        <span className="alt-label">Option {altIdx + 2}</span>
                        <div className="alt-quality-inline">
                          <span className={`quality-badge small ${alt.quality.toLowerCase()}`}>
                            {alt.quality}
                          </span>
                          <span className="delta-e-small">ΔE {alt.deltaE.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="alt-swatches">
                        <div className="swatch-pair-small">
                          <div
                            className="color-swatch-small original"
                            style={{ backgroundColor: recipe.targetColor.hex }}
                            title={`Image colour: ${recipe.targetColor.hex}`}
                          />
                          <span className="swatch-arrow-small">→</span>
                          <div
                            className="color-swatch-small blend"
                            style={{ backgroundColor: alt.blendColor.hex }}
                            title={`TPV blend: ${alt.blendColor.hex}`}
                          />
                        </div>
                      </div>
                      <div className="alt-formula">
                        {alt.components.map((comp, compIdx) => (
                          <span key={compIdx} className="formula-component">
                            <strong className="parts">{comp.parts || (comp.weight * 100).toFixed(0) + '%'}</strong>
                            <span className="comp-code">{comp.code}</span>
                            <span className="comp-name">({comp.name})</span>
                            {compIdx < alt.components.length - 1 && <span className="separator">+</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
          gap: 2rem;
          padding: 1rem;
          background: #f0f7ff;
          border-radius: 6px;
          margin-bottom: 2rem;
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

        .quality-badge {
          padding: 0.35rem 0.85rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .quality-badge.small {
          padding: 0.2rem 0.5rem;
          font-size: 0.75rem;
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

        /* Card Grid Layout */
        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
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
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
        }

        /* Card Top Section */
        .card-top {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f9f9f9;
          border-bottom: 2px solid #e8e8e8;
        }

        .swatch-pair-large {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .swatch-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .color-swatch-large {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          border: 3px solid #ddd;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .color-swatch-large.original {
          border-color: #999;
        }

        .color-swatch-large.blend {
          border-color: #ff6b35;
        }

        .swatch-label {
          font-size: 0.75rem;
          color: #666;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .swatch-arrow-large {
          font-size: 2rem;
          color: #ff6b35;
          font-weight: bold;
          margin: 0 4px;
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

        .quality-row {
          gap: 1rem;
        }

        .delta-e {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
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

        /* Card Footer (Alternatives Button) */
        .card-footer {
          padding: 0 1.5rem 1.5rem 1.5rem;
        }

        .alternatives-toggle {
          width: 100%;
          padding: 0.75rem;
          background: white;
          border: 2px solid #ff6b35;
          border-radius: 6px;
          color: #ff6b35;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .alternatives-toggle:hover {
          background: #ff6b35;
          color: white;
        }

        /* Alternative Recipes Section */
        .alternatives-section {
          padding: 1.5rem;
          background: #f0f7ff;
          border-top: 2px solid #e0e0e0;
        }

        .alternatives-header {
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1rem;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .alternative-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 0.75rem;
        }

        .alternative-card:last-child {
          margin-bottom: 0;
        }

        .alt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e8e8e8;
        }

        .alt-label {
          font-size: 0.9rem;
          color: #1a365d;
          font-weight: 700;
        }

        .alt-quality-inline {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .delta-e-small {
          font-size: 0.85rem;
          color: #666;
          font-weight: 500;
        }

        .alt-swatches {
          margin-bottom: 0.75rem;
        }

        .swatch-pair-small {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .color-swatch-small {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: 2px solid #ddd;
          flex-shrink: 0;
        }

        .color-swatch-small.original {
          border-color: #999;
        }

        .color-swatch-small.blend {
          border-color: #ff6b35;
        }

        .swatch-arrow-small {
          font-size: 1.2rem;
          color: #ff6b35;
          font-weight: bold;
          margin: 0 4px;
        }

        .alt-formula {
          font-size: 0.9rem;
          line-height: 1.6;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
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

          .swatch-pair-large {
            justify-content: center;
          }

          .color-swatch-large {
            width: 50px;
            height: 50px;
          }

          .swatch-arrow-large {
            font-size: 1.5rem;
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

          .card-footer {
            padding: 0 1rem 1rem 1rem;
          }

          .quality-legend {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
