// TPV Studio - Track Renderer Component
import React from 'react';
import { calculateTrackGeometry, calculateStaggeredStarts } from '../../lib/sports/trackGeometry.js';
import TrackResizeHandles from './TrackResizeHandles.jsx';
import StartingBoxes from './StartingBoxes.jsx';

/**
 * Individual track element component
 * Renders a complete running track with all lanes
 */
function TrackElement({ track, isSelected, onMouseDown, onDoubleClick, svgRef }) {
  const { parameters, position, rotation, trackSurfaceColor } = track;

  // Calculate track geometry
  const geometry = calculateTrackGeometry(parameters);

  // Detect if this is a straight track (parallel lanes)
  const isStraightTrack =
    geometry.lanes.length > 0 &&
    geometry.lanes[0].isParallel === true;

  // Get track dimensions for bounding box
  const boundingWidth = geometry.totalWidth;
  const boundingLength = geometry.totalLength;

  // Build transform string
  const transform = `translate(${position.x}, ${position.y}) rotate(${rotation})`;

  // Track surface and line colors
  const surfaceColor = trackSurfaceColor?.hex || '#A5362F'; // Default Standard Red (RH01)
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

      {/* Track surface fill */}
      {isStraightTrack ? (
        // Straight track: render each lane as filled rectangle
        geometry.lanes.map((lane) => (
          <path
            key={`lane-fill-${lane.laneNumber}`}
            d={lane.outerPath}
            fill={surfaceColor}
            stroke="none"
            pointerEvents="none"
          />
        ))
      ) : (
        // Curved track: render donut shape (outer boundary minus inner infield)
        <path
          d={`${geometry.lanes[0].outerPath} ${geometry.lanes[geometry.lanes.length - 1].innerPath}`}
          fill={surfaceColor}
          fillRule="evenodd"
          stroke="none"
          pointerEvents="none"
        />
      )}

      {/* Render all strokes second (line layer on top) */}
      {geometry.lanes.map((lane, index) => (
        <LaneStrokeElement
          key={`stroke-${lane.laneNumber}`}
          lane={lane}
          lineColor={lineColor}
          lineWidth={lineWidth}
          isLastLane={index === geometry.lanes.length - 1}
          isStraightTrack={isStraightTrack}
          geometry={geometry}
        />
      ))}

      {/* Starting boxes (if enabled) */}
      {parameters.startingBoxes?.enabled && (
        <StartingBoxes
          geometry={geometry}
          parameters={parameters}
          boxConfig={{
            ...parameters.startingBoxes,
            // Auto-calculate staggers for curved tracks (all radii > 0)
            perLaneOffsets: track.template?.trackType === 'curved'
              ? calculateStaggeredStarts(geometry)
              : []
          }}
          surfaceColor={surfaceColor}
          isStraightTrack={track.template?.trackType === 'straight'}
        />
      )}

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
 * Lane stroke component - renders white boundary lines only
 */
function LaneStrokeElement({ lane, lineColor, lineWidth, isLastLane, isStraightTrack, geometry }) {
  const { innerPath, outerPath } = lane;

  // Reduce line width for cleaner appearance (30mm minimum instead of 100mm)
  const visibleLineWidth = Math.max(lineWidth, 30);

  if (isStraightTrack) {
    // For parallel lanes, render vertical lines instead of paths
    return (
      <g className="track-lane-stroke">
        {/* First lane gets left edge */}
        {lane.laneNumber === 1 && (
          <line
            x1={lane.laneX}
            y1={0}
            x2={lane.laneX}
            y2={geometry.totalLength}
            stroke={lineColor}
            strokeWidth={visibleLineWidth}
            pointerEvents="none"
          />
        )}
        {/* All lanes get right edge (acts as separator between lanes) */}
        <line
          x1={lane.laneX + lane.laneWidth}
          y1={0}
          x2={lane.laneX + lane.laneWidth}
          y2={geometry.totalLength}
          stroke={lineColor}
          strokeWidth={visibleLineWidth}
          pointerEvents="none"
        />
      </g>
    );
  } else {
    // Curved track: use path stroking
    return (
      <g className="track-lane-stroke">
        {/* Lane separator line - outer boundary stroke */}
        <path
          d={outerPath}
          fill="none"
          stroke={lineColor}
          strokeWidth={visibleLineWidth}
          pointerEvents="none"
        />

        {/* Infield edge line - only for innermost lane */}
        {isLastLane && (
          <path
            d={innerPath}
            fill="none"
            stroke={lineColor}
            strokeWidth={visibleLineWidth}
            pointerEvents="none"
          />
        )}
      </g>
    );
  }
}

export default TrackElement;
