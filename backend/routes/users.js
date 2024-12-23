import express from 'express'
import { registerUser,login,validateToken,logout } from '../controller/user.js';
import verifyToken from '../middleware/auth.js'
import User from '../models/user.js'

const router = express.Router()

router.get('/me', verifyToken, async (req, res, next) => {
    const userId = req.userId;

    try {
        // Check if userId is present
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not provided" });
        }

        // Fetch user details excluding the password field
        const user = await User.findById(userId).select("-password");

        if (!user) {
            // User not found
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Successful response
        res.status(200).json({ success: true, data: { user } });
    } catch (error) {
        // Log error for debugging
        console.error("Error fetching user:", error);

        // Pass error to the centralized error handler
        next(error);
    }
});

router.post('/signup',verifyToken,registerUser)
router.post('/signin',login)
router.get('/validate-token',verifyToken,validateToken)
router.post('/logout',logout)



export default router;