// TPV Studio - Starting Boxes Component
import React from 'react';

/**
 * StartingBoxes Component
 * Renders starting boxes at the beginning of each lane in a track
 * Supports both straight and curved tracks with optional staggered starts
 *
 * @param {object} geometry - Track geometry from calculateTrackGeometry()
 * @param {object} parameters - Track parameters
 * @param {object} boxConfig - Starting box configuration
 * @param {string} surfaceColor - Track surface color hex value
 * @param {boolean} isStraightTrack - Whether this is a straight track (parallel lanes) vs curved (concentric lanes)
 */
function StartingBoxes({ geometry, parameters, boxConfig, surfaceColor, isStraightTrack }) {
  if (!boxConfig || !boxConfig.enabled) return null;

  const {
    depth_mm = 400,
    lineWidth_mm = 50,
    perLaneOffsets = []  // For staggered starts: [0, 7660, 15330, ...]
  } = boxConfig;

  // Use track surface color for boxes by default
  const boxFillColor = surfaceColor || '#A5362F';
  const lineColor = '#FFFFFF'; // White starting line

  return (
    <g className="starting-boxes">
      {geometry.lanes.map((lane, index) => {
        const laneNumber = index + 1;
        const laneOffset = index * parameters.laneWidth_mm;

        // Calculate box position (with stagger for curved tracks)
        const staggerOffset = perLaneOffsets[index] || 0;
        const boxY = staggerOffset; // Position along track

        // Box rectangle dimensions
        let boxX, boxWidth;

        if (isStraightTrack) {
          // Straight track: lanes are parallel vertical strips
          boxX = index * parameters.laneWidth_mm;
          boxWidth = parameters.laneWidth_mm;
        } else {
          // Curved track: lanes are concentric rings, boxes span width at start position
          boxX = laneOffset;
          boxWidth = parameters.width_mm - (2 * laneOffset);
        }

        return (
          <g key={`start-box-${laneNumber}`}>
            {/* Starting box fill */}
            <rect
              x={boxX}
              y={boxY}
              width={boxWidth}
              height={depth_mm}
              fill={boxFillColor}
              stroke="none"
              pointerEvents="none"
            />

            {/* Starting line (at front edge of box) */}
            <line
              x1={boxX}
              y1={boxY}
              x2={boxX + boxWidth}
              y2={boxY}
              stroke={lineColor}
              strokeWidth={lineWidth_mm}
              strokeLinecap="butt"
              pointerEvents="none"
            />

            {/* Lane number label (optional, for visibility) */}
            <text
              x={boxX + boxWidth / 2}
              y={boxY + depth_mm / 2}
              fontSize={Math.min(boxWidth * 0.15, parameters.laneWidth_mm * 0.3)}
              fill={lineColor}
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="bold"
              pointerEvents="none"
              opacity="0.6"
            >
              {laneNumber}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default StartingBoxes;
