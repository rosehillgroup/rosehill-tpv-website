import React, { forwardRef, useRef, useEffect } from 'react';
import './SVGVisualization.css';

const SVGVisualization = forwardRef(({ colorPattern }, ref) => {
  const svgRef = useRef(null);

  // Apply colors to granule sections
  useEffect(() => {
    if (svgRef.current && colorPattern.length > 0) {
      // Fill granules sequentially like the original jQuery
      for (let i = 1; i <= 20; i++) {
        const granuleGroup = svgRef.current.querySelector(`.svg-${i}`);
        if (granuleGroup) {
          const colorIndex = (i - 1) % colorPattern.length;
          const color = colorPattern[colorIndex];

          // Set fill on all path, polygon, and polyline elements within this granule
          const elements = granuleGroup.querySelectorAll('path, polygon, polyline');
          elements.forEach(element => {
            element.setAttribute('fill', color);
          });
        }
      }
    } else {
      // Reset to white when no colors selected
      if (svgRef.current) {
        for (let i = 1; i <= 20; i++) {
          const granuleGroup = svgRef.current.querySelector(`.svg-${i}`);
          if (granuleGroup) {
            const elements = granuleGroup.querySelectorAll('path, polygon, polyline');
            elements.forEach(element => {
              element.setAttribute('fill', '#ffffff');
            });
          }
        }
      }
    }
  }, [colorPattern]);

  // Load the complete original SVG
  const loadOriginalSVG = async () => {
    try {
      const response = await fetch('/complete-granules.svg');
      const svgText = await response.text();

      if (svgRef.current) {
        // Remove the outer svg tags and insert the content
        const svgContent = svgText.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
        svgRef.current.innerHTML = svgContent;
      }
    } catch (error) {
      console.error('Error loading original SVG:', error);
      // Fallback to hardcoded SVG structure
      loadFallbackSVG();
    }
  };

  const loadFallbackSVG = () => {
    if (!svgRef.current) return;

    // This is a placeholder - in production, the complete 17k line SVG would be here
    svgRef.current.innerHTML = `
      <g id="_x32_0_1_" class="main-active main-check">
        <defs>
          <rect id="SVGID_1_" width="1500" height="854"/>
        </defs>
        <clipPath id="SVGID_2_">
          <use href="#SVGID_1_" overflow="visible"/>
        </clipPath>
        <g id="_x2D_20" clip-path="url(#SVGID_2_)" class="BACKGROUnD">
          <!-- Background granule paths would go here -->
        </g>
        <g id="_x32_0" clip-path="url(#SVGID_2_)" class="svg-1 active">
          <!-- Granule 1 paths -->
          <path fill="#ffffff" d="M100,100 L200,150 L150,250 Z"/>
        </g>
        <g id="_x31_9" clip-path="url(#SVGID_4_)" class="svg-2">
          <!-- Granule 2 paths -->
          <path fill="#ffffff" d="M200,100 L300,150 L250,250 Z"/>
        </g>
        <!-- Additional granule groups svg-3 through svg-20 would be here -->
      </g>
    `;
  };

  useEffect(() => {
    loadOriginalSVG();
  }, []);

  return (
    <div className="svg-container" ref={ref}>
      <svg
        ref={svgRef}
        className="second-svg-class show-svg"
        viewBox="0 0 1500 854"
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  );
});

SVGVisualization.displayName = 'SVGVisualization';

export default SVGVisualization;