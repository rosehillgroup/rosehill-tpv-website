// TPV Studio - Court Library Component
import React, { useState, useEffect } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { getAllCourtTemplates, getCourtTemplate } from '../../lib/sports/courtTemplates.js';
import { getAllTrackTemplates, getTrackTemplate } from '../../lib/sports/trackTemplates.js';
import { listPlaygroundDesigns, fetchMotifFromDesign } from '../../lib/sports/motifUtils.js';
import { showToast } from '../../lib/toast.js';
import './CourtLibrary.css';

function CourtLibrary({ onOpenGenerator, mobileMode = false, modalMode = false, activeTab: externalActiveTab, onItemAdded }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [internalActiveTab, setInternalActiveTab] = useState('courts'); // 'courts', 'tracks', 'shapes', or 'designs'

  // Use external tab in mobile mode, internal tab otherwise
  const activeTab = mobileMode ? externalActiveTab : internalActiveTab;
  const setActiveTab = mobileMode ? () => {} : setInternalActiveTab; // Only allow internal changes in desktop mode

  // Motifs state
  const [playgroundDesigns, setPlaygroundDesigns] = useState([]);
  const [motifsLoading, setMotifsLoading] = useState(false);
  const [motifsError, setMotifsError] = useState(null);
  const [addingMotifId, setAddingMotifId] = useState(null);

  const { addCourt, addTrack, addMotif, addShape, courts, tracks, motifs, shapes } = useSportsDesignStore();

  // Count elements on canvas
  const courtCount = Object.keys(courts).length;
  const trackCount = Object.keys(tracks).length;
  const motifCount = Object.keys(motifs).length;

  const templates = getAllCourtTemplates();
  const trackTemplates = getAllTrackTemplates();

  // Load playground designs when designs tab is active
  useEffect(() => {
    if (activeTab === 'designs' && playgroundDesigns.length === 0 && !motifsLoading) {
      loadPlaygroundDesigns();
    }
  }, [activeTab]);

  const loadPlaygroundDesigns = async () => {
    setMotifsLoading(true);
    setMotifsError(null);
    try {
      const result = await listPlaygroundDesigns({ limit: 50 });
      setPlaygroundDesigns(result.designs || []);
    } catch (error) {
      console.error('[MOTIFS] Failed to load designs:', error);
      setMotifsError(error.message || 'Failed to load designs');
    } finally {
      setMotifsLoading(false);
    }
  };

  // Whether to use single-click to add (mobile or modal mode)
  const singleClickAdd = mobileMode || modalMode;

  const handleAddCourt = (templateId) => {
    const template = getCourtTemplate(templateId);
    if (template) {
      addCourt(templateId, template);
      if (singleClickAdd && onItemAdded) {
        onItemAdded();
      }
    }
  };

  const handleAddTrack = (templateId) => {
    const template = getTrackTemplate(templateId);
    if (template) {
      addTrack(templateId, template);
      if (singleClickAdd && onItemAdded) {
        onItemAdded();
      }
    }
  };

  const handleAddMotif = async (designId) => {
    if (addingMotifId) return; // Prevent double-clicks

    setAddingMotifId(designId);
    try {
      const motifData = await fetchMotifFromDesign(designId);
      addMotif(
        motifData.sourceDesignId,
        motifData.sourceDesignName,
        motifData.svgContent,
        motifData.originalWidth_mm,
        motifData.originalHeight_mm,
        motifData.sourceThumbnailUrl,
        // Pass extra data for solid/blend switching
        {
          solidSvgContent: motifData.solidSvgContent,
          blendSvgContent: motifData.blendSvgContent,
          hasBothVersions: motifData.hasBothVersions
        }
      );
      if (singleClickAdd && onItemAdded) {
        onItemAdded();
      }
    } catch (error) {
      console.error('[MOTIFS] Failed to add motif:', error);
      showToast('Failed to add motif. Please try again.');
    } finally {
      setAddingMotifId(null);
    }
  };

  // Shape definitions for the shapes tab (mobile only - desktop has floating elements box)
  const shapeDefinitions = [
    { id: 'rectangle', name: 'Rectangle', icon: '▭' },
    { id: 'square', name: 'Square', icon: '□' },
    { id: 'circle', name: 'Circle', icon: '○' },
    { id: 'triangle', name: 'Triangle', icon: '△' },
    { id: 'pentagon', name: 'Pentagon', icon: '⬠' },
    { id: 'hexagon', name: 'Hexagon', icon: '⬡' },
    { id: 'blob', name: 'Blob', icon: '◐' },
  ];

  const shapeCount = Object.keys(shapes || {}).length;

  // Get tab title and count
  const getTabInfo = () => {
    switch (activeTab) {
      case 'courts':
        return { title: 'Courts', count: courtCount, hint: 'Select a court to add' };
      case 'tracks':
        return { title: 'Tracks', count: trackCount, hint: 'Select a track to add' };
      case 'shapes':
        // Only shown in mobile mode
        return { title: 'Shapes', count: shapeCount, hint: 'Tap a shape to add it' };
      case 'designs':
        return { title: 'Designs', count: motifCount, hint: 'Add your saved designs as motifs' };
      default:
        return { title: 'Library', count: 0, hint: '' };
    }
  };

  const tabInfo = getTabInfo();

  return (
    <div className={`court-library ${mobileMode ? 'court-library--mobile' : ''}`}>
      {!mobileMode && (
        <div className="court-library__header">
          <div className="court-library__header-row">
            <h2>{tabInfo.title}</h2>
            <span className="court-library__count">
              {tabInfo.count} on canvas
            </span>
          </div>
          <p>{tabInfo.hint}</p>
        </div>
      )}

      {/* Tabs - hidden in mobile mode (parent controls tabs) */}
      {!mobileMode && <div className="court-library__tabs">
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
        <button
          className={`court-library__tab ${activeTab === 'designs' ? 'court-library__tab--active' : ''}`}
          onClick={() => {
            setActiveTab('designs');
            setSelectedTemplateId(null);
          }}
        >
          Designs
        </button>
      </div>}

      <div className={`court-library__list ${mobileMode ? 'court-library__list--mobile' : ''}`}>
        {/* Courts View */}
        {activeTab === 'courts' && templates.map(template => (
          <div
            key={template.id}
            className={`court-library__item ${selectedTemplateId === template.id ? 'court-library__item--selected' : ''}`}
            onClick={() => singleClickAdd ? handleAddCourt(template.id) : setSelectedTemplateId(template.id)}
            onDoubleClick={() => !singleClickAdd && handleAddCourt(template.id)}
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
            onClick={() => singleClickAdd ? handleAddTrack(template.id) : setSelectedTemplateId(template.id)}
            onDoubleClick={() => !singleClickAdd && handleAddTrack(template.id)}
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

        {/* Shapes View */}
        {activeTab === 'shapes' && (
          <div className={`court-library__shapes-grid ${mobileMode ? 'court-library__shapes-grid--mobile' : ''}`}>
            {shapeDefinitions.map(shape => (
              <button
                key={shape.id}
                className="court-library__shape-btn"
                onClick={() => {
                  addShape(shape.id);
                  if (mobileMode && onItemAdded) {
                    onItemAdded();
                  }
                }}
              >
                <span className="court-library__shape-icon">{shape.icon}</span>
                <span className="court-library__shape-name">{shape.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Designs View */}
        {activeTab === 'designs' && (
          <>
            {motifsLoading && (
              <div className="court-library__loading">
                <div className="court-library__spinner"></div>
                <p>Loading your designs...</p>
              </div>
            )}

            {motifsError && (
              <div className="court-library__error">
                <p>{motifsError}</p>
                <button onClick={loadPlaygroundDesigns}>Try Again</button>
              </div>
            )}

            {!motifsLoading && !motifsError && playgroundDesigns.length === 0 && (
              <div className="court-library__empty">
                <p>No designs found.</p>
                <p className="court-library__empty-hint">
                  Generate new designs or save them to use as motifs.
                </p>
              </div>
            )}

            {!motifsLoading && playgroundDesigns.map(design => (
              <div
                key={design.id}
                className={`court-library__item ${selectedTemplateId === design.id ? 'court-library__item--selected' : ''} ${addingMotifId === design.id ? 'court-library__item--loading' : ''}`}
                onClick={() => singleClickAdd ? handleAddMotif(design.id) : setSelectedTemplateId(design.id)}
                onDoubleClick={() => !singleClickAdd && handleAddMotif(design.id)}
              >
                {/* Preview Thumbnail */}
                <div className="court-library__preview">
                  <MotifPreview design={design} />
                </div>

                {/* Motif Info */}
                <div className="court-library__info">
                  <div className="court-library__name">{design.name || 'Unnamed Design'}</div>
                  <div className="court-library__dimensions">
                    {((design.design_data?.widthMM || 5000) / 1000).toFixed(1)}m × {((design.design_data?.lengthMM || 5000) / 1000).toFixed(1)}m
                  </div>
                  <div className="court-library__note">Playground Design</div>
                </div>

                {/* Add Button */}
                {selectedTemplateId === design.id && (
                  <button
                    className="court-library__add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddMotif(design.id);
                    }}
                    disabled={addingMotifId === design.id}
                  >
                    {addingMotifId === design.id ? 'Adding...' : '+ ADD'}
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Generate New Design Button */}
      <div className="court-library__generate">
        <button
          className="court-library__generate-btn"
          onClick={onOpenGenerator}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Generate New Design
        </button>
      </div>

      {!mobileMode && !modalMode && (
        <div className="court-library__footer">
          <p className="court-library__hint">
            {activeTab === 'courts' && 'Double-click a court to add it instantly'}
            {activeTab === 'tracks' && 'Double-click a track to add it instantly'}
            {activeTab === 'designs' && 'Double-click a design to add it as a motif'}
          </p>
        </div>
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

/**
 * Motif preview component
 * Displays a thumbnail preview of a playground design
 */
function MotifPreview({ design }) {
  // Try to get a thumbnail URL from the design
  // Note: List API returns these at top level, not in design_data
  const thumbnailUrl = design.thumbnail_url || design.original_png_url;

  if (thumbnailUrl) {
    return (
      <img
        src={thumbnailUrl}
        alt={design.name || 'Design preview'}
        className="court-library__motif-img"
        style={{
          width: '62px',
          height: '62px',
          objectFit: 'contain',
          borderRadius: '4px',
          backgroundColor: '#f3f4f6'
        }}
        onError={(e) => {
          // Fall back to placeholder on error
          e.target.style.display = 'none';
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = 'flex';
          }
        }}
      />
    );
  }

  // Fallback placeholder
  return (
    <div
      className="court-library__motif-placeholder"
      style={{
        width: '62px',
        height: '62px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        color: '#9ca3af',
        fontSize: '10px',
        textAlign: 'center'
      }}
    >
      No Preview
    </div>
  );
}

export default CourtLibrary;
