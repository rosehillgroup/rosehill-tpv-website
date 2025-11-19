// TPV Studio - Four Point Editor Component
// Interactive 4-corner placement for perspective warp with optional polygon clipping

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  loadImage,
  rasterizeSvg,
  warpDesignOntoPhoto,
  calculateDefaultQuad
} from '../../lib/inSitu/perspectiveWarp.js';

// Debounce delay for onChange callback
const DEBOUNCE_DELAY = 100;

export default function FourPointEditor({
  photoUrl,
  svgUrl,
  designSizeMm, // { width_mm, length_mm }
  initialQuad,
  initialShape,
  initialOpacity = 0.8,
  onChange
}) {
  // State
  const [photoImg, setPhotoImg] = useState(null);
  const [designImg, setDesignImg] = useState(null);
  const [quad, setQuad] = useState(initialQuad || null);
  const [shape, setShape] = useState(initialShape || null);
  const [opacity, setOpacity] = useState(Math.max(0.3, Math.min(1, initialOpacity)));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayScale, setDisplayScale] = useState(1);

  // Editing mode: 'corners' for perspective, 'shape' for polygon clipping
  const [editMode, setEditMode] = useState('corners');
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);

  // Refs
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Load images on mount
  useEffect(() => {
    loadImages();
  }, [photoUrl, svgUrl]);

  // Redraw when state changes
  useEffect(() => {
    if (photoImg && designImg && quad) {
      drawPreview();
    }
  }, [photoImg, designImg, quad, shape, opacity, editMode, draggingIndex, selectedShapeIndex]);

  // Keyboard handler for deleting shape vertices
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editMode === 'shape' && (e.key === 'Delete' || e.key === 'Backspace')) {
        if (selectedShapeIndex !== null && shape && shape.length > 3) {
          e.preventDefault();
          const newShape = shape.filter((_, i) => i !== selectedShapeIndex);
          setShape(newShape);
          setSelectedShapeIndex(null);
          notifyChange(quad, opacity, newShape);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode, selectedShapeIndex, shape, quad, opacity]);

  const loadImages = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load photo and rasterize SVG in parallel
      const [photo, design] = await Promise.all([
        loadImage(photoUrl),
        rasterizeSvg(svgUrl, 1536)
      ]);

      setPhotoImg(photo);
      setDesignImg(design);

      // Calculate display scale to fit container (both width and height)
      const containerWidth = containerRef.current?.clientWidth || 800;
      const containerHeight = 500; // Max height for preview area
      const scaleW = containerWidth / photo.naturalWidth;
      const scaleH = containerHeight / photo.naturalHeight;
      const scale = Math.min(1, scaleW, scaleH);
      setDisplayScale(scale);

      // Initialize quad if not provided
      if (!initialQuad) {
        const defaultQuad = calculateDefaultQuad(
          photo.naturalWidth,
          photo.naturalHeight,
          designSizeMm.width_mm,
          designSizeMm.length_mm
        );
        setQuad(defaultQuad);
      }

    } catch (err) {
      console.error('[FOUR-POINT] Failed to load images:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const drawPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas || !photoImg || !designImg || !quad) return;

    // Set canvas size to photo's natural dimensions
    canvas.width = photoImg.naturalWidth;
    canvas.height = photoImg.naturalHeight;

    const ctx = canvas.getContext('2d');

    // Draw warped design on photo with optional shape clipping
    warpDesignOntoPhoto({
      photoCtx: ctx,
      photoImg,
      designImg,
      quad,
      opacity,
      shape: shape
    });

    // Draw handles and lines
    drawHandles(ctx);
  };

  const drawHandles = (ctx) => {
    if (!quad) return;

    // Reset transform to identity
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const handleRadius = Math.max(8, Math.min(15, photoImg.naturalWidth / 80));

    if (editMode === 'corners') {
      // Draw corner mode UI
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      ctx.beginPath();
      ctx.moveTo(quad[0].x, quad[0].y);
      ctx.lineTo(quad[1].x, quad[1].y);
      ctx.lineTo(quad[2].x, quad[2].y);
      ctx.lineTo(quad[3].x, quad[3].y);
      ctx.closePath();
      ctx.stroke();

      ctx.setLineDash([]);

      // Draw corner handles
      const labels = ['TL', 'TR', 'BR', 'BL'];
      quad.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, handleRadius, 0, Math.PI * 2);
        ctx.fillStyle = draggingIndex === index ? '#ff6b35' : 'rgba(255, 107, 53, 0.9)';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labels[index], point.x, point.y);
      });

    } else {
      // Draw shape mode UI
      const shapePoints = shape || quad;

      // Draw shape polygon outline
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(shapePoints[0].x, shapePoints[0].y);
      for (let i = 1; i < shapePoints.length; i++) {
        ctx.lineTo(shapePoints[i].x, shapePoints[i].y);
      }
      ctx.closePath();
      ctx.stroke();

      // Draw shape vertex handles
      shapePoints.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, handleRadius * 0.8, 0, Math.PI * 2);

        if (selectedShapeIndex === index) {
          ctx.fillStyle = '#22c55e';
        } else if (draggingIndex === index) {
          ctx.fillStyle = '#16a34a';
        } else {
          ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
        }

        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Also draw the perspective quad faintly for reference
      ctx.strokeStyle = 'rgba(255, 107, 53, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      ctx.beginPath();
      ctx.moveTo(quad[0].x, quad[0].y);
      ctx.lineTo(quad[1].x, quad[1].y);
      ctx.lineTo(quad[2].x, quad[2].y);
      ctx.lineTo(quad[3].x, quad[3].y);
      ctx.closePath();
      ctx.stroke();

      ctx.setLineDash([]);
    }
  };

  // Notify parent of changes (debounced)
  const notifyChange = useCallback((newQuad, newOpacity, newShape) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (onChange) {
        onChange({ quad: newQuad, opacity: newOpacity, shape: newShape });
      }
    }, DEBOUNCE_DELAY);
  }, [onChange]);

  // Convert canvas coordinates to image coordinates
  const canvasToImage = (canvasX, canvasY) => {
    return {
      x: canvasX / displayScale,
      y: canvasY / displayScale
    };
  };

  // Find which handle is being clicked
  const findHandle = (imageX, imageY, points) => {
    if (!points) return -1;

    const threshold = 25 / displayScale;

    for (let i = 0; i < points.length; i++) {
      const dx = points[i].x - imageX;
      const dy = points[i].y - imageY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < threshold) {
        return i;
      }
    }

    return -1;
  };

  // Pointer event handlers
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const { x: imgX, y: imgY } = canvasToImage(canvasX, canvasY);

    if (editMode === 'corners') {
      const handleIndex = findHandle(imgX, imgY, quad);
      if (handleIndex >= 0) {
        setDraggingIndex(handleIndex);
        canvas.setPointerCapture(e.pointerId);
      }
    } else {
      // Shape mode
      const shapePoints = shape || quad;
      const handleIndex = findHandle(imgX, imgY, shapePoints);

      if (handleIndex >= 0) {
        // Clicked on existing vertex
        setDraggingIndex(handleIndex);
        setSelectedShapeIndex(handleIndex);
        canvas.setPointerCapture(e.pointerId);
      } else {
        // Add new vertex
        // Find which edge to insert on (closest edge)
        let bestEdge = 0;
        let bestDist = Infinity;

        for (let i = 0; i < shapePoints.length; i++) {
          const j = (i + 1) % shapePoints.length;
          const dist = pointToSegmentDistance(
            imgX, imgY,
            shapePoints[i].x, shapePoints[i].y,
            shapePoints[j].x, shapePoints[j].y
          );
          if (dist < bestDist) {
            bestDist = dist;
            bestEdge = j;
          }
        }

        // Insert new point
        const newPoint = { x: imgX, y: imgY };
        const newShape = [...shapePoints];
        newShape.splice(bestEdge, 0, newPoint);
        setShape(newShape);
        setSelectedShapeIndex(bestEdge);
        notifyChange(quad, opacity, newShape);
      }
    }
  };

  const handlePointerMove = (e) => {
    if (draggingIndex === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const { x: imgX, y: imgY } = canvasToImage(canvasX, canvasY);

    // Clamp to image bounds
    const clampedX = Math.max(0, Math.min(photoImg.naturalWidth, imgX));
    const clampedY = Math.max(0, Math.min(photoImg.naturalHeight, imgY));

    if (editMode === 'corners') {
      const newQuad = [...quad];
      newQuad[draggingIndex] = { x: clampedX, y: clampedY };
      setQuad(newQuad);
      notifyChange(newQuad, opacity, shape);
    } else {
      // Shape mode
      const shapePoints = shape || quad;
      const newShape = [...shapePoints];
      newShape[draggingIndex] = { x: clampedX, y: clampedY };
      setShape(newShape);
      notifyChange(quad, opacity, newShape);
    }
  };

  const handlePointerUp = (e) => {
    if (draggingIndex !== null) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.releasePointerCapture(e.pointerId);
      }
      setDraggingIndex(null);
    }
  };

  // Helper: distance from point to line segment
  const pointToSegmentDistance = (px, py, x1, y1, x2, y2) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = lenSq !== 0 ? dot / lenSq : -1;

    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    return Math.sqrt((px - xx) ** 2 + (py - yy) ** 2);
  };

  // Toggle to shape mode - initialize shape from quad if needed
  const handleModeToggle = () => {
    if (editMode === 'corners') {
      // Switching to shape mode
      if (!shape) {
        setShape([...quad]);
      }
      setEditMode('shape');
      setSelectedShapeIndex(null);
    } else {
      setEditMode('corners');
      setSelectedShapeIndex(null);
    }
  };

  // Opacity change handler
  const handleOpacityChange = (e) => {
    const newOpacity = Math.max(0.3, Math.min(1, parseFloat(e.target.value) / 100));
    setOpacity(newOpacity);
    notifyChange(quad, newOpacity, shape);
  };

  if (loading) {
    return (
      <div className="four-point-editor loading">
        <div className="spinner" />
        <p>Loading preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="four-point-editor error">
        <p>Failed to load: {error}</p>
      </div>
    );
  }

  return (
    <div className="four-point-editor" ref={containerRef}>
      <div className="editor-header">
        <h3>Position Your Design</h3>
        <p className="instructions">
          {editMode === 'corners'
            ? 'Drag the corner handles to position the TPV design on your photo.'
            : 'Click to add vertices, drag to move them. Press Delete to remove selected vertex.'}
        </p>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{
            width: `${(photoImg?.naturalWidth || 800) * displayScale}px`,
            height: `${(photoImg?.naturalHeight || 600) * displayScale}px`,
            cursor: draggingIndex !== null ? 'grabbing' : (editMode === 'shape' ? 'crosshair' : 'grab'),
            touchAction: 'none'
          }}
        />
      </div>

      <div className="controls">
        <div className="mode-toggle">
          <button
            className={`toggle-btn ${editMode === 'corners' ? 'active' : ''}`}
            onClick={() => setEditMode('corners')}
          >
            Corners
          </button>
          <button
            className={`toggle-btn ${editMode === 'shape' ? 'active' : ''}`}
            onClick={handleModeToggle}
          >
            Refine Shape
          </button>
        </div>

        <div className="opacity-control">
          <label>
            Overlay Opacity
            <span className="value">{Math.round(opacity * 100)}%</span>
          </label>
          <input
            type="range"
            min="30"
            max="100"
            value={Math.round(opacity * 100)}
            onChange={handleOpacityChange}
          />
        </div>
      </div>

      <style>{`
        .four-point-editor {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .four-point-editor.loading,
        .four-point-editor.error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #6b7280;
        }

        .four-point-editor .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #ff6b35;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .editor-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 1rem;
        }

        .editor-header h3 {
          margin: 0 0 0.5rem;
          font-size: 1.125rem;
          color: #1e4a7a;
        }

        .editor-header .instructions {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .canvas-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 8px;
          overflow: hidden;
          min-height: 400px;
        }

        .canvas-container canvas {
          display: block;
        }

        .controls {
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mode-toggle {
          display: flex;
          gap: 0.5rem;
        }

        .toggle-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle-btn:hover {
          background: #f9fafb;
        }

        .toggle-btn.active {
          background: #ff6b35;
          color: white;
          border-color: #ff6b35;
        }

        .opacity-control {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .opacity-control label {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .opacity-control .value {
          font-weight: 400;
          color: #6b7280;
        }

        .opacity-control input[type="range"] {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e5e7eb;
          outline: none;
          -webkit-appearance: none;
        }

        .opacity-control input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ff6b35;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
