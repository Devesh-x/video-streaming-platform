import { useState, useEffect } from 'react';
import api from '../api';
import './AdminPanel.css';

const AdminPanel = () => {
    const [stats, setStats] = useState(null);
    const [allVideos, setAllVideos] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const [statsRes, videosRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/videos'),
                api.get('/admin/users')
            ]);

            setStats(statsRes.data.stats);
            setAllVideos(videosRes.data.videos);
            setUsers(usersRes.data.users);
        } catch (error) {
            console.error('Fetch admin data error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.patch(`/admin/users/${userId}/role`, { role: newRole });
            // Update local state
            setUsers(users.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ));
            alert('User role updated successfully!');
        } catch (error) {
            console.error('Update role error:', error);
            alert('Failed to update user role');
        }
    };

    if (loading) {
        return (
            <div className="admin-panel card">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h2>Admin Panel</h2>
                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('videos')}
                    >
                        All Videos ({allVideos.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users ({users.length})
                    </button>
                </div>
            </div>

            {activeTab === 'overview' && stats && (
                <div className="stats-grid">
                    <div className="stat-card card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <h3>{stats.totalUsers}</h3>
                            <p>Total Users</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">🎬</div>
                        <div className="stat-info">
                            <h3>{stats.totalVideos}</h3>
                            <p>Total Videos</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">⚡</div>
                        <div className="stat-info">
                            <h3>{stats.processingVideos}</h3>
                            <p>Processing</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>{stats.safeVideos}</h3>
                            <p>Safe Videos</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">⚠️</div>
                        <div className="stat-info">
                            <h3>{stats.flaggedVideos}</h3>
                            <p>Flagged Videos</p>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon">💾</div>
                        <div className="stat-info">
                            <h3>{stats.totalStorageGB} GB</h3>
                            <p>Storage Used</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'videos' && (
                <div className="admin-table-container card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Owner</th>
                                <th>Size</th>
                                <th>Status</th>
                                <th>Sensitivity</th>
                                <th>Uploaded</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allVideos.map((video) => (
                                <tr key={video._id}>
                                    <td>
                                        <strong>{video.title}</strong>
                                        <br />
                                        <span className="text-muted">{video.originalName}</span>
                                    </td>
                                    <td>
                                        {video.userId?.username || 'Unknown'}
                                        <br />
                                        <span className="text-muted">{video.userId?.email}</span>
                                    </td>
                                    <td>{formatFileSize(video.filesize)}</td>
                                    <td>
                                        <span className={`badge badge-${video.processingStatus === 'completed' ? 'success' :
                                            video.processingStatus === 'processing' ? 'info' :
                                                video.processingStatus === 'failed' ? 'error' : 'warning'
                                            }`}>
                                            {video.processingStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${video.sensitivityStatus === 'safe' ? 'success' :
                                            video.sensitivityStatus === 'flagged' ? 'error' : 'warning'
                                            }`}>
                                            {video.sensitivityStatus}
                                        </span>
                                    </td>
                                    <td className="text-muted">{formatDate(video.uploadedAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="admin-table-container card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Organization</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td><strong>{user.username}</strong></td>
                                    <td>{user.email}</td>
                                    <td>
                                        <select
                                            className="role-select"
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        >
                                            <option value="viewer">Viewer</option>
                                            <option value="editor">Editor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="text-muted">{user.organization || 'N/A'}</td>
                                    <td className="text-muted">{formatDate(user.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
