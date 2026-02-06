// TPV Studio - Design Card
// Individual design preview card for gallery

import { useState } from 'react';
import { showToast } from '../lib/toast.js';
import './DesignCard.css';

export default function DesignCard({
  design,
  onLoad,
  onDelete,
  onUpdateMetadata
}) {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${design.name}"? This cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(design.id);
    } catch (err) {
      console.error('Failed to delete design:', err);
      showToast('Failed to delete design. Please try again.');
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Use thumbnail, PNG, or SVG as fallback for preview
  const isSportsDesign = design.input_mode === 'sports_surface' || design.design_data?.type === 'sports_surface';
  const thumbnailUrl = design.thumbnail_url || design.original_png_url || design.original_svg_url;

  // Get design type label
  const getDesignType = () => {
    if (isSportsDesign) {
      return { label: 'Surface', icon: '🏟️', className: 'type-surface' };
    }
    return { label: 'Motif', icon: '🎨', className: 'type-motif' };
  };

  const designType = getDesignType();

  return (
    <div
      className={`design-card ${isDeleting ? 'deleting' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Type Badge */}
      <div className={`design-type-badge ${designType.className}`}>
        <span className="type-icon">{designType.icon}</span>
        <span className="type-label">{designType.label}</span>
      </div>

      {/* Thumbnail */}
      <div className="card-thumbnail" onClick={() => onLoad(design.id)}>
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={design.name} />
        ) : (
          <div className="no-thumbnail">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        {showActions && (
          <div className="thumbnail-overlay">
            <button className="btn-load">Open</button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="card-info">
        <h3 className="design-name" title={design.name}>{design.name}</h3>

        {design.description && (
          <p className="design-description" title={design.description}>
            {design.description}
          </p>
        )}

        <div className="card-meta">
          {design.projects && (
            <span
              className="project-badge"
              style={{ backgroundColor: design.projects.color || '#1a365d' }}
              title={design.projects.name}
            >
              {design.projects.name}
            </span>
          )}

          <span className="design-date" title={new Date(design.updated_at).toLocaleString()}>
            {formatDate(design.updated_at)}
          </span>
        </div>

        {design.tags && design.tags.length > 0 && (
          <div className="design-tags">
            {design.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
            {design.tags.length > 3 && (
              <span className="tag more">+{design.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && !isDeleting && (
        <div className="card-actions">
          <button
            onClick={() => onLoad(design.id)}
            className="action-btn load-btn"
            title="Load design"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="action-btn delete-btn"
            title="Delete design"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      )}

      {isDeleting && (
        <div className="deleting-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
