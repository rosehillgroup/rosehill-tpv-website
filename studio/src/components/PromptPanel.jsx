import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api/client.js';
import { DEFAULT_SURFACE, COMPLEXITY_LEVELS } from '../lib/constants.js';

function PromptPanel({ onVariantsGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [surfaceWidth, setSurfaceWidth] = useState(DEFAULT_SURFACE.width_m);
  const [surfaceHeight, setSurfaceHeight] = useState(DEFAULT_SURFACE.height_m);
  const [complexity, setComplexity] = useState('medium');
  const [selectedColors, setSelectedColors] = useState([]);
  const [palette, setPalette] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load TPV palette
    fetch('./assets/tpv-palette.json')
      .then(res => res.json())
      .then(data => setPalette(data.palette || []))
      .catch(err => console.error('Failed to load palette:', err));
  }, []);

  const handleColorToggle = (color) => {
    if (selectedColors.find(c => c.code === color.code)) {
      setSelectedColors(selectedColors.filter(c => c.code !== color.code));
    } else if (selectedColors.length < 3) {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Generate design plan via LLM
      const planRequest = {
        prompt,
        surface: {
          width_m: parseFloat(surfaceWidth),
          height_m: parseFloat(surfaceHeight)
        },
        palette: selectedColors.length > 0
          ? selectedColors.map(c => ({ code: c.code }))
          : undefined,
        complexity,
        variants: 3
      };

      const { spec } = await apiClient.designPlan(planRequest);

      // Step 2: Generate designs
      const { variants } = await apiClient.designGenerate(spec, 3);

      onVariantsGenerated(variants);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tpv-studio__card">
      <h3>1. Design Brief</h3>

      <div className="tpv-studio__form-group">
        <label className="tpv-studio__label">Describe your design</label>
        <textarea
          className="tpv-studio__textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Ocean energy with fish, flowing bands of blue and turquoise..."
          rows={3}
        />
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
              placeholder="Width (m)"
              min="2"
              max="20"
              step="0.5"
            />
            <small>Width (meters)</small>
          </div>
          <div style={{ flex: 1 }}>
            <input
              className="tpv-studio__input"
              type="number"
              value={surfaceHeight}
              onChange={(e) => setSurfaceHeight(e.target.value)}
              placeholder="Height (m)"
              min="2"
              max="20"
              step="0.5"
            />
            <small>Height (meters)</small>
          </div>
        </div>
      </div>

      <div className="tpv-studio__form-group">
        <label className="tpv-studio__label">
          Select Colors (optional, max 3)
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
            >
              <div className="tpv-studio__color-label">
                {color.code}
              </div>
            </button>
          ))}
        </div>
        {selectedColors.length > 0 && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Selected: {selectedColors.map(c => c.code).join(', ')}
          </p>
        )}
      </div>

      <div className="tpv-studio__form-group">
        <label className="tpv-studio__label">Complexity</label>
        <select
          className="tpv-studio__select"
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
        >
          {Object.values(COMPLEXITY_LEVELS).map(level => (
            <option key={level.value} value={level.value}>
              {level.label} - {level.description}
            </option>
          ))}
        </select>
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

      <button
        className="tpv-studio__button tpv-studio__button--primary"
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        style={{ width: '100%' }}
      >
        {loading && <span className="tpv-studio__spinner" />}
        {loading ? 'Generating Designs...' : 'Generate 3 Variants'}
      </button>
    </div>
  );
}

export default PromptPanel;
