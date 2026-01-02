// TPV Studio - Court Library Modal
// Wraps CourtLibrary in a modal for on-demand access
import React, { useEffect } from 'react';
import CourtLibrary from './CourtLibrary.jsx';
import './CourtLibraryModal.css';

function CourtLibraryModal({ isOpen, onClose, onOpenGenerator }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="court-library-modal__overlay" onClick={onClose}>
      <div
        className="court-library-modal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="court-library-modal__header">
          <h2>Element Library</h2>
          <p>Select courts, tracks, or designs to add to your canvas</p>
          <button
            className="court-library-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="court-library-modal__content">
          <CourtLibrary
            modalMode={true}
            onItemAdded={onClose}
            onOpenGenerator={() => {
              onClose();
              onOpenGenerator();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CourtLibraryModal;
