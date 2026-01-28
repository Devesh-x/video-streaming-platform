import { useEffect, useRef, useState } from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ video, onClose }) => {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);
    const [streamUrl, setStreamUrl] = useState('');

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Get token and create stream URL with token as query parameter
        // HTML5 video element cannot send custom headers, so we use query param
        const token = localStorage.getItem('token');
        const url = `/api/videos/${video.id}/stream?token=${token}`;

        setStreamUrl(url);

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [video.id]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleVideoError = (e) => {
        console.error('Video playback error:', e);
        setError('Unable to load video. Please try again.');
    };

    return (
        <div className="video-player-modal" onClick={handleBackdropClick}>
            <div className="video-player-content">
                <div className="player-header">
                    <div>
                        <h3>{video.title}</h3>
                        {video.sensitivityStatus === 'flagged' && (
                            <div className="warning-banner">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                                <span>This content has been flagged for review</span>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="close-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="player-container">
                    {error ? (
                        <div className="video-error">
                            <p>{error}</p>
                            <button onClick={() => setError(null)} className="btn btn-primary">
                                Retry
                            </button>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            controls
                            autoPlay
                            className="video-element"
                            src={streamUrl}
                            onError={handleVideoError}
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>

                <div className="player-info">
                    <div className="info-row">
                        <span className="info-label">Resolution:</span>
                        <span>{video.resolution}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Duration:</span>
                        <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Sensitivity Score:</span>
                        <span className={video.sensitivityScore > 70 ? 'text-error' : 'text-success'}>
                            {video.sensitivityScore}/100
                        </span>
                    </div>
                    {video.sensitivityDetails && (
                        <div className="info-row">
                            <span className="info-label">Details:</span>
                            <span className="text-muted">{video.sensitivityDetails}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
