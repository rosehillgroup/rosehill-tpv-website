// TPV Studio - Shape & Text Toolbar Component
// Floating toolbar for adding shapes and text to the canvas

import React, { useState } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import './ShapeToolbar.css';

function ShapeToolbar() {
  const { addShape, addText, standaloneMode } = useSportsDesignStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't show in standalone mode
  if (standaloneMode) return null;

  const shapePresets = [
    { preset: 'rectangle', icon: '▭', label: 'Rectangle' },
    { preset: 'square', icon: '□', label: 'Square' },
    { preset: 'circle', icon: '○', label: 'Circle' },
    { preset: 'triangle', icon: '△', label: 'Triangle' },
    { preset: 'hexagon', icon: '⬡', label: 'Hexagon' },
    { preset: 'pentagon', icon: '⬠', label: 'Pentagon' },
    { preset: 'blob', icon: '◐', label: 'Blob' }
  ];

  const handleAddShape = (preset) => {
    addShape(preset);
    // Keep toolbar open for easy multi-shape addition
  };

  const handleAddText = () => {
    addText();
    // Text is added in editing mode, so close toolbar
    setIsExpanded(false);
  };

  return (
    <div className={`shape-toolbar ${isExpanded ? 'shape-toolbar--expanded' : ''}`}>
      {/* Toggle Button */}
      <button
        className="shape-toolbar__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? 'Collapse elements panel' : 'Add elements'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
        {!isExpanded && <span className="shape-toolbar__label">Elements</span>}
      </button>

      {/* Element Buttons (shown when expanded) */}
      {isExpanded && (
        <div className="shape-toolbar__shapes">
          {/* Text Button */}
          <button
            className="shape-toolbar__btn shape-toolbar__btn--text"
            onClick={handleAddText}
            title="Add Text Label"
          >
            <span className="shape-toolbar__icon">T</span>
            <span className="shape-toolbar__name">Text</span>
          </button>

          {/* Divider */}
          <div className="shape-toolbar__divider" />

          {/* Shape Buttons */}
          {shapePresets.map((shape) => (
            <button
              key={shape.preset}
              className="shape-toolbar__btn"
              onClick={() => handleAddShape(shape.preset)}
              title={`Add ${shape.label}`}
            >
              <span className="shape-toolbar__icon">{shape.icon}</span>
              <span className="shape-toolbar__name">{shape.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShapeToolbar;
