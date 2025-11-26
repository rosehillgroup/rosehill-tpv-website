// TPV Studio - Layers Panel Component
// Displays all courts and tracks in a draggable list for layer ordering
import React, { useState } from 'react';
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
    elementOrder,
    selectedCourtId,
    selectedTrackId,
    setElementOrder,
    selectCourt,
    selectTrack,
    bringToFront,
    sendToBack,
    addToHistory
  } = useSportsDesignStore();

  // Drag state
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  // Display order is reversed (top layer appears first in UI)
  const displayOrder = [...elementOrder].reverse();

  // Get element details
  const getElementInfo = (elementId) => {
    if (elementId.startsWith('court-')) {
      const court = courts[elementId];
      return {
        type: 'court',
        name: court?.template?.name || 'Unknown Court',
        icon: '🏀',
        sport: court?.template?.sport || ''
      };
    } else if (elementId.startsWith('track-')) {
      const track = tracks[elementId];
      return {
        type: 'track',
        name: track?.template?.name || 'Unknown Track',
        icon: '🏃',
        sport: 'athletics'
      };
    }
    return { type: 'unknown', name: 'Unknown', icon: '❓', sport: '' };
  };

  // Check if element is selected
  const isSelected = (elementId) => {
    return elementId === selectedCourtId || elementId === selectedTrackId;
  };

  // Handle element selection
  const handleSelect = (elementId) => {
    if (elementId.startsWith('court-')) {
      selectCourt(elementId);
    } else if (elementId.startsWith('track-')) {
      selectTrack(elementId);
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
  };

  const handleSendToBack = (e, elementId) => {
    e.stopPropagation();
    sendToBack(elementId);
  };

  if (elementOrder.length === 0) {
    return (
      <div className="layers-panel layers-panel--empty">
        <div className="layers-panel__empty-state">
          <span className="layers-panel__empty-icon">📑</span>
          <p>No elements yet</p>
          <span className="layers-panel__empty-hint">
            Add courts or tracks from the library
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

          return (
            <div
              key={elementId}
              className={`layer-item ${selected ? 'layer-item--selected' : ''} ${isDragOver ? 'layer-item--drag-over' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, elementId)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, elementId)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, elementId)}
              onClick={() => handleSelect(elementId)}
            >
              {/* Drag Handle */}
              <span className="layer-item__handle" title="Drag to reorder">
                ≡
              </span>

              {/* Element Icon */}
              <span className="layer-item__icon">{info.icon}</span>

              {/* Element Info */}
              <div className="layer-item__info">
                <span className="layer-item__name">{info.name}</span>
                <span className="layer-item__type">
                  {info.type === 'court' ? 'Court' : 'Track'}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="layer-item__actions">
                <button
                  className="layer-item__action"
                  onClick={(e) => handleBringToFront(e, elementId)}
                  disabled={isFirst}
                  title="Bring to Front"
                >
                  ⬆
                </button>
                <button
                  className="layer-item__action"
                  onClick={(e) => handleSendToBack(e, elementId)}
                  disabled={isLast}
                  title="Send to Back"
                >
                  ⬇
                </button>
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
