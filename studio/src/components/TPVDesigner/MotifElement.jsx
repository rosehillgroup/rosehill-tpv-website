// TPV Studio - Motif Element Component
// Renders a playground design motif on the sports surface canvas

import React, { useMemo } from 'react';

/**
 * Individual motif element component
 * Renders a playground design as an embedded SVG on the sports canvas
 *
 * @param {Object} props - Component props
 * @param {Object} props.motif - Motif data from store
 * @param {boolean} props.isSelected - Whether this motif is selected
 * @param {Function} props.onMouseDown - Handler for mouse down (drag start)
 * @param {Function} props.onTouchStart - Handler for touch start (drag start on mobile)
 * @param {Function} props.onDoubleClick - Handler for double click (open properties)
 * @param {Function} props.onScaleStart - Handler for scale handle drag start
 * @param {Function} props.onRotateStart - Handler for rotation handle drag start
 */
function MotifElement({ motif, isSelected, onMouseDown, onTouchStart, onDoubleClick, onScaleStart, onRotateStart }) {
  const {
    svgContent,
    originalWidth_mm,
    originalHeight_mm,
    position,
    rotation,
    scale
  } = motif;

  // Extract SVG viewBox dimensions to determine actual aspect ratio
  const svgViewBox = useMemo(() => {
    if (!svgContent) return null;

    // Try viewBox first
    const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/i);
    if (viewBoxMatch) {
      const parts = viewBoxMatch[1].split(/\s+/).map(Number);
      if (parts.length >= 4) {
        return { width: parts[2], height: parts[3] };
      }
    }

    // Fall back to width/height attributes
    const widthMatch = svgContent.match(/\bwidth=["']?(\d+(?:\.\d+)?)/i);
    const heightMatch = svgContent.match(/\bheight=["']?(\d+(?:\.\d+)?)/i);
    if (widthMatch && heightMatch) {
      return { width: parseFloat(widthMatch[1]), height: parseFloat(heightMatch[1]) };
    }

    return null;
  }, [svgContent]);

  // Use SVG viewBox aspect ratio for rendering, scaled to physical dimensions
  const renderDimensions = useMemo(() => {
    if (!svgViewBox) {
      // No viewBox found - use physical dimensions directly
      return { width: originalWidth_mm, height: originalHeight_mm };
    }

    // Calculate aspect ratios
    const svgAspectRatio = svgViewBox.width / svgViewBox.height;
    const physicalAspectRatio = originalWidth_mm / originalHeight_mm;

    // Check if orientations match (both landscape or both portrait)
    const svgIsLandscape = svgAspectRatio >= 1;
    const physicalIsLandscape = physicalAspectRatio >= 1;

    if (svgIsLandscape !== physicalIsLandscape) {
      // Orientation mismatch! Use SVG viewBox aspect ratio with physical scale
      // This handles cases where dimensions were stored with wrong orientation
      console.warn('[MOTIF] Orientation mismatch detected - using SVG viewBox aspect ratio');
      console.log('[MOTIF] SVG viewBox:', svgViewBox, 'AR:', svgAspectRatio.toFixed(2));
      console.log('[MOTIF] Physical dims:', originalWidth_mm, '×', originalHeight_mm, 'AR:', physicalAspectRatio.toFixed(2));

      // Calculate dimensions using SVG aspect ratio but physical area
      const physicalArea = originalWidth_mm * originalHeight_mm;
      const newWidth = Math.sqrt(physicalArea * svgAspectRatio);
      const newHeight = newWidth / svgAspectRatio;

      return { width: newWidth, height: newHeight };
    }

    // Orientations match - use physical dimensions
    return { width: originalWidth_mm, height: originalHeight_mm };
  }, [svgViewBox, originalWidth_mm, originalHeight_mm]);

  // Calculate scaled dimensions using corrected render dimensions
  const scaledWidth = renderDimensions.width * (scale || 1);
  const scaledHeight = renderDimensions.height * (scale || 1);

  // Build transform string
  // Translate to position, then rotate around the center of the motif
  const centerX = scaledWidth / 2;
  const centerY = scaledHeight / 2;
  const transform = `translate(${position.x}, ${position.y}) rotate(${rotation || 0}, ${centerX}, ${centerY})`;

  // Prepare SVG content for embedding
  // Modify the viewBox and dimensions to fit our scale
  const processedSvg = useMemo(() => {
    if (!svgContent) return null;

    // Parse the SVG to modify attributes
    try {
      // Create a wrapper that sets the proper dimensions
      // The inner SVG will scale to fit these dimensions
      let modifiedSvg = svgContent;

      // Remove any existing width/height attributes to let viewBox control sizing
      modifiedSvg = modifiedSvg.replace(/\s+(width|height)=["'][^"']*["']/gi, '');

      // Ensure viewBox exists - if not, try to add one based on render dimensions
      if (!modifiedSvg.includes('viewBox')) {
        // Add a viewBox based on render dimensions
        modifiedSvg = modifiedSvg.replace(
          '<svg',
          `<svg viewBox="0 0 ${renderDimensions.width} ${renderDimensions.height}"`
        );
      }

      return modifiedSvg;
    } catch (error) {
      console.error('[MOTIF] Error processing SVG:', error);
      return svgContent;
    }
  }, [svgContent, renderDimensions]);

  // Create a data URL for the SVG to use in an image element
  const svgDataUrl = useMemo(() => {
    if (!processedSvg) return null;
    try {
      // Encode the SVG for use as a data URL
      const encoded = encodeURIComponent(processedSvg)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22');
      return `data:image/svg+xml,${encoded}`;
    } catch (error) {
      console.error('[MOTIF] Error creating data URL:', error);
      return null;
    }
  }, [processedSvg]);

  if (!svgDataUrl) {
    // Fallback: render a placeholder for broken motifs
    return (
      <g transform={transform}>
        <rect
          x="0"
          y="0"
          width={scaledWidth}
          height={scaledHeight}
          fill="#f0f0f0"
          stroke="#ccc"
          strokeWidth="50"
          strokeDasharray="200 200"
        />
        <text
          x={scaledWidth / 2}
          y={scaledHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={Math.min(scaledWidth, scaledHeight) / 10}
          fill="#999"
        >
          Motif Error
        </text>
      </g>
    );
  }

  return (
    <g
      className={`motif-element ${isSelected ? 'motif-element--selected' : ''}`}
      transform={transform}
      style={{ cursor: 'move' }}
    >
      {/* Render the SVG as an image element */}
      <image
        href={svgDataUrl}
        x="0"
        y="0"
        width={scaledWidth}
        height={scaledHeight}
        preserveAspectRatio="xMidYMid meet"
        pointerEvents="none"
      />

      {/* Invisible clickable area - captures all mouse events */}
      <rect
        x="0"
        y="0"
        width={scaledWidth}
        height={scaledHeight}
        fill="transparent"
        pointerEvents="all"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onDoubleClick={onDoubleClick}
        style={{ cursor: 'move' }}
      />

      {/* Selection indicator */}
      {isSelected && (
        <rect
          x="-10"
          y="-10"
          width={scaledWidth + 20}
          height={scaledHeight + 20}
          fill="none"
          stroke="#9333EA"
          strokeWidth="80"
          strokeDasharray="400 400"
          opacity="0.7"
          pointerEvents="none"
        />
      )}

      {/* Corner resize handles and rotation handle when selected */}
      {isSelected && (
        <MotifHandles
          width={scaledWidth}
          height={scaledHeight}
          onScaleStart={onScaleStart}
          onRotateStart={onRotateStart}
        />
      )}
    </g>
  );
}

/**
 * Resize and rotation handles for selected motif
 * Corner handles for scaling, top-center handle for rotation
 */
function MotifHandles({ width, height, onScaleStart, onRotateStart }) {
  const handleSize = Math.min(width, height) * 0.08;
  const minHandleSize = 150;
  const maxHandleSize = 400;
  const size = Math.max(minHandleSize, Math.min(maxHandleSize, handleSize));

  // Corner handles for scaling
  const scaleHandles = [
    { x: -size / 2, y: -size / 2, corner: 'nw', cursor: 'nwse-resize' },
    { x: width - size / 2, y: -size / 2, corner: 'ne', cursor: 'nesw-resize' },
    { x: -size / 2, y: height - size / 2, corner: 'sw', cursor: 'nesw-resize' },
    { x: width - size / 2, y: height - size / 2, corner: 'se', cursor: 'nwse-resize' }
  ];

  // Rotation handle - positioned above top center
  const rotateHandleDistance = size * 2.5;
  const rotateHandleSize = size * 0.8;

  return (
    <g className="motif-handles">
      {/* Scale handles at corners */}
      {scaleHandles.map((handle) => (
        <rect
          key={handle.corner}
          x={handle.x}
          y={handle.y}
          width={size}
          height={size}
          fill="#9333EA"
          stroke="#fff"
          strokeWidth="20"
          rx={size / 4}
          style={{ cursor: handle.cursor }}
          pointerEvents="all"
          onMouseDown={(e) => {
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
        y2={-rotateHandleDistance + rotateHandleSize / 2}
        stroke="#9333EA"
        strokeWidth="30"
        pointerEvents="none"
      />

      {/* Rotation handle circle */}
      <circle
        cx={width / 2}
        cy={-rotateHandleDistance}
        r={rotateHandleSize}
        fill="#9333EA"
        stroke="#fff"
        strokeWidth="20"
        style={{ cursor: 'grab' }}
        pointerEvents="all"
        onMouseDown={(e) => {
          e.stopPropagation();
          onRotateStart?.(e);
        }}
      />

      {/* Rotation icon inside handle */}
      <path
        d={`M ${width / 2 - rotateHandleSize * 0.4} ${-rotateHandleDistance}
            A ${rotateHandleSize * 0.4} ${rotateHandleSize * 0.4} 0 1 1
            ${width / 2 + rotateHandleSize * 0.4} ${-rotateHandleDistance}`}
        fill="none"
        stroke="#fff"
        strokeWidth="25"
        strokeLinecap="round"
        pointerEvents="none"
      />
      <polygon
        points={`${width / 2 + rotateHandleSize * 0.4},${-rotateHandleDistance - rotateHandleSize * 0.25}
                 ${width / 2 + rotateHandleSize * 0.4},${-rotateHandleDistance + rotateHandleSize * 0.25}
                 ${width / 2 + rotateHandleSize * 0.65},${-rotateHandleDistance}`}
        fill="#fff"
        pointerEvents="none"
      />
    </g>
  );
}

export default MotifElement;
