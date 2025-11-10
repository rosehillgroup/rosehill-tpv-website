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

        // Check for vectorization status
        // Note: API returns outputs as "result", not "outputs"
        const hasVectorization = status.result?.svg_url || status.metadata?.vectorization?.svg_url;

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
            if (hasVectorization) {
              setProgress('✓ Vectorization complete! Installer-ready design available.');
            } else {
              // Show informative vectorization progress
              if (!vectorizationStartTime) {
                vectorizationStartTime = Date.now();
              }
              const elapsed = Math.floor((Date.now() - vectorizationStartTime) / 1000);

              if (elapsed < 5) {
                setProgress('🎨 Generation complete! Converting to vectors (detecting gradients)...');
              } else if (elapsed < 10) {
                setProgress('🎨 Vectorizing: Quantizing colors and tracing regions...');
              } else if (elapsed < 18) {
                setProgress('🎨 Vectorizing: Running quality checks and simplifying paths...');
              } else if (elapsed < 25) {
                setProgress('🎨 Vectorizing: Applying manufacturing constraints (min features, radii)...');
              } else {
                setProgress('🎨 Vectorizing: Finalizing installer-ready SVG (~25-30s total)...');
              }
            }
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

      {result?.svg_url && !loading && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Installer-Ready Design</h3>

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
            {result.svg_url && (
              <div>
                <img
                  src={result.svg_url}
                  alt="Installer-ready vector design"
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '0.5rem' }}
                />
                <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                  <p>Format: Scalable Vector Graphics (SVG)</p>
                  <p>Surface: {lengthMM}mm × {widthMM}mm ({(lengthMM/1000).toFixed(1)}m × {(widthMM/1000).toFixed(1)}m)</p>
                  <p>Colours: {qcResults?.colour_count || maxColours}</p>
                  <p>Manufacturing constraints applied: ✓ Min feature {qcResults?.min_feature_mm || 120}mm, Min radius {qcResults?.min_radius_mm || 600}mm</p>
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
              href={result.svg_url}
              download
              className="tpv-studio__button tpv-studio__button--primary"
              style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}
            >
              Download Installer-Ready SVG
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

            {/* Optional: Backup raster download */}
            {result.final_url && (
              <a
                href={result.final_url}
                download
                className="tpv-studio__button tpv-studio__button--secondary"
                style={{ textAlign: 'center', textDecoration: 'none', fontSize: '0.75rem', padding: '0.5rem' }}
                title="Download original raster image (backup reference only)"
              >
                Download Raster Reference (JPG)
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InspirePanel;
