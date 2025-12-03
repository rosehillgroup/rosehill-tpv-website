// TPV Studio - Design Generator State Management
// Zustand store for preserving design generation state (AI prompts, SVG uploads, color editing)
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initialState = {
  // Input configuration
  inputMode: 'prompt', // 'prompt', 'image', 'svg'
  prompt: '',
  lengthMM: 5000,
  widthMM: 5000,

  // File upload (note: File objects can't be persisted, just metadata)
  selectedFileName: null,
  uploadedFileUrl: null,

  // Aspect ratio mapping from dimension modal
  arMapping: null,

  // Generation result
  result: null, // { svg_url, png_url, etc. }
  jobId: null,

  // Blend mode state
  blendRecipes: null,
  blendSvgUrl: null,
  colorMapping: null,
  blendEditedColors: new Map(), // originalHex -> {newHex}

  // Solid mode state
  solidRecipes: null,
  solidSvgUrl: null,
  solidColorMapping: null,
  solidEditedColors: new Map(), // originalHex -> {newHex}

  // View mode
  viewMode: 'solid', // 'blend' or 'solid'
  showFinalRecipes: false,
  showSolidSummary: false,

  // Region-based editing
  regionOverrides: new Map(), // regionId -> hex
  originalTaggedSvg: null, // SVG with region IDs

  // Undo/redo history for region overrides
  regionOverridesHistory: [new Map()],
  historyIndex: 0,

  // Design metadata
  designName: '',
  currentDesignId: null,

  // Track if any work has been done (for unsaved changes detection)
  hasGeneratedContent: false,
  lastModified: null
};

export const usePlaygroundDesignStore = create(
  devtools(
    (set, get) => ({
      ...initialState,

      // ====== Input Actions ======
      setInputMode: (mode) => set({ inputMode: mode }),

      setPrompt: (prompt) => set({ prompt, lastModified: Date.now() }),

      setDimensions: (widthMM, lengthMM) => set({
        widthMM,
        lengthMM,
        lastModified: Date.now()
      }),

      setArMapping: (arMapping) => set({ arMapping }),

      // ====== File Upload Actions ======
      setSelectedFile: (fileName, fileUrl) => set({
        selectedFileName: fileName,
        uploadedFileUrl: fileUrl,
        lastModified: Date.now()
      }),

      clearSelectedFile: () => set({
        selectedFileName: null,
        uploadedFileUrl: null
      }),

      // ====== Generation Result Actions ======
      setGenerationResult: (result, jobId) => set({
        result,
        jobId,
        hasGeneratedContent: true,
        lastModified: Date.now()
      }),

      // Individual setters for result and jobId
      setResult: (result) => set({
        result,
        hasGeneratedContent: !!result,
        lastModified: Date.now()
      }),

      setJobId: (jobId) => set({ jobId }),

      // ====== Blend Mode Actions ======
      setBlendState: (blendRecipes, colorMapping, blendSvgUrl) => set({
        blendRecipes,
        colorMapping,
        blendSvgUrl,
        lastModified: Date.now()
      }),

      // Individual blend setters
      setBlendRecipes: (blendRecipes) => set({ blendRecipes, lastModified: Date.now() }),
      setColorMapping: (colorMapping) => set({ colorMapping, lastModified: Date.now() }),
      setBlendSvgUrl: (blendSvgUrl) => set({ blendSvgUrl }),

      setBlendEditedColors: (editedColors) => set({
        blendEditedColors: editedColors,
        lastModified: Date.now()
      }),

      updateBlendSvgUrl: (url) => set({ blendSvgUrl: url }),

      // ====== Solid Mode Actions ======
      setSolidState: (solidRecipes, solidColorMapping, solidSvgUrl) => set({
        solidRecipes,
        solidColorMapping,
        solidSvgUrl,
        lastModified: Date.now()
      }),

      // Individual solid setters
      setSolidRecipes: (solidRecipes) => set({ solidRecipes, lastModified: Date.now() }),
      setSolidColorMapping: (solidColorMapping) => set({ solidColorMapping, lastModified: Date.now() }),
      setSolidSvgUrl: (solidSvgUrl) => set({ solidSvgUrl }),

      setSolidEditedColors: (editedColors) => set({
        solidEditedColors: editedColors,
        lastModified: Date.now()
      }),

      updateSolidSvgUrl: (url) => set({ solidSvgUrl: url }),

      // ====== View Mode Actions ======
      setViewMode: (mode) => set({ viewMode: mode }),

      setShowFinalRecipes: (show) => set({ showFinalRecipes: show }),

      setShowSolidSummary: (show) => set({ showSolidSummary: show }),

      // ====== Region Override Actions ======
      setOriginalTaggedSvg: (svg) => set({ originalTaggedSvg: svg }),

      setRegionOverrides: (overrides) => set({
        regionOverrides: overrides,
        lastModified: Date.now()
      }),

      addRegionOverride: (regionId, hex) => {
        const current = new Map(get().regionOverrides);
        current.set(regionId, hex);

        // Add to history
        const history = get().regionOverridesHistory;
        const historyIndex = get().historyIndex;
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(new Map(current));

        // Limit history size
        if (newHistory.length > 50) {
          newHistory.shift();
        }

        set({
          regionOverrides: current,
          regionOverridesHistory: newHistory,
          historyIndex: newHistory.length - 1,
          lastModified: Date.now()
        });
      },

      // Set history state directly (supports updater function)
      setRegionOverridesHistory: (historyOrUpdater) => {
        if (typeof historyOrUpdater === 'function') {
          set({ regionOverridesHistory: historyOrUpdater(get().regionOverridesHistory) });
        } else {
          set({ regionOverridesHistory: historyOrUpdater });
        }
      },

      // Individual setter for history index (supports updater function)
      setHistoryIndex: (indexOrUpdater) => {
        if (typeof indexOrUpdater === 'function') {
          set({ historyIndex: indexOrUpdater(get().historyIndex) });
        } else {
          set({ historyIndex: indexOrUpdater });
        }
      },

      // ====== Undo/Redo Actions ======
      canUndo: () => get().historyIndex > 0,

      canRedo: () => get().historyIndex < get().regionOverridesHistory.length - 1,

      undo: () => {
        const { historyIndex, regionOverridesHistory } = get();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          set({
            historyIndex: newIndex,
            regionOverrides: new Map(regionOverridesHistory[newIndex])
          });
        }
      },

      redo: () => {
        const { historyIndex, regionOverridesHistory } = get();
        if (historyIndex < regionOverridesHistory.length - 1) {
          const newIndex = historyIndex + 1;
          set({
            historyIndex: newIndex,
            regionOverrides: new Map(regionOverridesHistory[newIndex])
          });
        }
      },

      setRegionOverridesHistory: (history, index) => set({
        regionOverridesHistory: history,
        historyIndex: index
      }),

      // ====== Design Metadata Actions ======
      setDesignName: (name) => set({ designName: name }),

      setCurrentDesignId: (id) => set({ currentDesignId: id }),

      // ====== Load Design Action ======
      loadDesign: (restoredState) => {
        set({
          inputMode: restoredState.inputMode || 'prompt',
          prompt: restoredState.prompt || '',
          lengthMM: restoredState.lengthMM || 5000,
          widthMM: restoredState.widthMM || 5000,
          uploadedFileUrl: restoredState.selectedFile || null,
          result: restoredState.result || null,
          blendRecipes: restoredState.blendRecipes || null,
          solidRecipes: restoredState.solidRecipes || null,
          colorMapping: restoredState.colorMapping || null,
          solidColorMapping: restoredState.solidColorMapping || null,
          solidEditedColors: restoredState.solidEditedColors || new Map(),
          blendEditedColors: restoredState.blendEditedColors || new Map(),
          blendSvgUrl: restoredState.blendSvgUrl || null,
          solidSvgUrl: restoredState.solidSvgUrl || null,
          viewMode: restoredState.viewMode || 'solid',
          arMapping: restoredState.arMapping || null,
          jobId: restoredState.jobId || null,
          showFinalRecipes: restoredState.showFinalRecipes || false,
          showSolidSummary: restoredState.showSolidSummary || false,
          hasGeneratedContent: !!restoredState.result,
          lastModified: Date.now()
        });
      },

      // ====== Export Design Data ======
      exportDesignData: () => {
        const state = get();
        return {
          inputMode: state.inputMode,
          prompt: state.prompt,
          lengthMM: state.lengthMM,
          widthMM: state.widthMM,
          uploadedFileUrl: state.uploadedFileUrl,
          result: state.result,
          blendRecipes: state.blendRecipes,
          solidRecipes: state.solidRecipes,
          colorMapping: state.colorMapping,
          solidColorMapping: state.solidColorMapping,
          solidEditedColors: state.solidEditedColors,
          blendEditedColors: state.blendEditedColors,
          viewMode: state.viewMode,
          arMapping: state.arMapping,
          jobId: state.jobId,
          showFinalRecipes: state.showFinalRecipes,
          showSolidSummary: state.showSolidSummary,
          regionOverrides: state.regionOverrides,
          designName: state.designName,
          currentDesignId: state.currentDesignId
        };
      },

      // ====== Reset Design (New Design) ======
      resetDesign: () => {
        // Clean up blob URLs before resetting
        const { blendSvgUrl, solidSvgUrl } = get();
        if (blendSvgUrl && blendSvgUrl.startsWith('blob:')) {
          URL.revokeObjectURL(blendSvgUrl);
        }
        if (solidSvgUrl && solidSvgUrl.startsWith('blob:')) {
          URL.revokeObjectURL(solidSvgUrl);
        }

        set({
          ...initialState,
          // Reset Maps to new instances
          blendEditedColors: new Map(),
          solidEditedColors: new Map(),
          regionOverrides: new Map(),
          regionOverridesHistory: [new Map()]
        });
      },

      // ====== Check for Unsaved Changes ======
      hasUnsavedChanges: () => {
        const state = get();
        // Has changes if:
        // 1. Has generated content and no design ID (never saved)
        // 2. Has generated content and was modified after loading
        return state.hasGeneratedContent ||
               state.prompt.trim() !== '' ||
               state.selectedFileName !== null;
      }
    }),
    { name: 'PlaygroundDesignStore' }
  )
);
