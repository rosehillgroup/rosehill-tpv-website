// TPV Studio - Recraft Vector AI Panel
// Simplified UI for Recraft vector generation with compliance tracking

import { useState } from 'react';
import { apiClient } from '../lib/api/client.js';
import BlendRecipesDisplay from './BlendRecipesDisplay.jsx';
import SVGPreview from './SVGPreview.jsx';
import ColorEditorPanel from './ColorEditorPanel.jsx';
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
  const [showFinalRecipes, setShowFinalRecipes] = useState(false);

  // Color editor state
  const [colorEditorOpen, setColorEditorOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [editedColors, setEditedColors] = useState(new Map()); // originalHex -> {newHex, recipe}

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
      setProgressMessage('Request submitted, waiting for processing...');

      let lastStatus = null;
      let startTime = Date.now();

      // Poll for completion
      await apiClient.waitForRecraftCompletion(
        response.jobId,
        (progressStatus) => {
          setStatus(progressStatus);

          const elapsed = Math.floor((Date.now() - startTime) / 1000);

          // Update status message based on state
          if (progressStatus.status === 'queued') {
            setProgressMessage(`Waiting in queue... (${elapsed}s)`);
          } else if (progressStatus.status === 'running') {
            if (lastStatus !== 'running') {
              setProgressMessage('🎨 AI is creating your design...');
              lastStatus = 'running';
            } else {
              // Rotating messages to keep it interesting
              const runningMessages = [
                `🎨 Creating vector shapes... (${elapsed}s)`,
                `🖌️ Applying colors and patterns... (${elapsed}s)`,
                `✨ Refining design details... (${elapsed}s)`,
                `🎯 Finalizing artwork... (${elapsed}s)`
              ];
              const msgIndex = Math.floor(elapsed / 5) % runningMessages.length;
              setProgressMessage(runningMessages[msgIndex]);
            }
          } else if (progressStatus.status === 'retrying') {
            const attempt = progressStatus.recraft?.attempt_current || 0;
            const maxAttempts = progressStatus.recraft?.attempt_max || 3;
            setProgressMessage(`⚡ Retrying generation (attempt ${attempt}/${maxAttempts})...`);
          }
        }
      );

      // Completed - final status update
      const finalStatus = await apiClient.getRecraftStatus(response.jobId);
      setStatus(finalStatus);
      setResult(finalStatus.result);

      if (finalStatus.status === 'completed') {
        setProgressMessage('✓ Design ready!');
        setGenerating(false);

        // Auto-generate TPV blend recipes
        if (finalStatus.result?.svg_url) {
          await handleGenerateBlends(finalStatus.result.svg_url, response.jobId);
        }
      }
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
    setShowFinalRecipes(false);
    setArMapping(null);
    setColorEditorOpen(false);
    setSelectedColor(null);
    setEditedColors(new Map());
  };

  // Download TPV Blend SVG
  const handleDownloadSVG = () => {
    if (blendSvgUrl) {
      const link = document.createElement('a');
      link.href = blendSvgUrl;
      link.download = `tpv-blend-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Download TPV Blend PNG
  const handleDownloadPNG = () => {
    if (blendSvgUrl) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 1000;
        canvas.height = img.naturalHeight || 1000;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `tpv-blend-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        });
      };
      img.src = blendSvgUrl;
    }
  };

  // Generate TPV blend recipes from the SVG (auto-called after SVG generation)
  const handleGenerateBlends = async (svgUrl = null, jobIdParam = null) => {
    const svg_url = svgUrl || result?.svg_url;
    const job_id = jobIdParam || jobId;

    if (!svg_url) {
      setError('No SVG available to analyze');
      return;
    }

    setGeneratingBlends(true);
    setError(null);
    setProgressMessage('🎨 Extracting colours from design...');

    // Small delay to ensure message renders
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const response = await fetch('/api/blend-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          svg_url,
          job_id,
          max_colors: 8,
          max_components: 2
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate blend recipes');
      }

      if (data.success) {
        setProgressMessage('🔍 Matching TPV granule colours...');
        await new Promise(resolve => setTimeout(resolve, 300));

        setBlendRecipes(data.recipes);

        // Build colour mapping
        const mapping = buildColorMapping(data.recipes);
        setColorMapping(mapping);

        // Generate recoloured SVG
        try {
          setProgressMessage('✨ Generating TPV blend preview...');
          await new Promise(resolve => setTimeout(resolve, 200));

          console.log('[TPV-STUDIO] Generating recoloured SVG...');
          const { dataUrl, stats } = await recolorSVG(svg_url, mapping);
          setBlendSvgUrl(dataUrl);
          setProgressMessage('✓ TPV blend ready!');
          console.log('[TPV-STUDIO] Recoloured SVG generated:', stats);
        } catch (svgError) {
          console.error('[TPV-STUDIO] Failed to generate recoloured SVG:', svgError);
          // Non-fatal error - recipes are still valid
          setError(`Recipes generated successfully, but SVG recolouring failed: ${svgError.message}`);
        }
      } else {
        throw new Error(data.error || 'Unknown error generating recipes');
      }
    } catch (err) {
      console.error('Blend generation failed:', err);
      setError(err.message);
      setProgressMessage('');
    } finally {
      setGeneratingBlends(false);
    }
  };

  // Handle color click from SVGPreview
  const handleColorClick = (colorData) => {
    console.log('[TPV-STUDIO] Color clicked:', colorData);
    setSelectedColor(colorData);
    setColorEditorOpen(true);
    // Close recipes display when editing - user must regenerate after edits
    setShowFinalRecipes(false);
  };

  // Handle color change from ColorEditorPanel
  const handleColorChange = async (newHex) => {
    if (!selectedColor) return;

    console.log('[TPV-STUDIO] Color changed:', selectedColor.hex, '->', newHex);

    // Update edited colors map
    const updated = new Map(editedColors);
    updated.set(selectedColor.originalHex, { newHex });
    setEditedColors(updated);

    // Update selected color
    setSelectedColor({
      ...selectedColor,
      hex: newHex
    });

    // Regenerate blend SVG with updated color
    await regenerateBlendSVG(updated, newHex);
  };

  // Regenerate blend SVG with edited colors
  const regenerateBlendSVG = async (updatedEdits = null, immediateHex = null) => {
    if (!result?.svg_url || !colorMapping) return;

    try {
      // Build updated color mapping with edits
      const updatedMapping = new Map(colorMapping);
      const edits = updatedEdits || editedColors;

      edits.forEach((edit, originalHex) => {
        if (edit.newHex) {
          // Update the blend hex to the new color chosen by user
          updatedMapping.set(originalHex, {
            ...updatedMapping.get(originalHex),
            blendHex: edit.newHex
          });
        }
      });

      // Recolor SVG with updated mapping
      const { dataUrl, stats } = await recolorSVG(result.svg_url, updatedMapping);
      setBlendSvgUrl(dataUrl);
      setColorMapping(updatedMapping);
      console.log('[TPV-STUDIO] Blend SVG regenerated with edits:', stats);
    } catch (err) {
      console.error('[TPV-STUDIO] Failed to regenerate blend SVG:', err);
    }
  };

  // Finalize and generate TPV blend recipes for edited colors
  const handleFinalizeRecipes = async () => {
    if (!editedColors || editedColors.size === 0) {
      // No edits, just show existing recipes
      setShowFinalRecipes(true);
      return;
    }

    setGeneratingBlends(true);
    setProgressMessage('Generating final TPV blend recipes...');
    setError(null);

    try {
      // Match each edited color to find best TPV recipe
      const updatedRecipes = await Promise.all(
        blendRecipes.map(async (recipe) => {
          const edit = editedColors.get(recipe.targetColor.hex);

          if (edit?.newHex) {
            // Color was edited, fetch new recipe
            const response = await fetch('/api/match-color', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                hex: edit.newHex,
                max_components: 2
              })
            });

            const data = await response.json();

            if (data.success && data.recipes && data.recipes.length > 0) {
              // Use the best matching recipe (first one)
              const bestRecipe = data.recipes[0];
              return {
                targetColor: {
                  ...recipe.targetColor,
                  hex: edit.newHex // Update to show edited color
                },
                chosenRecipe: bestRecipe,
                blendColor: bestRecipe.blendColor,
                alternativeRecipes: data.recipes.slice(1, 3) // Include 2 alternatives
              };
            }
          }

          // No edit or matching failed, return original recipe
          return recipe;
        })
      );

      setBlendRecipes(updatedRecipes);
      setShowFinalRecipes(true);
      setProgressMessage('✓ Recipes ready!');
    } catch (err) {
      console.error('[TPV-STUDIO] Failed to finalize recipes:', err);
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

      {/* Unified TPV Blend Display */}
      {result && !generating && (
        <div className="results-section">
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
                    <span className="layout-note">Panel centred with base colour surround</span>
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

          {/* TPV Blend Progress */}
          {generatingBlends && (
            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-bar-fill" />
              </div>
              <p className="progress-message">{progressMessage}</p>
            </div>
          )}

          {/* TPV Blend Preview */}
          {blendSvgUrl && blendRecipes && (
            <SVGPreview
              blendSvgUrl={blendSvgUrl}
              recipes={blendRecipes}
              onColorClick={handleColorClick}
            />
          )}

          {/* Action Buttons - Show when blend is ready */}
          {blendSvgUrl && (
            <div className="action-buttons">
              <button onClick={handleDownloadSVG} className="download-button svg">
                Download TPV Blend SVG
              </button>
              <button onClick={handleDownloadPNG} className="download-button png">
                Download TPV Blend PNG
              </button>
              <button onClick={handleNewGeneration} className="new-generation-button">
                New Generation
              </button>
            </div>
          )}
        </div>
      )}

      {/* Generate Final Recipes Button */}
      {blendSvgUrl && blendRecipes && !showFinalRecipes && !generatingBlends && (
        <div className="finalize-section">
          <button
            onClick={handleFinalizeRecipes}
            className="finalize-button"
          >
            Generate TPV Blend Recipes
          </button>
          <p className="finalize-hint">
            Adjust colours above if needed, then generate the final blend recipes
          </p>
        </div>
      )}

      {/* Blend Recipes Display */}
      {showFinalRecipes && blendRecipes && (
        <BlendRecipesDisplay
          recipes={blendRecipes}
          onClose={() => {
            setShowFinalRecipes(false);
          }}
        />
      )}

      {/* Color Editor Panel */}
      {colorEditorOpen && selectedColor && (
        <ColorEditorPanel
          color={selectedColor}
          onColorChange={handleColorChange}
          onClose={() => {
            setColorEditorOpen(false);
            setSelectedColor(null);
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

        /* Finalize Section */
        .finalize-section {
          background: #fff9f7;
          border: 2px solid #ff6b35;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 1.5rem;
          text-align: center;
        }

        .finalize-button {
          width: 100%;
          max-width: 400px;
          padding: 1rem 2rem;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .finalize-button:hover {
          background: #e55a2b;
        }

        .finalize-hint {
          margin: 0.75rem 0 0 0;
          color: #666;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
