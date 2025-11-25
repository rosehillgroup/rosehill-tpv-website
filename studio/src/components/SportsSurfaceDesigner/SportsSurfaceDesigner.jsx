// TPV Studio - Sports Surface Designer (Main Component)
import React, { useState, useEffect } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import CourtCanvas from './CourtCanvas.jsx';
import CourtLibrary from './CourtLibrary.jsx';
import './SportsSurfaceDesigner.css';

function SportsSurfaceDesigner() {
  const [showDimensionModal, setShowDimensionModal] = useState(true);
  const [widthInput, setWidthInput] = useState('28');
  const [lengthInput, setLengthInput] = useState('15');

  const {
    surface,
    courts,
    selectedCourtId,
    showCourtLibrary,
    toggleCourtLibrary,
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete key - remove selected court
      if (e.key === 'Delete' && selectedCourtId) {
        const { removeCourt } = useSportsDesignStore.getState();
        removeCourt(selectedCourtId);
      }

      // Escape key - deselect court
      if (e.key === 'Escape' && selectedCourtId) {
        const { deselectCourt } = useSportsDesignStore.getState();
        deselectCourt();
      }

      // Ctrl/Cmd + Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const { undo, canUndo } = useSportsDesignStore.getState();
        if (canUndo()) {
          undo();
        }
      }

      // Ctrl/Cmd + Shift + Z - Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        const { redo, canRedo } = useSportsDesignStore.getState();
        if (canRedo()) {
          redo();
        }
      }

      // Ctrl/Cmd + D - Duplicate selected court
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedCourtId) {
        e.preventDefault();
        const { duplicateCourt } = useSportsDesignStore.getState();
        duplicateCourt(selectedCourtId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCourtId]);

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

              <div className="sports-designer__surface-info">
                <span className="sports-designer__label">Surface:</span>
                <span className="sports-designer__value">
                  {(surface.width_mm / 1000).toFixed(1)}m × {(surface.length_mm / 1000).toFixed(1)}m
                </span>
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
          </div>

          {/* Help Text */}
          {Object.keys(courts).length === 0 && (
            <div className="sports-designer__empty-state">
              <div className="sports-designer__empty-content">
                <h3>Add Your First Court</h3>
                <p>
                  Select a court from the library on the left to place it on your surface.
                  <br />
                  You can then move, rotate, and colour the court markings.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SportsSurfaceDesigner;
