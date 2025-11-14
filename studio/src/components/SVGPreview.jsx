// TPV Studio - SVG Preview Component
// Shows TPV blend SVG with color legend

import ColorLegend from './ColorLegend';

export default function SVGPreview({
  blendSvgUrl,
  recipes,
  onColorClick // (colorData) => void - callback when user clicks a color
}) {
  if (!blendSvgUrl) {
    return null;
  }

  return (
    <div className="svg-preview">
      <div className="preview-header">
        <h3>TPV Blend Design</h3>
      </div>

      {/* SVG Display with Color Legend */}
      <div className="svg-display-container">
        <div className="svg-panel">
          <div className="svg-wrapper">
            <img src={blendSvgUrl} alt="TPV blend design" className="svg-image" />
          </div>
        </div>

        {recipes && recipes.length > 0 && (
          <div className="legend-sidebar">
            <ColorLegend recipes={recipes} onColorClick={onColorClick} />
          </div>
        )}
      </div>

      <style jsx>{`
        .svg-preview {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .preview-header {
          margin-bottom: 1.5rem;
        }

        .preview-header h3 {
          margin: 0;
          color: #1a365d;
          font-size: 1.5rem;
        }

        /* SVG Display */
        .svg-display-container {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .svg-panel {
          flex: 1;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
          background: #fafafa;
        }

        .svg-wrapper {
          padding: 2rem;
          background: white;
          min-height: 400px;
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

        .legend-sidebar {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .svg-preview {
            padding: 1rem;
          }

          .svg-display-container {
            flex-direction: column;
          }

          .svg-wrapper {
            padding: 1rem;
            min-height: 250px;
          }

          .legend-sidebar {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
