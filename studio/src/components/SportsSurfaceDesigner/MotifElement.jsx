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
 * @param {Function} props.onDoubleClick - Handler for double click (open properties)
 */
function MotifElement({ motif, isSelected, onMouseDown, onDoubleClick }) {
  const {
    svgContent,
    originalWidth_mm,
    originalHeight_mm,
    position,
    rotation,
    scale
  } = motif;

  // Calculate scaled dimensions
  const scaledWidth = originalWidth_mm * (scale || 1);
  const scaledHeight = originalHeight_mm * (scale || 1);

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

      // Ensure viewBox exists - if not, try to add one
      if (!modifiedSvg.includes('viewBox')) {
        // Add a viewBox based on original dimensions
        modifiedSvg = modifiedSvg.replace(
          '<svg',
          `<svg viewBox="0 0 ${originalWidth_mm} ${originalHeight_mm}"`
        );
      }

      return modifiedSvg;
    } catch (error) {
      console.error('[MOTIF] Error processing SVG:', error);
      return svgContent;
    }
  }, [svgContent, originalWidth_mm, originalHeight_mm]);

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

      {/* Corner resize/rotation handles when selected */}
      {isSelected && (
        <MotifHandles
          width={scaledWidth}
          height={scaledHeight}
        />
      )}
    </g>
  );
}

/**
 * Resize/Rotation handles for selected motif
 * Visual indicators at corners - actual drag handling is in parent
 */
function MotifHandles({ width, height }) {
  const handleSize = Math.min(width, height) * 0.08;
  const minHandleSize = 150;
  const maxHandleSize = 400;
  const size = Math.max(minHandleSize, Math.min(maxHandleSize, handleSize));

  const handles = [
    { x: -size / 2, y: -size / 2, cursor: 'nwse-resize' },
    { x: width - size / 2, y: -size / 2, cursor: 'nesw-resize' },
    { x: -size / 2, y: height - size / 2, cursor: 'nesw-resize' },
    { x: width - size / 2, y: height - size / 2, cursor: 'nwse-resize' }
  ];

  return (
    <g className="motif-handles" pointerEvents="none">
      {handles.map((handle, index) => (
        <rect
          key={index}
          x={handle.x}
          y={handle.y}
          width={size}
          height={size}
          fill="#9333EA"
          stroke="#fff"
          strokeWidth="20"
          rx={size / 4}
        />
      ))}
    </g>
  );
}

export default MotifElement;
