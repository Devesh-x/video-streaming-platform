import express from 'express';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import Video from '../models/Video.js';
import User from '../models/User.js';
import { authenticate, authorize, checkOwnership } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { analyzeVideoSensitivity } from '../utils/videoProcessor.js';

const router = express.Router();

// Upload video
router.post('/upload', authenticate, authorize('editor', 'admin'), upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file provided' });
        }

        const { title } = req.body;

        // Create video record
        const video = new Video({
            title: title || req.file.originalname,
            filename: req.file.filename,
            originalName: req.file.originalname,
            filepath: req.file.path,
            filesize: req.file.size,
            mimetype: req.file.mimetype,
            userId: req.userId,
            processingStatus: 'processing',
            processingProgress: 0
        });

        await video.save();

        // Send immediate response
        res.status(201).json({
            message: 'Video uploaded successfully. Processing started.',
            video: {
                id: video._id,
                title: video.title,
                filename: video.filename,
                processingStatus: video.processingStatus
            }
        });

        // Process video asynchronously
        processVideoAsync(video._id, req.file.path, req.app.get('io'));
    } catch (error) {
        console.error('Upload error:', error);

        // Clean up file if database save failed
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ error: 'Server error during upload' });
    }
});

// Async video processing function
async function processVideoAsync(videoId, filepath, io) {
    try {
        const video = await Video.findById(videoId);
        if (!video) return;

        // Simulate processing stages with progress updates
        const stages = [
            { progress: 20, status: 'Validating video file' },
            { progress: 40, status: 'Extracting metadata' },
            { progress: 60, status: 'Analyzing content' },
            { progress: 80, status: 'Running sensitivity analysis' }
        ];

        for (const stage of stages) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
            video.processingProgress = stage.progress;
            await video.save();

            // Emit progress update via Socket.io
            io.to(video.userId.toString()).emit('videoProgress', {
                videoId: video._id,
                progress: stage.progress,
                status: stage.status
            });
        }

        // Analyze video sensitivity
        const analysisResult = await analyzeVideoSensitivity(filepath);

        video.duration = analysisResult.duration;
        video.resolution = analysisResult.resolution;
        video.sensitivityScore = analysisResult.sensitivityScore;
        video.sensitivityStatus = analysisResult.sensitivityStatus;
        video.sensitivityDetails = analysisResult.sensitivityDetails;
        video.processingStatus = 'completed';
        video.processingProgress = 100;
        video.processedAt = new Date();

        await video.save();

        // Emit completion
        io.to(video.userId.toString()).emit('videoProgress', {
            videoId: video._id,
            progress: 100,
            status: 'Processing completed',
            sensitivityStatus: video.sensitivityStatus
        });

    } catch (error) {
        console.error('Processing error:', error);

        const video = await Video.findById(videoId);
        if (video) {
            video.processingStatus = 'failed';
            await video.save();

            io.to(video.userId.toString()).emit('videoProgress', {
                videoId: video._id,
                status: 'Processing failed',
                error: error.message
            });
        }
    }
}

// Get all videos for current user
router.get('/', authenticate, async (req, res) => {
    try {
        const { status, sensitivity, search, sort } = req.query;

        // Build query
        const query = { userId: req.userId };

        if (status) {
            query.processingStatus = status;
        }

        if (sensitivity && sensitivity !== 'all') {
            query.sensitivityStatus = sensitivity;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { originalName: { $regex: search, $options: 'i' } }
            ];
        }

        // Determine sort order
        let sortOption = { uploadedAt: -1 }; // Default: newest first
        if (sort === 'oldest') sortOption = { uploadedAt: 1 };
        if (sort === 'title') sortOption = { title: 1 };
        if (sort === 'size') sortOption = { filesize: -1 };

        const videos = await Video.find(query).sort(sortOption);

        res.json({
            count: videos.length,
            videos: videos.map(v => ({
                id: v._id,
                title: v.title,
                originalName: v.originalName,
                filesize: v.filesize,
                duration: v.duration,
                resolution: v.resolution,
                processingStatus: v.processingStatus,
                processingProgress: v.processingProgress,
                sensitivityStatus: v.sensitivityStatus,
                sensitivityScore: v.sensitivityScore,
                uploadedAt: v.uploadedAt,
                processedAt: v.processedAt
            }))
        });
    } catch (error) {
        console.error('Get videos error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single video details
router.get('/:id', authenticate, checkOwnership(Video), async (req, res) => {
    try {
        const video = req.resource;

        res.json({
            video: {
                id: video._id,
                title: video.title,
                originalName: video.originalName,
                filename: video.filename,
                filesize: video.filesize,
                mimetype: video.mimetype,
                duration: video.duration,
                resolution: video.resolution,
                processingStatus: video.processingStatus,
                processingProgress: video.processingProgress,
                sensitivityStatus: video.sensitivityStatus,
                sensitivityScore: video.sensitivityScore,
                sensitivityDetails: video.sensitivityDetails,
                uploadedAt: video.uploadedAt,
                processedAt: video.processedAt
            }
        });
    } catch (error) {
        console.error('Get video error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Stream video with range request support
router.get('/:id/stream', async (req, res) => {
    try {
        // Get token from query parameter (for HTML5 video compatibility) or header
        const token = req.query.token || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Get video
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Check ownership (admins can access all videos)
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (user.role !== 'admin' && video.userId.toString() !== decoded.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const videoPath = path.resolve(video.filepath);

        // Check if file exists
        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({ error: 'Video file not found' });
        }

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            // Parse range header
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;

            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': video.mimetype,
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            // No range request, send entire file
            const head = {
                'Content-Length': fileSize,
                'Content-Type': video.mimetype,
            };

            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (error) {
        console.error('Stream error:', error);
        res.status(500).json({ error: 'Server error during streaming' });
    }
});

// Delete video
router.delete('/:id', authenticate, authorize('editor', 'admin'), checkOwnership(Video), async (req, res) => {
    try {
        const video = req.resource;

        // Delete file from filesystem
        if (fs.existsSync(video.filepath)) {
            fs.unlinkSync(video.filepath);
        }

        // Delete from database
        await Video.findByIdAndDelete(video._id);

        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Server error during deletion' });
    }
});

export default router;
