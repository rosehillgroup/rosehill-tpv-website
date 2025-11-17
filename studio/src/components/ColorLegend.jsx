// TPV Studio - Colour Legend Component
// Displays clickable colour swatches for the TPV blend SVG

export default function ColorLegend({
  recipes,
  onColorClick, // (colorData) => void - callback when user clicks a color
  selectedColor // Currently selected/editing color
}) {
  if (!recipes || recipes.length === 0) {
    return null;
  }

  // Check if a recipe is currently selected
  const isSelected = (recipe) => {
    if (!selectedColor) return false;
    const selectedHex = selectedColor.blendHex || selectedColor.hex;
    return recipe.blendColor.hex === selectedHex || recipe.targetColor.hex === selectedHex;
  };

  return (
    <div className="color-legend">
      <div className="legend-header">
        <span className="legend-title">Colours</span>
        {onColorClick && <span className="edit-hint">(click to edit)</span>}
      </div>
      <div className="legend-colors">
        {recipes.map((recipe, idx) => (
          <div
            key={idx}
            className={`color-item ${onColorClick ? 'clickable' : ''} ${isSelected(recipe) ? 'selected' : ''}`}
            onClick={() => {
              if (onColorClick) {
                onColorClick({
                  hex: recipe.targetColor.hex,
                  originalHex: recipe.targetColor.hex,
                  blendHex: recipe.blendColor.hex,
                  areaPct: recipe.targetColor.areaPct,
                  recipe: recipe.chosenRecipe,
                  targetColor: recipe.targetColor
                });
              }
            }}
            title={onColorClick ? 'Click to edit this colour' : ''}
          >
            <div
              className="color-swatch"
              style={{ backgroundColor: recipe.blendColor.hex }}
            />
            <div className="color-info">
              <span className="hex-value">{recipe.blendColor.hex}</span>
              <span className="coverage">{recipe.targetColor.areaPct.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .color-legend {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
        }

        .legend-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .legend-title {
          font-weight: 600;
          color: #1a365d;
          font-size: 0.95rem;
        }

        .edit-hint {
          font-size: 0.75rem;
          color: #ff6b35;
          font-weight: normal;
        }

        .legend-colors {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.75rem;
        }

        .color-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 4px;
          background: white;
          border: 1px solid #e8e8e8;
          transition: all 0.2s;
        }

        .color-item.clickable {
          cursor: pointer;
        }

        .color-item.clickable:hover {
          border-color: #ff6b35;
          background: #fff9f7;
          box-shadow: 0 2px 4px rgba(255, 107, 53, 0.15);
          transform: translateY(-2px);
        }

        .color-item.selected {
          border-color: #ff6b35;
          border-width: 2px;
          background: #fff9f7;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
          transform: translateY(-2px);
        }

        .color-swatch {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          border: 2px solid #ddd;
          flex-shrink: 0;
        }

        .color-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.85rem;
        }

        .hex-value {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: #333;
        }

        .coverage {
          color: #666;
          font-size: 0.8rem;
        }

        @media (max-width: 600px) {
          .legend-colors {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          }

          .color-item {
            flex-direction: column;
            text-align: center;
            padding: 0.75rem;
          }

          .color-info {
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
