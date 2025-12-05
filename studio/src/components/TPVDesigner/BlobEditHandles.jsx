// TPV Studio - Blob Edit Handles Component
// Renders draggable control points and bezier handles for blob shape editing

import React, { useState, useCallback, useEffect } from 'react';

/**
 * Bezier control points and handles for blob editing
 * Displays control points (vertices) and their bezier handles for curve control
 *
 * @param {Object} props - Component props
 * @param {Array} props.controlPoints - Array of control points with bezier handles
 * @param {number} props.width - Shape width in mm
 * @param {number} props.height - Shape height in mm
 * @param {Function} props.onPointDrag - Callback when control point is dragged (index, newX, newY)
 * @param {Function} props.onHandleDrag - Callback when handle is dragged (index, handleType, offsetX, offsetY)
 * @param {Function} props.onDragEnd - Callback when drag ends (to commit to history)
 */
function BlobEditHandles({ controlPoints, width, height, onPointDrag, onHandleDrag, onDragEnd }) {
  const [dragging, setDragging] = useState(null);
  const [dragStartPos, setDragStartPos] = useState(null);

  // Handle size based on shape dimensions
  const controlPointSize = Math.min(width, height) * 0.03;
  const minPointSize = 60;
  const maxPointSize = 120;
  const pointSize = Math.max(minPointSize, Math.min(maxPointSize, controlPointSize));
  const handleCircleSize = pointSize * 0.7;

  // Start dragging a control point
  const startPointDrag = useCallback((e, index) => {
    e.stopPropagation();
    e.preventDefault();
    setDragging({ type: 'point', index });
    setDragStartPos({ x: e.clientX, y: e.clientY });
  }, []);

  // Start dragging a bezier handle
  const startHandleDrag = useCallback((e, index, handleType) => {
    e.stopPropagation();
    e.preventDefault();
    setDragging({ type: 'handle', index, handleType });
    setDragStartPos({ x: e.clientX, y: e.clientY });
  }, []);

  // Handle mouse move during drag
  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e) => {
      if (!dragStartPos) return;

      // Get the SVG element to calculate proper coordinates
      const svg = document.querySelector('.court-canvas__svg');
      if (!svg) return;

      const svgRect = svg.getBoundingClientRect();
      const viewBox = svg.viewBox.baseVal;

      // Calculate scale factor between screen and SVG coordinates
      const scaleX = viewBox.width / svgRect.width;
      const scaleY = viewBox.height / svgRect.height;

      // Calculate delta in SVG units
      const deltaX = (e.clientX - dragStartPos.x) * scaleX;
      const deltaY = (e.clientY - dragStartPos.y) * scaleY;

      if (dragging.type === 'point') {
        const point = controlPoints[dragging.index];
        // Convert delta to normalized coordinates (0-1)
        const newX = point.x + deltaX / width;
        const newY = point.y + deltaY / height;
        onPointDrag?.(dragging.index, newX, newY);
      } else if (dragging.type === 'handle') {
        const point = controlPoints[dragging.index];
        const handle = point[dragging.handleType];
        // Handles are offsets, so we update the offset directly
        const newOffsetX = handle.x + deltaX / width;
        const newOffsetY = handle.y + deltaY / height;
        onHandleDrag?.(dragging.index, dragging.handleType, newOffsetX, newOffsetY);
      }

      // Update drag start position for next frame
      setDragStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setDragging(null);
      setDragStartPos(null);
      onDragEnd?.();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, dragStartPos, controlPoints, width, height, onPointDrag, onHandleDrag, onDragEnd]);

  if (!controlPoints || controlPoints.length === 0) return null;

  return (
    <g className="blob-edit-handles">
      {controlPoints.map((point, i) => {
        // Convert normalized coordinates to actual positions
        const x = point.x * width;
        const y = point.y * height;
        const handleInX = x + point.handleIn.x * width;
        const handleInY = y + point.handleIn.y * height;
        const handleOutX = x + point.handleOut.x * width;
        const handleOutY = y + point.handleOut.y * height;

        const isPointDragging = dragging?.type === 'point' && dragging?.index === i;
        const isHandleInDragging = dragging?.type === 'handle' && dragging?.index === i && dragging?.handleType === 'handleIn';
        const isHandleOutDragging = dragging?.type === 'handle' && dragging?.index === i && dragging?.handleType === 'handleOut';

        return (
          <g key={i} className="blob-control-point-group">
            {/* Handle lines (connecting point to handles) */}
            <line
              x1={x}
              y1={y}
              x2={handleInX}
              y2={handleInY}
              stroke="#94a3b8"
              strokeWidth="20"
              strokeDasharray="60 40"
              pointerEvents="none"
              opacity="0.8"
            />
            <line
              x1={x}
              y1={y}
              x2={handleOutX}
              y2={handleOutY}
              stroke="#94a3b8"
              strokeWidth="20"
              strokeDasharray="60 40"
              pointerEvents="none"
              opacity="0.8"
            />

            {/* Bezier handle IN (small circle) */}
            <circle
              cx={handleInX}
              cy={handleInY}
              r={handleCircleSize}
              fill={isHandleInDragging ? '#f97316' : '#ffffff'}
              stroke="#64748b"
              strokeWidth="15"
              style={{ cursor: 'crosshair' }}
              pointerEvents="all"
              onMouseDown={(e) => startHandleDrag(e, i, 'handleIn')}
            />

            {/* Bezier handle OUT (small circle) */}
            <circle
              cx={handleOutX}
              cy={handleOutY}
              r={handleCircleSize}
              fill={isHandleOutDragging ? '#f97316' : '#ffffff'}
              stroke="#64748b"
              strokeWidth="15"
              style={{ cursor: 'crosshair' }}
              pointerEvents="all"
              onMouseDown={(e) => startHandleDrag(e, i, 'handleOut')}
            />

            {/* Control point (larger circle) */}
            <circle
              cx={x}
              cy={y}
              r={pointSize}
              fill={isPointDragging ? '#f97316' : '#3b82f6'}
              stroke="#ffffff"
              strokeWidth="20"
              style={{ cursor: 'move' }}
              pointerEvents="all"
              onMouseDown={(e) => startPointDrag(e, i)}
            />

            {/* Point index label (for debugging/identification) */}
            <text
              x={x}
              y={y + pointSize * 0.35}
              textAnchor="middle"
              fontSize={pointSize * 0.8}
              fill="#ffffff"
              fontWeight="bold"
              pointerEvents="none"
            >
              {i + 1}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default BlobEditHandles;
