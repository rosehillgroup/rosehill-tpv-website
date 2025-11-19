// TPV Studio - In-Situ Preview Renderer Component
// Final composition with perspective, blend, and scale markers

import { useState, useEffect, useRef } from 'react';
import { getMaskBounds } from '../../lib/inSitu/maskUtils.js';
import {
  compositeDesignOnPhoto,
  downloadPreview,
  downloadMask
} from '../../lib/inSitu/canvasCompositor.js';

export default function InSituPreviewRenderer({
  photoUrl,
  designUrl,
  maskData,
  designDimensions, // { width: mm, length: mm }
  onSave,
  onBack
}) {
  // Floor dimensions in meters (user input)
  const [floorWidth, setFloorWidth] = useState('');
  const [floorLength, setFloorLength] = useState('');

  // Blend slider (0-100%)
  const [blendOpacity, setBlendOpacity] = useState(20);

  // Show scale markers toggle
  const [showMarkers, setShowMarkers] = useState(true);

  // Perspective corners (optional)
  const [perspectiveEnabled, setPerspectiveEnabled] = useState(false);
  const [perspectiveCorners, setPerspectiveCorners] = useState(null);

  // Preview state
  const [previewUrl, setPreviewUrl] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Canvas for preview
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);

  // Mask bounds
  const [maskBounds, setMaskBounds] = useState(null);

  // Calculate mask bounds on mount
  useEffect(() => {
    if (maskData) {
      const bounds = getMaskBounds(maskData, maskData.width, maskData.height);
      setMaskBounds(bounds);

      // Initialize perspective corners to mask bounds
      if (!perspectiveCorners) {
        setPerspectiveCorners([
          { x: bounds.x, y: bounds.y },
          { x: bounds.x + bounds.width, y: bounds.y },
          { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
          { x: bounds.x, y: bounds.y + bounds.height }
        ]);
      }
    }
  }, [maskData]);

  // Generate preview when parameters change
  useEffect(() => {
    if (floorWidth && floorLength && maskData && maskBounds) {
      generatePreview();
    }
  }, [floorWidth, floorLength, blendOpacity, showMarkers, perspectiveCorners, perspectiveEnabled]);

  const generatePreview = async () => {
    if (!floorWidth || !floorLength) return;

    setGenerating(true);
    setError(null);

    try {
      const result = await compositeDesignOnPhoto({
        photoUrl,
        designUrl,
        maskData,
        maskBounds,
        designDimensions: {
          width: designDimensions.width,
          length: designDimensions.length
        },
        floorDimensions: {
          width: parseFloat(floorWidth),
          length: parseFloat(floorLength)
        },
        blendOpacity: blendOpacity / 100,
        perspectiveCorners: perspectiveEnabled ? perspectiveCorners : null,
        showScaleMarkers: showMarkers
      });

      previewCanvasRef.current = result.canvas;
      setPreviewUrl(result.dataUrl);

    } catch (err) {
      console.error('[PREVIEW] Generation failed:', err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (withMarkers = true) => {
    if (previewCanvasRef.current) {
      const filename = withMarkers
        ? 'tpv-in-situ-preview.png'
        : 'tpv-in-situ-clean.png';

      // If downloading without markers and markers are shown, regenerate
      if (!withMarkers && showMarkers) {
        // Quick re-render without markers
        compositeDesignOnPhoto({
          photoUrl,
          designUrl,
          maskData,
          maskBounds,
          designDimensions: {
            width: designDimensions.width,
            length: designDimensions.length
          },
          floorDimensions: {
            width: parseFloat(floorWidth),
            length: parseFloat(floorLength)
          },
          blendOpacity: blendOpacity / 100,
          perspectiveCorners: perspectiveEnabled ? perspectiveCorners : null,
          showScaleMarkers: false
        }).then(result => {
          downloadPreview(result.canvas, filename);
        });
      } else {
        downloadPreview(previewCanvasRef.current, filename);
      }
    }
  };

  const handleDownloadMask = () => {
    if (maskData) {
      downloadMask(maskData, 'tpv-floor-mask.png');
    }
  };

  const handleSave = () => {
    if (onSave && previewUrl) {
      onSave({
        previewUrl,
        floorDimensions: {
          width: parseFloat(floorWidth),
          length: parseFloat(floorLength)
        },
        blendOpacity,
        perspectiveCorners: perspectiveEnabled ? perspectiveCorners : null
      });
    }
  };

  const hasDimensions = floorWidth && floorLength;

  return (
    <div className="preview-renderer">
      <div className="renderer-header">
        <h3>Preview Your Design</h3>
        <p>Enter floor dimensions and adjust settings to see your TPV design in situ.</p>
      </div>

      <div className="renderer-content">
        {/* Settings Panel */}
        <div className="settings-panel">
          <div className="settings-group">
            <label>Floor Dimensions</label>
            <div className="dimension-inputs">
              <div className="input-with-unit">
                <input
                  type="number"
                  value={floorWidth}
                  onChange={(e) => setFloorWidth(e.target.value)}
                  placeholder="Width"
                  min="0.1"
                  step="0.1"
                />
                <span>m</span>
              </div>
              <span className="dimension-separator">×</span>
              <div className="input-with-unit">
                <input
                  type="number"
                  value={floorLength}
                  onChange={(e) => setFloorLength(e.target.value)}
                  placeholder="Length"
                  min="0.1"
                  step="0.1"
                />
                <span>m</span>
              </div>
            </div>
          </div>

          <div className="settings-group">
            <label>
              Blend with Environment
              <span className="value">{blendOpacity}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={blendOpacity}
              onChange={(e) => setBlendOpacity(parseInt(e.target.value))}
              disabled={!hasDimensions}
            />
            <div className="slider-labels">
              <span>Sharp</span>
              <span>Blended</span>
            </div>
          </div>

          <div className="settings-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={showMarkers}
                onChange={(e) => setShowMarkers(e.target.checked)}
                disabled={!hasDimensions}
              />
              Show scale markers
            </label>
          </div>

          <div className="settings-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={perspectiveEnabled}
                onChange={(e) => setPerspectiveEnabled(e.target.checked)}
                disabled={!hasDimensions}
              />
              Enable perspective adjustment
            </label>
            {perspectiveEnabled && (
              <p className="hint">
                Drag the corners in the preview to adjust perspective.
              </p>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="preview-area">
          {!hasDimensions ? (
            <div className="preview-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <p>Enter floor dimensions to generate preview</p>
            </div>
          ) : generating ? (
            <div className="preview-loading">
              <div className="spinner" />
              <p>Generating preview...</p>
            </div>
          ) : previewUrl ? (
            <div className="preview-image-container">
              <img src={previewUrl} alt="In-situ preview" />
            </div>
          ) : null}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="renderer-footer">
        <button onClick={onBack} className="btn-secondary">
          Back to Selection
        </button>

        <div className="export-actions">
          <button
            onClick={handleDownloadMask}
            disabled={!maskData}
            className="btn-secondary btn-small"
          >
            Download Mask
          </button>
          <button
            onClick={() => handleDownload(false)}
            disabled={!previewUrl}
            className="btn-secondary btn-small"
          >
            Download Clean
          </button>
          <button
            onClick={() => handleDownload(true)}
            disabled={!previewUrl}
            className="btn-secondary"
          >
            Download Preview
          </button>
          <button
            onClick={handleSave}
            disabled={!previewUrl}
            className="btn-primary"
          >
            Save to Project
          </button>
        </div>
      </div>

      <style>{`
        .preview-renderer {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .renderer-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 1rem;
        }

        .renderer-header h3 {
          margin: 0 0 0.5rem;
          font-size: 1.125rem;
          color: #1e4a7a;
        }

        .renderer-header p {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .renderer-content {
          flex: 1;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1.5rem;
          min-height: 0;
        }

        .settings-panel {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .settings-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .settings-group > label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .settings-group .value {
          font-weight: 400;
          color: #6b7280;
        }

        .dimension-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .input-with-unit {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex: 1;
        }

        .input-with-unit input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .input-with-unit span {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .dimension-separator {
          color: #9ca3af;
        }

        input[type="range"] {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e5e7eb;
          outline: none;
          -webkit-appearance: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ff6b35;
          cursor: pointer;
        }

        input[type="range"]:disabled::-webkit-slider-thumb {
          background: #d1d5db;
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-group input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }

        .checkbox-group .hint {
          margin: 0.25rem 0 0 1.5rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .preview-area {
          background: #f3f4f6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .preview-placeholder,
        .preview-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          text-align: center;
          padding: 2rem;
        }

        .preview-placeholder svg {
          width: 48px;
          height: 48px;
          margin-bottom: 1rem;
        }

        .preview-loading .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top-color: #ff6b35;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .preview-image-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-image-container img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .error-message {
          padding: 0.75rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 4px;
          color: #dc2626;
          font-size: 0.875rem;
        }

        .renderer-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          margin-top: 1rem;
        }

        .export-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: #ff6b35;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #e55a2b;
        }

        .btn-primary:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f9fafb;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-small {
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}
