// TPV Studio - Track Resize Handles Component
import React, { useState, useEffect } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';

/**
 * Resize handles for tracks
 * Allows resizing width/height independently or proportionally
 */
function TrackResizeHandles({ track, svgRef }) {
  const { updateTrackParameters, updateTrackPosition, addToHistory } = useSportsDesignStore();

  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null); // 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'
  const [dragStart, setDragStart] = useState(null);

  const { parameters, position } = track;
  const width = parameters.width_mm;
  const height = parameters.height_mm;

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = (screenX, screenY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = screenX;
    pt.y = screenY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    return { x: svgP.x, y: svgP.y };
  };

  // Handle resize start
  const handleResizeMouseDown = (e, handleType) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handleType);

    const svgPoint = screenToSVG(e.clientX, e.clientY);

    setDragStart({
      screenX: e.clientX,
      screenY: e.clientY,
      svgX: svgPoint.x,
      svgY: svgPoint.y,
      initialWidth: width,
      initialHeight: height,
      initialPosition: { ...position },
      initialCornerRadius: { ...parameters.cornerRadius }
    });
  };

  // Handle mouse move for resizing
  useEffect(() => {
    if (!isResizing || !dragStart) return;

    const handleMouseMove = (e) => {
      const svgPoint = screenToSVG(e.clientX, e.clientY);

      const deltaX = svgPoint.x - dragStart.svgX;
      const deltaY = svgPoint.y - dragStart.svgY;

      let newWidth = dragStart.initialWidth;
      let newHeight = dragStart.initialHeight;
      let newPosition = { ...position };
      let newCornerRadius = { ...dragStart.initialCornerRadius };

      const minSize = 3000; // Minimum 3 meters

      // Calculate new dimensions based on which handle is being dragged
      switch (resizeHandle) {
        case 'se': // Southeast corner - proportional resize
          newWidth = Math.max(minSize, dragStart.initialWidth + deltaX);
          newHeight = Math.max(minSize, dragStart.initialHeight + deltaY);
          // Scale corner radii proportionally
          const seScale = Math.min(newWidth / dragStart.initialWidth, newHeight / dragStart.initialHeight);
          newCornerRadius = {
            topLeft: dragStart.initialCornerRadius.topLeft * seScale,
            topRight: dragStart.initialCornerRadius.topRight * seScale,
            bottomLeft: dragStart.initialCornerRadius.bottomLeft * seScale,
            bottomRight: dragStart.initialCornerRadius.bottomRight * seScale
          };
          break;

        case 'nw': // Northwest corner - proportional resize
          newWidth = Math.max(minSize, dragStart.initialWidth - deltaX);
          newHeight = Math.max(minSize, dragStart.initialHeight - deltaY);
          newPosition.x = dragStart.initialPosition.x + (dragStart.initialWidth - newWidth);
          newPosition.y = dragStart.initialPosition.y + (dragStart.initialHeight - newHeight);
          // Scale corner radii proportionally
          const nwScale = Math.min(newWidth / dragStart.initialWidth, newHeight / dragStart.initialHeight);
          newCornerRadius = {
            topLeft: dragStart.initialCornerRadius.topLeft * nwScale,
            topRight: dragStart.initialCornerRadius.topRight * nwScale,
            bottomLeft: dragStart.initialCornerRadius.bottomLeft * nwScale,
            bottomRight: dragStart.initialCornerRadius.bottomRight * nwScale
          };
          break;

        case 'ne': // Northeast corner - proportional resize
          newWidth = Math.max(minSize, dragStart.initialWidth + deltaX);
          newHeight = Math.max(minSize, dragStart.initialHeight - deltaY);
          newPosition.y = dragStart.initialPosition.y + (dragStart.initialHeight - newHeight);
          const neScale = Math.min(newWidth / dragStart.initialWidth, newHeight / dragStart.initialHeight);
          newCornerRadius = {
            topLeft: dragStart.initialCornerRadius.topLeft * neScale,
            topRight: dragStart.initialCornerRadius.topRight * neScale,
            bottomLeft: dragStart.initialCornerRadius.bottomLeft * neScale,
            bottomRight: dragStart.initialCornerRadius.bottomRight * neScale
          };
          break;

        case 'sw': // Southwest corner - proportional resize
          newWidth = Math.max(minSize, dragStart.initialWidth - deltaX);
          newHeight = Math.max(minSize, dragStart.initialHeight + deltaY);
          newPosition.x = dragStart.initialPosition.x + (dragStart.initialWidth - newWidth);
          const swScale = Math.min(newWidth / dragStart.initialWidth, newHeight / dragStart.initialHeight);
          newCornerRadius = {
            topLeft: dragStart.initialCornerRadius.topLeft * swScale,
            topRight: dragStart.initialCornerRadius.topRight * swScale,
            bottomLeft: dragStart.initialCornerRadius.bottomLeft * swScale,
            bottomRight: dragStart.initialCornerRadius.bottomRight * swScale
          };
          break;

        case 'e': // East edge - width only
          newWidth = Math.max(minSize, dragStart.initialWidth + deltaX);
          // Scale corner radii horizontally
          const eScale = newWidth / dragStart.initialWidth;
          newCornerRadius = {
            topLeft: dragStart.initialCornerRadius.topLeft * eScale,
            topRight: dragStart.initialCornerRadius.topRight * eScale,
            bottomLeft: dragStart.initialCornerRadius.bottomLeft * eScale,
            bottomRight: dragStart.initialCornerRadius.bottomRight * eScale
          };
          break;

        case 'w': // West edge - width only
          newWidth = Math.max(minSize, dragStart.initialWidth - deltaX);
          newPosition.x = dragStart.initialPosition.x + (dragStart.initialWidth - newWidth);
          const wScale = newWidth / dragStart.initialWidth;
          newCornerRadius = {
            topLeft: dragStart.initialCornerRadius.topLeft * wScale,
            topRight: dragStart.initialCornerRadius.topRight * wScale,
            bottomLeft: dragStart.initialCornerRadius.bottomLeft * wScale,
            bottomRight: dragStart.initialCornerRadius.bottomRight * wScale
          };
          break;

        case 'n': // North edge - height only
          newHeight = Math.max(minSize, dragStart.initialHeight - deltaY);
          newPosition.y = dragStart.initialPosition.y + (dragStart.initialHeight - newHeight);
          const nScale = newHeight / dragStart.initialHeight;
          newCornerRadius = {
            topLeft: dragStart.initialCornerRadius.topLeft * nScale,
            topRight: dragStart.initialCornerRadius.topRight * nScale,
            bottomLeft: dragStart.initialCornerRadius.bottomLeft * nScale,
            bottomRight: dragStart.initialCornerRadius.bottomRight * nScale
          };
          break;

        case 's': // South edge - height only
          newHeight = Math.max(minSize, dragStart.initialHeight + deltaY);
          const sScale = newHeight / dragStart.initialHeight;
          newCornerRadius = {
            topLeft: dragStart.initialCornerRadius.topLeft * sScale,
            topRight: dragStart.initialCornerRadius.topRight * sScale,
            bottomLeft: dragStart.initialCornerRadius.bottomLeft * sScale,
            bottomRight: dragStart.initialCornerRadius.bottomRight * sScale
          };
          break;
      }

      // Ensure corner radii don't exceed half of smallest dimension
      const maxRadius = Math.min(newWidth, newHeight) / 2;
      newCornerRadius = {
        topLeft: Math.min(newCornerRadius.topLeft, maxRadius),
        topRight: Math.min(newCornerRadius.topRight, maxRadius),
        bottomLeft: Math.min(newCornerRadius.bottomLeft, maxRadius),
        bottomRight: Math.min(newCornerRadius.bottomRight, maxRadius)
      };

      // Update track parameters
      updateTrackParameters(track.id, {
        width_mm: newWidth,
        height_mm: newHeight,
        cornerRadius: newCornerRadius
      });

      // Update position if needed
      if (newPosition.x !== position.x || newPosition.y !== position.y) {
        updateTrackPosition(track.id, newPosition);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        addToHistory();
      }
      setIsResizing(false);
      setResizeHandle(null);
      setDragStart(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, dragStart, resizeHandle, track.id, position, parameters, updateTrackParameters, updateTrackPosition, addToHistory]);

  // Resize handles positions (corners and edges)
  const handles = [
    { type: 'nw', x: 0, y: 0, cursor: 'nwse-resize' },
    { type: 'n', x: width / 2, y: 0, cursor: 'ns-resize' },
    { type: 'ne', x: width, y: 0, cursor: 'nesw-resize' },
    { type: 'e', x: width, y: height / 2, cursor: 'ew-resize' },
    { type: 'se', x: width, y: height, cursor: 'nwse-resize' },
    { type: 's', x: width / 2, y: height, cursor: 'ns-resize' },
    { type: 'sw', x: 0, y: height, cursor: 'nesw-resize' },
    { type: 'w', x: 0, y: height / 2, cursor: 'ew-resize' },
  ];

  const handleSize = 400; // 400mm handles (clearly visible)

  return (
    <g className="track-resize-handles">
      {/* Resize Handles */}
      {handles.map((handle) => (
        <rect
          key={handle.type}
          className={`resize-handle resize-handle--${handle.type}`}
          x={handle.x - handleSize / 2}
          y={handle.y - handleSize / 2}
          width={handleSize}
          height={handleSize}
          fill="white"
          stroke="#0066CC"
          strokeWidth={50}
          rx={40}
          ry={40}
          style={{
            cursor: isResizing && resizeHandle === handle.type ? 'grabbing' : handle.cursor,
            pointerEvents: 'all'
          }}
          onMouseDown={(e) => handleResizeMouseDown(e, handle.type)}
        />
      ))}

      {/* Size indicator text */}
      {isResizing && (
        <text
          x={width / 2}
          y={height + 800}
          textAnchor="middle"
          fontSize={400}
          fill="#0066CC"
          fontWeight="bold"
          style={{ pointerEvents: 'none' }}
        >
          {(width / 1000).toFixed(1)}m × {(height / 1000).toFixed(1)}m
        </text>
      )}
    </g>
  );
}

export default TrackResizeHandles;
