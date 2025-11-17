// TPV Studio - Design Gallery
// Grid view of user's saved designs with filtering

import { useState, useEffect } from 'react';
import DesignCard from './DesignCard.jsx';
import { listDesigns, loadDesign, deleteDesign } from '../lib/api/designs.js';
import { listProjects } from '../lib/api/projects.js';
import './DesignGallery.css';

export default function DesignGallery({
  onClose,
  onLoadDesign
}) {
  const [designs, setDesigns] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedProject, setSelectedProject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [selectedProject, searchQuery]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load projects and designs in parallel
      const [projectsResult, designsResult] = await Promise.all([
        listProjects(),
        listDesigns({
          project_id: selectedProject || undefined,
          search: searchQuery || undefined,
          limit: 12,
          offset: 0
        })
      ]);

      setProjects(projectsResult.projects);
      setDesigns(designsResult.designs);
      setHasMore(designsResult.pagination.has_more);
    } catch (err) {
      console.error('Failed to load designs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const result = await listDesigns({
        project_id: selectedProject || undefined,
        search: searchQuery || undefined,
        limit: 12,
        offset: designs.length
      });

      setDesigns([...designs, ...result.designs]);
      setHasMore(result.pagination.has_more);
    } catch (err) {
      console.error('Failed to load more designs:', err);
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadDesign = async (designId) => {
    try {
      const { design } = await loadDesign(designId);
      onLoadDesign(design);
      onClose();
    } catch (err) {
      console.error('Failed to load design:', err);
      alert(`Failed to load design: ${err.message}`);
    }
  };

  const handleDeleteDesign = async (designId) => {
    try {
      await deleteDesign(designId);
      // Remove from list
      setDesigns(designs.filter(d => d.id !== designId));
    } catch (err) {
      console.error('Failed to delete design:', err);
      throw err;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content design-gallery-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>My Designs</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        {/* Filters */}
        <div className="gallery-filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="project-filter"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.design_count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="modal-body">
          {error && (
            <div className="error-message">
              {error}
              <button onClick={loadInitialData} className="btn-retry">
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Loading your designs...</p>
            </div>
          ) : designs.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <path d="M17 21v-8H7v8M7 3v5h8" />
              </svg>
              <h3>No designs yet</h3>
              <p>
                {searchQuery || selectedProject
                  ? 'No designs match your filters. Try adjusting your search.'
                  : 'Create your first design to see it here!'}
              </p>
            </div>
          ) : (
            <>
              <div className="designs-grid">
                {designs.map(design => (
                  <DesignCard
                    key={design.id}
                    design={design}
                    onLoad={handleLoadDesign}
                    onDelete={handleDeleteDesign}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="load-more-section">
                  <button
                    onClick={loadMore}
                    className="btn-load-more"
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
