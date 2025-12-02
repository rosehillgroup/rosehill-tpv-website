// TPV Studio - Sports Surface Designer State Management
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initialState = {
  // Surface configuration
  surface: {
    width_mm: 50000,
    length_mm: 50000,
    color: {
      tpv_code: 'RH12',
      hex: '#006C55',
      name: 'Dark Green'
    }
  },

  // Courts placed on the surface
  courts: {},  // { [courtId]: CourtObject }

  // Selected court for manipulation
  selectedCourtId: null,

  // Tracks placed on the surface
  tracks: {},  // { [trackId]: TrackObject }

  // Selected track for manipulation
  selectedTrackId: null,

  // Motifs (playground designs placed on canvas)
  motifs: {},  // { [motifId]: MotifObject }

  // Selected motif for manipulation
  selectedMotifId: null,

  // Unified element order for z-index (courts, tracks, and motifs combined)
  // Elements render bottom-to-top: first = bottom layer, last = top layer
  elementOrder: [], // ['track-123', 'court-456', 'court-789']

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

        // Helper: Convert TPV code to full color object (all 21 TPV colors)
        const getTPVColorObject = (tpvCode) => {
          const colorMap = {
            'RH01': { tpv_code: 'RH01', hex: '#A5362F', name: 'Standard Red' },
            'RH02': { tpv_code: 'RH02', hex: '#E21F2F', name: 'Bright Red' },
            'RH10': { tpv_code: 'RH10', hex: '#609B63', name: 'Standard Green' },
            'RH11': { tpv_code: 'RH11', hex: '#3BB44A', name: 'Bright Green' },
            'RH12': { tpv_code: 'RH12', hex: '#006C55', name: 'Dark Green' },
            'RH20': { tpv_code: 'RH20', hex: '#0075BC', name: 'Standard Blue' },
            'RH21': { tpv_code: 'RH21', hex: '#493D8C', name: 'Purple' },
            'RH22': { tpv_code: 'RH22', hex: '#47AFE3', name: 'Light Blue' },
            'RH23': { tpv_code: 'RH23', hex: '#039DC4', name: 'Azure' },
            'RH26': { tpv_code: 'RH26', hex: '#00A6A3', name: 'Turquoise' },
            'RH30': { tpv_code: 'RH30', hex: '#E4C4AA', name: 'Standard Beige' },
            'RH31': { tpv_code: 'RH31', hex: '#E8E3D8', name: 'Cream' },
            'RH32': { tpv_code: 'RH32', hex: '#8B5F3C', name: 'Brown' },
            'RH40': { tpv_code: 'RH40', hex: '#E5A144', name: 'Mustard Yellow' },
            'RH41': { tpv_code: 'RH41', hex: '#FFD833', name: 'Bright Yellow' },
            'RH50': { tpv_code: 'RH50', hex: '#F15B32', name: 'Orange' },
            'RH60': { tpv_code: 'RH60', hex: '#59595B', name: 'Dark Grey' },
            'RH61': { tpv_code: 'RH61', hex: '#939598', name: 'Light Grey' },
            'RH65': { tpv_code: 'RH65', hex: '#D9D9D6', name: 'Pale Grey' },
            'RH70': { tpv_code: 'RH70', hex: '#231F20', name: 'Black' },
            'RH90': { tpv_code: 'RH90', hex: '#E8457E', name: 'Funky Pink' }
          };
          return colorMap[tpvCode] || { tpv_code: 'RH31', hex: '#E8E3D8', name: 'Cream' };
        };

        // Apply default color to all markings
        const lineColorOverrides = {};
        if (template.defaultLineColor) {
          const defaultColor = getTPVColorObject(template.defaultLineColor);
          template.markings.forEach(marking => {
            lineColorOverrides[marking.id] = defaultColor;
          });
        }

        // Apply default color to all zones if they exist
        const zoneColorOverrides = {};
        if (template.defaultLineColor && template.zones) {
          const defaultColor = getTPVColorObject(template.defaultLineColor);
          template.zones.forEach(zone => {
            zoneColorOverrides[zone.id] = defaultColor;
          });
        }

        // Set court surface color from template default
        const courtSurfaceColor = template.defaultSurfaceColor
          ? getTPVColorObject(template.defaultSurfaceColor)
          : null; // null means use canvas surface color

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
          lineColorOverrides,
          zoneColorOverrides,
          courtSurfaceColor
        };

        set((state) => ({
          courts: {
            ...state.courts,
            [courtId]: court
          },
          elementOrder: [...state.elementOrder, courtId], // Add to top layer
          selectedCourtId: courtId,
          selectedTrackId: null // Deselect any track
        }));
        get().addToHistory();
      },

      removeCourt: (courtId) => {
        const { [courtId]: removed, ...remainingCourts } = get().courts;
        set((state) => ({
          courts: remainingCourts,
          elementOrder: state.elementOrder.filter(id => id !== courtId),
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
          elementOrder: [...state.elementOrder, newCourtId], // Add to top layer
          selectedCourtId: newCourtId,
          selectedTrackId: null
        }));
        get().addToHistory();
      },

      duplicateTrack: (trackId) => {
        const track = get().tracks[trackId];
        if (!track) return;

        const newTrackId = `track-${Date.now()}`;
        const newTrack = {
          ...track,
          id: newTrackId,
          position: {
            x: track.position.x + 500,
            y: track.position.y + 500
          }
        };

        set((state) => ({
          tracks: {
            ...state.tracks,
            [newTrackId]: newTrack
          },
          elementOrder: [...state.elementOrder, newTrackId],
          selectedTrackId: newTrackId,
          selectedCourtId: null
        }));
        get().addToHistory();
      },

      // ====== Rename Actions ======
      renameElement: (elementId, customName) => {
        if (elementId.startsWith('court-')) {
          set((state) => ({
            courts: {
              ...state.courts,
              [elementId]: {
                ...state.courts[elementId],
                customName
              }
            }
          }));
        } else if (elementId.startsWith('track-')) {
          set((state) => ({
            tracks: {
              ...state.tracks,
              [elementId]: {
                ...state.tracks[elementId],
                customName
              }
            }
          }));
        } else if (elementId.startsWith('motif-')) {
          set((state) => ({
            motifs: {
              ...state.motifs,
              [elementId]: {
                ...state.motifs[elementId],
                customName
              }
            }
          }));
        }
        get().addToHistory();
      },

      // ====== Lock Actions ======
      toggleElementLock: (elementId) => {
        if (elementId.startsWith('court-')) {
          set((state) => ({
            courts: {
              ...state.courts,
              [elementId]: {
                ...state.courts[elementId],
                locked: !state.courts[elementId]?.locked
              }
            }
          }));
        } else if (elementId.startsWith('track-')) {
          set((state) => ({
            tracks: {
              ...state.tracks,
              [elementId]: {
                ...state.tracks[elementId],
                locked: !state.tracks[elementId]?.locked
              }
            }
          }));
        } else if (elementId.startsWith('motif-')) {
          set((state) => ({
            motifs: {
              ...state.motifs,
              [elementId]: {
                ...state.motifs[elementId],
                locked: !state.motifs[elementId]?.locked
              }
            }
          }));
        }
        get().addToHistory();
      },

      // ====== Visibility Actions ======
      toggleElementVisibility: (elementId) => {
        if (elementId.startsWith('court-')) {
          set((state) => ({
            courts: {
              ...state.courts,
              [elementId]: {
                ...state.courts[elementId],
                visible: state.courts[elementId]?.visible === false ? true : false
              }
            }
          }));
        } else if (elementId.startsWith('track-')) {
          set((state) => ({
            tracks: {
              ...state.tracks,
              [elementId]: {
                ...state.tracks[elementId],
                visible: state.tracks[elementId]?.visible === false ? true : false
              }
            }
          }));
        } else if (elementId.startsWith('motif-')) {
          set((state) => ({
            motifs: {
              ...state.motifs,
              [elementId]: {
                ...state.motifs[elementId],
                visible: state.motifs[elementId]?.visible === false ? true : false
              }
            }
          }));
        }
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

      setCourtSurfaceColor: (courtId, color) => {
        set((state) => ({
          courts: {
            ...state.courts,
            [courtId]: {
              ...state.courts[courtId],
              courtSurfaceColor: color
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
          set({ selectedCourtId: courtId, selectedTrackId: null, showPropertiesPanel: true });
        } else {
          set({ selectedCourtId: courtId, selectedTrackId: null });
        }
      },

      deselectCourt: () => {
        // Clicking grid to deselect indicates user wants panel closed
        set({
          selectedCourtId: null,
          showPropertiesPanel: false,
          propertiesPanelUserClosed: true
        });
      },

      // ====== Layer Order Actions ======
      setElementOrder: (newOrder) => {
        set({ elementOrder: newOrder });
        // Note: History is added by caller to avoid double entries
      },

      moveElementUp: (elementId) => {
        const { elementOrder } = get();
        const currentIndex = elementOrder.indexOf(elementId);
        if (currentIndex < elementOrder.length - 1) {
          const newOrder = [...elementOrder];
          [newOrder[currentIndex], newOrder[currentIndex + 1]] =
            [newOrder[currentIndex + 1], newOrder[currentIndex]];
          set({ elementOrder: newOrder });
          get().addToHistory();
        }
      },

      moveElementDown: (elementId) => {
        const { elementOrder } = get();
        const currentIndex = elementOrder.indexOf(elementId);
        if (currentIndex > 0) {
          const newOrder = [...elementOrder];
          [newOrder[currentIndex], newOrder[currentIndex - 1]] =
            [newOrder[currentIndex - 1], newOrder[currentIndex]];
          set({ elementOrder: newOrder });
          get().addToHistory();
        }
      },

      bringToFront: (elementId) => {
        const { elementOrder } = get();
        const newOrder = elementOrder.filter(id => id !== elementId);
        newOrder.push(elementId);
        set({ elementOrder: newOrder });
        get().addToHistory();
      },

      sendToBack: (elementId) => {
        const { elementOrder } = get();
        const newOrder = elementOrder.filter(id => id !== elementId);
        newOrder.unshift(elementId);
        set({ elementOrder: newOrder });
        get().addToHistory();
      },

      // ====== Track Actions ======
      addTrack: (templateId, template) => {
        const trackId = `track-${Date.now()}`;
        const surface = get().surface;

        const canvasWidth = surface.width_mm;
        const canvasLength = surface.length_mm;

        // Helper: Convert TPV code to full color object
        const getTPVColorObject = (tpvCode) => {
          const colorMap = {
            'RH01': { tpv_code: 'RH01', hex: '#A5362F', name: 'Standard Red' },
            'RH31': { tpv_code: 'RH31', hex: '#E8E3D8', name: 'Cream' },
            'RH30': { tpv_code: 'RH30', hex: '#E4C4AA', name: 'Standard Beige' },
            'RH20': { tpv_code: 'RH20', hex: '#0075BC', name: 'Standard Blue' },
            'RH12': { tpv_code: 'RH12', hex: '#006C55', name: 'Dark Green' }
          };
          return colorMap[tpvCode] || { tpv_code: tpvCode, hex: '#A5362F', name: 'Standard Red' };
        };

        // Set default track surface color
        const trackSurfaceColor = template.defaultTrackSurfaceColor
          ? getTPVColorObject(template.defaultTrackSurfaceColor)
          : getTPVColorObject('RH01');

        // Detect if this is a straight track
        const isStraightTrack = template.trackType === 'straight';

        let trackParameters;
        let trackPosition;
        let trackRotation;

        // Default starting boxes configuration
        const defaultStartingBoxes = {
          enabled: false,
          depth_mm: 500,
          style: 'staggered',           // 'straight' | 'staggered' | 'both'
          direction: 'counterclockwise', // 'clockwise' | 'counterclockwise'
          startPosition: 0              // 0-100% position around track (curved tracks only)
        };

        if (isStraightTrack) {
          // STRAIGHT TRACK: Fixed lane width, scale length to fit, horizontal orientation
          const numLanes = template.parameters.numLanes;
          const laneWidth = template.parameters.laneWidth_mm; // Fixed at 1220mm
          const actualTrackWidth = numLanes * laneWidth; // Actual width based on lanes

          // Scale track length to fit canvas (use longer dimension, with padding)
          const maxAvailableLength = Math.max(canvasWidth, canvasLength) * 0.9;
          const templateLength = template.parameters.height_mm || 100000;
          const trackLength = Math.min(templateLength, maxAvailableLength);

          trackParameters = {
            ...template.parameters,
            width_mm: actualTrackWidth,  // Fixed: numLanes × laneWidth
            height_mm: trackLength,       // Scaled to fit
            cornerRadius: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
            laneWidth_mm: laneWidth,
            startingBoxes: { ...defaultStartingBoxes, ...template.parameters.startingBoxes }
          };

          // Default to horizontal orientation (90° rotation)
          trackRotation = 90;

          // Position: center the track on canvas
          // The rotation happens around the track's center, so we position based on
          // the original (unrotated) dimensions to place the center at canvas center
          trackPosition = {
            x: canvasWidth / 2 - (actualTrackWidth / 2),
            y: canvasLength / 2 - (trackLength / 2)
          };
        } else {
          // CURVED TRACK: Scale proportionally to fill canvas
          const trackWidth = canvasWidth * 0.9;
          const trackHeight = canvasLength * 0.9;

          // Calculate scaling factor for corner radius
          const templateWidth = template.parameters.width_mm || 25000;
          const templateHeight = template.parameters.height_mm || 15000;
          const widthScale = trackWidth / templateWidth;
          const heightScale = trackHeight / templateHeight;
          const scale = Math.min(widthScale, heightScale);

          // Scale corner radii proportionally
          const templateCorners = template.parameters.cornerRadius || {
            topLeft: 3000, topRight: 3000, bottomLeft: 3000, bottomRight: 3000
          };

          const scaledCorners = {
            topLeft: templateCorners.topLeft * scale,
            topRight: templateCorners.topRight * scale,
            bottomLeft: templateCorners.bottomLeft * scale,
            bottomRight: templateCorners.bottomRight * scale
          };

          trackParameters = {
            ...template.parameters,
            width_mm: trackWidth,
            height_mm: trackHeight,
            cornerRadius: scaledCorners,
            laneWidth_mm: template.parameters.laneWidth_mm,
            startingBoxes: { ...defaultStartingBoxes, ...template.parameters.startingBoxes }
          };

          trackRotation = 0;
          trackPosition = {
            x: canvasWidth / 2 - (trackWidth / 2),
            y: canvasLength / 2 - (trackHeight / 2)
          };
        }

        const track = {
          id: trackId,
          templateId,
          template,
          position: trackPosition,
          rotation: trackRotation,
          parameters: trackParameters,
          trackSurfaceColor
        };

        set((state) => ({
          tracks: {
            ...state.tracks,
            [trackId]: track
          },
          elementOrder: [...state.elementOrder, trackId], // Add to top layer
          selectedTrackId: trackId,
          selectedCourtId: null // Deselect any court
        }));
        get().addToHistory();
      },

      removeTrack: (trackId) => {
        const { [trackId]: removed, ...remainingTracks } = get().tracks;
        set((state) => ({
          tracks: remainingTracks,
          elementOrder: state.elementOrder.filter(id => id !== trackId),
          selectedTrackId: state.selectedTrackId === trackId ? null : state.selectedTrackId
        }));
        get().addToHistory();
      },

      updateTrackParameters: (trackId, newParams) => {
        set((state) => {
          const track = state.tracks[trackId];
          if (!track) return state;

          const oldParams = track.parameters;
          const updatedParams = { ...oldParams, ...newParams };

          // For straight tracks, keep the track centered when lanes change
          const isStraightTrack = track.template?.trackType === 'straight';
          let newPosition = track.position;

          if (isStraightTrack && newParams.numLanes !== undefined && newParams.numLanes !== oldParams.numLanes) {
            // Calculate old and new track widths
            const laneWidth = oldParams.laneWidth_mm;
            const oldTrackWidth = oldParams.numLanes * laneWidth;
            const newTrackWidth = newParams.numLanes * laneWidth;

            // Also update width_mm to match new lane count
            updatedParams.width_mm = newTrackWidth;

            // Calculate the center of the track (in canvas coordinates)
            // For rotated tracks, the center is at position + (width/2, height/2)
            const oldCenterX = track.position.x + oldTrackWidth / 2;
            const oldCenterY = track.position.y + oldParams.height_mm / 2;

            // Keep the center in the same place with new dimensions
            newPosition = {
              x: oldCenterX - newTrackWidth / 2,
              y: oldCenterY - updatedParams.height_mm / 2
            };
          }

          return {
            tracks: {
              ...state.tracks,
              [trackId]: {
                ...track,
                parameters: updatedParams,
                position: newPosition
              }
            }
          };
        });
        get().addToHistory();
      },

      updateTrackPosition: (trackId, position) => {
        set((state) => ({
          tracks: {
            ...state.tracks,
            [trackId]: {
              ...state.tracks[trackId],
              position
            }
          }
        }));
        // Don't add to history for every drag movement
      },

      updateTrackRotation: (trackId, rotation) => {
        set((state) => ({
          tracks: {
            ...state.tracks,
            [trackId]: {
              ...state.tracks[trackId],
              rotation
            }
          }
        }));
        // Don't add to history for every drag movement
      },

      setTrackSurfaceColor: (trackId, color) => {
        set((state) => ({
          tracks: {
            ...state.tracks,
            [trackId]: {
              ...state.tracks[trackId],
              trackSurfaceColor: color
            }
          }
        }));
        get().addToHistory();
      },

      selectTrack: (trackId) => {
        const { propertiesPanelUserClosed } = get();
        if (!propertiesPanelUserClosed) {
          set({ selectedTrackId: trackId, selectedCourtId: null, showPropertiesPanel: true });
        } else {
          set({ selectedTrackId: trackId, selectedCourtId: null });
        }
      },

      deselectTrack: () => {
        set({
          selectedTrackId: null,
          showPropertiesPanel: false,
          propertiesPanelUserClosed: true
        });
      },

      // ====== Motif Actions ======
      addMotif: (sourceDesignId, sourceDesignName, svgContent, originalWidth_mm, originalHeight_mm, thumbnailUrl = null, motifData = {}) => {
        const motifId = `motif-${Date.now()}`;
        const surface = get().surface;

        // Center the motif on the canvas
        const motif = {
          id: motifId,
          type: 'motif',
          sourceDesignId,
          sourceDesignName,
          sourceThumbnailUrl: thumbnailUrl,
          // Store both solid and blend versions if available
          solidSvgContent: motifData.solidSvgContent || svgContent,
          blendSvgContent: motifData.blendSvgContent || null,
          hasBothVersions: motifData.hasBothVersions || false,
          // Current view mode - defaults to 'solid'
          viewMode: 'solid',
          // Active SVG content (based on viewMode)
          svgContent: motifData.solidSvgContent || svgContent,
          originalWidth_mm,
          originalHeight_mm,
          position: {
            x: surface.width_mm / 2 - originalWidth_mm / 2,
            y: surface.length_mm / 2 - originalHeight_mm / 2
          },
          rotation: 0,
          scale: 1.0
        };

        set((state) => ({
          motifs: {
            ...state.motifs,
            [motifId]: motif
          },
          elementOrder: [...state.elementOrder, motifId],
          selectedMotifId: motifId,
          selectedCourtId: null,
          selectedTrackId: null
        }));
        get().addToHistory();
      },

      removeMotif: (motifId) => {
        const { [motifId]: removed, ...remainingMotifs } = get().motifs;
        set((state) => ({
          motifs: remainingMotifs,
          elementOrder: state.elementOrder.filter(id => id !== motifId),
          selectedMotifId: state.selectedMotifId === motifId ? null : state.selectedMotifId
        }));
        get().addToHistory();
      },

      updateMotifPosition: (motifId, position) => {
        set((state) => ({
          motifs: {
            ...state.motifs,
            [motifId]: {
              ...state.motifs[motifId],
              position
            }
          }
        }));
        // Don't add to history for every drag movement
      },

      updateMotifRotation: (motifId, rotation) => {
        set((state) => ({
          motifs: {
            ...state.motifs,
            [motifId]: {
              ...state.motifs[motifId],
              rotation
            }
          }
        }));
      },

      updateMotifScale: (motifId, scale) => {
        set((state) => ({
          motifs: {
            ...state.motifs,
            [motifId]: {
              ...state.motifs[motifId],
              scale
            }
          }
        }));
      },

      setMotifViewMode: (motifId, viewMode) => {
        const motif = get().motifs[motifId];
        if (!motif) return;

        // Determine which SVG content to use
        const newSvgContent = viewMode === 'blend'
          ? (motif.blendSvgContent || motif.solidSvgContent)
          : (motif.solidSvgContent || motif.blendSvgContent);

        set((state) => ({
          motifs: {
            ...state.motifs,
            [motifId]: {
              ...state.motifs[motifId],
              viewMode,
              svgContent: newSvgContent
            }
          }
        }));
        get().addToHistory();
      },

      duplicateMotif: (motifId) => {
        const motif = get().motifs[motifId];
        if (!motif) return;

        const newMotifId = `motif-${Date.now()}`;
        const newMotif = {
          ...motif,
          id: newMotifId,
          position: {
            x: motif.position.x + 500,
            y: motif.position.y + 500
          }
        };

        set((state) => ({
          motifs: {
            ...state.motifs,
            [newMotifId]: newMotif
          },
          elementOrder: [...state.elementOrder, newMotifId],
          selectedMotifId: newMotifId,
          selectedCourtId: null,
          selectedTrackId: null
        }));
        get().addToHistory();
      },

      // Refresh motif SVG from source design (after editing in playground designer)
      refreshMotif: async (motifId) => {
        const motif = get().motifs[motifId];
        if (!motif) return { success: false, error: 'Motif not found' };

        try {
          // Dynamic import to avoid circular dependency
          const { fetchMotifFromDesign } = await import('../lib/sports/motifUtils.js');
          const refreshedData = await fetchMotifFromDesign(motif.sourceDesignId);

          set((state) => ({
            motifs: {
              ...state.motifs,
              [motifId]: {
                ...state.motifs[motifId],
                svgContent: refreshedData.svgContent,
                sourceThumbnailUrl: refreshedData.sourceThumbnailUrl,
                sourceDesignName: refreshedData.sourceDesignName,
                // Update dimensions if they changed
                originalWidth_mm: refreshedData.originalWidth_mm,
                originalHeight_mm: refreshedData.originalHeight_mm
              }
            },
            lastModified: Date.now()
          }));

          get().addToHistory();
          return { success: true };
        } catch (error) {
          console.error('[MOTIF] Failed to refresh:', error);
          return { success: false, error: error.message };
        }
      },

      selectMotif: (motifId) => {
        const { propertiesPanelUserClosed } = get();
        if (!propertiesPanelUserClosed) {
          set({ selectedMotifId: motifId, selectedCourtId: null, selectedTrackId: null, showPropertiesPanel: true });
        } else {
          set({ selectedMotifId: motifId, selectedCourtId: null, selectedTrackId: null });
        }
      },

      deselectMotif: () => {
        set({
          selectedMotifId: null,
          showPropertiesPanel: false,
          propertiesPanelUserClosed: true
        });
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
          tracks: currentState.tracks,
          motifs: currentState.motifs,
          elementOrder: currentState.elementOrder,
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
        // Migration: Handle old format with separate courtOrder/trackOrder
        let elementOrder = designData.elementOrder;
        if (!elementOrder && (designData.courtOrder || designData.trackOrder)) {
          // Merge old arrays: tracks first (bottom), then courts (top)
          elementOrder = [
            ...(designData.trackOrder || []),
            ...(designData.courtOrder || [])
          ];
        }

        set({
          surface: designData.surface || initialState.surface,
          courts: designData.courts || {},
          tracks: designData.tracks || {},
          motifs: designData.motifs || {},
          elementOrder: elementOrder || [],
          customMarkings: designData.customMarkings || [],
          backgroundZones: designData.backgroundZones || [],
          designName: designData.name || 'Untitled Sports Surface',
          designDescription: designData.description || '',
          designTags: designData.tags || [],
          selectedCourtId: null,
          selectedTrackId: null,
          selectedMotifId: null,
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
          tracks: state.tracks,
          motifs: state.motifs,
          elementOrder: state.elementOrder,
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
      },

      // Check if there are unsaved changes (any courts, tracks, motifs, or modifications)
      hasUnsavedChanges: () => {
        const state = get();
        // Has changes if any courts, tracks, or motifs have been added
        return Object.keys(state.courts).length > 0 ||
               Object.keys(state.tracks).length > 0 ||
               Object.keys(state.motifs).length > 0;
      }
    }),
    { name: 'SportsDesignStore' }
  )
);
