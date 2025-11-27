// TPV Studio - Sports Surface Designer Save Modal
// Modal for saving sports surface designs with project assignment

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/api/auth.js';
import { saveDesign } from '../../lib/api/designs.js';
import { createProject, listProjects } from '../../lib/api/projects.js';
import { serializeSportsDesign, validateSportsDesign } from '../../utils/sportsDesignSerializer.js';
import { useSportsDesignStore } from '../../stores/sportsDesignStore.js';

/**
 * Generate a thumbnail PNG from an SVG element
 */
async function generateThumbnail(svgElement, maxSize = 400) {
  return new Promise((resolve, reject) => {
    try {
      // Clone the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true);

      // Remove selection indicators and transform handles
      svgClone.querySelectorAll('.court-canvas__court--selected, .transform-handles').forEach(el => {
        el.classList.remove('court-canvas__court--selected');
      });
      svgClone.querySelectorAll('.transform-handles').forEach(el => el.remove());

      // Get viewBox dimensions
      const viewBox = svgElement.getAttribute('viewBox').split(' ').map(Number);
      const svgWidth = viewBox[2];
      const svgHeight = viewBox[3];

      // Calculate thumbnail dimensions maintaining aspect ratio
      let width, height;
      if (svgWidth > svgHeight) {
        width = maxSize;
        height = Math.round((svgHeight / svgWidth) * maxSize);
      } else {
        height = maxSize;
        width = Math.round((svgWidth / svgHeight) * maxSize);
      }

      // Set explicit dimensions on clone
      svgClone.setAttribute('width', width);
      svgClone.setAttribute('height', height);

      // Serialize SVG
      const svgString = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      // Create image and canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Draw SVG
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          resolve(blob);
        }, 'image/png', 0.9);
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG for thumbnail'));
      };

      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Upload thumbnail to Supabase storage
 */
async function uploadThumbnail(blob) {
  const filename = `sports-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
  const filePath = `thumbnails/sports/${filename}`;

  const { data, error } = await supabase.storage
    .from('tpv-studio-uploads')
    .upload(filePath, blob, {
      cacheControl: '3600',
      contentType: 'image/png',
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('tpv-studio-uploads')
    .getPublicUrl(filePath);

  return publicUrl;
}

export default function SaveDesignModal({
  existingDesignId = null,
  initialName = '',
  svgRef = null,
  onClose,
  onSaved
}) {
  const exportDesignData = useSportsDesignStore((state) => state.exportDesignData);

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const [projects, setProjects] = useState([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#1a365d');

  const [saving, setSaving] = useState(false);
  const [savingAsNew, setSavingAsNew] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const [error, setError] = useState(null);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { projects: projectList } = await listProjects();
      setProjects(projectList);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Failed to load projects');
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setError('Project name is required');
      return;
    }

    setCreatingProject(true);
    setError(null);

    try {
      const { project } = await createProject({
        name: newProjectName.trim(),
        color: newProjectColor
      });

      // Add to list and select it
      setProjects([project, ...projects]);
      setProjectId(project.id);
      setShowNewProject(false);
      setNewProjectName('');
      setNewProjectColor('#1a365d');
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err.message);
    } finally {
      setCreatingProject(false);
    }
  };

  const handleSave = async (saveAsNew = false) => {
    if (!name.trim()) {
      setError('Design name is required');
      return;
    }

    // Get current design state
    const currentState = exportDesignData();

    // Validate design state
    const validation = validateSportsDesign(currentState);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    if (saveAsNew) {
      setSavingAsNew(true);
    } else {
      setSaving(true);
    }
    setError(null);

    try {
      // Generate and upload thumbnail if we have the SVG ref
      let thumbnailUrl = null;
      if (svgRef?.current) {
        try {
          console.log('[SPORTS-SAVE] Generating thumbnail...');
          const thumbnailBlob = await generateThumbnail(svgRef.current);
          console.log('[SPORTS-SAVE] Uploading thumbnail...');
          thumbnailUrl = await uploadThumbnail(thumbnailBlob);
          console.log('[SPORTS-SAVE] Thumbnail uploaded:', thumbnailUrl);
        } catch (thumbErr) {
          console.warn('[SPORTS-SAVE] Thumbnail generation failed, continuing without:', thumbErr);
          // Continue without thumbnail - not critical
        }
      }

      // Serialize design state with metadata
      const designData = serializeSportsDesign(currentState, {
        name: name.trim(),
        description: description.trim() || '',
        tags: tags.split(',').map(t => t.trim()).filter(t => t)
      });

      console.log('[SPORTS-SAVE] Serialized design data:', designData);

      // Prepare save payload
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        project_id: projectId || null,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        is_public: isPublic,
        design_data: designData,
        thumbnail_url: thumbnailUrl
      };

      // Add ID for updates (unless saving as new)
      if (existingDesignId && !saveAsNew) {
        payload.id = existingDesignId;
      }

      const result = await saveDesign(payload);

      if (onSaved) {
        onSaved(result, name.trim());
      }

      onClose();
    } catch (err) {
      console.error('Failed to save design:', err);
      setError(err.message);
    } finally {
      setSaving(false);
      setSavingAsNew(false);
    }
  };

  const projectColors = ['#1a365d', '#ff6b35', '#4a90e2', '#50c878', '#9b59b6', '#e74c3c'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content save-design-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{existingDesignId ? 'Update Design' : 'Save Sports Surface'}</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Design Name */}
          <div className="form-group">
            <label htmlFor="design-name">Design Name *</label>
            <input
              id="design-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Multi-Sport Court Design"
              autoFocus
              disabled={saving || savingAsNew}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="design-description">Description</label>
            <textarea
              id="design-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes about this sports surface design..."
              rows={3}
              disabled={saving || savingAsNew}
            />
          </div>

          {/* Project Assignment */}
          <div className="form-group">
            <label htmlFor="design-project">Project</label>
            {!showNewProject ? (
              <div className="project-selector">
                <select
                  id="design-project"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  disabled={saving || savingAsNew}
                >
                  <option value="">No Project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name} ({project.design_count} designs)
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewProject(true)}
                  className="btn-secondary btn-small"
                  disabled={saving || savingAsNew}
                >
                  + New Project
                </button>
              </div>
            ) : (
              <div className="new-project-form">
                <div className="input-row">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Project name..."
                    disabled={creatingProject}
                  />
                  <div className="color-picker-inline">
                    {projectColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`color-swatch ${newProjectColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewProjectColor(color)}
                        disabled={creatingProject}
                      />
                    ))}
                  </div>
                </div>
                <div className="button-row">
                  <button
                    type="button"
                    onClick={handleCreateProject}
                    className="btn-primary btn-small"
                    disabled={creatingProject}
                  >
                    {creatingProject ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewProject(false)}
                    className="btn-secondary btn-small"
                    disabled={creatingProject}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="form-group">
            <label htmlFor="design-tags">Tags</label>
            <input
              id="design-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., tennis, multi-sport, school (comma-separated)"
              disabled={saving || savingAsNew}
            />
            <small className="help-text">Separate tags with commas</small>
          </div>

          {/* Public Toggle */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={saving || savingAsNew}
              />
              <span>Make this design public (shareable link)</span>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary" disabled={saving || savingAsNew}>
            Cancel
          </button>
          {existingDesignId && (
            <button
              onClick={() => handleSave(true)}
              className="btn-secondary"
              disabled={saving || savingAsNew}
            >
              {savingAsNew ? 'Saving...' : 'Save as New'}
            </button>
          )}
          <button onClick={() => handleSave(false)} className="btn-primary" disabled={saving || savingAsNew}>
            {saving ? 'Saving...' : (existingDesignId ? 'Update' : 'Save Design')}
          </button>
        </div>
      </div>
    </div>
  );
}
