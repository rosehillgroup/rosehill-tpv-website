// TPV Studio - Header Component
// App header with navigation and user menu

import { useState } from 'react';
import { auth } from '../lib/api/auth.js';
import './Header.css';

export default function Header({ onShowDesigns, currentDesignName }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    if (confirm('Sign out?')) {
      await auth.signOut();
      window.location.reload();
    }
  };

  return (
    <header className="studio-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="studio-title">TPV Studio</h1>
          {currentDesignName && (
            <span className="current-design-indicator">
              <svg width="4" height="4" viewBox="0 0 4 4">
                <circle cx="2" cy="2" r="2" fill="currentColor" />
              </svg>
              {currentDesignName}
            </span>
          )}
        </div>

        <div className="header-right">
          <button onClick={onShowDesigns} className="btn-my-designs">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <path d="M9 22V12h6v10" />
            </svg>
            My Designs
          </button>

          <div className="user-menu">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="user-menu-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {showUserMenu && (
              <>
                <div className="user-menu-backdrop" onClick={() => setShowUserMenu(false)} />
                <div className="user-menu-dropdown">
                  <button onClick={handleSignOut} className="menu-item sign-out">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Sign Out
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
