// TPV Studio - Voronoi Canvas Component
// Simplified granule visualization for blend mode mixer widget

import React, { useRef, useEffect, useState } from 'react';
import { Delaunay } from 'd3-delaunay';
import {
  PALETTE,
  generateGranulePoints,
  mulberry32
} from '../utils/mixerUtils';

export default function VoronoiCanvas({
  parts,
  width = 400,
  height = 400,
  cellCount = 10000,
  seed = 12345
}) {
  const canvasRef = useRef(null);
  const [voronoiData, setVoronoiData] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize Voronoi diagram when seed changes
  useEffect(() => {
    const initializeVoronoi = async () => {
      setIsInitializing(true);

      // Generate points using Poisson disk sampling
      const points = generateGranulePoints(width, height, cellCount, seed);

      // Create Voronoi diagram using D3 Delaunay
      const delaunay = Delaunay.from(points);
      const voronoi = delaunay.voronoi([0, 0, width, height]);

      // Store Voronoi data
      setVoronoiData({
        points,
        voronoi,
        cellCount: points.length
      });

      setIsInitializing(false);
    };

    initializeVoronoi();
  }, [seed, width, height, cellCount]);

  // Render Voronoi diagram when parts or voronoi data changes
  useEffect(() => {
    if (!voronoiData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    // Clear canvas with light background
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, width, height);

    // Calculate total parts
    let totalParts = 0;
    parts.forEach(count => totalParts += count);

    // Assign colors to cells based on parts distribution
    const cellAssignments = assignColorsToGranules(
      voronoiData.cellCount,
      parts,
      totalParts,
      seed
    );

    // Pass 1: Draw all cell fills (no strokes)
    for (let i = 0; i < voronoiData.cellCount; i++) {
      const colorIndex = cellAssignments[i];

      // Get base color (solid, no variation)
      const color = colorIndex === -1
        ? '#FAFAFA'
        : PALETTE[colorIndex].hex;

      // Draw cell
      const polygon = voronoiData.voronoi.cellPolygon(i);
      if (!polygon || polygon.length < 3) continue;

      ctx.beginPath();
      ctx.moveTo(polygon[0][0], polygon[0][1]);
      for (let j = 1; j < polygon.length; j++) {
        ctx.lineTo(polygon[j][0], polygon[j][1]);
      }
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();
    }

  }, [voronoiData, parts, seed, width, height]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />
      {isInitializing && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center', color: '#666' }}>
            Generating granules...
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Assign colors to granules based on parts distribution
 * Uses Fisher-Yates shuffle for even distribution
 */
function assignColorsToGranules(cellCount, parts, totalParts, seed) {
  const assignments = new Array(cellCount).fill(-1);

  if (totalParts === 0) {
    return assignments; // All white
  }

  // Create seeded RNG for consistent shuffling
  const seedNum = seed + totalParts;
  const rng = mulberry32(seedNum);

  // Create shuffled indices
  const indices = Array.from({ length: cellCount }, (_, i) => i);

  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Assign colors based on parts proportions
  let cursor = 0;
  parts.forEach((partCount, colorIndex) => {
    const quota = Math.round((partCount / totalParts) * cellCount);
    for (let i = 0; i < quota && cursor < cellCount; i++) {
      assignments[indices[cursor]] = colorIndex;
      cursor++;
    }
  });

  return assignments;
}

