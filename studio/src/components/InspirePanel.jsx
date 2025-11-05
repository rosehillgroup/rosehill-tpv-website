import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api/client.js';
import { DEFAULT_SURFACE } from '../lib/constants.js';

const STYLE_PRESETS = [
  { value: 'professional', label: 'Professional', description: 'Clean, modern, minimal' },
  { value: 'playful', label: 'Playful', description: 'Fun, friendly, whimsical' },
  { value: 'geometric', label: 'Geometric', description: 'Sharp angles, mathematical' }
];

function InspirePanel({ onConceptsGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [surfaceWidth, setSurfaceWidth] = useState(DEFAULT_SURFACE.width_m);
  const [surfaceHeight, setSurfaceHeight] = useState(DEFAULT_SURFACE.height_m);
  const [style, setStyle] = useState('professional');
  const [selectedColors, setSelectedColors] = useState([]);
  const [palette, setPalette] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    // Load TPV palette
    fetch('/studio/assets/tpv-palette.json')
      .then(res => res.json())
      .then(data => setPalette(data.palette || []))
      .catch(err => console.error('Failed to load palette:', err));
  }, []);

  const handleColorToggle = (color) => {
    if (selectedColors.find(c => c.code === color.code)) {
      setSelectedColors(selectedColors.filter(c => c.code !== color.code));
    } else if (selectedColors.length < 6) {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setProgress('Building enhanced prompt with color guidance...');

    try {
      const request = {
        prompt: prompt.trim(),
        surface: {
          width_m: parseFloat(surfaceWidth),
          height_m: parseFloat(surfaceHeight)
        },
        paletteColors: selectedColors.length > 0
          ? selectedColors.map(c => ({ code: c.code, hex: c.hex, name: c.name }))
          : null,
        style,
        count: 6
      };

      setProgress('Generating 6 concepts with FLUX.1 [pro]...');
      console.log('[InspirePanel] Calling inspire API:', request);

      const response = await apiClient.inspire(request);

      console.log('[InspirePanel] Received concepts:', response);
      setProgress('Concepts generated successfully!');

      // Pass concepts to parent
      onConceptsGenerated(response.concepts, response.metadata);

    } catch (err) {
      console.error('[InspirePanel] Error:', err);
      setError(err.message);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tpv-studio__card">
      <h2>Step 1: Inspire</h2>
      <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
        Generate AI concept images using FLUX.1 [pro]
      </p>

      <div className="tpv-studio__form-group">
        <label className="tpv-studio__label">Design Description</label>
        <textarea
          className="tpv-studio__textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Ocean energy with fish, flowing bands of blue and turquoise..."
          rows={3}
          disabled={loading}
        />
        <small style={{ color: '#718096', display: 'block', marginTop: '0.5rem' }}>
          Describe the visual concept you want. Be specific about shapes, patterns, and mood.
        </small>
      </div>

      <div className="tpv-studio__form-group">
        <label className="tpv-studio__label">Surface Dimensions</label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <input
              className="tpv-studio__input"
              type="number"
              value={surfaceWidth}
              onChange={(e) => setSurfaceWidth(e.target.value)}
              min="2"
              max="20"
              step="0.5"
              disabled={loading}
            />
            <small>Width (meters)</small>
          </div>
          <div style={{ flex: 1 }}>
            <input
              className="tpv-studio__input"
              type="number"
              value={surfaceHeight}
              onChange={(e) => setSurfaceHeight(e.target.value)}
              min="2"
              max="20"
              step="0.5"
              disabled={loading}
            />
            <small>Height (meters)</small>
          </div>
        </div>
      </div>

      <div className="tpv-studio__form-group">
        <label className="tpv-studio__label">Style Preset</label>
        <select
          className="tpv-studio__select"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          disabled={loading}
        >
          {STYLE_PRESETS.map(preset => (
            <option key={preset.value} value={preset.value}>
              {preset.label} - {preset.description}
            </option>
          ))}
        </select>
      </div>

      <div className="tpv-studio__form-group">
        <label className="tpv-studio__label">
          Select Colors (optional, max 6)
        </label>
        <div className="tpv-studio__color-grid">
          {palette.map(color => (
            <button
              key={color.code}
              className={`tpv-studio__color-swatch ${
                selectedColors.find(c => c.code === color.code)
                  ? 'tpv-studio__color-swatch--selected'
                  : ''
              }`}
              style={{ backgroundColor: color.hex }}
              onClick={() => handleColorToggle(color)}
              title={`${color.name} (${color.code})`}
              disabled={loading || (selectedColors.length >= 6 && !selectedColors.find(c => c.code === color.code))}
            >
              <div className="tpv-studio__color-label">
                {color.code}
              </div>
            </button>
          ))}
        </div>
        {selectedColors.length > 0 && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#718096' }}>
            Selected: {selectedColors.map(c => c.code).join(', ')}
          </p>
        )}
        {selectedColors.length === 0 && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#718096' }}>
            Leave empty to let AI choose colors from the full palette
          </p>
        )}
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          background: '#fed7d7',
          color: '#742a2a',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {progress && !error && (
        <div style={{
          padding: '1rem',
          background: '#bee3f8',
          color: '#2c5282',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {progress}
        </div>
      )}

      <button
        className="tpv-studio__button tpv-studio__button--primary"
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        style={{ width: '100%' }}
      >
        {loading && <span className="tpv-studio__spinner" />}
        {loading ? 'Generating Concepts...' : 'Generate 6 Concepts ($0.33)'}
      </button>

      {!loading && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.75rem',
          color: '#a0aec0',
          textAlign: 'center'
        }}>
          ~60 seconds using FLUX.1 [pro] | Generates 6 concepts | Auto-quantized to TPV palette
        </p>
      )}
    </div>
  );
}

export default InspirePanel;
