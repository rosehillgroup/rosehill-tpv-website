// TPV Studio - Header Component
// App header with navigation and user menu

import { useState } from 'react';
import { auth } from '../lib/api/auth.js';
import './Header.css';

export default function Header({ onShowDesigns, onShowAdmin, isAdmin, currentDesignName }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);

  const handleSignOut = async () => {
    if (!confirmingSignOut) {
      setConfirmingSignOut(true);
      return;
    }
    await auth.signOut();
    window.location.reload();
  };

  const closeMenu = () => {
    setShowUserMenu(false);
    setConfirmingSignOut(false);
  };

  return (
    <header className="studio-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="studio-title">TPV Designer</h1>
          {currentDesignName && (
            <span className="current-design-indicator">
              <svg width="4" height="4" viewBox="0 0 4 4">
                <circle cx="2" cy="2" r="2" fill="currentColor" />
              </svg>
              {currentDesignName}
            </span>
          )}
        </div>

        {/* Toolbar portal target — TPVDesigner injects toolbar here via createPortal */}
        <div id="header-toolbar-portal" className="header-toolbar-portal" />

        <div className="header-right">
          <div className="user-menu">
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setConfirmingSignOut(false); }}
              className="user-menu-button"
              aria-label="User menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {showUserMenu && (
              <>
                <div className="user-menu-backdrop" onClick={closeMenu} />
                <div className="user-menu-dropdown">
                  <button onClick={() => { onShowDesigns(); closeMenu(); }} className="menu-item my-designs">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <path d="M9 22V12h6v10" />
                    </svg>
                    My Designs
                  </button>
                  <button onClick={handleSignOut} className={`menu-item sign-out${confirmingSignOut ? ' confirming' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    {confirmingSignOut ? 'Confirm Sign Out' : 'Sign Out'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
