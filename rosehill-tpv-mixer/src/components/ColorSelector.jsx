import React from 'react';
import './ColorSelector.css';

const ColorSelector = ({ color, count, onIncrease, onDecrease }) => {
  return (
    <div className="mixer-colour-outer">
      <button
        className="ChangePercentageDown"
        onClick={onDecrease}
        aria-label={`Decrease ${color.name}`}
      >
        -
      </button>
      <button
        className="ChangePercentageUp"
        onClick={onIncrease}
        aria-label={`Increase ${color.name}`}
      >
        +
      </button>
      <div
        className="mixer-color"
        style={{ backgroundColor: color.hex }}
      >
        <div className="mixer-color-inner">
          <div className="percent" id={color.id.toLowerCase()}>
            {count}
          </div>
        </div>
      </div>
      <div className="mixer-text">
        <span>{color.name}</span>
        <div>{color.id}</div>
      </div>
    </div>
  );
};

export default ColorSelector;