import express from 'express'
import { registerUser,login,validateToken,logout } from '../controller/user.js';
import verifyToken from '../middleware/auth.js'

const router = express.Router()

router.post('/signup',verifyToken,registerUser)
router.post('/signin',verifyToken,login)
router.get('/validate-token',verifyToken,validateToken)
router.post('/logout',logout)



export default router;