// TPV Studio - Properties Panel for Selected Court or Track
import React, { useState } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { calculateTrackGeometry, calculateTrackLength } from '../../lib/sports/trackGeometry.js';
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
 */
function TrackPropertiesPanel({ track, trackId }) {
  const { updateTrackParameters, removeTrack, addToHistory } = useSportsDesignStore();
  const { parameters, template } = track;

  // Calculate current geometry
  const geometry = calculateTrackGeometry(parameters);
  const lane1Length = calculateTrackLength(parameters.cornerRadius_mm, parameters.straightLength_mm);

  // Handle parameter updates
  const handleNumLanesChange = (value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 4 || numValue > 8) return;
    updateTrackParameters(trackId, { numLanes: numValue });
  };

  const handleRoundnessChange = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 1) return;
    updateTrackParameters(trackId, { cornerRoundness: numValue });
  };

  const handleStraightLengthChange = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 10000) return; // Min 10m
    updateTrackParameters(trackId, { straightLength_mm: numValue });
  };

  const handleCornerRadiusChange = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 10000) return; // Min 10m
    updateTrackParameters(trackId, { cornerRadius_mm: numValue });
  };

  // Handle delete track
  const handleDeleteTrack = () => {
    if (window.confirm(`Delete ${template.name}? This action cannot be undone.`)) {
      removeTrack(trackId);
    }
  };

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
                min="4"
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
                  min="4"
                  max="8"
                />
                <span className="property-unit">lanes</span>
              </div>
            </div>
          </div>

          {/* Corner Roundness */}
          <div className="property-group">
            <label>Corner Roundness</label>
            <div className="property-input-row">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={parameters.cornerRoundness}
                onChange={(e) => handleRoundnessChange(e.target.value)}
                className="property-slider"
              />
              <div className="property-input-group property-input-group--compact">
                <input
                  type="number"
                  value={Math.round(parameters.cornerRoundness * 100)}
                  onChange={(e) => handleRoundnessChange(parseFloat(e.target.value) / 100)}
                  min="0"
                  max="100"
                />
                <span className="property-unit">%</span>
              </div>
            </div>
          </div>

          {/* Straight Length */}
          <div className="property-group">
            <label>Straight Length</label>
            <div className="property-input-row">
              <div className="property-input-group">
                <input
                  type="number"
                  value={Math.round(parameters.straightLength_mm)}
                  onChange={(e) => handleStraightLengthChange(e.target.value)}
                  step="1000"
                />
                <span className="property-unit">mm</span>
              </div>
            </div>
            <div className="property-hint">
              {(parameters.straightLength_mm / 1000).toFixed(1)}m
            </div>
          </div>

          {/* Corner Radius */}
          <div className="property-group">
            <label>Corner Radius</label>
            <div className="property-input-row">
              <div className="property-input-group">
                <input
                  type="number"
                  value={Math.round(parameters.cornerRadius_mm)}
                  onChange={(e) => handleCornerRadiusChange(e.target.value)}
                  step="1000"
                />
                <span className="property-unit">mm</span>
              </div>
            </div>
            <div className="property-hint">
              {(parameters.cornerRadius_mm / 1000).toFixed(1)}m
            </div>
          </div>

          {/* Lane Width (Read-only) */}
          <div className="property-group property-group--info">
            <label>Lane Width</label>
            <div className="property-info">
              <span>{(parameters.laneWidth_mm / 1000).toFixed(2)}m (Standard)</span>
            </div>
          </div>

          {/* Divider */}
          <div className="property-divider"></div>

          {/* Calculated Dimensions */}
          <div className="properties-section__header">
            <h4>Calculated Dimensions</h4>
          </div>

          <div className="property-group property-group--info">
            <label>Total Track Size</label>
            <div className="property-info">
              <span>
                {(geometry.totalWidth / 1000).toFixed(1)}m × {(geometry.totalLength / 1000).toFixed(1)}m
              </span>
            </div>
          </div>

          <div className="property-group property-group--info">
            <label>Infield Size</label>
            <div className="property-info">
              <span>
                {(geometry.infieldWidth / 1000).toFixed(1)}m × {(geometry.infieldLength / 1000).toFixed(1)}m
              </span>
            </div>
          </div>

          <div className="property-group property-group--info">
            <label>Lane 1 Distance</label>
            <div className="property-info">
              <span>{lane1Length.toFixed(2)}m</span>
            </div>
          </div>

          {parameters.numLanes >= 4 && (
            <div className="property-group property-group--info">
              <label>Lane {parameters.numLanes} Distance</label>
              <div className="property-info">
                <span>
                  {calculateTrackLength(
                    parameters.cornerRadius_mm + (parameters.numLanes - 1) * parameters.laneWidth_mm,
                    parameters.straightLength_mm
                  ).toFixed(2)}m
                </span>
              </div>
            </div>
          )}

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
