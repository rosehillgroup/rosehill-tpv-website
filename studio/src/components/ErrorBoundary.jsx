// TPV Studio - Error Boundary Component
// Catches React component errors to prevent full app crashes

import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h1>Something went wrong</h1>
            <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>

            <div className="error-actions">
              <button onClick={this.handleReset} className="btn-primary">
                Try Again
              </button>
              <button onClick={() => window.location.reload()} className="btn-secondary">
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>

          <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
              background: #f9fafb;
            }

            .error-content {
              max-width: 500px;
              text-align: center;
              background: white;
              padding: 3rem;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }

            h1 {
              color: #1e4a7a;
              margin: 0 0 1rem 0;
              font-size: 1.75rem;
            }

            p {
              color: #6b7280;
              margin: 0 0 2rem 0;
              line-height: 1.6;
            }

            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
            }

            .btn-primary,
            .btn-secondary {
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
              border: none;
            }

            .btn-primary {
              background: #ff6b35;
              color: white;
            }

            .btn-primary:hover {
              background: #e55a2b;
              transform: translateY(-1px);
            }

            .btn-secondary {
              background: white;
              color: #374151;
              border: 1px solid #d1d5db;
            }

            .btn-secondary:hover {
              background: #f9fafb;
            }

            .error-details {
              margin-top: 2rem;
              text-align: left;
              font-size: 0.875rem;
            }

            .error-details summary {
              cursor: pointer;
              color: #6b7280;
              margin-bottom: 0.5rem;
            }

            .error-details pre {
              background: #f3f4f6;
              padding: 1rem;
              border-radius: 4px;
              overflow-x: auto;
              font-size: 0.75rem;
              color: #dc2626;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
