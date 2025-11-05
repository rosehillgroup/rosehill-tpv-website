import React, { useState } from 'react';
import { apiClient } from '../lib/api/client.js';

const VECTOR_QUALITY_PRESETS = [
  { value: 'draft', label: 'Draft', description: 'Fast, simpler paths' },
  { value: 'balanced', label: 'Balanced', description: 'Good quality/speed' },
  { value: 'precise', label: 'Precise', description: 'Highest detail' }
];

function DraftifyPanel({ selectedConcept, onDesignComplete }) {
  const [vectorQuality, setVectorQuality] = useState('balanced');
  const [posterize, setPosterize] = useState(false);
  const [autoRepair, setAutoRepair] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [design, setDesign] = useState(null);

  if (!selectedConcept) {
    return (
      <div className="tpv-studio__card">
        <h2>Step 2: Draftify</h2>
        <p style={{ color: '#718096' }}>
          Select a concept above to vectorize it into an installable design
        </p>
      </div>
    );
  }

  const handleDraftify = async () => {
    setLoading(true);
    setError(null);
    setProgress('Downloading concept image...');
    setDesign(null);

    try {
      const request = {
        conceptUrl: selectedConcept.quantizedUrl,
        surface: {
          width_m: selectedConcept.metadata?.surface?.width_m || 5,
          height_m: selectedConcept.metadata?.surface?.height_m || 5
        },
        paletteColors: selectedConcept.paletteUsed || [],
        options: {
          posterize,
          vectorQuality,
          autoRepairEnabled: autoRepair
        }
      };

      setProgress('Vectorizing to SVG paths...');
      console.log('[DraftifyPanel] Calling draftify API:', request);

      const response = await apiClient.draftify(request);

      console.log('[DraftifyPanel] Received design:', response);
      setProgress('Design complete!');
      setDesign(response.design);

      if (onDesignComplete) {
        onDesignComplete(response.design);
      }

    } catch (err) {
      console.error('[DraftifyPanel] Error:', err);
      setError(err.message);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tpv-studio__card">
      <h2>Step 2: Draftify</h2>
      <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
        Vectorize concept into installable TPV surface design
      </p>

      {!design && (
        <>
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            background: '#f7fafc',
            borderRadius: '8px',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <img
              src={selectedConcept.thumbnailUrl || selectedConcept.quantizedUrl}
              alt="Selected concept"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>
                Selected Concept #{selectedConcept.metadata?.index + 1}
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#718096' }}>
                Quality: {Math.round((selectedConcept.quality?.score || 0) * 100)}%
              </p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#718096' }}>
                Colors: {selectedConcept.paletteUsed?.length || 0}
              </p>
            </div>
          </div>

          <div className="tpv-studio__form-group">
            <label className="tpv-studio__label">Vector Quality</label>
            <select
              className="tpv-studio__select"
              value={vectorQuality}
              onChange={(e) => setVectorQuality(e.target.value)}
              disabled={loading}
            >
              {VECTOR_QUALITY_PRESETS.map(preset => (
                <option key={preset.value} value={preset.value}>
                  {preset.label} - {preset.description}
                </option>
              ))}
            </select>
            <small style={{ color: '#718096', display: 'block', marginTop: '0.5rem' }}>
              Higher quality = more paths, longer processing time
            </small>
          </div>

          <div className="tpv-studio__form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={posterize}
                onChange={(e) => setPosterize(e.target.checked)}
                disabled={loading}
              />
              <span>Apply posterization</span>
            </label>
            <small style={{ color: '#718096', display: 'block', marginTop: '0.25rem', marginLeft: '1.5rem' }}>
              Reduces color noise before vectorization (recommended for complex images)
            </small>
          </div>

          <div className="tpv-studio__form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={autoRepair}
                onChange={(e) => setAutoRepair(e.target.checked)}
                disabled={loading}
              />
              <span>Auto-repair constraints</span>
            </label>
            <small style={{ color: '#718096', display: 'block', marginTop: '0.25rem', marginLeft: '1.5rem' }}>
              Automatically fix violations (remove small regions, expand thin features)
            </small>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              background: '#fed7d7',
              color: '#742a2a',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {progress && !error && (
            <div style={{
              padding: '1rem',
              background: '#bee3f8',
              color: '#2c5282',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              {progress}
            </div>
          )}

          <button
            className="tpv-studio__button tpv-studio__button--primary"
            onClick={handleDraftify}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading && <span className="tpv-studio__spinner" />}
            {loading ? 'Vectorizing...' : 'Vectorize to Design ($0.05)'}
          </button>

          {!loading && (
            <p style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: '#a0aec0',
              textAlign: 'center'
            }}>
              ~30 seconds | Potrace vectorization | Constraint checking | Auto-repair
            </p>
          )}
        </>
      )}

      {design && (
        <div>
          <div style={{
            padding: '1rem',
            background: '#c6f6d5',
            color: '#22543d',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <strong>Design Complete!</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
              Vectorization successful with {design.metadata?.regionCount || 0} color regions.
              Installer score: {design.constraints?.score || 0}/100
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Constraints</h4>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                <div>Score: {design.constraints?.score || 0}/100</div>
                <div>Violations: {design.constraints?.violations || 0}</div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Bill of Materials</h4>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                <div>Total: {(design.bom?.totalArea_m2 || 0).toFixed(2)} m²</div>
                <div>Colors: {Object.keys(design.bom?.colourAreas_m2 || {}).length}</div>
              </div>
            </div>
          </div>

          {design.repairReport && (
            <div style={{
              padding: '1rem',
              background: '#f7fafc',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              whiteSpace: 'pre-line',
              fontSize: '0.875rem'
            }}>
              <strong>Auto-Repair Summary:</strong>
              <div style={{ marginTop: '0.5rem' }}>{design.repairReport}</div>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem'
          }}>
            <a
              href={design.exports?.svgUrl}
              download
              className="tpv-studio__button tpv-studio__button--secondary"
              style={{ textAlign: 'center', padding: '0.75rem' }}
            >
              Download SVG
            </a>
            <a
              href={design.exports?.pngUrl}
              download
              className="tpv-studio__button tpv-studio__button--secondary"
              style={{ textAlign: 'center', padding: '0.75rem' }}
            >
              Download PNG
            </a>
            <a
              href={design.exports?.dxfUrl}
              download
              className="tpv-studio__button tpv-studio__button--secondary"
              style={{ textAlign: 'center', padding: '0.75rem' }}
            >
              Download DXF
            </a>
            <a
              href={design.exports?.pdfUrl}
              download
              className="tpv-studio__button tpv-studio__button--secondary"
              style={{ textAlign: 'center', padding: '0.75rem' }}
            >
              Download PDF
            </a>
          </div>

          <button
            className="tpv-studio__button tpv-studio__button--primary"
            onClick={() => {
              setDesign(null);
              setProgress(null);
            }}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Create Another Design
          </button>
        </div>
      )}
    </div>
  );
}

export default DraftifyPanel;
