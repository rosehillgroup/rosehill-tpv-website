// TPV Designer - Full-Screen Design Editor Modal
// Full-screen modal for generating and editing designs with proper space for color editing

import React, { useState, useEffect, useCallback } from 'react';
import InspirePanelRecraft from '../InspirePanelRecraft.jsx';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { usePlaygroundDesignStore } from '../../stores/playgroundDesignStore.js';
import { extractSVGDimensions } from '../../lib/sports/motifUtils.js';
import { saveDesign } from '../../lib/api/designs.js';
import { serializeDesign } from '../../utils/designSerializer.js';
import './DesignEditorModal.css';

/**
 * DesignEditorModal - Full-screen modal for design generation and editing
 *
 * Provides full viewport space for:
 * - AI prompt generation or SVG upload
 * - Large SVG preview with zoom/pan
 * - Color legend and editing tools
 * - Mixer widget for blend adjustments
 */
function DesignEditorModal({ isOpen, onClose }) {
  const [isAddingToCanvas, setIsAddingToCanvas] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const { addMotif } = useSportsDesignStore();

  // Get playground store state for checking if design exists
  const playgroundStore = usePlaygroundDesignStore();
  const { currentDesignId, blendSvgUrl, solidSvgUrl, designName } = playgroundStore;

  // Check if there's a design ready (either saved or generated)
  const hasDesign = blendSvgUrl || solidSvgUrl;
  const isSaved = !!currentDesignId;

  // Handle Escape key to close modal
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

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAddSuccess(false);
      setIsAddingToCanvas(false);
      setIsSaving(false);
    }
  }, [isOpen]);

  // Handle design saved callback from InspirePanelRecraft
  const handleDesignSaved = useCallback((name, designId) => {
    console.log('[EDITOR] Design saved:', name, designId);
    setAddSuccess(false);
  }, []);

  // Auto-save and add to canvas - uses current in-memory SVG directly
  const handleAddToCanvas = async () => {
    if (!hasDesign || isAddingToCanvas) return;

    setIsAddingToCanvas(true);
    try {
      // Get the current SVG URLs from the store (these are blob URLs showing current edits)
      const { blendSvgUrl: currentBlendUrl, solidSvgUrl: currentSolidUrl, widthMM, lengthMM } = playgroundStore;

      // Fetch the actual SVG content from the blob URLs
      let solidSvgContent = null;
      let blendSvgContent = null;

      if (currentSolidUrl) {
        try {
          const response = await fetch(currentSolidUrl);
          solidSvgContent = await response.text();
          console.log('[EDITOR] Fetched solid SVG from blob:', solidSvgContent.length, 'chars');
        } catch (err) {
          console.error('[EDITOR] Failed to fetch solid SVG:', err);
        }
      }

      if (currentBlendUrl) {
        try {
          const response = await fetch(currentBlendUrl);
          blendSvgContent = await response.text();
          console.log('[EDITOR] Fetched blend SVG from blob:', blendSvgContent.length, 'chars');
        } catch (err) {
          console.error('[EDITOR] Failed to fetch blend SVG:', err);
        }
      }

      if (!solidSvgContent && !blendSvgContent) {
        throw new Error('No SVG content available. Please ensure a design has been generated.');
      }

      // Extract dimensions from SVG viewBox (more accurate than store dimensions)
      const svgContent = solidSvgContent || blendSvgContent;
      const svgDimensions = extractSVGDimensions(svgContent);

      // Use SVG dimensions if available, fall back to store dimensions, then default
      let originalWidth_mm = widthMM || 5000;
      let originalHeight_mm = lengthMM || 5000;

      if (svgDimensions) {
        // SVG dimensions are in pixels, scale to mm (assume 1px = 1mm for designs)
        // Maintain aspect ratio from SVG
        const aspectRatio = svgDimensions.width / svgDimensions.height;
        if (aspectRatio > 1) {
          // Wider than tall
          originalWidth_mm = Math.max(widthMM || 5000, 5000);
          originalHeight_mm = originalWidth_mm / aspectRatio;
        } else {
          // Taller than wide or square
          originalHeight_mm = Math.max(lengthMM || 5000, 5000);
          originalWidth_mm = originalHeight_mm * aspectRatio;
        }
        console.log('[EDITOR] Using SVG aspect ratio:', aspectRatio, '→', originalWidth_mm, 'x', originalHeight_mm, 'mm');
      }

      // Always save to persist the current state (with edits)
      setIsSaving(true);
      let designId = currentDesignId;

      // Generate a name if none exists
      const autoName = designName || `Design ${new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })}`;

      // Serialize the current design state (includes all edits)
      const designData = serializeDesign(playgroundStore);

      // Save to database (create or update)
      const savedDesign = await saveDesign({
        id: designId || undefined, // Include ID to update existing design
        name: autoName,
        description: '',
        tags: [],
        design_data: designData,
        input_mode: playgroundStore.inputMode
      });

      designId = savedDesign.design_id;

      // Update the store with the saved ID
      playgroundStore.setCurrentDesignId(designId);
      playgroundStore.setDesignName(autoName);
      setIsSaving(false);

      // Get thumbnail URL
      const thumbnailUrl = playgroundStore.result?.thumb_url || playgroundStore.result?.png_url || null;

      // Add the motif using the CURRENT in-memory SVG content (not fetched from DB)
      addMotif(
        designId,
        autoName,
        solidSvgContent || blendSvgContent,
        originalWidth_mm,
        originalHeight_mm,
        thumbnailUrl,
        {
          solidSvgContent: solidSvgContent,
          blendSvgContent: blendSvgContent,
          hasBothVersions: !!(solidSvgContent && blendSvgContent)
        }
      );

      // Show success feedback briefly, then close
      setAddSuccess(true);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (error) {
      console.error('[EDITOR] Failed to add to canvas:', error);
      alert('Failed to add design to canvas: ' + error.message);
      setIsSaving(false);
    } finally {
      setIsAddingToCanvas(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="design-editor-overlay">
      <div className="design-editor-modal">
        {/* Header */}
        <div className="design-editor__header">
          <div className="design-editor__title">
            <h2>Design Editor</h2>
          </div>
          <div className="design-editor__hint">
            Generate a design with AI or upload your own SVG
          </div>
          <button className="design-editor__close" onClick={onClose} title="Close (Esc)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Full InspirePanelRecraft */}
        <div className="design-editor__content">
          <InspirePanelRecraft
            onDesignSaved={handleDesignSaved}
            isEmbedded={true}
          />
        </div>

        {/* Footer with actions */}
        <div className={`design-editor__footer ${addSuccess ? 'design-editor__footer--success' : ''}`}>
          {addSuccess ? (
            <div className="design-editor__success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>Added to canvas!</span>
            </div>
          ) : (
            <>
              <div className="design-editor__status">
                {hasDesign ? (
                  isSaved ? (
                    <span className="design-editor__saved-indicator">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Saved to library
                    </span>
                  ) : (
                    <span className="design-editor__unsaved-indicator">
                      Design ready • Will auto-save when added
                    </span>
                  )
                ) : (
                  <span className="design-editor__no-design">
                    Generate or upload a design to continue
                  </span>
                )}
              </div>
              <div className="design-editor__actions">
                <button
                  className="design-editor__btn design-editor__btn--secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="design-editor__btn design-editor__btn--primary"
                  onClick={handleAddToCanvas}
                  disabled={!hasDesign || isAddingToCanvas}
                >
                  {isAddingToCanvas ? (
                    <>
                      <span className="design-editor__spinner"></span>
                      {isSaving ? 'Saving...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                      Add to Canvas
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DesignEditorModal;
