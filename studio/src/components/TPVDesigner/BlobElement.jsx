// TPV Studio - Blob Element Component
// Renders an organic blob shape with bezier curve editing capabilities

import React, { useMemo } from 'react';
import { controlPointsToSVGPath } from '../../lib/sports/blobGeometry';
import BlobEditHandles from './BlobEditHandles';

/**
 * Individual blob element component
 * Renders an organic blob shape on the sports canvas with bezier editing
 *
 * @param {Object} props - Component props
 * @param {Object} props.shape - Shape data from store
 * @param {boolean} props.isSelected - Whether this shape is selected
 * @param {Function} props.onMouseDown - Handler for mouse down (drag start)
 * @param {Function} props.onTouchStart - Handler for touch start (drag start on mobile)
 * @param {Function} props.onDoubleClick - Handler for double click (open properties)
 * @param {Function} props.onScaleStart - Handler for scale handle drag start
 * @param {Function} props.onRotateStart - Handler for rotation handle drag start
 * @param {Function} props.onPointDrag - Handler for control point drag
 * @param {Function} props.onHandleDrag - Handler for bezier handle drag
 * @param {Function} props.onDragEnd - Handler for drag end (commit to history)
 */
function BlobElement({
  shape,
  isSelected,
  onMouseDown,
  onTouchStart,
  onDoubleClick,
  onScaleStart,
  onRotateStart,
  onPointDrag,
  onHandleDrag,
  onDragEnd,
  selectedPointIndex,
  onPointSelect,
  onPointDelete
}) {
  const {
    controlPoints,
    width_mm,
    height_mm,
    position,
    rotation,
    fillColor,
    strokeEnabled,
    strokeColor,
    strokeWidth_mm,
    editPointsVisible
  } = shape;

  // Generate the SVG path from control points
  const blobPath = useMemo(() => {
    return controlPointsToSVGPath(controlPoints, width_mm, height_mm);
  }, [controlPoints, width_mm, height_mm]);

  // Calculate center for rotation
  const centerX = width_mm / 2;
  const centerY = height_mm / 2;

  // Build transform string
  const transform = `translate(${position.x}, ${position.y}) rotate(${rotation || 0}, ${centerX}, ${centerY})`;

  return (
    <g
      className={`blob-element ${isSelected ? 'blob-element--selected' : ''}`}
      transform={transform}
      style={{ cursor: 'move' }}
    >
      {/* Render the blob shape */}
      <path
        d={blobPath}
        fill={fillColor?.hex || '#609B63'}
        stroke={strokeEnabled && strokeColor ? strokeColor.hex : 'none'}
        strokeWidth={strokeEnabled ? strokeWidth_mm : 0}
        pointerEvents="none"
      />

      {/* Invisible clickable area - captures mouse/touch events for the whole blob */}
      <path
        d={blobPath}
        fill="transparent"
        stroke="transparent"
        strokeWidth={Math.max(strokeWidth_mm || 0, 100)} // Minimum hit area
        pointerEvents="all"
        onTouchStart={onTouchStart}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        style={{ cursor: 'move' }}
      />

      {/* Selection indicator */}
      {isSelected && (
        <rect
          x="-10"
          y="-10"
          width={width_mm + 20}
          height={height_mm + 20}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="80"
          strokeDasharray="400 400"
          opacity="0.7"
          pointerEvents="none"
        />
      )}

      {/* Corner resize handles and rotation handle when selected */}
      {isSelected && (
        <BlobResizeHandles
          width={width_mm}
          height={height_mm}
          onScaleStart={onScaleStart}
          onRotateStart={onRotateStart}
        />
      )}

      {/* Bezier control point handles when selected and Edit Points is enabled */}
      {isSelected && controlPoints && editPointsVisible && (
        <BlobEditHandles
          controlPoints={controlPoints}
          width={width_mm}
          height={height_mm}
          onPointDrag={onPointDrag}
          onHandleDrag={onHandleDrag}
          onDragEnd={onDragEnd}
          showHandles={true}
          selectedPointIndex={selectedPointIndex}
          onPointSelect={onPointSelect}
          onPointDelete={onPointDelete}
        />
      )}
    </g>
  );
}

/**
 * Resize and rotation handles for selected blob
 * Corner handles for scaling, top-center handle for rotation
 */
function BlobResizeHandles({ width, height, onScaleStart, onRotateStart }) {
  const handleSize = Math.min(width, height) * 0.08;
  const minHandleSize = 150;
  const maxHandleSize = 400;
  const size = Math.max(minHandleSize, Math.min(maxHandleSize, handleSize));

  // Corner handles for scaling
  const scaleHandles = [
    { x: -size / 2, y: -size / 2, corner: 'nw', cursor: 'nwse-resize' },
    { x: width - size / 2, y: -size / 2, corner: 'ne', cursor: 'nesw-resize' },
    { x: -size / 2, y: height - size / 2, corner: 'sw', cursor: 'nesw-resize' },
    { x: width - size / 2, y: height - size / 2, corner: 'se', cursor: 'nwse-resize' }
  ];

  // Rotation handle - positioned above top center
  const rotateHandleDistance = size * 2.5;
  const rotateHandleSize = size * 0.8;

  return (
    <g className="blob-resize-handles">
      {/* Scale handles at corners */}
      {scaleHandles.map((handle) => (
        <rect
          key={handle.corner}
          x={handle.x}
          y={handle.y}
          width={size}
          height={size}
          fill="#3b82f6"
          stroke="#fff"
          strokeWidth="20"
          rx={size / 4}
          style={{ cursor: handle.cursor }}
          pointerEvents="all"
          onMouseDown={(e) => {
            e.stopPropagation();
            onScaleStart?.(e, handle.corner);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            onScaleStart?.(e, handle.corner);
          }}
        />
      ))}

      {/* Rotation handle stem */}
      <line
        x1={width / 2}
        y1={0}
        x2={width / 2}
        y2={-rotateHandleDistance + rotateHandleSize / 2}
        stroke="#3b82f6"
        strokeWidth="30"
        pointerEvents="none"
      />

      {/* Rotation handle circle */}
      <circle
        cx={width / 2}
        cy={-rotateHandleDistance}
        r={rotateHandleSize}
        fill="#3b82f6"
        stroke="#fff"
        strokeWidth="20"
        style={{ cursor: 'grab' }}
        pointerEvents="all"
        onMouseDown={(e) => {
          e.stopPropagation();
          onRotateStart?.(e);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          onRotateStart?.(e);
        }}
      />

      {/* Rotation icon inside handle */}
      <path
        d={`M ${width / 2 - rotateHandleSize * 0.4} ${-rotateHandleDistance}
            A ${rotateHandleSize * 0.4} ${rotateHandleSize * 0.4} 0 1 1
            ${width / 2 + rotateHandleSize * 0.4} ${-rotateHandleDistance}`}
        fill="none"
        stroke="#fff"
        strokeWidth="25"
        strokeLinecap="round"
        pointerEvents="none"
      />
      <polygon
        points={`${width / 2 + rotateHandleSize * 0.4},${-rotateHandleDistance - rotateHandleSize * 0.25}
                 ${width / 2 + rotateHandleSize * 0.4},${-rotateHandleDistance + rotateHandleSize * 0.25}
                 ${width / 2 + rotateHandleSize * 0.65},${-rotateHandleDistance}`}
        fill="#fff"
        pointerEvents="none"
      />
    </g>
  );
}

export default BlobElement;
