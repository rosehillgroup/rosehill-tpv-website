import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/studio.css';

// Component CSS imports - ensure these are bundled
import './components/Header.css';
import './components/SaveDesignModal.css';
import './components/DesignGallery.css';
import './components/DesignCard.css';
import './components/ToolSelection.css';
import './components/SportsSurfaceDesigner/SportsSurfaceDesigner.css';
import './components/SportsSurfaceDesigner/CourtCanvas.css';
import './components/SportsSurfaceDesigner/CourtLibrary.css';
import './components/SportsSurfaceDesigner/PropertiesPanel.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
