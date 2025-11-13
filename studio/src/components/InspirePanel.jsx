import React, { useState } from 'react';
import { apiClient } from '../lib/api/client.js';

function InspirePanel({ onConceptsGenerated }) {
  // Mode selection
  const [mode, setMode] = useState('ai');  // 'ai' or 'geometric'

  // Common fields
  const [prompt, setPrompt] = useState('');
  const [lengthMM, setLengthMM] = useState(5000);  // Changed to mm (5000mm = 5m)
  const [widthMM, setWidthMM] = useState(5000);    // Changed to mm (5000mm = 5m)
  const [maxColours, setMaxColours] = useState(6);  // New: max colours (1-8, default 6)

  // Geometric-specific fields
  const [mood, setMood] = useState('playful');  // playful, serene, energetic, bold, calm
  const [composition, setComposition] = useState('mixed');  // bands, islands, motifs, mixed

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [qcResults, setQcResults] = useState(null);  // New: QC results

  const handleGenerate = async () => {
    if (mode === 'geometric') {
      return handleGenerateGeometric();
    } else {
      return handleGenerateAI();
    }
  };

  const handleGenerateGeometric = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setQcResults(null);
    setProgress('Generating geometric design...');

    try {
      const request = {
        prompt: prompt.trim(),
        lengthMM: parseInt(lengthMM),
        widthMM: parseInt(widthMM),
        maxColours: parseInt(maxColours),
        mood,
        composition
      };

      console.log('[InspirePanel] Generating geometric design:', request);

      const response = await apiClient.generateGeometric(request);

      console.log('[InspirePanel] Geometric generation complete:', response);

      if (!response.success) {
        throw new Error(response.error || 'Geometric generation failed');
      }

      // Convert SVG string to data URL for display
      const svgBlob = new Blob([response.svg], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);

      setProgress('✓ Geometric design generated!');
      setResult({ svg_url: svgUrl, svg: response.svg });
      setMetadata(response.metadata);
      setQcResults(response.validation ? {
        pass: response.validation.pass,
        score: response.validation.pass ? 100 : 50,
        colour_count: response.metadata.colorCount,
        region_count: response.metadata.layerCount,
        min_feature_mm: 120,
        min_radius_mm: 600
      } : null);

      if (onConceptsGenerated) {
        onConceptsGenerated([{ svg_url: svgUrl, svg: response.svg }], response.metadata);
      }

    } catch (err) {
      console.error('[InspirePanel] Geometric generation error:', err);
      setError(err.message);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
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
      const estimatedMsg = estimatedDuration >= 60
        ? `Estimated time: ~${estimatedDuration}s (two-pass generation). Pass 1/2 starting...`
        : `Estimated time: ~${estimatedDuration || 30}s. Generating...`;
      setProgress(`Job created! ${estimatedMsg}`);

      // Step 2: Poll for completion with progress updates
      let vectorizationStartTime = null;
      const jobResult = await apiClient.inspireSimpleWaitForCompletion(jobId, (status) => {
        console.log('[InspirePanel] Status update:', status.status);

        // Detect two-pass mode from metadata
        const isTwoPass = status.metadata?.mode === 'flux_dev_two_pass';
        const currentPass = status.metadata?.pass || 1;

        switch (status.status) {
          case 'pending':
            if (isTwoPass && currentPass === 2) {
              setProgress('Pass 1 complete! Starting Pass 2 refinement...');
            } else {
              setProgress('Job created. Starting generation...');
            }
            break;
          case 'queued':
            if (isTwoPass && currentPass === 1) {
              setProgress('Pass 1/2: Creating vibrant concept (queued)...');
            } else if (isTwoPass && currentPass === 2) {
              setProgress('Pass 2/2: Cleaning up & simplifying (queued)...');
            } else {
              setProgress('Job queued. Waiting for GPU...');
            }
            break;
          case 'running':
            if (isTwoPass && currentPass === 1) {
              setProgress('Pass 1/2: Generating vibrant concept...');
            } else if (isTwoPass && currentPass === 2) {
              setProgress('Pass 2/2: Removing artifacts & simplifying...');
            } else {
              setProgress('Generating with Flux Dev...');
            }
            break;
          case 'pass1_complete':
            setProgress('Pass 1 complete! Starting cleanup pass...');
            break;
          case 'completed':
            setProgress('✓ Generation complete! High-quality design ready.');
            break;
          default:
            setProgress(`Status: ${status.status}`);
        }
      }, 2000); // Poll every 2 seconds

      console.log('[InspirePanel] Job completed:', jobResult);

      // Show completion message based on mode
      const isTwoPass = jobResult.metadata?.mode === 'flux_dev_two_pass';
      setProgress(isTwoPass ? 'Two-pass generation complete!' : 'Generation complete!');

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
      <h2>TPV Studio - Design Generation</h2>
      <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
        Generate installer-friendly playground surface designs
      </p>

      {/* Mode Selector */}
      <div className="tpv-studio__form-group">
        <label className="tpv-studio__label">Generation Mode</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setMode('ai')}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '2px solid',
              borderColor: mode === 'ai' ? '#1a365d' : '#e2e8f0',
              background: mode === 'ai' ? '#1a365d' : 'white',
              color: mode === 'ai' ? 'white' : '#2d3748',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: mode === 'ai' ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            🤖 AI Mode
          </button>
          <button
            onClick={() => setMode('geometric')}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '2px solid',
              borderColor: mode === 'geometric' ? '#ff6b35' : '#e2e8f0',
              background: mode === 'geometric' ? '#ff6b35' : 'white',
              color: mode === 'geometric' ? 'white' : '#2d3748',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: mode === 'geometric' ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            📐 Geometric Mode
          </button>
        </div>
        <small style={{ color: '#718096', display: 'block', marginTop: '0.5rem' }}>
          {mode === 'ai'
            ? 'AI generates designs from scratch using Flux Dev (~40s, $0.025)'
            : 'Native SVG generation with pure geometric shapes (~instant, free)'}
        </small>
      </div>

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

      {/* Geometric Mode Options */}
      {mode === 'geometric' && (
        <>
          <div className="tpv-studio__form-group">
            <label className="tpv-studio__label">Mood</label>
            <select
              className="tpv-studio__input"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              disabled={loading}
            >
              <option value="playful">Playful - Bright, cheerful colors</option>
              <option value="serene">Serene - Calm, peaceful tones</option>
              <option value="energetic">Energetic - Vibrant, dynamic colors</option>
              <option value="bold">Bold - Striking, dramatic palette</option>
              <option value="calm">Calm - Soft, gentle hues</option>
            </select>
            <small style={{ color: '#718096', display: 'block', marginTop: '0.5rem' }}>
              Color palette mood and intensity
            </small>
          </div>

          <div className="tpv-studio__form-group">
            <label className="tpv-studio__label">Composition</label>
            <select
              className="tpv-studio__input"
              value={composition}
              onChange={(e) => setComposition(e.target.value)}
              disabled={loading}
            >
              <option value="mixed">Mixed - Bands, islands & motifs</option>
              <option value="bands">Bands - Flowing ribbons</option>
              <option value="islands">Islands - Organic blobs</option>
              <option value="motifs">Motifs - Scattered shapes</option>
            </select>
            <small style={{ color: '#718096', display: 'block', marginTop: '0.5rem' }}>
              Layout structure and element types
            </small>
          </div>
        </>
      )}

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
        {loading
          ? (mode === 'geometric' ? 'Generating geometric design...' : 'Generating with Flux Dev...')
          : (mode === 'geometric' ? 'Generate Geometric Design (Free)' : 'Generate Design (~$0.025)')}
      </button>

      {!loading && !result && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.75rem',
          color: '#a0aec0',
          textAlign: 'center'
        }}>
          {mode === 'geometric'
            ? 'Instant generation with native SVG shapes'
            : '~30-40 seconds using Flux Dev | Installer-friendly designs'}
        </p>
      )}

      {(result?.final_url || result?.svg_url) && !loading && (
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
            {(result.final_url || result.svg_url) && (
              <div>
                <img
                  src={result.svg_url || result.final_url}
                  alt="Generated design"
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '0.5rem' }}
                />
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                  <p>Format: {result.svg_url ? 'SVG (Vector)' : 'JPEG (High-quality raster)'}</p>
                  <p>Surface: {lengthMM}mm × {widthMM}mm ({(lengthMM/1000).toFixed(1)}m × {(widthMM/1000).toFixed(1)}m)</p>
                  <p>Colours: {qcResults?.colour_count || maxColours}</p>
                  {metadata?.seed && (
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Seed:</strong> {metadata.seed}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Primary download button */}
            <a
              href={result.svg_url || result.final_url}
              download={result.svg_url ? 'design.svg' : 'design.jpg'}
              className="tpv-studio__button tpv-studio__button--primary"
              style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}
            >
              Download Design ({result.svg_url ? 'SVG' : 'JPG'})
            </a>

            {/* Regeneration options */}
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
          </div>
        </div>
      )}
    </div>
  );
}

export default InspirePanel;
