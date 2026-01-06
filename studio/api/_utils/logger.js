/**
 * Structured Logging Utility for API Endpoints
 * Provides correlation IDs and rich context for observability
 */

import crypto from 'crypto';

/**
 * Hash user ID for privacy in logs
 * @param {string} userId - User ID to hash
 * @returns {string} Hashed user ID (8 chars)
 */
function hashUserId(userId) {
  if (!userId) return null;
  return crypto.createHash('sha256').update(userId).digest('hex').slice(0, 8);
}

/**
 * Create a structured logger for a request
 * @param {Object} req - Request object
 * @param {Object} options - Logger options
 * @param {Object} options.user - User object (if authenticated)
 * @param {string} options.endpoint - Endpoint name
 * @returns {Object} Logger with info, warn, error methods
 */
export function createLogger(req, options = {}) {
  const { user, endpoint } = options;
  const correlationId = req.headers?.['x-correlation-id'] || crypto.randomUUID();
  const startTime = Date.now();

  /**
   * Log a message with structured data
   * @param {string} level - Log level (info, warn, error)
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   */
  const log = (level, message, data = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      correlationId,
      endpoint: endpoint || req.url,
      method: req.method,
      userId: hashUserId(user?.id),
      durationMs: Date.now() - startTime,
      message,
      ...data
    };

    // Use console methods based on level
    const output = JSON.stringify(logEntry);
    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  };

  return {
    correlationId,
    startTime,

    /**
     * Log info message
     * @param {string} msg - Message
     * @param {Object} data - Additional data
     */
    info: (msg, data) => log('info', msg, data),

    /**
     * Log warning message
     * @param {string} msg - Message
     * @param {Object} data - Additional data
     */
    warn: (msg, data) => log('warn', msg, data),

    /**
     * Log error message
     * @param {string} msg - Message
     * @param {Object} data - Additional data
     */
    error: (msg, data) => log('error', msg, data),

    /**
     * Log request start with common fields
     * @param {Object} data - Additional request data
     */
    logRequest: (data = {}) => {
      log('info', 'Request received', {
        userAgent: req.headers?.['user-agent']?.slice(0, 100),
        ip: req.headers?.['x-forwarded-for'] || 'unknown',
        ...data
      });
    },

    /**
     * Log request completion with duration
     * @param {Object} data - Additional response data
     */
    logResponse: (data = {}) => {
      log('info', 'Request completed', {
        durationMs: Date.now() - startTime,
        ...data
      });
    },

    /**
     * Get duration since logger creation
     * @returns {number} Duration in milliseconds
     */
    getDuration: () => Date.now() - startTime,
  };
}

/**
 * Log context for design operations
 * @param {Object} design - Design data
 * @returns {Object} Loggable design context
 */
export function getDesignContext(design) {
  if (!design) return { designId: null };

  // Calculate basic metrics
  const courtCount = Object.keys(design.courts || {}).length;
  const trackCount = Object.keys(design.tracks || {}).length;
  const motifCount = Object.keys(design.motifs || {}).length;
  const shapeCount = Object.keys(design.shapes || {}).length;
  const textCount = Object.keys(design.texts || {}).length;
  const exclusionCount = Object.keys(design.exclusionZones || {}).length;

  const elementCount = courtCount + trackCount + motifCount + shapeCount + textCount + exclusionCount;

  // Surface area in m²
  const surface = design.surface || {};
  const areaSqM = surface.width_mm && surface.length_mm
    ? (surface.width_mm * surface.length_mm) / 1_000_000
    : 0;

  // Estimate path count (complex shapes)
  const pathCount = Object.values(design.shapes || {})
    .filter(s => s?.shapeType === 'path' || s?.shapeType === 'blob')
    .length;

  // Simple complexity score
  const complexity = elementCount + (motifCount * 3) + (pathCount * 2) + Math.floor(areaSqM / 100);

  return {
    surfaceSize: surface.width_mm && surface.length_mm
      ? `${surface.width_mm}x${surface.length_mm}`
      : null,
    elementCount,
    courtCount,
    trackCount,
    motifCount,
    shapeCount,
    textCount,
    exclusionCount,
    pathCount,
    areaSqM: Math.round(areaSqM * 10) / 10,
    complexity,
    isLarge: complexity > 50,
    isHuge: complexity > 100,
  };
}

/**
 * Log context for export operations
 * @param {string} exportType - Type of export (pdf, svg, png, dxf)
 * @param {Object} data - Export data
 * @returns {Object} Loggable export context
 */
export function getExportContext(exportType, data = {}) {
  return {
    exportType,
    designBytes: data.svgString ? data.svgString.length : null,
    hasComplexity: data.complexity !== undefined,
    complexity: data.complexity || null,
    ...data
  };
}
