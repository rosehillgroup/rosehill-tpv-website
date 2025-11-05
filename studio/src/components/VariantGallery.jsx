import React from 'react';

function VariantGallery({ variants, selectedVariant, onSelectVariant }) {
  const getScoreBadgeClass = (score) => {
    if (score >= 90) return 'tpv-studio__score-badge--high';
    if (score >= 75) return 'tpv-studio__score-badge--medium';
    return 'tpv-studio__score-badge--low';
  };

  return (
    <div className="tpv-studio__card">
      <h3>2. Design Variants</h3>
      <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
        Select a design to view exports and download options
      </p>

      <div className="tpv-studio__gallery">
        {variants.map((variant) => (
          <div
            key={variant.variant}
            className="tpv-studio__variant-card"
            onClick={() => onSelectVariant(variant)}
            style={{
              border: selectedVariant?.variant === variant.variant
                ? '3px solid var(--color-primary)'
                : 'none'
            }}
          >
            <img
              src={variant.pngUrl}
              alt={`Design variant ${variant.variant}`}
              className="tpv-studio__variant-preview"
            />
            <div className="tpv-studio__variant-info">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <h4 style={{ margin: 0 }}>Variant {variant.variant}</h4>
                <span className={`tpv-studio__score-badge ${getScoreBadgeClass(variant.score)}`}>
                  Score: {variant.score}
                </span>
              </div>

              {variant.violations && variant.violations.length > 0 && (
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-warning)',
                  margin: '0.5rem 0 0'
                }}>
                  ⚠️ {variant.violations.length} constraint{variant.violations.length > 1 ? 's' : ''} flagged
                </p>
              )}

              <div style={{
                marginTop: '0.75rem',
                fontSize: '0.875rem',
                color: 'var(--color-text-light)'
              }}>
                {Object.entries(variant.bom.colourAreas_m2 || {}).map(([code, area]) => (
                  <div key={code} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{code}:</span>
                    <span>{area.toFixed(2)} m²</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VariantGallery;
