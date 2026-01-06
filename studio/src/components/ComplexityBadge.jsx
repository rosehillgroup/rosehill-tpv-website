/**
 * ComplexityBadge Component
 * Displays SVG complexity analysis with expandable details
 *
 * Part of Phase 1.5: Structural Diagnostics
 */

import { useState, useEffect, useMemo } from 'react';
import { analyzeSvg } from '../utils/svgDiagnostics.js';

/**
 * Complexity badge that shows SVG analysis
 *
 * @param {string} svgContent - The SVG string to analyze
 * @param {boolean} showDetails - Whether to show detailed breakdown (default: on hover)
 * @param {boolean} compact - Use compact display mode
 */
export default function ComplexityBadge({ svgContent, showDetails = false, compact = false }) {
  const [expanded, setExpanded] = useState(showDetails);
  const [analysis, setAnalysis] = useState(null);

  // Analyze SVG when content changes
  useEffect(() => {
    if (!svgContent) {
      setAnalysis(null);
      return;
    }

    // Run analysis (can be done sync since it's fast)
    const result = analyzeSvg(svgContent);
    setAnalysis(result);

    // Log to console for debugging
    if (result.valid) {
      console.log('[ComplexityBadge] SVG Analysis:', {
        paths: result.pathCount,
        segments: result.totalSegments,
        complexity: result.estimatedComplexity,
        warnings: result.warnings
      });
    }
  }, [svgContent]);

  // Don't render if no content or analysis failed
  if (!svgContent || !analysis || !analysis.valid) {
    return null;
  }

  const {
    pathCount,
    shapeCount,
    totalSegments,
    estimatedComplexity,
    complexityColor,
    complexityLabel,
    hasHiddenShapes,
    hiddenShapeCount,
    warnings
  } = analysis;

  // Compact badge only
  if (compact) {
    return (
      <span
        className="complexity-badge-compact"
        title={`${totalSegments} segments, ${pathCount} paths`}
        style={{ backgroundColor: complexityColor }}
      >
        {complexityLabel}
      </span>
    );
  }

  return (
    <div className="complexity-badge">
      <button
        className="complexity-badge-toggle"
        onClick={() => setExpanded(!expanded)}
        style={{ borderColor: complexityColor }}
      >
        <span
          className="complexity-dot"
          style={{ backgroundColor: complexityColor }}
        />
        <span className="complexity-label">{complexityLabel}</span>
        <span className="complexity-segments">{totalSegments} seg</span>
        <span className="complexity-chevron">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <div className="complexity-details">
          <div className="complexity-stats">
            <div className="stat">
              <span className="stat-label">Paths</span>
              <span className="stat-value">{pathCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Shapes</span>
              <span className="stat-value">{shapeCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Segments</span>
              <span className="stat-value">{totalSegments}</span>
            </div>
          </div>

          {hasHiddenShapes && (
            <div className="complexity-warning">
              <span className="warning-icon">⚠️</span>
              <span>{hiddenShapeCount} potentially hidden shape(s)</span>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="complexity-warnings">
              {warnings.map((warning, i) => (
                <div key={i} className="complexity-warning">
                  <span className="warning-icon">⚠️</span>
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          )}

          {estimatedComplexity === 'very_complex' && (
            <div className="complexity-suggestion">
              <strong>Tip:</strong> Consider using "Flatten Artwork" to simplify this design before editing.
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .complexity-badge {
          display: inline-block;
          font-size: 0.75rem;
        }

        .complexity-badge-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.5rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          color: #475569;
          transition: all 0.15s ease;
        }

        .complexity-badge-toggle:hover {
          background: #f1f5f9;
        }

        .complexity-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .complexity-label {
          font-weight: 600;
        }

        .complexity-segments {
          color: #94a3b8;
        }

        .complexity-chevron {
          font-size: 0.6rem;
          color: #94a3b8;
        }

        .complexity-details {
          margin-top: 0.5rem;
          padding: 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
        }

        .complexity-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 0.65rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .complexity-warnings {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .complexity-warning {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.5rem;
          background: #fef3c7;
          border-radius: 4px;
          font-size: 0.7rem;
          color: #92400e;
        }

        .warning-icon {
          font-size: 0.8rem;
        }

        .complexity-suggestion {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #dbeafe;
          border-radius: 4px;
          font-size: 0.7rem;
          color: #1e40af;
        }

        .complexity-badge-compact {
          display: inline-block;
          padding: 0.125rem 0.375rem;
          font-size: 0.65rem;
          font-weight: 600;
          color: white;
          border-radius: 3px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
      `}</style>
    </div>
  );
}

/**
 * Hook to get SVG analysis
 *
 * @param {string} svgContent - SVG string to analyze
 * @returns {Object|null} Analysis result
 */
export function useSvgAnalysis(svgContent) {
  return useMemo(() => {
    if (!svgContent) return null;
    return analyzeSvg(svgContent);
  }, [svgContent]);
}
