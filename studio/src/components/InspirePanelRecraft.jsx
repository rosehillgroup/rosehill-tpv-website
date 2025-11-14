// TPV Studio - Recraft Vector AI Panel
// Simplified UI for Recraft vector generation with compliance tracking

import { useState } from 'react';
import { apiClient } from '../lib/api/client.js';
import BlendRecipesDisplay from './BlendRecipesDisplay.jsx';
import SVGPreview from './SVGPreview.jsx';
import { buildColorMapping } from '../utils/colorMapping.js';
import { recolorSVG } from '../utils/svgRecolor.js';
import { mapDimensionsToRecraft, getLayoutDescription, needsLayoutWarning } from '../utils/aspectRatioMapping.js';

export default function InspirePanelRecraft() {
  // Form state
  const [prompt, setPrompt] = useState('');
  const [lengthMM, setLengthMM] = useState(5000);
  const [widthMM, setWidthMM] = useState(5000);

  // Aspect ratio mapping
  const [arMapping, setArMapping] = useState(null);

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Progress tracking
  const [progressMessage, setProgressMessage] = useState('');
  const [attemptInfo, setAttemptInfo] = useState(null);

  // Blend recipes state
  const [blendRecipes, setBlendRecipes] = useState(null);
  const [generatingBlends, setGeneratingBlends] = useState(false);
  const [blendSvgUrl, setBlendSvgUrl] = useState(null);
  const [colorMapping, setColorMapping] = useState(null);

  // Handle form submission
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a design description');
      return;
    }

    setError(null);
    setGenerating(true);
    setStatus(null);
    setResult(null);
    setJobId(null);
    setProgressMessage('Initializing...');
    setAttemptInfo(null);

    try {
      // Map dimensions to canonical Recraft aspect ratio
      const mapping = mapDimensionsToRecraft(lengthMM, widthMM);
      setArMapping(mapping);

      console.log('[TPV-STUDIO] AR Mapping:', mapping);
      console.log('[TPV-STUDIO] Layout:', getLayoutDescription(mapping));

      // Update progress message with layout info
      if (needsLayoutWarning(mapping)) {
        setProgressMessage(`Generating ${mapping.canonical.name} design panel...`);
      } else {
        setProgressMessage('Initializing...');
      }

      // Create job with canonical dimensions
      const response = await apiClient.generateRecraft({
        prompt: prompt.trim(),
        lengthMM: mapping.recraft.height,  // Note: Recraft uses height as length
        widthMM: mapping.recraft.width
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to start generation');
      }

      setJobId(response.jobId);
      setProgressMessage('Generating vector design...');

      // Poll for completion
      await apiClient.waitForRecraftCompletion(
        response.jobId,
        (progressStatus) => {
          setStatus(progressStatus);

          // Update status message based on state
          if (progressStatus.status === 'queued') {
            setProgressMessage('In queue...');
          } else if (progressStatus.status === 'running') {
            setProgressMessage('Generating vector design...');
          }
        }
      );

      // Completed - final status update
      const finalStatus = await apiClient.getRecraftStatus(response.jobId);
      setStatus(finalStatus);
      setResult(finalStatus.result);

      if (finalStatus.status === 'completed') {
        setProgressMessage('✓ Design ready!');
      }

      setGenerating(false);
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err.message);
      setProgressMessage('');
      setGenerating(false);
    }
  };

  // Handle new generation (reset state)
  const handleNewGeneration = () => {
    setPrompt('');
    setGenerating(false);
    setJobId(null);
    setStatus(null);
    setResult(null);
    setError(null);
    setProgressMessage('');
    setAttemptInfo(null);
    setBlendRecipes(null);
    setGeneratingBlends(false);
    setBlendSvgUrl(null);
    setColorMapping(null);
    setArMapping(null);
  };

  // Download SVG
  const handleDownloadSVG = () => {
    if (result?.svg_url) {
      window.open(result.svg_url, '_blank');
    }
  };

  // Download PNG
  const handleDownloadPNG = () => {
    if (result?.png_url) {
      window.open(result.png_url, '_blank');
    }
  };

  // Generate TPV blend recipes from the SVG
  const handleGenerateBlends = async () => {
    if (!result?.svg_url) {
      setError('No SVG available to analyze');
      return;
    }

    setGeneratingBlends(true);
    setError(null);

    try {
      const response = await fetch('/api/blend-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          svg_url: result.svg_url,
          job_id: jobId,
          max_colors: 8,
          max_components: 2
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate blend recipes');
      }

      if (data.success) {
        setBlendRecipes(data.recipes);

        // Build color mapping
        const mapping = buildColorMapping(data.recipes);
        setColorMapping(mapping);

        // Generate recolored SVG
        try {
          console.log('[TPV-STUDIO] Generating recolored SVG...');
          const { dataUrl, stats } = await recolorSVG(result.svg_url, mapping);
          setBlendSvgUrl(dataUrl);
          console.log('[TPV-STUDIO] Recolored SVG generated:', stats);
        } catch (svgError) {
          console.error('[TPV-STUDIO] Failed to generate recolored SVG:', svgError);
          // Non-fatal error - recipes are still valid
          setError(`Recipes generated successfully, but SVG recoloring failed: ${svgError.message}`);
        }
      } else {
        throw new Error(data.error || 'Unknown error generating recipes');
      }
    } catch (err) {
      console.error('Blend generation failed:', err);
      setError(err.message);
    } finally {
      setGeneratingBlends(false);
    }
  };

  return (
    <div className="inspire-panel-recraft">
      <div className="panel-header">
        <h2>TPV Studio - Vector AI</h2>
        <p className="subtitle">AI-powered vector designs for playground surfacing</p>
      </div>

      {/* Input Form */}
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="prompt">Design Description</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., calm ocean theme with big fish silhouettes and waves"
            rows={4}
            disabled={generating}
            className="prompt-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="length">Length (mm)</label>
            <input
              id="length"
              type="number"
              value={lengthMM}
              onChange={(e) => setLengthMM(parseInt(e.target.value, 10))}
              min={1000}
              max={20000}
              step={100}
              disabled={generating}
            />
          </div>

          <div className="form-group">
            <label htmlFor="width">Width (mm)</label>
            <input
              id="width"
              type="number"
              value={widthMM}
              onChange={(e) => setWidthMM(parseInt(e.target.value, 10))}
              min={1000}
              max={20000}
              step={100}
              disabled={generating}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="generate-button"
        >
          {generating ? 'Generating...' : 'Generate Vector Design'}
        </button>
      </div>

      {/* Progress Display */}
      {generating && (
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-bar-fill" />
          </div>
          <p className="progress-message">{progressMessage}</p>
        </div>
      )}

      {/* Results Display */}
      {result && !generating && (
        <div className="results-section">
          <div className="results-header">
            <h3>Your Design</h3>
          </div>

          {/* Aspect Ratio Info */}
          {arMapping && (
            <div className={`ar-info ${arMapping.layout.mode}`}>
              <div className="ar-info-header">
                <strong>Layout:</strong> {arMapping.layout.reason}
              </div>
              <div className="ar-info-details">
                <span>Requested: {arMapping.user.formatted}</span>
                <span>•</span>
                <span>Generated: {arMapping.canonical.name} panel</span>
                {arMapping.layout.mode === 'framing' && (
                  <>
                    <span>•</span>
                    <span className="layout-note">Panel centered with base color surround</span>
                  </>
                )}
                {arMapping.layout.mode === 'tiling' && (
                  <>
                    <span>•</span>
                    <span className="layout-note">Pattern will repeat along length</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* SVG Preview */}
          {result.svg_url && (
            <div className="svg-preview">
              <img src={result.svg_url} alt="Generated design" className="design-preview" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleDownloadSVG} className="download-button svg">
              Download SVG
            </button>
            <button onClick={handleDownloadPNG} className="download-button png">
              Download PNG Preview
            </button>
            <button
              onClick={handleGenerateBlends}
              disabled={generatingBlends}
              className="blend-button"
            >
              {generatingBlends ? 'Generating Recipes...' : 'Generate TPV Blend Recipes'}
            </button>
            <button onClick={handleNewGeneration} className="new-generation-button">
              New Generation
            </button>
          </div>
        </div>
      )}

      {/* SVG Preview Component */}
      {blendRecipes && result?.svg_url && (
        <SVGPreview
          originalSvgUrl={result.svg_url}
          blendSvgUrl={blendSvgUrl}
          colorMapping={colorMapping}
          recipes={blendRecipes}
        />
      )}

      {/* Blend Recipes Display */}
      {blendRecipes && (
        <BlendRecipesDisplay
          recipes={blendRecipes}
          onClose={() => {
            setBlendRecipes(null);
            setBlendSvgUrl(null);
            setColorMapping(null);
          }}
        />
      )}

      <style jsx>{`
        .inspire-panel-recraft {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .panel-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .panel-header h2 {
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
          color: #1a365d;
        }

        .subtitle {
          color: #666;
          font-size: 0.9rem;
        }

        .form-section {
          background: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }

        .prompt-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        input[type="number"] {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .error-message {
          padding: 0.75rem;
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 4px;
          color: #c33;
          margin-bottom: 1rem;
        }

        .generate-button {
          width: 100%;
          padding: 1rem;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .generate-button:hover:not(:disabled) {
          background: #e55a2b;
        }

        .generate-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .progress-section {
          padding: 1.5rem;
          background: #f0f7ff;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .progress-bar {
          height: 4px;
          background: #ddd;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-bar-fill {
          height: 100%;
          background: #ff6b35;
          animation: progress 2s ease-in-out infinite;
        }

        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-message {
          text-align: center;
          color: #666;
          font-weight: 500;
        }

        .results-section {
          background: #fff;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .results-header h3 {
          margin: 0;
          color: #1a365d;
        }

        /* Aspect Ratio Info */
        .ar-info {
          padding: 0.75rem 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .ar-info.full {
          background: #e8f5e9;
          border: 1px solid #c8e6c9;
        }

        .ar-info.framing {
          background: #fff3e0;
          border: 1px solid #ffe0b2;
        }

        .ar-info.tiling {
          background: #e3f2fd;
          border: 1px solid #bbdefb;
        }

        .ar-info-header {
          color: #333;
          margin-bottom: 0.5rem;
        }

        .ar-info-details {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
          color: #666;
          font-size: 0.85rem;
        }

        .ar-info-details span {
          white-space: nowrap;
        }

        .layout-note {
          color: #ff6b35;
          font-weight: 500;
        }

        .svg-preview {
          margin: 1rem 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #f9f9f9;
          padding: 1rem;
        }

        .design-preview {
          width: 100%;
          height: auto;
          display: block;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .download-button,
        .blend-button,
        .new-generation-button {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .download-button.svg {
          background: #1a365d;
          color: white;
        }

        .download-button.svg:hover {
          background: #0f2240;
        }

        .download-button.png {
          background: #4caf50;
          color: white;
        }

        .download-button.png:hover {
          background: #45a049;
        }

        .blend-button {
          background: #ff6b35;
          color: white;
        }

        .blend-button:hover:not(:disabled) {
          background: #e55a2b;
        }

        .blend-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .new-generation-button {
          background: #e0e0e0;
          color: #333;
        }

        .new-generation-button:hover {
          background: #d0d0d0;
        }
      `}</style>
    </div>
  );
}
