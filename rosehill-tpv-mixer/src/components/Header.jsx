import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="rebranded-header">
      <div className="header-unified-section">
        <div className="rebranded-header-container">
          <div className="header-content">
            <div className="logo-item distributor-logo">
              <a href="https://www.surfacedesigns.com.au/" target="_blank" rel="noopener noreferrer">
                <img src="/SURFACEDESIGNS_LOGO.jpg" alt="Surface Designs" className="logo-img" />
              </a>
            </div>
            <h1 className="mixer-title">Rosehill TPV<sup>®</sup> Colour Mixer</h1>
            <div className="logo-item manufacturer-logo">
              <img src="/rosehill_tpv_logo.png" alt="Rosehill TPV" className="logo-img" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;