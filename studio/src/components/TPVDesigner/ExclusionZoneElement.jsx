// TPV Studio - Exclusion Zone Element Component
// Renders exclusion zones (buildings, obstacles) with crosshatch pattern

import React, { useMemo } from 'react';
import { generatePolygonPath } from '../../lib/sports/shapeGeometry';
import { controlPointsToSVGPath } from '../../lib/sports/pathGeometry';
import { getHandleSize, getRotationHandle, getSelectionStyle } from '../../lib/sports/handleUtils';

/**
 * Exclusion Zone Element
 * Renders areas that are excluded from the play surface (buildings, planters, etc.)
 * Uses a crosshatch pattern to indicate non-playable area
 */
function ExclusionZoneElement({
  zone,
  isSelected,
  zoom = 1,
  onMouseDown,
  onTouchStart,
  onDoubleClick,
  onScaleStart,
  onRotateStart
}) {
  const {
    id,
    shapeType,
    sides,
    width_mm,
    height_mm,
    cornerRadius,
    position,
    rotation,
    controlPoints
  } = zone;

  // Generate unique pattern ID for this zone
  const patternId = `exclusion-crosshatch-${id}`;

  // Generate the SVG path for this zone
  const zonePath = useMemo(() => {
    if (shapeType === 'path' && controlPoints) {
      // Use path/bezier geometry
      return controlPointsToSVGPath(controlPoints, width_mm, height_mm, true);
    }
    // Use polygon geometry
    return generatePolygonPath(sides || 4, width_mm, height_mm, cornerRadius || 0);
  }, [shapeType, sides, width_mm, height_mm, cornerRadius, controlPoints]);

  // Calculate center for rotation
  const centerX = width_mm / 2;
  const centerY = height_mm / 2;

  // Build transform string
  const transform = `translate(${position.x}, ${position.y}) rotate(${rotation || 0}, ${centerX}, ${centerY})`;

  // Crosshatch pattern properties scaled to the zone size
  const patternSize = Math.min(width_mm, height_mm) * 0.02; // 2% of smaller dimension
  const minPatternSize = 100;
  const maxPatternSize = 500;
  const actualPatternSize = Math.max(minPatternSize, Math.min(maxPatternSize, patternSize));
  const strokeWidth = actualPatternSize * 0.15;

  return (
    <g
      className={`exclusion-zone-element ${isSelected ? 'exclusion-zone-element--selected' : ''}`}
      transform={transform}
      style={{ cursor: 'move' }}
    >
      {/* Define the crosshatch pattern for this zone */}
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={actualPatternSize}
          height={actualPatternSize}
          patternTransform="rotate(45)"
        >
          {/* Background */}
          <rect
            width={actualPatternSize}
            height={actualPatternSize}
            fill="#e5e5e5"
          />
          {/* Diagonal lines */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={actualPatternSize}
            stroke="#999"
            strokeWidth={strokeWidth}
          />
          <line
            x1={actualPatternSize / 2}
            y1="0"
            x2={actualPatternSize / 2}
            y2={actualPatternSize}
            stroke="#999"
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>

      {/* Render the zone with crosshatch fill */}
      <path
        d={zonePath}
        fill={`url(#${patternId})`}
        stroke="#666"
        strokeWidth="60"
        strokeDasharray="200 100"
        pointerEvents="none"
      />

      {/* Invisible clickable area */}
      <path
        d={zonePath}
        fill="transparent"
        stroke="transparent"
        strokeWidth="200"
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
            stroke="#ef4444"
            strokeWidth={selectionStyle.strokeWidth}
            strokeDasharray={selectionStyle.dashArray}
            opacity="0.7"
            pointerEvents="none"
          />
        );
      })()}

      {/* Resize and rotation handles when selected */}
      {isSelected && (
        <ExclusionZoneHandles
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
 * Resize and rotation handles for selected exclusion zone
 * Edge handles for scaling, top-center handle for rotation
 */
function ExclusionZoneHandles({ width, height, zoom, onScaleStart, onRotateStart }) {
  // Get handle size that stays fixed on screen regardless of zoom
  const { size, strokeWidth, cornerRadius } = getHandleSize(zoom);
  const rotation = getRotationHandle(size);

  // Side handles for scaling
  const scaleHandles = [
    { x: width / 2 - size / 2, y: -size / 2, corner: 'n', cursor: 'ns-resize' },
    { x: width / 2 - size / 2, y: height - size / 2, corner: 's', cursor: 'ns-resize' },
    { x: width - size / 2, y: height / 2 - size / 2, corner: 'e', cursor: 'ew-resize' },
    { x: -size / 2, y: height / 2 - size / 2, corner: 'w', cursor: 'ew-resize' }
  ];

  return (
    <g className="exclusion-zone-handles">
      {/* Scale handles at edges */}
      {scaleHandles.map((handle) => (
        <rect
          key={handle.corner}
          x={handle.x}
          y={handle.y}
          width={size}
          height={size}
          fill="#ef4444"
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
        stroke="#ef4444"
        strokeWidth={rotation.stemWidth}
        pointerEvents="none"
      />

      {/* Rotation handle circle */}
      <circle
        cx={width / 2}
        cy={-rotation.distance}
        r={rotation.size}
        fill="#ef4444"
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

      {/* Rotation icon */}
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

export default ExclusionZoneElement;
