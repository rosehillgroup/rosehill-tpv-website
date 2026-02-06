// TPV Studio - TPV Designer (Main Component)
import React, { useState, useEffect, useRef } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { usePlaygroundDesignStore } from '../../stores/playgroundDesignStore.js';
import CourtCanvas from './CourtCanvas.jsx';
import CourtLibrary from './CourtLibrary.jsx';
import CourtLibraryModal from './CourtLibraryModal.jsx';
import PropertiesPanel from './PropertiesPanel.jsx';
import LayersPanel from './LayersPanel.jsx';
import SaveDesignModal from './SaveDesignModal.jsx';
import ExportMenu from './ExportMenu.jsx';
import KeyboardShortcutsModal from './KeyboardShortcutsModal.jsx';
import DesignEditorModal from './DesignEditorModal.jsx';
import InSituModal from '../InSitu/InSituModal.jsx';
import ShapeToolbar from './ShapeToolbar.jsx';
import { generateSportsSVG } from '../../lib/sports/sportsExport.js';
import { loadDesign } from '../../lib/api/designs.js';
import { deserializeDesign } from '../../utils/designSerializer.js';
import tpvColours from '../../../api/_utils/data/rosehill_tpv_21_colours.json';
import { showToast } from '../../lib/toast.js';
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
  const [showCourtModal, setShowCourtModal] = useState(false);
  const [designId, setDesignId] = useState(null);
  const [designName, setDesignName] = useState('');
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [showElementsMenu, setShowElementsMenu] = useState(false);
  const svgRef = useRef(null);

  // Load design when loadedDesign prop changes
  useEffect(() => {
    if (loadedDesign) {
      const designData = loadedDesign.design_data || {};

      // Check if this is a playground design (has input_mode) vs sports design (has courts/surface)
      // Note: input_mode may be at top level (loadedDesign.input_mode) or inside design_data
      const isPlaygroundDesign = loadedDesign.input_mode || designData.input_mode || designData.blend_recipes || designData.solid_recipes;
      const isSportsDesign = designData.courts || designData.surface || designData.tracks;

      console.log('[TPV] Design detection:', {
        id: loadedDesign.id,
        name: loadedDesign.name,
        hasDesignData: !!loadedDesign.design_data,
        topLevelInputMode: loadedDesign.input_mode,
        isPlaygroundDesign,
        isSportsDesign
      });

      if (isPlaygroundDesign && !isSportsDesign) {
        // This is a playground design - open in the Design Editor Modal
        console.log('[TPV] Loading playground design into editor:', loadedDesign.id, loadedDesign.name);

        // Pass design object directly - deserializeDesign has fallback logic for design_data
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
      } else if (loadedDesign.design_data) {
        // This is a sports design - load into sports store
        console.log('[SPORTS] Loading design from prop:', loadedDesign.id, loadedDesign.name);

        // Load the design data into the store
        useSportsDesignStore.getState().loadDesign(designData);

        // Update local state for save functionality
        setDesignId(loadedDesign.id);
        setDesignName(loadedDesign.name || '');

        // Skip the dimension modal since we're loading an existing design
        setShowDimensionModal(false);
      } else {
        console.warn('[TPV] Design has no design_data and is not a playground design:', loadedDesign.id, loadedDesign.name);
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
    selectedShapeId,
    selectedTextId,
    selectedGroupId,
    selectedElementIds,
    showCourtLibrary,
    showPropertiesPanel,
    toggleCourtLibrary,
    togglePropertiesPanel,
    setSurfaceDimensions,
    setSurfaceColor,
    setSurfaceBoundaryPreset,
    resetSurfaceBoundary,
    updateBoundaryParams,
    resetDesign,
    hasUnsavedChanges,
    standaloneMode,
    toggleStandaloneMode,
    groupSelected,
    ungroup,
    alignElements,
    distributeElements,
    // Element creation
    addShape,
    addText,
    addExclusionZone,
    startPathDrawing,
    pathDrawingMode,
    // Mobile UI state
    mobileLibraryOpen,
    mobilePropertiesOpen,
    mobileColoursOpen,
    mobileActiveTab,
    setMobileLibraryOpen,
    setMobilePropertiesOpen,
    setMobileColoursOpen,
    setMobileActiveTab,
    closeMobileSheets,
    // Autosave state
    isDirty,
    clearAutosaveTimer,
    // Borrowed design state (for admin viewing other users' designs)
    isBorrowed,
    borrowedFromUser,
    isForking,
    forkedDesignId
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
      showToast('Canvas not ready. Please wait a moment.');
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
      showToast('Source design ID not found');
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
      showToast('Failed to load design. Please try again.');
    }
  };

  // Close alignment menu when clicking outside
  useEffect(() => {
    if (!showAlignMenu) return;
    const handleClickOutside = () => {
      setShowAlignMenu(false);
      setShowElementsMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showAlignMenu]);

  // Close elements menu when clicking outside
  useEffect(() => {
    if (!showElementsMenu) return;
    const handleClickOutside = () => setShowElementsMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showElementsMenu]);

  // Warn about unsaved changes on page unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Clean up autosave timer on unmount
  useEffect(() => {
    return () => clearAutosaveTimer();
  }, [clearAutosaveTimer]);

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
        removeShape,
        removeText,
        deselectCourt,
        deselectTrack,
        deselectMotif,
        deselectShape,
        deselectText,
        stopEditingText,
        undo,
        redo,
        canUndo,
        canRedo,
        duplicateCourt,
        duplicateMotif,
        duplicateShape,
        duplicateText,
        updateCourtPosition,
        updateTrackPosition,
        updateMotifPosition,
        updateShapePosition,
        updateTextPosition,
        courts,
        tracks,
        motifs,
        shapes,
        texts,
        selectedMotifId,
        selectedShapeId: currentSelectedShapeId,
        selectedTextId: currentSelectedTextId,
        editingTextId,
        elementOrder,
        setElementOrder,
        toggleSnapToGrid,
        snapToGrid: isSnapEnabled,
        addToHistory
      } = useSportsDesignStore.getState();

      const selectedId = selectedCourtId || selectedTrackId || selectedMotifId || currentSelectedShapeId || currentSelectedTextId;

      // Delete/Backspace key - remove selected element (skip if editing text inline)
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !editingTextId) {
        e.preventDefault();
        if (selectedCourtId) {
          removeCourt(selectedCourtId);
        } else if (selectedTrackId) {
          removeTrack(selectedTrackId);
        } else if (selectedMotifId) {
          removeMotif(selectedMotifId);
        } else if (currentSelectedShapeId) {
          removeShape(currentSelectedShapeId);
        } else if (currentSelectedTextId) {
          removeText(currentSelectedTextId);
        }
      }

      // Escape key - deselect element or stop editing text
      if (e.key === 'Escape') {
        if (editingTextId) {
          // Stop editing text first
          stopEditingText();
        } else if (selectedId) {
          if (selectedCourtId) {
            deselectCourt();
          } else if (selectedTrackId) {
            deselectTrack();
          } else if (selectedMotifId) {
            deselectMotif();
          } else if (currentSelectedShapeId) {
            deselectShape();
          } else if (currentSelectedTextId) {
            deselectText();
          }
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
        } else if (currentSelectedShapeId) {
          duplicateShape(currentSelectedShapeId);
        } else if (currentSelectedTextId) {
          duplicateText(currentSelectedTextId);
        }
      }

      // Arrow Keys - Nudge element position (skip if editing text)
      if (selectedId && !editingTextId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
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
        } else if (currentSelectedShapeId) {
          const shape = shapes[currentSelectedShapeId];
          if (shape) {
            updateShapePosition(currentSelectedShapeId, {
              x: shape.position.x + deltaX,
              y: shape.position.y + deltaY
            });
            addToHistory();
          }
        } else if (currentSelectedTextId) {
          const text = texts[currentSelectedTextId];
          if (text) {
            updateTextPosition(currentSelectedTextId, {
              x: text.position.x + deltaX,
              y: text.position.y + deltaY
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
  }, [selectedCourtId, selectedTrackId, selectedMotifId, selectedShapeId, selectedTextId]);

  return (
    <div className="sports-designer">
      {/* Borrowed Design Banner */}
      {(isBorrowed || forkedDesignId) && (
        <div className={`borrowed-banner ${forkedDesignId ? 'forked' : ''}`}>
          {isForking ? (
            <span>Creating your copy...</span>
          ) : forkedDesignId ? (
            <span>Now editing your copy - original design unchanged</span>
          ) : (
            <span>Viewing {borrowedFromUser}'s design - changes will create your own copy</span>
          )}
        </div>
      )}

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

              {/* Surface Boundary Shape */}
              <div className="sports-designer__boundary-section">
                <label htmlFor="boundary-shape">Surface Shape</label>
                <div className="sports-designer__boundary-options">
                  <select
                    id="boundary-shape"
                    value={surface.boundary?.type || 'rectangle'}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'rectangle') {
                        resetSurfaceBoundary();
                      } else {
                        setSurfaceBoundaryPreset(value);
                      }
                    }}
                    className="sports-designer__select"
                  >
                    <option value="rectangle">Rectangle (default)</option>
                    <option value="l-shape">L-Shape</option>
                    <option value="u-shape">U-Shape</option>
                    <option value="t-shape">T-Shape</option>
                  </select>
                  {surface.boundary?.type && surface.boundary.type !== 'rectangle' && (
                    <button
                      type="button"
                      className="sports-designer__btn-secondary"
                      onClick={resetSurfaceBoundary}
                      title="Reset to rectangle"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* L-Shape dimension controls */}
                {surface.boundary?.type === 'l-shape' && (
                  <div className="sports-designer__boundary-params">
                    <div className="sports-designer__param-row">
                      <label>Cut Width: {Math.round((surface.boundary.params?.cutWidth || 0.6) * 100)}%</label>
                      <input
                        type="range"
                        min="20"
                        max="80"
                        value={(surface.boundary.params?.cutWidth || 0.6) * 100}
                        onChange={(e) => updateBoundaryParams({ cutWidth: parseInt(e.target.value) / 100 })}
                      />
                    </div>
                    <div className="sports-designer__param-row">
                      <label>Cut Height: {Math.round((surface.boundary.params?.cutHeight || 0.4) * 100)}%</label>
                      <input
                        type="range"
                        min="20"
                        max="80"
                        value={(surface.boundary.params?.cutHeight || 0.4) * 100}
                        onChange={(e) => updateBoundaryParams({ cutHeight: parseInt(e.target.value) / 100 })}
                      />
                    </div>
                  </div>
                )}

                {/* U-Shape dimension controls */}
                {surface.boundary?.type === 'u-shape' && (
                  <div className="sports-designer__boundary-params">
                    <div className="sports-designer__param-row">
                      <label>Cut Start: {Math.round((surface.boundary.params?.cutStart || 0.35) * 100)}%</label>
                      <input
                        type="range"
                        min="10"
                        max="45"
                        value={(surface.boundary.params?.cutStart || 0.35) * 100}
                        onChange={(e) => updateBoundaryParams({ cutStart: parseInt(e.target.value) / 100 })}
                      />
                    </div>
                    <div className="sports-designer__param-row">
                      <label>Cut End: {Math.round((surface.boundary.params?.cutEnd || 0.65) * 100)}%</label>
                      <input
                        type="range"
                        min="55"
                        max="90"
                        value={(surface.boundary.params?.cutEnd || 0.65) * 100}
                        onChange={(e) => updateBoundaryParams({ cutEnd: parseInt(e.target.value) / 100 })}
                      />
                    </div>
                    <div className="sports-designer__param-row">
                      <label>Cut Height: {Math.round((surface.boundary.params?.cutHeight || 0.4) * 100)}%</label>
                      <input
                        type="range"
                        min="20"
                        max="80"
                        value={(surface.boundary.params?.cutHeight || 0.4) * 100}
                        onChange={(e) => updateBoundaryParams({ cutHeight: parseInt(e.target.value) / 100 })}
                      />
                    </div>
                  </div>
                )}

                {/* T-Shape dimension controls */}
                {surface.boundary?.type === 't-shape' && (
                  <div className="sports-designer__boundary-params">
                    <div className="sports-designer__param-row">
                      <label>Stem Start: {Math.round((surface.boundary.params?.stemStart || 0.3) * 100)}%</label>
                      <input
                        type="range"
                        min="10"
                        max="45"
                        value={(surface.boundary.params?.stemStart || 0.3) * 100}
                        onChange={(e) => updateBoundaryParams({ stemStart: parseInt(e.target.value) / 100 })}
                      />
                    </div>
                    <div className="sports-designer__param-row">
                      <label>Stem End: {Math.round((surface.boundary.params?.stemEnd || 0.7) * 100)}%</label>
                      <input
                        type="range"
                        min="55"
                        max="90"
                        value={(surface.boundary.params?.stemEnd || 0.7) * 100}
                        onChange={(e) => updateBoundaryParams({ stemEnd: parseInt(e.target.value) / 100 })}
                      />
                    </div>
                    <div className="sports-designer__param-row">
                      <label>Bar Height: {Math.round((surface.boundary.params?.stemHeight || 0.4) * 100)}%</label>
                      <input
                        type="range"
                        min="20"
                        max="80"
                        value={(surface.boundary.params?.stemHeight || 0.4) * 100}
                        onChange={(e) => updateBoundaryParams({ stemHeight: parseInt(e.target.value) / 100 })}
                      />
                    </div>
                  </div>
                )}

                <p className="sports-designer__boundary-hint">
                  Non-rectangular shapes are useful for L-shaped buildings or irregular sites
                </p>
              </div>

              <button type="submit" className="sports-designer__btn-primary">
                Update Surface
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Designer Interface */}
      <>
        {/* Mobile Header */}
        <header className="sports-designer__mobile-header">
          <span className="sports-designer__mobile-header-title">TPV Designer</span>
          <div className="sports-designer__mobile-header-actions">
            <button
              className="sports-designer__mobile-header-btn"
              onClick={() => {
                setWidthInput(String(surface.width_mm / 1000));
                setLengthInput(String(surface.length_mm / 1000));
                setShowDimensionModal(true);
              }}
              title="Surface settings"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </button>
            <ExportMenu svgRef={svgRef} mobileMode={true} />
          </div>
        </header>

        {/* Mobile Action Bar */}
        <nav className="sports-designer__mobile-action-bar">
          <button
            className={`sports-designer__mobile-action-btn ${mobileLibraryOpen ? 'sports-designer__mobile-action-btn--active' : ''}`}
            onClick={() => {
              closeMobileSheets();
              setMobileLibraryOpen(true);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span>Add</span>
          </button>
          <button
            className="sports-designer__mobile-action-btn"
            onClick={() => {
              closeMobileSheets();
              setMobileColoursOpen(true);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="13.5" cy="6.5" r="2.5" />
              <circle cx="17.5" cy="10.5" r="2.5" />
              <circle cx="8.5" cy="7.5" r="2.5" />
              <circle cx="6.5" cy="12.5" r="2.5" />
            </svg>
            <span>Colours</span>
          </button>
          <button
            className={`sports-designer__mobile-action-btn ${(selectedCourtId || selectedTrackId || selectedMotifId || selectedShapeId || selectedTextId) ? '' : 'sports-designer__mobile-action-btn--disabled'}`}
            onClick={() => {
              if (selectedCourtId || selectedTrackId || selectedMotifId || selectedShapeId || selectedTextId) {
                closeMobileSheets();
                setMobilePropertiesOpen(true);
              }
            }}
            disabled={!selectedCourtId && !selectedTrackId && !selectedMotifId && !selectedShapeId && !selectedTextId}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <span>Properties</span>
          </button>
          <button
            className="sports-designer__mobile-action-btn"
            onClick={() => setShowSaveModal(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>Save</span>
          </button>
        </nav>

        {/* Mobile Bottom Sheet - Library */}
        <div
          className={`sports-designer__bottom-sheet-overlay ${mobileLibraryOpen ? 'sports-designer__bottom-sheet-overlay--open' : ''}`}
          onClick={() => setMobileLibraryOpen(false)}
        />
        <div className={`sports-designer__bottom-sheet ${mobileLibraryOpen ? 'sports-designer__bottom-sheet--open' : ''}`}>
          <div className="sports-designer__bottom-sheet-handle" />
          <div className="sports-designer__bottom-sheet-header">
            <h3>Add Element</h3>
            <button
              className="sports-designer__bottom-sheet-close"
              onClick={() => setMobileLibraryOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="sports-designer__mobile-tabs">
            <button
              className={`sports-designer__mobile-tab ${mobileActiveTab === 'courts' ? 'sports-designer__mobile-tab--active' : ''}`}
              onClick={() => setMobileActiveTab('courts')}
            >
              Courts
            </button>
            <button
              className={`sports-designer__mobile-tab ${mobileActiveTab === 'tracks' ? 'sports-designer__mobile-tab--active' : ''}`}
              onClick={() => setMobileActiveTab('tracks')}
            >
              Tracks
            </button>
            <button
              className={`sports-designer__mobile-tab ${mobileActiveTab === 'shapes' ? 'sports-designer__mobile-tab--active' : ''}`}
              onClick={() => setMobileActiveTab('shapes')}
            >
              Shapes
            </button>
            <button
              className={`sports-designer__mobile-tab ${mobileActiveTab === 'designs' ? 'sports-designer__mobile-tab--active' : ''}`}
              onClick={() => setMobileActiveTab('designs')}
            >
              Designs
            </button>
          </div>
          <div className="sports-designer__bottom-sheet-content">
            <CourtLibrary
              mobileMode={true}
              activeTab={mobileActiveTab}
              onItemAdded={() => setMobileLibraryOpen(false)}
              onOpenGenerator={() => {
                setMobileLibraryOpen(false);
                setShowDesignEditor(true);
              }}
            />
          </div>
        </div>

        {/* Mobile Bottom Sheet - Colours */}
        <div
          className={`sports-designer__bottom-sheet-overlay ${mobileColoursOpen ? 'sports-designer__bottom-sheet-overlay--open' : ''}`}
          onClick={() => setMobileColoursOpen(false)}
        />
        <div className={`sports-designer__bottom-sheet ${mobileColoursOpen ? 'sports-designer__bottom-sheet--open' : ''}`}>
          <div className="sports-designer__bottom-sheet-handle" />
          <div className="sports-designer__bottom-sheet-header">
            <h3>Surface Colour</h3>
            <button
              className="sports-designer__bottom-sheet-close"
              onClick={() => setMobileColoursOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="sports-designer__bottom-sheet-content">
            <div className="sports-designer__color-grid">
              {tpvColours.map(color => (
                <button
                  key={color.code}
                  className={`sports-designer__color-swatch ${surface.color.tpv_code === color.code ? 'sports-designer__color-swatch--selected' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => {
                    handleSurfaceColorSelect(color);
                    setMobileColoursOpen(false);
                  }}
                  title={`${color.code} - ${color.name}`}
                >
                  <span className="sports-designer__color-code">{color.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Sheet - Properties */}
        <div
          className={`sports-designer__bottom-sheet-overlay ${mobilePropertiesOpen ? 'sports-designer__bottom-sheet-overlay--open' : ''}`}
          onClick={() => setMobilePropertiesOpen(false)}
        />
        <div className={`sports-designer__bottom-sheet ${mobilePropertiesOpen ? 'sports-designer__bottom-sheet--open' : ''}`}>
          <div className="sports-designer__bottom-sheet-handle" />
          <div className="sports-designer__bottom-sheet-header">
            <h3>Properties</h3>
            <button
              className="sports-designer__bottom-sheet-close"
              onClick={() => setMobilePropertiesOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="sports-designer__bottom-sheet-content">
            {(selectedCourtId || selectedTrackId || selectedMotifId || selectedShapeId || selectedTextId) && (
              <PropertiesPanel
                mobileMode={true}
                onEditSourceDesign={handleEditSourceDesign}
              />
            )}
          </div>
        </div>

        {/* Main Content Area */}
          <div className="sports-designer__content">
            {/* Layers Sidebar - collapsible, hidden in standalone mode */}
            {!standaloneMode && (
              <aside className={`sports-designer__sidebar ${showCourtLibrary ? '' : 'sports-designer__sidebar--collapsed'}`}>
                <div className="sidebar-content">
                  {/* Add Element Button */}
                  <div className="sidebar-add-element">
                    <button
                      className="sidebar-add-element__btn"
                      onClick={() => setShowCourtModal(true)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                      Add Courts & Designs
                    </button>
                  </div>
                  <LayersPanel />
                </div>
                {/* Collapse/Expand toggle button */}
                <button
                  className="sidebar-toggle sidebar-toggle--left"
                  onClick={toggleCourtLibrary}
                  title={showCourtLibrary ? 'Collapse panel' : 'Expand panel'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showCourtLibrary ? (
                      <polyline points="15 18 9 12 15 6" />
                    ) : (
                      <polyline points="9 18 15 12 9 6" />
                    )}
                  </svg>
                </button>
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
                    className={`sports-toolbar__btn ${showPropertiesPanel && (selectedCourtId || selectedTrackId || selectedMotifId || selectedShapeId || selectedTextId) ? 'sports-toolbar__btn--active' : ''}`}
                    onClick={togglePropertiesPanel}
                    title="Properties"
                    disabled={(!selectedCourtId && !selectedTrackId && !selectedMotifId && !selectedShapeId && !selectedTextId) || standaloneMode}
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

                {/* Elements Dropdown */}
                <div className="sports-toolbar__group" style={{ position: 'relative' }}>
                  <button
                    className={`sports-toolbar__btn sports-toolbar__btn--with-label ${showElementsMenu ? 'sports-toolbar__btn--active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setShowElementsMenu(!showElementsMenu); }}
                    title="Add Elements"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                    <span>Elements</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {showElementsMenu && (
                    <div
                      className="sports-toolbar__dropdown-menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="sports-toolbar__dropdown-item"
                        onClick={() => { addText(); setShowElementsMenu(false); }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 7V4h16v3" />
                          <path d="M12 4v16" />
                          <path d="M8 20h8" />
                        </svg>
                        <span>Text</span>
                        <span className="sports-toolbar__dropdown-shortcut">T</span>
                      </button>
                      <button
                        className="sports-toolbar__dropdown-item"
                        onClick={() => { addShape('rectangle'); setShowElementsMenu(false); }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                        </svg>
                        <span>Shape</span>
                        <span className="sports-toolbar__dropdown-shortcut">S</span>
                      </button>
                      <button
                        className="sports-toolbar__dropdown-item"
                        onClick={() => { addShape('blob'); setShowElementsMenu(false); }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3c-4 0-7 3-8 6s0 6 2 8c2 2 5 3 8 2s5-3 6-6-1-6-3-8c-1-1-3-2-5-2z" />
                        </svg>
                        <span>Blob</span>
                        <span className="sports-toolbar__dropdown-shortcut">B</span>
                      </button>
                      <button
                        className={`sports-toolbar__dropdown-item ${pathDrawingMode ? 'sports-toolbar__dropdown-item--active' : ''}`}
                        onClick={() => { startPathDrawing(); setShowElementsMenu(false); }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 19l7-7 3 3-7 7-3-3z" />
                          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                          <path d="M2 2l7.586 7.586" />
                        </svg>
                        <span>Pen</span>
                        <span className="sports-toolbar__dropdown-shortcut">P</span>
                      </button>
                      <div className="sports-toolbar__dropdown-divider" />
                      <button
                        className="sports-toolbar__dropdown-item sports-toolbar__dropdown-item--exclusion"
                        onClick={() => { addExclusionZone('rectangle'); setShowElementsMenu(false); }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                        <span>Exclusion Zone</span>
                        <span className="sports-toolbar__dropdown-shortcut">E</span>
                      </button>
                    </div>
                  )}
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

                {/* Group/Ungroup - only show when relevant */}
                {(selectedElementIds.length >= 2 || selectedGroupId) && (
                  <>
                    <div className="sports-toolbar__divider" />
                    <div className="sports-toolbar__group">
                      {selectedElementIds.length >= 2 && (
                        <button
                          className="sports-toolbar__btn"
                          onClick={groupSelected}
                          title="Group selected elements (Cmd+G)"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                            <path d="M10 7h4" />
                            <path d="M10 17h4" />
                            <path d="M7 10v4" />
                            <path d="M17 10v4" />
                          </svg>
                        </button>
                      )}
                      {selectedGroupId && (
                        <button
                          className="sports-toolbar__btn"
                          onClick={() => ungroup(selectedGroupId)}
                          title="Ungroup (Cmd+Shift+G)"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                            <path d="M10 7h4" strokeDasharray="2 2" />
                            <path d="M10 17h4" strokeDasharray="2 2" />
                            <path d="M7 10v4" strokeDasharray="2 2" />
                            <path d="M17 10v4" strokeDasharray="2 2" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Alignment dropdown - only when 2+ elements selected */}
                    {selectedElementIds.length >= 2 && (
                      <div className="sports-toolbar__align-dropdown" style={{ position: 'relative' }}>
                        <button
                          className={`sports-toolbar__btn ${showAlignMenu ? 'sports-toolbar__btn--active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); setShowAlignMenu(!showAlignMenu); }}
                          title="Align elements"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="21" y1="10" x2="3" y2="10" />
                            <line x1="21" y1="6" x2="3" y2="6" />
                            <line x1="21" y1="14" x2="3" y2="14" />
                            <line x1="21" y1="18" x2="3" y2="18" />
                          </svg>
                        </button>
                        {showAlignMenu && (
                          <div
                            className="sports-toolbar__align-menu"
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              marginTop: '4px',
                              background: 'white',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              padding: '8px',
                              zIndex: 100,
                              minWidth: '120px'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div style={{ fontSize: '10px', color: '#666', padding: '4px 8px', textTransform: 'uppercase', fontWeight: 600 }}>Align</div>
                            <button
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}
                              onClick={() => { alignElements('left'); setShowAlignMenu(false); }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              ⬅ Left
                            </button>
                            <button
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}
                              onClick={() => { alignElements('center'); setShowAlignMenu(false); }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              ↔ Center
                            </button>
                            <button
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}
                              onClick={() => { alignElements('right'); setShowAlignMenu(false); }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              ➡ Right
                            </button>
                            <div style={{ height: '1px', background: '#e5e7eb', margin: '4px 0' }} />
                            <button
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}
                              onClick={() => { alignElements('top'); setShowAlignMenu(false); }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              ⬆ Top
                            </button>
                            <button
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}
                              onClick={() => { alignElements('middle'); setShowAlignMenu(false); }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              ↕ Middle
                            </button>
                            <button
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}
                              onClick={() => { alignElements('bottom'); setShowAlignMenu(false); }}
                              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              ⬇ Bottom
                            </button>
                            {selectedElementIds.length >= 3 && (
                              <>
                                <div style={{ height: '1px', background: '#e5e7eb', margin: '4px 0' }} />
                                <div style={{ fontSize: '10px', color: '#666', padding: '4px 8px', textTransform: 'uppercase', fontWeight: 600 }}>Distribute</div>
                                <button
                                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}
                                  onClick={() => { distributeElements('horizontal'); setShowAlignMenu(false); }}
                                  onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  ⇔ Horizontal
                                </button>
                                <button
                                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}
                                  onClick={() => { distributeElements('vertical'); setShowAlignMenu(false); }}
                                  onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  ⇕ Vertical
                                </button>
                                <div style={{ height: '1px', background: '#e5e7eb', margin: '4px 0' }} />
                                <div style={{ fontSize: '10px', color: '#666', padding: '4px 8px', textTransform: 'uppercase', fontWeight: 600 }}>Distribute Centres</div>
                                <button
                                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}
                                  onClick={() => { distributeElements('center-horizontal'); setShowAlignMenu(false); }}
                                  onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  ⊕ Centres H
                                </button>
                                <button
                                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}
                                  onClick={() => { distributeElements('center-vertical'); setShowAlignMenu(false); }}
                                  onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  ⊕ Centres V
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

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
              <ShapeToolbar />
            </main>

            {/* Properties Panel - collapsible, shown when element selected and not in standalone mode */}
            {(selectedCourtId || selectedTrackId || selectedMotifId || selectedShapeId || selectedTextId) && !standaloneMode && (
              <aside className={`sports-designer__properties ${showPropertiesPanel ? '' : 'sports-designer__properties--collapsed'}`}>
                {/* Collapse/Expand toggle button */}
                <button
                  className="sidebar-toggle sidebar-toggle--right"
                  onClick={togglePropertiesPanel}
                  title={showPropertiesPanel ? 'Collapse properties' : 'Expand properties'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPropertiesPanel ? (
                      <polyline points="9 18 15 12 9 6" />
                    ) : (
                      <polyline points="15 18 9 12 15 6" />
                    )}
                  </svg>
                </button>
                <div className="sidebar-content">
                  <PropertiesPanel onEditSourceDesign={handleEditSourceDesign} />
                </div>
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

          {/* Court Library Modal */}
          <CourtLibraryModal
            isOpen={showCourtModal}
            onClose={() => setShowCourtModal(false)}
            onOpenGenerator={() => setShowDesignEditor(true)}
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
