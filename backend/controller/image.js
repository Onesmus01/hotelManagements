import { v2 as cloudinary } from 'cloudinary';
import Image from '../models/images.js';
import multer from 'multer';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage configuration (memory storage preferred for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage, 
}).fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
]);

// Helper function to upload a single file to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        Readable.from(buffer).pipe(uploadStream);
    });
};

// Controller function for adding images
const addImage = async (req, res) => {
    try {
        const files = [
            req.files?.image1?.[0],
            req.files?.image2?.[0],
            req.files?.image3?.[0],
            req.files?.image4?.[0],
        ].filter(Boolean);

        if (files.length === 0) {
            return res.status(400).json({ msg: "Please upload at least one image." });
        }

        // Upload images to Cloudinary
        const imageUrl = await Promise.all(
            files.map(async (file) => {
                const buffer = file.buffer;
                return await uploadToCloudinary(buffer);
            })
        );

        // Save image URLs to the database
        const newImage = new Image({ images: imageUrl });
        await newImage.save();

        // Send success response
        res.status(200).json({ message: 'Images uploaded successfully', images: imageUrl });
    } catch (error) {
        console.error('Error uploading images:', error.message);
        res.status(500).json({ error: 'Image upload failed' });
    }
};

export { addImage, upload };
