import { useState, useEffect, useRef } from 'react';
import ColorSelector from './ColorSelector';
import SVGVisualization from './SVGVisualization';
import ProgressBar from './ProgressBar';
import PDFGenerator from './PDFGenerator';
import colorsData from '../data/colors.json';
import './ColorMixer.css';

const ColorMixer = () => {
  const [selectedColors, setSelectedColors] = useState({});
  const [colorPattern, setColorPattern] = useState([]);
  const [loading, setLoading] = useState(false);
  const svgRef = useRef(null);

  const calculateColorPattern = () => {
    const pattern = [];
    const activeColors = [];

    Object.entries(selectedColors).forEach(([colorId, count]) => {
      if (count > 0) {
        const color = colorsData.colors.find(c => c.id === colorId);
        if (color) {
          for (let i = 0; i < count; i++) {
            activeColors.push(color.hex);
          }
        }
      }
    });

    if (activeColors.length > 0) {
      let j = 0;
      for (let i = 0; i < 20; i++) {
        pattern.push(activeColors[j]);
        j = (j + 1) % activeColors.length;
      }
    } else {
      for (let i = 0; i < 20; i++) {
        pattern.push('#ffffff');
      }
    }

    return pattern;
  };

  useEffect(() => {
    setColorPattern(calculateColorPattern());
  }, [selectedColors]);

  const handleColorChange = (colorId, delta) => {
    setLoading(true);

    setSelectedColors(prev => {
      const newCount = (prev[colorId] || 0) + delta;

      if (delta > 0) {
        const totalCount = Object.values(prev).reduce((sum, count) => sum + count, 0) + delta;
        if (totalCount > 21) {
          alert('Max sum of color selection is 21');
          setLoading(false);
          return prev;
        }

        const uniqueColors = new Set(Object.keys(prev).filter(id => prev[id] > 0));
        if (!prev[colorId] && uniqueColors.size >= 20) {
          alert('Max color selection is 20');
          setLoading(false);
          return prev;
        }
      }

      if (newCount < 0) {
        alert('Already zero');
        setLoading(false);
        return prev;
      }

      const updated = { ...prev };
      if (newCount === 0) {
        delete updated[colorId];
      } else {
        updated[colorId] = newCount;
      }

      setLoading(false);
      return updated;
    });
  };

  const handleReset = () => {
    setSelectedColors({});
  };

  const calculatePercentages = () => {
    const total = Object.values(selectedColors).reduce((sum, count) => sum + count, 0);
    const percentages = {};

    Object.entries(selectedColors).forEach(([colorId, count]) => {
      if (count > 0) {
        percentages[colorId] = ((count / total) * 100).toFixed(1);
      }
    });

    return percentages;
  };

  const totalPercentage = Object.values(selectedColors).reduce((sum, count) => sum + count, 0) > 0 ? '100%' : '0%';

  return (
    <div className="main_div text-center">
      {loading && (
        <div className="loader">
          <div className="loader-spinner"></div>
        </div>
      )}

      <div className="centeralContainer">
        <div className="row">
          {/* Instructions Section - Left Column */}
          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div className="professional-container">
              <h3>{colorsData.settings.instructions.title}</h3>
              {colorsData.settings.instructions.content.map((text, index) => (
                <p key={index} className="instruction-text" dangerouslySetInnerHTML={{__html: text}}></p>
              ))}

              {/* Buttons in left column like original */}
              <div className="btn-cont" style={{paddingTop: '35px', display: 'flex', gap: '15px'}}>
                <button onClick={handleReset} id="reset" className="btn-secondary">Reset</button>
                <PDFGenerator
                  svgRef={svgRef}
                  selectedColors={selectedColors}
                  percentages={calculatePercentages()}
                />
              </div>
            </div>
          </div>

          {/* SVG Visualization - Right Column */}
          <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
            <div className="professional-container">
              <div id="pdf">
                <SVGVisualization
                  ref={svgRef}
                  colorPattern={colorPattern}
                />
              </div>
              {/* Progress Bar - positioned below canvas like original */}
              <div className="progressShow">
                <ProgressBar
                  selectedColors={selectedColors}
                  colors={colorsData.colors}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Color Controls */}
          <div className="col-md-12">
            <div className="professional-container">
              <h3>Colour Selection</h3>
              <div className="mixer-controls" id="mixer-controls">
                {colorsData.colors.filter(color => color.enabled).map(color => (
                  <ColorSelector
                    key={color.id}
                    color={color}
                    count={selectedColors[color.id] || 0}
                    onIncrease={() => handleColorChange(color.id, 1)}
                    onDecrease={() => handleColorChange(color.id, -1)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>


        <div className="row">
          {/* Disclaimer */}
          <div className="col-md-12">
            <div className="professional-container">
              <p className="disclaimer">{colorsData.settings.colorDisclaimer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorMixer;