// TPV Studio - Track Renderer Component
import React from 'react';
import { calculateTrackGeometry } from '../../lib/sports/trackGeometry.js';
import TrackResizeHandles from './TrackResizeHandles.jsx';

/**
 * Individual track element component
 * Renders a complete running track with all lanes
 */
function TrackElement({ track, isSelected, onMouseDown, onDoubleClick, svgRef }) {
  const { parameters, position, rotation, trackSurfaceColor } = track;

  // Calculate track geometry
  const geometry = calculateTrackGeometry(parameters);

  // Get track dimensions for bounding box
  const boundingWidth = geometry.totalWidth;
  const boundingLength = geometry.totalLength;

  // Build transform string
  const transform = `translate(${position.x}, ${position.y}) rotate(${rotation})`;

  // Track surface and line colors
  const surfaceColor = trackSurfaceColor?.hex || '#DC143C'; // Default red
  const lineColor = '#FFFFFF';
  const lineWidth = parameters.lineWidth_mm || 50;

  // Debug logging
  console.log('TrackRenderer - trackSurfaceColor:', trackSurfaceColor);
  console.log('TrackRenderer - surfaceColor:', surfaceColor);
  console.log('TrackRenderer - geometry.lanes.length:', geometry.lanes.length);

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
          surfaceColor={surfaceColor}
          lineColor={lineColor}
          lineWidth={lineWidth}
          isFirstLane={index === 0}
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
 * Renders lane with colored surface and white boundary lines
 */
function LaneElement({ lane, surfaceColor, lineColor, lineWidth, isFirstLane, isLastLane }) {
  const { laneNumber, innerPath, outerPath } = lane;

  // Reduce line width for cleaner appearance (30mm minimum instead of 100mm)
  const visibleLineWidth = Math.max(lineWidth, 30);

  // Debug logging
  console.log(`Lane ${laneNumber} - isFirstLane: ${isFirstLane}, isLastLane: ${isLastLane}, surfaceColor: ${surfaceColor}`);

  return (
    <g className="track-lane">
      {/* Filled track surface - ONLY fill outermost boundary (Lane 1) */}
      {isFirstLane && (
        <path
          d={outerPath}
          fill={surfaceColor}
          stroke="none"
        />
      )}

      {/* White infield - ONLY fill innermost boundary (last lane) */}
      {isLastLane && (
        <path
          d={innerPath}
          fill="#FFFFFF"
          stroke="none"
        />
      )}

      {/* Lane separator line - outer boundary stroke */}
      <path
        d={outerPath}
        fill="none"
        stroke={lineColor}
        strokeWidth={visibleLineWidth}
        vectorEffect="non-scaling-stroke"
      />

      {/* Infield edge line - only for innermost lane */}
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
