// TPV Studio - Court Library Component
import React, { useState } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { getAllCourtTemplates, getCourtTemplate } from '../../lib/sports/courtTemplates.js';
import './CourtLibrary.css';

function CourtLibrary() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const { addCourt } = useSportsDesignStore();

  const templates = getAllCourtTemplates();

  const handleAddCourt = (templateId) => {
    const template = getCourtTemplate(templateId);
    if (template) {
      addCourt(templateId, template);
    }
  };

  return (
    <div className="court-library">
      <div className="court-library__header">
        <h2>Court Library</h2>
        <p>Select a court to add to your surface</p>
      </div>

      <div className="court-library__list">
        {templates.map(template => (
          <div
            key={template.id}
            className={`court-library__item ${selectedTemplateId === template.id ? 'court-library__item--selected' : ''}`}
            onClick={() => setSelectedTemplateId(template.id)}
            onDoubleClick={() => handleAddCourt(template.id)}
          >
            {/* Preview Thumbnail */}
            <div className="court-library__preview">
              <CourtPreview template={template} />
            </div>

            {/* Court Info */}
            <div className="court-library__info">
              <h3 className="court-library__name">{template.name}</h3>
              <p className="court-library__dimensions">
                {(template.dimensions.width_mm / 1000).toFixed(1)}m × {(template.dimensions.length_mm / 1000).toFixed(1)}m
              </p>
              <p className="court-library__standard">{template.standard}</p>
            </div>

            {/* Add Button */}
            {selectedTemplateId === template.id && (
              <button
                className="court-library__add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddCourt(template.id);
                }}
              >
                + Add to Surface
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="court-library__footer">
        <p className="court-library__hint">
          💡 Double-click a court to add it instantly
        </p>
      </div>
    </div>
  );
}

/**
 * Simple court preview component
 * Renders a simplified SVG preview of the court
 */
function CourtPreview({ template }) {
  const width = template.dimensions.width_mm;
  const height = template.dimensions.length_mm;

  // Scale to fit in 120x120 preview box
  const scale = Math.min(110 / width, 110 / height);
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return (
    <svg
      width="120"
      height="120"
      viewBox={`0 0 120 120`}
      className="court-library__svg-preview"
    >
      {/* Background */}
      <rect
        x={(120 - scaledWidth) / 2}
        y={(120 - scaledHeight) / 2}
        width={scaledWidth}
        height={scaledHeight}
        fill="#e8f5e9"
        stroke="#006C55"
        strokeWidth="1"
      />

      {/* Simplified markings (just show boundary and a few key lines) */}
      {template.markings.slice(0, 5).map((marking, idx) => (
        <CourtMarkingPreview
          key={idx}
          marking={marking}
          scale={scale}
          offsetX={(120 - scaledWidth) / 2}
          offsetY={(120 - scaledHeight) / 2}
        />
      ))}
    </svg>
  );
}

/**
 * Render a single marking in the preview
 */
function CourtMarkingPreview({ marking, scale, offsetX, offsetY }) {
  const { type, params } = marking;

  switch (type) {
    case 'line':
      return (
        <line
          x1={params.x1 * scale + offsetX}
          y1={params.y1 * scale + offsetY}
          x2={params.x2 * scale + offsetX}
          y2={params.y2 * scale + offsetY}
          stroke="#fff"
          strokeWidth="1"
        />
      );

    case 'rectangle':
      return (
        <rect
          x={params.x * scale + offsetX}
          y={params.y * scale + offsetY}
          width={params.width * scale}
          height={params.height * scale}
          stroke="#fff"
          strokeWidth="1"
          fill="none"
        />
      );

    case 'circle': {
      return (
        <circle
          cx={params.cx * scale + offsetX}
          cy={params.cy * scale + offsetY}
          r={params.radius * scale}
          stroke="#fff"
          strokeWidth="1"
          fill="none"
        />
      );
    }

    case 'arc': {
      const { cx, cy, radius, startAngle, endAngle } = params;
      const start = (startAngle * Math.PI) / 180;
      const end = (endAngle * Math.PI) / 180;

      const x1 = (cx + radius * Math.cos(start)) * scale + offsetX;
      const y1 = (cy + radius * Math.sin(start)) * scale + offsetY;
      const x2 = (cx + radius * Math.cos(end)) * scale + offsetX;
      const y2 = (cy + radius * Math.sin(end)) * scale + offsetY;

      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
      const pathData = `M ${x1} ${y1} A ${radius * scale} ${radius * scale} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

      return (
        <path
          d={pathData}
          stroke="#fff"
          strokeWidth="1"
          fill="none"
        />
      );
    }

    default:
      return null;
  }
}

export default CourtLibrary;
