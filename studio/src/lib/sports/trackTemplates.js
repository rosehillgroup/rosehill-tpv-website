// TPV Studio - Running Track Template Library
import trackTemplatesData from '../../data/runningTracks.json';

/**
 * Get all available track templates
 * @returns {Array} Array of track template objects
 */
export function getAllTrackTemplates() {
  return Object.values(trackTemplatesData);
}

/**
 * Get a specific track template by ID
 * @param {string} templateId - Track template ID
 * @returns {object|null} Track template object or null if not found
 */
export function getTrackTemplate(templateId) {
  return trackTemplatesData[templateId] || null;
}

/**
 * Get track templates by number of lanes
 * @param {number} numLanes - Number of lanes (4, 6, or 8)
 * @returns {Array} Array of matching track templates
 */
export function getTrackTemplatesByLanes(numLanes) {
  return getAllTrackTemplates().filter(
    template => template.parameters.numLanes === numLanes
  );
}

/**
 * Get default track template (8-lane standard)
 * @returns {object} Default track template
 */
export function getDefaultTrackTemplate() {
  return getTrackTemplate('track-8lane-standard') || getAllTrackTemplates()[0];
}
