import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

// Admin Authentication Middleware
export const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        const admin = await Admin.findById(decoded.id);

        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token or account deactivated'
            });
        }

        req.admin = admin;
        req.userId = admin._id;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// User Authentication Middleware
export const userAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'customer') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Customer privileges required.'
            });
        }

        const user = await User.findById(decoded.id);

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token or account deactivated'
            });
        }

        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Optional Authentication (for routes that work with or without auth)
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role === 'admin' || decoded.role === 'super_admin') {
            const admin = await Admin.findById(decoded.id);
            if (admin && admin.isActive) {
                req.admin = admin;
                req.userId = admin._id;
            }
        } else {
            const user = await User.findById(decoded.id);
            if (user && user.isActive) {
                req.user = user;
                req.userId = user._id;
            }
        }

        next();
    } catch (error) {
        next();
    }
};
