// TPV Studio - Court Template Rendering
import sportsCourtData from '../../data/sportsCourts.json';

/**
 * Get all available court templates
 */
export function getAllCourtTemplates() {
  return Object.values(sportsCourtData);
}

/**
 * Get a specific court template by ID
 */
export function getCourtTemplate(templateId) {
  return sportsCourtData[templateId] || null;
}

/**
 * Render a marking as an SVG path string
 */
export function renderMarking(marking, color, lineWidth_mm) {
  const { type, params } = marking;

  switch (type) {
    case 'line':
      return renderLine(params, color, lineWidth_mm);

    case 'rectangle':
      return renderRectangle(params, color, lineWidth_mm);

    case 'circle':
      return renderCircle(params, color, lineWidth_mm);

    case 'arc':
      return renderArc(params, color, lineWidth_mm);

    case 'polyline':
      return renderPolyline(params, color, lineWidth_mm);

    default:
      console.warn(`Unknown marking type: ${type}`);
      return null;
  }
}

/**
 * Render a zone (filled shape) as SVG
 */
export function renderZone(zone, color) {
  const { type, params } = zone;

  switch (type) {
    case 'rectangle':
      return {
        type: 'rect',
        x: params.x,
        y: params.y,
        width: params.width,
        height: params.height,
        fill: color
      };

    case 'circle':
      return {
        type: 'circle',
        cx: params.cx,
        cy: params.cy,
        r: params.radius,
        fill: color
      };

    case 'polygon':
      return {
        type: 'polygon',
        points: params.points,
        fill: color
      };

    default:
      console.warn(`Unknown zone type: ${type}`);
      return null;
  }
}

/**
 * Render a line marking
 */
function renderLine(params, color, lineWidth_mm) {
  return {
    type: 'line',
    x1: params.x1,
    y1: params.y1,
    x2: params.x2,
    y2: params.y2,
    stroke: color,
    strokeWidth: lineWidth_mm
  };
}

/**
 * Render a rectangle marking (outline only)
 */
function renderRectangle(params, color, lineWidth_mm) {
  return {
    type: 'rect',
    x: params.x,
    y: params.y,
    width: params.width,
    height: params.height,
    stroke: color,
    strokeWidth: lineWidth_mm,
    fill: 'none'
  };
}

/**
 * Render a circle marking (outline only)
 */
function renderCircle(params, color, lineWidth_mm) {
  return {
    type: 'circle',
    cx: params.cx,
    cy: params.cy,
    r: params.radius,
    stroke: color,
    strokeWidth: lineWidth_mm,
    fill: 'none'
  };
}

/**
 * Render an arc marking
 */
function renderArc(params, color, lineWidth_mm) {
  const { cx, cy, radius, startAngle, endAngle } = params;

  // Convert angles to radians
  const start = (startAngle * Math.PI) / 180;
  const end = (endAngle * Math.PI) / 180;

  // Calculate start and end points
  const x1 = cx + radius * Math.cos(start);
  const y1 = cy + radius * Math.sin(start);
  const x2 = cx + radius * Math.cos(end);
  const y2 = cy + radius * Math.sin(end);

  // Determine if arc should be large
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  // Create SVG arc path
  const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

  return {
    type: 'path',
    d: pathData,
    stroke: color,
    strokeWidth: lineWidth_mm,
    fill: 'none'
  };
}

/**
 * Render a polyline marking
 */
function renderPolyline(params, color, lineWidth_mm) {
  const points = params.points.map(p => `${p[0]},${p[1]}`).join(' ');

  return {
    type: 'polyline',
    points,
    stroke: color,
    strokeWidth: lineWidth_mm,
    fill: 'none'
  };
}

/**
 * Generate SVG elements for a court
 */
export function generateCourtSVG(court) {
  const { template, lineColorOverrides, zoneColorOverrides } = court;

  if (!template) {
    console.error('No template provided for court');
    return { markings: [], zones: [] };
  }

  // Render markings
  const markings = template.markings.map(marking => {
    const color = lineColorOverrides[marking.id]?.hex || template.defaultLineColor;
    const lineWidth = marking.lineWidth_mm || template.defaultLineWidth_mm;

    return {
      id: marking.id,
      name: marking.name,
      ...renderMarking(marking, color, lineWidth)
    };
  }).filter(Boolean);

  // Render zones
  const zones = template.zones?.map(zone => {
    const color = zoneColorOverrides[zone.id]?.hex || zone.defaultColor;

    return {
      id: zone.id,
      name: zone.name,
      ...renderZone(zone, color)
    };
  }).filter(Boolean) || [];

  return { markings, zones };
}

/**
 * Calculate total area for a court including all zones
 */
export function calculateCourtArea(court) {
  const { template } = court;

  if (!template || !template.zones) {
    return 0;
  }

  return template.zones.reduce((total, zone) => {
    return total + (zone.area_m2 || 0);
  }, 0);
}

/**
 * Calculate line marking lengths for material estimation
 */
export function calculateLineMarkingLengths(court) {
  const { template } = court;

  if (!template || !template.markings) {
    return {};
  }

  const lengths = {};

  template.markings.forEach(marking => {
    const color = court.lineColorOverrides[marking.id]?.tpv_code || template.defaultLineColor;
    const length = calculateMarkingLength(marking);

    if (!lengths[color]) {
      lengths[color] = 0;
    }
    lengths[color] += length;
  });

  return lengths;
}

/**
 * Calculate length of a single marking
 */
function calculateMarkingLength(marking) {
  const { type, params } = marking;

  switch (type) {
    case 'line':
      return calculateDistance(params.x1, params.y1, params.x2, params.y2) / 1000; // Convert to meters

    case 'rectangle':
      return (2 * (params.width + params.height)) / 1000;

    case 'circle':
      return (2 * Math.PI * params.radius) / 1000;

    case 'arc': {
      const angleRange = params.endAngle - params.startAngle;
      const circumference = 2 * Math.PI * params.radius;
      return (circumference * angleRange / 360) / 1000;
    }

    case 'polyline':
      let total = 0;
      for (let i = 0; i < params.points.length - 1; i++) {
        const [x1, y1] = params.points[i];
        const [x2, y2] = params.points[i + 1];
        total += calculateDistance(x1, y1, x2, y2);
      }
      return total / 1000;

    default:
      return 0;
  }
}

/**
 * Calculate distance between two points
 */
function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Generate a preview thumbnail SVG for a court template
 */
export function generateCourtPreviewSVG(template) {
  const { dimensions, markings, defaultLineColor, defaultLineWidth_mm } = template;
  const width = dimensions.width_mm;
  const height = dimensions.length_mm;

  // Scale factor to fit in 200x200 thumbnail
  const scale = Math.min(180 / width, 180 / height);

  const svgElements = markings.map(marking => {
    const rendered = renderMarking(marking, defaultLineColor, defaultLineWidth_mm * scale);

    if (!rendered) return '';

    switch (rendered.type) {
      case 'line':
        return `<line x1="${rendered.x1 * scale}" y1="${rendered.y1 * scale}" x2="${rendered.x2 * scale}" y2="${rendered.y2 * scale}" stroke="${rendered.stroke}" stroke-width="${rendered.strokeWidth}" />`;

      case 'rect':
        return `<rect x="${rendered.x * scale}" y="${rendered.y * scale}" width="${rendered.width * scale}" height="${rendered.height * scale}" stroke="${rendered.stroke}" stroke-width="${rendered.strokeWidth}" fill="${rendered.fill}" />`;

      case 'circle':
        return `<circle cx="${rendered.cx * scale}" cy="${rendered.cy * scale}" r="${rendered.r * scale}" stroke="${rendered.stroke}" stroke-width="${rendered.strokeWidth}" fill="${rendered.fill}" />`;

      case 'path':
        // Scale path data (simplified)
        const scaledPath = rendered.d.replace(/[\d.]+/g, match => (parseFloat(match) * scale).toFixed(2));
        return `<path d="${scaledPath}" stroke="${rendered.stroke}" stroke-width="${rendered.strokeWidth}" fill="${rendered.fill}" />`;

      case 'polyline':
        return `<polyline points="${rendered.points}" stroke="${rendered.stroke}" stroke-width="${rendered.strokeWidth}" fill="${rendered.fill}" />`;

      default:
        return '';
    }
  }).join('\n');

  return `<svg width="200" height="200" viewBox="0 0 ${width * scale} ${height * scale}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width * scale}" height="${height * scale}" fill="#f5f5f5" />
    ${svgElements}
  </svg>`;
}

/**
 * Validate court dimensions (warn if non-standard)
 */
export function validateCourtDimensions(court, tolerance = 0.05) {
  const { template, scale } = court;
  const actualWidth = template.dimensions.width_mm * scale;
  const actualLength = template.dimensions.length_mm * scale;

  const widthDiff = Math.abs(actualWidth - template.dimensions.width_mm) / template.dimensions.width_mm;
  const lengthDiff = Math.abs(actualLength - template.dimensions.length_mm) / template.dimensions.length_mm;

  const warnings = [];

  if (widthDiff > tolerance) {
    warnings.push(`Court width is ${(widthDiff * 100).toFixed(1)}% different from standard ${template.standard}`);
  }

  if (lengthDiff > tolerance) {
    warnings.push(`Court length is ${(lengthDiff * 100).toFixed(1)}% different from standard ${template.standard}`);
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
}
