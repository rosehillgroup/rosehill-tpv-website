// TPV Studio - Colour Legend Component
// Displays clickable colour swatches for the TPV blend SVG

import tpvColours from '../../api/_utils/data/rosehill_tpv_21_colours.json';
import HelpIcon from './HelpIcon.jsx';

export default function ColorLegend({
  recipes,
  mode = 'blend', // 'blend' or 'solid' - affects label display
  onColorClick, // (colorData) => void - callback when user clicks a color
  selectedColor, // Currently selected/editing color
  editedColors, // Map of edited colors (originalHex -> {newHex})
  onResetAll // () => void - callback to reset all color edits
}) {
  if (!recipes || recipes.length === 0) {
    return null;
  }

  // Check if a color has been edited from original
  const isEdited = (recipe) => {
    if (!editedColors || editedColors.size === 0) return false;
    return editedColors.has(recipe.originalColor.hex.toLowerCase());
  };

  // Check if any colors have been edited
  const hasAnyEdits = editedColors && editedColors.size > 0;

  // Find TPV color by hex value
  const findTpvColorByHex = (hex) => {
    const normalizedHex = hex.toLowerCase();
    return tpvColours.find(color => color.hex.toLowerCase() === normalizedHex);
  };

  // Get display label for a color based on mode
  const getColorLabel = (recipe) => {
    if (mode === 'solid') {
      // In solid mode, show TPV color code and name if available
      const tpvColor = findTpvColorByHex(recipe.blendColor.hex);
      if (tpvColor) {
        return `${tpvColor.code} - ${tpvColor.name}`;
      }
    }
    // Default to hex value
    return recipe.blendColor.hex;
  };

  // Check if a recipe is currently selected
  const isSelected = (recipe) => {
    if (!selectedColor) return false;
    const selectedHex = selectedColor.blendHex || selectedColor.hex;
    return recipe.blendColor.hex === selectedHex || recipe.targetColor.hex === selectedHex;
  };

  return (
    <div className="color-legend">
      <div className="legend-header">
        <div className="legend-header-left">
          <span className="legend-title">Colours</span>
          <HelpIcon
            content="Click any color to edit all instances of that color across the design. Changes apply to every region using that color."
            position="right"
          />
          {onColorClick && <span className="edit-hint">(click to edit)</span>}
        </div>
        {hasAnyEdits && onResetAll && (
          <button onClick={onResetAll} className="reset-all-btn" title="Reset all colours to original">
            Reset All
          </button>
        )}
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
                  originalHex: recipe.originalColor.hex, // Use cluster centroid for mapping key
                  blendHex: recipe.blendColor.hex,
                  areaPct: recipe.targetColor.areaPct,
                  recipe: recipe.chosenRecipe,
                  targetColor: recipe.targetColor
                }, 'palette');
              }
            }}
            title={onColorClick ? 'Click to edit this colour' : ''}
          >
            <div className="color-swatch-wrapper">
              <div
                className="color-swatch"
                style={{ backgroundColor: recipe.blendColor.hex }}
              />
              {isEdited(recipe) && (
                <span className="edit-indicator" title="Colour has been modified">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </span>
              )}
            </div>
            <div className="color-info">
              <span className={mode === 'solid' ? 'tpv-label' : 'hex-value'}>{getColorLabel(recipe)}</span>
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
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .legend-header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
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

        .reset-all-btn {
          padding: 0.25rem 0.5rem;
          font-size: 0.7rem;
          font-weight: 600;
          color: #ff6b35;
          background: #fff5f0;
          border: 1px solid #ff6b35;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-all-btn:hover {
          background: #ff6b35;
          color: white;
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

        .color-swatch-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .color-swatch {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          border: 2px solid #ddd;
        }

        .edit-indicator {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 16px;
          height: 16px;
          background: #ff6b35;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .edit-indicator svg {
          width: 10px;
          height: 10px;
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

        .tpv-label {
          font-weight: 600;
          color: #1a365d;
          font-size: 0.9rem;
        }

        .coverage {
          color: #666;
          font-size: 0.8rem;
        }

        /* Mobile - compact horizontal grid of swatches */
        @media (max-width: 768px) {
          .color-legend {
            padding: 0.75rem;
          }

          .legend-header {
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
          }

          .legend-title {
            font-size: 0.85rem;
          }

          .edit-hint {
            font-size: 0.7rem;
          }

          .reset-all-btn {
            font-size: 0.65rem;
            padding: 0.2rem 0.4rem;
            min-height: 28px;
          }

          /* Horizontal scrolling grid of swatches */
          .legend-colors {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: flex-start;
          }

          .color-item {
            flex-direction: column;
            padding: 0.25rem;
            border-radius: 6px;
            width: auto;
            min-width: 44px;
          }

          /* Hide text info on mobile - just show swatches */
          .color-info {
            display: none;
          }

          .color-swatch {
            width: 44px;
            height: 44px;
            border-radius: 6px;
          }

          .color-item.selected {
            transform: none;
            box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.4);
          }

          .color-item.clickable:hover {
            transform: none;
          }

          .edit-indicator {
            top: -2px;
            right: -2px;
            width: 14px;
            height: 14px;
          }

          .edit-indicator svg {
            width: 8px;
            height: 8px;
          }
        }

        @media (max-width: 480px) {
          .color-legend {
            padding: 0.5rem;
          }

          .legend-colors {
            gap: 0.35rem;
          }

          .color-swatch {
            width: 40px;
            height: 40px;
          }

          .color-item {
            min-width: 40px;
          }
        }
      `}</style>
    </div>
  );
}
