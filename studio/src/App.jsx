import React, { useState, useEffect } from 'react';
import { auth } from './lib/api/auth.js';
import PromptPanel from './components/PromptPanel.jsx';
import VariantGallery from './components/VariantGallery.jsx';
import ExportPanel from './components/ExportPanel.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

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

  const handleVariantsGenerated = (newVariants) => {
    setVariants(newVariants);
    setSelectedVariant(null);
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
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

  // Simplified auth for now - can add login screen later
  if (!user) {
    return (
      <div className="tpv-studio">
        <div className="tpv-studio__header">
          <h1>TPV Studio</h1>
          <p>Please sign in with your @rosehill.group account</p>
        </div>
        <div className="tpv-studio__container">
          <div className="tpv-studio__card">
            <p>Authentication required. Contact your administrator for access.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tpv-studio">
      <header className="tpv-studio__header">
        <h1>TPV Studio</h1>
        <p>AI-powered playground surface design tool</p>
      </header>

      <main className="tpv-studio__container">
        <PromptPanel onVariantsGenerated={handleVariantsGenerated} />

        {variants.length > 0 && (
          <>
            <VariantGallery
              variants={variants}
              selectedVariant={selectedVariant}
              onSelectVariant={handleVariantSelect}
            />

            {selectedVariant && (
              <ExportPanel variant={selectedVariant} />
            )}
          </>
        )}

        {variants.length === 0 && (
          <div className="tpv-studio__empty">
            <h3>Get started by describing your design above</h3>
            <p>Enter a theme, select colors, and let AI create installer-ready playground surface designs.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
