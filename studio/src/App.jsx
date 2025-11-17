import React, { useState, useEffect } from 'react';
import { auth } from './lib/api/auth.js';
import InspirePanelRecraft from './components/InspirePanelRecraft.jsx';
import Header from './components/Header.jsx';
import DesignGallery from './components/DesignGallery.jsx';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await auth.signIn(email, password);
    } catch (err) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tpv-studio">
      <div className="tpv-studio__header">
        <h1>TPV Studio</h1>
        <p>AI-powered vector designs for playground surfaces</p>
      </div>
      <div className="tpv-studio__container">
        <div className="tpv-studio__card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
          <h2 style={{ marginBottom: '1rem' }}>Sign In</h2>
          <p style={{ marginBottom: '1.5rem', color: '#718096' }}>
            Please sign in with your @rosehill.group account
          </p>

          {error && (
            <div style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              backgroundColor: '#FEE',
              color: '#C00',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@rosehill.group"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#718096', textAlign: 'center' }}>
            Don't have an account? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [loadedDesign, setLoadedDesign] = useState(null);
  const [currentDesignName, setCurrentDesignName] = useState(null);

  useEffect(() => {
    // Check auth status on mount
    auth.getSession().then(session => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: subscription } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
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

  // Sign-in screen
  if (!user) {
    return <SignInForm />;
  }

  return (
    <div className="tpv-studio">
      <Header
        onShowDesigns={() => setShowGallery(true)}
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
  );
}

export default App;
