// TPV Studio - Dimension Modal
// Modal for specifying installation dimensions after image vectorization

import React, { useState, useEffect } from 'react';

export default function DimensionModal({
  isOpen,
  onClose,
  onConfirm,
  aspectRatio,
  defaultLongestSide = 5000
}) {
  const [longestSideMM, setLongestSideMM] = useState(defaultLongestSide);
  const [longestSideMeters, setLongestSideMeters] = useState(defaultLongestSide / 1000);

  // Calculate dimensions based on aspect ratio
  const calculateDimensions = (longestMM) => {
    if (!aspectRatio || aspectRatio <= 0) {
      return { width: longestMM, length: longestMM };
    }

    // Determine which dimension is longer
    if (aspectRatio >= 1) {
      // Width is longer (landscape)
      const width = longestMM;
      const length = Math.round(longestMM / aspectRatio);
      return { width, length };
    } else {
      // Length is longer (portrait)
      const length = longestMM;
      const width = Math.round(longestMM * aspectRatio);
      return { width, length };
    }
  };

  const dimensions = calculateDimensions(longestSideMM);
  const orientation = aspectRatio >= 1 ? 'landscape' : 'portrait';
  const ratioDisplay = aspectRatio >= 1
    ? `${aspectRatio.toFixed(1)}:1`
    : `1:${(1/aspectRatio).toFixed(1)}`;

  const handleMetersChange = (e) => {
    const meters = parseFloat(e.target.value) || 0;
    setLongestSideMeters(meters);
    setLongestSideMM(Math.round(meters * 1000));
  };

  const handleConfirm = () => {
    onConfirm(dimensions.width, dimensions.length);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="dimension-modal-overlay" onClick={onClose}>
        <div className="dimension-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dimension-modal-header">
          <h2>Set Installation Size</h2>
          <button className="dimension-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="dimension-modal-body">
          <div className="dimension-info">
            <p className="dimension-aspect">
              Your design has a <strong>{ratioDisplay} {orientation}</strong> aspect ratio
            </p>
          </div>

          <div className="dimension-input-group">
            <label htmlFor="longest-dimension">
              Installation Size (Longest Side)
            </label>
            <div className="dimension-input-wrapper">
              <input
                id="longest-dimension"
                type="number"
                min="0.1"
                max="50"
                step="0.1"
                value={longestSideMeters}
                onChange={handleMetersChange}
                className="dimension-input"
              />
              <span className="dimension-unit">meters</span>
            </div>
            <p className="dimension-help">
              Specify how large you want to install this design
            </p>
          </div>

          <div className="dimension-preview">
            <div className="dimension-preview-title">Calculated Dimensions:</div>
            <div className="dimension-preview-values">
              <div className="dimension-preview-item">
                <span className="dimension-preview-label">Width:</span>
                <span className="dimension-preview-value">{(dimensions.width / 1000).toFixed(2)}m</span>
              </div>
              <div className="dimension-preview-item">
                <span className="dimension-preview-label">Length:</span>
                <span className="dimension-preview-value">{(dimensions.length / 1000).toFixed(2)}m</span>
              </div>
              <div className="dimension-preview-item">
                <span className="dimension-preview-label">Total Area:</span>
                <span className="dimension-preview-value">
                  {((dimensions.width * dimensions.length) / 1000000).toFixed(2)}m²
                </span>
              </div>
            </div>
          </div>

          <div className="dimension-note">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="8" r="7"/>
              <line x1="8" y1="11" x2="8" y2="8"/>
              <circle cx="8" cy="5" r="0.5" fill="currentColor"/>
            </svg>
            <p>
              These dimensions will be used to calculate material quantities for your PDF specification
              and to slice your design into 1m×1m installation tiles.
            </p>
          </div>
        </div>

        <div className="dimension-modal-footer">
          <button className="dimension-btn dimension-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="dimension-btn dimension-btn-primary"
            onClick={handleConfirm}
            disabled={longestSideMeters <= 0}
          >
            Confirm Size
          </button>
        </div>
        </div>
      </div>

      <style>{`
        .dimension-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        backdrop-filter: blur(4px);
      }

      .dimension-modal {
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        animation: dimensionModalSlideIn 0.3s ease-out;
      }

      @keyframes dimensionModalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .dimension-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px;
        border-bottom: 1px solid #e5e7eb;
      }

      .dimension-modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #111827;
      }

      .dimension-modal-close {
        background: none;
        border: none;
        font-size: 2rem;
        line-height: 1;
        color: #9ca3af;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.2s;
      }

      .dimension-modal-close:hover {
        background: #f3f4f6;
        color: #111827;
      }

      .dimension-modal-body {
        padding: 24px;
        overflow-y: auto;
        flex: 1;
      }

      .dimension-info {
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 24px;
      }

      .dimension-aspect {
        margin: 0;
        color: #0c4a6e;
        font-size: 0.95rem;
        line-height: 1.5;
      }

      .dimension-input-group {
        margin-bottom: 24px;
      }

      .dimension-input-group label {
        display: block;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
        font-size: 0.95rem;
      }

      .dimension-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .dimension-input {
        width: 100%;
        padding: 12px 16px;
        padding-right: 70px;
        font-size: 1.1rem;
        border: 2px solid #d1d5db;
        border-radius: 10px;
        transition: all 0.2s;
        font-family: inherit;
      }

      .dimension-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .dimension-unit {
        position: absolute;
        right: 16px;
        color: #6b7280;
        font-weight: 500;
        pointer-events: none;
      }

      .dimension-help {
        margin: 8px 0 0 0;
        font-size: 0.85rem;
        color: #6b7280;
      }

      .dimension-preview {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 24px;
      }

      .dimension-preview-title {
        font-weight: 600;
        color: #374151;
        margin-bottom: 16px;
        font-size: 0.95rem;
      }

      .dimension-preview-values {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .dimension-preview-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: white;
        border-radius: 8px;
      }

      .dimension-preview-label {
        color: #6b7280;
        font-size: 0.9rem;
      }

      .dimension-preview-value {
        font-weight: 600;
        color: #111827;
        font-size: 1.05rem;
      }

      .dimension-note {
        display: flex;
        gap: 12px;
        padding: 16px;
        background: #fffbeb;
        border: 1px solid #fde68a;
        border-radius: 10px;
      }

      .dimension-note svg {
        flex-shrink: 0;
        margin-top: 2px;
        color: #f59e0b;
      }

      .dimension-note p {
        margin: 0;
        font-size: 0.85rem;
        color: #78350f;
        line-height: 1.5;
      }

      .dimension-modal-footer {
        padding: 20px 24px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .dimension-btn {
        padding: 10px 24px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        font-family: inherit;
      }

      .dimension-btn-secondary {
        background: white;
        border: 1px solid #d1d5db;
        color: #374151;
      }

      .dimension-btn-secondary:hover {
        background: #f9fafb;
        border-color: #9ca3af;
      }

      .dimension-btn-primary {
        background: #3b82f6;
        color: white;
      }

      .dimension-btn-primary:hover {
        background: #2563eb;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .dimension-btn-primary:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        box-shadow: none;
      }

      @media (max-width: 640px) {
        .dimension-modal {
          max-width: none;
          width: 100%;
          margin: 0;
          max-height: 100vh;
          border-radius: 0;
        }

        .dimension-modal-header {
          padding: 20px;
        }

        .dimension-modal-header h2 {
          font-size: 1.25rem;
        }

        .dimension-modal-body {
          padding: 20px;
        }

        .dimension-modal-footer {
          flex-direction: column-reverse;
          padding: 16px 20px;
        }

        .dimension-btn {
          width: 100%;
        }
      }
      `}</style>
    </>
  );
}
