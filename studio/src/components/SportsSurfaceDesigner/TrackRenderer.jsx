// TPV Studio - Track Renderer Component
import React from 'react';
import { calculateTrackGeometry } from '../../lib/sports/trackGeometry.js';
import TrackResizeHandles from './TrackResizeHandles.jsx';

/**
 * Individual track element component
 * Renders a complete running track with all lanes
 */
function TrackElement({ track, isSelected, onMouseDown, onDoubleClick, svgRef }) {
  const { parameters, position, rotation } = track;

  // Calculate track geometry
  const geometry = calculateTrackGeometry(parameters);

  // Get track dimensions for bounding box
  const boundingWidth = geometry.totalWidth;
  const boundingLength = geometry.totalLength;

  // Build transform string
  const transform = `translate(${position.x}, ${position.y}) rotate(${rotation})`;

  // Track line color (default white)
  const lineColor = '#FFFFFF';
  const lineWidth = parameters.lineWidth_mm || 50;

  return (
    <g
      className={`track-element ${isSelected ? 'track-element--selected' : ''}`}
      transform={transform}
      style={{ cursor: 'move' }}
    >
      {/* Invisible clickable area - captures all mouse events */}
      <rect
        x="0"
        y="0"
        width={boundingWidth}
        height={boundingLength}
        fill="transparent"
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        style={{ cursor: 'move' }}
      />

      {/* Render each lane */}
      {geometry.lanes.map((lane, index) => (
        <LaneElement
          key={lane.laneNumber}
          lane={lane}
          lineColor={lineColor}
          lineWidth={lineWidth}
          isLastLane={index === geometry.lanes.length - 1}
        />
      ))}

      {/* Selection indicator */}
      {isSelected && (
        <>
          <rect
            x="-10"
            y="-10"
            width={boundingWidth + 20}
            height={boundingLength + 20}
            fill="none"
            stroke="#0066CC"
            strokeWidth="80"
            strokeDasharray="400 400"
            opacity="0.5"
            pointerEvents="none"
          />
          {/* Resize handles for selected track */}
          <TrackResizeHandles track={track} svgRef={svgRef} />
        </>
      )}
    </g>
  );
}

/**
 * Individual lane element
 * Renders lane boundaries - outer path for all lanes, inner path only for innermost lane
 */
function LaneElement({ lane, lineColor, lineWidth, isLastLane }) {
  const { laneNumber, innerPath, outerPath } = lane;

  // Reduce line width for cleaner appearance (30mm minimum instead of 100mm)
  const visibleLineWidth = Math.max(lineWidth, 30);

  return (
    <g className="track-lane">
      {/* Outer lane boundary - always render (track edge or lane separator) */}
      <path
        d={outerPath}
        fill="none"
        stroke={lineColor}
        strokeWidth={visibleLineWidth}
        vectorEffect="non-scaling-stroke"
      />

      {/* Inner lane boundary - only render for innermost lane (infield edge) */}
      {isLastLane && (
        <path
          d={innerPath}
          fill="none"
          stroke={lineColor}
          strokeWidth={visibleLineWidth}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </g>
  );
}

export default TrackElement;
