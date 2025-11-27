// TPV Studio - Court Library Component
import React, { useState } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { getAllCourtTemplates, getCourtTemplate } from '../../lib/sports/courtTemplates.js';
import { getAllTrackTemplates, getTrackTemplate } from '../../lib/sports/trackTemplates.js';
import './CourtLibrary.css';

function CourtLibrary() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [activeTab, setActiveTab] = useState('courts'); // 'courts' or 'tracks'

  const { addCourt, addTrack } = useSportsDesignStore();

  const templates = getAllCourtTemplates();
  const trackTemplates = getAllTrackTemplates();

  const handleAddCourt = (templateId) => {
    const template = getCourtTemplate(templateId);
    if (template) {
      addCourt(templateId, template);
    }
  };

  const handleAddTrack = (templateId) => {
    const template = getTrackTemplate(templateId);
    if (template) {
      addTrack(templateId, template);
    }
  };

  return (
    <div className="court-library">
      <div className="court-library__header">
        <h2>{activeTab === 'courts' ? 'Court Library' : 'Track Library'}</h2>
        <p>{activeTab === 'courts' ? 'Select a court to add to your surface' : 'Select a running track to add to your surface'}</p>
      </div>

      {/* Tabs */}
      <div className="court-library__tabs">
        <button
          className={`court-library__tab ${activeTab === 'courts' ? 'court-library__tab--active' : ''}`}
          onClick={() => {
            setActiveTab('courts');
            setSelectedTemplateId(null);
          }}
        >
          Courts
        </button>
        <button
          className={`court-library__tab ${activeTab === 'tracks' ? 'court-library__tab--active' : ''}`}
          onClick={() => {
            setActiveTab('tracks');
            setSelectedTemplateId(null);
          }}
        >
          Tracks
        </button>
      </div>

      <div className="court-library__list">
        {/* Courts View */}
        {activeTab === 'courts' && templates.map(template => (
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
              <div className="court-library__name">{template.name}</div>
              <div className="court-library__dimensions">
                {(template.dimensions.width_mm / 1000).toFixed(1)}m × {(template.dimensions.length_mm / 1000).toFixed(1)}m
              </div>
              <div className="court-library__standard">{template.standard}</div>
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
                + ADD
              </button>
            )}
          </div>
        ))}

        {/* Tracks View */}
        {activeTab === 'tracks' && trackTemplates.map(template => (
          <div
            key={template.id}
            className={`court-library__item ${selectedTemplateId === template.id ? 'court-library__item--selected' : ''}`}
            onClick={() => setSelectedTemplateId(template.id)}
            onDoubleClick={() => handleAddTrack(template.id)}
          >
            {/* Preview Thumbnail */}
            <div className="court-library__preview">
              <TrackPreview template={template} />
            </div>

            {/* Track Info */}
            <div className="court-library__info">
              <div className="court-library__name">{template.name}</div>
              <div className="court-library__standard">{template.parameters.numLanes} Lanes • {template.standard}</div>
              <div className="court-library__note">Scales to fit canvas</div>
            </div>

            {/* Add Button */}
            {selectedTemplateId === template.id && (
              <button
                className="court-library__add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddTrack(template.id);
                }}
              >
                + ADD
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="court-library__footer">
        <p className="court-library__hint">
          💡 {activeTab === 'courts' ? 'Double-click a court to add it instantly' : 'Double-click a track to add it instantly'}
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

  // Scale to fit in 62x62 preview box (64px - 2px padding)
  const scale = Math.min(62 / width, 62 / height);
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return (
    <svg
      width="62"
      height="62"
      viewBox={`0 0 62 62`}
      className="court-library__svg-preview"
    >
      {/* Background */}
      <rect
        x={(62 - scaledWidth) / 2}
        y={(62 - scaledHeight) / 2}
        width={scaledWidth}
        height={scaledHeight}
        fill="#e5e7eb"
        stroke="#9ca3af"
        strokeWidth="1.5"
      />

      {/* Show all markings for accurate preview */}
      {template.markings.map((marking, idx) => (
        <CourtMarkingPreview
          key={idx}
          marking={marking}
          scale={scale}
          offsetX={(62 - scaledWidth) / 2}
          offsetY={(62 - scaledHeight) / 2}
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
          stroke="#1e293b"
          strokeWidth="1.5"
        />
      );

    case 'rectangle':
      return (
        <rect
          x={params.x * scale + offsetX}
          y={params.y * scale + offsetY}
          width={params.width * scale}
          height={params.height * scale}
          stroke="#1e293b"
          strokeWidth="1.5"
          fill="none"
        />
      );

    case 'circle': {
      return (
        <circle
          cx={params.cx * scale + offsetX}
          cy={params.cy * scale + offsetY}
          r={params.radius * scale}
          stroke="#1e293b"
          strokeWidth="1.5"
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
          stroke="#1e293b"
          strokeWidth="1.5"
          fill="none"
        />
      );
    }

    default:
      return null;
  }
}

/**
 * Track preview component
 * Renders a simplified SVG preview of a rounded rectangle track
 */
function TrackPreview({ template }) {
  const { parameters } = template;
  const width = parameters.width_mm;
  const height = parameters.height_mm;

  // Scale to fit in 62x62 preview box
  const scale = Math.min(58 / width, 58 / height);
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  // Calculate lane positions for preview
  const numLanes = parameters.numLanes;
  const laneWidth = parameters.laneWidth_mm * scale;

  // Get corner radius (use uniform value for preview simplicity)
  const cornerRadius = parameters.cornerRadius;
  const avgCornerRadius = (cornerRadius.topLeft + cornerRadius.topRight +
    cornerRadius.bottomLeft + cornerRadius.bottomRight) / 4;
  const scaledCornerRadius = avgCornerRadius * scale;

  const offsetX = (62 - scaledWidth) / 2;
  const offsetY = (62 - scaledHeight) / 2;

  return (
    <svg
      width="62"
      height="62"
      viewBox={`0 0 62 62`}
      className="court-library__svg-preview"
    >
      {/* Background */}
      <rect
        x={offsetX}
        y={offsetY}
        width={scaledWidth}
        height={scaledHeight}
        rx={scaledCornerRadius}
        fill="#e5e7eb"
      />

      {/* Render simplified track lanes - concentric rounded rectangles */}
      {Array.from({ length: numLanes }).map((_, i) => {
        const inset = i * laneWidth;
        const laneRx = Math.max(0, scaledCornerRadius - inset);

        return (
          <rect
            key={i}
            x={offsetX + inset}
            y={offsetY + inset}
            width={Math.max(0, scaledWidth - (inset * 2))}
            height={Math.max(0, scaledHeight - (inset * 2))}
            rx={laneRx}
            stroke="#1e293b"
            strokeWidth="1"
            fill="none"
          />
        );
      })}
    </svg>
  );
}

export default CourtLibrary;
