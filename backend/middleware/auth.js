import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to verify token
const verifyToken = async (req, res, next) => {
    try {
        // Ensure JWT_SECRET is defined in environment variables
        if (!process.env.JWT_SECRET) {
            throw new Error('Missing JWT_SECRET environment variable');
        }

        // Retrieve the token from cookies
        const token = req.cookies["auth_token"];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, token not provided' });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the userId to the request object for further use in the route handlers
        req.userId = decoded.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Token verification error:', error);

        // Handle specific error for token expiration
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized, token expired' });
        }

        // Handle other verification errors (e.g., invalid token)
        res.status(401).json({ message: 'Unauthorized, invalid token' });
    }
};

export default verifyToken;
