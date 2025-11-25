// TPV Studio - Properties Panel for Selected Court or Track
import React, { useState } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { calculateTrackGeometry } from '../../lib/sports/trackGeometry.js';
import tpvColours from '../../../api/_utils/data/rosehill_tpv_21_colours.json';
import './PropertiesPanel.css';

function PropertiesPanel() {
  const {
    courts,
    tracks,
    selectedCourtId,
    selectedTrackId,
    updateCourtPosition,
    updateCourtRotation,
    updateCourtScale,
    setLineColor,
    setZoneColor,
    resetCourtColors,
    removeCourt,
    removeTrack,
    updateTrackParameters,
    addToHistory
  } = useSportsDesignStore();

  const [activeSection, setActiveSection] = useState('transform'); // 'transform', 'lines', 'zones', 'layers'
  const [colorPickerTarget, setColorPickerTarget] = useState(null); // { type: 'line'|'zone', id: string }

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
            Click on a court or track to view and edit its properties
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

    if (colorPickerTarget.type === 'line') {
      setLineColor(selectedCourtId, colorPickerTarget.id, {
        tpv_code: tpvColor.code,
        hex: tpvColor.hex,
        name: tpvColor.name
      });
    } else if (colorPickerTarget.type === 'zone') {
      setZoneColor(selectedCourtId, colorPickerTarget.id, {
        tpv_code: tpvColor.code,
        hex: tpvColor.hex,
        name: tpvColor.name
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
                title="Reset all colors to defaults"
              >
                Reset
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
                      title={currentColor?.name || 'Select color'}
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
              <h4>Paint Zones</h4>
            </div>

            {template.zones && template.zones.length > 0 ? (
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
                        title={currentColor?.name || 'Select color'}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="properties-section__empty">
                <p>This court has no paintable zones</p>
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
              <h4>Select TPV Colour</h4>
              <button onClick={() => setColorPickerTarget(null)}>×</button>
            </div>
            <div className="color-picker-grid">
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
  const { updateTrackParameters, removeTrack } = useSportsDesignStore();
  const { parameters, template } = track;
  const [cornersLocked, setCornersLocked] = React.useState(true);

  // Calculate current geometry
  const geometry = calculateTrackGeometry(parameters);

  // Get lane perimeters
  const lane1Perimeter = geometry.lanes[0]?.perimeter || 0;
  const lastLane = geometry.lanes[geometry.lanes.length - 1];
  const lastLanePerimeter = lastLane?.perimeter || 0;

  // Handle parameter updates
  const handleNumLanesChange = (value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1 || numValue > 8) return;
    updateTrackParameters(trackId, { numLanes: numValue });
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

          {/* Track Width (Editable) */}
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

          {/* Track Height (Editable) */}
          <div className="property-group">
            <label>Track Height</label>
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

          {/* Corner Radius Controls */}
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
                  value={(avgCornerRadius / 1000).toFixed(2)}
                  onChange={(e) => handleCornerRadiusChange('topLeft', e.target.value)}
                  min="0"
                  max={(Math.min(parameters.width_mm, parameters.height_mm) / 2000).toFixed(2)}
                  step="0.1"
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
                      value={(parameters.cornerRadius.topLeft / 1000).toFixed(2)}
                      onChange={(e) => handleCornerRadiusChange('topLeft', e.target.value)}
                      min="0"
                      max={(Math.min(parameters.width_mm, parameters.height_mm) / 2000).toFixed(2)}
                      step="0.1"
                    />
                    <span className="property-unit">m</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Top Right</label>
                  <div className="property-input-group">
                    <input
                      type="number"
                      value={(parameters.cornerRadius.topRight / 1000).toFixed(2)}
                      onChange={(e) => handleCornerRadiusChange('topRight', e.target.value)}
                      min="0"
                      max={(Math.min(parameters.width_mm, parameters.height_mm) / 2000).toFixed(2)}
                      step="0.1"
                    />
                    <span className="property-unit">m</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Bottom Left</label>
                  <div className="property-input-group">
                    <input
                      type="number"
                      value={(parameters.cornerRadius.bottomLeft / 1000).toFixed(2)}
                      onChange={(e) => handleCornerRadiusChange('bottomLeft', e.target.value)}
                      min="0"
                      max={(Math.min(parameters.width_mm, parameters.height_mm) / 2000).toFixed(2)}
                      step="0.1"
                    />
                    <span className="property-unit">m</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Bottom Right</label>
                  <div className="property-input-group">
                    <input
                      type="number"
                      value={(parameters.cornerRadius.bottomRight / 1000).toFixed(2)}
                      onChange={(e) => handleCornerRadiusChange('bottomRight', e.target.value)}
                      min="0"
                      max={(Math.min(parameters.width_mm, parameters.height_mm) / 2000).toFixed(2)}
                      step="0.1"
                    />
                    <span className="property-unit">m</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lane Width (Read-only) */}
          <div className="property-group property-group--info">
            <label>Lane Width</label>
            <div className="property-info">
              <span>{(parameters.laneWidth_mm / 1000).toFixed(2)}m (Fixed)</span>
            </div>
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
    </div>
  );
}

export default PropertiesPanel;
