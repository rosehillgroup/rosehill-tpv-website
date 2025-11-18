// TPV Studio - Save Design Modal
// Modal for saving designs with project assignment

import { useState, useEffect } from 'react';
import { saveDesign } from '../lib/api/designs.js';
import { createProject, listProjects } from '../lib/api/projects.js';
import { serializeDesign, validateDesignState } from '../utils/designSerializer.js';
import './SaveDesignModal.css';

export default function SaveDesignModal({
  currentState,
  existingDesignId = null,
  initialName = '',
  onClose,
  onSaved
}) {
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

    // Validate design state
    const validation = validateDesignState(currentState);
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
      // Serialize design state
      const designData = serializeDesign(currentState);

      console.log('[SAVE-MODAL] Serialized design data:', designData);
      console.log('[SAVE-MODAL] SVG URL from serialized data:', designData.original_svg_url);

      // Prepare save payload
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        project_id: projectId || null,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        is_public: isPublic,
        design_data: designData
      };

      console.log('[SAVE-MODAL] Full save payload:', payload);

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
          <h2>{existingDesignId ? 'Update Design' : 'Save Design'}</h2>
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
              placeholder="e.g., Playground Design A"
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
              placeholder="Optional notes about this design..."
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
              placeholder="e.g., playground, vibrant, geometric (comma-separated)"
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
