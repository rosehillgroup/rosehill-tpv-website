import React, { useState, useEffect } from 'react';
import { auth } from './lib/api/auth.js';
import { loadDesign } from './lib/api/designs.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import InspirePanelRecraft from './components/InspirePanelRecraft.jsx';
import SportsSurfaceDesigner from './components/SportsSurfaceDesigner/SportsSurfaceDesigner.jsx';
import ToolSelection from './components/ToolSelection.jsx';
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
  const [activeTool, setActiveTool] = useState(null); // null, 'playground', 'sports'

  // Per-mode design state - each mode remembers its loaded design
  const [playgroundDesign, setPlaygroundDesign] = useState(null);
  const [sportsDesign, setSportsDesign] = useState(null);
  const [playgroundDesignName, setPlaygroundDesignName] = useState(null);
  const [sportsDesignName, setSportsDesignName] = useState(null);

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
      const { design } = await loadDesign(designId);
      if (design) {
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
    // Detect design type and auto-switch to correct mode
    const isSportsDesign = design.design_data?.type === 'sports_surface';

    if (isSportsDesign) {
      setSportsDesign(design);
      setSportsDesignName(design.name);
      setActiveTool('sports');
    } else {
      setPlaygroundDesign(design);
      setPlaygroundDesignName(design.name);
      setActiveTool('playground');
    }
  };

  const handleDesignSaved = (designName) => {
    // Update the design name for the active mode
    if (activeTool === 'sports') {
      setSportsDesignName(designName);
    } else {
      setPlaygroundDesignName(designName);
    }
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

  // Tool selection - show if no tool is active
  if (!activeTool) {
    return (
      <div className="tpv-studio">
        <ToolSelection onSelectTool={setActiveTool} />
      </div>
    );
  }

  // Sports Surface Designer
  if (activeTool === 'sports') {
    return (
      <ErrorBoundary>
        <div className="tpv-studio">
          <Header
            onShowDesigns={() => setShowGallery(true)}
            onShowAdmin={() => setShowAdmin(true)}
            isAdmin={isAdmin}
            currentDesignName={sportsDesignName}
            activeTool={activeTool}
            onSwitchTool={setActiveTool}
          />

          <main className="tpv-studio__container tpv-studio__container--full">
            <SportsSurfaceDesigner loadedDesign={sportsDesign} />
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

  // Playground Designer (default)
  return (
    <ErrorBoundary>
      <div className="tpv-studio">
        <Header
          onShowDesigns={() => setShowGallery(true)}
          onShowAdmin={() => setShowAdmin(true)}
          isAdmin={isAdmin}
          currentDesignName={playgroundDesignName}
          activeTool={activeTool}
          onSwitchTool={setActiveTool}
        />

        <main className="tpv-studio__container">
          <InspirePanelRecraft
            loadedDesign={playgroundDesign}
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
