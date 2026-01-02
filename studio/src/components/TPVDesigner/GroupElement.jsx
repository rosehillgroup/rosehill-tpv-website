// TPV Studio - Group Element Component
// Renders group bounding box and handles for grouped shapes

import React from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';

/**
 * GroupElement renders a bounding box around grouped shapes
 * with handles for moving, scaling, and rotating the group
 */
function GroupElement({ groupId, scale = 1, onDragStart, screenToSVG }) {
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

  // Handle size based on scale (keep consistent visual size)
  const handleSize = 8 / scale;
  const halfHandle = handleSize / 2;

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
        strokeWidth={isSelected ? 2 / scale : 1 / scale}
        strokeDasharray={isSelected ? 'none' : `${4 / scale} ${4 / scale}`}
        rx={4 / scale}
        ry={4 / scale}
        style={{ cursor: 'move' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      />

      {/* Group label */}
      {!isSelected && (
        <text
          x={x + 4 / scale}
          y={y - 4 / scale}
          fontSize={10 / scale}
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
            strokeWidth={1.5 / scale}
            rx={2 / scale}
            style={{ cursor: 'nwse-resize' }}
          />
          {/* Top-right */}
          <rect
            x={x + width - halfHandle}
            y={y - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={1.5 / scale}
            rx={2 / scale}
            style={{ cursor: 'nesw-resize' }}
          />
          {/* Bottom-left */}
          <rect
            x={x - halfHandle}
            y={y + height - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={1.5 / scale}
            rx={2 / scale}
            style={{ cursor: 'nesw-resize' }}
          />
          {/* Bottom-right */}
          <rect
            x={x + width - halfHandle}
            y={y + height - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={1.5 / scale}
            rx={2 / scale}
            style={{ cursor: 'nwse-resize' }}
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
            strokeWidth={1.5 / scale}
            rx={2 / scale}
            style={{ cursor: 'ns-resize' }}
          />
          {/* Bottom */}
          <rect
            x={x + width / 2 - halfHandle}
            y={y + height - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={1.5 / scale}
            rx={2 / scale}
            style={{ cursor: 'ns-resize' }}
          />
          {/* Left */}
          <rect
            x={x - halfHandle}
            y={y + height / 2 - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={1.5 / scale}
            rx={2 / scale}
            style={{ cursor: 'ew-resize' }}
          />
          {/* Right */}
          <rect
            x={x + width - halfHandle}
            y={y + height / 2 - halfHandle}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#9333ea"
            strokeWidth={1.5 / scale}
            rx={2 / scale}
            style={{ cursor: 'ew-resize' }}
          />

          {/* Rotation handle */}
          <line
            x1={x + width / 2}
            y1={y}
            x2={x + width / 2}
            y2={y - 20 / scale}
            stroke="#9333ea"
            strokeWidth={1.5 / scale}
          />
          <circle
            cx={x + width / 2}
            cy={y - 24 / scale}
            r={handleSize / 2}
            fill="white"
            stroke="#9333ea"
            strokeWidth={1.5 / scale}
            style={{ cursor: 'grab' }}
          />

          {/* Selected label */}
          <text
            x={x + width / 2}
            y={y - 32 / scale}
            fontSize={10 / scale}
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
          <g transform={`translate(${x + width - 8 / scale}, ${y - 8 / scale})`}>
            <circle
              cx={0}
              cy={0}
              r={8 / scale}
              fill="#9333ea"
            />
            <text
              x={0}
              y={0}
              fontSize={8 / scale}
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
