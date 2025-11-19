// TPV Studio - In-Situ Preview Modal
// Main modal workflow for projecting designs onto site photos

import { useState, useEffect } from 'react';
import InSituUploader from './InSituUploader.jsx';
import FloorMaskEditor from './FloorMaskEditor.jsx';
import InSituPreviewRenderer from './InSituPreviewRenderer.jsx';
import { supabase } from '../../lib/supabase/client.js';

// Workflow steps
const STEPS = {
  UPLOAD: 'upload',
  MASK: 'mask',
  PREVIEW: 'preview'
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

  // Mask data
  const [maskData, setMaskData] = useState(null);
  const [maskUrl, setMaskUrl] = useState(null);

  // Preview data
  const [previewData, setPreviewData] = useState(null);

  // Pre-cache resources on mount
  useEffect(() => {
    // Warm up by pre-loading the design
    if (designUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = designUrl;
    }
  }, [designUrl]);

  const handlePhotoUploaded = (photoData) => {
    console.log('[IN-SITU] Photo uploaded:', photoData);
    setPhoto(photoData);
    setCurrentStep(STEPS.MASK);
  };

  const handleMaskConfirmed = (maskResult) => {
    console.log('[IN-SITU] Mask confirmed:', maskResult);
    setMaskData(maskResult.maskData);
    setMaskUrl(maskResult.maskUrl);
    setCurrentStep(STEPS.PREVIEW);
  };

  const handleBackToMask = () => {
    setCurrentStep(STEPS.MASK);
  };

  const handleSave = async (previewResult) => {
    console.log('[IN-SITU] Saving preview:', previewResult);

    try {
      // Upload preview image to Supabase
      const response = await fetch(previewResult.previewUrl);
      const blob = await response.blob();

      const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
      const filePath = `in-situ-previews/${filename}`;

      const { data, error: uploadError } = await supabase.storage
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

      setPreviewData({
        ...previewResult,
        savedPreviewUrl: publicUrl
      });

      // Call onSaved callback with all in-situ data
      if (onSaved) {
        onSaved({
          room_photo_url: photo.url,
          mask_url: maskUrl,
          floor_dimensions_m: previewResult.floorDimensions,
          preview_url: publicUrl,
          blend_opacity: previewResult.blendOpacity,
          perspective_corners: previewResult.perspectiveCorners
        });
      }

      // Close modal after successful save
      onClose();

    } catch (err) {
      console.error('[IN-SITU] Save failed:', err);
      // Show error to user
      alert('Failed to save preview: ' + err.message);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case STEPS.UPLOAD:
        return 'Upload Site Photo';
      case STEPS.MASK:
        return 'Select Floor Area';
      case STEPS.PREVIEW:
        return 'Preview & Export';
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
              <span className={currentStep === STEPS.UPLOAD ? 'active' : currentStep !== STEPS.UPLOAD ? 'completed' : ''}>
                1. Upload
              </span>
              <span className={currentStep === STEPS.MASK ? 'active' : currentStep === STEPS.PREVIEW ? 'completed' : ''}>
                2. Select Floor
              </span>
              <span className={currentStep === STEPS.PREVIEW ? 'active' : ''}>
                3. Preview
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

          {currentStep === STEPS.MASK && photo && (
            <FloorMaskEditor
              photoUrl={photo.url}
              photoDimensions={{ width: photo.width, height: photo.height }}
              onMaskConfirmed={handleMaskConfirmed}
              onCancel={() => setCurrentStep(STEPS.UPLOAD)}
            />
          )}

          {currentStep === STEPS.PREVIEW && maskData && (
            <InSituPreviewRenderer
              photoUrl={photo.url}
              designUrl={designUrl}
              maskData={maskData}
              designDimensions={designDimensions}
              onSave={handleSave}
              onBack={handleBackToMask}
            />
          )}
        </div>
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
        }
      `}</style>
    </div>
  );
}
