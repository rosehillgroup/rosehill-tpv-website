import React, { useState, useEffect } from 'react';
import { auth } from './lib/api/auth.js';
import { loadDesign } from './lib/api/designs.js';
import { useSportsDesignStore } from './stores/sportsDesignStore.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import TPVDesigner from './components/TPVDesigner/TPVDesigner.jsx';
import Header from './components/Header.jsx';
import DesignGallery from './components/DesignGallery.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import LandingPage from './components/LandingPage.jsx';
import SetPassword from './components/SetPassword.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);

  // Design state
  const [loadedDesign, setLoadedDesign] = useState(null);
  const [designName, setDesignName] = useState(null);

  // Check if user has admin role
  const checkAdminStatus = async () => {
    try {
      const session = await auth.getSession();

      if (!session?.access_token) {
        setIsAdmin(false);
        return;
      }

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      // If we can access admin endpoint, user is admin
      setIsAdmin(response.ok);
    } catch (error) {
      console.error('[APP] Admin check failed');
      setIsAdmin(false);
    }
  };

  // Load design from URL parameter if present
  const loadDesignFromUrl = async (designId) => {
    try {
      console.log('[APP] Loading design from URL:', designId);
      const response = await loadDesign(designId);
      const { design, is_borrowed, owner_email } = response;

      if (design) {
        // Handle borrowed design state (admin viewing another user's design)
        if (is_borrowed) {
          console.log('[APP] Loading borrowed design from:', owner_email);
          useSportsDesignStore.getState().setBorrowed(designId, owner_email);
        } else {
          // Clear any previous borrowed state
          useSportsDesignStore.getState().clearBorrowed();
        }

        handleLoadDesign(design);
        // Clear the URL parameter after loading
        const url = new URL(window.location);
        url.searchParams.delete('design');
        window.history.replaceState({}, '', url);
      }
    } catch (error) {
      console.error('[APP] Failed to load design from URL:', error);
    }
  };

  useEffect(() => {
    // Check auth status on mount
    auth.getSession().then(session => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Check if user needs to set up password (invited users)
        const passwordSetupComplete = currentUser.user_metadata?.password_setup_complete;
        setNeedsPasswordSetup(!passwordSetupComplete);

        checkAdminStatus();

        // Check for design ID in URL params
        const urlParams = new URLSearchParams(window.location.search);
        const designId = urlParams.get('design');
        if (designId) {
          loadDesignFromUrl(designId);
        }
      }
    });

    // Listen for auth changes
    const { data: subscription } = auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        // Check if user needs to set up password
        const passwordSetupComplete = currentUser.user_metadata?.password_setup_complete;
        setNeedsPasswordSetup(!passwordSetupComplete);

        checkAdminStatus();
      } else {
        setIsAdmin(false);
        setNeedsPasswordSetup(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLoadDesign = (design) => {
    setLoadedDesign(design);
    setDesignName(design.name);
  };

  const handleDesignSaved = (name) => {
    setDesignName(name);
  };

  const handlePasswordSet = async () => {
    setNeedsPasswordSetup(false);

    // Refresh user session to get updated metadata
    const session = await auth.getSession();
    setUser(session?.user || null);
  };

  if (loading) {
    return (
      <div className="tpv-studio">
        <div className="tpv-studio__container">
          <div className="tpv-studio__empty">
            <div className="tpv-studio__spinner" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Landing page for unauthenticated users
  if (!user) {
    return <LandingPage />;
  }

  // Password setup for invited users
  if (needsPasswordSetup) {
    return <SetPassword user={user} onPasswordSet={handlePasswordSet} />;
  }

  // If showing admin panel, render it fullscreen
  if (showAdmin) {
    return (
      <div className="tpv-studio">
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      </div>
    );
  }

  // Main TPV Designer
  return (
    <ErrorBoundary>
      <div className="tpv-studio">
        <Header
          onShowDesigns={() => setShowGallery(true)}
          onShowAdmin={() => setShowAdmin(true)}
          isAdmin={isAdmin}
          currentDesignName={designName}
        />

        <main className="tpv-studio__container tpv-studio__container--full">
          <TPVDesigner loadedDesign={loadedDesign} />
        </main>

        {showGallery && (
          <DesignGallery
            onClose={() => setShowGallery(false)}
            onLoadDesign={handleLoadDesign}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
