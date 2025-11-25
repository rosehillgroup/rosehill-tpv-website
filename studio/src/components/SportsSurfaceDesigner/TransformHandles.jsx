// TPV Studio - Transform Handles for Selected Court
import React, { useState, useEffect } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { normalizeAngle } from '../../lib/sports/geometryUtils.js';

function TransformHandles({ court, svgRef }) {
  const { updateCourtRotation, updateCourtScale, updateCourtPosition, addToHistory } = useSportsDesignStore();

  const [isRotating, setIsRotating] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [scaleHandle, setScaleHandle] = useState(null); // 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'
  const [dragStart, setDragStart] = useState(null);

  const { template, position, rotation, scale } = court;
  const width = template.dimensions.width_mm * scale;
  const height = template.dimensions.length_mm * scale;

  // Calculate center point in SVG coordinates
  const centerX = position.x + (template.dimensions.width_mm * scale) / 2;
  const centerY = position.y + (template.dimensions.length_mm * scale) / 2;

  // Rotation handle position (above top center)
  const rotationHandleDistance = 60 / scale; // Fixed visual distance regardless of scale
  const rotationHandleX = template.dimensions.width_mm / 2;
  const rotationHandleY = -rotationHandleDistance;

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = (screenX, screenY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = screenX;
    pt.y = screenY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    return { x: svgP.x, y: svgP.y };
  };

  // Handle rotation start
  const handleRotationMouseDown = (e) => {
    e.stopPropagation();
    setIsRotating(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle scale start
  const handleScaleMouseDown = (e, handleType) => {
    e.stopPropagation();
    setIsScaling(true);
    setScaleHandle(handleType);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      initialScale: scale,
      initialWidth: width,
      initialHeight: height,
      initialPosition: { ...position }
    });
  };

  // Handle mouse move for rotation and scaling
  useEffect(() => {
    if (!isRotating && !isScaling) return;

    const handleMouseMove = (e) => {
      if (isRotating) {
        // Calculate angle from center to mouse
        const svgPoint = screenToSVG(e.clientX, e.clientY);
        const dx = svgPoint.x - centerX;
        const dy = svgPoint.y - centerY;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // +90 to start from top
        angle = normalizeAngle(angle);

        // Snap to 15° if shift is held
        if (e.shiftKey) {
          angle = Math.round(angle / 15) * 15;
        }

        updateCourtRotation(court.id, angle);
      } else if (isScaling && dragStart) {
        // Calculate scale based on handle type
        const svgPoint = screenToSVG(e.clientX, e.clientY);
        const svgStart = screenToSVG(dragStart.x, dragStart.y);

        const deltaX = svgPoint.x - svgStart.x;
        const deltaY = svgPoint.y - svgStart.y;

        let newScale = dragStart.initialScale;
        let newPosition = { ...position };

        // Calculate scale based on which handle is being dragged
        switch (scaleHandle) {
          case 'se': // Southeast corner - scale from northwest
            newScale = Math.max(0.3, dragStart.initialScale + (deltaX / template.dimensions.width_mm));
            break;
          case 'nw': // Northwest corner - scale from southeast
            newScale = Math.max(0.3, dragStart.initialScale - (deltaX / template.dimensions.width_mm));
            newPosition.x = dragStart.initialPosition.x + (dragStart.initialWidth - template.dimensions.width_mm * newScale);
            newPosition.y = dragStart.initialPosition.y + (dragStart.initialHeight - template.dimensions.length_mm * newScale);
            break;
          case 'ne': // Northeast corner
            newScale = Math.max(0.3, dragStart.initialScale + (deltaX / template.dimensions.width_mm));
            newPosition.y = dragStart.initialPosition.y + (dragStart.initialHeight - template.dimensions.length_mm * newScale);
            break;
          case 'sw': // Southwest corner
            newScale = Math.max(0.3, dragStart.initialScale - (deltaX / template.dimensions.width_mm));
            newPosition.x = dragStart.initialPosition.x + (dragStart.initialWidth - template.dimensions.width_mm * newScale);
            break;
          case 'e': // East edge
            newScale = Math.max(0.3, dragStart.initialScale + (deltaX / template.dimensions.width_mm));
            break;
          case 'w': // West edge
            newScale = Math.max(0.3, dragStart.initialScale - (deltaX / template.dimensions.width_mm));
            newPosition.x = dragStart.initialPosition.x + (dragStart.initialWidth - template.dimensions.width_mm * newScale);
            break;
          case 'n': // North edge
            newScale = Math.max(0.3, dragStart.initialScale - (deltaY / template.dimensions.length_mm));
            newPosition.y = dragStart.initialPosition.y + (dragStart.initialHeight - template.dimensions.length_mm * newScale);
            break;
          case 's': // South edge
            newScale = Math.max(0.3, dragStart.initialScale + (deltaY / template.dimensions.length_mm));
            break;
        }

        // Clamp scale
        newScale = Math.min(3.0, Math.max(0.3, newScale));

        updateCourtScale(court.id, newScale);
        if (newPosition.x !== position.x || newPosition.y !== position.y) {
          updateCourtPosition(court.id, newPosition);
        }
      }
    };

    const handleMouseUp = () => {
      if (isRotating || isScaling) {
        addToHistory();
      }
      setIsRotating(false);
      setIsScaling(false);
      setScaleHandle(null);
      setDragStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isRotating, isScaling, dragStart, centerX, centerY, court.id, position, scale, scaleHandle]);

  // Scale handles positions (corners and edges)
  const handles = [
    { type: 'nw', x: 0, y: 0, cursor: 'nwse-resize' },
    { type: 'n', x: template.dimensions.width_mm / 2, y: 0, cursor: 'ns-resize' },
    { type: 'ne', x: template.dimensions.width_mm, y: 0, cursor: 'nesw-resize' },
    { type: 'e', x: template.dimensions.width_mm, y: template.dimensions.length_mm / 2, cursor: 'ew-resize' },
    { type: 'se', x: template.dimensions.width_mm, y: template.dimensions.length_mm, cursor: 'nwse-resize' },
    { type: 's', x: template.dimensions.width_mm / 2, y: template.dimensions.length_mm, cursor: 'ns-resize' },
    { type: 'sw', x: 0, y: template.dimensions.length_mm, cursor: 'nesw-resize' },
    { type: 'w', x: 0, y: template.dimensions.length_mm / 2, cursor: 'ew-resize' },
  ];

  const handleSize = 20 / scale; // Larger handles for better interactivity
  const rotationHandleSize = 15 / scale;

  return (
    <g className="transform-handles">
      {/* Rotation Handle */}
      <g
        className="rotation-handle"
        onMouseDown={handleRotationMouseDown}
        style={{ cursor: isRotating ? 'grabbing' : 'grab' }}
      >
        <line
          x1={rotationHandleX}
          y1={0}
          x2={rotationHandleX}
          y2={rotationHandleY + rotationHandleSize}
          stroke="#007bff"
          strokeWidth={2 / scale}
          strokeDasharray={`${4 / scale} ${2 / scale}`}
        />
        <circle
          cx={rotationHandleX}
          cy={rotationHandleY}
          r={rotationHandleSize}
          fill="white"
          stroke="#007bff"
          strokeWidth={2 / scale}
        />
        <path
          d={`M ${rotationHandleX - rotationHandleSize * 0.4} ${rotationHandleY}
              A ${rotationHandleSize * 0.5} ${rotationHandleSize * 0.5} 0 1 1 ${rotationHandleX + rotationHandleSize * 0.4} ${rotationHandleY}`}
          fill="none"
          stroke="#007bff"
          strokeWidth={2 / scale}
          strokeLinecap="round"
        />
        <path
          d={`M ${rotationHandleX + rotationHandleSize * 0.4} ${rotationHandleY}
              L ${rotationHandleX + rotationHandleSize * 0.6} ${rotationHandleY - rotationHandleSize * 0.2}
              M ${rotationHandleX + rotationHandleSize * 0.4} ${rotationHandleY}
              L ${rotationHandleX + rotationHandleSize * 0.6} ${rotationHandleY + rotationHandleSize * 0.2}`}
          fill="none"
          stroke="#007bff"
          strokeWidth={2 / scale}
          strokeLinecap="round"
        />
      </g>

      {/* Scale Handles */}
      {handles.map((handle) => (
        <rect
          key={handle.type}
          className={`scale-handle scale-handle--${handle.type}`}
          x={handle.x - handleSize / 2}
          y={handle.y - handleSize / 2}
          width={handleSize}
          height={handleSize}
          fill="white"
          stroke="#007bff"
          strokeWidth={3 / scale}
          rx={2 / scale}
          ry={2 / scale}
          style={{
            cursor: isScaling && scaleHandle === handle.type ? 'grabbing' : handle.cursor,
            pointerEvents: 'all'
          }}
          onMouseDown={(e) => handleScaleMouseDown(e, handle.type)}
        />
      ))}

      {/* Rotation indicator text */}
      {isRotating && (
        <text
          x={template.dimensions.width_mm / 2}
          y={-rotationHandleDistance - rotationHandleSize - 10 / scale}
          textAnchor="middle"
          fontSize={14 / scale}
          fill="#007bff"
          fontWeight="bold"
          style={{ pointerEvents: 'none' }}
        >
          {Math.round(rotation)}°
        </text>
      )}

      {/* Scale indicator text */}
      {isScaling && (
        <text
          x={template.dimensions.width_mm / 2}
          y={template.dimensions.length_mm + 20 / scale}
          textAnchor="middle"
          fontSize={14 / scale}
          fill="#007bff"
          fontWeight="bold"
          style={{ pointerEvents: 'none' }}
        >
          {(scale * 100).toFixed(0)}%
        </text>
      )}
    </g>
  );
}

export default TransformHandles;
