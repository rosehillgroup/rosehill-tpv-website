import React from 'react';

function ExportPanel({ variant }) {
  const handleDownload = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="tpv-studio__card">
      <h3>3. Export & Download</h3>
      <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
        Download your selected design in multiple formats
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <button
          className="tpv-studio__button tpv-studio__button--secondary"
          onClick={() => handleDownload(variant.svgUrl, `design-v${variant.variant}.svg`)}
        >
          Download SVG
        </button>

        <button
          className="tpv-studio__button tpv-studio__button--secondary"
          onClick={() => handleDownload(variant.dxfUrl, `design-v${variant.variant}.dxf`)}
        >
          Download DXF
        </button>

        <button
          className="tpv-studio__button tpv-studio__button--secondary"
          onClick={() => handleDownload(variant.pdfUrl, `design-v${variant.variant}.pdf`)}
        >
          Download PDF Plan
        </button>

        <button
          className="tpv-studio__button tpv-studio__button--secondary"
          onClick={() => handleDownload(variant.pngUrl, `design-v${variant.variant}.png`)}
        >
          Download PNG
        </button>
      </div>

      {variant.violations && variant.violations.length > 0 && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#feebc8',
          borderRadius: '8px'
        }}>
          <h4 style={{ marginTop: 0, color: '#7c2d12' }}>
            Constraint Warnings
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {variant.violations.map((v, i) => (
              <li key={i} style={{ color: '#7c2d12', marginBottom: '0.25rem' }}>
                <strong>{v.type}:</strong> {v.severity} severity at ({v.location?.join(', ')})
              </li>
            ))}
          </ul>
          <p style={{ marginBottom: 0, marginTop: '0.75rem', fontSize: '0.875rem', color: '#7c2d12' }}>
            Note: These issues were automatically repaired where possible. Review design before installation.
          </p>
        </div>
      )}

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'var(--color-bg-light)',
        borderRadius: '8px'
      }}>
        <h4 style={{ marginTop: 0 }}>Bill of Materials</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Color Code</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>Area (m²)</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(variant.bom.colourAreas_m2 || {}).map(([code, area]) => (
              <tr key={code} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.5rem' }}>{code}</td>
                <td style={{ textAlign: 'right', padding: '0.5rem' }}>{area.toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                  {((area / variant.bom.totalArea_m2) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
            <tr style={{ fontWeight: 'bold', background: 'var(--color-bg-white)' }}>
              <td style={{ padding: '0.5rem' }}>Total</td>
              <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                {variant.bom.totalArea_m2.toFixed(2)}
              </td>
              <td style={{ textAlign: 'right', padding: '0.5rem' }}>100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExportPanel;
