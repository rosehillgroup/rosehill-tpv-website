/**
 * TPV Studio Landing Page
 * Marketing page showcasing AI-powered playground surface design
 */

import { useState, useEffect } from 'react';
import { auth } from '../lib/api/auth.js';

// TPV Colour palette for visual showcase (corrected from mixer.html)
const TPV_COLORS = [
  { code: 'RH30', name: 'Beige', hex: '#E4C4AA' },
  { code: 'RH31', name: 'Cream', hex: '#E8E3D8' },
  { code: 'RH41', name: 'Bright Yellow', hex: '#FFD833' },
  { code: 'RH40', name: 'Mustard', hex: '#E5A144' },
  { code: 'RH50', name: 'Orange', hex: '#F15B32' },
  { code: 'RH01', name: 'Standard Red', hex: '#A5362F' },
  { code: 'RH02', name: 'Bright Red', hex: '#E21F2F' },
  { code: 'RH90', name: 'Funky Pink', hex: '#E8457E' },
  { code: 'RH21', name: 'Purple', hex: '#493D8C' },
  { code: 'RH20', name: 'Standard Blue', hex: '#0075BC' },
  { code: 'RH22', name: 'Light Blue', hex: '#47AFE3' },
  { code: 'RH23', name: 'Azure', hex: '#039DC4' },
  { code: 'RH26', name: 'Turquoise', hex: '#00A6A3' },
  { code: 'RH12', name: 'Dark Green', hex: '#006C55' },
  { code: 'RH10', name: 'Standard Green', hex: '#609B63' },
  { code: 'RH11', name: 'Bright Green', hex: '#3BB44A' },
  { code: 'RH32', name: 'Brown', hex: '#8B5F3C' },
  { code: 'RH65', name: 'Pale Grey', hex: '#D9D9D6' },
  { code: 'RH61', name: 'Light Grey', hex: '#939598' },
  { code: 'RH60', name: 'Dark Grey', hex: '#59595B' },
  { code: 'RH70', name: 'Black', hex: '#231F20' }
];

// Example prompts to cycle through in hero animation
const EXAMPLE_PROMPTS = [
  "ocean theme with dolphins and waves",
  "jungle adventure with parrots",
  "solar system with planets",
  "garden with butterflies and flowers",
  "racing track with cars",
  "underwater coral reef scene",
  "dinosaur footprints trail",
  "rainbow with clouds"
];

// Pre-generate granule positions to avoid re-rendering on state change
const GRANULE_DATA = [...Array(60)].map((i) => ({
  delay: `${Math.random() * 3}s`,
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  size: `${8 + Math.random() * 12}px`
}));

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);

  // Cycle through example prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % EXAMPLE_PROMPTS.length);
    }, 5000); // Change every 5 seconds (matches animation duration)
    return () => clearInterval(interval);
  }, []);

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

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-text">TPV</span>
          <span className="logo-accent">Studio</span>
        </div>
        <div className="nav-links">
          <button onClick={() => scrollToSection('features')}>Features</button>
          <button onClick={() => scrollToSection('palette')}>Colours</button>
          <button onClick={() => setShowSignIn(true)} className="nav-cta">Sign In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="granule-field">
            {GRANULE_DATA.map((granule, i) => (
              <div
                key={i}
                className="granule"
                style={{
                  '--delay': granule.delay,
                  '--x': granule.x,
                  '--y': granule.y,
                  '--color': TPV_COLORS[i % TPV_COLORS.length].hex,
                  '--size': granule.size
                }}
              />
            ))}
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">TPV Surface Design Platform</div>
          <h1>
            <span className="hero-line-1">Design Any</span>
            <span className="hero-line-2">TPV Surface</span>
          </h1>
          <p className="hero-subtitle">
            From AI-powered playgrounds to professional sports facilities —
            get production-ready TPV specifications in minutes.
          </p>
          <div className="hero-ctas">
            <button onClick={() => setShowSignIn(true)} className="cta-primary">
              Start Designing
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="cta-secondary">
              See How It Works
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="mockup-container">
            <div className="mockup-screen">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div className="mockup-content">
                <div className="mockup-input">
                  <span key={promptIndex} className="typing-text">{EXAMPLE_PROMPTS[promptIndex]}</span>
                </div>
                <div className="mockup-preview">
                  <div className="preview-shape shape-1"></div>
                  <div className="preview-shape shape-2"></div>
                  <div className="preview-shape shape-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Designer */}
      <section className="choose-designer">
        <div className="section-header">
          <span className="section-tag">Two Powerful Tools</span>
          <h2>Choose Your Designer</h2>
        </div>

        <div className="designer-cards">
          <div className="designer-card playground-card">
            <div className="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
              </svg>
            </div>
            <div className="card-badge">AI-Powered</div>
            <h3>Playground Designer</h3>
            <p className="card-tagline">Creative Design with AI</p>
            <p className="card-description">
              Describe your vision in words or upload an image. Our AI generates
              production-ready vector designs with automatic TPV colour matching.
            </p>
            <ul className="card-features">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Text-to-vector AI generation
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Image & SVG upload
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Automatic colour matching
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Click-to-edit regions
              </li>
            </ul>
            <div className="card-visual playground-visual">
              <div className="visual-shape v-shape-1"></div>
              <div className="visual-shape v-shape-2"></div>
              <div className="visual-shape v-shape-3"></div>
            </div>
          </div>

          <div className="designer-card sports-card">
            <div className="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div className="card-badge sports-badge">Precision Tools</div>
            <h3>Sports Designer</h3>
            <p className="card-tagline">Professional Sports Surfaces</p>
            <p className="card-description">
              Build multi-sport facilities with precision. Drag-and-drop courts,
              running tracks, and custom layouts on any surface size.
            </p>
            <ul className="card-features">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                15+ court templates
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Running track builder
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Multi-sport layouts
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Layer management
              </li>
            </ul>
            <div className="card-visual sports-visual">
              <div className="court-outline">
                <div className="court-line court-line-h"></div>
                <div className="court-line court-line-v"></div>
                <div className="court-circle"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <span className="section-tag">Process</span>
          <h2>Three Steps to Production-Ready Designs</h2>
        </div>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">01</div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <h3>Configure Your Canvas</h3>
            <p>Set your surface dimensions and choose your approach — AI generation, image upload, or template-based design.</p>
          </div>

          <div className="step-connector">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 10 Q50 10 100 10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
            </svg>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="13.5" cy="6.5" r="2.5"/>
                <circle cx="6.5" cy="12.5" r="2.5"/>
                <circle cx="17.5" cy="17.5" r="2.5"/>
                <path d="M13.5 9v3M9 12.5h3M15 17.5h-3"/>
              </svg>
            </div>
            <h3>Design & Customise</h3>
            <p>Refine colours, adjust regions, add elements. Real-time preview shows your exact TPV granule appearance.</p>
          </div>

          <div className="step-connector">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 10 Q50 10 100 10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
            </svg>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/>
              </svg>
            </div>
            <h3>Export Production Specs</h3>
            <p>Download PDF specifications with granule recipes, blend ratios, and installation-ready tile layouts.</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features">
        <div className="section-header">
          <span className="section-tag">Capabilities</span>
          <h2>Everything You Need to Design TPV Surfaces</h2>
        </div>

        {/* Playground Features */}
        <div className="features-grid">
          <div className="feature-card feature-highlight">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
              </svg>
            </div>
            <h3>AI Text-to-Vector</h3>
            <p>Describe any concept in natural language. Our AI transforms your words into production-ready vector designs optimised for TPV surfaces.</p>
            <div className="feature-example">
              "vibrant underwater scene with coral reef"
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
            <h3>Image Vectorisation</h3>
            <p>Upload any PNG or JPG image and convert it to clean SVG vectors optimised for TPV production.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="13.5" cy="6.5" r="2.5"/>
                <circle cx="17.5" cy="10.5" r="2.5"/>
                <circle cx="8.5" cy="7.5" r="2.5"/>
                <circle cx="6.5" cy="12.5" r="2.5"/>
              </svg>
            </div>
            <h3>Auto Colour Matching</h3>
            <p>Automatic extraction and matching to the 21-colour TPV palette with optimal blend recipes.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <h3>Region Editor</h3>
            <p>Click any colour region to customise. Real-time preview updates as you design.</p>
          </div>
        </div>

        {/* Sports Features */}
        <div className="sports-features-header">
          <span className="section-tag sports-tag">Sports Surface Tools</span>
        </div>

        <div className="features-grid sports-features-grid">
          <div className="feature-card sports-feature">
            <div className="feature-icon sports-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <circle cx="12" cy="12" r="3"/>
                <path d="M2 12h4M18 12h4"/>
              </svg>
            </div>
            <h3>Court Library</h3>
            <p>15+ professional court templates including basketball, tennis, netball, futsal, and more.</p>
          </div>

          <div className="feature-card sports-feature">
            <div className="feature-icon sports-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <ellipse cx="12" cy="12" rx="10" ry="8"/>
                <ellipse cx="12" cy="12" rx="6" ry="4"/>
                <path d="M12 4v2M12 18v2"/>
              </svg>
            </div>
            <h3>Track Builder</h3>
            <p>Create running tracks with configurable lanes, staggered starts, and regulation dimensions.</p>
          </div>

          <div className="feature-card sports-feature">
            <div className="feature-icon sports-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
              </svg>
            </div>
            <h3>Multi-Sport Layouts</h3>
            <p>Combine multiple courts and tracks on a single surface with automatic alignment.</p>
          </div>

          <div className="feature-card sports-feature">
            <div className="feature-icon sports-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
            <h3>Layer Management</h3>
            <p>Drag, rotate, and layer courts with precision controls and snap-to-grid alignment.</p>
          </div>
        </div>

        {/* Shared Features */}
        <div className="sports-features-header">
          <span className="section-tag">Shared Tools</span>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3v18M3 12h18"/>
                <circle cx="12" cy="12" r="9"/>
              </svg>
            </div>
            <h3>Solid & Blend Modes</h3>
            <p>Choose between single-colour purity or multi-granule blends for precise colour accuracy.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/>
              </svg>
            </div>
            <h3>PDF Specifications</h3>
            <p>Export professional specification sheets with design preview, dimensions, and all recipes.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <h3>In-Situ Preview</h3>
            <p>Upload a site photo and see your design in context with realistic perspective adjustments.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
              </svg>
            </div>
            <h3>Installation Tiles</h3>
            <p>Download your design as 1m×1m tiles in a ZIP file. Named A1, B2... for easy on-site layout.</p>
          </div>
        </div>
      </section>

      {/* Colour Palette Showcase */}
      <section id="palette" className="palette-section">
        <div className="section-header light">
          <span className="section-tag">Palette</span>
          <h2>21 Standard TPV Colours</h2>
          <p className="section-subtitle">The complete Rosehill TPV granule palette at your fingertips</p>
        </div>

        <div className="palette-grid">
          {TPV_COLORS.map((color, idx) => (
            <div
              key={color.code}
              className="palette-swatch"
              style={{ '--swatch-color': color.hex, '--delay': `${idx * 0.03}s` }}
            >
              <div className="swatch-color"></div>
              <div className="swatch-info">
                <span className="swatch-name">{color.name}</span>
                <span className="swatch-code">{color.code}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits">
        <div className="benefits-grid benefits-grid-4">
          <div className="benefit">
            <div className="benefit-metric">10x</div>
            <div className="benefit-label">Faster Design</div>
            <p>What took hours now takes minutes with AI and templates.</p>
          </div>
          <div className="benefit">
            <div className="benefit-metric">100%</div>
            <div className="benefit-label">Production Accurate</div>
            <p>Exact TPV granule specs with precise ratio specifications.</p>
          </div>
          <div className="benefit">
            <div className="benefit-metric">15+</div>
            <div className="benefit-label">Court Templates</div>
            <p>Professional sports court and track templates ready to use.</p>
          </div>
          <div className="benefit">
            <div className="benefit-metric">21</div>
            <div className="benefit-label">Standard Colours</div>
            <p>Complete Rosehill TPV palette with blend combinations.</p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="cta-footer">
        <div className="cta-content">
          <h2>Ready to Design Your Surface?</h2>
          <p>Create playgrounds or sports facilities with production-ready TPV specifications.</p>
          <button onClick={() => setShowSignIn(true)} className="cta-primary large">
            Sign In to TPV Studio
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <p className="cta-note">
            Need an account? Contact <a href="mailto:info@rosehill.group">info@rosehill.group</a>
          </p>
        </div>
      </section>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="modal-overlay" onClick={() => setShowSignIn(false)}>
          <div className="sign-in-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSignIn(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            <div className="modal-header">
              <h2>Sign In</h2>
              <p>Access your TPV Studio account</p>
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="modal-footer-text">
              Don't have an account? Contact your administrator.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        /* ============================================
           TPV STUDIO LANDING PAGE
           Aesthetic: Sophisticated Industrial-Creative
           ============================================ */

        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .landing-page {
          --primary: #1e4a7a;
          --primary-light: #2a5a8e;
          --accent: #ff6b35;
          --accent-hover: #e55a2a;
          --text: #1a202c;
          --text-secondary: #64748b;
          --text-light: #94a3b8;
          --bg: #fafbfc;
          --bg-dark: #0f172a;
          --card: #ffffff;
          --border: #e2e8f0;

          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          overflow-x: hidden;
        }

        /* Navigation */
        .landing-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 3rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }

        .nav-logo {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .logo-text {
          color: var(--primary);
        }

        .logo-accent {
          color: var(--accent);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-links button {
          background: none;
          border: none;
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: color 0.2s;
        }

        .nav-links button:hover {
          color: var(--text);
        }

        .nav-cta {
          background: var(--primary) !important;
          color: white !important;
          padding: 0.5rem 1.25rem !important;
          border-radius: 6px !important;
        }

        .nav-cta:hover {
          background: var(--primary-light) !important;
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 8rem 4rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .granule-field {
          position: absolute;
          inset: 0;
        }

        .granule {
          position: absolute;
          left: var(--x);
          top: var(--y);
          width: var(--size);
          height: var(--size);
          background: var(--color);
          border-radius: 50%;
          opacity: 0.15;
          animation: float 8s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }

        .hero-content {
          position: relative;
          z-index: 10;
        }

        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(30, 74, 122, 0.1);
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-radius: 50px;
          margin-bottom: 1.5rem;
        }

        .hero h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.1;
          margin: 0 0 1.5rem;
        }

        .hero-line-1 {
          display: block;
          color: var(--text-secondary);
        }

        .hero-line-2 {
          display: block;
          color: var(--primary);
        }

        .hero-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 480px;
          margin-bottom: 2rem;
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cta-primary:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
        }

        .cta-primary.large {
          padding: 1rem 2rem;
          font-size: 1rem;
        }

        .cta-secondary {
          padding: 0.875rem 1.5rem;
          background: white;
          color: var(--text);
          border: 2px solid var(--border);
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cta-secondary:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        /* Hero Visual / Mockup */
        .hero-visual {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: center;
        }

        .mockup-container {
          perspective: 1000px;
        }

        .mockup-screen {
          width: 400px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          transform: rotateY(-5deg) rotateX(2deg);
          animation: mockupFloat 6s ease-in-out infinite;
        }

        @keyframes mockupFloat {
          0%, 100% { transform: rotateY(-5deg) rotateX(2deg) translateY(0); }
          50% { transform: rotateY(-5deg) rotateX(2deg) translateY(-10px); }
        }

        .mockup-header {
          padding: 0.75rem 1rem;
          background: #f8f8f8;
          border-bottom: 1px solid #eee;
        }

        .mockup-dots {
          display: flex;
          gap: 6px;
        }

        .mockup-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ddd;
        }

        .mockup-dots span:nth-child(1) { background: #ff5f56; }
        .mockup-dots span:nth-child(2) { background: #ffbd2e; }
        .mockup-dots span:nth-child(3) { background: #27ca41; }

        .mockup-content {
          padding: 1.5rem;
        }

        .mockup-input {
          background: #f5f5f5;
          padding: 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
        }

        .typing-text {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid var(--primary);
          animation: typing 5s steps(40, end) forwards, blink 0.7s step-end infinite;
        }

        @keyframes typing {
          0% { max-width: 0; }
          35% { max-width: 500px; }
          65% { max-width: 500px; }
          100% { max-width: 0; }
        }

        @keyframes blink {
          50% { border-color: transparent; }
        }

        .mockup-preview {
          height: 180px;
          background: linear-gradient(135deg, #e8f4f8, #f0f4ff);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }

        .preview-shape {
          position: absolute;
          border-radius: 50%;
          animation: shapeReveal 4s ease-out infinite;
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          background: var(--accent);
          opacity: 0.8;
          top: 20%;
          left: 15%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 60px;
          height: 60px;
          background: #30D5C8;
          opacity: 0.8;
          top: 40%;
          left: 50%;
          animation-delay: 0.3s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          background: var(--primary);
          opacity: 0.8;
          top: 50%;
          right: 10%;
          animation-delay: 0.6s;
        }

        @keyframes shapeReveal {
          0%, 100% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1); opacity: 0.8; }
        }

        /* Section Headers */
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header.light h2,
        .section-header.light .section-subtitle {
          color: white;
        }

        .section-header.light .section-tag {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
        }

        .section-tag {
          display: inline-block;
          padding: 0.375rem 0.875rem;
          background: rgba(30, 74, 122, 0.1);
          color: var(--primary);
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          border-radius: 50px;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
        }

        .section-subtitle {
          margin-top: 1rem;
          font-size: 1.125rem;
          color: var(--text-secondary);
        }

        /* How It Works */
        .how-it-works {
          padding: 6rem 4rem;
          background: white;
        }

        .steps-container {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 1rem;
        }

        .step {
          flex: 1;
          max-width: 280px;
          text-align: center;
          padding: 2rem 1.5rem;
        }

        .step-number {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 3rem;
          font-weight: 700;
          color: rgba(30, 74, 122, 0.1);
          margin-bottom: 1rem;
        }

        .step-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 107, 53, 0.1);
          border-radius: 16px;
          color: var(--accent);
        }

        .step h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.75rem;
          color: var(--text);
        }

        .step p {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .step-connector {
          width: 100px;
          padding-top: 5rem;
          color: var(--border);
        }

        /* Features */
        .features {
          padding: 6rem 4rem;
          background: var(--bg);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          transition: all 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
        }

        .feature-highlight {
          grid-column: span 2;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
        }

        .feature-highlight .feature-icon {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .feature-highlight h3 {
          color: white;
        }

        .feature-highlight p {
          color: rgba(255, 255, 255, 0.9);
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(30, 74, 122, 0.1);
          border-radius: 12px;
          color: var(--primary);
          margin-bottom: 1.25rem;
        }

        .feature-card h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
        }

        .feature-card p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .feature-example {
          margin-top: 1.5rem;
          padding: 0.875rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 0.8125rem;
          font-style: italic;
          opacity: 0.9;
        }

        /* Choose Your Designer Section */
        .choose-designer {
          padding: 6rem 4rem;
          background: white;
        }

        .designer-cards {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .designer-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          border: 2px solid var(--border);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .designer-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        }

        .playground-card:hover {
          border-color: var(--accent);
        }

        .sports-card:hover {
          border-color: #00a6a3;
        }

        .card-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 107, 53, 0.1);
          border-radius: 12px;
          color: var(--accent);
          margin-bottom: 1.25rem;
        }

        .sports-card .card-icon {
          background: rgba(0, 166, 163, 0.1);
          color: #00a6a3;
        }

        .card-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: rgba(255, 107, 53, 0.1);
          color: var(--accent);
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-radius: 50px;
          margin-bottom: 0.75rem;
        }

        .sports-badge {
          background: rgba(0, 166, 163, 0.1);
          color: #00a6a3;
        }

        .designer-card h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 0.25rem;
        }

        .card-tagline {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin: 0 0 1rem;
        }

        .card-description {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0 0 1.5rem;
        }

        .card-features {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem;
        }

        .card-features li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text);
          padding: 0.375rem 0;
        }

        .card-features li svg {
          color: var(--accent);
          flex-shrink: 0;
        }

        .sports-card .card-features li svg {
          color: #00a6a3;
        }

        .card-visual {
          height: 120px;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }

        .playground-visual {
          background: linear-gradient(135deg, #fef3ef, #fff5f0);
        }

        .sports-visual {
          background: linear-gradient(135deg, #e6f7f7, #f0fafa);
        }

        .visual-shape {
          position: absolute;
          border-radius: 50%;
          animation: floatShape 4s ease-in-out infinite;
        }

        .v-shape-1 {
          width: 50px;
          height: 50px;
          background: var(--accent);
          opacity: 0.7;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .v-shape-2 {
          width: 35px;
          height: 35px;
          background: #30D5C8;
          opacity: 0.7;
          top: 50%;
          left: 40%;
          animation-delay: 0.3s;
        }

        .v-shape-3 {
          width: 60px;
          height: 60px;
          background: var(--primary);
          opacity: 0.7;
          top: 30%;
          right: 15%;
          animation-delay: 0.6s;
        }

        @keyframes floatShape {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }

        .court-outline {
          position: absolute;
          inset: 15%;
          border: 2px solid #00a6a3;
          border-radius: 4px;
          opacity: 0.6;
        }

        .court-line {
          position: absolute;
          background: #00a6a3;
        }

        .court-line-h {
          width: 100%;
          height: 2px;
          top: 50%;
          left: 0;
        }

        .court-line-v {
          width: 2px;
          height: 100%;
          left: 50%;
          top: 0;
        }

        .court-circle {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 2px solid #00a6a3;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Sports Features Styling */
        .sports-features-header {
          text-align: center;
          margin: 3rem 0 2rem;
        }

        .sports-tag {
          background: rgba(0, 166, 163, 0.1);
          color: #00a6a3;
        }

        .sports-features-grid {
          grid-template-columns: repeat(4, 1fr);
        }

        .sports-feature {
          border-color: rgba(0, 166, 163, 0.2);
        }

        .sports-feature:hover {
          border-color: #00a6a3;
        }

        .sports-icon {
          background: rgba(0, 166, 163, 0.1);
          color: #00a6a3;
        }

        /* Benefits Grid 4 columns */
        .benefits-grid-4 {
          grid-template-columns: repeat(4, 1fr);
        }

        /* Palette Section */
        .palette-section {
          padding: 6rem 4rem;
          background: var(--bg-dark);
        }

        .palette-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .palette-swatch {
          animation: swatchReveal 0.5s ease-out forwards;
          animation-delay: var(--delay);
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes swatchReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .swatch-color {
          aspect-ratio: 1;
          background: var(--swatch-color);
          border-radius: 8px;
          margin-bottom: 0.5rem;
          transition: transform 0.2s;
        }

        .palette-swatch:hover .swatch-color {
          transform: scale(1.1);
        }

        .swatch-info {
          text-align: center;
        }

        .swatch-name {
          display: block;
          font-size: 0.6875rem;
          font-weight: 500;
          color: white;
        }

        .swatch-code {
          display: block;
          font-size: 0.625rem;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Benefits */
        .benefits {
          padding: 6rem 4rem;
          background: white;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }

        .benefit-metric {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 4rem;
          font-weight: 700;
          color: var(--accent);
          line-height: 1;
        }

        .benefit-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text);
          margin: 0.5rem 0 1rem;
        }

        .benefit p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* CTA Footer */
        .cta-footer {
          padding: 6rem 4rem;
          background: var(--bg);
          text-align: center;
        }

        .cta-content h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 1rem;
        }

        .cta-content > p {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .cta-note {
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: var(--text-light);
        }

        .cta-note a {
          color: var(--primary);
          text-decoration: none;
        }

        .cta-note a:hover {
          text-decoration: underline;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 2rem;
        }

        .sign-in-modal {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
          position: relative;
          animation: modalSlide 0.3s ease-out;
        }

        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: var(--bg);
          color: var(--text);
        }

        .modal-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
        }

        .modal-header p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .form-error {
          padding: 0.75rem 1rem;
          background: #fef2f2;
          color: #dc2626;
          border-radius: 8px;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.9375rem;
          transition: all 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(30, 74, 122, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 0.875rem;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--accent-hover);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modal-footer-text {
          text-align: center;
          font-size: 0.8125rem;
          color: var(--text-light);
          margin: 1.5rem 0 0;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-content {
            max-width: 600px;
            margin: 0 auto;
          }

          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }

          .hero-ctas {
            justify-content: center;
          }

          .hero-visual {
            display: none;
          }

          .designer-cards {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sports-features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .feature-highlight {
            grid-column: span 2;
          }

          .benefits-grid-4 {
            grid-template-columns: repeat(2, 1fr);
          }

          .palette-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        @media (max-width: 768px) {
          .landing-nav {
            padding: 1rem 1.5rem;
          }

          .nav-links {
            gap: 1rem;
          }

          .hero {
            padding: 6rem 1.5rem 3rem;
          }

          .hero h1 {
            font-size: 2.5rem;
          }

          .steps-container {
            flex-direction: column;
            gap: 0;
          }

          .step-connector {
            display: none;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .feature-highlight {
            grid-column: span 1;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .how-it-works,
          .features,
          .palette-section,
          .benefits,
          .cta-footer,
          .choose-designer {
            padding: 4rem 1.5rem;
          }

          .sports-features-grid {
            grid-template-columns: 1fr;
          }

          .benefits-grid,
          .benefits-grid-4 {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .palette-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 480px) {
          .nav-links button:not(.nav-cta) {
            display: none;
          }

          .hero h1 {
            font-size: 2rem;
          }

          .cta-content h2 {
            font-size: 1.75rem;
          }

          .palette-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
