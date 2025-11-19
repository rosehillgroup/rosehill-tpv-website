// TPV Studio - In-Situ Preview Modal
// 2-step workflow: upload photo, position design with 4 corner points

import { useState, useEffect, useRef } from 'react';
import InSituUploader from './InSituUploader.jsx';
import FourPointEditor from './FourPointEditor.jsx';
import {
  downloadCanvasAsPng,
  loadImage,
  rasterizeSvg,
  warpDesignOntoPhoto
} from '../../lib/inSitu/perspectiveWarp.js';
import { supabase } from '../../lib/supabase/client.js';

// Workflow steps
const STEPS = {
  UPLOAD: 'upload',
  POSITION: 'position'
};

export default function InSituModal({
  designUrl,
  designDimensions, // { width: mm, length: mm }
  onClose,
  onSaved
}) {
  const [currentStep, setCurrentStep] = useState(STEPS.UPLOAD);

  // Photo data
  const [photo, setPhoto] = useState(null);

  // Quad, shape, and opacity from FourPointEditor
  const [quad, setQuad] = useState(null);
  const [shape, setShape] = useState(null);
  const [opacity, setOpacity] = useState(0.8);

  // Saving state
  const [saving, setSaving] = useState(false);

  // Ref to get canvas from FourPointEditor
  const editorRef = useRef(null);

  // Pre-cache resources on mount
  useEffect(() => {
    if (designUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = designUrl;
    }
  }, [designUrl]);

  const handlePhotoUploaded = (photoData) => {
    console.log('[IN-SITU] Photo uploaded:', photoData);
    setPhoto(photoData);
    setCurrentStep(STEPS.POSITION);
  };

  const handleEditorChange = ({ quad: newQuad, opacity: newOpacity, shape: newShape }) => {
    setQuad(newQuad);
    setOpacity(newOpacity);
    setShape(newShape);
  };

  // Generate a clean canvas without handles for export
  const generateCleanCanvas = async () => {
    if (!photo || !quad) return null;

    // Load images
    const [photoImg, designImg] = await Promise.all([
      loadImage(photo.url),
      rasterizeSvg(designUrl, 1536)
    ]);

    // Create canvas at photo's natural dimensions
    const canvas = document.createElement('canvas');
    canvas.width = photoImg.naturalWidth;
    canvas.height = photoImg.naturalHeight;
    const ctx = canvas.getContext('2d');

    // Draw warped design without handles
    warpDesignOntoPhoto({
      photoCtx: ctx,
      photoImg,
      designImg,
      quad,
      opacity,
      shape
    });

    return canvas;
  };

  const handleDownload = async () => {
    const canvas = await generateCleanCanvas();
    if (canvas) {
      downloadCanvasAsPng(canvas, 'tpv-in-situ-preview.png');
    }
  };

  const handleSave = async () => {
    if (!quad || !photo) return;

    setSaving(true);

    try {
      // Generate clean canvas without handles
      const canvas = await generateCleanCanvas();
      if (!canvas) {
        throw new Error('Failed to generate preview');
      }

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

      // Upload preview to Supabase
      const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
      const filePath = `in-situ-previews/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('tpv-studio-uploads')
        .upload(filePath, blob, {
          contentType: 'image/png',
          cacheControl: '3600'
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tpv-studio-uploads')
        .getPublicUrl(filePath);

      // Call onSaved callback with in-situ data
      if (onSaved) {
        onSaved({
          photo_url: photo.url,
          quad,
          shape,
          opacity,
          preview_url: publicUrl
        });
      }

      // Close modal after successful save
      onClose();

    } catch (err) {
      console.error('[IN-SITU] Save failed:', err);
      alert('Failed to save preview: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case STEPS.UPLOAD:
        return 'Upload Site Photo';
      case STEPS.POSITION:
        return 'Position Your Design';
      default:
        return 'In-Situ Preview';
    }
  };

  return (
    <div className="modal-overlay in-situ-modal-overlay" onClick={onClose}>
      <div
        className="modal-content in-situ-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="header-left">
            <h2>{getStepTitle()}</h2>
            <div className="step-indicator">
              <span className={currentStep === STEPS.UPLOAD ? 'active' : 'completed'}>
                1. Upload
              </span>
              <span className={currentStep === STEPS.POSITION ? 'active' : ''}>
                2. Position
              </span>
            </div>
          </div>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="modal-body">
          {currentStep === STEPS.UPLOAD && (
            <div className="upload-step">
              <p className="step-description">
                Upload a photo of your site to see how your TPV design will look when installed.
                For best results, use a photo taken from above or at a slight angle showing the floor area clearly.
              </p>
              <InSituUploader onPhotoUploaded={handlePhotoUploaded} />
            </div>
          )}

          {currentStep === STEPS.POSITION && photo && (
            <FourPointEditor
              ref={editorRef}
              photoUrl={photo.url}
              svgUrl={designUrl}
              designSizeMm={{
                width_mm: designDimensions.width,
                length_mm: designDimensions.length
              }}
              initialOpacity={0.8}
              onChange={handleEditorChange}
            />
          )}
        </div>

        {currentStep === STEPS.POSITION && (
          <div className="modal-footer">
            <button
              onClick={() => setCurrentStep(STEPS.UPLOAD)}
              className="btn-secondary"
            >
              Back
            </button>

            <div className="footer-actions">
              <button
                onClick={handleDownload}
                disabled={!quad}
                className="btn-secondary"
              >
                Download PNG
              </button>
              <button
                onClick={handleSave}
                disabled={!quad || saving}
                className="btn-primary"
              >
                {saving ? 'Saving...' : 'Save to Project'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .in-situ-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .in-situ-modal {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 1000px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .in-situ-modal .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .in-situ-modal .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
          color: #1e4a7a;
        }

        .step-indicator {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
        }

        .step-indicator span {
          color: #9ca3af;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .step-indicator span.active {
          background: #fff7f5;
          color: #ff6b35;
          font-weight: 500;
        }

        .step-indicator span.completed {
          color: #22c55e;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #9ca3af;
          padding: 0;
          line-height: 1;
        }

        .close-button:hover {
          color: #374151;
        }

        .modal-body {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          min-height: 500px;
        }

        .upload-step {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .step-description {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.6;
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 0 0 12px 12px;
        }

        .footer-actions {
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

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .in-situ-modal {
            max-width: 100%;
            max-height: 100vh;
            border-radius: 0;
          }

          .modal-body {
            padding: 1rem;
          }

          .step-indicator {
            display: none;
          }

          .modal-footer {
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}
