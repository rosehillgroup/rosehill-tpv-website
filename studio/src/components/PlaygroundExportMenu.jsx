// TPV Studio - Playground Export Menu
// Dropdown menu for export options (SVG, PNG, Tiles, PDF)

import React, { useState, useRef, useEffect } from 'react';
import './PlaygroundExportMenu.css';

export default function PlaygroundExportMenu({
  onExportSVG,
  onExportPNG,
  onExportPDF,
  onExportTiles,
  viewMode,
  exporting,
  disabled
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const modeLabel = viewMode === 'solid' ? 'Solid' : 'Blend';

  const handleExport = (exportFn) => {
    setIsOpen(false);
    exportFn();
  };

  return (
    <div className="playground-export-menu" ref={menuRef}>
      <button
        className="action-bar__btn action-bar__btn--export"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || exporting}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {exporting ? 'Exporting...' : 'Export'}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ marginLeft: '0.25rem' }}
        >
          <path d={isOpen ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
        </svg>
      </button>

      {isOpen && (
        <div className="playground-export-menu__dropdown">
          <button
            className="playground-export-menu__item"
            onClick={() => handleExport(onExportSVG)}
          >
            <span className="playground-export-menu__icon">📄</span>
            <div className="playground-export-menu__content">
              <span className="playground-export-menu__title">Download {modeLabel} SVG</span>
              <span className="playground-export-menu__desc">Vector format for CAD/printing</span>
            </div>
          </button>

          <button
            className="playground-export-menu__item"
            onClick={() => handleExport(onExportPNG)}
          >
            <span className="playground-export-menu__icon">🖼️</span>
            <div className="playground-export-menu__content">
              <span className="playground-export-menu__title">Download {modeLabel} PNG</span>
              <span className="playground-export-menu__desc">High-res image for presentations</span>
            </div>
          </button>

          <button
            className="playground-export-menu__item"
            onClick={() => handleExport(onExportTiles)}
          >
            <span className="playground-export-menu__icon">🗂️</span>
            <div className="playground-export-menu__content">
              <span className="playground-export-menu__title">Download Tiles ZIP</span>
              <span className="playground-export-menu__desc">1m×1m SVG tiles for large printing</span>
            </div>
          </button>

          <div className="playground-export-menu__divider" />

          <button
            className="playground-export-menu__item"
            onClick={() => handleExport(onExportPDF)}
          >
            <span className="playground-export-menu__icon">📋</span>
            <div className="playground-export-menu__content">
              <span className="playground-export-menu__title">{modeLabel} Recipe Report (PDF)</span>
              <span className="playground-export-menu__desc">TPV quantities & specifications</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
