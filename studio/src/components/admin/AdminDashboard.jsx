/**
 * Admin Dashboard for TPV Studio
 * Main admin panel with overview stats, user management, and analytics
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/api/auth.js';

export default function AdminDashboard({ onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Overview stats
  const [stats, setStats] = useState(null);

  // Users data
  const [users, setUsers] = useState([]);

  // Designs data
  const [designs, setDesigns] = useState([]);
  const [designsTotal, setDesignsTotal] = useState(0);

  // Colour analytics
  const [colourStats, setColourStats] = useState(null);

  // Get auth headers
  const getAuthHeaders = async () => {
    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.access_token;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch overview stats
  const fetchOverview = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/admin/analytics/overview', { headers });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch overview');

      setStats(data.stats);
    } catch (err) {
      console.error('Failed to fetch overview:', err);
      setError(err.message);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/admin/users', { headers });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch users');

      setUsers(data.users);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message);
    }
  };

  // Fetch designs
  const fetchDesigns = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/admin/designs?limit=50', { headers });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch designs');

      setDesigns(data.designs);
      setDesignsTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch designs:', err);
      setError(err.message);
    }
  };

  // Fetch colour analytics
  const fetchColours = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/admin/analytics/colours', { headers });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch colour analytics');

      setColourStats(data.analytics);
    } catch (err) {
      console.error('Failed to fetch colours:', err);
      setError(err.message);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchOverview();
      setLoading(false);
    };
    loadData();
  }, []);

  // Load tab-specific data
  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) {
      fetchUsers();
    } else if (activeTab === 'designs' && designs.length === 0) {
      fetchDesigns();
    } else if (activeTab === 'colours' && !colourStats) {
      fetchColours();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h2>Access Denied</h2>
        <p>{error}</p>
        <p>You need admin privileges to view this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-left">
          <button onClick={onClose} className="btn-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Studio
          </button>
          <h1>TPV Studio Admin</h1>
        </div>
        <nav className="admin-nav">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={activeTab === 'designs' ? 'active' : ''}
            onClick={() => setActiveTab('designs')}
          >
            Designs
          </button>
          <button
            className={activeTab === 'colours' ? 'active' : ''}
            onClick={() => setActiveTab('colours')}
          >
            Colour Analytics
          </button>
        </nav>
      </header>

      <main className="admin-content">
        {activeTab === 'overview' && stats && (
          <OverviewPanel stats={stats} />
        )}

        {activeTab === 'users' && (
          <UsersPanel users={users} />
        )}

        {activeTab === 'designs' && (
          <DesignsPanel designs={designs} total={designsTotal} />
        )}

        {activeTab === 'colours' && colourStats && (
          <ColoursPanel analytics={colourStats} />
        )}
      </main>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #f8fafc;
        }

        .admin-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .admin-header-left {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 13px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          width: fit-content;
        }

        .btn-back:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .admin-header h1 {
          margin: 0;
          font-size: 24px;
          color: #1e4a7a;
        }

        .admin-nav {
          display: flex;
          gap: 8px;
        }

        .admin-nav button {
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: #64748b;
          transition: all 0.2s;
        }

        .admin-nav button:hover {
          background: #f8fafc;
          color: #1e4a7a;
        }

        .admin-nav button.active {
          background: #1e4a7a;
          color: white;
          border-color: #1e4a7a;
        }

        .admin-content {
          padding: 24px 40px;
        }

        .admin-loading,
        .admin-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          text-align: center;
        }

        .admin-error h2 {
          color: #dc2626;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #1e4a7a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Overview Panel Component
function OverviewPanel({ stats }) {
  return (
    <div className="overview-panel">
      <h2>Dashboard Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totals.users}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totals.designs}</div>
          <div className="stat-label">Total Designs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totals.projects}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totals.jobs}</div>
          <div className="stat-label">AI Jobs Run</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-value">{stats.activity.active_users_30d}</div>
          <div className="stat-label">Active Users (30d)</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-value">{stats.activity.designs_7d}</div>
          <div className="stat-label">Designs This Week</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-value">{stats.activity.designs_30d}</div>
          <div className="stat-label">Designs This Month</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-value">{stats.activity.job_success_rate}%</div>
          <div className="stat-label">Job Success Rate</div>
        </div>
      </div>

      <h3>Activity Timeline (14 Days)</h3>
      <div className="activity-chart">
        {stats.timeline.map((day, i) => (
          <div key={i} className="bar-container">
            <div
              className="bar"
              style={{ height: `${Math.max(4, day.count * 20)}px` }}
              title={`${day.date}: ${day.count} designs`}
            ></div>
            <div className="bar-label">{day.date.split('-')[2]}</div>
          </div>
        ))}
      </div>

      <div className="breakdowns">
        <div className="breakdown-card">
          <h4>Input Mode</h4>
          <div className="breakdown-items">
            <div className="breakdown-item">
              <span>Prompt</span>
              <strong>{stats.breakdowns.input_mode.prompt}</strong>
            </div>
            <div className="breakdown-item">
              <span>Image Upload</span>
              <strong>{stats.breakdowns.input_mode.image}</strong>
            </div>
            <div className="breakdown-item">
              <span>SVG Upload</span>
              <strong>{stats.breakdowns.input_mode.svg}</strong>
            </div>
          </div>
        </div>

        <div className="breakdown-card">
          <h4>View Mode Preference</h4>
          <div className="breakdown-items">
            <div className="breakdown-item">
              <span>Solid TPV</span>
              <strong>{stats.breakdowns.view_mode.solid}</strong>
            </div>
            <div className="breakdown-item">
              <span>Blend TPV</span>
              <strong>{stats.breakdowns.view_mode.blend}</strong>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .overview-panel h2 {
          margin: 0 0 24px 0;
          color: #1a202c;
        }

        .overview-panel h3 {
          margin: 32px 0 16px 0;
          color: #1a202c;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .stat-card.highlight {
          border-color: #1e4a7a;
          border-width: 2px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1e4a7a;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
        }

        .activity-chart {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 120px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .bar-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bar {
          width: 100%;
          background: #1e4a7a;
          border-radius: 4px 4px 0 0;
          min-height: 4px;
        }

        .bar-label {
          font-size: 10px;
          color: #64748b;
          margin-top: 4px;
        }

        .breakdowns {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 24px;
        }

        .breakdown-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .breakdown-card h4 {
          margin: 0 0 12px 0;
          color: #1a202c;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .breakdown-item:last-child {
          border-bottom: none;
        }

        .breakdown-item span {
          color: #64748b;
        }

        .breakdown-item strong {
          color: #1a202c;
        }
      `}</style>
    </div>
  );
}

// Users Panel Component
function UsersPanel({ users }) {
  return (
    <div className="users-panel">
      <h2>User Management ({users.length} users)</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Designs</th>
            <th>Projects</th>
            <th>Jobs</th>
            <th>Last Design</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
              </td>
              <td>{user.design_count}</td>
              <td>{user.project_count}</td>
              <td>{user.job_count}</td>
              <td>{user.last_design_at ? new Date(user.last_design_at).toLocaleDateString() : '-'}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .users-panel h2 {
          margin: 0 0 24px 0;
          color: #1a202c;
        }

        .users-table {
          width: 100%;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          border-collapse: collapse;
        }

        .users-table th,
        .users-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .users-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
        }

        .users-table td {
          font-size: 14px;
          color: #1a202c;
        }

        .role-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .role-badge.user {
          background: #f3f4f6;
          color: #64748b;
        }

        .role-badge.admin {
          background: #dbeafe;
          color: #1e40af;
        }

        .role-badge.superadmin {
          background: #fef3c7;
          color: #92400e;
        }
      `}</style>
    </div>
  );
}

// Designs Panel Component
function DesignsPanel({ designs, total }) {
  return (
    <div className="designs-panel">
      <h2>All Designs ({total} total)</h2>

      <div className="designs-grid">
        {designs.map(design => (
          <div key={design.id} className="design-card">
            <div className="design-thumbnail">
              {design.thumbnail_url || design.original_png_url ? (
                <img src={design.thumbnail_url || design.original_png_url} alt={design.name} />
              ) : (
                <div className="no-image">No preview</div>
              )}
            </div>
            <div className="design-info">
              <h4>{design.name}</h4>
              <p className="design-user">{design.user_email}</p>
              <p className="design-date">{new Date(design.created_at).toLocaleDateString()}</p>
              {design.project && (
                <span
                  className="project-badge"
                  style={{ backgroundColor: design.project.color || '#64748b' }}
                >
                  {design.project.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .designs-panel h2 {
          margin: 0 0 24px 0;
          color: #1a202c;
        }

        .designs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        .design-card {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .design-thumbnail {
          aspect-ratio: 1;
          background: #f3f4f6;
          overflow: hidden;
        }

        .design-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          font-size: 14px;
        }

        .design-info {
          padding: 12px;
        }

        .design-info h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: #1a202c;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .design-user {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }

        .design-date {
          margin: 4px 0;
          font-size: 12px;
          color: #9ca3af;
        }

        .project-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          color: white;
        }
      `}</style>
    </div>
  );
}

// Colours Panel Component
function ColoursPanel({ analytics }) {
  return (
    <div className="colours-panel">
      <h2>Colour Usage Analytics</h2>

      <div className="colour-stats">
        <div className="stat-card">
          <div className="stat-value">{analytics.totals.designs_analysed}</div>
          <div className="stat-label">Designs Analysed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.totals.colour_usages}</div>
          <div className="stat-label">Total Colour Uses</div>
        </div>
      </div>

      <h3>Top 10 TPV Colours</h3>
      <div className="colour-list">
        {analytics.top_colours.map((colour, i) => (
          <div key={colour.code} className="colour-item">
            <span className="colour-rank">#{i + 1}</span>
            <div
              className="colour-swatch"
              style={{ backgroundColor: colour.hex }}
            ></div>
            <div className="colour-info">
              <strong>{colour.code}</strong>
              <span>{colour.name}</span>
            </div>
            <div className="colour-count">{colour.count} uses</div>
          </div>
        ))}
      </div>

      <h3>Colour Family Breakdown</h3>
      <div className="family-bars">
        {Object.entries(analytics.families).map(([family, count]) => (
          <div key={family} className="family-bar">
            <span className="family-name">{family}</span>
            <div className="bar-bg">
              <div
                className="bar-fill"
                style={{
                  width: `${(count / analytics.totals.colour_usages) * 100}%`,
                  backgroundColor: getFamilyColour(family)
                }}
              ></div>
            </div>
            <span className="family-count">{count}</span>
          </div>
        ))}
      </div>

      {analytics.top_blends.length > 0 && (
        <>
          <h3>Top Blend Combinations</h3>
          <div className="blend-list">
            {analytics.top_blends.map((blend, i) => (
              <div key={i} className="blend-item">
                <div className="blend-swatches">
                  {blend.components.map((comp, j) => (
                    <div
                      key={j}
                      className="blend-swatch"
                      style={{ backgroundColor: comp.hex }}
                      title={`${comp.code} - ${comp.name}`}
                    ></div>
                  ))}
                </div>
                <div className="blend-codes">
                  {blend.components.map(c => c.code).join(' + ')}
                </div>
                <div className="blend-count">{blend.count} uses</div>
              </div>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .colours-panel h2 {
          margin: 0 0 24px 0;
          color: #1a202c;
        }

        .colours-panel h3 {
          margin: 32px 0 16px 0;
          color: #1a202c;
        }

        .colour-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1e4a7a;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
        }

        .colour-list {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .colour-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .colour-item:last-child {
          border-bottom: none;
        }

        .colour-rank {
          width: 30px;
          font-size: 12px;
          color: #9ca3af;
        }

        .colour-swatch {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .colour-info {
          flex: 1;
        }

        .colour-info strong {
          display: block;
          color: #1a202c;
        }

        .colour-info span {
          font-size: 12px;
          color: #64748b;
        }

        .colour-count {
          font-weight: 600;
          color: #1e4a7a;
        }

        .family-bars {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          padding: 16px;
        }

        .family-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .family-bar:last-child {
          margin-bottom: 0;
        }

        .family-name {
          width: 80px;
          font-size: 14px;
          color: #64748b;
          text-transform: capitalize;
        }

        .bar-bg {
          flex: 1;
          height: 20px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 4px;
        }

        .family-count {
          width: 50px;
          text-align: right;
          font-weight: 600;
          color: #1a202c;
        }

        .blend-list {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .blend-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .blend-item:last-child {
          border-bottom: none;
        }

        .blend-swatches {
          display: flex;
          gap: 4px;
        }

        .blend-swatch {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }

        .blend-codes {
          flex: 1;
          font-size: 14px;
          color: #1a202c;
        }

        .blend-count {
          font-weight: 600;
          color: #1e4a7a;
        }
      `}</style>
    </div>
  );
}

// Helper function for family colours
function getFamilyColour(family) {
  const colours = {
    reds: '#dc2626',
    greens: '#16a34a',
    blues: '#2563eb',
    yellows: '#ca8a04',
    neutrals: '#6b7280'
  };
  return colours[family] || '#6b7280';
}
