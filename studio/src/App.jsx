import React, { useState, useEffect } from 'react';
import { auth } from './lib/api/auth.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import InspirePanelRecraft from './components/InspirePanelRecraft.jsx';
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
  const [loadedDesign, setLoadedDesign] = useState(null);
  const [currentDesignName, setCurrentDesignName] = useState(null);
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);

  // Check if user has admin role
  const checkAdminStatus = async () => {
    try {
      const session = await auth.getSession();
      console.log('[APP] Session object:', session);
      console.log('[APP] Access token:', session?.access_token);

      if (!session?.access_token) {
        console.warn('[APP] No access token found in session');
        setIsAdmin(false);
        return;
      }

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      console.log('[APP] Admin check response:', response.status, response.ok);

      // If we can access admin endpoint, user is admin
      setIsAdmin(response.ok);
    } catch (error) {
      console.error('[APP] Admin check failed:', error);
      setIsAdmin(false);
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
    console.log('[APP] Loading design:', design);
    console.log('[APP] Design original_svg_url:', design.original_svg_url);
    console.log('[APP] Design ID:', design.id);
    setLoadedDesign(design);
    setCurrentDesignName(design.name);
    console.log('[INSPIRE] Loaded design:', design.name);
  };

  const handleDesignSaved = (designName) => {
    setCurrentDesignName(designName);
  };

  const handlePasswordSet = async () => {
    console.log('[APP] Password set successfully');
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

  return (
    <ErrorBoundary>
      <div className="tpv-studio">
        <Header
          onShowDesigns={() => setShowGallery(true)}
          onShowAdmin={() => setShowAdmin(true)}
          isAdmin={isAdmin}
          currentDesignName={currentDesignName}
        />

        <main className="tpv-studio__container">
          <InspirePanelRecraft
            loadedDesign={loadedDesign}
            onDesignSaved={handleDesignSaved}
          />
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
