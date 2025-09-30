import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="rebranded-header">
      <div className="header-text-section">
        <div className="rebranded-header-container">
          <h1 className="mixer-title">Rosehill TPV<sup>®</sup> Colour Mixer</h1>
          <p className="mixer-strapline">Create custom granule blends with our 21 premium Rosehill TPV<sup>®</sup> colours</p>
        </div>
      </div>
      <div className="header-logo-wrapper">
        <div className="rebranded-header-container">
          <div className="header-logo-section">
            <div className="logo-item distributor-logo">
              <a href="https://www.surfacedesigns.com.au/" target="_blank" rel="noopener noreferrer">
                <img src="/SURFACEDESIGNS_LOGO.jpg" alt="Surface Designs - Distributor" className="logo-img" />
              </a>
              <span className="logo-label">Distributor</span>
            </div>
            <div className="logo-item manufacturer-logo">
              <img src="/rosehill_tpv_logo.png" alt="Rosehill TPV® - Manufacturer" className="logo-img" />
              <span className="logo-label">Manufacturer</span>
            </div>
            <div className="logo-item customer-logo">
              <a href="https://glooloop.com.au/" target="_blank" rel="noopener noreferrer">
                <img src="/glooloop.webp" alt="Glooloop - Installed By" className="logo-img" />
              </a>
              <span className="logo-label">Installed By</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;