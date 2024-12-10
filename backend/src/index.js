import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import router from '../routes/users.js';
import HotelRouter from '../routes/myHotels.js'; 
import connectDb from '../config/db.js';
import connectAdminDb from '../config/adminDb.js';
import helmet from 'helmet';
import imageRouter from '../routes/imageRoute.js'
dotenv.config(); // Load environment variables

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(helmet()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/user', router);
app.use('/api/hotel', HotelRouter);
app.use('/api/image',imageRouter)

const startServer = async () => {
  try {
    await connectDb();
    console.log('Connected to main database');
    await connectAdminDb();
    console.log('Connected to admin database');
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
    console.log(process.env.CLOUDINARY_CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);

  } catch (err) {
    console.error('Database connection error:', err);
  }
};

startServer();

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});