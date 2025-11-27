// TPV Studio - Sports Surface Designer (Main Component)
import React, { useState, useEffect, useRef } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import CourtCanvas from './CourtCanvas.jsx';
import CourtLibrary from './CourtLibrary.jsx';
import PropertiesPanel from './PropertiesPanel.jsx';
import LayersPanel from './LayersPanel.jsx';
import SaveDesignModal from './SaveDesignModal.jsx';
import ExportMenu from './ExportMenu.jsx';
import tpvColours from '../../../api/_utils/data/rosehill_tpv_21_colours.json';
import './SportsSurfaceDesigner.css';

function SportsSurfaceDesigner({ loadedDesign }) {
  const [showDimensionModal, setShowDimensionModal] = useState(true);
  const [widthInput, setWidthInput] = useState('50');
  const [lengthInput, setLengthInput] = useState('50');
  const [showSurfaceColorPicker, setShowSurfaceColorPicker] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [designId, setDesignId] = useState(null);
  const [designName, setDesignName] = useState('');
  const svgRef = useRef(null);

  // Load design when loadedDesign prop changes
  useEffect(() => {
    if (loadedDesign && loadedDesign.design_data) {
      console.log('[SPORTS] Loading design from prop:', loadedDesign.id, loadedDesign.name);

      // Load the design data into the store
      useSportsDesignStore.getState().loadDesign(loadedDesign.design_data);

      // Update local state for save functionality
      setDesignId(loadedDesign.id);
      setDesignName(loadedDesign.name || '');

      // Skip the dimension modal since we're loading an existing design
      setShowDimensionModal(false);
    }
  }, [loadedDesign]);

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
    setSurfaceColor,
    resetDesign,
    hasUnsavedChanges
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

  // Handle new design
  const handleNewDesign = () => {
    // Check for unsaved work
    if (hasUnsavedChanges()) {
      const confirmed = window.confirm(
        'Start a new design?\n\nYou have unsaved changes that will be lost.'
      );
      if (!confirmed) return;
    }

    // Reset all state
    resetDesign();
    setDesignId(null);
    setDesignName('');
    setWidthInput('50');
    setLengthInput('50');
    setShowDimensionModal(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip shortcuts when typing in input fields
      const tagName = e.target.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return;
      }

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
                Common sizes: 37m × 34m (tennis), 40m × 20m (futsal), 50m × 50m (multi-sport)
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
          {/* Main Content Area */}
          <div className="sports-designer__content">
            {/* Court Library Sidebar */}
            {showCourtLibrary && (
              <aside className="sports-designer__sidebar">
                <CourtLibrary />
                <LayersPanel />
              </aside>
            )}

            {/* Canvas Area */}
            <main className="sports-designer__canvas-container">
              {/* Floating Toolbar - inside canvas container */}
              <div className="sports-toolbar">
                {/* Panel toggles */}
                <div className="sports-toolbar__group">
                  <button
                    className={`sports-toolbar__btn ${showCourtLibrary ? 'sports-toolbar__btn--active' : ''}`}
                    onClick={toggleCourtLibrary}
                    title="Court Library"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                  </button>
                  <button
                    className={`sports-toolbar__btn ${showPropertiesPanel && (selectedCourtId || selectedTrackId) ? 'sports-toolbar__btn--active' : ''}`}
                    onClick={togglePropertiesPanel}
                    title="Properties"
                    disabled={!selectedCourtId && !selectedTrackId}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="21" x2="4" y2="14" />
                      <line x1="4" y1="10" x2="4" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12" y2="3" />
                      <line x1="20" y1="21" x2="20" y2="16" />
                      <line x1="20" y1="12" x2="20" y2="3" />
                      <line x1="1" y1="14" x2="7" y2="14" />
                      <line x1="9" y1="8" x2="15" y2="8" />
                      <line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                  </button>
                </div>

                <div className="sports-toolbar__divider" />

                {/* Canvas info */}
                <div className="sports-toolbar__group">
                  <button
                    className="sports-toolbar__dimensions"
                    onClick={() => setShowDimensionModal(true)}
                    title="Click to resize surface"
                  >
                    {(surface.width_mm / 1000).toFixed(0)}m × {(surface.length_mm / 1000).toFixed(0)}m
                  </button>
                  <button
                    className="sports-toolbar__color-swatch"
                    style={{ backgroundColor: surface.color.hex }}
                    onClick={() => setShowSurfaceColorPicker(true)}
                    title={`${surface.color.name} (${surface.color.tpv_code}) - Click to change`}
                  />
                </div>

                <div className="sports-toolbar__divider" />

                {/* History */}
                <div className="sports-toolbar__group">
                  <button
                    className="sports-toolbar__btn"
                    disabled={!useSportsDesignStore.getState().canUndo()}
                    onClick={() => useSportsDesignStore.getState().undo()}
                    title="Undo (Ctrl+Z)"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7v6h6" />
                      <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
                    </svg>
                  </button>
                  <button
                    className="sports-toolbar__btn"
                    disabled={!useSportsDesignStore.getState().canRedo()}
                    onClick={() => useSportsDesignStore.getState().redo()}
                    title="Redo (Ctrl+Shift+Z)"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 7v6h-6" />
                      <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
                    </svg>
                  </button>
                </div>

                <div className="sports-toolbar__divider" />

                {/* Actions */}
                <div className="sports-toolbar__group">
                  <button
                    className="sports-toolbar__btn"
                    onClick={handleNewDesign}
                    title="Start new design"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </button>
                  <button
                    className="sports-toolbar__btn-primary"
                    onClick={() => setShowSaveModal(true)}
                  >
                    Save
                  </button>
                  <ExportMenu svgRef={svgRef} />
                </div>
              </div>

              <CourtCanvas ref={svgRef} />
            </main>

            {/* Properties Panel - shown when court or track is selected AND panel is not hidden */}
            {(selectedCourtId || selectedTrackId) && showPropertiesPanel && (
              <aside className="sports-designer__properties">
                <PropertiesPanel />
              </aside>
            )}
          </div>

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

          {/* Save Design Modal */}
          {showSaveModal && (
            <SaveDesignModal
              existingDesignId={designId}
              initialName={designName}
              svgRef={svgRef}
              onClose={() => setShowSaveModal(false)}
              onSaved={(result, name) => {
                setDesignId(result.design_id);
                setDesignName(name);
                console.log('[SPORTS] Design saved:', result.design_id);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default SportsSurfaceDesigner;
