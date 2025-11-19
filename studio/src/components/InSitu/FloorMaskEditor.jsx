// TPV Studio - Floor Mask Editor Component
// Interactive SAM-2 floor segmentation with click refinement

import { useState, useEffect, useRef, useCallback } from 'react';
import { loadMaskAsImageData, createMaskOverlay, featherMask } from '../../lib/inSitu/maskUtils.js';
import { auth } from '../../lib/api/auth.js';

// Polling interval for job status
const POLL_INTERVAL = 2000; // 2 seconds

export default function FloorMaskEditor({
  photoUrl,
  photoDimensions,
  onMaskConfirmed,
  onCancel
}) {
  const [positivePoints, setPositivePoints] = useState([]);
  const [negativePoints, setNegativePoints] = useState([]);
  const [maskUrl, setMaskUrl] = useState(null);
  const [maskData, setMaskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const debounceRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const lastClickTimeRef = useRef(0);
  const clickCountRef = useRef(0);

  // Scale factor for display
  const [displayScale, setDisplayScale] = useState(1);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Load image and run auto-detection on mount
  useEffect(() => {
    loadImageAndAutoDetect();
  }, [photoUrl]);

  // Redraw canvas when mask or points change
  useEffect(() => {
    if (imageRef.current) {
      drawCanvas();
    }
  }, [maskData, positivePoints, negativePoints, displayScale]);

  const loadImageAndAutoDetect = async () => {
    setInitializing(true);

    try {
      // Load image
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = photoUrl;
      });

      imageRef.current = img;

      // Calculate display scale to fit in container
      const containerWidth = 800; // Max width
      const scale = Math.min(1, containerWidth / img.naturalWidth);
      setDisplayScale(scale);

      // Run auto-detection
      await generateMask([], [], true);

    } catch (err) {
      console.error('[FLOOR-MASK] Failed to load image:', err);
      setError('Failed to load photo');
    } finally {
      setInitializing(false);
    }
  };

  const generateMask = async (posPoints, negPoints, autoDetect = false) => {
    setLoading(true);
    setError(null);
    setStatusMessage(autoDetect ? 'Detecting floor...' : 'Analyzing floor area...');

    // Clear any existing polling
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    try {
      const session = await auth.getSession();
      const token = session?.access_token;

      // Step 1: Start the job
      const startResponse = await fetch('/api/sam-start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          image_url: photoUrl,
          positive_points: posPoints,
          negative_points: negPoints,
          auto_detect: autoDetect
        })
      });

      if (!startResponse.ok) {
        const error = await startResponse.json();
        throw new Error(error.error || 'Failed to start mask generation');
      }

      const { jobId } = await startResponse.json();
      console.log('[FLOOR-MASK] Job started:', jobId);

      // Step 2: Poll for completion
      const pollStatus = async () => {
        try {
          const statusResponse = await fetch(`/api/sam-status?jobId=${jobId}`);
          const status = await statusResponse.json();

          console.log('[FLOOR-MASK] Job status:', status.status);

          if (status.status === 'completed' && status.mask_url) {
            // Stop polling
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }

            setMaskUrl(status.mask_url);

            // Load and process mask
            const { imageData } = await loadMaskAsImageData(status.mask_url);

            // Apply feathering for smooth edges
            const feathered = featherMask(imageData, 3);

            setMaskData(feathered);
            setLoading(false);
            setStatusMessage('');

            console.log('[FLOOR-MASK] Mask generated:', {
              dimensions: status.mask_dimensions
            });

          } else if (status.status === 'failed') {
            // Stop polling
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }

            setLoading(false);
            setStatusMessage('');
            setError(status.error || 'Mask generation failed');

          } else {
            // Still processing - update message
            setStatusMessage('Processing... this may take 20-60 seconds');
          }
        } catch (pollError) {
          console.error('[FLOOR-MASK] Polling error:', pollError);
          // Don't stop polling on network errors - retry
        }
      };

      // Start polling
      pollIntervalRef.current = setInterval(pollStatus, POLL_INTERVAL);

      // Also poll immediately
      await pollStatus();

    } catch (err) {
      console.error('[FLOOR-MASK] Mask generation failed:', err);
      setError(err.message);
      setLoading(false);
      setStatusMessage('');
    }
  };

  // Adaptive debounce - shorter for single clicks, longer for rapid clicking
  const scheduleGeneration = useCallback((posPoints, negPoints) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;

    // Count rapid clicks
    if (timeSinceLastClick < 500) {
      clickCountRef.current++;
    } else {
      clickCountRef.current = 1;
    }

    lastClickTimeRef.current = now;

    // Adaptive delay: shorter for single clicks, longer for rapid clicking
    const delay = clickCountRef.current > 2 ? 400 : 200;

    debounceRef.current = setTimeout(() => {
      generateMask(posPoints, negPoints);
      clickCountRef.current = 0;
    }, delay);
  }, [photoUrl]);

  const handleCanvasClick = (e) => {
    if (loading || !imageRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Get click position relative to canvas
    const x = (e.clientX - rect.left) / displayScale;
    const y = (e.clientY - rect.top) / displayScale;

    // Round to integers
    const point = [Math.round(x), Math.round(y)];

    // Alt/Option key for negative points
    if (e.altKey) {
      const newNegPoints = [...negativePoints, point];
      setNegativePoints(newNegPoints);
      scheduleGeneration(positivePoints, newNegPoints);
    } else {
      const newPosPoints = [...positivePoints, point];
      setPositivePoints(newPosPoints);
      scheduleGeneration(newPosPoints, negativePoints);
    }
  };

  const handleUndo = () => {
    // Remove last point (prefer negative, then positive)
    if (negativePoints.length > 0) {
      const newNegPoints = negativePoints.slice(0, -1);
      setNegativePoints(newNegPoints);
      scheduleGeneration(positivePoints, newNegPoints);
    } else if (positivePoints.length > 0) {
      const newPosPoints = positivePoints.slice(0, -1);
      setPositivePoints(newPosPoints);
      scheduleGeneration(newPosPoints, negativePoints);
    }
  };

  const handleReset = () => {
    setPositivePoints([]);
    setNegativePoints([]);
    generateMask([], [], true); // Re-run auto-detection
  };

  const handleConfirm = () => {
    if (maskData) {
      onMaskConfirmed({
        maskUrl,
        maskData,
        positivePoints,
        negativePoints
      });
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw photo
    ctx.drawImage(img, 0, 0);

    // Draw mask overlay if available
    if (maskData) {
      const overlay = createMaskOverlay(maskData, 'rgba(0, 200, 255, 0.35)');

      // Scale overlay to match image if needed
      if (overlay.width === img.naturalWidth && overlay.height === img.naturalHeight) {
        ctx.putImageData(overlay, 0, 0);
      } else {
        // Create temp canvas for scaled overlay
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = overlay.width;
        tempCanvas.height = overlay.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(overlay, 0, 0);

        ctx.drawImage(tempCanvas, 0, 0, img.naturalWidth, img.naturalHeight);
      }
    }

    // Draw positive points (green)
    ctx.fillStyle = '#22c55e';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    for (const [x, y] of positivePoints) {
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Plus sign
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 4, y);
      ctx.lineTo(x + 4, y);
      ctx.moveTo(x, y - 4);
      ctx.lineTo(x, y + 4);
      ctx.stroke();
    }

    // Draw negative points (red)
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    for (const [x, y] of negativePoints) {
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Minus sign
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 4, y);
      ctx.lineTo(x + 4, y);
      ctx.stroke();
    }
  };

  const totalPoints = positivePoints.length + negativePoints.length;

  return (
    <div className="floor-mask-editor">
      <div className="editor-header">
        <h3>Select Floor Area</h3>
        <p className="instructions">
          Click on the floor to refine the selection.
          <strong> Alt+click</strong> to remove areas that aren't floor.
        </p>
      </div>

      <div className="canvas-container">
        {initializing ? (
          <div className="loading-overlay">
            <div className="spinner" />
            <p>Detecting floor...</p>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              style={{
                width: `${(imageRef.current?.naturalWidth || 800) * displayScale}px`,
                height: `${(imageRef.current?.naturalHeight || 600) * displayScale}px`,
                cursor: loading ? 'wait' : 'crosshair'
              }}
            />

            {loading && (
              <div className="loading-indicator">
                <div className="spinner-small" />
                <span>{statusMessage || 'Processing...'}</span>
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="editor-footer">
        <div className="point-counts">
          <span className="positive">
            <span className="dot" /> {positivePoints.length} floor
          </span>
          <span className="negative">
            <span className="dot" /> {negativePoints.length} not floor
          </span>
        </div>

        <div className="actions">
          <button
            onClick={handleUndo}
            disabled={totalPoints === 0 || loading}
            className="btn-secondary btn-small"
          >
            Undo
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="btn-secondary btn-small"
          >
            Reset
          </button>
          <button
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!maskData || loading}
            className="btn-primary"
          >
            Confirm Floor Area
          </button>
        </div>
      </div>

      <style>{`
        .floor-mask-editor {
          display: flex;
          flex-direction: column;
          height: 100%;
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

        .editor-header strong {
          color: #374151;
        }

        .canvas-container {
          position: relative;
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
          max-width: 100%;
          max-height: 100%;
        }

        .loading-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #ff6b35;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }

        .loading-indicator {
          position: absolute;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-message {
          margin: 1rem 0;
          padding: 0.75rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 4px;
          color: #dc2626;
          font-size: 0.875rem;
        }

        .editor-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          margin-top: 1rem;
        }

        .point-counts {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
        }

        .point-counts span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .point-counts .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .point-counts .positive .dot {
          background: #22c55e;
        }

        .point-counts .negative .dot {
          background: #ef4444;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: #ff6b35;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #e55a2b;
        }

        .btn-primary:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f9fafb;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-small {
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}
