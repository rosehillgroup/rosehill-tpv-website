// TPV Studio - Tool Selection Page
import React from 'react';
import './ToolSelection.css';

function ToolSelection({ onSelectTool }) {
  return (
    <div className="tool-selection">
      <div className="tool-selection__container">
        <header className="tool-selection__header">
          <h1>Welcome to TPV Studio</h1>
          <p>Choose a design tool to get started</p>
        </header>

        <div className="tool-selection__tools">
          {/* Playground Designer */}
          <div className="tool-selection__card" onClick={() => onSelectTool('playground')}>
            <div className="tool-selection__icon">🎨</div>
            <h2>Playground Designer</h2>
            <p>AI-powered playground surface design with custom patterns and colours</p>
            <ul className="tool-selection__features">
              <li>Generate designs from text prompts</li>
              <li>Upload and vectorise your own artwork</li>
              <li>21 TPV colours with blend options</li>
              <li>Material quantity calculations</li>
              <li>Professional PDF specifications</li>
            </ul>
            <button className="tool-selection__btn tool-selection__btn--primary">
              Open Playground Designer
            </button>
          </div>

          {/* Sports Designer */}
          <div className="tool-selection__card" onClick={() => onSelectTool('sports')}>
            <div className="tool-selection__icon">⚽</div>
            <h2>Sports Surface Designer</h2>
            <p>Professional MUGA and sports court layout with precise markings</p>
            <ul className="tool-selection__features">
              <li>Standard court templates (Basketball, Netball, Tennis, Futsal)</li>
              <li>Multi-court layouts with positioning</li>
              <li>Customisable line colours and zones</li>
              <li>Official dimensions from governing bodies</li>
              <li>Material specifications and line marking plans</li>
            </ul>
            <button className="tool-selection__btn tool-selection__btn--secondary">
              Open Sports Designer
            </button>
          </div>
        </div>

        <footer className="tool-selection__footer">
          <p>Need help deciding? <a href="mailto:support@rosehill.group">Contact our team</a></p>
        </footer>
      </div>
    </div>
  );
}

export default ToolSelection;
