// TPV Studio - Handle Size Utilities
// Provides consistent handle sizing across all element types

/**
 * Base handle size in mm at zoom level 1.0
 * This is calibrated to appear as ~12px on a typical 50m surface at 1200px width
 * 50000mm / 1200px ≈ 42mm/px, so 12px ≈ 500mm
 * We use a slightly smaller value since most canvases render larger
 */
const BASE_HANDLE_SIZE_MM = 200;  // ~12px on screen at zoom=1

/**
 * Base stroke width for handles
 */
const BASE_STROKE_WIDTH_MM = 30;  // ~2px on screen at zoom=1

/**
 * Base size for smaller edit handles (bezier control points)
 */
const BASE_EDIT_HANDLE_SIZE_MM = 120;  // ~8px on screen at zoom=1

/**
 * Calculate handle size that stays fixed on screen regardless of zoom
 *
 * Note: We only compensate for zoom, NOT element scale. Handles are positioned
 * relative to the element's scaled dimensions but are not inside a scale transform.
 * This ensures handles stay a constant screen size (~12px) regardless of:
 * - Canvas zoom level
 * - Element's own scale factor
 *
 * @param {number} zoom - Current canvas zoom level (0.25 to 5.0)
 * @param {number} elementScale - (unused, kept for API compatibility)
 * @returns {Object} { size, strokeWidth, cornerRadius } in mm
 */
export function getHandleSize(zoom = 1, elementScale = 1) {
  // Only compensate for zoom - handles stay constant screen size
  const scaleFactor = 1 / zoom;

  const size = BASE_HANDLE_SIZE_MM * scaleFactor;
  const strokeWidth = BASE_STROKE_WIDTH_MM * scaleFactor;
  const cornerRadius = size * 0.25;  // Rounded corners at 25% of size

  return { size, strokeWidth, cornerRadius };
}

/**
 * Calculate edit handle size (for bezier control points, smaller than resize handles)
 *
 * @param {number} zoom - Current canvas zoom level
 * @returns {Object} { pointSize, handleSize, strokeWidth } in mm
 */
export function getEditHandleSize(zoom = 1) {
  const scaleFactor = 1 / zoom;

  const pointSize = BASE_EDIT_HANDLE_SIZE_MM * scaleFactor;
  const handleSize = pointSize * 0.7;  // Bezier handles slightly smaller
  const strokeWidth = (BASE_STROKE_WIDTH_MM * 0.5) * scaleFactor;

  return { pointSize, handleSize, strokeWidth };
}

/**
 * Calculate rotation handle positioning
 *
 * @param {number} handleSize - The size of resize handles
 * @returns {Object} { distance, size } - Distance from element and handle size
 */
export function getRotationHandle(handleSize) {
  return {
    distance: handleSize * 2.5,  // Distance above element
    size: handleSize * 0.8,      // Slightly smaller than resize handles
    stemWidth: handleSize * 0.15 // Width of the connecting stem
  };
}

/**
 * Calculate selection indicator styling
 *
 * @param {number} zoom - Current canvas zoom level
 * @param {number} elementScale - (unused, kept for API compatibility)
 * @returns {Object} { strokeWidth, dashArray, padding } in mm
 */
export function getSelectionStyle(zoom = 1, elementScale = 1) {
  // Only compensate for zoom - selection stays constant screen size
  const scaleFactor = 1 / zoom;

  return {
    strokeWidth: 60 * scaleFactor,
    dashArray: `${300 * scaleFactor} ${300 * scaleFactor}`,
    padding: 40  // Fixed padding in mm (part of element coordinate space)
  };
}
