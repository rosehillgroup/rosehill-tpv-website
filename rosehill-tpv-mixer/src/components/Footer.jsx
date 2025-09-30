import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="rebranded-footer">
      <div className="footer-container">
        <div className="footer-content">
          <h3 className="footer-title">Rosehill TPV<sup>®</sup> Colour Mixer</h3>
          <p className="footer-description">
            Professional colour mixing tool for custom TPV<sup>®</sup> rubber granule blends.<br />
            Distributed by Surface Designs for Glooloop installations.
          </p>
          <div className="footer-links">
            <a href="https://tpv.rosehill.group/" className="footer-link" target="_blank" rel="noopener noreferrer">
              Rosehill TPV<sup>®</sup>
            </a>
            <a href="https://rosehill.group/" className="footer-link" target="_blank" rel="noopener noreferrer">
              Rosehill Group
            </a>
            <a href="mailto:info@rosehill.group" className="footer-link">
              Contact
            </a>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; 2025 Rosehill Sports &amp; Play, A Division of Rosehill Group. All rights reserved. Rosehill TPV<sup>®</sup> is a registered trademark.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;