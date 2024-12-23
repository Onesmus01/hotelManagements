import express from 'express';
import cloudinary from 'cloudinary';
import Hotel from '../models/hotelModel.js';
import multer from 'multer';
import dotenv from 'dotenv';
import { body,param, validationResult } from 'express-validator';
import verifyToken from '../middleware/auth.js';
import mongoose from 'mongoose'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY)

dotenv.config();

const HotelRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

HotelRouter.use(express.urlencoded({ extended: true }));

HotelRouter.post(
  '/my-hotels', verifyToken,
  // [
  //   body('name').notEmpty().withMessage('Name is required'),
  //   body('city').notEmpty().withMessage('City is required'),
  //   body('country').notEmpty().withMessage('Country is required'),
  //   body('description').notEmpty().withMessage('Description is required'),
  //   body('type').notEmpty().withMessage('Type is required'),
  //   body('pricePerNight').notEmpty().isNumeric().withMessage('Price per night is required'),
  //   body('facilities').notEmpty().isArray().withMessage('Facilities are required'),
  // ],
  upload.array('imageFiles', 6),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('Incoming Hotel Data:', req.body);
      console.log('Uploaded Files:', req.files);

      // Extract image files and form data
      const imageFiles = req.files;
      const newHotel = req.body;

      // Check if no files are uploaded
      if (!imageFiles || imageFiles.length === 0) {
        return res.status(400).json({ msg: 'No files uploaded' });
      }

      // Upload images to Cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        try {
          const b64 = Buffer.from(image.buffer).toString('base64');
          const dataURL = `data:${image.mimetype};base64,${b64}`;
          const response = await cloudinary.v2.uploader.upload(dataURL);
          return response.url; // Save URL of uploaded image
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          throw new Error('Cloudinary upload failed');
        }
      });

      const imageUrls = await Promise.all(uploadPromises);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId; 

      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).send(hotel)
    } catch (error) {
      console.error('Internal error:', error);
      res.status(500).json({ msg: 'Internal error', error: error.message });
    }
  }
);

HotelRouter.get('/:id',[param("id").notEmpty().withMessage("HotelId is required")], async (req, res) => {
  const errors = validationResult(req)
  const id = req.params.id.toString()


  // Validate that the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errors: 'Invalid Hotel ID' });
  }
  if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
  }


  try {
      const hotel = await Hotel.findById(id);  // Use the id to search for the hotel
      if (!hotel) {
          return res.status(404).json({ message: 'Hotel not found' });
      }
      res.json(hotel);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error fetching Hotels' });
  }
});

HotelRouter.get('/hotels/getHotel',verifyToken, async (req, res) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ msg: 'Error fetching hotels', error: error.message });
  }
});


HotelRouter.get("/:id",verifyToken, async (req, res) => {
    const id = req.params.id;

    // Log the incoming ID and userId for debugging
    console.log('Requested ID:', id);
    console.log('User ID:', req.userId);

    try {
        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid ID format" });
        }

        // Find the hotel by ID and userId
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId, // Ensure `userId` is set correctly
        });

        if (!hotel) {
            return res.status(404).json({ msg: "Hotel not found" });
        }

        res.json(hotel);
    } catch (error) {
        console.error('Error fetching hotel:', error.message);
        res.status(500).json({ msg: "Error fetching hotel", error: error.message });
    }
});

HotelRouter.put('/:hotelId', verifyToken, upload.array('imageFiles'), async (req, res) => {
  try {
    console.log('Hotel Data:', req.body);
    console.log('Uploaded Files:', req.files);

    const updatedHotel = req.body;
    updatedHotel.lastUpdated = new Date(); // Set lastUpdated to now

    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.hotelId, userId: req.userId },
      updatedHotel,
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ msg: 'Hotel not found' });
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const updatedImageUrls = await uploadImages(req.files); // Upload images
      hotel.imageUrls = [...updatedImageUrls, ...(hotel.imageUrls || [])];
    }

    await hotel.save();
    res.json({ msg: 'Hotel updated successfully', hotel });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({
      msg: 'Something went wrong while updating the hotel',
      error: error.message,
    });
  }
});

HotelRouter.post('/:hotelId/bookings', verifyToken, async (req, res) => {
  try {
    const paymentIntentId = req.body.paymentIntentId;
    const paymentIntent = await Stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(500).json({ msg: "Payment intent not found" });
    }

    if (paymentIntent.metadata.hotelId !== req.params.hotelId || paymentIntent.metadata.userId !== req.userId) {
      return res.status(500).json({ msg: "Payment intent mismatch" });
    }

    if (paymentIntent.status !== "succeeded") {
      return res.status(500).json({ msg: `Payment intent not succeeded: ${paymentIntent.status}` });
    }

    const newBooking = {
      ...req.body,
      userId: req.userId
    };

    const hotel = await Hotel.findByIdAndUpdate(
      { _id: req.params.hotelId },
      { $push: { bookings: newBooking } }
    );

    if (!hotel) {
      return res.status(500).json({ msg: "Hotel not found" });
    }

    await hotel.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
});


HotelRouter.post('/:hotelId/bookings/payment-intend',verifyToken,async(req,res)=> {

  const {numberOfNights} = req.body
  const hotelId = req.params.hotelId;

  const hotel = await Hotel.findById(hotelId)
  if(!hotel) {
    return res.statuss(400).json({message: "Hotel not found"})
  }

  const totalCost = hotel.pricePerNight * numberOfNights
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCost,
    currency: "gbp",
    metaData: {
      hotelId,
      userId,
      userId: req.userId
    },
})
  if(!paymentIntent.client_secret) {
    return res.status(400).json({message: "Error creating payment intent"})
  }

  const response = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalCost,
  }

  res.send(response)

})

HotelRouter.get('/getAll/all', async (req, res) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated"); 
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" }); 
  }
});

export default HotelRouter;
