// TPV Studio - Recraft Vector AI Panel
// Simplified UI for Recraft vector generation with compliance tracking

import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '../lib/api/client.js';
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
import { mapDimensionsToRecraft, getLayoutDescription, needsLayoutWarning } from '../utils/aspectRatioMapping.js';
import { uploadFile, validateFile } from '../lib/supabase/uploadFile.js';
import { deserializeDesign } from '../utils/designSerializer.js';
import { downloadSvgTiles } from '../lib/svgTileSlicer.js';
import tpvColours from '../../api/_utils/data/rosehill_tpv_21_colours.json';

export default function InspirePanelRecraft({ loadedDesign, onDesignSaved }) {
  // Input mode state - three options: prompt, image, svg
  const [inputMode, setInputMode] = useState('prompt'); // 'prompt', 'image', 'svg'

  // Form state
  const [prompt, setPrompt] = useState('');
  const [lengthMM, setLengthMM] = useState(5000);
  const [widthMM, setWidthMM] = useState(5000);

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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
  const [blendSvgUrl, setBlendSvgUrl] = useState(null);
  const [colorMapping, setColorMapping] = useState(null);
  const [showFinalRecipes, setShowFinalRecipes] = useState(false);

  // Solid color mode state
  const [viewMode, setViewMode] = useState('solid'); // 'blend' or 'solid' - default to solid
  const [solidRecipes, setSolidRecipes] = useState(null);
  const [solidSvgUrl, setSolidSvgUrl] = useState(null);
  const [solidColorMapping, setSolidColorMapping] = useState(null);
  const [showSolidSummary, setShowSolidSummary] = useState(false);

  // Color editor state
  const [colorEditorOpen, setColorEditorOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [solidEditedColors, setSolidEditedColors] = useState(new Map()); // originalHex -> {newHex}
  const [blendEditedColors, setBlendEditedColors] = useState(new Map()); // originalHex -> {newHex}

  // Mixer state (for blend mode only)
  const [mixerOpen, setMixerOpen] = useState(false);
  const [mixerColor, setMixerColor] = useState(null); // Color being edited in mixer

  // Save design state
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Design name state
  const [designName, setDesignName] = useState('');
  const [isNameLoading, setIsNameLoading] = useState(false);

  // Track loaded design ID for updates
  const [currentDesignId, setCurrentDesignId] = useState(null);

  // In-situ preview state
  const [showInSituModal, setShowInSituModal] = useState(false);
  const [inSituData, setInSituData] = useState(null);

  // Dimension modal state
  const [showDimensionModal, setShowDimensionModal] = useState(false);
  const [svgAspectRatio, setSvgAspectRatio] = useState(null);
  const [pendingDownloadAction, setPendingDownloadAction] = useState(null); // 'pdf' or 'tiles'

  // Ref for SVG preview section (for auto-scroll)
  const svgPreviewRef = useRef(null);

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

  // Reset dimensions when switching to image/SVG upload modes
  useEffect(() => {
    if (inputMode === 'image' || inputMode === 'svg') {
      // Clear dimensions for upload modes - they'll be set via modal when needed
      setWidthMM(null);
      setLengthMM(null);
      console.log('[DIMENSION] Reset dimensions for upload mode:', inputMode);
    } else if (inputMode === 'prompt') {
      // Restore default dimensions for prompt mode if they're null
      if (widthMM === null || lengthMM === null) {
        setWidthMM(5000);
        setLengthMM(5000);
        console.log('[DIMENSION] Restored default dimensions for prompt mode');
      }
    }
  }, [inputMode]);

  // Cleanup blob URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (blendSvgUrl && blendSvgUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blendSvgUrl);
      }
      if (solidSvgUrl && solidSvgUrl.startsWith('blob:')) {
        URL.revokeObjectURL(solidSvgUrl);
      }
    };
  }, []);

  // Load design when loadedDesign prop changes
  useEffect(() => {
    if (loadedDesign) {
      console.log('[INSPIRE] Loading design data:', loadedDesign);
      const restoredState = deserializeDesign(loadedDesign);
      console.log('[INSPIRE] Restored state:', restoredState);

      // Restore all state
      setInputMode(restoredState.inputMode);
      setPrompt(restoredState.prompt);
      setSelectedFile(restoredState.selectedFile);
      setLengthMM(restoredState.lengthMM);
      setWidthMM(restoredState.widthMM);
      setResult(restoredState.result);
      setBlendRecipes(restoredState.blendRecipes);
      setSolidRecipes(restoredState.solidRecipes);
      setColorMapping(restoredState.colorMapping);
      setSolidColorMapping(restoredState.solidColorMapping);
      setSolidEditedColors(restoredState.solidEditedColors);
      setBlendEditedColors(restoredState.blendEditedColors);
      setBlendSvgUrl(restoredState.blendSvgUrl);
      setSolidSvgUrl(restoredState.solidSvgUrl);
      setViewMode(restoredState.viewMode);
      setArMapping(restoredState.arMapping);
      setJobId(restoredState.jobId);
      setShowFinalRecipes(restoredState.showFinalRecipes);
      setShowSolidSummary(restoredState.showSolidSummary);

      console.log('[INSPIRE] Loaded design:', loadedDesign.name);

      // Set design name from saved design
      if (loadedDesign.name) {
        setDesignName(loadedDesign.name);
      }

      // Track design ID for updates
      if (loadedDesign.id) {
        setCurrentDesignId(loadedDesign.id);
      }

      // Regenerate SVGs from saved state (blob URLs don't survive page reload)
      // This needs to happen after state is set, so we use a timeout
      setTimeout(async () => {
        if (restoredState.result?.svg_url) {
          console.log('[INSPIRE] Regenerating SVGs from loaded design');

          try {
            // Regenerate blend SVG if we have blend recipes
            if (restoredState.blendRecipes && restoredState.colorMapping) {
              await regenerateBlendSVGFromState(
                restoredState.result.svg_url,
                restoredState.colorMapping,
                restoredState.blendRecipes,
                restoredState.blendEditedColors
              );
            }

            // Regenerate solid SVG if we have solid recipes
            if (restoredState.solidRecipes && restoredState.solidColorMapping) {
              await regenerateSolidSVGFromState(
                restoredState.result.svg_url,
                restoredState.solidColorMapping,
                restoredState.solidRecipes,
                restoredState.solidEditedColors
              );
            }
          } catch (err) {
            console.error('[INSPIRE] Failed to regenerate SVGs:', err);
            setError('Failed to restore design preview. Please try reloading.');
          }
        }
      }, 100);
    }
  }, [loadedDesign]);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file type based on input mode
    const allowedTypes = inputMode === 'image'
      ? ['image/png', 'image/jpeg']
      : ['image/svg+xml'];

    const validation = validateFile(file, {
      maxSizeMB: 10,
      allowedTypes
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

      // Validate file type based on input mode
      const allowedTypes = inputMode === 'image'
        ? ['image/png', 'image/jpeg']
        : ['image/svg+xml'];

      const validation = validateFile(file, {
        maxSizeMB: 10,
        allowedTypes
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

    if ((inputMode === 'image' || inputMode === 'svg') && !selectedFile) {
      setError('Please select a file to upload');
      return;
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

      // MODE: Upload SVG (fast path - no AI generation)
      if (inputMode === 'svg') {
        setProgressMessage('Uploading SVG file...');
        setUploadProgress('Uploading...');

        // Upload to Supabase
        const uploadResult = await uploadFile(selectedFile);
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload file');
        }

        setProgressMessage('Processing SVG...');
        setUploadProgress(null);

        // Call process-uploaded-svg API (dimensions not needed for SVG uploads)
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
      }

      // MODE: Upload Image (vectorize then process)
      if (inputMode === 'image') {
        setProgressMessage('Uploading image...');
        setUploadProgress('Uploading...');

        // Upload to Supabase
        const uploadResult = await uploadFile(selectedFile);
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload file');
        }

        setProgressMessage('Starting vectorisation...');
        setUploadProgress(null);

        // Call recraft-vectorize API (dimensions not needed for image vectorization)
        response = await apiClient.vectorizeImage({
          image_url: uploadResult.url
        });

        if (!response.success) {
          throw new Error(response.error || 'Failed to start vectorisation');
        }

        setProgressMessage('🎨 AI is vectorising your image...');
      }
      // MODE: Text Prompt (existing Recraft generation)
      else {
        // Map dimensions to canonical Recraft aspect ratio
        const mapping = mapDimensionsToRecraft(lengthMM, widthMM);
        setArMapping(mapping);

        console.log('[TPV-STUDIO] AR Mapping:', mapping);
        console.log('[TPV-STUDIO] Layout:', getLayoutDescription(mapping));

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
    setSelectedFile(null);
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
      console.log(`[DIMENSION] Detected aspect ratio: ${aspectRatio.toFixed(2)} (${width}×${height})`);
      return aspectRatio;
    } catch (err) {
      console.error('[DIMENSION] Failed to detect aspect ratio:', err);
      return null;
    }
  };

  // Helper: Update dimensions and execute pending download action
  const handleDimensionConfirm = (width, height) => {
    console.log(`[DIMENSION] User confirmed dimensions: ${width}mm × ${height}mm`);
    setWidthMM(width);
    setLengthMM(height);

    // Execute the pending download action
    if (pendingDownloadAction === 'pdf') {
      // Trigger PDF download with new dimensions
      setTimeout(() => executePDFDownload(width, height), 100);
    } else if (pendingDownloadAction === 'tiles') {
      // Trigger tiles download with new dimensions
      setTimeout(() => executeTilesDownload(width, height), 100);
    } else if (pendingDownloadAction === 'insitu') {
      // Open in-situ modal with new dimensions
      setTimeout(() => setShowInSituModal(true), 100);
    }

    setPendingDownloadAction(null);
  };

  // Handle in-situ preview click - check dimensions first
  const handleInSituClick = async () => {
    const svgUrl = viewMode === 'solid' ? solidSvgUrl : blendSvgUrl;

    // Check if dimensions are set (prompt mode always has them, image/SVG uploads might not)
    if ((inputMode === 'image' || inputMode === 'svg') && (!widthMM || !lengthMM)) {
      console.log('[DIMENSION] No dimensions set for image/SVG upload, showing modal...');

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

  // Download PDF Export
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    const svgUrl = viewMode === 'solid' ? solidSvgUrl : blendSvgUrl;

    // Check if dimensions are set (prompt mode always has them, image/SVG uploads might not)
    if ((inputMode === 'image' || inputMode === 'svg') && (!widthMM || !lengthMM)) {
      console.log('[DIMENSION] No dimensions set for image/SVG upload, showing modal...');

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
    const recipes = viewMode === 'solid' ? solidRecipes : blendRecipes;
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

      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

    // Check if dimensions are set (prompt mode always has them, image/SVG uploads might not)
    if ((inputMode === 'image' || inputMode === 'svg') && (!widthMM || !lengthMM)) {
      console.log('[DIMENSION] No dimensions set for image/SVG upload, showing modal...');

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

          // Auto-generate solid color version in background
          handleGenerateSolid(svg_url, job_id);
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
  const handleGenerateSolid = async (svgUrl = null, jobIdParam = null) => {
    const svg_url = svgUrl || result?.svg_url;
    const job_id = jobIdParam || jobId;

    if (!svg_url) return;

    try {
      console.log('[TPV-STUDIO] Generating solid color version...');

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

        // Build colour mapping for solid colors
        const mapping = buildColorMapping(data.recipes);
        setSolidColorMapping(mapping);

        // Generate recoloured SVG with solid colors
        try {
          const { dataUrl, stats } = await recolorSVG(svg_url, mapping);
          setSolidSvgUrl(dataUrl);
          console.log('[TPV-STUDIO] Solid color SVG generated:', stats);

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

  // Handle color click from SVGPreview
  const handleColorClick = (colorData) => {
    console.log('[TPV-STUDIO] Color clicked:', colorData, 'in mode:', viewMode);

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
  };

  // Handle color change from ColorEditorPanel (solid mode only)
  const handleColorChange = async (newHex) => {
    if (!selectedColor) return;

    console.log('[TPV-STUDIO] Color changed:', selectedColor.hex, '->', newHex, 'in mode:', viewMode);

    // Update mode-specific edited colors map (normalize to lowercase for consistency)
    if (viewMode === 'solid') {
      const updated = new Map(solidEditedColors);
      updated.set(selectedColor.originalHex.toLowerCase(), { newHex: newHex.toLowerCase() });
      setSolidEditedColors(updated);

      // Update selected color with new hex and blendHex for highlighting
      setSelectedColor({
        ...selectedColor,
        hex: newHex,
        blendHex: newHex
      });

      await regenerateSolidSVG(updated, newHex);
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

    console.log('[TPV-STUDIO] Mixer blend changed:', mixerColor.originalHex, '->', blendHex, 'recipe:', recipe);

    // Update blend edited colors with new blend hex and recipe
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
  }, [mixerColor, blendEditedColors, result, colorMapping, blendRecipes]);

  // Regenerate blend SVG with edited colors
  const regenerateBlendSVG = async (updatedEdits = null, immediateHex = null) => {
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

      // Recolor SVG with updated mapping
      const { dataUrl, stats } = await recolorSVG(result.svg_url, updatedMapping);
      setBlendSvgUrl(dataUrl);
      setColorMapping(updatedMapping);
      setBlendRecipes(updatedRecipes); // Update recipes to show new colors in legend
      console.log('[TPV-STUDIO] Blend SVG regenerated with edits:', stats);
    } catch (err) {
      console.error('[TPV-STUDIO] Failed to regenerate blend SVG:', err);
    }
  };

  // Regenerate solid SVG with edited colors
  const regenerateSolidSVG = async (updatedEdits = null, immediateHex = null) => {
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

      // Recolor SVG with updated mapping
      const { dataUrl, stats } = await recolorSVG(result.svg_url, updatedMapping);
      setSolidSvgUrl(dataUrl);
      setSolidColorMapping(updatedMapping);
      setSolidRecipes(updatedRecipes); // Update recipes to show new colors in legend
      console.log('[TPV-STUDIO] Solid SVG regenerated with edits:', stats);
    } catch (err) {
      console.error('[TPV-STUDIO] Failed to regenerate solid SVG:', err);
    }
  };

  // Helper function to regenerate blend SVG from loaded design state
  const regenerateBlendSVGFromState = async (svgUrl, colorMapping, recipes, editedColors) => {
    try {
      console.log('[INSPIRE] Regenerating blend SVG from state');

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

      // Recolor SVG (recolorSVG fetches the URL itself)
      const { dataUrl } = await recolorSVG(svgUrl, updatedMapping);

      setBlendSvgUrl(dataUrl);
      console.log('[INSPIRE] Blend SVG regenerated');
    } catch (err) {
      console.error('[INSPIRE] Failed to regenerate blend SVG:', err);
    }
  };

  // Helper function to regenerate solid SVG from loaded design state
  const regenerateSolidSVGFromState = async (svgUrl, colorMapping, recipes, editedColors) => {
    try {
      console.log('[INSPIRE] Regenerating solid SVG from state');

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

      // Recolor SVG (recolorSVG fetches the URL itself)
      const { dataUrl } = await recolorSVG(svgUrl, updatedMapping);

      setSolidSvgUrl(dataUrl);
      console.log('[INSPIRE] Solid SVG regenerated');
    } catch (err) {
      console.error('[INSPIRE] Failed to regenerate solid SVG:', err);
    }
  };


  return (
    <div className="inspire-panel-recraft">
      <div className="panel-header">
        <h2>TPV Studio - Vector AI</h2>
        <p className="subtitle">AI-powered vector designs for playground surfacing</p>
      </div>

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
          className={`input-mode-tab ${inputMode === 'image' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('image');
            setPrompt('');
            setError(null);
          }}
          disabled={generating}
        >
          <svg className="mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="mode-title">Upload Image</span>
          <span className="mode-description">Vectorise PNG/JPG</span>
        </button>
        <button
          className={`input-mode-tab ${inputMode === 'svg' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('svg');
            setPrompt('');
            setError(null);
          }}
          disabled={generating}
        >
          <svg className="mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <span className="mode-title">Upload SVG</span>
          <span className="mode-description">Process existing vector</span>
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
              Describe the design you want to generate. The AI will create a vector illustration based on your description.
            </p>
          </div>
        )}

        {/* Image Upload Mode */}
        {inputMode === 'image' && (
          <div className="form-group">
            <label htmlFor="image-upload">Upload Image (PNG/JPG)</label>
            <div
              className={`drop-zone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                id="image-upload"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFileSelect}
                disabled={generating}
                className="file-input-hidden"
              />
              <label htmlFor="image-upload" className="drop-zone-content">
                {selectedFile ? (
                  <>
                    <svg className="upload-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="drop-hint">Click to change file</span>
                  </>
                ) : (
                  <>
                    <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="drop-text">Drag & drop your image here</span>
                    <span className="drop-hint">or click to browse</span>
                  </>
                )}
              </label>
            </div>
            <p className="helper-text">
              Upload a raster image (PNG or JPG). The AI will convert it to vector format (SVG) suitable for TPV surfacing.
            </p>
          </div>
        )}

        {/* SVG Upload Mode */}
        {inputMode === 'svg' && (
          <div className="form-group">
            <label htmlFor="svg-upload">Upload SVG File</label>
            <div
              className={`drop-zone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                id="svg-upload"
                type="file"
                accept="image/svg+xml"
                onChange={handleFileSelect}
                disabled={generating}
                className="file-input-hidden"
              />
              <label htmlFor="svg-upload" className="drop-zone-content">
                {selectedFile ? (
                  <>
                    <svg className="upload-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="drop-hint">Click to change file</span>
                  </>
                ) : (
                  <>
                    <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="drop-text">Drag & drop your SVG here</span>
                    <span className="drop-hint">or click to browse</span>
                  </>
                )}
              </label>
            </div>
            <p className="helper-text">
              Upload an existing SVG vector file. It will be processed immediately for TPV colour matching - no AI generation needed.
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
            ((inputMode === 'image' || inputMode === 'svg') && !selectedFile)
          }
          className="generate-button"
        >
          {generating
            ? (inputMode === 'svg' ? 'Processing...' : 'Generating...')
            : (inputMode === 'prompt'
                ? 'Generate Vector Design'
                : inputMode === 'image'
                  ? 'Vectorise & Process'
                  : 'Process SVG'
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

          {/* Mode Toggle Tabs */}
          {blendSvgUrl && blendRecipes && (
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

          {/* TPV Blend Preview - Blend Mode */}
          {viewMode === 'blend' && blendSvgUrl && blendRecipes && (
            <div ref={svgPreviewRef}>
              <SVGPreview
                blendSvgUrl={blendSvgUrl}
                recipes={blendRecipes}
                mode="blend"
                onColorClick={handleColorClick}
                selectedColor={selectedColor}
                editedColors={blendEditedColors}
                onResetAll={handleResetAllColors}
                designName={designName}
                onNameChange={setDesignName}
                isNameLoading={isNameLoading}
                onInSituClick={handleInSituClick}
              />
            </div>
          )}

          {/* TPV Blend Preview - Solid Mode */}
          {viewMode === 'solid' && solidSvgUrl && solidRecipes && (
            <div ref={svgPreviewRef}>
              <SVGPreview
                blendSvgUrl={solidSvgUrl}
                recipes={solidRecipes}
                mode="solid"
                onColorClick={handleColorClick}
                selectedColor={selectedColor}
                editedColors={solidEditedColors}
                onResetAll={handleResetAllColors}
                designName={designName}
                onNameChange={setDesignName}
                isNameLoading={isNameLoading}
                onInSituClick={handleInSituClick}
              />
            </div>
          )}

          {/* Mixer Widget (Blend Mode) */}
          {mixerOpen && mixerColor && (
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
                initialRecipe={
                  blendEditedColors.get(mixerColor.originalHex.toLowerCase())?.recipe ||
                  (mixerColor.recipe || null)
                }
                onBlendChange={handleMixerBlendChange}
                originalColor={mixerColor.originalHex}
              />
            </div>
          )}

          {/* Action Buttons - Show when design is ready */}
          {blendSvgUrl && (
            <div className="action-buttons">
              <button onClick={() => setShowSaveModal(true)} className="save-button">
                💾 Save Design
              </button>
              <button onClick={handleDownloadSVG} className="download-button svg">
                {viewMode === 'solid' ? 'Download Solid TPV SVG' : 'Download TPV Blend SVG'}
              </button>
              <button onClick={handleDownloadPNG} className="download-button png">
                {viewMode === 'solid' ? 'Download Solid TPV PNG' : 'Download TPV Blend PNG'}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="download-button pdf"
                disabled={generatingPDF || !(viewMode === 'solid' ? solidRecipes : blendRecipes)}
              >
                {generatingPDF
                  ? 'Generating PDF...'
                  : viewMode === 'solid'
                    ? 'Export Solid PDF'
                    : 'Export Blend PDF'
                }
              </button>
              <button
                onClick={handleDownloadTiles}
                className="download-button tiles"
                title={widthMM && lengthMM
                  ? `Download ${Math.ceil(widthMM / 1000) * Math.ceil(lengthMM / 1000)} tiles (1m×1m each)`
                  : 'Download design sliced into 1m×1m tiles'}
              >
                Download Tiles ZIP
              </button>
            </div>
          )}
        </div>
      )}

      {/* View Recipe Details Button - Blend Mode */}
      {viewMode === 'blend' && blendSvgUrl && blendRecipes && !showFinalRecipes && (
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

      {/* Blend Recipes Display */}
      {showFinalRecipes && blendRecipes && (
        <BlendRecipesDisplay
          recipes={blendRecipes}
          onClose={() => {
            setShowFinalRecipes(false);
          }}
        />
      )}

      {/* Solid Color Summary */}
      {showSolidSummary && solidRecipes && (
        <SolidColorSummary
          recipes={solidRecipes}
          onClose={() => {
            setShowSolidSummary(false);
          }}
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
            lengthMM,
            widthMM,
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
            inSituData
          }}
          existingDesignId={currentDesignId}
          initialName={designName}
          onClose={() => setShowSaveModal(false)}
          onSaved={(savedDesign, savedName) => {
            setShowSaveModal(false);
            // Update design name to match what was saved
            if (savedName) {
              setDesignName(savedName);
            }
            if (onDesignSaved) {
              onDesignSaved(savedName);
            }
            console.log('[INSPIRE] Design saved:', savedDesign);
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
            console.log('[INSPIRE] In-situ preview saved:', inSituResult);
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

        /* Input Mode Tabs - Enhanced cards */
        .input-mode-tabs {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
          background: var(--color-bg-subtle);
          padding: var(--space-1);
          border-radius: var(--radius-lg);
        }

        .input-mode-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-4);
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
          width: 32px;
          height: 32px;
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
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
          margin-top: var(--space-1);
        }

        .input-mode-tab .mode-description {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          text-align: center;
          line-height: var(--leading-snug);
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
          min-height: 180px;
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
          gap: var(--space-2);
          padding: var(--space-6);
          cursor: pointer;
          min-height: 180px;
        }

        .upload-icon {
          width: 48px;
          height: 48px;
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
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-4);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-xs);
        }

        .form-group {
          margin-bottom: var(--space-4);
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
          margin-bottom: var(--space-4);
          background: var(--color-bg-subtle);
          padding: var(--space-1);
          border-radius: var(--radius-lg);
        }

        .mode-tab {
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
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          text-align: center;
        }

        .mode-tab.active .mode-title {
          color: white;
          font-weight: var(--font-bold);
        }

        .mode-tab.active .mode-description {
          color: rgba(255, 255, 255, 0.9);
        }

        .svg-preview {
          margin: var(--space-3) 0;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-bg-subtle);
          padding: var(--space-3);
        }

        .design-preview {
          width: 100%;
          height: auto;
          display: block;
        }

        .action-buttons {
          display: flex;
          gap: var(--space-2);
          margin-top: var(--space-4);
        }

        .download-button,
        .blend-button,
        .new-generation-button,
        .save-button {
          flex: 1;
          padding: var(--space-3);
          border: none;
          border-radius: var(--radius-md);
          font-weight: var(--font-semibold);
          font-size: var(--text-base);
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
        }

        .download-button.svg {
          background: var(--color-primary);
          color: white;
        }

        .download-button.svg:hover {
          background: var(--color-primary-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .download-button.png {
          background: var(--color-success);
          color: white;
        }

        .download-button.png:hover {
          background: var(--color-success-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .download-button.pdf {
          background: var(--color-info);
          color: white;
        }

        .download-button.pdf:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .download-button.pdf:disabled {
          background: var(--color-text-tertiary);
          cursor: not-allowed;
          transform: none;
        }

        .download-button.tiles {
          background: #8b5cf6;
          color: white;
        }

        .download-button.tiles:hover {
          background: #7c3aed;
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .blend-button {
          background: var(--color-accent);
          color: white;
        }

        .blend-button:hover:not(:disabled) {
          background: var(--color-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
        }

        .blend-button:disabled {
          background: var(--color-bg-subtle);
          color: var(--color-text-tertiary);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .new-generation-button {
          background: var(--color-bg-subtle);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
        }

        .new-generation-button:hover {
          background: var(--color-border);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .save-button {
          background: #10b981;
          color: white;
        }

        .save-button:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        /* Finalize Section */
        .finalize-section {
          background: var(--color-accent-light);
          border: 2px solid var(--color-accent);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          margin-top: var(--space-4);
          text-align: center;
        }

        .finalize-button {
          width: 100%;
          max-width: 400px;
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

        .finalize-button:hover {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .finalize-hint {
          margin: var(--space-3) 0 0 0;
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
        }

        /* Mixer Widget Container Styles */
        .mixer-widget-container {
          margin-top: var(--space-4);
          background: white;
          border-radius: 12px;
          padding: var(--space-4);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .mixer-widget-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: var(--space-3);
          padding-bottom: var(--space-3);
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
          background: var(--color-primary-dark);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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

          /* Action buttons - 2x2 grid on mobile */
          .action-buttons {
            flex-wrap: wrap;
            gap: var(--space-2);
          }

          .download-button,
          .blend-button,
          .new-generation-button,
          .save-button {
            flex: 1 1 calc(50% - var(--space-1));
            min-width: calc(50% - var(--space-1));
            padding: var(--space-2);
            font-size: var(--text-sm);
            min-height: 44px;
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

          /* Stack all action buttons vertically */
          .action-buttons {
            flex-direction: column;
          }

          .download-button,
          .blend-button,
          .new-generation-button,
          .save-button {
            flex: 1 1 100%;
            min-width: 100%;
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
