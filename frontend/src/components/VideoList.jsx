import { useState, useEffect } from 'react';
import api from '../api';
import VideoPlayer from './VideoPlayer';
import './VideoList.css';

const VideoList = ({ socket }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        fetchVideos();
    }, [filter]);

    useEffect(() => {
        if (socket) {
            socket.on('videoProgress', (data) => {
                // Update video in list when processing updates
                setVideos(prevVideos =>
                    prevVideos.map(video =>
                        video.id === data.videoId
                            ? {
                                ...video,
                                processingProgress: data.progress,
                                processingStatus: data.progress === 100 ? 'completed' : 'processing',
                                sensitivityStatus: data.sensitivityStatus || video.sensitivityStatus
                            }
                            : video
                    )
                );
            });
        }

        return () => {
            if (socket) {
                socket.off('videoProgress');
            }
        };
    }, [socket]);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filter !== 'all') {
                params.sensitivity = filter;
            }
            const response = await api.get('/videos', { params });
            setVideos(response.data.videos);
        } catch (error) {
            console.error('Fetch videos error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (videoId) => {
        if (!confirm('Are you sure you want to delete this video?')) {
            return;
        }

        try {
            await api.delete(`/videos/${videoId}`);
            setVideos(videos.filter(v => v.id !== videoId));
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete video');
        }
    };

    const filteredVideos = videos.filter(video =>
        video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.originalName.toLowerCase().includes(search.toLowerCase())
    );

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    };

    const formatDuration = (seconds) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="video-list">
            <div className="list-header">
                <h3>My Videos ({filteredVideos.length})</h3>

                <div className="list-controls">
                    <input
                        type="text"
                        className="form-input search-input"
                        placeholder="Search videos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="form-input filter-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Videos</option>
                        <option value="safe">Safe</option>
                        <option value="flagged">Flagged</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading videos...</p>
                </div>
            ) : filteredVideos.length === 0 ? (
                <div className="empty-state card">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                        <line x1="7" y1="2" x2="7" y2="22" />
                        <line x1="17" y1="2" x2="17" y2="22" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <line x1="2" y1="7" x2="7" y2="7" />
                        <line x1="2" y1="17" x2="7" y2="17" />
                        <line x1="17" y1="17" x2="22" y2="17" />
                        <line x1="17" y1="7" x2="22" y2="7" />
                    </svg>
                    <h4>No videos found</h4>
                    <p className="text-muted">
                        {search ? 'Try a different search term' : 'Upload your first video to get started'}
                    </p>
                </div>
            ) : (
                <div className="videos-grid">
                    {filteredVideos.map((video) => (
                        <div key={video.id} className="video-card card">
                            <div className="video-thumbnail">
                                <svg width="100%" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>

                                {video.processingStatus === 'processing' && (
                                    <div className="processing-overlay">
                                        <div className="spinner"></div>
                                        <p>Processing {video.processingProgress}%</p>
                                    </div>
                                )}
                            </div>

                            <div className="video-info">
                                <h4>{video.title}</h4>

                                <div className="video-meta">
                                    <span className="text-muted">{formatDuration(video.duration)}</span>
                                    <span className="text-muted">{video.resolution}</span>
                                    <span className="text-muted">{formatFileSize(video.filesize)}</span>
                                </div>

                                <div className="video-status">
                                    <span className={`badge badge-${video.processingStatus === 'completed' ? 'success' :
                                            video.processingStatus === 'processing' ? 'info' :
                                                video.processingStatus === 'failed' ? 'error' : 'warning'
                                        }`}>
                                        {video.processingStatus}
                                    </span>

                                    {video.sensitivityStatus !== 'pending' && (
                                        <span className={`badge badge-${video.sensitivityStatus === 'safe' ? 'success' : 'error'
                                            }`}>
                                            {video.sensitivityStatus}
                                        </span>
                                    )}
                                </div>

                                <div className="video-actions">
                                    {video.processingStatus === 'completed' && (
                                        <button
                                            onClick={() => setSelectedVideo(video)}
                                            className="btn btn-primary"
                                        >
                                            Play
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(video.id)}
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedVideo && (
                <VideoPlayer
                    video={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
        </div>
    );
};

export default VideoList;
