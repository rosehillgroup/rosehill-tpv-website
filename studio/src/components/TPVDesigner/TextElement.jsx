// TPV Studio - Text Element Component
// Renders a text label on the canvas with inline editing support

import React, { useMemo, useRef, useEffect } from 'react';
import { measureText } from '../../lib/sports/textUtils';

/**
 * Individual text element component
 * Renders text with inline editing on double-click
 *
 * @param {Object} props - Component props
 * @param {Object} props.text - Text data from store
 * @param {boolean} props.isSelected - Whether this text is selected
 * @param {boolean} props.isEditing - Whether text is in inline edit mode
 * @param {Function} props.onMouseDown - Handler for mouse down (drag start)
 * @param {Function} props.onTouchStart - Handler for touch start (drag start on mobile)
 * @param {Function} props.onDoubleClick - Handler for double click (enter edit mode)
 * @param {Function} props.onScaleStart - Handler for scale handle drag start
 * @param {Function} props.onRotateStart - Handler for rotation handle drag start
 * @param {Function} props.onContentChange - Handler for text content changes
 * @param {Function} props.onEditComplete - Handler when editing is complete
 */
function TextElement({
  text,
  isSelected,
  isEditing,
  onMouseDown,
  onTouchStart,
  onDoubleClick,
  onScaleStart,
  onRotateStart,
  onContentChange,
  onEditComplete
}) {
  const inputRef = useRef(null);

  const {
    content,
    fontFamily,
    fontSize_mm,
    fontWeight,
    fontStyle,
    textAlign,
    position,
    rotation,
    fillColor
  } = text;

  // Calculate text bounding box for handles and hit area
  const textBounds = useMemo(() => {
    return measureText(content, fontFamily, fontSize_mm, fontWeight, fontStyle);
  }, [content, fontFamily, fontSize_mm, fontWeight, fontStyle]);

  // Calculate offset based on text alignment
  const alignOffset = useMemo(() => {
    switch (textAlign) {
      case 'center': return -textBounds.width / 2;
      case 'right': return -textBounds.width;
      default: return 0;
    }
  }, [textAlign, textBounds.width]);

  // Build transform string - rotate around text position
  const transform = `translate(${position.x}, ${position.y}) rotate(${rotation || 0})`;

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Handle key down in input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      onEditComplete?.();
    }
  };

  // Display text (placeholder if empty)
  const displayContent = content || 'Double-click to edit';

  return (
    <g
      className={`text-element ${isSelected ? 'text-element--selected' : ''} ${isEditing ? 'text-element--editing' : ''}`}
      transform={transform}
    >
      {isEditing ? (
        // Inline edit mode - foreignObject with input
        <foreignObject
          x={alignOffset - 10}
          y={-fontSize_mm * 0.85}
          width={Math.max(textBounds.width + 200, 500)}
          height={fontSize_mm * 1.5}
          style={{ overflow: 'visible' }}
        >
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => onContentChange?.(e.target.value)}
            onBlur={onEditComplete}
            onKeyDown={handleKeyDown}
            style={{
              fontFamily,
              fontSize: `${fontSize_mm}px`,
              fontWeight,
              fontStyle,
              color: fillColor?.hex || '#1C1C1C',
              background: 'rgba(255,255,255,0.95)',
              border: '4px solid #3b82f6',
              borderRadius: '4px',
              outline: 'none',
              padding: '4px 8px',
              width: '100%',
              boxSizing: 'border-box',
              lineHeight: 1
            }}
          />
        </foreignObject>
      ) : (
        <>
          {/* Display mode - SVG text */}
          <text
            x="0"
            y="0"
            fontFamily={fontFamily}
            fontSize={fontSize_mm}
            fontWeight={fontWeight}
            fontStyle={fontStyle}
            textAnchor={textAlign === 'center' ? 'middle' : textAlign === 'right' ? 'end' : 'start'}
            fill={fillColor?.hex || '#1C1C1C'}
            style={{ cursor: 'move', userSelect: 'none' }}
            pointerEvents="none"
          >
            {displayContent}
          </text>

          {/* Invisible hit area for interaction */}
          <rect
            x={alignOffset - 20}
            y={-fontSize_mm * 0.85}
            width={textBounds.width + 40}
            height={fontSize_mm * 1.2}
            fill="transparent"
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onDoubleClick={onDoubleClick}
            style={{ cursor: 'move' }}
          />
        </>
      )}

      {/* Selection indicator */}
      {isSelected && !isEditing && (
        <rect
          x={alignOffset - 40}
          y={-fontSize_mm - 40}
          width={textBounds.width + 80}
          height={fontSize_mm * 1.2 + 80}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="60"
          strokeDasharray="300 300"
          opacity="0.7"
          pointerEvents="none"
        />
      )}

      {/* Resize/rotate handles when selected */}
      {isSelected && !isEditing && (
        <TextHandles
          bounds={textBounds}
          fontSize={fontSize_mm}
          alignOffset={alignOffset}
          onScaleStart={onScaleStart}
          onRotateStart={onRotateStart}
        />
      )}
    </g>
  );
}

/**
 * Resize and rotation handles for selected text
 * Corner handles for font size scaling, top-center handle for rotation
 */
function TextHandles({ bounds, fontSize, alignOffset, onScaleStart, onRotateStart }) {
  const handleSize = Math.min(bounds.width, fontSize) * 0.15;
  const minHandleSize = 100;
  const maxHandleSize = 300;
  const size = Math.max(minHandleSize, Math.min(maxHandleSize, handleSize));

  // Bounding box dimensions for text
  const boxX = alignOffset - 20;
  const boxY = -fontSize - 20;
  const boxWidth = bounds.width + 40;
  const boxHeight = fontSize * 1.2 + 40;

  // Corner handles for scaling (affects font size)
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
          strokeWidth="15"
          rx={size / 4}
          style={{ cursor: handle.cursor }}
          pointerEvents="all"
          onMouseDown={(e) => {
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
        strokeWidth="25"
        pointerEvents="none"
      />

      {/* Rotation handle circle */}
      <circle
        cx={centerX}
        cy={boxY - rotateHandleDistance}
        r={rotateHandleSize}
        fill="#3b82f6"
        stroke="#fff"
        strokeWidth="15"
        style={{ cursor: 'grab' }}
        pointerEvents="all"
        onMouseDown={(e) => {
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
        strokeWidth="20"
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
