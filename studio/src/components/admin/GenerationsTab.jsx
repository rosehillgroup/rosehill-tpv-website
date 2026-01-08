/**
 * Admin Generations Tab
 * View all generation jobs with saved/orphaned status
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/api/auth.js';

export default function GenerationsTab() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [savedFilter, setSavedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [offset, setOffset] = useState(0);
  const limit = 50;

  // Get auth headers
  const getAuthHeaders = async () => {
    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.access_token;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();

      // Build query params
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });

      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (savedFilter !== 'all') params.append('saved_status', savedFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/admin/jobs?${params.toString()}`, { headers });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch jobs');

      setJobs(data.jobs);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount and when filters change
  useEffect(() => {
    fetchJobs();
  }, [statusFilter, savedFilter, searchQuery, offset]);

  // Calculate summary stats
  const completedCount = jobs.filter(j => j.status === 'completed').length;
  const orphanedCount = jobs.filter(j => !j.is_saved && j.status === 'completed').length;
  const savedCount = jobs.filter(j => j.is_saved).length;

  return (
    <div className="generations-tab">
      {/* Summary Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3>Total Generations</h3>
          <p className="stat-value">{total}</p>
          <span className="stat-label">All time</span>
        </div>
        <div className="admin-stat-card">
          <h3>Completed</h3>
          <p className="stat-value">{completedCount}</p>
          <span className="stat-label">Current page</span>
        </div>
        <div className="admin-stat-card success">
          <h3>Saved</h3>
          <p className="stat-value">{savedCount}</p>
          <span className="stat-label">✓ Linked to designs</span>
        </div>
        <div className="admin-stat-card warning">
          <h3>Orphaned</h3>
          <p className="stat-value">{orphanedCount}</p>
          <span className="stat-label">⚠ Not saved</span>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="running">Running</option>
            <option value="queued">Queued</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Saved:</label>
          <select value={savedFilter} onChange={(e) => setSavedFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="saved">Saved only</option>
            <option value="orphaned">Orphaned only</option>
          </select>
        </div>

        <div className="filter-group search">
          <label>Search prompt:</label>
          <input
            type="text"
            placeholder="Search in prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && <div className="admin-loading"><div className="spinner"></div><p>Loading jobs...</p></div>}
      {error && <div className="admin-error"><p>Error: {error}</p></div>}

      {/* Jobs Table */}
      {!loading && jobs.length > 0 && (
        <div className="jobs-table-container">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Prompt</th>
                <th>Dimensions</th>
                <th>Status</th>
                <th>Saved</th>
                <th>User</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr
                  key={job.id}
                  className={`job-row ${job.is_saved ? 'saved' : 'orphaned'} ${job.status}`}
                >
                  <td className="thumbnail-cell">
                    {job.thumbnail_url ? (
                      <img src={job.thumbnail_url} alt="Design" className="job-thumbnail" />
                    ) : (
                      <div className="thumbnail-placeholder">No image</div>
                    )}
                  </td>
                  <td className="prompt-cell">
                    <div className="prompt-text" title={job.prompt}>
                      {job.prompt || <em>No prompt</em>}
                    </div>
                  </td>
                  <td className="dimensions-cell">
                    {job.width_mm && job.length_mm ? (
                      <span>{job.width_mm} × {job.length_mm} mm</span>
                    ) : (
                      <em>N/A</em>
                    )}
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${job.status}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="saved-cell">
                    {job.is_saved ? (
                      <span className="saved-badge">✓ Saved</span>
                    ) : (
                      <span className="orphaned-badge">⚠ Orphaned</span>
                    )}
                  </td>
                  <td className="user-cell">
                    {job.user_email}
                  </td>
                  <td className="date-cell">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && jobs.length === 0 && (
        <div className="admin-empty">
          <p>No jobs found matching your filters.</p>
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="admin-pagination">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
          >
            Previous
          </button>
          <span>
            Showing {offset + 1} to {Math.min(offset + limit, total)} of {total}
          </span>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total}
          >
            Next
          </button>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .jobs-table-container {
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .jobs-table {
          width: 100%;
          border-collapse: collapse;
        }

        .jobs-table th {
          background: #f9fafb;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .jobs-table td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .job-row.saved {
          background: rgba(16, 185, 129, 0.03);
        }

        .job-row.orphaned {
          background: rgba(245, 158, 11, 0.03);
        }

        .thumbnail-cell {
          width: 80px;
        }

        .job-thumbnail {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 4px;
        }

        .thumbnail-placeholder {
          width: 64px;
          height: 64px;
          background: #f3f4f6;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .prompt-cell {
          max-width: 300px;
        }

        .prompt-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.completed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.failed {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.running {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.queued {
          background: #e0e7ff;
          color: #3730a3;
        }

        .saved-badge {
          color: #059669;
          font-weight: 500;
        }

        .orphaned-badge {
          color: #d97706;
          font-weight: 500;
        }

        .user-cell {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .date-cell {
          font-size: 0.875rem;
          color: #6b7280;
          white-space: nowrap;
        }

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .admin-stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .admin-stat-card h3 {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .admin-stat-card .value {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
        }

        .admin-stat-card.success {
          border-left: 4px solid #10b981;
        }

        .admin-stat-card.warning {
          border-left: 4px solid #f59e0b;
        }

        .admin-filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .admin-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          padding: 1rem 0;
        }

        .admin-empty {
          text-align: center;
          padding: 3rem;
          color: #64748b;
        }
      `}</style>
    </div>
  );
}
