// TPV Studio - Sports Surface Export Menu
// Dropdown menu for export options (SVG, PNG, PDF)

import React, { useState, useRef, useEffect } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { generateSportsSVG, downloadSVG, downloadPNG, generateFilename } from '../../lib/sports/sportsExport.js';
import { sliceSvgIntoTiles, downloadBlob } from '../../lib/svgTileSlicer.js';
import { auth } from '../../lib/api/auth.js';

export default function ExportMenu({ svgRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(null); // 'svg' | 'png' | 'pdf' | 'tiles' | null
  const menuRef = useRef(null);

  const exportDesignData = useSportsDesignStore((state) => state.exportDesignData);
  const surface = useSportsDesignStore((state) => state.surface);
  const designName = useSportsDesignStore((state) => state.designName);

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
    setIsOpen(false);

    try {
      const svgElement = getSvgElement();
      if (!svgElement) {
        throw new Error('Canvas not found');
      }

      // Get auth token
      const session = await auth.getSession();
      if (!session?.access_token) {
        throw new Error('Authentication required for PDF export');
      }

      const state = exportDesignData();
      const name = state.name || 'Sports Surface Design';

      // Serialize SVG (cleaned for export)
      const svgClone = svgElement.cloneNode(true);
      // Remove selection indicators and handles
      svgClone.querySelectorAll(
        '[class*="selected"], .transform-handles, .track-resize-handles, ' +
        '.court-canvas__selection-outline, [class*="selection"], [class*="handle"], ' +
        '[stroke-dasharray]'
      ).forEach(el => el.remove());
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      const svgString = new XMLSerializer().serializeToString(svgClone);

      console.log('[EXPORT] Generating PDF report via API...');

      // Call server-side API
      const response = await fetch('/api/export-sports-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          svgString,
          designName: name,
          surface: state.surface,
          courts: state.courts,
          tracks: state.tracks,
          dimensions: {
            widthMM: state.surface.width_mm,
            lengthMM: state.surface.length_mm,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `Server error: ${response.status}`);
      }

      // Download the PDF
      const pdfBlob = await response.blob();
      const filename = generateFilename(name, 'pdf');

      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      console.log('[EXPORT] PDF downloaded:', filename);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF: ' + error.message);
    } finally {
      setExporting(null);
    }
  };

  const handleExportTiles = async () => {
    setExporting('tiles');
    setIsOpen(false);

    try {
      const svgElement = getSvgElement();
      if (!svgElement) {
        throw new Error('Canvas not found');
      }

      // Serialize SVG to string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);

      // Get dimensions from store
      const dimensions = {
        width: surface.width_mm,
        length: surface.length_mm
      };

      // Generate tiles ZIP
      const name = designName || 'sports-surface';
      const zipBlob = await sliceSvgIntoTiles(svgString, dimensions, name);

      // Download
      const filename = `${name.replace(/[^a-zA-Z0-9-_]/g, '-')}-tiles-1mx1m.zip`;
      downloadBlob(zipBlob, filename);

      console.log('[EXPORT] Tiles ZIP downloaded:', filename);
    } catch (error) {
      console.error('Tiles export failed:', error);
      alert('Failed to export tiles: ' + error.message);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="export-menu" ref={menuRef}>
      <button
        className="sports-toolbar__btn-export"
        onClick={() => setIsOpen(!isOpen)}
        title="Export Design"
      >
        Export
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={isOpen ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
        </svg>
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

          <button
            className="export-menu__item"
            onClick={handleExportTiles}
            disabled={exporting !== null}
          >
            <span className="export-menu__icon">🗂️</span>
            <div className="export-menu__item-content">
              <span className="export-menu__item-title">
                {exporting === 'tiles' ? 'Generating...' : 'Download Tiles ZIP'}
              </span>
              <span className="export-menu__item-desc">1m×1m SVG tiles for large-format printing</span>
            </div>
          </button>

          <div className="export-menu__divider" />

          <button
            className="export-menu__item"
            onClick={handleExportPDF}
            disabled={exporting !== null}
          >
            <span className="export-menu__icon">📄</span>
            <div className="export-menu__item-content">
              <span className="export-menu__item-title">
                {exporting === 'pdf' ? 'Generating...' : 'Materials Report (PDF)'}
              </span>
              <span className="export-menu__item-desc">TPV quantities & specifications</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
