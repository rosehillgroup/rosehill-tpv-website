// TPV Studio - Layers Panel Component
// Displays all courts and tracks in a draggable list for layer ordering
import React, { useState, useEffect } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';

/**
 * LayersPanel Component
 * Shows all elements (courts and tracks) in layer order with drag-to-reorder
 *
 * Elements are displayed top-to-bottom (top layer first visually)
 * but stored bottom-to-top in elementOrder array
 */
function LayersPanel() {
  const {
    courts,
    tracks,
    motifs,
    shapes,
    texts,
    elementOrder,
    selectedCourtId,
    selectedTrackId,
    selectedMotifId,
    selectedShapeId,
    selectedTextId,
    setElementOrder,
    selectCourt,
    selectTrack,
    selectMotif,
    selectShape,
    selectText,
    bringToFront,
    sendToBack,
    duplicateCourt,
    duplicateTrack,
    duplicateMotif,
    duplicateShape,
    duplicateText,
    removeCourt,
    removeTrack,
    removeMotif,
    removeShape,
    removeText,
    renameElement,
    toggleElementLock,
    toggleElementVisibility,
    addToHistory
  } = useSportsDesignStore();

  // Drag state
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  // Overflow menu state
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Rename state
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    if (menuOpenId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuOpenId]);

  // Display order is reversed (top layer appears first in UI)
  const displayOrder = [...elementOrder].reverse();

  // Get element details
  const getElementInfo = (elementId) => {
    if (elementId.startsWith('court-')) {
      const court = courts[elementId];
      return {
        type: 'court',
        name: court?.customName || court?.template?.name || 'Unknown Court',
        icon: '🏀',
        sport: court?.template?.sport || '',
        locked: court?.locked || false,
        visible: court?.visible !== false // Default to true
      };
    } else if (elementId.startsWith('track-')) {
      const track = tracks[elementId];
      return {
        type: 'track',
        name: track?.customName || track?.template?.name || 'Unknown Track',
        icon: '🏃',
        sport: 'athletics',
        locked: track?.locked || false,
        visible: track?.visible !== false
      };
    } else if (elementId.startsWith('motif-')) {
      const motif = motifs[elementId];
      return {
        type: 'motif',
        name: motif?.customName || motif?.sourceDesignName || 'Unknown Motif',
        icon: '🎨',
        sport: 'playground',
        locked: motif?.locked || false,
        visible: motif?.visible !== false
      };
    } else if (elementId.startsWith('shape-')) {
      const shape = shapes[elementId];
      const shapeName = shape?.sides >= 32 ? 'Circle' : shape?.sides === 3 ? 'Triangle' : shape?.sides === 4 ? 'Rectangle' : `${shape?.sides}-gon`;
      return {
        type: 'shape',
        name: shape?.customName || shapeName || 'Unknown Shape',
        icon: shape?.sides >= 32 ? '○' : shape?.sides === 3 ? '△' : shape?.sides === 4 ? '□' : '⬡',
        sport: 'shape',
        locked: shape?.locked || false,
        visible: shape?.visible !== false
      };
    } else if (elementId.startsWith('text-')) {
      const text = texts[elementId];
      const displayContent = text?.content || 'Text Label';
      const truncatedName = displayContent.length > 20 ? displayContent.substring(0, 20) + '...' : displayContent;
      return {
        type: 'text',
        name: text?.customName || truncatedName,
        icon: 'T',
        sport: 'text',
        locked: text?.locked || false,
        visible: text?.visible !== false
      };
    }
    return { type: 'unknown', name: 'Unknown', icon: '❓', sport: '', locked: false, visible: true };
  };

  // Check if element is selected
  const isSelected = (elementId) => {
    return elementId === selectedCourtId || elementId === selectedTrackId || elementId === selectedMotifId || elementId === selectedShapeId || elementId === selectedTextId;
  };

  // Handle element selection
  const handleSelect = (elementId) => {
    if (elementId.startsWith('court-')) {
      selectCourt(elementId);
    } else if (elementId.startsWith('track-')) {
      selectTrack(elementId);
    } else if (elementId.startsWith('motif-')) {
      selectMotif(elementId);
    } else if (elementId.startsWith('shape-')) {
      selectShape(elementId);
    } else if (elementId.startsWith('text-')) {
      selectText(elementId);
    }
  };

  // Drag handlers
  const handleDragStart = (e, elementId) => {
    setDraggedId(elementId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', elementId);

    // Add dragging class after a tick
    setTimeout(() => {
      e.target.classList.add('layer-item--dragging');
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('layer-item--dragging');
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragOver = (e, elementId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (elementId !== draggedId) {
      setDragOverId(elementId);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();

    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    // Reorder: move dragged item to target position
    // Remember: displayOrder is reversed from elementOrder
    const newElementOrder = [...elementOrder];

    // Find indices in the actual elementOrder array
    const draggedIndex = newElementOrder.indexOf(draggedId);
    const targetIndex = newElementOrder.indexOf(targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Remove dragged item
    newElementOrder.splice(draggedIndex, 1);

    // Insert at new position
    // Since display is reversed, we need to adjust:
    // - Dropping "above" in UI = higher index in elementOrder (toward end)
    // - Dropping "below" in UI = lower index in elementOrder (toward start)
    const displayDraggedIndex = displayOrder.indexOf(draggedId);
    const displayTargetIndex = displayOrder.indexOf(targetId);

    if (displayDraggedIndex < displayTargetIndex) {
      // Dragged down in display = move toward start of elementOrder
      newElementOrder.splice(targetIndex, 0, draggedId);
    } else {
      // Dragged up in display = move toward end of elementOrder
      newElementOrder.splice(targetIndex, 0, draggedId);
    }

    setElementOrder(newElementOrder);
    addToHistory();

    setDraggedId(null);
    setDragOverId(null);
  };

  // Quick actions
  const handleBringToFront = (e, elementId) => {
    e.stopPropagation();
    bringToFront(elementId);
    setMenuOpenId(null);
  };

  const handleSendToBack = (e, elementId) => {
    e.stopPropagation();
    sendToBack(elementId);
    setMenuOpenId(null);
  };

  const handleDuplicate = (e, elementId) => {
    e.stopPropagation();
    if (elementId.startsWith('court-')) {
      duplicateCourt(elementId);
    } else if (elementId.startsWith('track-')) {
      duplicateTrack(elementId);
    } else if (elementId.startsWith('motif-')) {
      duplicateMotif(elementId);
    } else if (elementId.startsWith('shape-')) {
      duplicateShape(elementId);
    } else if (elementId.startsWith('text-')) {
      duplicateText(elementId);
    }
    setMenuOpenId(null);
  };

  const handleDelete = (e, elementId) => {
    e.stopPropagation();
    const info = getElementInfo(elementId);
    if (confirm(`Delete "${info.name}"?`)) {
      if (elementId.startsWith('court-')) {
        removeCourt(elementId);
      } else if (elementId.startsWith('track-')) {
        removeTrack(elementId);
      } else if (elementId.startsWith('motif-')) {
        removeMotif(elementId);
      } else if (elementId.startsWith('shape-')) {
        removeShape(elementId);
      } else if (elementId.startsWith('text-')) {
        removeText(elementId);
      }
    }
    setMenuOpenId(null);
  };

  const handleStartRename = (e, elementId) => {
    e.stopPropagation();
    const info = getElementInfo(elementId);
    setRenamingId(elementId);
    setRenameValue(info.name);
    setMenuOpenId(null);
  };

  const handleRenameSubmit = (elementId) => {
    if (renameValue.trim()) {
      renameElement(elementId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const handleRenameKeyDown = (e, elementId) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(elementId);
    } else if (e.key === 'Escape') {
      setRenamingId(null);
      setRenameValue('');
    }
  };

  const handleToggleLock = (e, elementId) => {
    e.stopPropagation();
    toggleElementLock(elementId);
    setMenuOpenId(null);
  };

  const handleToggleVisibility = (e, elementId) => {
    e.stopPropagation();
    toggleElementVisibility(elementId);
    setMenuOpenId(null);
  };

  const handleMenuToggle = (e, elementId) => {
    e.stopPropagation();
    setMenuOpenId(menuOpenId === elementId ? null : elementId);
  };

  if (elementOrder.length === 0) {
    return (
      <div className="layers-panel layers-panel--empty">
        <div className="layers-panel__empty-state">
          <span className="layers-panel__empty-icon">📑</span>
          <p>No elements yet</p>
          <span className="layers-panel__empty-hint">
            Add courts, tracks, motifs, shapes, or text
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="layers-panel">
      <div className="layers-panel__header">
        <h4>Layers</h4>
        <span className="layers-panel__count">{elementOrder.length}</span>
      </div>

      <div className="layers-panel__hint">
        Drag to reorder layers. Top = front, bottom = back.
      </div>

      <div className="layers-panel__list">
        {displayOrder.map((elementId, displayIndex) => {
          const info = getElementInfo(elementId);
          const selected = isSelected(elementId);
          const isDragOver = elementId === dragOverId;
          const isFirst = displayIndex === 0; // Top layer
          const isLast = displayIndex === displayOrder.length - 1; // Bottom layer
          const isRenaming = renamingId === elementId;

          return (
            <div
              key={elementId}
              className={`layer-item ${selected ? 'layer-item--selected' : ''} ${isDragOver ? 'layer-item--drag-over' : ''} ${info.locked ? 'layer-item--locked' : ''} ${!info.visible ? 'layer-item--hidden' : ''}`}
              draggable={!info.locked && !isRenaming}
              onDragStart={(e) => handleDragStart(e, elementId)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, elementId)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, elementId)}
              onClick={() => !isRenaming && handleSelect(elementId)}
            >
              {/* Drag Handle */}
              <span
                className={`layer-item__handle ${info.locked ? 'layer-item__handle--disabled' : ''}`}
                title={info.locked ? 'Locked' : 'Drag to reorder'}
              >
                {info.locked ? '🔒' : '≡'}
              </span>

              {/* Element Name or Rename Input */}
              {isRenaming ? (
                <input
                  type="text"
                  className="layer-item__rename-input"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => handleRenameSubmit(elementId)}
                  onKeyDown={(e) => handleRenameKeyDown(e, elementId)}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className={`layer-item__name ${!info.visible ? 'layer-item__name--hidden' : ''}`}>
                  {info.name}
                </span>
              )}

              {/* Status Indicators */}
              <div className="layer-item__indicators">
                {!info.visible && <span className="layer-item__indicator" title="Hidden">👁‍🗨</span>}
              </div>

              {/* Quick Actions - Overflow Menu */}
              <div className="layer-item__actions">
                <button
                  className="layer-item__menu-btn"
                  onClick={(e) => handleMenuToggle(e, elementId)}
                  title="More actions"
                >
                  ⋮
                </button>

                {menuOpenId === elementId && (
                  <div className="layer-item__menu">
                    <button
                      onClick={(e) => handleBringToFront(e, elementId)}
                      disabled={isFirst}
                    >
                      ⬆ Bring to Front
                    </button>
                    <button
                      onClick={(e) => handleSendToBack(e, elementId)}
                      disabled={isLast}
                    >
                      ⬇ Send to Back
                    </button>
                    <div className="layer-item__menu-divider" />
                    <button onClick={(e) => handleDuplicate(e, elementId)}>
                      📋 Duplicate
                    </button>
                    <button onClick={(e) => handleStartRename(e, elementId)}>
                      ✏️ Rename
                    </button>
                    <div className="layer-item__menu-divider" />
                    <button onClick={(e) => handleToggleLock(e, elementId)}>
                      {info.locked ? '🔓 Unlock' : '🔒 Lock'}
                    </button>
                    <button onClick={(e) => handleToggleVisibility(e, elementId)}>
                      {info.visible ? '👁‍🗨 Hide' : '👁 Show'}
                    </button>
                    <div className="layer-item__menu-divider" />
                    <button
                      onClick={(e) => handleDelete(e, elementId)}
                      className="layer-item__menu-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="layers-panel__footer">
        <span className="layers-panel__shortcut-hint">
          Tip: Use [ and ] keys to reorder selected element
        </span>
      </div>
    </div>
  );
}

export default LayersPanel;
