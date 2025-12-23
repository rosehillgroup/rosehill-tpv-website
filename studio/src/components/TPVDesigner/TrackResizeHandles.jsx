// TPV Studio - Track Resize Handles Component
import React, { useState, useEffect } from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { normalizeAngle } from '../../lib/sports/geometryUtils.js';

/**
 * Resize and rotation handles for tracks
 * Allows resizing width/height independently or proportionally, plus rotation
 */
function TrackResizeHandles({ track, svgRef }) {
  const { updateTrackParameters, updateTrackPosition, updateTrackRotation, addToHistory } = useSportsDesignStore();

  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null); // 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'
  const [dragStart, setDragStart] = useState(null);

  const { parameters, position, rotation } = track;
  const width = parameters.width_mm;
  const height = parameters.height_mm;

  // Calculate center point in SVG coordinates (for rotation)
  const centerX = position.x + width / 2;
  const centerY = position.y + height / 2;

  // Rotation handle position (above top center)
  const rotationHandleDistance = 1000; // 1 meter above the track
  const rotationHandleX = width / 2;
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

  // Handle rotation start (mouse and touch)
  const handleRotationMouseDown = (e) => {
    e.stopPropagation();
    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setIsRotating(true);
    setDragStart({ x: clientX, y: clientY });
  };

  // Handle resize start (mouse and touch)
  const handleResizeMouseDown = (e, handleType) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handleType);

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgPoint = screenToSVG(clientX, clientY);

    setDragStart({
      screenX: clientX,
      screenY: clientY,
      svgX: svgPoint.x,
      svgY: svgPoint.y,
      initialWidth: width,
      initialHeight: height,
      initialPosition: { ...position },
      initialCornerRadius: { ...parameters.cornerRadius }
    });
  };

  // Handle mouse/touch move for resizing and rotation
  useEffect(() => {
    if (!isResizing && !isRotating) return;

    const handleMove = (e) => {
      // Handle both mouse and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (isRotating) {
        // Calculate angle from center to mouse/touch
        const svgPoint = screenToSVG(clientX, clientY);
        const dx = svgPoint.x - centerX;
        const dy = svgPoint.y - centerY;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; // +90 to start from top
        angle = normalizeAngle(angle);

        // Snap to 15° if shift is held
        if (e.shiftKey) {
          angle = Math.round(angle / 15) * 15;
        }

        updateTrackRotation(track.id, angle);
        return;
      }

      if (!dragStart) return;
      const svgPoint = screenToSVG(clientX, clientY);

      const deltaX = svgPoint.x - dragStart.svgX;
      const deltaY = svgPoint.y - dragStart.svgY;

      let newWidth = dragStart.initialWidth;
      let newHeight = dragStart.initialHeight;
      let newPosition = { ...position };
      let newCornerRadius = { ...dragStart.initialCornerRadius };

      const minSize = 3000; // Minimum 3 meters

      // Straight tracks have fixed width (numLanes × laneWidth), only allow length changes
      const isStraightTrack = track.template?.trackType === 'straight';

      // For straight tracks, ignore east/west edge handles entirely
      if (isStraightTrack && (resizeHandle === 'e' || resizeHandle === 'w')) {
        return;
      }

      // Calculate new dimensions based on which handle is being dragged
      switch (resizeHandle) {
        case 'se': // Southeast corner - proportional resize (height only for straight tracks)
          if (isStraightTrack) {
            // Only adjust height for straight tracks
            newHeight = Math.max(minSize, dragStart.initialHeight + deltaY);
          } else {
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
          }
          break;

        case 'nw': // Northwest corner - proportional resize (height only for straight tracks)
          if (isStraightTrack) {
            // Only adjust height for straight tracks
            newHeight = Math.max(minSize, dragStart.initialHeight - deltaY);
            newPosition.y = dragStart.initialPosition.y + (dragStart.initialHeight - newHeight);
          } else {
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
          }
          break;

        case 'ne': // Northeast corner - proportional resize (height only for straight tracks)
          if (isStraightTrack) {
            // Only adjust height for straight tracks
            newHeight = Math.max(minSize, dragStart.initialHeight - deltaY);
            newPosition.y = dragStart.initialPosition.y + (dragStart.initialHeight - newHeight);
          } else {
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
          }
          break;

        case 'sw': // Southwest corner - proportional resize (height only for straight tracks)
          if (isStraightTrack) {
            // Only adjust height for straight tracks
            newHeight = Math.max(minSize, dragStart.initialHeight + deltaY);
          } else {
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
          }
          break;

        case 'e': // East edge - width only (disabled for straight tracks above)
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

        case 'w': // West edge - width only (disabled for straight tracks above)
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

    const handleEnd = () => {
      if (isResizing || isRotating) {
        addToHistory();
      }
      setIsResizing(false);
      setIsRotating(false);
      setResizeHandle(null);
      setDragStart(null);
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
  }, [isResizing, dragStart, resizeHandle, track.id, position, parameters, updateTrackParameters, updateTrackPosition, addToHistory]);

  // Detect straight track for simplified handles
  const isStraightTrack = track.template?.trackType === 'straight';

  // Resize handles positions (corners and edges)
  // For straight tracks, only show north/south handles since width is fixed
  const allHandles = [
    { type: 'nw', x: 0, y: 0, cursor: 'nwse-resize' },
    { type: 'n', x: width / 2, y: 0, cursor: 'ns-resize' },
    { type: 'ne', x: width, y: 0, cursor: 'nesw-resize' },
    { type: 'e', x: width, y: height / 2, cursor: 'ew-resize' },
    { type: 'se', x: width, y: height, cursor: 'nwse-resize' },
    { type: 's', x: width / 2, y: height, cursor: 'ns-resize' },
    { type: 'sw', x: 0, y: height, cursor: 'nesw-resize' },
    { type: 'w', x: 0, y: height / 2, cursor: 'ew-resize' },
  ];

  const handles = isStraightTrack
    ? allHandles.filter(h => h.type === 'n' || h.type === 's')
    : allHandles;

  const handleSize = 400; // 400mm handles (clearly visible)

  return (
    <g className="track-resize-handles">
      {/* Rotation Handle */}
      <g className="rotation-handle-group">
        {/* Connection line from track to rotation handle */}
        <line
          x1={rotationHandleX}
          y1={0}
          x2={rotationHandleX}
          y2={rotationHandleY}
          stroke="#0066CC"
          strokeWidth={30}
          strokeDasharray="100 100"
          opacity={0.5}
          style={{ pointerEvents: 'none' }}
        />

        {/* Rotation handle (circular) */}
        <circle
          className="rotation-handle"
          cx={rotationHandleX}
          cy={rotationHandleY}
          r={handleSize / 2}
          fill="white"
          stroke="#0066CC"
          strokeWidth={50}
          style={{
            cursor: isRotating ? 'grabbing' : 'grab',
            pointerEvents: 'all'
          }}
          onMouseDown={handleRotationMouseDown}
          onTouchStart={handleRotationMouseDown}
        />

        {/* Rotation icon (curved arrow) */}
        <path
          d={`M ${rotationHandleX - 100} ${rotationHandleY - 50}
              A 100 100 0 1 1 ${rotationHandleX + 100} ${rotationHandleY - 50}`}
          fill="none"
          stroke="#0066CC"
          strokeWidth={40}
          strokeLinecap="round"
          style={{ pointerEvents: 'none' }}
        />
        <path
          d={`M ${rotationHandleX + 100} ${rotationHandleY - 50}
              L ${rotationHandleX + 80} ${rotationHandleY - 120}
              L ${rotationHandleX + 150} ${rotationHandleY - 80}
              Z`}
          fill="#0066CC"
          style={{ pointerEvents: 'none' }}
        />
      </g>

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
          onTouchStart={(e) => handleResizeMouseDown(e, handle.type)}
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

      {/* Rotation angle indicator */}
      {isRotating && (
        <text
          x={width / 2}
          y={-1500}
          textAnchor="middle"
          fontSize={400}
          fill="#0066CC"
          fontWeight="bold"
          style={{ pointerEvents: 'none' }}
        >
          {rotation.toFixed(0)}°
        </text>
      )}
    </g>
  );
}

export default TrackResizeHandles;
