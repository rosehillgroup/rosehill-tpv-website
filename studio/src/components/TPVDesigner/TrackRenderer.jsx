// TPV Studio - Track Renderer Component
import React from 'react';
import { calculateTrackGeometry, calculateStaggeredStarts } from '../../lib/sports/trackGeometry.js';
import TrackResizeHandles from './TrackResizeHandles.jsx';
import StartingBoxes from './StartingBoxes.jsx';

/**
 * Individual track element component
 * Renders a complete running track with all lanes
 */
function TrackElement({ track, isSelected, onMouseDown, onTouchStart, onDoubleClick, svgRef }) {
  const { parameters, position, rotation, scale = 1, trackSurfaceColor, trackLineColor, laneSurfaceColors } = track;

  // Calculate track geometry
  const geometry = calculateTrackGeometry(parameters);

  // Detect if this is a straight track (parallel lanes)
  const isStraightTrack =
    geometry.lanes.length > 0 &&
    geometry.lanes[0].isParallel === true;

  // Get track dimensions for bounding box
  const boundingWidth = geometry.totalWidth;
  const boundingLength = geometry.totalLength;

  // Build transform string - translate, scale, then rotate around center point
  const centerX = boundingWidth / 2;
  const centerY = boundingLength / 2;
  const transform = `translate(${position.x}, ${position.y}) scale(${scale}) rotate(${rotation}, ${centerX}, ${centerY})`;

  // Track surface and line colors
  const defaultSurfaceColor = trackSurfaceColor?.hex || '#A5362F'; // Default Standard Red (RH01)
  const lineColor = trackLineColor?.hex || '#E8E3D8'; // Default RH31 Cream
  const lineWidth = parameters.lineWidth_mm || 50;

  // Helper to get lane-specific color
  const getLaneColor = (laneNumber) => {
    const override = laneSurfaceColors?.[laneNumber - 1];
    return override?.hex || defaultSurfaceColor;
  };

  // Debug logging
  console.log('TrackRenderer - trackSurfaceColor:', trackSurfaceColor);
  console.log('TrackRenderer - defaultSurfaceColor:', defaultSurfaceColor);
  console.log('TrackRenderer - geometry.lanes.length:', geometry.lanes.length);

  return (
    <g
      className={`track-element ${isSelected ? 'track-element--selected' : ''}`}
      transform={transform}
      style={{ cursor: 'move' }}
    >
      {/* Track surface fill with click handling */}
      {isStraightTrack ? (
        // Straight track: render each lane as filled rectangle
        // Use a single rect for hit area since it's a solid rectangular shape
        <>
          <rect
            x="0"
            y="0"
            width={boundingWidth}
            height={boundingLength}
            fill="transparent"
            pointerEvents="all"
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onDoubleClick={onDoubleClick}
            style={{ cursor: 'move' }}
          />
          {geometry.lanes.map((lane) => (
            <path
              key={`lane-fill-${lane.laneNumber}`}
              d={lane.outerPath}
              fill={getLaneColor(lane.laneNumber)}
              stroke="none"
              pointerEvents="none"
            />
          ))}
        </>
      ) : (
        // Curved track: render each lane as individual ring for per-lane colors
        <>
          {geometry.lanes.map((lane, index) => {
            // Use next lane's outer path as this lane's inner boundary
            const nextLane = geometry.lanes[index + 1];
            const innerPath = nextLane ? nextLane.outerPath : lane.innerPath;
            const isFirstLane = index === 0;

            return (
              <path
                key={`lane-fill-${lane.laneNumber}`}
                d={`${lane.outerPath} ${innerPath}`}
                fill={getLaneColor(lane.laneNumber)}
                fillRule="evenodd"
                stroke="none"
                pointerEvents={isFirstLane ? 'all' : 'none'}
                onMouseDown={isFirstLane ? onMouseDown : undefined}
                onTouchStart={isFirstLane ? onTouchStart : undefined}
                onDoubleClick={isFirstLane ? onDoubleClick : undefined}
                style={isFirstLane ? { cursor: 'move' } : undefined}
              />
            );
          })}
        </>
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
          surfaceColor={defaultSurfaceColor}
          lineColor={lineColor}
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

  // World Athletics standard: 50mm line width for all track markings
  const visibleLineWidth = 50;

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
