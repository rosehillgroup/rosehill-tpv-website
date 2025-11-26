// TPV Studio - Sports Surface Designer (Main Component)
import React, { useState, useEffect } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import CourtCanvas from './CourtCanvas.jsx';
import CourtLibrary from './CourtLibrary.jsx';
import PropertiesPanel from './PropertiesPanel.jsx';
import tpvColours from '../../../api/_utils/data/rosehill_tpv_21_colours.json';
import './SportsSurfaceDesigner.css';

function SportsSurfaceDesigner() {
  const [showDimensionModal, setShowDimensionModal] = useState(true);
  const [widthInput, setWidthInput] = useState('28');
  const [lengthInput, setLengthInput] = useState('15');
  const [showSurfaceColorPicker, setShowSurfaceColorPicker] = useState(false);

  const {
    surface,
    courts,
    tracks,
    selectedCourtId,
    selectedTrackId,
    showCourtLibrary,
    showPropertiesPanel,
    toggleCourtLibrary,
    togglePropertiesPanel,
    setSurfaceDimensions,
    setSurfaceColor
  } = useSportsDesignStore();

  // Handle dimension form submit
  const handleSetDimensions = (e) => {
    e.preventDefault();
    const width_mm = parseFloat(widthInput) * 1000;
    const length_mm = parseFloat(lengthInput) * 1000;

    if (width_mm > 0 && length_mm > 0) {
      setSurfaceDimensions(width_mm, length_mm);
      setShowDimensionModal(false);
    }
  };

  // Handle surface color selection
  const handleSurfaceColorSelect = (tpvColor) => {
    setSurfaceColor({
      tpv_code: tpvColor.code,
      hex: tpvColor.hex,
      name: tpvColor.name
    });
    setShowSurfaceColorPicker(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const {
        removeCourt,
        removeTrack,
        deselectCourt,
        deselectTrack,
        undo,
        redo,
        canUndo,
        canRedo,
        duplicateCourt,
        updateCourtPosition,
        updateTrackPosition,
        courts,
        tracks,
        elementOrder,
        setElementOrder,
        toggleSnapToGrid,
        snapToGrid: isSnapEnabled,
        addToHistory
      } = useSportsDesignStore.getState();

      const selectedId = selectedCourtId || selectedTrackId;

      // Delete key - remove selected element
      if (e.key === 'Delete' && selectedId) {
        e.preventDefault();
        if (selectedCourtId) {
          removeCourt(selectedCourtId);
        } else if (selectedTrackId) {
          removeTrack(selectedTrackId);
        }
      }

      // Escape key - deselect element
      if (e.key === 'Escape' && selectedId) {
        if (selectedCourtId) {
          deselectCourt();
        } else if (selectedTrackId) {
          deselectTrack();
        }
      }

      // Ctrl/Cmd + Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) {
          undo();
        }
      }

      // Ctrl/Cmd + Shift + Z - Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        if (canRedo()) {
          redo();
        }
      }

      // Ctrl/Cmd + D - Duplicate selected court
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedCourtId) {
        e.preventDefault();
        duplicateCourt(selectedCourtId);
      }

      // Arrow Keys - Nudge element position
      if (selectedId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();

        const nudgeAmount = e.shiftKey ? 10 : 100; // Shift = fine (10mm), normal = coarse (100mm)
        let deltaX = 0;
        let deltaY = 0;

        if (e.key === 'ArrowLeft') deltaX = -nudgeAmount;
        if (e.key === 'ArrowRight') deltaX = nudgeAmount;
        if (e.key === 'ArrowUp') deltaY = -nudgeAmount;
        if (e.key === 'ArrowDown') deltaY = nudgeAmount;

        if (selectedCourtId) {
          const court = courts[selectedCourtId];
          if (court) {
            updateCourtPosition(selectedCourtId, {
              x: court.position.x + deltaX,
              y: court.position.y + deltaY
            });
            addToHistory();
          }
        } else if (selectedTrackId) {
          const track = tracks[selectedTrackId];
          if (track) {
            updateTrackPosition(selectedTrackId, {
              x: track.position.x + deltaX,
              y: track.position.y + deltaY
            });
            addToHistory();
          }
        }
      }

      // [ ] - Move element in layer order (backward/forward)
      if (selectedId && (e.key === '[' || e.key === ']')) {
        e.preventDefault();
        const currentIndex = elementOrder.indexOf(selectedId);
        if (currentIndex === -1) return;

        const newOrder = [...elementOrder];

        if (e.key === '[' && currentIndex > 0) {
          // Move backward (down in z-order)
          [newOrder[currentIndex], newOrder[currentIndex - 1]] =
          [newOrder[currentIndex - 1], newOrder[currentIndex]];
          setElementOrder(newOrder);
          addToHistory();
        } else if (e.key === ']' && currentIndex < elementOrder.length - 1) {
          // Move forward (up in z-order)
          [newOrder[currentIndex], newOrder[currentIndex + 1]] =
          [newOrder[currentIndex + 1], newOrder[currentIndex]];
          setElementOrder(newOrder);
          addToHistory();
        }
      }

      // G - Toggle snap to grid
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        toggleSnapToGrid();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCourtId, selectedTrackId]);

  return (
    <div className="sports-designer">
      {/* Dimension Setup Modal */}
      {showDimensionModal && (
        <div className="sports-designer__modal-overlay">
          <div className="sports-designer__modal">
            <h2>Create Sports Surface</h2>
            <p>Enter the dimensions of your sports surface</p>

            <form onSubmit={handleSetDimensions}>
              <div className="sports-designer__dimension-inputs">
                <div className="sports-designer__input-group">
                  <label htmlFor="width">Width (metres)</label>
                  <input
                    id="width"
                    type="number"
                    min="5"
                    max="100"
                    step="0.5"
                    value={widthInput}
                    onChange={(e) => setWidthInput(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <span className="sports-designer__dimension-separator">×</span>

                <div className="sports-designer__input-group">
                  <label htmlFor="length">Length (metres)</label>
                  <input
                    id="length"
                    type="number"
                    min="5"
                    max="100"
                    step="0.5"
                    value={lengthInput}
                    onChange={(e) => setLengthInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              <p className="sports-designer__dimension-hint">
                Common MUGA size: 28m × 15m (basketball) or 40m × 20m (futsal)
              </p>

              <button type="submit" className="sports-designer__btn-primary">
                Create Surface
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Designer Interface */}
      {!showDimensionModal && (
        <>
          {/* Toolbar */}
          <div className="sports-designer__toolbar">
            <div className="sports-designer__toolbar-left">
              <button
                className="sports-designer__toolbar-btn"
                onClick={toggleCourtLibrary}
                title="Toggle Court Library"
              >
                <span className="sports-designer__icon">📚</span>
                {showCourtLibrary ? 'Hide' : 'Show'} Courts
              </button>

              <button
                className="sports-designer__toolbar-btn"
                onClick={togglePropertiesPanel}
                title="Toggle Properties Panel"
                disabled={!selectedCourtId && !selectedTrackId}
              >
                <span className="sports-designer__icon">⚙️</span>
                {showPropertiesPanel ? 'Hide' : 'Show'} Properties
              </button>

              <div className="sports-designer__surface-info">
                <span className="sports-designer__label">Surface:</span>
                <span className="sports-designer__value">
                  {(surface.width_mm / 1000).toFixed(1)}m × {(surface.length_mm / 1000).toFixed(1)}m
                </span>
                <button
                  className="sports-designer__surface-color-btn"
                  style={{ backgroundColor: surface.color.hex }}
                  onClick={() => setShowSurfaceColorPicker(true)}
                  title={`Surface Color: ${surface.color.name} (${surface.color.tpv_code}) - Click to change`}
                />
              </div>

              <div className="sports-designer__court-count">
                <span className="sports-designer__label">Courts:</span>
                <span className="sports-designer__value">{Object.keys(courts).length}</span>
              </div>
            </div>

            <div className="sports-designer__toolbar-right">
              <button
                className="sports-designer__toolbar-btn"
                onClick={() => setShowDimensionModal(true)}
                title="Change Surface Dimensions"
              >
                <span className="sports-designer__icon">📏</span>
                Resize
              </button>

              <button
                className="sports-designer__toolbar-btn"
                disabled={!useSportsDesignStore.getState().canUndo()}
                onClick={() => useSportsDesignStore.getState().undo()}
                title="Undo (Ctrl+Z)"
              >
                <span className="sports-designer__icon">↶</span>
                Undo
              </button>

              <button
                className="sports-designer__toolbar-btn"
                disabled={!useSportsDesignStore.getState().canRedo()}
                onClick={() => useSportsDesignStore.getState().redo()}
                title="Redo (Ctrl+Shift+Z)"
              >
                <span className="sports-designer__icon">↷</span>
                Redo
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="sports-designer__content">
            {/* Court Library Sidebar */}
            {showCourtLibrary && (
              <aside className="sports-designer__sidebar">
                <CourtLibrary />
              </aside>
            )}

            {/* Canvas Area */}
            <main className="sports-designer__canvas-container">
              <CourtCanvas />
            </main>

            {/* Properties Panel - shown when court or track is selected AND panel is not hidden */}
            {(selectedCourtId || selectedTrackId) && showPropertiesPanel && (
              <aside className="sports-designer__properties">
                <PropertiesPanel />
              </aside>
            )}
          </div>

          {/* Help Text */}
          {Object.keys(courts).length === 0 && Object.keys(tracks).length === 0 && (
            <div className="sports-designer__empty-state">
              <div className="sports-designer__empty-content">
                <h3>Add Your First Element</h3>
                <p>
                  Select a court or track from the library on the left to place it on your surface.
                  <br />
                  You can then move, rotate, scale, and customize your design.
                </p>
              </div>
            </div>
          )}

          {/* Surface Color Picker Modal */}
          {showSurfaceColorPicker && (
            <div className="sports-designer__color-modal-overlay" onClick={() => setShowSurfaceColorPicker(false)}>
              <div className="sports-designer__color-modal" onClick={(e) => e.stopPropagation()}>
                <div className="sports-designer__color-modal-header">
                  <h4>Select Surface Colour</h4>
                  <button onClick={() => setShowSurfaceColorPicker(false)}>×</button>
                </div>
                <div className="sports-designer__color-grid">
                  {tpvColours.map(color => (
                    <button
                      key={color.code}
                      className={`sports-designer__color-swatch ${surface.color.tpv_code === color.code ? 'sports-designer__color-swatch--selected' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleSurfaceColorSelect(color)}
                      title={`${color.code} - ${color.name}`}
                    >
                      <span className="sports-designer__color-code">{color.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SportsSurfaceDesigner;
