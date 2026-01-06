// TPV Studio - Recraft Vector AI Panel
// Simplified UI for Recraft vector generation with compliance tracking

import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '../lib/api/client.js';
import { auth } from '../lib/api/auth.js';
import { listDesigns } from '../lib/api/designs.js';
import { usePlaygroundDesignStore } from '../stores/playgroundDesignStore.js';
import BlendRecipesDisplay from './BlendRecipesDisplay.jsx';
import SolidColorSummary from './SolidColorSummary.jsx';
import SVGPreview from './SVGPreview.jsx';
import ColorEditorPanel from './ColorEditorPanel.jsx';
import MiniMixerWidget from './MiniMixerWidget.jsx';
import SaveDesignModal from './SaveDesignModal.jsx';
import InSituModal from './InSitu/InSituModal.jsx';
import DimensionModal from './DimensionModal.jsx';
import { buildColorMapping } from '../utils/colorMapping.js';
import { recolorSVG } from '../utils/svgRecolor.js';
import { tagSvgRegions } from '../utils/svgRegionTagger.js';
import { normalizeSVG } from '../utils/svgNormalize.js';
import ComplexityBadge from './ComplexityBadge.jsx';
import { flattenSvg, isFlattened } from '../lib/flattenArtwork.js';
import { performTrueCutout, canPerformCutout, estimateBooleanCost } from '../lib/paperBoolean.js';
import { applyRegionOverrides } from '../utils/svgRegionOverrides.js';
import { deriveCurrentColors, hasColorEdits } from '../utils/deriveCurrentColors.js';
import { mapDimensionsToRecraft, getLayoutDescription, needsLayoutWarning } from '../utils/aspectRatioMapping.js';
import { uploadFile, validateFile } from '../lib/supabase/uploadFile.js';
import { deserializeDesign } from '../utils/designSerializer.js';
import { downloadSvgTiles } from '../lib/svgTileSlicer.js';
import PlaygroundExportMenu from './PlaygroundExportMenu.jsx';
import tpvColours from '../../api/_utils/data/rosehill_tpv_21_colours.json';
import { FEATURE_FLAGS } from '../lib/constants.js';

/**
 * Detect file type from File object (MIME type with extension fallback)
 * @param {File} file - The file to check
 * @returns {'svg'|'image'|null} Detected file type
 */
function detectFileType(file) {
  if (!file) return null;

  // Check MIME type first (most reliable)
  if (file.type === 'image/svg+xml') return 'svg';
  if (file.type === 'image/png' || file.type === 'image/jpeg') return 'image';

  // Fallback to extension for files without proper MIME type
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'svg') return 'svg';
  if (['png', 'jpg', 'jpeg'].includes(ext)) return 'image';

  return null; // Unknown type
}

export default function InspirePanelRecraft({ loadedDesign, onDesignSaved, isEmbedded = false }) {
  // ====== PERSISTENT STATE (from Zustand store - survives mode switches) ======
  const store = usePlaygroundDesignStore();

  // Destructure for direct access (store functions are used via store.xxx for setters)
  const {
    inputMode, prompt, lengthMM, widthMM, arMapping, uploadedFileUrl,
    result, jobId,
    blendRecipes, colorMapping, blendSvgUrl, blendEditedColors,
    solidRecipes, solidColorMapping, solidSvgUrl, solidEditedColors,
    viewMode, showFinalRecipes, showSolidSummary,
    regionOverrides, originalTaggedSvg, regionOverridesHistory, historyIndex,
    designName, currentDesignId,
    hasUnsavedChanges, resetDesign
  } = store;

  // Store action shortcuts (for cleaner JSX)
  const setInputMode = store.setInputMode;
  const setPrompt = store.setPrompt;
  const setDimensions = store.setDimensions;
  const setArMapping = store.setArMapping;
  const setGenerationResult = store.setGenerationResult;
  const setResult = store.setResult;
  const setJobId = store.setJobId;
  const setBlendState = store.setBlendState;
  const setBlendRecipes = store.setBlendRecipes;
  const setColorMapping = store.setColorMapping;
  const setBlendSvgUrl = store.setBlendSvgUrl;
  const setSolidState = store.setSolidState;
  const setSolidRecipes = store.setSolidRecipes;
  const setSolidColorMapping = store.setSolidColorMapping;
  const setSolidSvgUrl = store.setSolidSvgUrl;
  const updateBlendSvgUrl = store.updateBlendSvgUrl;
  const updateSolidSvgUrl = store.updateSolidSvgUrl;
  const setBlendEditedColors = store.setBlendEditedColors;
  const setSolidEditedColors = store.setSolidEditedColors;
  const setViewMode = store.setViewMode;
  const setShowFinalRecipes = store.setShowFinalRecipes;
  const setShowSolidSummary = store.setShowSolidSummary;
  const setRegionOverrides = store.setRegionOverrides;
  const addRegionOverride = store.addRegionOverride;
  const setOriginalTaggedSvg = store.setOriginalTaggedSvg;
  const setRegionOverridesHistory = store.setRegionOverridesHistory;
  const setHistoryIndex = store.setHistoryIndex;
  const canUndo = store.canUndo;
  const canRedo = store.canRedo;
  const storeUndo = store.undo;
  const storeRedo = store.redo;
  const setDesignName = store.setDesignName;
  const setCurrentDesignId = store.setCurrentDesignId;
  const loadDesignFromStore = store.loadDesign;

  // Helper setters for individual dimensions (wrap setDimensions)
  const setWidthMM = (width) => setDimensions(width, lengthMM);
  const setLengthMM = (length) => setDimensions(widthMM, length);

  // ====== LOCAL STATE (UI-only, resets on remount - that's fine) ======

  // File upload state (File object can't be in store, but uploaded URL can)
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Generation progress state
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [progressMessage, setProgressMessage] = useState('');
  const [attemptInfo, setAttemptInfo] = useState(null);

  // Color editor UI state
  const [colorEditorOpen, setColorEditorOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  // Eyedropper UI state
  const [eyedropperActive, setEyedropperActive] = useState(false);
  const [eyedropperRegion, setEyedropperRegion] = useState(null); // {regionId, sourceColor}
  const [regionRecolorQueue, setRegionRecolorQueue] = useState([]); // Queue of {regionId, newHex} operations
  const [isProcessingQueue, setIsProcessingQueue] = useState(false); // Track if currently processing queue

  // Mixer UI state (for blend mode only)
  const [mixerOpen, setMixerOpen] = useState(false);
  const [mixerColor, setMixerColor] = useState(null); // Color being edited in mixer

  // Save modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isNameLoading, setIsNameLoading] = useState(false);

  // In-situ preview modal state
  const [showInSituModal, setShowInSituModal] = useState(false);
  const [inSituData, setInSituData] = useState(null);

  // Dimension modal state
  const [showDimensionModal, setShowDimensionModal] = useState(false);
  const [svgAspectRatio, setSvgAspectRatio] = useState(null);
  const [pendingDownloadAction, setPendingDownloadAction] = useState(null); // 'pdf' or 'tiles'
  const [confirmedDimensions, setConfirmedDimensions] = useState(null); // {width, height} - directly passed to modals

  // Flatten artwork state (Phase 3)
  const [isFlattenProcessing, setIsFlattenProcessing] = useState(false);
  const [flattenProgress, setFlattenProgress] = useState(0);
  const [flattenError, setFlattenError] = useState(null);

  // True cut-out state (Phase 2 - Boolean operations)
  const [isCutoutProcessing, setIsCutoutProcessing] = useState(false);
  const [cutoutError, setCutoutError] = useState(null);

  // Derived/current recipes (original + edits with accurate coverage)
  const [currentBlendRecipes, setCurrentBlendRecipes] = useState(null);
  const [currentSolidRecipes, setCurrentSolidRecipes] = useState(null);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Welcome box state - check if user has any saved designs
  const [hasExistingDesigns, setHasExistingDesigns] = useState(null); // null = not checked, true/false = result

  // Ref for SVG preview section (for auto-scroll)
  const svgPreviewRef = useRef(null);

  // Ref for polling abort controller (cancels polling on unmount)
  const pollingAbortRef = useRef(null);

  // Auto-scroll to SVG preview when it becomes available
  useEffect(() => {
    // Don't auto-scroll if user is actively editing colors (prevents infinite scroll loop)
    if ((solidSvgUrl || blendSvgUrl) && svgPreviewRef.current && !mixerOpen && !colorEditorOpen) {
      // Delay scroll slightly to ensure content is rendered
      setTimeout(() => {
        svgPreviewRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
    }
  }, [solidSvgUrl, blendSvgUrl, mixerOpen, colorEditorOpen]);

  // Check if user has any existing designs (for welcome box visibility)
  useEffect(() => {
    const checkForExistingDesigns = async () => {
      try {
        const result = await listDesigns({ limit: 1, offset: 0 });
        setHasExistingDesigns(result.designs.length > 0);
      } catch (err) {
        console.error('[INSPIRE] Failed to check for existing designs:', err);
        // On error, assume user has designs (fail-safe to not annoy users)
        setHasExistingDesigns(true);
      }
    };

    checkForExistingDesigns();
  }, []);

  // Reset dimensions when switching to upload mode
  useEffect(() => {
    if (inputMode === 'upload') {
      // Clear dimensions for upload mode - they'll be set via modal when needed
      setDimensions(null, null);
    } else if (inputMode === 'prompt') {
      // Restore default dimensions for prompt mode if they're null
      if (widthMM === null || lengthMM === null) {
        setDimensions(5000, 5000);
      }
    }
  }, [inputMode, setDimensions]);

  // Cleanup blob URLs and abort polling on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Abort any ongoing polling
      if (pollingAbortRef.current) {
        pollingAbortRef.current.abort();
      }
      // Revoke blob URLs
      if (blendSvgUrl && blendSvgUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blendSvgUrl);
      }
      if (solidSvgUrl && solidSvgUrl.startsWith('blob:')) {
        URL.revokeObjectURL(solidSvgUrl);
      }
    };
  }, []);

  // ESC key handler to cancel eyedropper mode
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && eyedropperActive) {
        setEyedropperActive(false);
        setEyedropperRegion(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [eyedropperActive]);

  // Process region recolor queue when items are added
  useEffect(() => {
    if (regionRecolorQueue.length > 0 && !isProcessingQueue) {
      processNextInQueue();
    }
  }, [regionRecolorQueue, isProcessingQueue]);

  // Recalculate current recipes when SVG or region overrides change
  useEffect(() => {
    const recalculateCurrentRecipes = async () => {
      // Skip if no SVG or recipes available
      if (!blendSvgUrl && !solidSvgUrl) {
        setCurrentBlendRecipes(null);
        setCurrentSolidRecipes(null);
        return;
      }

      // Skip if no edits have been made (use original recipes)
      if (!hasColorEdits(regionOverrides)) {
        setCurrentBlendRecipes(blendRecipes);
        setCurrentSolidRecipes(solidRecipes);
        return;
      }

      setIsRecalculating(true);

      try {
        // Recalculate blend mode recipes
        if (blendSvgUrl && blendRecipes) {
          const derived = await deriveCurrentColors(blendSvgUrl, blendRecipes, regionOverrides, 'blend');
          setCurrentBlendRecipes(derived);
        }

        // Recalculate solid mode recipes
        if (solidSvgUrl && solidRecipes) {
          const derived = await deriveCurrentColors(solidSvgUrl, solidRecipes, regionOverrides, 'solid');
          setCurrentSolidRecipes(derived);
        }
      } catch (err) {
        console.error('[INSPIRE] Failed to recalculate recipes:', err);
        // Fall back to original recipes on error
        setCurrentBlendRecipes(blendRecipes);
        setCurrentSolidRecipes(solidRecipes);
      } finally {
        setIsRecalculating(false);
      }
    };

    recalculateCurrentRecipes();
  }, [blendSvgUrl, solidSvgUrl, regionOverrides, blendRecipes, solidRecipes]);

  // Load design when loadedDesign prop changes
  useEffect(() => {
    if (loadedDesign) {
      const restoredState = deserializeDesign(loadedDesign);

      // Load state into the Zustand store
      loadDesignFromStore(restoredState);

      // Set design name and ID from saved design
      if (loadedDesign.name) {
        setDesignName(loadedDesign.name);
      }
      if (loadedDesign.id) {
        setCurrentDesignId(loadedDesign.id);
      }


      // Regenerate SVGs from saved state (blob URLs don't survive page reload)
      // This needs to happen after state is set, so we use a timeout
      setTimeout(async () => {
        if (restoredState.result?.svg_url) {

          // Use saved tagged SVG if available (preserves region IDs for overrides)
          // Otherwise, fetch and tag the original SVG for region-based editing
          let taggedSvg = restoredState.originalTaggedSvg || null;

          if (taggedSvg) {
            setOriginalTaggedSvg(taggedSvg);
          } else {
            // No saved tagged SVG - fetch, normalize, and tag fresh
            try {
              const svgResponse = await fetch(restoredState.result.svg_url);
              const svgText = await svgResponse.text();
              const normalizedSvg = normalizeSVG(svgText);
              taggedSvg = tagSvgRegions(normalizedSvg);
              setOriginalTaggedSvg(taggedSvg);
            } catch (tagError) {
              console.error('[INSPIRE] Failed to tag SVG regions:', tagError);
            }
          }

          try {
            // Regenerate blend SVG if we have blend recipes
            if (restoredState.blendRecipes && restoredState.colorMapping) {
              await regenerateBlendSVGFromState(
                restoredState.result.svg_url,
                restoredState.colorMapping,
                restoredState.blendRecipes,
                restoredState.blendEditedColors,
                taggedSvg,
                restoredState.regionOverrides
              );
            }

            // Regenerate solid SVG if we have solid recipes
            if (restoredState.solidRecipes && restoredState.solidColorMapping) {
              await regenerateSolidSVGFromState(
                restoredState.result.svg_url,
                restoredState.solidColorMapping,
                restoredState.solidRecipes,
                restoredState.solidEditedColors,
                taggedSvg,
                restoredState.regionOverrides
              );
            }
          } catch (err) {
            console.error('[INSPIRE] Failed to regenerate SVGs:', err);
            setError('Failed to restore design preview. Please try reloading.');
          }
        }
      }, 100);
    }
  }, [loadedDesign, loadDesignFromStore, setDesignName, setCurrentDesignId, setOriginalTaggedSvg]);

  // Track if we've done initial regeneration for directly-loaded designs
  const hasRegeneratedRef = useRef(false);

  // Regenerate SVGs when store has result but no SVG URLs (e.g., loaded via handleEditSourceDesign)
  useEffect(() => {
    // Skip if we're using the loadedDesign prop flow (that handles its own regeneration)
    if (loadedDesign) return;

    // Skip if we've already regenerated for this session
    if (hasRegeneratedRef.current) return;

    // Check if we have result with svg_url but no generated SVG URLs
    const needsRegeneration = result?.svg_url && !blendSvgUrl && !solidSvgUrl && (blendRecipes || solidRecipes);

    if (!needsRegeneration) return;

    // Mark as regenerated to prevent re-triggering
    hasRegeneratedRef.current = true;


    const regenerateSvgs = async () => {
      // Use saved tagged SVG if available (preserves region IDs for overrides)
      // Otherwise, fetch and tag the original SVG for region-based editing
      let taggedSvg = originalTaggedSvg || null;

      if (taggedSvg) {
      } else {
        try {
          const svgResponse = await fetch(result.svg_url);
          const svgText = await svgResponse.text();
          const normalizedSvg = normalizeSVG(svgText);
          taggedSvg = tagSvgRegions(normalizedSvg);
          setOriginalTaggedSvg(taggedSvg);
        } catch (tagError) {
          console.error('[INSPIRE] Failed to tag SVG regions:', tagError);
        }
      }

      try {
        // Regenerate blend SVG if we have blend recipes
        if (blendRecipes && colorMapping) {
          await regenerateBlendSVGFromState(
            result.svg_url,
            colorMapping,
            blendRecipes,
            blendEditedColors,
            taggedSvg,
            regionOverrides
          );
        }

        // Regenerate solid SVG if we have solid recipes
        if (solidRecipes && solidColorMapping) {
          await regenerateSolidSVGFromState(
            result.svg_url,
            solidColorMapping,
            solidRecipes,
            solidEditedColors,
            taggedSvg,
            regionOverrides
          );
        }
      } catch (err) {
        console.error('[INSPIRE] Failed to regenerate SVGs:', err);
        setError('Failed to restore design preview. Please try reloading.');
      }
    };

    regenerateSvgs();
  }, [result, blendSvgUrl, solidSvgUrl, blendRecipes, solidRecipes, colorMapping, solidColorMapping, loadedDesign, regionOverrides, originalTaggedSvg]);

  // Reset the regeneration flag when the design changes (e.g., new design loaded)
  useEffect(() => {
    if (!result) {
      hasRegeneratedRef.current = false;
    }
  }, [result]);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file type - accept all supported types in unified upload mode
    const validation = validateFile(file, {
      maxSizeMB: 10,
      allowedTypes: ['image/png', 'image/jpeg', 'image/svg+xml']
    });

    if (!validation.valid) {
      setError(validation.error);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  // Handle drag and drop events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone entirely
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type - accept all supported types in unified upload mode
      const validation = validateFile(file, {
        maxSizeMB: 10,
        allowedTypes: ['image/png', 'image/jpeg', 'image/svg+xml']
      });

      if (!validation.valid) {
        setError(validation.error);
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  // Handle form submission - supports all three input modes
  const handleGenerate = async () => {
    // Validate inputs based on mode
    if (inputMode === 'prompt' && !prompt.trim()) {
      setError('Please enter a design description');
      return;
    }

    if (inputMode === 'upload' && !selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    // Validate file type for uploads
    if (inputMode === 'upload' && selectedFile) {
      const fileType = detectFileType(selectedFile);
      if (!fileType) {
        setError('Unsupported file type. Please upload PNG, JPG, or SVG.');
        return;
      }
    }

    setError(null);
    setGenerating(true);
    setStatus(null);
    setResult(null);
    setJobId(null);
    setProgressMessage('Initialising...');
    setAttemptInfo(null);

    try {
      let response;

      // MODE: Upload (auto-detect SVG vs Image)
      if (inputMode === 'upload' && selectedFile) {
        const fileType = detectFileType(selectedFile);

        // Upload file to Supabase (same for both types)
        setProgressMessage(fileType === 'svg' ? 'Uploading SVG file...' : 'Uploading image...');
        setUploadProgress('Uploading...');

        const uploadResult = await uploadFile(selectedFile);
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload file');
        }
        setUploadProgress(null);

        if (fileType === 'svg') {
          // SVG: Fast path - process immediately without AI
          setProgressMessage('Processing SVG...');

          response = await apiClient.processUploadedSVG({
            svg_url: uploadResult.url
          });

          if (!response.success) {
            throw new Error(response.error || 'Failed to process SVG');
          }

          // SVG uploads complete immediately
          setJobId(response.jobId);
          setProgressMessage('✓ SVG uploaded successfully!');
          setGenerating(false);

          // Fetch job status to get SVG URL
          const finalStatus = await apiClient.getRecraftStatus(response.jobId);
          setStatus(finalStatus);
          setResult(finalStatus.result);

          // Auto-generate TPV blend recipes
          if (finalStatus.result?.svg_url) {
            await handleGenerateBlends(finalStatus.result.svg_url, response.jobId);
          }
          return;
        } else {
          // Image: Vectorize with AI then process
          setProgressMessage('Starting vectorisation...');

          response = await apiClient.vectorizeImage({
            image_url: uploadResult.url
          });

          if (!response.success) {
            throw new Error(response.error || 'Failed to start vectorisation');
          }

          setProgressMessage('🎨 AI is vectorising your image...');
        }
      }
      // MODE: Text Prompt (existing Recraft generation)
      else if (inputMode === 'prompt') {
        // Map dimensions to canonical Recraft aspect ratio
        const mapping = mapDimensionsToRecraft(lengthMM, widthMM);
        setArMapping(mapping);


        // Update progress message with layout info
        if (needsLayoutWarning(mapping)) {
          setProgressMessage(`Generating ${mapping.canonical.name} design panel...`);
        } else {
          setProgressMessage('Initialising...');
        }

        // Create job with canonical dimensions
        response = await apiClient.generateRecraft({
          prompt: prompt.trim(),
          lengthMM: mapping.recraft.height,  // Note: Recraft uses height as length
          widthMM: mapping.recraft.width
        });

        if (!response.success) {
          throw new Error(response.error || 'Failed to start generation');
        }

        setProgressMessage('🎨 AI is creating your design...');
      }

      setJobId(response.jobId);
      setProgressMessage('Request submitted, waiting for processing...');

      let lastStatus = null;
      let startTime = Date.now();

      // Create abort controller for polling (allows cleanup on unmount)
      pollingAbortRef.current = new AbortController();

      // Poll for completion
      await apiClient.waitForRecraftCompletion(
        response.jobId,
        (progressStatus) => {
          setStatus(progressStatus);

          const elapsed = Math.floor((Date.now() - startTime) / 1000);

          // Update status message based on state
          if (progressStatus.status === 'queued') {
            // Rotating messages to keep it interesting while waiting
            const queueMessages = [
              `🎨 Preparing your canvas... (${elapsed}s)`,
              `✨ Warming up the AI brushes... (${elapsed}s)`,
              `🎯 Queueing your masterpiece... (${elapsed}s)`,
              `🖌️ Mixing digital paints... (${elapsed}s)`,
              `💭 AI is contemplating your vision... (${elapsed}s)`,
              `🌈 Selecting the perfect colours... (${elapsed}s)`,
              `📐 Calculating vector paths... (${elapsed}s)`,
              `⚡ Almost ready to create... (${elapsed}s)`
            ];
            const msgIndex = Math.floor(elapsed / 4) % queueMessages.length;
            setProgressMessage(queueMessages[msgIndex]);
          } else if (progressStatus.status === 'running') {
            if (lastStatus !== 'running') {
              setProgressMessage('🎨 AI is creating your design...');
              lastStatus = 'running';
            } else {
              // Rotating messages to keep it interesting
              const runningMessages = [
                `🎨 Creating vector shapes... (${elapsed}s)`,
                `🖌️ Applying colours and patterns... (${elapsed}s)`,
                `✨ Refining design details... (${elapsed}s)`,
                `🎯 Finalising artwork... (${elapsed}s)`
              ];
              const msgIndex = Math.floor(elapsed / 5) % runningMessages.length;
              setProgressMessage(runningMessages[msgIndex]);
            }
          } else if (progressStatus.status === 'retrying') {
            const attempt = progressStatus.recraft?.attempt_current || 0;
            const maxAttempts = progressStatus.recraft?.attempt_max || 3;
            setProgressMessage(`⚡ Retrying generation (attempt ${attempt}/${maxAttempts})...`);
          }
        },
        2000, // pollInterval
        pollingAbortRef.current.signal
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
      // Ignore abort errors (expected during component unmount)
      if (err.name === 'AbortError') {
        return;
      }
      console.error('Generation failed:', err);
      setError(err.message);
      setProgressMessage('');
      setGenerating(false);
    }
  };

  // Handle new generation (reset state)
  const handleNewGeneration = () => {
    setPrompt('');
    setSelectedFile(null);
    setGenerating(false);
    setJobId(null);
    setStatus(null);
    setResult(null);
    setError(null);
    setProgressMessage('');
    setAttemptInfo(null);
    setBlendRecipes(null);
    setBlendSvgUrl(null);
    setColorMapping(null);
    setShowFinalRecipes(false);
    setArMapping(null);
    setColorEditorOpen(false);
    setSelectedColor(null);
    setSolidEditedColors(new Map());
    setBlendEditedColors(new Map());
    setMixerOpen(false);
    setMixerColor(null);
    // Reset solid mode state
    setViewMode('solid'); // Reset to default (solid mode)
    setSolidRecipes(null);
    setSolidSvgUrl(null);
    setSolidColorMapping(null);
    setShowSolidSummary(false);
    // Reset design name
    setDesignName('');
    setIsNameLoading(false);
    // Clear design ID (this is a new design, not an update)
    setCurrentDesignId(null);
  };

  // Download TPV Blend SVG
  const handleDownloadSVG = () => {
    // Download the appropriate SVG based on current view mode
    const svgUrl = viewMode === 'solid' ? solidSvgUrl : blendSvgUrl;
    const fileName = viewMode === 'solid' ? 'tpv-solid' : 'tpv-blend';

    if (svgUrl) {
      const link = document.createElement('a');
      link.href = svgUrl;
      link.download = `${fileName}-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Helper: Detect SVG aspect ratio
  const detectSVGAspectRatio = async (svgUrl) => {
    try {
      const response = await fetch(svgUrl);
      const svgText = await response.text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');

      if (!svgElement) return null;

      let width, height;

      // Try viewBox first
      const viewBox = svgElement.getAttribute('viewBox');
      if (viewBox) {
        const parts = viewBox.split(/\s+/).map(Number);
        width = parts[2];
        height = parts[3];
      } else {
        // Fallback to width/height attributes
        width = parseFloat(svgElement.getAttribute('width')) || 1024;
        height = parseFloat(svgElement.getAttribute('height')) || 1024;
      }

      const aspectRatio = width / height;
      return aspectRatio;
    } catch (err) {
      console.error('[DIMENSION] Failed to detect aspect ratio:', err);
      return null;
    }
  };

  // Helper: Update dimensions and execute pending download action
  const handleDimensionConfirm = (width, height) => {
    setWidthMM(width);
    setLengthMM(height);

    // Store confirmed dimensions to pass directly to modals (avoids async state timing issues)
    setConfirmedDimensions({ width, height });

    // Execute the pending download action
    if (pendingDownloadAction === 'pdf') {
      // Trigger PDF download with new dimensions (passes dimensions directly)
      setTimeout(() => executePDFDownload(width, height), 100);
    } else if (pendingDownloadAction === 'tiles') {
      // Trigger tiles download with new dimensions (passes dimensions directly)
      setTimeout(() => executeTilesDownload(width, height), 100);
    } else if (pendingDownloadAction === 'insitu') {
      // Open in-situ modal with new dimensions
      setTimeout(() => setShowInSituModal(true), 100);
    } else if (pendingDownloadAction === 'save') {
      // Open save modal immediately - dimensions passed via confirmedDimensions state
      setShowSaveModal(true);
    }

    setPendingDownloadAction(null);
  };

  // Handle in-situ preview click - check dimensions first
  const handleInSituClick = async () => {
    const svgUrl = viewMode === 'solid' ? solidSvgUrl : blendSvgUrl;

    // Check if dimensions are set (prompt mode always has them, uploads might not)
    if (inputMode === 'upload' && (!widthMM || !lengthMM)) {

      // Detect aspect ratio from SVG
      const aspectRatio = await detectSVGAspectRatio(svgUrl);
      if (aspectRatio) {
        setSvgAspectRatio(aspectRatio);
        setPendingDownloadAction('insitu');
        setShowDimensionModal(true);
        return;
      } else {
        // Fallback: assume square if detection fails
        setSvgAspectRatio(1);
        setPendingDownloadAction('insitu');
        setShowDimensionModal(true);
        return;
      }
    }

    // Open in-situ modal with current dimensions
    setShowInSituModal(true);
  };

  // Handle flatten artwork (Phase 3)
  const handleFlattenArtwork = async (quality = 'fast') => {
    // Get the currently displayed SVG URL (with user colors applied)
    const svgUrl = viewMode === 'solid' ? solidSvgUrl : blendSvgUrl;
    if (!svgUrl || isFlattenProcessing) return;

    // Check if already flattened
    if (originalTaggedSvg && isFlattened(originalTaggedSvg)) {
      setFlattenError('This artwork has already been flattened.');
      return;
    }

    setIsFlattenProcessing(true);
    setFlattenProgress(0);
    setFlattenError(null);

    try {
      console.log(`[INSPIRE] Starting flatten (quality: ${quality})`);

      // Fetch the displayed SVG content (which has user colors already applied)
      const response = await fetch(svgUrl);
      const displayedSvg = await response.text();

      const { svg: flattenedSvg, stats } = await flattenSvg(displayedSvg, {
        quality,
        resolution: 4096,
        quantize: true,
        onProgress: setFlattenProgress
      });

      console.log('[INSPIRE] Flatten complete:', stats);

      // Re-tag the flattened SVG with region IDs
      const retaggedSvg = tagSvgRegions(flattenedSvg);

      // Update the original tagged SVG
      setOriginalTaggedSvg(retaggedSvg);

      // Clear region overrides since paths have changed (colors are now baked in)
      setRegionOverrides(new Map());
      setRegionOverridesHistory([new Map()]);
      setHistoryIndex(0);

      // Create new blob URL from flattened SVG (colors already baked in)
      const blob = new Blob([retaggedSvg], { type: 'image/svg+xml' });
      const newUrl = URL.createObjectURL(blob);

      // Update the appropriate blob URL
      if (viewMode === 'solid') {
        setSolidSvgUrl(newUrl);
      } else {
        setBlendSvgUrl(newUrl);
      }

      setFlattenProgress(100);
      console.log('[INSPIRE] Flatten applied successfully');

    } catch (err) {
      console.error('[INSPIRE] Flatten failed:', err);
      setFlattenError(err.message || 'Flatten failed. Please try again.');
    } finally {
      setIsFlattenProcessing(false);
    }
  };

  // Download TPV PNG
  const handleDownloadPNG = () => {
    // Download the appropriate PNG based on current view mode
    const svgUrl = viewMode === 'solid' ? solidSvgUrl : blendSvgUrl;
    const fileName = viewMode === 'solid' ? 'tpv-solid' : 'tpv-blend';

    if (svgUrl) {
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
          link.download = `${fileName}-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        });
      };
      img.src = svgUrl;
    }
  };

  // Handle new design - reset all state
  const handleNewDesign = () => {
    // Check for unsaved work
    if (hasUnsavedChanges()) {
      const confirmed = window.confirm(
        'Start a new design?\n\nYou have unsaved changes that will be lost.'
      );
      if (!confirmed) return;
    }

    // Reset all state via the store
    resetDesign();

    // Reset local UI state
    setSelectedFile(null);
    setGenerating(false);
    setStatus(null);
    setError(null);
    setProgressMessage('');
    setAttemptInfo(null);
    setColorEditorOpen(false);
    setSelectedColor(null);
    setEyedropperActive(false);
    setEyedropperRegion(null);
    setMixerOpen(false);
    setMixerColor(null);
  };

  // Handle save design click - check dimensions first
  const handleSaveClick = async () => {
    const svgUrl = viewMode === 'solid' ? solidSvgUrl : blendSvgUrl;

    // Check if dimensions are valid (must be positive numbers)
    // For uploads, we need to prompt for dimensions if not set
    // For prompt mode or loaded designs with dimensions, skip the modal
    const hasValidDimensions = widthMM > 0 && lengthMM > 0;
    const needsDimensionPrompt = inputMode === 'upload' && !hasValidDimensions;

    if (needsDimensionPrompt) {

      // Detect aspect ratio from SVG
      const aspectRatio = await detectSVGAspectRatio(svgUrl);
      if (aspectRatio) {
        setSvgAspectRatio(aspectRatio);
        setPendingDownloadAction('save');
        setShowDimensionModal(true);
        return;
      } else {
        // Fallback: assume square if detection fails
        setSvgAspectRatio(1);
        setPendingDownloadAction('save');
        setShowDimensionModal(true);
        return;
      }
    }

    // Dimensions are set, open save modal directly
    setShowSaveModal(true);
  };

  // Download PDF Export
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    const svgUrl = viewMode === 'solid' ? solidSvgUrl : blendSvgUrl;

    // Check if dimensions are set (prompt mode always has them, uploads might not)
    if (inputMode === 'upload' && (!widthMM || !lengthMM)) {

      // Detect aspect ratio from SVG
      const aspectRatio = await detectSVGAspectRatio(svgUrl);
      if (aspectRatio) {
        setSvgAspectRatio(aspectRatio);
        setPendingDownloadAction('pdf');
        setShowDimensionModal(true);
        return;
      } else {
        // Fallback: assume square if detection fails
        setSvgAspectRatio(1);
        setPendingDownloadAction('pdf');
        setShowDimensionModal(true);
        return;
      }
    }

    // Execute PDF download with current dimensions
    await executePDFDownload(widthMM, lengthMM);
  };

  const executePDFDownload = async (widthValue, lengthValue) => {
    const svgUrl = viewMode === 'solid' ? solidSvgUrl : blendSvgUrl;
    // Use derived/current recipes (with edits) for accurate PDF export
    const recipes = viewMode === 'solid'
      ? (currentSolidRecipes || solidRecipes)
      : (currentBlendRecipes || blendRecipes);
    const fileName = viewMode === 'solid' ? 'tpv-solid' : 'tpv-blend';

    if (!svgUrl || !recipes) {
      setError('Cannot generate PDF: missing SVG or recipes');
      return;
    }

    setGeneratingPDF(true);
    setError(null);

    try {
      // Fetch SVG content from blob URL (blob URLs don't work server-side)
      const svgResponse = await fetch(svgUrl);
      const svgString = await svgResponse.text();

      // Add timeout for PDF generation (30 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      // Get auth token for API request
      const session = await auth.getSession();
      const headers = {
        'Content-Type': 'application/json'
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          svgString,
          designName: designName || prompt || 'TPV Design',
          projectName: 'TPV Studio',
          dimensions: {
            widthMM: widthValue,
            lengthMM: lengthValue
          },
          recipes,
          mode: viewMode,
          designId: jobId || ''
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Try to parse as JSON, but handle text error responses too
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'PDF generation failed');
        } else {
          const errorText = await response.text();
          console.error('PDF API error response:', errorText);
          throw new Error(`Server error: ${response.status}`);
        }
      }

      // Download the PDF
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
      if (err.name === 'AbortError') {
        setError('PDF generation timed out. Please try again.');
      } else {
        setError(`PDF generation failed: ${err.message}`);
      }
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Download SVG tiles as ZIP (1m×1m slices)
  const handleDownloadTiles = async () => {
    const svgUrl = viewMode === 'solid' ? solidSvgUrl : blendSvgUrl;

    if (!svgUrl) {
      setError('No SVG available to slice');
      return;
    }

    // Check if dimensions are set (prompt mode always has them, uploads might not)
    if (inputMode === 'upload' && (!widthMM || !lengthMM)) {

      // Detect aspect ratio from SVG
      const aspectRatio = await detectSVGAspectRatio(svgUrl);
      if (aspectRatio) {
        setSvgAspectRatio(aspectRatio);
        setPendingDownloadAction('tiles');
        setShowDimensionModal(true);
        return;
      } else {
        // Fallback: assume square if detection fails
        setSvgAspectRatio(1);
        setPendingDownloadAction('tiles');
        setShowDimensionModal(true);
        return;
      }
    }

    // Execute tiles download with current dimensions
    await executeTilesDownload(widthMM, lengthMM);
  };

  const executeTilesDownload = async (widthValue, lengthValue) => {
    const svgUrl = viewMode === 'solid' ? solidSvgUrl : blendSvgUrl;

    try {
      await downloadSvgTiles(
        svgUrl,
        { width: widthValue, length: lengthValue },
        designName || 'tpv-design'
      );
    } catch (err) {
      console.error('Tile download error:', err);
      setError(`Failed to download tiles: ${err.message}`);
    }
  };

  // Generate TPV blend recipes from the SVG (auto-called after SVG generation)
  const handleGenerateBlends = async (svgUrl = null, jobIdParam = null) => {
    const svg_url = svgUrl || result?.svg_url;
    const job_id = jobIdParam || jobId;

    if (!svg_url) {
      setError('No SVG available to analyse');
      return;
    }

    // If blend mode is disabled, skip blend recipe generation and go directly to solid
    if (!FEATURE_FLAGS.BLEND_MODE_ENABLED) {
      setError(null);
      setProgressMessage('🎨 Processing design colours...');

      // Still need to normalize and tag SVG for region-based editing
      let taggedSvg = null;
      try {
        const svgResponse = await fetch(svg_url);
        const svgText = await svgResponse.text();
        const normalizedSvg = normalizeSVG(svgText);
        taggedSvg = tagSvgRegions(normalizedSvg);
        setOriginalTaggedSvg(taggedSvg);
      } catch (tagError) {
        console.error('[TPV-STUDIO] Failed to tag SVG regions:', tagError);
      }

      // Generate solid version directly (skip blend entirely)
      await handleGenerateSolid(svg_url, job_id, taggedSvg);
      return;
    }

    // Clear old blend state to prevent showing old SVG with new recipes
    setBlendSvgUrl(null);
    setBlendRecipes(null);
    setColorMapping(null);

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
          max_colors: 15,
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
        Array.from(mapping.entries()).forEach(([orig, target]) => {
        });
        setColorMapping(mapping);

        // Fetch, normalize, and tag original SVG with region IDs (for per-element editing)
        let taggedSvg = null;
        try {
          const svgResponse = await fetch(svg_url);
          const svgText = await svgResponse.text();
          const normalizedSvg = normalizeSVG(svgText);
          taggedSvg = tagSvgRegions(normalizedSvg);
          setOriginalTaggedSvg(taggedSvg);
        } catch (tagError) {
          console.error('[TPV-STUDIO] Failed to tag SVG regions:', tagError);
          // Non-fatal - continue without region tagging
        }

        // Generate recoloured SVG
        try {
          setProgressMessage('✨ Generating TPV blend preview...');
          await new Promise(resolve => setTimeout(resolve, 200));

          const { dataUrl, stats } = await recolorSVG(svg_url, mapping, taggedSvg);
          setBlendSvgUrl(dataUrl);
          setProgressMessage('✓ TPV blend ready!');

          if (stats.colorsNotMapped.size > 0) {
            console.warn('[TPV-STUDIO] Some colors were not mapped:', Array.from(stats.colorsNotMapped));
          }

          // Auto-generate solid color version in background
          handleGenerateSolid(svg_url, job_id, taggedSvg);
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
    }
  };

  // Reset all color edits back to original
  const handleResetAllColors = async () => {
    // Close color editor and mixer if open
    setColorEditorOpen(false);
    setSelectedColor(null);
    setMixerOpen(false);
    setMixerColor(null);

    // Clear edit tracking
    if (viewMode === 'solid') {
      setSolidEditedColors(new Map());
    } else {
      setBlendEditedColors(new Map());
    }

    // Re-generate recipes from original SVG to get fresh colors
    if (result?.svg_url) {
      // This will rebuild everything from scratch
      await handleGenerateBlends(result.svg_url, jobId);
    }
  };

  // Generate AI-suggested design name
  const handleGenerateDesignName = async (recipes) => {
    // Don't overwrite if user already set a name or we're loading a saved design
    if (designName) return;

    // Only generate name for prompt-based designs
    if (!prompt || inputMode !== 'prompt') {
      // Fallback for uploads
      if (selectedFile) {
        setDesignName(`TPV Design – ${selectedFile.name.replace(/\.[^/.]+$/, '')}`);
      }
      return;
    }

    setIsNameLoading(true);

    try {
      // Extract color names from recipes
      const colorNames = recipes
        ?.slice(0, 6)
        .map(recipe => {
          const component = recipe.chosenRecipe?.components?.[0];
          return component?.name || null;
        })
        .filter(Boolean) || [];

      const response = await apiClient.generateDesignName({
        prompt,
        colors: colorNames,
        dimensions: { widthMM, lengthMM }
      });

      if (response.success && response.names?.length > 0) {
        setDesignName(response.names[0]);
      } else {
        // Fallback name
        setDesignName(buildFallbackName(prompt));
      }
    } catch (err) {
      console.error('[TPV-STUDIO] Name generation failed:', err);
      setDesignName(buildFallbackName(prompt));
    } finally {
      setIsNameLoading(false);
    }
  };

  // Build fallback name from prompt
  const buildFallbackName = (prompt) => {
    if (!prompt) return 'TPV Playground Design';
    // Grab first part of prompt, clean it up
    const short = prompt.split(/[,.]/)[0].trim().slice(0, 40);
    return `TPV Design – ${short}`;
  };

  // Generate solid TPV color version (auto-called after blend recipes)
  const handleGenerateSolid = async (svgUrl = null, jobIdParam = null, taggedSvgParam = null) => {
    const svg_url = svgUrl || result?.svg_url;
    const job_id = jobIdParam || jobId;
    const taggedSvg = taggedSvgParam || originalTaggedSvg; // Use passed or state

    if (!svg_url) return;

    try {

      const response = await fetch('/api/solid-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          svg_url,
          job_id,
          max_colors: 15
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate solid recipes');
      }

      if (data.success) {
        setSolidRecipes(data.recipes);

        // Use pre-built color mapping from API (preserves all original colors)
        // Convert object to Map for recolorSVG
        const mapping = new Map(Object.entries(data.colorMapping || {}));
        setSolidColorMapping(mapping);

        // Generate recoloured SVG with solid colors
        try {
          const { dataUrl, stats } = await recolorSVG(svg_url, mapping, taggedSvg);
          setSolidSvgUrl(dataUrl);
          if (stats.colorsNotMapped && stats.colorsNotMapped.size > 0) {
            console.warn('[TPV-STUDIO] Unmapped colors in solid mode:', Array.from(stats.colorsNotMapped));
          }

          // Generate design name now that all processing is complete
          handleGenerateDesignName(data.recipes);
        } catch (svgError) {
          console.error('[TPV-STUDIO] Failed to generate solid SVG:', svgError);
        }
      }
    } catch (err) {
      console.error('[TPV-STUDIO] Solid generation failed:', err);
      // Non-fatal - blend mode still works
    }
  };

  // Handle color click from SVGPreview or palette
  const handleColorClick = (colorData, clickSource = 'palette') => {

    // If eyedropper is active and a palette color is clicked, apply it to the selected region
    if (eyedropperActive && eyedropperRegion && clickSource === 'palette') {
      applyRegionRecolor(eyedropperRegion.regionId, colorData.hex);
      setEyedropperActive(false);
      setEyedropperRegion(null);
      return;
    }

    // Palette clicks open the global color editor (unchanged behavior)
    if (clickSource === 'palette') {
      // In blend mode, use the mixer widget instead of color editor
      if (viewMode === 'blend') {
        setMixerColor(colorData);
        setMixerOpen(true);
        // Close recipe displays when editing - user must regenerate after edits
        setShowFinalRecipes(false);
      } else {
        // In solid mode, use the standard color editor
        setSelectedColor(colorData);
        setColorEditorOpen(true);
        setShowSolidSummary(false);
      }
    }
  };

  // Handle region click from SVGPreview (for eyedropper mode)
  const handleRegionClick = (regionData) => {

    if (!eyedropperActive) {
      // First click - activate eyedropper for this region
      setEyedropperActive(true);
      setEyedropperRegion(regionData);
    } else {
      // Second click - apply source region's color to target region
      applyRegionRecolor(eyedropperRegion.regionId, regionData.sourceColor);
      setEyedropperActive(false);
      setEyedropperRegion(null);
    }
  };

  // Apply color change to a specific region (per-element editing)
  // colorData can be:
  // - string (hex value) - for simple color picks (eyedropper from another region)
  // - object { hex, tpvCode?, tpvName?, originalHex?, editType?, blendComponents? }
  const applyRegionRecolor = (regionId, colorData) => {
    // Normalize colorData to object format
    const normalizedData = typeof colorData === 'string'
      ? { hex: colorData, editType: 'eyedrop' }
      : colorData;


    // Add operation to queue instead of immediately processing
    setRegionRecolorQueue(prev => [...prev, {
      regionId,
      colorData: {
        ...normalizedData,
        hex: normalizedData.hex.toLowerCase()
      },
      viewMode // Store current view mode with the operation
    }]);
  };

  // Process next region recolor operation in queue
  const processNextInQueue = async () => {
    if (isProcessingQueue || regionRecolorQueue.length === 0) {
      return;
    }

    setIsProcessingQueue(true);
    const operation = regionRecolorQueue[0];
    const colorData = operation.colorData;


    try {
      // Build new overrides map with this operation applied
      // Store the full colorData object for later use in deriving current colors
      const newOverrides = new Map(regionOverrides);
      newOverrides.set(operation.regionId, colorData);

      // Pass overrides directly to regeneration function (don't wait for state update)
      // This ensures immediate processing without React batching delays
      if (operation.viewMode === 'blend') {
        await regenerateBlendSVG(null, null, newOverrides);
      } else {
        await regenerateSolidSVG(null, null, newOverrides);
      }

      // Update state after successful regeneration
      setRegionOverrides(newOverrides);

      // Add to history for undo/redo (use fresh state from store)
      const currentHistoryIndex = store.historyIndex;
      const currentHistory = store.regionOverridesHistory;

      // Truncate future if not at end (standard undo/redo behavior)
      const newHistory = currentHistory.slice(0, currentHistoryIndex + 1);
      newHistory.push(new Map(newOverrides));

      // Limit history to 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      // Update both history and index atomically
      setRegionOverridesHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

    } catch (err) {
      console.error('[TPV-STUDIO] Failed to process region recolor:', err);
    } finally {
      // Remove completed operation from queue
      setRegionRecolorQueue(prev => prev.slice(1));
      setIsProcessingQueue(false);
    }
  };

  // Cancel eyedropper mode
  const handleEyedropperCancel = () => {
    setEyedropperActive(false);
    setEyedropperRegion(null);
  };

  // Make selected region transparent (visual only - opacity)
  const handleMakeTransparent = () => {
    if (!eyedropperRegion) return;

    applyRegionRecolor(eyedropperRegion.regionId, 'transparent');
    setEyedropperActive(false);
    setEyedropperRegion(null);
  };

  // True cut-out - actually removes geometry using boolean subtraction
  const handleTrueCutout = async () => {
    if (!eyedropperRegion) return;

    // Get current SVG URL
    const svgUrl = viewMode === 'blend' ? blendSvgUrl : solidSvgUrl;
    if (!svgUrl) {
      setCutoutError('No SVG content to cut');
      return;
    }

    // Check if we can perform cutout (scope check)
    const canCut = canPerformCutout(document.querySelector(`[data-region-id="${eyedropperRegion.regionId}"]`));
    if (!canCut.allowed) {
      setCutoutError(canCut.reason);
      return;
    }

    setIsCutoutProcessing(true);
    setCutoutError(null);

    try {
      // Fetch SVG content from blob URL
      const response = await fetch(svgUrl);
      const currentSvg = await response.text();

      // Estimate cost and warn if complex
      const cost = estimateBooleanCost(currentSvg);
      if (!cost.canProceed) {
        setCutoutError(`Operation blocked: ${cost.warning}. Try "Flatten Artwork" first.`);
        setIsCutoutProcessing(false);
        return;
      }

      console.log('[InspirePanel] Starting true cut-out for region:', eyedropperRegion.regionId);

      // Perform the boolean subtraction
      const result = await performTrueCutout(currentSvg, eyedropperRegion.regionId);

      if (result.svg) {
        console.log('[InspirePanel] Cut-out complete:', result.stats);

        // Create new blob URL from result
        const blob = new Blob([result.svg], { type: 'image/svg+xml' });
        const newUrl = URL.createObjectURL(blob);

        // Update the appropriate SVG URL
        if (viewMode === 'blend') {
          setBlendSvgUrl(newUrl);
        } else {
          setSolidSvgUrl(newUrl);
        }

        // Update originalTaggedSvg as well
        setOriginalTaggedSvg(result.svg);

        // Clear selection
        setEyedropperActive(false);
        setEyedropperRegion(null);
      }
    } catch (error) {
      console.error('[InspirePanel] Cut-out error:', error);
      setCutoutError(error.message || 'Failed to perform cut-out');
    } finally {
      setIsCutoutProcessing(false);
    }
  };

  // Handle direct TPV color selection from palette
  // colorData: { hex, code, name } from SVGPreview TPV palette
  const handleSelectTPVColor = (colorData) => {
    if (!eyedropperRegion) return;


    // Build rich color data for tracking
    const richColorData = {
      hex: colorData.hex,
      tpvCode: colorData.code,
      tpvName: colorData.name,
      originalHex: eyedropperRegion.sourceColor,
      editType: 'solid'
    };

    applyRegionRecolor(eyedropperRegion.regionId, richColorData);
    setEyedropperActive(false);
    setEyedropperRegion(null);
  };

  // Undo last region override change
  const handleRegionUndo = async () => {
    if (historyIndex <= 0) return; // Can't undo past the beginning

    const newIndex = historyIndex - 1;
    const previousOverrides = regionOverridesHistory[newIndex];


    // Apply previous state
    setRegionOverrides(new Map(previousOverrides));
    setHistoryIndex(newIndex);

    // Regenerate with previous overrides
    if (viewMode === 'blend') {
      await regenerateBlendSVG(null, null, previousOverrides);
    } else {
      await regenerateSolidSVG(null, null, previousOverrides);
    }
  };

  // Redo next region override change
  const handleRegionRedo = async () => {
    if (historyIndex >= regionOverridesHistory.length - 1) return; // Can't redo past the end

    const newIndex = historyIndex + 1;
    const nextOverrides = regionOverridesHistory[newIndex];


    // Apply next state
    setRegionOverrides(new Map(nextOverrides));
    setHistoryIndex(newIndex);

    // Regenerate with next overrides
    if (viewMode === 'blend') {
      await regenerateBlendSVG(null, null, nextOverrides);
    } else {
      await regenerateSolidSVG(null, null, nextOverrides);
    }
  };

  // Handle color change from ColorEditorPanel (solid mode only)
  const handleColorChange = async (newHex) => {
    if (!selectedColor) return;


    // Update mode-specific edited colors map (normalize to lowercase for consistency)
    if (viewMode === 'solid') {
      // Find the recipe to determine if this is a derived/added color
      const recipesToSearch = currentSolidRecipes || solidRecipes;
      const recipe = recipesToSearch.find(r =>
        r.targetColor.hex.toLowerCase() === selectedColor.hex.toLowerCase()
      );

      if (recipe?.isAddedFromEdit) {
        // DERIVED COLOR: Update regionOverrides directly
        // Find all regions that have this color and update them
        const oldHex = selectedColor.hex.toLowerCase();
        const updatedOverrides = new Map(regionOverrides);
        let updateCount = 0;

        // Find TPV color info for the new color
        const tpvInfo = tpvColours.find(c => c.hex.toLowerCase() === newHex.toLowerCase());

        regionOverrides.forEach((colorData, regionId) => {
          const regionHex = (typeof colorData === 'string' ? colorData : colorData.hex).toLowerCase();
          if (regionHex === oldHex) {
            updatedOverrides.set(regionId, {
              hex: newHex,
              tpvCode: tpvInfo?.code || null,
              tpvName: tpvInfo?.name || null,
              originalHex: colorData.originalHex || oldHex,
              editType: 'solid'
            });
            updateCount++;
          }
        });


        // Add to history
        const newHistory = regionOverridesHistory.slice(0, historyIndex + 1);
        newHistory.push(new Map(updatedOverrides));
        if (newHistory.length > 50) newHistory.shift();

        setRegionOverrides(updatedOverrides);
        setRegionOverridesHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);

        // Update selected color
        setSelectedColor({
          ...selectedColor,
          hex: newHex,
          blendHex: newHex
        });

        // Regenerate SVG with updated overrides
        await regenerateSolidSVG(solidEditedColors, newHex, updatedOverrides);
      } else {
        // ORIGINAL COLOR: Use solidEditedColors as before
        const updated = new Map(solidEditedColors);
        const colorsToUpdate = recipe?.mergedOriginalColors || [selectedColor.originalHex.toLowerCase()];


        colorsToUpdate.forEach(origHex => {
          updated.set(origHex, { newHex: newHex.toLowerCase() });
        });

        setSolidEditedColors(updated);

        // Update selected color with new hex and blendHex for highlighting
        setSelectedColor({
          ...selectedColor,
          hex: newHex,
          blendHex: newHex
        });

        await regenerateSolidSVG(updated, newHex);
      }
    } else {
      const updated = new Map(blendEditedColors);
      updated.set(selectedColor.originalHex.toLowerCase(), { newHex: newHex.toLowerCase() });
      setBlendEditedColors(updated);

      // Update selected color with new hex and blendHex for highlighting
      setSelectedColor({
        ...selectedColor,
        hex: newHex,
        blendHex: newHex
      });

      await regenerateBlendSVG(updated, newHex);
    }
  };

  // Handle mixer blend change (blend mode only)
  const handleMixerBlendChange = useCallback(async ({ blendHex, parts, recipe }) => {
    if (!mixerColor) return;


    // Check if this is a derived/added color
    if (mixerColor.isAddedFromEdit) {
      // DERIVED COLOR: Update regionOverrides directly
      const oldHex = mixerColor.hex.toLowerCase();
      const updatedOverrides = new Map(regionOverrides);
      let updateCount = 0;

      regionOverrides.forEach((colorData, regionId) => {
        const regionHex = (typeof colorData === 'string' ? colorData : colorData.hex).toLowerCase();
        if (regionHex === oldHex) {
          updatedOverrides.set(regionId, {
            hex: blendHex,
            originalHex: colorData.originalHex || oldHex,
            editType: 'blend',
            blendComponents: recipe?.components || null
          });
          updateCount++;
        }
      });


      // Update mixer color with new blend for highlighting
      setMixerColor({
        ...mixerColor,
        hex: blendHex,
        blendHex: blendHex
      });

      // IMPORTANT: Regenerate SVG FIRST, then update state
      // This prevents race condition where useEffect analyzes old SVG
      await regenerateBlendSVG(blendEditedColors, blendHex, updatedOverrides);

      // Now update regionOverrides state and history AFTER SVG is regenerated
      const newHistory = regionOverridesHistory.slice(0, historyIndex + 1);
      newHistory.push(new Map(updatedOverrides));
      if (newHistory.length > 50) newHistory.shift();

      setRegionOverrides(updatedOverrides);
      setRegionOverridesHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else {
      // ORIGINAL COLOR: Use blendEditedColors as before
      const updated = new Map(blendEditedColors);
      updated.set(mixerColor.originalHex.toLowerCase(), {
        newHex: blendHex.toLowerCase(),
        recipe, // Store mixer recipe for later use
        parts // Store parts Map for potential re-editing
      });
      setBlendEditedColors(updated);

      // Update mixer color with new blend for highlighting
      setMixerColor({
        ...mixerColor,
        hex: blendHex,
        blendHex: blendHex
      });

      // Regenerate SVG with new blend color
      await regenerateBlendSVG(updated, blendHex);
    }
  }, [mixerColor, blendEditedColors, regionOverrides, regionOverridesHistory, historyIndex, result, colorMapping]);

  // Regenerate blend SVG with edited colors
  const regenerateBlendSVG = async (updatedEdits = null, immediateHex = null, overrides = null) => {
    if (!result?.svg_url || !colorMapping || !blendRecipes) return;

    try {
      // Build updated color mapping with edits
      const updatedMapping = new Map(colorMapping);
      const edits = updatedEdits || blendEditedColors;

      edits.forEach((edit, originalHex) => {
        if (edit.newHex) {
          // Update the blend hex to the new color chosen by user
          const normalizedHex = originalHex.toLowerCase();
          updatedMapping.set(normalizedHex, {
            ...updatedMapping.get(normalizedHex),
            blendHex: edit.newHex
          });
        }
      });

      // Update blendRecipes to reflect the new colors in the legend
      const updatedRecipes = blendRecipes.map(recipe => {
        const edit = edits.get(recipe.originalColor.hex.toLowerCase());
        if (edit?.newHex) {
          // Update target, blend colors, and recipe components if mixer was used
          const updatedRecipe = {
            ...recipe,
            targetColor: {
              ...recipe.targetColor,
              hex: edit.newHex
            },
            blendColor: {
              ...recipe.blendColor,
              hex: edit.newHex
            }
          };

          // If there's a mixer recipe, update the chosenRecipe with user's custom blend
          if (edit.recipe && edit.recipe.components) {
            updatedRecipe.chosenRecipe = {
              ...recipe.chosenRecipe,
              components: edit.recipe.components,
              deltaE: 0, // Perfect match since user chose this exact blend
              quality: 'Excellent'
            };
          }

          return updatedRecipe;
        }
        return recipe;
      });

      // Two-stage SVG regeneration:
      // Stage 1: Apply global color mapping (recipes + edits) to tagged SVG
      const { svgText: globalRecolored, stats } = await recolorSVG(
        result.svg_url,
        updatedMapping,
        originalTaggedSvg // Pass tagged SVG to preserve region IDs
      );

      // Stage 2: Apply region-level overrides (per-element edits)
      // Use provided overrides if available, otherwise use state
      const appliedOverrides = overrides !== null ? overrides : regionOverrides;
      const finalSvg = applyRegionOverrides(globalRecolored, appliedOverrides);

      // Clean up old blob URL before creating new one
      if (blendSvgUrl && blendSvgUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blendSvgUrl);
      }

      // Convert to data URL for display
      const blob = new Blob([finalSvg], { type: 'image/svg+xml' });
      const dataUrl = URL.createObjectURL(blob);

      setBlendSvgUrl(dataUrl);
      setColorMapping(updatedMapping);
      setBlendRecipes(updatedRecipes); // Update recipes to show new colors in legend
      if (appliedOverrides.size > 0) {
      }
    } catch (err) {
      console.error('[TPV-STUDIO] Failed to regenerate blend SVG:', err);
    }
  };

  // Regenerate solid SVG with edited colors
  const regenerateSolidSVG = async (updatedEdits = null, immediateHex = null, overrides = null) => {
    if (!result?.svg_url || !solidColorMapping || !solidRecipes) return;

    try {
      // Build updated color mapping with edits
      const updatedMapping = new Map(solidColorMapping);
      const edits = updatedEdits || solidEditedColors;

      edits.forEach((edit, originalHex) => {
        if (edit.newHex) {
          // Update the blend hex to the new color chosen by user
          const normalizedHex = originalHex.toLowerCase();
          updatedMapping.set(normalizedHex, {
            ...updatedMapping.get(normalizedHex),
            blendHex: edit.newHex
          });
        }
      });

      // Update solidRecipes to reflect the new colors in the legend
      const updatedRecipes = solidRecipes.map(recipe => {
        const edit = edits.get(recipe.originalColor.hex.toLowerCase());
        if (edit?.newHex) {
          // Find the matching TPV colour for the new hex
          const matchingTpvColour = tpvColours.find(
            tpv => tpv.hex.toLowerCase() === edit.newHex.toLowerCase()
          );

          if (matchingTpvColour) {
            // Update with complete TPV colour information
            return {
              ...recipe,
              targetColor: {
                ...recipe.targetColor,
                hex: edit.newHex
              },
              blendColor: {
                hex: edit.newHex,
                rgb: matchingTpvColour.rgb,
                lab: matchingTpvColour.lab
              },
              chosenRecipe: {
                components: [{
                  code: matchingTpvColour.code,
                  name: matchingTpvColour.name,
                  hex: matchingTpvColour.hex,
                  rgb: matchingTpvColour.rgb,
                  lab: matchingTpvColour.lab,
                  ratio: 1.0
                }],
                blendColor: {
                  hex: matchingTpvColour.hex,
                  rgb: matchingTpvColour.rgb,
                  lab: matchingTpvColour.lab
                },
                deltaE: 0,
                quality: 'Perfect'
              }
            };
          } else {
            // Fallback: just update hex (shouldn't happen in solid mode)
            return {
              ...recipe,
              targetColor: {
                ...recipe.targetColor,
                hex: edit.newHex
              },
              blendColor: {
                ...recipe.blendColor,
                hex: edit.newHex
              }
            };
          }
        }
        return recipe;
      });

      // Two-stage SVG regeneration:
      // Stage 1: Apply global color mapping (recipes + edits) to tagged SVG
      const { svgText: globalRecolored, stats } = await recolorSVG(
        result.svg_url,
        updatedMapping,
        originalTaggedSvg // Pass tagged SVG to preserve region IDs
      );

      // Stage 2: Apply region-level overrides (per-element edits)
      // Use provided overrides if available, otherwise use state
      const appliedOverrides = overrides !== null ? overrides : regionOverrides;
      const finalSvg = applyRegionOverrides(globalRecolored, appliedOverrides);

      // Clean up old blob URL before creating new one
      if (solidSvgUrl && solidSvgUrl.startsWith('blob:')) {
        URL.revokeObjectURL(solidSvgUrl);
      }

      // Convert to data URL for display
      const blob = new Blob([finalSvg], { type: 'image/svg+xml' });
      const dataUrl = URL.createObjectURL(blob);

      setSolidSvgUrl(dataUrl);
      setSolidColorMapping(updatedMapping);
      setSolidRecipes(updatedRecipes); // Update recipes to show new colors in legend
      if (appliedOverrides.size > 0) {
      }
    } catch (err) {
      console.error('[TPV-STUDIO] Failed to regenerate solid SVG:', err);
    }
  };

  // Helper: Convert chosenRecipe.components to mixer { parts: {} } format
  const convertRecipeToMixerFormat = (chosenRecipe) => {
    if (!chosenRecipe?.components) return null;
    const parts = {};
    chosenRecipe.components.forEach(comp => {
      if (comp.code && comp.parts) {
        parts[comp.code] = comp.parts;
      }
    });
    return Object.keys(parts).length > 0 ? { parts } : null;
  };

  // Helper: Get mixer initial recipe for a color (handles both original and derived)
  const getMixerInitialRecipe = useCallback((color) => {
    if (!color) return null;

    // First check if we've already edited this color
    const existingEdit = blendEditedColors.get(color.originalHex?.toLowerCase());
    if (existingEdit?.recipe) {
      return existingEdit.recipe;
    }

    // For derived colors, convert their chosenRecipe
    if (color.isAddedFromEdit && color.chosenRecipe) {
      return convertRecipeToMixerFormat(color.chosenRecipe);
    }

    // For original colors, use the recipe property if available
    return color.recipe || null;
  }, [blendEditedColors]);

  // Helper function to regenerate blend SVG from loaded design state
  const regenerateBlendSVGFromState = async (svgUrl, colorMapping, recipes, editedColors, taggedSvg = null, overrides = null) => {
    try {

      // Build updated color mapping with any saved edits
      const updatedMapping = new Map(colorMapping);
      if (editedColors && editedColors.size > 0) {
        editedColors.forEach((edit, originalHex) => {
          const normalizedHex = originalHex.toLowerCase();
          if (updatedMapping.has(normalizedHex)) {
            updatedMapping.set(normalizedHex, {
              ...updatedMapping.get(normalizedHex),
              blendHex: edit.newHex
            });
          }
        });
      }

      // Recolor SVG with region tags preserved
      const { dataUrl, svgText } = await recolorSVG(svgUrl, updatedMapping, taggedSvg);

      // Apply region overrides (including transparency) if provided
      let finalSvgText = svgText;
      if (overrides && overrides.size > 0) {
        finalSvgText = applyRegionOverrides(svgText, overrides);
      }

      // Create final blob URL
      const finalBlob = new Blob([finalSvgText], { type: 'image/svg+xml' });
      const finalUrl = URL.createObjectURL(finalBlob);

      setBlendSvgUrl(finalUrl);
    } catch (err) {
      console.error('[INSPIRE] Failed to regenerate blend SVG:', err);
    }
  };

  // Helper function to regenerate solid SVG from loaded design state
  const regenerateSolidSVGFromState = async (svgUrl, colorMapping, recipes, editedColors, taggedSvg = null, overrides = null) => {
    try {

      // Build updated color mapping with any saved edits
      const updatedMapping = new Map(colorMapping);
      if (editedColors && editedColors.size > 0) {
        editedColors.forEach((edit, originalHex) => {
          const normalizedHex = originalHex.toLowerCase();
          if (updatedMapping.has(normalizedHex)) {
            updatedMapping.set(normalizedHex, {
              ...updatedMapping.get(normalizedHex),
              blendHex: edit.newHex
            });
          }
        });
      }

      // Recolor SVG with region tags preserved
      const { dataUrl, svgText } = await recolorSVG(svgUrl, updatedMapping, taggedSvg);

      // Apply region overrides (including transparency) if provided
      let finalSvgText = svgText;
      if (overrides && overrides.size > 0) {
        finalSvgText = applyRegionOverrides(svgText, overrides);
      }

      // Create final blob URL
      const finalBlob = new Blob([finalSvgText], { type: 'image/svg+xml' });
      const finalUrl = URL.createObjectURL(finalBlob);

      setSolidSvgUrl(finalUrl);
    } catch (err) {
      console.error('[INSPIRE] Failed to regenerate solid SVG:', err);
    }
  };


  return (
    <div className={`inspire-panel-recraft${isEmbedded ? ' inspire-panel-recraft--embedded' : ''}`}>
      {!isEmbedded && (
        <div className="panel-header">
          <h2>TPV Studio - Vector AI</h2>
          <p className="subtitle">AI-powered vector designs for playground surfacing</p>
        </div>
      )}

      {/* Welcome Guidance - Show only when user has no saved designs */}
      {!result && !generating && hasExistingDesigns === false && (
        <div className="welcome-guidance">
          <div className="welcome-icon">✨</div>
          <h3>Create Your First Design</h3>
          <p>
            Choose how you'd like to create your TPV design below. You can describe what you want,
            upload an image to convert, or process an existing SVG file. Once generated, you'll be
            able to edit colours, export PDFs with specifications, and preview designs on-site.
          </p>
        </div>
      )}

      {/* Input Mode Tabs */}
      <div className="input-mode-tabs">
        <button
          className={`input-mode-tab ${inputMode === 'prompt' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('prompt');
            setSelectedFile(null);
            setError(null);
          }}
          disabled={generating}
        >
          <svg className="mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3l1.545 4.635L18.18 9.18l-4.635 1.545L12 15.36l-1.545-4.635L5.82 9.18l4.635-1.545L12 3z" />
            <path d="M5 21l1.5-4.5L2 15l4.5-1.5L8 9l1.5 4.5L14 15l-4.5 1.5L8 21z" opacity="0.5" />
          </svg>
          <span className="mode-title">Text Prompt</span>
          <span className="mode-description">Describe your design</span>
        </button>
        <button
          className={`input-mode-tab ${inputMode === 'upload' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('upload');
            setPrompt('');
            setError(null);
          }}
          disabled={generating}
        >
          <svg className="mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="mode-title">Upload Design</span>
          <span className="mode-description">PNG, JPG, or SVG</span>
        </button>
      </div>

      {/* Input Form */}
      <div className="form-section">
        {/* Text Prompt Mode */}
        {inputMode === 'prompt' && (
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
            <p className="helper-text">
              Describe the design you want to generate. The AI will create a vector illustration based on your description. Perfect for creating completely new designs from scratch - just describe colors, themes, and elements you want.
            </p>
          </div>
        )}

        {/* Unified Upload Mode (PNG/JPG/SVG) */}
        {inputMode === 'upload' && (
          <div className="form-group">
            <label htmlFor="design-upload">Upload Design File</label>
            <div
              className={`drop-zone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                id="design-upload"
                type="file"
                accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
                onChange={handleFileSelect}
                disabled={generating}
                className="file-input-hidden"
              />
              <label htmlFor="design-upload" className="drop-zone-content">
                {selectedFile ? (
                  <>
                    <svg className="upload-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-type-badge">
                      {detectFileType(selectedFile) === 'svg'
                        ? 'SVG - will process immediately'
                        : 'Image - will vectorise with AI'}
                    </span>
                    <span className="drop-hint">Click to change file</span>
                  </>
                ) : (
                  <>
                    <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="drop-text">Drag & drop your design here</span>
                    <span className="drop-hint">or click to browse</span>
                    <span className="supported-formats">PNG, JPG, or SVG</span>
                  </>
                )}
              </label>
            </div>
            <p className="helper-text">
              Upload your design file. <strong>PNG/JPG</strong> images will be vectorised with AI (~30 seconds). <strong>SVG</strong> files are processed immediately for TPV colour matching.
            </p>
          </div>
        )}

        {/* Dimension inputs - only show for prompt mode */}
        {inputMode === 'prompt' && (
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
        )}

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress && (
          <div className="upload-progress">
            <p>{uploadProgress}</p>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={
            generating ||
            (inputMode === 'prompt' && !prompt.trim()) ||
            (inputMode === 'upload' && !selectedFile)
          }
          className="generate-button"
        >
          {generating
            ? (inputMode === 'upload' && selectedFile && detectFileType(selectedFile) === 'svg'
                ? 'Processing...'
                : 'Generating...')
            : (inputMode === 'prompt'
                ? 'Generate Vector Design'
                : selectedFile && detectFileType(selectedFile) === 'svg'
                  ? 'Process SVG'
                  : 'Vectorise & Process'
              )
          }
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

          {/* Mode Toggle Tabs - Only show if blend mode is enabled */}
          {FEATURE_FLAGS.BLEND_MODE_ENABLED && blendSvgUrl && blendRecipes && (
            <div className="mode-tabs">
              <button
                className={`mode-tab ${viewMode === 'solid' ? 'active' : ''}`}
                onClick={() => setViewMode('solid')}
                disabled={!solidSvgUrl}
              >
                <span className="mode-title">Solid Mode</span>
                <span className="mode-description">
                  {solidSvgUrl ? 'Single TPV colours only' : 'Generating...'}
                </span>
              </button>
              <button
                className={`mode-tab ${viewMode === 'blend' ? 'active' : ''}`}
                onClick={() => setViewMode('blend')}
              >
                <span className="mode-title">Blend Mode</span>
                <span className="mode-description">Advanced: Mixed granules</span>
              </button>
            </div>
          )}

          {/* SVG Complexity Indicator & Flatten Controls (Phase 1.5 & 3) */}
          {originalTaggedSvg && (blendSvgUrl || solidSvgUrl) && (
            <div className="complexity-indicator">
              <ComplexityBadge svgContent={originalTaggedSvg} />

              {/* Flatten buttons - show if not already flattened */}
              {!isFlattened(originalTaggedSvg) && (
                <div className="flatten-controls">
                  <span className="flatten-label">Simplify:</span>
                  <button
                    className="flatten-btn flatten-fast"
                    onClick={() => handleFlattenArtwork('fast')}
                    disabled={isFlattenProcessing}
                    title="Fast flatten - quicker but slightly rougher edges"
                  >
                    Fast
                  </button>
                  <button
                    className="flatten-btn flatten-clean"
                    onClick={() => handleFlattenArtwork('clean')}
                    disabled={isFlattenProcessing}
                    title="Clean flatten - smoother edges, takes longer"
                  >
                    Clean
                  </button>
                </div>
              )}

              {/* Flattened badge */}
              {isFlattened(originalTaggedSvg) && (
                <span className="flattened-badge">Flattened</span>
              )}
            </div>
          )}

          {/* Flatten progress overlay */}
          {isFlattenProcessing && (
            <div className="flatten-overlay">
              <div className="flatten-modal">
                <div className="flatten-spinner"></div>
                <div className="flatten-title">Flattening Artwork...</div>
                <div className="flatten-progress-bar">
                  <div
                    className="flatten-progress-fill"
                    style={{ width: `${flattenProgress}%` }}
                  />
                </div>
                <div className="flatten-progress-text">{flattenProgress}%</div>
                <div className="flatten-warning">
                  This converts paths to traced outlines. Region colors will be reset.
                </div>
              </div>
            </div>
          )}

          {/* Flatten error message */}
          {flattenError && (
            <div className="flatten-error">
              <span>{flattenError}</span>
              <button onClick={() => setFlattenError(null)}>×</button>
            </div>
          )}

          {/* TPV Blend Preview - Blend Mode (only if enabled) */}
          {FEATURE_FLAGS.BLEND_MODE_ENABLED && viewMode === 'blend' && blendSvgUrl && blendRecipes && (
            <div ref={svgPreviewRef}>
              <SVGPreview
                blendSvgUrl={blendSvgUrl}
                recipes={currentBlendRecipes || blendRecipes}
                mode="blend"
                onColorClick={handleColorClick}
                onRegionClick={handleRegionClick}
                onEyedropperCancel={handleEyedropperCancel}
                onMakeTransparent={handleMakeTransparent}
                onTrueCutout={handleTrueCutout}
                isCutoutProcessing={isCutoutProcessing}
                cutoutError={cutoutError}
                onSelectTPVColor={handleSelectTPVColor}
                selectedColor={selectedColor}
                editedColors={blendEditedColors}
                onResetAll={handleResetAllColors}
                designName={designName}
                onNameChange={setDesignName}
                isNameLoading={isNameLoading}
                onInSituClick={handleInSituClick}
                eyedropperActive={eyedropperActive}
                eyedropperRegion={eyedropperRegion}
                onRegionUndo={handleRegionUndo}
                onRegionRedo={handleRegionRedo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < regionOverridesHistory.length - 1}
                regionOverridesCount={regionOverrides.size}
              />
            </div>
          )}

          {/* TPV Blend Preview - Solid Mode */}
          {viewMode === 'solid' && solidSvgUrl && solidRecipes && (
            <div ref={svgPreviewRef}>
              <SVGPreview
                blendSvgUrl={solidSvgUrl}
                recipes={currentSolidRecipes || solidRecipes}
                mode="solid"
                onColorClick={handleColorClick}
                onRegionClick={handleRegionClick}
                onEyedropperCancel={handleEyedropperCancel}
                onMakeTransparent={handleMakeTransparent}
                onTrueCutout={handleTrueCutout}
                isCutoutProcessing={isCutoutProcessing}
                cutoutError={cutoutError}
                onSelectTPVColor={handleSelectTPVColor}
                selectedColor={selectedColor}
                editedColors={solidEditedColors}
                onResetAll={handleResetAllColors}
                designName={designName}
                onNameChange={setDesignName}
                isNameLoading={isNameLoading}
                onInSituClick={handleInSituClick}
                eyedropperActive={eyedropperActive}
                eyedropperRegion={eyedropperRegion}
                onRegionUndo={handleRegionUndo}
                onRegionRedo={handleRegionRedo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < regionOverridesHistory.length - 1}
                regionOverridesCount={regionOverrides.size}
              />
            </div>
          )}

          {/* Mixer Widget (Blend Mode) - only if blend mode enabled */}
          {FEATURE_FLAGS.BLEND_MODE_ENABLED && mixerOpen && mixerColor && (
            <div className="mixer-widget-container">
              <div className="mixer-widget-header">
                <button
                  className="mixer-close-btn"
                  onClick={() => {
                    setMixerOpen(false);
                    setMixerColor(null);
                  }}
                >
                  Close Mixer
                </button>
              </div>
              <MiniMixerWidget
                initialRecipe={getMixerInitialRecipe(mixerColor)}
                onBlendChange={handleMixerBlendChange}
                originalColor={mixerColor.originalHex}
              />
            </div>
          )}

          {/* Action Bar - Clean grouped layout */}
          {(blendSvgUrl || solidSvgUrl) && (
            <div className="action-bar">
              {/* New Design */}
              <button
                className="action-bar__btn action-bar__btn--secondary"
                onClick={handleNewDesign}
                title="Start a new design"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                New
              </button>

              {/* Save Design */}
              <button
                className="action-bar__btn action-bar__btn--primary"
                onClick={handleSaveClick}
                title="Save this design to your gallery"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Save
              </button>

              {/* Export Dropdown */}
              <PlaygroundExportMenu
                onExportSVG={handleDownloadSVG}
                onExportPNG={handleDownloadPNG}
                onExportPDF={handleDownloadPDF}
                onExportTiles={handleDownloadTiles}
                viewMode={viewMode}
                exporting={generatingPDF}
                disabled={!(blendSvgUrl || solidSvgUrl)}
              />
            </div>
          )}
        </div>
      )}

      {/* View Recipe Details Button - Blend Mode (only if enabled) */}
      {FEATURE_FLAGS.BLEND_MODE_ENABLED && viewMode === 'blend' && blendSvgUrl && blendRecipes && !showFinalRecipes && (
        <div className="finalize-section">
          <button
            onClick={() => setShowFinalRecipes(true)}
            className="finalize-button"
          >
            View Recipe Details
          </button>
          <p className="finalize-hint">
            Click to see detailed blend formulas and quality metrics
          </p>
        </div>
      )}

      {/* View Colours Button - Solid Mode */}
      {viewMode === 'solid' && solidSvgUrl && solidRecipes && !showSolidSummary && (
        <div className="finalize-section">
          <button
            onClick={() => setShowSolidSummary(true)}
            className="finalize-button"
          >
            View TPV Colours Used
          </button>
          <p className="finalize-hint">
            See which pure TPV colours are used in this design
          </p>
        </div>
      )}

      {/* Blend Recipes Display (only if blend mode enabled) */}
      {FEATURE_FLAGS.BLEND_MODE_ENABLED && showFinalRecipes && blendRecipes && (
        <BlendRecipesDisplay
          recipes={currentBlendRecipes || blendRecipes}
          onClose={() => {
            setShowFinalRecipes(false);
          }}
          isRecalculating={isRecalculating}
        />
      )}

      {/* Solid Color Summary */}
      {showSolidSummary && solidRecipes && (
        <SolidColorSummary
          recipes={currentSolidRecipes || solidRecipes}
          onClose={() => {
            setShowSolidSummary(false);
          }}
          isRecalculating={isRecalculating}
        />
      )}

      {/* Color Editor Panel (Solid Mode) */}
      {colorEditorOpen && selectedColor && (
        <ColorEditorPanel
          color={selectedColor}
          mode={viewMode}
          onColorChange={handleColorChange}
          onClose={() => {
            setColorEditorOpen(false);
            setSelectedColor(null);
          }}
        />
      )}

      {/* Save Design Modal */}
      {showSaveModal && (
        <SaveDesignModal
          currentState={{
            inputMode,
            prompt,
            selectedFile,
            // Use confirmed dimensions if available (from dimension modal), otherwise use state
            lengthMM: confirmedDimensions?.height || lengthMM,
            widthMM: confirmedDimensions?.width || widthMM,
            result,
            viewMode,
            blendRecipes,
            solidRecipes,
            colorMapping,
            solidColorMapping,
            solidEditedColors,
            blendEditedColors,
            blendSvgUrl,
            solidSvgUrl,
            arMapping,
            jobId,
            inSituData,
            // Region overrides for transparency edits
            regionOverrides,
            originalTaggedSvg
          }}
          existingDesignId={currentDesignId}
          initialName={designName}
          onClose={() => {
            setShowSaveModal(false);
            setConfirmedDimensions(null); // Clear confirmed dimensions on close
          }}
          onSaved={(savedDesign, savedName) => {
            setShowSaveModal(false);
            setConfirmedDimensions(null); // Clear confirmed dimensions on save
            // User now has at least one saved design - hide welcome box
            setHasExistingDesigns(true);
            // Update design name to match what was saved
            if (savedName) {
              setDesignName(savedName);
            }
            if (onDesignSaved) {
              onDesignSaved(savedName);
            }
          }}
        />
      )}

      {/* In-Situ Preview Modal */}
      {showInSituModal && (
        <InSituModal
          designUrl={viewMode === 'solid' ? solidSvgUrl : blendSvgUrl}
          designDimensions={{
            width: widthMM,
            length: lengthMM
          }}
          onClose={() => setShowInSituModal(false)}
          onSaved={(inSituResult) => {
            setInSituData(inSituResult);
            setShowInSituModal(false);
          }}
        />
      )}

      {/* Dimension Modal - for image/SVG uploads when exporting PDF/tiles */}
      <DimensionModal
        isOpen={showDimensionModal}
        onClose={() => {
          setShowDimensionModal(false);
          setPendingDownloadAction(null);
        }}
        onConfirm={handleDimensionConfirm}
        aspectRatio={svgAspectRatio}
        defaultLongestSide={5000}
      />

      <style jsx>{`
        .inspire-panel-recraft {
          max-width: var(--max-width-xl);
          margin: 0 auto;
          padding: var(--space-4);
        }

        .panel-header {
          text-align: center;
          margin-bottom: var(--space-6);
        }

        .panel-header h2 {
          font-family: var(--font-heading);
          font-size: var(--text-3xl);
          margin: 0 0 var(--space-2) 0;
          color: var(--color-primary);
          font-weight: var(--font-bold);
          letter-spacing: var(--tracking-tight);
        }

        .subtitle {
          color: var(--color-text-secondary);
          font-size: var(--text-base);
          line-height: var(--leading-relaxed);
        }

        /* Complexity Indicator (Phase 1.5 Diagnostics) */
        .complexity-indicator {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
          padding: 0.5rem 0;
          margin-bottom: 0.5rem;
        }

        /* Flatten Controls (Phase 3) */
        .flatten-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .flatten-label {
          font-size: 0.75rem;
          color: #64748b;
        }

        .flatten-btn {
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .flatten-fast {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
        }

        .flatten-fast:hover:not(:disabled) {
          background: #e2e8f0;
          border-color: #94a3b8;
        }

        .flatten-clean {
          background: #dbeafe;
          border: 1px solid #93c5fd;
          color: #1e40af;
        }

        .flatten-clean:hover:not(:disabled) {
          background: #bfdbfe;
          border-color: #60a5fa;
        }

        .flatten-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .flattened-badge {
          display: inline-block;
          padding: 0.125rem 0.5rem;
          font-size: 0.65rem;
          font-weight: 600;
          color: white;
          background: #22c55e;
          border-radius: 3px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        /* Flatten Progress Overlay */
        .flatten-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .flatten-modal {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          max-width: 320px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        .flatten-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .flatten-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .flatten-progress-bar {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .flatten-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          border-radius: 4px;
          transition: width 0.2s ease;
        }

        .flatten-progress-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 1rem;
        }

        .flatten-warning {
          font-size: 0.75rem;
          color: #94a3b8;
          line-height: 1.4;
        }

        /* Flatten Error */
        .flatten-error {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #dc2626;
        }

        .flatten-error button {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #dc2626;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          opacity: 0.6;
        }

        .flatten-error button:hover {
          opacity: 1;
        }

        /* Welcome Guidance */
        .welcome-guidance {
          background: linear-gradient(135deg, #fff5f0 0%, #fff9f7 100%);
          border: 2px solid #ff6b35;
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          margin-bottom: var(--space-6);
          text-align: center;
        }

        .welcome-icon {
          font-size: 3rem;
          margin-bottom: var(--space-2);
        }

        .welcome-guidance h3 {
          margin: 0 0 var(--space-3);
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--color-primary);
        }

        .welcome-guidance p {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: var(--text-base);
          line-height: var(--leading-relaxed);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Input Mode Tabs - Enhanced cards */
        .input-mode-tabs {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-3);
          background: var(--color-bg-subtle);
          padding: var(--space-1);
          border-radius: var(--radius-lg);
        }

        .input-mode-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-3);
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .input-mode-tab:hover:not(:disabled) {
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .input-mode-tab.active {
          background: linear-gradient(135deg, var(--color-bg-subtle) 0%, var(--color-bg-card) 100%);
          border-color: var(--color-primary);
          box-shadow: var(--shadow-glow);
        }

        .input-mode-tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mode-icon {
          width: 28px;
          height: 28px;
          color: var(--color-text-secondary);
          transition: all var(--transition-base);
        }

        .input-mode-tab:hover:not(:disabled) .mode-icon {
          color: var(--color-primary);
          transform: scale(1.1);
        }

        .input-mode-tab.active .mode-icon {
          color: var(--color-primary);
        }

        .input-mode-tab .mode-title {
          font-family: var(--font-heading);
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
          margin-top: 0;
        }

        .input-mode-tab .mode-description {
          display: none; /* Hidden to save space */
        }

        .input-mode-tab.active .mode-title {
          color: var(--color-primary);
          font-weight: var(--font-bold);
        }

        /* Helper text */
        .helper-text {
          margin-top: var(--space-1);
          font-size: var(--text-sm);
          color: var(--color-text-tertiary);
          font-style: normal;
          line-height: var(--leading-snug);
        }

        /* Drag & Drop File Upload */
        .file-input-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .drop-zone {
          position: relative;
          width: 100%;
          min-height: 120px;
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-bg-subtle);
          transition: all var(--transition-base);
        }

        .drop-zone.dragging {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
          background: linear-gradient(135deg, rgba(30, 74, 122, 0.05) 0%, rgba(30, 74, 122, 0.1) 100%);
          box-shadow: var(--shadow-glow);
        }

        .drop-zone.has-file {
          border-color: var(--color-success);
          background: var(--color-success-light);
        }

        .drop-zone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-1);
          padding: var(--space-4);
          cursor: pointer;
          min-height: 120px;
        }

        .upload-icon {
          width: 36px;
          height: 36px;
          color: var(--color-text-secondary);
          transition: all var(--transition-base);
        }

        .upload-icon.success {
          color: var(--color-success);
        }

        .drop-zone:hover .upload-icon {
          color: var(--color-primary);
          transform: scale(1.1);
        }

        .drop-zone.has-file:hover .upload-icon.success {
          color: var(--color-success);
        }

        .drop-text {
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
        }

        .file-name {
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--color-success);
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .drop-hint {
          font-size: var(--text-sm);
          color: var(--color-text-tertiary);
        }

        .file-type-badge {
          display: inline-block;
          font-size: var(--text-xs);
          color: var(--color-text-secondary);
          background: var(--color-bg-tertiary);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          margin-top: var(--space-1);
        }

        .supported-formats {
          display: block;
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
          margin-top: var(--space-2);
          font-weight: var(--font-medium);
        }

        .drop-zone.dragging .drop-text,
        .drop-zone.dragging .drop-hint {
          color: var(--color-primary);
        }

        .upload-progress {
          padding: var(--space-2);
          background: var(--color-info-light);
          border: 1px solid var(--color-info);
          border-radius: var(--radius-md);
          color: var(--color-info);
          margin-bottom: var(--space-2);
          text-align: center;
          font-size: var(--text-sm);
        }

        .form-section {
          background: var(--color-bg-card);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-3);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-xs);
        }

        .form-group {
          margin-bottom: var(--space-3);
        }

        .form-group label {
          display: block;
          margin-bottom: var(--space-2);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
          font-size: var(--text-sm);
        }

        .prompt-input {
          width: 100%;
          padding: var(--space-3);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: var(--text-base);
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          transition: border-color var(--transition-base);
        }

        .prompt-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: var(--shadow-glow);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
        }

        input[type="number"] {
          width: 100%;
          padding: var(--space-2);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          font-size: var(--text-base);
          transition: border-color var(--transition-base);
        }

        input[type="number"]:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: var(--shadow-glow);
        }

        .error-message {
          padding: var(--space-3);
          background: var(--color-error-light);
          border: 1px solid var(--color-error);
          border-radius: var(--radius-md);
          color: var(--color-error);
          margin-bottom: var(--space-4);
          font-size: var(--text-sm);
        }

        .generate-button {
          width: 100%;
          padding: var(--space-4);
          background: var(--color-accent);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
        }

        .generate-button:hover:not(:disabled) {
          background: var(--color-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
        }

        .generate-button:disabled {
          background: var(--color-bg-subtle);
          color: var(--color-text-tertiary);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .progress-section {
          padding: var(--space-4);
          background: var(--color-info-light);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-4);
          border: 1px solid var(--color-info);
        }

        .progress-bar {
          height: 4px;
          background: var(--color-border);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: var(--space-3);
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--color-accent);
          animation: progress 2s ease-in-out infinite;
        }

        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-message {
          text-align: center;
          color: var(--color-text-secondary);
          font-weight: var(--font-medium);
          font-size: var(--text-base);
        }

        .results-section {
          background: var(--color-bg-card);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
        }

        .results-header h3 {
          font-family: var(--font-heading);
          margin: 0;
          color: var(--color-primary);
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
        }

        /* Aspect Ratio Info */
        .ar-info {
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-3);
          font-size: var(--text-sm);
        }

        .ar-info.full {
          background: var(--color-success-light);
          border: 1px solid var(--color-success);
        }

        .ar-info.framing {
          background: var(--color-warning-light);
          border: 1px solid var(--color-warning);
        }

        .ar-info.tiling {
          background: var(--color-info-light);
          border: 1px solid var(--color-info);
        }

        .ar-info-header {
          color: var(--color-text-primary);
          margin-bottom: var(--space-2);
          font-weight: var(--font-semibold);
        }

        .ar-info-details {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          align-items: center;
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
        }

        .ar-info-details span {
          white-space: nowrap;
        }

        .layout-note {
          color: var(--color-accent);
          font-weight: var(--font-medium);
        }

        /* Mode Toggle Tabs */
        .mode-tabs {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-3);
          background: var(--color-bg-subtle);
          padding: var(--space-1);
          border-radius: var(--radius-lg);
        }

        .mode-tab {
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-2);
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .mode-tab:hover:not(:disabled) {
          border-color: var(--color-accent);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .mode-tab.active {
          background: var(--color-accent);
          border-color: var(--color-accent);
          box-shadow: var(--shadow-glow-accent);
        }

        .mode-tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mode-title {
          font-family: var(--font-heading);
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--color-primary);
        }

        .mode-description {
          display: none; /* Hidden to save space */
        }

        .mode-tab.active .mode-title {
          color: white;
          font-weight: var(--font-bold);
        }

        .svg-preview {
          margin: var(--space-2) 0;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-bg-subtle);
          padding: var(--space-2);
        }

        .design-preview {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Finalize Section */
        .finalize-section {
          background: var(--color-accent-light);
          border: 2px solid var(--color-accent);
          border-radius: var(--radius-lg);
          padding: var(--space-3);
          margin-top: var(--space-3);
          text-align: center;
        }

        .finalize-button {
          width: 100%;
          max-width: 400px;
          padding: var(--space-3);
          background: var(--color-accent);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
        }

        .finalize-button:hover {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .finalize-hint {
          margin: var(--space-2) 0 0 0;
          color: var(--color-text-secondary);
          font-size: var(--text-xs);
        }

        /* Mixer Widget Container Styles */
        .mixer-widget-container {
          margin-top: var(--space-3);
          background: white;
          border-radius: 12px;
          padding: var(--space-3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .mixer-widget-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: var(--space-2);
          padding-bottom: var(--space-2);
          border-bottom: 2px solid var(--color-border);
        }

        .mixer-close-btn {
          padding: var(--space-2) var(--space-4);
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: var(--text-sm);
          cursor: pointer;
          transition: all 0.2s;
        }

        .mixer-close-btn:hover {
          background: #2563eb;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          transform: translateY(-1px);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .inspire-panel-recraft {
            padding: var(--space-2);
          }

          .panel-header {
            margin-bottom: var(--space-4);
          }

          .panel-header h2 {
            font-size: var(--text-xl);
          }

          .subtitle {
            font-size: var(--text-sm);
          }

          .welcome-guidance {
            padding: var(--space-4);
            margin-bottom: var(--space-4);
          }

          .welcome-icon {
            font-size: 2rem;
          }

          .welcome-guidance h3 {
            font-size: var(--text-lg);
          }

          .welcome-guidance p {
            font-size: var(--text-sm);
          }

          /* Stack input mode tabs vertically on mobile */
          .input-mode-tabs {
            flex-direction: column;
            gap: var(--space-1);
          }

          .input-mode-tab {
            flex-direction: row;
            justify-content: flex-start;
            padding: var(--space-3);
            min-height: 44px;
          }

          .mode-icon {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
          }

          .input-mode-tab .mode-title {
            font-size: var(--text-sm);
            margin-top: 0;
          }

          .input-mode-tab .mode-description {
            display: none;
          }

          /* Form sections */
          .form-section {
            padding: var(--space-3);
          }

          .form-group label {
            font-size: var(--text-xs);
          }

          /* Stack form rows on mobile */
          .form-row {
            grid-template-columns: 1fr;
            gap: var(--space-2);
          }

          /* Drop zone adjustments */
          .drop-zone {
            min-height: 140px;
          }

          .drop-zone-content {
            padding: var(--space-4);
            min-height: 140px;
          }

          .upload-icon {
            width: 36px;
            height: 36px;
          }

          .drop-text {
            font-size: var(--text-sm);
          }

          /* Generate button */
          .generate-button {
            padding: var(--space-3);
            font-size: var(--text-base);
            min-height: 44px;
          }

          /* Results section - minimal padding for max image width */
          .results-section {
            padding: var(--space-2);
            border-radius: var(--radius-md);
          }

          .results-header h3 {
            font-size: var(--text-lg);
          }

          /* Mode tabs */
          .mode-tabs {
            flex-direction: column;
            gap: var(--space-1);
          }

          .mode-tab {
            flex-direction: row;
            justify-content: flex-start;
            padding: var(--space-3);
            min-height: 44px;
          }

          .mode-title {
            font-size: var(--text-sm);
          }

          .mode-description {
            display: none;
          }

          /* AR info */
          .ar-info {
            padding: var(--space-2) var(--space-3);
          }

          .ar-info-details {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-1);
          }

          /* Finalize section */
          .finalize-section {
            padding: var(--space-3);
          }

          .finalize-button {
            padding: var(--space-3);
            font-size: var(--text-base);
          }
        }

        /* Extra small screens */
        @media (max-width: 480px) {
          .inspire-panel-recraft {
            padding: var(--space-1);
          }

          .panel-header h2 {
            font-size: var(--text-lg);
          }

          /* Results section - even less padding */
          .results-section {
            padding: var(--space-1);
            margin: 0 calc(-1 * var(--space-1));
            border-radius: 0;
          }

          .input-mode-tab {
            padding: var(--space-2);
          }

          .mode-tab {
            padding: var(--space-2);
          }
        }
      `}</style>
    </div>
  );
}
