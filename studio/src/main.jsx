import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/studio.css';

// Component CSS imports - ensure these are bundled
import './components/Header.css';
import './components/SaveDesignModal.css';
import './components/DesignGallery.css';
import './components/DesignCard.css';
import './components/TPVDesigner/TPVDesigner.css';
import './components/TPVDesigner/CourtCanvas.css';
import './components/TPVDesigner/CourtLibrary.css';
import './components/TPVDesigner/PropertiesPanel.css';
import './components/TPVDesigner/DesignEditorModal.css';
import './styles/toast.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
