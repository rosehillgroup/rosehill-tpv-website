// TPV Studio - Sports Surface Export Menu
// Dropdown menu for export options (SVG, PNG, PDF)

import React, { useState, useRef, useEffect } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { generateSportsSVG, downloadSVG, downloadPNG, generateFilename } from '../../lib/sports/sportsExport.js';
import { calculateSportsQuantities, generateElementSpecs } from '../../utils/sportsDesignSerializer.js';

export default function ExportMenu({ svgRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(null); // 'svg' | 'png' | 'pdf' | null
  const menuRef = useRef(null);

  const exportDesignData = useSportsDesignStore((state) => state.exportDesignData);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Get the SVG element from the canvas
  const getSvgElement = () => {
    if (!svgRef?.current) {
      // Try to find the SVG element by class
      return document.querySelector('.court-canvas__svg');
    }
    return svgRef.current;
  };

  const handleExportSVG = async () => {
    setExporting('svg');
    try {
      const svgElement = getSvgElement();
      if (!svgElement) {
        throw new Error('Canvas not found');
      }

      const state = exportDesignData();
      const svgContent = generateSportsSVG(svgElement, state);
      const filename = generateFilename(state.name, 'svg');
      downloadSVG(svgContent, filename);
    } catch (error) {
      console.error('SVG export failed:', error);
      alert('Failed to export SVG: ' + error.message);
    } finally {
      setExporting(null);
      setIsOpen(false);
    }
  };

  const handleExportPNG = async () => {
    setExporting('png');
    try {
      const svgElement = getSvgElement();
      if (!svgElement) {
        throw new Error('Canvas not found');
      }

      const state = exportDesignData();
      const filename = generateFilename(state.name, 'png');
      await downloadPNG(svgElement, state, filename, 2);
    } catch (error) {
      console.error('PNG export failed:', error);
      alert('Failed to export PNG: ' + error.message);
    } finally {
      setExporting(null);
      setIsOpen(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting('pdf');
    try {
      const state = exportDesignData();

      // Calculate quantities and specs
      const quantities = calculateSportsQuantities(state);
      const specs = generateElementSpecs(state);

      // For now, generate a simple JSON report (PDF generation will be server-side)
      const report = {
        title: state.name || 'Sports Surface Design',
        generated: new Date().toISOString(),
        surface: {
          width_m: state.surface.width_mm / 1000,
          length_m: state.surface.length_mm / 1000,
          area_m2: (state.surface.width_mm * state.surface.length_mm) / 1_000_000,
          color: state.surface.color
        },
        elements: specs,
        quantities: quantities,
        courtCount: Object.keys(state.courts || {}).length,
        trackCount: Object.keys(state.tracks || {}).length
      };

      // Download as JSON for now (PDF generation requires server-side)
      const filename = generateFilename(state.name, 'json');
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      // Note: Full PDF export will be implemented server-side
      console.log('[EXPORT] PDF report data:', report);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF: ' + error.message);
    } finally {
      setExporting(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="export-menu" ref={menuRef}>
      <button
        className="sports-designer__toolbar-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Export Design"
      >
        <span className="sports-designer__icon">📥</span>
        Export
        <span className="export-menu__arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="export-menu__dropdown">
          <button
            className="export-menu__item"
            onClick={handleExportSVG}
            disabled={exporting !== null}
          >
            <span className="export-menu__icon">📄</span>
            <div className="export-menu__item-content">
              <span className="export-menu__item-title">
                {exporting === 'svg' ? 'Exporting...' : 'Download SVG'}
              </span>
              <span className="export-menu__item-desc">Vector format for CAD/printing</span>
            </div>
          </button>

          <button
            className="export-menu__item"
            onClick={handleExportPNG}
            disabled={exporting !== null}
          >
            <span className="export-menu__icon">🖼️</span>
            <div className="export-menu__item-content">
              <span className="export-menu__item-title">
                {exporting === 'png' ? 'Exporting...' : 'Download PNG'}
              </span>
              <span className="export-menu__item-desc">High-res image for presentations</span>
            </div>
          </button>

          <div className="export-menu__divider" />

          <button
            className="export-menu__item"
            onClick={handleExportPDF}
            disabled={exporting !== null}
          >
            <span className="export-menu__icon">📊</span>
            <div className="export-menu__item-content">
              <span className="export-menu__item-title">
                {exporting === 'pdf' ? 'Generating...' : 'Quantities Report'}
              </span>
              <span className="export-menu__item-desc">Material specs & quantities</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
