// TPV Studio - TPV Designer (Main Component)
import React, { useState, useEffect, useRef } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { usePlaygroundDesignStore } from '../../stores/playgroundDesignStore.js';
import CourtCanvas from './CourtCanvas.jsx';
import CourtLibrary from './CourtLibrary.jsx';
import PropertiesPanel from './PropertiesPanel.jsx';
import LayersPanel from './LayersPanel.jsx';
import SaveDesignModal from './SaveDesignModal.jsx';
import ExportMenu from './ExportMenu.jsx';
import KeyboardShortcutsModal from './KeyboardShortcutsModal.jsx';
import DesignEditorModal from './DesignEditorModal.jsx';
import InSituModal from '../InSitu/InSituModal.jsx';
import { generateSportsSVG } from '../../lib/sports/sportsExport.js';
import { loadDesign } from '../../lib/api/designs.js';
import { deserializeDesign } from '../../utils/designSerializer.js';
import tpvColours from '../../../api/_utils/data/rosehill_tpv_21_colours.json';
import './TPVDesigner.css';

function TPVDesigner({ loadedDesign }) {
  // Dimension modal - only shown when user clicks to edit (default surface is 50m x 50m)
  const [showDimensionModal, setShowDimensionModal] = useState(false);
  const [widthInput, setWidthInput] = useState(() => {
    const surface = useSportsDesignStore.getState().surface;
    return surface?.width_mm ? String(surface.width_mm / 1000) : '50';
  });
  const [lengthInput, setLengthInput] = useState(() => {
    const surface = useSportsDesignStore.getState().surface;
    return surface?.length_mm ? String(surface.length_mm / 1000) : '50';
  });
  const [showSurfaceColorPicker, setShowSurfaceColorPicker] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showDesignEditor, setShowDesignEditor] = useState(false);
  const [showInSituModal, setShowInSituModal] = useState(false);
  const [inSituSvgUrl, setInSituSvgUrl] = useState(null);
  const [designId, setDesignId] = useState(null);
  const [designName, setDesignName] = useState('');
  const svgRef = useRef(null);

  // Load design when loadedDesign prop changes
  useEffect(() => {
    if (loadedDesign && loadedDesign.design_data) {
      const designData = loadedDesign.design_data;

      // Check if this is a playground design (has input_mode) vs sports design (has courts/surface)
      const isPlaygroundDesign = designData.input_mode || designData.blend_recipes || designData.solid_recipes;
      const isSportsDesign = designData.courts || designData.surface || designData.tracks;

      if (isPlaygroundDesign && !isSportsDesign) {
        // This is a playground design - open in the Design Editor Modal
        console.log('[TPV] Loading playground design into editor:', loadedDesign.id, loadedDesign.name);

        // Deserialize and load into playground store
        const restoredState = deserializeDesign(loadedDesign);
        const playgroundStore = usePlaygroundDesignStore.getState();
        playgroundStore.loadDesign(restoredState);

        // Set design name and ID
        if (loadedDesign.name) {
          playgroundStore.setDesignName(loadedDesign.name);
        }
        playgroundStore.setCurrentDesignId(loadedDesign.id);

        // Open the design editor modal
        setShowDesignEditor(true);
      } else {
        // This is a sports design - load into sports store
        console.log('[SPORTS] Loading design from prop:', loadedDesign.id, loadedDesign.name);

        // Load the design data into the store
        useSportsDesignStore.getState().loadDesign(designData);

        // Update local state for save functionality
        setDesignId(loadedDesign.id);
        setDesignName(loadedDesign.name || '');

        // Skip the dimension modal since we're loading an existing design
        setShowDimensionModal(false);
      }
    }
  }, [loadedDesign]);

  const {
    surface,
    courts,
    tracks,
    selectedCourtId,
    selectedTrackId,
    selectedMotifId,
    showCourtLibrary,
    showPropertiesPanel,
    toggleCourtLibrary,
    togglePropertiesPanel,
    setSurfaceDimensions,
    setSurfaceColor,
    resetDesign,
    hasUnsavedChanges,
    standaloneMode,
    toggleStandaloneMode
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

    // Reset all state (surface defaults to 50m x 50m)
    resetDesign();
    setDesignId(null);
    setDesignName('');
    setWidthInput('50');
    setLengthInput('50');
    // Don't show dimension modal - user can click the dimensions button to edit
  };

  // Handle opening in-situ preview modal
  const handleOpenInSitu = () => {
    // Get the SVG element
    const svgElement = svgRef.current || document.querySelector('.court-canvas__svg');
    if (!svgElement) {
      alert('Canvas not ready');
      return;
    }

    // Get current state from store
    const state = useSportsDesignStore.getState().exportDesignData();

    // Generate clean SVG content
    const svgContent = generateSportsSVG(svgElement, state);

    // Create blob URL
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const blobUrl = URL.createObjectURL(blob);

    // Clean up previous blob URL if exists
    if (inSituSvgUrl) {
      URL.revokeObjectURL(inSituSvgUrl);
    }

    setInSituSvgUrl(blobUrl);
    setShowInSituModal(true);
  };

  // Handle closing in-situ modal
  const handleCloseInSitu = () => {
    setShowInSituModal(false);
    // Clean up blob URL
    if (inSituSvgUrl) {
      URL.revokeObjectURL(inSituSvgUrl);
      setInSituSvgUrl(null);
    }
  };

  // Handle editing a source design - loads design into playground store and opens editor
  const handleEditSourceDesign = async (sourceDesignId) => {
    if (!sourceDesignId) {
      alert('Source design ID not found');
      return;
    }

    try {
      // Fetch the design from API
      const result = await loadDesign(sourceDesignId);
      const design = result?.design || result;

      if (!design) {
        throw new Error('Design not found');
      }

      // Deserialize the design data
      const restoredState = deserializeDesign(design);

      // Load into playground store
      const playgroundStore = usePlaygroundDesignStore.getState();
      playgroundStore.loadDesign(restoredState);

      // Set design name and ID
      if (design.name) {
        playgroundStore.setDesignName(design.name);
      }
      playgroundStore.setCurrentDesignId(sourceDesignId);

      // Open the design editor modal
      setShowDesignEditor(true);

      console.log('[TPV] Loaded source design for editing:', design.name);
    } catch (error) {
      console.error('[TPV] Failed to load source design:', error);
      alert('Failed to load design: ' + error.message);
    }
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
        removeMotif,
        deselectCourt,
        deselectTrack,
        deselectMotif,
        undo,
        redo,
        canUndo,
        canRedo,
        duplicateCourt,
        duplicateMotif,
        updateCourtPosition,
        updateTrackPosition,
        updateMotifPosition,
        courts,
        tracks,
        motifs,
        selectedMotifId,
        elementOrder,
        setElementOrder,
        toggleSnapToGrid,
        snapToGrid: isSnapEnabled,
        addToHistory
      } = useSportsDesignStore.getState();

      const selectedId = selectedCourtId || selectedTrackId || selectedMotifId;

      // Delete key - remove selected element
      if (e.key === 'Delete' && selectedId) {
        e.preventDefault();
        if (selectedCourtId) {
          removeCourt(selectedCourtId);
        } else if (selectedTrackId) {
          removeTrack(selectedTrackId);
        } else if (selectedMotifId) {
          removeMotif(selectedMotifId);
        }
      }

      // Escape key - deselect element
      if (e.key === 'Escape' && selectedId) {
        if (selectedCourtId) {
          deselectCourt();
        } else if (selectedTrackId) {
          deselectTrack();
        } else if (selectedMotifId) {
          deselectMotif();
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

      // Ctrl/Cmd + D - Duplicate selected element
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedId) {
        e.preventDefault();
        if (selectedCourtId) {
          duplicateCourt(selectedCourtId);
        } else if (selectedMotifId) {
          duplicateMotif(selectedMotifId);
        }
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
        } else if (selectedMotifId) {
          const motif = motifs[selectedMotifId];
          if (motif) {
            updateMotifPosition(selectedMotifId, {
              x: motif.position.x + deltaX,
              y: motif.position.y + deltaY
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

      // ? - Show keyboard shortcuts help
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcutsModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCourtId, selectedTrackId, selectedMotifId]);

  return (
    <div className="sports-designer">
      {/* Dimension Edit Modal */}
      {showDimensionModal && (
        <div className="sports-designer__modal-overlay" onClick={() => setShowDimensionModal(false)}>
          <div className="sports-designer__modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Surface Size</h2>
            <p>Adjust the dimensions of your sports surface</p>

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
                Update Surface
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Designer Interface */}
      <>
        {/* Main Content Area */}
          <div className="sports-designer__content">
            {/* Court Library Sidebar - hidden in standalone mode */}
            {showCourtLibrary && !standaloneMode && (
              <aside className="sports-designer__sidebar">
                <CourtLibrary onOpenGenerator={() => setShowDesignEditor(true)} />
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
                    title="Element Library"
                    disabled={standaloneMode}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                  </button>
                  <button
                    className={`sports-toolbar__btn ${showPropertiesPanel && (selectedCourtId || selectedTrackId || selectedMotifId) ? 'sports-toolbar__btn--active' : ''}`}
                    onClick={togglePropertiesPanel}
                    title="Properties"
                    disabled={(!selectedCourtId && !selectedTrackId && !selectedMotifId) || standaloneMode}
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

                {/* Mode Toggle */}
                <div className="sports-toolbar__group">
                  <button
                    className={`sports-toolbar__mode-toggle ${standaloneMode ? 'sports-toolbar__mode-toggle--active' : ''}`}
                    onClick={toggleStandaloneMode}
                    title={standaloneMode ? 'Switch to Multi-Element Mode' : 'Switch to Standalone Mode'}
                  >
                    {standaloneMode ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                        </svg>
                        <span>Standalone</span>
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                        </svg>
                        <span>Multi-Element</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="sports-toolbar__divider" />

                {/* Canvas info */}
                <div className="sports-toolbar__group">
                  <button
                    className="sports-toolbar__dimensions"
                    onClick={() => {
                      // Update inputs to current values before showing modal
                      setWidthInput(String(surface.width_mm / 1000));
                      setLengthInput(String(surface.length_mm / 1000));
                      setShowDimensionModal(true);
                    }}
                    title="Click to edit surface size"
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
                    className="sports-toolbar__btn"
                    onClick={handleOpenInSitu}
                    title="View In-Situ Preview"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </button>
                  <button
                    className="sports-toolbar__btn"
                    onClick={() => setShowShortcutsModal(true)}
                    title="Keyboard shortcuts (?)"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
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

            {/* Properties Panel - shown when court, track, or motif is selected AND panel is not hidden AND not in standalone mode */}
            {(selectedCourtId || selectedTrackId || selectedMotifId) && showPropertiesPanel && !standaloneMode && (
              <aside className="sports-designer__properties">
                <PropertiesPanel onEditSourceDesign={handleEditSourceDesign} />
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

          {/* Keyboard Shortcuts Help Modal */}
          <KeyboardShortcutsModal
            isOpen={showShortcutsModal}
            onClose={() => setShowShortcutsModal(false)}
          />

          {/* Full-Screen Design Editor Modal */}
          <DesignEditorModal
            isOpen={showDesignEditor}
            onClose={() => setShowDesignEditor(false)}
          />

          {/* In-Situ Preview Modal */}
          {showInSituModal && inSituSvgUrl && (
            <InSituModal
              designUrl={inSituSvgUrl}
              designDimensions={{
                width: surface.width_mm,
                length: surface.length_mm
              }}
              onClose={handleCloseInSitu}
              onSaved={(data) => {
                console.log('[TPV] In-situ preview saved:', data);
                handleCloseInSitu();
              }}
            />
          )}
        </>
    </div>
  );
}

export default TPVDesigner;
