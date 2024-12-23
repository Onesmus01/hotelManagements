import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  firstName: {type: String,required: true},
  lastName: {type: String,required: true},
  email: {type: String,required: true},
  adultCount: {type: Number,required: true},
  childCount: {type: Number,required: true},
  checkIn: {type: Date,required: true},
  checkOut: {type: Date,required: true},
  totalCost: {type: Number,required: true},
  userId: {type: String,required: true}


})

// Hotel schema definition
const hotelSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    adultCount: { type: Number, required: true, default: 0 }, // Default value if not provided
    childCount: { type: Number, required: true, default: 0 }, // Default value if not provided
    facilities: { type: [String], required: true }, // Array of strings for facilities
    pricePerNight: { type: Number, required: true },
    starRating: { type: Number, required: true, default: 1 }, // Default star rating
    imageUrls: { type: [String], required: true }, // Array of strings for multiple images
    lastUpdated: { type: Date, required: true },
    bookings: [BookingSchema],

  },
  { timestamps: true }
);

// Add an index on userId and city for faster searching
hotelSchema.index({ userId: 1 });
hotelSchema.index({ city: 1 });

// Create the Hotel model
const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);

export default Hotel;
