// TPV Studio - Court Canvas Component
import React, { useRef, useState, useEffect } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { generateCourtSVG } from '../../lib/sports/courtTemplates.js';
import { snapPositionToGrid, constrainPosition } from '../../lib/sports/geometryUtils.js';
import './CourtCanvas.css';

function CourtCanvas() {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragCourtId, setDragCourtId] = useState(null);

  const {
    surface,
    courts,
    courtOrder,
    selectedCourtId,
    snapToGrid,
    gridSize_mm,
    selectCourt,
    deselectCourt,
    updateCourtPosition
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

    // Convert screen coordinates to SVG coordinates
    const svgPoint = screenToSVG(e.clientX, e.clientY);
    const court = courts[courtId];

    setDragStart({
      x: svgPoint.x - court.position.x,
      y: svgPoint.y - court.position.y
    });
    setDragCourtId(courtId);
    setIsDragging(true);
  };

  // Handle mouse move (drag court)
  useEffect(() => {
    if (!isDragging || !dragCourtId) return;

    const handleMouseMove = (e) => {
      // Convert screen coordinates to SVG coordinates
      const svgPoint = screenToSVG(e.clientX, e.clientY);

      let newPosition = {
        x: svgPoint.x - dragStart.x,
        y: svgPoint.y - dragStart.y
      };

      // Snap to grid if enabled
      if (snapToGrid) {
        newPosition = snapPositionToGrid(newPosition, gridSize_mm);
      }

      // Constrain to surface bounds
      const court = courts[dragCourtId];
      const courtDimensions = {
        width_mm: court.template.dimensions.width_mm * court.scale,
        length_mm: court.template.dimensions.length_mm * court.scale
      };

      newPosition = constrainPosition(newPosition, courtDimensions, surface);

      updateCourtPosition(dragCourtId, newPosition);
    };

    const handleMouseUp = () => {
      // Add to history when drag completes
      if (dragCourtId) {
        const { addToHistory } = useSportsDesignStore.getState();
        addToHistory();
      }

      setIsDragging(false);
      setDragCourtId(null);
      setDragStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragCourtId, dragStart, courts, snapToGrid, gridSize_mm, surface, updateCourtPosition]);

  // Handle click on canvas background (deselect)
  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      deselectCourt();
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

        {/* Render Courts in Order */}
        {courtOrder.map(courtId => {
          const court = courts[courtId];
          if (!court) return null;

          return (
            <CourtElement
              key={courtId}
              court={court}
              isSelected={courtId === selectedCourtId}
              onMouseDown={(e) => handleCourtMouseDown(e, courtId)}
            />
          );
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
}

/**
 * Individual court element component
 */
function CourtElement({ court, isSelected, onMouseDown }) {
  const { markings, zones } = generateCourtSVG(court);
  const { position, rotation, scale } = court;

  return (
    <g
      className={`court-canvas__court ${isSelected ? 'court-canvas__court--selected' : ''}`}
      transform={`translate(${position.x}, ${position.y}) scale(${scale})`}
      style={{ cursor: 'move' }}
    >
      {/* Invisible clickable area - captures all mouse events */}
      <rect
        x="0"
        y="0"
        width={court.template.dimensions.width_mm}
        height={court.template.dimensions.length_mm}
        fill="transparent"
        onMouseDown={onMouseDown}
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
        <rect
          x="0"
          y="0"
          width={court.template.dimensions.width_mm}
          height={court.template.dimensions.length_mm}
          fill="none"
          stroke="#007bff"
          strokeWidth="50"
          strokeDasharray="200 200"
          className="court-canvas__selection-outline"
        />
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
