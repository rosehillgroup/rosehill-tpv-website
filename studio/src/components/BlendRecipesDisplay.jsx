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

      {/* Compact Recipe Table */}
      <div className="recipes-table">
        <div className="table-header">
          <div className="col-swatch">Colour</div>
          <div className="col-hex">Hex</div>
          <div className="col-coverage">Coverage</div>
          <div className="col-blend">Blend Formula</div>
          <div className="col-quality">Match</div>
        </div>

        {recipes.map((recipe, idx) => {
          const chosen = recipe.chosenRecipe;
          const isExpanded = expandedColors.has(idx);
          const hasAlternatives = recipe.alternativeRecipes && recipe.alternativeRecipes.length > 0;

          return (
            <div key={idx} className="table-row">
              {/* Main Recipe Row */}
              <div className="recipe-row">
                {/* Color Swatches */}
                <div className="col-swatch">
                  <div className="swatch-pair">
                    <div className="swatch-group">
                      <div
                        className="color-swatch original"
                        style={{ backgroundColor: recipe.targetColor.hex }}
                        title={`Image colour: ${recipe.targetColor.hex}`}
                      />
                      <span className="swatch-label">Image</span>
                    </div>
                    <span className="swatch-arrow">→</span>
                    <div className="swatch-group">
                      <div
                        className="color-swatch blend"
                        style={{ backgroundColor: recipe.blendColor.hex }}
                        title={`TPV blend: ${recipe.blendColor.hex}`}
                      />
                      <span className="swatch-label">TPV</span>
                    </div>
                  </div>
                </div>

                {/* Hex */}
                <div className="col-hex">
                  <span className="hex-value">{recipe.targetColor.hex}</span>
                </div>

                {/* Coverage */}
                <div className="col-coverage">
                  <span className="coverage-value">{recipe.targetColor.areaPct.toFixed(1)}%</span>
                </div>

                {/* Blend Formula */}
                <div className="col-blend">
                  <div className="blend-formula-compact">
                    {chosen.components.map((comp, compIdx) => (
                      <span key={compIdx} className="formula-component">
                        <strong className="parts">{comp.parts || (comp.weight * 100).toFixed(0) + '%'}</strong>
                        <span className="comp-code">{comp.code}</span>
                        {compIdx < chosen.components.length - 1 && <span className="separator">+</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quality Badge */}
                <div className="col-quality">
                  <span className={`quality-badge ${chosen.quality.toLowerCase()}`}>
                    {chosen.quality}
                  </span>
                  <span className="delta-e-small">ΔE {chosen.deltaE.toFixed(2)}</span>
                </div>

                {/* Expand Button */}
                {hasAlternatives && (
                  <button
                    className="expand-button"
                    onClick={() => toggleColorExpanded(idx)}
                    title={isExpanded ? 'Hide alternatives' : 'Show alternatives'}
                  >
                    {isExpanded ? '−' : '+'}
                  </button>
                )}
              </div>

              {/* Alternative Recipes (Expandable) */}
              {isExpanded && hasAlternatives && (
                <div className="alternatives-section">
                  <div className="alternatives-header">Alternative Recipes:</div>
                  {recipe.alternativeRecipes.map((alt, altIdx) => (
                    <div key={altIdx} className="alternative-row">
                      <div className="alt-label">Option {altIdx + 2}:</div>
                      <div className="alt-formula">
                        {alt.components.map((comp, compIdx) => (
                          <span key={compIdx} className="formula-component">
                            <strong className="parts">{comp.parts || (comp.weight * 100).toFixed(0) + '%'}</strong>
                            <span className="comp-code">{comp.code}</span>
                            {compIdx < alt.components.length - 1 && <span className="separator">+</span>}
                          </span>
                        ))}
                      </div>
                      <div className="alt-quality">
                        <span className={`quality-badge small ${alt.quality.toLowerCase()}`}>
                          {alt.quality}
                        </span>
                        <span className="delta-e-small">ΔE {alt.deltaE.toFixed(2)}</span>
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

        /* Compact Table Layout */
        .recipes-table {
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 120px 110px 90px 1fr 140px 50px;
          background: #1a365d;
          color: white;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 1rem 1.5rem;
          gap: 1.5rem;
        }

        .table-row {
          border-bottom: 1px solid #e0e0e0;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .recipe-row {
          display: grid;
          grid-template-columns: 120px 110px 90px 1fr 140px 50px;
          padding: 1.25rem 1.5rem;
          gap: 1.5rem;
          align-items: center;
          background: #fff;
          transition: background 0.2s;
        }

        .recipe-row:hover {
          background: #f9f9f9;
        }

        /* Swatch Pair (Image + TPV Blend) */
        .swatch-pair {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .swatch-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .color-swatch {
          width: 42px;
          height: 42px;
          border-radius: 6px;
          border: 2px solid #ddd;
          flex-shrink: 0;
        }

        .color-swatch.original {
          border-color: #999;
        }

        .color-swatch.blend {
          border-color: #ff6b35;
        }

        .swatch-label {
          font-size: 0.75rem;
          color: #666;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .swatch-arrow {
          font-size: 1.4rem;
          color: #ff6b35;
          font-weight: bold;
          margin: 0 4px;
        }

        /* Columns */
        .col-hex .hex-value {
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          color: #333;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .col-coverage .coverage-value {
          font-size: 1rem;
          color: #666;
          font-weight: 500;
        }

        .col-blend .blend-formula-compact {
          font-size: 0.95rem;
          line-height: 1.5;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .formula-component {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          white-space: nowrap;
        }

        .parts {
          color: #333;
          font-size: 0.9rem;
        }

        .comp-code {
          color: #1a365d;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .separator {
          color: #ff6b35;
          font-weight: bold;
          font-size: 0.85rem;
          margin: 0 0.25rem;
        }

        .col-quality {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          align-items: flex-start;
        }

        .delta-e-small {
          font-size: 0.85rem;
          color: #666;
          font-weight: 500;
        }

        /* Expand Button */
        .expand-button {
          width: 28px;
          height: 28px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1.2rem;
          line-height: 1;
          color: #666;
          transition: all 0.2s;
        }

        .expand-button:hover {
          background: #f0f0f0;
          border-color: #999;
          color: #333;
        }

        /* Alternative Recipes Section */
        .alternatives-section {
          padding: 1rem 1rem 1rem 2rem;
          background: #f9f9f9;
          border-top: 1px solid #e8e8e8;
        }

        .alternatives-header {
          font-weight: 600;
          color: #666;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }

        .alternative-row {
          display: grid;
          grid-template-columns: 80px 1fr 140px;
          gap: 1rem;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          background: white;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
          align-items: center;
        }

        .alt-label {
          font-size: 0.85rem;
          color: #666;
          font-weight: 500;
        }

        .alt-formula {
          font-size: 0.85rem;
          line-height: 1.5;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          align-items: center;
        }

        .alt-quality {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          align-items: flex-start;
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

        @media (max-width: 1024px) {
          .table-header,
          .recipe-row {
            grid-template-columns: 100px 100px 80px 1fr 120px 40px;
            gap: 1rem;
            font-size: 0.9rem;
            padding: 1rem 1.25rem;
          }

          .color-swatch {
            width: 38px;
            height: 38px;
          }

          .swatch-label {
            font-size: 0.7rem;
          }

          .swatch-arrow {
            font-size: 1.2rem;
          }
        }

          .color-swatch {
            width: 32px;
            height: 32px;
          }
        }

        @media (max-width: 768px) {
          .blend-recipes-display {
            padding: 1rem;
          }

          .table-header {
            display: none;
          }

          .recipe-row {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            padding: 0.75rem;
          }

          .col-swatch,
          .col-hex,
          .col-coverage,
          .col-blend,
          .col-quality {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .col-swatch::before {
            content: 'Color:';
            font-weight: 600;
            font-size: 0.85rem;
          }

          .col-hex::before {
            content: 'Hex:';
            font-weight: 600;
            font-size: 0.85rem;
          }

          .col-coverage::before {
            content: 'Coverage:';
            font-weight: 600;
            font-size: 0.85rem;
          }

          .col-blend::before {
            content: 'Formula:';
            font-weight: 600;
            font-size: 0.85rem;
            align-self: flex-start;
          }

          .col-quality::before {
            content: 'Match:';
            font-weight: 600;
            font-size: 0.85rem;
          }

          .alternative-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
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
