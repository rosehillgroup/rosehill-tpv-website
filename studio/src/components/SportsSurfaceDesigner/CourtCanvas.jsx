// TPV Studio - Court Canvas Component
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { generateCourtSVG } from '../../lib/sports/courtTemplates.js';
import { snapPositionToGrid, constrainPosition, getCourtTransformString } from '../../lib/sports/geometryUtils.js';
import TransformHandles from './TransformHandles.jsx';
import TrackElement from './TrackRenderer.jsx';
import MotifElement from './MotifElement.jsx';
import './CourtCanvas.css';

const CourtCanvas = forwardRef(function CourtCanvas(props, ref) {
  const canvasRef = useRef(null);

  // Expose the SVG ref to parent
  useImperativeHandle(ref, () => canvasRef.current);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragCourtId, setDragCourtId] = useState(null);
  const [dragTrackId, setDragTrackId] = useState(null);
  const [dragMotifId, setDragMotifId] = useState(null);

  // Motif scaling state
  const [isScaling, setIsScaling] = useState(false);
  const [scaleMotifId, setScaleMotifId] = useState(null);
  const [scaleStart, setScaleStart] = useState(null); // { mousePos, originalScale, corner, motifCenter }

  // Motif rotation state
  const [isRotating, setIsRotating] = useState(false);
  const [rotateMotifId, setRotateMotifId] = useState(null);
  const [rotateStart, setRotateStart] = useState(null); // { mouseAngle, originalRotation, motifCenter }

  const {
    surface,
    courts,
    tracks,
    motifs,
    elementOrder,
    selectedCourtId,
    selectedTrackId,
    selectedMotifId,
    snapToGrid,
    gridSize_mm,
    selectCourt,
    deselectCourt,
    selectTrack,
    deselectTrack,
    selectMotif,
    deselectMotif,
    updateCourtPosition,
    updateTrackPosition,
    updateMotifPosition,
    updateMotifScale,
    updateMotifRotation
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

  // Handle mouse down on court (start drag)
  const handleCourtMouseDown = (e, courtId) => {
    e.stopPropagation();

    selectCourt(courtId);

    const court = courts[courtId];
    // Don't allow dragging locked courts
    if (court?.locked) return;

    // Convert screen coordinates to SVG coordinates
    const svgPoint = screenToSVG(e.clientX, e.clientY);

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

  // Handle mouse down on track (start drag)
  const handleTrackMouseDown = (e, trackId) => {
    e.stopPropagation();

    selectTrack(trackId);

    const track = tracks[trackId];
    // Don't allow dragging locked tracks
    if (track?.locked) return;

    const svgPoint = screenToSVG(e.clientX, e.clientY);

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

  // Handle mouse down on motif (start drag)
  const handleMotifMouseDown = (e, motifId) => {
    e.stopPropagation();

    selectMotif(motifId);

    const motif = motifs[motifId];
    // Don't allow dragging locked motifs
    if (motif?.locked) return;

    const svgPoint = screenToSVG(e.clientX, e.clientY);

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

    const svgPoint = screenToSVG(e.clientX, e.clientY);
    const scaledWidth = motif.originalWidth_mm * (motif.scale || 1);
    const scaledHeight = motif.originalHeight_mm * (motif.scale || 1);

    // Calculate motif center in SVG coordinates
    const motifCenter = {
      x: motif.position.x + scaledWidth / 2,
      y: motif.position.y + scaledHeight / 2
    };

    // Calculate initial distance from center to mouse
    const initialDistance = Math.sqrt(
      Math.pow(svgPoint.x - motifCenter.x, 2) +
      Math.pow(svgPoint.y - motifCenter.y, 2)
    );

    setScaleStart({
      initialDistance,
      originalScale: motif.scale || 1,
      corner,
      motifCenter
    });
    setScaleMotifId(motifId);
    setIsScaling(true);
  };

  // Handle rotation start on motif rotation handle
  const handleMotifRotateStart = (e, motifId) => {
    e.stopPropagation();

    const motif = motifs[motifId];
    if (!motif || motif.locked) return;

    const svgPoint = screenToSVG(e.clientX, e.clientY);
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

  // Reset drag state when surface dimensions change
  useEffect(() => {
    setIsDragging(false);
    setDragCourtId(null);
    setDragTrackId(null);
    setDragMotifId(null);
    setDragStart(null);
  }, [surface.width_mm, surface.length_mm]);

  // Handle mouse move (drag court, track, or motif)
  useEffect(() => {
    if (!isDragging || (!dragCourtId && !dragTrackId && !dragMotifId)) return;

    const handleMouseMove = (e) => {
      const svgPoint = screenToSVG(e.clientX, e.clientY);

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
      }
    };

    const handleMouseUp = () => {
      // Add to history when drag completes
      if (dragCourtId || dragTrackId || dragMotifId) {
        const { addToHistory } = useSportsDesignStore.getState();
        addToHistory();
      }

      setIsDragging(false);
      setDragCourtId(null);
      setDragTrackId(null);
      setDragMotifId(null);
      setDragStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragCourtId, dragTrackId, dragMotifId, dragStart, courts, tracks, motifs, snapToGrid, gridSize_mm, surface, updateCourtPosition, updateTrackPosition, updateMotifPosition]);

  // Handle mouse move/up for motif scaling
  useEffect(() => {
    if (!isScaling || !scaleMotifId || !scaleStart) return;

    const handleMouseMove = (e) => {
      const svgPoint = screenToSVG(e.clientX, e.clientY);
      const motif = motifs[scaleMotifId];
      if (!motif) return;

      // Calculate current distance from original center to mouse
      const currentDistance = Math.sqrt(
        Math.pow(svgPoint.x - scaleStart.motifCenter.x, 2) +
        Math.pow(svgPoint.y - scaleStart.motifCenter.y, 2)
      );

      // Calculate new scale based on distance ratio
      const scaleRatio = currentDistance / scaleStart.initialDistance;
      let newScale = scaleStart.originalScale * scaleRatio;

      // Minimum scale of 0.1, no upper limit
      newScale = Math.max(0.1, newScale);

      // Round to 2 decimal places
      newScale = Math.round(newScale * 100) / 100;

      updateMotifScale(scaleMotifId, newScale);
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
  }, [isScaling, scaleMotifId, scaleStart, motifs, updateMotifScale]);

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

  // Handle click on canvas background (deselect)
  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      deselectCourt();
      deselectTrack();
      deselectMotif();
    }
  };

  return (
    <div className="court-canvas" onClick={handleCanvasClick}>
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
                onDoubleClick={(e) => handleMotifDoubleClick(e, elementId)}
                onScaleStart={(e, corner) => handleMotifScaleStart(e, elementId, corner)}
                onRotateStart={(e) => handleMotifRotateStart(e, elementId)}
              />
            );
          }

          return null;
        })}
      </svg>

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
    </div>
  );
});

/**
 * Individual court element component
 */
function CourtElement({ court, isSelected, onMouseDown, onDoubleClick, svgRef }) {
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

      {/* Invisible clickable area - captures all mouse events */}
      <rect
        x="0"
        y="0"
        width={court.template.dimensions.width_mm}
        height={court.template.dimensions.length_mm}
        fill="none"
        pointerEvents="all"
        onMouseDown={onMouseDown}
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
