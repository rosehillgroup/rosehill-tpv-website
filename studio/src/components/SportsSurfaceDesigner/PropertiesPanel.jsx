// TPV Studio - Properties Panel for Selected Court
import React, { useState } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import tpvColours from '../../../api/_utils/data/rosehill_tpv_21_colours.json';
import './PropertiesPanel.css';

function PropertiesPanel() {
  const {
    courts,
    selectedCourtId,
    updateCourtPosition,
    updateCourtRotation,
    updateCourtScale,
    setLineColor,
    setZoneColor,
    resetCourtColors
  } = useSportsDesignStore();

  const [activeSection, setActiveSection] = useState('transform'); // 'transform', 'lines', 'zones', 'layers'
  const [colorPickerTarget, setColorPickerTarget] = useState(null); // { type: 'line'|'zone', id: string }

  if (!selectedCourtId) {
    return (
      <div className="properties-panel properties-panel--empty">
        <div className="properties-panel__empty-state">
          <p>No court selected</p>
          <span className="properties-panel__hint">
            Click on a court to view and edit its properties
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

export default PropertiesPanel;
