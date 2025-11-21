// TPV Studio - In-Situ Photo Uploader Component
// Handles drag-drop or click upload of site photos

import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase/client.js';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export default function InSituUploader({ onPhotoUploaded, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInput = async (e) => {
    if (e.target.files.length > 0) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setError(null);

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please upload a JPG or PNG image');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be under 10MB');
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Get dimensions from local file BEFORE uploading
    console.log('[IN-SITU-UPLOADER] Loading local file to get dimensions...');
    const dimensions = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log('[IN-SITU-UPLOADER] Local image loaded, dimensions:', img.naturalWidth, 'x', img.naturalHeight);
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        // Don't revoke - keep blob URL alive for FourPointEditor to use
      };
      img.onerror = (err) => {
        console.error('[IN-SITU-UPLOADER] Failed to load local image:', err);
        reject(new Error('Failed to read image dimensions'));
      };
      img.src = previewUrl;
    });

    // Upload to Supabase
    setUploading(true);

    try {
      const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${file.type.split('/')[1]}`;
      const filePath = `in-situ-photos/${filename}`;

      const { data, error: uploadError } = await supabase.storage
        .from('tpv-studio-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tpv-studio-uploads')
        .getPublicUrl(filePath);

      console.log('[IN-SITU-UPLOADER] Photo uploaded:', publicUrl);
      console.log('[IN-SITU-UPLOADER] Using dimensions from local file:', dimensions);
      console.log('[IN-SITU-UPLOADER] Passing local blob URL for fast preview');
      console.log('[IN-SITU-UPLOADER] Calling onPhotoUploaded callback...');

      // Pass local blob URL for instant preview, Supabase URL for final save
      onPhotoUploaded({
        url: previewUrl,  // Use local blob URL for fast loading
        supabaseUrl: publicUrl,  // Keep Supabase URL for final save
        width: dimensions.width,
        height: dimensions.height,
        filename: file.name
      });

    } catch (err) {
      console.error('[IN-SITU-UPLOADER] Upload failed:', err);
      setError(err.message || 'Upload failed');
      URL.revokeObjectURL(previewUrl);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setError(null);
  };

  return (
    <div className="in-situ-uploader">
      {!preview ? (
        <div
          className={`upload-zone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileInput}
            style={{ display: 'none' }}
            disabled={disabled}
          />

          <div className="upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div className="upload-text">
            <p className="primary">
              {isDragging ? 'Drop photo here' : 'Upload site photo'}
            </p>
            <p className="secondary">
              Drag & drop or click to browse
            </p>
            <p className="hint">
              JPG or PNG, max 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="preview-container">
          <img src={preview} alt="Site preview" className="preview-image" />

          {uploading && (
            <div className="upload-overlay">
              <div className="upload-spinner" />
              <p>Uploading...</p>
            </div>
          )}

          {!uploading && (
            <button
              className="clear-button"
              onClick={clearPreview}
              title="Remove photo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <style>{`
        .in-situ-uploader {
          width: 100%;
        }

        .upload-zone {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #f9fafb;
        }

        .upload-zone:hover {
          border-color: #ff6b35;
          background: #fff7f5;
        }

        .upload-zone.dragging {
          border-color: #ff6b35;
          background: #fff7f5;
          border-style: solid;
        }

        .upload-zone.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .upload-zone.disabled:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .upload-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 1rem;
          color: #9ca3af;
        }

        .upload-zone:hover .upload-icon {
          color: #ff6b35;
        }

        .upload-text .primary {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 0.25rem;
        }

        .upload-text .secondary {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 0.5rem;
        }

        .upload-text .hint {
          font-size: 0.75rem;
          color: #9ca3af;
          margin: 0;
        }

        .preview-container {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }

        .preview-image {
          width: 100%;
          display: block;
          border-radius: 8px;
        }

        .upload-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .upload-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 0.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .clear-button {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          cursor: pointer;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .clear-button:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .clear-button svg {
          width: 16px;
          height: 16px;
        }

        .error-message {
          margin-top: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 4px;
          color: #dc2626;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
