import mongoose from 'mongoose';

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
  },
  { timestamps: true }
);

// Add an index on userId and city for faster searching
hotelSchema.index({ userId: 1 });
hotelSchema.index({ city: 1 });

// Create the Hotel model
const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);

export default Hotel;
