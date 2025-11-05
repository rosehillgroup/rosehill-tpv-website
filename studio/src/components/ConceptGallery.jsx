import React, { useState } from 'react';

function ConceptGallery({ concepts, onSelectConcept }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (concept) => {
    setSelectedId(concept.id);
    onSelectConcept(concept);
  };

  if (!concepts || concepts.length === 0) {
    return null;
  }

  return (
    <div className="tpv-studio__card">
      <h2>Generated Concepts</h2>
      <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
        Select a concept to vectorize into an installable design
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {concepts.map((concept) => (
          <div
            key={concept.id}
            style={{
              border: selectedId === concept.id ? '3px solid #1a365d' : '1px solid #e2e8f0',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: '#ffffff'
            }}
            onClick={() => handleSelect(concept)}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={concept.thumbnailUrl || concept.quantizedUrl}
                alt={`Concept ${concept.metadata?.index + 1 || concept.id}`}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              {selectedId === concept.id && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#1a365d',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  SELECTED
                </div>
              )}
            </div>

            <div style={{ padding: '0.75rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                  Concept #{concept.metadata?.index + 1 || '?'}
                </span>
                <span style={{
                  background: concept.quality?.score >= 0.7 ? '#c6f6d5' : '#fed7d7',
                  color: concept.quality?.score >= 0.7 ? '#22543d' : '#742a2a',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {Math.round((concept.quality?.score || 0) * 100)}%
                </span>
              </div>

              {concept.quality && (
                <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                  <div>Contrast: {(concept.quality.contrast * 100).toFixed(0)}%</div>
                  <div>Balance: {(concept.quality.balance * 100).toFixed(0)}%</div>
                </div>
              )}

              {concept.paletteUsed && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{
                    display: 'flex',
                    gap: '2px',
                    flexWrap: 'wrap'
                  }}>
                    {concept.paletteUsed.slice(0, 6).map((color) => (
                      <div
                        key={color.code}
                        style={{
                          width: '16px',
                          height: '16px',
                          backgroundColor: color.hex,
                          borderRadius: '2px',
                          border: '1px solid rgba(0,0,0,0.1)'
                        }}
                        title={`${color.name} (${color.code})`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                className="tpv-studio__button tpv-studio__button--secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(concept);
                }}
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  padding: '0.5rem'
                }}
              >
                {selectedId === concept.id ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedId && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#bee3f8',
          color: '#2c5282',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          Concept selected! Proceed to Step 2 (Draftify) below to vectorize this design.
        </div>
      )}
    </div>
  );
}

export default ConceptGallery;
