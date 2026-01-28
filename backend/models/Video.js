import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    filesize: {
        type: Number,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 0
    },
    resolution: {
        type: String,
        default: 'unknown'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    processingStatus: {
        type: String,
        enum: ['uploading', 'processing', 'completed', 'failed'],
        default: 'uploading'
    },
    processingProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    sensitivityStatus: {
        type: String,
        enum: ['pending', 'safe', 'flagged'],
        default: 'pending'
    },
    sensitivityScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    sensitivityDetails: {
        type: String,
        default: ''
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    processedAt: {
        type: Date
    }
});

// Index for faster queries
videoSchema.index({ userId: 1, uploadedAt: -1 });
videoSchema.index({ sensitivityStatus: 1 });

export default mongoose.model('Video', videoSchema);
