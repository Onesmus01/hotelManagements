import express from 'express'
import {addImage ,upload} from '../controller/image.js';
import verifyToken from '../middleware/auth.js'

const imageRouter = express.Router()

imageRouter.post('/image',upload,addImage)


export default imageRouter;