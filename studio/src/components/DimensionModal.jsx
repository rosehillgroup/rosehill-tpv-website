// TPV Studio - Dimension Modal
// Modal for specifying installation dimensions after image vectorization

import React, { useState, useEffect } from 'react';
import './DimensionModal.css';

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
  );
}
