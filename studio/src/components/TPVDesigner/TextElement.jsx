// TPV Studio - Text Element Component
// Renders a text label on the canvas with scale-based sizing

import React, { useMemo } from 'react';
import { measureText } from '../../lib/sports/textUtils';

// Base font size for text rendering (scale is applied on top)
const BASE_FONT_SIZE = 500;

/**
 * Individual text element component
 * Renders text with scale transform for sizing (no inline editing)
 *
 * @param {Object} props - Component props
 * @param {Object} props.text - Text data from store
 * @param {boolean} props.isSelected - Whether this text is selected
 * @param {Function} props.onMouseDown - Handler for mouse down (drag start)
 * @param {Function} props.onTouchStart - Handler for touch start (drag start on mobile)
 * @param {Function} props.onDoubleClick - Handler for double click (opens properties panel)
 * @param {Function} props.onScaleStart - Handler for scale handle drag start
 * @param {Function} props.onRotateStart - Handler for rotation handle drag start
 */
function TextElement({
  text,
  isSelected,
  onMouseDown,
  onTouchStart,
  onDoubleClick,
  onScaleStart,
  onRotateStart
}) {
  const {
    content,
    fontFamily,
    fontSize_mm,
    scale_x = 1,
    scale_y = 1,
    fontWeight,
    fontStyle,
    textAlign,
    position,
    rotation,
    fillColor,
    strokeColor,
    strokeWidth_mm
  } = text;

  // Use base font size for measurement, then apply scale
  const baseFontSize = fontSize_mm || BASE_FONT_SIZE;

  // Calculate text bounding box for handles and hit area (at base size)
  const textBounds = useMemo(() => {
    return measureText(content || 'Text', fontFamily, baseFontSize, fontWeight, fontStyle);
  }, [content, fontFamily, baseFontSize, fontWeight, fontStyle]);

  // Scaled bounds (after applying scale transform)
  const scaledBounds = useMemo(() => ({
    width: textBounds.width * scale_x,
    height: baseFontSize * 1.2 * scale_y
  }), [textBounds.width, baseFontSize, scale_x, scale_y]);

  // Calculate offset based on text alignment (at base size, scale applied in transform)
  const alignOffset = useMemo(() => {
    switch (textAlign) {
      case 'center': return -textBounds.width / 2;
      case 'right': return -textBounds.width;
      default: return 0;
    }
  }, [textAlign, textBounds.width]);

  // Build transform string - translate, rotate, then scale
  const transform = `translate(${position.x}, ${position.y}) rotate(${rotation || 0}) scale(${scale_x}, ${scale_y})`;

  // Display text (show 'Text' if empty for visibility)
  const displayContent = content || 'Text';

  return (
    <g
      className={`text-element ${isSelected ? 'text-element--selected' : ''}`}
      transform={transform}
    >
      {/* Display mode - SVG text with optional stroke */}
      <text
        x="0"
        y="0"
        fontFamily={fontFamily}
        fontSize={baseFontSize}
        fontWeight={fontWeight}
        fontStyle={fontStyle}
        textAnchor={textAlign === 'center' ? 'middle' : textAlign === 'right' ? 'end' : 'start'}
        fill={fillColor?.hex || '#1C1C1C'}
        stroke={strokeColor?.hex || 'none'}
        strokeWidth={strokeWidth_mm || 0}
        strokeLinejoin="round"
        strokeLinecap="round"
        paintOrder="stroke fill"
        style={{ cursor: 'move', userSelect: 'none' }}
        pointerEvents="none"
      >
        {displayContent}
      </text>

      {/* Invisible hit area for interaction (at base size, scaled by transform) */}
      <rect
        x={alignOffset - 20}
        y={-baseFontSize * 0.85}
        width={textBounds.width + 40}
        height={baseFontSize * 1.2}
        fill="transparent"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onDoubleClick={onDoubleClick}
        style={{ cursor: 'move' }}
      />

      {/* Selection indicator (at base size, scaled by transform) */}
      {isSelected && (
        <rect
          x={alignOffset - 40}
          y={-baseFontSize - 40}
          width={textBounds.width + 80}
          height={baseFontSize * 1.2 + 80}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={60 / Math.max(scale_x, scale_y)}
          strokeDasharray={`${300 / Math.max(scale_x, scale_y)} ${300 / Math.max(scale_x, scale_y)}`}
          opacity="0.7"
          pointerEvents="none"
        />
      )}

      {/* Resize/rotate handles when selected */}
      {isSelected && (
        <TextHandles
          bounds={textBounds}
          fontSize={baseFontSize}
          alignOffset={alignOffset}
          scale_x={scale_x}
          scale_y={scale_y}
          onScaleStart={onScaleStart}
          onRotateStart={onRotateStart}
        />
      )}
    </g>
  );
}

/**
 * Resize and rotation handles for selected text
 * Corner handles for scaling, top-center handle for rotation
 */
function TextHandles({ bounds, fontSize, alignOffset, scale_x, scale_y, onScaleStart, onRotateStart }) {
  const handleSize = Math.min(bounds.width, fontSize) * 0.15;
  const minHandleSize = 100;
  const maxHandleSize = 300;
  const baseSize = Math.max(minHandleSize, Math.min(maxHandleSize, handleSize));

  // Adjust handle size inversely to scale so handles stay consistent screen size
  const size = baseSize / Math.max(scale_x, scale_y);
  const strokeWidth = 15 / Math.max(scale_x, scale_y);

  // Bounding box dimensions for text (at base size)
  const boxX = alignOffset - 20;
  const boxY = -fontSize - 20;
  const boxWidth = bounds.width + 40;
  const boxHeight = fontSize * 1.2 + 40;

  // Corner handles for scaling
  const scaleHandles = [
    { x: boxX - size / 2, y: boxY - size / 2, corner: 'nw', cursor: 'nwse-resize' },
    { x: boxX + boxWidth - size / 2, y: boxY - size / 2, corner: 'ne', cursor: 'nesw-resize' },
    { x: boxX - size / 2, y: boxY + boxHeight - size / 2, corner: 'sw', cursor: 'nesw-resize' },
    { x: boxX + boxWidth - size / 2, y: boxY + boxHeight - size / 2, corner: 'se', cursor: 'nwse-resize' }
  ];

  // Rotation handle - positioned above top center
  const rotateHandleDistance = size * 2.5;
  const rotateHandleSize = size * 0.8;
  const centerX = boxX + boxWidth / 2;

  return (
    <g className="text-handles">
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
          strokeWidth={strokeWidth}
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
        x1={centerX}
        y1={boxY}
        x2={centerX}
        y2={boxY - rotateHandleDistance + rotateHandleSize / 2}
        stroke="#3b82f6"
        strokeWidth={25 / Math.max(scale_x, scale_y)}
        pointerEvents="none"
      />

      {/* Rotation handle circle */}
      <circle
        cx={centerX}
        cy={boxY - rotateHandleDistance}
        r={rotateHandleSize}
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
        d={`M ${centerX - rotateHandleSize * 0.4} ${boxY - rotateHandleDistance}
            A ${rotateHandleSize * 0.4} ${rotateHandleSize * 0.4} 0 1 1
            ${centerX + rotateHandleSize * 0.4} ${boxY - rotateHandleDistance}`}
        fill="none"
        stroke="#fff"
        strokeWidth={20 / Math.max(scale_x, scale_y)}
        strokeLinecap="round"
        pointerEvents="none"
      />
      <polygon
        points={`${centerX + rotateHandleSize * 0.4},${boxY - rotateHandleDistance - rotateHandleSize * 0.25}
                 ${centerX + rotateHandleSize * 0.4},${boxY - rotateHandleDistance + rotateHandleSize * 0.25}
                 ${centerX + rotateHandleSize * 0.65},${boxY - rotateHandleDistance}`}
        fill="#fff"
        pointerEvents="none"
      />
    </g>
  );
}

export default TextElement;
