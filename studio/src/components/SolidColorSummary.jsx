// TPV Studio - Solid Color Summary Component
// Shows TPV colors used in solid mode (no blending)

export default function SolidColorSummary({ recipes, onClose }) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="solid-summary-empty">
        <p>No colours in design.</p>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    );
  }

  // Calculate total coverage
  const totalCoverage = recipes.reduce((sum, recipe) => sum + recipe.targetColor.areaPct, 0);

  return (
    <div className="solid-color-summary">
      <div className="summary-header">
        <h3>TPV Colours Used</h3>
        <button onClick={onClose} className="close-button-icon">×</button>
      </div>

      <div className="summary-info">
        <p className="summary-description">
          This design uses <strong>{recipes.length}</strong> pure TPV colour{recipes.length !== 1 ? 's' : ''} (no blending required)
        </p>
      </div>

      {/* Color List */}
      <div className="colors-list">
        {recipes.map((recipe, idx) => {
          const component = recipe.chosenRecipe.components[0];
          const coverage = recipe.targetColor.areaPct;

          return (
            <div key={idx} className="color-item">
              {/* Color Swatch */}
              <div
                className="color-swatch"
                style={{ backgroundColor: recipe.blendColor.hex }}
                title={`${component.code} - ${component.name}`}
              />

              {/* Color Details */}
              <div className="color-details">
                <div className="color-primary">
                  <span className="color-code">{component.code}</span>
                  <span className="color-name">{component.name}</span>
                </div>
                <div className="color-secondary">
                  <span className="hex-value">{recipe.blendColor.hex}</span>
                  <span className="coverage-badge">{coverage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="summary-footer">
        <div className="footer-stat">
          <span className="stat-label">Total Coverage:</span>
          <span className="stat-value">{totalCoverage.toFixed(1)}%</span>
        </div>
        <div className="footer-stat">
          <span className="stat-label">TPV Colours:</span>
          <span className="stat-value">{recipes.length}</span>
        </div>
      </div>

      <style jsx>{`
        .solid-color-summary {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 2rem;
          max-width: 800px;
          margin: 2rem auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .solid-summary-empty {
          background: #fff;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #1a365d;
        }

        .summary-header h3 {
          margin: 0;
          color: #1a365d;
          font-size: 1.8rem;
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
          transition: color 0.2s;
        }

        .close-button-icon:hover {
          color: #333;
        }

        .summary-info {
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
        }

        .summary-description {
          margin: 0;
          color: #333;
          font-size: 1rem;
          line-height: 1.5;
        }

        /* Colors List */
        .colors-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .color-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          transition: all 0.2s;
        }

        .color-item:hover {
          border-color: #ff6b35;
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.15);
        }

        .color-swatch {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          border: 2px solid #ddd;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .color-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .color-primary {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .color-code {
          font-family: 'Courier New', monospace;
          font-weight: 700;
          font-size: 1.2rem;
          color: #1a365d;
        }

        .color-name {
          font-size: 1.1rem;
          color: #333;
          font-weight: 500;
        }

        .color-secondary {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .hex-value {
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          color: #666;
        }

        .coverage-badge {
          background: #ff6b35;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        /* Summary Footer */
        .summary-footer {
          display: flex;
          justify-content: space-around;
          padding: 1.5rem;
          background: #f9f9f9;
          border-radius: 6px;
          border: 2px solid #ff6b35;
        }

        .footer-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a365d;
        }

        .close-button {
          padding: 0.75rem 1.5rem;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .close-button:hover {
          background: #e55a25;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .solid-color-summary {
            padding: 1rem;
          }

          .summary-header h3 {
            font-size: 1.4rem;
          }

          .color-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .color-swatch {
            width: 100%;
            height: 50px;
          }

          .summary-footer {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
