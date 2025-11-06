import React, { useState } from 'react';
import { apiClient } from '../lib/api/client.js';
import { DEFAULT_SURFACE } from '../lib/constants.js';

const STYLE_PRESETS = [
  { value: 'playful_flat', label: 'Playful Flat Design', description: 'Bold shapes, vibrant colors, fun themes' },
  { value: 'geometric', label: 'Geometric Abstract', description: 'Clean lines, mathematical patterns' },
  { value: 'sport_court', label: 'Sport Court Graphics', description: 'Athletic field markings, court layouts' }
];

function InspirePanel({ onConceptsGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [surfaceWidth, setSurfaceWidth] = useState(DEFAULT_SURFACE.width_m);
  const [surfaceHeight, setSurfaceHeight] = useState(DEFAULT_SURFACE.height_m);
  const [style, setStyle] = useState('playful_flat');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress('Creating job...');

    try {
      const request = {
        prompt: prompt.trim(),
        surface: {
          width_m: parseFloat(surfaceWidth),
          height_m: parseFloat(surfaceHeight)
        },
        style
      };

      console.log('[InspirePanel] Creating simple mode job:', request);

      // Step 1: Create job (returns immediately, no timeout)
      const jobResponse = await apiClient.inspireSimpleCreateJob(request);
      const { jobId, estimatedDuration } = jobResponse;

      console.log('[InspirePanel] Job created:', jobId);
      setProgress(`Job created! Estimated time: ~${estimatedDuration}s. Generating...`);

      // Step 2: Poll for completion with progress updates
      const jobResult = await apiClient.inspireSimpleWaitForCompletion(jobId, (status) => {
        console.log('[InspirePanel] Status update:', status.status);

        switch (status.status) {
          case 'pending':
            setProgress('Job created. Starting generation...');
            break;
          case 'queued':
            setProgress('Job queued. Waiting for GPU...');
            break;
          case 'running':
            setProgress('Generating inspiration with SDXL...');
            break;
          default:
            setProgress(`Status: ${status.status}`);
        }
      }, 2000); // Poll every 2 seconds

      console.log('[InspirePanel] Job completed:', jobResult);
      setProgress('Generation complete!');
      setResult(jobResult.result);

      // Notify parent with result
      if (onConceptsGenerated) {
        onConceptsGenerated([jobResult.result], jobResult.metadata);
      }

    } catch (err) {
      console.error('[InspirePanel] Error:', err);
      setError(err.message);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnother = () => {
    // Keep the same prompt and settings, just regenerate
    handleGenerate();
  };

  return (
    <div className="tpv-studio__card">
      <h2>TPV Studio - Inspiration Mode</h2>
      <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
        Generate creative playground surface designs with AI - no color restrictions
      </p>

      <div className="tpv-studio__form-group">
        <label className="tpv-studio__label">Design Description</label>
        <textarea
          className="tpv-studio__textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., abstract playground design with bold geometric shapes and vibrant colors..."
          rows={3}
          disabled={loading}
        />
        <small style={{ color: '#718096', display: 'block', marginTop: '0.5rem' }}>
          Describe your design vision. AI will generate inspiration freely - color-match later with separate tool.
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
        {loading ? 'Generating Inspiration...' : 'Generate Inspiration ($0.003)'}
      </button>

      {!loading && !result && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.75rem',
          color: '#a0aec0',
          textAlign: 'center'
        }}>
          ~20-40 seconds using SDXL | Simple mode | No color restrictions
        </p>
      )}

      {result && !loading && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Generated Inspiration</h3>
          <div style={{
            display: 'grid',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {result.final_url && (
              <div>
                <img
                  src={result.final_url}
                  alt="Generated inspiration"
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '0.5rem' }}
                />
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                  <p>Dimensions: {result.dimensions?.final?.w || 'N/A'} × {result.dimensions?.final?.h || 'N/A'} px</p>
                  <p>Surface: {surfaceWidth} × {surfaceHeight} meters</p>
                </div>
              </div>
            )}
            {result.thumbnail_url && !result.final_url && (
              <div>
                <img
                  src={result.thumbnail_url}
                  alt="Generated inspiration thumbnail"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="tpv-studio__button tpv-studio__button--secondary"
              onClick={handleGenerateAnother}
              disabled={loading}
              style={{ flex: 1 }}
            >
              Generate Another
            </button>
            {result.final_url && (
              <a
                href={result.final_url}
                download
                className="tpv-studio__button tpv-studio__button--secondary"
                style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
              >
                Download
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InspirePanel;
