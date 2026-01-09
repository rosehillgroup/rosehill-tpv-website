// TPV Studio - Blob Edit Handles Component
// Renders draggable control points and bezier handles for blob shape editing

import React, { useState, useCallback, useEffect } from 'react';
import { getEditHandleSize } from '../../lib/sports/handleUtils';

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
 * @param {boolean} props.showHandles - Whether to show bezier handles (for smooth mode)
 * @param {number} props.selectedPointIndex - Index of currently selected point (for deletion)
 * @param {Function} props.onPointSelect - Callback when point is selected (index)
 * @param {Function} props.onPointDelete - Callback when point should be deleted (index)
 * @param {Function} props.onAddPoint - Callback when point should be added (segmentIndex, normalizedX, normalizedY)
 * @param {boolean} props.closed - Whether the path is closed (connects last point to first)
 */
function BlobEditHandles({
  controlPoints,
  width,
  height,
  zoom = 1,
  onPointDrag,
  onHandleDrag,
  onDragEnd,
  showHandles = true,
  selectedPointIndex,
  onPointSelect,
  onPointDelete,
  onAddPoint,
  closed = true
}) {
  const [dragging, setDragging] = useState(null);
  const [dragStartPos, setDragStartPos] = useState(null);

  // Get handle sizes that stay fixed on screen regardless of zoom
  const { pointSize, handleSize: handleCircleSize, strokeWidth } = getEditHandleSize(zoom);

  // Start dragging a control point (also selects it)
  const startPointDrag = useCallback((e, index) => {
    e.stopPropagation();
    e.preventDefault();
    // Select the point for potential deletion
    onPointSelect?.(index);
    setDragging({ type: 'point', index });
    setDragStartPos({ x: e.clientX, y: e.clientY });
  }, [onPointSelect]);

  // Handle right-click on point to delete it
  const handlePointContextMenu = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();
    onPointDelete?.(index);
  }, [onPointDelete]);

  // Handle double-click on line segment to add a new point
  const handleSegmentDoubleClick = useCallback((e, segmentIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onAddPoint) return;

    // Get SVG element
    const svg = document.querySelector('.court-canvas__svg');
    if (!svg) return;

    // Get the parent path-element group (which has the transform applied)
    const pathGroup = e.target.closest('g.path-element');
    if (!pathGroup) return;

    // Create SVG point and transform to local coordinates using the path's CTM
    const svgPoint = svg.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;

    // Get the inverse of the path group's screen CTM to convert screen coords to local coords
    const ctm = pathGroup.getScreenCTM();
    if (!ctm) return;
    const localPoint = svgPoint.matrixTransform(ctm.inverse());

    // localPoint.x and localPoint.y are now in the path's local coordinate system
    const svgX = localPoint.x;
    const svgY = localPoint.y;

    // Get the segment endpoints
    const p1 = controlPoints[segmentIndex];
    const p2Index = (segmentIndex + 1) % controlPoints.length;
    const p2 = controlPoints[p2Index];

    // Convert to actual coordinates
    const p1x = p1.x * width;
    const p1y = p1.y * height;
    const p2x = p2.x * width;
    const p2y = p2.y * height;

    // Find the closest point on the segment to the click
    // Using projection formula
    const dx = p2x - p1x;
    const dy = p2y - p1y;
    const lengthSq = dx * dx + dy * dy;

    if (lengthSq === 0) {
      // Degenerate segment, just use p1
      onAddPoint(segmentIndex + 1, p1.x, p1.y);
      return;
    }

    // Calculate t parameter (0-1) for projection onto segment
    let t = ((svgX - p1x) * dx + (svgY - p1y) * dy) / lengthSq;
    t = Math.max(0.1, Math.min(0.9, t)); // Clamp to avoid creating points too close to existing ones

    // Calculate the new point position
    const newX = p1x + t * dx;
    const newY = p1y + t * dy;

    // Convert back to normalized coordinates
    const normalizedX = newX / width;
    const normalizedY = newY / height;

    // Add point after segmentIndex (so it becomes the new point at segmentIndex + 1)
    onAddPoint(segmentIndex + 1, normalizedX, normalizedY);
  }, [controlPoints, width, height, onAddPoint]);

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

  // Generate clickable segments for adding points
  const segments = [];
  if (onAddPoint && controlPoints.length >= 2) {
    const numSegments = closed ? controlPoints.length : controlPoints.length - 1;
    for (let i = 0; i < numSegments; i++) {
      const p1 = controlPoints[i];
      const p2 = controlPoints[(i + 1) % controlPoints.length];
      segments.push({
        index: i,
        x1: p1.x * width,
        y1: p1.y * height,
        x2: p2.x * width,
        y2: p2.y * height
      });
    }
  }

  return (
    <g className="blob-edit-handles">
      {/* Clickable segments for adding new points (render first so they're behind control points) */}
      {segments.map((seg) => (
        <line
          key={`segment-${seg.index}`}
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          stroke="transparent"
          strokeWidth={pointSize * 2}
          style={{ cursor: 'copy' }}
          pointerEvents="stroke"
          onDoubleClick={(e) => handleSegmentDoubleClick(e, seg.index)}
        />
      ))}

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
        const isPointSelected = selectedPointIndex === i;

        return (
          <g key={i} className="blob-control-point-group">
            {/* Handle lines (connecting point to handles) - only show in smooth mode */}
            {showHandles && (
              <>
                <line
                  x1={x}
                  y1={y}
                  x2={handleInX}
                  y2={handleInY}
                  stroke="#94a3b8"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${strokeWidth * 3} ${strokeWidth * 2}`}
                  pointerEvents="none"
                  opacity="0.8"
                />
                <line
                  x1={x}
                  y1={y}
                  x2={handleOutX}
                  y2={handleOutY}
                  stroke="#94a3b8"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${strokeWidth * 3} ${strokeWidth * 2}`}
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
                  strokeWidth={strokeWidth}
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
                  strokeWidth={strokeWidth}
                  style={{ cursor: 'crosshair' }}
                  pointerEvents="all"
                  onMouseDown={(e) => startHandleDrag(e, i, 'handleOut')}
                />
              </>
            )}

            {/* Control point (larger circle) */}
            <circle
              cx={x}
              cy={y}
              r={pointSize}
              fill={isPointSelected ? '#ef4444' : (isPointDragging ? '#f97316' : '#3b82f6')}
              stroke="#ffffff"
              strokeWidth={strokeWidth * 1.3}
              style={{ cursor: 'move' }}
              pointerEvents="all"
              onMouseDown={(e) => startPointDrag(e, i)}
              onContextMenu={(e) => handlePointContextMenu(e, i)}
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
