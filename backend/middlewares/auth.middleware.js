const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({message: 'Invalid token'});
        } else if (error.name === 'TokenExpiredError') {
            res.status(401).json({message: 'Token expired'});
        } else {
            res.status(500).json({message: 'Internal server error'});
        }
    }
}

module.exports = authMiddleware;