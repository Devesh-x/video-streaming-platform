import express from 'express';
import User from '../models/User.js';
import Video from '../models/Video.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin role
router.use(authenticate, authorize('admin'));

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get system statistics
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVideos = await Video.countDocuments();
        const processingVideos = await Video.countDocuments({ processingStatus: 'processing' });
        const flaggedVideos = await Video.countDocuments({ sensitivityStatus: 'flagged' });
        const safeVideos = await Video.countDocuments({ sensitivityStatus: 'safe' });

        // Get storage usage
        const videos = await Video.find();
        const totalStorage = videos.reduce((sum, video) => sum + video.filesize, 0);

        res.json({
            stats: {
                totalUsers,
                totalVideos,
                processingVideos,
                flaggedVideos,
                safeVideos,
                totalStorage,
                totalStorageGB: (totalStorage / (1024 * 1024 * 1024)).toFixed(2)
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user role
router.patch('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;

        if (!['viewer', 'editor', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User role updated', user });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete all videos belonging to this user
        await Video.deleteMany({ userId: user._id });

        res.json({ message: 'User and associated videos deleted' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all videos (admin can see all)
router.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find()
            .populate('userId', 'username email')
            .sort({ uploadedAt: -1 });

        res.json({ videos });
    } catch (error) {
        console.error('Get all videos error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
