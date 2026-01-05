// TPV Studio - Court Canvas Component
import React, { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { generateCourtSVG } from '../../lib/sports/courtTemplates.js';
import { snapPositionToGrid, constrainPosition, getCourtTransformString } from '../../lib/sports/geometryUtils.js';
import TransformHandles from './TransformHandles.jsx';
import TrackElement from './TrackRenderer.jsx';
import MotifElement from './MotifElement.jsx';
import ShapeElement from './ShapeElement.jsx';
import BlobElement from './BlobElement.jsx';
import PathElement from './PathElement.jsx';
import TextElement from './TextElement.jsx';
import ExclusionZoneElement from './ExclusionZoneElement.jsx';
import GroupElement from './GroupElement.jsx';
import { measureText } from '../../lib/sports/textUtils.js';
import { generateSurfaceBoundaryPath } from '../../lib/sports/surfaceGeometry.js';
import './CourtCanvas.css';

const CourtCanvas = forwardRef(function CourtCanvas(props, ref) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Expose the SVG ref to parent
  useImperativeHandle(ref, () => canvasRef.current);

  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [spaceHeld, setSpaceHeld] = useState(false);

  // Touch gesture state
  const [touchState, setTouchState] = useState({
    active: false,
    initialDistance: 0,
    initialZoom: 1,
    initialPan: { x: 0, y: 0 },
    initialCenter: { x: 0, y: 0 }
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragCourtId, setDragCourtId] = useState(null);
  const [dragTrackId, setDragTrackId] = useState(null);
  const [dragMotifId, setDragMotifId] = useState(null);
  const [dragShapeId, setDragShapeId] = useState(null);
  const [dragTextId, setDragTextId] = useState(null);
  const [dragExclusionZoneId, setDragExclusionZoneId] = useState(null);
  const [dragGroupId, setDragGroupId] = useState(null);

  // Motif scaling state
  const [isScaling, setIsScaling] = useState(false);
  const [scaleMotifId, setScaleMotifId] = useState(null);
  const [scaleStart, setScaleStart] = useState(null); // { mousePos, originalScale, corner, motifCenter }

  // Motif rotation state
  const [isRotating, setIsRotating] = useState(false);
  const [rotateMotifId, setRotateMotifId] = useState(null);
  const [rotateStart, setRotateStart] = useState(null); // { mouseAngle, originalRotation, motifCenter }

  // Shape scaling state
  const [isScalingShape, setIsScalingShape] = useState(false);
  const [scaleShapeId, setScaleShapeId] = useState(null);
  const [scaleShapeStart, setScaleShapeStart] = useState(null);

  // Shape rotation state
  const [isRotatingShape, setIsRotatingShape] = useState(false);
  const [rotateShapeId, setRotateShapeId] = useState(null);
  const [rotateShapeStart, setRotateShapeStart] = useState(null);

  // Text scaling state (font size)
  const [isScalingText, setIsScalingText] = useState(false);
  const [scaleTextId, setScaleTextId] = useState(null);
  const [scaleTextStart, setScaleTextStart] = useState(null);

  // Text rotation state
  const [isRotatingText, setIsRotatingText] = useState(false);
  const [rotateTextId, setRotateTextId] = useState(null);
  const [rotateTextStart, setRotateTextStart] = useState(null);

  // Exclusion zone scaling state
  const [isScalingExclusionZone, setIsScalingExclusionZone] = useState(false);
  const [scaleExclusionZoneId, setScaleExclusionZoneId] = useState(null);
  const [scaleExclusionZoneStart, setScaleExclusionZoneStart] = useState(null);

  // Exclusion zone rotation state
  const [isRotatingExclusionZone, setIsRotatingExclusionZone] = useState(false);
  const [rotateExclusionZoneId, setRotateExclusionZoneId] = useState(null);
  const [rotateExclusionZoneStart, setRotateExclusionZoneStart] = useState(null);

  // Group scaling state
  const [isScalingGroup, setIsScalingGroup] = useState(false);
  const [scaleGroupId, setScaleGroupId] = useState(null);
  const [scaleGroupStart, setScaleGroupStart] = useState(null);

  // Group rotation state
  const [isRotatingGroup, setIsRotatingGroup] = useState(false);
  const [rotateGroupId, setRotateGroupId] = useState(null);
  const [rotateGroupStart, setRotateGroupStart] = useState(null);

  // Path drawing state (for preview line)
  const [drawingMousePos, setDrawingMousePos] = useState(null);
  // For double-click detection (manual timing since preventDefault breaks native)
  const [lastClickTime, setLastClickTime] = useState(0);
  // For point selection (to enable Delete key)
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);

  const {
    surface,
    courts,
    tracks,
    motifs,
    shapes,
    texts,
    exclusionZones,
    elementOrder,
    selectedCourtId,
    selectedTrackId,
    selectedMotifId,
    selectedShapeId,
    selectedTextId,
    selectedExclusionZoneId,
    snapToGrid,
    gridSize_mm,
    selectCourt,
    deselectCourt,
    selectTrack,
    deselectTrack,
    selectMotif,
    deselectMotif,
    selectShape,
    deselectShape,
    selectText,
    deselectText,
    selectExclusionZone,
    deselectExclusionZone,
    updateCourtPosition,
    updateTrackPosition,
    updateMotifPosition,
    updateMotifScale,
    updateMotifRotation,
    updateShapePosition,
    updateShapeDimensions,
    updateShapeRotation,
    updateTextPosition,
    updateTextScale,
    updateTextRotation,
    showPropertiesPanel,
    setShowPropertiesPanel,
    updateExclusionZonePosition,
    updateExclusionZoneDimensions,
    updateExclusionZoneRotation,
    updateBlobControlPoint,
    updateBlobHandle,
    commitBlobEdit,
    // Path drawing mode
    pathDrawingMode,
    activePathId,
    addPointToPath,
    finishPath,
    cancelPath,
    updatePathControlPoint,
    updatePathHandle,
    commitPathEdit,
    removePointFromPath,
    // Group and multi-selection
    groups,
    selectedGroupId,
    selectedElementIds,
    editingGroupId,
    selectGroup,
    deselectGroup,
    enterGroup,
    exitGroup,
    addToSelection,
    clearMultiSelection,
    updateGroupPosition,
    updateGroupScale,
    updateGroupRotation,
    commitGroupMove
  } = useSportsDesignStore();

  // Convert screen coordinates to SVG coordinates
  // Uses useCallback to ensure stable reference for useEffect dependencies
  const screenToSVG = useCallback((screenX, screenY) => {
    const svg = canvasRef.current;
    // Guard against null ref during unmount or before mount
    if (!svg || !svg.getScreenCTM()) {
      return { x: 0, y: 0 };
    }
    const pt = svg.createSVGPoint();
    pt.x = screenX;
    pt.y = screenY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgP = pt.matrixTransform(ctm.inverse());
    return { x: svgP.x, y: svgP.y };
  }, []); // Empty deps since it only uses refs

  // Handle mouse/touch down on court (start drag)
  const handleCourtMouseDown = (e, courtId) => {
    e.stopPropagation();

    // Check if Shift is held for multi-selection
    const isShiftHeld = e.shiftKey;

    if (isShiftHeld) {
      // Multi-select mode: add/remove from selection
      addToSelection(courtId);
      // Don't start drag when multi-selecting
      return;
    }

    // Single selection mode
    // Clear any multi-selection first
    if (selectedElementIds.length > 0) {
      clearMultiSelection();
    }
    selectCourt(courtId);

    const court = courts[courtId];
    // Don't allow dragging locked courts
    if (court?.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);

    setDragStart({
      x: svgPoint.x - court.position.x,
      y: svgPoint.y - court.position.y
    });
    setDragCourtId(courtId);
    setIsDragging(true);
  };

  // Handle double-click on court (open properties panel)
  const handleCourtDoubleClick = (e, courtId) => {
    e.stopPropagation();

    selectCourt(courtId);

    // Open properties panel by resetting the user closed flag
    useSportsDesignStore.setState({
      showPropertiesPanel: true,
      propertiesPanelUserClosed: false
    });
  };

  // Handle mouse/touch down on track (start drag)
  const handleTrackMouseDown = (e, trackId) => {
    e.stopPropagation();

    // Check if Shift is held for multi-selection
    const isShiftHeld = e.shiftKey;

    if (isShiftHeld) {
      // Multi-select mode: add/remove from selection
      addToSelection(trackId);
      // Don't start drag when multi-selecting
      return;
    }

    // Single selection mode
    // Clear any multi-selection first
    if (selectedElementIds.length > 0) {
      clearMultiSelection();
    }
    selectTrack(trackId);

    const track = tracks[trackId];
    // Don't allow dragging locked tracks
    if (track?.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);

    setDragStart({
      x: svgPoint.x - track.position.x,
      y: svgPoint.y - track.position.y
    });
    setDragTrackId(trackId);
    setIsDragging(true);
  };

  // Handle double-click on track (open properties panel)
  const handleTrackDoubleClick = (e, trackId) => {
    e.stopPropagation();

    selectTrack(trackId);

    useSportsDesignStore.setState({
      showPropertiesPanel: true,
      propertiesPanelUserClosed: false
    });
  };

  // Handle mouse/touch down on motif (start drag)
  const handleMotifMouseDown = (e, motifId) => {
    e.stopPropagation();

    // Check if Shift is held for multi-selection
    const isShiftHeld = e.shiftKey;

    if (isShiftHeld) {
      // Multi-select mode: add/remove from selection
      addToSelection(motifId);
      // Don't start drag when multi-selecting
      return;
    }

    // Single selection mode
    // Clear any multi-selection first
    if (selectedElementIds.length > 0) {
      clearMultiSelection();
    }
    selectMotif(motifId);

    const motif = motifs[motifId];
    // Don't allow dragging locked motifs
    if (motif?.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);

    setDragStart({
      x: svgPoint.x - motif.position.x,
      y: svgPoint.y - motif.position.y
    });
    setDragMotifId(motifId);
    setIsDragging(true);
  };

  // Handle double-click on motif (open properties panel)
  const handleMotifDoubleClick = (e, motifId) => {
    e.stopPropagation();

    selectMotif(motifId);

    useSportsDesignStore.setState({
      showPropertiesPanel: true,
      propertiesPanelUserClosed: false
    });
  };

  // Handle scale start on motif corner handle
  const handleMotifScaleStart = (e, motifId, corner) => {
    e.stopPropagation();

    const motif = motifs[motifId];
    if (!motif || motif.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);
    const scaledWidth = motif.originalWidth_mm * (motif.scale || 1);
    const scaledHeight = motif.originalHeight_mm * (motif.scale || 1);

    // Calculate the anchor point (opposite corner that should stay fixed)
    // nw = top-left, ne = top-right, sw = bottom-left, se = bottom-right
    let anchorPoint;
    switch (corner) {
      case 'nw': // Dragging top-left, anchor bottom-right
        anchorPoint = { x: motif.position.x + scaledWidth, y: motif.position.y + scaledHeight };
        break;
      case 'ne': // Dragging top-right, anchor bottom-left
        anchorPoint = { x: motif.position.x, y: motif.position.y + scaledHeight };
        break;
      case 'sw': // Dragging bottom-left, anchor top-right
        anchorPoint = { x: motif.position.x + scaledWidth, y: motif.position.y };
        break;
      case 'se': // Dragging bottom-right, anchor top-left
      default:
        anchorPoint = { x: motif.position.x, y: motif.position.y };
        break;
    }

    // Calculate initial distance from anchor to mouse (for scale calculation)
    const initialDistance = Math.sqrt(
      Math.pow(svgPoint.x - anchorPoint.x, 2) +
      Math.pow(svgPoint.y - anchorPoint.y, 2)
    );

    setScaleStart({
      initialDistance,
      originalScale: motif.scale || 1,
      originalWidth: scaledWidth,
      originalHeight: scaledHeight,
      corner,
      anchorPoint
    });
    setScaleMotifId(motifId);
    setIsScaling(true);
  };

  // Handle rotation start on motif rotation handle
  const handleMotifRotateStart = (e, motifId) => {
    e.stopPropagation();

    const motif = motifs[motifId];
    if (!motif || motif.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);
    const scaledWidth = motif.originalWidth_mm * (motif.scale || 1);
    const scaledHeight = motif.originalHeight_mm * (motif.scale || 1);

    // Calculate motif center in SVG coordinates
    const motifCenter = {
      x: motif.position.x + scaledWidth / 2,
      y: motif.position.y + scaledHeight / 2
    };

    // Calculate initial angle from center to mouse
    const initialAngle = Math.atan2(
      svgPoint.y - motifCenter.y,
      svgPoint.x - motifCenter.x
    ) * (180 / Math.PI);

    setRotateStart({
      initialAngle,
      originalRotation: motif.rotation || 0,
      motifCenter
    });
    setRotateMotifId(motifId);
    setIsRotating(true);
  };

  // Handle mouse/touch down on shape (start drag)
  // Helper to find which group an element belongs to
  const findGroupForElement = (elementId) => {
    for (const [groupId, group] of Object.entries(groups)) {
      if (group.childIds.includes(elementId)) {
        return groupId;
      }
    }
    return null;
  };
  // Alias for backward compatibility
  const findGroupForShape = findGroupForElement;

  const handleShapeMouseDown = (e, shapeId) => {
    e.stopPropagation();

    // Check if this shape belongs to a group
    const parentGroupId = findGroupForShape(shapeId);

    // If shape is in a group and we're NOT editing that group, select the group instead
    if (parentGroupId && editingGroupId !== parentGroupId) {
      // Select the group, not the individual shape
      selectGroup(parentGroupId);

      const group = groups[parentGroupId];
      if (group?.locked) return;

      // Handle both mouse and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);

      // Start dragging the group
      setDragStart({
        x: svgPoint.x - group.bounds.x,
        y: svgPoint.y - group.bounds.y
      });
      setDragGroupId(parentGroupId);
      setIsDragging(true);
      return;
    }

    // Check if Shift is held for multi-selection
    const isShiftHeld = e.shiftKey;

    if (isShiftHeld) {
      // Multi-select mode: add/remove from selection
      addToSelection(shapeId);
      // Don't start drag when multi-selecting
      return;
    }

    // Single selection mode
    // Clear any multi-selection first
    if (selectedElementIds.length > 0) {
      clearMultiSelection();
    }
    selectShape(shapeId);

    const shape = shapes[shapeId];
    // Don't allow dragging locked shapes
    if (shape?.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);

    setDragStart({
      x: svgPoint.x - shape.position.x,
      y: svgPoint.y - shape.position.y
    });
    setDragShapeId(shapeId);
    setIsDragging(true);
  };

  // Handle double-click on shape (open properties panel)
  const handleShapeDoubleClick = (e, shapeId) => {
    e.stopPropagation();

    selectShape(shapeId);

    useSportsDesignStore.setState({
      showPropertiesPanel: true,
      propertiesPanelUserClosed: false
    });
  };

  // Handle scale start on shape corner handle
  const handleShapeScaleStart = (e, shapeId, corner) => {
    e.stopPropagation();

    const shape = shapes[shapeId];
    if (!shape || shape.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);
    const { width_mm, height_mm } = shape;

    // Calculate the anchor point (opposite edge/corner that should stay fixed)
    let anchorPoint;
    switch (corner) {
      case 'n': // Top edge - anchor to bottom
        anchorPoint = { x: shape.position.x + width_mm / 2, y: shape.position.y + height_mm };
        break;
      case 's': // Bottom edge - anchor to top
        anchorPoint = { x: shape.position.x + width_mm / 2, y: shape.position.y };
        break;
      case 'e': // Right edge - anchor to left
        anchorPoint = { x: shape.position.x, y: shape.position.y + height_mm / 2 };
        break;
      case 'w': // Left edge - anchor to right
        anchorPoint = { x: shape.position.x + width_mm, y: shape.position.y + height_mm / 2 };
        break;
      case 'nw':
        anchorPoint = { x: shape.position.x + width_mm, y: shape.position.y + height_mm };
        break;
      case 'ne':
        anchorPoint = { x: shape.position.x, y: shape.position.y + height_mm };
        break;
      case 'sw':
        anchorPoint = { x: shape.position.x + width_mm, y: shape.position.y };
        break;
      case 'se':
      default:
        anchorPoint = { x: shape.position.x, y: shape.position.y };
        break;
    }

    const initialDistance = Math.sqrt(
      Math.pow(svgPoint.x - anchorPoint.x, 2) +
      Math.pow(svgPoint.y - anchorPoint.y, 2)
    );

    setScaleShapeStart({
      initialDistance,
      originalWidth: width_mm,
      originalHeight: height_mm,
      aspectLocked: shape.aspectLocked,
      corner,
      anchorPoint
    });
    setScaleShapeId(shapeId);
    setIsScalingShape(true);
  };

  // Handle rotation start on shape rotation handle
  const handleShapeRotateStart = (e, shapeId) => {
    e.stopPropagation();

    const shape = shapes[shapeId];
    if (!shape || shape.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);
    const { width_mm, height_mm } = shape;

    const shapeCenter = {
      x: shape.position.x + width_mm / 2,
      y: shape.position.y + height_mm / 2
    };

    const initialAngle = Math.atan2(
      svgPoint.y - shapeCenter.y,
      svgPoint.x - shapeCenter.x
    ) * (180 / Math.PI);

    setRotateShapeStart({
      initialAngle,
      originalRotation: shape.rotation || 0,
      shapeCenter
    });
    setRotateShapeId(shapeId);
    setIsRotatingShape(true);
  };

  // Handle mouse/touch down on text (start drag)
  const handleTextMouseDown = (e, textId) => {
    e.stopPropagation();

    // Check if this text belongs to a group
    const parentGroupId = findGroupForElement(textId);

    // If text is in a group and we're NOT editing that group, select the group instead
    if (parentGroupId && editingGroupId !== parentGroupId) {
      // Select the group, not the individual text
      selectGroup(parentGroupId);

      const group = groups[parentGroupId];
      if (group?.locked) return;

      // Handle both mouse and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);

      // Start dragging the group
      setDragStart({
        x: svgPoint.x - group.bounds.x,
        y: svgPoint.y - group.bounds.y
      });
      setDragGroupId(parentGroupId);
      setIsDragging(true);
      return;
    }

    selectText(textId);

    const text = texts[textId];
    // Don't allow dragging locked texts
    if (text?.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);

    setDragStart({
      x: svgPoint.x - text.position.x,
      y: svgPoint.y - text.position.y
    });
    setDragTextId(textId);
    setIsDragging(true);
  };

  // Handle double-click on text (open properties panel for editing)
  const handleTextDoubleClick = (e, textId) => {
    e.stopPropagation();
    selectText(textId);
    setShowPropertiesPanel(true);
  };

  // Handle scale start on text corner handle (changes scale transform)
  const handleTextScaleStart = (e, textId, corner) => {
    e.stopPropagation();

    const text = texts[textId];
    if (!text || text.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);

    // Get base bounds at the base font size (before scale transform)
    const baseFontSize = text.fontSize_mm || 500;
    const baseBounds = measureText(text.content || 'Text', text.fontFamily, baseFontSize, text.fontWeight, text.fontStyle);

    // Current scale factors
    const scale_x = text.scale_x || 1;
    const scale_y = text.scale_y || 1;

    // Scaled bounds (actual visual size)
    const scaledWidth = baseBounds.width * scale_x;
    const scaledHeight = baseFontSize * 1.2 * scale_y;

    // Calculate text box position based on alignment (at scaled size)
    // The position is the text baseline anchor, box is calculated from there
    let boxX = text.position.x;
    if (text.textAlign === 'center') boxX -= scaledWidth / 2;
    else if (text.textAlign === 'right') boxX -= scaledWidth;

    const boxY = text.position.y - baseFontSize * scale_y;

    // Calculate anchor point (opposite corner that stays fixed)
    let anchorPoint;
    switch (corner) {
      case 'nw':
        anchorPoint = { x: boxX + scaledWidth, y: boxY + scaledHeight };
        break;
      case 'ne':
        anchorPoint = { x: boxX, y: boxY + scaledHeight };
        break;
      case 'sw':
        anchorPoint = { x: boxX + scaledWidth, y: boxY };
        break;
      case 'se':
      default:
        anchorPoint = { x: boxX, y: boxY };
        break;
    }

    const initialDistance = Math.sqrt(
      Math.pow(svgPoint.x - anchorPoint.x, 2) +
      Math.pow(svgPoint.y - anchorPoint.y, 2)
    );

    setScaleTextStart({
      initialDistance,
      originalScale: { x: scale_x, y: scale_y },
      originalPosition: { ...text.position },
      baseBounds,
      baseFontSize,
      textAlign: text.textAlign,
      corner,
      anchorPoint
    });
    setScaleTextId(textId);
    setIsScalingText(true);
  };

  // Handle rotation start on text rotation handle
  const handleTextRotateStart = (e, textId) => {
    e.stopPropagation();

    const text = texts[textId];
    if (!text || text.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);
    const bounds = measureText(text.content, text.fontFamily, text.fontSize_mm, text.fontWeight, text.fontStyle);

    // Calculate text center based on alignment
    let centerX = text.position.x;
    if (text.textAlign === 'center') centerX = text.position.x;
    else if (text.textAlign === 'right') centerX = text.position.x - bounds.width / 2;
    else centerX = text.position.x + bounds.width / 2;

    const textCenter = {
      x: centerX,
      y: text.position.y - text.fontSize_mm * 0.4
    };

    const initialAngle = Math.atan2(
      svgPoint.y - textCenter.y,
      svgPoint.x - textCenter.x
    ) * (180 / Math.PI);

    setRotateTextStart({
      initialAngle,
      originalRotation: text.rotation || 0,
      textCenter
    });
    setRotateTextId(textId);
    setIsRotatingText(true);
  };

  // Handle mouse/touch down on exclusion zone (start drag)
  const handleExclusionZoneMouseDown = (e, zoneId) => {
    e.stopPropagation();

    selectExclusionZone(zoneId);

    const zone = exclusionZones[zoneId];
    // Don't allow dragging locked zones
    if (zone?.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);

    setDragStart({
      x: svgPoint.x - zone.position.x,
      y: svgPoint.y - zone.position.y
    });
    setDragExclusionZoneId(zoneId);
    setIsDragging(true);
  };

  // Handle double-click on exclusion zone (open properties panel)
  const handleExclusionZoneDoubleClick = (e, zoneId) => {
    e.stopPropagation();

    selectExclusionZone(zoneId);

    useSportsDesignStore.setState({
      showPropertiesPanel: true,
      propertiesPanelUserClosed: false
    });
  };

  // Handle scale start on exclusion zone corner handle
  const handleExclusionZoneScaleStart = (e, zoneId, corner) => {
    e.stopPropagation();

    const zone = exclusionZones[zoneId];
    if (!zone || zone.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);
    const { width_mm, height_mm } = zone;

    // Calculate the anchor point (opposite edge/corner that should stay fixed)
    let anchorPoint;
    switch (corner) {
      case 'n':
        anchorPoint = { x: zone.position.x + width_mm / 2, y: zone.position.y + height_mm };
        break;
      case 's':
        anchorPoint = { x: zone.position.x + width_mm / 2, y: zone.position.y };
        break;
      case 'e':
        anchorPoint = { x: zone.position.x, y: zone.position.y + height_mm / 2 };
        break;
      case 'w':
        anchorPoint = { x: zone.position.x + width_mm, y: zone.position.y + height_mm / 2 };
        break;
      default:
        anchorPoint = { x: zone.position.x, y: zone.position.y };
        break;
    }

    const initialDistance = Math.sqrt(
      Math.pow(svgPoint.x - anchorPoint.x, 2) +
      Math.pow(svgPoint.y - anchorPoint.y, 2)
    );

    setScaleExclusionZoneStart({
      initialDistance,
      originalWidth: width_mm,
      originalHeight: height_mm,
      corner,
      anchorPoint
    });
    setScaleExclusionZoneId(zoneId);
    setIsScalingExclusionZone(true);
  };

  // Handle rotation start on exclusion zone rotation handle
  const handleExclusionZoneRotateStart = (e, zoneId) => {
    e.stopPropagation();

    const zone = exclusionZones[zoneId];
    if (!zone || zone.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);
    const { width_mm, height_mm } = zone;

    const zoneCenter = {
      x: zone.position.x + width_mm / 2,
      y: zone.position.y + height_mm / 2
    };

    const initialAngle = Math.atan2(
      svgPoint.y - zoneCenter.y,
      svgPoint.x - zoneCenter.x
    ) * (180 / Math.PI);

    setRotateExclusionZoneStart({
      initialAngle,
      originalRotation: zone.rotation || 0,
      zoneCenter
    });
    setRotateExclusionZoneId(zoneId);
    setIsRotatingExclusionZone(true);
  };

  // Handle scale start on group corner/edge handle
  const handleGroupScaleStart = (e, groupId, corner) => {
    e.stopPropagation();

    const group = groups[groupId];
    if (!group || group.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);
    const { x, y, width, height } = group.bounds;

    // Calculate the anchor point (opposite edge/corner that should stay fixed)
    let anchorPoint;
    switch (corner) {
      case 'n':
        anchorPoint = { x: x + width / 2, y: y + height };
        break;
      case 's':
        anchorPoint = { x: x + width / 2, y: y };
        break;
      case 'e':
        anchorPoint = { x: x, y: y + height / 2 };
        break;
      case 'w':
        anchorPoint = { x: x + width, y: y + height / 2 };
        break;
      case 'nw':
        anchorPoint = { x: x + width, y: y + height };
        break;
      case 'ne':
        anchorPoint = { x: x, y: y + height };
        break;
      case 'sw':
        anchorPoint = { x: x + width, y: y };
        break;
      case 'se':
      default:
        anchorPoint = { x: x, y: y };
        break;
    }

    const initialDistance = Math.sqrt(
      Math.pow(svgPoint.x - anchorPoint.x, 2) +
      Math.pow(svgPoint.y - anchorPoint.y, 2)
    );

    // Store original positions and sizes of all child elements
    const originalChildren = {};
    for (const childId of group.childIds) {
      if (childId.startsWith('shape-') && shapes[childId]) {
        originalChildren[childId] = {
          position: { ...shapes[childId].position },
          width_mm: shapes[childId].width_mm,
          height_mm: shapes[childId].height_mm
        };
      } else if (childId.startsWith('text-') && texts[childId]) {
        originalChildren[childId] = {
          position: { ...texts[childId].position },
          width_mm: texts[childId].width_mm || 1000,
          height_mm: texts[childId].height_mm || 500,
          fontSize: texts[childId].fontSize || 200
        };
      } else if (childId.startsWith('court-') && courts[childId]) {
        originalChildren[childId] = {
          position: { ...courts[childId].position },
          scale: courts[childId].scale || 1
        };
      } else if (childId.startsWith('track-') && tracks[childId]) {
        originalChildren[childId] = {
          position: { ...tracks[childId].position },
          scale: tracks[childId].scale || 1
        };
      } else if (childId.startsWith('motif-') && motifs[childId]) {
        originalChildren[childId] = {
          position: { ...motifs[childId].position },
          scale: motifs[childId].scale || 1
        };
      }
    }

    setScaleGroupStart({
      initialDistance,
      originalBounds: { ...group.bounds },
      corner,
      anchorPoint,
      originalChildren
    });
    setScaleGroupId(groupId);
    setIsScalingGroup(true);
  };

  // Handle rotation start on group rotation handle
  const handleGroupRotateStart = (e, groupId) => {
    e.stopPropagation();

    const group = groups[groupId];
    if (!group || group.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);
    const { x, y, width, height } = group.bounds;

    // Group center is the pivot point for rotation
    const center = {
      x: x + width / 2,
      y: y + height / 2
    };

    // Calculate initial angle from center to mouse position
    const initialAngle = Math.atan2(svgPoint.y - center.y, svgPoint.x - center.x) * (180 / Math.PI);

    // Store original positions and rotations of all child elements
    const originalChildren = {};
    for (const childId of group.childIds) {
      if (childId.startsWith('shape-') && shapes[childId]) {
        originalChildren[childId] = {
          position: { ...shapes[childId].position },
          rotation: shapes[childId].rotation || 0
        };
      } else if (childId.startsWith('text-') && texts[childId]) {
        originalChildren[childId] = {
          position: { ...texts[childId].position },
          rotation: texts[childId].rotation || 0
        };
      } else if (childId.startsWith('court-') && courts[childId]) {
        originalChildren[childId] = {
          position: { ...courts[childId].position },
          rotation: courts[childId].rotation || 0
        };
      } else if (childId.startsWith('track-') && tracks[childId]) {
        originalChildren[childId] = {
          position: { ...tracks[childId].position },
          rotation: tracks[childId].rotation || 0
        };
      } else if (childId.startsWith('motif-') && motifs[childId]) {
        originalChildren[childId] = {
          position: { ...motifs[childId].position },
          rotation: motifs[childId].rotation || 0
        };
      }
    }

    setRotateGroupStart({
      initialAngle,
      center,
      originalBounds: { ...group.bounds },
      originalChildren
    });
    setRotateGroupId(groupId);
    setIsRotatingGroup(true);
  };

  // Reset drag state when surface dimensions change
  useEffect(() => {
    setIsDragging(false);
    setDragCourtId(null);
    setDragTrackId(null);
    setDragMotifId(null);
    setDragShapeId(null);
    setDragTextId(null);
    setDragExclusionZoneId(null);
    setDragStart(null);
  }, [surface.width_mm, surface.length_mm]);

  // Handle mouse/touch move (drag court, track, motif, shape, text, exclusion zone, or group)
  useEffect(() => {
    if (!isDragging || (!dragCourtId && !dragTrackId && !dragMotifId && !dragShapeId && !dragTextId && !dragExclusionZoneId && !dragGroupId)) return;

    const handleMove = (e) => {
      // Handle both mouse and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);

      let newPosition = {
        x: svgPoint.x - dragStart.x,
        y: svgPoint.y - dragStart.y
      };

      // Snap to grid if enabled
      if (snapToGrid) {
        newPosition = snapPositionToGrid(newPosition, gridSize_mm);
      }

      // Update position based on what's being dragged
      if (dragCourtId) {
        const court = courts[dragCourtId];
        const courtDimensions = {
          width_mm: court.template.dimensions.width_mm * court.scale,
          length_mm: court.template.dimensions.length_mm * court.scale
        };
        newPosition = constrainPosition(newPosition, courtDimensions, surface);
        updateCourtPosition(dragCourtId, newPosition);
      } else if (dragTrackId) {
        // Tracks don't constrain to bounds (they're usually large)
        updateTrackPosition(dragTrackId, newPosition);
      } else if (dragMotifId) {
        // Motifs: constrain to surface bounds
        const motif = motifs[dragMotifId];
        const motifDimensions = {
          width_mm: motif.originalWidth_mm * (motif.scale || 1),
          length_mm: motif.originalHeight_mm * (motif.scale || 1)
        };
        newPosition = constrainPosition(newPosition, motifDimensions, surface);
        updateMotifPosition(dragMotifId, newPosition);
      } else if (dragShapeId) {
        // Shapes: constrain to surface bounds
        const shape = shapes[dragShapeId];
        const shapeDimensions = {
          width_mm: shape.width_mm,
          length_mm: shape.height_mm
        };
        newPosition = constrainPosition(newPosition, shapeDimensions, surface);
        updateShapePosition(dragShapeId, newPosition);
      } else if (dragTextId) {
        // Text: just update position (no constraints needed for text)
        updateTextPosition(dragTextId, newPosition);
      } else if (dragExclusionZoneId) {
        // Exclusion zones: constrain to surface bounds
        const zone = exclusionZones[dragExclusionZoneId];
        const zoneDimensions = {
          width_mm: zone.width_mm,
          length_mm: zone.height_mm
        };
        newPosition = constrainPosition(newPosition, zoneDimensions, surface);
        updateExclusionZonePosition(dragExclusionZoneId, newPosition);
      } else if (dragGroupId) {
        // Groups: calculate delta and move all child shapes
        const group = groups[dragGroupId];
        if (group) {
          const deltaX = newPosition.x - group.bounds.x;
          const deltaY = newPosition.y - group.bounds.y;
          updateGroupPosition(dragGroupId, deltaX, deltaY);
        }
      }
    };

    const handleEnd = () => {
      // Add to history when drag completes
      if (dragCourtId || dragTrackId || dragMotifId || dragShapeId || dragTextId || dragExclusionZoneId || dragGroupId) {
        const { addToHistory, commitGroupMove } = useSportsDesignStore.getState();
        if (dragGroupId) {
          commitGroupMove(dragGroupId);
        }
        addToHistory();
      }

      setIsDragging(false);
      setDragCourtId(null);
      setDragTrackId(null);
      setDragMotifId(null);
      setDragShapeId(null);
      setDragTextId(null);
      setDragExclusionZoneId(null);
      setDragGroupId(null);
      setDragStart(null);
    };

    // Listen for both mouse and touch events
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging, dragCourtId, dragTrackId, dragMotifId, dragShapeId, dragTextId, dragExclusionZoneId, dragGroupId, dragStart, courts, tracks, motifs, shapes, texts, exclusionZones, groups, snapToGrid, gridSize_mm, surface, updateCourtPosition, updateTrackPosition, updateMotifPosition, updateShapePosition, updateTextPosition, updateExclusionZonePosition, updateGroupPosition]);

  // Handle mouse/touch move for motif scaling
  useEffect(() => {
    if (!isScaling || !scaleMotifId || !scaleStart) return;

    const handleMove = (e) => {
      // Handle both mouse and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);
      const motif = motifs[scaleMotifId];
      if (!motif) return;

      // Calculate current distance from anchor point to mouse
      const currentDistance = Math.sqrt(
        Math.pow(svgPoint.x - scaleStart.anchorPoint.x, 2) +
        Math.pow(svgPoint.y - scaleStart.anchorPoint.y, 2)
      );

      // Calculate new scale based on distance ratio
      const scaleRatio = currentDistance / scaleStart.initialDistance;
      let newScale = scaleStart.originalScale * scaleRatio;

      // Minimum scale of 0.1, no upper limit
      newScale = Math.max(0.1, newScale);

      // Round to 2 decimal places
      newScale = Math.round(newScale * 100) / 100;

      // Calculate new dimensions
      const newWidth = motif.originalWidth_mm * newScale;
      const newHeight = motif.originalHeight_mm * newScale;

      // Calculate new position to keep anchor point fixed
      let newPosition;
      switch (scaleStart.corner) {
        case 'nw': // Anchor is bottom-right, position is top-left
          newPosition = {
            x: scaleStart.anchorPoint.x - newWidth,
            y: scaleStart.anchorPoint.y - newHeight
          };
          break;
        case 'ne': // Anchor is bottom-left, position.x stays, position.y adjusts
          newPosition = {
            x: scaleStart.anchorPoint.x,
            y: scaleStart.anchorPoint.y - newHeight
          };
          break;
        case 'sw': // Anchor is top-right, position.y stays, position.x adjusts
          newPosition = {
            x: scaleStart.anchorPoint.x - newWidth,
            y: scaleStart.anchorPoint.y
          };
          break;
        case 'se': // Anchor is top-left (position), no adjustment needed
        default:
          newPosition = {
            x: scaleStart.anchorPoint.x,
            y: scaleStart.anchorPoint.y
          };
          break;
      }

      updateMotifScale(scaleMotifId, newScale);
      updateMotifPosition(scaleMotifId, newPosition);
    };

    const handleEnd = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsScaling(false);
      setScaleMotifId(null);
      setScaleStart(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isScaling, scaleMotifId, scaleStart, motifs, updateMotifScale, updateMotifPosition]);

  // Handle mouse/touch move for motif rotation
  useEffect(() => {
    if (!isRotating || !rotateMotifId || !rotateStart) return;

    const handleMove = (e) => {
      // Handle both mouse and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);

      // Calculate current angle from center to mouse/touch
      const currentAngle = Math.atan2(
        svgPoint.y - rotateStart.motifCenter.y,
        svgPoint.x - rotateStart.motifCenter.x
      ) * (180 / Math.PI);

      // Calculate rotation delta
      const angleDelta = currentAngle - rotateStart.initialAngle;
      let newRotation = rotateStart.originalRotation + angleDelta;

      // Normalize to 0-360 range
      newRotation = ((newRotation % 360) + 360) % 360;

      // Snap to 15-degree increments if shift is held (mouse only)
      if (e.shiftKey) {
        newRotation = Math.round(newRotation / 15) * 15;
      }

      // Round to 1 decimal place
      newRotation = Math.round(newRotation * 10) / 10;

      updateMotifRotation(rotateMotifId, newRotation);
    };

    const handleEnd = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsRotating(false);
      setRotateMotifId(null);
      setRotateStart(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isRotating, rotateMotifId, rotateStart, updateMotifRotation]);

  // Handle mouse/touch move for shape scaling
  useEffect(() => {
    if (!isScalingShape || !scaleShapeId || !scaleShapeStart) return;

    const handleMove = (e) => {
      // Handle both mouse and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);
      const shape = shapes[scaleShapeId];
      if (!shape) return;

      // Calculate current distance from anchor point to mouse
      const currentDistance = Math.sqrt(
        Math.pow(svgPoint.x - scaleShapeStart.anchorPoint.x, 2) +
        Math.pow(svgPoint.y - scaleShapeStart.anchorPoint.y, 2)
      );

      // Calculate new scale based on distance ratio
      const scaleRatio = currentDistance / scaleShapeStart.initialDistance;

      let newWidth, newHeight;
      const corner = scaleShapeStart.corner;
      const isEdgeHandle = ['n', 's', 'e', 'w'].includes(corner);

      if (scaleShapeStart.aspectLocked) {
        // Maintain aspect ratio - scale both dimensions proportionally
        newWidth = scaleShapeStart.originalWidth * scaleRatio;
        newHeight = scaleShapeStart.originalHeight * scaleRatio;
      } else if (isEdgeHandle) {
        // Edge handles: constrain to single axis (only when aspect NOT locked)
        const dy = Math.abs(svgPoint.y - scaleShapeStart.anchorPoint.y);
        const dx = Math.abs(svgPoint.x - scaleShapeStart.anchorPoint.x);

        if (corner === 'n' || corner === 's') {
          // Vertical edge - only change height
          newWidth = scaleShapeStart.originalWidth;
          newHeight = Math.max(100, dy);
        } else {
          // Horizontal edge - only change width
          newWidth = Math.max(100, dx);
          newHeight = scaleShapeStart.originalHeight;
        }
      } else {
        // Free scaling based on mouse position relative to anchor
        const dx = Math.abs(svgPoint.x - scaleShapeStart.anchorPoint.x);
        const dy = Math.abs(svgPoint.y - scaleShapeStart.anchorPoint.y);
        newWidth = Math.max(100, dx); // Minimum 100mm
        newHeight = Math.max(100, dy);
      }

      // Round to whole mm
      newWidth = Math.round(newWidth);
      newHeight = Math.round(newHeight);

      // Calculate new position to keep anchor point fixed
      let newPosition;
      switch (corner) {
        case 'n': // Top edge - keep x centered, move y up
          newPosition = {
            x: scaleShapeStart.anchorPoint.x - newWidth / 2,
            y: scaleShapeStart.anchorPoint.y - newHeight
          };
          break;
        case 's': // Bottom edge - keep x centered, y stays at anchor
          newPosition = {
            x: scaleShapeStart.anchorPoint.x - newWidth / 2,
            y: scaleShapeStart.anchorPoint.y
          };
          break;
        case 'e': // Right edge - x stays at anchor, keep y centered
          newPosition = {
            x: scaleShapeStart.anchorPoint.x,
            y: scaleShapeStart.anchorPoint.y - newHeight / 2
          };
          break;
        case 'w': // Left edge - move x left, keep y centered
          newPosition = {
            x: scaleShapeStart.anchorPoint.x - newWidth,
            y: scaleShapeStart.anchorPoint.y - newHeight / 2
          };
          break;
        case 'nw':
          newPosition = {
            x: scaleShapeStart.anchorPoint.x - newWidth,
            y: scaleShapeStart.anchorPoint.y - newHeight
          };
          break;
        case 'ne':
          newPosition = {
            x: scaleShapeStart.anchorPoint.x,
            y: scaleShapeStart.anchorPoint.y - newHeight
          };
          break;
        case 'sw':
          newPosition = {
            x: scaleShapeStart.anchorPoint.x - newWidth,
            y: scaleShapeStart.anchorPoint.y
          };
          break;
        case 'se':
        default:
          newPosition = {
            x: scaleShapeStart.anchorPoint.x,
            y: scaleShapeStart.anchorPoint.y
          };
          break;
      }

      updateShapeDimensions(scaleShapeId, newWidth, newHeight);
      updateShapePosition(scaleShapeId, newPosition);
    };

    const handleEnd = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsScalingShape(false);
      setScaleShapeId(null);
      setScaleShapeStart(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isScalingShape, scaleShapeId, scaleShapeStart, shapes, updateShapeDimensions, updateShapePosition]);

  // Handle mouse/touch move for shape rotation
  useEffect(() => {
    if (!isRotatingShape || !rotateShapeId || !rotateShapeStart) return;

    const handleMove = (e) => {
      // Handle both mouse and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);

      // Calculate current angle from center to mouse/touch
      const currentAngle = Math.atan2(
        svgPoint.y - rotateShapeStart.shapeCenter.y,
        svgPoint.x - rotateShapeStart.shapeCenter.x
      ) * (180 / Math.PI);

      // Calculate rotation delta
      const angleDelta = currentAngle - rotateShapeStart.initialAngle;
      let newRotation = rotateShapeStart.originalRotation + angleDelta;

      // Normalize to 0-360 range
      newRotation = ((newRotation % 360) + 360) % 360;

      // Snap to 15-degree increments if shift is held (mouse only)
      if (e.shiftKey) {
        newRotation = Math.round(newRotation / 15) * 15;
      }

      // Round to 1 decimal place
      newRotation = Math.round(newRotation * 10) / 10;

      updateShapeRotation(rotateShapeId, newRotation);
    };

    const handleEnd = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsRotatingShape(false);
      setRotateShapeId(null);
      setRotateShapeStart(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isRotatingShape, rotateShapeId, rotateShapeStart, updateShapeRotation]);

  // Handle mouse/touch move for text scaling (scale transform)
  useEffect(() => {
    if (!isScalingText || !scaleTextId || !scaleTextStart) return;

    const handleMove = (e) => {
      // Handle both mouse and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);
      const text = texts[scaleTextId];
      if (!text) return;

      // Calculate current distance from anchor point to mouse/touch
      const currentDistance = Math.sqrt(
        Math.pow(svgPoint.x - scaleTextStart.anchorPoint.x, 2) +
        Math.pow(svgPoint.y - scaleTextStart.anchorPoint.y, 2)
      );

      // Calculate scale ratio from distance change
      const scaleRatio = currentDistance / scaleTextStart.initialDistance;

      // Apply ratio to original scale (uniform scaling)
      const newScale_x = Math.max(0.01, scaleTextStart.originalScale.x * scaleRatio);
      const newScale_y = Math.max(0.01, scaleTextStart.originalScale.y * scaleRatio);

      // Calculate new scaled dimensions
      const { baseBounds, baseFontSize, corner, anchorPoint, textAlign } = scaleTextStart;
      const newWidth = baseBounds.width * newScale_x;
      const newHeight = baseFontSize * 1.2 * newScale_y;

      // Calculate new position to keep anchor point fixed
      let newPosition = { ...scaleTextStart.originalPosition };

      // Calculate new position from fixed anchor based on corner and alignment
      switch (corner) {
        case 'nw': // Anchor at SE (bottom-right), text grows up-left
          if (textAlign === 'left') {
            newPosition.x = anchorPoint.x - newWidth;
          } else if (textAlign === 'center') {
            newPosition.x = anchorPoint.x - newWidth / 2;
          } else { // right
            newPosition.x = anchorPoint.x;
          }
          newPosition.y = anchorPoint.y - newHeight * 0.17; // baseline offset
          break;
        case 'ne': // Anchor at SW (bottom-left), text grows up-right
          if (textAlign === 'left') {
            newPosition.x = anchorPoint.x;
          } else if (textAlign === 'center') {
            newPosition.x = anchorPoint.x + newWidth / 2;
          } else { // right
            newPosition.x = anchorPoint.x + newWidth;
          }
          newPosition.y = anchorPoint.y - newHeight * 0.17;
          break;
        case 'sw': // Anchor at NE (top-right), text grows down-left
          if (textAlign === 'left') {
            newPosition.x = anchorPoint.x - newWidth;
          } else if (textAlign === 'center') {
            newPosition.x = anchorPoint.x - newWidth / 2;
          } else { // right
            newPosition.x = anchorPoint.x;
          }
          newPosition.y = anchorPoint.y + baseFontSize * newScale_y;
          break;
        case 'se': // Anchor at NW (top-left), text grows down-right
        default:
          if (textAlign === 'left') {
            newPosition.x = anchorPoint.x;
          } else if (textAlign === 'center') {
            newPosition.x = anchorPoint.x + newWidth / 2;
          } else { // right
            newPosition.x = anchorPoint.x + newWidth;
          }
          newPosition.y = anchorPoint.y + baseFontSize * newScale_y;
          break;
      }

      updateTextScale(scaleTextId, newScale_x, newScale_y);
      updateTextPosition(scaleTextId, newPosition);
    };

    const handleEnd = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsScalingText(false);
      setScaleTextId(null);
      setScaleTextStart(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isScalingText, scaleTextId, scaleTextStart, texts, updateTextScale, updateTextPosition]);

  // Handle mouse/touch move for text rotation
  useEffect(() => {
    if (!isRotatingText || !rotateTextId || !rotateTextStart) return;

    const handleMove = (e) => {
      // Handle both mouse and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);

      // Calculate current angle from center to mouse/touch
      const currentAngle = Math.atan2(
        svgPoint.y - rotateTextStart.textCenter.y,
        svgPoint.x - rotateTextStart.textCenter.x
      ) * (180 / Math.PI);

      // Calculate rotation delta
      const angleDelta = currentAngle - rotateTextStart.initialAngle;
      let newRotation = rotateTextStart.originalRotation + angleDelta;

      // Normalize to 0-360 range
      newRotation = ((newRotation % 360) + 360) % 360;

      // Snap to 15-degree increments if shift is held (mouse only)
      if (e.shiftKey) {
        newRotation = Math.round(newRotation / 15) * 15;
      }

      // Round to 1 decimal place
      newRotation = Math.round(newRotation * 10) / 10;

      updateTextRotation(rotateTextId, newRotation);
    };

    const handleEnd = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsRotatingText(false);
      setRotateTextId(null);
      setRotateTextStart(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isRotatingText, rotateTextId, rotateTextStart, updateTextRotation]);

  // Handle mouse/touch move for exclusion zone scaling
  useEffect(() => {
    if (!isScalingExclusionZone || !scaleExclusionZoneId || !scaleExclusionZoneStart) return;

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);
      const zone = exclusionZones[scaleExclusionZoneId];
      if (!zone) return;

      const corner = scaleExclusionZoneStart.corner;
      const dy = Math.abs(svgPoint.y - scaleExclusionZoneStart.anchorPoint.y);
      const dx = Math.abs(svgPoint.x - scaleExclusionZoneStart.anchorPoint.x);

      let newWidth, newHeight;

      if (corner === 'n' || corner === 's') {
        newWidth = scaleExclusionZoneStart.originalWidth;
        newHeight = Math.max(500, dy);
      } else if (corner === 'e' || corner === 'w') {
        newWidth = Math.max(500, dx);
        newHeight = scaleExclusionZoneStart.originalHeight;
      } else {
        newWidth = Math.max(500, dx);
        newHeight = Math.max(500, dy);
      }

      newWidth = Math.round(newWidth);
      newHeight = Math.round(newHeight);

      // Calculate new position to keep anchor point fixed
      let newPosition;
      switch (corner) {
        case 'n':
          newPosition = {
            x: scaleExclusionZoneStart.anchorPoint.x - newWidth / 2,
            y: scaleExclusionZoneStart.anchorPoint.y - newHeight
          };
          break;
        case 's':
          newPosition = {
            x: scaleExclusionZoneStart.anchorPoint.x - newWidth / 2,
            y: scaleExclusionZoneStart.anchorPoint.y
          };
          break;
        case 'e':
          newPosition = {
            x: scaleExclusionZoneStart.anchorPoint.x,
            y: scaleExclusionZoneStart.anchorPoint.y - newHeight / 2
          };
          break;
        case 'w':
          newPosition = {
            x: scaleExclusionZoneStart.anchorPoint.x - newWidth,
            y: scaleExclusionZoneStart.anchorPoint.y - newHeight / 2
          };
          break;
        default:
          newPosition = {
            x: scaleExclusionZoneStart.anchorPoint.x,
            y: scaleExclusionZoneStart.anchorPoint.y
          };
          break;
      }

      updateExclusionZoneDimensions(scaleExclusionZoneId, newWidth, newHeight);
      updateExclusionZonePosition(scaleExclusionZoneId, newPosition);
    };

    const handleEnd = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsScalingExclusionZone(false);
      setScaleExclusionZoneId(null);
      setScaleExclusionZoneStart(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isScalingExclusionZone, scaleExclusionZoneId, scaleExclusionZoneStart, exclusionZones, updateExclusionZoneDimensions, updateExclusionZonePosition]);

  // Handle mouse/touch move for exclusion zone rotation
  useEffect(() => {
    if (!isRotatingExclusionZone || !rotateExclusionZoneId || !rotateExclusionZoneStart) return;

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);

      const currentAngle = Math.atan2(
        svgPoint.y - rotateExclusionZoneStart.zoneCenter.y,
        svgPoint.x - rotateExclusionZoneStart.zoneCenter.x
      ) * (180 / Math.PI);

      const angleDelta = currentAngle - rotateExclusionZoneStart.initialAngle;
      let newRotation = rotateExclusionZoneStart.originalRotation + angleDelta;

      // Normalize to 0-360 range
      newRotation = ((newRotation % 360) + 360) % 360;

      // Snap to 15-degree increments if shift is held
      if (e.shiftKey) {
        newRotation = Math.round(newRotation / 15) * 15;
      }

      newRotation = Math.round(newRotation * 10) / 10;

      updateExclusionZoneRotation(rotateExclusionZoneId, newRotation);
    };

    const handleEnd = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsRotatingExclusionZone(false);
      setRotateExclusionZoneId(null);
      setRotateExclusionZoneStart(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isRotatingExclusionZone, rotateExclusionZoneId, rotateExclusionZoneStart, updateExclusionZoneRotation]);

  // Handle mouse/touch move for group scaling
  useEffect(() => {
    if (!isScalingGroup || !scaleGroupId || !scaleGroupStart) return;

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);

      const { initialDistance, originalBounds, corner, anchorPoint, originalChildren } = scaleGroupStart;

      // Calculate current distance from anchor point
      const currentDistance = Math.sqrt(
        Math.pow(svgPoint.x - anchorPoint.x, 2) +
        Math.pow(svgPoint.y - anchorPoint.y, 2)
      );

      // Calculate scale factor
      let scaleFactor = currentDistance / initialDistance;
      if (scaleFactor < 0.1) scaleFactor = 0.1; // Minimum scale
      if (scaleFactor > 10) scaleFactor = 10; // Maximum scale

      // Calculate scale for each axis based on corner type
      let scaleX = scaleFactor;
      let scaleY = scaleFactor;

      // For edge handles, only scale in one direction
      if (corner === 'n' || corner === 's') {
        scaleX = 1;
      } else if (corner === 'e' || corner === 'w') {
        scaleY = 1;
      }

      // Use updateGroupScale action from store with original children positions
      updateGroupScale(scaleGroupId, scaleX, scaleY, anchorPoint, originalChildren);
    };

    const handleEnd = () => {
      const { addToHistory, refreshGroupBounds } = useSportsDesignStore.getState();
      refreshGroupBounds(scaleGroupId);
      addToHistory();

      setIsScalingGroup(false);
      setScaleGroupId(null);
      setScaleGroupStart(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isScalingGroup, scaleGroupId, scaleGroupStart, groups, updateGroupScale]);

  // Handle mouse/touch move for group rotation
  useEffect(() => {
    if (!isRotatingGroup || !rotateGroupId || !rotateGroupStart) return;

    const handleMove = (e) => {
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);

      const { initialAngle, center, originalChildren } = rotateGroupStart;

      // Calculate current angle from center to mouse position
      const currentAngle = Math.atan2(svgPoint.y - center.y, svgPoint.x - center.x) * (180 / Math.PI);

      // Calculate rotation delta (how much we've rotated from start)
      let rotationDelta = currentAngle - initialAngle;

      // Snap to 15-degree increments if Shift is held
      if (e.shiftKey) {
        rotationDelta = Math.round(rotationDelta / 15) * 15;
      }

      // Apply rotation to all children
      updateGroupRotation(rotateGroupId, rotationDelta, center, originalChildren);
    };

    const handleEnd = () => {
      const { addToHistory, refreshGroupBounds } = useSportsDesignStore.getState();
      refreshGroupBounds(rotateGroupId);
      addToHistory();

      setIsRotatingGroup(false);
      setRotateGroupId(null);
      setRotateGroupStart(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isRotatingGroup, rotateGroupId, rotateGroupStart, groups, updateGroupRotation]);

  // Handle click on canvas background (deselect or add path point)
  const handleCanvasClick = (e) => {
    // In path drawing mode, add points to the active path
    if (pathDrawingMode && activePathId) {
      // Only handle clicks on the canvas background or SVG
      if (e.target === e.currentTarget || e.target.tagName === 'svg' || e.target.closest('svg')) {
        e.preventDefault();
        e.stopPropagation();

        // Check for double-click by timing (native dblclick broken by preventDefault)
        const now = Date.now();
        const timeSinceLastClick = now - lastClickTime;
        setLastClickTime(now);

        // If double-click detected (< 300ms between clicks), finish the path
        if (timeSinceLastClick < 300 && timeSinceLastClick > 0) {
          finishPath();
          return;
        }

        const clientX = e.clientX;
        const clientY = e.clientY;
        const svgPoint = screenToSVG(clientX, clientY);

        // Convert to normalized coordinates (0-1) relative to the active path shape
        const shape = shapes[activePathId];
        if (shape) {
          // The path shape was created with a default position
          // We need to add the point relative to the shape's coordinate space
          // First click sets position, subsequent clicks add relative points
          const normalizedX = (svgPoint.x - shape.position.x) / shape.width_mm;
          const normalizedY = (svgPoint.y - shape.position.y) / shape.height_mm;

          // Clamp to reasonable bounds but allow some overflow
          const clampedX = Math.max(-0.5, Math.min(1.5, normalizedX));
          const clampedY = Math.max(-0.5, Math.min(1.5, normalizedY));

          addPointToPath(clampedX, clampedY);
        }
        return;
      }
    }

    // Normal behavior: deselect when clicking background
    // Check if clicked on container, SVG, or surface background elements
    const isBackground =
      e.target === e.currentTarget || // Container div
      e.target.tagName === 'svg' || // SVG element itself
      e.target.classList?.contains('court-canvas__surface') || // Surface background rect
      e.target.closest('.court-canvas__scroll-container') === e.target; // Scroll container

    if (isBackground) {
      deselectCourt();
      deselectTrack();
      deselectMotif();
      deselectShape();
      deselectText();
      deselectExclusionZone();
      deselectGroup();
      clearMultiSelection();
      // Clear point selection when clicking background
      setSelectedPointIndex(null);
    }
  };

  // ====== Zoom and Pan Handlers ======
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom * 1.25, 5));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom / 1.25, 0.25));
  };

  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    // Ctrl/Cmd + scroll = zoom (also handles trackpad pinch which sets ctrlKey)
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.002;
      setZoom(prevZoom => Math.min(Math.max(prevZoom + prevZoom * delta, 0.25), 5));
    } else {
      // Regular scroll = pan
      e.preventDefault();
      const panSpeed = 1;
      setPan(prevPan => ({
        x: prevPan.x - e.deltaX * panSpeed,
        y: prevPan.y - e.deltaY * panSpeed
      }));
    }
  };

  // Handle middle-click or space+click for panning
  const handlePanStart = (e) => {
    // Middle mouse button (button 1) or space key held + left click
    if (e.button === 1 || (e.button === 0 && spaceHeld)) {
      e.preventDefault();
      e.stopPropagation();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handlePanMove = (e) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  // ====== Touch Gesture Handlers for Mobile ======
  const getDistanceBetweenTouches = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getCenterBetweenTouches = (touches) => {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Two-finger gesture: pinch zoom and pan
      e.preventDefault();
      const distance = getDistanceBetweenTouches(e.touches);
      const center = getCenterBetweenTouches(e.touches);

      setTouchState({
        active: true,
        initialDistance: distance,
        initialZoom: zoom,
        initialPan: { ...pan },
        initialCenter: center
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchState.active) {
      e.preventDefault();

      // Calculate pinch zoom
      const currentDistance = getDistanceBetweenTouches(e.touches);
      const scaleRatio = currentDistance / touchState.initialDistance;
      let newZoom = touchState.initialZoom * scaleRatio;
      newZoom = Math.min(Math.max(newZoom, 0.25), 5); // Clamp between 0.25 and 5

      // Calculate two-finger pan
      const currentCenter = getCenterBetweenTouches(e.touches);
      const panDeltaX = currentCenter.x - touchState.initialCenter.x;
      const panDeltaY = currentCenter.y - touchState.initialCenter.y;

      setZoom(newZoom);
      setPan({
        x: touchState.initialPan.x + panDeltaX,
        y: touchState.initialPan.y + panDeltaY
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      setTouchState({
        active: false,
        initialDistance: 0,
        initialZoom: 1,
        initialPan: { x: 0, y: 0 },
        initialCenter: { x: 0, y: 0 }
      });
    }
  };

  // Set up pan event listeners
  // Handlers defined inline to avoid stale closure issues with panStart state
  useEffect(() => {
    if (!isPanning) return;

    const handleMove = (e) => {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    };

    const handleUp = () => {
      setIsPanning(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isPanning, panStart]);

  // Keyboard handler for space+drag panning, Escape for path drawing, and Delete for points
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        // Don't activate if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault(); // Prevent page scroll
        setSpaceHeld(true);
      }

      // Escape cancels path drawing or finishes with Enter
      if (e.code === 'Escape' && pathDrawingMode && activePathId) {
        e.preventDefault();
        cancelPath();
      }
      if (e.code === 'Enter' && pathDrawingMode && activePathId) {
        e.preventDefault();
        finishPath();
      }

      // Escape exits group editing mode
      if (e.code === 'Escape' && editingGroupId) {
        e.preventDefault();
        exitGroup();
      }

      // Delete/Backspace removes selected point from path or blob
      if ((e.code === 'Delete' || e.code === 'Backspace') && selectedShapeId && selectedPointIndex !== null) {
        // Don't activate if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const shape = shapes[selectedShapeId];
        if (shape && (shape.shapeType === 'path' || shape.shapeType === 'blob') && shape.editPointsVisible) {
          e.preventDefault();
          removePointFromPath(selectedShapeId, selectedPointIndex);
          setSelectedPointIndex(null);
        }
      }

      // Cmd/Ctrl+G = Group selected elements
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'g' && !e.shiftKey) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (selectedElementIds.length >= 2) {
          e.preventDefault();
          useSportsDesignStore.getState().groupSelected();
        }
      }

      // Cmd/Ctrl+Shift+G = Ungroup selected group
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'g') {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (selectedGroupId) {
          e.preventDefault();
          useSportsDesignStore.getState().ungroup(selectedGroupId);
        }
      }

      // Cmd/Ctrl+C = Copy selection
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c' && !e.shiftKey) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        const state = useSportsDesignStore.getState();
        if (state.selectedGroupId || state.selectedElementIds.length > 0 || state.selectedShapeId || state.selectedTextId) {
          e.preventDefault();
          state.copySelection();
        }
      }

      // Cmd/Ctrl+V = Paste from clipboard
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'v' && !e.shiftKey) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        const state = useSportsDesignStore.getState();
        if (state.clipboard) {
          e.preventDefault();
          state.pasteClipboard();
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setSpaceHeld(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pathDrawingMode, activePathId, cancelPath, finishPath, selectedShapeId, selectedPointIndex, shapes, removePointFromPath, selectedElementIds, selectedGroupId, editingGroupId, exitGroup]);

  // Track mouse position for path drawing preview line
  const handleCanvasMouseMove = (e) => {
    if (pathDrawingMode && activePathId) {
      const svgPoint = screenToSVG(e.clientX, e.clientY);
      setDrawingMousePos(svgPoint);
    }
  };

  // Get active path for preview line
  const activePath = pathDrawingMode && activePathId ? shapes[activePathId] : null;
  const lastPoint = activePath?.controlPoints?.length > 0
    ? activePath.controlPoints[activePath.controlPoints.length - 1]
    : null;

  return (
    <div
      className={`court-canvas ${pathDrawingMode ? 'court-canvas--drawing' : ''}`}
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
    >
      {/* Path Drawing Mode Indicator */}
      {pathDrawingMode && (
        <div className="court-canvas__drawing-indicator">
          Click to add points • Double-click or Enter to finish • Escape to cancel
        </div>
      )}

      {/* Zoom Controls */}
      <div className="court-canvas__zoom-controls">
        <button onClick={handleZoomIn} className="court-canvas__zoom-btn" title="Zoom In (Ctrl + Scroll)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        <button onClick={handleZoomOut} className="court-canvas__zoom-btn" title="Zoom Out (Ctrl + Scroll)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="8" y1="11" x2="14" y2="11" />
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
        <button onClick={handleZoomReset} className="court-canvas__zoom-btn" title="Reset View">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6"/>
            <path d="M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
        </button>
        <span className="court-canvas__zoom-level" title="Scroll to pan, Ctrl+Scroll to zoom, Space+Drag to pan">{Math.round(zoom * 100)}%</span>
      </div>

      {/* Zoomable/Pannable Container */}
      <div
        ref={containerRef}
        className="court-canvas__viewport"
        onWheel={handleWheel}
        onMouseDown={handlePanStart}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isPanning ? 'grabbing' : (spaceHeld ? 'grab' : undefined), touchAction: 'none' }}
      >
        <div
          className="court-canvas__transform-wrapper"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <svg
            ref={canvasRef}
            className="court-canvas__svg"
            viewBox={`0 0 ${surface.width_mm} ${surface.length_mm}`}
            preserveAspectRatio="xMidYMid meet"
          >
        {/* Defs section for clipPath and patterns */}
        <defs>
          {/* Custom surface boundary clipPath */}
          {surface.boundary && surface.boundary.type !== 'rectangle' && surface.boundary.controlPoints && (
            <clipPath id="surface-boundary-clip">
              <path d={generateSurfaceBoundaryPath(surface.boundary, surface.width_mm, surface.length_mm)} />
            </clipPath>
          )}
        </defs>

        {/* Surface Background - clipped if custom boundary */}
        <g clipPath={surface.boundary && surface.boundary.type !== 'rectangle' && surface.boundary.controlPoints ? 'url(#surface-boundary-clip)' : undefined}>
          <rect
            x="0"
            y="0"
            width={surface.width_mm}
            height={surface.length_mm}
            fill={surface.color.hex}
            className="court-canvas__surface"
          />
        </g>

        {/* Boundary outline for non-rectangular surfaces */}
        {surface.boundary && surface.boundary.type !== 'rectangle' && surface.boundary.controlPoints && (
          <path
            d={generateSurfaceBoundaryPath(surface.boundary, surface.width_mm, surface.length_mm)}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="60"
            strokeDasharray="300 200"
            pointerEvents="none"
          />
        )}

        {/* Exclusion Zones - rendered on top of surface, below elements */}
        {Object.values(exclusionZones).map(zone => {
          if (zone.visible === false) return null;
          return (
            <ExclusionZoneElement
              key={zone.id}
              zone={zone}
              isSelected={zone.id === selectedExclusionZoneId}
              onMouseDown={(e) => handleExclusionZoneMouseDown(e, zone.id)}
              onTouchStart={(e) => handleExclusionZoneMouseDown(e, zone.id)}
              onDoubleClick={(e) => handleExclusionZoneDoubleClick(e, zone.id)}
              onScaleStart={(e, corner) => handleExclusionZoneScaleStart(e, zone.id, corner)}
              onRotateStart={(e) => handleExclusionZoneRotateStart(e, zone.id)}
            />
          );
        })}

        {/* Render Elements in Unified Layer Order */}
        {elementOrder.map(elementId => {
          // Check if it's a court
          if (elementId.startsWith('court-')) {
            const court = courts[elementId];
            if (!court) return null;
            // Skip hidden courts
            if (court.visible === false) return null;

            const isCourtSelected = elementId === selectedCourtId || selectedElementIds.includes(elementId);
            return (
              <CourtElement
                key={elementId}
                court={court}
                isSelected={isCourtSelected}
                onMouseDown={(e) => handleCourtMouseDown(e, elementId)}
                onTouchStart={(e) => handleCourtMouseDown(e, elementId)}
                onDoubleClick={(e) => handleCourtDoubleClick(e, elementId)}
                svgRef={canvasRef}
              />
            );
          }

          // Check if it's a track
          if (elementId.startsWith('track-')) {
            const track = tracks[elementId];
            if (!track) return null;
            // Skip hidden tracks
            if (track.visible === false) return null;

            const isTrackSelected = elementId === selectedTrackId || selectedElementIds.includes(elementId);
            return (
              <TrackElement
                key={elementId}
                track={track}
                isSelected={isTrackSelected}
                onMouseDown={(e) => handleTrackMouseDown(e, elementId)}
                onTouchStart={(e) => handleTrackMouseDown(e, elementId)}
                onDoubleClick={(e) => handleTrackDoubleClick(e, elementId)}
                svgRef={canvasRef}
              />
            );
          }

          // Check if it's a motif
          if (elementId.startsWith('motif-')) {
            const motif = motifs[elementId];
            if (!motif) return null;
            // Skip hidden motifs
            if (motif.visible === false) return null;

            const isMotifSelected = elementId === selectedMotifId || selectedElementIds.includes(elementId);
            return (
              <MotifElement
                key={elementId}
                motif={motif}
                isSelected={isMotifSelected}
                onMouseDown={(e) => handleMotifMouseDown(e, elementId)}
                onTouchStart={(e) => handleMotifMouseDown(e, elementId)}
                onDoubleClick={(e) => handleMotifDoubleClick(e, elementId)}
                onScaleStart={(e, corner) => handleMotifScaleStart(e, elementId, corner)}
                onRotateStart={(e) => handleMotifRotateStart(e, elementId)}
              />
            );
          }

          // Check if it's a shape
          if (elementId.startsWith('shape-')) {
            const shape = shapes[elementId];
            if (!shape) return null;
            // Skip hidden shapes
            if (shape.visible === false) return null;

            // Check if this shape is selected (single or multi-selection)
            const isShapeSelected = elementId === selectedShapeId || selectedElementIds.includes(elementId);

            // Render blob shapes with BlobElement
            if (shape.shapeType === 'blob') {
              return (
                <BlobElement
                  key={elementId}
                  shape={shape}
                  isSelected={isShapeSelected}
                  onMouseDown={(e) => handleShapeMouseDown(e, elementId)}
                  onTouchStart={(e) => handleShapeMouseDown(e, elementId)}
                  onDoubleClick={(e) => handleShapeDoubleClick(e, elementId)}
                  onScaleStart={(e, corner) => handleShapeScaleStart(e, elementId, corner)}
                  onRotateStart={(e) => handleShapeRotateStart(e, elementId)}
                  onPointDrag={(index, newX, newY) => updateBlobControlPoint(elementId, index, newX, newY)}
                  onHandleDrag={(index, handleType, offsetX, offsetY) => updateBlobHandle(elementId, index, handleType, offsetX, offsetY)}
                  onDragEnd={() => commitBlobEdit()}
                  selectedPointIndex={elementId === selectedShapeId ? selectedPointIndex : null}
                  onPointSelect={(index) => setSelectedPointIndex(index)}
                  onPointDelete={(index) => removePointFromPath(elementId, index)}
                />
              );
            }

            // Render path shapes with PathElement
            if (shape.shapeType === 'path') {
              return (
                <PathElement
                  key={elementId}
                  shape={shape}
                  isSelected={isShapeSelected}
                  onMouseDown={(e) => handleShapeMouseDown(e, elementId)}
                  onTouchStart={(e) => handleShapeMouseDown(e, elementId)}
                  onDoubleClick={(e) => handleShapeDoubleClick(e, elementId)}
                  onScaleStart={(e, corner) => handleShapeScaleStart(e, elementId, corner)}
                  onRotateStart={(e) => handleShapeRotateStart(e, elementId)}
                  onPointDrag={(index, newX, newY) => updatePathControlPoint(elementId, index, newX, newY)}
                  onHandleDrag={(index, handleType, offsetX, offsetY) => updatePathHandle(elementId, index, handleType, offsetX, offsetY)}
                  onDragEnd={() => commitPathEdit()}
                  selectedPointIndex={elementId === selectedShapeId ? selectedPointIndex : null}
                  onPointSelect={(index) => setSelectedPointIndex(index)}
                  onPointDelete={(index) => removePointFromPath(elementId, index)}
                />
              );
            }

            // Render polygon shapes with ShapeElement
            return (
              <ShapeElement
                key={elementId}
                shape={shape}
                isSelected={isShapeSelected}
                onMouseDown={(e) => handleShapeMouseDown(e, elementId)}
                onTouchStart={(e) => handleShapeMouseDown(e, elementId)}
                onDoubleClick={(e) => handleShapeDoubleClick(e, elementId)}
                onScaleStart={(e, corner) => handleShapeScaleStart(e, elementId, corner)}
                onRotateStart={(e) => handleShapeRotateStart(e, elementId)}
              />
            );
          }

          // Check if it's a text
          if (elementId.startsWith('text-')) {
            const text = texts[elementId];
            if (!text) return null;
            // Skip hidden texts
            if (text.visible === false) return null;

            return (
              <TextElement
                key={elementId}
                text={text}
                isSelected={elementId === selectedTextId}
                onMouseDown={(e) => handleTextMouseDown(e, elementId)}
                onTouchStart={(e) => handleTextMouseDown(e, elementId)}
                onDoubleClick={(e) => handleTextDoubleClick(e, elementId)}
                onScaleStart={(e, corner) => handleTextScaleStart(e, elementId, corner)}
                onRotateStart={(e) => handleTextRotateStart(e, elementId)}
              />
            );
          }

          // Check if it's a group - render all child elements
          if (elementId.startsWith('group-')) {
            const group = groups[elementId];
            if (!group) return null;
            // Skip hidden groups
            if (group.visible === false) return null;

            // Render all child elements of the group
            return (
              <g key={elementId}>
                {group.childIds.map(childId => {
                  // Render shape children
                  if (childId.startsWith('shape-')) {
                    const shape = shapes[childId];
                    if (!shape) return null;
                    if (shape.visible === false) return null;

                    const isShapeSelected = childId === selectedShapeId || selectedElementIds.includes(childId);

                    if (shape.shapeType === 'blob') {
                      return (
                        <BlobElement
                          key={childId}
                          shape={shape}
                          isSelected={isShapeSelected}
                          onMouseDown={(e) => handleShapeMouseDown(e, childId)}
                          onTouchStart={(e) => handleShapeMouseDown(e, childId)}
                          onDoubleClick={(e) => handleShapeDoubleClick(e, childId)}
                          onScaleStart={(e, corner) => handleShapeScaleStart(e, childId, corner)}
                          onRotateStart={(e) => handleShapeRotateStart(e, childId)}
                          onPointDrag={(index, newX, newY) => updateBlobControlPoint(childId, index, newX, newY)}
                          onHandleDrag={(index, handleType, offsetX, offsetY) => updateBlobHandle(childId, index, handleType, offsetX, offsetY)}
                          onDragEnd={() => commitBlobEdit()}
                          selectedPointIndex={childId === selectedShapeId ? selectedPointIndex : null}
                          onPointSelect={(index) => setSelectedPointIndex(index)}
                          onPointDelete={(index) => removePointFromPath(childId, index)}
                        />
                      );
                    }

                    if (shape.shapeType === 'path') {
                      return (
                        <PathElement
                          key={childId}
                          shape={shape}
                          isSelected={isShapeSelected}
                          onMouseDown={(e) => handleShapeMouseDown(e, childId)}
                          onTouchStart={(e) => handleShapeMouseDown(e, childId)}
                          onDoubleClick={(e) => handleShapeDoubleClick(e, childId)}
                          onScaleStart={(e, corner) => handleShapeScaleStart(e, childId, corner)}
                          onRotateStart={(e) => handleShapeRotateStart(e, childId)}
                          onPointDrag={(index, newX, newY) => updatePathControlPoint(childId, index, newX, newY)}
                          onHandleDrag={(index, handleType, offsetX, offsetY) => updatePathHandle(childId, index, handleType, offsetX, offsetY)}
                          onDragEnd={() => commitPathEdit()}
                          selectedPointIndex={childId === selectedShapeId ? selectedPointIndex : null}
                          onPointSelect={(index) => setSelectedPointIndex(index)}
                          onPointDelete={(index) => removePointFromPath(childId, index)}
                        />
                      );
                    }

                    return (
                      <ShapeElement
                        key={childId}
                        shape={shape}
                        isSelected={isShapeSelected}
                        onMouseDown={(e) => handleShapeMouseDown(e, childId)}
                        onTouchStart={(e) => handleShapeMouseDown(e, childId)}
                        onDoubleClick={(e) => handleShapeDoubleClick(e, childId)}
                        onScaleStart={(e, corner) => handleShapeScaleStart(e, childId, corner)}
                        onRotateStart={(e) => handleShapeRotateStart(e, childId)}
                      />
                    );
                  }

                  // Render text children
                  if (childId.startsWith('text-')) {
                    const text = texts[childId];
                    if (!text) return null;
                    if (text.visible === false) return null;

                    return (
                      <TextElement
                        key={childId}
                        text={text}
                        isSelected={childId === selectedTextId}
                        onMouseDown={(e) => handleTextMouseDown(e, childId)}
                        onTouchStart={(e) => handleTextMouseDown(e, childId)}
                        onDoubleClick={(e) => handleTextDoubleClick(e, childId)}
                        onScaleStart={(e, corner) => handleTextScaleStart(e, childId, corner)}
                        onRotateStart={(e) => handleTextRotateStart(e, childId)}
                      />
                    );
                  }

                  // Render court children
                  if (childId.startsWith('court-')) {
                    const court = courts[childId];
                    if (!court) return null;
                    if (court.visible === false) return null;

                    const isCourtSelected = childId === selectedCourtId || selectedElementIds.includes(childId);
                    return (
                      <CourtElement
                        key={childId}
                        court={court}
                        isSelected={isCourtSelected}
                        onMouseDown={(e) => handleCourtMouseDown(e, childId)}
                        onTouchStart={(e) => handleCourtMouseDown(e, childId)}
                        onDoubleClick={(e) => handleCourtDoubleClick(e, childId)}
                        svgRef={canvasRef}
                      />
                    );
                  }

                  // Render track children
                  if (childId.startsWith('track-')) {
                    const track = tracks[childId];
                    if (!track) return null;
                    if (track.visible === false) return null;

                    const isTrackSelected = childId === selectedTrackId || selectedElementIds.includes(childId);
                    return (
                      <TrackElement
                        key={childId}
                        track={track}
                        isSelected={isTrackSelected}
                        onMouseDown={(e) => handleTrackMouseDown(e, childId)}
                        onTouchStart={(e) => handleTrackMouseDown(e, childId)}
                        onDoubleClick={(e) => handleTrackDoubleClick(e, childId)}
                        svgRef={canvasRef}
                      />
                    );
                  }

                  // Render motif children
                  if (childId.startsWith('motif-')) {
                    const motif = motifs[childId];
                    if (!motif) return null;
                    if (motif.visible === false) return null;

                    const isMotifSelected = childId === selectedMotifId || selectedElementIds.includes(childId);
                    return (
                      <MotifElement
                        key={childId}
                        motif={motif}
                        isSelected={isMotifSelected}
                        onMouseDown={(e) => handleMotifMouseDown(e, childId)}
                        onTouchStart={(e) => handleMotifMouseDown(e, childId)}
                        onDoubleClick={(e) => handleMotifDoubleClick(e, childId)}
                        onScaleStart={(e, corner) => handleMotifScaleStart(e, childId, corner)}
                        onRotateStart={(e) => handleMotifRotateStart(e, childId)}
                      />
                    );
                  }

                  return null;
                })}
              </g>
            );
          }

          return null;
        })}

        {/* Render Group Bounding Boxes */}
        {Object.keys(groups).map(groupId => (
          <GroupElement
            key={groupId}
            groupId={groupId}
            scale={zoom}
            screenToSVG={screenToSVG}
            onDragStart={(gId, offset) => {
              setDragStart(offset);
              setDragGroupId(gId);
              setIsDragging(true);
            }}
            onScaleStart={(e, gId, corner) => handleGroupScaleStart(e, gId, corner)}
            onRotateStart={(e, gId) => handleGroupRotateStart(e, gId)}
          />
        ))}

        {/* Preview line while drawing path */}
        {pathDrawingMode && activePath && lastPoint && drawingMousePos && (
          <line
            x1={activePath.position.x + lastPoint.x * activePath.width_mm}
            y1={activePath.position.y + lastPoint.y * activePath.height_mm}
            x2={drawingMousePos.x}
            y2={drawingMousePos.y}
            stroke="#3b82f6"
            strokeWidth="50"
            strokeDasharray="100 100"
            opacity="0.6"
            pointerEvents="none"
          />
        )}

        {/* Preview dots for placed points while drawing */}
        {pathDrawingMode && activePath && activePath.controlPoints?.map((point, index) => (
          <circle
            key={`preview-point-${index}`}
            cx={activePath.position.x + point.x * activePath.width_mm}
            cy={activePath.position.y + point.y * activePath.height_mm}
            r="80"
            fill="#3b82f6"
            stroke="#fff"
            strokeWidth="20"
            pointerEvents="none"
          />
        ))}
          </svg>
        </div>
      </div>

      {/* Canvas Info Overlay */}
      <div className="court-canvas__info">
        <span>
          {(surface.width_mm / 1000).toFixed(1)}m × {(surface.length_mm / 1000).toFixed(1)}m
        </span>
        {snapToGrid && (
          <span className="court-canvas__grid-indicator">
            Grid: {gridSize_mm}mm
          </span>
        )}
      </div>

      {/* Empty Canvas Guidance */}
      {elementOrder.length === 0 && (
        <div className="court-canvas__empty-state">
          <div className="court-canvas__empty-icon">
            {/* Sparkle/design icon */}
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.4 8.4L21 9.6L16.2 14.4L17.6 21L12 17.6L6.4 21L7.8 14.4L3 9.6L9.6 8.4L12 2Z"
                    fill="rgba(255,255,255,0.15)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="19" cy="5" r="1.5" fill="currentColor" opacity="0.6"/>
              <circle cx="5" cy="18" r="1" fill="currentColor" opacity="0.4"/>
              <circle cx="20" cy="16" r="0.8" fill="currentColor" opacity="0.5"/>
            </svg>
          </div>
          <h3 className="court-canvas__empty-title">Your canvas is ready</h3>
          <p className="court-canvas__empty-text">
            Design your perfect TPV surface in minutes
          </p>
          <div className="court-canvas__empty-hints">
            <div className="court-canvas__hint">
              <span className="court-canvas__hint-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <line x1="9" y1="3" x2="9" y2="21"/>
                </svg>
              </span>
              <span>Add <strong>Courts</strong>, <strong>Tracks</strong>, <strong>Shapes</strong> or <strong>Designs</strong></span>
            </div>
            <div className="court-canvas__hint">
              <span className="court-canvas__hint-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </span>
              <span>Click elements in the library to place them</span>
            </div>
            <div className="court-canvas__hint">
              <span className="court-canvas__hint-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 9l4 4-4 4"/>
                  <path d="M12 4h7a2 2 0 012 2v12a2 2 0 01-2 2h-7"/>
                </svg>
              </span>
              <span>Arrange, customise colours and export</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

/**
 * Individual court element component
 */
function CourtElement({ court, isSelected, onMouseDown, onTouchStart, onDoubleClick, svgRef }) {
  const { markings, zones } = generateCourtSVG(court);

  // Get court surface color (if set) - this colors the entire court area
  const courtSurfaceColor = court.courtSurfaceColor?.hex || null;

  return (
    <g
      className={`court-canvas__court ${isSelected ? 'court-canvas__court--selected' : ''}`}
      transform={getCourtTransformString(court)}
      style={{ cursor: 'move' }}
    >
      {/* Court surface fill - renders behind all other elements */}
      {courtSurfaceColor && (
        <rect
          x="0"
          y="0"
          width={court.template.dimensions.width_mm}
          height={court.template.dimensions.length_mm}
          fill={courtSurfaceColor}
          className="court-canvas__court-surface"
        />
      )}

      {/* Invisible clickable area - captures all mouse/touch events */}
      <rect
        x="0"
        y="0"
        width={court.template.dimensions.width_mm}
        height={court.template.dimensions.length_mm}
        fill="none"
        pointerEvents="all"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onDoubleClick={onDoubleClick}
        style={{ cursor: 'move' }}
      />

      {/* Zones (filled areas) - render first so they're behind lines */}
      {zones.map(zone => (
        <ZoneElement key={zone.id} zone={zone} />
      ))}

      {/* Line Markings - render on top */}
      {markings.map(marking => (
        <MarkingElement key={marking.id} marking={marking} />
      ))}

      {/* Selection indicator */}
      {isSelected && (
        <>
          <rect
            x="0"
            y="0"
            width={court.template.dimensions.width_mm}
            height={court.template.dimensions.length_mm}
            fill="none"
            stroke="#007bff"
            strokeWidth="100"
            strokeDasharray="400 400"
            className="court-canvas__selection-outline"
          />
          {/* Transform handles for rotation and scaling */}
          <TransformHandles court={court} svgRef={svgRef} />
        </>
      )}
    </g>
  );
}

/**
 * Render a zone (filled shape)
 */
function ZoneElement({ zone }) {
  switch (zone.type) {
    case 'rect':
      return (
        <rect
          x={zone.x}
          y={zone.y}
          width={zone.width}
          height={zone.height}
          fill={zone.fill}
        />
      );

    case 'circle':
      return (
        <circle
          cx={zone.cx}
          cy={zone.cy}
          r={zone.r}
          fill={zone.fill}
        />
      );

    case 'polygon':
      return (
        <polygon
          points={zone.points}
          fill={zone.fill}
        />
      );

    default:
      return null;
  }
}

/**
 * Render a marking (line, circle, arc, etc.)
 */
function MarkingElement({ marking }) {
  switch (marking.type) {
    case 'line':
      return (
        <line
          x1={marking.x1}
          y1={marking.y1}
          x2={marking.x2}
          y2={marking.y2}
          stroke={marking.stroke}
          strokeWidth={marking.strokeWidth}
        />
      );

    case 'rect':
      return (
        <rect
          x={marking.x}
          y={marking.y}
          width={marking.width}
          height={marking.height}
          stroke={marking.stroke}
          strokeWidth={marking.strokeWidth}
          fill={marking.fill}
        />
      );

    case 'circle':
      return (
        <circle
          cx={marking.cx}
          cy={marking.cy}
          r={marking.r}
          stroke={marking.stroke}
          strokeWidth={marking.strokeWidth}
          fill={marking.fill}
        />
      );

    case 'path':
      return (
        <path
          d={marking.d}
          stroke={marking.stroke}
          strokeWidth={marking.strokeWidth}
          fill={marking.fill}
        />
      );

    case 'polyline':
      return (
        <polyline
          points={marking.points}
          stroke={marking.stroke}
          strokeWidth={marking.strokeWidth}
          fill={marking.fill}
        />
      );

    default:
      return null;
  }
}

export default CourtCanvas;
