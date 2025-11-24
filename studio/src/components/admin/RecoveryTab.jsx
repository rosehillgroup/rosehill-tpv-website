/**
 * Admin Recovery Tab
 * View and recover orphaned generation jobs
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/api/auth.js';

export default function RecoveryTab() {
  const [orphanedJobs, setOrphanedJobs] = useState([]);
  const [ageBuckets, setAgeBuckets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recovering, setRecovering] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState(new Set());

  // Filter
  const [ageFilter, setAgeFilter] = useState('all');

  // Get auth headers
  const getAuthHeaders = async () => {
    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.access_token;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch orphaned jobs
  const fetchOrphanedJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();

      // Build query params
      const params = new URLSearchParams();
      if (ageFilter !== 'all') params.append('age_filter', ageFilter);

      const response = await fetch(`/api/admin/recovery/orphaned?${params.toString()}`, { headers });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch orphaned jobs');

      setOrphanedJobs(data.orphaned_jobs);
      setAgeBuckets(data.age_buckets);
    } catch (err) {
      console.error('Failed to fetch orphaned jobs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount and when filter changes
  useEffect(() => {
    fetchOrphanedJobs();
  }, [ageFilter]);

  // Toggle job selection
  const toggleJobSelection = (jobId) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  // Select all
  const selectAll = () => {
    setSelectedJobs(new Set(orphanedJobs.map(j => j.id)));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedJobs(new Set());
  };

  // Recover selected jobs
  const recoverSelected = async () => {
    if (selectedJobs.size === 0) {
      alert('Please select at least one job to recover');
      return;
    }

    if (!confirm(`Recover ${selectedJobs.size} orphaned ${selectedJobs.size === 1 ? 'design' : 'designs'}?`)) {
      return;
    }

    setRecovering(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();

      const response = await fetch('/api/admin/recovery/create', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          job_ids: Array.from(selectedJobs)
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to recover designs');

      alert(`Successfully recovered ${data.recovered_count} ${data.recovered_count === 1 ? 'design' : 'designs'}!`);

      // Clear selection and refresh
      clearSelection();
      await fetchOrphanedJobs();
    } catch (err) {
      console.error('Failed to recover designs:', err);
      setError(err.message);
      alert(`Recovery failed: ${err.message}`);
    } finally {
      setRecovering(false);
    }
  };

  return (
    <div className="recovery-tab">
      {/* Summary Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card warning">
          <h3>Total Orphaned</h3>
          <p className="stat-value">{orphanedJobs.length}</p>
          <span className="stat-label">Designs not saved</span>
        </div>
        {ageBuckets && (
          <>
            <div className="admin-stat-card">
              <h3>&lt;24 hours</h3>
              <p className="stat-value">{ageBuckets['<24h']}</p>
              <span className="stat-label">Recent</span>
            </div>
            <div className="admin-stat-card">
              <h3>1-7 days</h3>
              <p className="stat-value">{ageBuckets['1-7d']}</p>
              <span className="stat-label">This week</span>
            </div>
            <div className="admin-stat-card">
              <h3>&gt;7 days</h3>
              <p className="stat-value">{ageBuckets['7-30d'] + ageBuckets['>30d']}</p>
              <span className="stat-label">Older</span>
            </div>
          </>
        )}
      </div>

      {/* Filters and Actions */}
      <div className="recovery-controls">
        <div className="admin-filters">
          <div className="filter-group">
            <label>Age:</label>
            <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="24h">&lt;24 hours</option>
              <option value="7d">&lt;7 days</option>
              <option value="30d">&lt;30 days</option>
            </select>
          </div>
        </div>

        <div className="bulk-actions">
          <button onClick={selectAll} className="btn-secondary">
            Select All
          </button>
          <button onClick={clearSelection} className="btn-secondary">
            Clear ({selectedJobs.size})
          </button>
          <button
            onClick={recoverSelected}
            disabled={selectedJobs.size === 0 || recovering}
            className="btn-primary"
          >
            {recovering ? 'Recovering...' : `Recover Selected (${selectedJobs.size})`}
          </button>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && <div className="admin-loading"><div className="spinner"></div><p>Loading orphaned jobs...</p></div>}
      {error && <div className="admin-error"><p>Error: {error}</p></div>}

      {/* Orphaned Jobs Table */}
      {!loading && orphanedJobs.length > 0 && (
        <div className="recovery-table-container">
          <table className="recovery-table">
            <thead>
              <tr>
                <th style={{width: '40px'}}>
                  <input
                    type="checkbox"
                    checked={selectedJobs.size === orphanedJobs.length}
                    onChange={(e) => e.target.checked ? selectAll() : clearSelection()}
                  />
                </th>
                <th>Thumbnail</th>
                <th>Prompt / Auto-name</th>
                <th>Dimensions</th>
                <th>Age</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {orphanedJobs.map(job => (
                <tr
                  key={job.id}
                  className={selectedJobs.has(job.id) ? 'selected' : ''}
                  onClick={() => toggleJobSelection(job.id)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedJobs.has(job.id)}
                      onChange={() => toggleJobSelection(job.id)}
                    />
                  </td>
                  <td className="thumbnail-cell">
                    {job.thumbnail_url ? (
                      <img src={job.thumbnail_url} alt="Design" className="job-thumbnail" />
                    ) : (
                      <div className="thumbnail-placeholder">No image</div>
                    )}
                  </td>
                  <td className="prompt-cell">
                    <div className="prompt-text" title={job.prompt}>
                      {job.auto_name}
                    </div>
                    {job.prompt && job.prompt.length > 50 && (
                      <div className="prompt-full">{job.prompt}</div>
                    )}
                  </td>
                  <td className="dimensions-cell">
                    {job.width_mm && job.length_mm ? (
                      <span>{job.width_mm} × {job.length_mm} mm</span>
                    ) : (
                      <em>N/A</em>
                    )}
                  </td>
                  <td className="age-cell">
                    <span className={`age-badge ${job.age_bucket.replace(/[<>]/g, '')}`}>
                      {job.age_days} {job.age_days === 1 ? 'day' : 'days'}
                    </span>
                  </td>
                  <td className="user-cell">
                    {job.user_email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && orphanedJobs.length === 0 && (
        <div className="admin-empty">
          <p>No orphaned jobs found. All designs have been saved!</p>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .recovery-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .bulk-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-primary {
          padding: 0.5rem 1rem;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-primary:hover:not(:disabled) {
          background: #e55a2b;
        }

        .btn-primary:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .btn-secondary {
          padding: 0.5rem 1rem;
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        .recovery-table-container {
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .recovery-table {
          width: 100%;
          border-collapse: collapse;
        }

        .recovery-table th {
          background: #f9fafb;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .recovery-table td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .recovery-table tbody tr {
          cursor: pointer;
          transition: background 0.15s;
        }

        .recovery-table tbody tr:hover {
          background: #f9fafb;
        }

        .recovery-table tbody tr.selected {
          background: #eff6ff;
        }

        .age-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .age-badge.24h {
          background: #fee2e2;
          color: #991b1b;
        }

        .age-badge.1-7d {
          background: #fed7aa;
          color: #92400e;
        }

        .age-badge.7-30d {
          background: #fef3c7;
          color: #78350f;
        }

        .age-badge.30d {
          background: #e5e7eb;
          color: #374151;
        }

        .prompt-full {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
          display: none;
        }

        .recovery-table tbody tr:hover .prompt-full {
          display: block;
        }
      `}</style>
    </div>
  );
}
