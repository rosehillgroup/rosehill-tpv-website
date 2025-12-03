// TPV Studio - Properties Panel for Selected Court or Track
import React, { useState } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { calculateTrackGeometry, calculateStaggeredStarts } from '../../lib/sports/trackGeometry.js';
import tpvColours from '../../../api/_utils/data/rosehill_tpv_21_colours.json';
import './PropertiesPanel.css';

function PropertiesPanel({ onEditSourceDesign }) {
  const {
    courts,
    tracks,
    motifs,
    selectedCourtId,
    selectedTrackId,
    selectedMotifId,
    updateCourtPosition,
    updateCourtRotation,
    updateCourtScale,
    setLineColor,
    setZoneColor,
    setCourtSurfaceColor,
    resetCourtColors,
    removeCourt,
    removeTrack,
    removeMotif,
    updateMotifPosition,
    updateMotifRotation,
    updateMotifScale,
    updateTrackParameters,
    addToHistory
  } = useSportsDesignStore();

  const [activeSection, setActiveSection] = useState('transform'); // 'transform', 'lines', 'zones'
  const [colorPickerTarget, setColorPickerTarget] = useState(null); // { type: 'line'|'zone', id: string }

  // Show motif properties if motif is selected
  if (selectedMotifId) {
    const motif = motifs[selectedMotifId];
    if (!motif) return null;
    return <MotifPropertiesPanel motif={motif} motifId={selectedMotifId} onEditSourceDesign={onEditSourceDesign} />;
  }

  // Show track properties if track is selected
  if (selectedTrackId) {
    const track = tracks[selectedTrackId];
    if (!track) return null;
    return <TrackPropertiesPanel track={track} trackId={selectedTrackId} />;
  }

  // Show court properties if court is selected
  if (!selectedCourtId) {
    return (
      <div className="properties-panel properties-panel--empty">
        <div className="properties-panel__empty-state">
          <p>No element selected</p>
          <span className="properties-panel__hint">
            Click on a court, track, or motif to view and edit its properties
          </span>
        </div>
      </div>
    );
  }

  const court = courts[selectedCourtId];
  if (!court) return null;

  const { position, rotation, scale, template, lineColorOverrides, zoneColorOverrides } = court;

  // Handle transform updates
  const handlePositionChange = (axis, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    updateCourtPosition(selectedCourtId, {
      ...position,
      [axis]: numValue
    });
  };

  const handleRotationChange = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    updateCourtRotation(selectedCourtId, numValue);
  };

  const handleScaleChange = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;

    updateCourtScale(selectedCourtId, numValue);
  };

  // Handle delete court
  const handleDeleteCourt = () => {
    if (window.confirm(`Delete ${template.name}? This action cannot be undone.`)) {
      removeCourt(selectedCourtId);
    }
  };

  // Handle color selection
  const handleColorSelect = (tpvColor) => {
    if (!colorPickerTarget) return;

    // Handle "No Fill" option for court surface
    if (colorPickerTarget.type === 'courtSurface' && tpvColor === null) {
      setCourtSurfaceColor(selectedCourtId, null);
      setColorPickerTarget(null);
      return;
    }

    // For all other cases, tpvColor must exist
    if (!tpvColor) return;

    const colorObj = {
      tpv_code: tpvColor.code,
      hex: tpvColor.hex,
      name: tpvColor.name
    };

    if (colorPickerTarget.type === 'line') {
      setLineColor(selectedCourtId, colorPickerTarget.id, colorObj);
    } else if (colorPickerTarget.type === 'zone') {
      setZoneColor(selectedCourtId, colorPickerTarget.id, colorObj);
    } else if (colorPickerTarget.type === 'courtSurface') {
      setCourtSurfaceColor(selectedCourtId, colorObj);
    } else if (colorPickerTarget.type === 'allLines') {
      // Apply color to all line markings
      template.markings.forEach(marking => {
        setLineColor(selectedCourtId, marking.id, colorObj);
      });
    }

    setColorPickerTarget(null);
  };

  // Get current color for a marking
  const getMarkingColor = (marking) => {
    const override = lineColorOverrides[marking.id];
    if (override) {
      return { code: override.tpv_code, hex: override.hex, name: override.name };
    }

    // Find TPV color by code from template
    const tpvColor = tpvColours.find(c => c.code === template.defaultLineColor);
    return tpvColor ? { code: tpvColor.code, hex: tpvColor.hex, name: tpvColor.name } : null;
  };

  // Get current color for a zone
  const getZoneColor = (zone) => {
    const override = zoneColorOverrides[zone.id];
    if (override) {
      return { code: override.tpv_code, hex: override.hex, name: override.name };
    }

    // Find TPV color by code from zone default
    const tpvColor = tpvColours.find(c => c.code === zone.defaultColor);
    return tpvColor ? { code: tpvColor.code, hex: tpvColor.hex, name: tpvColor.name } : null;
  };

  return (
    <div className="properties-panel">
      {/* Panel Header */}
      <div className="properties-panel__header">
        <h3>Properties</h3>
        <div className="properties-panel__court-info">
          <span className="court-name">{template.name}</span>
          <span className="court-standard">{template.standard}</span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="properties-panel__tabs">
        <button
          className={`tab ${activeSection === 'transform' ? 'tab--active' : ''}`}
          onClick={() => setActiveSection('transform')}
        >
          Transform
        </button>
        <button
          className={`tab ${activeSection === 'lines' ? 'tab--active' : ''}`}
          onClick={() => setActiveSection('lines')}
        >
          Lines
        </button>
        <button
          className={`tab ${activeSection === 'zones' ? 'tab--active' : ''}`}
          onClick={() => setActiveSection('zones')}
        >
          Zones
        </button>
      </div>

      {/* Panel Content */}
      <div className="properties-panel__content">
        {/* Transform Section */}
        {activeSection === 'transform' && (
          <div className="properties-section">
            <div className="properties-section__header">
              <h4>Transform</h4>
            </div>

            {/* Position */}
            <div className="property-group">
              <label>Position</label>
              <div className="property-input-row">
                <div className="property-input-group">
                  <span className="property-label">X</span>
                  <input
                    type="number"
                    value={Math.round(position.x)}
                    onChange={(e) => handlePositionChange('x', e.target.value)}
                    step="100"
                  />
                  <span className="property-unit">mm</span>
                </div>
                <div className="property-input-group">
                  <span className="property-label">Y</span>
                  <input
                    type="number"
                    value={Math.round(position.y)}
                    onChange={(e) => handlePositionChange('y', e.target.value)}
                    step="100"
                  />
                  <span className="property-unit">mm</span>
                </div>
              </div>
            </div>

            {/* Rotation */}
            <div className="property-group">
              <label>Rotation</label>
              <div className="property-input-row">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotation}
                  onChange={(e) => handleRotationChange(e.target.value)}
                  className="property-slider"
                />
                <div className="property-input-group property-input-group--compact">
                  <input
                    type="number"
                    value={Math.round(rotation)}
                    onChange={(e) => handleRotationChange(e.target.value)}
                    min="0"
                    max="360"
                  />
                  <span className="property-unit">°</span>
                </div>
              </div>
            </div>

            {/* Scale */}
            <div className="property-group">
              <label>Scale</label>
              <div className="property-input-row">
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={scale}
                  onChange={(e) => handleScaleChange(e.target.value)}
                  className="property-slider"
                />
                <div className="property-input-group property-input-group--compact">
                  <input
                    type="number"
                    value={scale.toFixed(2)}
                    onChange={(e) => handleScaleChange(e.target.value)}
                    min="0.5"
                    max="2.0"
                    step="0.1"
                  />
                  <span className="property-unit">×</span>
                </div>
              </div>
            </div>

            {/* Dimensions Display */}
            <div className="property-group property-group--info">
              <label>Dimensions</label>
              <div className="property-info">
                <span>
                  {((template.dimensions.width_mm * scale) / 1000).toFixed(1)}m × {((template.dimensions.length_mm * scale) / 1000).toFixed(1)}m
                </span>
              </div>
            </div>

            {/* Delete Button */}
            <div className="property-group property-group--actions">
              <button
                className="btn-delete"
                onClick={handleDeleteCourt}
                title="Delete court (Delete key)"
              >
                🗑️ Delete Court
              </button>
            </div>
          </div>
        )}

        {/* Lines Section */}
        {activeSection === 'lines' && (
          <div className="properties-section">
            <div className="properties-section__header">
              <h4>Line Markings</h4>
              <button
                className="btn-reset"
                onClick={() => resetCourtColors(selectedCourtId)}
                title="Reset all colours to defaults"
              >
                Reset
              </button>
            </div>

            {/* Change All Lines option */}
            <div className="color-item color-item--all-lines">
              <div className="color-item__info">
                <span className="color-item__name">Change All Lines</span>
                <span className="color-item__hint">Set all lines to same colour</span>
              </div>
              <button
                className="color-item__swatch color-item__swatch--all"
                onClick={() => setColorPickerTarget({ type: 'allLines' })}
                title="Change all line colours at once"
              >
                <span style={{ fontSize: '1rem' }}>🎨</span>
              </button>
            </div>

            <div className="color-list">
              {template.markings.map(marking => {
                const currentColor = getMarkingColor(marking);
                return (
                  <div key={marking.id} className="color-item">
                    <div className="color-item__info">
                      <span className="color-item__name">{marking.name}</span>
                      {currentColor && (
                        <span className="color-item__code">{currentColor.code}</span>
                      )}
                    </div>
                    <button
                      className="color-item__swatch"
                      style={{ backgroundColor: currentColor?.hex || '#000' }}
                      onClick={() => setColorPickerTarget({ type: 'line', id: marking.id })}
                      title={currentColor?.name || 'Select colour'}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Zones Section */}
        {activeSection === 'zones' && (
          <div className="properties-section">
            <div className="properties-section__header">
              <h4>Fill Colours</h4>
            </div>

            {/* Court Surface Fill Color */}
            <div className="color-item color-item--surface-fill">
              <div className="color-item__info">
                <span className="color-item__name">Court Surface</span>
                <span className="color-item__hint">
                  {court.courtSurfaceColor ? court.courtSurfaceColor.name : 'No Fill (transparent)'}
                </span>
                {court.courtSurfaceColor && (
                  <span className="color-item__code">{court.courtSurfaceColor.tpv_code}</span>
                )}
              </div>
              <button
                className={`color-item__swatch ${!court.courtSurfaceColor ? 'color-item__swatch--no-fill' : ''}`}
                style={{ backgroundColor: court.courtSurfaceColor?.hex || 'transparent' }}
                onClick={() => setColorPickerTarget({ type: 'courtSurface' })}
                title={court.courtSurfaceColor?.name || 'No Fill - Click to select colour'}
              />
            </div>

            {/* Divider if there are zones */}
            {template.zones && template.zones.length > 0 && (
              <div className="properties-section__divider">
                <span>Paint Zones</span>
              </div>
            )}

            {template.zones && template.zones.length > 0 && (
              <div className="color-list">
                {template.zones.map(zone => {
                  const currentColor = getZoneColor(zone);
                  return (
                    <div key={zone.id} className="color-item">
                      <div className="color-item__info">
                        <span className="color-item__name">{zone.name}</span>
                        <span className="color-item__area">{zone.area_m2?.toFixed(1) || 0} m²</span>
                        {currentColor && (
                          <span className="color-item__code">{currentColor.code}</span>
                        )}
                      </div>
                      <button
                        className="color-item__swatch"
                        style={{ backgroundColor: currentColor?.hex || '#000' }}
                        onClick={() => setColorPickerTarget({ type: 'zone', id: zone.id })}
                        title={currentColor?.name || 'Select colour'}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Color Picker Modal */}
      {colorPickerTarget && (
        <div className="color-picker-modal" onClick={() => setColorPickerTarget(null)}>
          <div className="color-picker-modal__content" onClick={(e) => e.stopPropagation()}>
            <div className="color-picker-modal__header">
              <h4>
                {colorPickerTarget.type === 'allLines' ? 'Change All Line Colours' :
                 colorPickerTarget.type === 'courtSurface' ? 'Select Court Fill Colour' :
                 'Select TPV Colour'}
              </h4>
              <button onClick={() => setColorPickerTarget(null)}>×</button>
            </div>
            <div className="color-picker-grid">
              {/* No Fill option for court surface */}
              {colorPickerTarget.type === 'courtSurface' && (
                <button
                  className="color-picker-swatch color-picker-swatch--no-fill"
                  onClick={() => handleColorSelect(null)}
                  title="No Fill (transparent)"
                >
                  <span className="color-picker-swatch__code">None</span>
                </button>
              )}
              {tpvColours.map(color => (
                <button
                  key={color.code}
                  className="color-picker-swatch"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleColorSelect(color)}
                  title={`${color.code} - ${color.name}`}
                >
                  <span className="color-picker-swatch__code">{color.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Track Properties Panel Component
 * Displays and allows editing of track parameters
 * TODO: Add full editing capabilities for width, height, and per-corner radius
 */
function TrackPropertiesPanel({ track, trackId }) {
  const { updateTrackParameters, removeTrack, setTrackSurfaceColor } = useSportsDesignStore();
  const { parameters, template, trackSurfaceColor } = track;
  const [cornersLocked, setCornersLocked] = React.useState(true);
  const [showTrackColorPicker, setShowTrackColorPicker] = React.useState(false);

  // Detect track type
  const isStraightTrack = template.trackType === 'straight';

  // Calculate current geometry
  const geometry = calculateTrackGeometry(parameters);

  // Get lane perimeters
  const lane1Perimeter = geometry.lanes[0]?.perimeter || 0;
  const lastLane = geometry.lanes[geometry.lanes.length - 1];
  const lastLanePerimeter = lastLane?.perimeter || 0;

  // Calculate staggered starts for curved tracks
  const staggerOffsets = !isStraightTrack ? calculateStaggeredStarts(geometry) : [];

  // Handle parameter updates
  const handleNumLanesChange = (value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1 || numValue > 8) return;

    // For straight tracks, auto-adjust width based on lanes
    if (isStraightTrack) {
      const newWidth = numValue * parameters.laneWidth_mm;
      updateTrackParameters(trackId, {
        numLanes: numValue,
        width_mm: newWidth
      });
    } else {
      updateTrackParameters(trackId, { numLanes: numValue });
    }
  };

  const handleWidthChange = (value) => {
    const numValue = parseFloat(value) * 1000; // Convert meters to mm
    if (isNaN(numValue) || numValue < 3000) return;
    updateTrackParameters(trackId, { width_mm: numValue });
  };

  const handleHeightChange = (value) => {
    const numValue = parseFloat(value) * 1000; // Convert meters to mm
    if (isNaN(numValue) || numValue < 3000) return;
    updateTrackParameters(trackId, { height_mm: numValue });
  };

  const handleCornerRadiusChange = (corner, value) => {
    const numValue = parseFloat(value) * 1000; // Convert meters to mm
    if (isNaN(numValue) || numValue < 0) return;

    // Clamp to max of half the smallest dimension
    const maxRadius = Math.min(parameters.width_mm, parameters.height_mm) / 2;
    const clampedValue = Math.min(numValue, maxRadius);

    if (cornersLocked) {
      // Update all corners to the same value
      updateTrackParameters(trackId, {
        cornerRadius: {
          topLeft: clampedValue,
          topRight: clampedValue,
          bottomLeft: clampedValue,
          bottomRight: clampedValue
        }
      });
    } else {
      // Update only the specified corner
      updateTrackParameters(trackId, {
        cornerRadius: {
          ...parameters.cornerRadius,
          [corner]: clampedValue
        }
      });
    }
  };

  // Handle delete track
  const handleDeleteTrack = () => {
    if (window.confirm(`Delete ${template.name}? This action cannot be undone.`)) {
      removeTrack(trackId);
    }
  };

  // Handle track color selection
  const handleTrackColorSelect = (tpvColor) => {
    setTrackSurfaceColor(trackId, {
      tpv_code: tpvColor.code,
      hex: tpvColor.hex,
      name: tpvColor.name
    });
    setShowTrackColorPicker(false);
  };

  // Handle starting boxes toggle
  const handleStartingBoxToggle = (enabled) => {
    updateTrackParameters(trackId, {
      startingBoxes: {
        ...parameters.startingBoxes,
        enabled
      }
    });
  };

  // Handle box depth change
  const handleBoxDepthChange = (value) => {
    const numValue = parseFloat(value) * 1000; // Convert meters to mm
    if (isNaN(numValue) || numValue < 100) return;

    updateTrackParameters(trackId, {
      startingBoxes: {
        ...parameters.startingBoxes,
        depth_mm: numValue
      }
    });
  };

  // Handle starting box style change
  const handleBoxStyleChange = (style) => {
    updateTrackParameters(trackId, {
      startingBoxes: {
        ...parameters.startingBoxes,
        style
      }
    });
  };

  // Handle direction of travel change
  const handleDirectionChange = (direction) => {
    updateTrackParameters(trackId, {
      startingBoxes: {
        ...parameters.startingBoxes,
        direction
      }
    });
  };

  // Handle start position change (curved tracks only)
  const handleStartPositionChange = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;

    updateTrackParameters(trackId, {
      startingBoxes: {
        ...parameters.startingBoxes,
        startPosition: numValue
      }
    });
  };

  // Calculate average corner radius for display
  const avgCornerRadius = (
    parameters.cornerRadius.topLeft +
    parameters.cornerRadius.topRight +
    parameters.cornerRadius.bottomLeft +
    parameters.cornerRadius.bottomRight
  ) / 4;

  return (
    <div className="properties-panel">
      {/* Panel Header */}
      <div className="properties-panel__header">
        <h3>Track Properties</h3>
        <div className="properties-panel__court-info">
          <span className="court-name">{template.name}</span>
          <span className="court-standard">{template.standard}</span>
        </div>
      </div>

      {/* Panel Content */}
      <div className="properties-panel__content">
        <div className="properties-section">
          <div className="properties-section__header">
            <h4>Track Parameters</h4>
          </div>

          {/* Number of Lanes */}
          <div className="property-group">
            <label>Number of Lanes</label>
            <div className="property-input-row">
              <input
                type="range"
                min="1"
                max="8"
                value={parameters.numLanes}
                onChange={(e) => handleNumLanesChange(e.target.value)}
                className="property-slider"
              />
              <div className="property-input-group property-input-group--compact">
                <input
                  type="number"
                  value={parameters.numLanes}
                  onChange={(e) => handleNumLanesChange(e.target.value)}
                  min="1"
                  max="8"
                />
                <span className="property-unit">lanes</span>
              </div>
            </div>
          </div>

          {/* Track Width (Read-only for straight tracks, editable for curved) */}
          {isStraightTrack ? (
            <div className="property-group property-group--info">
              <label>Track Width</label>
              <div className="property-info">
                <span>{(parameters.width_mm / 1000).toFixed(1)}m (Auto-calculated from lanes)</span>
              </div>
            </div>
          ) : (
            <div className="property-group">
              <label>Track Width</label>
              <div className="property-input-group">
                <input
                  type="number"
                  value={(parameters.width_mm / 1000).toFixed(1)}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  min="3"
                  max="100"
                  step="0.5"
                />
                <span className="property-unit">m</span>
              </div>
            </div>
          )}

          {/* Track Height/Length (Editable) */}
          <div className="property-group">
            <label>{isStraightTrack ? 'Track Length' : 'Track Height'}</label>
            <div className="property-input-group">
              <input
                type="number"
                value={(parameters.height_mm / 1000).toFixed(1)}
                onChange={(e) => handleHeightChange(e.target.value)}
                min="3"
                max="100"
                step="0.5"
              />
              <span className="property-unit">m</span>
            </div>
          </div>

          {/* Corner Radius Controls (hidden for straight tracks) */}
          {!isStraightTrack && (
            <div className="property-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label>Corner Radius</label>
              <button
                className="btn-toggle"
                onClick={() => setCornersLocked(!cornersLocked)}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  background: cornersLocked ? '#0066CC' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                title={cornersLocked ? 'Click to edit corners independently' : 'Click to lock all corners together'}
              >
                {cornersLocked ? '🔒 Locked' : '🔓 Independent'}
              </button>
            </div>

            {cornersLocked ? (
              // Single input when locked
              <div className="property-input-group">
                <input
                  type="number"
                  defaultValue={(avgCornerRadius / 1000).toFixed(2)}
                  key={`locked-${avgCornerRadius}`}
                  onBlur={(e) => handleCornerRadiusChange('topLeft', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                  min="0"
                  max={(Math.min(parameters.width_mm, parameters.height_mm) / 2000).toFixed(0)}
                  step="0.5"
                />
                <span className="property-unit">m</span>
              </div>
            ) : (
              // Four inputs when unlocked
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Top Left</label>
                  <div className="property-input-group">
                    <input
                      type="number"
                      defaultValue={(parameters.cornerRadius.topLeft / 1000).toFixed(2)}
                      key={`tl-${parameters.cornerRadius.topLeft}`}
                      onBlur={(e) => handleCornerRadiusChange('topLeft', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                      min="0"
                      max={(Math.min(parameters.width_mm, parameters.height_mm) / 2000).toFixed(0)}
                      step="0.5"
                    />
                    <span className="property-unit">m</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Top Right</label>
                  <div className="property-input-group">
                    <input
                      type="number"
                      defaultValue={(parameters.cornerRadius.topRight / 1000).toFixed(2)}
                      key={`tr-${parameters.cornerRadius.topRight}`}
                      onBlur={(e) => handleCornerRadiusChange('topRight', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                      min="0"
                      max={(Math.min(parameters.width_mm, parameters.height_mm) / 2000).toFixed(0)}
                      step="0.5"
                    />
                    <span className="property-unit">m</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Bottom Left</label>
                  <div className="property-input-group">
                    <input
                      type="number"
                      defaultValue={(parameters.cornerRadius.bottomLeft / 1000).toFixed(2)}
                      key={`bl-${parameters.cornerRadius.bottomLeft}`}
                      onBlur={(e) => handleCornerRadiusChange('bottomLeft', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                      min="0"
                      max={(Math.min(parameters.width_mm, parameters.height_mm) / 2000).toFixed(0)}
                      step="0.5"
                    />
                    <span className="property-unit">m</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Bottom Right</label>
                  <div className="property-input-group">
                    <input
                      type="number"
                      defaultValue={(parameters.cornerRadius.bottomRight / 1000).toFixed(2)}
                      key={`br-${parameters.cornerRadius.bottomRight}`}
                      onBlur={(e) => handleCornerRadiusChange('bottomRight', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                      min="0"
                      max={(Math.min(parameters.width_mm, parameters.height_mm) / 2000).toFixed(0)}
                      step="0.5"
                    />
                    <span className="property-unit">m</span>
                  </div>
                </div>
              </div>
            )}
            </div>
          )}

          {/* Lane Width (Read-only) */}
          <div className="property-group property-group--info">
            <label>Lane Width</label>
            <div className="property-info">
              <span>{(parameters.laneWidth_mm / 1000).toFixed(2)}m (Fixed)</span>
            </div>
          </div>

          {/* Track Surface Colour */}
          <div className="property-group">
            <label>Track Surface Colour</label>
            <div className="color-item">
              <div className="color-item__info">
                <span className="color-item__name">{trackSurfaceColor?.name || 'Select Colour'}</span>
                {trackSurfaceColor && (
                  <span className="color-item__code">{trackSurfaceColor.tpv_code}</span>
                )}
              </div>
              <button
                className="color-item__swatch"
                style={{ backgroundColor: trackSurfaceColor?.hex || '#A5362F' }}
                onClick={() => setShowTrackColorPicker(true)}
                title={trackSurfaceColor?.name || 'Select colour'}
              />
            </div>
          </div>

          {/* Starting Boxes Section */}
          <div className="property-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={parameters.startingBoxes?.enabled || false}
                onChange={(e) => handleStartingBoxToggle(e.target.checked)}
              />
              Show Starting Boxes
            </label>

            {parameters.startingBoxes?.enabled && (
              <div style={{ marginTop: '0.75rem' }}>
                {/* Box Depth */}
                <div className="property-input-group" style={{ marginBottom: '0.75rem' }}>
                  <span className="property-label" style={{ fontSize: '0.875rem' }}>Depth</span>
                  <input
                    type="number"
                    value={(parameters.startingBoxes.depth_mm / 1000).toFixed(2)}
                    onChange={(e) => handleBoxDepthChange(e.target.value)}
                    min="0.1"
                    max="1.0"
                    step="0.05"
                  />
                  <span className="property-unit">m</span>
                </div>

                {/* Starting Box Style - only show for curved tracks */}
                {!isStraightTrack && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem' }}>
                      Start Style
                    </label>
                    <select
                      value={parameters.startingBoxes.style || 'staggered'}
                      onChange={(e) => handleBoxStyleChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #e4e9f0',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        background: 'white'
                      }}
                    >
                      <option value="straight">Straight Start</option>
                      <option value="staggered">Staggered Start</option>
                      <option value="both">Both (opposite ends)</option>
                    </select>
                  </div>
                )}

                {/* Direction of Travel */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem' }}>
                    Direction of Travel
                  </label>
                  <select
                    value={parameters.startingBoxes.direction || 'counterclockwise'}
                    onChange={(e) => handleDirectionChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #e4e9f0',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      background: 'white'
                    }}
                  >
                    <option value="counterclockwise">Counterclockwise (Standard)</option>
                    <option value="clockwise">Clockwise</option>
                  </select>
                </div>

                {/* Start Position - only for curved tracks */}
                {!isStraightTrack && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem' }}>
                      Start Position ({parameters.startingBoxes.startPosition || 0}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={parameters.startingBoxes.startPosition || 0}
                      onChange={(e) => handleStartPositionChange(e.target.value)}
                      className="property-slider"
                      style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      Slide to adjust where the start line appears around the track
                    </div>
                  </div>
                )}

                {/* Info: Boxes use track surface colour */}
                <div className="property-info" style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                  Boxes use track surface colour with white starting line and lane numbers
                </div>

                {/* Stagger information for curved tracks - only show if style includes staggered */}
                {!isStraightTrack && staggerOffsets.length > 0 && (parameters.startingBoxes.style === 'staggered' || parameters.startingBoxes.style === 'both') && (
                  <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                      Auto-Calculated Staggers:
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: '1.4' }}>
                      {staggerOffsets.map((offset, index) => (
                        <div key={index}>
                          Lane {index + 1}: {(offset / 1000).toFixed(2)}m
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.25rem', fontStyle: 'italic' }}>
                      Outer lanes start ahead to equalize distance
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="property-divider"></div>

          {/* Calculated Dimensions */}
          <div className="properties-section__header">
            <h4>Calculated Dimensions</h4>
          </div>

          <div className="property-group property-group--info">
            <label>Usable Infield</label>
            <div className="property-info">
              <span>
                {(geometry.usableWidth / 1000).toFixed(1)}m × {(geometry.usableHeight / 1000).toFixed(1)}m
              </span>
            </div>
          </div>

          <div className="property-group property-group--info">
            <label>Lane 1 Perimeter</label>
            <div className="property-info">
              <span>{lane1Perimeter.toFixed(2)}m</span>
            </div>
          </div>

          {parameters.numLanes > 1 && (
            <div className="property-group property-group--info">
              <label>Lane {parameters.numLanes} Perimeter</label>
              <div className="property-info">
                <span>{lastLanePerimeter.toFixed(2)}m</span>
              </div>
            </div>
          )}

          {/* Usage hint */}
          <div className="property-group">
            <div className="property-hint" style={{fontStyle: 'normal', color: '#64748b', fontSize: '0.75rem', marginTop: '1rem'}}>
              💡 Tip: Use drag handles on the canvas or edit values here. Corner radius auto-adjusts when locked.
            </div>
          </div>

          {/* Delete Button */}
          <div className="property-group property-group--actions">
            <button
              className="btn-delete"
              onClick={handleDeleteTrack}
              title="Delete track (Delete key)"
            >
              🗑️ Delete Track
            </button>
          </div>
        </div>
      </div>

      {/* Color Picker Modal for Track Surface */}
      {showTrackColorPicker && (
        <div className="color-picker-modal" onClick={() => setShowTrackColorPicker(false)}>
          <div className="color-picker-modal__content" onClick={(e) => e.stopPropagation()}>
            <div className="color-picker-modal__header">
              <h4>Select Track Surface Colour</h4>
              <button onClick={() => setShowTrackColorPicker(false)}>×</button>
            </div>
            <div className="color-picker-grid">
              {tpvColours.map(color => (
                <button
                  key={color.code}
                  className="color-picker-swatch"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleTrackColorSelect(color)}
                  title={`${color.code} - ${color.name}`}
                >
                  <span className="color-picker-swatch__code">{color.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Motif Properties Panel Component
 * Displays and allows editing of motif position, rotation, and scale
 */
function MotifPropertiesPanel({ motif, motifId, onEditSourceDesign }) {
  const { updateMotifPosition, updateMotifRotation, updateMotifScale, removeMotif, duplicateMotif, refreshMotif, setMotifViewMode } = useSportsDesignStore();
  const { position, rotation, scale, sourceDesignName, sourceDesignId, originalWidth_mm, originalHeight_mm, sourceThumbnailUrl, viewMode, hasBothVersions } = motif;

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [refreshError, setRefreshError] = React.useState(null);

  // Handle position updates
  const handlePositionChange = (axis, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    updateMotifPosition(motifId, {
      ...position,
      [axis]: numValue
    });
  };

  // Handle rotation update
  const handleRotationChange = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    updateMotifRotation(motifId, numValue);
  };

  // Handle scale update (aspect-locked)
  const handleScaleChange = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;
    updateMotifScale(motifId, numValue);
  };

  // Handle delete motif
  const handleDeleteMotif = () => {
    if (window.confirm(`Delete this motif? This action cannot be undone.`)) {
      removeMotif(motifId);
    }
  };

  // Handle duplicate motif
  const handleDuplicateMotif = () => {
    duplicateMotif(motifId);
  };

  // Handle edit source design - opens the design editor modal
  const handleEditSource = () => {
    if (onEditSourceDesign) {
      onEditSourceDesign(sourceDesignId);
    } else {
      // Fallback to opening in new tab if callback not provided
      if (!sourceDesignId) {
        alert('Source design ID not found');
        return;
      }
      window.open(`/studio/?design=${sourceDesignId}`, '_blank');
    }
  };

  // Handle refresh from source - re-fetches SVG after editing
  const handleRefreshFromSource = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setRefreshError(null);

    try {
      const result = await refreshMotif(motifId);
      if (!result.success) {
        setRefreshError(result.error || 'Failed to refresh');
      }
    } catch (error) {
      setRefreshError(error.message || 'Failed to refresh');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate current dimensions
  const currentWidth = (originalWidth_mm * (scale || 1)) / 1000;
  const currentHeight = (originalHeight_mm * (scale || 1)) / 1000;

  return (
    <div className="properties-panel">
      {/* Panel Header */}
      <div className="properties-panel__header">
        <h3>Motif Properties</h3>
        <div className="properties-panel__court-info">
          <span className="court-name">{sourceDesignName || 'Unnamed Motif'}</span>
          <span className="court-standard">Playground Design</span>
        </div>
      </div>

      {/* Panel Content */}
      <div className="properties-panel__content">
        <div className="properties-section">
          {/* Motif Preview */}
          {sourceThumbnailUrl && (
            <div className="property-group">
              <label>Preview</label>
              <div style={{
                width: '100%',
                height: '80px',
                background: '#f3f4f6',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img
                  src={sourceThumbnailUrl}
                  alt={sourceDesignName}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>
          )}

          {/* View Mode Toggle - only show if both versions available */}
          {hasBothVersions && (
            <div className="property-group">
              <label>Colour Style</label>
              <div className="property-toggle-buttons">
                <button
                  className={`toggle-btn ${viewMode === 'solid' ? 'toggle-btn--active' : ''}`}
                  onClick={() => setMotifViewMode(motifId, 'solid')}
                >
                  Solid
                </button>
                <button
                  className={`toggle-btn ${viewMode === 'blend' ? 'toggle-btn--active' : ''}`}
                  onClick={() => setMotifViewMode(motifId, 'blend')}
                >
                  Blend
                </button>
              </div>
            </div>
          )}

          <div className="properties-section__header">
            <h4>Transform</h4>
          </div>

          {/* Position */}
          <div className="property-group">
            <label>Position</label>
            <div className="property-input-row">
              <div className="property-input-group">
                <span className="property-label">X</span>
                <input
                  type="number"
                  value={Math.round(position.x)}
                  onChange={(e) => handlePositionChange('x', e.target.value)}
                  step="100"
                />
                <span className="property-unit">mm</span>
              </div>
              <div className="property-input-group">
                <span className="property-label">Y</span>
                <input
                  type="number"
                  value={Math.round(position.y)}
                  onChange={(e) => handlePositionChange('y', e.target.value)}
                  step="100"
                />
                <span className="property-unit">mm</span>
              </div>
            </div>
          </div>

          {/* Rotation */}
          <div className="property-group">
            <label>Rotation</label>
            <div className="property-input-row">
              <input
                type="range"
                min="0"
                max="360"
                value={rotation || 0}
                onChange={(e) => handleRotationChange(e.target.value)}
                className="property-slider"
              />
              <div className="property-input-group property-input-group--compact">
                <input
                  type="number"
                  value={Math.round(rotation || 0)}
                  onChange={(e) => handleRotationChange(e.target.value)}
                  min="0"
                  max="360"
                />
                <span className="property-unit">°</span>
              </div>
            </div>
          </div>

          {/* Scale (Aspect-Locked) */}
          <div className="property-group">
            <label>
              Scale
              <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '0.5rem' }}>
                (aspect locked)
              </span>
            </label>
            <div className="property-input-row">
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={Math.min(scale || 1, 10)}
                onChange={(e) => handleScaleChange(e.target.value)}
                className="property-slider"
              />
              <div className="property-input-group property-input-group--compact">
                <input
                  type="number"
                  value={(scale || 1).toFixed(2)}
                  onChange={(e) => handleScaleChange(e.target.value)}
                  min="0.1"
                  step="0.1"
                />
                <span className="property-unit">×</span>
              </div>
            </div>
          </div>

          {/* Current Dimensions Display */}
          <div className="property-group property-group--info">
            <label>Current Size</label>
            <div className="property-info">
              <span>{currentWidth.toFixed(2)}m × {currentHeight.toFixed(2)}m</span>
            </div>
          </div>

          {/* Original Dimensions Display */}
          <div className="property-group property-group--info">
            <label>Original Size</label>
            <div className="property-info">
              <span>{(originalWidth_mm / 1000).toFixed(2)}m × {(originalHeight_mm / 1000).toFixed(2)}m</span>
            </div>
          </div>

          {/* Source Design Section */}
          <div className="properties-section__divider" style={{ margin: '1rem 0' }}>
            <span>Source Design</span>
          </div>

          {/* Edit Source Design Button */}
          <div className="property-group property-group--actions">
            <button
              className="btn-primary"
              onClick={handleEditSource}
              title="Edit the source playground design in a new tab"
              style={{
                width: '100%',
                padding: '0.5rem',
                background: 'var(--color-primary, #1e4a7a)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              ✏️ Edit Source Design
            </button>
          </div>

          {/* Refresh from Source Button */}
          <div className="property-group property-group--actions">
            <button
              className="btn-secondary"
              onClick={handleRefreshFromSource}
              disabled={isRefreshing}
              title="Refresh this motif with the latest version from the source design"
              style={{
                width: '100%',
                padding: '0.5rem',
                background: isRefreshing ? '#e5e7eb' : '#f3f4f6',
                border: '1px solid #e4e9f0',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                cursor: isRefreshing ? 'not-allowed' : 'pointer',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isRefreshing ? '⏳ Refreshing...' : '🔄 Refresh from Source'}
            </button>
            {refreshError && (
              <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' }}>
                {refreshError}
              </div>
            )}
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
              Click after editing the source design to update this motif
            </div>
          </div>

          {/* Divider */}
          <div className="properties-section__divider" style={{ margin: '1rem 0' }}>
            <span>Actions</span>
          </div>

          {/* Duplicate Button */}
          <div className="property-group property-group--actions">
            <button
              className="btn-secondary"
              onClick={handleDuplicateMotif}
              title="Duplicate motif (Ctrl+D)"
              style={{
                width: '100%',
                padding: '0.5rem',
                background: '#f3f4f6',
                border: '1px solid #e4e9f0',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              📋 Duplicate Motif
            </button>
          </div>

          {/* Delete Button */}
          <div className="property-group property-group--actions">
            <button
              className="btn-delete"
              onClick={handleDeleteMotif}
              title="Delete motif (Delete key)"
            >
              🗑️ Delete Motif
            </button>
          </div>

          {/* Tip */}
          <div className="property-group">
            <div className="property-hint" style={{ fontStyle: 'normal', color: '#64748b', fontSize: '0.75rem', marginTop: '1rem' }}>
              💡 Tip: Drag the motif on the canvas to reposition. Edit the source design and click "Refresh" to update.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertiesPanel;
