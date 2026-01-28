import { useState, useRef, useEffect } from 'react';
import api from '../api';
import './VideoUpload.css';

const VideoUpload = ({ socket }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [processingStatus, setProcessingStatus] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (socket) {
            socket.on('videoProgress', (data) => {
                setUploadProgress(data.progress);
                setProcessingStatus(data.status);

                if (data.progress === 100) {
                    setTimeout(() => {
                        setUploading(false);
                        setSelectedFile(null);
                        setTitle('');
                        setUploadProgress(0);
                        setProcessingStatus('');
                    }, 2000);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('videoProgress');
            }
        };
    }, [socket]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('video/')) {
                setSelectedFile(file);
                if (!title) {
                    setTitle(file.name.replace(/\.[^/.]+$/, ''));
                }
            } else {
                alert('Please select a video file');
            }
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            if (!title) {
                setTitle(file.name.replace(/\.[^/.]+$/, ''));
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a video file');
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setProcessingStatus('Uploading...');

        const formData = new FormData();
        formData.append('video', selectedFile);
        formData.append('title', title || selectedFile.name);

        try {
            await api.post('/videos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                },
            });

            setProcessingStatus('Upload complete. Processing video...');
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.response?.data?.error || 'Upload failed');
            setUploading(false);
            setUploadProgress(0);
            setProcessingStatus('');
        }
    };

    return (
        <div className="video-upload card">
            <h3>Upload Video</h3>

            <div
                className={`upload-dropzone ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    disabled={uploading}
                />

                {selectedFile ? (
                    <div className="file-info">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <path d="M12 18v-6" />
                            <path d="m9 15 3 3 3-3" />
                        </svg>
                        <p><strong>{selectedFile.name}</strong></p>
                        <p className="text-muted">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                ) : (
                    <div className="dropzone-placeholder">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <p>Drag and drop video here or click to browse</p>
                        <p className="text-muted">Supported formats: MP4, AVI, MOV, MKV, WebM</p>
                    </div>
                )}
            </div>

            {selectedFile && !uploading && (
                <div className="form-group mt-md">
                    <label className="form-label">Video Title</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter video title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
            )}

            {uploading && (
                <div className="upload-progress mt-md">
                    <div className="progress-info">
                        <span>{processingStatus}</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                </div>
            )}

            {selectedFile && !uploading && (
                <div className="upload-actions mt-md">
                    <button onClick={handleUpload} className="btn btn-primary">
                        Upload Video
                    </button>
                    <button
                        onClick={() => {
                            setSelectedFile(null);
                            setTitle('');
                        }}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoUpload;
