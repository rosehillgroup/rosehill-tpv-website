// TPV Studio - Starting Boxes Component
import React from 'react';
import { getLaneCenterAtDistance } from '../../lib/sports/trackGeometry.js';

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
    perLaneOffsets = []  // For staggered starts: [0, 7660, 15330, ...] (in meters, converted to mm)
  } = boxConfig;

  // Use track surface color for boxes by default
  const boxFillColor = surfaceColor || '#A5362F';
  const lineColor = '#FFFFFF'; // White starting line

  return (
    <g className="starting-boxes">
      {geometry.lanes.map((lane, index) => {
        const laneNumber = index + 1;

        if (isStraightTrack) {
          // Straight track: lanes are parallel vertical strips
          // Starting boxes are horizontal rectangles at the start
          const boxX = index * parameters.laneWidth_mm;
          const boxWidth = parameters.laneWidth_mm;
          const boxY = 0; // Start at top of track

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

              {/* Lane number label */}
              <text
                x={boxX + boxWidth / 2}
                y={boxY + depth_mm / 2}
                fontSize={Math.min(boxWidth * 0.4, parameters.laneWidth_mm * 0.5)}
                fill={lineColor}
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight="bold"
                pointerEvents="none"
                opacity="0.8"
              >
                {laneNumber}
              </text>
            </g>
          );
        } else {
          // Curved track: lanes are concentric rings
          // Starting boxes follow the curve at the stagger position

          // Stagger offset (in mm) - perimeter difference converted to distance along track
          // perLaneOffsets are in meters from calculateStaggeredStarts, convert to mm
          const staggerOffset = (perLaneOffsets[index] || 0) * 1000;

          // Get the lane center position at the stagger distance
          // This gives us the point where the starting line should be
          const startPoint = getLaneCenterAtDistance(index, staggerOffset, parameters);

          // Calculate the perpendicular angle for the starting line
          // The angle from getLaneCenterAtDistance is the tangent direction
          const perpAngle = startPoint.angle + Math.PI / 2;

          // Get points for the starting line (perpendicular to track direction)
          // Draw from outer edge to inner edge of this lane
          const x1 = startPoint.outerX;
          const y1 = startPoint.outerY;
          const x2 = startPoint.innerX;
          const y2 = startPoint.innerY;

          // Calculate box end points (depth_mm further along the track)
          const endPoint = getLaneCenterAtDistance(index, staggerOffset + depth_mm, parameters);

          // Create a path for the box fill (quadrilateral following the lane)
          const boxPath = `
            M ${startPoint.outerX} ${startPoint.outerY}
            L ${startPoint.innerX} ${startPoint.innerY}
            L ${endPoint.innerX} ${endPoint.innerY}
            L ${endPoint.outerX} ${endPoint.outerY}
            Z
          `.trim().replace(/\s+/g, ' ');

          return (
            <g key={`start-box-${laneNumber}`}>
              {/* Starting box fill - quadrilateral following the lane curve */}
              <path
                d={boxPath}
                fill={boxFillColor}
                stroke="none"
                pointerEvents="none"
              />

              {/* Starting line (at front edge of box) - perpendicular to track */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={lineColor}
                strokeWidth={lineWidth_mm}
                strokeLinecap="butt"
                pointerEvents="none"
              />

              {/* Lane number label (centered in the box) */}
              <text
                x={startPoint.x}
                y={startPoint.y}
                fontSize={parameters.laneWidth_mm * 0.5}
                fill={lineColor}
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight="bold"
                pointerEvents="none"
                opacity="0.8"
                transform={`rotate(${(startPoint.angle * 180 / Math.PI) + 90}, ${startPoint.x}, ${startPoint.y})`}
              >
                {laneNumber}
              </text>
            </g>
          );
        }
      })}
    </g>
  );
}

export default StartingBoxes;
