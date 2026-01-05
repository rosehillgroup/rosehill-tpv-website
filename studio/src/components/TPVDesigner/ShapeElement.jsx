// TPV Studio - Shape Element Component
// Renders a polygon shape on the sports surface canvas

import React, { useMemo } from 'react';
import { generatePolygonPath } from '../../lib/sports/shapeGeometry';
import { getHandleSize, getRotationHandle, getSelectionStyle } from '../../lib/sports/handleUtils';

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
function ShapeElement({ shape, isSelected, zoom = 1, onMouseDown, onTouchStart, onDoubleClick, onScaleStart, onRotateStart }) {
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
      {isSelected && (() => {
        const selectionStyle = getSelectionStyle(zoom);
        return (
          <rect
            x="-10"
            y="-10"
            width={width_mm + 20}
            height={height_mm + 20}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={selectionStyle.strokeWidth}
            strokeDasharray={selectionStyle.dashArray}
            opacity="0.7"
            pointerEvents="none"
          />
        );
      })()}

      {/* Corner resize handles and rotation handle when selected */}
      {isSelected && (
        <ShapeHandles
          width={width_mm}
          height={height_mm}
          zoom={zoom}
          onScaleStart={onScaleStart}
          onRotateStart={onRotateStart}
        />
      )}
    </g>
  );
}

/**
 * Resize and rotation handles for selected shape
 * Edge handles for scaling, top-center handle for rotation
 */
function ShapeHandles({ width, height, zoom, onScaleStart, onRotateStart }) {
  // Get handle size that stays fixed on screen regardless of zoom
  const { size, strokeWidth, cornerRadius } = getHandleSize(zoom);
  const rotation = getRotationHandle(size);

  // Side handles for scaling (easier to adjust width/height independently)
  const scaleHandles = [
    { x: width / 2 - size / 2, y: -size / 2, corner: 'n', cursor: 'ns-resize' },      // Top center
    { x: width / 2 - size / 2, y: height - size / 2, corner: 's', cursor: 'ns-resize' }, // Bottom center
    { x: width - size / 2, y: height / 2 - size / 2, corner: 'e', cursor: 'ew-resize' }, // Right center
    { x: -size / 2, y: height / 2 - size / 2, corner: 'w', cursor: 'ew-resize' }        // Left center
  ];

  return (
    <g className="shape-handles">
      {/* Scale handles at edges */}
      {scaleHandles.map((handle) => (
        <rect
          key={handle.corner}
          x={handle.x}
          y={handle.y}
          width={size}
          height={size}
          fill="#3b82f6"
          stroke="#fff"
          strokeWidth={strokeWidth}
          rx={cornerRadius}
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
        y2={-rotation.distance + rotation.size / 2}
        stroke="#3b82f6"
        strokeWidth={rotation.stemWidth}
        pointerEvents="none"
      />

      {/* Rotation handle circle */}
      <circle
        cx={width / 2}
        cy={-rotation.distance}
        r={rotation.size}
        fill="#3b82f6"
        stroke="#fff"
        strokeWidth={strokeWidth}
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
        d={`M ${width / 2 - rotation.size * 0.4} ${-rotation.distance}
            A ${rotation.size * 0.4} ${rotation.size * 0.4} 0 1 1
            ${width / 2 + rotation.size * 0.4} ${-rotation.distance}`}
        fill="none"
        stroke="#fff"
        strokeWidth={strokeWidth * 0.7}
        strokeLinecap="round"
        pointerEvents="none"
      />
      <polygon
        points={`${width / 2 + rotation.size * 0.4},${-rotation.distance - rotation.size * 0.25}
                 ${width / 2 + rotation.size * 0.4},${-rotation.distance + rotation.size * 0.25}
                 ${width / 2 + rotation.size * 0.65},${-rotation.distance}`}
        fill="#fff"
        pointerEvents="none"
      />
    </g>
  );
}

export default ShapeElement;
