import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="rebranded-header">
      <div className="header-logo-wrapper">
        <div className="rebranded-header-container">
          <div className="header-logo-section">
            <div className="logo-item distributor-logo">
              <a href="https://www.surfacedesigns.com.au/" target="_blank" rel="noopener noreferrer">
                <img src="/SURFACEDESIGNS_LOGO.jpg" alt="Surface Designs" className="logo-img" />
              </a>
            </div>
            <div className="logo-item manufacturer-logo">
              <img src="/Rosehill_SportPlay.png" alt="Rosehill Sports & Play" className="logo-img" />
            </div>
          </div>
        </div>
      </div>
      <div className="header-text-section">
        <div className="rebranded-header-container">
          <h1 className="mixer-title">Rosehill TPV<sup>®</sup> Colour Mixer</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;