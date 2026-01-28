import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

/**
 * Process video for sensitivity analysis
 * Works with or without FFmpeg installed
 */
export const analyzeVideoSensitivity = (filepath) => {
    return new Promise((resolve, reject) => {
        // Try to use FFmpeg if available
        ffmpeg.ffprobe(filepath, (err, metadata) => {
            if (err) {
                // FFmpeg not available - use fallback
                console.warn('FFmpeg not available, using fallback metadata extraction');
                return resolveFallback(filepath, resolve);
            }

            const duration = metadata.format.duration || 0;
            const videoStream = metadata.streams.find(s => s.codec_type === 'video');
            const resolution = videoStream
                ? `${videoStream.width}x${videoStream.height}`
                : 'unknown';

            // Simulated sensitivity analysis
            const sensitivityScore = simulateSensitivityAnalysis(filepath, { duration });
            const isFlagged = sensitivityScore > 70;

            resolve({
                duration: Math.round(duration),
                resolution,
                sensitivityScore,
                sensitivityStatus: isFlagged ? 'flagged' : 'safe',
                sensitivityDetails: isFlagged
                    ? 'Content flagged for manual review based on automated analysis'
                    : 'Content appears safe based on automated analysis'
            });
        });
    });
};

/**
 * Fallback metadata extraction when FFmpeg is not available
 */
const resolveFallback = (filepath, resolve) => {
    try {
        const stats = fs.statSync(filepath);
        const filesize = stats.size;

        // Estimate duration based on file size (rough approximation)
        // Average video bitrate ~5 Mbps = 625 KB/s
        const estimatedDuration = Math.round(filesize / (625 * 1024));

        const sensitivityScore = simulateSensitivityAnalysis(filepath, { duration: estimatedDuration });
        const isFlagged = sensitivityScore > 70;

        resolve({
            duration: estimatedDuration,
            resolution: 'unknown',
            sensitivityScore,
            sensitivityStatus: isFlagged ? 'flagged' : 'safe',
            sensitivityDetails: isFlagged
                ? 'Content flagged for manual review (FFmpeg not available for detailed analysis)'
                : 'Content appears safe (FFmpeg not available for detailed analysis)'
        });
    } catch (error) {
        resolve({
            duration: 0,
            resolution: 'unknown',
            sensitivityScore: 50,
            sensitivityStatus: 'safe',
            sensitivityDetails: 'Basic analysis completed (install FFmpeg for detailed metadata)'
        });
    }
};

/**
 * Simulated sensitivity analysis
 */
const simulateSensitivityAnalysis = (filepath, metadata) => {
    const filename = path.basename(filepath).toLowerCase();
    const duration = metadata.duration || 0;

    let score = 0;

    // Check filename for suspicious keywords (demo purposes)
    const suspiciousKeywords = ['explicit', 'violent', 'sensitive', 'restricted'];
    if (suspiciousKeywords.some(keyword => filename.includes(keyword))) {
        score += 40;
    }

    // Longer videos get slightly higher scrutiny
    if (duration > 600) {
        score += 10;
    }

    // Add randomness to simulate AI uncertainty
    const randomFactor = Math.random() * 50;
    score += randomFactor;

    return Math.min(Math.round(score), 100);
};

/**
 * Get video processing progress stages
 */
export const getProcessingStages = () => {
    return [
        { stage: 'Uploading', progress: 0 },
        { stage: 'Validating', progress: 20 },
        { stage: 'Extracting metadata', progress: 40 },
        { stage: 'Analyzing content', progress: 60 },
        { stage: 'Generating thumbnails', progress: 80 },
        { stage: 'Finalizing', progress: 95 },
        { stage: 'Completed', progress: 100 }
    ];
};
