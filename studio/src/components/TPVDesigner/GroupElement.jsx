// TPV Studio - Group Element Component
// Renders group bounding box and handles for grouped shapes

import React from 'react';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';
import { getHandleSize, getRotationHandle, getSelectionStyle } from '../../lib/sports/handleUtils';

/**
 * GroupElement renders a bounding box around grouped shapes
 * with handles for moving, scaling, and rotating the group
 */
function GroupElement({ groupId, zoom = 1, onDragStart, onScaleStart, onRotateStart, screenToSVG }) {
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

  // Get handle size that stays fixed on screen regardless of zoom
  const { size: handleSize, strokeWidth: handleStrokeWidth, cornerRadius } = getHandleSize(zoom);
  const rotation = getRotationHandle(handleSize);
  const halfHandle = handleSize / 2;

  // Selection style that scales with zoom
  const selectionStyle = getSelectionStyle(zoom);

  // Font size scales with zoom
  const fontSize = handleSize * 0.8;

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

  const handleRotateStart = (e) => {
    e.stopPropagation();
    if (onRotateStart) {
      onRotateStart(e, groupId);
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
        strokeWidth={isSelected ? selectionStyle.strokeWidth : selectionStyle.strokeWidth * 0.5}
        strokeDasharray={isSelected ? 'none' : selectionStyle.dashArray}
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
          x={x + handleStrokeWidth}
          y={y - handleStrokeWidth}
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
            strokeWidth={handleStrokeWidth}
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
            strokeWidth={handleStrokeWidth}
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
            strokeWidth={handleStrokeWidth}
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
            strokeWidth={handleStrokeWidth}
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
            strokeWidth={handleStrokeWidth}
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
            strokeWidth={handleStrokeWidth}
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
            strokeWidth={handleStrokeWidth}
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
            strokeWidth={handleStrokeWidth}
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
            y2={y - rotation.distance + rotation.size / 2}
            stroke="#9333ea"
            strokeWidth={rotation.stemWidth}
          />
          <circle
            cx={x + width / 2}
            cy={y - rotation.distance}
            r={rotation.size}
            fill="white"
            stroke="#9333ea"
            strokeWidth={handleStrokeWidth}
            style={{ cursor: 'grab' }}
            onMouseDown={handleRotateStart}
            onTouchStart={handleRotateStart}
          />

          {/* Selected label */}
          <text
            x={x + width / 2}
            y={y - rotation.distance - handleSize - fontSize * 0.5}
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
