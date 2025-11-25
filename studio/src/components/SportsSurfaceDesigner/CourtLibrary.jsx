// TPV Studio - Court Library Component
import React, { useState } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { getAllCourtTemplates, getCourtTemplate } from '../../lib/sports/courtTemplates.js';
import { getAllMUGAPresets, checkMUGACompatibility } from '../../lib/sports/mugaPresets.js';
import './CourtLibrary.css';

function CourtLibrary() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedMUGAId, setSelectedMUGAId] = useState(null);
  const [activeTab, setActiveTab] = useState('courts'); // 'courts' or 'mugas'

  const { addCourt, addMUGAPreset, surface } = useSportsDesignStore();

  const templates = getAllCourtTemplates();
  const mugaPresets = getAllMUGAPresets();

  const handleAddCourt = (templateId) => {
    const template = getCourtTemplate(templateId);
    if (template) {
      addCourt(templateId, template);
    }
  };

  const handleAddMUGA = (preset) => {
    addMUGAPreset(preset);
    setSelectedMUGAId(null);
  };

  return (
    <div className="court-library">
      <div className="court-library__header">
        <h2>Court Library</h2>
        <p>Select a court or MUGA to add to your surface</p>

        {/* Tab Selector */}
        <div className="court-library__tabs">
          <button
            className={`court-library__tab ${activeTab === 'courts' ? 'court-library__tab--active' : ''}`}
            onClick={() => setActiveTab('courts')}
          >
            Single Courts
          </button>
          <button
            className={`court-library__tab ${activeTab === 'mugas' ? 'court-library__tab--active' : ''}`}
            onClick={() => setActiveTab('mugas')}
          >
            MUGA Presets
          </button>
        </div>
      </div>

      {/* Single Courts View */}
      {activeTab === 'courts' && (
        <>
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
          </div>

          <div className="court-library__footer">
            <p className="court-library__hint">
              💡 Double-click a court to add it instantly
            </p>
          </div>
        </>
      )}

      {/* MUGA Presets View */}
      {activeTab === 'mugas' && (
        <>
          <div className="court-library__list">
            {mugaPresets.map(preset => {
              const compatibility = checkMUGACompatibility(
                preset,
                surface.width_mm,
                surface.length_mm
              );

              return (
                <div
                  key={preset.id}
                  className={`court-library__muga-item ${selectedMUGAId === preset.id ? 'court-library__muga-item--selected' : ''}`}
                  onClick={() => setSelectedMUGAId(preset.id)}
                >
                  {/* MUGA Info */}
                  <div className="muga-info">
                    <div className="muga-info__name">{preset.name}</div>
                    <div className="muga-info__description">{preset.description}</div>
                    <div className="muga-info__dimensions">
                      Recommended: {(preset.recommendedSurface.width_mm / 1000).toFixed(1)}m × {(preset.recommendedSurface.length_mm / 1000).toFixed(1)}m
                    </div>

                    {/* Compatibility Badge */}
                    <div className={`muga-compatibility muga-compatibility--${compatibility.status}`}>
                      {compatibility.status === 'optimal' && '✓ Perfect Fit'}
                      {compatibility.status === 'compatible' && '⚠ Will Fit'}
                      {compatibility.status === 'incompatible' && '✗ Too Small'}
                    </div>

                    {/* Color Scheme */}
                    <div className="muga-color-scheme">
                      {preset.colorScheme.map((item, idx) => (
                        <div key={idx} className="muga-color-item">
                          <span className="muga-color-sport">{item.sport}:</span>
                          <span className="muga-color-name">{item.color}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  {selectedMUGAId === preset.id && (
                    <button
                      className={`court-library__add-btn ${compatibility.status === 'incompatible' ? 'court-library__add-btn--disabled' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (compatibility.status !== 'incompatible') {
                          handleAddMUGA(preset);
                        }
                      }}
                      disabled={compatibility.status === 'incompatible'}
                      title={compatibility.status === 'incompatible' ? compatibility.message : 'Apply MUGA Preset'}
                    >
                      {compatibility.status === 'incompatible' ? 'TOO SMALL' : '+ APPLY MUGA'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="court-library__footer">
            <p className="court-library__hint">
              💡 MUGA presets add multiple courts with different colors
            </p>
          </div>
        </>
      )}
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

export default CourtLibrary;
