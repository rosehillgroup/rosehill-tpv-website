// TPV Studio - Sports Surface Designer State Management
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initialState = {
  // Surface configuration
  surface: {
    width_mm: 28000,
    length_mm: 15000,
    color: {
      tpv_code: 'RH12',
      hex: '#006C55',
      name: 'Dark Green'
    }
  },

  // Courts placed on the surface
  courts: {},  // { [courtId]: CourtObject }
  courtOrder: [], // Array of court IDs for z-order

  // Selected court for manipulation
  selectedCourtId: null,

  // Custom markings not part of standard courts
  customMarkings: [],

  // Background zones (colored areas)
  backgroundZones: [],

  // Design metadata
  designName: 'Untitled Sports Surface',
  designDescription: '',
  designTags: [],

  // History for undo/redo
  history: [],
  historyIndex: -1,
  maxHistory: 50,

  // UI state
  showCourtLibrary: true,
  showPropertiesPanel: true,
  propertiesPanelUserClosed: false, // Track if user manually closed the panel
  showColorEditor: false,
  snapToGrid: true,
  gridSize_mm: 100,

  // Export state
  isSaving: false,
  lastSaved: null
};

export const useSportsDesignStore = create(
  devtools(
    (set, get) => ({
      ...initialState,

      // ====== Surface Actions ======
      setSurfaceDimensions: (width_mm, length_mm) => {
        set((state) => ({
          surface: {
            ...state.surface,
            width_mm,
            length_mm
          }
        }));
        get().addToHistory();
      },

      setSurfaceColor: (color) => {
        set((state) => ({
          surface: {
            ...state.surface,
            color
          }
        }));
        get().addToHistory();
      },

      // ====== Court Actions ======
      addCourt: (templateId, template) => {
        const courtId = `court-${Date.now()}`;
        const court = {
          id: courtId,
          templateId,
          template,
          position: {
            x: get().surface.width_mm / 2 - template.dimensions.width_mm / 2,
            y: get().surface.length_mm / 2 - template.dimensions.length_mm / 2
          },
          rotation: 0,
          scale: 1.0,
          lineColorOverrides: {}, // { markingId: { tpv_code, hex, name } }
          zoneColorOverrides: {}   // { zoneId: { tpv_code, hex, name } }
        };

        set((state) => ({
          courts: {
            ...state.courts,
            [courtId]: court
          },
          courtOrder: [...state.courtOrder, courtId],
          selectedCourtId: courtId
        }));
        get().addToHistory();
      },

      removeCourt: (courtId) => {
        const { [courtId]: removed, ...remainingCourts } = get().courts;
        set((state) => ({
          courts: remainingCourts,
          courtOrder: state.courtOrder.filter(id => id !== courtId),
          selectedCourtId: state.selectedCourtId === courtId ? null : state.selectedCourtId
        }));
        get().addToHistory();
      },

      updateCourtPosition: (courtId, position) => {
        set((state) => ({
          courts: {
            ...state.courts,
            [courtId]: {
              ...state.courts[courtId],
              position
            }
          }
        }));
        // Don't add to history for every drag movement
      },

      updateCourtRotation: (courtId, rotation) => {
        set((state) => ({
          courts: {
            ...state.courts,
            [courtId]: {
              ...state.courts[courtId],
              rotation
            }
          }
        }));
      },

      updateCourtScale: (courtId, scale) => {
        set((state) => ({
          courts: {
            ...state.courts,
            [courtId]: {
              ...state.courts[courtId],
              scale
            }
          }
        }));
      },

      duplicateCourt: (courtId) => {
        const court = get().courts[courtId];
        if (!court) return;

        const newCourtId = `court-${Date.now()}`;
        const newCourt = {
          ...court,
          id: newCourtId,
          position: {
            x: court.position.x + 500,
            y: court.position.y + 500
          }
        };

        set((state) => ({
          courts: {
            ...state.courts,
            [newCourtId]: newCourt
          },
          courtOrder: [...state.courtOrder, newCourtId],
          selectedCourtId: newCourtId
        }));
        get().addToHistory();
      },

      // ====== Color Assignment Actions ======
      setLineColor: (courtId, markingId, color) => {
        set((state) => ({
          courts: {
            ...state.courts,
            [courtId]: {
              ...state.courts[courtId],
              lineColorOverrides: {
                ...state.courts[courtId].lineColorOverrides,
                [markingId]: color
              }
            }
          }
        }));
        get().addToHistory();
      },

      setZoneColor: (courtId, zoneId, color) => {
        set((state) => ({
          courts: {
            ...state.courts,
            [courtId]: {
              ...state.courts[courtId],
              zoneColorOverrides: {
                ...state.courts[courtId].zoneColorOverrides,
                [zoneId]: color
              }
            }
          }
        }));
        get().addToHistory();
      },

      resetCourtColors: (courtId) => {
        set((state) => ({
          courts: {
            ...state.courts,
            [courtId]: {
              ...state.courts[courtId],
              lineColorOverrides: {},
              zoneColorOverrides: {}
            }
          }
        }));
        get().addToHistory();
      },

      // ====== Selection Actions ======
      selectCourt: (courtId) => {
        const { propertiesPanelUserClosed } = get();
        // Only auto-open properties panel if user hasn't manually closed it
        if (!propertiesPanelUserClosed) {
          set({ selectedCourtId: courtId, showPropertiesPanel: true });
        } else {
          set({ selectedCourtId: courtId });
        }
      },

      deselectCourt: () => {
        // Just deselect and close panel
        // Don't set propertiesPanelUserClosed flag here
        // That flag should only be set via togglePropertiesPanel()
        set({
          selectedCourtId: null,
          showPropertiesPanel: false
        });
      },

      // ====== Layer Order Actions ======
      setCourtOrder: (newOrder) => {
        set({ courtOrder: newOrder });
        // Note: History is added by caller (keyboard shortcut) to avoid double entries
      },

      // ====== Custom Markings Actions ======
      addCustomMarking: (marking) => {
        set((state) => ({
          customMarkings: [...state.customMarkings, { ...marking, id: `custom-${Date.now()}` }]
        }));
        get().addToHistory();
      },

      removeCustomMarking: (markingId) => {
        set((state) => ({
          customMarkings: state.customMarkings.filter(m => m.id !== markingId)
        }));
        get().addToHistory();
      },

      // ====== Background Zones Actions ======
      addBackgroundZone: (zone) => {
        set((state) => ({
          backgroundZones: [...state.backgroundZones, { ...zone, id: `zone-${Date.now()}` }]
        }));
        get().addToHistory();
      },

      removeBackgroundZone: (zoneId) => {
        set((state) => ({
          backgroundZones: state.backgroundZones.filter(z => z.id !== zoneId)
        }));
        get().addToHistory();
      },

      // ====== Design Metadata Actions ======
      setDesignName: (name) => {
        set({ designName: name });
      },

      setDesignDescription: (description) => {
        set({ designDescription: description });
      },

      setDesignTags: (tags) => {
        set({ designTags: tags });
      },

      // ====== History Actions (Undo/Redo) ======
      addToHistory: () => {
        const currentState = get();
        const snapshot = {
          surface: currentState.surface,
          courts: currentState.courts,
          courtOrder: currentState.courtOrder,
          customMarkings: currentState.customMarkings,
          backgroundZones: currentState.backgroundZones
        };

        set((state) => {
          // If we're not at the end of history, truncate future states
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(snapshot);

          // Limit history size
          if (newHistory.length > state.maxHistory) {
            newHistory.shift();
          }

          return {
            history: newHistory,
            historyIndex: newHistory.length - 1
          };
        });
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const previousState = history[historyIndex - 1];
          set({
            ...previousState,
            historyIndex: historyIndex - 1
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const nextState = history[historyIndex + 1];
          set({
            ...nextState,
            historyIndex: historyIndex + 1
          });
        }
      },

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      // ====== UI State Actions ======
      toggleCourtLibrary: () => {
        set((state) => ({ showCourtLibrary: !state.showCourtLibrary }));
      },

      togglePropertiesPanel: () => {
        set((state) => ({
          showPropertiesPanel: !state.showPropertiesPanel,
          // Track if user is closing it manually
          propertiesPanelUserClosed: state.showPropertiesPanel ? true : false
        }));
      },

      toggleColorEditor: () => {
        set((state) => ({ showColorEditor: !state.showColorEditor }));
      },

      toggleSnapToGrid: () => {
        set((state) => ({ snapToGrid: !state.snapToGrid }));
      },

      setGridSize: (gridSize_mm) => {
        set({ gridSize_mm });
      },

      // ====== Save/Load Actions ======
      setSaving: (isSaving) => {
        set({ isSaving });
      },

      setLastSaved: (timestamp) => {
        set({ lastSaved: timestamp });
      },

      // Load a saved design
      loadDesign: (designData) => {
        set({
          surface: designData.surface || initialState.surface,
          courts: designData.courts || {},
          courtOrder: designData.courtOrder || [],
          customMarkings: designData.customMarkings || [],
          backgroundZones: designData.backgroundZones || [],
          designName: designData.name || 'Untitled Sports Surface',
          designDescription: designData.description || '',
          designTags: designData.tags || [],
          selectedCourtId: null,
          history: [],
          historyIndex: -1
        });
        get().addToHistory();
      },

      // Export current design state
      exportDesignData: () => {
        const state = get();
        return {
          surface: state.surface,
          courts: state.courts,
          courtOrder: state.courtOrder,
          customMarkings: state.customMarkings,
          backgroundZones: state.backgroundZones,
          name: state.designName,
          description: state.designDescription,
          tags: state.designTags
        };
      },

      // Reset to initial state
      resetDesign: () => {
        set(initialState);
      }
    }),
    { name: 'SportsDesignStore' }
  )
);
