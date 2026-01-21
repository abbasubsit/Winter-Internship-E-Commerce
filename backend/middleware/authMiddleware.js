import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1️⃣ Check if User is Logged In
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Bearer <token>
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user (without password)
            req.user = await User.findById(decoded.id).select('-password');

            return next(); // IMPORTANT: return
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    return res.status(401).json({ message: 'Not authorized, no token' });
};

// 2️⃣ Check if User is Seller
export const seller = (req, res, next) => {
    if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
        return next();
    }

    return res.status(401).json({ message: 'Not authorized as a seller' });
};

// 3️⃣ Check if User is Admin
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.status(401).json({ message: 'Not authorized as an admin' });
};
