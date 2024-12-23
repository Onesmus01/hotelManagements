import express from 'express';
import Hotel from '../models/hotelModel.js';
import verifyToken from '../middleware/auth.js';

const bookingRouter = express.Router();

bookingRouter.get('/mybookings', verifyToken, async (req, res) => {
    try {
        const hotels = await Hotel.find({
            'bookings.userId': req.userId,  // Directly filter hotels based on the userId in bookings array
        });

        const results = hotels.map((hotel) => {
            const userBookings = hotel.bookings.filter((booking) => booking.userId === req.userId);

            return {
                ...hotel.toObject(),
                bookings: userBookings,  
            };
        });

        res.status(200).send(results);
    } catch (error) {
        console.error('Error fetching bookings:', error);  
        res.status(500).json({ msg: "Unable to fetch bookings" });
    }
});

export default bookingRouter;
