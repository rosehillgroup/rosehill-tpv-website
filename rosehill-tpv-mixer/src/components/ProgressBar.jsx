import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ selectedColors, colors }) => {
  const calculateProgressData = () => {
    const total = Object.values(selectedColors).reduce((sum, count) => sum + count, 0);
    if (total === 0) return [];

    const progressData = [];
    Object.entries(selectedColors).forEach(([colorId, count]) => {
      if (count > 0) {
        const color = colors.find(c => c.id === colorId);
        if (color) {
          const percentage = ((count / total) * 100).toFixed(1);
          progressData.push({
            colorId,
            color: color.hex,
            percentage,
            name: color.name
          });
        }
      }
    });

    return progressData;
  };

  const progressData = calculateProgressData();

  return (
    <div className="progress-container">
      <div className="progress-bar">
        {progressData.map((item, index) => (
          <div
            key={item.colorId}
            className="progress-block"
            id={`progressBlock${index}`}
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.color
            }}
          >
            {item.percentage}%
          </div>
        ))}
      </div>
      {progressData.length === 0 && (
        <div className="empty-progress">
          <div className="progress-placeholder">0%</div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;