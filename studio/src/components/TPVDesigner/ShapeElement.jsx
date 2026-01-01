// TPV Studio - Shape Element Component
// Renders a polygon shape on the sports surface canvas

import React, { useMemo } from 'react';
import { generatePolygonPath } from '../../lib/sports/shapeGeometry';

/**
 * Individual shape element component
 * Renders a polygon shape (triangle, square, circle, etc.) on the sports canvas
 *
 * @param {Object} props - Component props
 * @param {Object} props.shape - Shape data from store
 * @param {boolean} props.isSelected - Whether this shape is selected
 * @param {Function} props.onMouseDown - Handler for mouse down (drag start)
 * @param {Function} props.onTouchStart - Handler for touch start (drag start on mobile)
 * @param {Function} props.onDoubleClick - Handler for double click (open properties)
 * @param {Function} props.onScaleStart - Handler for scale handle drag start
 * @param {Function} props.onRotateStart - Handler for rotation handle drag start
 */
function ShapeElement({ shape, isSelected, onMouseDown, onTouchStart, onDoubleClick, onScaleStart, onRotateStart }) {
  const {
    sides,
    width_mm,
    height_mm,
    cornerRadius,
    starMode,
    innerRadius,
    position,
    rotation,
    fillColor,
    strokeEnabled,
    strokeColor,
    strokeWidth_mm
  } = shape;

  // Generate the SVG path for this shape
  const shapePath = useMemo(() => {
    return generatePolygonPath(sides, width_mm, height_mm, cornerRadius, starMode, innerRadius);
  }, [sides, width_mm, height_mm, cornerRadius, starMode, innerRadius]);

  // Calculate center for rotation
  const centerX = width_mm / 2;
  const centerY = height_mm / 2;

  // Build transform string
  const transform = `translate(${position.x}, ${position.y}) rotate(${rotation || 0}, ${centerX}, ${centerY})`;

  return (
    <g
      className={`shape-element ${isSelected ? 'shape-element--selected' : ''}`}
      transform={transform}
      style={{ cursor: 'move' }}
    >
      {/* Render the shape */}
      <path
        d={shapePath}
        fill={fillColor?.hex || '#609B63'}
        stroke={strokeEnabled && strokeColor ? strokeColor.hex : 'none'}
        strokeWidth={strokeEnabled ? strokeWidth_mm : 0}
        pointerEvents="none"
      />

      {/* Invisible clickable area - captures all mouse/touch events */}
      <path
        d={shapePath}
        fill="transparent"
        stroke="transparent"
        strokeWidth={Math.max(strokeWidth_mm, 100)} // Minimum hit area
        pointerEvents="all"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
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
        <ShapeHandles
          width={width_mm}
          height={height_mm}
          onScaleStart={onScaleStart}
          onRotateStart={onRotateStart}
        />
      )}
    </g>
  );
}

/**
 * Resize and rotation handles for selected shape
 * Corner handles for scaling, top-center handle for rotation
 */
function ShapeHandles({ width, height, onScaleStart, onRotateStart }) {
  const handleSize = Math.min(width, height) * 0.08;
  const minHandleSize = 150;
  const maxHandleSize = 400;
  const size = Math.max(minHandleSize, Math.min(maxHandleSize, handleSize));

  // Side handles for scaling (easier to adjust width/height independently)
  const scaleHandles = [
    { x: width / 2 - size / 2, y: -size / 2, corner: 'n', cursor: 'ns-resize' },      // Top center
    { x: width / 2 - size / 2, y: height - size / 2, corner: 's', cursor: 'ns-resize' }, // Bottom center
    { x: width - size / 2, y: height / 2 - size / 2, corner: 'e', cursor: 'ew-resize' }, // Right center
    { x: -size / 2, y: height / 2 - size / 2, corner: 'w', cursor: 'ew-resize' }        // Left center
  ];

  // Rotation handle - positioned above top center
  const rotateHandleDistance = size * 2.5;
  const rotateHandleSize = size * 0.8;

  return (
    <g className="shape-handles">
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

export default ShapeElement;
