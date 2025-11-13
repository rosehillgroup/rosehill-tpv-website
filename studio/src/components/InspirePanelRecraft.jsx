// TPV Studio - Recraft Vector AI Panel
// Simplified UI for Recraft vector generation with compliance tracking

import { useState } from 'react';
import { apiClient } from '../lib/api/client.js';

export default function InspirePanelRecraft() {
  // Form state
  const [prompt, setPrompt] = useState('');
  const [lengthMM, setLengthMM] = useState(5000);
  const [widthMM, setWidthMM] = useState(5000);
  const [maxColours, setMaxColours] = useState(6);
  const [seed, setSeed] = useState('');

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Progress tracking
  const [progressMessage, setProgressMessage] = useState('');
  const [attemptInfo, setAttemptInfo] = useState(null);

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
      // Create job
      const response = await apiClient.generateRecraft({
        prompt: prompt.trim(),
        lengthMM,
        widthMM,
        maxColours,
        seed: seed ? parseInt(seed, 10) : null
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

          // Update progress message
          if (progressStatus.progress_message) {
            setProgressMessage(progressStatus.progress_message);
          }

          // Update attempt info
          if (progressStatus.recraft) {
            setAttemptInfo({
              current: progressStatus.recraft.attempt_current,
              max: progressStatus.recraft.attempt_max,
              compliant: progressStatus.recraft.compliant,
              allAttempts: progressStatus.recraft.all_attempts
            });
          }

          // Update status message based on state
          if (progressStatus.status === 'queued') {
            setProgressMessage('In queue...');
          } else if (progressStatus.status === 'running') {
            setProgressMessage('Generating vector design...');
          } else if (progressStatus.status === 'retrying') {
            const attempt = progressStatus.recraft?.attempt_current || 0;
            const max = progressStatus.recraft?.attempt_max || 3;
            setProgressMessage(`Quality check ${attempt}/${max} - refining design...`);
          }
        }
      );

      // Completed - final status update
      const finalStatus = await apiClient.getRecraftStatus(response.jobId);
      setStatus(finalStatus);
      setResult(finalStatus.result);

      if (finalStatus.status === 'completed') {
        if (finalStatus.recraft?.compliant) {
          setProgressMessage('✓ Design ready and installer-compliant!');
        } else {
          setProgressMessage('⚠ Design generated (non-compliant - review warnings)');
        }
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
    setSeed('');
    setGenerating(false);
    setJobId(null);
    setStatus(null);
    setResult(null);
    setError(null);
    setProgressMessage('');
    setAttemptInfo(null);
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

  return (
    <div className="inspire-panel-recraft">
      <div className="panel-header">
        <h2>TPV Studio - Vector AI</h2>
        <p className="subtitle">AI-powered vector designs with automatic quality validation</p>
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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="maxColours">
              Max Colours: {maxColours}
            </label>
            <input
              id="maxColours"
              type="range"
              value={maxColours}
              onChange={(e) => setMaxColours(parseInt(e.target.value, 10))}
              min={3}
              max={8}
              step={1}
              disabled={generating}
              className="colour-slider"
            />
            <div className="slider-labels">
              <span>3</span>
              <span>8</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="seed">Seed (optional)</label>
            <input
              id="seed"
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Random"
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

          {attemptInfo && (
            <div className="attempt-info">
              <p>Attempt {attemptInfo.current} of {attemptInfo.max}</p>
              {attemptInfo.allAttempts && attemptInfo.allAttempts.length > 0 && (
                <div className="attempts-grid">
                  {attemptInfo.allAttempts.map((attempt, idx) => (
                    <div key={idx} className={`attempt-thumb ${attempt.passed ? 'passed' : 'failed'}`}>
                      <img src={attempt.thumb_url} alt={`Attempt ${attempt.attempt}`} />
                      <span className="attempt-label">
                        #{attempt.attempt} {attempt.passed ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results Display */}
      {result && !generating && (
        <div className="results-section">
          <div className="results-header">
            <h3>Result</h3>
            {status?.recraft?.compliant !== null && (
              <span className={`compliance-badge ${status.recraft.compliant ? 'compliant' : 'non-compliant'}`}>
                {status.recraft.compliant ? '✓ Installer-Ready' : '⚠ Non-Compliant'}
              </span>
            )}
          </div>

          {/* SVG Preview */}
          {result.svg_url && (
            <div className="svg-preview">
              <img src={result.svg_url} alt="Generated design" className="design-preview" />
            </div>
          )}

          {/* Inspector Warnings */}
          {status?.recraft?.inspector_reasons && status.recraft.inspector_reasons.length > 0 && (
            <div className="inspector-warnings">
              <h4>⚠ Compliance Issues:</h4>
              <ul>
                {status.recraft.inspector_reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
              <p className="warning-note">
                This design may not be suitable for installation without modifications.
              </p>
            </div>
          )}

          {/* Attempt History */}
          {attemptInfo?.allAttempts && attemptInfo.allAttempts.length > 1 && (
            <details className="attempt-history">
              <summary>View All Attempts ({attemptInfo.allAttempts.length})</summary>
              <div className="attempts-list">
                {attemptInfo.allAttempts.map((attempt, idx) => (
                  <div key={idx} className="attempt-item">
                    <img src={attempt.thumb_url} alt={`Attempt ${attempt.attempt}`} />
                    <div className="attempt-details">
                      <strong>Attempt {attempt.attempt}</strong>
                      <span className={attempt.passed ? 'passed' : 'failed'}>
                        {attempt.passed ? '✓ Passed' : '✗ Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleDownloadSVG} className="download-button svg">
              Download SVG
            </button>
            <button onClick={handleDownloadPNG} className="download-button png">
              Download PNG Preview
            </button>
            <button onClick={handleNewGeneration} className="new-generation-button">
              New Generation
            </button>
          </div>
        </div>
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

        .colour-slider {
          width: 100%;
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #666;
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

        .attempt-info {
          margin-top: 1rem;
          text-align: center;
        }

        .attempts-grid {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 0.5rem;
        }

        .attempt-thumb {
          position: relative;
          width: 60px;
          height: 60px;
          border: 2px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }

        .attempt-thumb.passed {
          border-color: #4caf50;
        }

        .attempt-thumb.failed {
          border-color: #f44336;
        }

        .attempt-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .attempt-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          font-size: 0.7rem;
          text-align: center;
          padding: 2px;
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

        .compliance-badge {
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .compliance-badge.compliant {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .compliance-badge.non-compliant {
          background: #fff3e0;
          color: #e65100;
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

        .inspector-warnings {
          background: #fff3e0;
          padding: 1rem;
          border-radius: 4px;
          margin: 1rem 0;
        }

        .inspector-warnings h4 {
          margin: 0 0 0.5rem 0;
          color: #e65100;
        }

        .inspector-warnings ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .warning-note {
          margin: 0.5rem 0 0 0;
          font-size: 0.9rem;
          font-style: italic;
          color: #666;
        }

        .attempt-history {
          margin: 1rem 0;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 4px;
        }

        .attempt-history summary {
          cursor: pointer;
          font-weight: 600;
          color: #1a365d;
        }

        .attempts-list {
          margin-top: 1rem;
          display: grid;
          gap: 0.5rem;
        }

        .attempt-item {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 0.5rem;
          background: white;
          border-radius: 4px;
        }

        .attempt-item img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
        }

        .attempt-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .attempt-details .passed {
          color: #4caf50;
        }

        .attempt-details .failed {
          color: #f44336;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .download-button,
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
