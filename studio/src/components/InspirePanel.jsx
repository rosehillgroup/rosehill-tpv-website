import React, { useState } from 'react';
import { apiClient } from '../lib/api/client.js';

function InspirePanel({ onConceptsGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [lengthMM, setLengthMM] = useState(5000);  // Changed to mm (5000mm = 5m)
  const [widthMM, setWidthMM] = useState(5000);    // Changed to mm (5000mm = 5m)
  const [maxColours, setMaxColours] = useState(6);  // New: max colours (1-8, default 6)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [qcResults, setQcResults] = useState(null);  // New: QC results

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setQcResults(null);
    setProgress('Creating job...');

    try {
      const request = {
        prompt: prompt.trim(),
        lengthMM: parseInt(lengthMM),
        widthMM: parseInt(widthMM),
        maxColours: parseInt(maxColours)
      };

      console.log('[InspirePanel] Creating Flux Dev job:', request);

      // Step 1: Create job (returns immediately)
      const jobResponse = await apiClient.inspireSimpleCreateJob(request);
      const { jobId, estimatedDuration } = jobResponse;

      console.log('[InspirePanel] Job created:', jobId);
      setProgress(`Job created! Estimated time: ~${estimatedDuration || 30}s. Generating...`);

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
            setProgress('Generating with Flux Dev...');
            break;
          default:
            setProgress(`Status: ${status.status}`);
        }
      }, 2000); // Poll every 2 seconds

      console.log('[InspirePanel] Job completed:', jobResult);
      setProgress('Generation complete!');
      setResult(jobResult.result);
      setMetadata(jobResult.metadata);
      setQcResults(jobResult.qc_results || null);

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


  const handleNewGeneration = async () => {
    // Generate with a new random seed for variation
    setLoading(true);
    setError(null);
    setResult(null);
    setQcResults(null);
    setProgress('Generating new variation...');

    try {
      const request = {
        prompt: prompt.trim(),
        lengthMM: parseInt(lengthMM),
        widthMM: parseInt(widthMM),
        maxColours: parseInt(maxColours),
        seed: Math.floor(Math.random() * 1000000) // New random seed
      };

      console.log('[InspirePanel] Generating new variation');

      const jobResponse = await apiClient.inspireSimpleCreateJob(request);
      const { jobId } = jobResponse;

      setProgress('Generating new variation...');

      const jobResult = await apiClient.inspireSimpleWaitForCompletion(jobId, (status) => {
        switch (status.status) {
          case 'pending':
            setProgress('Job created. Starting generation...');
            break;
          case 'queued':
            setProgress('Job queued. Waiting for GPU...');
            break;
          case 'running':
            setProgress('Generating with Flux Dev...');
            break;
          default:
            setProgress(`Status: ${status.status}`);
        }
      }, 2000);

      setProgress('Generation complete!');
      setResult(jobResult.result);
      setMetadata(jobResult.metadata);
      setQcResults(jobResult.qc_results || null);

      if (onConceptsGenerated) {
        onConceptsGenerated([jobResult.result], jobResult.metadata);
      }

    } catch (err) {
      console.error('[InspirePanel] New generation error:', err);
      setError(err.message);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTrySimpler = async () => {
    // Regenerate with try_simpler flag for stricter simplification
    setLoading(true);
    setError(null);
    setResult(null);
    setQcResults(null);
    setProgress('Generating simpler version...');

    try {
      const request = {
        prompt: prompt.trim(),
        lengthMM: parseInt(lengthMM),
        widthMM: parseInt(widthMM),
        maxColours: parseInt(maxColours),
        trySimpler: true  // New: try_simpler flag
      };

      console.log('[InspirePanel] Generating with try_simpler flag');

      const jobResponse = await apiClient.inspireSimpleCreateJob(request);
      const { jobId } = jobResponse;

      setProgress('Generating simpler design...');

      const jobResult = await apiClient.inspireSimpleWaitForCompletion(jobId, (status) => {
        switch (status.status) {
          case 'pending':
            setProgress('Job created. Starting generation...');
            break;
          case 'queued':
            setProgress('Job queued. Waiting for GPU...');
            break;
          case 'running':
            setProgress('Generating simpler version with Flux Dev...');
            break;
          default:
            setProgress(`Status: ${status.status}`);
        }
      }, 2000);

      setProgress('Simpler version complete!');
      setResult(jobResult.result);
      setMetadata(jobResult.metadata);
      setQcResults(jobResult.qc_results || null);

      if (onConceptsGenerated) {
        onConceptsGenerated([jobResult.result], jobResult.metadata);
      }

    } catch (err) {
      console.error('[InspirePanel] Try simpler error:', err);
      setError(err.message);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tpv-studio__card">
      <h2>TPV Studio - Flux Dev Generation</h2>
      <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
        Generate installer-friendly playground surface designs with AI
      </p>

      <div className="tpv-studio__form-group">
        <label className="tpv-studio__label">Design Description</label>
        <textarea
          className="tpv-studio__textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., calm ocean theme with fish and seaweed..."
          rows={3}
          disabled={loading}
        />
        <small style={{ color: '#718096', display: 'block', marginTop: '0.5rem' }}>
          Describe your design vision. AI will create installer-friendly layouts with clean shapes.
        </small>
      </div>

      <div className="tpv-studio__form-group">
        <label className="tpv-studio__label">Surface Dimensions (mm)</label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <input
              className="tpv-studio__input"
              type="number"
              value={lengthMM}
              onChange={(e) => setLengthMM(e.target.value)}
              min="2000"
              max="20000"
              step="100"
              disabled={loading}
            />
            <small>Length (mm)</small>
          </div>
          <div style={{ flex: 1 }}>
            <input
              className="tpv-studio__input"
              type="number"
              value={widthMM}
              onChange={(e) => setWidthMM(e.target.value)}
              min="2000"
              max="20000"
              step="100"
              disabled={loading}
            />
            <small>Width (mm)</small>
          </div>
        </div>
      </div>

      <div className="tpv-studio__form-group">
        <label className="tpv-studio__label">
          Max Colours: {maxColours}
        </label>
        <input
          type="range"
          className="tpv-studio__slider"
          min="1"
          max="8"
          value={maxColours}
          onChange={(e) => setMaxColours(parseInt(e.target.value))}
          disabled={loading}
          style={{ width: '100%' }}
        />
        <small style={{ color: '#718096', display: 'block', marginTop: '0.5rem' }}>
          Maximum number of colours (1-8). Fewer colours = simpler, more installer-friendly designs.
        </small>
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
        {loading ? 'Generating with Flux Dev...' : 'Generate Design (~$0.025)'}
      </button>

      {!loading && !result && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.75rem',
          color: '#a0aec0',
          textAlign: 'center'
        }}>
          ~30-40 seconds using Flux Dev | Installer-friendly designs
        </p>
      )}

      {result && !loading && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Generated Design</h3>

          {/* QC Results Badge */}
          {qcResults && (
            <div style={{
              padding: '1rem',
              background: qcResults.pass ? '#c6f6d5' : '#fed7d7',
              color: qcResults.pass ? '#22543d' : '#742a2a',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1rem' }}>
                  {qcResults.pass ? '✓ QC Pass' : '✗ QC Fail'}
                </strong>
                <span>Score: {qcResults.score}/100</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                <span>Regions: {qcResults.region_count || 'N/A'}</span>
                <span>Colours: {qcResults.colour_count || 'N/A'}</span>
                <span>Min Feature: {qcResults.min_feature_mm ? `${qcResults.min_feature_mm}mm` : 'N/A'}</span>
                <span>Min Radius: {qcResults.min_radius_mm ? `${qcResults.min_radius_mm}mm` : 'N/A'}</span>
              </div>
            </div>
          )}

          <div style={{
            display: 'grid',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {result.final_url && (
              <div>
                <img
                  src={result.final_url}
                  alt="Generated design"
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '0.5rem' }}
                />
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                  <p>Dimensions: {result.dimensions?.final?.w || 'N/A'} × {result.dimensions?.final?.h || 'N/A'} px</p>
                  <p>Surface: {lengthMM}mm × {widthMM}mm ({(lengthMM/1000).toFixed(1)}m × {(widthMM/1000).toFixed(1)}m)</p>
                  <p>Max Colours: {maxColours}</p>
                  {metadata?.seed && (
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Seed:</strong> {metadata.seed}
                    </p>
                  )}
                </div>
              </div>
            )}
            {result.thumbnail_url && !result.final_url && (
              <div>
                <img
                  src={result.thumbnail_url}
                  alt="Generated design thumbnail"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              className="tpv-studio__button tpv-studio__button--secondary"
              onClick={handleTrySimpler}
              disabled={loading}
              style={{ width: '100%' }}
              title="Regenerate with stricter simplification parameters"
            >
              Try Simpler
            </button>
            <button
              className="tpv-studio__button tpv-studio__button--secondary"
              onClick={handleNewGeneration}
              disabled={loading}
              style={{ width: '100%' }}
              title="Generate a new variation with different random seed"
            >
              New Generation
            </button>
            {result.final_url && (
              <a
                href={result.final_url}
                download
                className="tpv-studio__button tpv-studio__button--secondary"
                style={{ textAlign: 'center', textDecoration: 'none' }}
              >
                Download Image
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InspirePanel;
