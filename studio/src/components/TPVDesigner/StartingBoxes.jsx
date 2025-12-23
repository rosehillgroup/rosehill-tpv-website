// TPV Studio - Starting Boxes Component
import React from 'react';
import { getLaneCenterAtDistance, getRadiallyAlignedDistance } from '../../lib/sports/trackGeometry.js';

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
    depth_mm = 800,         // Box depth along track
    lineWidth_mm = 50,      // Match track lane line width (World Athletics standard)
    perLaneOffsets = [],    // For staggered starts: [0, 7660, 15330, ...] (in mm)
    style = 'staggered',    // 'straight' | 'staggered' | 'both'
    direction = 'counterclockwise', // 'clockwise' | 'counterclockwise'
    startPosition = 0       // 0-100% position around track (curved tracks only)
  } = boxConfig;

  // Military stencil font for lane numbers - athletic track style
  const labelFontFamily = "'Black Ops One', 'Impact', sans-serif";

  // Use track surface color for boxes by default
  const boxFillColor = surfaceColor || '#A5362F';
  const lineColor = '#FFFFFF'; // White starting line

  // Determine which box sets to render based on style
  const renderStaggered = style === 'staggered' || style === 'both';
  const renderStraight = style === 'straight' || style === 'both';

  // For 'both' style, determine primary and secondary positions
  // Primary: staggered boxes, Secondary (opposite end): straight boxes
  const primaryIsStaggered = style === 'both';

  return (
    <g className="starting-boxes">
      {/* Render primary starting boxes */}
      {geometry.lanes.map((lane, index) => {
        const laneNumber = index + 1;

        if (isStraightTrack) {
          return renderStraightTrackBoxes(
            index,
            laneNumber,
            parameters,
            geometry,
            depth_mm,
            lineWidth_mm,
            boxFillColor,
            lineColor,
            labelFontFamily,
            renderStaggered,
            renderStraight,
            perLaneOffsets,
            direction
          );
        } else {
          return renderCurvedTrackBoxes(
            index,
            laneNumber,
            parameters,
            geometry,
            depth_mm,
            lineWidth_mm,
            boxFillColor,
            lineColor,
            labelFontFamily,
            renderStaggered,
            renderStraight,
            perLaneOffsets,
            direction,
            startPosition
          );
        }
      })}
    </g>
  );
}

/**
 * Render starting boxes for straight tracks
 */
function renderStraightTrackBoxes(
  index,
  laneNumber,
  parameters,
  geometry,
  depth_mm,
  lineWidth_mm,
  boxFillColor,
  lineColor,
  labelFontFamily,
  renderStaggered,
  renderStraight,
  perLaneOffsets,
  direction
) {
  const boxX = index * parameters.laneWidth_mm;
  const boxWidth = parameters.laneWidth_mm;

  // Determine Y position based on direction
  // For straight tracks:
  // - counterclockwise = start at top (y = 0), run down
  // - clockwise = start at bottom (y = totalLength - depth), run up
  const isClockwise = direction === 'clockwise';
  const primaryY = isClockwise ? geometry.totalLength - depth_mm : 0;
  const secondaryY = isClockwise ? 0 : geometry.totalLength - depth_mm;

  // For straight tracks, staggered means offset along the track length
  const staggerOffset = (perLaneOffsets[index] || 0) * 1000;

  const boxes = [];

  // Primary boxes (based on style)
  if (renderStaggered && !renderStraight) {
    // Staggered only - apply offset
    const adjustedY = isClockwise
      ? primaryY - staggerOffset
      : primaryY + staggerOffset;

    boxes.push(
      <StartingBox
        key={`stagger-${laneNumber}`}
        x={boxX}
        y={adjustedY}
        width={boxWidth}
        height={depth_mm}
        laneNumber={laneNumber}
        boxFillColor={boxFillColor}
        lineColor={lineColor}
        lineWidth={lineWidth_mm}
        fontFamily={labelFontFamily}
        flipLine={isClockwise}
      />
    );
  } else if (renderStraight && !renderStaggered) {
    // Straight only - all aligned
    boxes.push(
      <StartingBox
        key={`straight-${laneNumber}`}
        x={boxX}
        y={primaryY}
        width={boxWidth}
        height={depth_mm}
        laneNumber={laneNumber}
        boxFillColor={boxFillColor}
        lineColor={lineColor}
        lineWidth={lineWidth_mm}
        fontFamily={labelFontFamily}
        flipLine={isClockwise}
      />
    );
  } else if (renderStaggered && renderStraight) {
    // Both - staggered at primary end, straight at secondary end
    const adjustedY = isClockwise
      ? primaryY - staggerOffset
      : primaryY + staggerOffset;

    boxes.push(
      <StartingBox
        key={`stagger-${laneNumber}`}
        x={boxX}
        y={adjustedY}
        width={boxWidth}
        height={depth_mm}
        laneNumber={laneNumber}
        boxFillColor={boxFillColor}
        lineColor={lineColor}
        lineWidth={lineWidth_mm}
        fontFamily={labelFontFamily}
        flipLine={isClockwise}
      />
    );

    boxes.push(
      <StartingBox
        key={`straight-${laneNumber}`}
        x={boxX}
        y={secondaryY}
        width={boxWidth}
        height={depth_mm}
        laneNumber={laneNumber}
        boxFillColor={boxFillColor}
        lineColor={lineColor}
        lineWidth={lineWidth_mm}
        fontFamily={labelFontFamily}
        flipLine={!isClockwise}
      />
    );
  }

  return <g key={`lane-boxes-${laneNumber}`}>{boxes}</g>;
}

/**
 * Single starting box component for straight tracks
 */
function StartingBox({ x, y, width, height, laneNumber, boxFillColor, lineColor, lineWidth, fontFamily, flipLine }) {
  // When flipLine is true, the starting line is at the bottom of the box
  const lineY = flipLine ? y + height : y;

  return (
    <g>
      {/* Starting box fill */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={boxFillColor}
        stroke="none"
        pointerEvents="none"
      />

      {/* Starting line */}
      <line
        x1={x}
        y1={lineY}
        x2={x + width}
        y2={lineY}
        stroke={lineColor}
        strokeWidth={lineWidth}
        strokeLinecap="butt"
        pointerEvents="none"
      />

      {/* Lane number label */}
      <text
        x={x + width / 2}
        y={y + height / 2}
        fontSize={Math.min(height * 0.6, width * 0.5)}
        fill={lineColor}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={fontFamily}
        fontWeight="bold"
        pointerEvents="none"
        opacity="0.9"
      >
        {laneNumber}
      </text>
    </g>
  );
}

/**
 * Render starting boxes for curved tracks
 *
 * Position calculation uses radial alignment:
 * - Calculate reference position on innermost lane (Lane 1)
 * - Use getRadiallyAlignedDistance to find corresponding position on each lane
 * - This ensures all lanes are at the same parametric position within each segment
 * - Stagger offsets are added for staggered starts
 */
function renderCurvedTrackBoxes(
  index,
  laneNumber,
  parameters,
  geometry,
  depth_mm,
  lineWidth_mm,
  boxFillColor,
  lineColor,
  labelFontFamily,
  renderStaggered,
  renderStraight,
  perLaneOffsets,
  direction,
  startPosition = 0
) {
  const isClockwise = direction === 'clockwise';

  // Get innermost lane index (Lane 1 = last index in geometry array)
  const innermostLaneIndex = geometry.lanes.length - 1;

  // Get innermost lane's perimeter for reference calculations
  const refPerimeterMm = (geometry.lanes[innermostLaneIndex]?.perimeter || 0) * 1000;
  const halfRefPerimeter = refPerimeterMm / 2;

  // Calculate reference position on innermost lane
  const refBasePositionMm = (startPosition / 100) * refPerimeterMm;

  // Get radially aligned position for THIS lane
  // This ensures all lanes are at the same geometric position (same segment, same parametric t)
  const alignedBasePosition = getRadiallyAlignedDistance(
    index,
    refBasePositionMm,
    innermostLaneIndex,
    parameters
  );

  // Get this lane's half perimeter for opposite-side calculations
  const lanePerimeterMm = (geometry.lanes[index]?.perimeter || 0) * 1000;
  const halfLanePerimeter = lanePerimeterMm / 2;

  // Stagger offset for this lane (in mm)
  const staggerOffset = (perLaneOffsets[index] || 0) * 1000;

  const boxes = [];

  if (renderStaggered && !renderStraight) {
    // Staggered only - aligned position + stagger offset
    const distance = isClockwise
      ? alignedBasePosition + halfLanePerimeter + staggerOffset
      : alignedBasePosition + staggerOffset;
    boxes.push(
      <CurvedStartingBox
        key={`stagger-${laneNumber}`}
        index={index}
        laneNumber={laneNumber}
        distance={distance}
        depth_mm={depth_mm}
        parameters={parameters}
        boxFillColor={boxFillColor}
        lineColor={lineColor}
        lineWidth={lineWidth_mm}
        fontFamily={labelFontFamily}
      />
    );
  } else if (renderStraight && !renderStaggered) {
    // Straight only - all lanes radially aligned (no stagger)
    const distance = isClockwise
      ? alignedBasePosition + halfLanePerimeter
      : alignedBasePosition;
    boxes.push(
      <CurvedStartingBox
        key={`straight-${laneNumber}`}
        index={index}
        laneNumber={laneNumber}
        distance={distance}
        depth_mm={depth_mm}
        parameters={parameters}
        boxFillColor={boxFillColor}
        lineColor={lineColor}
        lineWidth={lineWidth_mm}
        fontFamily={labelFontFamily}
      />
    );
  } else if (renderStaggered && renderStraight) {
    // Both - staggered at primary, straight at secondary
    const primaryDistance = isClockwise
      ? alignedBasePosition + halfLanePerimeter + staggerOffset
      : alignedBasePosition + staggerOffset;

    // For secondary (opposite side), also need radial alignment
    const refSecondaryPosition = isClockwise ? refBasePositionMm : refBasePositionMm + halfRefPerimeter;
    const alignedSecondaryPosition = getRadiallyAlignedDistance(
      index,
      refSecondaryPosition,
      innermostLaneIndex,
      parameters
    );
    const secondaryDistance = isClockwise
      ? alignedSecondaryPosition
      : alignedSecondaryPosition;

    boxes.push(
      <CurvedStartingBox
        key={`stagger-${laneNumber}`}
        index={index}
        laneNumber={laneNumber}
        distance={primaryDistance}
        depth_mm={depth_mm}
        parameters={parameters}
        boxFillColor={boxFillColor}
        lineColor={lineColor}
        lineWidth={lineWidth_mm}
        fontFamily={labelFontFamily}
      />
    );

    boxes.push(
      <CurvedStartingBox
        key={`straight-${laneNumber}`}
        index={index}
        laneNumber={laneNumber}
        distance={secondaryDistance}
        depth_mm={depth_mm}
        parameters={parameters}
        boxFillColor={boxFillColor}
        lineColor={lineColor}
        lineWidth={lineWidth_mm}
        fontFamily={labelFontFamily}
      />
    );
  }

  return <g key={`lane-boxes-${laneNumber}`}>{boxes}</g>;
}

/**
 * Single starting box component for curved tracks
 */
function CurvedStartingBox({ index, laneNumber, distance, depth_mm, parameters, boxFillColor, lineColor, lineWidth, fontFamily }) {
  // Get the lane center position at the start distance
  const startPoint = getLaneCenterAtDistance(index, distance, parameters);

  // Calculate perpendicular angle for the starting line
  const perpAngle = startPoint.angle + Math.PI / 2;

  // Calculate starting line endpoints
  const halfLaneWidth = parameters.laneWidth_mm / 2;
  const x1 = startPoint.x + Math.cos(perpAngle) * halfLaneWidth;
  const y1 = startPoint.y + Math.sin(perpAngle) * halfLaneWidth;
  const x2 = startPoint.x - Math.cos(perpAngle) * halfLaneWidth;
  const y2 = startPoint.y - Math.sin(perpAngle) * halfLaneWidth;

  // Calculate box end points (depth_mm further along the track)
  const endPoint = getLaneCenterAtDistance(index, distance + depth_mm, parameters);
  const endPerpAngle = endPoint.angle + Math.PI / 2;
  const ex1 = endPoint.x + Math.cos(endPerpAngle) * halfLaneWidth;
  const ey1 = endPoint.y + Math.sin(endPerpAngle) * halfLaneWidth;
  const ex2 = endPoint.x - Math.cos(endPerpAngle) * halfLaneWidth;
  const ey2 = endPoint.y - Math.sin(endPerpAngle) * halfLaneWidth;

  // Calculate center point of box for label (midway between start and end)
  const centerPoint = getLaneCenterAtDistance(index, distance + depth_mm / 2, parameters);

  // Create path for box fill
  const boxPath = `
    M ${x1} ${y1}
    L ${x2} ${y2}
    L ${ex2} ${ey2}
    L ${ex1} ${ey1}
    Z
  `.trim().replace(/\s+/g, ' ');

  return (
    <g>
      {/* Starting box fill */}
      <path
        d={boxPath}
        fill={boxFillColor}
        stroke="none"
        pointerEvents="none"
      />

      {/* Starting line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={lineColor}
        strokeWidth={lineWidth}
        strokeLinecap="butt"
        pointerEvents="none"
      />

      {/* Lane number label - positioned in center of box */}
      <text
        x={centerPoint.x}
        y={centerPoint.y}
        fontSize={Math.min(depth_mm * 0.6, parameters.laneWidth_mm * 0.5)}
        fill={lineColor}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={fontFamily}
        fontWeight="bold"
        pointerEvents="none"
        opacity="0.9"
        transform={`rotate(${(centerPoint.angle * 180 / Math.PI) + 90}, ${centerPoint.x}, ${centerPoint.y})`}
      >
        {laneNumber}
      </text>
    </g>
  );
}

export default StartingBoxes;
