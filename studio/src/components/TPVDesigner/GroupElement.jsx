// TPV Studio - Group Element Component
// Renders group bounding box and handles for grouped shapes

import React from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';

/**
 * GroupElement renders a bounding box around grouped shapes
 * with handles for moving, scaling, and rotating the group
 */
function GroupElement({ groupId, scale = 1, onDragStart, onScaleStart, screenToSVG }) {
  const {
    groups,
    selectedGroupId,
    editingGroupId,
    shapes,
    selectGroup,
    enterGroup,
    updateGroupPosition,
    commitGroupMove
  } = useSportsDesignStore();

  const group = groups[groupId];
  if (!group || !group.bounds) return null;

  // Don't render bounding box if we're editing inside this group
  if (editingGroupId === groupId) return null;

  const isSelected = selectedGroupId === groupId;
  const { x, y, width, height } = group.bounds;

  // Handle size based on group bounds (similar to other elements)
  // All sizes in mm to match canvas coordinate system
  const baseHandleSize = Math.min(width, height) * 0.06;
  const minHandleSize = 200; // 200mm minimum
  const maxHandleSize = 500; // 500mm maximum
  const handleSize = Math.max(minHandleSize, Math.min(maxHandleSize, baseHandleSize));
  const halfHandle = handleSize / 2;

  // Stroke and other UI element sizes (in mm)
  const strokeWidth = handleSize * 0.15;
  const cornerRadius = handleSize * 0.2;
  const fontSize = handleSize * 0.8;
  const rotationLineLength = handleSize * 1.5;

  // Event handlers
  const handleMouseDown = (e) => {
    e.stopPropagation();
    selectGroup(groupId);

    // Start dragging if not locked and we have drag handlers
    if (group.locked) return;
    if (onDragStart && screenToSVG) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const svgPoint = screenToSVG(clientX, clientY);
      onDragStart(groupId, {
        x: svgPoint.x - group.bounds.x,
        y: svgPoint.y - group.bounds.y
      });
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    enterGroup(groupId);
  };

  const handleScaleStart = (e, corner) => {
    e.stopPropagation();
    if (onScaleStart) {
      onScaleStart(e, groupId, corner);
    }
  };

  // Calculate child shape positions to render overlay
  const childShapes = group.childIds
    .map(id => shapes[id])
    .filter(Boolean);

  return (
    <g className="group-element">
      {/* Group bounding box - clickable area */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="transparent"
        stroke={isSelected ? '#9333ea' : '#a855f7'}
        strokeWidth={isSelected ? strokeWidth : strokeWidth * 0.5}
        strokeDasharray={isSelected ? 'none' : `${strokeWidth * 3} ${strokeWidth * 3}`}
        rx={cornerRadius}
        ry={cornerRadius}
        style={{ cursor: 'move' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      />

      {/* Group label */}
      {!isSelected && (
        <text
          x={x + strokeWidth}
          y={y - strokeWidth}
          fontSize={fontSize}
          fill="#9333ea"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="500"
        >
          {group.compoundType
            ? `${group.compoundType.charAt(0).toUpperCase() + group.compoundType.slice(1)} Group`
            : group.customName || 'Group'
          }
        </text>
      )}

      {/* Selection handles when selected */}
      {isSelected && (
        <>
          {/* Corner handles */}
          {/* Top-left */}
          <rect
            x={x - halfHandle}
            y={y - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={strokeWidth}
            rx={cornerRadius}
            style={{ cursor: 'nwse-resize' }}
            onMouseDown={(e) => handleScaleStart(e, 'nw')}
            onTouchStart={(e) => handleScaleStart(e, 'nw')}
          />
          {/* Top-right */}
          <rect
            x={x + width - halfHandle}
            y={y - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={strokeWidth}
            rx={cornerRadius}
            style={{ cursor: 'nesw-resize' }}
            onMouseDown={(e) => handleScaleStart(e, 'ne')}
            onTouchStart={(e) => handleScaleStart(e, 'ne')}
          />
          {/* Bottom-left */}
          <rect
            x={x - halfHandle}
            y={y + height - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={strokeWidth}
            rx={cornerRadius}
            style={{ cursor: 'nesw-resize' }}
            onMouseDown={(e) => handleScaleStart(e, 'sw')}
            onTouchStart={(e) => handleScaleStart(e, 'sw')}
          />
          {/* Bottom-right */}
          <rect
            x={x + width - halfHandle}
            y={y + height - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={strokeWidth}
            rx={cornerRadius}
            style={{ cursor: 'nwse-resize' }}
            onMouseDown={(e) => handleScaleStart(e, 'se')}
            onTouchStart={(e) => handleScaleStart(e, 'se')}
          />

          {/* Edge handles */}
          {/* Top */}
          <rect
            x={x + width / 2 - halfHandle}
            y={y - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={strokeWidth}
            rx={cornerRadius}
            style={{ cursor: 'ns-resize' }}
            onMouseDown={(e) => handleScaleStart(e, 'n')}
            onTouchStart={(e) => handleScaleStart(e, 'n')}
          />
          {/* Bottom */}
          <rect
            x={x + width / 2 - halfHandle}
            y={y + height - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={strokeWidth}
            rx={cornerRadius}
            style={{ cursor: 'ns-resize' }}
            onMouseDown={(e) => handleScaleStart(e, 's')}
            onTouchStart={(e) => handleScaleStart(e, 's')}
          />
          {/* Left */}
          <rect
            x={x - halfHandle}
            y={y + height / 2 - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={strokeWidth}
            rx={cornerRadius}
            style={{ cursor: 'ew-resize' }}
            onMouseDown={(e) => handleScaleStart(e, 'w')}
            onTouchStart={(e) => handleScaleStart(e, 'w')}
          />
          {/* Right */}
          <rect
            x={x + width - halfHandle}
            y={y + height / 2 - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={strokeWidth}
            rx={cornerRadius}
            style={{ cursor: 'ew-resize' }}
            onMouseDown={(e) => handleScaleStart(e, 'e')}
            onTouchStart={(e) => handleScaleStart(e, 'e')}
          />

          {/* Rotation handle */}
          <line
            x1={x + width / 2}
            y1={y}
            x2={x + width / 2}
            y2={y - rotationLineLength}
            stroke="#9333ea"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={x + width / 2}
            cy={y - rotationLineLength - halfHandle}
            r={halfHandle}
            fill="white"
            stroke="#9333ea"
            strokeWidth={strokeWidth}
            style={{ cursor: 'grab' }}
          />

          {/* Selected label */}
          <text
            x={x + width / 2}
            y={y - rotationLineLength - handleSize - fontSize * 0.5}
            fontSize={fontSize}
            fill="#9333ea"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="600"
            textAnchor="middle"
          >
            {group.compoundType
              ? `${group.compoundType.charAt(0).toUpperCase() + group.compoundType.slice(1)}`
              : group.customName || 'Group'
            }
          </text>

          {/* Child count badge */}
          <g transform={`translate(${x + width + halfHandle}, ${y - halfHandle})`}>
            <circle
              cx={0}
              cy={0}
              r={halfHandle}
              fill="#9333ea"
            />
            <text
              x={0}
              y={0}
              fontSize={fontSize * 0.7}
              fill="white"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {group.childIds.length}
            </text>
          </g>
        </>
      )}
    </g>
  );
}

export default GroupElement;
