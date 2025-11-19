// TPV Studio - Four Point Editor Component
// Interactive 4-corner placement for perspective warp

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
  initialOpacity = 0.8,
  onChange
}) {
  // State
  const [photoImg, setPhotoImg] = useState(null);
  const [designImg, setDesignImg] = useState(null);
  const [quad, setQuad] = useState(initialQuad || null);
  const [opacity, setOpacity] = useState(Math.max(0.3, Math.min(1, initialOpacity)));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [displayScale, setDisplayScale] = useState(1);

  // Refs
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Load images on mount
  useEffect(() => {
    loadImages();
  }, [photoUrl, svgUrl]);

  // Redraw when quad or opacity changes
  useEffect(() => {
    if (photoImg && designImg && quad) {
      drawPreview();
    }
  }, [photoImg, designImg, quad, opacity]);

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
    // CSS width/height handles display scaling via displayScale
    canvas.width = photoImg.naturalWidth;
    canvas.height = photoImg.naturalHeight;

    const ctx = canvas.getContext('2d');

    // Draw warped design on photo
    warpDesignOntoPhoto({
      photoCtx: ctx,
      photoImg,
      designImg,
      quad,
      opacity
    });

    // Draw handles and lines
    drawHandles(ctx);
  };

  const drawHandles = (ctx) => {
    if (!quad) return;

    // Reset transform to identity (warpDesignOntoPhoto uses setTransform)
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Draw connecting lines
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

    // Draw corner handles - scale radius based on image size for visibility
    const handleRadius = Math.max(8, Math.min(15, photoImg.naturalWidth / 80));
    const labels = ['TL', 'TR', 'BR', 'BL'];

    quad.forEach((point, index) => {
      // Outer circle
      ctx.beginPath();
      ctx.arc(point.x, point.y, handleRadius, 0, Math.PI * 2);
      ctx.fillStyle = draggingIndex === index ? '#ff6b35' : 'rgba(255, 107, 53, 0.9)';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = 'white';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[index], point.x, point.y);
    });
  };

  // Notify parent of changes (debounced)
  const notifyChange = useCallback((newQuad, newOpacity) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (onChange) {
        onChange({ quad: newQuad, opacity: newOpacity });
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
  const findHandle = (imageX, imageY) => {
    if (!quad) return -1;

    // Threshold in image coordinates - 20 CSS pixels converted to image pixels
    const threshold = 25 / displayScale;

    for (let i = 0; i < quad.length; i++) {
      const dx = quad[i].x - imageX;
      const dy = quad[i].y - imageY;
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

    const handleIndex = findHandle(imgX, imgY);
    if (handleIndex >= 0) {
      setDraggingIndex(handleIndex);
      canvas.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (draggingIndex === null || !quad) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const { x: imgX, y: imgY } = canvasToImage(canvasX, canvasY);

    // Clamp to image bounds
    const clampedX = Math.max(0, Math.min(photoImg.naturalWidth, imgX));
    const clampedY = Math.max(0, Math.min(photoImg.naturalHeight, imgY));

    // Update quad
    const newQuad = [...quad];
    newQuad[draggingIndex] = { x: clampedX, y: clampedY };
    setQuad(newQuad);
    notifyChange(newQuad, opacity);
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

  // Opacity change handler
  const handleOpacityChange = (e) => {
    const newOpacity = Math.max(0.3, Math.min(1, parseFloat(e.target.value) / 100));
    setOpacity(newOpacity);
    notifyChange(quad, newOpacity);
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
          Drag the corner handles to position the TPV design on your photo.
          The design will be warped to fit the quadrilateral you create.
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
            cursor: draggingIndex !== null ? 'grabbing' : 'grab',
            touchAction: 'none'
          }}
        />
      </div>

      <div className="controls">
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
