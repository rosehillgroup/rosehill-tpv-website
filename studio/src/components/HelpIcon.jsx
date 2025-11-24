/**
 * HelpIcon Component
 * Reusable help icon with tooltip for contextual guidance
 */

import { useState } from 'react';

export default function HelpIcon({ content, position = 'top' }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="help-icon-container">
      <button
        className="help-icon"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
        type="button"
        aria-label="Help"
      >
        ?
      </button>

      {showTooltip && (
        <div className={`help-tooltip help-tooltip-${position}`}>
          {content}
        </div>
      )}

      <style>{`
        .help-icon-container {
          position: relative;
          display: inline-block;
        }

        .help-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #6b7280;
          color: white;
          border: none;
          font-size: 12px;
          font-weight: 600;
          cursor: help;
          transition: all 0.2s;
          padding: 0;
          line-height: 1;
        }

        .help-icon:hover {
          background: #374151;
          transform: scale(1.1);
        }

        .help-tooltip {
          position: absolute;
          z-index: 1000;
          background: #1f2937;
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          line-height: 1.5;
          max-width: 300px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          pointer-events: none;
          white-space: normal;
        }

        .help-tooltip-top {
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        }

        .help-tooltip-top::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: #1f2937;
        }

        .help-tooltip-bottom {
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        }

        .help-tooltip-bottom::after {
          content: '';
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-bottom-color: #1f2937;
        }

        .help-tooltip-right {
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        }

        .help-tooltip-right::after {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-right-color: #1f2937;
        }

        .help-tooltip-left {
          right: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        }

        .help-tooltip-left::after {
          content: '';
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: #1f2937;
        }

        @media (max-width: 768px) {
          .help-tooltip {
            max-width: 250px;
            font-size: 0.8125rem;
            padding: 0.625rem 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}
