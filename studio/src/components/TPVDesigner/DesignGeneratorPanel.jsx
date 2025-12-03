// TPV Designer - Design Generator Panel
// Slide-out panel for generating new designs (AI prompts or SVG uploads)

import React, { useState, useEffect, useCallback } from 'react';
import InspirePanelRecraft from '../InspirePanelRecraft.jsx';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { fetchMotifFromDesign } from '../../lib/sports/motifUtils.js';
import './DesignGeneratorPanel.css';

/**
 * DesignGeneratorPanel - Slide-out panel for design generation
 *
 * This panel embeds the InspirePanelRecraft component in a slide-out drawer,
 * allowing users to generate designs and add them directly to the canvas.
 */
function DesignGeneratorPanel({ isOpen, onClose }) {
  const [lastSavedDesignId, setLastSavedDesignId] = useState(null);
  const [lastSavedDesignName, setLastSavedDesignName] = useState(null);
  const [isAddingToCanvas, setIsAddingToCanvas] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const { addMotif } = useSportsDesignStore();

  // Handle Escape key to close panel
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setAddSuccess(false);
    }
  }, [isOpen]);

  // Handle when a design is saved in InspirePanelRecraft
  const handleDesignSaved = (designName, designId) => {
    console.log('[GENERATOR] Design saved:', designName, designId);
    setLastSavedDesignId(designId);
    setLastSavedDesignName(designName);
    setAddSuccess(false); // Reset success state for new design
  };

  // Add the saved design to canvas as a motif
  const handleAddToCanvas = async () => {
    if (!lastSavedDesignId || isAddingToCanvas) return;

    setIsAddingToCanvas(true);
    try {
      const motifData = await fetchMotifFromDesign(lastSavedDesignId);
      addMotif(
        motifData.sourceDesignId,
        motifData.sourceDesignName,
        motifData.svgContent,
        motifData.originalWidth_mm,
        motifData.originalHeight_mm,
        motifData.sourceThumbnailUrl,
        {
          solidSvgContent: motifData.solidSvgContent,
          blendSvgContent: motifData.blendSvgContent,
          hasBothVersions: motifData.hasBothVersions
        }
      );

      // Show success feedback briefly, then close
      setAddSuccess(true);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      console.error('[GENERATOR] Failed to add to canvas:', error);
      alert('Failed to add design to canvas: ' + error.message);
    } finally {
      setIsAddingToCanvas(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="generator-panel-overlay" onClick={onClose}>
      <div className="generator-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="generator-panel__header">
          <h2>Generate New Design</h2>
          <button className="generator-panel__close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Embedded InspirePanelRecraft */}
        <div className="generator-panel__content">
          <InspirePanelRecraft
            onDesignSaved={handleDesignSaved}
            isEmbedded={true}
          />
        </div>

        {/* Footer with Add to Canvas action */}
        {lastSavedDesignId && (
          <div className={`generator-panel__footer ${addSuccess ? 'generator-panel__footer--success' : ''}`}>
            {addSuccess ? (
              <div className="generator-panel__success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Added to canvas!</span>
              </div>
            ) : (
              <>
                <p className="generator-panel__hint">
                  <strong>{lastSavedDesignName}</strong> saved! Add it to your canvas or continue editing.
                </p>
                <button
                  className="generator-panel__add-btn"
                  onClick={handleAddToCanvas}
                  disabled={isAddingToCanvas}
                >
                  {isAddingToCanvas ? (
                    <>
                      <span className="generator-panel__spinner"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                      Add to Canvas
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DesignGeneratorPanel;
