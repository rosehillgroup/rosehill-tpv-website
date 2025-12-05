// TPV Studio - Court Canvas Component
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { generateCourtSVG } from '../../lib/sports/courtTemplates.js';
import { snapPositionToGrid, constrainPosition, getCourtTransformString } from '../../lib/sports/geometryUtils.js';
import TransformHandles from './TransformHandles.jsx';
import TrackElement from './TrackRenderer.jsx';
import MotifElement from './MotifElement.jsx';
import ShapeElement from './ShapeElement.jsx';
import BlobElement from './BlobElement.jsx';
import TextElement from './TextElement.jsx';
import { measureText } from '../../lib/sports/textUtils.js';
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

  const {
    surface,
    courts,
    tracks,
    motifs,
    shapes,
    texts,
    elementOrder,
    selectedCourtId,
    selectedTrackId,
    selectedMotifId,
    selectedShapeId,
    selectedTextId,
    editingTextId,
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
    startEditingText,
    stopEditingText,
    updateCourtPosition,
    updateTrackPosition,
    updateMotifPosition,
    updateMotifScale,
    updateMotifRotation,
    updateShapePosition,
    updateShapeDimensions,
    updateShapeRotation,
    updateTextPosition,
    updateTextFontSize,
    updateTextRotation,
    updateTextContent,
    updateBlobControlPoint,
    updateBlobHandle,
    commitBlobEdit
  } = useSportsDesignStore();

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = (screenX, screenY) => {
    const svg = canvasRef.current;
    const pt = svg.createSVGPoint();
    pt.x = screenX;
    pt.y = screenY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: svgP.x, y: svgP.y };
  };

  // Handle mouse/touch down on court (start drag)
  const handleCourtMouseDown = (e, courtId) => {
    e.stopPropagation();

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
  const handleShapeMouseDown = (e, shapeId) => {
    e.stopPropagation();

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

    // Calculate the anchor point (opposite corner that should stay fixed)
    let anchorPoint;
    switch (corner) {
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

    // Don't start drag if already editing this text
    if (editingTextId === textId) return;

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

  // Handle double-click on text (enter inline edit mode)
  const handleTextDoubleClick = (e, textId) => {
    e.stopPropagation();
    selectText(textId);
    startEditingText(textId);
  };

  // Handle scale start on text corner handle (changes font size)
  const handleTextScaleStart = (e, textId, corner) => {
    e.stopPropagation();

    const text = texts[textId];
    if (!text || text.locked) return;

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);
    const bounds = measureText(text.content, text.fontFamily, text.fontSize_mm, text.fontWeight, text.fontStyle);

    // Calculate text bounds based on alignment
    let boxX = text.position.x;
    if (text.textAlign === 'center') boxX -= bounds.width / 2;
    else if (text.textAlign === 'right') boxX -= bounds.width;

    const boxY = text.position.y - text.fontSize_mm;

    // Calculate anchor point (opposite corner)
    let anchorPoint;
    switch (corner) {
      case 'nw':
        anchorPoint = { x: boxX + bounds.width, y: boxY + text.fontSize_mm * 1.2 };
        break;
      case 'ne':
        anchorPoint = { x: boxX, y: boxY + text.fontSize_mm * 1.2 };
        break;
      case 'sw':
        anchorPoint = { x: boxX + bounds.width, y: boxY };
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
      originalFontSize: text.fontSize_mm,
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

  // Reset drag state when surface dimensions change
  useEffect(() => {
    setIsDragging(false);
    setDragCourtId(null);
    setDragTrackId(null);
    setDragMotifId(null);
    setDragShapeId(null);
    setDragTextId(null);
    setDragStart(null);
  }, [surface.width_mm, surface.length_mm]);

  // Handle mouse/touch move (drag court, track, motif, shape, or text)
  useEffect(() => {
    if (!isDragging || (!dragCourtId && !dragTrackId && !dragMotifId && !dragShapeId && !dragTextId)) return;

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
      }
    };

    const handleEnd = () => {
      // Add to history when drag completes
      if (dragCourtId || dragTrackId || dragMotifId || dragShapeId || dragTextId) {
        const { addToHistory } = useSportsDesignStore.getState();
        addToHistory();
      }

      setIsDragging(false);
      setDragCourtId(null);
      setDragTrackId(null);
      setDragMotifId(null);
      setDragShapeId(null);
      setDragTextId(null);
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
  }, [isDragging, dragCourtId, dragTrackId, dragMotifId, dragShapeId, dragTextId, dragStart, courts, tracks, motifs, shapes, texts, snapToGrid, gridSize_mm, surface, updateCourtPosition, updateTrackPosition, updateMotifPosition, updateShapePosition, updateTextPosition]);

  // Handle mouse move/up for motif scaling
  useEffect(() => {
    if (!isScaling || !scaleMotifId || !scaleStart) return;

    const handleMouseMove = (e) => {
      const svgPoint = screenToSVG(e.clientX, e.clientY);
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

    const handleMouseUp = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsScaling(false);
      setScaleMotifId(null);
      setScaleStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScaling, scaleMotifId, scaleStart, motifs, updateMotifScale, updateMotifPosition]);

  // Handle mouse move/up for motif rotation
  useEffect(() => {
    if (!isRotating || !rotateMotifId || !rotateStart) return;

    const handleMouseMove = (e) => {
      const svgPoint = screenToSVG(e.clientX, e.clientY);

      // Calculate current angle from center to mouse
      const currentAngle = Math.atan2(
        svgPoint.y - rotateStart.motifCenter.y,
        svgPoint.x - rotateStart.motifCenter.x
      ) * (180 / Math.PI);

      // Calculate rotation delta
      const angleDelta = currentAngle - rotateStart.initialAngle;
      let newRotation = rotateStart.originalRotation + angleDelta;

      // Normalize to 0-360 range
      newRotation = ((newRotation % 360) + 360) % 360;

      // Snap to 15-degree increments if shift is held
      if (e.shiftKey) {
        newRotation = Math.round(newRotation / 15) * 15;
      }

      // Round to 1 decimal place
      newRotation = Math.round(newRotation * 10) / 10;

      updateMotifRotation(rotateMotifId, newRotation);
    };

    const handleMouseUp = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsRotating(false);
      setRotateMotifId(null);
      setRotateStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isRotating, rotateMotifId, rotateStart, updateMotifRotation]);

  // Handle mouse move/up for shape scaling
  useEffect(() => {
    if (!isScalingShape || !scaleShapeId || !scaleShapeStart) return;

    const handleMouseMove = (e) => {
      const svgPoint = screenToSVG(e.clientX, e.clientY);
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
      if (scaleShapeStart.aspectLocked) {
        // Maintain aspect ratio
        newWidth = scaleShapeStart.originalWidth * scaleRatio;
        newHeight = scaleShapeStart.originalHeight * scaleRatio;
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
      switch (scaleShapeStart.corner) {
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

    const handleMouseUp = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsScalingShape(false);
      setScaleShapeId(null);
      setScaleShapeStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScalingShape, scaleShapeId, scaleShapeStart, shapes, updateShapeDimensions, updateShapePosition]);

  // Handle mouse move/up for shape rotation
  useEffect(() => {
    if (!isRotatingShape || !rotateShapeId || !rotateShapeStart) return;

    const handleMouseMove = (e) => {
      const svgPoint = screenToSVG(e.clientX, e.clientY);

      // Calculate current angle from center to mouse
      const currentAngle = Math.atan2(
        svgPoint.y - rotateShapeStart.shapeCenter.y,
        svgPoint.x - rotateShapeStart.shapeCenter.x
      ) * (180 / Math.PI);

      // Calculate rotation delta
      const angleDelta = currentAngle - rotateShapeStart.initialAngle;
      let newRotation = rotateShapeStart.originalRotation + angleDelta;

      // Normalize to 0-360 range
      newRotation = ((newRotation % 360) + 360) % 360;

      // Snap to 15-degree increments if shift is held
      if (e.shiftKey) {
        newRotation = Math.round(newRotation / 15) * 15;
      }

      // Round to 1 decimal place
      newRotation = Math.round(newRotation * 10) / 10;

      updateShapeRotation(rotateShapeId, newRotation);
    };

    const handleMouseUp = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsRotatingShape(false);
      setRotateShapeId(null);
      setRotateShapeStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isRotatingShape, rotateShapeId, rotateShapeStart, updateShapeRotation]);

  // Handle mouse move/up for text scaling (font size)
  useEffect(() => {
    if (!isScalingText || !scaleTextId || !scaleTextStart) return;

    const handleMouseMove = (e) => {
      const svgPoint = screenToSVG(e.clientX, e.clientY);
      const text = texts[scaleTextId];
      if (!text) return;

      // Calculate current distance from anchor point to mouse
      const currentDistance = Math.sqrt(
        Math.pow(svgPoint.x - scaleTextStart.anchorPoint.x, 2) +
        Math.pow(svgPoint.y - scaleTextStart.anchorPoint.y, 2)
      );

      // Calculate new font size based on distance ratio
      const scaleRatio = currentDistance / scaleTextStart.initialDistance;
      let newFontSize = scaleTextStart.originalFontSize * scaleRatio;

      // Minimum font size of 50mm
      newFontSize = Math.max(50, newFontSize);

      // Round to whole mm
      newFontSize = Math.round(newFontSize);

      updateTextFontSize(scaleTextId, newFontSize);
    };

    const handleMouseUp = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsScalingText(false);
      setScaleTextId(null);
      setScaleTextStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScalingText, scaleTextId, scaleTextStart, texts, updateTextFontSize]);

  // Handle mouse move/up for text rotation
  useEffect(() => {
    if (!isRotatingText || !rotateTextId || !rotateTextStart) return;

    const handleMouseMove = (e) => {
      const svgPoint = screenToSVG(e.clientX, e.clientY);

      // Calculate current angle from center to mouse
      const currentAngle = Math.atan2(
        svgPoint.y - rotateTextStart.textCenter.y,
        svgPoint.x - rotateTextStart.textCenter.x
      ) * (180 / Math.PI);

      // Calculate rotation delta
      const angleDelta = currentAngle - rotateTextStart.initialAngle;
      let newRotation = rotateTextStart.originalRotation + angleDelta;

      // Normalize to 0-360 range
      newRotation = ((newRotation % 360) + 360) % 360;

      // Snap to 15-degree increments if shift is held
      if (e.shiftKey) {
        newRotation = Math.round(newRotation / 15) * 15;
      }

      // Round to 1 decimal place
      newRotation = Math.round(newRotation * 10) / 10;

      updateTextRotation(rotateTextId, newRotation);
    };

    const handleMouseUp = () => {
      const { addToHistory } = useSportsDesignStore.getState();
      addToHistory();

      setIsRotatingText(false);
      setRotateTextId(null);
      setRotateTextStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isRotatingText, rotateTextId, rotateTextStart, updateTextRotation]);

  // Handle click on canvas background (deselect)
  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      deselectCourt();
      deselectTrack();
      deselectMotif();
      deselectShape();
      deselectText();
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
  useEffect(() => {
    if (isPanning) {
      const handleMove = (e) => handlePanMove(e);
      const handleUp = () => handlePanEnd();

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);

      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };
    }
  }, [isPanning, panStart]);

  // Keyboard handler for space+drag panning
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        // Don't activate if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        e.preventDefault(); // Prevent page scroll
        setSpaceHeld(true);
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
  }, []);

  return (
    <div className="court-canvas" onClick={handleCanvasClick}>
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
        {/* Surface Background */}
        <rect
          x="0"
          y="0"
          width={surface.width_mm}
          height={surface.length_mm}
          fill={surface.color.hex}
          className="court-canvas__surface"
        />

        {/* Render Elements in Unified Layer Order */}
        {elementOrder.map(elementId => {
          // Check if it's a court
          if (elementId.startsWith('court-')) {
            const court = courts[elementId];
            if (!court) return null;
            // Skip hidden courts
            if (court.visible === false) return null;

            return (
              <CourtElement
                key={elementId}
                court={court}
                isSelected={elementId === selectedCourtId}
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

            return (
              <TrackElement
                key={elementId}
                track={track}
                isSelected={elementId === selectedTrackId}
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

            return (
              <MotifElement
                key={elementId}
                motif={motif}
                isSelected={elementId === selectedMotifId}
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

            // Render blob shapes with BlobElement
            if (shape.shapeType === 'blob') {
              return (
                <BlobElement
                  key={elementId}
                  shape={shape}
                  isSelected={elementId === selectedShapeId}
                  onMouseDown={(e) => handleShapeMouseDown(e, elementId)}
                  onTouchStart={(e) => handleShapeMouseDown(e, elementId)}
                  onDoubleClick={(e) => handleShapeDoubleClick(e, elementId)}
                  onScaleStart={(e, corner) => handleShapeScaleStart(e, elementId, corner)}
                  onRotateStart={(e) => handleShapeRotateStart(e, elementId)}
                  onPointDrag={(index, newX, newY) => updateBlobControlPoint(elementId, index, newX, newY)}
                  onHandleDrag={(index, handleType, offsetX, offsetY) => updateBlobHandle(elementId, index, handleType, offsetX, offsetY)}
                  onDragEnd={() => commitBlobEdit()}
                />
              );
            }

            // Render polygon shapes with ShapeElement
            return (
              <ShapeElement
                key={elementId}
                shape={shape}
                isSelected={elementId === selectedShapeId}
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
                isEditing={elementId === editingTextId}
                onMouseDown={(e) => handleTextMouseDown(e, elementId)}
                onTouchStart={(e) => handleTextMouseDown(e, elementId)}
                onDoubleClick={(e) => handleTextDoubleClick(e, elementId)}
                onScaleStart={(e, corner) => handleTextScaleStart(e, elementId, corner)}
                onRotateStart={(e) => handleTextRotateStart(e, elementId)}
                onContentChange={(content) => updateTextContent(elementId, content)}
                onEditComplete={() => stopEditingText()}
              />
            );
          }

          return null;
        })}
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
