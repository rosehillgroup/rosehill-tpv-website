// Island Generator for TPV Studio Geometric Mode
// Creates smooth blob shapes using superellipse (Lamé curves)

/**
 * Generate a superellipse (Lamé curve) path
 * Formula: |x/a|^n + |y/b|^n = 1
 * @param {number} centerX - Center X position (mm)
 * @param {number} centerY - Center Y position (mm)
 * @param {number} radiusX - Horizontal radius (mm)
 * @param {number} radiusY - Vertical radius (mm)
 * @param {number} exponent - Shape exponent (2=ellipse, >2=rounded rectangle)
 * @param {number} rotation - Rotation angle (degrees)
 * @param {number} points - Number of points to sample (default: 64)
 * @returns {string} SVG path data
 */
export function generateSuperellipse(centerX, centerY, radiusX, radiusY, exponent = 2.5, rotation = 0, points = 64) {
  const pathParts = [];

  // Sample points around the superellipse
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * 2 * Math.PI;

    // Superellipse parametric equation
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);

    // Calculate radius at angle t
    const r = Math.pow(
      Math.pow(Math.abs(cosT), exponent) / Math.pow(radiusX, exponent) +
      Math.pow(Math.abs(sinT), exponent) / Math.pow(radiusY, exponent),
      -1 / exponent
    );

    let x = r * cosT;
    let y = r * sinT;

    // Apply rotation
    if (rotation !== 0) {
      const rad = (rotation * Math.PI) / 180;
      const cosR = Math.cos(rad);
      const sinR = Math.sin(rad);
      const xRot = x * cosR - y * sinR;
      const yRot = x * sinR + y * cosR;
      x = xRot;
      y = yRot;
    }

    // Translate to center
    x += centerX;
    y += centerY;

    if (i === 0) {
      pathParts.push(`M ${x.toFixed(2)},${y.toFixed(2)}`);
    } else {
      pathParts.push(`L ${x.toFixed(2)},${y.toFixed(2)}`);
    }
  }

  pathParts.push('Z');
  return pathParts.join(' ');
}

/**
 * Generate an organic blob shape (variation of superellipse)
 * @param {number} centerX - Center X (mm)
 * @param {number} centerY - Center Y (mm)
 * @param {number} radius - Average radius (mm)
 * @param {number} seed - Random seed for variation
 * @returns {string} SVG path data
 */
export function generateBlob(centerX, centerY, radius, seed = 0) {
  // Seeded random
  let rng = seed;
  const random = () => {
    rng = (rng * 1664525 + 1013904223) % 4294967296;
    return rng / 4294967296;
  };

  // Random variation in radii
  const radiusX = radius * (0.8 + random() * 0.4);
  const radiusY = radius * (0.8 + random() * 0.4);

  // Random exponent (2.0-3.5 gives nice organic shapes)
  const exponent = 2.0 + random() * 1.5;

  // Random rotation
  const rotation = random() * 360;

  return generateSuperellipse(centerX, centerY, radiusX, radiusY, exponent, rotation);
}

/**
 * Generate multiple islands for composition
 * @param {object} canvas - {width_mm, height_mm}
 * @param {number} count - Number of islands (1-4)
 * @param {number} seed - Random seed
 * @returns {Array} Array of island path data with positions
 */
export function generateIslands(canvas, count, seed = 0) {
  const islands = [];

  // Seeded random
  let rng = seed;
  const random = () => {
    rng = (rng * 1664525 + 1013904223) % 4294967296;
    return rng / 4294967296;
  };

  const minSpacing = Math.min(canvas.width_mm, canvas.height_mm) * 0.2;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let position = null;

    while (attempts < 50) {
      // Random position (with margin from edges)
      const margin = 1000; // 1m from edges
      const x = margin + random() * (canvas.width_mm - 2 * margin);
      const y = margin + random() * (canvas.height_mm - 2 * margin);

      // Random radius (800-1500mm)
      const radius = 800 + random() * 700;

      // Check distance from other islands
      let tooClose = false;
      for (const other of islands) {
        const dx = x - other.x;
        const dy = y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < (radius + other.radius + minSpacing)) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose || attempts === 49) {
        position = { x, y, radius };
        break;
      }

      attempts++;
    }

    if (position) {
      islands.push({
        path: generateBlob(position.x, position.y, position.radius, seed + i * 1000),
        ...position
      });
    }
  }

  return islands;
}

/**
 * Generate a simple rounded rectangle (useful for backgrounds)
 * @param {number} x - Top-left X (mm)
 * @param {number} y - Top-left Y (mm)
 * @param {number} width - Width (mm)
 * @param {number} height - Height (mm)
 * @param {number} radius - Corner radius (mm, min 600mm for compliance)
 * @returns {string} SVG path data
 */
export function generateRoundedRect(x, y, width, height, radius) {
  // Clamp radius to half of smaller dimension
  const maxRadius = Math.min(width, height) / 2;
  radius = Math.min(radius, maxRadius);

  // Ensure minimum radius for TPV compliance
  radius = Math.max(600, radius);

  return `M ${(x + radius).toFixed(2)},${y.toFixed(2)} ` +
    `L ${(x + width - radius).toFixed(2)},${y.toFixed(2)} ` +
    `A ${radius.toFixed(2)},${radius.toFixed(2)} 0 0,1 ${(x + width).toFixed(2)},${(y + radius).toFixed(2)} ` +
    `L ${(x + width).toFixed(2)},${(y + height - radius).toFixed(2)} ` +
    `A ${radius.toFixed(2)},${radius.toFixed(2)} 0 0,1 ${(x + width - radius).toFixed(2)},${(y + height).toFixed(2)} ` +
    `L ${(x + radius).toFixed(2)},${(y + height).toFixed(2)} ` +
    `A ${radius.toFixed(2)},${radius.toFixed(2)} 0 0,1 ${x.toFixed(2)},${(y + height - radius).toFixed(2)} ` +
    `L ${x.toFixed(2)},${(y + radius).toFixed(2)} ` +
    `A ${radius.toFixed(2)},${radius.toFixed(2)} 0 0,1 ${(x + radius).toFixed(2)},${y.toFixed(2)} Z`;
}
