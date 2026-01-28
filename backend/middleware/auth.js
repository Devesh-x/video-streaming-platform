import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify JWT token
export const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware to check user roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

// Middleware to check if user owns the resource
export const checkOwnership = (model) => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params.id;
            const resource = await model.findById(resourceId);

            if (!resource) {
                return res.status(404).json({ error: 'Resource not found' });
            }

            // Admins can access everything
            if (req.user.role === 'admin') {
                req.resource = resource;
                return next();
            }

            // Check if user owns the resource
            if (resource.userId.toString() !== req.userId.toString()) {
                return res.status(403).json({
                    error: 'Access denied. You do not own this resource.'
                });
            }

            req.resource = resource;
            next();
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    };
};
